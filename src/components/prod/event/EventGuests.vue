<template>
  <div class="event-guests">
    <!-- Filter and stats sections -->
    <TabFilterComponent
      searchPlaceholder="Buscar convidados por nome, cpf, celular, email, instagram..."
      :searchValue="searchQuery"
      :filterOptions="[
        { label: 'Status', options: statusOptions, modelValue: statusFilter },
        { label: 'Lista', options: listOptions, modelValue: listFilter }
      ]"
      @filter-change="handleFilterChange"
      @reset="resetFilters"
    />

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
        <v-card
          v-for="guest in filteredGuests"
          :key="guest.id"
          border="thin"
          flat
          :ripple="false"
          class="guest-card mb-3"
          :class="{ 'guest-checked-in': guest.status === 'checked-in', 'guest-pending': guest.status === 'pending' }"
        >
          <div class="d-flex guest-card-content">
            <!-- Guest info section -->
            <div class="guest-info pa-3 flex-grow-1">
              <div class="d-flex align-start mb-1">
                <v-menu location="bottom end">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon variant="text" color="grey" size="small" class="action-btn me-2">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item @click="editGuest(guest)" prepend-icon="mdi-pencil" title="Editar" />
                    <v-list-item v-if="guest.status !== 'cancelled'" @click="cancelGuest(guest)" prepend-icon="mdi-cancel" title="Cancelar" />
                    <v-list-item v-if="guest.status === 'cancelled'" @click="restoreGuest(guest)" prepend-icon="mdi-restore" title="Restaurar" />
                    <v-divider />
                    <v-list-item @click="showDeleteConfirm(guest)" prepend-icon="mdi-delete" title="Excluir" class="text-error" />
                  </v-list>
                </v-menu>
                <div class="guest-name text-subtitle-1 font-weight-medium">{{ guest.name }}</div>
                <v-spacer />
                <v-chip size="x-small" :color="getStatusColor(guest.status)" text-color="white" class="status-chip ms-2">
                  {{ getStatusText(guest.status) }}
                </v-chip>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="guest-actions d-flex flex-column">
              <v-btn
                v-if="guest.status === 'pending'"
                icon
                variant="flat"
                color="success"
                :size="$vuetify.display.xs ? 'large' : 'small'"
                class="action-btn"
                :loading="actionLoading && selectedGuest?.id === guest.id"
                @click.stop="performCheckIn(guest)"
              >
                <v-icon>{{ $vuetify.display.xs ? 'mdi-check-circle' : 'mdi-check' }}</v-icon>
                <v-tooltip activator="parent" location="top">Check-in</v-tooltip>
              </v-btn>
              <v-btn
                v-else-if="guest.status === 'checked-in'"
                icon
                variant="text"
                color="error"
                size="small"
                class="action-btn"
                :loading="actionLoading && selectedGuest?.id === guest.id"
                @click="undoCheckIn(guest)"
              >
                <v-icon>mdi-undo</v-icon>
                <v-tooltip activator="parent" location="top">Desfazer Check-in</v-tooltip>
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- Pagination -->
        <div class="d-flex justify-center align-center mt-4 pagination-container">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            rounded
            @update:model-value="fetchGuests"
          />
          <v-select
            v-model="itemsPerPage"
            :items="[10, 25, 50, 100]"
            label="Por página"
            variant="outlined"
            hide-details
            density="compact"
            class="items-per-page ms-4"
            @update:model-value="handleItemsPerPageChange"
          />
        </div>
      </template>
    </div>

    <!-- Add Guest Dialog -->
    <v-dialog v-model="showAddGuestDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Adicionar Convidado</v-card-title>
        <v-card-text>
          <v-form ref="guestForm" v-model="formValid">
            <v-text-field
              v-model="guestForm.name"
              label="Nome completo"
              :rules="[(v) => !!v || 'Nome é obrigatório']"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.instagram"
              label="Instagram"
              :rules="[(v) => !!v || 'Instagram é obrigatório']"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.email"
              label="Email"
              :rules="[(v) => !v || /.+@.+\..+/.test(v) || 'Email inválido']"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.phone"
              label="Telefone"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.document"
              label="CPF"
              variant="outlined"
              class="mb-2"
            />
            <v-select
              v-model="guestForm.list"
              :items="listOptions"
              label="Lista"
              variant="outlined"
              class="mb-2"
            />
            <v-checkbox
              v-model="guestForm.vip"
              label="Convidado VIP"
              hide-details
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey-darken-1" variant="text" @click="showAddGuestDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="addGuest" :disabled="!formValid" :loading="formSubmitting">
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Guest Dialog -->
    <v-dialog v-model="showEditGuestDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Editar Convidado</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="formValid">
            <v-text-field
              v-model="guestForm.name"
              label="Nome completo"
              :rules="[(v) => !!v || 'Nome é obrigatório']"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.instagram"
              label="Instagram"
              :rules="[(v) => !!v || 'Instagram é obrigatório']"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.email"
              label="Email"
              :rules="[(v) => !v || /.+@.+\..+/.test(v) || 'Email inválido']"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.phone"
              label="Telefone"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="guestForm.document"
              label="CPF"
              variant="outlined"
              class="mb-2"
            />
            <v-select
              v-model="guestForm.list"
              :items="listOptions"
              label="Lista"
              variant="outlined"
              class="mb-2"
            />
            <v-checkbox
              v-model="guestForm.vip"
              label="Convidado VIP"
              hide-details
            />
            <v-checkbox
              v-model="guestForm.blacklist"
              label="Restrição"
              hide-details
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey-darken-1" variant="text" @click="showEditGuestDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="saveGuestEdit" :disabled="!formValid" :loading="formSubmitting">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Excluir Convidado</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir <strong>{{ selectedGuest?.name }}</strong>? Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey-darken-1" variant="text" @click="showDeleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" @click="deleteGuest" :loading="actionLoading">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Check-in Confirmation Dialog -->
    <v-dialog v-model="showCheckInDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Check-in de Convidado</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column align-center mb-4">
            <div class="guest-avatar mb-2">
              <v-avatar size="80" color="primary">
                <span class="text-h4 text-white">{{ selectedGuest?.name?.charAt(0) }}</span>
              </v-avatar>
            </div>
            <div class="text-h6">{{ selectedGuest?.name }}</div>
            <div class="text-subtitle-2">{{ selectedGuest?.list }}</div>
          </div>
          <v-divider class="mb-4" />
          <v-textarea
            v-model="checkInForm.notes"
            label="Observações (opcional)"
            variant="outlined"
            rows="2"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey-darken-1" variant="text" @click="showCheckInDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="success" @click="confirmCheckIn" :loading="actionLoading">
            Confirmar Check-in
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue';
import TabFilterComponent from '@/components/prod/event/TabFilterComponent.vue';

const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');
const listFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = ref(25);
const guests = shallowRef([]);
const totalItems = ref(0);
const showAddGuestDialog = ref(false);
const showEditGuestDialog = ref(false);
const showDeleteDialog = ref(false);
const showCheckInDialog = ref(false);
const formValid = ref(false);
const formSubmitting = ref(false);
const actionLoading = ref(false);
const selectedGuest = shallowRef(null);

// Filter options
const statusOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Pendentes', value: 'pending' },
  { title: 'Check-in Realizado', value: 'checked-in' },
  { title: 'Cancelados', value: 'cancelled' },
];
const listOptions = [
  { title: 'Todas', value: 'all' },
  { title: 'VIP', value: 'VIP' },
  { title: 'Promotor Carlos', value: 'Promotor Carlos' },
  { title: 'Promotor Maria', value: 'Promotor Maria' },
  { title: 'Pré-venda', value: 'Pré-venda' },
];

// Status mapping functions
const statusColorMap = { 'checked-in': 'success', pending: 'warning', cancelled: 'error' };
const statusTextMap = { 'checked-in': 'Check-in', pending: 'Pendente', cancelled: 'Cancelado' };
const getStatusColor = (status) => statusColorMap[status] || 'grey';
const getStatusText = (status) => statusTextMap[status] || 'Desconhecido';

// Form data
const guestForm = ref({ name: '', email: '', phone: '', document: '', instagram: '', list: 'VIP', vip: false, blacklist: false, });

// Check-in form data
const checkInForm = ref({ notes: '' });

// Computed properties for pagination and stats
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const filteredGuests = computed(() => {
  const search = searchQuery.value.toLowerCase();
  const isSearching = search.length > 0;
  const isStatusFiltered = statusFilter.value !== 'all';
  const isListFiltered = listFilter.value !== 'all';

  if (!isSearching && !isStatusFiltered && !isListFiltered) return guests.value;

  return guests.value.filter((guest) => {
    if (isStatusFiltered && guest.status !== statusFilter.value) return false;
    if (isListFiltered && guest.list !== listFilter.value) return false;
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

// Fetch guests (simulate API call)
const fetchGuests = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockGuests = [];
    const statusValues = ['pending', 'checked-in', 'cancelled'];
    const lists = ['VIP', 'Promotor Carlos', 'Promotor Maria', 'Pré-venda'];
    for (let i = 1; i <= itemsPerPage.value; i++) {
      const id = (currentPage.value - 1) * itemsPerPage.value + i;
      if (id > 120) break;
      const status = statusValues[Math.floor(Math.random() * (statusFilter.value === 'all' ? 3 : 1))];
      if (statusFilter.value !== 'all' && status !== statusFilter.value) continue;
      const list = lists[Math.floor(Math.random() * lists.length)];
      if (listFilter.value !== 'all' && list !== listFilter.value) continue;
      const hasCheckedIn = status === 'checked-in';
      mockGuests.push({
        id,
        name: `Convidado ${id}`,
        email: `convidado${id}@exemplo.com`,
        phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        document: `${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 100)}`,
        list,
        vip: Math.random() > 0.7,
        status,
        checkInTime: hasCheckedIn ? new Date(Date.now() - Math.floor(Math.random() * 3600000)) : null,
        checkInBy: hasCheckedIn ? 'Hostess Ana' : null,
      });
    }
    guests.value = mockGuests;
    totalItems.value = 120;
  } catch (error) {
    console.error('Error fetching guests:', error);
  } finally {
    loading.value = false;
  }
};

// Handler for items per page change
const handleItemsPerPageChange = (newItems) => {
  itemsPerPage.value = newItems;
  currentPage.value = 1;
  fetchGuests();
};

// Filter handlers
const handleFilterChange = (filters) => {
  const newSearch = filters.search;
  const newStatus = filters.filters.find((f) => f.id === "status")?.value || "all";
  const newList = filters.filters.find((f) => f.id === "lista")?.value || "all";
  if (searchQuery.value !== newSearch || statusFilter.value !== newStatus || listFilter.value !== newList) {
    searchQuery.value = newSearch;
    statusFilter.value = newStatus;
    listFilter.value = newList;
    fetchGuests();
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "all";
  listFilter.value = "all";
  fetchGuests();
};

// Check-in functions
const performCheckIn = async (guest) => {
  if (actionLoading.value) return;
  actionLoading.value = true;
  selectedGuest.value = guest;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const index = guests.value.findIndex((g) => g.id === guest.id);
    if (index !== -1) {
      const updated = { ...guests.value[index], status: 'checked-in', checkInTime: new Date(), checkInBy: 'Hostess Ana' };
      guests.value.splice(index, 1, updated);
    }
  } catch (error) {
    console.error('Error checking in guest:', error);
  } finally {
    actionLoading.value = false;
    selectedGuest.value = null;
  }
};

const undoCheckIn = async (guest) => {
  if (actionLoading.value) return;
  actionLoading.value = true;
  selectedGuest.value = guest;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const index = guests.value.findIndex((g) => g.id === guest.id);
    if (index !== -1) {
      const updated = { ...guests.value[index], status: 'pending', checkInTime: null, checkInBy: null };
      guests.value.splice(index, 1, updated);
    }
  } catch (error) {
    console.error('Error undoing check-in:', error);
  } finally {
    actionLoading.value = false;
    selectedGuest.value = null;
  }
};

const cancelGuest = async (guest) => {
  if (actionLoading.value) return;
  actionLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const index = guests.value.findIndex((g) => g.id === guest.id);
    if (index !== -1) {
      const updated = { ...guests.value[index], status: 'cancelled' };
      guests.value.splice(index, 1, updated);
    }
  } catch (error) {
    console.error('Error cancelling guest:', error);
  } finally {
    actionLoading.value = false;
  }
};

const restoreGuest = async (guest) => {
  if (actionLoading.value) return;
  actionLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const index = guests.value.findIndex((g) => g.id === guest.id);
    if (index !== -1) {
      const updated = { ...guests.value[index], status: 'pending' };
      guests.value.splice(index, 1, updated);
    }
  } catch (error) {
    console.error('Error restoring guest:', error);
  } finally {
    actionLoading.value = false;
  }
};

const showDeleteConfirm = (guest) => {
  selectedGuest.value = guest;
  showDeleteDialog.value = true;
};

const deleteGuest = async () => {
  if (!selectedGuest.value || actionLoading.value) return;
  actionLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    guests.value = guests.value.filter((g) => g.id !== selectedGuest.value.id);
    totalItems.value--;
    showDeleteDialog.value = false;
  } catch (error) {
    console.error('Error deleting guest:', error);
  } finally {
    actionLoading.value = false;
  }
};

// **** New functions to fix "editar" and add guest functionality ****

// Edit guest function (was missing)
const editGuest = (guest) => {
  // Fill the form with the guest data and open the edit dialog
  guestForm.value = { ...guest };
  showEditGuestDialog.value = true;
  selectedGuest.value = guest; // track which guest is being edited
};

// Function for adding a new guest from the Add Guest dialog
const addGuest = async () => {
  if (!formValid.value) return;
  formSubmitting.value = true;
  try {
    const newGuest = { ...guestForm.value, id: Date.now(), status: 'pending' };
    guests.value.push(newGuest);
    totalItems.value++;
    showAddGuestDialog.value = false;
    // Reset form
    guestForm.value = { name: '', email: '', phone: '', document: '', instagram: '', list: 'VIP', vip: false };
  } catch (error) {
    console.error('Error adding guest:', error);
  } finally {
    formSubmitting.value = false;
  }
};

// Function to save guest edits from the Edit Guest dialog
const saveGuestEdit = async () => {
  if (!formValid.value) return;
  formSubmitting.value = true;
  try {
    const index = guests.value.findIndex((g) => g.id === guestForm.value.id);
    if (index !== -1) {
      guests.value.splice(index, 1, { ...guestForm.value });
    }
    showEditGuestDialog.value = false;
  } catch (error) {
    console.error('Error saving guest edit:', error);
  } finally {
    formSubmitting.value = false;
  }
};

// Initialization
onMounted(fetchGuests);
</script>

<style scoped>
@media (max-width: 600px) {
  .guest-card {
    padding: 8px;
    margin-bottom: 8px;
  }
  .guest-name {
    font-size: 0.875rem;
    line-height: 1.25;
  }
  .status-chip {
    font-size: 0.65rem;
    height: 18px;
  }
  .action-btn {
    min-width: 42px;
    min-height: 42px;
  }
  .guest-checked-in {
    border-left-width: 3px;
  }
  .guest-pending {
    border-left: 3px solid rgb(var(--v-theme-warning));
  }
}
.guest-card {
  transition: transform 0.2s ease;
}
.guest-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.guest-details {
  gap: 12px;
  row-gap: 8px;
}
.status-chip {
  font-weight: 600;
  letter-spacing: 0.25px;
}
</style>
