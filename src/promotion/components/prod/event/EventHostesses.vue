<template>
  <div class="event-hostesses">
    <!-- Header section with summary stats and search -->
    <div class="hostesses-header px-4 py-3">
      <div class="d-flex justify-space-between align-center mb-3">
        <h2 class="text-h6 font-weight-bold mb-0">Equipe de Recepção</h2>
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus"
          size="small"
          @click="addHostess"
        >
          Nova Hostess
        </v-btn>
      </div>

      <!-- Search and filter bar -->
      <TabFilterComponent
        searchPlaceholder="Buscar hostess..."
        :searchValue="searchQuery"
        :filterOptions="[
          { label: 'Status', options: statusOptions, modelValue: statusFilter },
          { label: 'Área', options: areaOptions, modelValue: areaFilter },
        ]"
        @filter-change="handleFilterChange"
        @reset="resetFilters"
      />

      <!-- Summary stats cards -->
      <FourStatCards :cards="hostessCards" />
    </div>

    <!-- Hostesses list section -->
    <div class="hostesses-content px-4 pb-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <v-sheet
        v-else-if="filteredHostesses.length === 0"
        class="empty-state text-center py-8"
      >
        <v-icon
          icon="mdi-account-search"
          size="64"
          color="grey-lighten-1"
          class="mb-2"
        />
        <h3 class="text-h6 text-grey-darken-1">Nenhuma hostess encontrada</h3>
        <p class="text-body-2 text-grey">
          Adicione hostess à sua equipe para começar
        </p>
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus"
          class="mt-3"
          @click="addHostess"
        >
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
              <v-col
                v-for="hostess in filteredHostesses"
                :key="hostess.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  class="hostess-card"
                  border="thin"
                  :class="{ 'hostess-confirmed': hostess.confirmed }"
                >
                  <div class="hostess-header d-flex px-4 pt-4 pb-2">
                    <v-avatar size="64" :color="getAreaColor(hostess.area)">
                      <span v-if="!hostess.avatar" class="text-h5 text-white">
                        {{ hostess.name.charAt(0) }}
                      </span>
                      <v-img v-else :src="hostess.avatar" alt="avatar" />
                    </v-avatar>
                    <div class="ms-4 flex-grow-1">
                      <div class="d-flex justify-space-between align-center">
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ hostess.name }}
                        </div>
                        <v-menu location="bottom end">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              variant="text"
                              size="small"
                              class="ma-0"
                            >
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list density="compact">
                            <v-list-item
                              prepend-icon="mdi-pencil"
                              title="Editar"
                              @click="editHostess(hostess)"
                            />
                            <v-list-item
                              :prepend-icon="
                                hostess.confirmed
                                  ? 'mdi-close-circle'
                                  : 'mdi-check-circle'
                              "
                              :title="
                                hostess.confirmed
                                  ? 'Remover confirmação'
                                  : 'Confirmar presença'
                              "
                              @click="toggleHostessStatus(hostess)"
                            />
                          </v-list>
                        </v-menu>
                      </div>
                      <div class="text-caption text-grey-darken-1">
                        <v-icon size="14" start>mdi-phone</v-icon>
                        {{ hostess.phone }}
                      </div>
                      <div
                        class="text-caption text-grey-darken-1 mt-1 d-flex align-center"
                      >
                        <v-icon size="14" class="me-1">mdi-map-marker</v-icon>
                        <v-chip
                          size="x-small"
                          :color="getAreaColor(hostess.area)"
                          class="area-chip"
                        >
                          {{ hostess.area }}
                        </v-chip>
                      </div>
                      <div class="mt-1">
                        <v-chip
                          size="x-small"
                          :color="hostess.confirmed ? 'success' : 'grey'"
                          class="status-chip"
                        >
                          {{ hostess.confirmed ? "Confirmada" : "Pendente" }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                  <v-divider />
                  <v-card-text class="pa-0">
                    <div class="schedule-info d-flex text-center">
                      <div class="schedule-block flex-1 pa-2">
                        <div class="text-caption text-grey">Entrada</div>
                        <div class="text-body-1 font-weight-bold">
                          {{ hostess.startTime }}
                        </div>
                      </div>
                      <v-divider vertical />
                      <div class="schedule-block flex-1 pa-2">
                        <div class="text-caption text-grey">Saída</div>
                        <div class="text-body-1 font-weight-bold">
                          {{ hostess.endTime }}
                        </div>
                      </div>
                      <v-divider vertical />
                      <div class="schedule-block flex-1 pa-2">
                        <div class="text-caption text-grey">Horas</div>
                        <div class="text-body-1 font-weight-bold">
                          {{ calculateHours(hostess) }}
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions class="pa-2">
                    <v-btn
                      variant="text"
                      color="primary"
                      prepend-icon="mdi-pencil"
                      block
                      @click="editHostess(hostess)"
                    >
                      Editar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Table view -->
          <v-window-item value="table">
            <v-card border="thin" flat class="hostesses-table">
              <v-data-table
                :headers="tableHeaders"
                :items="filteredHostesses"
                :items-per-page="10"
                item-value="id"
                class="elevation-0"
              >
                <template v-slot:item.name="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar
                      size="32"
                      :color="getAreaColor(item.area)"
                      class="me-2"
                    >
                      <span class="text-caption text-white">
                        {{ item.name.charAt(0) }}
                      </span>
                    </v-avatar>
                    <span>{{ item.name }}</span>
                  </div>
                </template>
                <template v-slot:item.confirmed="{ item }">
                  <v-chip
                    size="small"
                    :color="item.confirmed ? 'success' : 'grey'"
                    text-color="white"
                  >
                    {{ item.confirmed ? "Confirmada" : "Pendente" }}
                  </v-chip>
                </template>
                <template v-slot:item.area="{ item }">
                  <v-chip
                    size="small"
                    :color="getAreaColor(item.area)"
                    text-color="white"
                  >
                    {{ item.area }}
                  </v-chip>
                </template>
                <template v-slot:item.hours="{ item }">
                  {{ calculateHours(item) }}h
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="primary"
                      class="me-1"
                      @click="editHostess(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      :color="item.confirmed ? 'error' : 'success'"
                      @click="toggleHostessStatus(item)"
                    >
                      <v-icon>
                        {{
                          item.confirmed
                            ? "mdi-close-circle"
                            : "mdi-check-circle"
                        }}
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
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
                    <div
                      v-for="hour in timelineHours"
                      :key="hour"
                      class="time-block text-caption text-center"
                    >
                      {{ hour }}:00
                    </div>
                  </div>
                </div>
              </div>
              <div class="schedule-body">
                <div
                  v-for="hostess in filteredHostesses"
                  :key="hostess.id"
                  class="schedule-row d-flex mb-3"
                >
                  <div
                    class="hostess-label flex-shrink-0 d-flex align-center me-2"
                    style="width: 80px"
                  >
                    <v-avatar
                      size="24"
                      :color="getAreaColor(hostess.area)"
                      class="me-1"
                    >
                      <span class="text-caption text-white">
                        {{ hostess.name.charAt(0) }}
                      </span>
                    </v-avatar>
                    <div class="text-caption text-truncate">
                      {{ hostess.name }}
                    </div>
                  </div>
                  <div
                    class="timeline-container flex-grow-1 position-relative"
                    style="height: 40px"
                  >
                    <div class="timeline-bg d-flex">
                      <div
                        v-for="hour in timelineHours"
                        :key="hour"
                        class="time-block"
                      >
                        <div class="time-block-inner"></div>
                      </div>
                    </div>
                    <div
                      class="schedule-bar position-absolute"
                      :class="{ 'confirmed-bar': hostess.confirmed }"
                      :style="getScheduleBarStyle(hostess)"
                    >
                      <div
                        class="schedule-bar-content d-flex justify-center align-center text-caption"
                      >
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

    <!-- Generic Modal for Add/Edit Hostess -->
    <GenericCRUDModal
      v-model="modalVisible"
      :mode="modalMode"
      :editMode="modalEditMode"
      :areaOptions="areaOptions"
      :promotersOptions="promotersOptions"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, shallowRef } from "vue";
import TabFilterComponent from "@/promotion/components/prod/event/TabFilterComponent.vue";
import FourStatCards from "@/promotion/components/prod/event/FourStatCards.vue";
import GenericCRUDModal from "@/promotion/components/prod/event/GenericCRUDModal.vue";

const props = defineProps({
  event: { type: Object, required: true },
});
const emit = defineEmits(["update:hostesses"]);

// State variables (using shallowRef for complex objects)
const loading = ref(true);
const viewType = ref("cards");
const searchQuery = ref("");
const statusFilter = ref("all");
const areaFilter = ref("all");
const hostesses = shallowRef([]);
const filteredHostesses = shallowRef([]);

// Remove inline dialogs for deletion and details

// Timeline hours (static)
const timelineHours = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];

// Static table headers and filter options
const tableHeaders = [
  { title: "Nome", key: "name" },
  { title: "Status", key: "confirmed", width: "120px" },
  { title: "Área", key: "area", width: "120px" },
  { title: "Entrada", key: "startTime", width: "100px", align: "center" },
  { title: "Saída", key: "endTime", width: "100px", align: "center" },
  { title: "Horas", key: "hours", width: "80px", align: "center" },
  { title: "Check-ins", key: "checkIns", width: "100px", align: "center" },
  {
    title: "Ações",
    key: "actions",
    width: "120px",
    align: "center",
    sortable: false,
  },
];

const statusOptions = [
  { title: "Todas", value: "all" },
  { title: "Confirmadas", value: "confirmed" },
  { title: "Pendentes", value: "pending" },
];

const areaOptions = [
  { title: "Todas as áreas", value: "all" },
  { title: "Entrada", value: "Entrada" },
  { title: "VIP", value: "VIP" },
  { title: "Camarote", value: "Camarote" },
  { title: "Pista", value: "Pista" },
  { title: "Bar", value: "Bar" },
];

// GenericCRUDModal reactive variables
const modalVisible = ref(false);
const modalMode = ref("hostess");
const modalEditMode = ref(false);
const promotersOptions = ref([]); // Not used for Hostess but required by the component

// Utility functions
const getAreaColor = (area) => {
  const areaColorMap = {
    Entrada: "blue",
    VIP: "purple",
    Camarote: "pink",
    Pista: "green",
    Bar: "amber",
  };
  return areaColorMap[area] || "grey";
};

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

const hourLabels = [
  "18h",
  "19h",
  "20h",
  "21h",
  "22h",
  "23h",
  "00h",
  "01h",
  "02h",
  "03h",
  "04h",
];
const getHourLabel = (index) => hourLabels[index] || `${index}h`;

// Fetch and filter functions
const fetchHostesses = async () => {
  if (!loading.value) return;
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockHostesses = [
      {
        id: 1,
        name: "Ana Silva",
        phone: "(11) 99876-5432",
        area: "Entrada",
        startTime: "20:00",
        endTime: "04:00",
        payment: 150,
        confirmed: true,
        checkIns: 42,
        notes: "Experiência em eventos de grande porte.",
      },
      {
        id: 2,
        name: "Beatriz Santos",
        phone: "(11) 98765-4321",
        area: "VIP",
        startTime: "21:00",
        endTime: "05:00",
        payment: 180,
        confirmed: true,
        checkIns: 35,
        notes: "Fala inglês e espanhol.",
      },
      {
        id: 3,
        name: "Carolina Lima",
        phone: "(11) 97654-3210",
        area: "Camarote",
        startTime: "22:00",
        endTime: "04:00",
        payment: 160,
        confirmed: true,
        checkIns: 28,
        notes: "",
      },
      {
        id: 4,
        name: "Daniela Costa",
        phone: "(11) 96543-2109",
        area: "Pista",
        startTime: "21:00",
        endTime: "03:00",
        payment: 140,
        confirmed: false,
        checkIns: 0,
        notes: "Primeira vez trabalhando neste evento.",
      },
      {
        id: 5,
        name: "Elena Ferreira",
        phone: "(11) 95432-1098",
        area: "Bar",
        startTime: "20:00",
        endTime: "03:00",
        payment: 140,
        confirmed: true,
        checkIns: 15,
        notes: "Experiência em servir bebidas.",
      },
    ];
    hostesses.value = mockHostesses;
    filterHostesses();
  } catch (error) {
    console.error("Error fetching hostesses:", error);
  } finally {
    loading.value = false;
  }
};

const filterHostesses = () => {
  const query = searchQuery.value.toLowerCase();
  const isStatusFiltered = statusFilter.value !== "all";
  const isAreaFiltered = areaFilter.value !== "all";
  const isSearchFiltered = query.length > 0;
  if (!isStatusFiltered && !isAreaFiltered && !isSearchFiltered) {
    filteredHostesses.value = [...hostesses.value];
    return;
  }
  filteredHostesses.value = hostesses.value.filter((hostess) => {
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
};

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

// Hostess actions using GenericCRUDModal
const addHostess = () => {
  modalMode.value = "hostess";
  modalEditMode.value = false;
  modalVisible.value = true;
};

const editHostess = (hostess) => {
  selectedHostess.value = hostess;
  modalMode.value = "hostess";
  modalEditMode.value = true;
  modalVisible.value = true;
};

const selectedHostess = ref(null);
const handleSaved = (savedEntity) => {
  if (modalEditMode.value && selectedHostess.value) {
    const index = hostesses.value.findIndex(
      (h) => h.id === selectedHostess.value.id
    );
    if (index !== -1) {
      const updated = { ...hostesses.value[index], ...savedEntity };
      hostesses.value.splice(index, 1, updated);
    }
  } else {
    hostesses.value.push({ id: Date.now(), checkIns: 0, ...savedEntity });
  }
  filterHostesses();
  emit("update:hostesses", hostesses.value.length);
  selectedHostess.value = null;
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

onMounted(fetchHostesses);

const totalHostesses = computed(() => hostesses.value.length);
const confirmedHostesses = computed(
  () => hostesses.value.filter((h) => h.confirmed).length
);
const totalCheckIns = computed(() =>
  hostesses.value.reduce((sum, h) => sum + (h.checkIns || 0), 0)
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
</script>

<style scoped>
.event-hostesses {
  background-color: rgb(var(--v-theme-background));
}
.hostesses-header {
  background-color: rgb(var(--v-theme-background));
  position: sticky;
  top: 0;
  z-index: 5;
}
.search-field {
  border-radius: 8px;
  flex: 1;
  max-width: 300px;
}
.status-filter,
.area-filter {
  min-width: 120px;
}
.hostesses-content {
  min-height: 400px;
}
.stat-card {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.hostess-card {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  overflow: hidden;
}
.hostess-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.hostess-confirmed {
  border-left: 4px solid var(--v-success-base);
}
.area-chip {
  padding: 0 4px;
  height: 16px;
}
.status-chip {
  font-weight: 500;
}
.schedule-info {
  background-color: rgba(0, 0, 0, 0.02);
}
.schedule-block {
  flex: 1;
}
.empty-state {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  padding: 32px;
}
.detail-item {
  display: flex;
  align-items: center;
}
.metric-card {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface-variant));
  transition: transform 0.2s;
  height: 100%;
}
.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.details-section {
  margin-bottom: 24px;
}
/* Schedule timeline styles */
.schedule-card {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  overflow: hidden;
}
.time-block {
  width: 60px;
  flex-shrink: 0;
  height: 100%;
  border-right: 1px dashed rgba(0, 0, 0, 0.1);
}
.time-block:last-child {
  border-right: none;
}
.time-block-inner {
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}
.timeline-container {
  position: relative;
  height: 100%;
}
.timeline-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.02);
}
.schedule-bar {
  height: 24px;
  top: 8px;
  background-color: rgba(var(--v-primary-base), 0.7);
  border-radius: 4px;
  color: white;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.3s ease;
}
.confirmed-bar {
  background-color: rgba(var(--v-success-base), 0.7);
}
.schedule-bar-content {
  height: 100%;
  padding: 0 8px;
}
/* Performance chart styles */
.performance-card {
  border-radius: 12px;
}
.performance-chart {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.chart-bars {
  height: 120px;
}
.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}
.chart-bar {
  width: 24px;
  min-height: 4px;
  border-radius: 2px 2px 0 0;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
/* Responsive adjustments */
@media (max-width: 600px) {
  .filter-bar {
    flex-wrap: wrap;
  }
  .search-field {
    max-width: none;
    margin-right: 0;
  }
  .stat-card {
    margin-bottom: 8px;
  }
  .time-block {
    width: 50px;
  }
}
</style>
