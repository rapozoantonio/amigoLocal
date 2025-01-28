<template>
  <div class="d-inline-flex">
    <v-btn
      :color="selectedDateRange?.length > 0 ? '' : ''"
      :variant="selectedDateRange?.length > 0 ? 'flat' : 'outlined'"
      rounded="pill"
      class="text-caption px-6"
      @click="openSelector"
      >Data
      <span class="ml-1" v-if="selectedDateRange?.length > 0"
        >({{ selectedDateRange.length }})</span
      ></v-btn
    >
    <v-navigation-drawer
      class="navigation"
      floating
      temporary
      width="350"
      location="right"
      v-model="dateRangeSelectionOpened"
    >
      <!-- <v-list >
                  <v-list-item v-for="(genre) in genres" :key="genre" :to="{ query: { genre } }" link>
  
                      <v-list-item-title> {{ genre }} </v-list-item-title>
                  </v-list-item>
              </v-list> -->

      <template v-slot:prepend>
        <p
          class="pl-4 text-caption mt-4"
          style="color: rgba(255, 255, 255, 0.3); letter-spacing: 0.2em"
        >
          Data
        </p>
        <v-container>
          <v-date-picker
            v-model="selectedDateRangeLocal"
            locale="pt-BR"
            multiple="range"
            elevation="2"
          ></v-date-picker>
        </v-container>
      </template>
      <v-col class="px-4 mt-2">
        <p
          class=""
          style="color: rgba(255, 255, 255, 0.3); letter-spacing: 0.1em"
        >
          Datas selecionadas:
        </p>

        <v-col class="mt-4">
          <v-row style="color: rgba(255, 255, 255, 0.3); letter-spacing: 0.1em"
            >Do dia:
            <span v-if="formatDate(selectedDateRangeLocal[0])" class="ml-2"
              >{{ formatDate(selectedDateRangeLocal[0]) }}
            </span>
            <span
              v-else
              class="ml-2"
              style="color: rgba(255, 255, 255, 0.2); letter-spacing: 0.1em"
              >escolha uma data
            </span></v-row
          >
          <v-row
            class="mt-3"
            style="color: rgba(255, 255, 255, 0.3); letter-spacing: 0.1em"
            >Até o dia:<span
              v-if="
                formatDate(
                  selectedDateRangeLocal[selectedDateRangeLocal.length - 1]
                )
              "
              class="ml-2"
              >{{
                formatDate(
                  selectedDateRangeLocal[selectedDateRangeLocal.length - 1]
                )
              }}</span
            >
            <span
              v-else
              class="ml-2"
              style="color: rgba(255, 255, 255, 0.2); letter-spacing: 0.1em"
              >escolha uma data
            </span>
          </v-row>
        </v-col>
      </v-col>

      <template v-slot:append>
        <div
          class="d-flex align-center justify-space-between mb-4 mt-4 pt-4 pb-1 px-4"
        >
          <v-btn
            variant="outlined"
            rounded="pill"
            @click="restabelecer"
            :disabled="!selectedDateRangeLocal?.length"
            >Resetar</v-btn
          >
          <v-btn color="primary" variant="flat" rounded="pill" @click="buscar"
            >Mostrar {{ filterAmount }} resultados</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, shallowRef } from "vue";

import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useConfigStore } from "@/store/config";
import { useEventsStore } from "@/store/events";

const eventsStore = useEventsStore();
const { selecedDateRange } = storeToRefs(eventsStore);

// const { selectedGenres } = storeToRefs(eventsStore);
const { genres } = storeToRefs(useConfigStore());

const dates = ref(["2019-09-10", "2019-09-20"]);
const router = useRouter();
const route = useRoute();
const dateRangeSelectionOpened = ref(false);
const selectedDateRangeLocal = ref([new Date(), new Date()]);
const search = ref(null);
const {
  events,
  getUpcomingEventsFilteredByGenreAndCategories,
  selectedDateRange,
} = storeToRefs(eventsStore);

function restabelecer() {
  selectedDateRangeLocal.value = [];
}

function openSelector() {
  // Ensure dateRange is an array
  const dateRange = route.query.dateRange
    ? Array.isArray(route.query.dateRange)
      ? route.query.dateRange
      : route.query.dateRange.split(",") // Split string into array if necessary
    : [];

  // Parse the dates
  selectedDateRangeLocal.value = dateRange
    .map((date) => {
      const parsedDate = new Date(date);
      return isNaN(parsedDate) ? null : parsedDate; // Guard against invalid dates
    })
    .filter(Boolean); // Remove null values

  dateRangeSelectionOpened.value = true;
}

function buscar() {
  dateRangeSelectionOpened.value = false;
  if (selectedDateRangeLocal.value.length) {
    router.push({
      query: {
        ...route.query,
        dateRange: selectedDateRangeLocal.value.map(
          (date) => date.toISOString().split("T")[0] // Format as "YYYY-MM-DD"
        ),
      },
    });
  } else {
    router.push({
      query: {
        ...route.query,
        dateRange: [],
      },
    });
  }
}

onMounted(() => {
  if (route.query.dateRange) {
    // Ensure dateRange is an array
    const dateRange = Array.isArray(route.query.dateRange)
      ? route.query.dateRange
      : route.query.dateRange.split(","); // Split if it's a string

    selectedDateRangeLocal.value = dateRange
      .map((date) => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate) ? null : parsedDate; // Guard against invalid dates
      })
      .filter(Boolean); // Remove null values
  }
});

const filterAmount = computed(() => {
  if (selectedDateRangeLocal.value && selectedDateRangeLocal.value.length > 0) {
    console.log("getFilteredByDatesUpcomingEvents");
    return eventsStore.getFilteredByDatesUpcomingEvents(
      selectedDateRangeLocal.value
    );
  } else {
    console.log(events.value);
    return getUpcomingEventsFilteredByGenreAndCategories.value;
  }
});

function formatDate(date) {
  if (selectedDateRangeLocal.value && selectedDateRangeLocal.value.length) {
    let dateObject = new Date(date);
    const day = String(dateObject.getDate()).padStart(2, "0"); // Add leading zero if needed
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(dateObject.getFullYear()).slice(-2); // Get last two digits of the year

    return `${day}/${month}/${year}`;
  } else return;
}
</script>

<style lang="scss">
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
}
</style>
