<template>
    <div>
        <v-container>
            <v-row no-gutters>
                <v-col cols="12">

                    <v-stepper editable v-model="step">
                        <template v-slot:default="{ prev, next }">
                            <v-stepper-header>
                                <v-stepper-item class="pa-4" title="AI" value="1" :color="step == 1 ? 'primary' : ''">
                                </v-stepper-item>
                                <v-divider class="mx-1"></v-divider>
                                <v-stepper-item value="2" title="Evento" class="pa-4"
                                    :color="step == 2 ? 'primary' : ''"></v-stepper-item>
                                <v-divider class="mx-1"></v-divider>
                                <v-stepper-item class="pa-4" value="3"
                                    :color="step == 3 ? 'primary' : ''">Imagem</v-stepper-item>
                            </v-stepper-header>
                            <v-stepper-window class="ma-0 pt-4">

                                <!-- STEP 1 - VIRTUAL ASSISTENT -->
                                <v-stepper-window-item value="1">
                                    <v-card flat max-width="500" class="mx-auto">
                                        <v-card-title> Virtual Assistent</v-card-title>
                                        <v-card-subtitle>
                                            Cole a lista de eventos e deixe que nossa assistente
                                            virtual te ajude a criar os eventos
                                        </v-card-subtitle>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-textarea v-bind="helpers.fieldAttrs" rows="12" color="primary"
                                                        v-model="text">
                                                    </v-textarea>
                                                </v-col>
                                                <v-col cols="12" class="text-center">
                                                    <v-btn color="primary" class=" mx-auto"
                                                        :disabled="!text && text != ''" @click="useAssistente(next)">
                                                        Use assistent
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

                                    <v-card max-width="500" class="mx-auto">
                                        <v-card-title>
                                            Lista de eventos
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="12" v-for="(event, index) in events" :key="event.name">
                                                    <v-card variant="tonal" @click="openEditDialog(index)">

                                                        <v-card-text>
                                                            <p class="text-subtitle-1 font-weight-bold ">
                                                                <span class="text-grey text-subtitle-2"> Name:</span>
                                                                {{ event.name }}
                                                            </p>
                                                            <p class="text-subtitle-2  "> <span class="text-grey">
                                                                    Date:</span> {{ event.startDate }}
                                                            </p>
                                                            <p class="text-body-2"><span class="text-grey">
                                                                    Description:</span> {{ event.description }}</p>
                                                            <p class="text-body-2"><span class="text-grey">
                                                                    Links:</span> </p>
                                                            <template v-for="link in event.links" :key="link.url">
                                                                <p class="text-caption ml-4"><span class="text-grey">
                                                                        Name:</span> {{ link.name }}</p>
                                                                <p class="text-caption  ml-4"><span class="text-grey">
                                                                        URL:</span> {{ link.url }}</p>
                                                            </template>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>


                                </v-stepper-window-item>

                                <!-- STEP 3 - CONFIRMATION -->
                                <v-stepper-window-item title="Imagem" value="3" @click:next="onClickFinish">
                                    <v-card max-width="500" class="mx-auto">
                                        <v-card-title>
                                            Confirmation
                                        </v-card-title>
                                        <v-card-text>

                                        </v-card-text>
                                    </v-card>

                                </v-stepper-window-item>
                            </v-stepper-window>

                        </template>
                    </v-stepper>

                    <v-dialog v-model="selection.opened" persistent :overlay="false" max-width="500px"
                        transition="dialog-transition">
                        <v-card>
                            <v-card-title>Edit event</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <p class="mb-1 ml-2 text-body-2">Name</p>
                                        <v-text-field v-bind="helpers.fieldAttrs"
                                            v-model="events[selection.index].name"></v-text-field>
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

                                            <v-text-field v-bind="helpers.fieldAttrs" label="Url">
                                                <template #prepend>
                                                    <v-text-field min-width="120" v-bind="helpers.fieldAttrs"
                                                        label="Name">
                                                    </v-text-field>
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                    </template>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-dialog>


                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import {
    computed,
    inject,
    ref,
} from 'vue';

import { useAppStore } from '@/store/app';
import { useChatgptStore } from '@/store/chatgpt.js';

const helpers = inject("$helpers");

const chatgptStore = useChatgptStore();
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


const events = ref([])
// const events = [
//     {
//         "startDate": "2024-05-16",
//         "name": "BOSQUINTA: A MELHOR QUINTA DO RIO",
//         "description": "LISTA VIP até 23:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/bosquinta-lista-vip"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-16",
//         "name": "PARQUE BAR QUINTA",
//         "description": "LISTA VIP até 22:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/parque-bar-quinta"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-17",
//         "name": "INCOSTA COM HAWAIANOS NO BOSQUE",
//         "description": "LISTA VIP até 21:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/bosque-bar-sexta"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-17",
//         "name": "Q’BELEZA EXC JOCKEY",
//         "description": "LISTA VIP até 00:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/qbeleza"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-17",
//         "name": "ALDEIA SEXTA",
//         "description": "LISTA VIP até 23:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/aldeia-sexta"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-17",
//         "name": "PARQUE BAR SEXTA",
//         "description": "LISTA VIP até 23:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/parque-bar-sexta"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "D-EDGE RIO SEXTA",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/d-edge-rio-sexta"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "CAPITAL DO SAMBA C/ SORRISO MAROTO, DILSINHO, FERRUGEM, LÉO SANTANA & TIEE",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/capital-do-samba"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "CASA DDP FULL OPEN BAR",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/casa-ddp-full-open-bar"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "FESTA RARA 09 ANOS",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/festa-rara"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "BOSQUE 40º GRAUS COM MC ANDINHO",
//         "description": "LISTA VIP até 22:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/bosque-bar-sabado"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "SAMBA DO REDENTOR NA LAGOA RODRIGO DE FREITAS",
//         "description": "LISTA VIP até 19:30 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/samba-do-redentor"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "ALDEIA SÁBADO",
//         "description": "LISTA VIP até 22:30 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/aldeia-sabado"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "SAMBA ENTRE 4 PAREDES COZINHA ARRUMADA & SAMBOTICA",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/samba-entre-4-paredes"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "PAGODE DO JORGIN",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/pagode-do-jorgin"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "D-EDGE RIO SÁBADO",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/d-edge-rio-sabado"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "COLISEU VERDE E ROSA NA QUADRA DA MANGUEIRA",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/coliseu-verde-e-rosa"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "TRILOGIA NO ESPAÇO HALL C/ SUEL, VITINHO E RONY LÚCIO",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/trilogia-espaco-hall"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "PRIVILEGE BÚZIOS SÁBADO",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/privilege-buzios-sabado"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-18",
//         "name": "BETTER DAYS OPEN BAR (SP)",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/better-days-sp"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-19",
//         "name": "SAMBINHA DO BOSQUE",
//         "description": "LISTA VIP até 20:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/sambinha-do-bosque"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-19",
//         "name": "PARQUE BAR DOMINGO",
//         "description": "LISTA VIP até 20:00 horas",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/parque-bar-domingo"
//             }
//         ]
//     },
//     {
//         "startDate": "2024-05-19",
//         "name": "CAPITAL DO SAMBA C/ MENOS É MAIS, MUMUZINHO, XANDE DE PILARES, PÉRICLES & PIQUE NOVO",
//         "description": "Código Promocional: BRAGA",
//         "links": [
//             {
//                 "name": "festaserrejota",
//                 "url": "http://festaserrejota.com.br/capital-do-samba"
//             }
//         ]
//     }
// ]



async function useAssistente(callback) {
    try {
        appStore.loading = true;
        appStore.loadingText = "Converting text...";
        const response = await chatgptStore.getBulkEventList(text.value);
        
        const content = JSON.parse(response.choices[0].message.content);

        if (content.events) {
            events.value = content.events;
        }
        
    } catch (error) {
        
    } finally {
        appStore.loading = false;
        appStore.loadingText = null;
        callback();
    }
}

function onClickFinish() {
    
}






</script>

<style lang="scss" scoped>
.label {
    width: 70px;
    display: block;
}
</style>