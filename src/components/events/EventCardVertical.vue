<template>
  <v-card
    elevation="0"
    flat
    width="280"
    color="transparent"
    v-if="event"
    tile
    class="event-card"
  >
    <v-card-text class="pa-0">
      <router-link :to="{ name: 'event-id', params: { id: event.id } }">
        <v-img
          height="280"
          width="280"
          cover
          class="rounded"
          :src="
            event.image?.url || 
            event.flyerFront?.url || 
            '/img/placeholder_event_1.jpg'
          "
        ></v-img>
      </router-link>

      <div class="mt-2">
        <p class="text-grey-darken-1 font-weight-bold">
          {{ event.startDate }}
        </p>
        <router-link
          :to="{ name: 'event-id', params: { id: event.id } }"
          class="event-title font-weight-bold text-truncate d-block"
        >
          {{ event.name }}
        </router-link>
        <div class="d-flex align-center mt-2">
          <v-icon size="18" color="primary" class="mr-2">
            mdi-map-marker-radius-outline
          </v-icon>
          <span class="text-caption">{{ event.location.name }}</span>
        </div>
        <div class="d-flex align-center mt-2">
          <v-icon size="18" color="primary" class="mr-2">
            mdi-account-multiple
          </v-icon>
          <span class="text-caption">{{ event.followers }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped>
.event-card {
  .event-title {
    text-decoration: none;
    color: rgb(var(--v-theme-link-text));
    font-size: 1.2rem;
    line-height: 1.4;
    margin: 8px 0;
    
    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }

  .text-caption {
    color: rgb(var(--v-theme-link-text));
  }

  :deep(.v-icon) {
    color: rgb(var(--v-theme-primaryIcon)) !important;
  }
}
</style>