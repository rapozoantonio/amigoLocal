<template>
  <v-card v-if="event">
    <template #image>
      <v-img style="filter: blur(30px) brightness(0.3)" :src="event.image?.url ||
        event.flyerFront?.url ||
        '/img/placeholder_event_1.jpg'
        " cover></v-img>
    </template>

    <!-- Mobile Layout -->
    <div class="d-md-none">
      <v-container class="pa-2 mt-3 mb-3">
        <!-- Navigation -->
        <v-row no-gutters class="align-center">
          <v-col cols="9">
            <v-btn color="white" variant="plain" size="small" :to="{
              name: 'events',
              params: {
                country: event.location ? event.location.country ? event.location.country : 'BR' : event.country ?? 'BR',
                region: event.location ? event.location.region ? event.location.region.id || event.location.region : 'riodejaneiro' : 'riodejaneiros',
              },
            }">
              <v-icon size="small">mdi-chevron-left</v-icon>
              <v-avatar class="mx-1" size="16">
                <v-img
                  :src="`http://flagcdn.com/${event.location && event.location.country ? event.location.country.toLowerCase() : 'br'}.svg`"></v-img>
              </v-avatar>
              <span class="text-caption">{{
                event.location?.region?.name || event.location?.region
              }}</span>
            </v-btn>
          </v-col>
          <v-col cols="3" class="d-flex justify-end">
            <follow-button @follow="follow" @unfollow="unfollow" entity="events" :entity_id="event.id"
              density="compact" />
          </v-col>
        </v-row>

        <!-- Title -->
        <v-row no-gutters class="mt-2">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold text-white">
              {{ event.name }}
            </h1>
          </v-col>
        </v-row>
        <!-- Essential Info -->
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex align-center text-caption text-grey-lighten-1 mt-1">
              <v-icon size="14" color="grey-lighten-1" class="mr-1">mdi-map-marker</v-icon>
              {{ event.location?.name }}

              <v-divider vertical class="mx-2" />

              <v-icon size="14" color="grey-lighten-1" class="mr-1">mdi-calendar</v-icon>
              {{ helpers.toDate(event.startDate) }}

              <v-divider vertical class="mx-2" />

              <v-icon size="14" color="grey-lighten-1" class="mr-1">mdi-account-group</v-icon>
              {{ event.followers }}
            </div>
          </v-col>
          <v-col>
            <div class="d-flex align-center text-caption text-grey-lighten-1 mt-1">
              <router-link :to="{
                name: 'promoter-id',
                params: { id: event.promoter?.id },
              }" class="">
                <v-icon size="14" class="mr-1">mdi-ticket</v-icon>
                {{ event.promoter?.name }}
              </router-link>
            </div>
          </v-col>
        </v-row>
        <!-- Music Types -->
        <v-row no-gutters class="mt-3">
          <v-col cols="12">
            <div class="d-flex overflow-x-auto hide-scrollbar">
              <v-chip v-for="genre in event.genres" :key="genre" size="x-small" label variant="outlined" color="primary"
                class="mr-1">
                {{ genre }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Desktop Layout - Keeping Original -->
    <div class="d-none d-md-block">
      <v-container>
        <!-- Navigation Row -->
        <v-row>
          <v-col cols="12">
            <v-btn color="white" variant="plain" class="pl-0" size="small" :to="{
              name: 'events',
              params: {
                country: event.location ? event.location.country ? event.location.country : 'BR' : event.country ?? 'BR',
                region: event.location ? event.location.region ? event.location.region.id || event.location.region : 'riodejaneiro' : 'riodejaneiros',
              },
            }">
              <v-icon>mdi-chevron-left</v-icon>
              <v-avatar class="mr-2 ml-1" size="20">
                <v-img
                  :src="`http://flagcdn.com/${event.location && event.location.country ? event.location.country.toLowerCase() : 'br'}.svg`"></v-img>
              </v-avatar>
              {{ event.location?.region?.name || event.location?.region }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- Title Row -->
        <v-row>
          <v-col cols="12" class="pt-0 d-flex align-center">
            <h1 :class="[
              'text-h2',
              'text-white',
              'font-weight-bold',
              'text-break',
              'my-4',
            ]">
              {{ event.name }}
            </h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4" class="d-flex flex-column">
            <p class="text-caption text-grey">Local</p>
            <router-link v-if="event.location?.id" :to="{ name: 'location-info', params: { id: event.location.id } }"
              class="text-h6 link">{{ event.location.name }}</router-link>
            <p v-else class="text-h6 link">{{ event.location?.name }}</p>
            <p class="text-caption text-grey">
              {{ event.location?.address }} {{ event.location?.postalcode }}
              {{ event.location?.city }}, {{ event.location?.country }}
            </p>
          </v-col>

          <v-col cols="6" md="2" class="d-flex flex-column">
            <p class="text-caption text-grey">Date</p>
            <p class="text-h6 text-white">
              {{ helpers.toDate(event.startDate) }}
            </p>
          </v-col>

          <v-col cols="6" md="2" class="d-flex flex-column">
            <p class="text-caption text-grey">Promoter</p>
            <div>
              <router-link :to="{
                name: 'promoter-id',
                params: { id: event.promoter?.id },
              }" class="link">{{ event.promoter?.name }}</router-link>
            </div>
          </v-col>

          <v-col cols="6" md="2" class="d-flex flex-column">
            <p class="text-caption text-grey">Produtora</p>
            <div>
              <router-link :to="{
                name: 'producer-info',
                params: { id: event.producer?.id },
              }" class="link">{{ event.producer?.name }}</router-link>
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
              <v-chip v-for="genre in event.genres" :key="genre" class="mr-2 mt-2" label variant="outlined" size="small"
                color="primary" link>
                {{ genre }}
              </v-chip>
            </div>
          </v-col>

          <v-divider class="mt-2"></v-divider>
          <v-col cols="12" class="d-flex flex-row justify-end mt-1 mb-1 px-4">
            <follow-button @follow="follow" @unfollow="unfollow" entity="events" :entity_id="event.id" />
            <div class="ml-3"><socials-share /></div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script setup>
import { inject } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { useEventsStore } from "@/store/events";
import FollowButton from "../interface/FollowButton.vue";
import SocialsShare from "@/components/social-media/SocialsShare.vue";
import { useDisplay } from "vuetify";

const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);
const helpers = inject("$helpers");

function follow() {
  event.value.followers++;
}

function unfollow() {
  event.value.followers--;
}
</script>

<style lang="scss" scoped>
.text-break {
  word-break: break-word;
  hyphens: auto;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.v-chip {
  margin-bottom: 0 !important;
}

.link {
  text-decoration: none;
  color: rgb(var(--v-theme-link-text));

  &:hover {
    color: rgb(var(--v-theme-primary));
  }
}
</style>
