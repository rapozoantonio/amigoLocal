<template>
  <!-- Tabs for event categories -->
  <section class="bg-black" v-if="true">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="selectedCategory" color="primary" density="compact">
            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" exact variant="plain" slim value="proximos">
              Próximos eventos
            </v-tab>
            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" variant="plain" slim exact value="carnaval">
              Carnaval
            </v-tab>
            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" slim exact variant="plain" value="reveillon">
              Reveillon
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
  </section>

  <!-- Action Buttons Row -->
  <section class="bg-grey-darken-4 action-buttons">
    <v-container>
      <v-row no-gutters class="justify-end">
        <v-col cols="auto">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="Object.keys(filteredEvents || {}).length !== 0" v-bind="attrs" v-on="{ ...on }"
                @click="shareList" rounded="pill" variant="outlined" class="d-flex align-center grey--text">
                <v-icon start class="mr-2 grey--text">mdi-whatsapp</v-icon>
                Enviar Lista de Transmissão
              </v-btn>
            </template>
            <span>Enviar Lista de Transmissão</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
  </section>

  <!-- Content for displaying events per selected tab -->
  <section class="bg-grey-darken-4 flex-grow-1">
    <v-container>
      <!-- Check if there are no filtered events and display a message -->
      <template v-if="Object.keys(filteredEvents || {}).length === 0">
        <v-row>
          <v-col cols="12" class="text-center py-4">
            <p class="text-h6 grey--text">Nenhum evento disponível</p>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row v-for="(events, day) in filteredEvents" :key="day">
          <v-col cols="12" class="py-0">
            <v-toolbar color="grey-darken-4" style="position: sticky; top: 48px; z-index: 999" density="compact">
              <v-toolbar-title>
                <p class="text-h7 grey-darken-4" style="color: #9e9e9e">
                  <v-icon size="x-small">mdi-calendar</v-icon>
                  {{ day }}
                </p>
              </v-toolbar-title>
            </v-toolbar>
            <promoter-card-horizontal v-for="(event, index) in events.slice(0, eventDisplayLimits[selectedCategory])"
              :key="event.id" :event="event"></promoter-card-horizontal>
          </v-col>
        </v-row>
        <v-row v-if="hasMoreEventsInCurrentTab" class="text-center">
          <v-col cols="12">
            <v-btn @click="loadMoreEvents" rounded="pill" variant="outlined" color="primary">
              mais eventos
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import PromoterCardHorizontal from "@/components/promoters/PromoterCardHorizontal.vue";
import { useEventsStore } from "@/store/events";

// Props
const { events } = defineProps(["events"]);

// Store setup
const eventsStore = useEventsStore();
const { nextEvents } = storeToRefs(eventsStore);

// Reactive state for the selected tab category
const selectedCategory = ref("proximos");

// Limits for the number of events to display per category
const eventDisplayLimits = ref({
  proximos: 5,
  carnaval: 5,
  reveillon: 5,
});

// Lifecycle hook to fetch events on component mount
onMounted(() => fetchEventsByPromoterId("1"));

// Watch the selectedCategory to reset the display limit if necessary
watch(selectedCategory, () => {
  if (!eventDisplayLimits.value[selectedCategory.value]) {
    eventDisplayLimits.value[selectedCategory.value] = 5;
  }
});

// Method to fetch events by promoter ID
async function fetchEventsByPromoterId(promoterId) {
  await eventsStore.getEventsByPromoterId(promoterId);
}

// Computed property for filtering events based on selected category
const filteredEvents = computed(() => filterEventsByCategory(nextEvents.value, selectedCategory.value));

// Computed property to check if there are more events to load in the current tab
const hasMoreEventsInCurrentTab = computed(() => {
  const totalEvents = Object.values(filteredEvents.value).flat().length;
  return totalEvents > eventDisplayLimits.value[selectedCategory.value];
});

// Method to load more events for the selected category
function loadMoreEvents() {
  eventDisplayLimits.value[selectedCategory.value] += 5;
}

const shareList = () => {
  const sortedEvents = sortEventsByDateTime(filteredEvents.value);
  const message = formatEventsForWhatsApp(sortedEvents);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};

// Helper to sort events by date and time
function sortEventsByDateTime(events) {
  if (!events) return {};

  // Flatten all events into a single array
  const flatEvents = Object.entries(events).reduce((acc, [date, dayEvents]) => {
    return [...acc, ...dayEvents.map(event => ({ ...event, listDate: date }))];
  }, []);

  // Sort all events by date and time
  const sortedEvents = flatEvents.sort((a, b) => {
    const dateTimeA = new Date(a.startDate || a.listDate);
    const dateTimeB = new Date(b.startDate || b.listDate);
    return dateTimeA - dateTimeB;
  });

  // Group back by date
  return sortedEvents.reduce((acc, event) => {
    const date = formatDate(event.startDate || event.listDate);
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});
}

// Helper to filter events by the selected category and ensure only current or future events are shown
function filterEventsByCategory(events, category) {
  if (!events) return {};

  // Get today’s date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter events based on the selected category and start date
  return Object.entries(events).reduce((acc, [day, eventsForDay]) => {
    const filteredEvents = eventsForDay.filter(event => {
      const eventDate = new Date(event.startDate);
      eventDate.setHours(0, 0, 0, 0); // Set to midnight

      // Check if the event is today or in the future
      //const isFutureEvent = eventDate >= today;
      const isFutureEvent = true;

      const isInCategory = category === "proximos" || event.categories?.includes(category);

      return isFutureEvent && isInCategory;
    });
    if (filteredEvents.length > 0) {
      acc[day] = filteredEvents;
    }
    return acc;
  }, {});
}

// Helper to format events into a WhatsApp message structure
function formatEventsForWhatsApp(events) {
  return Object.entries(events)
    .map(([date, events]) => {
      // Sort events within the same date by start time if needed
      const sortedDayEvents = events.sort((a, b) => {
        const timeA = new Date(a.startDate).getTime();
        const timeB = new Date(b.startDate).getTime();
        return timeA - timeB;
      });

      return sortedDayEvents
        .map(event => formatSingleEvent(date, event))
        .join("\n\n");
    })
    .join("\n\n");
}

// Helper to format a single event with conditional parts
function formatSingleEvent(date, event) {
  const dateFormatted = formatDate(event.startDate || date);
  const categories = formatCategories(event.categories);
  const location = formatLocation(event.location);
  const link = formatLink(event.links);

  // Using asterisks around date and name to make them bold in WhatsApp
  return [
    `*${dateFormatted}*`,     // Date in bold
    categories,
    `*${event.name}*`,        // Event name in bold
    location,
  ].filter(Boolean).join(" | ") +
    (link ? `\n${link}` : "");
}

// Helper to format the date in DD/MM format
function formatDate(date) {
  return date ? new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  }) : "";
}

// Helper to format categories as uppercase, comma-separated
function formatCategories(categories) {
  return categories ? categories.map(cat => cat.toUpperCase()).join(", ") : "";
}

// Helper to format location based on region name
function formatLocation(location) {
  if (!location?.region) return "";
  const region = location.region.name;
  return region === "Rio de Janeiro"
    ? "RJ"
    : region?.includes("São Paulo")
      ? "SP"
      : region;
}

// Helper to format the first valid link
function formatLink(links) {
  const validLink = links?.[0]?.url;
  return validLink && validLink !== "Link não fornecido" ? validLink : "";
}

// Computed property for sorted events (if needed in template)
const sortedEvents = computed(() => {
  return sortEventsByDateTime(filteredEvents.value);
});
</script>

<style lang="scss" scoped>
img {
  display: block;
  width: 100%;
}

.action-buttons {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
