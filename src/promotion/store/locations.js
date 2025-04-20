import { ref } from "vue";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
// import { ref, } from 'vue'
import { defineStore } from "pinia";
import Swal from "sweetalert2";

import { firestore } from "@/core/plugins/firebase";

export const useLocationsStore = defineStore("locations", () => {
  const location = ref(null);
  const locations = ref(null);
  const loading = ref(false);

  async function getLocations({ country, region }) {
    loading.value = true;
    locations.value = null;
    const locationQuery = [];
    if (country) {
      locationQuery.push(where("country", "==", country));
    }
    if (region) {
      locationQuery.push(where("region.id", "==", region));
    }

    try {
      const q = query(collection(firestore, "locations"), ...locationQuery);
      const querySnapshot = await getDocs(q);

      //   querySnapshot.forEach((document) => {
      //
      //     events.value.push(document.data());
      //   });
      locations.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: { locations: locations.value },
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

  async function getLocationById(id) {
    try {
      const documentSnapshot = await getDoc(doc(firestore, "locations/" + id));
      if (!documentSnapshot.empty) {
        location.value = documentSnapshot.data();
      }
    } catch (error) {
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

  // function init() {
  //   getLocations();
  // }

  // init();

  return {
    locations,
    loading,
    getLocations,
    getLocationById,
    location,
    pushLocation,
  };
});
