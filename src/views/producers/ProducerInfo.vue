<template>
    <div v-if="producer">
        <div class="bg-black">
            <v-container>
                <v-row>
                    <v-col cols="3" class="d-flex flex-column">
                        <card-metric :count="eventsCount" icon="mdi-calendar-check-outline"
                            title="Eventos"></card-metric>
                    </v-col>

                    <v-col cols="3" class="d-flex flex-column">
                        <card-metric :count="producer.followers" icon="mdi-heart" title="Seguidores"></card-metric>
                    </v-col>

                    <v-spacer></v-spacer>

                    <v-col cols="3" class="d-flex justify-end">
                        <div class="d-flex justify-end align-center">
                            <follow-button @follow="addFollower" @unfollow="removeFollower" entity="producers"
                                :entity_id="id"></follow-button>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>



        <event-list-next-events></event-list-next-events>


        <section v-if="false" class="flex-grow-1">
            <v-container>
                <v-row v-for="(events, day) in nextEvents" :key="day">
                    <v-col cols="12">
                        <v-toolbar color="background"density="compact"
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

import { storeToRefs } from 'pinia';

import EventCardHorizontal from '@/components/events/EventCardHorizontal.vue';
import EventHorizontalList from '@/components/events/EventHorizontalList.vue';
import EventListNextEvents from '@/components/events/EventListNextEvents.vue';
import FollowButton from '@/components/interface/FollowButton.vue';
import CardMetric from '@/components/metrics/CardMetric.vue';
import { event } from '@/schemas/event.js';
import { useEventsStore } from '@/store/events';
import { useProducersStore } from '@/store/producers';

const producersStore = useProducersStore();

const { producer } = storeToRefs(producersStore);

const { id } = defineProps(["id"]);

const eventStore = useEventsStore();

const events = ref([]);
const nextEvents = ref(null);
const eventsCount = ref(null);

function addFollower() {
    producer.value.followers++
}
function removeFollower() {
    producer.value.followers--
}

onMounted(async () => {

    const response = await eventStore.getEventsByProducerId(id);
    
    if (response.ok) {
        
        events.value = response.data;
        nextEvents.value = eventStore.eventsDateList(response.data);
    }

    eventsCount.value = await eventStore.countDocuments("events", ["producer.id", "==", id])

})



</script>

<style lang="scss" scoped></style>