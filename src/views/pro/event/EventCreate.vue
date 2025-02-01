<template>
  <form-steps v-model:opened="opened" @submit="submitEvent" title="Editar Evento" action="Save event" labelType="up"
    :schema="eventSchema" :items="{ genres, categories: eventCategories }" v-model:model="event" v-model:files="files">


    <template #header-prepend v-if="!$vuetify.display.xs && !$vuetify.display.sm">
      <div class="w-100 px-4">
        <event-create-gpt-assistence block variant="elevated" action="Use ✨️AI Iris" title="✨️AI Iris"
          text="Transforme texto em evento ✨️AI Iris"></event-create-gpt-assistence>
      </div>
    </template>

    <template #prepend-section-1 v-if="$vuetify.display.xs || $vuetify.display.sm">
      <div>
        <event-create-gpt-assistence variant="elevated" block action="Use ✨️AI Iris" title="✨️AI Iris"
          text="Transforme texto em evento ✨️AI Iris"></event-create-gpt-assistence>
      </div>
    </template>
  </form-steps>
</template>

<script setup>
import { ref } from "vue";

import { storeToRefs } from "pinia";

import FormSteps from "@/components/form/FormSteps.vue";
import EventCreateGptAssistence from "@/components/pro/event/EventCreateGptAssistence.vue";
import eventSchema from "@/schemas/eventSchema";
import { useConfigStore } from "@/store/config";
import { useEventStore } from "@/store/event";

// Components
const eventStore = useEventStore();
const configStore = useConfigStore();
const opened = ref(true);
const { event, files, eventCategories } = storeToRefs(eventStore);
const { genres } = storeToRefs(configStore);

async function submitEvent() {
  const response = await eventStore.createEvent();
  if (response.ok) {
    eventStore.$reset();
  }
}
</script>