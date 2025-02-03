import { computed, ref } from "vue";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { firestore } from "@/plugins/firebase";
import { useFirebaseStore } from "./firebase";
const firebaseStore = useFirebaseStore();
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
  // =========================
  // State
  // =========================
  const events = ref([]);
  const event = ref(null);
  const loadingStates = ref(new Map());
  const selectedGenres = ref([]);
  const selectedCategories = ref([]);
  const selectedDateRange = ref([]); // Expecting an array with two date strings [start, end]

  // =========================
  // Loading State Management
  // =========================
  const setLoading = (operation, state) => {
    loadingStates.value.set(operation, state);
  };

  const isLoading = computed(
    () => (operation) => loadingStates.value.get(operation) ?? false
  );

  // =========================
  // Computed Properties
  // =========================

  // Filter events based on selected genres, categories, and date range
  const filteredEvents = computed(() => {
    if (!events.value || !events.value.length) return [];
    let filtered = events.value;
    console.log({ filtered });

    // if (selectedGenres.value.length) {
    //   filtered = filtered.filter(
    //     (e) =>
    //       e.genres && e.genres.some((g) => selectedGenres.value.includes(g))
    //   );
    // }

    // if (selectedCategories.value.length) {
    //   filtered = filtered.filter(
    //     (e) =>
    //       e.categories &&
    //       e.categories.some((c) => selectedCategories.value.includes(c))
    //   );
    // }

    // if (selectedDateRange.value.length === 2) {
    //   const [startDate, endDate] = selectedDateRange.value.map(
    //     (d) => new Date(d)
    //   );
    //   filtered = filtered.filter((e) => {
    //     const eventDate = new Date(e.startDate);
    //     return eventDate >= startDate && eventDate <= endDate;
    //   });
    // }

    return filtered;
  });

  // Featured events: pick upcoming events, sort by followers, then split into featured and regular
  const featuredEvents = computed(() => {
    if (!filteredEvents.value.length) return [];

    const today = new Date().toISOString().split("T")[0];
    const result = { featured: [], regular: [] };

    // Select only upcoming events
    const futureEvents = filteredEvents.value.filter(
      (event) => event.startDate >= today
    );

    // Sort by followers descending (ensure followers exist)
    futureEvents.sort((a, b) => (b.followers || 0) - (a.followers || 0));

    futureEvents.forEach((event) => {
      if (event.featured) {
        result.featured.push(event);
      } else {
        result.regular.push(event);
      }
    });

    // Return first 6 events combining featured and regular
    return [...result.featured, ...result.regular].slice(0, 6);
  });

  // Total upcoming events count
  const getTotalUpcomingEvents = computed(() =>
    events.value ? events.value.length : 0
  );

  // Count events by a specific genre with additional filters applied
  const getCountByGenre = computed(() => {
    return (genre) => {
      if (!events.value.length) return 0;
      let filtered = events.value;

      if (selectedCategories.value.length) {
        filtered = filtered.filter(
          (e) =>
            e.categories &&
            e.categories.some((c) => selectedCategories.value.includes(c))
        );
      }
      if (selectedDateRange.value.length === 2) {
        const [startDate, endDate] = selectedDateRange.value.map(
          (d) => new Date(d)
        );
        filtered = filtered.filter((e) => {
          const eventDate = new Date(e.startDate);
          return eventDate >= startDate && eventDate <= endDate;
        });
      }
      return filtered.filter((e) => e.genres && e.genres.includes(genre))
        .length;
    };
  });

  // Count events by a specific category with additional filters applied
  const getCountByCategorie = computed(() => {
    return (categorie) => {
      if (!events.value.length) return 0;
      let filtered = events.value;

      if (selectedGenres.value.length) {
        filtered = filtered.filter(
          (e) =>
            e.genres && e.genres.some((g) => selectedGenres.value.includes(g))
        );
      }
      if (selectedDateRange.value.length === 2) {
        const [startDate, endDate] = selectedDateRange.value.map(
          (d) => new Date(d)
        );
        filtered = filtered.filter((e) => {
          const eventDate = new Date(e.startDate);
          return eventDate >= startDate && eventDate <= endDate;
        });
      }
      return filtered.filter(
        (e) => e.categories && e.categories.includes(categorie)
      ).length;
    };
  });

  // Helper to format event dates based on whether the event is in the current year
  const formatEventDate = (dateString, currentYear) => {
    const date = new Date(dateString);
    const formatter =
      date.getFullYear() === currentYear ? dateFormatter : yearFormatter;
    return formatter.format(date).toUpperCase();
  };

  // Group upcoming events by formatted date (e.g. "MON 01 JAN")
  const nextEvents = computed(() => {
    if (!filteredEvents.value.length) return {};
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split("T")[0];

    // const upcoming = filteredEvents.value.filter(
    //   (event) => event.startDate >= today
    // );

    return filteredEvents.value.reduce((acc, event) => {
      const dateKey = formatEventDate(event.startDate, currentYear);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});
  });

  // Group a list of events by their formatted date
  const eventsDateList = computed(() => (eventsList) => {
    if (!eventsList || !eventsList.length) return {};
    const currentYear = new Date().getFullYear();
    return eventsList.reduce((acc, event) => {
      const dateKey = formatEventDate(event.startDate, currentYear);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});
  });

  // =========================
  // Firestore Query Helpers & Pagination
  // =========================
  const pageSize = ref(10);
  const lastDocument = ref(null);

  const buildQueries = (config = {}) => {
    const queries = [];
    console.log("Building queries with config:", config);

    // Location-based filters
    if (config.country) {
      queries.push(where("country", "==", config.country));
    }
    if (config.region) {
      queries.push(where("region.id", "==", config.region));
    }
    // Promoter filter
    if (config.promoterId) {
      queries.push(where("promoter.id", "==", config.promoterId));
    }
    // Producer filter
    if (config.producerId) {
      queries.push(where("producer.id", "==", config.producerId));
    }
    // Location ID filter
    if (config.locationId) {
      queries.push(where("location.id", "==", config.locationId));
    }
    // Categories filter (using array-contains-any)
    if (
      config.categories &&
      Array.isArray(config.categories) &&
      config.categories.length
    ) {
      queries.push(
        where("categories", "array-contains-any", config.categories)
      );
    }

    // Date filter: only upcoming events (from today onward)
    const today = new Date().toISOString().split("T")[0];
    queries.push(where("startDate", ">=", today));

    // Ordering & Pagination
    queries.push(orderBy("startDate", "asc"));
    queries.push(limit(pageSize.value));

    console.log("Final queries:", queries);
    return queries;
  };

  const executeQuery = async (queries, isLoadMore = false) => {
    // Initialize query from the "events" collection with the provided filters
    let q = query(collection(firestore, "events"), ...queries);
    console.log("Executing Firestore query");

    // Apply pagination if loading more
    if (isLoadMore && lastDocument.value) {
      q = query(q, startAfter(lastDocument.value));
    }

    const snapshot = await getDocs(q);
    lastDocument.value = snapshot.docs[snapshot.docs.length - 1] || null;

    const results = snapshot.docs.map((d) => d.data());
    console.log("Query returned:", results.length, "documents");

    return {
      data: results,
      hasMore: snapshot.docs.length === pageSize.value,
    };
  };

  const lastEventDocument = ref(null);
  const totalDocsCount = ref(null);
  const nextPage = ref(null);
  // =========================
  // Main Query Methods
  // =========================
  async function fetchEvents(filters) {
    const operationId = "getEvents";
    setLoading(operationId, true);
    try {
      const { data, ok, lastDoc, next, totalCount } =
        await firebaseStore.getCollection({
          collection: "events",
          query: filters,
          orderBy: "startDate",
        });
      console.log("fetch events after getCollection", data, ok, next);
      if (ok) {
        console.log("ok", data);
        events.value = data;
        lastEventDocument.value = lastDoc;
        totalDocsCount.value = totalCount;
        nextPage.value = next;
        return { ok, data, next, lastDoc, totalCount };
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(operationId, false);
    }
  }

  const hasNextPage = computed(() => {
    if (nextPage.value) {
      return true;
    }
    return false;
  });

  async function fetchNextPage() {
    console.log("fetchNextPage");
    try {
      const { data, ok, lastDoc, next } = await nextPage.value();
      console.log("fetch nextpage after getCollection", data, ok, next);

      if (ok) {
        console.log("fetchNextPage OK");
        events.value.push(...data);
        lastEventDocument.value = lastDoc;
        console.log({ next });
        nextPage.value = next;
        return { ok, data, next, lastDoc };
      }
    } catch (error) {
      console.log({ error });
    }
  }

  // Fetch events based on a query configuration
  const getEvents = async (queryConfig = {}) => {
    const operationId = "getEvents";
    setLoading(operationId, true);
    try {
      // Reset pagination on a new query
      lastDocument.value = null;
      const queries = buildQueries(queryConfig);
      const { data: eventsData, hasMore } = await executeQuery(queries);
      events.value = eventsData;
      return { ok: true, data: { events: eventsData }, hasMore };
    } catch (error) {
      console.error("Error fetching events:", error);
      notifyError(error);
      return { ok: false, error };
    } finally {
      setLoading(operationId, false);
    }
  };

  // Load more events using pagination
  const loadMoreEvents = async (queryConfig = {}) => {
    if (!lastDocument.value) return { ok: false };
    try {
      const queries = buildQueries(queryConfig);
      const { data: moreEvents, hasMore } = await executeQuery(queries, true);
      events.value = [...events.value, ...moreEvents];
      return { ok: true, hasMore };
    } catch (error) {
      console.error("Error loading more events:", error);
      notifyError(error);
      return { ok: false, error };
    }
  };

  const resetPagination = () => {
    lastDocument.value = null;
    events.value = null;
    nextEvents.value = null;
  };

  // =========================
  // Additional Computed Filters
  // =========================

  const getUpcomingEventsFilteredByDateAndCategories = computed(() => {
    if (!events.value.length) return 0;
    let filtered = events.value;
    if (selectedCategories.value.length) {
      filtered = filtered.filter(
        (e) =>
          e.categories &&
          e.categories.some((c) => selectedCategories.value.includes(c))
      );
    }
    if (selectedDateRange.value.length === 2) {
      const [startDate, endDate] = selectedDateRange.value.map(
        (d) => new Date(d)
      );
      filtered = filtered.filter((e) => {
        const eventDate = new Date(e.startDate);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }
    return filtered.length;
  });

  const getUpcomingEventsFilteredByDateAndGenre = computed(() => {
    if (!events.value.length) return 0;
    let filtered = events.value;
    if (selectedGenres.value.length) {
      filtered = filtered.filter(
        (e) =>
          e.genres && e.genres.some((g) => selectedGenres.value.includes(g))
      );
    }
    if (selectedDateRange.value.length === 2) {
      const [startDate, endDate] = selectedDateRange.value.map(
        (d) => new Date(d)
      );
      filtered = filtered.filter((e) => {
        const eventDate = new Date(e.startDate);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }
    return filtered.length;
  });

  const getUpcomingEventsFilteredByGenreAndCategories = computed(() => {
    if (!events.value.length) return 0;
    let filtered = events.value;
    if (selectedGenres.value.length) {
      filtered = filtered.filter(
        (e) =>
          e.genres && e.genres.some((g) => selectedGenres.value.includes(g))
      );
    }
    if (selectedCategories.value.length) {
      filtered = filtered.filter(
        (e) =>
          e.categories &&
          e.categories.some((c) => selectedCategories.value.includes(c))
      );
    }
    return filtered.length;
  });

  // Additional filtering helpers using the filtered events
  const getFilteredByGenreUpcomingEvents = (filtersParameter) => {
    if (filteredEvents.value.length && filtersParameter.length) {
      const eventsFiltered = filteredEvents.value.filter(
        (e) => e.genres && e.genres.some((g) => filtersParameter.includes(g))
      );
      return eventsFiltered.length;
    }
    return 0;
  };

  const getFilteredByCategoriesUpcomingEvents = (filtersParameter) => {
    if (filteredEvents.value.length && filtersParameter.length) {
      const eventsFiltered = filteredEvents.value.filter(
        (e) =>
          e.categories && e.categories.some((c) => filtersParameter.includes(c))
      );
      return eventsFiltered.length;
    }
    return 0;
  };

  const getFilteredByDatesUpcomingEvents = (filtersParameter) => {
    if (
      filteredEvents.value.length &&
      filtersParameter &&
      filtersParameter.length === 2
    ) {
      const [startDate, endDate] = filtersParameter.map((d) => new Date(d));
      const eventsFiltered = filteredEvents.value.filter((e) => {
        const eventDate = new Date(e.startDate);
        return eventDate >= startDate && eventDate <= endDate;
      });
      return eventsFiltered.length;
    }
    return 0;
  };

  // =========================
  // Specific Query Methods
  // =========================

  const getEventsByCategories = (country, region, categories) =>
    getEvents({ country, region, categories });
  const getEventsByRegion = (country, region) =>
    fetchEvents({ country, "region.id": region });
  const getEventsByPromoterId = (promoterId) =>
    fetchEvents({ "promoter.id": promoterId });
  // const getEventsByPromoterId = (promoterId) => getEvents({ promoterId });
  const getEventsByProducerId = (producerId) => getEvents({ producerId });
  const getEventsByLocationId = (locationId) => getEvents({ locationId });

  // =========================
  // Single Event Query (with Caching)
  // =========================

  const getEventById = async (id) => {
    const operationId = "getEventById";
    setLoading(operationId, true);
    try {
      const cacheKey = `event-${id}`;
      const cached = eventCache.get(cacheKey);
      if (cached && cached.timestamp > Date.now() - CACHE_DURATION) {
        event.value = cached.data;
        return { ok: true, data: cached.data };
      }

      const docRef = doc(firestore, "events", id);
      const documentSnapshot = await getDoc(docRef);
      if (documentSnapshot.exists()) {
        const eventData = documentSnapshot.data();
        eventCache.set(cacheKey, { data: eventData, timestamp: Date.now() });
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
  };

  // =========================
  // Count Documents Helper
  // =========================

  const countDocuments = async (col, condition) => {
    const operationId = "countDocuments";
    setLoading(operationId, true);
    try {
      const cacheKey = `count-${col}-${JSON.stringify(condition)}`;
      const cached = eventCache.get(cacheKey);
      if (cached && cached.timestamp > Date.now() - CACHE_DURATION) {
        return cached.data;
      }
      const collRef = collection(firestore, col);
      const q = query(collRef, where(...condition));
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      eventCache.set(cacheKey, { data: count, timestamp: Date.now() });
      return count;
    } catch (error) {
      console.error("Error counting documents:", error);
      notifyError(error);
      return 0;
    } finally {
      setLoading(operationId, false);
    }
  };

  // =========================
  // Error Notification
  // =========================

  function notifyError(error) {
    Swal.fire({
      title: error.code || "Error",
      text: error.message || "An error occurred",
      icon: "error",
    });
  }

  // =========================
  // Exposed Store API
  // =========================
  return {
    // Query methods
    getEvents,
    loadMoreEvents,
    resetPagination,
    getEventById,
    getEventsByRegion,
    getEventsByCategories,
    getEventsByPromoterId,
    getEventsByProducerId,
    getEventsByLocationId,
    countDocuments,
    totalDocsCount,
    // Filters and state
    events: filteredEvents,
    event,
    loading: isLoading,
    selectedGenres,
    selectedCategories,
    selectedDateRange,
    fetchEvents,
    fetchNextPage,
    hasNextPage,
    // Computed properties
    featuredEvents,
    nextEvents,
    eventsDateList,
    getTotalUpcomingEvents,
    getCountByGenre,
    getCountByCategorie,
    getUpcomingEventsFilteredByDateAndCategories,
    getUpcomingEventsFilteredByDateAndGenre,
    getUpcomingEventsFilteredByGenreAndCategories,
    getFilteredByGenreUpcomingEvents,
    getFilteredByCategoriesUpcomingEvents,
    getFilteredByDatesUpcomingEvents,
  };
});
