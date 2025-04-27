// Utilities
import { defineStore } from "pinia";
import { useFirebaseStore } from "@/core/store/firebase";
import Swal from "sweetalert2";
import { ref } from "vue";

export const useEventListStore = defineStore("eventList", () => {
  const firebaseStore = useFirebaseStore();

  const guests = ref([]);
  const events = ref([]);

  // CREATE EVENT TO HOLD THE LISTS
  async function createEvent(event) {
    try {
      const result = await firebaseStore.postDocument("eventList", event);
      if (!result.ok) {
        return false;
      }
      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
  //   CREATE THE LIST INSIDE THE EVENT COLLECTION
  async function createList(eventId, list) {
    try {
      const result = await firebaseStore.postDocument(
        "eventList/" + eventId + "/lists",
        list
      );
      if (!result.ok) {
        return false;
      }
      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
  //   GET EVENT BY ID
  async function getEventById(eventId) {
    try {
      const result = await firebaseStore.getDocumentById("eventList", eventId);
      if (!result.ok) {
        return false;
      }
      return result.data;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
  //   GET LIST BY ID INSIDE THE EVENT COLLECTION
  async function getListById(eventId, listId) {
    try {
      const result = await firebaseStore.getDocumentById(
        "eventList/" + eventId + "/lists",
        listId
      );
      if (!result.ok) {
        return false;
      }
      return result.data;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }

  async function addGuestToList(eventId, listId, guest) {
    try {
      const guestDoc = { ...guest, listId, eventId };
      const response = await firebaseStore.postDocument(
        `eventList/${eventId}/guests`,
        guestDoc
      );
    } catch (error) {
      console.log({ error });
    }
  }

  function addWatchedGuest(guest) {
    guests.value.push(guest);
  }

  function modifyWatchedGuest(guest) {
    const index = guests.value.findIndex((g) => g.id === guest.id);
    if (index !== -1) {
      guests.value.splice(index, 1, guest);
    }
  }

  function removeWatchedGuest(guest) {
    const index = guests.value.findIndex((g) => g.id === guest.id);
    if (index !== -1) {
      guests.value.splice(index, 1);
    }
  }

  async function getEvents() {
    let events = [];
    try {
      const response = await firebaseStore.getCollection({
        collection: "eventList",
      });
      console.log({ response });
      if (response.ok) {
        events = [...response.data];
        return events;
      }
    } catch (error) {
      console.log({ error });
      return { ok: false, error: error };
    }
  }

  async function deleteEvent(eventId) {
    try {
      await firebaseStore.deleteDocument("eventList", eventId);
      return { ok: true };
    } catch (error) {
      console.log({ error });
      return { ok: false, error };
    }
  }

  async function watchGuests(eventId) {
    try {
      await firebaseStore.watchCollection(
        "eventList/" + eventId + "/guests",
        addWatchedGuest,
        modifyWatchedGuest,
        removeWatchedGuest
      );
    } catch (error) {
      console.log({ error });
    }
  }

  return {
    createEvent,
    createList,
    getEventById,
    getListById,
    watchGuests,
    getEvents,
    deleteEvent,
  };
});
