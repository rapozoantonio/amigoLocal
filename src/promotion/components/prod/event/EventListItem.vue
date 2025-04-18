<template>
  <v-card
    class="event-card"
    :class="{ 'event-card--past': isPastEvent }"
    variant="elevated"
    elevation="2"
    :ripple="true"
  >
    <!-- Use flex layout with row direction by default for desktop -->
    <div class="d-flex flex-column flex-md-row">
      <!-- Event thumbnail with status indicator -->
      <div class="event-thumbnail-container">
        <v-img
          :src="event.thumbnail"
          lazy-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3C/svg%3E"
          height="100%"
          cover
          class="event-thumbnail"
          :aspect-ratio="16/9"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey-lighten-3"></v-progress-circular>
            </v-row>
          </template>
          
          <div class="status-chip" :class="`status-chip--${event.status}`">
            {{ statusText }}
          </div>
        </v-img>
      </div>

      <!-- Event details -->
      <div class="event-details pa-4 d-flex flex-column justify-space-between">
        <div>
          <div class="d-flex justify-space-between align-start">
            <div class="event-header">
              <h3 class="text-h6 font-weight-bold text-truncate mb-1">{{ event.name }}</h3>
              <div class="d-flex align-center text-body-2 text-grey-darken-1 mb-2">
                <v-icon size="small" icon="mdi-calendar" class="mr-1"></v-icon>
                <span>{{ formatDate(event.date) }}</span>
                <span class="mx-2">•</span>
                <v-icon size="small" icon="mdi-clock" class="mr-1"></v-icon>
                <span>{{ formatTime(event.date) }}</span>
              </div>
              <div class="d-flex align-center text-body-2 text-grey-darken-1 mb-3">
                <v-icon size="small" icon="mdi-map-marker" class="mr-1"></v-icon>
                <span class="text-truncate">{{ event.location }}</span>
              </div>
            </div>
            
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  color="grey"
                  class="ml-2 menu-button"
                  @click.stop
                ></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click.stop="$emit('edit', event.id)">
                  <template v-slot:prepend>
                    <v-icon size="small" icon="mdi-pencil"></v-icon>
                  </template>
                  <v-list-item-title>Editar</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="$emit('duplicate', event)">
                  <template v-slot:prepend>
                    <v-icon size="small" icon="mdi-content-copy"></v-icon>
                  </template>
                  <v-list-item-title>Duplicar</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="$emit('delete', event.id)">
                  <template v-slot:prepend>
                    <v-icon size="small" icon="mdi-delete"></v-icon>
                  </template>
                  <v-list-item-title class="text-error">Excluir</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-divider class="my-3"></v-divider>
        </div>

        <!-- Event stats -->
        <div class="event-stats">
          <div class="stat-item">
            <div class="text-grey text-caption">Check-ins</div>
            <div class="d-flex align-center">
              <span class="text-body-1 font-weight-medium">{{ event.checkInCount }}</span>
              <span class="text-caption text-grey ml-1">/ {{ event.totalGuests }}</span>
            </div>
          </div>
          
          <v-divider vertical class="mx-3 my-0 stat-divider"></v-divider>
          
          <div class="stat-item">
            <div class="text-grey text-caption">Listas</div>
            <div class="text-body-1 font-weight-medium">{{ event.vipListsCount }}</div>
          </div>
          
          <v-divider vertical class="mx-3 my-0 stat-divider"></v-divider>
          
          <div class="stat-item">
            <div class="text-grey text-caption">Promotores</div>
            <div class="text-body-1 font-weight-medium">{{ event.promotersCount }}</div>
          </div>
          
          <v-divider vertical class="mx-3 my-0 stat-divider"></v-divider>
          
          <div class="stat-item revenue-stat">
            <div class="text-grey text-caption">Receita</div>
            <div class="d-flex align-center">
              <span class="text-body-1 font-weight-medium">{{ formatCurrency(event.revenue) }}</span>
              <v-tooltip v-if="isPastEvent && event.status !== 'cancelled'" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon 
                    v-bind="props" 
                    size="x-small" 
                    :color="revenueIndicatorColor" 
                    :icon="revenueIndicatorIcon" 
                    class="ml-1">
                  </v-icon>
                </template>
                <span>{{ revenuePerformanceText }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

// Component props
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});

// Get display breakpoints
const { xs, sm, md } = useDisplay();

// Component emits
defineEmits(['edit', 'duplicate', 'delete', 'click']);

// Computed properties
const isPastEvent = computed(() => {
  return props.event.status === 'completed';
});

const statusText = computed(() => {
  switch(props.event.status) {
    case 'upcoming':
      return 'Em breve';
    case 'completed':
      return 'Realizado';
    case 'live':
      return 'Ao vivo';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Em breve';
  }
});

// Revenue indicator computed properties
const revenueIndicatorColor = computed(() => {
  if (!props.event.revenuePrediction) return 'grey';
  
  const ratio = props.event.revenue / props.event.revenuePrediction;
  if (ratio >= 1) return 'success';
  if (ratio >= 0.8) return 'warning';
  return 'error';
});

const revenueIndicatorIcon = computed(() => {
  if (!props.event.revenuePrediction) return '';
  
  const ratio = props.event.revenue / props.event.revenuePrediction;
  if (ratio >= 1) return 'mdi-arrow-up';
  if (ratio >= 0.8) return 'mdi-arrow-right';
  return 'mdi-arrow-down';
});

const revenuePerformanceText = computed(() => {
  if (!props.event.revenuePrediction) return 'Sem previsão de receita';
  
  const ratio = props.event.revenue / props.event.revenuePrediction;
  const percentage = Math.round((ratio - 1) * 100);
  
  if (ratio >= 1) return `${percentage}% acima da previsão`;
  if (ratio >= 0.8) return `${Math.round((1 - ratio) * 100)}% abaixo da previsão`;
  return `${Math.round((1 - ratio) * 100)}% abaixo da previsão`;
});

// Helper functions for formatting date and time
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format currency in compact format
const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0';
  
  // Convert to number if it's not already
  const numValue = typeof value === 'number' ? value : Number(value);
  
  // Handle invalid values
  if (isNaN(numValue)) return 'R$ 0';
  
  // Format based on value range
  if (numValue >= 1000000) {
    return `R$ ${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `R$ ${(numValue / 1000).toFixed(1)}k`;
  } else {
    return `R$ ${numValue}`;
  }
};
</script>

<style scoped>
.event-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  margin-bottom: 16px;
  width: 100%;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.event-card--past {
  opacity: 0.8;
}

.event-thumbnail-container {
  position: relative;
  height: 200px;
  width: 100%;
}

.event-details {
  flex: 1;
  position: relative;
}

.event-header {
  max-width: calc(100% - 48px); /* Allow space for the menu button */
}

.status-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
}

.status-chip--upcoming {
  background-color: rgba(25, 118, 210, 0.85);
}

.status-chip--completed {
  background-color: rgba(76, 175, 80, 0.85);
}

.status-chip--live {
  background-color: rgba(244, 67, 54, 0.85);
}

.status-chip--cancelled {
  background-color: rgba(97, 97, 97, 0.85);
}

.event-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.stat-item {
  padding: 0 0.5rem;
  flex-shrink: 0;
}

.revenue-stat {
  color: var(--v-theme-primary);
}

.menu-button {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* Media queries for responsive design */
@media (min-width: 960px) {
  .event-thumbnail-container {
    width: 300px;
    min-width: 300px;
    height: auto;
    max-height: 200px;
  }
  
  .event-card {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .event-thumbnail {
    height: 100%;
    object-fit: cover;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .event-thumbnail-container {
    width: 240px;
    min-width: 240px;
    height: auto;
  }
}

@media (max-width: 599px) {
  .event-thumbnail-container {
    height: 180px;
  }
  
  .event-stats {
    justify-content: space-between;
  }
  
  .stat-divider {
    display: none;
  }
  
  .stat-item {
    flex: 1;
    text-align: center;
    padding: 0;
  }
}
</style>