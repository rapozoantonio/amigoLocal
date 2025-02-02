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
        <LazyImage
          :src="event.image.url || event.flyerFront.url"
          fallbackSrc="/img/placeholder_event_1.jpg"
          height="60"
          fit="contain"
          rounded
          class="event-image"
          :alt="`Event image for ${event.name}`"
        />
      </v-col>
      <!-- Event Details (stacked layout for mobile) -->
      <v-col cols="9" sm="7" class="px-4">
        <!-- Event Name -->
        <h2 class="event-title">
          <router-link
            :to="{ name: 'event-id', params: { id: event.id } }"
            :aria-label="`View details for ${event.name}`"
          >
            {{ event.name }}
          </router-link>
        </h2>

        <!-- Event Location -->
        <div
          class="d-flex align-center my-1 location text-grey-darken-1"
          v-if="event.location?.name"
          role="group"
          aria-label="Event location"
        >
          <v-icon size="small" color="primaryIcon" aria-hidden="true"
            >mdi-map-marker</v-icon
          >
          <span class="text-caption ml-1">{{ event.location.name }}</span>
        </div>
        <!-- Event Tags -->
        <div
          class="d-flex flex-wrap gap-1 mt-1"
          role="group"
          aria-label="Event categories"
        >
          <!-- Categories -->
          <v-chip
            v-for="category in displayedCategories"
            :key="'cat-' + category"
            size="x-small"
            label
            variant="outlined"
            color="primaryIcon"
            class="mr-1 mb-1"
            role="listitem"
          >
            {{ category }}
          </v-chip>
          <v-chip
            v-if="hasMoreCategories"
            size="x-small"
            label
            variant="outlined"
            color="primaryIcon"
            class="mr-1 mb-1"
            role="listitem"
            :aria-label="`Plus ${event.categories.length - 3} more categories`"
          >
            +{{ event.categories.length - 3 }}
          </v-chip>
        </div>
      </v-col>
      <!-- Promoter and Followers (stacked for mobile) -->
      <v-col
        cols="12"
        sm="3"
        class="d-flex flex-column align-end mt-1"
        role="group"
        aria-label="Event promoter information"
      >
        <!-- Promoter Code Button -->
        <v-btn
          v-if="event.promoter?.code"
          size="small"
          rounded="pill"
          color="primaryIcon"
          class="mb-1 promoter-button"
          :aria-label="`Promoter code: ${event.promoter.code}`"
        >
          <v-icon size="small" left aria-hidden="true">mdi-ticket</v-icon>
          <span>{{ event.promoter.code }}</span>
        </v-btn>

        <!-- Followers Count -->
        <div
          class="d-flex align-center text-caption followers"
          role="status"
          :aria-label="`${event.followers} followers`"
        >
          <v-icon
            size="small"
            color="primaryIcon"
            class="mr-1"
            aria-hidden="true"
            >mdi-account-group</v-icon
          >
          <span class="text-grey-darken-1">{{ event.followers }}</span>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import LazyImage from "@/components/common/LazyImage.vue";

const props = defineProps(["event"]);
const { mobile } = useDisplay();

const displayedCategories = computed(() => {
  if (!props.event?.categories) return [];
  return mobile.value
    ? props.event.categories.slice(0, 3)
    : props.event.categories;
});

const hasMoreCategories = computed(() => {
  return mobile.value && props.event?.categories?.length > 3;
});
</script>

<style lang="scss" scoped>
/* General Link Styles */
a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
}

a:hover {
  color: rgba(var(--v-theme-secondary), 1);
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
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

/* Location Styling */
.location .v-icon {
  vertical-align: middle;
}

.location .text-caption {
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
}

/* Ensure proper focus visibility */
.event-title a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Ensure proper color contrast */
.text-grey-darken-1 {
  color: #757575; /* Ensure WCAG AA compliance */
}

/* Improve button focus states */
.v-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Ensure proper text spacing */
.event-title {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}
</style>
