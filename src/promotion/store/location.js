import {
  ref,
  watch,
} from 'vue';

// import { ref, } from 'vue'
import { defineStore } from 'pinia';

import { useFirebaseStore } from './firebase';

export const useLocationStore = defineStore("location", () => {
  const firebaseStore = useFirebaseStore();

  const location = ref({
    name: null,
    address: null,
    postalcode: null,
    city: null,
    state: null,
    region: null,
    country: null,
    lat: null,
    lng: null,
    description: null,
    links: null,
    followers: 0,
    approved: false,
    featured: false,
    owner: firebaseStore.getCurrentUser(),
  });

  function reset() {
    location.value = {
      name: null,
      address: null,
      postalcode: null,
      city: null,
      state: null,
      region: null,
      country: "BR",
      lat: null,
      lng: null,
      description: null,
      links: null,
      followers: 0,
      approved: false,
      featured: false,
      owner: firebaseStore.getCurrentUser(),
    };
  }

  async function createLocation(notify = true) {
    try {
      const response = await firebaseStore.postDocument(
        "locations",
        location.value
      );
      if (response.ok) {
        if (notify) {
          response.notify();
        }
        reset();
        return response;
      }
    } catch (error) {
      
      return error;
    }
  }

  watch(
    () => location.value.country,
    (newValue, oldValue) => {
      if (newValue && oldValue) {
        location.value.region = null;
      }
    }
  );

  return {
    createLocation,
    location,
    reset,
  };
});
