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
      <template v-slot:prepend>
        <v-container>
          <v-date-picker
            v-model="selectedDateRangeLocal"
            locale="pt-BR"
            multiple="range"
            elevation="2"
            :first-day-of-week="0"
            weekday-format="short"
            no-title
            hide-header
            no-header
          ></v-date-picker>
        </v-container>
      </template>
      <v-col class="px-4 mt-2">
        <p
          class=""
          style="color: rgba(255, 255, 255, 0.3); letter-spacing: 0.1em"
        >
          Escolha rápida:
        </p>

        <!-- Quick Date Range Buttons -->
        <v-row class="mt-2">
          <v-col cols="12">
            <v-btn
              block
              variant="outlined"
              rounded="pill"
              @click="setToday"
              class="mb-2"
              >🎉 Hoje</v-btn
            >
            <v-btn
              block
              variant="outlined"
              rounded="pill"
              @click="setNextWeekend"
              class="mb-2"
              >🎪 Próximo Final de Semana</v-btn
            >
            <v-btn
              v-for="(holiday, index) in nextThreeHolidays"
              :key="index"
              block
              variant="outlined"
              rounded="pill"
              @click="setHolidayRange(holiday.startDate, holiday.endDate)"
              class="mb-2"
              >{{ holiday.name }}</v-btn
            >
          </v-col>
        </v-row>

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
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useConfigStore } from "@/store/config";
import { useEventsStore } from "@/store/events";

const eventsStore = useEventsStore();
const { selecedDateRange } = storeToRefs(eventsStore);
const { genres } = storeToRefs(useConfigStore());

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

// Full list of holidays in 2025 for Rio de Janeiro or São Paulo
const holidays = ref([
  {
    name: "Confraternização Universal",
    startDate: "2025-01-01",
    endDate: "2025-01-01",
  },
  { name: "Carnaval", startDate: "2025-03-01", endDate: "2025-03-04" }, // Carnaval typically spans multiple days
  { name: "Sexta-feira Santa", startDate: "2025-04-18", endDate: "2025-04-18" },
  { name: "Tiradentes", startDate: "2025-04-21", endDate: "2025-04-21" },
  { name: "Dia do Trabalho", startDate: "2025-05-01", endDate: "2025-05-01" },
  { name: "Corpus Christi", startDate: "2025-06-19", endDate: "2025-06-19" },
  {
    name: "Independência do Brasil",
    startDate: "2025-09-07",
    endDate: "2025-09-07",
  },
  {
    name: "Nossa Senhora Aparecida",
    startDate: "2025-10-12",
    endDate: "2025-10-12",
  },
  { name: "Finados", startDate: "2025-11-02", endDate: "2025-11-02" },
  {
    name: "Proclamação da República",
    startDate: "2025-11-15",
    endDate: "2025-11-15",
  },
  { name: "Natal", startDate: "2025-12-25", endDate: "2025-12-25" },
]);

// Get the next three holidays based on the current date
const nextThreeHolidays = computed(() => {
  const today = new Date();
  return holidays.value
    .filter((holiday) => new Date(holiday.startDate) >= today) // Filter out past holidays
    .slice(0, 3); // Show only the next three
});

function setToday() {
  const today = new Date();
  selectedDateRangeLocal.value = [today, today];
}

function setNextWeekend() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);
  const nextSunday = new Date(nextSaturday);
  nextSunday.setDate(nextSaturday.getDate() + 1);
  selectedDateRangeLocal.value = [nextSaturday, nextSunday];
}

function setHolidayRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  selectedDateRangeLocal.value = [start, end];
}

function restabelecer() {
  selectedDateRangeLocal.value = [];
}

const getAllDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

function openSelector() {
  if (route.query.startDate && route.query.endDate) {
    const dateRange = getAllDatesInRange(
      new Date(route.query.startDate),
      new Date(route.query.endDate)
    );

    selectedDateRangeLocal.value = dateRange;
  }

  dateRangeSelectionOpened.value = true;
}

function buscar() {
  dateRangeSelectionOpened.value = false;
  if (selectedDateRangeLocal.value.length) {
    router.push({
      query: {
        ...route.query,
        // dateRange: selectedDateRangeLocal.value.map(
        //   (date) => date.toISOString().split("T")[0],

        // ),
        startDate: selectedDateRangeLocal.value[0].toISOString().split("T")[0],
        endDate: selectedDateRangeLocal.value[
          selectedDateRangeLocal.value.length - 1
        ]
          .toISOString()
          .split("T")[0],
      },
    });
  } else {
    router.push({
      query: {
        ...route.query,
        startDate: '',
        endDate:''
      },
    });
  }
}

onMounted(() => {
  if (route.query.startDate && route.query.endDate) {
    const dateRange = [
      new Date(route.query.startDate),
      new Date(route.query.endDate),
    ];

    selectedDateRangeLocal.value = dateRange;
  }
});

watch(
  () => selectedDateRangeLocal.value,
  (newValue, oldValue) => {
    selectedDateRange.value = newValue;
  }
);

const filterAmount = computed(() => {
  if (selectedDateRangeLocal.value && selectedDateRangeLocal.value.length > 0) {
    return eventsStore.getFilteredByDatesUpcomingEvents([
      selectedDateRangeLocal.value[0],
      selectedDateRangeLocal.value[selectedDateRangeLocal.value.length - 1],
    ]);
  } else {
    return getUpcomingEventsFilteredByGenreAndCategories.value;
  }
});

function formatDate(date) {
  if (selectedDateRangeLocal.value && selectedDateRangeLocal.value.length) {
    let dateObject = new Date(date);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = String(dateObject.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  } else return;
}
</script>

<style lang="scss">
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
}
</style>
