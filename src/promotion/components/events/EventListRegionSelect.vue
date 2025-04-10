<template>
  <v-container v-if="regions" class="py-0">
    <v-row>
      <v-col cols="12">
        <v-btn variant="plain" height="60" @click="openRegionSelection">
          <v-avatar size="24" class="mr-2">
            <LazyImage
              :src="flagUrl"
              :alt="`Flag of ${country}`"
              width="24"
              height="24"
            />
          </v-avatar>
          <span class="text-h6">{{ currentRegion.name }}</span>
          <v-icon class="ml-2" size="medium">mdi-chevron-down</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-navigation-drawer
      floating
      temporary
      :width="drawerWidth"
      location="right"
      v-model="regionSelectionOpened"
    >
      <v-list>
        <v-list-item
          v-for="region in availableRegions"
          :key="region.id"
          :to="{ name: 'events', params: { country, region: region.id } }"
          link
        >
          <template v-slot:prepend>
            <v-avatar size="24">
              <LazyImage :src="flagUrl" :alt="`Flag of ${country}`" width="24" height="24" />
            </v-avatar>
          </template>
          <v-list-item-title>{{ region.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue' // Add onUnmounted here
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/promotion/store/config'
import LazyImage from '@/promotion/components/common/LazyImage.vue'

const route = useRoute()
const { region, country } = route.params
const configStore = useConfigStore()

// Reactive references
const { regions, regionById } = storeToRefs(configStore)
const regionSelectionOpened = ref(false)
const drawerWidth = ref(window.innerWidth > 600 ? 350 : window.innerWidth * 0.9)

// Computed properties with memoization
const flagUrl = computed(() => `https://flagcdn.com/${country.toLowerCase()}.svg`)
const currentRegion = computed(() => regionById.value(region, country.toUpperCase()))
const availableRegions = computed(() => regions.value?.[country.toUpperCase()] ?? [])

// Methods
const openRegionSelection = () => {
  regionSelectionOpened.value = true
}

// References for cleanup
const resizeObserver = ref(null)
const preloadLink = ref(null)

// Lifecycle hooks
onMounted(async () => {
  // Load config if not already loaded
  if (!regions.value) {
    await configStore.getEventConfig()
  }

  // Preload flag image
  preloadLink.value = document.createElement('link')
  preloadLink.value.rel = 'preload'
  preloadLink.value.as = 'image'
  preloadLink.value.href = flagUrl.value
  document.head.appendChild(preloadLink.value)

  // Setup resize observer
  resizeObserver.value = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width
    drawerWidth.value = width > 600 ? 350 : width * 0.9
  })
  
  resizeObserver.value.observe(document.documentElement)
})

// Cleanup
onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
  if (preloadLink.value && document.head.contains(preloadLink.value)) {
    document.head.removeChild(preloadLink.value)
  }
})
</script>