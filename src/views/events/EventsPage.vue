<template>
  <div class="d-flex flex-column" style="height: 100%">
    <event-list-region-select></event-list-region-select>
    <event-list-toolbar></event-list-toolbar>
    <div class="w-100" style="height: 0.6px; background-color: gray"></div>
    <router-view :key="route.fullPath"></router-view>
    <event-list-popular-news></event-list-popular-news>
    <event-list-links-footer></event-list-links-footer>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

import EventListLinksFooter from "@/components/events/EventListLinksFooter.vue";
import EventListNextEvents from "@/components/events/EventListNextEvents.vue";
import EventListPopularNews from "@/components/events/EventListPopularNews.vue";

// COMPONENTS
import EventListRegionSelect from "@/components/events/EventListRegionSelect.vue";
import EventListToolbar from "@/components/events/EventListToolbar.vue";
const route = useRoute();
</script>
