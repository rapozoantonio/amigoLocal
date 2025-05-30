<template>
  <div class="event-hostesses">
    <!-- Header section with summary stats and search -->
    <div class="hostesses-header px-4 py-3">
      <div class="d-flex justify-space-between align-center mb-3">
        <h2 class="text-h6 font-weight-bold mb-0">Equipe de Recepção</h2>
        <v-btn color="primary" prepend-icon="mdi-account-plus" size="small" @click="addHostess">
          Nova Hostess
        </v-btn>
      </div>

      <!-- Search and filter bar -->
      <TabFilterComponent searchPlaceholder="Buscar hostess..." :searchValue="searchQuery" :filterOptions="[
        { label: 'Status', options: statusOptions, modelValue: statusFilter },
        { label: 'Área', options: areaOptions, modelValue: areaFilter },
      ]" @filter-change="handleFilterChange" @reset="resetFilters" />

      <!-- Summary stats cards -->
      <FourStatCards :cards="hostessCards" />
    </div>

    <!-- Hostesses list section -->
    <div class="hostesses-content px-4 pb-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <v-sheet v-else-if="filteredHostesses.length === 0" class="empty-state text-center py-8">
        <v-icon icon="mdi-account-search" size="64" color="grey-lighten-1" class="mb-2" />
        <h3 class="text-h6 text-grey-darken-1">Nenhuma hostess encontrada</h3>
        <p class="text-body-2 text-grey">
          Adicione hostess à sua equipe para começar
        </p>
        <v-btn color="primary" prepend-icon="mdi-account-plus" class="mt-3" @click="addHostess">
          Adicionar hostess
        </v-btn>
      </v-sheet>

      <div v-else>
        <v-tabs v-model="viewType" color="primary" class="mb-4">
          <v-tab value="cards">
            <v-icon start>mdi-view-grid</v-icon> Cards
          </v-tab>
          <v-tab value="table"> <v-icon start>mdi-table</v-icon> Tabela </v-tab>
          <v-tab value="schedule">
            <v-icon start>mdi-calendar-clock</v-icon> Escala
          </v-tab>
        </v-tabs>

        <v-window v-model="viewType">
          <!-- Card view -->
          <v-window-item value="cards">
            <v-row>
              <v-col v-for="hostess in filteredHostesses" :key="hostess.id" cols="12" sm="6" md="4" lg="3">
                <event-hostess-item :hostess="hostess" @hostess:edit="editHostess" @hostess:delete="deleteHostess"
                  @hostess:update="updateHostess"></event-hostess-item>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Table view -->
          <v-window-item value="table">
            <event-hostess-table :hostesses="filteredHostesses" @hostess:edit="editHostess"
              @hostess:delete="deleteHostess" @hostess:update="updateHostess"></event-hostess-table>
          </v-window-item>

          <!-- Schedule view -->
          <v-window-item value="schedule">
            <v-card border="thin" flat class="schedule-card">
              <div class="schedule-header d-flex align-center pa-2 mb-3">
                <div class="time-labels flex-shrink-0 me-2" style="width: 80px">
                  <div class="text-caption text-center">Equipe</div>
                </div>
                <div class="timeline-container flex-grow-1 overflow-x-auto">
                  <div class="d-flex align-center">
                    <div v-for="hour in timelineHours" :key="hour" class="time-block text-caption text-center">
                      {{ hour }}:00
                    </div>
                  </div>
                </div>
              </div>
              <div class="schedule-body">
                <div v-for="hostess in filteredHostesses" :key="hostess.id" class="schedule-row d-flex mb-3">
                  <div class="hostess-label flex-shrink-0 d-flex align-center me-2" style="width: 80px">
                    <v-avatar size="24" :color="getAreaColor(hostess.area)" class="me-1">
                      <span class="text-caption text-white">
                        {{ hostess.name.charAt(0) }}
                      </span>
                    </v-avatar>
                    <div class="text-caption text-truncate">
                      {{ hostess.name }}
                    </div>
                  </div>
                  <div class="timeline-container flex-grow-1 position-relative" style="height: 40px">
                    <div class="timeline-bg d-flex">
                      <div v-for="hour in timelineHours" :key="hour" class="time-block">
                        <div class="time-block-inner"></div>
                      </div>
                    </div>
                    <div class="schedule-bar position-absolute" :class="{ 'confirmed-bar': hostess.confirmed }"
                      :style="getScheduleBarStyle(hostess)">
                      <div class="schedule-bar-content d-flex justify-center align-center text-caption">
                        {{ hostess.startTime }} - {{ hostess.endTime }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-window-item>
        </v-window>
      </div>
    </div>

    <form-dialog :items="{ area: areaOptions }" v-model:opened="showCreateDialog" v-model:model="hostessForm"
      @submit="submitHostess" :schema="eventHostessesSchema" title="Adicionar Hostess">
      <template #prepend-inner>
        <field-user-search entity="promoters" @select="selectHostesses"
          placeholder="Selecione a hostess"></field-user-search>
      </template>

      <template #activator="props">
        <v-fab @click="addHostess" v-bind="props" icon="mdi-plus" app location="right bottom" color="primary"
          rounded="pill"></v-fab>
      </template>
    </form-dialog>

    <form-dialog :items="{ area: areaOptions }" v-model:opened="showEditDialog" v-model:model="hostessForm"
      title="Editar Hostess" @submit="submitHostessUpdate" :schema="eventHostessesSchema"></form-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, shallowRef, toRefs, inject } from "vue";
import TabFilterComponent from "@/management/components/events/TabFilterComponent.vue";
import FourStatCards from "@/management/components/events/FourStatCards.vue";
import eventHostessesSchema from "@/management/schemas/eventHostessesSchema";
import FormDialog from "@/core/components/form/FormDialog.vue";
import EventHostessItem from "./EventHostessItem.vue";
import FieldUserSearch from "./FieldUserSearch.vue";
import { useEventListStore } from "@/management/store/eventList";
import { useRoute } from "vue-router";
import EventHostessTable from "./EventHostessTable.vue";
import {
  mockHostesses,
  hostessTableHeaders,
  statusOptions,
  areaOptions,
  timelineHours,
  hourLabels,
  getAreaColor
} from '@/management/consts/hostessesMockData';

const swal = inject("$swal");

const props = defineProps({
  event: { type: Object, required: true },
  hostesses: { type: Array, required: true },
  guests: { type: Array, required: true },
});
const emit = defineEmits(["update:hostesses"]);
const eventListStore = useEventListStore();
const { hostesses, guests } = toRefs(props);
const route = useRoute();

const eventId = computed(() => {
  return route.params.eventId;
})

const showCreateDialog = ref(false);
const showEditDialog = ref(false);

const hostessesGrouped = computed(() => {
  return hostesses.value.map((h) => {
    return {
      ...h,
      checkIns: guests.value.filter(g => g.checkInBy?.id === h.id).length
    }
  })
})

// State variables (using shallowRef for complex objects)
const loading = ref(false);
const viewType = ref("cards");
const searchQuery = ref("");
const statusFilter = ref("all");
const areaFilter = ref("all");
// const hostesses = shallowRef([]);


// const filteredHostesses = shallowRef([]);

const hostessForm = ref({});

// Utility functions
const parseTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
};

const calculateHours = (hostess) => {
  if (!hostess.startTime || !hostess.endTime) return "0";
  const start = parseTimeToMinutes(hostess.startTime);
  let end = parseTimeToMinutes(hostess.endTime);
  if (end < start) end += 24 * 60;
  return ((end - start) / 60).toFixed(1);
};

const calculateCheckInRate = (hostess) => {
  if (!hostess.checkIns) return "0 por hora";
  const hours = parseFloat(calculateHours(hostess));
  if (hours <= 0) return "0 por hora";
  return (hostess.checkIns / hours).toFixed(1) + " por hora";
};

const getScheduleBarStyle = (hostess) => {
  const startHour = parseInt(hostess.startTime.split(":")[0]);
  const endHour = parseInt(hostess.endTime.split(":")[0]);
  let adjustedStartHour = startHour,
    adjustedEndHour = endHour;
  if (endHour < startHour) adjustedEndHour += 24;
  const startIndex = timelineHours.findIndex((h) => h === startHour);
  if (startIndex === -1) return { left: "0%", width: "0%" };
  const hourWidth = 100 / timelineHours.length;
  const durationHours = adjustedEndHour - adjustedStartHour;
  return {
    left: `${startIndex * hourWidth}%`,
    width: `${durationHours * hourWidth}%`,
  };
};

const getHourLabel = (index) => hourLabels[index] || `${index}h`;

function selectHostesses(hostess) {
  if (hostess.name) hostessForm.value.name = hostess.name;
  if (hostess.phone) hostessForm.value.phone = hostess.phone;
  if (hostess.email) hostessForm.value.email = hostess.email;
  if (hostess.id) hostessForm.value.id = hostess.id;

}

const filteredHostesses = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const isStatusFiltered = statusFilter.value !== "all";
  const isAreaFiltered = areaFilter.value !== "all";
  const isSearchFiltered = query.length > 0;
  if (!isStatusFiltered && !isAreaFiltered && !isSearchFiltered) {
    return [...hostessesGrouped.value];
  }
  return hostessesGrouped.value.filter((hostess) => {
    if (isStatusFiltered) {
      const isConfirmed = statusFilter.value === "confirmed";
      if (hostess.confirmed !== isConfirmed) return false;
    }
    if (isAreaFiltered && hostess.area !== areaFilter.value) return false;
    if (isSearchFiltered) {
      return (
        hostess.name.toLowerCase().includes(query) ||
        hostess.phone.includes(query) ||
        hostess.area.toLowerCase().includes(query)
      );
    }
    return true;
  });
});

// Filter handlers
const handleFilterChange = (filters) => {
  const newSearch = filters.search;
  const newStatus =
    filters.filters.find((f) => f.id === "status")?.value || "all";
  const newArea = filters.filters.find((f) => f.id === "área")?.value || "all";
  if (
    searchQuery.value !== newSearch ||
    statusFilter.value !== newStatus ||
    areaFilter.value !== newArea
  ) {
    searchQuery.value = newSearch;
    statusFilter.value = newStatus;
    areaFilter.value = newArea;
    filterHostesses();
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "all";
  areaFilter.value = "all";
  filterHostesses();
};

const toggleHostessStatus = async (hostess) => {
  if (actionLoading.value) return;
  actionLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = hostesses.value.findIndex((h) => h.id === hostess.id);
    if (index !== -1) {
      const updated = {
        ...hostesses.value[index],
        confirmed: !hostesses.value[index].confirmed,
      };
      hostesses.value.splice(index, 1, updated);
    }
    filterHostesses();
  } catch (error) {
    console.error("Error toggling hostess status:", error);
  } finally {
    actionLoading.value = false;
  }
};

const actionLoading = ref(false);

const totalHostesses = computed(() => hostesses.value.length);
const confirmedHostesses = computed(
  () => hostesses.value.filter((h) => h.confirmed).length
);
const totalCheckIns = computed(() =>
  guests.value.filter(g => g.status === "checked-in").length
);
const totalHours = computed(() =>
  hostesses.value.reduce(
    (sum, h) => sum + (parseFloat(calculateHours(h)) || 0),
    0
  )
);

const hostessCards = ref([
  {
    title: "Total Hostess",
    value: totalHostesses,
    icon: "mdi-account-group",
    iconColor: "primary",
    accentColor: "#e53935",
  },
  {
    title: "Confirmadas",
    value: confirmedHostesses,
    icon: "mdi-account-check",
    iconColor: "success",
    accentColor: "#388e3c",
  },
  {
    title: "Check-ins",
    value: totalCheckIns,
    icon: "mdi-ticket-confirmation",
    iconColor: "info",
    accentColor: "#0288d1",
  },
  {
    title: "Horas Trabalhadas",
    value: totalHours,
    icon: "mdi-clock-time-four",
    iconColor: "warning",
    accentColor: "#fbc02d",
  },
]);


// REFACTORE

function addHostess() {
  hostessForm.value = {};
  showCreateDialog.value = true;
}

function editHostess(hostess) {
  hostessForm.value = { ...hostess };
  showEditDialog.value = true
}


async function submitHostess(hostess, close) {
  try {
    console.log({ hostess });
    const result = await eventListStore.createHostess(eventId.value, hostess);
    console.log({ result })
    close();
  } catch (error) {
    console.log({ error });
  }
}

async function submitHostessUpdate(hostess, close) {
  try {
    console.log({ hostess });
    const result = await eventListStore.updateHostess(eventId.value, hostess);
    console.log({ result })
    close();
  } catch (error) {
    console.log({ error });
  }
}

async function updateHostess(hostess) {
  try {
    console.log({ hostess });
    const result = await eventListStore.updateHostess(eventId.value, hostess);
    console.log({ result })
  } catch (error) {
    console.log({ error });
  }
}

async function deleteHostess(hostess) {
  try {
    const result = await swal.fire({
      title: "Deletar " + hostess.name + "?",
      html: `Deletar hostess <strong>${hostess.name}</strong>? Essa ação é irreversível`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!"
    });
    if (result.isConfirmed) {
      await eventListStore.deleteHostess(eventId.value, hostess);
      swal.fire({
        title: "Hostess excluido!",
        icon: "success",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
      })
    }
    console.log({ result });
  } catch (error) {
    console.log({ error })
  }
}


</script>