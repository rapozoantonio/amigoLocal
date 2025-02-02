<template>
  <v-card v-if="promoter" role="article" aria-label="Promoter Information">
    <template #image>
      <div class="pattern-black-red-bg" aria-hidden="true"></div>
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
              :aria-label="`Return to events in ${
                promoter.region?.name || 'Brazil'
              }`"
            >
              <v-icon size="small" aria-hidden="true">mdi-chevron-left</v-icon>
              <v-avatar class="mx-1" size="16" aria-hidden="true">
                <v-img
                  src="http://flagcdn.com/br.svg"
                  alt="Brazil flag"
                ></v-img>
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
              :aria-label="`Follow ${promoter.PromoterCode}`"
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
              :aria-label="`Return to events in ${
                promoter.region?.name || 'Brazil'
              }`"
            >
              <v-icon aria-hidden="true">mdi-chevron-left</v-icon>
              <v-avatar class="mr-2 ml-1" size="20" aria-hidden="true">
                <v-img
                  src="http://flagcdn.com/br.svg"
                  alt="Brazil flag"
                ></v-img>
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
              :aria-label="`Follow ${promoter.PromoterCode}`"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <dl>
              <dt class="text-caption text-grey">Localização</dt>
              <dd class="text-caption text-grey">
                {{ promoter.LocationArray.join(", ") }}
              </dd>
            </dl>
          </v-col>
          <v-col cols="6" md="2">
            <dl>
              <dt class="text-caption text-grey">Última Atualização</dt>
              <dd class="text-caption text-grey">
                {{ helpers.toDate(promoter.LastUpdate) }}
              </dd>
            </dl>
          </v-col>
          <v-col cols="6" md="2">
            <dl>
              <dt class="text-caption text-grey">Nome</dt>
              <dd class="text-caption text-grey">
                {{ promoter.PromoterName }}
              </dd>
            </dl>
          </v-col>
          <v-col cols="6" md="2">
            <div role="region" aria-label="Event categories">
              <h2 class="text-caption text-grey">Categorias de Eventos</h2>
              <div class="d-flex flex-wrap" role="group">
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
            </div>
          </v-col>
          <v-col cols="6" md="2">
            <dl>
              <dt class="text-caption text-grey">Followers</dt>
              <dd class="text-h6">{{ promoter.Followers }}</dd>
            </dl>
          </v-col>
          <v-col cols="12" md="4">
            <div role="region" aria-label="Music types">
              <h2 class="text-caption text-grey mb-2">Tipos de Música</h2>
              <div class="d-flex flex-wrap" role="group">
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

const computedImageSrc = computed(() => "/img/placeholder_event_1.webp");

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
