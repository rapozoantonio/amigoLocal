<template>
  <v-expansion-panels v-model="panelOpen">
    <v-expansion-panel title="Main Metrics">
      <v-expansion-panel-text>
        <v-row class="metrics-row" align="stretch">
          <metric-card v-for="metric in metrics" :key="metric.title" v-bind="metric">
          </metric-card>





        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script setup>
import { toRefs } from "vue";
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import MetricCard from "./MetricCard.vue";

// Props
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  guests: {
    type: Array,
    required: true,
  },
  promoters: {
    type: Array,
    required: true,
  },
  hostesses: {
    type: Array,
    required: true,
  },
  lists: {
    type: Array,
    required: true,
  },
});

const { lists, promoters, hostesses, guests, event } = toRefs(props);


const checkInCount = computed(() => {
  return guests.value.filter(g => g.status === 'checked-in').length
})
const guestCount = computed(() => {
  return guests.value.length
})

const promoterCount = computed(() => {
  return promoters.value.length
})

const listCount = computed(() => {
  return lists.value.length
})

const revenue = computed(() => {
  return guests.value.reduce((total, guest) => {
    if (guest.status === "checked-in") {
      total = total + (guest.price ? guest.price : 0);
    }
    return total
  }, 0)
})

const revenuePrediction = computed(() => {

  const listPriceObj = lists.value.reduce((obj, list) => {
    obj[list.id] = list.price;
    return obj;
  }, {})
  return guests.value.reduce((total, guest) => {
    total = total + listPriceObj[guest.list.id];
    return total
  }, 0)
})


const metrics = computed(() => {
  return [
    {
      title: "Check-ins",
      icon: "mdi-account-check",
      metric: checkInCount.value,
      total: guestCount.value,
      color: "blue-grey",
      progress: Math.min(100, (checkInCount.value / Math.max(1, guestCount.value)) * 100),
      subtitle: Math.round((guests.value.filter(g => g.status === 'checked-in').length / Math.max(1, guestCount.value)) *
        100
      ) + "% de presença"
    },
    {
      title: "Listas",
      icon: "mdi-format-list-checks",
      metric: listCount.value,
      color: "blue-grey",
      subtitle: (guestCount.value > 0
        ? Math.round(
          (guestCount.value / listCount.value)
        )
        : 0) + " convidados/lista"
    },
    {
      title: "Promotores",
      icon: "mdi-account-tie",
      metric: promoterCount.value,
      color: "blue-grey",
      subtitle: promoterEfficiency.value + "/promoter"
    },
    {
      title: "Receita",
      icon: "mdi-cash",
      metric: formatCurrency(revenue.value),
      color: "blue-grey",
      progress: Math.round(
        (revenue.value / revenuePrediction.value) * 100
      ),
      subtitle: revenuePrediction.value
        ? `${Math.round(
          (revenue.value / revenuePrediction.value) * 100
        )}% da meta`
        : "Sem meta definida"
    },
  ]
})


// Display for mobile detection
const { xs } = useDisplay();
const panelOpen = ref(!xs.value ? 0 : null); // Open by default on non-mobile (0 = first panel open), closed on mobile (null)

// Static list distribution
const listDistribution = [
  { percentage: 40, color: "var(--v-primary-base)" },
  { percentage: 25, color: "var(--v-primary-lighten1)" },
  { percentage: 20, color: "var(--v-secondary-base)" },
  { percentage: 15, color: "var(--v-grey-lighten1)" },
];

// TrendIndicator component
const TrendIndicator = {
  props: {
    value: { type: Number, required: true },
    thresholds: {
      type: Object,
      default: () => ({ positive: 0.05, warning: -0.05, negative: -0.1 }),
    },
  },
  setup(props) {
    const getIcon = computed(() => {
      if (props.value >= props.thresholds.positive) return "mdi-trending-up";
      if (props.value <= props.thresholds.negative) return "mdi-trending-down";
      return "mdi-trending-neutral";
    });
    const getColor = computed(() => {
      if (props.value >= props.thresholds.positive) return "success";
      if (props.value <= props.thresholds.negative) return "error";
      if (props.value <= props.thresholds.warning) return "warning";
      return "success";
    });
    return { getIcon, getColor };
  },
  template: `<v-icon :icon="getIcon" :color="getColor" size="14"></v-icon>`,
};

// Computed properties
const checkInTrend = computed(() => {
  const history = props.event.checkInHistory;
  if (!history || history.length < 2) return 0;
  const last = history[history.length - 1];
  const secondLast = history[history.length - 2];
  return (last - secondLast) / secondLast;
});

const promoterEfficiency = computed(() => {
  if (!promoters.value || promoters.value.length === 0)
    return "0 convidados";
  const guestsPerPromoter = Math.round(
    guests.value.length / promoters.value.length
  );
  return `${guestsPerPromoter} convidados`;
});

// Methods
const formatCurrency = (value) => {
  if (!value && value !== 0) return "R$ 0";
  const numValue = typeof value === "number" ? value : Number(value);
  if (isNaN(numValue)) return "R$ 0";
  if (numValue >= 1000000) return `R$ ${(numValue / 1000000).toFixed(1)}M`;
  else if (numValue >= 1000) return `R$ ${(numValue / 1000).toFixed(1)}k`;
  else return `R$ ${numValue}`;
};

const getRevenueProgressClass = (percentage) => {
  if (percentage >= 1) return "revenue-progress-high";
  if (percentage >= 0.7) return "revenue-progress-medium";
  return "revenue-progress-low";
};
</script>