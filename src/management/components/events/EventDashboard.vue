<template>
  <div class="event-dashboard">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="pa-4 d-flex justify-center align-center loading-container"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <div v-else>
      <!-- Event Health Score -->
      <div class="health-score-container pa-4 border mt-2 mr-4 ml-4">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h6 font-weight-bold">Visão Geral</h2>
          <v-chip
            :color="getHealthScoreColor()"
            size="small"
            class="health-score-chip"
          >
            Saúde do Evento: {{ eventHealthScore }}%
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
                :style="{ width: `${eventHealthScore}%` }"
                :class="getHealthScoreColor()"
              ></div>
            </div>

            <!-- Indicator dot and label -->
            <div
              class="score-indicator"
              :style="{ left: `${eventHealthScore}%` }"
            >
              <div
                class="score-indicator-dot"
                :class="getHealthScoreColor()"
              ></div>
              <div class="score-indicator-label" :class="getHealthScoreColor()">
                {{ eventHealthScore }}%
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

      <FourStatCards :cards="dashboardKpiCards" />

      <!-- Charts Section -->
      <v-row class="px-4 mt-3">
        <!-- Check-in Activity with Sparkline -->
        <v-col cols="12" md="6">
          <v-card flat border="thin" class="chart-card">
            <v-card-title class="chart-title">
              <div class="d-flex justify-space-between align-center w-100">
                <div class="text-subtitle-1 font-weight-bold">
                  Check-ins por Hora
                </div>
                <v-chip
                  variant="text"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-clock-outline"
                >
                  Atualizado {{ lastUpdateTime }}
                </v-chip>
              </div>
            </v-card-title>

            <v-card-text class="chart-content">
              <div class="pa-2 sparkline-container">
                <v-sparkline
                  :model-value="checkInValues"
                  :labels="checkInLabels"
                  :gradient="sparklineGradient"
                  :padding="sparklinePadding"
                  :line-width="sparklineLineWidth"
                  :smooth="sparklineSmooth"
                  :fill="true"
                  auto-draw
                  show-labels
                  label-size="10"
                  height="68"
                ></v-sparkline>
              </div>

              <div class="d-flex justify-center mt-3">
                <v-chip
                  variant="outlined"
                  color="primary"
                  size="small"
                  class="mr-2"
                >
                  <span class="font-weight-medium"
                    >Total: {{ totalCheckIns }}</span
                  >
                </v-chip>
                <v-chip variant="outlined" color="success" size="small">
                  <span class="font-weight-medium"
                    >Esperados: {{ expectedCheckIns }}</span
                  >
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Revenue Tracking -->
        <v-col cols="12" md="6">
          <v-card flat border="thin" class="chart-card">
            <v-card-title class="chart-title">
              <div class="d-flex justify-space-between align-center w-100">
                <div class="text-subtitle-1 font-weight-bold">
                  Receita por Lista
                </div>
                <v-chip
                  variant="text"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-cash"
                >
                  {{ formatCurrency(totalRevenue) }}
                </v-chip>
              </div>
            </v-card-title>

            <v-card-text class="chart-content">
              <div class="revenue-chart-container">
                <div
                  v-for="(list, index) in revenueData"
                  :key="index"
                  class="list-revenue-item mb-3"
                >
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div class="d-flex align-center">
                      <div
                        class="list-icon mr-2"
                        :style="{ backgroundColor: list.color }"
                      >
                        <v-icon size="12" color="white">{{ list.icon }}</v-icon>
                      </div>
                      <span class="text-body-2">{{ list.name }}</span>
                    </div>
                    <span class="text-body-2 font-weight-medium">{{
                      formatCurrency(list.value)
                    }}</span>
                  </div>

                  <div class="revenue-bar-container">
                    <div
                      class="revenue-bar"
                      :style="{
                        width: `${(list.value / totalRevenue) * 100}%`,
                        backgroundColor: list.color,
                      }"
                    ></div>
                  </div>

                  <div
                    class="d-flex justify-space-between text-caption text-grey mt-1"
                  >
                    <span>{{ list.checkIns }} check-ins</span>
                    <span
                      >{{
                        Math.round((list.value / totalRevenue) * 100)
                      }}%</span
                    >
                  </div>
                </div>
              </div>

              <div class="text-center mt-2">
                <v-chip :color="revenueProgress.color" size="small">
                  {{ revenueProgress.text }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="px-4 mt-2">
        <!-- Guest Distribution -->
        <v-col cols="12" md="6" lg="4">
          <v-card flat border="thin" class="chart-card">
            <v-card-title class="chart-title">
              <div class="text-subtitle-1 font-weight-bold">
                Distribuição de Convidados
              </div>
            </v-card-title>

            <v-card-text class="chart-content">
              <div class="distribution-chart">
                <div class="donut-chart-container">
                  <!-- SVG Donut Chart -->
                  <svg viewBox="0 0 120 120" class="donut-chart">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke="var(--v-grey-lighten4)"
                      stroke-width="12"
                    />

                    <!-- Dynamic segments -->
                    <circle
                      v-for="(segment, index) in distributionSegments"
                      :key="index"
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      :stroke="segment.color"
                      stroke-width="12"
                      :stroke-dasharray="`${segment.percentage * 3.14} ${
                        314 - segment.percentage * 3.14
                      }`"
                      :stroke-dashoffset="segment.offset"
                      class="donut-segment"
                    />

                    <!-- Inner circle -->
                    <circle cx="60" cy="60" r="40" fill="white" />

                    <!-- Center text -->
                    <text
                      x="60"
                      y="55"
                      text-anchor="middle"
                      class="donut-number font-weight-bold"
                    >
                      {{ event.totalGuests }}
                    </text>
                    <text
                      x="60"
                      y="70"
                      text-anchor="middle"
                      class="donut-label"
                    >
                      Convidados
                    </text>
                  </svg>
                </div>

                <div class="distribution-legend">
                  <div
                    v-for="(type, index) in guestTypes"
                    :key="index"
                    class="legend-item"
                  >
                    <div
                      class="legend-color"
                      :style="{ backgroundColor: type.color }"
                    ></div>
                    <div class="legend-details">
                      <div class="legend-label">{{ type.name }}</div>
                      <div class="legend-value">
                        {{ type.count }} ({{ Math.round(type.percentage) }}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Promoter Performance -->
        <v-col cols="12" md="6" lg="4">
          <v-card flat border="thin" class="chart-card">
            <v-card-title class="chart-title">
              <div class="d-flex justify-space-between align-center w-100">
                <div class="text-subtitle-1 font-weight-bold">
                  Desempenho de Promotores
                </div>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  rounded
                  class="text-none px-2"
                  @click="showAllPromoters = !showAllPromoters"
                >
                  {{ showAllPromoters ? "Top 3" : "Ver todos" }}
                </v-btn>
              </div>
            </v-card-title>

            <v-card-text class="chart-content">
              <div class="promoter-list">
                <div
                  v-for="(promoter, index) in displayedPromoters"
                  :key="promoter.id"
                  class="promoter-item"
                  :class="{ 'top-promoter': index < 3 }"
                >
                  <div class="d-flex align-center">
                    <div
                      class="promoter-rank"
                      :class="{ 'top-rank': index < 3 }"
                    >
                      {{ index + 1 }}
                    </div>
                    <div class="promoter-avatar">
                      <v-avatar size="32" :color="getPromoterColor(index)">
                        <span class="text-white">{{
                          promoter.name.charAt(0)
                        }}</span>
                      </v-avatar>
                    </div>
                    <div class="promoter-details ml-2">
                      <div class="promoter-name">{{ promoter.name }}</div>
                      <div class="promoter-stats text-caption">
                        {{ promoter.guests }} convidados •
                        {{ formatCurrency(promoter.revenue) }}
                      </div>
                    </div>
                  </div>

                  <div class="promoter-progress">
                    <div
                      class="progress-bar"
                      :style="{
                        width: `${(promoter.guests / maxGuests) * 100}%`,
                        backgroundColor: getPromoterColor(index),
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- AI Insights -->
        <v-col cols="12" lg="4">
          <v-card flat border="thin" class="chart-card insight-card">
            <v-card-title class="chart-title">
              <div class="d-flex align-center">
                <v-icon
                  icon="mdi-lightbulb"
                  color="warning"
                  class="mr-2"
                ></v-icon>
                <div class="text-subtitle-1 font-weight-bold">
                  Insights Inteligentes
                </div>
              </div>
            </v-card-title>

            <v-card-text class="insights-content pa-0">
              <v-expansion-panels variant="accordion" class="insights-panels">
                <v-expansion-panel
                  v-for="(insight, index) in aiInsights"
                  :key="index"
                  class="insight-panel"
                >
                  <template v-slot:title>
                    <div class="d-flex align-center">
                      <v-icon
                        :icon="insight.icon"
                        :color="insight.color"
                        size="18"
                        class="mr-2"
                      ></v-icon>
                      <span class="text-body-2 font-weight-medium">{{
                        insight.title
                      }}</span>
                    </div>
                  </template>

                  <v-expansion-panel-text>
                    <p class="text-body-2 mb-3">{{ insight.description }}</p>
                    <v-btn
                      v-if="insight.action"
                      :color="insight.color"
                      variant="text"
                      size="small"
                      class="text-none mt-2"
                      density="compact"
                    >
                      {{ insight.action }}
                      <v-icon icon="mdi-arrow-right" size="16" end></v-icon>
                    </v-btn>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import FourStatCards from "@/management/components/events/FourStatCards.vue";
import HealthScore from "@/management/components/events/HealthScore.vue";

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["refresh"]);

// Component state
const loading = ref(true);
const eventHealthScore = ref(78);
const conversionRate = ref(65);
const averageTicket = ref(120);
const guestExpectation = ref(85);
const performanceScore = ref(72);
const showAllPromoters = ref(false);
const lastUpdateTime = ref("há 2 minutos");
const totalCheckIns = ref(42);
const expectedCheckIns = ref(250);
const totalRevenue = ref(15500);
const maxGuests = ref(150);

// Sparkline options
const sparklinePadding = ref(8);
const sparklineLineWidth = ref(2);
const sparklineSmooth = ref(true);
const sparklineGradient = ref(["red", "orange", "#FF0"]); // Gradient similar to the example

// KPI trends data
const kpiTrends = ref({
  conversion: { icon: "mdi-arrow-up", color: "success", value: 8 },
  ticket: { icon: "mdi-arrow-up", color: "success", value: 12 },
  expectation: { icon: "mdi-arrow-down", color: "error", value: 3 },
  performance: { icon: "mdi-arrow-up", color: "success", value: 5 },
});

// Check-in hourly data
const checkInData = ref([
  { time: "18h", value: 1, isPast: true, isCurrent: false },
  { time: "19h", value: 10, isPast: true, isCurrent: false },
  { time: "20h", value: 20, isPast: true, isCurrent: false },
  { time: "21h", value: 20, isPast: true, isCurrent: true },
  { time: "21:30h", value: 25, isPast: true, isCurrent: true },
  { time: "22h", value: 30, isPast: false, isCurrent: false },
  { time: "23h", value: 80, isPast: false, isCurrent: false },
  { time: "00h", value: 90, isPast: false, isCurrent: false },
  { time: "01h", value: 100, isPast: false, isCurrent: false },
]);

// Computed values for the sparkline
const checkInValues = computed(() => checkInData.value.map((h) => h.value));
const checkInLabels = computed(() => checkInData.value.map((h) => h.time));

// Compute max check-in value for chart scaling
const maxCheckInValue = computed(() => {
  return Math.max(...checkInData.value.map((h) => h.value), 20); // Minimum of 20 for scale
});

// Revenue by list data
const revenueData = ref([
  {
    name: "Lista VIP",
    value: 8200,
    checkIns: 20,
    color: "#1E88E5",
    icon: "mdi-star",
  },
  {
    name: "Pré-venda",
    value: 4300,
    checkIns: 12,
    color: "#43A047",
    icon: "mdi-ticket",
  },
  {
    name: "Promotor João",
    value: 1800,
    checkIns: 6,
    color: "#FB8C00",
    icon: "mdi-account",
  },
  {
    name: "Promotor Maria",
    value: 1200,
    checkIns: 4,
    color: "#8E24AA",
    icon: "mdi-account",
  },
]);

// Revenue progress status
const revenueProgress = computed(() => {
  const percentage = Math.round(
    (totalRevenue.value / props.event.revenuePrediction) * 100
  );

  if (percentage >= 100) {
    return { text: "Meta atingida!", color: "success" };
  } else if (percentage >= 75) {
    return { text: `${percentage}% da meta`, color: "info" };
  } else if (percentage >= 50) {
    return { text: `${percentage}% da meta`, color: "warning" };
  } else {
    return { text: `${percentage}% da meta`, color: "error" };
  }
});

// Guest distribution data
const guestTypes = ref([
  { name: "VIP", count: 80, percentage: 32, color: "#673AB7" },
  { name: "Pré-venda", count: 100, percentage: 40, color: "#2196F3" },
  { name: "Promotores", count: 50, percentage: 20, color: "#FF9800" },
  { name: "Outros", count: 20, percentage: 8, color: "#9E9E9E" },
]);

// Calculate SVG circle segments for the donut chart
const distributionSegments = computed(() => {
  let offset = -25; // Start at the top position
  const segments = [];

  guestTypes.value.forEach((type) => {
    segments.push({
      color: type.color,
      percentage: type.percentage,
      offset: offset,
    });
    offset -= (type.percentage * 3.14) / 100;
  });

  return segments;
});

// Promoter performance data
const promoters = ref([
  { id: 1, name: "Carlos", guests: 75, revenue: 4500 },
  { id: 2, name: "Aline", guests: 68, revenue: 4080 },
  { id: 3, name: "Rafael", guests: 50, revenue: 3000 },
  { id: 4, name: "Julia", guests: 32, revenue: 1920 },
  { id: 5, name: "Pedro", guests: 25, revenue: 1500 },
]);

// Filter promoters based on showAll toggle
const displayedPromoters = computed(() => {
  return showAllPromoters.value ? promoters.value : promoters.value.slice(0, 3);
});

// AI-powered insights
const aiInsights = ref([
  {
    title: "Horário de pico previsto às 22h",
    description:
      "Com base nos dados históricos, prevemos um pico de check-ins entre 22h e 23h. Recomendamos adicionar mais hostess para este período.",
    icon: "mdi-chart-bell-curve",
    color: "info",
    action: "Ajustar escalas",
  },
  {
    title: "Receita acima da expectativa (+15%)",
    description:
      "Seu evento está superando as expectativas de receita em 15%. Considere aumentar a oferta de produtos premium para maximizar o resultado.",
    icon: "mdi-cash-plus",
    color: "success",
    action: "Ver detalhes",
  },
  {
    title: "Lista VIP com poucos check-ins",
    description:
      "A taxa de conversão da lista VIP está em 35%, abaixo da média de 60%. Considere enviar um lembrete para os convidados.",
    icon: "mdi-alert",
    color: "warning",
    action: "Enviar lembrete",
  },
  {
    title: "Novo recorde de vendas antecipadas!",
    description:
      "Este evento bateu o recorde de vendas antecipadas dos últimos 6 meses. As vendas online cresceram 22% em comparação ao último evento.",
    icon: "mdi-trophy",
    color: "success",
    action: null,
  },
]);

// Update timer interval
let updateInterval = null;

// Helper methods
const getHealthScoreColor = () => {
  if (eventHealthScore.value >= 80) return "success";
  if (eventHealthScore.value >= 60) return "primary";
  if (eventHealthScore.value >= 40) return "warning";
  return "error";
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return "R$ 0";

  // Convert to number if it's not already
  const numValue = typeof value === "number" ? value : Number(value);

  // Handle invalid values
  if (isNaN(numValue)) return "R$ 0";

  // Format based on value range
  if (numValue >= 1000000) {
    return `R$ ${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `R$ ${(numValue / 1000).toFixed(1)}k`;
  } else {
    return `R$ ${numValue}`;
  }
};

const getPromoterColor = (index) => {
  const colors = ["#673AB7", "#2196F3", "#FF9800", "#4CAF50", "#9C27B0"];
  return colors[index % colors.length];
};

// For dynamic styling of sparkline bars based on current hour
const getSparklineItemColor = (index) => {
  const currentHourIndex = checkInData.value.findIndex((h) => h.isCurrent);
  if (index === currentHourIndex) {
    return "var(--v-primary-base)";
  }
  return index < currentHourIndex
    ? "var(--v-primary-lighten2)"
    : "var(--v-grey-lighten3)";
};

// Simulate real-time updates
const simulateNewActivity = () => {
  // Generate random check-in
  const names = ["Thiago", "Débora", "Lucas", "Camila", "Matheus", "Fernanda"];
  const lists = ["VIP", "Pré-venda", "Promotor"];
  const details = ["Pulseira ouro", "Pulseira prata", "Pulseira preta"];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomList = lists[Math.floor(Math.random() * lists.length)];
  const randomDetail = details[Math.floor(Math.random() * details.length)];

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  // Update check-in count
  totalCheckIns.value++;

  // Update the current hour check-ins
  const currentHourIndex = checkInData.value.findIndex((h) => h.isCurrent);
  if (currentHourIndex >= 0) {
    checkInData.value[currentHourIndex].value++;
  }

  // Update last update time
  lastUpdateTime.value = "agora mesmo";
};

// Initialize dashboard
onMounted(() => {
  // Simulate loading time
  setTimeout(() => {
    loading.value = false;

    // Set up auto-refresh for live data
    updateInterval = setInterval(() => {
      // Only simulate new activities occasionally
      if (Math.random() > 0.7) {
        simulateNewActivity();
      }

      // Update the "last updated" text
      if (lastUpdateTime.value === "agora mesmo") {
        lastUpdateTime.value = "há 1 minuto";
      }
    }, 10000); // Update every 10 seconds
  }, 1000);
});

// Clean up interval on unmount
onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

const dashboardKpiCards = computed(() => [
  {
    title: "Taxa de Conversão",
    value: conversionRate.value + "%",
    icon: "mdi-ticket-confirmation",
    iconColor: "primary",
    accentColor: "#e53935",
    trend: { icon: kpiTrends.value.conversion.icon, color: kpiTrends.value.conversion.color, value: kpiTrends.value.conversion.value }
  },
  {
    title: "Ticket Médio",
    value: "R$ " + averageTicket.value,
    icon: "mdi-cash-multiple",
    iconColor: "success",
    accentColor: "#388e3c",
    trend: { icon: kpiTrends.value.ticket.icon, color: kpiTrends.value.ticket.color, value: kpiTrends.value.ticket.value }
  },
  {
    title: "Expectativa",
    value: guestExpectation.value + "%",
    icon: "mdi-account-group",
    iconColor: "info",
    accentColor: "#0288d1",
    trend: { icon: kpiTrends.value.expectation.icon, color: kpiTrends.value.expectation.color, value: kpiTrends.value.expectation.value }
  },
  {
    title: "Desempenho",
    value: performanceScore.value + "%",
    icon: "mdi-star",
    iconColor: "warning",
    accentColor: "#fbc02d",
    trend: { icon: kpiTrends.value.performance.icon, color: kpiTrends.value.performance.color, value: kpiTrends.value.performance.value }
  }
]);
</script>

<style scoped>
.event-dashboard {
  padding-bottom: 16px;
}

/* Loading animation */
.loading-container {
  min-height: 300px;
}

/* Health Score styles */
.health-score-container {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.health-score-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.health-score-wrapper {
  padding: 8px 0;
}

.health-score-progress {
  position: relative;
  height: 10px;
  margin: 24px 0;
}

.score-segments {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.score-segment {
  flex: 1;
  height: 100%;
}

.score-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.score-progress-fill {
  height: 100%;
  background-color: rgb(var(--v-primary-base));
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.score-progress-fill.success {
  background-color: rgb(var(--v-success-base));
}

.score-progress-fill.primary {
  background-color: rgb(var(--v-primary-base));
}

.score-progress-fill.warning {
  background-color: rgb(var(--v-warning-base));
}

.score-progress-fill.error {
  background-color: rgb(var(--v-error-base));
}

.score-indicator {
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 5;
}

.score-indicator-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  border: 3px solid rgb(var(--v-primary-base));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
}

.score-indicator-dot.success {
  border-color: rgb(var(--v-success-base));
}

.score-indicator-dot.warning {
  border-color: rgb(var(--v-warning-base));
}

.score-indicator-dot.error {
  border-color: rgb(var(--v-error-base));
}

.score-indicator-label {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(var(--v-primary-base));
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.score-indicator-label.success {
  background-color: rgb(var(--v-success-base));
}

.score-indicator-label.warning {
  background-color: rgb(var(--v-warning-base));
}

.score-indicator-label.error {
  background-color: rgb(var(--v-error-base));
}

.danger {
  background-color: rgb(var(--v-error-lighten3));
}

.warning {
  background-color: rgb(var(--v-warning-lighten3));
}

.good {
  background-color: rgb(var(--v-info-lighten3));
}

.excellent {
  background-color: rgb(var(--v-success-lighten3));
}

.score-legend {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 4px;
}

.legend-text {
  font-size: 11px;
  color: rgb(var(--v-grey-darken1));
}

/* KPI Card styles */
.kpi-card {
  position: relative;
  border-radius: 12px;
  height: 100%;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kpi-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.kpi-accent--checkin {
  background-color: rgb(var(--v-primary-base));
}

.kpi-accent--revenue {
  background-color: rgb(var(--v-success-base));
}

.kpi-accent--retention {
  background-color: rgb(var(--v-info-base));
}

.kpi-accent--promoter {
  background-color: rgb(var(--v-purple-base));
}

.kpi-title {
  font-size: 12px;
  font-weight: 500;
  color: rgb(var(--v-grey-darken1));
}

.kpi-value {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.kpi-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.trend-text {
  margin-left: 4px;
  font-weight: 600;
}

/* Chart Card styles */
.chart-card {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow: hidden;
}

.chart-title {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.chart-content {
  padding: 16px;
}

/* Sparkline container */
.sparkline-container {
  height: 150px;
  position: relative;
}

/* Revenue Chart */
.revenue-chart-container {
  padding: 8px 0;
}

.list-revenue-item {
  margin-bottom: 16px;
}

.list-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.revenue-bar-container {
  height: 6px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.revenue-bar {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Distribution Chart */
.distribution-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.donut-chart-container {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.donut-chart {
  width: 100%;
  height: 100%;
}

.donut-segment {
  transition: stroke-dasharray 0.5s ease;
}

.donut-number {
  font-size: 16px;
  fill: rgb(var(--v-grey-darken3));
}

.donut-label {
  font-size: 10px;
  fill: rgb(var(--v-grey-darken1));
}

.distribution-legend {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 12px;
}

/* Promoter List */
.promoter-list {
  max-height: 300px;
  overflow-y: auto;
}

.promoter-item {
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.promoter-item:last-child {
  border-bottom: none;
}

.top-promoter {
  background-color: rgba(var(--v-primary-base), 0.05);
  border-radius: 8px;
  padding: 12px 8px;
  margin-bottom: 8px;
}

.promoter-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgb(var(--v-grey-lighten3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
}

.top-rank {
  background-color: rgb(var(--v-warning-base));
  color: white;
}

.promoter-name {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 2px;
}

.promoter-stats {
  color: rgb(var(--v-grey-darken1));
}

.promoter-progress {
  height: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* AI Insights */
.insight-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.insights-content {
  flex: 1;
  overflow: hidden;
}

.insights-panels {
  background-color: transparent;
  box-shadow: none;
}

.insight-panel {
  margin-bottom: 2px;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .health-score-container {
    padding: 12px;
  }

  .chart-title {
    padding: 12px;
  }

  .chart-content {
    padding: 12px;
  }

  .score-legend {
    flex-wrap: wrap;
  }

  .legend-item {
    width: 50%;
    margin-bottom: 4px;
  }

  .kpi-value {
    font-size: 16px;
  }

  .kpi-title {
    font-size: 11px;
  }

  .sparkline-container {
    height: 120px;
  }

  .distribution-chart {
    flex-direction: column;
  }

  .donut-chart-container {
    margin-bottom: 16px;
  }

  .distribution-legend {
    width: 100%;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .distribution-chart {
    flex-direction: column;
  }
}
</style>
