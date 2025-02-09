<template>
  <div class="d-flex flex-column" style="height: 100%">
    <event-list-country-select></event-list-country-select>
    <event-list-toolbar showJustCountry :routePath="route.fullPath"></event-list-toolbar>
    <div class="w-100" style="height: 0.6px; background-color: gray"></div>
    <router-view :key="route.fullPath"></router-view>
    <event-list-popular-news></event-list-popular-news>
    <event-list-links-footer></event-list-links-footer>
  </div>
</template>

<script setup>
import EventListCountrySelect from "@/components/events/EventListCountrySelect.vue";
import EventListLinksFooter from "@/components/events/EventListLinksFooter.vue";
import EventListPopularNews from "@/components/events/EventListPopularNews.vue";

// COMPONENTS
import EventListToolbar from "@/components/events/EventListToolbar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
