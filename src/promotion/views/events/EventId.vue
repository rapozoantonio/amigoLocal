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

import EventIdDetails from '@/promotion/components/events/EventIdDetails.vue';
import EventIdHeader from '@/promotion/components/events/EventIdHeader.vue';
import EventListLinksFooter from '@/promotion/components/events/EventListLinksFooter.vue';
import { useEventsStore } from '@/promotion/store/events';

// import EventListPopularNews from "@/promotion/components/events/EventListPopularNews.vue";

const { id } = defineProps(["id"]);

const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);

onMounted(() => {
    eventsStore.getEventById(id);
});
</script>

<style lang="scss" scoped></style>