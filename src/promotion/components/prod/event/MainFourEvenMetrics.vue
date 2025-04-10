<template>
    <v-expansion-panels v-model="panelOpen">
      <v-expansion-panel title="Main Metrics">
        <v-expansion-panel-text>
          <v-row class="metrics-row" align="stretch">
            <!-- Check-ins -->
            <v-col cols="6" sm="3">
              <v-card variant="flat" border="thin" class="metric-card" style="height: 100%;">
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div class="text-caption font-weight-medium">Check-ins</div>
                    <v-icon size="x-small" color="grey-lighten-1">mdi-account-check</v-icon>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-h6 font-weight-bold me-1">{{ event.checkInCount }}</span>
                    <span class="text-caption text-grey">/ {{ event.totalGuests }}</span>
                  </div>
                  <div class="progress-container mb-1">
                    <div
                      class="progress-bar"
                      :style="{ width: `${Math.min(100, (event.checkInCount / Math.max(1, event.totalGuests)) * 100)}%` }"
                      :class="{ 'high-progress': event.checkInCount / Math.max(1, event.totalGuests) > 0.7 }"
                    ></div>
                  </div>
                  <div class="text-caption text-grey d-flex align-center">
                    <span>{{ Math.round((event.checkInCount / Math.max(1, event.totalGuests)) * 100) }}% de presença</span>
                    <trend-indicator v-if="checkInTrend !== 0" :value="checkInTrend" class="ms-1" />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- VIP Lists -->
            <v-col cols="6" sm="3">
              <v-card variant="flat" border="thin" class="metric-card" style="height: 100%;">
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div class="text-caption font-weight-medium">Listas</div>
                    <v-icon size="x-small" color="grey-lighten-1">mdi-format-list-checks</v-icon>
                  </div>
                  <div class="d-flex align-center mb-1">
                    <span class="text-h6 font-weight-bold">{{ event.vipListsCount }}</span>
                  </div>
                  <div class="mini-chart mb-1">
                    <div
                      v-for="(segment, i) in listDistribution"
                      :key="i"
                      class="chart-segment"
                      :style="{ width: `${segment.percentage}%`, backgroundColor: segment.color }"
                    ></div>
                  </div>
                  <div class="text-caption text-grey">
                    {{ event.totalGuests > 0 ? Math.round((event.vipListsCount / event.totalGuests) * 100) : 0 }} convidados/lista
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- Promoters -->
            <v-col cols="6" sm="3">
              <v-card variant="flat" border="thin" class="metric-card" style="height: 100%;">
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div class="text-caption font-weight-medium">Promotores</div>
                    <v-icon size="x-small" color="grey-lighten-1">mdi-account-tie</v-icon>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-h6 font-weight-bold">{{ event.promotersCount }}</span>
                  </div>
                  <div class="team-performance mb-1">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="team-member"
                      :class="{ 'active-member': i <= event.promotersCount }"
                    ></div>
                  </div>
                  <div class="text-caption text-grey">
                    {{ promoterEfficiency }}/promotor
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- Revenue -->
            <v-col cols="6" sm="3">
              <v-card variant="flat" border="thin" class="metric-card revenue-card" style="height: 100%;">
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div class="text-caption font-weight-medium">Receita</div>
                    <v-icon size="x-small" color="grey-lighten-1">mdi-cash</v-icon>
                  </div>
                  <div class="d-flex align-center mb-1">
                    <span class="text-h6 font-weight-bold revenue-value">{{ formatCurrency(event.revenue) }}</span>
                    <trend-indicator
                      v-if="event.revenuePrediction"
                      :value="event.revenue / event.revenuePrediction - 1"
                      :thresholds="{ positive: 0, warning: -0.2, negative: -0.5 }"
                      class="ms-1"
                    />
                  </div>
                  <div class="revenue-progress mb-1" v-if="event.revenuePrediction">
                    <div class="revenue-target-line" :style="{ left: '100%' }"></div>
                    <div
                      class="revenue-progress-bar"
                      :style="{ width: `${Math.min(100, (event.revenue / event.revenuePrediction) * 100)}%` }"
                      :class="getRevenueProgressClass(event.revenue / event.revenuePrediction)"
                    ></div>
                  </div>
                  <div class="text-caption text-grey">
                    {{ event.revenuePrediction ? `${Math.round((event.revenue / event.revenuePrediction) * 100)}% da meta` : 'Sem meta definida' }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </template>
  <script setup>
  import { ref, computed } from 'vue'
  import { useDisplay } from 'vuetify'
  
  // Props
  const props = defineProps({
    event: {
      type: Object,
      required: true
    }
  })
  
  // Display for mobile detection
  const { xs } = useDisplay()
  const panelOpen = ref(!xs.value ? 0 : null) // Open by default on non-mobile (0 = first panel open), closed on mobile (null)
  
  // Static list distribution
  const listDistribution = [
    { percentage: 40, color: 'var(--v-primary-base)' },
    { percentage: 25, color: 'var(--v-primary-lighten1)' },
    { percentage: 20, color: 'var(--v-secondary-base)' },
    { percentage: 15, color: 'var(--v-grey-lighten1)' }
  ]
  
  // TrendIndicator component
  const TrendIndicator = {
    props: {
      value: { type: Number, required: true },
      thresholds: {
        type: Object,
        default: () => ({ positive: 0.05, warning: -0.05, negative: -0.1 })
      }
    },
    setup(props) {
      const getIcon = computed(() => {
        if (props.value >= props.thresholds.positive) return 'mdi-trending-up'
        if (props.value <= props.thresholds.negative) return 'mdi-trending-down'
        return 'mdi-trending-neutral'
      })
      const getColor = computed(() => {
        if (props.value >= props.thresholds.positive) return 'success'
        if (props.value <= props.thresholds.negative) return 'error'
        if (props.value <= props.thresholds.warning) return 'warning'
        return 'success'
      })
      return { getIcon, getColor }
    },
    template: `<v-icon :icon="getIcon" :color="getColor" size="14"></v-icon>`
  }
  
  // Computed properties
  const checkInTrend = computed(() => {
    const history = props.event.checkInHistory
    if (!history || history.length < 2) return 0
    const last = history[history.length - 1]
    const secondLast = history[history.length - 2]
    return (last - secondLast) / secondLast
  })
  
  const promoterEfficiency = computed(() => {
    if (!props.event.promotersCount || props.event.promotersCount === 0) return '0 convidados'
    const guestsPerPromoter = Math.round(props.event.totalGuests / props.event.promotersCount)
    return `${guestsPerPromoter} convidados`
  })
  
  // Methods
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R$ 0'
    const numValue = typeof value === 'number' ? value : Number(value)
    if (isNaN(numValue)) return 'R$ 0'
    if (numValue >= 1000000) return `R$ ${(numValue / 1000000).toFixed(1)}M`
    else if (numValue >= 1000) return `R$ ${(numValue / 1000).toFixed(1)}k`
    else return `R$ ${numValue}`
  }
  
  const getRevenueProgressClass = (percentage) => {
    if (percentage >= 1) return 'revenue-progress-high'
    if (percentage >= 0.7) return 'revenue-progress-medium'
    return 'revenue-progress-low'
  }
  </script>
  <style scoped>
  .progress-container {
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background: var(--v-primary-base);
    transition: width 0.3s ease;
  }
  
  .progress-bar.high-progress {
    background: var(--v-success-base);
  }
  
  .mini-chart {
    height: 4px;
    display: flex;
  }
  
  .chart-segment {
    height: 100%;
  }
  
  .team-performance {
    display: flex;
    gap: 4px;
  }
  
  .team-member {
    width: 8px;
    height: 8px;
    background: #e0e0e0;
    border-radius: 50%;
  }
  
  .team-member.active-member {
    background: var(--v-primary-base);
  }
  
  .revenue-progress {
    height: 4px;
    background: #e0e0e0;
    position: relative;
    border-radius: 2px;
  }
  
  .revenue-target-line {
    position: absolute;
    width: 1px;
    height: 100%;
    background: #666;
  }
  
  .revenue-progress-bar {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .revenue-progress-high {
    background: var(--v-success-base);
  }
  
  .revenue-progress-medium {
    background: var(--v-warning-base);
  }
  
  .revenue-progress-low {
    background: var(--v-error-base);
  }
  </style>