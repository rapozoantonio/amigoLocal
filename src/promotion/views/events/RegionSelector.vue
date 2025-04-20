<template>
  <v-container v-if="!isAdminSubdomain">
    <v-row>
      <v-col cols="12">
        <v-card flat variant="plain">
          <v-card-text class="text-center">
            <p class="text-h5 mb-4">Buscando eventos na sua zona</p>
            <v-progress-circular size="large" width="7" color="primary" indeterminate></v-progress-circular>
          </v-card-text>
        </v-card>
        <template v-if="false">
          <p class="text-h5 mb-4 text-center">Escolha o país</p>
          <v-row dense justify="center">
            <v-col cols="12" v-for="country in featuredCountries" :key="country.names.pt" class="text-center">
              <v-btn size="large" label class="p-4" :value="country.code"
                :color="selectedCountry === country.code ? 'primary' : ''" @click="selectCountry(country.code)">
                <v-avatar size="30">
                  <v-img :src="'https://flagcdn.com/' +
                    country.code.toLowerCase() +
                    '.svg'
                    "></v-img>
                </v-avatar>
                <span class="ml-2">{{ country.names.pt }}</span>
              </v-btn>
            </v-col>
          </v-row>

          <v-divider ref="divider" class="my-4"></v-divider>

          <template v-if="regions && selectedCountry">
            <p class="text-h5 my-4 text-center">Escolha uma região</p>
            <v-row justify="center">
              <v-col cols="auto" v-for="region in regions[selectedCountry.toUpperCase()]" :key="region.id"
                class="text-center">
                <v-btn size="x-large" label class="p-4" :value="region.id" :to="{
                  name: 'events',
                  params: { country: selectedCountry, region: region.id },
                }" :color="selectedRegion === region.id ? 'primary' : ''" @click="selectRegion(region.id)">
                  <span class="ml-2">{{ region.name }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </template>
      </v-col>
    </v-row>
  </v-container>
  <!-- Render nothing if on admin subdomain -->
</template>

<script setup>
import { computed, onMounted, ref, inject } from "vue";
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/promotion/store/config';
import router from '@/promotion/router';

// Inject the admin status from App.vue
const isAdminSubdomain = inject('isAdminSubdomain', false);

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

  if (divider.value && divider.value.$el) {
    divider.value.$el.scrollIntoView();
  }
}

function selectRegion(region) {
  selectedRegion.value = region;
}

// Cache the IP lookup result
const IP_CACHE_KEY = 'user_region_info';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function getUserRegion() {
  // Skip geolocation if on admin subdomain
  if (isAdminSubdomain) {
    console.log('Skipping geolocation redirect on admin subdomain');
    return;
  }

  try {
    // Check cache first
    const cachedData = localStorage.getItem(IP_CACHE_KEY);
    if (cachedData) {
      const { timestamp, info } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return handleRegionRouting(info);
      }
      localStorage.removeItem(IP_CACHE_KEY); // Clear expired cache
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      "https://ipinfo.io/79.153.219.49?token=3bbe5f169a430f",
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const info = await response.json();
    
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      info
    }));

    return handleRegionRouting(info);

  } catch (error) {
    // Only redirect to Rio if not on admin subdomain
    if (!isAdminSubdomain) {
      return redirectToRio();
    }
  }
}

function handleRegionRouting(info) {
  // Skip if on admin subdomain
  if (isAdminSubdomain) {
    return;
  }
  
  if (regions.value && regions.value[info.country]) {
    const checkForRegion = regions.value[info.country].find(r => r.name === info.region);
    if (checkForRegion) {
      return router.push({ 
        name: "events", 
        params: { 
          country: [info.country], 
          region: checkForRegion.id 
        } 
      });
    }
  }
  return redirectToRio();
}

function redirectToRio() {
  // Skip redirect if on admin subdomain
  if (isAdminSubdomain) {
    return;
  }
  
  return router.push({ 
    name: "events", 
    params: { 
      country: "br", 
      region: "riodejaneiro" 
    } 
  });
}

onMounted(async () => {
  console.log('RegionSelector mounted, isAdminSubdomain:', isAdminSubdomain);
  
  // Skip everything if we're on the admin subdomain
  if (isAdminSubdomain) {
    console.log('On admin subdomain, skipping country/region redirection');
    return;
  }

  if (!countries.value) {
    configStore.init();
  }
  
  // Only perform geolocation and routing if not on admin subdomain
  if (!isAdminSubdomain) {
    await getUserRegion();
  }
});
</script>