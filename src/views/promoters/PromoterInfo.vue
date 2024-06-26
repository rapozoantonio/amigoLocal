<template>
    <div>
        <div class="bg-black">
            <v-container>
                <v-row class="mb-5">
                    <v-col cols="4" class="d-flex flex-column">
                        <p class="text-caption text-grey">Location</p>
                        <p class="text-h6">TBA - R. Comendador Nestor</p>
                        <p class="text-caption">
                            Av. Auro Soares de Moura Andrade, 141. 01155-040 São
                            Paulo, Brazil
                        </p>
                    </v-col>

                    <v-col cols="3" class="d-flex flex-column">
                        <p class="text-caption text-grey">Date</p>
                        <p class="text-h6">jue, 25 abr 2024</p>
                        <p class="text-caption">23:59 - 08:00</p>
                    </v-col>

                    <v-col cols="2" class="d-flex flex-column">
                        <p class="text-caption text-grey">Promoter</p>
                        <div>
                            <a>Amandava</a>
                        </div>
                    </v-col>
                    <v-col cols="3" class="d-flex flex-column">
                        <p class="text-caption text-grey">Interesed</p>
                        <div class="d-flex justify-space-between align-center">
                            <span class="text-h6">{{ entity }}</span>
                            <v-btn color="primary" rounded="pill" variant="outlined">
                                <v-icon start>mdi-account-plus-outline</v-icon>Interesed
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <section v-if="nextEvents" class="bg-grey-darken-4 flex-grow-1">
            <v-container>
                <v-row v-for="(events, day) in nextEvents" :key="day">
                    <v-col cols="12">
                        <v-toolbar color="grey-darken-4" density="compact"
                            style="position: sticky; top: 48px; z-index: 999">
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
        <!-- <pre>
            {{ events }}
        </pre> -->
    </div>

</template>

<script setup>
import {
    onMounted,
    ref,
} from 'vue';

import EventCardHorizontal from '@/components/events/EventCardHorizontal.vue';
import EventHorizontalList from '@/components/events/EventHorizontalList.vue';
import { event } from '@/schemas/event.js';
import { useEventsStore } from '@/store/events';

const { id } = defineProps(["id"]);

const eventStore = useEventsStore();

const events = ref([]);
const nextEvents = ref(null);

onMounted(async () => {

    const response = await eventStore.getEventsByPromoterId(id);
    console.log("promoter", response)
    if (response.ok) {
        console.log("data:", response.data);
        events.value = response.data;
        nextEvents.value = eventStore.eventsDateList(response.data);
    }

})



</script>

<style lang="scss" scoped></style>