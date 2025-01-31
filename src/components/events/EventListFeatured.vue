<template>
  <section class="flex-grow-1">
    <v-container v-if="featuredEvents.length > 0">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-2 mb-sm-4">
            <p class="text-caption text-grey-darken-1">
              {{ totalUpcomingEvents }} próximos eventos
            </p>
            <p
              @click="removeFilters"
              v-if="selectedGenres?.length"
              class="text-caption"
            >
              <span class="mr-1">X</span> Remover filtros
            </p>
          </div>
        </v-col>
        <v-col cols="12">
          <p class="text-h5 text-sm-h4 font-weight-bold text-grey-darken-1">🔥 Em Alta</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-slide-group :center-active="true">
            <v-slide-group-item
              v-for="event in responsiveEvents"
              :key="event.id"
              v-slot="{ isSelected, toggle }"
            >
              <event-card-vertical
                class="mr-1"
                :event="event"
              ></event-card-vertical>
            </v-slide-group-item>
          </v-slide-group>
        </v-col>
      </v-row>
    </v-container>

    <!-- Loading State -->
    <v-container v-else>
      <v-skeleton-loader type="article" class="mb-4"></v-skeleton-loader>
    </v-container>
  </section>
</template>

<script setup>
import { useEventsStore } from "@/store/events";
import { storeToRefs } from "pinia";
import EventCardVertical from "@/components/events/EventCardVertical.vue";
import { computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const eventsStore = useEventsStore();
const { mobile } = useDisplay();
const router = useRouter();

const removeFilters = () => {
  router.push({ query: { genre: [], categories: [], dateRange: [] } });
};

const {
  nextEvents,
  featuredEvents,
  selectedGenres,
  filteredEvents,
  getTotalUpcomingEvents,
} = storeToRefs(eventsStore);

// Watch for featuredEvents changes and fetch if empty
watch(
  featuredEvents,
  (newEvents) => {
    if (!newEvents?.length) {
      eventsStore.fetchFeaturedEvents?.();
    }
  },
  { immediate: true }
);

// Create responsive events computed property with null check
const responsiveEvents = computed(() => {
  if (!featuredEvents?.value) return [];
  const sliceSize = mobile.value ? 3 : 6;
  return featuredEvents?.value.slice(0, sliceSize) || [];
});

// Computed with null check
const totalUpcomingEvents = computed(() => {
  if (!nextEvents?.value) return 0;
  return Object.values(nextEvents.value).reduce((total, events) => {
    if (!Array.isArray(events)) return total;
    return total + events.length;
  }, 0);
});
</script>

<style scoped>
@media (max-width: 600px) {
  :deep(.v-slide-group__content) {
    padding-left: 4px;
  }
}
</style>
