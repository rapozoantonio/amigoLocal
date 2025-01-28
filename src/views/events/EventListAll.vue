<template>
  <section class="bg-grey-darken-4 flex-grow-1">
    <v-container>
      <v-row v-for="(events, day) in nextEvents" :key="day">
        <v-col cols="12">
          <v-toolbar
            color="grey-darken-4"
            style="position: sticky; top: 48px; z-index: 999"
            density="compact"
          >
            <v-toolbar-title>
              <p color="primary" class="text-h5">
                <v-icon size="x-small">mdi-calendar</v-icon>
                {{ day }}
              </p>
            </v-toolbar-title>
          </v-toolbar>

          <event-card-horizontal
            v-for="event in events"
            :key="event.id"
            :event="event"
          ></event-card-horizontal>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// COMPONENTS
import EventListFeatured from "@/components/events/EventListFeatured.vue";
import EventListNextEvents from "@/components/events/EventListNextEvents.vue";

import EventCardHorizontal from "@/components/events/EventCardHorizontal.vue";

import { useEventsStore } from "@/store/events";

const route = useRoute();
const eventsStore = useEventsStore();
const router = useRouter();

const {
  events,
  nextEvents,
  loading,
  selectedGenres,
  selectedCategories,
  selectedDateRange,
} = storeToRefs(eventsStore);

// URL PARAMS - route.params
const { country, region } = defineProps(["country", "region"]);

watch(
  () => route.query.genre,
  (newValue) => {
    selectedGenres.value = newValue;
  }
);

watch(
  () => route.query.categories,
  (newValue) => {
    selectedTypes.value = newValue;
  }
);

watch(
  () => route.query.dateRange,
  (newValue) => {
    selectedTypes.value = newValue;
  }
);

onMounted(() => {
  if (route.query.genre) {
    selectedGenres.value =
      typeof route.query.genre === "string"
        ? [route.query.genre]
        : route.query.genre;
  }
  if (route.query.categories) {
    selectedCategories.value =
      typeof route.query.categories === "string"
        ? [route.query.categories]
        : route.query.categories;
  }
  if (route.query.dateRange) {
    selectedDateRange.value =
      typeof route.query.dateRange === "string"
        ? [route.query.dateRange]
        : route.query.dateRange;
  }
  eventsStore.getEventsByRegion(country.toUpperCase(), region);
});
</script>

//http://localhost:3001/events/BR/riodejaneiro?genre=Funk&genre=Sertanejo&categories=dayparty&categories=openbar

<!-- <style lang="scss" scoped>
img {
  display: block;
  width: 100%;
}
</style> -->
