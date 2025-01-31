<template>
  <v-card
    elevation="0"
    flat
    width="280"
    color="transparent"
    v-if="event"
    tile
    class="event-card pa-0"
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

      <div class="py-2"> <!-- Changed mt-2 to py-2 for consistent spacing -->
        <p class="text-grey-darken-1 font-weight-bold text-caption mb-1">
          {{ formatDate(event.startDate) }}
        </p>
        <router-link
          :to="{ name: 'event-id', params: { id: event.id } }"
          class="event-title font-weight-bold text-truncate d-block"
        >
          {{ event.name }}
        </router-link>
        <div class="d-flex align-center mt-2">
          <v-icon size="18" color="primary" class="mr-2">
            mdi-map-marker
          </v-icon>
          <span class="text-caption text-grey-darken-1">{{
            event.location.name
          }}</span>
        </div>
        <div class="d-flex align-center mt-2">
          <v-icon size="18" color="primary" class="mr-2">
            mdi-account-group
          </v-icon>
          <span class="text-caption text-grey-darken-1">{{
            event.followers
          }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Script remains the same
const { event } = defineProps(["event"]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const weekday = weekdays[date.getDay()];

  return `${weekday}., ${day} DE ${getMonthName(
    date.getMonth()
  ).toUpperCase()}.`;
};

const getMonthName = (monthIndex) => {
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  return months[monthIndex];
};
</script>

<style lang="scss" scoped>
.event-card {
  margin: 0; // Ensure no margins interfere with alignment
  
  .event-title {
    text-decoration: none;
    color: rgb(var(--v-theme-link-text));
    font-size: 1.2rem;
    line-height: 1.4;
    margin: 4px 0; // Reduced margin for tighter spacing

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

// Remove any potential spacing from v-card-text
:deep(.v-card-text) {
  padding: 0;
}
</style>