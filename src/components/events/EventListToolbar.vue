<template>
  <div class="bg-black">
    <v-container>
      <v-row>
        <v-col cols="12">
          <event-category-tabs use-routing />
          <div class="d-flex mt-4">
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
</script>