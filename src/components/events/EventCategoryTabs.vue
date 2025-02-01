<template>
  <v-tabs
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    color="primary"
    density="compact"
    slider-color="primary"
  >
    <v-tab
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :to="useRouting ? tab.to : undefined"
      class="text-subtitle-2 px-0 mr-4 w-min-0"
      exact
      variant="plain"
      slim
    >
      {{ tab.label }}
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  useRouting: {
    type: Boolean,
    default: false,
  },
  cols: {
    type: [String, Number],
    default: undefined,
  },
  rowClass: {
    type: String,
    default: "",
  },
  // Custom tabs configuration
  customTabs: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["update:modelValue"]);

const route = useRoute();

const defaultTabs = computed(() => [
  {
    value: "all",
    label: "All",
    to: { name: "events", query: route.query },
  },
  {
    value: "carnaval",
    label: "Carnaval",
    to: { name: "events-carnaval", query: route.query },
  },
  {
    value: "reveillon",
    label: "Reveillon",
    to: { name: "events-reveillon", query: route.query },
  },
]);

const localTabs = computed(() => [
  {
    value: "proximos",
    label: "Próximos eventos",
  },
  {
    value: "carnaval",
    label: "Carnaval",
  },
  {
    value: "reveillon",
    label: "Reveillon",
  },
]);

const tabs = computed(() => {
  if (props.customTabs.length > 0) {
    return props.customTabs;
  }
  return props.useRouting ? defaultTabs.value : localTabs.value;
});
</script>
