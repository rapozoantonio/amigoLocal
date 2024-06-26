<template>
    <v-container>
        <v-row>
            <v-col cols="12" v-for="event in events" :key="event.name">
                <v-card>

                    <v-card-text>
                        <p class="text-subtitle-1">
                            <span class="text-grey"> Name:</span>
                            {{ event.name }}
                        </p>
                        <p class="text-subtitle-2  "> <span class="text-grey"> Start Date:</span> {{ event.startDate }}
                        </p>
                        <p class="text-body-2"><span class="text-grey"> Description:</span> {{ event.description }}</p>
                        <p class="text-body-2"><span class="text-grey"> Links:</span> </p>
                        <template v-for="link in event.links" :key="link.url">
                            <p class="text-body-2 ml-4"><span class="text-grey">
                                    Name:</span> {{ link.name }}</p>
                            <p class="text-body-2 ml-4"><span class="text-grey">
                                    URL:</span> {{ link.url }}</p>
                        </template>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import {
    inject,
    ref,
} from 'vue';

const helpers = inject("$helpers");

const events = [
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
    {
        "startDate": "2024-05-18",
        "name": "D-EDGE RIO SEXTA",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/d-edge-rio-sexta"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "CAPITAL DO SAMBA C/ SORRISO MAROTO, DILSINHO, FERRUGEM, LÉO SANTANA & TIEE",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/capital-do-samba"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "CASA DDP FULL OPEN BAR",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/casa-ddp-full-open-bar"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "FESTA RARA 09 ANOS",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/festa-rara"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "BOSQUE 40º GRAUS COM MC ANDINHO",
        "description": "LISTA VIP até 22:00 horas",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/bosque-bar-sabado"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "SAMBA DO REDENTOR NA LAGOA RODRIGO DE FREITAS",
        "description": "LISTA VIP até 19:30 horas",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/samba-do-redentor"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "ALDEIA SÁBADO",
        "description": "LISTA VIP até 22:30 horas",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/aldeia-sabado"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "SAMBA ENTRE 4 PAREDES COZINHA ARRUMADA & SAMBOTICA",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/samba-entre-4-paredes"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "PAGODE DO JORGIN",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/pagode-do-jorgin"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "D-EDGE RIO SÁBADO",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/d-edge-rio-sabado"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "COLISEU VERDE E ROSA NA QUADRA DA MANGUEIRA",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/coliseu-verde-e-rosa"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "TRILOGIA NO ESPAÇO HALL C/ SUEL, VITINHO E RONY LÚCIO",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/trilogia-espaco-hall"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "PRIVILEGE BÚZIOS SÁBADO",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/privilege-buzios-sabado"
            }
        ]
    },
    {
        "startDate": "2024-05-18",
        "name": "BETTER DAYS OPEN BAR (SP)",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/better-days-sp"
            }
        ]
    },
    {
        "startDate": "2024-05-19",
        "name": "SAMBINHA DO BOSQUE",
        "description": "LISTA VIP até 20:00 horas",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/sambinha-do-bosque"
            }
        ]
    },
    {
        "startDate": "2024-05-19",
        "name": "PARQUE BAR DOMINGO",
        "description": "LISTA VIP até 20:00 horas",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/parque-bar-domingo"
            }
        ]
    },
    {
        "startDate": "2024-05-19",
        "name": "CAPITAL DO SAMBA C/ MENOS É MAIS, MUMUZINHO, XANDE DE PILARES, PÉRICLES & PIQUE NOVO",
        "description": "Código Promocional: BRAGA",
        "links": [
            {
                "name": "festaserrejota",
                "url": "http://festaserrejota.com.br/capital-do-samba"
            }
        ]
    }
]




</script>

<style lang="scss">
// .label {
//     width: 100px;
//     display: block;
// }</style>