<template>
    <!-- Optional top divider -->
    <v-divider class="mb-2" aria-hidden="true" v-if="showDividerTop"></v-divider>
  
    <v-card
      v-if="event"
      flat
      color="transparent"
      tile
      class="event-card"
      :to="{ name: 'event-id', params: { id: event.id } }"
      role="article"
      :aria-label="`Event: ${event.name}`"
    >
      <v-row no-gutters class="align-center">
        <!-- Event Image -->
        <v-col :cols="leftCol.cols" :sm="leftCol.sm" class="d-flex justify-center">
          <v-img
            height="60"
            :src="event.image?.url || event.flyerFront?.url || '/img/placeholder_event_1.jpg'"
            class="rounded event-image"
            contain
            :alt="`Event image for ${event.name}`"
            role="img"
          ></v-img>
        </v-col>
  
        <!-- Event Info -->
        <v-col :cols="middleCol.cols" :sm="middleCol.sm" :class="middleCol.class">
          <!-- Event Name -->
          <h2 :class="eventNameClass">
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
            <v-icon size="small" color="primaryIcon" aria-hidden="true">mdi-map-marker</v-icon>
            <span class="text-caption ml-1 text-grey-darken-1">
              {{ event.location.name }}
            </span>
          </div>
  
          <!-- Event Categories (only in promoter mode) -->
          <div
            v-if="mode === 'promoter' && event.categories && event.categories.length"
            class="d-flex flex-wrap gap-1 mt-1"
            role="group"
            aria-label="Event categories"
          >
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
  
        <!-- Stats (Promoter Code & Followers) -->
        <v-col :cols="rightCol.cols" :sm="rightCol.sm" :class="rightCol.class" role="group" aria-label="Event details">
          <!-- Promoter Code Button -->
          <v-btn
            v-if="event.promoter?.code"
            :size="promoterBtn.size"
            :rounded="promoterBtn.rounded"
            :density="promoterBtn.density"
            :variant="promoterBtn.variant"
            color="primaryIcon"
            class="mb-1"
            :aria-label="`Promoter code: ${event.promoter.code}`"
          >
            <v-icon :size="promoterBtn.iconSize" :left="promoterBtn.iconLeft" aria-hidden="true">mdi-ticket</v-icon>
            <span>{{ event.promoter.code }}</span>
          </v-btn>
  
          <!-- Followers Count -->
          <div class="d-flex align-center text-caption text-grey-darken-1" role="status" :aria-label="`${event.followers} followers`">
            <v-icon size="small" color="primaryIcon" class="mr-1" aria-hidden="true">mdi-account-group</v-icon>
            <span>{{ event.followers }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  
    <!-- Optional bottom divider -->
    <v-divider aria-hidden="true" v-if="showDividerBottom"></v-divider>
  </template>
  
  <script setup>
  import { computed } from "vue";
  import { useDisplay } from "vuetify";
  
  const props = defineProps({
    event: { type: Object, required: true },
    // Mode can be "promoter" or "event"
    mode: { type: String, default: "promoter", validator: value => ["promoter", "event"].includes(value) },
    showDividerTop: { type: Boolean, default: true },
    showDividerBottom: { type: Boolean, default: false }
  });
  
  const { mobile } = useDisplay();
  
  // Left column is always the same.
  const leftCol = { cols: 3, sm: 2 };
  
  const middleCol = computed(() => {
    if (props.mode === "promoter") {
      return { cols: 9, sm: 7, class: "px-4" };
    } else {
      return { cols: 7, sm: 8, class: "px-3" };
    }
  });
  
  const rightCol = computed(() => {
    if (props.mode === "promoter") {
      return { cols: 12, sm: 3, class: "d-flex flex-column align-end mt-1" };
    } else {
      return { cols: 2, sm: 2, class: "d-flex flex-column align-end" };
    }
  });
  
  const eventNameClass = computed(() => {
    return props.mode === "promoter"
      ? "event-title"
      : "event-name text-body-1 font-weight-medium mb-0";
  });
  
  const promoterBtn = computed(() => {
    return props.mode === "promoter"
      ? { size: "small", rounded: "pill", density: undefined, variant: undefined, iconSize: "small", iconLeft: false }
      : { size: "x-small", rounded: "pill", density: "compact", variant: "text", iconSize: "x-small", iconLeft: true };
  });
  
  const displayedCategories = computed(() => {
    if (!props.event?.categories) return [];
    return mobile.value ? props.event.categories.slice(0, 3) : props.event.categories;
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
  
  /* Event Title/Name Styling */
  .event-title {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
  }
  .event-name {
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.2;
    color: rgb(var(--v-theme-link-text));
    margin-bottom: 0.25rem;
  }
  
  /* Location Styling */
  .location .v-icon {
    vertical-align: middle;
  }
  .location .text-caption {
    font-size: 0.85rem;
  }
  
  /* Improve focus visibility for links and buttons */
  .event-title a:focus-visible,
  .event-name a:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  .v-btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  
  /* Text Color */
  .text-grey-darken-1 {
    color: #757575;
  }
  </style>
  