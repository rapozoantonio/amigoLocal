<template>
    <section class="flex-grow-1">
        <v-container>
            <v-row v-for="(events, day) in nextEvents" :key="day">
                <v-col cols="12">
                    <v-toolbar color="background" style="position: sticky; top: 48px; z-index: 999"
                        density="compact">
                        <v-toolbar-title>
                            <p class="text-h5">
                                <v-icon size="x-small">mdi-calendar</v-icon>
                                {{ day }}
                            </p>
                        </v-toolbar-title>
                    </v-toolbar>

                    <event-card-horizontal v-for="event in events" :key="event.id"
                        :event="event"></event-card-horizontal>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>

<script setup>
import { ref } from 'vue';

import { storeToRefs } from 'pinia';

import EventCardHorizontal from '@/components/events/EventCardHorizontal.vue';
import { useEventsStore } from '@/store/events';

const eventsStore = useEventsStore();

const { nextEvents } = storeToRefs(eventsStore);
</script>

<style lang="scss" scoped>
img {
    display: block;
    width: 100%;
}
</style>