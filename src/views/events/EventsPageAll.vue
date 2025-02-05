<template>
  <div class="d-flex flex-column" style="height: 100%">
    <event-list-country-select></event-list-country-select>
    <event-list-toolbar showJustCountry></event-list-toolbar>
    <div class="w-100" style="height: 0.6px; background-color: gray"></div>
    <router-view :key="route.fullPath"></router-view>
    <event-list-popular-news></event-list-popular-news>
    <event-list-links-footer></event-list-links-footer>
  </div>
</template>

<script setup>
import EventListCountrySelect from "@/components/events/EventListCountrySelect.vue";
import EventListLinksFooter from "@/components/events/EventListLinksFooter.vue";
import EventListNextEvents from "@/components/events/EventListNextEvents.vue";
import EventListPopularNews from "@/components/events/EventListPopularNews.vue";

// COMPONENTS
import EventListRegionSelect from "@/components/events/EventListRegionSelect.vue";
import EventListToolbar from "@/components/events/EventListToolbar.vue";
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
</script>
