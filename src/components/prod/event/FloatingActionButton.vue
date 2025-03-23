<template>
  <div class="floating-action-button">
    <v-tooltip
      :text="tooltip"
      location="top"
      v-if="tooltip"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="fab-button"
          :icon="icon"
          size="large"
          color="primary"
          elevation="5"
          @click="$emit('click')"
        ></v-btn>
      </template>
    </v-tooltip>
    
    <v-btn
      v-else
      class="fab-button"
      :icon="icon"
      size="large"
      color="primary"
      elevation="5"
      @click="$emit('click')"
    ></v-btn>
  </div>
</template>

<script setup>
// Component props
const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-plus'
  },
  tooltip: {
    type: String,
    default: ''
  }
});

// Component emits
defineEmits(['click']);
</script>

<style scoped>
.floating-action-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99;
}

.fab-button {
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fab-button:hover {
  transform: scale(1.05);
}

/* Handle safe areas for mobile devices */
@supports (padding: max(0px)) {
  .floating-action-button {
    bottom: max(24px, env(safe-area-inset-bottom));
    right: max(24px, env(safe-area-inset-right));
  }
}
</style>