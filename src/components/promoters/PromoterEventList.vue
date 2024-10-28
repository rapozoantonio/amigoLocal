<template>
  <!-- TOOLBAR VIEW -->
  <section class="bg-black" v-if="true">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="selectedCategory" color="primary" density="compact">
            <v-tab
              class="text-subtitle-2 px-0 mr-4 w-min-0"
              exact
              variant="plain"
              slim
              value="proximos"
            >
              Proximos eventos
            </v-tab>
            <v-tab
              class="text-subtitle-2 px-0 mr-4 w-min-0"
              variant="plain"
              slim
              exact
              value="carnaval"
            >
              Carnaval
            </v-tab>
            <v-tab
              class="text-subtitle-2 px-0 mr-4 w-min-0"
              slim
              exact
              variant="plain"
              value="reveillon"
            >
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
        <!-- Copy Button with Tooltip -->
        <v-col cols="auto">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="copyList">
                <v-icon size="small">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copiar</span>
          </v-tooltip>
        </v-col>

        <!-- Share Button with Tooltip -->
        <v-col cols="auto">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="shareList">
                <v-icon size="small">mdi-share-variant</v-icon>
              </v-btn>
            </template>
            <span>Compartilhar</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
  </section>

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

      <!-- Display filtered events if available -->
      <template v-else>
        <v-row v-for="(events, day) in filteredEvents" :key="day">
          <v-col cols="12" class="py-0">
            <v-toolbar
              color="grey-darken-4"
              style="position: sticky; top: 48px; z-index: 999"
              density="compact"
            >
              <v-toolbar-title>
                <p class="text-h7 grey-darken-4" style="color:#9e9e9e">
                  <v-icon size="x-small">mdi-calendar</v-icon>
                  {{ day }}
                </p>
              </v-toolbar-title>
            </v-toolbar>
            <promoter-card-horizontal
              v-for="event in events"
              :key="event.id"
              :event="event"
            ></promoter-card-horizontal>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import PromoterCardHorizontal from "@/components/promoters/PromoterCardHorizontal.vue";
import { useEventsStore } from "@/store/events";
const { events } = defineProps(["events"]);

const eventsStore = useEventsStore();
const { nextEvents } = storeToRefs(eventsStore);

// Track the selected category from the tabs
const selectedCategory = ref("proximos");

// Fetch events on component mount
onMounted(async () => {
  await eventsStore.getEventsByPromoterId("1");
});

// Computed property to filter events by selected category
const filteredEvents = computed(() => {
  if (!nextEvents.value) return {}; // Return an empty object if nextEvents is undefined

  if (selectedCategory.value === "proximos") return nextEvents.value;
  return Object.keys(nextEvents.value).reduce((acc, day) => {
    const filteredDayEvents = nextEvents.value[day].filter((event) =>
      event.categories?.includes(selectedCategory.value)
    );
    if (filteredDayEvents.length) acc[day] = filteredDayEvents;
    return acc;
  }, {});
});

// Action button methods
const copyList = () => {
  console.log("Copy list functionality");
  // Add functionality to copy list here
};

const shareList = () => {
  console.log("Share list functionality");
  // Add functionality to share list here
};
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
