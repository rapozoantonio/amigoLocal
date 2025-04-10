<template>
  <v-card v-if="promoter" role="article" aria-label="Promoter Information">
    <template #image>
      <div class="pattern-black-red-bg" aria-hidden="true"></div>
    </template>
    <!-- Mobile Layout -->
    <div class="d-md-none">
      <v-container class="pa-2">
        <v-row no-gutters align="center">
          <v-col cols="auto" class="mr-3">
            <v-avatar size="96" class="elevation-1">
              <v-img
                :src="promoter.photoURL || '/default-avatar.png'"
                :alt="promoter.PromoterCode + ' avatar'"
                cover
                class="bg-grey-lighten-3"
              >
                <template v-slot:placeholder>
                  <v-icon size="96" color="grey-lighten-1">mdi-account</v-icon>
                </template>
              </v-img>
            </v-avatar>
          </v-col>
          <v-col>
            <h1 class="text-h4 font-weight-bold text-onSurface">
              {{ promoter.PromoterCode }}
            </h1>
            <v-row no-gutters>
              <v-col cols="12">
                <div
                  class="d-flex align-center text-caption text-grey-lighten-1 mt-1"
                  role="list"
                  aria-label="Promoter details"
                >
                  <template v-if="promoter.LocationArray?.length">
                    <div role="listitem">
                      <v-icon
                        size="14"
                        color="grey-lighten-1"
                        class="mr-1"
                        aria-hidden="true"
                        >mdi-map-marker</v-icon
                      >
                      <span>{{ promoter.LocationArray[0] }}</span>
                    </div>
                  </template>

                  <template
                    v-if="
                      promoter.LocationArray?.length &&
                      (promoter.MusicTypeArray?.length || promoter.Followers)
                    "
                  >
                    <v-divider vertical class="mx-2" aria-hidden="true" />
                  </template>

                  <template v-if="promoter.MusicTypeArray?.length">
                    <div role="listitem">
                      <v-icon
                        size="14"
                        color="grey-lighten-1"
                        class="mr-1"
                        aria-hidden="true"
                        >mdi-music</v-icon
                      >
                      <span>{{ promoter.MusicTypeArray.join(", ") }}</span>
                    </div>
                  </template>

                  <template
                    v-if="promoter.MusicTypeArray?.length && promoter.Followers"
                  >
                    <v-divider vertical class="mx-2" aria-hidden="true" />
                  </template>

                  <template v-if="promoter.Followers">
                    <div role="listitem">
                      <v-icon
                        size="14"
                        color="grey-lighten-1"
                        class="mr-1"
                        aria-hidden="true"
                        >mdi-account-group</v-icon
                      >
                      <span>{{ promoter.Followers }} followers</span>
                    </div>
                  </template>
                </div>
              </v-col>
            </v-row>

            <v-row no-gutters class="mt-1">
              <v-col cols="12">
                <div
                  class="d-flex overflow-x-auto hide-scrollbar"
                  role="group"
                  aria-label="Event categories"
                >
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
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Desktop Layout -->
    <div class="d-none d-md-block">
      <v-container class="pa-6">
        <!-- Header Section -->
        <v-row class="mb-8">
          <v-col cols="12" class="d-flex align-center">
            <v-avatar size="96" class="elevation-1 mr-6">
              <v-img
                :src="promoter.photoURL || '/default-avatar.png'"
                :alt="promoter.PromoterCode + ' avatar'"
                cover
                class="bg-grey-darken-3"
              >
                <template v-slot:placeholder>
                  <v-icon size="96" color="grey-darken-1">mdi-account</v-icon>
                </template>
              </v-img>
            </v-avatar>
            
            <div class="flex-grow-1">
              <h1 class="text-h3 font-weight-bold mb-4">{{ promoter.PromoterCode }}</h1>
              <follow-button
                @follow="follow"
                @unfollow="unfollow"
                entity="promoters"
                :entity_id="promoter.Id"
                :aria-label="`Follow ${promoter.PromoterCode}`"
                size="large"
              />
            </div>
          </v-col>
        </v-row>

        <!-- Info Grid -->
        <v-row class="mt-4">
          <v-col cols="3">
            <div class="mb-6">
              <div class="text-grey-darken-1 text-caption mb-1">Localização</div>
              <div class="text-subtitle-1">{{ promoter.LocationArray.join(", ") }}</div>
            </div>
          </v-col>
          
          <v-col cols="3">
            <div class="mb-6">
              <div class="text-grey-darken-1 text-caption mb-1">Última Atualização</div>
              <div class="text-subtitle-1">{{ helpers.toDate(promoter.LastUpdate) }}</div>
            </div>
          </v-col>
          
          <v-col cols="3">
            <div class="mb-6">
              <div class="text-grey-darken-1 text-caption mb-1">Nome</div>
              <div class="text-subtitle-1">{{ promoter.PromoterName }}</div>
            </div>
          </v-col>
          
          <v-col cols="3">
            <div class="mb-6">
              <div class="text-grey-darken-1 text-caption mb-1">Followers</div>
              <div class="text-h5">{{ promoter.Followers }}</div>
            </div>
          </v-col>
        </v-row>

        <!-- Categories and Music Types -->
        <v-row>
          <v-col cols="12" class="mb-6">
            <div class="text-grey-darken-1 text-caption mb-3">Categorias de Eventos</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="category in promoter.EventCategoryArray"
                :key="category"
                label
                variant="outlined"
                size="small"
                color="primary"
                class="mr-2 mb-2"
              >
                {{ category }}
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12">
            <div class="text-grey-darken-1 text-caption mb-3">Tipos de Música</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="genre in promoter.MusicTypeArray"
                :key="genre"
                label
                variant="outlined"
                size="small"
                color="primary"
                class="mr-2 mb-2"
              >
                {{ genre }}
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
