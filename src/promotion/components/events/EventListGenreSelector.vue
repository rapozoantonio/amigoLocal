<template>
  <div class="d-inline-flex">
    <v-btn :color="selectedGenres?.length > 0 ? '' : ''" :variant="selectedGenres?.length > 0 ? 'flat' : 'outlined'"
      rounded="pill" class="text-caption px-6" @click="openSelector">Genero
      <span class="ml-1" v-if="selectedGenres?.length > 0">({{ selectedGenres.length }})</span></v-btn>
    <v-navigation-drawer class="navigation text-left" floating temporary width="350" location="right"
      v-model="genreSelectionOpened">
      <!-- <v-list >
                  <v-list-item v-for="(genre) in genres" :key="genre" :to="{ query: { genre } }" link>
  
                      <v-list-item-title> {{ genre }} </v-list-item-title>
                  </v-list-item>
              </v-list> -->

      <template v-slot:prepend>
        <p class="pl-4 text-caption mt-4" style="color: rgba(255, 255, 255, 0.3); letter-spacing: 0.2em">
          Genero
        </p>
        <v-text-field variant="plain" class="pl-4 font-weight-bold text-h1" placeholder="Procure por um genero"
          v-model="search"></v-text-field>
      </template>

      <v-item-group multiple v-model="selectedGenresLocal">
        <p class="text-caption my-4 pl-4">
          Todos os generos <span class="ml-2">({{ genres.length }})</span>
        </p>
        <v-item v-for="genre in filteredGenres" :key="genre" v-slot="{ isSelected, toggle }" :value="genre">
          <v-list-item :disabled="eventsStore.getCountByGenre(genre) === 0 ? true : false" class="py-1"
            :class="[isSelected ? 'text-primary ' : '']" @click="toggle">
            <v-list-item-title class="text-h6 font-weight-semibold">
              {{ genre }}
            </v-list-item-title>
            <template v-slot:append>
              <span>
                {{ eventsStore.getCountByGenre(genre) }}
              </span>
            </template>
          </v-list-item>
        </v-item>
      </v-item-group>

      <template v-slot:append>
        <div class="d-flex align-center justify-space-between mb-4 mt-4 pt-4 pb-1 px-4">
          <v-btn variant="outlined" rounded="pill" @click="restabelecer"
            :disabled="!selectedGenresLocal.length">Resetar</v-btn>
          <v-btn color="primary" variant="flat" rounded="pill" @click="buscar">Mostrar {{ filterAmount }}
            resultados</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useConfigStore } from "@/promotion/store/config";
import { useEventsStore } from "@/promotion/store/events";

const eventsStore = useEventsStore();
const { selectedGenres } = storeToRefs(eventsStore);

// const { selectedGenres } = storeToRefs(eventsStore);
const { genres } = storeToRefs(useConfigStore());
const router = useRouter();
const route = useRoute();
const genreSelectionOpened = ref(false);
const selectedGenresLocal = ref([]);
const search = ref(null);
const { getUpcomingEventsFilteredByDateAndCategories } =
  storeToRefs(eventsStore);

const filteredGenres = computed(() => {
  return search.value && search.value !== ""
    ? genres.value.filter((g) => new RegExp(search.value, "gi").test(g))
    : genres.value;
});

function restabelecer() {
  selectedGenresLocal.value = [];
}

function openSelector() {
  selectedGenresLocal.value = route.query.genre ? route.query.genre : [];
  genreSelectionOpened.value = true;
}

async function buscar() {
  await router.push({ query: { ...route.query, genre: selectedGenresLocal.value } });
  // const query = eventsStore.getRouteQueryParams();
  // if (route.params.country) {
  //   query.country = route.params.country.toUpperCase();
  // }
  // if (route.params.region) {
  //   query["region.id"] = route.params.region;
  // }
  // console.log("query buscar", query)
  // eventsStore.fetchEvents({ ...query })
  // genreSelectionOpened.value = false;
}

//http://localhost:3001/events/BR/riodejaneiro?genre=Funk&categories=dayparty

onMounted(() => {
  if (route.query.genre) {
    selectedGenresLocal.value = route.query.genre;
  }
});

const filterAmount = computed(() => {
  if (selectedGenresLocal.value && selectedGenresLocal.value.length > 0) {
    return eventsStore.getFilteredByGenreUpcomingEvents(
      selectedGenresLocal.value
    );
  } else {
    return getUpcomingEventsFilteredByDateAndCategories.value;
  }
});
</script>

<style lang="scss">
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
}
</style>
