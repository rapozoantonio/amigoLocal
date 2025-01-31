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
          :src="
            event.image?.url ||
            event.flyerFront?.url ||
            '/img/placeholder_event_1.jpg'
          "
          class="rounded event-image"
          contain
        ></v-img>
      </v-col>

      <!-- Event Info -->
      <v-col cols="7" sm="8" class="px-3">
        <!-- Event Name -->
        <div class="event-name">
          {{ event.name }}
        </div>

        <!-- Event Location -->
        <div class="d-flex align-center mt-1" v-if="event.location?.name">
          <v-icon size="small" color="primaryIcon">mdi-map-marker</v-icon>
          <span class="text-caption ml-1 text-grey-darken-1">{{ event.location.name }}</span>
        </div>
      </v-col>

      <!-- Stats -->
      <v-col cols="2" sm="2" class="d-flex flex-column align-end">
        <!-- Promoter Code -->
        <v-btn
          v-if="event.promoter?.code"
          size="x-small"
          rounded="pill"
          density="compact"
          variant="text"
          class="mb-1"
        >
          <v-icon size="x-small" start>mdi-ticket</v-icon>
          {{ event.promoter.code }}
        </v-btn>

        <!-- Followers Count -->
        <div class="d-flex align-center text-caption text-grey-darken-1">
          <v-icon size="small" color="primaryIcon" class="mr-1">
            mdi-account-group
          </v-icon>
          {{ event.followers }}
        </div>
      </v-col>
    </v-row>
  </v-card>
  <v-divider></v-divider>
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
</style>