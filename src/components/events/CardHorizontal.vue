<template>
  <div :aria-label="$props['aria-label']">
    <!-- Optional top divider -->
    <v-divider class="mb-2" aria-hidden="true" v-if="showDividerTop"></v-divider>

    <v-card v-if="event" flat color="transparent" tile class="event-card"
      :to="{ name: 'event-id', params: { id: event.id } }" role="article" :aria-label="`Event: ${event.name}`">
      <v-row no-gutters class="align-center">
        <!-- Event Image -->
        <v-col :cols="leftCol.cols" :sm="leftCol.sm" class="d-flex justify-center">
          <LazyImage :src="event.image?.url || event.flyerFront?.url" fallbackSrc="/img/placeholder_event_1.webp"
            :alt="`Event image for ${event.name}`" height="60" width="96" rounded />
        </v-col>
        <!-- Event Info -->
        <v-col :cols="middleCol.cols" :sm="middleCol.sm" :class="middleCol.class">
          <!-- Event Name -->
          <h2 :class="eventNameClass">
            <router-link :to="{ name: 'event-id', params: { id: event.id } }"
              :aria-label="`View details for ${event.name}`" class="text-decoration-none">
              {{ event.name }}
            </router-link>
          </h2>

          <!-- Conditional Section: Either display promoter code line or event categories -->
          <div v-if="mode === 'promoter'" class="d-flex flex-wrap gap-1 mt-1" role="group"
            :aria-label="displayPromoterCode ? 'Promoter' : 'Event categories'">
            <!-- If displayPromoterCode is true, display a combined line with location and promoter name -->
            <template v-if="displayPromoterCode">
              <div class="d-flex align-center">
                <template v-if="event.location?.name">
                  <v-icon size="small" color="primaryIcon" aria-hidden="true">mdi-map-marker</v-icon>
                  <span class="text-caption ml-1 text-grey-darken-1">{{
                    event.location.name
                    }}</span>
                </template>
                <v-icon size="small" color="primaryIcon" aria-hidden="true" class="ml-2">mdi-ticket</v-icon>
                <span class="text-caption ml-1 text-grey-darken-1">{{
                  event.promoter?.name
                  }}</span>
              </div>
            </template>
            <!-- Otherwise, display event categories -->
            <template v-else>
              <v-chip v-for="category in displayedCategories" :key="'cat-' + category" size="x-small" label
                variant="outlined" color="primaryIcon" class="mr-1 mb-1" role="listitem">
                {{ category }}
              </v-chip>
              <v-chip v-if="hasMoreCategories" size="x-small" label variant="outlined" color="primaryIcon"
                class="mr-1 mb-1" role="listitem" :aria-label="`Plus ${event.categories.length - 3
                  } more categories`">
                +{{ event.categories.length - 3 }}
              </v-chip>
            </template>
          </div>
        </v-col>

        <!-- Stats: Only Followers Count -->
        <v-col :cols="rightCol.cols" :sm="rightCol.sm" :class="rightCol.class" role="group" aria-label="Event details">
          <div class="d-flex align-center text-caption text-grey-darken-1" role="status"
            :aria-label="`${event.followers} followers`">
            <v-icon size="small" color="primaryIcon" class="mr-1" aria-hidden="true">mdi-account-group</v-icon>
            <span>{{ event.followers }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Optional bottom divider -->
    <v-divider aria-hidden="true" v-if="showDividerBottom"></v-divider>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import LazyImage from "@/components/common/LazyImage.vue";

const props = defineProps({
  event: { type: Object, required: true },
  'aria-label': {  // Add this prop
    type: String,
    default: ''
  },
  // Mode prop is kept for potential flexibility; currently, it should be "promoter"
  mode: {
    type: String,
    default: "promoter",
    validator: (value) => ["promoter", "event"].includes(value),
  },
  showDividerTop: { type: Boolean, default: true },
  showDividerBottom: { type: Boolean, default: false },
  // When true, display the location and promoter;
  // when false, display event categories instead.
  displayPromoterCode: { type: Boolean, default: false },
});

const { mobile } = useDisplay();

// Left column is fixed.
const leftCol = { cols: 3, sm: 2 };

// Middle column always uses the same spacing.
const middleCol = computed(() => ({ cols: 9, sm: 7, class: "px-4" }));

// Right column: display followers count.
const rightCol = computed(() => ({
  cols: 12,
  sm: 3,
  class: "d-flex flex-column align-end mt-1",
}));

const eventNameClass = computed(() => "event-title");

// Computed properties for categories (if needed)
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
  aspect-ratio: 1;
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
