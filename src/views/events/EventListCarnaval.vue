<template>
  <div class="d-flex flex-column">
    <!-- <h2>All events</h2> -->
    <v-container v-if="!events">
      <v-progress-circular color="primary"></v-progress-circular>
    </v-container>
    <v-container v-else-if="events.length === 0">
      <v-alert icon="mdi-calendar-remove-outline"> Não ha eventos </v-alert>
    </v-container>
    <event-list-next-events
      v-if="events && events.length > 0"
    ></event-list-next-events>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

// COMPONENTS
import EventListNextEvents from "@/components/events/EventListNextEvents.vue";
import { useEventsStore } from "@/store/events";

const route = useRoute();
const eventsStore = useEventsStore();
const { events, nextEvents, loading, selectedGenres } =
  storeToRefs(eventsStore);

// URL PARAMS - route.params
const { country, region } = defineProps(["country", "region"]);

watch(
  () => route.query.genre,
  (newValue) => {
    selectedGenres.value = newValue;
  }
);

onMounted(() => {
  if (route.query.genre) {
    selectedGenres.value =
      typeof route.query.genre === "string"
        ? [route.query.genre]
        : route.query.genre;
  }
  eventsStore.getEventsByCategories(country.toUpperCase(), region, [
    "carnaval",
  ]);
});
</script>

<style lang="scss" scoped>
img {
  display: block;
  width: 100%;
}
</style>
