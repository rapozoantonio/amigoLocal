<template>
  <v-card v-if="event">
    <template #image>
      <v-img
        :src="computedImageSrc"
        style="filter: blur(30px) brightness(0.3)"
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
            <v-avatar class="mr-2 ml-1" size="20">
              <v-img
                :src="
                  'http://flagcdn.com/' +
                  event.location.country.toLowerCase() +
                  '.svg'
                "
              ></v-img>
            </v-avatar>
            {{ event.location.region.name || event.location.region }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="pt-0 d-flex align-center">
          <h1 class="text-h2 font-weight-bold flex-grow-1">
            {{ promoter.PromoterCode }}
          </h1>
          <follow-button
            @follow="follow"
            @unfollow="unfollow"
            entity="events"
            :entity_id="event.id"
          ></follow-button>
        </v-col>
      </v-row>
      <v-row class="mb-5">
        <v-col cols="12" md="4">
          <p class="text-caption text-grey">Localização</p>
          <p class="text-caption">
            {{ promoter.LocationArray.join(", ") }}
          </p>
        </v-col>
        <v-col cols="6" md="2">
          <p class="text-caption text-grey">Última Atualização</p>
          <p class="text-h6">{{ helpers.toDate(promoter.LastUpdate) }}</p>
        </v-col>
        <v-col cols="6" md="2">
          <p class="text-caption text-grey">Promoter</p>
          <router-link
            :to="{ name: 'promoter-id', params: { id: event.promoter?.id } }"
            class="link"
          >
            {{ event.promoter?.name }}
          </router-link>
        </v-col>
        <v-col cols="6" md="2">
          <p class="text-caption text-grey">Categorias de Eventos</p>
          <div class="d-flex">
            <v-chip
              v-for="category in promoter.EventCategoryArray"
              :key="category"
              class="mr-2"
              label
              variant="outlined"
              size="small"
              color="primary"
            >
              <span class="text-white"> {{ category }}</span>
            </v-chip>
          </div>
        </v-col>
        <v-col cols="6" md="2">
          <p class="text-caption text-grey">Followers</p>
          <span class="text-h6">{{ promoter.Followers }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="text-caption text-grey mb-2">Tipos de Música</p>
          <div class="d-flex">
            <v-chip
              v-for="genre in promoter.MusicTypeArray"
              class="mr-2"
              label
              variant="outlined"
              size="small"
              color="primary"
            >
              <span class="text-white">{{ genre }}</span>
            </v-chip>
          </div>
        </v-col>
        <v-col cols="auto">
          <span class="text-caption mr-4">Compartir</span>
          <!-- Social Media Sharing Buttons -->
          <v-btn
            class="ml-2 bordered-icon"
            @click="openInstagram"
            color="transparent"
            icon
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <v-btn
            class="ml-2 bordered-icon"
            @click="openInstagram"
            color="transparent"
            icon
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <v-btn
            class="ml-2 bordered-icon"
            @click="openWhatsapp"
            color="transparent"
            icon
          >
            <v-icon>mdi-whatsapp</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
//TODO: Add TikTok sharing and create necessary logic to it, remove vue-socials from other places as well
//TODO: Generate more events and add CTRL+C / CTRL+V functionality
//TODO: Create a prop on the filter for Carnaval/ Reveillon in the event save
//TODO: Update event creation to consider categories, carnaval, reveillon
//TODO: LastUpdate should be based on eventList, and tipos de music and eventCategori, based on eventList top 3
//TODO: Followers should be also based on sumTotaliNTEREST + PROMOTERInterest
// Vue Framework and Libraries Imports
import { defineProps, inject, ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { SFacebook, STwitter, SWhatsApp } from "vue-socials";
// Store and Components
import { useEventsStore } from "@/store/events";
import FollowButton from "../interface/FollowButton.vue";

// Store setup
const { promoter } = defineProps({
  promoter: Object,
});

const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);

// Injecting helpers from the root component or plugins
const helpers = inject("$helpers");

// Image Source Computation
const computedImageSrc = computed(() => {
  return "/img/placeholder_event_1.jpg";
});

// Social Share Options
const shareOptions = ref({
  url: "https://vue-advisor.web.app",
  quote: "Quote",
  hashtag: "#Jubilus",
});

const shareOptionsWS = ref({
  text: "See this event",
});

// Event Handlers for Social Sharing
function onClose() {}
function onOpen() {}
function onBlock() {}
function onFocus() {}

// Event Followers Handling
function follow() {
  event.value.followers++;
}

function unfollow() {
  event.value.followers--;
}

onMounted(() => {
  console.log("PromoterIdHeader.vue mounted", promoter);
});
</script>
<style scoped>
.bordered-icon {
  border: 1px solid white; /* Sets the border color to white and width to 2px */
  border-radius: 50%; /* Makes the border rounded */
}

.bordered-icon .v-icon {
  color: white; /* Ensures icon is white for visibility against the border */
}
</style>
