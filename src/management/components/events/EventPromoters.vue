<template>
  <div class="event-promoters">
    <!-- Header section with summary stats and search -->
    <div class="promoters-header px-4 py-3">
      <div class="d-flex justify-space-between align-center mb-3">
        <h2 class="text-h6 font-weight-bold mb-0">Equipe de Promotores</h2>
        <v-btn color="primary" prepend-icon="mdi-account-plus" size="small" @click="openCreateDialog">
          Novo Promotor
        </v-btn>
      </div>

      <!-- Search and filter bar -->
      <TabFilterComponent searchPlaceholder="Buscar promotores..." :searchValue="searchQuery" :filterOptions="[
        { label: 'Status', options: statusOptions, modelValue: statusFilter },
      ]" @filter-change="handleFilterChange" @reset="resetFilters" />

      <FourStatCards :cards="promoterCards" />
    </div>

    <!-- Promoters list section -->
    <div class="promoters-content px-4 pb-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <v-sheet v-else-if="filteredPromoters.length === 0" class="empty-state text-center py-8">
        <v-icon icon="mdi-account-search" size="64" color="grey-lighten-1" class="mb-2" />
        <h3 class="text-h6 text-grey-darken-1">Nenhum promotor encontrado</h3>
        <p class="text-body-2 text-grey">
          Adicione promotores à sua equipe para começar
        </p>
        <v-btn color="primary" prepend-icon="mdi-account-plus" class="mt-3" @click="openCreateDialog">
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
              <v-col v-for="promoter in filteredPromoters" :key="promoter.id" cols="12" sm="6" md="4" lg="3">
                <event-promoter-item :promoter="promoter" @promoter:edit="editPromoter"
                  @promoter:delete="deletePromoter" @promoter:update="updatePromoter"></event-promoter-item>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Table view -->
          <v-window-item value="table">
            <event-promoter-table :promoters="filteredPromoters" @promoter:edit="editPromoter"
              @promoter:update="updatePromoter"></event-promoter-table>
          </v-window-item>

          <!-- Leaderboard view -->
          <v-window-item value="leaderboard">
            <event-promoter-learderboard :promoters="filteredPromoters"></event-promoter-learderboard>
          </v-window-item>
        </v-window>
      </div>
    </div>

    <!-- CREATE PROMOTER DIALOG -->
    <form-dialog :schema="eventPromoterSchema" v-model:model="promoterForm" v-model:opened="showCreateDialog"
      @submit="submitPromoter">
      <template #prepend-inner>
        <field-user-search entity="promoters" @select="selectPromoter"></field-user-search>
      </template>
    </form-dialog>
    <!-- EDIT PROMOTER DIALOG -->
    <form-dialog :schema="eventPromoterSchema" v-model:model="promoterForm" v-model:opened="showEditDialog"
      @submit="submitPromoterUpdate">
    </form-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, shallowRef, toRefs, inject } from "vue";
import TabFilterComponent from "@/management/components/events/TabFilterComponent.vue";
import FourStatCards from "@/management/components/events/FourStatCards.vue";
import FieldUserSearch from "./FieldUserSearch.vue";
import FormDialog from "@/core/components/form/FormDialog.vue";
import EventPromoterTable from "./EventPromoterTable.vue";
// Import the necessary mock data at the top of the script section
import eventPromoterItem from "./eventPromoterItem.vue";
import EventPromoterLearderboard from "./EventPromoterLearderboard.vue";
import {
  mockPromoters,
  promoterTableHeaders,
  statusOptions,
  calculateConversionRate,
  formatCurrency,
  getLeaderboardAvatarColor,
  getSortedPromotersByMetric
} from '@/management/consts/promotersMockData';

import eventPromoterSchema from "@/management/schemas/eventPromoterSchema";
import { useEventListStore } from "@/management/store/eventList";
import { useRoute } from "vue-router";

const swal = inject("$swal");
const props = defineProps({
  event: { type: Object, required: true },
  promoters: { type: Array, required: true }
});

const { event, promoters } = toRefs(props);
const emit = defineEmits(["update:promoters"]);
const eventListStore = useEventListStore();
const route = useRoute();
// State variables
const loading = ref(false);
const viewType = ref("cards");
const searchQuery = ref("");
const statusFilter = ref("all");
// const promoters = shallowRef([]);

// Remove unused dialogs & details states
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const editMode = ref(false);
const formSubmitting = ref(false);

const promoterForm = ref({});

// Static table headers & filter options
const tableHeaders = promoterTableHeaders;

// Computed stats for cards

const eventId = computed(() => {
  return route.params.eventId;
})
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

// Filter function
const filteredPromoters = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const isStatusFiltered = statusFilter.value !== "all";
  if (!isStatusFiltered && !query) {
    return [...promoters.value];
  }
  return promoters.value.filter((promoter) => {
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
});


function openCreateDialog() {
  promoterForm.value = {};
  showCreateDialog.value = true
}

// const editPromoter = (promoter) => {
//   // Pass the promoter data to GenericCRUDModal via event (the modal should handle filling its form)
//   currentEditingPromoter.value = promoter;
//   editMode.value = true;
//   showCreateDialog.value = true;
// };

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

function filterPromoters() {

}

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

function selectPromoter(promoter) {
  if (promoter.name) promoterForm.value.name = promoter.name;
  if (promoter.phone) promoterForm.value.phone = promoter.phone;
  if (promoter.email) promoterForm.value.email = promoter.email;
  if (promoter.id) promoterForm.value.id = promoter.id;
}

async function submitPromoter(promoter, close) {
  try {
    console.log({ promoter });
    const result = await eventListStore.createPromoter(eventId.value, promoter);
    console.log({ result })
    close();
  } catch (error) {
    console.log({ error });
  }
}

function editPromoter(promoter) {
  promoterForm.value = { ...promoter };
  showEditDialog.value = true;
}

async function submitPromoterUpdate(promoter, close) {
  try {
    console.log({ promoter });
    const result = await eventListStore.updatePromoter(eventId.value, promoter);
    console.log({ result })
    close();
  } catch (error) {
    console.log({ error });
  }
}

async function updatePromoter(promoter) {
  try {
    console.log({ promoter });
    const result = await eventListStore.updatePromoter(eventId.value, promoter);
    console.log({ result })
    close();
  } catch (error) {
    console.log({ error });
  }
}

async function deletePromoter(promoter) {
  try {
    const result = await swal.fire({
      title: "Deletar " + promoter.name + "?",
      html: `Deletar promoter <strong>${promoter.name}</strong>? Essa ação é irreversível`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!"
    });
    if (result.isConfirmed) {
      await eventListStore.deletePromoter(eventId.value, promoter);
      swal.fire({
        title: "Promoter excluido!",
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

onMounted(() => {
});
</script>
