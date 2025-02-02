<template>
  <v-divider class="mb-2" aria-hidden="true"></v-divider>
  <v-card
    flat
    color="transparent"
    tile
    v-if="event"
    class="event-card"
    :to="{ name: 'event-id', params: { id: event.id } }"
    role="article"
    :aria-label="`Event: ${event.name}`"
  >
    <v-row no-gutters class="align-center">
      <!-- Event Image -->
      <v-col cols="3" sm="2" class="d-flex justify-center">
        <v-img
          height="60"
          :src="
            event.image?.url ||
            event.flyerFront?.url ||
            '/img/placeholder_event_1.jpg'
          "
          class="rounded event-image"
          contain
          :alt="`Event image for ${event.name}`"
          role="img"
        ></v-img>
      </v-col>

      <!-- Event Info -->
      <v-col cols="7" sm="8" class="px-3">
        <!-- Event Name -->
        <h2 class="event-name text-body-1 font-weight-medium mb-0">
          <router-link 
            :to="{ name: 'event-id', params: { id: event.id } }"
            :aria-label="`View details for ${event.name}`"
            class="text-decoration-none"
          >
            {{ event.name }}
          </router-link>
        </h2>

        <!-- Event Location -->
        <div 
          class="d-flex align-center mt-1" 
          v-if="event.location?.name"
          role="group"
          aria-label="Event location"
        >
          <v-icon 
            size="small" 
            color="primaryIcon"
            aria-hidden="true"
          >mdi-map-marker</v-icon>
          <span class="text-caption ml-1 text-grey-darken-1">
            {{ event.location.name }}
          </span>
        </div>
      </v-col>

      <!-- Stats -->
      <v-col 
        cols="2" 
        sm="2" 
        class="d-flex flex-column align-end"
        role="group"
        aria-label="Event details"
      >
        <!-- Promoter Code -->
        <v-btn
          v-if="event.promoter?.code"
          size="x-small"
          rounded="pill"
          density="compact"
          variant="text"
          class="mb-1"
          :aria-label="`Promoter code: ${event.promoter.code}`"
        >
          <v-icon 
            size="x-small" 
            start
            aria-hidden="true"
          >mdi-ticket</v-icon>
          <span>{{ event.promoter.code }}</span>
        </v-btn>

        <!-- Followers Count -->
        <div 
          class="d-flex align-center text-caption text-grey-darken-1"
          role="status"
          :aria-label="`${event.followers} followers`"
        >
          <v-icon 
            size="small" 
            color="primaryIcon" 
            class="mr-1"
            aria-hidden="true"
          >
            mdi-account-group
          </v-icon>
          <span>{{ event.followers }}</span>
        </div>
      </v-col>
    </v-row>
  </v-card>
  <v-divider aria-hidden="true"></v-divider>
</template>
<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped>
.event-card {
  padding: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.event-image {
  width: 100%;
  aspect-ratio: 1;
}

.event-name {
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.2;
  color: rgb(var(--v-theme-link-text));
}

:deep(.v-btn) {
  min-width: 0;
  padding: 0 8px;
  height: 24px;
}

:deep(.v-icon) {
  color: rgb(var(--v-theme-primaryIcon)) !important;
}

/* Improve focus visibility */
.event-name a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  text-decoration: underline;
}

/* Ensure proper color contrast */
.text-grey-darken-1 {
  color: #757575; /* WCAG AA compliant */
}

/* Improve button focus states */
.v-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Ensure proper text spacing */
.event-name {
  line-height: 1.5;
  margin-bottom: 0.25rem;
}

/* Ensure link styles are visible */
.event-name a {
  color: inherit;
  text-decoration: none;
}

.event-name a:hover {
  text-decoration: underline;
}
</style>