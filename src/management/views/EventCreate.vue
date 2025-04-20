<template>
  <form-steps v-model:opened="opened" @submit="submitEvent" title="Editar Evento" action="Save event" labelType="up"
    :schema="eventSchema" :items="{ genres, categories: eventCategories }" v-model:model="event" v-model:files="files">


    <template #header-prepend v-if="!$vuetify.display.xs && !$vuetify.display.sm">
      <div class="w-100 px-4">
        <event-create-gpt-assistence block variant="elevated" action="Criar Evento ✨️AI Iris" title="✨️AI Iris"
          text="Transforme texto em evento ✨️AI Iris"></event-create-gpt-assistence>
        <v-btn :to="{ name: 'pro-events-bulk-create' }" size="small" class="mt-2" block color="secondary">Bulk Create
          ✨️AI
          Iris"</v-btn>
        <div class="mt-5">
          <v-divider> ou</v-divider>
        </div>
      </div>
    </template>

    <template #prepend-section-1 v-if="$vuetify.display.xs || $vuetify.display.sm">
      <div>
        <event-create-gpt-assistence variant="elevated" block action="Criar Evento ✨️AI Iris" title="✨️AI Iris"
          text="Transforme texto em evento ✨️AI Iris"></event-create-gpt-assistence>
        <v-btn :to="{ name: 'pro-events-bulk-create' }" size="small" class="mt-2" block color="secondary">Bulk Create
          ✨️AI
          Iris"</v-btn>
        <div class="mt-5">
          <v-divider> ou</v-divider>
        </div>
      </div>
    </template>
  </form-steps>
</template>

<script setup>
import { ref } from "vue";

import { storeToRefs } from "pinia";

import FormSteps from "@/promotion/components/form/FormSteps.vue";
import EventCreateGptAssistence from "@/promotion/components/pro/event/EventCreateGptAssistence.vue";
import eventSchema from "@/core/schemas/eventSchema";
import { useConfigStore } from "@/promotion/store/config";
import { useEventStore } from "@/promotion/store/event";
import { useAppStore } from "@/promotion/store/app";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/core/store/auth";

// Components
const eventStore = useEventStore();
const configStore = useConfigStore();
const appStore = useAppStore();
const opened = ref(true);
const { event, files, eventCategories } = storeToRefs(eventStore);
const { genres } = storeToRefs(configStore);
const router = useRouter();
const auth = useAuthStore();

async function submitEvent() {
  console.log("submit Event", event.value, files.value);
  appStore.loading = true;
  appStore.loadingText = "Criando evento...";
  try {
    const response = await eventStore.createEvent(event.value, files.value);
    console.log({ response });
    if (response.ok) {
      response.notify().then(() => {
        // Redirect to events list in the management interface
        router.push({ name: "prod-events-list" });
      });

    }
    else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.log({ error });
  } finally {
    appStore.loading = false;
    appStore.loadingText = null;
  }

}
</script>