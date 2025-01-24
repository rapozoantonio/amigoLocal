<template>
  <v-card v-if="promoter">
    <template #image>
      <v-img
        :src="computedImageSrc"
        style="filter: blur(30px) brightness(0.3)"
        cover
      ></v-img>
    </template>

    <!-- Mobile Layout -->
    <div class="d-md-none">
      <v-container class="pa-2">
        <v-row no-gutters class="align-center">
          <v-col cols="9">
            <v-btn
              :to="{
                name: 'events',
                params: {
                  country: promoter.country || 'BR',
                  region: promoter.region?.id || 'riodejaneiro', 
                },
              }"
            >
              <v-icon size="small">mdi-chevron-left</v-icon>
              <v-avatar class="mx-1" size="16">
                <v-img src="http://flagcdn.com/br.svg"></v-img>
              </v-avatar>
              <span class="text-caption">{{ promoter.region?.name }}</span>
            </v-btn>
          </v-col>
          <v-col cols="3" class="d-flex justify-end">
            <follow-button
              @follow="follow"
              @unfollow="unfollow"
              entity="promoters"
              :entity_id="promoter.Id"
              density="compact"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-2">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold text-onSurface">
              {{ promoter.PromoterCode }}
            </h1>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <p class="text-caption text-grey-lighten-1">
              {{ promoter.LocationArray[0] }} •
              {{ promoter.MusicTypeArray.join(", ") }} •
              {{ promoter.Followers }} followers
            </p>
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-1">
          <v-col cols="12">
            <div class="d-flex overflow-x-auto hide-scrollbar">
              <v-chip
                v-for="category in promoter.EventCategoryArray"
                :key="category"
                size="x-small"
                label
                variant="outlined"
                color="primary"
                class="mr-1"
              >
                <span>{{ category }}</span>
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Desktop Layout -->
    <div class="d-none d-md-block">
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
                  country: promoter.country || 'BR',
                  region: promoter.region?.id,
                },
              }"
            >
              <v-icon>mdi-chevron-left</v-icon>
              <v-avatar class="mr-2 ml-1" size="20">
                <v-img src="http://flagcdn.com/br.svg"></v-img>
              </v-avatar>
              {{ promoter.region?.name }}
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="pt-0 d-flex align-start">
          <v-col cols="12" md="10">
            <h1 class="text-h2 font-weight-bold flex-grow-1 text-onSurface">
              {{ promoter.PromoterCode }}
            </h1>
          </v-col>
          <v-col cols="12" md="2" class="d-flex justify-end">
            <follow-button
              @follow="follow"
              @unfollow="unfollow"
              entity="promoters"
              :entity_id="promoter.Id"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <p class="text-caption text-grey">Localização</p>
            <p class="text-caption text-grey">
              {{ promoter.LocationArray.join(", ") }}
            </p>
          </v-col>
          <v-col cols="6" md="2">
            <p class="text-caption text-grey">Última Atualização</p>
            <p class="text-caption text-grey">
              {{ helpers.toDate(promoter.LastUpdate) }}
            </p>
          </v-col>
          <v-col cols="6" md="2">
            <p class="text-caption text-grey">Nome</p>
            <p class="text-caption text-grey">{{ promoter.PromoterName }}</p>
          </v-col>
          <v-col cols="6" md="2">
            <p class="text-caption text-grey">Categorias de Eventos</p>
            <div class="d-flex flex-wrap">
              <v-chip
                v-for="category in promoter.EventCategoryArray"
                :key="category"
                class="mr-2 mb-2"
                label
                variant="outlined"
                size="small"
                color="primary"
              >
                <span>{{ category }}</span>
              </v-chip>
            </div>
          </v-col>
          <v-col cols="6" md="2">
            <p class="text-caption text-grey">Followers</p>
            <span class="text-h6 text-white">{{ promoter.Followers }}</span>
          </v-col>
          <v-col cols="12" md="4">
            <p class="text-caption text-grey mb-2">Tipos de Música</p>
            <div class="d-flex flex-wrap">
              <v-chip
                v-for="genre in promoter.MusicTypeArray"
                :key="genre"
                class="mr-2 mb-2"
                label
                variant="outlined"
                size="small"
                color="primary"
              >
                <span>{{ genre }}</span>
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script setup>
import { defineProps, inject, computed } from "vue";
import { RouterLink } from "vue-router";
import FollowButton from "../interface/FollowButton.vue";

const props = defineProps({
  promoter: {
    type: Object,
    required: true,
  },
});

const helpers = inject("$helpers");

const computedImageSrc = computed(() => "/img/placeholder_event_1.jpg");

function follow() {
  props.promoter.Followers++;
}

function unfollow() {
  props.promoter.Followers--;
}
</script>

<style scoped>
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
</style>
