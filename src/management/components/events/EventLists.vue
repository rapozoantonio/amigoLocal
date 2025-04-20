<template>
  <div class="event-lists">
    <!-- Simplified Header -->
    <div class="list-header px-4 py-3">
      <div class="d-flex flex-wrap justify-space-between align-center mb-3">
        <h2 class="text-h6 font-weight-bold mb-0">Lista</h2>
        <v-btn
          color="primary"
          prepend-icon="mdi-playlist-plus"
          size="small"
          @click="openAddListDialog"
          aria-label="Add new list"
        >
          Nova Lista
        </v-btn>
      </div>
      <TabFilterComponent
        searchPlaceholder="Search lists..."
        :searchValue="searchQuery"
        :filterOptions="statusOptionsFilter"
        @filter-change="handleFilterChange"
        @reset="resetFilters"
      />
    </div>

    <!-- 4-Stat Grid for Lists Summary -->
    <FourStatCards :cards="listCards" />

    <!-- Lists Container -->
    <div class="lists-container px-4 pb-4">
      <v-row v-if="!loading && filteredAndSortedLists.length > 0">
        <v-col
          v-for="list in filteredAndSortedLists"
          :key="list.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 4 : 1"
              border="thin"
              class="h-100 list-card"
            >
              <v-card-title
                class="d-flex justify-space-between align-center py-3"
              >
                <span class="text-subtitle-1 font-weight-medium text-truncate">
                  {{ list.name }}
                </span>
                <v-menu location="bottom end">
                  <template v-slot:activator="{ props: menuProps }">
                    <v-btn
                      v-bind="menuProps"
                      icon
                      variant="text"
                      size="small"
                      @click.stop
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item
                      prepend-icon="mdi-pencil"
                      title="Edit list"
                      @click="editList(list)"
                    />
                    <v-list-item
                      v-if="list.active"
                      prepend-icon="mdi-pause-circle"
                      title="Pause list"
                      @click="toggleListStatus(list)"
                    />
                    <v-list-item
                      v-else
                      prepend-icon="mdi-play-circle"
                      title="Activate list"
                      @click="toggleListStatus(list)"
                    />
                    <v-list-item
                      prepend-icon="mdi-content-duplicate"
                      title="Duplicate list"
                      @click="duplicateList(list)"
                    />
                    <v-divider />
                    <v-list-item
                      prepend-icon="mdi-delete"
                      title="Delete list"
                      class="text-error"
                      @click.stop="confirmDeleteList(list)"
                    />
                  </v-list>
                </v-menu>
              </v-card-title>

              <v-divider />

              <v-card-text class="py-3">
                <div class="d-flex justify-space-between mb-3">
                  <div class="text-center">
                    <div class="text-h6">{{ list.guestCount }}</div>
                    <div class="text-caption">Guests</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6">{{ list.checkIns }}</div>
                    <div class="text-caption">Check-ins</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6">
                      {{ list.quota > 0 ? list.quota : "∞" }}
                    </div>
                    <div class="text-caption">Quota</div>
                  </div>
                </div>
                <!-- Price Display -->
                <div class="text-center mb-3">
                  <div class="text-h6">{{ formatPrice(list.price) }}</div>
                  <div class="text-caption">Price</div>
                </div>
                <!-- Cut-off Time Display -->
                <div class="text-center mb-3">
                  <div v-if="list.cutoffTime" class="text-h6">
                    {{ list.cutoffTime }}
                  </div>
                  <div v-else class="text-h6 text-grey">No Cut-off Time</div>
                  <div class="text-caption">Cut-off Time</div>
                </div>
                <v-progress-linear
                  v-if="list.quota > 0"
                  :model-value="getProgressPercentage(list)"
                  :color="getProgressColor(list)"
                  height="12"
                  rounded
                  class="mt-2"
                />
              </v-card-text>

              <v-divider />

              <v-card-actions class="pa-3">
                <v-btn
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-account-plus"
                  rounded="pill"
                  @click.stop="openBulkGuestModal(list)"
                  block
                >
                  Add Guest
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-sheet v-else-if="!loading" class="text-center py-8 rounded-lg">
        <v-icon icon="mdi-playlist-remove" size="72" class="mb-4 mt-4" />
        <h3 class="text-h6">
          {{ searchQuery ? "No matches found" : "Create your first list" }}
        </h3>
        <v-btn
          color="primary"
          prepend-icon="mdi-playlist-plus"
          class="mt-3"
          rounded="pill"
          @click="openAddListDialog"
        >
          New List
        </v-btn>
      </v-sheet>

      <!-- Loading State -->
      <div v-else class="d-flex flex-column justify-center align-center py-8">
        <v-progress-circular indeterminate size="64" width="4" class="mb-4" />
        <span class="text-medium-emphasis">Loading guest lists...</span>
      </div>
    </div>

    <!-- Replace the original Add/Edit Dialog with GenericCRUDModal for List mode -->
    <GenericCRUDModal
      v-model="modalVisible"
      :mode="modalMode"
      :editMode="modalEditMode"
      @saved="handleSaved"
    />

    <!-- Delete Confirmation -->
    <v-dialog v-model="showDeleteDialog" max-width="450">
      <v-card>
        <v-card-title class="pa-4"> Confirm Deletion </v-card-title>
        <v-card-text class="pa-4">
          Delete list <strong>"{{ selectedList?.name }}"</strong> permanently?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="showDeleteDialog = false" class="me-2"> Cancel </v-btn>
          <v-btn color="error" @click="deleteList"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" location="bottom">
      {{ snackbarText }}
    </v-snackbar>

    <BulkAddGuestsModal
    v-model="showBulkGuestModal"
    :defaultList="selectedList"
    :existingGuests="guests"
    :listOptions="listOptions"
    @guestsAdded="handleGuestsAdded"
  />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TabFilterComponent from "@/management/components/events/TabFilterComponent.vue";
import FourStatCards from "@/management/components/events/FourStatCards.vue";
import GenericCRUDModal from "@/management/components/events/GenericCRUDModal.vue";
import BulkAddGuestsModal from "@/management/components/events/BulkAddGuestsModal.vue";

// State
const loading = ref(true);
const searchQuery = ref("");
const lists = ref([]);
const filteredLists = ref([]);
const showDeleteDialog = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const statusFilter = ref("all");
const showBulkGuestModal = ref(false);
const guests = ref([]);

// For GenericCRUDModal (List mode)
const modalVisible = ref(false);
const modalMode = ref("list");
const modalEditMode = ref(false);
const selectedList = ref(null);
const listForm = ref({
  name: "",
  quota: 0,
  owner: "",
  active: true,
  price: 0,
  cutoffTime: "",
});

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

// Computed property for filtering and sorting lists
const filteredAndSortedLists = computed(() => {
  let result = filteredLists.value;
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

// When bulk guests are added, update your guest list.
const updateGuests = (mergedGuests) => {
  guests.value = mergedGuests;
};

const openBulkGuestModal = (list) => {
  selectedList.value = list.name || list.value; // adjust according to your list structure
  showBulkGuestModal.value = true;
};

// Dummy data for demonstration
const dummyLists = [
  {
    id: 1,
    name: "VIP List",
    guestCount: 10,
    checkIns: 5,
    quota: 20,
    owner: "Manager",
    active: true,
    price: 100,
    cutoffTime: "22:00",
  },
  {
    id: 2,
    name: "General",
    guestCount: 50,
    checkIns: 30,
    quota: 100,
    owner: "Promoter",
    active: true,
    price: 50,
    cutoffTime: "",
  },
];

const fetchLists = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  lists.value = dummyLists;
  filteredLists.value = dummyLists;
  loading.value = false;
};

const handleFilterChange = (filters) => {
  searchQuery.value = filters.search;
  statusFilter.value =
    filters.filters.find((f) => f.id === "status")?.value || "all";
};

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "all";
};

const openAddListDialog = () => {
  modalEditMode.value = false;
  listForm.value = {
    name: "",
    quota: 0,
    owner: "",
    active: true,
    price: 0,
    cutoffTime: "",
  };
  modalVisible.value = true;
};

const editList = (list) => {
  modalEditMode.value = true;
  listForm.value = { ...list };
  selectedList.value = list;
  modalVisible.value = true;
};

const handleSaved = (savedEntity) => {
  // savedEntity should contain the list data from GenericCRUDModal (mode 'list')
  const newList = {
    ...savedEntity,
    id:
      modalEditMode.value && selectedList.value
        ? selectedList.value.id
        : lists.value.length + 1,
    guestCount:
      modalEditMode.value && selectedList.value
        ? selectedList.value.guestCount
        : 0,
    checkIns:
      modalEditMode.value && selectedList.value
        ? selectedList.value.checkIns
        : 0,
  };

  if (modalEditMode.value && selectedList.value) {
    const index = lists.value.findIndex((l) => l.id === selectedList.value.id);
    if (index !== -1) {
      lists.value[index] = newList;
    }
  } else {
    lists.value.push(newList);
  }
  filteredLists.value = lists.value;
};

const confirmDeleteList = (list) => {
  selectedList.value = list;
  showDeleteDialog.value = true;
};

const deleteList = async () => {
  lists.value = lists.value.filter((l) => l.id !== selectedList.value.id);
  showDeleteDialog.value = false;
  showSnackbar("List deleted");
};

const toggleListStatus = (list) => {
  list.active = !list.active;
  showSnackbar(`List ${list.active ? "activated" : "paused"}`);
};

const duplicateList = (list) => {
  lists.value.push({
    ...list,
    id: lists.value.length + 1,
    name: `${list.name} Copy`,
  });
  showSnackbar("List duplicated");
};

const getProgressPercentage = (list) =>
  Math.min((list.checkIns / list.quota) * 100, 100) || 0;

const getProgressColor = (list) =>
  getProgressPercentage(list) >= 100
    ? "error"
    : getProgressPercentage(list) >= 75
    ? "warning"
    : "success";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
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
  lists.value.reduce((sum, list) => sum + list.guestCount, 0)
);
const totalCheckIns = computed(() =>
  lists.value.reduce((sum, list) => sum + list.checkIns, 0)
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

onMounted(fetchLists);
</script>
