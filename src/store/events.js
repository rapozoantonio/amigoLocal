import { computed, ref } from "vue";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { firestore } from "@/plugins/firebase";

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const eventCache = new Map();

// Date formatters
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const yearFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const useEventsStore = defineStore("events", () => {
  // State
  const events = ref(null);
  const event = ref(null);
  const loadingStates = ref(new Map());
  const selectedGenres = ref(null);
  const selectedCategories = ref(null);
  const selectedDateRange = ref(null);

  // Loading state management
  const setLoading = (operation, state) => {
    loadingStates.value.set(operation, state);
  };

  const isLoading = computed(
    () => (operation) => loadingStates.value.get(operation) ?? false
  );

  // Computed properties
  const filteredEvents = computed(() => {
    if (!events.value) return null;
    let eventsToReturn = events.value;
    if (selectedGenres.value && selectedGenres.value.length > 0) {
      eventsToReturn = eventsToReturn.filter((e) => {
        return e.genres.some((g) => selectedGenres.value.includes(g));
      });
    }
    if (selectedCategories.value && selectedCategories.value.length > 0) {
      eventsToReturn = eventsToReturn.filter((e) => {
        if (e.categories)
          return e.categories.some((g) => selectedCategories.value.includes(g));
      });
    }

    if (selectedDateRange.value && selectedDateRange.value.length > 0) {
      const parsedDate = selectedDateRange.value.map((date) => new Date(date)); // Parse dates

      eventsToReturn = eventsToReturn.filter((e) => {
        const eventStartDate = new Date(e.startDate);

        return (
          eventStartDate >= parsedDate[0] &&
          eventStartDate <= parsedDate[parsedDate.length - 1] // Compare dates
        );
      });
    }

    return eventsToReturn;
  });

  const featuredEvents = computed(() => {
    if (!events.value) return [];

    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date().toISOString().split("T")[0];

    const result = {
      featured: [],
      regular: [],
    };

    // Filter future events first using startDate
    const futureEvents = filteredEvents.value.filter((event) => {
      return event.startDate >= today;
    });

    // Sort all events by followers first
    futureEvents.sort((a, b) => b.followers - a.followers);

    // Then separate into featured and regular
    futureEvents.forEach((event) => {
      event.featured ? result.featured.push(event) : result.regular.push(event);
    });

    // Return only first 6 events
    return [...result.featured, ...result.regular].slice(0, 6);
  });

  const getTotalUpcomingEvents = computed(() => {
    if (!events.value || !events.value.length) return 0;
    return events.value.length;
  });

  const getCountByGenre = computed(() => {
    return (genre) => {
      if (!events.value) return 0;
      let eventsToReturn = events.value;
      if (selectedCategories.value && selectedCategories.value.length > 0) {
        eventsToReturn = eventsToReturn.filter((e) => {
          if (e.categories)
            return e.categories.some((g) =>
              selectedCategories.value.includes(g)
            );
        });
      }
      if (selectedDateRange.value && selectedDateRange.value.length > 0) {
        const parsedDate = selectedDateRange.value.map(
          (date) => new Date(date)
        ); // Parse dates

        eventsToReturn = eventsToReturn.filter((e) => {
          const eventStartDate = new Date(e.startDate);

          return (
            eventStartDate >= parsedDate[0] &&
            eventStartDate <= parsedDate[parsedDate.length - 1] // Compare dates
          );
        });
      }

      return eventsToReturn.filter((e) => e.genres?.includes(genre)).length;
    };
  });

  const getCountByCategorie = computed(() => {
    return (categorie) => {
      if (!events.value) return 0;
      let eventsToReturn = events.value;

      if (selectedGenres.value && selectedGenres.value.length > 0) {
        eventsToReturn = eventsToReturn.filter((e) => {
          return (
            e.genres && e.genres.some((g) => selectedGenres.value.includes(g))
          );
        });
      }

      if (selectedDateRange.value && selectedDateRange.value.length > 0) {
        const parsedDate = selectedDateRange.value.map(
          (date) => new Date(date)
        ); // Parse dates

        eventsToReturn = eventsToReturn.filter((e) => {
          const eventStartDate = new Date(e.startDate);

          return (
            eventStartDate >= parsedDate[0] &&
            eventStartDate <= parsedDate[parsedDate.length - 1] // Compare dates
          );
        });
      }

      return eventsToReturn.filter((e) => {
        return e.categories && e.categories.includes(categorie);
      }).length;
    };
  });

  const formatEventDate = (dateString, currentYear) => {
    const date = new Date(dateString);
    const formatter =
      date.getFullYear() === currentYear ? dateFormatter : yearFormatter;
    return formatter.format(date).toUpperCase();
  };

  // In your events store
  const nextEvents = computed(() => {
    if (!filteredEvents.value) return null;

    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split("T")[0];

    // Filter for upcoming events first
    const upcomingEvents = filteredEvents.value.filter(
      (event) => event.startDate >= today
    );

    // Then group them by date
    return upcomingEvents.reduce((acc, event) => {
      const date = formatEventDate(event.startDate, currentYear);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  });

  const eventsDateList = computed(() => (eventsList) => {
    if (!eventsList) return null;

    const currentYear = new Date().getFullYear();
    return eventsList.reduce((acc, event) => {
      const date = formatEventDate(event.startDate, currentYear);

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  });

  // Query helpers
  // Correct syntax for array queries in Firestore:
  // 1. array-contains - for exact match of one element
  const buildQueries = (config) => {
    const queries = [];

    // Location queries first (as per our index)
    if (config.country) {
      queries.push(where("location.country", "==", config.country));
    }

    if (config.region) {
      queries.push(where("location.region.id", "==", config.region));
    }

    // Categories query using array-contains
    if (config.categories?.length) {
      console.log(config.categories[0]);
      // Per docs: array-contains matches single element in array
      queries.push(where("categories", "array-contains", config.categories[0]));
    }

    // Date filter last
    const today = new Date().toISOString().split("T")[0];
    queries.push(where("startDate", ">=", today));

    return queries;
  };
  
  const executeQuery = async (queries) => {
    const q = query(collection(firestore, "events"), ...queries);
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => d.data())
      .sort((a, b) => b.startDate.localeCompare(a.startDate)); 
  };

  // Main query function
  const getEvents = async (queryConfig) => {
    const operationId = "getEvents";
    setLoading(operationId, true);

    try {
      const cacheKey = JSON.stringify(queryConfig);
      const cached = eventCache.get(cacheKey);

      if (cached?.timestamp > Date.now() - CACHE_DURATION) {
        events.value = cached.data;
        return { ok: true, data: { events: cached.data } };
      }

      const queries = buildQueries(queryConfig);
      const eventsData = await executeQuery(queries);

      eventCache.set(cacheKey, {
        data: eventsData,
        timestamp: Date.now(),
      });

      events.value = eventsData;
      return { ok: true, data: { events: eventsData } };
    } catch (error) {
      console.error("Error fetching events:", error);
      notifyError(error);
      return { ok: false, error };
    } finally {
      setLoading(operationId, false);
    }
  };

  const getUpcomingEventsFilteredByDateAndCategories = computed(() => {
    if (!events.value || !events.value.length) return 0;
    let eventsToReturn = events.value;
    if (selectedCategories.value && selectedCategories.value.length > 0) {
      eventsToReturn = eventsToReturn.filter((e) => {
        if (e.categories)
          return e.categories.some((g) => selectedCategories.value.includes(g));
      });
    }

    if (selectedDateRange.value && selectedDateRange.value.length > 0) {
      const parsedDate = selectedDateRange.value.map((date) => new Date(date)); // Parse dates

      eventsToReturn = eventsToReturn.filter((e) => {
        const eventStartDate = new Date(e.startDate);

        return (
          eventStartDate >= parsedDate[0] &&
          eventStartDate <= parsedDate[parsedDate.length - 1] // Compare dates
        );
      });
    }
    return eventsToReturn.length;
  });
  const getUpcomingEventsFilteredByDateAndGenre = computed(() => {
    if (!events.value || !events.value.length) return 0;
    let eventsToReturn = events.value;
    if (selectedGenres.value && selectedGenres.value.length > 0) {
      eventsToReturn = eventsToReturn.filter((e) => {
        return e.genres.some((g) => selectedGenres.value.includes(g));
      });
    }

    if (selectedDateRange.value && selectedDateRange.value.length > 0) {
      const parsedDate = selectedDateRange.value.map((date) => new Date(date)); // Parse dates

      eventsToReturn = eventsToReturn.filter((e) => {
        const eventStartDate = new Date(e.startDate);

        return (
          eventStartDate >= parsedDate[0] &&
          eventStartDate <= parsedDate[parsedDate.length - 1] // Compare dates
        );
      });
    }
    return eventsToReturn.length;
  });
  const getUpcomingEventsFilteredByGenreAndCategories = computed(() => {
    if (!events.value || !events.value.length) return 0;
    let eventsToReturn = events.value;
    if (selectedGenres.value && selectedGenres.value.length > 0) {
      eventsToReturn = eventsToReturn.filter((e) => {
        return e.genres.some((g) => selectedGenres.value.includes(g));
      });
    }

    if (selectedCategories.value && selectedCategories.value.length > 0) {
      eventsToReturn = eventsToReturn.filter((e) => {
        if (e.categories)
          return e.categories.some((g) => selectedCategories.value.includes(g));
      });
    }
    return eventsToReturn.length;
  });

  const getFilteredByGenreUpcomingEvents = (filtersParameter) => {
    if (
      filteredEvents.value &&
      filteredEvents.value.length &&
      filtersParameter.length
    ) {
      let eventsFiltered = [];

      eventsFiltered = filteredEvents.value.filter((e) => {
        return e.genres.some((g) => filtersParameter.includes(g));
      });
      return eventsFiltered.length;
    }
  };

  const getFilteredByCategoriesUpcomingEvents = (filtersParameter) => {
    if (
      filteredEvents.value &&
      filteredEvents.value.length &&
      filtersParameter.length
    ) {
      let eventsFiltered = [];
      eventsFiltered = filteredEvents.value.filter((e) => {
        // Ensure e.categories is not null or undefined before calling .some()
        return (
          e.categories && e.categories.some((g) => filtersParameter.includes(g))
        );
      });
      return eventsFiltered.length;
    }
    return 0; // Return 0 if the initial conditions are not met
  };

  const getFilteredByDatesUpcomingEvents = (filtersParameter) => {
    // Check if filteredEvents and filtersParameter are valid

    if (
      filteredEvents.value &&
      filteredEvents.value.length > 0 &&
      filtersParameter &&
      filtersParameter.length > 0
    ) {
      // Parse the date range from filtersParameter
      const parsedDate = filtersParameter.map((date) => new Date(date));

      // Filter events within the date range
      let eventsFiltered = [];

      eventsFiltered = filteredEvents.value.filter((e) => {
        const eventStartDate = new Date(e.startDate);

        return (
          eventStartDate >= parsedDate[0] &&
          eventStartDate <= parsedDate[parsedDate.length - 1]
        );
      });

      return eventsFiltered.length; // Return the number of filtered events
    }

    // Return 0 if conditions are not met
    return 0;
  };

  // Specific query methods
  const getEventsByCategories = (country, region, categories) =>
    getEvents({ country, region, categories });

  const getEventsByRegion = (country, region) => getEvents({ country, region });

  const getEventsByPromoterId = (promoterId) => getEvents({ promoterId });

  const getEventsByProducerId = (producerId) => getEvents({ producerId });

  const getEventsByLocationId = (locationId) => getEvents({ locationId });

  // Single event query
  async function getEventById(id) {
    const operationId = "getEventById";
    setLoading(operationId, true);

    try {
      const cacheKey = `event-${id}`;
      const cached = eventCache.get(cacheKey);

      if (cached?.timestamp > Date.now() - CACHE_DURATION) {
        event.value = cached.data;
        return { ok: true, data: cached.data };
      }

      const documentSnapshot = await getDoc(doc(firestore, "events/" + id));
      if (!documentSnapshot.empty) {
        const eventData = documentSnapshot.data();

        eventCache.set(cacheKey, {
          data: eventData,
          timestamp: Date.now(),
        });

        event.value = eventData;
        return { ok: true, data: eventData };
      }

      return { ok: false, error: "Event not found" };
    } catch (error) {
      console.error("Error fetching event:", error);
      notifyError(error);
      return { ok: false, error };
    } finally {
      setLoading(operationId, false);
    }
  }

  // Count documents helper
  async function countDocuments(col, condition) {
    const operationId = "countDocuments";
    setLoading(operationId, true);

    try {
      const cacheKey = `count-${col}-${JSON.stringify(condition)}`;
      const cached = eventCache.get(cacheKey);

      if (cached?.timestamp > Date.now() - CACHE_DURATION) {
        return cached.data;
      }

      const coll = collection(firestore, col);
      const q = query(coll, where(...condition));
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;

      eventCache.set(cacheKey, {
        data: count,
        timestamp: Date.now(),
      });

      return count;
    } catch (error) {
      console.error("Error counting documents:", error);
      notifyError(error);
      return 0;
    } finally {
      setLoading(operationId, false);
    }
  }

  function notifyError(error) {
    Swal.fire({
      title: error.code,
      text: error.message,
      icon: "error",
    });
  }

  return {
    getEventsByRegion,
    getEventsByCategories,
    featuredEvents,
    events: filteredEvents,
    nextEvents,
    getEventById,
    event,
    loading: isLoading,
    selectedGenres,
    selectedCategories,
    selectedDateRange,
    getCountByGenre,
    getCountByCategorie,
    getTotalUpcomingEvents,
    getUpcomingEventsFilteredByDateAndCategories,
    getUpcomingEventsFilteredByDateAndGenre,
    getUpcomingEventsFilteredByGenreAndCategories,
    getFilteredByGenreUpcomingEvents,
    getFilteredByCategoriesUpcomingEvents,
    getFilteredByDatesUpcomingEvents,
    getEventsByPromoterId,
    getEventsByProducerId,
    eventsDateList,
    countDocuments,
  };
});
