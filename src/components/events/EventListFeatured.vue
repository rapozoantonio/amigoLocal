<template>
  <section class="bg-grey-darken-4 flex-grow-1">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <p class="text-caption text-grey-darken-1">
              {{ totalAmountOfUpcomingEvents }} próximos eventos
            </p>
            <p
              @click="removeFilters"
              v-if="selectedGenres && selectedGenres.length"
              class="text-caption"
            >
              <span class="mr-1">X</span> Remover filtros
            </p>
          </div>
        </v-col>
        <v-col cols="12">
          <p class="text-h4 text-primary font-weight-bold">🔥 Em Alta</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-slide-group :center-active="true">
            <v-slide-group-item
              v-for="event in featuredEvents"
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
  </section>
</template>

<script setup>
import { useEventsStore } from "@/store/events";
import { storeToRefs } from "pinia";
import EventCardVertical from "@/components/events/EventCardVertical.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const eventsStore = useEventsStore();

const removeFilters = () => {
  router.push({ query: { genre: [], categories: [], dateRange: [] } });
};

const { nextEvents, featuredEvents, loading, selectedGenres, filteredEvents } =
  storeToRefs(eventsStore);
const router = useRouter();
const totalAmountOfUpcomingEvents = ref(0);
watch(
  () => nextEvents.value,
  (newValue) => {
    if (
      newValue &&
      typeof newValue === "object" &&
      Object.keys(newValue).length
    ) {
      // Safely check if newValue is a valid object with keys
      totalAmountOfUpcomingEvents.value = Object.values(newValue).reduce(
        (total, events) => total + events.length,
        0
      );
    } else {
      totalAmountOfUpcomingEvents.value = 0;
    }
  },
  { deep: true } // Optional if structure can change deeply
);
</script>

<style lang="scss" scoped></style>
