<template>
  <v-card class="event-card" :class="{ 'event-card--past': isPastEvent }" variant="tonal" color="grey-darken-2"
    border="md" elevation="2" :ripple="true">
    <!-- Use flex layout with row direction by default for desktop -->

    <v-row>
      <v-col cols="12" md="4" lg="3">
        <v-img
          :src="event.image?.url || 'https://formbuilder.ccavenue.com/live/uploads/company_image/488/17316704336156_Event-Image-Not-Found.jpg'"
          :to="{ name: 'event-id', params: { eventId: event.id } }" cover class="event-thumbnail" height="100%">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
          </template>

          <v-chip color="success" label class="mt-2 ml-2" variant="flat">
            {{ statusText }}
          </v-chip>
        </v-img>
      </v-col>
      <v-col>
        <div class="event-details pa-4 d-flex flex-column justify-space-between">
          <div>
            <div class="d-flex justify-space-between align-start">
              <div class="event-header">

                <router-link :to="{ name: 'event-id', params: { eventId: event.id } }"
                  class="text-h6 font-weight-bold text-truncate mb-1 text-decoration-none text-white">{{ event.name
                  }}</router-link>
                <div class="d-flex align-center text-body-2 text-grey-darken-1 mb-2">
                  <v-icon size="small" icon="mdi-calendar" class="mr-1"></v-icon>
                  <span>{{ formatDate(event.startDate) }}</span>
                  <span class="mx-2">•</span>
                  <v-icon size="small" icon="mdi-clock" class="mr-1"></v-icon>
                  <span>{{ formatTime(event.startDate) }}</span>
                  <!-- <span>{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}</span> -->

                </div>
                <div class="d-flex align-center text-body-2 text-grey-darken-1 mb-3">
                  <v-icon size="small" icon="mdi-map-marker" class="mr-1"></v-icon>
                  <span class="text-truncate">{{ event.location }}</span>
                </div>
              </div>

              <v-menu location="bottom end" :close-on-content-click="true">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" variant="text" size="small" color="grey" class="ml-2 menu-button"
                    v-bind="props" @click.stop></v-btn>
                </template>
                <v-card variant="tonal">
                  <v-list density="compact">
                    <v-list-item @click="$emit('edit', event)">
                      <template v-slot:prepend>
                        <v-icon size="small" icon="mdi-pencil"></v-icon>
                      </template>
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$emit('refresh', event)">
                      <template v-slot:prepend>
                        <v-icon size="small" icon="mdi-refresh"></v-icon>
                      </template>
                      <v-list-item-title>Atualizar metricas</v-list-item-title>
                    </v-list-item>
                    <v-list-item disabled @click="$emit('duplicate', event)">
                      <template v-slot:prepend>
                        <v-icon size="small" icon="mdi-content-copy"></v-icon>
                      </template>
                      <v-list-item-title>Duplicar</v-list-item-title>
                    </v-list-item>
                    <v-list-item base-color="error" @click="$emit('delete', event)">
                      <template v-slot:prepend>
                        <v-icon size="small" icon="mdi-delete"></v-icon>
                      </template>
                      <v-list-item-title>Excluir</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>

              </v-menu>
            </div>

            <v-divider class="mb-3"></v-divider>
          </div>

          <v-row no-gutters="">
            <v-col cols="auto" class="mx-2">
              <div class="text-grey text-caption">Check-ins</div>
              <div class="ml-2">
                <span class="text-body-1">{{ event.totalCheckIn }}</span>
                <span class="text-caption text-grey ml-1">/ {{ event.totalGuests }}</span>
              </div>
            </v-col>
            <v-divider vertical class="mx-3 my-0 stat-divider"></v-divider>
            <v-col cols="auto" class="mx-2">
              <div class="text-grey text-caption">Listas</div>
              <div class="text-body-1 font-weight-medium">{{ event.lists?.length || 0 }}</div>
            </v-col>
            <v-divider vertical class="mx-3 my-0 stat-divider"></v-divider>
            <v-col cols="auto" class="mx-2">
              <div class="text-grey text-caption">Promotores</div>
              <div class="text-body-1 font-weight-medium">{{ event.promoters?.length || 0 }}</div>
            </v-col>
            <v-divider vertical class="mx-3 my-0 stat-divider"></v-divider>
            <v-col cols="auto" class="mx-2">
              <div class="text-grey text-caption">Receita</div>
              <div class="d-flex align-center">
                <span class="text-body-1 font-weight-medium">{{ formatCurrency(event.revenue) }}</span>
                <v-tooltip v-if="isPastEvent && event.status !== 'cancelled'" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" size="x-small" :color="revenueIndicatorColor" :icon="revenueIndicatorIcon"
                      class="ml-1">
                    </v-icon>
                  </template>
                  <span>{{ revenuePerformanceText }}</span>
                </v-tooltip>
              </div>
            </v-col>

          </v-row>
          <!-- <v-divider class="my-3 my-0 stat-divider"></v-divider> -->

        </div>
      </v-col>
    </v-row>

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
defineEmits(['edit', 'duplicate', 'delete', 'click', 'refresh']);

// Computed properties
const isPastEvent = computed(() => {
  return props.event.status === 'completed';
});

const statusText = computed(() => {
  switch (props.event.status) {
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