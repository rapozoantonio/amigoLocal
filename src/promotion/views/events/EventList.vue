<template>
  <div class="d-flex flex-column" style="height: 100%">
    <event-list-region-select></event-list-region-select>
    <event-list-toolbar></event-list-toolbar>
    <event-list-next-events></event-list-next-events>
    <event-list-popular-news></event-list-popular-news>
    <event-list-links-footer></event-list-links-footer>
  </div>
</template>

<script setup>
import EventListRegionSelect from "@/promotion/components/events/EventListRegionSelect.vue";
import EventListToolbar from "@/promotion/components/events/EventListToolbar.vue";
import EventListNextEvents from "@/promotion/components/events/EventListNextEvents.vue";
import EventListPopularNews from "@/promotion/components/events/EventListPopularNews.vue";
import EventListLinksFooter from "@/promotion/components/events/EventListLinksFooter.vue";
import { useEventsStore } from "@/promotion/store/events";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";


const eventsStore = useEventsStore();
const { events } = storeToRefs(eventsStore);

const route = useRoute();

onMounted(() => {
  eventsStore.getEventsByRegion("BR");
});
</script>

<style lang="scss" scoped>
img {
  display: block;
  width: 100%;
}
</style>
