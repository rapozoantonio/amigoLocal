import { ref } from 'vue';

import { defineStore } from 'pinia';

import { useFirebaseStore } from './firebase';

export const useConfigStore = defineStore("config", () => {
  const countries = ref(null);
  const regions = ref(null);
  const firebaseStore = useFirebaseStore();

  async function getCountries() {
    try {
      
      const response = await fetch("https://restcountries.com/v3.1/all");
      const json = await response.json();
      json.sort((a, b) => {
        return a.translations.por.common.localeCompare(
          b.translations.por.common
        );
      });
      const countriesJson = json.map((c) => ({
        name: c.translations.por.common,
        code: c.cca2,
        flag: c.flags.svg,
      }));

      const countriesArray = countriesJson.filter((c) => {
        const allowedCountries = ["BR", "ES", "CO"];
        return allowedCountries.includes(c.code);
      });

      countries.value = countriesArray;
      
    } catch (error) {
      
    }
  }

  async function getRegions() {
    try {
      const response = await firebaseStore.getDocumentById("config", "regions");
      if (response.ok) {
        regions.value = response.data;
      }
    } catch (error) {
      
    }
  }

  return { getCountries, countries, regions, getRegions };
});
