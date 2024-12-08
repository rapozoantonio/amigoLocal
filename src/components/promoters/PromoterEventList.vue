<template>
  <!-- Tabs for event categories -->
  <section class="bg-black" v-if="true">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-tabs
            v-model="selectedCategory"
            color="primary"
            density="compact"
            class="px-0"
            slider-color="primary"
          >
            <v-tab
              v-for="(label, value) in {
                proximos: 'Próximos eventos',
                carnaval: 'Carnaval',
                reveillon: 'Reveillon',
              }"
              :key="value"
              :value="value"
              class="text-subtitle-2 px-0 mr-4 w-min-0"
              exact
              variant="plain"
              slim
            >
              {{ label }}
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
      <v-row no-gutters class="flex-column gap-2">
        <v-col cols="12">
          <v-btn
            @click="openWhatsappGroups"
            block
            variant="outlined"
            class="grey--text"
          >
            <v-icon start class="mr-2 grey--text">mdi-account-group</v-icon>
            Grupos de WhatsApp
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-btn
            v-if="Object.keys(filteredEvents || {}).length !== 0"
            @click="shareList"
            block
            variant="outlined"
            class="grey--text"
          >
            <v-icon start class="mr-2 grey--text">mdi-whatsapp</v-icon>
            Enviar Lista de Transmissão
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
  </section>
  <!-- Content section -->
  <section class="bg-grey-darken-4 flex-grow-1">
    <v-container>
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
            <v-toolbar
              color="grey-darken-4"
              :style="{
                position: 'sticky',
                top: `${tabsHeight}px`,
                zIndex: 999,
              }"
              density="compact"
            >
              <v-toolbar-title>
                <p class="text-body-2 grey-darken-4" style="color: #9e9e9e">
                  <v-icon size="x-small">mdi-calendar</v-icon>
                  {{ day }}
                </p>
              </v-toolbar-title>
            </v-toolbar>
            <promoter-card-horizontal
              v-for="(event, index) in events.slice(
                0,
                eventDisplayLimits[selectedCategory]
              )"
              :key="event.id"
              :event="event"
            ></promoter-card-horizontal>
          </v-col>
        </v-row>
        <v-row v-if="hasMoreEventsInCurrentTab" class="text-center">
          <v-col cols="12">
            <v-btn
              @click="loadMoreEvents"
              rounded="pill"
              variant="outlined"
              color="primary"
              class="px-6"
            >
              mais eventos
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </section>
  <WhatsappGroupsModal ref="whatsappGroupsModal" />
</template>
<script setup>
//TODO: Pass group property to WhatsappGroupsModal
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import PromoterCardHorizontal from "@/components/promoters/PromoterCardHorizontal.vue";
import WhatsappGroupsModal from "@/components/promoters/WhatsappGroupsModal.vue";
import { useEventsStore } from "@/store/events";

// Props
const { events } = defineProps(["events"]);

// Store setup
const eventsStore = useEventsStore();
const { nextEvents } = storeToRefs(eventsStore);

// Reactive state
const selectedCategory = ref("proximos");
const whatsappGroupsModal = ref(null);
const tabsHeight = ref(48);

const eventDisplayLimits = ref({
  proximos: 5,
  carnaval: 5,
  reveillon: 5,
});

// Computed properties
const filteredEvents = computed(() =>
  filterEventsByCategory(nextEvents.value, selectedCategory.value)
);

const hasMoreEventsInCurrentTab = computed(() => {
  const totalEvents = Object.values(filteredEvents.value || {}).flat().length;
  return totalEvents > eventDisplayLimits.value[selectedCategory.value];
});

const sortedEvents = computed(() => sortEventsByDateTime(filteredEvents.value));

// Lifecycle hooks
onMounted(async () => {
  try {
    await fetchEventsByPromoterId("1");
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  // Initialize tabs height after component is mounted
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
  await eventsStore.getEventsByPromoterId(promoterId);
}

function loadMoreEvents() {
  eventDisplayLimits.value[selectedCategory.value] += 5;
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

// Event processing
function sortEventsByDateTime(events) {
  if (!events) return {};

  const flatEvents = Object.entries(events).reduce((acc, [date, dayEvents]) => {
    return [
      ...acc,
      ...dayEvents.map((event) => ({ ...event, listDate: date })),
    ];
  }, []);

  const sortedEvents = flatEvents.sort((a, b) => {
    const dateTimeA = new Date(a.startDate || a.listDate);
    const dateTimeB = new Date(b.startDate || b.listDate);
    return dateTimeA - dateTimeB;
  });

  return sortedEvents.reduce((acc, event) => {
    const date = formatDate(event.startDate || event.listDate);
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});
}

function filterEventsByCategory(events, category) {
  if (!events) return {};

  return Object.entries(events).reduce((acc, [day, eventsForDay]) => {
    const filteredEvents = eventsForDay.filter(
      (event) => category === "proximos" || event.categories?.includes(category)
    );

    if (filteredEvents.length > 0) {
      acc[day] = filteredEvents;
    }
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
</style>
