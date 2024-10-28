<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-progress-circular
          v-if="!countries"
          indeterminate
        ></v-progress-circular>
        <template v-else>
          <p class="text-h5 mb-4 text-center">Escolha o país</p>
          <v-row dense justify="center">
            <v-col
              cols="12"
              v-for="country in featuredCountries"
              :key="country.names.pt"
              class="text-center"
            >
              <v-btn
                size="large"
                label
                class="p-4"
                :value="country.code"
                :color="selectedCountry === country.code ? 'primary' : ''"
                @click="selectCountry(country.code)"
              >
                <v-avatar size="30">
                  <v-img
                    :src="
                      'https://flagcdn.com/' +
                      country.code.toLowerCase() +
                      '.svg'
                    "
                  ></v-img>
                </v-avatar>
                <span class="ml-2">{{ country.names.pt }}</span>
              </v-btn>
            </v-col>
          </v-row>

          <v-divider ref="divider" class="my-4"></v-divider>

          <template v-if="regions && selectedCountry">
            <p class="text-h5 my-4 text-center">Escolha uma região</p>
            <v-row justify="center">
              <v-col
                cols="auto"
                v-for="region in regions[selectedCountry.toUpperCase()]"
                :key="region.id"
                class="text-center"
              >
                <v-btn
                  size="x-large"
                  label
                  class="p-4"
                  :value="region.id"
                  :to="{
                    name: 'events',
                    params: { country: selectedCountry, region: region.id },
                  }"
                  :color="selectedRegion === region.id ? 'primary' : ''"
                  @click="selectRegion(region.id)"
                >
                  <span class="ml-2">{{ region.name }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { storeToRefs } from "pinia";

import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();

const { countries, regions } = storeToRefs(configStore);

const selectedCountry = ref("BR");
const selectedRegion = ref(null);
const divider = ref(null);
const loading = ref(null);

const featuredCountries = computed(() => {
  if (!countries.value) {
    return [];
  }
  return countries.value.filter((c) => c.featured);
});

function selectCountry(code) {
  selectedCountry.value = code;
  selectedRegion.value = null;

  divider.value.$el.scrollIntoView();
}

function selectRegion(region) {
  selectedRegion.value = region;
}

function goToEvents() {}

onMounted(() => {
  if (!countries.value) {
    configStore.init();
  }
});
</script>

<style lang="scss" scoped></style>
