<template>
  <EventListFeatured />

  <div class="d-flex flex-column">
    <!-- Loading State -->
    <v-container v-if="loading?.value">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </v-container>

    <!-- All Events List -->
    <event-list-next-events v-else :events="filteredEvents"></event-list-next-events>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import EventListFeatured from "@/components/events/EventListFeatured.vue";
import EventListNextEvents from "@/components/events/EventListNextEvents.vue";
import { useEventsStore } from "@/store/events";

const route = useRoute();
const eventsStore = useEventsStore();
const { events, nextEvents, loading, selectedGenres } =
  storeToRefs(eventsStore);

const { country, region } = defineProps({
  country: { type: String, required: true },
  region: { type: String, required: true },
});

// Add computed property for filtered events
const filteredEvents = computed(() => {
  return (
    events.value?.filter((event) => event.categories?.includes("reveillon")) ||
    []
  );
});

watch(
  () => route.query.genre,
  (newValue) => {
    selectedGenres.value = newValue;
  }
);

onMounted(async () => {
  try {
    // Set genres from query if present
    if (route.query.genre) {
      selectedGenres.value = Array.isArray(route.query.genre)
        ? route.query.genre
        : [route.query.genre];
    }

    // Fetch Reveillon events
    // await eventsStore.getEventsByCategories(country.toUpperCase(), region, [
    //   "reveillon",
    // ]);

    await eventsStore.fetchEvents({ country: country.toUpperCase(), "region.id": region, "event_type": "reveillon" })
  } catch (error) {
    console.error("Error fetching Reveillon events:", error);
  }
});
</script>

<style lang="scss" scoped>
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

// Remove unnecessary img style</style>
