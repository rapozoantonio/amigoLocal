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
      :to="tab.to"
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
  showJustCountry: {
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
    value: "nextevents",
    label: "Todos",
    to: { name: "events", query: route.query },
  },
  {
    value: "foryou",
    label: "Pra Você",
    to: { name: "events-foryou", query: route.query },
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

const localTabs = [
  { value: "nextevents", label: "Todos", to: "/eventsAll/BR" },
  { value: "foryou", label: "Pra Você", to: "/eventsAll/BR/foryou" },
  {
    value: "carnaval",
    label: "Carnaval",
    to: "/eventsAll/BR/carnaval",
  },
  { value: "reveillon", label: "Reveillon", to: "/eventsAll/BR/reveillon" },
];

const tabs = computed(() => {
  console.log({ showJustCountry: props.showJustCountry });
  if (!props.showJustCountry) {
    return props.useRouting ? defaultTabs.value : localTabs;
  } else {
    return localTabs;
  }
});
</script>
