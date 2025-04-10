<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="12">
        <v-btn variant="plain" height="60" @click="openCountrySelection">
          <v-avatar size="24" class="mr-2">
            <LazyImage
              :src="flagUrl"
              :alt="`Flag of ${country}`"
              width="24"
              height="24"
            />
          </v-avatar>
          <span class="text-h6">{{ currentCountry.names.pt }}</span>
          <v-icon class="ml-2" size="medium">mdi-chevron-down</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-navigation-drawer
      floating
      temporary
      :width="drawerWidth"
      location="right"
      v-model="countrySelectionOpened"
    >
      <v-list>
        <v-list-item
          v-for="country in localAvailableCountries"
          :key="country"
          :to="{ name: 'eventsAll', params: { country: country.code } }"
          link
        >
          <template v-slot:prepend>
            <v-avatar size="24">
              <LazyImage
                :src="flagUrlDynamic(country.code)"
                :alt="`Flag of ${country.names.pt}`"
                width="24"
                height="24"
              />
            </v-avatar>
          </template>
          <v-list-item-title>{{ country.names.pt }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue"; // Add onUnmounted here
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useConfigStore } from "@/promotion/store/config";
import LazyImage from "@/promotion/components/common/LazyImage.vue";

const route = useRoute();
const { country } = route.params;
const configStore = useConfigStore();

// Reactive references
const { allCountries } = storeToRefs(configStore);
const countrySelectionOpened = ref(false);
const drawerWidth = ref(
  window.innerWidth > 600 ? 350 : window.innerWidth * 0.9
);

// Computed properties with memoization
const flagUrl = computed(
  () => `https://flagcdn.com/${country.toLowerCase()}.svg`
);

const flagUrlDynamic = (countryCode) =>
  `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

const currentCountry = computed(() =>
  allCountries.value.find((c) => c.code === country)
);

const localAvailableCountries = [
  {
    code: "BR",
    names: {
      pt: "Brasil",
    },
  },
  {
    code: "ES",
    names: {
      pt: "Espanha",
    },
  },
];

// Methods
const openCountrySelection = () => {
  countrySelectionOpened.value = true;
};

// References for cleanup
const resizeObserver = ref(null);
const preloadLink = ref(null);

// Lifecycle hooks
onMounted(async () => {
  // Load config if not already loaded
  if (!allCountries.value) {
    await configStore.getEventConfig();
  }
  let espanha = allCountries.value.find((c) => {
    if (c.names.pt === "Espanha") {
      return c;
    }
  });
  // Preload flag image
  preloadLink.value = document.createElement("link");
  preloadLink.value.rel = "preload";
  preloadLink.value.as = "image";
  preloadLink.value.href = flagUrl.value;
  document.head.appendChild(preloadLink.value);

  // Setup resize observer
  resizeObserver.value = new ResizeObserver((entries) => {
    const width = entries[0].contentRect.width;
    drawerWidth.value = width > 600 ? 350 : width * 0.9;
  });

  resizeObserver.value.observe(document.documentElement);
});

// Cleanup
onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
  if (preloadLink.value && document.head.contains(preloadLink.value)) {
    document.head.removeChild(preloadLink.value);
  }
});
</script>
