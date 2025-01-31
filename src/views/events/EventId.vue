<template>
    <div v-if="event">
        <event-id-header :event="event"></event-id-header>
        <event-id-details :event="event"></event-id-details>
        <!-- <event-list-popular-news></event-list-popular-news> -->
        <event-list-links-footer></event-list-links-footer>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';

import EventIdDetails from '@/components/events/EventIdDetails.vue';
import EventIdHeader from '@/components/events/EventIdHeader.vue';
import EventListLinksFooter from '@/components/events/EventListLinksFooter.vue';
import { useEventsStore } from '@/store/events';

// import EventListPopularNews from "@/components/events/EventListPopularNews.vue";

const { id } = defineProps(["id"]);

const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);

onMounted(() => {
    eventsStore.getEventById(id);
});
</script>

<style lang="scss" scoped></style>