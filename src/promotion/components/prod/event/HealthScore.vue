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
  import { computed } from 'vue';
  
  const props = defineProps({
    score: {
      type: Number,
      required: true,
    },
  });
  
  const healthScoreColor = computed(() => {
    if (props.score >= 80) return 'success';
    if (props.score >= 60) return 'primary';
    if (props.score >= 40) return 'warning';
    return 'error';
  });
  </script>
  
  <style scoped>
  .health-score-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .title {
    margin: 0;
  }
  
  .health-score-chip {
    text-transform: none;
  }
  
  .health-score-wrapper {
    position: relative;
  }
  
  .health-score-progress {
    position: relative;
    height: 1rem;
    margin-bottom: 1rem;
  }
  
  .score-segments {
    display: flex;
    height: 100%;
  }
  
  .score-segment {
    flex: 1;
  }
  
  .score-segment.danger {
    background-color: var(--v-error-base);
  }
  
  .score-segment.warning {
    background-color: var(--v-warning-base);
  }
  
  .score-segment.good {
    background-color: var(--v-primary-base);
  }
  
  .score-segment.excellent {
    background-color: var(--v-success-base);
  }
  
  .score-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .score-progress-fill {
    height: 100%;
    transition: width 0.5s ease;
  }
  
  /* Updated indicator dot styles for a more prominent ball */
  .score-indicator {
    position: absolute;
    top: -1.5rem;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .score-indicator-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: currentColor;
    margin-bottom: 0.25rem;
  }
  
  .score-indicator-label {
    font-size: 0.75rem;
    font-weight: bold;
  }
  
  .score-legend {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  
  .legend-color.danger {
    background-color: var(--v-error-base);
  }
  
  .legend-color.warning {
    background-color: var(--v-warning-base);
  }
  
  .legend-color.good {
    background-color: var(--v-primary-base);
  }
  
  .legend-color.excellent {
    background-color: var(--v-success-base);
  }
  
  .legend-text {
    font-size: 0.75rem;
  }
  
  @media (max-width: 600px) {
    .health-score-container {
      padding: 0.75rem;
      margin: 0.5rem 0.25rem;
    }
    .header {
      flex-direction: column;
      align-items: flex-start;
    }
    .health-score-wrapper {
      margin-top: 1rem;
    }
  }
  </style>
  