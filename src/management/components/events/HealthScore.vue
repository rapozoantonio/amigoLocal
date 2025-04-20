<template>
  <div class="health-score-container border mr-4 ml-4">
    <div class="header d-flex justify-space-between align-center mb-4">
      <h2 class="title text-h6 font-weight-bold">Visão Geral</h2>
      <v-chip :color="healthScoreColor" size="small" class="health-score-chip">
        Saúde do Evento: {{ score }}%
      </v-chip>
    </div>

    <div class="health-score-wrapper">
      <div class="health-score-progress">
        <!-- Segmented background -->
        <div class="score-segments">
          <div class="score-segment danger"></div>
          <div class="score-segment warning"></div>
          <div class="score-segment good"></div>
          <div class="score-segment excellent"></div>
        </div>

        <!-- Progress indicator -->
        <div class="score-progress">
          <div
            class="score-progress-fill"
            :style="{ width: `${score}%` }"
            :class="healthScoreColor"
          ></div>
        </div>

        <!-- Indicator dot and label -->
        <div class="score-indicator" :style="{ left: `${score}%` }">
          <div class="score-indicator-dot" :class="healthScoreColor"></div>
          <div class="score-indicator-label" :class="healthScoreColor">
            {{ score }}%
          </div>
        </div>
      </div>

      <div class="score-legend mt-3">
        <div class="legend-item">
          <div class="legend-color danger"></div>
          <span class="legend-text">Crítico</span>
        </div>
        <div class="legend-item">
          <div class="legend-color warning"></div>
          <span class="legend-text">Atenção</span>
        </div>
        <div class="legend-item">
          <div class="legend-color good"></div>
          <span class="legend-text">Bom</span>
        </div>
        <div class="legend-item">
          <div class="legend-color excellent"></div>
          <span class="legend-text">Excelente</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  score: {
    type: Number,
    required: true,
  },
});

const healthScoreColor = computed(() => {
  if (props.score >= 80) return "success";
  if (props.score >= 60) return "primary";
  if (props.score >= 40) return "warning";
  return "error";
});
</script>
