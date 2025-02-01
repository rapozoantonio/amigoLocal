<template>
    <div class="d-flex flex-column">
        <!-- <h2>New events</h2> -->
        <v-container v-if="!events">
            <v-progress-circular color="primary"></v-progress-circular>
        </v-container>
        <no-event-alert v-else-if="events.length === 0" />
        <event-list-featured v-if="events && events.length > 0"></event-list-featured>
        <event-list-next-events v-if="events && events.length > 0"></event-list-next-events>

    </div>
</template>

<script setup>
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';

// COMPONENTS
import EventListFeatured from '@/components/events/EventListFeatured.vue';
import EventListNextEvents from '@/components/events/EventListNextEvents.vue';
import NoEventAlert from "@/components/events/NoEventAlert.vue";
// import { ref } from "vue";
import { useEventsStore } from '@/store/events';
// URL PARAMS - route.params
const { country, region } = defineProps(["country", "region"]);

const eventsStore = useEventsStore();
const { events, nextEvents, loading } = storeToRefs(eventsStore);

onMounted(() => {
    
    if (route.query.genre) {
        selectedGenres.value = typeof route.query.genre === "string" ? [route.query.genre] : route.query.genre
    }

    if (route.query.category) {
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