<template>
  <EventListFeatured />

  <div class="d-flex flex-column">
    <v-container v-if="loading?.value">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </v-container>

    <!-- Events List -->
    <event-list-next-events v-else :events="events"></event-list-next-events>
    <button-load-more-events></button-load-more-events>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import EventListFeatured from "@/promotion/components/events/EventListFeatured.vue";
import EventListNextEvents from "@/promotion/components/events/EventListNextEvents.vue";
import { useEventsStore } from "@/promotion/store/events";
import ButtonLoadMoreEvents from "@/promotion/components/events/ButtonLoadMoreEvents.vue";
const route = useRoute();
const eventsStore = useEventsStore();
const { events, nextEvents, loading, selectedGenres } =
  storeToRefs(eventsStore);

const { country, region } = defineProps({
  country: { type: String, required: true },
});

watch(
  () => route.query.genre,
  (newValue) => {
    selectedGenres.value = newValue;
  }
);

onMounted(async () => {
  try {
    if (route.query.genre) {
      selectedGenres.value = Array.isArray(route.query.genre)
        ? route.query.genre
        : [route.query.genre];
    }

    await eventsStore.fetchEvents({
      country: country.toUpperCase(),
      "event_type": "carnaval",
    });
  } catch (error) {
    console.error("Error fetching Carnaval events:", error);
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
</style>
