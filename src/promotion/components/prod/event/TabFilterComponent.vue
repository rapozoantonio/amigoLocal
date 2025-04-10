<template>
  <div class="filter-container py-2 px-3">
    <v-row class="ma-0">
      <!-- Search Field: full width on mobile, wider on larger screens -->
      <v-col cols="12" sm="8" md="9" class="pa-2">
        <v-text-field
          v-model="searchModel"
          density="compact"
          variant="outlined"
          hide-details
          :placeholder="searchPlaceholder"
          prepend-inner-icon="mdi-magnify"
          class="search-field"
          single-line
          @update:model-value="emitFilterChange"
        ></v-text-field>
      </v-col>

      <!-- Filters Section: full width on mobile, side by side on larger screens -->
      <v-col cols="12" sm="4" md="3" class="pa-2">
        <div class="d-flex align-center flex-wrap">
          <!-- Primary Filter (always visible) -->
          <v-select
            v-if="primaryFilter"
            v-model="primaryFilterModel"
            :items="primaryFilter.options"
            variant="outlined"
            density="compact"
            hide-details
            :label="primaryFilter.label"
            class="mb-2 me-2 primary-filter"
            @update:model-value="emitFilterChange"
          ></v-select>

          <!-- Additional Filter(s) -->
          <template v-if="filterOptions.length > 1">
            <!-- If exactly 2 filters and on larger screens, show inline -->
            <v-select
              v-if="filterOptions.length === 2 && isDesktop"
              v-model="filterModels[1]"
              :items="filterOptions[1].options"
              variant="outlined"
              density="compact"
              hide-details
              :label="filterOptions[1].label"
              class="mb-2 secondary-filter"
              @update:model-value="emitFilterChange"
            ></v-select>

            <!-- Otherwise, use a menu for additional filters -->
            <v-menu v-else>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="outlined"
                  density="compact"
                  class="filter-btn mb-2"
                >
                  <v-icon size="small" start>mdi-filter-variant</v-icon>
                  Filtros
                </v-btn>
              </template>
              <v-card min-width="300" class="filter-menu pa-2">
                <v-card-text>
                  <div class="text-subtitle-2 mb-2">Filtrar por</div>
                  <template
                    v-for="(filter, index) in additionalFilters"
                    :key="index"
                  >
                    <v-select
                      v-model="filterModels[filter.modelIndex]"
                      :items="filter.options"
                      :label="filter.label"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="mb-2"
                      @update:model-value="emitFilterChange"
                    ></v-select>
                  </template>
                  <div class="d-flex justify-end mt-2">
                    <v-btn
                      variant="text"
                      size="small"
                      color="primary"
                      @click="resetFilters"
                    >
                      Limpar filtros
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Props definition
const props = defineProps({
  searchPlaceholder: {
    type: String,
    default: "Buscar...",
  },
  searchValue: {
    type: String,
    default: "",
  },
  filterOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["filter-change", "reset"]);

// Reactive values for search and filters
const searchModel = ref(props.searchValue);
const filterModels = ref(
  props.filterOptions.map((filter) => filter.modelValue || null)
);

// Computed property for the primary filter (first filter)
const primaryFilter = computed(() =>
  props.filterOptions.length > 0 ? props.filterOptions[0] : null
);

const primaryFilterModel = computed({
  get: () => filterModels.value[0],
  set: (val) => {
    filterModels.value[0] = val;
  },
});

// Responsive breakpoint: simple check for desktop (md and up)
const isDesktop = computed(() => window.innerWidth >= 960);

// Additional filters: if more than one filter exists
const additionalFilters = computed(() => {
  if (props.filterOptions.length <= 1) return [];
  // If exactly 2 filters and on desktop, show the second inline.
  // Otherwise, show all additional filters in the menu.
  const startIndex =
    props.filterOptions.length === 2 && isDesktop.value ? 2 : 1;
  return props.filterOptions.slice(startIndex).map((filter, idx) => ({
    ...filter,
    modelIndex: idx + startIndex,
  }));
});

// Emit change method: send search value and current filter values
const emitFilterChange = () => {
  emit("filter-change", {
    search: searchModel.value,
    filters: props.filterOptions.map((filter, index) => ({
      id: filter.label.toLowerCase(),
      value: filterModels.value[index],
    })),
  });
};

// Reset filters method
const resetFilters = () => {
  searchModel.value = "";
  filterModels.value = props.filterOptions.map(
    (filter) => filter.modelValue || null
  );
  emit("reset");
  emitFilterChange();
};

// Watch for prop changes and update reactive models accordingly
watch(
  () => props.searchValue,
  (newVal) => {
    searchModel.value = newVal;
  }
);

watch(
  () => props.filterOptions,
  (newVal) => {
    filterModels.value = newVal.map((filter) => filter.modelValue || null);
  },
  { deep: true }
);
</script>

<style scoped>
.filter-container {
  border-radius: 8px;
}

/* Ensure proper spacing on mobile */
@media (max-width: 600px) {
  .filter-container .v-col {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .search-field {
    /* Full width on mobile */
    width: 100%;
  }
}
</style>
