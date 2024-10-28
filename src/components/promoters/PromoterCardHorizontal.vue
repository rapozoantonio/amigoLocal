<template>
  <v-divider class="mb-2"></v-divider>
  <v-card
    flat
    color="transparent"
    tile
    v-if="event"
    class="event-card"
    :to="{ name: 'event-id', params: { id: event.id } }"
  >
    <v-row no-gutters class="align-center">
      <!-- Event Image -->
      <v-col cols="3" sm="2" class="d-flex justify-center">
        <v-img
          height="60"
          :src="event.image ? event.image.url : event.flyerFront ? event.flyerFront.url : '/img/placeholder_event_1.jpg'"
          class="rounded event-image"
          contain
        ></v-img>
      </v-col>

      <!-- Event Details (stacked layout for mobile) -->
      <v-col cols="9" sm="7" class="px-2">
        <!-- Event Name -->
        <div class="event-name">
          <router-link
            :to="{ name: 'event-id', params: { id: event.id } }"
            class="text-h6 font-weight-bold"
          >
            {{ event.name }}
          </router-link>
        </div>

        <!-- Event Location -->
        <div v-if="event.location?.name" class="d-flex align-center my-1 location">
          <v-icon size="small" color="red">mdi-map-marker-outline</v-icon>
          <span class="text-caption ml-1">{{ event.location.name }}</span>
        </div>
      </v-col>

      <!-- Promoter and Followers (stacked for mobile) -->
      <v-col cols="12" sm="3" class="d-flex flex-column align-end mt-1">
        <!-- Promoter Code Button -->
        <v-btn
          v-if="event.promoter?.code"
          size="small"
          rounded="pill"
          color="red darken-4"
          class="mb-1 promoter-button"
        >
          <v-icon size="small" left>mdi-ticket</v-icon>
          {{ event.promoter.code }}
        </v-btn>

        <!-- Followers Count -->
        <div class="d-flex align-center text-caption followers">
          <v-icon size="small" color="red" class="mr-1">mdi-account-outline</v-icon>
          <span>{{ event.followers }}</span>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped>
/* General Link Styles */
a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
}

a:hover {
  color: rgba(var(--v-theme-primary), 1);
}

/* Event Card Styles */
.event-card {
  display: block;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}
.event-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Event Image Styling */
.event-image {
  border-radius: 4px;
  width: 100%;
}

/* Event Name Styling */
.event-name {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.87);
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Location Styling */
.location .v-icon {
  vertical-align: middle;
}

.location .text-caption {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

/* Promoter Button Styling */
.promoter-button {
  align-self: flex-start;
  width: fit-content;
}

/* Followers Styling */
.followers {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
}
</style>
