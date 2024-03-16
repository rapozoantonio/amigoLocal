<template>
  <div class="card">
    <Menubar :model="items" breakpoint="400px">
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="menu-item-link" v-bind="props.action">
          <span :class="item.icon" />
          <span class="menu-item-label">{{ item.label }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
          <span v-if="item.shortcut" class="shortcut-badge">{{ item.shortcut }}</span>
          <i v-if="hasSubmenu" :class="['submenu-icon', { 'ml-2': root, 'ml-auto': !root }]"></i>
        </a>
      </template>
      <template #end>
        <div class="end-template-content">
          <Calendar v-model="dateRange" selectionMode="range" dateFormat="d M" :manualInput="false" placeholder="Date"/>
          <MultiSelect v-model="genre" :options="genres" optionLabel="label" placeholder="Genre" class="rounded-button" />
          <Dropdown
            v-model="eventType"
            :options="eventTypes"
            optionLabel="label"
            placeholder="Event Type"
            class="rounded-button"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import Calendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";

const items = ref([{ label: "All" }, { label: "For you" }, { label: "New" }, { label: "AL Picks" }]);

const dateRange = ref(null);
const genre = ref(null);
const eventType = ref(null);
const genres = ref([
  { label: "Rock", value: "rock" },
  { label: "Jazz", value: "jazz" },
]);
const eventTypes = ref([
  { label: "Concert", value: "concert" },
  { label: "Festival", value: "festival" },
]);
</script>

<style scoped>
.menu-item-link {
  display: flex;
  align-items: center;
  position: relative;
  text-decoration: none;
}

.menu-item-label {
  margin-left: 8px;
}

.submenu-icon {
  margin-left: 8px;
}

.end-template-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 600px) {
  .card .p-menubar {
    flex-direction: column;
  }

  .card .p-menubar > .p-menubar-start,
  .card .p-menubar > .p-menubar-end {
    width: 100%;
  }

  .card .p-menubar > .p-menubar-end {
    order: 1;
  }
}

@media (max-width: 400px) {
  .card .p-menubar > .p-menubar-end {
    order: 1;
    width: 100%;
  }
}


</style>
