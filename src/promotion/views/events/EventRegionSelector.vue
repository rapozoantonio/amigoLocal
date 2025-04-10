<template>
  <div>
    <v-container class="pa-0 mt-3">
      <v-row>
        <v-col cols="12" class="pa-2">
          <!-- Loading state with skeleton -->
          <v-card v-if="!countries" flat variant="plain" class="loading-card">
            <v-card-text>
              <v-skeleton-loader
                type="article"
                class="mx-auto"
              ></v-skeleton-loader>
            </v-card-text>
          </v-card>

          <!-- Main content -->
          <template v-else>
            <!-- Country selection with search -->
            <v-sheet class="mb-6">
              <h2 class="text-h6 font-weight-medium text-center mb-4">
                Selecione seu país
              </h2>

              <!-- TODO: IMPROVE THIS FEATURE TO SEARCH FOR REGION -->
              <!-- Search field for countries -->
              <!-- <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Buscar país"
                variant="outlined"
                density="comfortable"
                hide-details
                class="mb-4"
                clearable
              ></v-text-field> -->

              <!-- Featured countries grid -->
              <v-row dense class="country-grid">
                <v-col
                  v-for="country in filteredCountries"
                  :key="country.code"
                  cols="12"
                  sm="6"
                  class="px-2"
                >
                  <v-btn
                    block
                    :class="{
                      'selected-country': selectedCountry === country.code,
                      'elevation-2': selectedCountry === country.code,
                    }"
                    height="56"
                    :color="
                      selectedCountry === country.code ? 'primary' : 'surface'
                    "
                    @click="selectCountry(country.code)"
                  >
                    <div class="d-flex align-center justify-start w-100">
                      <v-avatar size="32" class="mr-3">
                        <v-img
                          :src="`https://flagcdn.com/${country.code.toLowerCase()}.svg`"
                          :alt="country.names.pt"
                        ></v-img>
                      </v-avatar>
                      <span class="text-body-1">{{ country.names.pt }}</span>
                    </div>
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>

            <!-- Region selection with animation -->
            <v-expand-transition>
              <v-sheet
                v-if="
                  selectedCountry && regions?.[selectedCountry.toUpperCase()]
                "
              >
                <v-divider class="mb-6"></v-divider>

                <h2 class="text-h6 font-weight-medium text-center mb-4">
                  Selecione a região
                </h2>

                <v-row class="region-grid">
                  <v-col
                    v-for="region in regions[selectedCountry.toUpperCase()]"
                    :key="region.id"
                    cols="12"
                    sm="6"
                    class="px-2"
                  >
                    <v-btn
                      block
                      :to="{
                        name: 'events',
                        params: { country: selectedCountry, region: region.id },
                      }"
                      height="56"
                      :color="
                        selectedRegion === region.id ? 'primary' : 'surface'
                      "
                      class="region-btn text-none"
                      @click="selectedRegion = region.id"
                    >
                      {{ region.name }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-expand-transition>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/promotion/store/config";

const configStore = useConfigStore();
const { countries, regions } = storeToRefs(configStore);

const selectedCountry = ref("BR");
const selectedRegion = ref(null);
const searchQuery = ref("");

// Enhanced filtered countries based on search
const filteredCountries = computed(() => {
  if (!countries.value) return [];

  const query = searchQuery.value.toLowerCase().trim();
  const allCountries = countries.value.filter((c) => c.featured);

  // If no search query, return all featured countries
  if (!query) {
    selectedCountry.value = "BR"; // Reset to Brasil when search is cleared
    return allCountries;
  }

  // Search in countries and their regions
  return allCountries.filter((country) => {
    // Check country names and codes
    const matchesCountry = 
      country.names.pt.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query);

    // Check regions if they exist for this country
    const countryRegions = regions.value?.[country.code.toUpperCase()] || [];
    const matchesRegion = countryRegions.some(region => 
      region.name.toLowerCase().includes(query)
    );

    return matchesCountry || matchesRegion;
  });
});

// Enhanced select country function
function selectCountry(code) {
  selectedCountry.value = code;
  selectedRegion.value = null;
  searchQuery.value = ""; // Clear search when country is selected

  // Smooth scroll with offset for mobile
  setTimeout(() => {
    const regionSection = document.querySelector(".region-grid");
    if (regionSection) {
      const offset = 80;
      const top = regionSection.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  }, 100);
}

// Reset function for when search is cleared
function handleSearchClear() {
  if (!searchQuery.value) {
    selectedCountry.value = "BR";
    selectedRegion.value = null;
  }
}

// Watch for search query changes
watch(searchQuery, (newValue) => {
  if (!newValue) {
    handleSearchClear();
  }
});

onMounted(() => {
  if (!countries.value) {
    configStore.init();
  }
});
</script>

<style scoped>
.country-grid,
.region-grid {
  max-width: 600px;
  margin: 0 auto;
}

.selected-country {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.region-btn {
  transition: all 0.2s ease;
}

.region-btn:hover {
  transform: translateY(-2px);
}

.loading-card {
  max-width: 600px;
  margin: 0 auto;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .v-btn {
    width: 100%;
    margin-bottom: 8px;
  }

  .country-grid,
  .region-grid {
    padding: 0 8px;
  }
}
</style>
