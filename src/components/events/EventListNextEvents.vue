<template>
  <section class="flex-grow-1">
    <v-container>
      <!-- Loop through the days in nextEvents -->
      <v-row v-for="(events, day) in nextEvents" :key="day">
        <v-col cols="12">
          <event-calendar-divider-toolbar
            :day="day"
          ></event-calendar-divider-toolbar>
          <!-- Otherwise, show a skeleton placeholder -->
          <template v-if="isLoading">
            <v-skeleton-loader
              v-for="i in 3"
              :key="i"
              type="list-item-avatar"
              class="mb-2"
            />
          </template>
          <!-- If there are events, display them -->
          <template v-else>
            <card-horizontal
              v-for="event in events"
              :key="event.id"
              :event="event"
            />
          </template>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import CardHorizontal from "@/components/events/CardHorizontal.vue";
import EventCalendarDividerToolbar from "@/components/events/EventCalendarDividerToolbar.vue";
import { useEventsStore } from "@/store/events";

const eventsStore = useEventsStore();
const { nextEvents } = storeToRefs(eventsStore);
const loading = computed(() => eventsStore.loading("getEvents"));
</script>

<style lang="scss" scoped>
img {
  display: block;
  width: 100%;
}

.sticky-toolbar {
  position: sticky;
  top: 0;
  z-index: 4;
}
</style>
