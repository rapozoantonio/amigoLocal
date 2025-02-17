<template>
  <div :aria-label="$props['aria-label']">
    <v-card
      v-if="event"
      flat
      tile
      color="transparent"
      :class="cardClasses"
      class="mt-1"
      :to="{ name: 'event-id', params: { id: event.id } }"
      role="article"
      :aria-label="`Event: ${event.name}`"
    >
      <v-row no-gutters class="align-center">
        <!-- Left Column: Event Image (always left-aligned) -->
        <v-col :cols="leftCol.cols" :sm="leftCol.sm" class="d-flex align-center justify-start">
          <LazyImage
            :src="event.image?.url || event.flyerFront?.url"
            fallbackSrc="/img/placeholder_event_1.webp"
            :alt="`Event image for ${event.name}`"
            height="60"
            width="96"
            rounded
          />
        </v-col>

        <!-- Right Column: Event Details -->
        <v-col :cols="detailsCol.cols" :sm="detailsCol.sm" class="px-4">
          <!-- Event Name -->
          <h2 :class="eventNameClass">
            <router-link
              :to="{ name: 'event-id', params: { id: event.id } }"
              :aria-label="`View details for ${event.name}`"
              class="text-decoration-none"
            >
              {{ truncateText(event.name, 27) }}
            </router-link>
          </h2>

          <!-- Details Row: Promoter/Category Details & Followers Count -->
          <v-row class="align-center mt-2" no-gutters>
            <!-- Promoter or Categories Section -->
            <v-col class="d-flex align-center">
              <template v-if="mode === 'promoter' && displayPromoterCode">
                <div class="d-flex align-center">
                  <template v-if="event.location?.name">
                    <v-icon size="small" color="primaryIcon" aria-hidden="true">mdi-map-marker</v-icon>
                    <span class="text-caption ml-1 text-grey-darken-1">
                      {{ truncateText(event.location.name) }}
                    </span>
                    <v-icon size="small" color="primaryIcon" aria-hidden="true" class="ml-2">
                      mdi-ticket
                    </v-icon>
                    <span class="text-caption ml-1 text-grey-darken-1">{{ event.promoter?.code }}</span>
                  </template>
                  <template v-else>
                    <v-icon size="small" color="primaryIcon" aria-hidden="true">mdi-ticket</v-icon>
                    <span class="text-caption ml-1 text-grey-darken-1">{{ event.promoter?.code }}</span>
                  </template>
                </div>
              </template>
              <template v-else>
                <div class="d-flex flex-wrap gap-1">
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
              </template>
            </v-col>

            <!-- Followers Count -->
            <v-col cols="auto" class="d-flex align-center justify-end">
              <div
                class="d-flex align-center text-caption text-grey-darken-1"
                role="status"
                :aria-label="`${event.followers} followers`"
              >
                <v-icon size="small" color="primaryIcon" class="mr-1" aria-hidden="true">
                  mdi-account-group
                </v-icon>
                <span>{{ event.followers }}</span>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import LazyImage from "@/components/common/LazyImage.vue";

// Define props and configuration flags.
const props = defineProps({
  event: { type: Object, required: true },
  "aria-label": { type: String, default: "" },
  mode: {
    type: String,
    default: "promoter",
    validator: (value) => ["promoter", "event"].includes(value),
  },
  // When true, display location and promoter code; when false, display event categories.
  displayPromoterCode: { type: Boolean, default: false },
});

const { mobile } = useDisplay();

// Layout configuration for a two-column design.
const leftCol = { cols: 3, sm: 2 };
const detailsCol = { cols: 9, sm: 10 };

const eventNameClass = computed(() => "event-title");

const displayedCategories = computed(() => {
  if (!props.event?.categories) return [];
  return mobile.value ? props.event.categories.slice(0, 3) : props.event.categories;
});

const hasMoreCategories = computed(() => {
  return mobile.value && props.event?.categories?.length > 3;
});

function truncateText(text, limit = 15) {
  return mobile.value && text.length > limit ? text.slice(0, limit) + "..." : text;
}

// Define a computed property for card classes
const cardClasses = computed(() => ({
  "event-card": true,
  "mobile-bright": mobile.value,
}));
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
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s, border-color 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.event-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Mobile Bright: Always brighter on mobile */
.mobile-bright {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Event Title Styling */
.event-title {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

/* Text Styling */
.text-caption {
  font-size: 0.85rem;
}
.text-grey-darken-1 {
  color: #757575;
}

/* Focus Styles */
.event-title a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
.v-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
