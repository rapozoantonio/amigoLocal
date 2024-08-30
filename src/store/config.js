import {
  computed,
  ref,
} from 'vue';

import { defineStore } from 'pinia';

import $countries from '@/assets/countries';
import $genres from '@/assets/genres';
import $regions from '@/assets/regions';

import { useFirebaseStore } from './firebase';

export const useConfigStore = defineStore("config", () => {
  const eventConfig = ref(null);
  const firebaseStore = useFirebaseStore();
  const allCountries = ref(null);
  const countries = ref(null);
  const regions = ref(null);
  const genres = ref(null);

  async function getEventConfig() {
    try {
      const response = await firebaseStore.getDocumentById("config", "event");
      if (response.ok) {
        eventConfig.value = response.data;
        
      }
    } catch (error) {
      
    }
  }

  async function saveEventConfig() {
    try {
      const response = await firebaseStore.putDocument(
        "config",
        "event",
        eventConfig.value
      );
      if (response.ok) {
        
      }
    } catch (error) {
      
    }
  }

  async function init() {
    allCountries.value = $countries;
    countries.value = $countries.filter((c) => c.featured);
    regions.value = $regions;
    genres.value = $genres;
  }

  const regionById = computed(() => {
    return (region, country) => {
      if (!regions.value) return null;
      return regions.value[country].find((r) => r.id === region);
    };
  });

  init();

  return {
    regionById,
    getEventConfig,
    eventConfig,
    countries,
    genres,
    regions,
    saveEventConfig,
    init,
  };
});
