<template>
    <div>
        <div class="bg-black">
            <v-container>
                <v-row class="mb-5">
                    <v-col cols="4" class="d-flex flex-column">
                        <p class="text-caption text-grey">Location</p>
                        <p class="text-h6">{{ location.name }}</p>
                        <p class="text-caption">
                            {{ location.address }}, {{ location.postalcode }} - {{ location.city }}, {{ location.country
                            }}
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
                            <span class="text-h6">{{ location.followers }}</span>
                            <follow-button @follow="location.followers++" @unfollow="location.followers--"
                                entity="locations" :entity_id="id"></follow-button>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <event-list-next-events></event-list-next-events>

    </div>

</template>

<script setup>
import {
    onMounted,
    ref,
} from 'vue';

import { storeToRefs } from 'pinia';

import EventCardHorizontal from '@/components/events/EventCardHorizontal.vue';
import EventHorizontalList from '@/components/events/EventHorizontalList.vue';
import EventListNextEvents from '@/components/events/EventListNextEvents.vue';
import FollowButton from '@/components/interface/FollowButton.vue';
import CardMetric from '@/components/metrics/CardMetric.vue';
import { event } from '@/schemas/event.js';
import { useEventsStore } from '@/store/events';
import { useLocationsStore } from '@/store/locations';

const locationsStore = useLocationsStore();

const { location, id } = defineProps(["location", "id"]);
const eventStore = useEventsStore();

const { events, nextEvents } = storeToRefs(eventStore);

// const events = ref([]);
// const nextEvents = ref(null);
const eventsCount = ref(null);

onMounted(async () => {

    const response = await eventStore.getEventsByLocationId(id);
    console.log("location", response)
    if (response.ok) {
        console.log("data:", response.data);
        // events.value = response.data;
        // nextEvents.value = eventStore.eventsDateList(response.data);
    }

    eventsCount.value = await eventStore.countDocuments("events", ["location.id", "==", id])

})


</script>

<style lang="scss" scoped></style>