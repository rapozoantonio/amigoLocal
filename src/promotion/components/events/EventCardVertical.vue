<template>
  <v-card
    elevation="0"
    flat
    width="280"
    color="transparent"
    v-if="event"
    tile
    class="event-card pa-0"
    role="article"
    :aria-label="`Event: ${event.name}`"
  >
    <v-card-text class="pa-0">
      <router-link
        :to="{ name: 'event-id', params: { id: event.id } }"
        :aria-label="`View details for event: ${event.name}`"
      >
        <LazyImage
          :src="event.image?.url || event.flyerFront?.url"
          fallbackSrc="/img/placeholder_event_280x280.webp"
          :alt="`Event image for ${event.name}`"
          height="280"
          width="280"
          fit="cover"
          rounded
        />
      </router-link>

      <div class="py-2" role="group" aria-label="Event details">
        <time
          :datetime="event.startDate"
          class="text-grey-darken-1 font-weight-bold text-caption mb-1"
        >
          {{ formatDate(event.startDate) }}
        </time>

        <h2 class="event-title mb-2">
          <router-link
            :to="{ name: 'event-id', params: { id: event.id } }"
            class="font-weight-bold text-truncate d-block"
            :aria-label="`View details for ${event.name}`"
          >
            {{ event.name }}
          </router-link>
        </h2>

        <div
          class="d-flex align-center mt-2"
          role="group"
          aria-label="Event location"
        >
          <v-icon size="18" color="primary" class="mr-2" aria-hidden="true">
            mdi-map-marker
          </v-icon>
          <span class="text-caption text-grey-darken-1">
            {{ event.location?.name }}
          </span>
        </div>

        <div
          class="d-flex align-center mt-2"
          role="status"
          :aria-label="`${event.followers} followers`"
        >
          <v-icon size="18" color="primary" class="mr-2" aria-hidden="true">
            mdi-account-group
          </v-icon>
          <span class="text-caption text-grey-darken-1">
            {{ event.followers }}
          </span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import LazyImage from "@/promotion/components/common/LazyImage.vue";
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

/* Improve focus visibility */
.event-title a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  text-decoration: underline;
}

/* Ensure proper color contrast */
.text-grey-darken-1 {
  color: #757575; /* WCAG AA compliant */
}

/* Ensure proper text spacing */
.event-title {
  line-height: 1.5;
  margin: 0;
  font-size: 1rem;
}

/* Ensure link styles are visible */
.event-title a {
  color: inherit;
  text-decoration: none;
}

.event-title a:hover {
  text-decoration: underline;
}

/* Handle text truncation accessibly */
.text-truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ensure proper focus on image link */
a:focus-visible img {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
