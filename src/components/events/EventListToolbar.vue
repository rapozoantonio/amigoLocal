<template>
  <div class="bg-black" color="#000">
    <v-container>
      <v-col class="d-flex flex-column">
        <v-row cols="auto" class="mb-4">
          <v-tabs color="primary" density="compact">
            <v-tab
              exact
              variant="text"
              size="small"
              style="text-transform: none"
              :to="{ name: 'events', query: route.query }"
            >
              All
            </v-tab>
            <v-tab
              exact
              variant="text"
              size="small"
              style="text-transform: none"
              :to="{ name: 'events-carnaval', query: route.query }"
            >
              Carnaval
            </v-tab>
            <v-tab
              exact
              variant="text"
              size="small"
              style="text-transform: none"
              :to="{ name: 'events-reveillon', query: route.query }"
            >
              Reveillon
            </v-tab>
          </v-tabs>
        </v-row>
        <v-row cols="auto">
          <event-list-date-selector class="mr-2"></event-list-date-selector>
          <event-list-genre-selector class="mr-2"></event-list-genre-selector>
          <event-list-type-of-event-selector></event-list-type-of-event-selector>
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

import EventListGenreSelector from "./EventListGenreSelector.vue";
import EventListDateSelector from "./EventListDateSelector.vue";
import EventListTypeOfEventSelector from "./EventListTypeOfEventSelector.vue";

const route = useRoute();
</script>
