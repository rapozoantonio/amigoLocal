<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12">
          <v-stepper editable v-model="step">
            <template v-slot:default="{ prev, next }">
              <v-stepper-header>
                <v-stepper-item class="pa-4" title="✨️AI Iris" value="1" :color="step == 1 ? 'primary' : ''">
                </v-stepper-item>
                <v-divider class="mx-1"></v-divider>
                <v-stepper-item value="2" title="Evento" class="pa-4"
                  :color="step == 2 ? 'primary' : ''"></v-stepper-item>
                <v-divider class="mx-1"></v-divider>
                <v-stepper-item class="pa-4" value="3" :color="step == 3 ? 'primary' : ''">Confirmação</v-stepper-item>
              </v-stepper-header>
              <v-stepper-window class="ma-0 pt-4">
                <!-- STEP 1 - VIRTUAL ASSISTENT -->
                <v-stepper-window-item value="1">
                  <v-card flat max-width="500" class="mx-auto">
                    <v-card-title>✨️ AI Iris</v-card-title>
                    <v-card-text>
                      Me passa a lista dos eventos que eu crio tudo pra você na hora
                    </v-card-text>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-textarea v-bind="helpers.fieldAttrs" rows="12" color="primary" v-model="text">
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" class="text-center">
                          <v-btn color="primary" class="mx-auto" :disabled="!text && text != ''"
                            @click="useAssistente(next)">
                            Use ✨️AI Iris
                          </v-btn></v-col>
                        <v-col cols="12">
                          <v-divider></v-divider>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-stepper-window-item>

                <!-- STEP 2 - EVENTOS -->
                <v-stepper-window-item title="Detalhes do evento" value="2">
                  <v-card flat max-width="500" class="mx-auto">
                    <v-card-title> Lista de eventos </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" v-for="(event, index) in events" :key="event.name">
                          <v-card variant="tonal" @click="openEditDialog(index)">
                            <v-card-text v-if="false">
                              <form-box :schema="bulkEventSchema" v-model:model="events[index]"></form-box>
                            </v-card-text>
                            <v-card-text v-if="true">
                              <p class="text-subtitle-1 font-weight-bold">
                                <span class="text-grey text-subtitle-2">
                                  Name:</span>
                                {{ event.name }}
                              </p>
                              <p class="text-subtitle-2">
                                <span class="text-grey"> Date:</span>
                                {{ event.startDate }}
                              </p>
                              <p class="text-body-2">
                                <span class="text-grey"> Description:</span>
                                {{ event.description }}
                              </p>
                              <p class="text-body-2">
                                <span class="text-grey"> Links:</span>
                              </p>
                              <template v-for="link in event.links" :key="link.url">
                                <p class="text-caption ml-4">
                                  <span class="text-grey"> Name:</span>
                                  {{ link.name }}
                                </p>
                                <p class="text-caption ml-4">
                                  <span class="text-grey"> URL:</span>
                                  {{ link.url }}
                                </p>
                              </template>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-divider></v-divider>

                        <v-col cols="12" class="text-center">
                          <v-btn color="primary" class="mx-auto" @click="next">
                            Próximo
                          </v-btn></v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-stepper-window-item>

                <!-- STEP 3 - CONFIRMATION -->
                <v-stepper-window-item title="Imagem" value="3" @click:next="onClickFinish">
                  <v-card variant="flat" max-width="500" class="mx-auto text-center">
                    <v-card-title> Confirmação </v-card-title>
                    <v-card-text>
                      <p>Total de eventos: {{ events.length }} </p>
                      <v-btn @click="onClickFinish">Criar {{ events.length }} eventos</v-btn>
                    </v-card-text>
                  </v-card>
                </v-stepper-window-item>
              </v-stepper-window>
            </template>
          </v-stepper>

          <v-dialog v-model="selection.opened" :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
              <!-- <v-card-title>Edit event</v-card-title> -->
              <v-card-text v-if="false">
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <p class="mb-1 ml-2 text-body-2">Name</p>
                    <v-text-field v-bind="helpers.fieldAttrs" v-model="events[selection.index].name"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <p class="mb-1 ml-2 text-body-2">Start Date</p>
                    <v-text-field type="date" v-bind="helpers.fieldAttrs"
                      v-model="events[selection.index].startDate"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <p class="mb-1 ml-2 text-body-2">Description</p>
                    <v-textarea v-bind="helpers.fieldAttrs" rows="1"
                      v-model="events[selection.index].description"></v-textarea>
                  </v-col>
                  <template v-for="(link, i) in events[selection.index].links" :key="link.url">
                    <v-col cols="12">
                      <p class="mb-1 ml-2 text-body-2">Links</p>

                      <v-text-field v-model="link.url" v-bind="helpers.fieldAttrs" label="Url">
                        <template #prepend>
                          <v-text-field min-width="120" v-bind="helpers.fieldAttrs" label="Name" v-model="link.name">
                          </v-text-field>
                        </template>
                      </v-text-field>
                    </v-col>
                  </template>
                </v-row>
              </v-card-text>
              <form-box @submit="selection.opened = false" labelType="up" :schema="bulkEventSchema"
                v-model:model="events[selection.index]"></form-box>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { computed, inject, ref } from "vue";

import { useAppStore } from "@/store/app";
import { useChatgptStore } from "@/store/chatgpt.js";
import { useFirebaseStore } from "@/store/firebase.js";
import eventSchema from "@/schemas/eventSchema";
import bulkEventSchema from "@/schemas/bulkEventSchema";
import FormBox from "@/components/form/FormBox.vue";

const helpers = inject("$helpers");

const chatgptStore = useChatgptStore();
const firebaseStore = useFirebaseStore();
const appStore = useAppStore();
const text = ref(null);
const step = ref(null);
const selection = ref({
  edit: false,
  index: -1,
  opened: false,
});

function openEditDialog(index) {
  selection.value.index = index;
  selection.value.edit = true;
  selection.value.opened = true;
}

// const events = ref([]);
const events = ref([
  {
    "startDate": "2024-05-16",
    "name": "BOSQUINTA: A MELHOR QUINTA DO RIO",
    "description": "LISTA VIP até 23:00 horas",
    "links": [
      {
        "name": "festaserrejota",
        "url": "http://festaserrejota.com.br/bosquinta-lista-vip"
      }
    ]
  },
  {
    "startDate": "2024-05-16",
    "name": "PARQUE BAR QUINTA",
    "description": "LISTA VIP até 22:00 horas",
    "links": [
      {
        "name": "festaserrejota",
        "url": "http://festaserrejota.com.br/parque-bar-quinta"
      }
    ]
  },
  {
    "startDate": "2024-05-17",
    "name": "INCOSTA COM HAWAIANOS NO BOSQUE",
    "description": "LISTA VIP até 21:00 horas",
    "links": [
      {
        "name": "festaserrejota",
        "url": "http://festaserrejota.com.br/bosque-bar-sexta"
      }
    ]
  },
  {
    "startDate": "2024-05-17",
    "name": "Q’BELEZA EXC JOCKEY",
    "description": "LISTA VIP até 00:00 horas",
    "links": [
      {
        "name": "festaserrejota",
        "url": "http://festaserrejota.com.br/qbeleza"
      }
    ]
  },
  {
    "startDate": "2024-05-17",
    "name": "ALDEIA SEXTA",
    "description": "LISTA VIP até 23:00 horas",
    "links": [
      {
        "name": "festaserrejota",
        "url": "http://festaserrejota.com.br/aldeia-sexta"
      }
    ]
  },
  {
    "startDate": "2024-05-17",
    "name": "PARQUE BAR SEXTA",
    "description": "LISTA VIP até 23:00 horas",
    "links": [
      {
        "name": "festaserrejota",
        "url": "http://festaserrejota.com.br/parque-bar-sexta"
      }
    ]
  },
]);

async function useAssistente(callback) {
  try {
    appStore.loading = true;
    const response = await chatgptStore.getBulkEventList(text.value);

    const content = JSON.parse(response.choices[0].message.content);

    if (content.events) {
      events.value = content.events;
      console.log("events", content.events)
    }
  } catch (error) {
  } finally {
    appStore.loading = false;
    appStore.loadingText = null;
    callback();
  }
}

async function onClickFinish() {

  if (!events.value || events.value.length === 0) {
    console.log("no events to send");
    return false;
  }

  try {
    const response = await firebaseStore.postBulkDocuments("events", events.value);
    console.log({ response });
  }
  catch (error) {
    console.log(error);
  }





}
</script>

<style lang="scss" scoped>
.label {
  width: 70px;
  display: block;
}
</style>
