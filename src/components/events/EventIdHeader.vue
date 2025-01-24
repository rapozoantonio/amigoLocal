<template>
  <v-card v-if="event">
    <template #image>
      <v-img
        style="filter: blur(30px) brightness(0.3)"
        :src="
          event.image
            ? event.image?.url
            : event.flyerFront
            ? event.flyerFront.url
            : '/img/placeholder_event_1.jpg'
        "
        cover
      ></v-img>
    </template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-btn
            color="white"
            variant="plain"
            class="pl-0"
            size="small"
            :to="{
              name: 'events',
              params: {
                country: event.location.country,
                region: event.location.region.id || event.location.region,
              },
            }"
          >
            <v-icon>mdi-chevron-left</v-icon>
            <v-avatar class="mr-2 ml-1" size="20"
              ><v-img
                :src="
                  'http://flagcdn.com/' +
                  event.location.country.toLowerCase() +
                  '.svg'
                "
              ></v-img
            ></v-avatar>
            {{ event.location.region.name || event.location.region }}
          </v-btn></v-col
        >
        <v-col cols="12" class="pt-0 d-flex align-center">
          <v-row>
            <v-col cols="auto">
              <h1 class="text-h2 font-weight-bold text-white">{{ event.name }}</h1>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class=" ">
        <v-col cols="12" md="4" class="d-flex flex-column">
          <p class="text-caption text-grey">Local</p>
          <router-link
            v-if="event.location.id"
            :to="{ name: 'location-info', params: { id: event.location.id } }"
            class="text-h6 text-white"
            >{{ event.location.name }}</router-link
          >
          <p v-else class="text-h6 link">{{ event.location.name }}</p>
          <p class="text-caption text-grey">
            {{ event.location.address }} {{ event.location.postalcode }}
            {{ event.location.city }},
            {{ event.location.country }}
          </p>
        </v-col>

        <v-col cols="6" md="2" class="d-flex flex-column">
          <p class="text-caption text-grey">Date</p>
          <p class="text-h6 text-white">{{ helpers.toDate(event.startDate) }}</p>
          <p class="text-caption text-grey">
            {{ event.startTime
            }}{{ event.endTime ? " - " + event.endTime : "" }}
          </p>
        </v-col>

        <v-col cols="6" md="2" class="d-flex flex-column">
          <p class="text-caption text-grey">Promoter</p>
          <div>
            <router-link
              :to="{ name: 'promoter-id', params: { id: event.promoter?.id } }"
              class="link"
              >{{ event.promoter?.name }}</router-link
            >
          </div>
        </v-col>

        <v-col cols="6" md="2" class="d-flex flex-column">
          <p class="text-caption text-grey">Produtora</p>
          <div>
            <router-link
              :to="{
                name: 'producer-info',
                params: { id: event.producer?.id },
              }"
              class="link"
              >{{ event.producer?.name }}</router-link
            >
          </div>
        </v-col>
        <v-col cols="6" md="2" class="d-flex flex-column">
          <p class="text-caption text-grey">Interessados</p>
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 text-white">{{ event.followers }}</span>
          </div>
        </v-col>

        <v-col cols="12" class="d-flex flex-column">
          <p class="text-caption text-grey">Tipos de musica</p>
          <div class="d-flex flex-wrap">
            <v-chip
              class="mr-2 mt-2"
              label
              variant="outlined"
              size="small"
              color="primary"
              link
              v-for="genre in event.genres"
              :key="genre"
            >
              <span>
                {{ genre }}
              </span>
            </v-chip>
          </div>
        </v-col>
        <v-divider class="mt-2"></v-divider>
        <v-col cols="12" class="d-flex flex-row justify-end mt-1 mb-1 px-4">
          <follow-button
            @follow="follow"
            @unfollow="unfollow"
            entity="events"
            :entity_id="event.id" />
          <div class="ml-3"><socials-share /></div
        ></v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { inject } from "vue";

import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

import { useEventsStore } from "@/store/events";

import FollowButton from "../interface/FollowButton.vue";
import SocialsShare from "@/components/social-media/SocialsShare.vue";

const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);

// const { event } = defineProps(["event"]);

const helpers = inject("$helpers");

function follow() {
  event.value.followers++;
}

function unfollow() {
  event.value.followers--;
}
</script>

<style lang="scss" scoped></style>
