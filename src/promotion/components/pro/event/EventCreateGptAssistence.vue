<template>
  <v-bottom-sheet v-model="opened">
    <template v-slot:activator="{ props }">
      <div class="text-center">
        <v-btn :block="block" v-bind="props" color="primary" :size="size" :text="action" :variant="variant"></v-btn>
      </div>
    </template>

    <div class="text-center">
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="close" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card max-width="600" class="mx-auto">
        <v-card-title> {{ title }} </v-card-title>
        <v-card-text>
          <p class="text-body-2 mb-4">
            {{ text }}
          </p>
          <v-textarea variant="filled" rows="12" color="primary" v-model="textInput">
          </v-textarea>
          <v-btn color="primary" class="mb-4" @click="useAssistente">
            Enviar
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </v-bottom-sheet>
</template>

<script setup>
import { ref } from "vue";

import { useAppStore } from "@/promotion/store/app";
import { useChatgptStore } from "@/core/store/chatgpt.js";
import { useEventStore } from "@/promotion/store/event.js";

const chatgptStore = useChatgptStore();
const eventStore = useEventStore();
const appStore = useAppStore();

const opened = ref(false);
const textInput = ref(null);

const { variant, size, action, title, text, block } = defineProps({
  variant: {
    type: String,
    default: "text",
  },
  size: {
    type: [String, null],
    default: "small",
  },
  action: {
    type: String,
    default: "✨️AI Iris",
  },
  title: {
    type: String,
    default: "✨️AI Iris",
  },
  text: {
    type: String,
    default:
      "Cole o texto de divulgação e deixe que nossa assistente virtual te ajude a preencher os dados do evento",
  },
  block: {
    type: Boolean,
    default: false,
  },
});

async function useAssistente() {
  try {
    appStore.loading = true;
    appStore.loadingText = "Preparando seus eventos com carinho... ✨";

    const response = await chatgptStore.fetchEventAssistente(textInput.value);

    const content = JSON.parse(response.choices[0].message.content);

    eventStore.event = {
      ...eventStore.event,
      ...content,
    };
  } catch (error) {
  } finally {
    appStore.loading = false;
    appStore.loadingText = null;
    close();
  }
}

function close() {
  opened.value = false;
}
</script>