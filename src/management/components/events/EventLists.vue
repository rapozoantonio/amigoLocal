<template>
  <div class="event-lists">
    <!-- Simplified Header -->
    <div class="list-header px-4 py-3">
      <div class="d-flex flex-wrap justify-space-between align-center mb-3">
        <h2 class="text-h6 font-weight-bold mb-0">Lista</h2>
        <v-btn color="primary" prepend-icon="mdi-playlist-plus" size="small" @click="openAddListDialog"
          aria-label="Add new list">
          Nova Lista
        </v-btn>

      </div>
      <TabFilterComponent searchPlaceholder="Search lists..." :searchValue="searchQuery"
        :filterOptions="statusOptionsFilter" @filter-change="handleFilterChange" @reset="resetFilters" />
    </div>
    <!-- 4-Stat Grid for Lists Summary -->
    <FourStatCards :cards="listCards" />

    <!-- Lists Container -->
    <div class="lists-container px-4 pb-4">
      <v-row v-if="!loading && filteredAndSortedLists.length > 0">
        <v-col v-for="list in filteredAndSortedLists" :key="list.id" cols="12" sm="6" md="4" lg="3">
          <event-list-item :list="list" :key="list.id" @list:edit="editList" @list:update="updateList"
            @list:delete="deleteList" @list:addGuest="openBulkGuestModal" :totals="totals[list.id]"
            @list:duplicate="duplicateList"></event-list-item>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-sheet v-else-if="!loading" class="text-center py-8 rounded-lg">
        <v-icon icon="mdi-playlist-remove" size="72" class="mb-4 mt-4" />
        <h3 class="text-h6">
          {{ searchQuery ? "No matches found" : "Create your first list" }}
        </h3>
        <v-btn color="primary" prepend-icon="mdi-playlist-plus" class="mt-3" rounded="pill" @click="openAddListDialog">
          New List
        </v-btn>
      </v-sheet>

      <!-- Loading State -->
      <div v-else class="d-flex flex-column justify-center align-center py-8">
        <v-progress-circular indeterminate size="64" width="4" class="mb-4" />
        <span class="text-medium-emphasis">Loading guest lists...</span>
      </div>
    </div>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" location="bottom">
      {{ snackbarText }}
    </v-snackbar>

    <!--  EDIT LIST -->
    <form-dialog :items="{ promoters: promoters.map(p => ({ name: p.name, id: p.id })) }"
      v-model:opened="showEditListDialog" cancel title="Editar lista" action="Salvar" @submit="submitUpdateList"
      v-model:model="listForm" :schema="listSchema"></form-dialog>

    <!-- ADD LIST -->
    <form-dialog :items="{ promoters: promoters.map(p => ({ name: p.name, id: p.id })) }"
      v-model:opened="showAddListDialog" @submit="submitList" title="Criar lista
      " action="Criar lista" cancel v-model:model="listForm" :schema="listSchema">

      <!-- <template #activator="props">
       
      </template> -->
    </form-dialog>

    <v-fab icon="mdi-plus" app location="right bottom" :color="fabMenu ? 'grey' : 'primary'" rounded="pill">
      <v-icon>{{ fabMenu ? 'mdi-close' : 'mdi-plus' }}</v-icon>
      <v-speed-dial v-model="fabMenu" location="top center" activator="parent">
        <v-btn @click="openAddListDialog" size="default" variant="flat" key="1" color="primary">
          <v-icon start size="20">mdi-playlist-plus</v-icon>
          <span>Criar nova lista</span>
        </v-btn>
        <v-btn @click="openBulkGuestModal(null)" size="default" variant="flat" key="1" color="primary">
          <v-icon start size="20">mdi-account-group</v-icon>
          <span>Add convidados</span>
        </v-btn>
      </v-speed-dial>
    </v-fab>


    <BulkAddGuestsModal v-model="showBulkGuestModal" :eventId="eventId" :defaultList="selectedList"
      :existingGuests="guests" :listOptions="lists" @guestsAdded="handleGuestsAdded" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, toRefs } from "vue";
import TabFilterComponent from "@/management/components/events/TabFilterComponent.vue";
import FourStatCards from "@/management/components/events/FourStatCards.vue";
import GenericCRUDModal from "@/management/components/events/GenericCRUDModal.vue";
import BulkAddGuestsModal from "@/management/components/events/BulkAddGuestsModal.vue";
import EventListItem from "./EventListItem.vue";

import { useRoute } from "vue-router";

import listSchema from "@/management/schemas/listSchema";
import FormDialog from "@/core/components/form/FormDialog.vue";
import { useEventListStore } from "@/management/store/eventList";

// State
const eventListStore = useEventListStore();
const props = defineProps(["lists", "event", "eventId", "guests", "promoters"]);
const { lists, event, eventId, guests, promoters } = toRefs(props);
const route = useRoute();
const loading = ref(false);
const searchQuery = ref("");
const swal = inject("$swal");
const notify = inject("$notify");
// const lists = ref([]);
const filteredLists = ref([]);
const showDeleteDialog = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const statusFilter = ref("all");
const showBulkGuestModal = ref(false);

// For GenericCRUDModal (List mode)
const modalVisible = ref(false);
const showAddListDialog = ref(false);
const showEditListDialog = ref(false);
const modalMode = ref("list");
const modalEditMode = ref(false);
const selectedList = ref(null);
const listForm = ref({});

const fabMenu = ref(false);

// Filter options for TabFilterComponent
const statusOptions = [
  { title: "All", value: "all" },
  { title: "Active", value: "active" },
  { title: "Inactive", value: "inactive" },
];
const statusOptionsFilter = [
  {
    label: "Status",
    options: statusOptions,
    modelValue: statusFilter.value,
  },
];


const totals = computed(() => {
  return lists.value.reduce((total, list) => {
    const listGuests = guests.value.filter(guest => guest.list?.id === list.id);
    const checkIns = listGuests.filter(guest => guest.status === "checked-in");

    total[list.id] = {
      guestCount: listGuests.length,
      checkIns: checkIns.length,
    }
    return total
  }, {});
});

const filteredAndSortedLists = computed(() => {
  let result = lists.value;
  console.log(lists.value);
  if (statusFilter.value === "active") {
    result = result.filter((list) => list.active);
  } else if (statusFilter.value === "inactive") {
    result = result.filter((list) => !list.active);
  }
  return result.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      list.owner?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleFilterChange = (filters) => {
  searchQuery.value = filters.search;
  statusFilter.value =
    filters.filters.find((f) => f.id === "status")?.value || "all";
};

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "all";
};

const toggleListStatus = (list) => {
  list.active = !list.active;
  showSnackbar(`List ${list.active ? "activated" : "paused"}`);
};

const showSnackbar = (text) => {
  snackbarText.value = text;
  snackbar.value = true;
};

// -------------------------
// SUMMARY STAT COMPUTED VALUES
// -------------------------
const totalLists = computed(() => lists.value.length);
const totalGuests = computed(() =>
  guests.value.length
);
const totalCheckIns = computed(() =>
  guests.value.filter(guest => guest.status === "checked-in").length
);
const totalRevenue = computed(() =>
  lists.value.reduce((sum, list) => sum + list.price * list.guestCount, 0)
);

// Prepare stat cards for lists summary
const listCards = computed(() => [
  {
    title: "Total Lists",
    value: totalLists.value,
    icon: "mdi-playlist-check",
    iconColor: "primary",
    accentColor: "#e53935",
  },
  {
    title: "Total Guests",
    value: totalGuests.value,
    icon: "mdi-account-group",
    iconColor: "info",
    accentColor: "#0288d1",
  },
  {
    title: "Total Check-ins",
    value: totalCheckIns.value,
    icon: "mdi-ticket-confirmation",
    iconColor: "success",
    accentColor: "#388e3c",
  },
  {
    title: "Conversion Rate",
    value:
      totalGuests.value > 0
        ? (
          Math.ceil((totalCheckIns.value / totalGuests.value) * 100 * 100) /
          100
        ).toFixed(0) + "%"
        : "N/A",
    icon: "mdi-chart-line",
    iconColor: "warning",
    accentColor: "#fbc02d",
  },
]);


function openAddListDialog() {
  listForm.value = {};
  showAddListDialog.value = true;
};

async function submitList(list, close) {
  console.log({ list });
  const id = route.params.eventId;
  console.log("eventID: ", id);
  try {
    const response = await eventListStore.createList(id, list);
    close();
    notify.toast(`Lista <strong class="text-success">${list.name}</strong> criada`)
    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
}

async function handleGuestsAdded(guestsPayload) {
  console.log({ guestsPayload })
  const id = route.params.eventId;
  const responseArray = guestsPayload.map(g => {
    return eventListStore.addGuestToList(id, g);
  });
  try {
    const response = await Promise.all(responseArray);
    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
}


async function openBulkGuestModal(list) {
  selectedList.value = list || null; // adjust according to your list structure
  showBulkGuestModal.value = true;
}

async function deleteList(list) {
  try {
    const result = await swal.fire({
      title: "Deletar " + list.name + "?",
      html: `Deletar lista <strong>${list.name}</strong>? Essa ação é irreversível`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!"
    });
    if (result.isConfirmed) {
      await eventListStore.deleteList(eventId.value, list);
      swal.fire({
        title: "Lista excluida!",
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
async function duplicateList(list) {
  // TODO

}

async function submitUpdateList(list, close) {
  console.log("list", listForm.value);
  try {
    delete list.guestCount;
    delete list.checkIns;
    const response = await eventListStore.updateList(eventId.value, list);
    close();
    await notify.toast(`Lista <strong class="text-success">${list.name}</strong> atualizada`);
    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
}

async function updateList(list, type) {
  console.log("list", listForm.value);
  try {
    delete list.guestCount;
    delete list.checkIns;
    const response = await eventListStore.updateList(eventId.value, list);
    close();
    let action = "atualizada";
    if (type === "status") {
      action = list.active ? "activada" : "pausada";
    }
    await notify.toast(`Lista <strong class="text-success">${list.name}</strong> ${action}`);

    console.log({ response });
  } catch (error) {
    console.log({ error });

  }
}

async function editList(list) {
  listForm.value = { ...list };
  showEditListDialog.value = true;
}


</script>
