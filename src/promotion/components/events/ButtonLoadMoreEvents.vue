<template>
    <v-row v-if="eventsStore.hasNextPage" class="text-center">
        <v-col cols="12">
            <v-btn @click="eventsStore.fetchNextPage" rounded="pill" variant="outlined" color="primary" class="px-6"
                aria-label="Load More Events">
                <span>Mais eventos</span>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { useEventsStore } from '@/promotion/store/events';
const eventsStore = useEventsStore();
</script>

<style lang="scss" scoped></style>
