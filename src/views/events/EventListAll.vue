<template>
  <div>
    <EventListFeatured />
    <section class="flex-grow-1" aria-label="Events Calendar" role="region">
      <v-container class="pa-0 pa-sm-2">
        <template v-if="nextEvents && Object.keys(nextEvents).length > 0">
          <v-row v-for="(events, day) in nextEvents" :key="day" class="ma-0">
            <v-col cols="12" class="pa-0 pa-sm-2">
              <event-calendar-divider-toolbar
                :day="day"
                :aria-label="`Events for ${day}`"
              ></event-calendar-divider-toolbar>
              <div
                class="events-list"
                role="feed"
                :aria-label="`List of events for ${day}`"
              >
                <card-horizontal
                  v-for="(event, index) in events"
                  :key="event.id"
                  :event="event"
                  :displayPromoterCode="true"
                  class="mb-2"
                  :aria-setsize="events.length"
                  :aria-posinset="index + 1"
                />
              </div>
            </v-col>
          </v-row>
        </template>
        <button-load-more-events></button-load-more-events>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import EventListFeatured from "@/components/events/EventListFeatured.vue";
import CardHorizontal from "@/components/events/CardHorizontal.vue";
import EventCalendarDividerToolbar from "@/components/events/EventCalendarDividerToolbar.vue";
import { useEventsStore } from "@/store/events";
import ButtonLoadMoreEvents from "@/components/events/ButtonLoadMoreEvents.vue";
// Props with validation
const { country, region } = defineProps({
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: false,
  },
});

// Pinia Store
const route = useRoute();
const router = useRouter();
const eventsStore = useEventsStore();

// De-structure store refs
const {
  nextEvents,
  events,
  totalCount,
  hasNextPage,
  selectedGenres,
  selectedCategories,
  selectedDateRange,
} = storeToRefs(eventsStore);

// Loading state for accessibility
const isLoading = ref(false);

// Watch for query parameter changes

// watch(
//   () => route.query.genre,
//   (newValue) => {
//     console.log("watch genre", newValue)
//     const genresFinal = Array.isArray(newValue)
//       ? newValue
//       : [newValue].filter(Boolean);
//     selectedGenres.value = genresFinal
//     if (genresFinal && genresFinal.length > 0) {
//       eventsStore.fetchEvents({ country: country, "region.id": region, "genres[any]": genresFinal })
//     }
//   }
// );

// watch(
//   () => route.query.categories,
//   (newValue) => {
//     selectedCategories.value = Array.isArray(newValue)
//       ? newValue
//       : [newValue].filter(Boolean);
//   }
// );

// watch(
//   () => route.query.dateRange,
//   (newValue) => {
//     selectedDateRange.value = Array.isArray(newValue)
//       ? newValue
//       : [newValue].filter(Boolean);
//   }
// );


// Initialize component
onMounted(async () => {
  isLoading.value = true;
  try {
    // Fetch events from the store
    const query = eventsStore.getRouteQueryParams();
    if(region) {
        await eventsStore.fetchEvents({ country: country || "BR", "region.id": region || "riodejaneiro", ...query });
    }
    else {
      await eventsStore.fetchEvents({ country: country || "BR",  ...query });
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
  } finally {
    isLoading.value = false;

  }
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

/* Ensure proper focus management */
.events-list:focus {
  outline: none;
}

.events-list > *:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (min-width: 600px) {
  .sticky-toolbar {
    border-radius: 8px;
    margin: 4px 0;
  }

  .events-list {
    padding: 8px 0;
  }
}

/* Loading state styles */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
