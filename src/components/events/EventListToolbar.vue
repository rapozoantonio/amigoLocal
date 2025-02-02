<template>
  <div class="bg-black">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <event-category-tabs use-routing />

        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <div class="d-flex justify-center">
            <event-list-date-selector class="mr-2" />
            <event-list-genre-selector class="mr-2" />
            <event-list-type-of-event-selector />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
import EventCategoryTabs from "./EventCategoryTabs.vue";
import EventListGenreSelector from "./EventListGenreSelector.vue";
import EventListDateSelector from "./EventListDateSelector.vue";
import EventListTypeOfEventSelector from "./EventListTypeOfEventSelector.vue";

import { useDisplay } from "vuetify/lib/framework.mjs";

const { name, mdAndDown, lgAndDown } = useDisplay();

</script>