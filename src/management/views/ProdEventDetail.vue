<template>
  <div class="event-detail-page">
    <!-- Immersive loading animation -->
    <div v-if="loading" class="loading-container">
      <v-sheet class="loading-content">
        <v-skeleton-loader
          type="card, paragraph"
          class="mb-6 loading-skeleton"
        ></v-skeleton-loader>
        <div class="loading-pulse"></div>
      </v-sheet>
    </div>

    <template v-else>
      <!-- Dynamic event header with parallax effect and live status indicator -->
      <div class="event-header position-relative">
        <v-img
          :src="event.thumbnail || 'https://picsum.photos/id/103/1200/400'"
          :gradient="'to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75)'"
          :height="$vuetify.display.xs ? '160px' : '240px'"
          cover
          class="event-cover mb-3"
          :class="{ 'event-cover-live': event.status === 'live' }"
        >
          <!-- Floating navigation elements -->
          <div class="d-flex justify-space-between align-start pa-4">
            <v-btn
              icon
              variant="text"
              color="white"
              @click="goBack"
              class="bg-black-opacity elevation-3"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <div class="d-flex">
              <!-- Quick check-in button for live events -->
              <v-btn
                v-if="event.status === 'live'"
                color="error"
                variant="tonal"
                size="small"
                prepend-icon="mdi-qrcode-scan"
                class="me-2 quick-action-btn elevation-3"
                @click="openCheckInScanner"
                rounded="pill"
              >
                Check-in
              </v-btn>

              <v-menu location="bottom end" transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    variant="text"
                    color="white"
                    v-bind="props"
                    class="bg-black-opacity elevation-3"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list rounded="lg" elevation="10" class="action-menu">
                  <v-list-item @click="editBasicInfo" prepend-icon="mdi-pencil">
                    <v-list-item-title>Editar informações</v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    @click="shareEvent"
                    prepend-icon="mdi-share-variant"
                  >
                    <v-list-item-title>Compartilhar</v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    @click="duplicateEvent"
                    prepend-icon="mdi-content-copy"
                  >
                    <v-list-item-title>Duplicar evento</v-list-item-title>
                  </v-list-item>

                  <v-divider class="my-2"></v-divider>

                  <v-list-item
                    @click="showDeleteDialog = true"
                    prepend-icon="mdi-delete"
                    class="text-error"
                  >
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
                    <h1
                      class="text-h5 text-sm-h4 font-weight-bold text-white mb-1 event-title"
                    >
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
                <v-chip
                  :color="getStatusColor(event.status)"
                  size="small"
                  class="status-chip"
                  text-color="white"
                  variant="elevated"
                >
                  {{ getStatusText(event.status) }}
                </v-chip>
              </div>

              <!-- Event metadata with improved iconography -->
              <div
                class="event-metadata d-flex flex-wrap align-center text-white text-opacity-90 mt-2"
              >
                <div class="d-flex align-center me-4 mb-2 metadata-item">
                  <v-icon size="18" color="white" class="me-1"
                    >mdi-calendar-outline</v-icon
                  >
                  <span class="text-caption text-sm-body-2">{{
                    formatDate(event.date)
                  }}</span>
                </div>
                <div class="d-flex align-center me-4 mb-2 metadata-item">
                  <v-icon size="18" color="white" class="me-1"
                    >mdi-clock-outline</v-icon
                  >
                  <span class="text-caption text-sm-body-2">{{
                    formatTime(event.date)
                  }}</span>
                </div>
                <div class="d-flex align-center mb-2 metadata-item">
                  <v-icon size="18" color="white" class="me-1"
                    >mdi-map-marker-outline</v-icon
                  >
                  <span class="text-caption text-sm-body-2">{{
                    event.location
                  }}</span>
                </div>
              </div>

              <!-- Countdown timer for upcoming events -->
              <div
                v-if="event.status === 'upcoming'"
                class="countdown-timer mt-2"
              >
                <div class="countdown-label text-caption">Inicia em:</div>
                <div class="countdown-value">{{ countdownText }}</div>
              </div>
            </div>
          </div>
        </v-img>
      </div>

      <!-- Enhanced metrics cards with micro-visualizations -->
      <MainFourEvenMetrics :event="event" :checkInTrend="checkInTrend" />

      <!-- Enhanced tabs with swipe support and improved visual design -->
      <v-card flat class="mx-auto tab-container">
        <v-tabs
          v-model="activeTab"
          bg-color="background"
          show-arrows
          slider-color="primary"
          class="event-tabs"
          density="comfortable"
          centered
          fixed-tabs
        >
          <v-tab value="dashboard" class="tab-item">
            <v-icon size="small" class="tab-icon"
              >mdi-view-dashboard-outline</v-icon
            >
            <span class="tab-text">Dash</span>
          </v-tab>

          <v-tab value="guests" class="tab-item">
            <v-icon size="small" class="tab-icon"
              >mdi-account-group-outline</v-icon
            >
            <span class="tab-text">Guests</span>
          </v-tab>

          <v-tab value="lists" class="tab-item">
            <v-icon size="small" class="tab-icon"
              >mdi-format-list-bulleted</v-icon
            >
            <span class="tab-text">Listas</span>
          </v-tab>

          <v-tab value="promoters" class="tab-item">
            <v-icon size="small" class="tab-icon">mdi-account-tie</v-icon>
            <span class="tab-text">Promotores</span>
          </v-tab>

          <v-tab value="hostesses" class="tab-item">
            <v-icon size="small" class="tab-icon"
              >mdi-account-supervisor-outline</v-icon
            >
            <span class="tab-text">Hostess</span>
          </v-tab>
        </v-tabs>

        <v-divider class="tab-divider"></v-divider>

        <!-- Swipeable content area with transition effects -->
        <v-window
          v-model="activeTab"
          class="event-tab-content"
          touch
          :continuous="false"
          @update:model-value="handleTabChange"
        >
          <!-- Dashboard Tab with enhanced visualization -->
          <v-window-item value="dashboard">
            <event-dashboard :event="event" @refresh="fetchEventData" />
          </v-window-item>

          <!-- Other tabs with improved layouts -->
          <v-window-item value="guests">
            <event-guests :event="event" @update:guests="updateGuestCount" />
          </v-window-item>

          <v-window-item value="lists">
            <event-lists :event="event" @update:lists="updateListsCount" />
          </v-window-item>

          <v-window-item value="promoters">
            <event-promoters
              :event="event"
              @update:promoters="updatePromotersCount"
            />
          </v-window-item>

          <v-window-item value="hostesses">
            <event-hostesses
              :event="event"
              @update:hostesses="updateHostessesCount"
            />
          </v-window-item>

          <v-window-item value="reports">
            <event-reports :event="event" />
          </v-window-item>
        </v-window>
      </v-card>
    </template>

    <!-- Modern floating action button with context awareness -->
    <floating-action-button
      :icon="fabIcon"
      :tooltip="fabTooltip"
      :color="getFabColor()"
      @click="handleFabClick"
      class="dynamic-fab"
    />

    <!-- Enhanced modals with improved UX -->
    <edit-event-modal
      v-model="editModalVisible"
      :event="event"
      @saved="handleEventUpdated"
    />

    <!-- Delete confirmation with animation -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400"
      transition="dialog-bottom-transition"
    >
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
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="deleteEvent"
            :loading="deleteLoading"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Scan QR code modal for check-ins -->
    <v-dialog
      v-model="scannerVisible"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card class="scanner-container">
        <v-toolbar color="primary" dark>
          <v-btn icon @click="scannerVisible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Check-in de convidados</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="scanner-content">
          <div class="scanner-area">
            <div class="scanner-overlay">
              <div class="scanner-frame"></div>
              <div class="scanner-line"></div>
            </div>
            <!-- This would integrate with a real scanner component -->
            <p class="text-center mt-4">
              Aponte a câmera para o QR code do convidado
            </p>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-text-field
            v-model="manualCheckInCode"
            label="Ou digite o código manualmente"
            variant="outlined"
            append-inner-icon="mdi-arrow-right"
            @click:append-inner="processManualCode"
            hide-details
            class="manual-code-input"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn block color="primary" variant="flat" @click="toggleFlashlight">
            <v-icon start>mdi-flashlight</v-icon>
            Ligar lanterna
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Share event dialog -->
    <v-dialog
      v-model="shareDialogVisible"
      max-width="400"
      transition="dialog-bottom-transition"
    >
      <v-card class="share-dialog rounded-lg">
        <v-card-title class="text-h5 pb-2">Compartilhar evento</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Compartilhe "{{ event.name }}" com sua equipe ou nas redes sociais:
          </p>

          <div class="share-options d-flex flex-wrap justify-center">
            <v-btn
              variant="text"
              color="primary"
              class="share-btn"
              @click="shareViaChannel('whatsapp')"
            >
              <v-icon size="24" class="mb-1">mdi-whatsapp</v-icon>
              <span class="d-block text-caption">WhatsApp</span>
            </v-btn>

            <v-btn
              variant="text"
              color="blue"
              class="share-btn"
              @click="shareViaChannel('email')"
            >
              <v-icon size="24" class="mb-1">mdi-email-outline</v-icon>
              <span class="d-block text-caption">Email</span>
            </v-btn>

            <v-btn
              variant="text"
              color="blue-darken-2"
              class="share-btn"
              @click="shareViaChannel('facebook')"
            >
              <v-icon size="24" class="mb-1">mdi-facebook</v-icon>
              <span class="d-block text-caption">Facebook</span>
            </v-btn>

            <v-btn
              variant="text"
              color="pink-darken-1"
              class="share-btn"
              @click="shareViaChannel('instagram')"
            >
              <v-icon size="24" class="mb-1">mdi-instagram</v-icon>
              <span class="d-block text-caption">Instagram</span>
            </v-btn>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-text-field
            :model-value="eventShareLink"
            label="Link do evento"
            variant="outlined"
            readonly
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyShareLink"
            class="share-link-field"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="shareDialogVisible = false"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify/lib/framework.mjs";
import FloatingActionButton from "@/promotion/components/prod/event/FloatingActionButton.vue";
import EditEventModal from "@/promotion/components/prod/event/EditEventModal.vue";
import EventDashboard from "@/promotion/components/prod/event/EventDashboard.vue";
import EventGuests from "@/promotion/components/prod/event/EventGuests.vue";
import EventLists from "@/promotion/components/prod/event/EventLists.vue";
import EventPromoters from "@/promotion/components/prod/event/EventPromoters.vue";
import EventHostesses from "@/promotion/components/prod/event/EventHostesses.vue";
import MainFourEvenMetrics from "@/promotion/components/prod/event/MainFourEvenMetrics.vue";

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
const loading = ref(true);
const event = ref({});
const activeTab = ref("dashboard");
const editModalVisible = ref(false);
const showDeleteDialog = ref(false);
const deleteLoading = ref(false);
const scannerVisible = ref(false);
const manualCheckInCode = ref("");
const shareDialogVisible = ref(false);
const checkInTrend = ref(0.15); // Simulated trend value, would come from actual data

// Mock data for visualizations
const listDistribution = [
  { percentage: 40, color: "var(--v-primary-base)" },
  { percentage: 25, color: "var(--v-primary-lighten1)" },
  { percentage: 20, color: "var(--v-secondary-base)" },
  { percentage: 15, color: "var(--v-grey-lighten1)" },
];

// Computed properties
const eventId = computed(() => parseInt(route.params.id));

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
  return `${baseUrl}/evento/${eventId.value}`;
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

// Enhanced fetch event data
const fetchEventData = async () => {
  loading.value = true;

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Mock data with enhanced fields for 2025 design
    event.value = {
      id: eventId.value,
      name: "Festa de Lançamento",
      date: new Date(new Date().getTime() + 86400000 * 7), // 7 days in future
      location: "Club XYZ, São Paulo",
      checkInCount: 42,
      totalGuests: 250,
      status: "upcoming", // options: upcoming, live, completed, cancelled
      thumbnail: "https://picsum.photos/id/103/1200/400",
      vipListsCount: 3,
      promotersCount: 5,
      hostessCount: 4,
      revenue: 15500,
      revenuePrediction: 50000,
      // New fields for enhanced metrics
      checkInRate: 0.8, // 80% check-in rate historically
      checkInHistory: [28, 32, 36, 40, 42], // For trend calculation
      revenueHistory: [8000, 10000, 12500, 14200, 15500], // For trend visualization
    };
  } catch (error) {
    console.error("Error fetching event data:", error);
    // Handle error (show toast notification, redirect, etc.)
  } finally {
    loading.value = false;
  }
};

// Enhanced navigation and interactions
const goBack = () => {
  router.push("/events");
};

const editBasicInfo = () => {
  editModalVisible.value = true;
};

const duplicateEvent = () => {
  console.log("Duplicating event:", event.value);
  // Implement duplication logic with success feedback
};

const deleteEvent = async () => {
  deleteLoading.value = true;

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Close the dialog and navigate back to the events list
    showDeleteDialog.value = false;

    // Navigate back to events list
    router.push("/eventos");
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

// Update functions for child components
const updateGuestCount = (total) => {
  event.value.totalGuests = total;
};

const updateListsCount = (count) => {
  event.value.vipListsCount = count;
};

const updatePromotersCount = (count) => {
  event.value.promotersCount = count;
};

const updateHostessesCount = (count) => {
  event.value.hostessCount = count;
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

const getFabColor = () => {
  if (activeTab.value === "dashboard") return "primary";
  if (event.value.status === "live" && activeTab.value === "guests")
    return "error";
  return "primary";
};

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
const handleTabChange = (newTab) => {
  if (activeTab.value !== newTab) {
    // Update route query parameter
    router.replace({
      query: { ...route.query, tab: newTab },
    });
  }
};

// Enhanced initialization
onMounted(() => {
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

  // Add swipe gesture support
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  fetchEventData();
});

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchend", handleTouchEnd);
});

// Touch gesture handling for tab swiping
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const tabValues = [
    "dashboard",
    "guests",
    "lists",
    "promoters",
    "hostesses",
    "reports",
  ];
  const currentIndex = tabValues.indexOf(activeTab.value);

  if (currentIndex === -1) return;

  const minSwipeDistance = 50;
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < minSwipeDistance) return;

  if (swipeDistance > 0 && currentIndex > 0) {
    // Swipe right -> previous tab
    activeTab.value = tabValues[currentIndex - 1];
  } else if (swipeDistance < 0 && currentIndex < tabValues.length - 1) {
    // Swipe left -> next tab
    activeTab.value = tabValues[currentIndex + 1];
  }
};
</script>

<style scoped>
.event-detail-page {
  position: relative;
  padding-bottom: 80px; /* Space for FAB */
  background-color: rgb(var(--v-theme-background));
}

/* Enhanced loading animation */
.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-skeleton {
  opacity: 0.8;
  border-radius: 12px;
  overflow: hidden;
}

.loading-pulse {
  height: 3px;
  width: 100px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--v-primary-base),
    transparent
  );
  animation: pulse 1.5s infinite;
  margin: 0 auto;
}

@keyframes pulse {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

/* Enhanced header styles */
.event-cover {
  position: relative;
  transform-origin: center top;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.event-cover-live {
  border-bottom: 3px solid var(--v-error-base);
}

.event-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1;
}

.event-title {
  max-width: calc(100% - 100px);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.event-title-container {
  position: relative;
}

.live-indicator {
  position: absolute;
  top: -18px;
  left: 0;
  background-color: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  animation: pulse-live 2s infinite;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  margin-right: 4px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes pulse-live {
  0% {
    background-color: rgba(244, 67, 54, 0.9);
  }
  50% {
    background-color: rgba(244, 67, 54, 0.7);
  }
  100% {
    background-color: rgba(244, 67, 54, 0.9);
  }
}

.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
}

.status-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: fade-in 0.3s ease;
}

.event-metadata {
  opacity: 0.9;
}

.metadata-item {
  animation: fade-slide-up 0.4s ease;
  animation-fill-mode: both;
}

.metadata-item:nth-child(2) {
  animation-delay: 0.1s;
}

.metadata-item:nth-child(3) {
  animation-delay: 0.2s;
}

.countdown-timer {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  animation: fade-slide-up 0.4s ease;
  animation-delay: 0.3s;
  animation-fill-mode: both;
}

.countdown-label {
  margin-right: 6px;
  opacity: 0.8;
}

.countdown-value {
  font-weight: 600;
  color: white;
}

/* Enhanced metrics styles */
.event-metrics {
  margin-top: -16px;
  position: relative;
  z-index: 2;
}

.metrics-row {
  animation: fade-slide-up 0.4s ease;
  animation-fill-mode: both;
}

.metric-card {
  border-radius: 16px;
  background-color: rgb(var(--v-theme-surface));
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.revenue-card {
  border-left: 3px solid transparent;
  border-image: linear-gradient(
    to bottom,
    var(--v-primary-base),
    var(--v-primary-lighten3)
  );
  border-image-slice: 1;
}

.revenue-value {
  background: linear-gradient(
    45deg,
    var(--v-primary-base),
    var(--v-primary-lighten2)
  );
  -webkit-background-clip: text;
  background-clip: text;
}

/* Progress visualization */
.progress-container {
  height: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--v-primary-lighten2);
  transition: width 0.6s ease;
  border-radius: 2px;
}

.high-progress {
  background-color: var(--v-success-base);
}

/* Mini chart visualization */
.mini-chart {
  display: flex;
  height: 4px;
  width: 100%;
  border-radius: 2px;
  overflow: hidden;
}

.chart-segment {
  height: 100%;
  transition: width 0.6s ease;
}

/* Team performance visualization */
.team-performance {
  display: flex;
  justify-content: space-between;
  height: 4px;
  width: 100%;
}

.team-member {
  width: 16%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.active-member {
  background-color: var(--v-primary-base);
}

/* Revenue progress visualization */
.revenue-progress {
  position: relative;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.revenue-progress-bar {
  height: 100%;
  background-color: var(--v-primary-lighten2);
  transition: width 0.6s ease;
  border-radius: 2px;
}

.revenue-progress-high {
  background-color: var(--v-success-base);
}

.revenue-progress-medium {
  background-color: var(--v-warning-base);
}

.revenue-progress-low {
  background-color: var(--v-error-lighten1);
}

.revenue-target-line {
  position: absolute;
  height: 8px;
  width: 2px;
  background-color: rgba(0, 0, 0, 0.2);
  top: -2px;
}

/* Enhanced tab styles */
.tab-container {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.event-tabs {
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-item {
  min-width: auto;
  flex-direction: column;
  padding: 8px 4px;
}

.tab-icon {
  margin-bottom: 4px;
}

.tab-text {
  font-size: 12px;
  font-weight: 500;
}

.tab-divider {
  margin: 0;
}

.event-tab-content {
  min-height: 400px;
  background-color: rgb(var(--v-theme-surface));
}

/* Enhanced FAB styling */
.dynamic-fab {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Dialog styling */
.confirm-dialog {
  overflow: hidden;
}

/* Scanner styling */
.scanner-container {
  overflow: hidden;
}

.scanner-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
}

.scanner-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: rgba(0, 0, 0, 0.8);
}

.scanner-overlay {
  position: relative;
  width: 250px;
  height: 250px;
}

.scanner-frame {
  width: 100%;
  height: 100%;
  border: 2px solid white;
  border-radius: 12px;
}

.scanner-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #4caf50;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation: scan-line 2s infinite;
}

@keyframes scan-line {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

.manual-code-input {
  margin-top: 16px;
}

/* Share dialog styling */
.share-dialog {
  overflow: hidden;
}

.share-options {
  margin: 0 -8px;
}

.share-btn {
  min-width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 8px;
  flex-direction: column;
}

.share-link-field {
  margin-top: 8px;
}

/* Animation keyframes */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-slide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .event-tabs {
    overflow-x: auto;
  }

  .tab-item {
    min-width: 80px;
  }

  .event-metrics {
    margin-top: -8px;
  }

  .metric-card {
    margin-bottom: 8px;
  }

  .quick-action-btn {
    font-size: 12px;
  }
}

@media (min-width: 600px) {
  .event-metrics {
    padding: 16px 8px 0;
  }

  .tab-item {
    min-width: 120px;
  }
}
</style>
