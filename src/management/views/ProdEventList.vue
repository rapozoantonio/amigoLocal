<template>
  <v-container>
    <!-- Skeleton loader for improved perceived performance -->
    <v-sheet v-if="loading" class="w-100">
      <v-skeleton-loader v-for="i in 3" :key="i" type="card, divider" class="mb-4"></v-skeleton-loader>
    </v-sheet>

    <!-- Real content after loading -->
    <v-sheet v-else class="w-100">
      <!-- Filters and search bar - always visible, always sticky -->
      <div ref="filtersContainer" class="filters-container mb-6">
        <v-row>
          <v-col cols="12" sm="6" md="8">
            <v-btn-toggle v-model="activeFilter" color="primary" rounded="pill" density="comfortable" mandatory>
              <v-btn value="upcoming">Próximos</v-btn>
              <v-btn value="past">Anteriores</v-btn>
              <v-btn value="all">Todos</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" placeholder="Buscar eventos..."
              variant="outlined" density="compact" hide-details rounded="pill" bg-color="surface"
              class="search-field"></v-text-field>
          </v-col>
        </v-row>
      </div>

      <!-- Empty state -->
      <v-sheet v-if="filteredEvents.length === 0"
        class="empty-state d-flex flex-column align-center justify-center my-8">
        <v-icon icon="mdi-calendar-remove" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
        <h3 class="text-h6 text-grey-darken-1">Nenhum evento encontrado</h3>
        <p class="text-body-2 text-grey text-center mt-2">
          Não encontramos eventos correspondentes aos filtros aplicados
        </p>
      </v-sheet>

      <!-- Events list -->
      <div v-else class="events-content">
        <transition-group name="event-list" tag="div" class="event-list">
          <event-item v-for="event in filteredEvents" :key="event.id" :event="event"
            @click="navigateToEventDetails(event.id)" @edit="navigateToEditEvent" @duplicate="duplicateEvent"
            @delete="deleteEvent" class="mb-4" />
        </transition-group>

        <!-- Lazy loading indicator -->
        <div v-if="hasMoreEvents" class="text-center my-4 pb-16">
          <v-progress-circular v-if="loadingMore" indeterminate color="primary"></v-progress-circular>
          <v-btn v-else variant="text" color="primary" @click="loadMoreEvents">
            Carregar mais eventos
          </v-btn>
        </div>
      </div>
    </v-sheet>

    <!-- Floating Action Button -->
    <!-- <floating-action-button @click="newEventModalVisible = true" icon="mdi-plus" tooltip="Novo evento" /> -->


    <!-- New Event Modal -->
    <!-- <new-event-modal v-model="newEventModalVisible" @saved="handleNewEventSaved" /> -->

    <form-dialog :fullscreen="true" :schema="eventListSchema" v-model:model="newEvent"
      v-model:opened="newEventModalVisible" @submit="handleNewEventSubmit">
      <template #activator="{ props }">
        <floating-action-button @click="newEventModalVisible = true" icon="mdi-plus" tooltip="Novo evento" />
      </template>
      <template #action-append>
        <v-btn class="ml-2" type="submit">Save and Close</v-btn>
      </template>
    </form-dialog>

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
          <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false">
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
import { ref, computed, onMounted, onUnmounted, inject } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify/lib/framework.mjs";
import EventItem from "@/management/components/events/EventItem.vue";
import FloatingActionButton from "@/management/components/FloatingActionButton.vue";
import NewEventModal from "@/management/components/events/NewEventModal.vue";
import { eventsData } from "@/management/consts/eventListMockData";


import FormDialog from "@/core/components/form/FormDialog.vue";
import eventListSchema from "@/core/schemas/eventListSchema";
import { useEventListStore } from "../store/eventList";
import { useFirebaseStore } from "@/core/store/firebase";
const firebaseStore = useFirebaseStore();
const newEvent = ref({ name: "", });

const swal = inject("$swal");

const router = useRouter();
const { xs, name: displayName } = useDisplay();

const loading = ref(true);
const loadingMore = ref(false);
const hasMoreEvents = ref(true);
const deleteDialog = ref(false);
const eventToDelete = ref(null);
const newEventModalVisible = ref(false);
const unsubscribe = ref(null);

// References and scroll state
const filtersContainer = ref(null);

// Search and filters
const searchQuery = ref("");
const activeFilter = ref("upcoming");

const eventListStore = useEventListStore();

// Pagination
const page = ref(1);
const eventsPerPage = 10;

// Events data - replace with API calls in production
const events = ref([]);

// Mock API call to fetch events

function addEventToList(event) {
  events.value.push(event);
}

function modifyEventInList(event) {
  const index = events.value.findIndex((e) => e.id === event.id);
  if (index !== -1) {
    events.value.splice(index, 1, event);
  }
}

function removeEventFromList(event) {
  const index = events.value.findIndex((e) => e.id === event.id);
  if (index !== -1) {
    events.value.splice(index, 1);
  }
}


async function fetchEvents() {
  loading.value = true;
  events.value = [];
  try {
    unsubscribe.value = await firebaseStore.watchCollection({ path: "eventList" }, addEventToList, modifyEventInList, removeEventFromList);
    hasMoreEvents.value = false;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Implement error handling (toast notification, etc.)
  } finally {
    loading.value = false;
  }
};

const fetchEvents2 = async () => {
  loading.value = true;
  try {
    const response = await eventListStore.getEvents();
    console.log({ response });
    events.value = response;
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
  router.push(`/events/${eventId}`);
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
  router.push("/events/create");
};

const navigateToEditEvent = (eventId) => {
  router.push(`/events/${eventId}/edit`);
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

const deleteEvent2 = () => {
  // Implement deletion logic
  console.log("Deleting event:", eventToDelete.value);

  // For demo, just remove from the array
  events.value = events.value.filter(
    (event) => event.id !== eventToDelete.value
  );
  deleteDialog.value = false;
  eventToDelete.value = null;
};


async function deleteEvent(eventId) {

  console.log({ swal })
  try {
    const result = await swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })

    if (result.isConfirmed) {
      await eventListStore.deleteEvent(eventId);
      swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      })
    }
  } catch (error) {
    console.log({ error });
  } finally {

  }

}

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

async function handleNewEventSubmit(event, close) {
  console.log({ event });
  try {
    const createdEvent = await eventListStore.createEvent(event);
    if (createdEvent) {
      newEvent.value = {};
      close();
    }
    console.log({ createdEvent });
  } catch (error) {
    console.log({ error })
  }
}

onUnmounted(() => {
  unsubscribe.value();
})

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
