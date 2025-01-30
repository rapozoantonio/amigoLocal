<template>
  <div class="d-flex flex-column" style="height: 100%">
    <event-list-region-select></event-list-region-select>
    <event-list-toolbar></event-list-toolbar>
    <event-list-featured></event-list-featured>
    <div class="w-100" style=" height: 0.6px; background-color: gray"></div>
    <router-view :key="route.fullPath"></router-view>
    <event-list-popular-news></event-list-popular-news>
    <event-list-links-footer></event-list-links-footer>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

import EventListFeatured from "@/components/events/EventListFeatured.vue";
import EventListLinksFooter from "@/components/events/EventListLinksFooter.vue";
import EventListNextEvents from "@/components/events/EventListNextEvents.vue";
import EventListPopularNews from "@/components/events/EventListPopularNews.vue";

// COMPONENTS
import EventListRegionSelect from "@/components/events/EventListRegionSelect.vue";
import EventListToolbar from "@/components/events/EventListToolbar.vue";

const route = useRoute();
</script>

<style lang="scss" scoped>
img {
  display: block;
  width: 100%;
}
</style>
