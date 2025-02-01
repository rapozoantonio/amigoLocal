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
                        <v-col cols="12">
                          <form-field type="custom-region" :rules="['required']" v-model:model="eventConfig"
                            field="region" label="Região" id="region"></form-field>
                        </v-col>
                        <v-col cols="12" class="text-center">
                          <v-btn color="primary" class="mx-auto"
                            :disabled="(!text && text != '') || !eventConfig.region" @click="useAssistente(next)">
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
                            <v-card-text>
                              <v-row no-gutters>
                                <v-col cols="12">
                                  <p class="text-subtitle-1 font-weight-bold">
                                    <span class="text-grey text-subtitle-2">
                                      Nome:</span>
                                    {{ event.name }}
                                  </p>
                                </v-col>
                                <v-col cols="6">
                                  <p class="text-subtitle-2">
                                    <span class="text-grey"> Data Início:</span>
                                    {{ event.startDate }}
                                  </p>
                                </v-col>
                                <v-col cols="6">
                                  <p class="text-subtitle-2">
                                    <span class="text-grey"> Hora Início:</span>
                                    {{ event.startTime }}
                                  </p>
                                </v-col>
                                <v-col cols="6">
                                  <p class="text-subtitle-2">
                                    <span class="text-grey"> Data Fim:</span>
                                    {{ event.endDate }}
                                  </p>
                                </v-col>
                                <v-col cols="6">
                                  <p class="text-subtitle-2">
                                    <span class="text-grey"> Hora Fim:</span>
                                    {{ event.endTime }}
                                  </p>
                                </v-col>
                                <v-col cols="12">
                                  <p class="text-body-2">
                                    <span class="text-grey"> Description:</span>
                                    {{ event.description }}
                                  </p>
                                </v-col>
                                <v-col cols="12">
                                  <p class="text-body-2">
                                    <span class="text-grey"> Estilos:</span>
                                    {{ event.genres }}
                                  </p>
                                </v-col>
                                <v-col cols="12">
                                  <p class="text-body-2">
                                    <span class="text-grey"> Categorias:</span>
                                    {{ event.categories }}
                                  </p>
                                </v-col>
                                <v-col cols="12">
                                  <p class="text-body-2">
                                    <span class="text-grey"> Região:</span>
                                    {{ event.region ? event.region.name : "" }}
                                  </p>
                                </v-col>
                                <v-col cols="12">
                                  <p class="text-body-2">
                                    <span class="text-grey"> País:</span>
                                    {{ event.country }}
                                  </p>
                                </v-col>
                                <v-col cols="12">
                                  <p class="text-body-2">
                                    <span class="text-grey"> Links:</span>
                                  </p>
                                </v-col>
                                <v-col cols="12">
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
                                </v-col>
                              </v-row>
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
                  <v-card min-height="400" variant="flat" max-width="500" class="mx-auto text-center">
                    <v-card-title> Confirmação </v-card-title>
                    <v-card-text>
                      <v-btn class="mt-4" :disabled="events.length === 0" size="large" color="primary"
                        @click="onClickFinish">Criar
                        {{ events.length
                        }}
                        eventos</v-btn>
                    </v-card-text>
                  </v-card>
                </v-stepper-window-item>
              </v-stepper-window>
            </template>
          </v-stepper>

          <v-dialog v-model="selection.opened" :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
              <form-box @submit="selection.opened = false" labelType="up" :schema="bulkEventSchema"
                v-model:model="events[selection.index]" v-model:files="files[selection.index]"></form-box>
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
import { useEventStore } from "@/store/event";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import FormField from "@/components/form/FormField.vue";
const router = useRouter();
const helpers = inject("$helpers");
const auth = useAuthStore();
const eventConfig = ref({ region: null });
const chatgptStore = useChatgptStore();
const firebaseStore = useFirebaseStore();
const eventStore = useEventStore();
const appStore = useAppStore();
const text = ref(null);
const step = ref(null);
const files = ref([]);
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

const events = ref([]);

async function useAssistente(callback) {
  try {
    appStore.loading = true;
    appStore.loadingText = "Analizando eventos..."
    const response = await chatgptStore.getBulkEventList(text.value);

    const content = JSON.parse(response.choices[0].message.content);

    if (content.events) {
      const transformedEvents = content.events.map((event) => {
        const defaultEvent = eventStore.printEventInit();
        event.endDate = event.endDate || event.startDate;
        return { ...defaultEvent, ...event, region: eventConfig.value.region, country: "BR" }
      });
      events.value = transformedEvents;
      files.value = transformedEvents.map(() => ({}))
      console.log("events", events.value, files.value);
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
  appStore.loading = true;
  appStore.loadingText = "Analizando eventos...";
  try {
    // const response = await firebaseStore.postBulkDocuments("events", events.value);

    const promises = events.value.map((event, index) => {
      return eventStore.createEvent(event, {});
    })

    const response = await Promise.all(promises);
    if (response.every(r => r.ok)) {
      Swal.fire({ title: "Eventos criados com sucesso", icon: "success" }).then(() => {
        router.push("/promoters/" + auth.user.uid);
      });

    }
    console.log({ response });
  }
  catch (error) {
    console.log(error);
  }
  finally {
    appStore.loading = false;
    appStore.loadingText = null;
  }





}
</script>

<style lang="scss" scoped>
.label {
  width: 70px;
  display: block;
}
</style>
