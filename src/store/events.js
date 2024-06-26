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

export const useEventsStore = defineStore("events", () => {
  const events = ref(null);
  const event = ref(null);
  const loading = ref(false);
  const selectedGenres = ref(null);

  const filteredEvents = computed(() => {
    if (!events.value) return null;

    if (selectedGenres.value && selectedGenres.value.length > 0) {
      return events.value.filter((e) => {
        return e.genres.some((g) => selectedGenres.value.includes(g));
      });
    }
    return events.value;
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
      return events.value.filter((e) => e.genres.includes(genre)).length;
    };
  });

  const nextEvents = computed(() => {
    console.log("events", events.value);
    if (events.value) {
      events.value.sort((a, b) => {
        return a.startDate.localeCompare(b.startDate);
      });
      console.log(events.value.map((e) => e.startDate));

      const nextEventsResult = filteredEvents.value.reduce(
        (nextEvents, event) => {
          // Transform startDate to short date format
          const options = { weekday: "short", day: "numeric", month: "short" };
          const date = new Intl.DateTimeFormat("en-US", options)
            .format(new Date(event.startDate))
            .toUpperCase();

          if (nextEvents[date]) {
            nextEvents[date].push(event);
            return nextEvents;
          }
          nextEvents[date] = [event];

          return nextEvents;
        },
        {}
      );

      return nextEventsResult;
    }

    return null;
  });

  const eventsDateList = computed(() => {
    return (eventsList) => {
      console.log({ eventsList });
      return !eventsList
        ? null
        : eventsList.reduce((nextEvents, event) => {
            // Transform startDate to short date format
            const options = {
              weekday: "short",
              day: "numeric",
              month: "short",
            };
            const date = new Intl.DateTimeFormat("en-US", options)
              .format(new Date(event.startDate))
              .toUpperCase();

            if (nextEvents[date]) {
              nextEvents[date].push(event);
              return nextEvents;
            }
            nextEvents[date] = [event];
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

  async function getEventsByRegion(country, region) {
    loading.value = true;
    events.value = null;
    const queries = [];
    queries.push(where("location.country", "==", country));
    if (region) {
      queries.push(where("location.region.id", "==", region));
    }
    queries.push(
      where("startDate", ">=", new Date().toISOString().split("T")[0])
    );
    // queries.push(where("createdAt", "<", new Date()))

    try {
      const q = query(collection(firestore, "events"), ...queries);
      const querySnapshot = await getDocs(q);
      console.log({ querySnapshot });
      //   querySnapshot.forEach((document) => {
      //     console.log(document.data());
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
      console.log({ error });
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
      console.log({ querySnapshot });
      //   querySnapshot.forEach((document) => {
      //     console.log(document.data());
      //     events.value.push(document.data());
      //   });
      events.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: events.value,
      };
    } catch (error) {
      console.log({ error });
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
      console.log({ querySnapshot });
      //   querySnapshot.forEach((document) => {
      //     console.log(document.data());
      //     events.value.push(document.data());
      //   });
      events.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: events.value,
      };
    } catch (error) {
      console.log({ error });
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
      console.log({ querySnapshot });
      //   querySnapshot.forEach((document) => {
      //     console.log(document.data());
      //     events.value.push(document.data());
      //   });
      events.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: { events: events.value },
      };
    } catch (error) {
      console.log({ error });
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
        console.log("event", documentSnapshot.data());
      }
    } catch (error) {
      console.log({ error });
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

  // watch(() => event.value.startDate, (newValue) => {
  //     if (event.value.endDate < newValue) {
  //         event.value.endDate = newValue;
  //     }
  // });

  return {
    getEventsByRegion,
    featuredEvents,
    events: filteredEvents,
    nextEvents,
    getEventById,
    event,
    loading,
    selectedGenres,
    getCountByGenre,
    getEventsByPromoterId,
    getEventsByProducerId,
    getEventsByLocationId,
    eventsDateList,
    countDocuments,
  };
});
