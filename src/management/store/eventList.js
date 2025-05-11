// Utilities
import { defineStore } from "pinia";
import { useFirebaseStore } from "@/core/store/firebase";
import Swal from "sweetalert2";
import { ref } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/core/plugins/firebase";
import { useAuthStore } from "@/core/store/auth";

export const useEventListStore = defineStore("eventList", () => {
  const firebaseStore = useFirebaseStore();
  const authStore = useAuthStore();

  const guests = ref([]);
  const events = ref([]);

  // ===================
  // EVENTS
  // ===================
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
  function watchEventById(eventId, setDocument) {
    return firebaseStore.watchDocument(
      { path: "eventList", docId: eventId },
      setDocument
    );
  }
  async function updateEvent(event) {
    console.log({ event });
    try {
      if (event.id === null || event.id === undefined)
        throw new Error("Missing id");
      const response = await firebaseStore.putDocument(
        `eventList`,
        event.id,
        event
      );
      if (response.ok) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  // ===================
  // LISTS
  // ===================
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
  function watchLists(eventId, add, update, remove) {
    return firebaseStore.watchCollection(
      {
        path: "eventList/" + eventId + "/lists",
      },
      add,
      update,
      remove
    );
  }
  async function deleteList(eventId, list) {
    try {
      await firebaseStore.deleteDocument(`eventList/${eventId}/lists`, list.id);
      return { ok: true };
    } catch (error) {
      console.log({ error });
      return { ok: false, error };
    }
  }
  async function updateList(eventId, list) {
    console.log({ list });
    try {
      if (list.id === null || list.id === undefined)
        throw new Error("Missing id");
      const response = await firebaseStore.putDocument(
        `eventList/${eventId}/lists`,
        list.id,
        list
      );
      if (response.ok) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  // ===================
  // GUESTS
  // ===================
  function checkIfGuestExists(guests, guest) {
    console.log("checkIfGuestExists");
    if (!guests || guests.length === 0)
      return { result: false, reason: "No guests" };

    const keys = ["instagram", "email", "phone", "taxId", "name"];
    const existingKeys = keys.filter((k) => {
      if (guest[k] && guest[k] !== "") {
        return true;
      }
      return false;
    });
    console.log({ existingKeys });
    if (existingKeys.length === 0)
      return { result: false, reason: "No ids keys in the guest object" };
    let exists = false;
    const foundedKeys = [];
    existingKeys.forEach((k) => {
      const search = guests.find((g) => g[k] === guest[k]);
      console.log({ search });
      if (search) {
        exists = true;
        foundedKeys.push(k);
      }
    });
    if (exists) {
      return { result: true, reason: foundedKeys.join(", ") };
    } else {
      return { result: false, reason: "No other guest with same ids" };
    }
  }
  async function checkIfGuestExistsInServer(guest, eventId) {
    console.log("checkIfGuestExistsInServer");
    // console.log(guest);
    const keys = ["name", "taxId", "phone", "email", "instagram"];
    let exists = false;
    const checkIds = keys.reduce((total, key) => {
      if (guest[key] && guest[key] !== "") {
        total.push(guest[key]);
      }
      return total;
    }, []);
    // console.log({ checkIds });
    const response = await firebaseStore.getCollection({
      collection: `eventList/${eventId}/guests`,
      query: { "ids[any]": checkIds },
    });

    // console.log({ response });
    if (response.totalCount > 0) {
      return { ok: true, exists: true, result: response.data };
    } else {
      return { ok: false, exists: false, result: [] };
    }
  }

  async function checkIfCustomerExists(guest) {
    console.log("checkIfCustomerExists");
    console.log(guest);
    const keys = ["name", "taxId", "phone", "email", "instagram"];
    let exists = false;
    const checkIds = keys.reduce((total, key) => {
      if (guest[key] && guest[key] !== "") {
        total.push(guest[key]);
      }
      return total;
    }, []);
    // console.log({ checkIds });
    const response = await firebaseStore.getCollection({
      collection: `customers`,
      query: { "ids[any]": checkIds },
    });

    console.log({ response });
    if (response.totalCount > 0) {
      return { ok: true, exists: true, result: response.data };
    } else {
      return { ok: false, exists: false, result: [] };
    }
  }
  async function addGuestToList(eventId, guest) {
    try {
      guest.eventId = eventId;
      const response = await firebaseStore.postDocument(
        `eventList/${eventId}/guests`,
        guest,
        "guestCreate"
      );
      if (response.ok) {
        return { ok: true, data: response.data };
      } else {
        return { ok: false };
      }
    } catch (error) {
      console.log({ error });
      return {
        ok: false,
        error: error,
      };
    }
  }
  function watchGuests(eventId, add, update, remove) {
    return firebaseStore.watchCollection(
      {
        path: "eventList/" + eventId + "/guests",
      },
      add,
      update,
      remove
    );
  }
  async function updateGuest(eventId, guest) {
    console.log({ guest });
    try {
      if (guest.id === null || guest.id === undefined)
        throw new Error("Missing id");
      const response = await firebaseStore.putDocument(
        `eventList/${eventId}/guests`,
        guest.id,
        guest,
        "guestUpdate"
      );
      if (response.ok) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    } catch (error) {
      return { ok: false, error: error };
    }
  }
  async function deleteGuest(eventId, guest) {
    try {
      await firebaseStore.deleteDocument(
        `eventList/${eventId}/guests`,
        guest.id
      );
      return { ok: true };
    } catch (error) {
      console.log({ error });
      return { ok: false, error };
    }
  }

  async function checkInGuest(eventId, guest) {
    try {
      const user = authStore.user
        ? { uid: authStore.user.uid, email: authStore.user.email }
        : nul;
      const guestDoc = {
        ...guest,
        checkInTime: Date.now(),
        checkInBy: user,
        status: "checked-in",
      };
      await updateGuest(eventId, guestDoc);
      await addIdentifiedGuest(eventId, guestDoc);
      return { ok: true };
    } catch (error) {
      console.log({ error });
    }
  }

  async function addIdentifiedGuest(eventId, guest) {
    try {
      console.log({ guest });
      const checkinEvent = {
        id: eventId,
        checkInBy: guest.checkInBy,
        checkInTime: guest.checkInTime,
        eventId: eventId,
        guestId: guest.id,
        promoterId: guest?.promoter?.id,
        listId: guest?.list?.id,
      };

      const customer = {
        name: guest.name,
        taxId: guest.taxId,
        id: guest.id,
        instagram: guest.instagram,
        email: guest.email,
        phone: guest.phone,
        ids: guest.ids,
      };
      const result = await firebaseStore.putDocument(
        "customers",
        customer.id,
        customer,
        "guestUpdate"
      );
      const result2 = await firebaseStore.postDocument(
        "customers/" + guest.id + "/checkins",
        checkinEvent
      );
      console.log({ result, result2 });
      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
  // ===================
  // PROMOTERS
  // ===================
  //   CREATE THE PROMOTER INSIDE THE EVENT COLLECTION
  async function createPromoter(eventId, promoter) {
    try {
      const result = await firebaseStore.postDocument(
        "eventList/" + eventId + "/promoters",
        promoter
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
  async function getPromoterById(eventId, promoterId) {
    try {
      const result = await firebaseStore.getDocumentById(
        "eventList/" + eventId + "/promoters",
        promoterId
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
  function watchPromoters(eventId, add, update, remove) {
    return firebaseStore.watchCollection(
      {
        path: "eventList/" + eventId + "/promoters",
      },
      add,
      update,
      remove
    );
  }
  async function deletePromoter(eventId, promoter) {
    try {
      await firebaseStore.deleteDocument(
        `eventList/${eventId}/promoters`,
        promoter.id
      );
      return { ok: true };
    } catch (error) {
      console.log({ error });
      return { ok: false, error };
    }
  }
  async function updatePromoter(eventId, promoter) {
    console.log({ promoter });
    try {
      if (promoter.id === null || promoter.id === undefined)
        throw new Error("Missing id");
      const response = await firebaseStore.putDocument(
        `eventList/${eventId}/promoters`,
        promoter.id,
        promoter
      );
      if (response.ok) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  // ===================
  // HOSTESS
  // ===================

  //   CREATE THE HOSTESS INSIDE THE EVENT COLLECTION
  async function createHostess(eventId, hostesses) {
    try {
      const result = await firebaseStore.postDocument(
        "eventList/" + eventId + "/hostesses",
        hostesses
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
  async function getHostessById(eventId, hostessId) {
    try {
      const result = await firebaseStore.getDocumentById(
        "eventList/" + eventId + "/hostesses",
        hostessId
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
  function watchHostesses(eventId, add, update, remove) {
    return firebaseStore.watchCollection(
      {
        path: "eventList/" + eventId + "/hostesses",
      },
      add,
      update,
      remove
    );
  }
  async function deleteHostess(eventId, hostess) {
    try {
      await firebaseStore.deleteDocument(
        `eventList/${eventId}/hostesses`,
        hostess.id
      );
      return { ok: true };
    } catch (error) {
      console.log({ error });
      return { ok: false, error };
    }
  }
  async function updateHostess(eventId, hostess) {
    console.log({ hostess });
    try {
      if (hostess.id === null || hostess.id === undefined)
        throw new Error("Missing id");
      const response = await firebaseStore.putDocument(
        `eventList/${eventId}/hostesses`,
        hostess.id,
        hostess
      );
      if (response.ok) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  return {
    // EVENTS
    createEvent,
    getEventById,
    getEvents,
    deleteEvent,
    watchEventById,
    updateEvent,
    // LISTS
    createList,
    watchLists,
    getListById,
    deleteList,
    updateList,
    // GUESTS
    addGuestToList,
    watchGuests,
    updateGuest,
    deleteGuest,
    checkIfGuestExists,
    checkIfGuestExistsInServer,
    checkIfCustomerExists,
    checkInGuest,
    // PROMOTERS
    createPromoter,
    getPromoterById,
    watchPromoters,
    deletePromoter,
    updatePromoter,
    // HOSTESS
    createHostess,
    getHostessById,
    watchHostesses,
    deleteHostess,
    updateHostess,
  };
});
