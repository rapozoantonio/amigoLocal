<template>
  <div class="event-guests">
    <!-- Filter and stats sections -->
    <TabFilterComponent searchPlaceholder="Buscar convidados por nome, cpf, celular, email, instagram..."
      :searchValue="searchQuery" :filterOptions="[
        { label: 'Status', options: statusOptions, modelValue: statusFilter },
        { label: 'Lista', options: listsItems, modelValue: listFilter },
      ]" @filter-change="handleFilterChange" @reset="resetFilters" />

    <!-- <event-guest-filter-bar v-model:search="searchQuery" v-model:status="statusFilter" v-model:list="listFilter"
      :items="{ status: statusOptions, list: listsItems }"></event-guest-filter-bar> -->

    <div class="stat-chips d-flex overflow-x-auto px-4 py-2">
      <v-chip class="me-2 stat-chip" color="primary" density="compact" variant="outlined">
        <v-icon start size="x-small">mdi-account-group</v-icon>
        {{ totalGuests }}
      </v-chip>
      <v-chip class="me-2 stat-chip" color="success" density="compact" variant="outlined">
        <v-icon start size="x-small">mdi-account-check</v-icon>
        {{ totalCheckIns }}
      </v-chip>
      <v-chip class="me-2 stat-chip" color="warning" density="compact" variant="outlined">
        <v-icon start size="x-small">mdi-account-clock</v-icon>
        {{ totalPending }}
      </v-chip>
      <v-chip class="stat-chip" color="error" density="compact" variant="outlined">
        <v-icon start size="x-small">mdi-account-cancel</v-icon>
        {{ totalCancelled }}
      </v-chip>
    </div>

    <!-- Guest list -->
    <div class="guest-list px-4 pb-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <v-sheet v-else-if="filteredGuests.length === 0" class="empty-state text-center py-8">
        <v-icon icon="mdi-account-search" size="64" color="grey-lighten-1" class="mb-2" />
        <h3 class="text-h6 text-grey-darken-1">Nenhum convidado encontrado</h3>
        <p class="text-body-2 text-grey">Tente ajustar os filtros ou adicione novos convidados</p>
        <v-btn color="primary" prepend-icon="mdi-account-plus" class="mt-3" @click="showAddGuestDialog = true">
          Adicionar convidado
        </v-btn>
      </v-sheet>

      <!-- Guest cards -->
      <template v-else>
        <event-guest-item v-for="guest in filteredGuests" :key="guest.id" :guest="guest" @update="updateGuest"
          :loading="guest.id === guestForm.id ? actionLoading : false" @delete="deleteGuest" @checkin="performCheckIn"
          @edit="editGuest" :lists="lists"></event-guest-item>

      </template>
    </div>

    <!-- ADD GUESS DIALOG -->
    <form-dialog v-model:model="guestForm" :schema="guestSchema" v-model:opened="showAddGuestDialog"
      @submit="submitNewGuest" :items="{ list: listsItems }">
    </form-dialog>

    <!-- EDIT GUEST DIALOG -->
    <form-dialog @submit="updateGuest" v-model:model="guestForm" v-model:opened="showEditDialog" :schema="guestSchema"
      :items="{ list: listsItems }"></form-dialog>

    <!-- CHECK-IN DIALOG -->
    <form-dialog cancel="Cancelar" action="Confirmar Check-in" @submit="confirmCheckIn" :loading-btn="actionLoading"
      v-model:model="guestForm" v-model:opened="showCheckInDialog" title="Check-in de Convidado"
      :schema="guestCheckinSchema" :items="{ list: listsItems }">
      <template #prepend-inner>
        <div class="">
          <v-list-item :title="guestForm?.name" :subtitle="guestForm?.list?.name">
            <template #prepend>
              <v-avatar size="50" color="primary">
                <span class="text-h4 text-white">{{ guestForm?.name?.charAt(0) }}</span>
              </v-avatar>
            </template>
            <template #title>
              <span class="text-h6 text-white">{{ guestForm?.name }}</span>
            </template>
            <template #subtitle>
              <v-chip class=" text-white" label size="small">{{ guestForm?.list?.name }}</v-chip>
            </template>
            <template #append>
              <v-icon v-if="guestForm.vip" size="30" color="yellow">
                mdi-star
              </v-icon>
              <v-icon v-if="guestForm.blacklist" size="30" color="error">
                mdi-account-cancel
              </v-icon>
            </template>
          </v-list-item>
          <v-alert v-if="guestForm.blacklist" class="mt-4" border="top" type="warning" variant="outlined"
            density="compact" text="Esse convidado está incluido na Lista Negra do evento"></v-alert>
        </div>
      </template>
    </form-dialog>

    <!-- FLOAT ICON -->
    <v-fab icon="mdi-plus" app location="right bottom" color="primary" rounded="pill"
      @click="openAddGuestDialog"></v-fab>

  </div>
</template>

<script setup>
// SYSTEM
import { ref, computed, onMounted, shallowRef, inject, toRefs } from 'vue';

// COMPONENTS
import {
  statusOptions,
} from '@/management/consts/guestsMockData';
import TabFilterComponent from '@/management/components/events/TabFilterComponent.vue';
import FormDialog from '@/core/components/form/FormDialog.vue';
import EventGuestFilterBar from './EventGuestFilterBar.vue';
import EventGuestItem from './EventGuestItem.vue';

// STORE
import { useEventListStore } from "@/management/store/eventList";
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/core/store/auth';

// SCHEMAS
import guestSchema from '@/management/schemas/guestSchema';
import guestCheckinSchema from '@/management/schemas/guestCheckinSchema';

// STORES
const eventListStore = useEventListStore();
const authStore = useAuthStore();
const route = useRoute();

// DATA
const swal = inject(["$swal"]);
const notify = inject(["$notify"]);
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const listFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = ref(25);
const totalItems = ref(0);
const showAddGuestDialog = ref(false);
const guestForm = ref({});
const actionLoading = ref(false);
const showCheckInDialog = ref(false);
const showEditDialog = ref(false);

// PROPS
const props = defineProps(["guests", "lists", "event"]);
const { guests, lists, event } = toRefs(props)
// COMPUTED
const eventId = computed(() => {
  return route.params.eventId
})
const listsItems = computed(() => {
  if (!lists.value || lists.value.length === 0) {
    return []
  }
  return lists.value.map((list) => ({ id: list.id, name: list.name }))
})
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const filteredGuests = computed(() => {
  const search = searchQuery.value.toLowerCase();
  const isSearching = search.length > 0;
  const isStatusFiltered = statusFilter.value !== 'all';
  const isListFiltered = listFilter.value !== 'all';

  if (!isSearching && !isStatusFiltered && !isListFiltered) return guests.value;

  return guests.value.filter((guest) => {
    if (isStatusFiltered && guest.status !== statusFilter.value) return false;
    if (isListFiltered && guest.list.id !== listFilter.value) return false;
    if (isSearching) {
      return (
        guest.name?.toLowerCase().includes(search) ||
        guest.document?.toLowerCase().includes(search) ||
        guest.phone?.toLowerCase().includes(search) ||
        guest.email?.toLowerCase().includes(search) ||
        guest.instagram?.toLowerCase().includes(search)
      );
    }
    return true;
  });
});
const totalGuests = computed(() => totalItems.value);
const totalCheckIns = computed(() => guests.value.filter((g) => g.status === 'checked-in').length);
const totalPending = computed(() => guests.value.filter((g) => g.status === 'pending').length);
const totalCancelled = computed(() => guests.value.filter((g) => g.status === 'cancelled').length);

// METHODS
// Handler for items per page change
function handleItemsPerPageChange(newItems) {
  itemsPerPage.value = newItems;
  currentPage.value = 1;

};
// Filter handlers
function handleFilterChange(filters) {
  const newSearch = filters.search;
  const newStatus = filters.filters.find((f) => f.id === "status")?.value || "all";
  const newList = filters.filters.find((f) => f.id === "lista")?.value || "all";
  if (searchQuery.value !== newSearch || statusFilter.value !== newStatus || listFilter.value !== newList) {
    searchQuery.value = newSearch;
    statusFilter.value = newStatus;
    listFilter.value = newList;

  }
};
function resetFilters() {
  searchQuery.value = "";
  statusFilter.value = "all";
  listFilter.value = "all";

};
async function submitNewGuest(guest, close) {
  try {
    const existRequest = await eventListStore.checkIfGuestExistsInServer(guest, eventId.value);
    const existCustomer = await eventListStore.checkIfCustomerExists(guest);
    // const exists = eventListStore.checkIfGuestExists(guests.value, guest);
    console.log({ existRequest });
    if (existRequest.ok) {
      console.log("Guest ja existe");
      await swal.fire({
        title: "Convidado duplicado",
        html: `<p>Convidado <strong class="text-success">${existRequest.result[0].name}</strong> ja foi adicionado ao evento</p>`,
        icon: "error"
      })
      return false;
    }

    if (existCustomer.ok) {
      console.log("Customer encontrado");
      const firstResult = existCustomer.result[0];
      const customerCheck = await swal.fire({
        title: "Convidado identificado",
        html: `<p>Convidado <strong class="text-success">${firstResult?.name}</strong> ja é um cliente, deseja adicionar-lo?</p>`,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Sim, é ele mesmo",
        denyButtonText: "Não, é um convidado diferente",
        icon: "warning"
      })
      if (!customerCheck.isConfirmed) {
        return false;
      }
      guest = { ...guest, ...firstResult };
    }
    console.log(eventId.value)
    const response = await eventListStore.addGuestToList(eventId.value, guest);
    console.log({ response });
    guestForm.value = {}
    close();
  } catch (error) {

  }
}
async function updateGuest(guest, type) {
  console.log({ guest })
  guestForm.value = { ...guest };
  actionLoading.value = true;
  let action = "atualizado";
  switch (type) {
    case "restore":
      action = "restaurado"
      break;
    case "checkin":
      action = "checked-in"
      break;
    case "cancel":
      action = "cancelado"
      break;
    default:
      action = "atualizado"
      break;
  }
  try {
    const response = await eventListStore.updateGuest(eventId.value, guest);
    console.log({ response });
    if (response.ok) {
      console.log("guest updated");
      closeDialog();
      await notify.toast(`<strong class="text-success">${guest.name}</strong> ${action}`, "success");
    }
    else {
      console.log("response false");
    }
  } catch (error) {
    console.log({ error });
  }
  finally {
    actionLoading.value = false;
  }
}
async function confirmCheckIn(guestPayload) {
  try {
    actionLoading.value = true;

    const guestDoc = { ...guestForm.value, ...guestPayload }
    await closeDialog();
    await eventListStore.checkInGuest(eventId.value, guestDoc);
    await notify.toast(`${guestDoc.name} checked-in`);
  } catch (error) {
    console.log({ error });
  }
  finally {
    actionLoading.value = false;
  }


}

async function confirmCheckIn2(guestPayload) {
  try {
    actionLoading.value = true;

    const user = authStore.user
      ? { uid: authStore.user.uid, email: authStore.user.email }
      : null;
    const guestDoc = { ...guestForm.value, ...guestPayload, checkInTime: Date.now(), checkInBy: user, status: "checked-in" }
    await closeDialog();
    await updateGuest(guestDoc, "checkin");
    // await notify.toast(`${guestDoc.name} checked-in`);
  } catch (error) {
    console.log({ error })
  }
  finally {
    actionLoading.value = false;

  }

}
async function deleteGuest(guest) {
  try {
    const result = await swal.fire({
      title: "Deletar " + guest.name + "?",
      text: "Essa ação é irreversível",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!"
    })

    if (result.isConfirmed) {
      await eventListStore.deleteGuest(eventId.value, guest);
      await notify.toast("Convidado excluido!", "success");
    }
  } catch (error) {
    console.log({ error });
  } finally {

  }




}
async function closeDialog() {
  showCheckInDialog.value = false;
  showEditDialog.value = false;
  return;
}
async function performCheckIn(guest) {
  guestForm.value = { ...guest };
  showCheckInDialog.value = true;
}
async function editGuest(guest) {
  guestForm.value = { ...guest };
  showEditDialog.value = true;
}

async function openAddGuestDialog() {
  guestForm.value = {};
  showAddGuestDialog.value = true
}



</script>
