<template>
    <div>
        <v-toolbar color="grey-darken-4" style="position: sticky; top: 48px; z-index: 999">
            <v-toolbar-title>
                <p class="text-h5">
                    <v-icon size="x-small">mdi-calendar</v-icon>
                    {{ day }}
                </p>
            </v-toolbar-title>
        </v-toolbar>

        <v-col v-for="event in events" :key="event.id">
            <v-divider class="mb-2"></v-divider>
            <event-card-horizontal :event="event"></event-card-horizontal>
            <pre>
                {{ events }}
            </pre>
        </v-col>
    </div>
</template>

<script setup>
import EventCardHorizontal from '@/components/events/EventCardHorizontal.vue';

const { events } = defineProps(["events"]);
</script>

<style lang="scss" scoped></style>