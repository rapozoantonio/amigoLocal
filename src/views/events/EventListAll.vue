<template>
  <section class="flex-grow-1">
    <v-container class="pa-0 pa-sm-2">
      <v-row v-for="(events, day) in nextEvents" :key="day" class="ma-0">
        <v-col cols="12" class="pa-0 pa-sm-2">
          <v-toolbar
            color="background"
            class="sticky-toolbar"
            density="compact"
          >
            <v-toolbar-title>
              <div class="text-grey-darken-1 d-flex align-center py-1">
                <v-icon size="18" class="mr-2">mdi-calendar</v-icon>
                <span class="text-subtitle-1 text-sm-h6 font-weight-medium">
                  {{ day }}
                </span>
              </div>
            </v-toolbar-title>
          </v-toolbar>
          <div class="events-list">
            <!-- If no events, show skeleton placeholders -->
            <template v-if="!events || !events.length">
              <v-skeleton-loader
                v-for="index in 3"
                :key="index"
                type="list-item-avatar"
                class="mb-2"
              />
            </template>
            <!-- Otherwise, show the event cards -->
            <template v-else>
              <event-card-horizontal
                v-for="event in events"
                :key="event.id"
                :event="event"
                class="mb-2"
              />
            </template>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import EventCardHorizontal from "@/components/events/EventCardHorizontal.vue";
import { useEventsStore } from "@/store/events";

// Props
const { country, region } = defineProps(["country", "region"]);

// Pinia Store
const route = useRoute();
const router = useRouter();
const eventsStore = useEventsStore();

// De-structure store refs (e.g., nextEvents, events, etc.)
const {
  nextEvents,
  events,
  selectedGenres,
  selectedCategories,
  selectedDateRange,
} = storeToRefs(eventsStore);

watch(
  () => route.query.genre,
  (newValue) => {
    selectedGenres.value = newValue;
  }
);

watch(
  () => route.query.categories,
  (newValue) => {
    selectedCategories.value = newValue;
  }
);

watch(
  () => route.query.dateRange,
  (newValue) => {
    selectedDateRange.value = newValue;
  }
);

onMounted(() => {
  if (route.query.genre) {
    selectedGenres.value = Array.isArray(route.query.genre)
      ? route.query.genre
      : [route.query.genre];
  }
  if (route.query.categories) {
    selectedCategories.value = Array.isArray(route.query.categories)
      ? route.query.categories
      : [route.query.categories];
  }
  if (route.query.dateRange) {
    selectedDateRange.value = Array.isArray(route.query.dateRange)
      ? route.query.dateRange
      : [route.query.dateRange];
  }

  // Fetch events from the store
  eventsStore.getEventsByRegion(country.toUpperCase(), region);
});
</script>

<style scoped>
.sticky-toolbar {
  position: sticky;
  top: 48px;
  z-index: 4;
  border-radius: 0;
}

.events-list {
  padding: 8px 12px;
}

@media (min-width: 600px) {
  .sticky-toolbar {
    border-radius: 8px;
    margin: 4px 0;
  }

  .events-list {
    padding: 8px 0;
  }
}
</style>
