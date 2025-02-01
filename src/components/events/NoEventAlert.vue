<template>
    <v-container>
      <v-alert
        :icon="alertConfig.icon"
        :color="alertConfig.color"
        :variant="alertConfig.variant"
      >
        {{ alertConfig.message }}
      </v-alert>
    </v-container>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'error', 'search', 'empty'].includes(value)
    }
  });
  
  const alertConfig = computed(() => {
    switch (props.type) {
      case 'error':
        return {
          icon: 'mdi-alert',
          color: 'error',
          variant: 'outlined',
          message: 'Erro ao carregar eventos'
        };
      case 'search':
        return {
          icon: 'mdi-magnify-remove',
          color: 'info',
          variant: 'tonal',
          message: 'Nenhum evento encontrado com os filtros selecionados'
        };
      case 'empty':
        return {
          icon: 'mdi-calendar-remove',
          color: 'warning',
          variant: 'outlined',
          message: 'Nenhum evento disponível'
        };
      default:
        return {
          icon: 'mdi-calendar-remove-outline',
          color: 'warning',
          variant: 'tonal',
          message: 'Não ha eventos'
        };
    }
  });
  </script>