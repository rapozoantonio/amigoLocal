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
// import { ref, } from 'vue'
import { defineStore } from "pinia";
import Swal from "sweetalert2";

import { firestore } from "@/plugins/firebase";
import { parse } from "vue/compiler-sfc";

export const useEventsStore = defineStore("events", () => {
  const events = ref(null);
  const event = ref(null);
  const loading = ref(false);
  const selectedGenres = ref(null);
  const selectedCategories = ref(null);
  const selectedDateRange = ref(null);

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
    if (!events.value) {
      return null;
    }
    const featured = filteredEvents.value.filter((event) => event.featured);
    const moreFollowers = [
      ...filteredEvents.value.filter((e) => !event.featured),
    ].sort((a, b) => {
      return a.followers > b.followers;
    });
    return [...featured, ...moreFollowers];
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

      return eventsToReturn.filter((e) => e.genres.includes(genre)).length;
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

  const nextEvents = computed(() => {
    if (events.value) {
      // Sort events by startDate
      events.value.sort((a, b) => a.startDate.localeCompare(b.startDate));

      // Process and group events by date
      const nextEventsResult = filteredEvents.value.reduce(
        (nextEvents, event) => {
          const eventDate = new Date(event.startDate);
          const currentYear = new Date().getFullYear();

          // Adjust format options to include the year if it's different from the current year
          const options = {
            weekday: "short",
            day: "2-digit",
            month: "short",
          };

          if (eventDate.getFullYear() !== currentYear) {
            options.year = "numeric";
          }

          // Format date with or without the year as needed
          const date = new Intl.DateTimeFormat("pt-BR", options)
            .format(eventDate)
            .toUpperCase();

          // Add event to the grouped result
          if (nextEvents[date]) {
            nextEvents[date].push(event);
          } else {
            nextEvents[date] = [event];
          }

          return nextEvents;
        },
        {}
      );

      return nextEventsResult;
    }

    return null;
  });

  const getTotalUpcomingEvents = computed(() => {
    if (!events.value || !events.value.length) return 0;
    // Get yesterday's date at midnight to avoid time comparison issues
    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // yesterday.setHours(0, 0, 0, 0);

    // const upcomingEvents = events.value.filter(
    //   (event) => new Date(event.startDate) > yesterday
    // );

    // return upcomingEvents.length;
    return events.value.length;
  });

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

  const eventsDateList = computed(() => {
    return (eventsList) => {
      return !eventsList
        ? null
        : eventsList.reduce((nextEvents, event) => {
            const eventDate = new Date(event.startDate);
            const currentYear = new Date().getFullYear();

            // Include the year in the format if the event is not in the current year
            const options = {
              weekday: "short",
              day: "2-digit",
              month: "short",
              ...(eventDate.getFullYear() !== currentYear && {
                year: "numeric",
              }),
            };

            // Format the start date with or without the year as needed
            const date = new Intl.DateTimeFormat("pt-BR", options)
              .format(eventDate)
              .toUpperCase();

            if (nextEvents[date]) {
              nextEvents[date].push(event);
            } else {
              nextEvents[date] = [event];
            }

            return nextEvents;
          }, {});
    };
  });

  async function countDocuments(col, condition) {
    const coll = collection(firestore, col);
    const q = query(coll, where(...condition));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  async function getEventsByCategories(country, region, categories) {
    loading.value = true;
    events.value = null;
    const queries = [];
    queries.push(where("location.country", "==", country));
    if (region) {
      queries.push(where("location.region.id", "==", region));
    }
    if (categories) {
      queries.push(where("categories", "array-contains-any", categories));
    }
    // queries.push(
    //   where("startDate", ">=", new Date().toISOString().split("T")[0])
    // );
    // queries.push(where("createdAt", "<", new Date()))

    try {
      const q = query(collection(firestore, "events"), ...queries);
      const querySnapshot = await getDocs(q);

      //   querySnapshot.forEach((document) => {
      //
      //     events.value.push(document.data());
      //   });
      events.value = querySnapshot.docs.map((d) => d.data());
      events.value.sort((a, b) => {
        return a.startDate.localeCompare(b.startDate);
      });
      return {
        ok: true,
        data: { events: events.value },
      };
    } catch (error) {
      notifyError(error);
      return {
        ok: false,
        error,
      };
    } finally {
      loading.value = false;
    }
  }

  async function getEventsByRegion(country, region) {
    loading.value = true;
    events.value = null;
    const queries = [];
    queries.push(where("location.country", "==", country));
    if (region) {
      queries.push(where("location.region.id", "==", region));
    }

    try {
      const q = query(collection(firestore, "events"), ...queries);
      const querySnapshot = await getDocs(q);
      events.value = querySnapshot.docs.map((d) => d.data());
      events.value.sort((a, b) => {
        return a.startDate.localeCompare(b.startDate);
      });
      return {
        ok: true,
        data: { events: events.value },
      };
    } catch (error) {
      notifyError(error);
      return {
        ok: false,
        error,
      };
    } finally {
      loading.value = false;
    }
  }

  async function getEventsByPromoterId(promoterId) {
    loading.value = true;
    events.value = null;
    const queries = [];
    queries.push(where("promoter.id", "==", promoterId));
    // queries.push(
    //   where("startDate", ">=", new Date().toISOString().split("T")[0])
    // );
    // queries.push(where("createdAt", "<", new Date()))

    try {
      const q = query(collection(firestore, "events"), ...queries);
      const querySnapshot = await getDocs(q);

      //   querySnapshot.forEach((document) => {
      //
      //     events.value.push(document.data());
      //   });
      events.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: events.value,
      };
    } catch (error) {
      notifyError(error);
      return {
        ok: false,
        error,
      };
    } finally {
      loading.value = false;
    }
  }

  async function getEventsByProducerId(producerId) {
    loading.value = true;
    events.value = null;
    const queries = [];
    queries.push(where("producer.id", "==", producerId));

    // queries.push(
    //   where("startDate", ">=", new Date().toISOString().split("T")[0])
    // );
    // queries.push(where("createdAt", "<", new Date()))

    try {
      const q = query(collection(firestore, "events"), ...queries);
      const querySnapshot = await getDocs(q);

      //   querySnapshot.forEach((document) => {
      //
      //     events.value.push(document.data());
      //   });
      events.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: events.value,
      };
    } catch (error) {
      notifyError(error);
      return {
        ok: false,
        error,
      };
    } finally {
      loading.value = false;
    }
  }

  async function getEventsByLocationId(locationId) {
    loading.value = true;
    events.value = null;
    const queries = [];
    queries.push(where("location.id", "==", locationId));

    // queries.push(
    //   where("startDate", ">=", new Date().toISOString().split("T")[0])
    // );
    // queries.push(where("createdAt", "<", new Date()))

    try {
      const q = query(collection(firestore, "events"), ...queries);
      const querySnapshot = await getDocs(q);

      //   querySnapshot.forEach((document) => {
      //
      //     events.value.push(document.data());
      //   });
      events.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: { events: events.value },
      };
    } catch (error) {
      notifyError(error);
      return {
        ok: false,
        error,
      };
    } finally {
      loading.value = false;
    }
  }

  async function getEventById(id) {
    try {
      const documentSnapshot = await getDoc(doc(firestore, "events/" + id));
      if (!documentSnapshot.empty) {
        event.value = documentSnapshot.data();
      }
    } catch (error) {
      notifyError(error);
      return {
        ok: false,
        error,
      };
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
    loading,
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
    getEventsByLocationId,
    eventsDateList,
    countDocuments,
  };
});
