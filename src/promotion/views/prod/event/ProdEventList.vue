<template>
  <v-container class="event-container" fluid>
    <!-- Skeleton loader for improved perceived performance -->
    <v-sheet v-if="loading" class="w-100">
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        type="card, divider"
        class="mb-4"
      ></v-skeleton-loader>
    </v-sheet>

    <!-- Real content after loading -->
    <v-sheet v-else class="w-100">
      <!-- Filters and search bar - always visible, always sticky -->
      <div ref="filtersContainer" class="filters-container mb-6">
        <v-row>
          <v-col cols="12" sm="6" md="8">
            <v-btn-toggle
              v-model="activeFilter"
              color="primary"
              rounded="pill"
              density="comfortable"
              mandatory
            >
              <v-btn value="upcoming">Próximos</v-btn>
              <v-btn value="past">Anteriores</v-btn>
              <v-btn value="all">Todos</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Buscar eventos..."
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              bg-color="surface"
              class="search-field"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <!-- Empty state -->
      <v-sheet
        v-if="filteredEvents.length === 0"
        class="empty-state d-flex flex-column align-center justify-center my-8"
      >
        <v-icon
          icon="mdi-calendar-remove"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        ></v-icon>
        <h3 class="text-h6 text-grey-darken-1">Nenhum evento encontrado</h3>
        <p class="text-body-2 text-grey text-center mt-2">
          Não encontramos eventos correspondentes aos filtros aplicados
        </p>
      </v-sheet>

      <!-- Events list -->
      <div v-else class="events-content">
        <transition-group name="event-list" tag="div" class="event-list">
          <event-list-item
            v-for="event in filteredEvents"
            :key="event.id"
            :event="event"
            @click="navigateToEventDetails(event.id)"
            @edit="navigateToEditEvent"
            @duplicate="duplicateEvent"
            @delete="confirmDeleteEvent"
            class="mb-4"
          />
        </transition-group>

        <!-- Lazy loading indicator -->
        <div v-if="hasMoreEvents" class="text-center my-4 pb-16">
          <v-progress-circular
            v-if="loadingMore"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-btn v-else variant="text" color="primary" @click="loadMoreEvents">
            Carregar mais eventos
          </v-btn>
        </div>
      </div>
    </v-sheet>

    <!-- Floating Action Button -->
    <floating-action-button
      icon="mdi-plus"
      tooltip="Novo evento"
      @click="showNewEventModal"
    />

    <!-- New Event Modal -->
    <new-event-modal
      v-model="newEventModalVisible"
      @saved="handleNewEventSaved"
    />

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Excluir evento</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir este evento? Esta ação não pode ser
          desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn color="error" variant="flat" @click="deleteEvent">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify/lib/framework.mjs";
import EventListItem from "@/promotion/components/prod/event/EventListItem.vue";
import FloatingActionButton from "@/promotion/components/prod/event/FloatingActionButton.vue";
import NewEventModal from "@/promotion/components/prod/event/NewEventModal.vue"; // Import the new modal component

const router = useRouter();
const { xs, name: displayName } = useDisplay();

const loading = ref(true);
const loadingMore = ref(false);
const hasMoreEvents = ref(true);
const deleteDialog = ref(false);
const eventToDelete = ref(null);
const newEventModalVisible = ref(false); // State for new event modal visibility

// References and scroll state
const filtersContainer = ref(null);

// Search and filters
const searchQuery = ref("");
const activeFilter = ref("upcoming"); // Using a single filter control instead of an object

// Pagination
const page = ref(1);
const eventsPerPage = 10;

// Events data - replace with API calls in production
const events = ref([]);

// Updated eventsData with revenue information
const eventsData = [
  {
    id: 1,
    name: "Festa de Lançamento",
    date: new Date(new Date().getTime() + 86400000 * 7), // 7 days in future
    location: "Club XYZ, São Paulo",
    checkInCount: 0,
    totalGuests: 250,
    status: "upcoming",
    thumbnail: "https://picsum.photos/id/103/300/200",
    vipListsCount: 3,
    promotersCount: 5,
    revenue: 15500,
    revenuePrediction: 10000,
  },
  {
    id: 2,
    name: "Noite Eletrônica",
    date: new Date(new Date().getTime() + 86400000 * 14), // 14 days in future
    location: "Espaço Cultural, Rio de Janeiro",
    checkInCount: 0,
    totalGuests: 180,
    status: "upcoming",
    thumbnail: "https://picsum.photos/id/106/300/200",
    vipListsCount: 2,
    promotersCount: 4,
    revenue: 8000,
    revenuePrediction: 12000,
  },
  {
    id: 3,
    name: "Aniversário Club",
    date: new Date(new Date().getTime() - 86400000 * 7), // 7 days in past
    location: "Club ABC, Belo Horizonte",
    checkInCount: 143,
    totalGuests: 150,
    status: "completed",
    thumbnail: "https://picsum.photos/id/109/300/200",
    vipListsCount: 2,
    promotersCount: 3,
    revenue: 35000,
    revenuePrediction: 20000,
  },
  {
    id: 4,
    name: "Festival de Verão",
    date: new Date(new Date().getTime() + 86400000 * 30), // 30 days in future
    location: "Praia Grande, Santos",
    checkInCount: 0,
    totalGuests: 500,
    status: "upcoming",
    thumbnail: "https://picsum.photos/id/110/300/200",
    vipListsCount: 5,
    promotersCount: 8,
    revenue: 0, // No revenue yet for future event
    revenuePrediction: 75000,
  },
];

// Mock API call to fetch events
const fetchEvents = async () => {
  loading.value = true;

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, replace with actual API call
    // const response = await eventService.getEvents(page.value, eventsPerPage, activeFilter.value);
    // events.value = [...events.value, ...response.data];
    // hasMoreEvents.value = response.hasMore;

    events.value = eventsData;
    hasMoreEvents.value = false;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Implement error handling (toast notification, etc.)
  } finally {
    loading.value = false;
  }
};

// Load more events for pagination
const loadMoreEvents = async () => {
  if (loadingMore.value || !hasMoreEvents.value) return;

  loadingMore.value = true;
  page.value += 1;

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real app, replace with actual API call
    // const response = await eventService.getEvents(page.value, eventsPerPage, activeFilter.value);
    // events.value = [...events.value, ...response.data];
    // hasMoreEvents.value = response.hasMore;

    // For demo, just set hasMore to false
    hasMoreEvents.value = false;
  } catch (error) {
    console.error("Error loading more events:", error);
  } finally {
    loadingMore.value = false;
  }
};

// Updated computed property for filtered events using the single filter control
const filteredEvents = computed(() => {
  let result = [...events.value];

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (event) =>
        event.name.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );
  }

  // Apply status filters
  if (activeFilter.value === "upcoming") {
    result = result.filter((event) => event.status === "upcoming");
  } else if (activeFilter.value === "past") {
    result = result.filter((event) => event.status === "completed");
  }
  // 'all' filter shows everything

  return result;
});

// Navigation functions
const navigateToEventDetails = (eventId) => {
  router.push(`/event/${eventId}`);
};

// Show new event modal
const showNewEventModal = () => {
  newEventModalVisible.value = true;
};

// Handle new event saved
const handleNewEventSaved = (newEvent) => {
  // Add the new event to the list (in a real app, you might refetch from API instead)
  if (newEvent) {
    events.value = [newEvent, ...events.value];
  }
};

const navigateToAddEvent = () => {
  router.push("/event/new");
};

const navigateToEditEvent = (eventId) => {
  router.push(`/event/${eventId}/edit`);
};

// Event actions
const duplicateEvent = (event) => {
  console.log("Duplicating event:", event);
  // Implement duplication logic
  // eventService.duplicateEvent(event.id)
  //   .then(response => {
  //     // Handle success
  //   });
};

const confirmDeleteEvent = (eventId) => {
  eventToDelete.value = eventId;
  deleteDialog.value = true;
};

const deleteEvent = () => {
  // Implement deletion logic
  console.log("Deleting event:", eventToDelete.value);

  // For demo, just remove from the array
  events.value = events.value.filter(
    (event) => event.id !== eventToDelete.value
  );
  deleteDialog.value = false;
  eventToDelete.value = null;
};

// Simplified scroll handler that only adds shadow when scrolling
const handleScroll = () => {
  if (!filtersContainer.value) return;

  const scrollPosition = window.scrollY;
  const isStickyVisible = scrollPosition > 0;

  // Apply sticky class conditionally
  if (isStickyVisible) {
    filtersContainer.value.classList.add("is-sticky");
  } else {
    filtersContainer.value.classList.remove("is-sticky");
  }
};

// Fetch events on component mount and setup scroll handler
onMounted(() => {
  fetchEvents();

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.event-container {
  padding-top: 16px;
  padding-bottom: 80px; /* Extra space for FAB */
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.events-content {
  margin-bottom: 72px; /* Space for FAB */
}

.event-list-enter-active,
.event-list-leave-active {
  transition: all 0.3s ease;
}

.event-list-enter-from,
.event-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.filters-container {
  position: sticky;
  top: 64px; /* Adjust based on your app bar height */
  z-index: 4;
  background-color: var(--v-theme-background);
  padding-top: 12px;
  padding-bottom: 12px;
  transition: box-shadow 0.3s ease;
}

/* Add shadow when scrolled to indicate "sticky" status */
.filters-container.is-sticky {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (min-width: 960px) {
  .event-container {
    padding-left: 32px;
    padding-right: 32px;
  }
}

/* Optimize for mobile scrolling performance */
.event-list {
  will-change: transform;
  overscroll-behavior: contain;
}

/* Empty state centering */
.empty-state {
  min-height: 40vh;
}

/* Search field style adjustments */
.search-field {
  border-radius: 24px;
}

@media (max-width: 599px) {
  .filters-container {
    top: 56px; /* Smaller top offset for mobile */
  }
}
</style>
