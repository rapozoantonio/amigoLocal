<template>
  <div class="event-detail-page">
    <!-- Immersive loading animation -->
    <div v-if="loading" class="loading-container">
      <v-sheet class="loading-content">
        <v-skeleton-loader type="card, paragraph" class="mb-6 loading-skeleton"></v-skeleton-loader>
        <div class="loading-pulse"></div>
      </v-sheet>
    </div>

    <template v-else>
      <!-- Dynamic event header with parallax effect and live status indicator -->
      <div class="event-header position-relative">
        <v-img :src="event.image?.url || 'https://picsum.photos/id/103/1200/400'"
          :gradient="'to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75)'" :height="$vuetify.display.xs ? '160px' : '240px'"
          cover class="event-cover mb-3" :class="{ 'event-cover-live': event.status === 'live' }">
          <!-- Floating navigation elements -->
          <v-container>
            <v-row>
              <v-col cols="12">

                <div class="d-flex justify-space-between align-start pa-4">
                  <v-btn icon variant="text" color="white" @click="goBack" to="/events"
                    class="bg-black-opacity elevation-3" density="comfortable">
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>

                  <div class="d-flex">
                    <!-- Quick check-in button for live events -->
                    <v-btn v-if="true" color="primary" variant="flat" density="comfortable"
                      prepend-icon="mdi-qrcode-scan" class="me-2 quick-action-btn elevation-3"
                      @click="openCheckInScanner" rounded="pill">
                      Check-in
                    </v-btn>

                    <v-menu location="bottom end" transition="slide-y-transition">
                      <template v-slot:activator="{ props }">
                        <v-btn icon variant="text" color="white" v-bind="props" density="comfortable">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list rounded="lg" elevation="10" class="action-menu">
                        <v-list-item @click="editEvent(event)" prepend-icon="mdi-pencil">
                          <v-list-item-title>Editar informações</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="shareEvent" prepend-icon="mdi-share-variant">
                          <v-list-item-title>Compartilhar</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="duplicateEvent" prepend-icon="mdi-content-copy">
                          <v-list-item-title>Duplicar evento</v-list-item-title>
                        </v-list-item>

                        <v-divider class="my-2"></v-divider>

                        <v-list-item @click="showDeleteDialog = true" prepend-icon="mdi-delete" class="text-error">
                          <v-list-item-title>Excluir evento</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
                <!-- Event info with rich typography and adaptive layout -->
                <div class="event-info-overlay pa-4">
                  <div class="d-flex flex-column">
                    <div class="d-flex align-start justify-space-between">
                      <div class="event-title-container">
                        <transition name="fade-slide" appear>
                          <h1 class="text-h5 text-sm-h4 font-weight-bold text-white mb-1 event-title">
                            {{ event.name }}
                          </h1>
                        </transition>

                        <!-- Live indicator badge for active events -->
                        <div v-if="event.status === 'live'" class="live-indicator">
                          <span class="live-dot"></span>
                          AO VIVO
                        </div>
                      </div>
                      <!-- Status chip with animations -->
                      <v-chip :color="getStatusColor(event.status)" size="small" class="status-chip" text-color="white"
                        variant="elevated">
                        {{ getStatusText(event.status) }}
                      </v-chip>
                    </div>

                    <!-- Event metadata with improved iconography -->
                    <div class="event-metadata d-flex flex-wrap align-center text-white text-opacity-90 mt-2">
                      <v-chip label variant="tonal" class="bg-grey-darken-4 mr-2" density="comfortable">
                        <v-icon size="16" color="white" class="me-1">mdi-calendar-outline</v-icon>
                        <span class="text-caption text-sm-body-2">{{
                          new Date(event.startDate).toLocaleDateString("pt-BR")
                        }}</span>
                      </v-chip>
                      <v-chip label variant="tonal" class="bg-grey-darken-4 mr-2" density="comfortable">
                        <v-icon size="16" color="white" class="me-1">mdi-clock-outline</v-icon>
                        <span class="text-caption text-sm-body-2">{{
                          new Date(event.startDate).toTimeString().slice(0, 5)
                        }}</span>
                      </v-chip>
                      <v-chip label variant="tonal" class="bg-grey-darken-4 mr-2" density="comfortable">
                        <v-icon size="16" color="white" class="me-1">mdi-map-marker-outline</v-icon>
                        <span class="text-caption text-sm-body-2">{{
                          event.location
                        }}</span>
                      </v-chip>
                    </div>

                    <!-- Countdown timer for upcoming events -->
                    <div v-if="event.status === 'upcoming'" class="countdown-timer mt-2">
                      <div class="countdown-label text-caption">Inicia em:</div>
                      <div class="countdown-value">{{ countdownText }}</div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </div>

      <v-container>
        <v-row>
          <v-col cols="12">
            <!-- Enhanced metrics cards with micro-visualizations -->
            <MainFourEvenMetrics :lists="lists" :event="event" :guests="guests" :hostesses="hostesses"
              :promoters="promoters" :checkInTrend="checkInTrend" />
            <!-- Enhanced tabs with swipe support and improved visual design -->
            <v-card flat class="mx-auto tab-container">
              <v-bottom-navigation v-if="sm || xs" grow v-model="activeTab" bg-color="background" show-arrows
                color="primary" height="80" class="event-tabs " density="default" centered fixed-tabs>
                <v-btn value="dashboard" class="tab-item pb-5 ">
                  <v-icon size="small" class="tab-icon">mdi-view-dashboard-outline</v-icon>
                  <span class="text-caption">Dash</span>
                </v-btn>

                <v-btn value="guests" class="tab-item pb-5 ">
                  <v-icon size="small" class="tab-icon">mdi-account-group-outline</v-icon>
                  <span class="text-caption">Guests</span>
                </v-btn>

                <v-btn value="lists" class="tab-item pb-5 ">
                  <v-icon size="small" class="tab-icon">mdi-format-list-bulleted</v-icon>
                  <span class="text-caption">Listas</span>
                </v-btn>

                <v-btn value="promoters" class="tab-item pb-5 ">
                  <v-icon size="small" class="tab-icon">mdi-account-tie</v-icon>
                  <span class="text-caption">Promoters</span>
                </v-btn>

                <v-btn value="hostesses" class="tab-item pb-5 ">
                  <v-icon size="small" class="tab-icon">mdi-account-supervisor-outline</v-icon>
                  <span class="text-caption">Hostess</span>
                </v-btn>
              </v-bottom-navigation>
              <v-tabs v-else v-model="activeTab" show-arrows slider-color="primary" class="event-tabs" stacked
                density="comfortable" centered grow>
                <v-tab value="dashboard" class="tab-item">
                  <v-icon size="small" class="tab-icon">mdi-view-dashboard-outline</v-icon>
                  <span class="tab-text">Dash</span>
                </v-tab>

                <v-tab value="guests" class="tab-item">
                  <v-icon size="small" class="tab-icon">mdi-account-group-outline</v-icon>
                  <span class="tab-text">Guests</span>
                </v-tab>

                <v-tab value="lists" class="tab-item">
                  <v-icon size="small" class="tab-icon">mdi-format-list-bulleted</v-icon>
                  <span class="tab-text">Listas</span>
                </v-tab>

                <v-tab value="promoters" class="tab-item">
                  <v-icon size="small" class="tab-icon">mdi-account-tie</v-icon>
                  <span class="tab-text">Promotores</span>
                </v-tab>

                <v-tab value="hostesses" class="tab-item">
                  <v-icon size="small" class="tab-icon">mdi-account-supervisor-outline</v-icon>
                  <span class="tab-text">Hostess</span>
                </v-tab>
              </v-tabs>



              <v-divider class="tab-divider"></v-divider>

              <!-- Swipeable content area with transition effects -->
              <v-window v-model="activeTab" class="event-tab-content" :continuous="false" :touch="false">
                <!-- Dashboard Tab with enhanced visualization -->
                <v-window-item value="dashboard">
                  <event-dashboard :lists="lists" :event="event" :eventId="event.id" :guests="guests"
                    :promoters="promoters" :hostesses="hostesses" @refresh="fetchEventData" />
                </v-window-item>

                <!-- Other tabs with improved layouts -->
                <v-window-item value="guests">
                  <event-guests :lists="lists" :event="event" :eventId="event.id" :guests="guests"
                    :promoters="promoters" :hostesses="hostesses" />
                </v-window-item>

                <v-window-item value="lists">
                  <event-lists :lists="lists" :event="event" :eventId="event.id" :guests="guests" :promoters="promoters"
                    :hostesses="hostesses" />
                </v-window-item>

                <v-window-item value="promoters">
                  <event-promoters :lists="lists" :event="event" :eventId="event.id" :guests="guests"
                    :hostesses="hostesses" :promoters="promoters" />
                </v-window-item>

                <v-window-item value="hostesses">
                  <event-hostesses :lists="lists" :event="event" :eventId="event.id" :guests="guests"
                    :hostesses="hostesses" :promoters="promoters" />
                </v-window-item>
                <!-- 
          <v-window-item value="reports">
            <event-reports :event="event" />
          </v-window-item> -->
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <!-- Modern floating action button with context awareness -->
    <!-- <floating-action-button :icon="fabIcon" :tooltip="fabTooltip" :color="fabColor" @click="handleFabClick"
      class="dynamic-fab" /> -->

    <!-- Enhanced modals with improved UX -->
    <!-- <edit-event-modal v-model="editModalVisible" :event="event" @saved="handleEventUpdated" /> -->

    <form-dialog :fullscreen="true" :schema="eventListSchema" v-model:model="eventForm" v-model:opened="showEditDialog"
      v-model:loading="loading" @submit="updateEvent" cancel title="Editar evento">
    </form-dialog>

    <!-- Delete confirmation with animation -->
    <v-dialog v-model="showDeleteDialog" max-width="400" transition="dialog-bottom-transition">
      <v-card class="confirm-dialog rounded-lg">
        <v-card-title class="text-h5 pb-2">Excluir evento</v-card-title>
        <v-card-text>
          <p>
            Tem certeza que deseja excluir <strong>"{{ event.name }}"</strong>?
          </p>
          <p class="text-caption text-red mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showDeleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="flat" @click="deleteEvent" :loading="deleteLoading">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <qr-code-reader-dialog v-model="scannerVisible"></qr-code-reader-dialog>

    <!-- Share event dialog -->
    <v-dialog v-model="shareDialogVisible" max-width="400" transition="dialog-bottom-transition">
      <v-card class="share-dialog rounded-lg">
        <v-card-title class="text-h5 pb-2">Compartilhar evento</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Compartilhe "{{ event.name }}" com sua equipe ou nas redes sociais:
          </p>

          <div class="share-options d-flex flex-wrap justify-center">
            <v-btn variant="text" color="primary" class="share-btn" @click="shareViaChannel('whatsapp')">
              <v-icon size="24" class="mb-1">mdi-whatsapp</v-icon>
              <span class="d-block text-caption">WhatsApp</span>
            </v-btn>

            <v-btn variant="text" color="blue" class="share-btn" @click="shareViaChannel('email')">
              <v-icon size="24" class="mb-1">mdi-email-outline</v-icon>
              <span class="d-block text-caption">Email</span>
            </v-btn>

            <v-btn variant="text" color="blue-darken-2" class="share-btn" @click="shareViaChannel('facebook')">
              <v-icon size="24" class="mb-1">mdi-facebook</v-icon>
              <span class="d-block text-caption">Facebook</span>
            </v-btn>

            <v-btn variant="text" color="pink-darken-1" class="share-btn" @click="shareViaChannel('instagram')">
              <v-icon size="24" class="mb-1">mdi-instagram</v-icon>
              <span class="d-block text-caption">Instagram</span>
            </v-btn>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-text-field :model-value="eventShareLink" label="Link do evento" variant="outlined" readonly
            append-inner-icon="mdi-content-copy" @click:append-inner="copyShareLink"
            class="share-link-field"></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="shareDialogVisible = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify/lib/framework.mjs";
import FloatingActionButton from "@/management/components/FloatingActionButton.vue";
import EditEventModal from "@/management/components/events/EditEventModal.vue";
import EventDashboard from "@/management/components/events/EventDashboard.vue";
import EventGuests from "@/management/components/events/EventGuests.vue";
import EventLists from "@/management/components/events/EventLists.vue";
import EventPromoters from "@/management/components/events/EventPromoters.vue";
import EventHostesses from "@/management/components/events/EventHostesses.vue";
import MainFourEvenMetrics from "@/management/components/events/MainFourEvenMetrics.vue";
import FormDialog from "@/core/components/form/FormDialog.vue";
import QrCodeReaderDialog from "../components/events/QrCodeReaderDialog.vue";
import QrCodeReader from "../components/events/QrCodeReader.vue";
import eventListSchema from "@/core/schemas/eventListSchema";
// Import mock data
import {
  getMockEventData,
  mockListDistribution,
  mockCheckInTrend,
  simulateApiDelay,
} from "@/management/consts/eventDetailMockData";

import { useEventListStore } from "../store/eventList";

const { eventId } = defineProps(["eventId"]);
const eventListStore = useEventListStore();
const showEditDialog = ref(false);
const loading = ref(true);
const swal = inject("$swal");

async function updateEvent(event, close) {
  try {

    const result = await eventListStore.updateEvent(event);
    console.log({ result })
    if (result.ok) {
      close();
    }
  } catch (error) {
    console.log({ error })
  }
  finally {
    loading.value = false;
  }
}

// Define the TrendIndicator component
const TrendIndicator = {
  props: {
    value: {
      type: Number,
      required: true,
    },
    thresholds: {
      type: Object,
      default: () => ({ positive: 0.05, warning: -0.05, negative: -0.1 }),
    },
  },
  setup(props) {
    const getIcon = computed(() => {
      if (props.value >= props.thresholds.positive) return "mdi-trending-up";
      if (props.value <= props.thresholds.negative) return "mdi-trending-down";
      return "mdi-trending-neutral";
    });

    const getColor = computed(() => {
      if (props.value >= props.thresholds.positive) return "success";
      if (props.value <= props.thresholds.negative) return "error";
      if (props.value <= props.thresholds.warning) return "warning";
      return "success";
    });

    return { getIcon, getColor };
  },
  template: `
    <v-icon :icon="getIcon" :color="getColor" size="14"></v-icon>
  `,
};
// Enhanced component state
const route = useRoute();
const router = useRouter();
const { xs, sm } = useDisplay();
const event = ref({});
const activeTab = ref("dashboard");
const editModalVisible = ref(false);
const showDeleteDialog = ref(false);
const deleteLoading = ref(false);
const scannerVisible = ref(false);
const manualCheckInCode = ref("");
const shareDialogVisible = ref(false);
const checkInTrend = ref(mockCheckInTrend); // Using imported mock trend value

const lists = ref([]);
const guests = ref([]);
const promoters = ref([]);
const hostesses = ref([]);

const eventForm = ref({})

// Mock data for visualizations
const listDistribution = ref(mockListDistribution);

// Computed properties
const promoterEfficiency = computed(() => {
  if (!event.value.promotersCount || event.value.promotersCount === 0)
    return "0 convidados";
  const guestsPerPromoter = Math.round(
    event.value.totalGuests / event.value.promotersCount
  );
  return `${guestsPerPromoter} convidados`;
});

// Event share link
const eventShareLink = computed(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/events/${eventId}`;
});

// Countdown computation
const countdownText = computed(() => {
  if (!event.value.date) return "";

  const now = new Date();
  const eventDate = new Date(event.value.date);
  const diff = eventDate - now;

  if (diff <= 0) return "Iniciando agora";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});



// Enhanced navigation and interactions
const goBack = () => {
  router.push("/events");
};


function editEvent(event) {
  eventForm.value = { ...event };
  showEditDialog.value = true;
}




const deleteEvent = async () => {
  deleteLoading.value = true;

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Close the dialog and navigate back to the events list
    showDeleteDialog.value = false;

    // Navigate back to events list
    router.push("/events");
  } catch (error) {
    console.error("Error deleting event:", error);
    // Show error message
  } finally {
    deleteLoading.value = false;
  }
};

// Check-in related methods
const openCheckInScanner = () => {
  scannerVisible.value = true;
};

const processManualCode = () => {
  if (!manualCheckInCode.value) return;

  // Process the manual code
  console.log("Processing manual code:", manualCheckInCode.value);

  // Reset and close after successful check-in
  manualCheckInCode.value = "";
  scannerVisible.value = false;

  // Update check-in count
  event.value.checkInCount++;
};

const toggleFlashlight = () => {
  console.log("Toggling flashlight for scanner");
  // This would integrate with device camera API in a real implementation
};

// Share functionality
const shareEvent = () => {
  shareDialogVisible.value = true;
};

const shareViaChannel = (channel) => {
  console.log(`Sharing event via ${channel}`);
  // Implement sharing logic based on the channel
  shareDialogVisible.value = false;
};

const copyShareLink = () => {
  navigator.clipboard.writeText(eventShareLink.value).then(() => {
    // Show success toast
    console.log("Link copied to clipboard");
  });
};

// Handle event updates
const handleEventUpdated = (updatedEvent) => {
  // Update the local event data with new values
  event.value = { ...event.value, ...updatedEvent };
};




// Enhanced helper functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return "R$ 0";

  // Convert to number if it's not already
  const numValue = typeof value === "number" ? value : Number(value);

  // Handle invalid values
  if (isNaN(numValue)) return "R$ 0";

  // Format based on value range with improved readability
  if (numValue >= 1000000) {
    return `R$ ${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `R$ ${(numValue / 1000).toFixed(1)}k`;
  } else {
    return `R$ ${numValue}`;
  }
};


// const eventStatus = computed(() => {
//   const eventStart = new Date(`${event.startDate}${event.startTime ? ' ' + event.startTime : ''}`);
//   const event7DaysBefore = eventStart - (7 * 24 * 60 * 60 * 1000);
//   const today = new Date();
//   const eventEnd = event.endTime
// })

const getStatusText = (status) => {
  switch (status) {
    case "upcoming":
      return "Em breve";
    case "completed":
      return "Realizado";
    case "live":
      return "Ao vivo";
    case "cancelled":
      return "Cancelado";
    default:
      return "Em breve";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return "primary";
    case "completed":
      return "success";
    case "live":
      return "error";
    case "cancelled":
      return "grey-darken-1";
    default:
      return "primary";
  }
};

// Get the revenue progress class based on percentage
const getRevenueProgressClass = (percentage) => {
  if (percentage >= 1) return "revenue-progress-high";
  if (percentage >= 0.7) return "revenue-progress-medium";
  return "revenue-progress-low";
};

// Enhanced FAB functionality
const fabIcon = computed(() => {
  switch (activeTab.value) {
    case "dashboard":
      return "mdi-refresh";
    case "guests":
      return "mdi-account-plus";
    case "lists":
      return "mdi-playlist-plus";
    case "promoters":
      return "mdi-account-plus";
    case "hostesses":
      return "mdi-account-plus";
    case "reports":
      return "mdi-download";
    default:
      return "mdi-plus";
  }
});

const fabTooltip = computed(() => {
  switch (activeTab.value) {
    case "dashboard":
      return "Atualizar dados";
    case "guests":
      return "Adicionar convidado";
    case "lists":
      return "Nova lista";
    case "promoters":
      return "Novo promotor";
    case "hostesses":
      return "Nova hostess";
    case "reports":
      return "Exportar relatório";
    default:
      return "Ação";
  }
});

// const getFabColor = () => {
//   if (activeTab.value === "dashboard") return "primary";
//   if (event.value.status === "live" && activeTab.value === "guests")
//     return "error";
//   return "primary";
// };

const fabColor = computed(() => {
  if (activeTab.value === "dashboard") return "primary";
  if (event.value.status === "live" && activeTab.value === "guests")
    return "error";
  return "primary";
})

const handleFabClick = () => {
  switch (activeTab.value) {
    case "dashboard":
      fetchEventData();
      break;
    case "guests":
      // For live events, open scanner directly
      if (event.value.status === "live") {
        openCheckInScanner();
      } else {
        console.log("Add guest clicked");
      }
      break;
    case "lists":
      console.log("Add list clicked");
      break;
    case "promoters":
      console.log("Add promoter clicked");
      break;
    case "hostesses":
      console.log("Add hostess clicked");
      break;
    case "reports":
      console.log("Export report clicked");
      break;
  }
};

// Handle tab changes with proper animation
watch(() => activeTab.value, (newTab) => {
  if (activeTab.value !== newTab.value) {
    // Update route query parameter
    router.replace({
      query: { ...route.query, tab: newTab },
    });
  }
})

const unsubscribeEvent = ref(null);
const unsubscribeLists = ref(null);
const unsubscribeGuests = ref(null);
const unsubscribePromoters = ref(null);
const unsubscribeHostesses = ref(null);

// METHODS
// Enhanced fetch event data
async function fetchEventData() {
  loading.value = true;
  try {
    // Use the imported mock data function with the event ID
    unsubscribeEvent.value = eventListStore.watchEventById(eventId, setEvent);
    unsubscribeLists.value = eventListStore.watchLists(eventId, addWatchedList, updateWatchedList, removeWatchedList);
    unsubscribeGuests.value = eventListStore.watchGuests(eventId, addWatchedGuest, updateWatchedGuest, removeWatchedGuest);
    unsubscribePromoters.value = eventListStore.watchPromoters(eventId, addWatchedPromoter, updateWatchedPromoter, removeWatchedPromoter);
    unsubscribeHostesses.value = eventListStore.watchHostesses(eventId, addWatchedHostess, updateWatchedHostess, removeWatchedHostess);
  } catch (error) {
    console.error("Error fetching event data:", error);
    // Handle error (show toast notification, redirect, etc.)
  } finally {
    loading.value = false;
  }
};

// FUNCTIONS TO MANIPULATE THE WATCHED LIST COLLECTION FROM EVENT ID. 
function addWatchedList(list) {
  lists.value.push(list);
}
function updateWatchedList(list) {
  const index = lists.value.findIndex(l => l.id === list.id);
  if (index !== -1) {
    lists.value.splice(index, 1, list);
  }
}
function removeWatchedList(list) {
  const index = lists.value.findIndex(l => l.id === list.id);
  if (index !== -1) {
    lists.value.splice(index, 1);
  }
}


// FUNCTIONS TO MANIPULATE THE WATCHED PROMOTER COLLECTION FROM EVENT ID. 
function addWatchedPromoter(promoter) {
  promoters.value.push(promoter);
}
function updateWatchedPromoter(promoter) {
  const index = promoters.value.findIndex(l => l.id === promoter.id);
  if (index !== -1) {
    promoters.value.splice(index, 1, promoter);
  }
}
function removeWatchedPromoter(promoter) {
  const index = promoters.value.findIndex(l => l.id === promoter.id);
  if (index !== -1) {
    promoters.value.splice(index, 1);
  }
}

// FUNCTIONS TO MANIPULATE THE WATCHED PROMOTER COLLECTION FROM EVENT ID. 
function addWatchedHostess(hostess) {
  hostesses.value.push(hostess);
}
function updateWatchedHostess(hostess) {
  const index = hostesses.value.findIndex(l => l.id === hostess.id);
  if (index !== -1) {
    hostesses.value.splice(index, 1, hostess);
  }
}
function removeWatchedHostess(hostess) {
  const index = hostesses.value.findIndex(l => l.id === hostess.id);
  if (index !== -1) {
    hostesses.value.splice(index, 1);
  }
}




// FUNCTIONS TO MANIPULATE THE WATCHED LIST COLLECTION FROM EVENT ID. 
function addWatchedGuest(guest) {
  guests.value.push(guest);
}
function updateWatchedGuest(guest) {
  const index = guests.value.findIndex(l => l.id === guest.id);
  if (index !== -1) {
    guests.value.splice(index, 1, guest);
  }
}
function removeWatchedGuest(guest) {
  const index = guests.value.findIndex(l => l.id === guest.id);
  if (index !== -1) {
    guests.value.splice(index, 1);
  }
}

// SET THE WATCHED EVENT
function setEvent(payload) {
  event.value = payload;
  console.log({ payload });
}

async function duplicateEvent() {

  try {

    const { value: eventName } = await swal.fire({
      title: "Digite o nome do novo evento",
      input: "text",
      inputLabel: "Nome do evento",
      inputValue: event.value.name + " copy",
      showCancelButton: true,
      confirmButtonText: "Clonar evento",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });
    console.log({ eventName });
    if (eventName) {
      const clonedEvent = { ...event.value };
      clonedEvent.name = eventName;
      const duplicateResult = await eventListStore.duplicateEvent({ event: clonedEvent, lists: lists.value, promoters: promoters.value, hostesses: hostesses.value });
      console.log({ duplicateResult });

      if (duplicateResult.ok) {
        const id = duplicateResult.data.id;

        router.push("/events/" + id);
      }
    }

  } catch (error) {
    console.log({ error })
  }
}

// Enhanced initialization
onMounted(async () => {
  // Set the active tab based on route query parameter if available
  if (
    route.query.tab &&
    [
      "dashboard",
      "guests",
      "lists",
      "promoters",
      "hostesses",
      "reports",
    ].includes(route.query.tab)
  ) {
    activeTab.value = route.query.tab;
  }

  try {
    await fetchEventData();
  } catch (error) {
    console.log({ error });
  }

});

function unsubscribe() {
  console.log("unsubscribe")
  unsubscribeEvent.value();
  unsubscribeLists.value();
  unsubscribeGuests.value();
  unsubscribePromoters.value();
  unsubscribeHostesses.value();
}

onUnmounted(() => {
  unsubscribe();
});

</script>