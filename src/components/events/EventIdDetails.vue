<template>
  <v-container>
    <!-- Links Section -->
    <div v-if="event.links && event.links.length" class="mb-6">
      <v-card color="surface" variant="outlined" class="pa-4">
        <div class="d-flex flex-column">
          <v-btn
            v-for="link in event.links"
            :key="link.name"
            :href="!link.url.includes('http') ? 'http://' + link.url : link.url"
            target="_blank"
            color="error"
            block
            class="link-button mb-3"
            variant="flat"
          >
            <v-icon start size="20" class="mr-2">
              {{ getLinkIcon(link.name) }}
            </v-icon>
            {{ link.name }}
            <v-icon end size="16" class="ml-1">mdi-open-in-new</v-icon>
          </v-btn>
        </div>
      </v-card>
    </div>

    <!-- Line-up Section -->
    <v-row v-if="event.lineup">
      <v-col cols="12" class="py-4">
        <p class="text-primary lineup-title font-weight-bold mb-3">
          🎧 Line-up
        </p>
        <div class="lineup-content">
          <p v-html="event.lineup" class="font-weight-bold"></p>
        </div>
      </v-col>
    </v-row>

    <!-- Additional Info Section -->
    <v-row v-if="hasAdditionalInfo">
      <v-col cols="12" md="6">
        <!-- Detalhes Section: Only if description exists -->
        <p
          v-if="event.description"
          class="text-primary lineup-title font-weight-bold mb-3"
        >
          Detalhes
        </p>
        <div v-if="event.description" class="event-details mb-6">
          <p class="text-body-1">{{ event.description }}</p>
        </div>

        <!-- Additional Info -->
        <v-row>
          <!-- Preços: Only if price info exists -->
          <v-col cols="12" v-if="hasPriceInfo">
            <p class="text-caption text-grey mb-2">Preços</p>
            <p
              v-for="(value, name) in event.price"
              :key="name"
              class="text-subtitle-2 mb-1"
            >
              {{ name }}: R$ {{ value }}
            </p>
          </v-col>

          <!-- Última atualização: Only if updated_at exists -->
          <v-col cols="6" v-if="event.updated_at">
            <p class="text-caption text-grey mb-1">Última atualização</p>
            <p class="text-subtitle-2">{{ formattedUpdatedAt }}</p>
          </v-col>

          <!-- Idade mínima: Only if age exists -->
          <v-col cols="6" v-if="event.age">
            <p class="text-caption text-grey mb-1">Idade mínima</p>
            <p class="text-subtitle-2">{{ event.age }}</p>
          </v-col>
        </v-row>
      </v-col>

      <!-- Event Image -->
      <v-col cols="12" md="6">
        <LazyImage
          :src="event.image?.url || event.flyerFront?.url"
          fallbackSrc="/img/placeholder_event_2.jpg"
          class="rounded"
          :aspect-ratio="1"
          rounded
          :alt="`Event image for ${event.name}`"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import LazyImage from "@/components/common/LazyImage.vue";

// The component receives the event object as a prop
const props = defineProps(["event"]);

// Helper function to choose an icon based on link name
const getLinkIcon = (name) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("ingresso")) return "mdi-ticket";
  if (lowercaseName.includes("instagram")) return "mdi-instagram";
  if (lowercaseName.includes("agenda")) return "mdi-calendar";
  return "mdi-link";
};

// Computed property: Check if the event has any price info
const hasPriceInfo = computed(() => {
  return props.event.price && Object.keys(props.event.price).length > 0;
});

// Computed property: Determine if at least one piece of additional info exists
const hasAdditionalInfo = computed(() => {
  return (
    props.event.description ||
    hasPriceInfo.value ||
    props.event.updated_at ||
    props.event.age
  );
});

// Computed property: Format updated_at date (if it exists)
// Assumes that event.updated_at is a Firestore Timestamp with a .toDate() method.
const formattedUpdatedAt = computed(() => {
  return props.event.updated_at
    ? new Date(props.event.updated_at.toDate()).toLocaleString("pt-BR")
    : "";
});
</script>

<style lang="scss" scoped>
.link-button {
  height: 48px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    height: 44px;
  }
}

:deep(.v-btn--variant-flat) {
  &:hover {
    opacity: 0.9;
  }
}

:deep(.v-btn__content) {
  justify-content: flex-start;
}

.event-details p {
  line-height: 1.6;
  margin-bottom: 16px;
}

.lineup-title {
  font-size: 1.75rem;
  line-height: 1.2;

  @media (min-width: 600px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
}

.lineup-content {
  font-size: 1.125rem;
  line-height: 1.4;

  @media (min-width: 600px) {
    font-size: 1.25rem;
  }

  :deep(p) {
    margin-bottom: 0.5rem;
  }
}
</style>
