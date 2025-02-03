<template>
  <!-- Tabs for event categories -->
  <section class="bg-black" v-if="true" aria-label="Event Categories">
    <v-container>
      <event-category-tabs v-model="selectedCategory" role="tablist" aria-label="Event Categories" />
    </v-container>
    <v-divider aria-hidden="true"></v-divider>
  </section>

  <!-- Action Buttons Row -->
  <section class="action-buttons d-none d-md-block" aria-label="Quick Actions">
    <v-container>
      <v-row no-gutters class="flex-column gap-2">
        <v-col cols="12">
          <v-btn @click="openWhatsappGroups" block variant="outlined" class="grey--text"
            aria-label="Open WhatsApp Groups">
            <v-icon start class="mr-2 grey--text" aria-hidden="true">
              mdi-account-group
            </v-icon>
            <span>Grupos de WhatsApp</span>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-btn @click="openDirectContact" block variant="outlined" class="grey--text"
            aria-label="Contact for Events, Birthdays, Pix, or Questions">
            <v-icon start class="mr-2 grey--text" aria-hidden="true">
              mdi-message-text
            </v-icon>
            <span>Despedidas, Aniversários, Pix ou Dúvidas</span>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-btn v-if="Object.keys(filteredEvents || {}).length !== 0" @click="shareList" block variant="outlined"
            class="grey--text" aria-label="Share Event List via WhatsApp">
            <v-icon start class="mr-2 grey--text" aria-hidden="true">
              mdi-whatsapp
            </v-icon>
            <span>Enviar Lista de Transmissão</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-divider aria-hidden="true"></v-divider>
  </section>

  <!-- Content section -->
  <section class="content-section" aria-label="Event Listings">
    <v-container>
      <template v-if="Object.keys(filteredEvents || {}).length === 0">
        <v-row>
          <v-col cols="12" class="text-center py-4">
            <p class="text-h6 grey--text" role="status">
              Nenhum evento disponível
            </p>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row v-for="(events, day) in filteredEvents" :key="day" :aria-label="`Events for ${day}`">
          <v-col cols="12" class="py-0">
            <event-calendar-divider-toolbar :day="day" />
            <card-horizontal v-for="(event, index) in events.slice(0, eventDisplayLimits[selectedCategory])"
              :key="event.id" :event="event" :aria-label="`Event ${index + 1} of ${events.length}`" />
          </v-col>
        </v-row>
        <v-row v-if="hasNextPage" class="text-center">
          <v-col cols="12">
            <v-btn @click="loadMoreEvents" rounded="pill" variant="outlined" color="primary" class="px-6"
              aria-label="Load More Events">
              <span>mais eventos</span>
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </section>

  <!-- Bottom Navigation for Mobile -->
  <v-bottom-navigation v-model="activeNav" grow class="d-md-none" color="primary" fixed role="navigation"
    aria-label="Mobile Navigation">
    <!-- Events Tab - Primary Focus -->
    <v-btn @click="toggleEventView" :class="{ 'v-btn--active': activeNav === (showingTodayEvents ? 'today' : 'all') }"
      :aria-pressed="activeNav === (showingTodayEvents ? 'today' : 'all')"
      :aria-label="showingTodayEvents ? 'View Today\'s Events' : 'View All Events'">
      <v-icon aria-hidden="true">
        {{ showingTodayEvents ? "mdi-calendar" : "mdi-calendar-today" }}
      </v-icon>
      <span>{{ buttonText }}</span>
    </v-btn>

    <!-- Quick Share/Save -->
    <v-btn value="share" @click="shareList" aria-label="Share Event List">
      <v-icon aria-hidden="true">mdi-share</v-icon>
      <span>Compartilhar</span>
    </v-btn>

    <!-- Contact Button -->
    <v-btn value="contact" @click="openDirectContact" aria-label="Contact via WhatsApp">
      <v-icon aria-hidden="true">mdi-whatsapp</v-icon>
      <span>Contato</span>
    </v-btn>

    <!-- Groups -->
    <v-btn value="groups" @click="openWhatsappGroups" aria-label="Open WhatsApp Groups">
      <v-icon aria-hidden="true">mdi-account-group</v-icon>
      <span>Grupos</span>
    </v-btn>
  </v-bottom-navigation>

  <WhatsappGroupsModal ref="whatsappGroupsModal" :groups="whatsappGroups" role="dialog" aria-label="WhatsApp Groups" />
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { usePromotersStore } from "@/store/promoters";
import EventCalendarDividerToolbar from "@/components/events/EventCalendarDividerToolbar.vue";
import CardHorizontal from "@/components/events/CardHorizontal.vue";
import WhatsappGroupsModal from "@/components/promoters/WhatsappGroupsModal.vue";
import EventCategoryTabs from "@/components/events/EventCategoryTabs.vue";
import { useEventsStore } from "@/store/events";

// Props (if any)
const { id } = defineProps(["id"]);

// Store setup
const eventsStore = useEventsStore();
const { nextEvents, events, hasNextPage } = storeToRefs(eventsStore);

// Get promoter data from the store (loaded in the parent component)
const promotersStore = usePromotersStore();
const { promoter } = storeToRefs(promotersStore);

// Map promoter WhatsApp groups to the expected format for the modal
const whatsappGroups = computed(() => {
  if (!promoter.value || !promoter.value.WhatsappGroups) return [];
  return promoter.value.WhatsappGroups.map((group) => ({
    name: group.group_name,
    category: group.group_category,
    link: group.group_url,
  }));
});

// Reactive state
const selectedCategory = ref("proximos");
const whatsappGroupsModal = ref(null);
const tabsHeight = ref(48);
const activeNav = ref("null");

// For each category, we start with a display limit of 5 events.
const eventDisplayLimits = ref({
  proximos: 5,
  carnaval: 5,
  reveillon: 5,
});

// Computed properties

// Filter events by category (and by today's date if enabled)
const filteredEvents = computed(() => {
  if (!nextEvents.value) return {};

  return Object.entries(nextEvents.value).reduce((acc, [day, eventsForDay]) => {
    let filtered = eventsForDay;

    // Category filter: if "proximos" is selected, show all; otherwise, filter by category.
    filtered = filtered.filter(
      (event) =>
        selectedCategory.value === "proximos" ||
        event.categories?.includes(selectedCategory.value)
    );

    // Today filter (if enabled)
    if (showingTodayEvents.value) {
      const today = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      filtered = filtered.filter((event) => {
        const eventDate = formatDate(event.startDate || day);
        return eventDate === today;
      });
    }

    if (filtered.length > 0) {
      acc[day] = filtered;
    }
    return acc;
  }, {});
});

// Show the "Load More" button if there are more events than the current display limit.
const hasMoreEventsInCurrentTab = computed(() => {
  const totalEvents = Object.values(filteredEvents.value || {}).flat().length;
  return totalEvents > eventDisplayLimits.value[selectedCategory.value];
});

// (Optional) Sorting function if you want to sort the events by date/time.
const sortedEvents = computed(() => sortEventsByDateTime(filteredEvents.value));

// Lifecycle hooks
onMounted(async () => {
  try {
    console.log({ id })
    await fetchEventsByPromoterId(id);
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  // Initialize tabs height after component is mounted.
  nextTick(() => {
    const tabsElement = document.querySelector(".v-tabs");
    if (tabsElement) {
      tabsHeight.value = tabsElement.offsetHeight;
    }
  });
});

// Watchers
watch(selectedCategory, (newCategory) => {
  if (!eventDisplayLimits.value[newCategory]) {
    eventDisplayLimits.value[newCategory] = 5;
  }
});

// Actions

async function fetchEventsByPromoterId(promoterId) {
  console.log({ promoterId })
  await eventsStore.getEventsByPromoterId(promoterId);
}

async function loadMoreEvents() {
  console.log("loadingMoreEvents")
  await eventsStore.fetchNextPage();
  // Increase the visible count for the current category by 5.
  // eventDisplayLimits.value[selectedCategory.value] += 5;
}

function openWhatsappGroups() {
  whatsappGroupsModal.value?.open();
}

function shareList() {
  const sorted = sortEventsByDateTime(filteredEvents.value);
  const message = formatEventsForWhatsApp(sorted);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
}

function openDirectContact() {
  // Get the WhatsApp number from the promoter object.
  const phoneNumber = promoter.value?.whatsapp || "";
  const cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
  if (!cleanedNumber) {
    console.error("No valid WhatsApp number provided");
    return;
  }
  const whatsappUrl = `https://wa.me/${cleanedNumber}`;
  window.open(whatsappUrl, "_blank");
}

function toggleEventView() {
  showingTodayEvents.value = !showingTodayEvents.value;
  activeNav.value = showingTodayEvents.value ? "today" : "all";
}

// Event processing

function sortEventsByDateTime(events) {
  if (!events) return {};

  const flatEvents = Object.entries(events).reduce((acc, [date, dayEvents]) => {
    return [
      ...acc,
      ...dayEvents.map((event) => ({ ...event, listDate: date })),
    ];
  }, []);

  const sorted = flatEvents.sort((a, b) => {
    const dateTimeA = new Date(a.startDate || a.listDate);
    const dateTimeB = new Date(b.startDate || b.listDate);
    return dateTimeA - dateTimeB;
  });

  return sorted.reduce((acc, event) => {
    const dateKey = formatDate(event.startDate || event.listDate);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});
}

// Formatting utilities

function formatEventsForWhatsApp(events) {
  return Object.entries(events)
    .map(([date, events]) => {
      const sortedDayEvents = events.sort((a, b) => {
        const timeA = new Date(a.startDate).getTime();
        const timeB = new Date(b.startDate).getTime();
        return timeA - timeB;
      });

      return sortedDayEvents
        .map((event) => formatSingleEvent(date, event))
        .join("\n\n");
    })
    .join("\n\n");
}

function formatSingleEvent(date, event) {
  const dateFormatted = formatDate(event.startDate || date);
  const categories = formatCategories(event.categories);
  const location = formatLocation(event.location);
  const link = formatLink(event.links);

  return (
    [`*${dateFormatted}*`, categories, `*${event.name}*`, location]
      .filter(Boolean)
      .join(" | ") + (link ? `\n${link}` : "")
  );
}

function formatDate(date) {
  return date
    ? new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
    : "";
}

function formatCategories(categories) {
  return categories
    ? categories.map((cat) => cat.toUpperCase()).join(", ")
    : "";
}

function formatLocation(location) {
  if (!location?.region) return "";
  const region = location.region.name;
  return region === "Rio de Janeiro"
    ? "RJ"
    : region?.includes("São Paulo")
      ? "SP"
      : region;
}

function formatLink(links) {
  const validLink = links?.[0]?.url;
  return validLink && validLink !== "Link não fornecido" ? validLink : "";
}

// Additional computed properties for the header and button text.
const showingTodayEvents = ref(false);
const headerText = computed(() =>
  showingTodayEvents.value ? "Eventos de Hoje" : "Todos os Eventos"
);
const buttonText = computed(() =>
  showingTodayEvents.value ? "Todos os Eventos" : "Eventos Hoje"
);
</script>


<style lang="scss" scoped>
.action-buttons {
  padding-block: 0.5rem;
}

img {
  display: block;
  width: 100%;
}

.width-full {
  width: 100%;
}

.gap-2 {
  gap: 0.5rem;
}

@media (min-width: 600px) {
  .width-full {
    width: auto;
  }
}

// Ensure the bottom navigation stays on top
.v-bottom-navigation {
  z-index: 1000;
}

.action-buttons {
  padding-block: 0.5rem;
  margin-top: -1px; // Remove any gap
}

section {
  position: relative; // Ensure sections stack properly
  z-index: 1;
}

.w-min-0 {
  min-width: 0px !important;
}
</style>
