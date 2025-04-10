<template>
  <div class="d-flex flex-column" style="height: 100%">
    <event-list-region-select></event-list-region-select>
    <event-list-toolbar :routePath="route.fullPath"></event-list-toolbar>
    <div class="w-100" style="height: 0.6px; background-color: gray"></div>
    <router-view :key="route.fullPath"></router-view>
    <event-list-popular-news></event-list-popular-news>
    <event-list-links-footer></event-list-links-footer>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import EventListLinksFooter from "@/promotion/components/events/EventListLinksFooter.vue";
import EventListPopularNews from "@/promotion/components/events/EventListPopularNews.vue";

// COMPONENTS
import EventListRegionSelect from "@/promotion/components/events/EventListRegionSelect.vue";
import EventListToolbar from "@/promotion/components/events/EventListToolbar.vue";
const route = useRoute();
</script>
