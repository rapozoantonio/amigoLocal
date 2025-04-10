<template>
  <div class="event-promoters">
    <!-- Header section with summary stats and search -->
    <div class="promoters-header px-4 py-3">
      <div class="d-flex justify-space-between align-center mb-3">
        <h2 class="text-h6 font-weight-bold mb-0">Equipe de Promotores</h2>
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus"
          size="small"
          @click="addPromoter"
        >
          Novo Promotor
        </v-btn>
      </div>

      <!-- Search and filter bar -->
      <TabFilterComponent
        searchPlaceholder="Buscar promotores..."
        :searchValue="searchQuery"
        :filterOptions="[
          { label: 'Status', options: statusOptions, modelValue: statusFilter },
        ]"
        @filter-change="handleFilterChange"
        @reset="resetFilters"
      />

      <FourStatCards :cards="promoterCards" />
    </div>

    <!-- Promoters list section -->
    <div class="promoters-content px-4 pb-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <v-sheet
        v-else-if="filteredPromoters.length === 0"
        class="empty-state text-center py-8"
      >
        <v-icon
          icon="mdi-account-search"
          size="64"
          color="grey-lighten-1"
          class="mb-2"
        />
        <h3 class="text-h6 text-grey-darken-1">Nenhum promotor encontrado</h3>
        <p class="text-body-2 text-grey">
          Adicione promotores à sua equipe para começar
        </p>
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus"
          class="mt-3"
          @click="addPromoter"
        >
          Adicionar promotor
        </v-btn>
      </v-sheet>

      <div v-else>
        <v-tabs v-model="viewType" color="primary" class="mb-4">
          <v-tab value="cards">
            <v-icon start>mdi-view-grid</v-icon>
            Cards
          </v-tab>
          <v-tab value="table">
            <v-icon start>mdi-table</v-icon>
            Tabela
          </v-tab>
          <v-tab value="leaderboard">
            <v-icon start>mdi-trophy</v-icon>
            Ranking
          </v-tab>
        </v-tabs>

        <v-window v-model="viewType">
          <!-- Card view -->
          <v-window-item value="cards">
            <v-row>
              <v-col
                v-for="promoter in filteredPromoters"
                :key="promoter.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  class="promoter-card"
                  border="thin"
                  :class="{ 'promoter-active': promoter.active }"
                >
                  <div class="promoter-header d-flex px-4 pt-4 pb-2">
                    <v-avatar
                      size="64"
                      :color="promoter.active ? 'success' : 'grey'"
                    >
                      <span v-if="!promoter.avatar" class="text-h5 text-white">
                        {{ promoter.name.charAt(0) }}
                      </span>
                      <v-img v-else :src="promoter.avatar" alt="avatar" />
                    </v-avatar>
                    <div class="ml-4 flex-grow-1">
                      <div class="d-flex justify-space-between align-center">
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ promoter.name }}
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
                              @click="editPromoter(promoter)"
                            />
                            <v-list-item
                              :prepend-icon="
                                promoter.active
                                  ? 'mdi-account-off'
                                  : 'mdi-account-check'
                              "
                              :title="promoter.active ? 'Desativar' : 'Ativar'"
                              @click="togglePromoterStatus(promoter)"
                            />
                          </v-list>
                        </v-menu>
                      </div>
                      <div class="text-caption text-grey-darken-1">
                        <v-icon size="14" start>mdi-email</v-icon>
                        {{ promoter.email }}
                      </div>
                      <div class="text-caption text-grey-darken-1">
                        <v-icon size="14" start>mdi-phone</v-icon>
                        {{ promoter.phone }}
                      </div>
                      <v-chip
                        size="x-small"
                        :color="promoter.active ? 'success' : 'grey'"
                        class="mt-1"
                      >
                        {{ promoter.active ? "Ativo" : "Inativo" }}
                      </v-chip>
                    </div>
                  </div>
                  <v-divider />
                  <v-card-text class="pa-0">
                    <div class="performance-stats d-flex text-center">
                      <div class="stat-block flex-1 pa-2">
                        <div class="text-body-1 font-weight-bold">
                          {{ promoter.guests }}
                        </div>
                        <div class="text-caption">Convidados</div>
                      </div>
                      <v-divider vertical />
                      <div class="stat-block flex-1 pa-2">
                        <div class="text-body-1 font-weight-bold">
                          {{ promoter.checkIns }}
                        </div>
                        <div class="text-caption">Check-ins</div>
                      </div>
                      <v-divider vertical />
                      <div class="stat-block flex-1 pa-2">
                        <div class="text-body-1 font-weight-bold">
                          {{ formatCurrency(promoter.revenue) }}
                        </div>
                        <div class="text-caption">Receita</div>
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
                      @click="editPromoter(promoter)"
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
            <v-card border="thin" flat class="promoters-table">
              <v-data-table
                :headers="tableHeaders"
                :items="filteredPromoters"
                :items-per-page="10"
                item-value="id"
                class="elevation-0"
              >
                <template v-slot:item.name="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar
                      size="32"
                      :color="item.active ? 'success' : 'grey'"
                      class="me-2"
                    >
                      <span class="text-caption text-white">{{
                        item.name.charAt(0)
                      }}</span>
                    </v-avatar>
                    <span>{{ item.name }}</span>
                  </div>
                </template>
                <template v-slot:item.active="{ item }">
                  <v-chip
                    size="small"
                    :color="item.active ? 'success' : 'grey'"
                    text-color="white"
                  >
                    {{ item.active ? "Ativo" : "Inativo" }}
                  </v-chip>
                </template>
                <template v-slot:item.conversionRate="{ item }">
                  {{ calculateConversionRate(item) }}%
                </template>
                <template v-slot:item.revenue="{ item }">
                  {{ formatCurrency(item.revenue) }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="primary"
                      class="me-1"
                      @click="editPromoter(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      :color="item.active ? 'error' : 'success'"
                      @click="togglePromoterStatus(item)"
                    >
                      <v-icon>
                        {{
                          item.active ? "mdi-account-off" : "mdi-account-check"
                        }}
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-window-item>

          <!-- Leaderboard view -->
          <v-window-item value="leaderboard">
            <v-card border="thin" flat class="leaderboard-card">
              <v-tabs
                v-model="leaderboardMetric"
                color="primary"
                align-tabs="center"
                class="mb-2"
              >
                <v-tab value="guests">Convidados</v-tab>
                <v-tab value="checkIns">Check-ins</v-tab>
                <v-tab value="revenue">Receita</v-tab>
                <v-tab value="conversion">Conversão</v-tab>
              </v-tabs>
              <v-window v-model="leaderboardMetric">
                <v-window-item
                  v-for="metric in [
                    'guests',
                    'checkIns',
                    'revenue',
                    'conversion',
                  ]"
                  :key="metric"
                  :value="metric"
                >
                  <div class="leaderboard-list pa-2">
                    <div
                      v-for="(promoter, index) in getSortedPromotersByMetric(
                        metric
                      )"
                      :key="promoter.id"
                      class="leaderboard-item d-flex align-center pa-3 mb-2"
                      :class="{
                        'top-1': index === 0,
                        'top-2': index === 1,
                        'top-3': index === 2,
                      }"
                    >
                      <div class="rank-badge" :class="`rank-${index + 1}`">
                        {{ index + 1 }}
                      </div>
                      <v-avatar
                        size="40"
                        :color="getLeaderboardAvatarColor(index)"
                        class="ms-2"
                      >
                        <span class="text-white">{{
                          promoter.name.charAt(0)
                        }}</span>
                      </v-avatar>
                      <div class="ms-3 flex-grow-1">
                        <div class="font-weight-medium">
                          {{ promoter.name }}
                        </div>
                        <div class="text-caption text-grey-darken-1">
                          {{ promoter.active ? "Ativo" : "Inativo" }} •
                          {{ promoter.guests }} convidados
                        </div>
                      </div>
                      <div class="metric-value font-weight-bold">
                        <template v-if="metric === 'guests'">
                          {{ promoter.guests }}
                        </template>
                        <template v-else-if="metric === 'checkIns'">
                          {{ promoter.checkIns }}
                        </template>
                        <template v-else-if="metric === 'revenue'">
                          {{ formatCurrency(promoter.revenue) }}
                        </template>
                        <template v-else-if="metric === 'conversion'">
                          {{ calculateConversionRate(promoter) }}%
                        </template>
                      </div>
                    </div>
                  </div>
                </v-window-item>
              </v-window>
            </v-card>
          </v-window-item>
        </v-window>
      </div>
    </div>

    <!-- Generic Modal for Add/Edit Promoter -->
    <GenericCRUDModal
      v-model="showPromoterDialog"
      mode="promoter"
      :editMode="editMode"
      @saved="handleSavedPromoter"
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
const emit = defineEmits(["update:promoters"]);

// State variables
const loading = ref(true);
const viewType = ref("cards");
const leaderboardMetric = ref("guests");
const searchQuery = ref("");
const statusFilter = ref("all");
const promoters = shallowRef([]);
const filteredPromoters = shallowRef([]);

// Remove unused dialogs & details states
const showPromoterDialog = ref(false);
const editMode = ref(false);
const formSubmitting = ref(false);

// Static table headers & filter options
const tableHeaders = [
  { title: "Nome", key: "name" },
  { title: "Status", key: "active", width: "100px" },
  { title: "Convidados", key: "guests", width: "100px", align: "center" },
  { title: "Check-ins", key: "checkIns", width: "100px", align: "center" },
  {
    title: "Conversão",
    key: "conversionRate",
    width: "100px",
    align: "center",
  },
  { title: "Receita", key: "revenue", width: "120px", align: "end" },
  {
    title: "Ações",
    key: "actions",
    width: "120px",
    align: "center",
    sortable: false,
  },
];

const statusOptions = [
  { title: "Todos", value: "all" },
  { title: "Ativos", value: "active" },
  { title: "Inativos", value: "inactive" },
];

// Computed stats for cards
const totalPromoters = computed(() => promoters.value.length);
const activePromoters = computed(
  () => promoters.value.filter((p) => p.active).length
);
const totalGuests = computed(() =>
  promoters.value.reduce((sum, p) => sum + p.guests, 0)
);
const totalRevenue = computed(() =>
  promoters.value.reduce((sum, p) => sum + p.revenue, 0)
);

const promoterCards = ref([
  {
    title: "Total Promotores",
    value: totalPromoters,
    icon: "mdi-account-group",
    iconColor: "primary",
    accentColor: "#e53935",
  },
  {
    title: "Ativos Hoje",
    value: activePromoters,
    icon: "mdi-account-check",
    iconColor: "success",
    accentColor: "#388e3c",
  },
  {
    title: "Total Convidados",
    value: totalGuests,
    icon: "mdi-ticket-confirmation",
    iconColor: "info",
    accentColor: "#0288d1",
  },
  {
    title: "Receita Gerada",
    value: computed(() => formatCurrency(totalRevenue.value)),
    icon: "mdi-cash",
    iconColor: "warning",
    accentColor: "#fbc02d",
  },
]);

// Fetch promoters (simulate API call)
const fetchPromoters = async () => {
  if (!loading.value) return;
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockPromoters = [
      {
        id: 1,
        name: "Carlos Silva",
        email: "carlos@exemplo.com",
        phone: "(11) 99876-5432",
        active: true,
        guests: 75,
        checkIns: 42,
        revenue: 9450,
        quota: 100,
        commission: 12,
        notes: "Promotor experiente, trabalha principalmente com público VIP.",
      },
      {
        id: 2,
        name: "Mariana Costa",
        email: "mariana@exemplo.com",
        phone: "(11) 98765-4321",
        active: true,
        guests: 68,
        checkIns: 45,
        revenue: 8160,
        quota: 80,
        commission: 10,
        notes: "Foco em público universitário.",
      },
      {
        id: 3,
        name: "Rafael Mendes",
        email: "rafael@exemplo.com",
        phone: "(11) 97654-3210",
        active: true,
        guests: 50,
        checkIns: 22,
        revenue: 6000,
        quota: 70,
        commission: 10,
        notes: "",
      },
      {
        id: 4,
        name: "Júlia Santos",
        email: "julia@exemplo.com",
        phone: "(11) 96543-2109",
        active: true,
        guests: 32,
        checkIns: 18,
        revenue: 3840,
        quota: 50,
        commission: 8,
        notes: "Primeira festa com a equipe.",
      },
      {
        id: 5,
        name: "Pedro Oliveira",
        email: "pedro@exemplo.com",
        phone: "(11) 95432-1098",
        active: false,
        guests: 25,
        checkIns: 0,
        revenue: 3000,
        quota: 40,
        commission: 10,
        notes: "Inativo temporariamente.",
      },
    ];
    promoters.value = mockPromoters;
    filterPromoters();
  } catch (error) {
    console.error("Error fetching promoters:", error);
  } finally {
    loading.value = false;
  }
};

// Filter function
const filterPromoters = () => {
  const query = searchQuery.value.toLowerCase();
  const isStatusFiltered = statusFilter.value !== "all";
  if (!isStatusFiltered && !query) {
    filteredPromoters.value = [...promoters.value];
    return;
  }
  filteredPromoters.value = promoters.value.filter((promoter) => {
    if (
      isStatusFiltered &&
      promoter.active !== (statusFilter.value === "active")
    ) {
      return false;
    }
    if (query) {
      return (
        promoter.name.toLowerCase().includes(query) ||
        promoter.email.toLowerCase().includes(query) ||
        promoter.phone.includes(query)
      );
    }
    return true;
  });
};

// Utility functions
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) return `R$ ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `R$ ${(num / 1000).toFixed(1)}k`;
  return `R$ ${num}`;
};

const calculateConversionRate = (promoter) => {
  if (!promoter.guests) return 0;
  return Math.round((promoter.checkIns / promoter.guests) * 100);
};

const getSortedPromotersByMetric = (metric) => {
  const sorted = [...filteredPromoters.value];
  switch (metric) {
    case "guests":
      return sorted.sort((a, b) => b.guests - a.guests);
    case "checkIns":
      return sorted.sort((a, b) => b.checkIns - a.checkIns);
    case "revenue":
      return sorted.sort((a, b) => b.revenue - a.revenue);
    case "conversion":
      return sorted.sort(
        (a, b) => calculateConversionRate(b) - calculateConversionRate(a)
      );
    default:
      return sorted;
  }
};

const leaderboardAvatarColors = [
  "warning",
  "grey-lighten-1",
  "amber-darken-3",
  "primary",
];
const getLeaderboardAvatarColor = (index) =>
  index < 3 ? leaderboardAvatarColors[index] : leaderboardAvatarColors[3];

// Promoter actions using GenericCRUDModal
const addPromoter = () => {
  editMode.value = false;
  showPromoterDialog.value = true;
};

const editPromoter = (promoter) => {
  // Pass the promoter data to GenericCRUDModal via event (the modal should handle filling its form)
  currentEditingPromoter.value = promoter;
  editMode.value = true;
  showPromoterDialog.value = true;
};

const currentEditingPromoter = ref(null);
const handleSavedPromoter = (savedPromoter) => {
  if (editMode.value && currentEditingPromoter.value) {
    const index = promoters.value.findIndex(
      (p) => p.id === currentEditingPromoter.value.id
    );
    if (index !== -1) {
      const updated = { ...promoters.value[index], ...savedPromoter };
      promoters.value.splice(index, 1, updated);
    }
  } else {
    promoters.value.push({
      id: Date.now(),
      guests: 0,
      checkIns: 0,
      revenue: 0,
      ...savedPromoter,
    });
  }
  filterPromoters();
  emit("update:promoters", promoters.value.length);
  currentEditingPromoter.value = null;
};

// Filter handlers
const handleFilterChange = (filters) => {
  const newSearch = filters.search;
  const newStatus =
    filters.filters.find((f) => f.id === "status")?.value || "all";
  if (searchQuery.value !== newSearch || statusFilter.value !== newStatus) {
    searchQuery.value = newSearch;
    statusFilter.value = newStatus;
    filterPromoters();
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "all";
  filterPromoters();
};

onMounted(fetchPromoters);
</script>

<style scoped>
.event-promoters {
  background-color: rgb(var(--v-theme-background));
}
.promoters-header {
  background-color: rgb(var(--v-theme-background));
  position: sticky;
  top: 0;
  z-index: 5;
}
.promoters-content {
  min-height: 400px;
}
.promoter-card {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  overflow: hidden;
}
.promoter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.promoter-active {
  border-left: 4px solid var(--v-success-base);
}
.performance-stats {
  background-color: rgba(0, 0, 0, 0.02);
}
.stat-block {
  flex: 1;
}
.empty-state {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  padding: 32px;
}
.leaderboard-card {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  overflow: hidden;
}
.leaderboard-item {
  border-radius: 8px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.leaderboard-item:hover {
  transform: translateY(-2px);
}
.top-1 {
  background-color: rgba(var(--v-warning-base), 0.1);
  border-left: 3px solid var(--v-warning-base);
}
.top-2 {
  background-color: rgba(var(--v-grey-base), 0.1);
  border-left: 3px solid var(--v-grey-lighten1);
}
.top-3 {
  background-color: rgba(var(--v-amber-darken3), 0.05);
  border-left: 3px solid var(--v-amber-darken3);
}
.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}
.metric-value {
  font-size: 16px;
}
@media (max-width: 600px) {
  .promoters-header {
    flex-direction: column;
  }
}
</style>
