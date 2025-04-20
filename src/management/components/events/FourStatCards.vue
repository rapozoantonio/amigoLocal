<template>
  <v-row class="px-4 mt-2">
    <v-col v-for="(card, index) in gridCards" :key="index" cols="6" sm="3">
      <v-card flat border="thin" class="kpi-card">
        <div
          class="kpi-accent"
          :style="{ backgroundColor: card.accentColor || 'transparent' }"
        ></div>
        <div class="pa-3">
          <div class="d-flex align-center mb-1">
            <v-icon
              v-if="card.icon"
              :icon="card.icon"
              size="18"
              :color="card.iconColor"
              class="mr-2"
            ></v-icon>
            <div class="kpi-title" v-if="card.title">{{ card.title }}</div>
          </div>
          <div class="kpi-value" v-if="card.value !== undefined">
            {{ card.value }}
          </div>
          <div v-else class="kpi-value">-</div>
          <div v-if="card.trend" class="kpi-trend">
            <v-icon
              :icon="card.trend.icon"
              :color="card.trend.color"
              size="14"
            ></v-icon>
            <span :class="['trend-text', card.trend.color + '--text']">
              {{ card.trend.value }}%
            </span>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  cards: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Ensure we always have exactly 4 items (pad with empty objects if needed)
const gridCards = computed(() => {
  const cardsCopy = [...props.cards];
  while (cardsCopy.length < 4) {
    cardsCopy.push({});
  }
  return cardsCopy.slice(0, 4);
});
</script>