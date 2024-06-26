<template>
    <div class="d-flex flex-column">
        <!-- <h2>Events For you</h2> -->
        <v-container v-if="!events">
            <v-progress-circular color="primary"></v-progress-circular>
        </v-container>
        <v-container v-else-if="events.length === 0">
            <v-alert icon="mdi-calendar-remove-outline"> Não ha eventos </v-alert>
        </v-container>

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
// import { ref } from "vue";
import { useEventsStore } from '@/store/events';

const eventsStore = useEventsStore();
const { events, nextEvents, loading } = storeToRefs(eventsStore);


</script>

<style lang="scss" scoped>
img {
    display: block;
    width: 100%;
}
</style>