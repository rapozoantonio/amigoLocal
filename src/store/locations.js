import { ref } from "vue";

import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
// import { ref, } from 'vue'
import { defineStore } from "pinia";
import Swal from "sweetalert2";

import { firestore } from "@/plugins/firebase";

export const useLocationsStore = defineStore("locations", () => {
  const location = ref(null);
  const locations = ref(null);
  const loading = ref(false);

  async function getLocations() {
    loading.value = true;
    locations.value = null;

    try {
      const q = query(collection(firestore, "locations"));
      const querySnapshot = await getDocs(q);
      console.log({ querySnapshot });
      //   querySnapshot.forEach((document) => {
      //     console.log(document.data());
      //     events.value.push(document.data());
      //   });
      locations.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: { locations: locations.value },
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

  async function getLocationById(id) {
    try {
      const documentSnapshot = await getDoc(doc(firestore, "locations/" + id));
      if (!documentSnapshot.empty) {
        location.value = documentSnapshot.data();
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

  async function pushLocation(loc) {
    if (!locations.value || !Array.isArray(locations.value)) {
      locations.value = [];
    }
    locations.value.push(loc);
    return true;
  }

  function notifyError(error) {
    Swal.fire({
      title: error.code,
      text: error.message,
      icon: "error",
    });
  }

  function init() {
    getLocations();
  }

  init();

  return {
    locations,
    loading,
    getLocations,
    getLocationById,
    location,
    pushLocation,
  };
});
