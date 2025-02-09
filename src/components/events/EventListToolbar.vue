<template>
  <div class="bg-black">
    <v-container>
      <v-row align="center">
        <v-col cols="auto">
          <event-category-tabs 
            v-if="!showJustCountry" 
            use-routing 
          />
          <event-category-tabs 
            v-else 
            showJustCountry 
          />
        </v-col>
        <v-spacer></v-spacer>
        <v-col :cols="showAllFilters ? 'auto' : '12'" class="text-center">
          <div :class="filterContainerClasses">
            <event-list-date-selector 
              :class="{'mr-2': showAllFilters}" 
            />
            <template v-if="showAllFilters">
              <event-list-genre-selector class="mr-2" />
              <event-list-type-of-event-selector />
            </template>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { computed } from "vue";
import EventCategoryTabs from "./EventCategoryTabs.vue";
import EventListGenreSelector from "./EventListGenreSelector.vue";
import EventListDateSelector from "./EventListDateSelector.vue";
import EventListTypeOfEventSelector from "./EventListTypeOfEventSelector.vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

const props = defineProps({
  showJustCountry: {
    type: Boolean,
    default: false,
  },
  routePath: {
    type: String,
    default: null,
  },
});

const { name, mdAndDown, lgAndDown } = useDisplay();

const showAllFilters = computed(() => {
  const path = props.routePath?.toLowerCase();
  return !path?.includes("carnaval") && !path?.includes("reveillon");
});

const filterContainerClasses = computed(() => ({
  'd-flex': true,
  'justify-center': showAllFilters,
  'justify-end': !showAllFilters && !mdAndDown,
  'justify-center': !showAllFilters && mdAndDown,
}));
</script>