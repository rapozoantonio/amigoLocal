<template>
  <div class="d-inline-flex">
    <v-btn :color="selectedCategories?.length > 0 ? '' : ''"
      :variant="selectedCategories?.length > 0 ? 'flat' : 'outlined'" rounded="pill" class="text-caption px-6"
      @click="openSelector">Tipos de Evento
      <span class="ml-1" v-if="selectedCategories?.length > 0">({{ selectedCategories.length }})</span></v-btn>
    <v-navigation-drawer class="navigation text-left" floating temporary width="350" location="right"
      v-model="typesSelectionOpened">
      <v-item-group multiple v-model="selectedeventTypesLocal">
        <p class="text-caption my-4 pl-4">
          Tipos de Eventos <span class="ml-2">({{ eventTypes.length }})</span>
        </p>

        <v-item v-for="type in eventTypes" :key="type" :value="type" v-slot="{ isSelected, toggle }">
          <v-list-item class="py-1" :class="[isSelected ? 'text-primary' : '']" @click="toggle">
            <v-list-item-title class="text-h6 font-weight-semibold">
              {{ type }}
            </v-list-item-title>
            <template v-slot:append>
              <span>
                {{ eventsStore.getCountByCategorie(type) }}
              </span>
            </template>
          </v-list-item>
        </v-item>
      </v-item-group>

      <template v-slot:append>
        <div class="d-flex align-center justify-space-between mb-4 mt-4 pt-4 pb-1 px-4">
          <v-btn variant="outlined" rounded="pill" @click="restabelecer"
            :disabled="!selectedeventTypesLocal || !selectedeventTypesLocal.length">Resetar</v-btn>
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

import { useConfigStore } from "@/store/config";
import { useEventsStore } from "@/store/events";

const eventsStore = useEventsStore();
const { selectedCategories } = storeToRefs(eventsStore);

// const { selectedGenres } = storeToRefs(eventsStore);

const eventTypes = ["open bar", "day party", "lista amiga"];
//http://localhost:3001/events/BR/riodejaneiro?categories=day+party

const router = useRouter();
const route = useRoute();
const typesSelectionOpened = ref(false);
const selectedeventTypesLocal = ref([]);
const { getUpcomingEventsFilteredByDateAndGenre } = storeToRefs(eventsStore);

function restabelecer() {
  selectedeventTypesLocal.value = [];
}

function openSelector() {
  //   selectedGenresLocal.value = route.query.genre ? route.query.genre : [];
  selectedeventTypesLocal.value = route.query.categories
    ? route.query.categories
    : [];
  typesSelectionOpened.value = true;
}

function buscar() {
  console.log({ selectedeventTypesLocal: selectedeventTypesLocal.value })
  const query = selectedeventTypesLocal.value.reduce((acc, type) => {
    acc[type.replace(/ /gi, "_").toLowerCase()] = true;
    return acc
  }, {})
  delete route.query.open_bar;
  delete route.query.day_party;
  delete route.query.lista_amiga;
  router.push({
    query: { ...route.query, ...query },
  });
  typesSelectionOpened.value = false;

}

onMounted(() => {
  if (route.query.categories) {
    selectedeventTypesLocal.value = route.query.categories;
    // selectedGenresLocal.value = route.query.genre;
  }
});

const filterAmount = computed(() => {
  if (
    selectedeventTypesLocal.value &&
    selectedeventTypesLocal.value.length > 0
  ) {
    return eventsStore.getFilteredByCategoriesUpcomingEvents(
      selectedeventTypesLocal.value
    );
  } else {
    return getUpcomingEventsFilteredByDateAndGenre.value;
  }
});
</script>

<style lang="scss">
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
}
</style>
