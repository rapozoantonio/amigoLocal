<template>
    <v-card v-if="event">
        <template #image>
            <v-img style="filter: blur(30px) brightness(0.3)"
                :src="event.image ? event.image?.url : event.flyerFront ? event.flyerFront.url : '/img/placeholder_event_1.jpg'"
                cover></v-img>
        </template>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-btn color="white" variant="plain" class="pl-0" size="small"
                        :to="{ name: 'events', params: { country: event.location.country, region: event.location.region.id || event.location.region } }">
                        <v-icon>mdi-chevron-left</v-icon>
                        <v-avatar class="mr-2 ml-1" size="20"><v-img
                                :src="'http://flagcdn.com/' + event.location.country.toLowerCase() + '.svg'"></v-img></v-avatar>
                        {{ event.location.region.name || event.location.region }}
                    </v-btn></v-col>
                <v-col cols="12" class="pt-0 d-flex align-center">
                    <v-row>
                        <v-col cols="auto">
                            <h1 class="text-h2 font-weight-bold">{{ event.name }}</h1>
                        </v-col>
                        <v-spacer></v-spacer>

                        <v-col cols="auto"> <follow-button @follow="follow" @unfollow="unfollow" entity="events"
                                :entity_id="event.id"></follow-button></v-col>
                    </v-row>
                    <!-- <h1 class="text-h2 font-weight-bold">{{ event.name }}</h1>
                    <v-spacer></v-spacer>
                    <follow-button @follow="follow" @unfollow="unfollow" entity="events"
                        :entity_id="event.id"></follow-button>
                         -->
                </v-col>
            </v-row>
            <v-row class="mb-5">
                <v-col cols="12" md="4" class="d-flex flex-column">
                    <p class="text-caption text-grey">Location</p>
                    <router-link v-if="event.location.id"
                        :to="{ name: 'location-info', params: { id: event.location.id } }" class="text-h6 link">{{
                            event.location.name }}</router-link>
                    <p v-else class="text-h6">{{ event.location.name }}</p>
                    <p class="text-caption">
                        {{ event.location.address }} {{ event.location.postalcode }} {{ event.location.city }},
                        {{ event.location.country }}
                    </p>
                </v-col>

                <v-col cols="6" md="2" class="d-flex flex-column">
                    <p class="text-caption text-grey">Date</p>
                    <p class="text-h6">{{ helpers.toDate(event.startDate) }}</p>
                    <p class="text-caption">{{ event.startTime }}{{ event.endTime ? " - " + event.endTime : "" }}</p>
                </v-col>

                <v-col cols="6" md="2" class="d-flex flex-column">
                    <p class="text-caption text-grey">Promoter</p>
                    <div>
                        <router-link :to="{ name: 'promoter-id', params: { id: event.promoter?.id } }" class="link">{{
                            event.promoter?.name }}</router-link>
                    </div>
                </v-col>

                <v-col cols="6" md="2" class="d-flex flex-column">
                    <p class="text-caption text-grey">Producer</p>
                    <div>
                        <router-link :to="{ name: 'producer-info', params: { id: event.producer?.id } }" class="link">{{
                            event.producer?.name }}</router-link>
                    </div>
                </v-col>
                <v-col cols="6" md="2" class="d-flex flex-column">
                    <p class="text-caption text-grey">Interesed</p>
                    <div class="d-flex justify-space-between align-center">
                        <span class="text-h6">{{ event.followers }}</span>

                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup>
import { inject } from 'vue';

import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

import { useEventsStore } from '@/store/events';

import FollowButton from '../interface/FollowButton.vue';

const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);

// const { event } = defineProps(["event"]);

const helpers = inject("$helpers")

function follow() {
    event.value.followers++
}

function unfollow() {
    event.value.followers--
}

console.log({ helpers })


</script>

<style lang="scss" scoped></style>