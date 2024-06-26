<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card class="mx-auto text-center">
                        <v-card-title> Create event with AI</v-card-title>
                        <v-card-text>
                            <p class="text-body-2 mb-4">
                                Cole o texto de divulgação e deixe que nossa assistente
                                virtual te ajude a preencher os dados do evento
                            </p>
                            <v-textarea variant="filled" rows="12" color="primary" v-model="text">
                            </v-textarea>
                            <v-btn color="primary" class="mb-4" @click="useAssistente">
                                Enviar texto
                            </v-btn>
                        </v-card-text>
                        <v-card-title> Event Info</v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- NAME -->
                                <v-col cols="12">
                                    <v-text-field label="Name" v-bind="helpers.fieldAttrs"
                                        v-model="event.name"></v-text-field>
                                </v-col>

                                <!-- START DATE -->
                                <v-col cols="6">
                                    <v-text-field label="Start Date" v-bind="helpers.fieldAttrs"
                                        v-model="event.startDate"></v-text-field>
                                </v-col>

                                <!-- START TIME -->
                                <v-col cols="6">
                                    <v-text-field label="Start Time" v-bind="helpers.fieldAttrs"
                                        v-model="event.startTime"></v-text-field>
                                </v-col>

                                <!-- END DATE -->
                                <v-col cols="6">
                                    <v-text-field label="End Date" v-bind="helpers.fieldAttrs"
                                        v-model="event.endDate"></v-text-field>
                                </v-col>

                                <!-- END TIME -->
                                <v-col cols="6">
                                    <v-text-field label="End Time" v-bind="helpers.fieldAttrs"
                                        v-model="event.endTime"></v-text-field>
                                </v-col>

                            </v-row>


                        </v-card-text>
                        <v-card-title> Location</v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- LOCATION NAME -->
                                <v-col cols="12">
                                    <v-text-field label="Location Name" v-bind="helpers.fieldAttrs"
                                        v-model="event.location.name"></v-text-field>
                                </v-col>

                                <!-- LOCATION ADDRESS -->
                                <v-col cols="12">
                                    <v-text-field label="Location Address" v-bind="helpers.fieldAttrs"
                                        v-model="event.location.address"></v-text-field>
                                </v-col>

                                <!-- LOCATION COUNTRY -->
                                <v-col cols="6" v-if="countries">
                                    <v-autocomplete hide-details="auto" :items="countries" item-value="code"
                                        label="Country" item-title="names.pt" v-bind="helpers.fieldAttrs"
                                        v-model="event.location.country" @update:modelValue="event.region = 'all'">

                                        <template v-slot:prepend-inner>
                                            <v-avatar size="x-small">
                                                <v-img
                                                    :src="'https://flagcdn.com/' + event.location.country.toLowerCase() + '.svg'"></v-img>
                                            </v-avatar>
                                        </template>
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item density="compact" v-bind="props"
                                                :prepend-avatar="item.raw.flag" :title="item.raw.names.pt">
                                                <template v-slot:prepend>
                                                    <v-avatar size="small">
                                                        <v-img
                                                            :src="'https://flagcdn.com/' + item.raw.code.toLowerCase() + '.svg'"></v-img>
                                                    </v-avatar>
                                                </template>
                                            </v-list-item>
                                        </template>
                                    </v-autocomplete>
                                </v-col>

                                <!-- LOCATION REGION -->
                                <v-col cols="6" v-if="regions[event.location.country]">
                                    <v-select :items="Object.entries(regions[event.location.country])" item-title="[1]"
                                        item-value="[0]" label="Region" v-bind="helpers.fieldAttrs"
                                        v-model="event.location.region"></v-select>
                                </v-col>


                            </v-row>
                        </v-card-text>

                        <v-card-title>
                            Line Up
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- LINE UP -->
                                <v-col cols="12">
                                    <v-textarea rows="1" auto-grow label="LineUp" v-bind="helpers.fieldAttrs"
                                        v-model="event.lineup"></v-textarea>
                                </v-col>
                                <!-- GENRES -->
                                <v-col cols="12" v-if="genres">
                                    <v-select :items="genres" chips chip-closeble multiple label="Genres"
                                        v-bind="helpers.fieldAttrs" v-model="event.genres"></v-select>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-title>Description</v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- DESCRIPTION -->
                                <v-col cols="12">
                                    <v-textarea v-model="event.description" v-bind="helpers.fieldAttrs" rounded="xl"
                                        label="Description"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-card-title>Price</v-card-title>
                        <v-card-text>
                            <v-row no-gutters v-for="(p, i) in event.price" :key="i" class="mb-2">
                                <v-col cols="4">
                                    <v-text-field v-bind="helpers.fieldAttrs" v-model="event.price[i].title"
                                        label="title" rounded="s-xl e-0"></v-text-field>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-bind="helpers.fieldAttrs" v-model="event.price[i].value"
                                        label="value" rounded="e-xl s-0"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-title>Links</v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- LINKS -->
                                <v-col cols="12">
                                    <v-row dense no-gutters v-for="(link, index) in event.links" :key="index">
                                        <v-col cols="12">
                                            <v-text-field :label="event.links[index].name" variant="outlined"
                                                v-bind="helpers.fieldAttrs" density="compact" class="mt-4"
                                                color="primary" hide-details="auto" placeholder="Enter your link"
                                                v-model.lazy="event.links[index].url" :append-icon="event.links.length > 1
                                                    ? 'mdi-close'
                                                    : null
                                                    " @click:append="
                                                        event.links.splice(index, 1)
                                                        ">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <pre>

    {{ event }}
</pre>
        </v-container>
    </div>
</template>

<script setup>
import {
    inject,
    onMounted,
    ref,
} from 'vue';

import { storeToRefs } from 'pinia';
import { VStepperVertical } from 'vuetify/labs/VStepperVertical';

import { useAppStore } from '@/store/app';
import { useChatgptStore } from '@/store/chatgpt.js';
import { useConfigStore } from '@/store/config';
import { useEventStore } from '@/store/event.js';

const helpers = inject("$helpers");

const chatgptStore = useChatgptStore();
const eventStore = useEventStore();
const appStore = useAppStore();
const configStore = useConfigStore();
const opened = ref(false);
const text = ref(null);

const { event } = storeToRefs(eventStore);
const { genres, countries, regions } = storeToRefs(configStore);




async function useAssistente() {
    try {
        appStore.loading = true;
        appStore.loadingText = "Converting text...";

        const response = await chatgptStore.fetchEventAssistente(text.value);
        console.log({ response });
        const content = JSON.parse(response.choices[0].message.content);

        event.value = {
            ...eventStore.event,
            ...content,
        };
    } catch (error) {
        console.log({ error });
    } finally {
        appStore.loading = false;
        appStore.loadingText = null;
        close();
    }
}

// onMounted(() => {
//     configStore.init();
// })


</script>

<style lang="scss" scoped></style>