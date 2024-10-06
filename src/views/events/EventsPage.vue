<template>
    <div class="d-flex flex-column" style="height: 100%">
        <event-list-region-select></event-list-region-select>
        <event-list-toolbar></event-list-toolbar>
        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        <router-view :key="route.fullPath"></router-view>
        <event-list-popular-news></event-list-popular-news>
        <event-list-links-footer></event-list-links-footer>
    </div>
</template>

<script setup>
import {
  onMounted,
  onUpdated,
  watch,
} from 'vue';

import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

import EventListFeatured from '@/components/events/EventListFeatured.vue';
import EventListLinksFooter from '@/components/events/EventListLinksFooter.vue';
import EventListNextEvents from '@/components/events/EventListNextEvents.vue';
import EventListPopularNews from '@/components/events/EventListPopularNews.vue';
// COMPONENTS
import EventListRegionSelect
  from '@/components/events/EventListRegionSelect.vue';
import EventListToolbar from '@/components/events/EventListToolbar.vue';
// import { ref } from "vue";
import { useEventsStore } from '@/store/events';

const route = useRoute();
const eventsStore = useEventsStore();
const { events, nextEvents, loading, selectedGenres } = storeToRefs(eventsStore);

// URL PARAMS - route.params
const { country, region } = defineProps(["country", "region"]);


watch(() => route.query.genre, (newValue) => {
    selectedGenres.value = newValue
})

onMounted(() => {
    
    if (route.query.genre) {
        selectedGenres.value = typeof route.query.genre === "string" ? [route.query.genre] : route.query.genre
    }
    
    eventsStore.getEventsByRegion(country.toUpperCase(), region);
});
</script>

<style lang="scss" scoped>
img {
    display: block;
    width: 100%;
}
</style>