<template>
    <div>
        <v-container>
            <v-row no-gutters>
                <v-col cols="12">

                    <v-stepper editable v-model="step">
                        <template v-slot:default="{ next }">
                            <v-stepper-header>
                                <v-stepper-item class="pa-4" title="✨️AI" value="1" :color="step == 1 ? 'primary' : ''">
                                </v-stepper-item>
                                <v-divider class="mx-1"></v-divider>
                                <v-stepper-item value="2" title="Evento" class="pa-4"
                                    :color="step == 2 ? 'primary' : ''"></v-stepper-item>
                                <v-divider class="mx-1"></v-divider>
                                <v-stepper-item class="pa-4" value="3"
                                    :color="step == 3 ? 'primary' : ''">Imagem</v-stepper-item>
                            </v-stepper-header>
                            <v-stepper-window class="ma-0 pt-4">

                                <!-- VIRTUAL ASSISTENTE -->
                                <v-stepper-window-item value="1">
                                    <v-card flat max-width="500" class="mx-auto">
                                        <v-card-title> Create event with ✨️AI</v-card-title>
                                        <v-card-subtitle>
                                            Cole o texto de divulgação e deixe que nossa assistente
                                            virtual te ajude a preencher os dados do evento
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
                                                        Use autofill
                                                    </v-btn></v-col>
                                                <v-col cols="12">
                                                    <v-divider></v-divider>
                                                </v-col>
                                                <v-col class="text-center" cols="12"> <v-btn color="grey"
                                                        class="mb-4 mx-auto" @click="next">
                                                        Preencher manualmente
                                                    </v-btn>
                                                </v-col>
                                            </v-row>



                                        </v-card-text>

                                    </v-card>

                                </v-stepper-window-item>

                                <!-- EVENT FIELD -->
                                <v-stepper-window-item title="Detalhes do evento" value="2">
                                    <v-card flat max-width="500" class="mx-auto">
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
                                                    <v-text-field type="date" label="Start Date"
                                                        v-bind="helpers.fieldAttrs"
                                                        v-model="event.startDate"></v-text-field>
                                                </v-col>

                                                <!-- START TIME -->
                                                <v-col cols="6">
                                                    <v-text-field type="time" clearable label="Start Time"
                                                        v-bind="helpers.fieldAttrs"
                                                        v-model="event.startTime"></v-text-field>
                                                </v-col>

                                                <!-- END DATE -->
                                                <v-col cols="6">
                                                    <v-text-field type="date" label="End Date"
                                                        v-bind="helpers.fieldAttrs"
                                                        v-model="event.endDate"></v-text-field>
                                                </v-col>

                                                <!-- END TIME -->
                                                <v-col cols="6">
                                                    <v-text-field type="time" label="End Time"
                                                        v-bind="helpers.fieldAttrs"
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
                                                    <field-country label="Country"
                                                        v-model="event.location.country"></field-country>
                                                </v-col>

                                                <!-- LOCATION REGION -->
                                                <v-col cols="6" v-if="regions[event.location.country]">
                                                    <field-region v-model="event.location.region"
                                                        :country="event.location.country || 'BR'"></field-region>
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
                                                    <v-textarea rows="1" auto-grow label="LineUp"
                                                        v-bind="helpers.fieldAttrs" v-model="event.lineup"></v-textarea>
                                                </v-col>
                                                <!-- GENRES -->
                                                <v-col cols="12" v-if="genres">
                                                    <v-select :items="genres" chips chip-closeble multiple
                                                        label="Genres" v-bind="helpers.fieldAttrs"
                                                        v-model="event.genres"></v-select>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                        <v-card-title>Description</v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <!-- DESCRIPTION -->
                                                <v-col cols="12">
                                                    <v-textarea v-model="event.description" v-bind="helpers.fieldAttrs"
                                                        rounded="xl" label="Description"></v-textarea>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>

                                        <v-card-title>Price</v-card-title>
                                        <v-card-text>
                                            <!-- PRICE -->
                                            <field-price v-model="event.price"></field-price>
                                            <!-- <v-row no-gutters v-for="(p, i) in event.price" :key="i" class="mb-2">
                                                <v-col cols="4">
                                                    <v-text-field v-bind="helpers.fieldAttrs"
                                                        v-model="event.price[i].name" label="Price name"
                                                        rounded="s-xl e-0"></v-text-field>
                                                </v-col>
                                                <v-col cols="8">
                                                    <v-text-field v-bind="helpers.fieldAttrs"
                                                        v-model="event.price[i].value" label="Price value"
                                                        append-icon="mdi-close" @click:append="
                                                            event.price.splice(index, 1)
                                                            " rounded="e-xl s-0"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-btn @click="addPrice" variant="tonal"><v-icon
                                                            start>mdi-plus</v-icon> Add
                                                        price</v-btn>
                                                </v-col>
                                            </v-row> -->
                                        </v-card-text>
                                        <v-card-title>Links</v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <!-- LINKS -->
                                                <v-col cols="12">
                                                    <v-row no-gutters v-for="(link, index) in event.links" :key="index"
                                                        class="mb-2">
                                                        <v-col cols="4">
                                                            <v-text-field v-bind="helpers.fieldAttrs"
                                                                v-model="event.links[index].name" label="Link name"
                                                                rounded="s-xl e-0"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="8">
                                                            <v-text-field v-bind="helpers.fieldAttrs"
                                                                v-model.lazy="event.links[index].url" label="Link URL"
                                                                rounded="e-xl s-0" append-icon="mdi-close"
                                                                @click:append="
                                                                    event.links.splice(index, 1)
                                                                    "></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-btn @click="addLink" variant="tonal"><v-icon
                                                                    start>mdi-plus</v-icon> Add
                                                                link</v-btn>
                                                        </v-col>
                                                    </v-row>

                                                    <!-- 
                                                    <v-row dense no-gutters v-for="(link, index) in event.links"
                                                        :key="index">
                                                        <v-col cols="12">
                                                            <v-text-field :label="event.links[index].name"
                                                                variant="outlined" v-bind="helpers.fieldAttrs"
                                                                density="compact" class="mt-4" color="primary"
                                                                hide-details="auto" placeholder="Enter your link"
                                                                v-model.lazy="event.links[index].url" :append-icon="event.links.length > 1
                                                                    ? 'mdi-close'
                                                                    : null
                                                                    " @click:append="
                                                                        event.links.splice(index, 1)
                                                                        ">
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row> -->
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col class="text-center" cols="12"> <v-btn color="primary"
                                                        class="mb-4 mx-auto" @click="next">
                                                        Proximo
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>

                                </v-stepper-window-item>

                                <!-- EVENT IMAGE AND CONFIRMATION -->
                                <v-stepper-window-item title="Imagem" value="3" @click:next="onClickFinish">
                                    <v-card flat max-width="500" class="mx-auto">
                                        <v-card-title>
                                            Event Image
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="12" class="pb-0 pt-1">

                                                    <v-file-input id="image" v-model="files.image" :show-size="1000"
                                                        color="deep-purple-accent-4" placeholder="Select your files"
                                                        hide-details="auto" variant="outlined" :label="files.image
                                                            ? 'Image'
                                                            : 'Click or drag files to add'
                                                            " counter accept="image/*" class="pa-0 mt-4"
                                                        :clearable="false" :prepend-icon="null" rounded="xl">
                                                        <template v-slot:label>
                                                            <template v-if="!files.image">
                                                                <span>
                                                                    <v-icon>mdi-camera</v-icon> Click or
                                                                    drag files to add</span>
                                                            </template>
                                                        </template>
                                                        <template v-slot:selection>
                                                            <v-img class="rounded-xl" :src="imagePreview(files.image)">
                                                            </v-img>
                                                            <!-- <template v-for="(file, index) in files.image" :key="index">
                                                                <v-img class="rounded-xl" :src="imagePreview(file)">
                                                                </v-img>
                                                            </template> -->
                                                        </template>
                                                    </v-file-input>
                                                </v-col>
                                                <v-col cols="12" class="text-center">
                                                    <v-btn @click="submit" color="primary">Enviar evento</v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>

                                </v-stepper-window-item>
                            </v-stepper-window>

                        </template>
                    </v-stepper>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import {
  computed,
  inject,
  onMounted,
  ref,
} from 'vue';

import { storeToRefs } from 'pinia';

import FieldCountry from '@/components/fields/FieldCountry.vue';
import FieldPrice from '@/components/fields/FieldPrice.vue';
import FieldRegion from '@/components/fields/FieldRegion.vue';
import { useAppStore } from '@/store/app';
import { useChatgptStore } from '@/store/chatgpt.js';
import { useConfigStore } from '@/store/config';
import { useEventStore } from '@/store/event.js';
import { useFirebaseStore } from '@/store/firebase';

const helpers = inject("$helpers");

const chatgptStore = useChatgptStore();
const eventStore = useEventStore();
const appStore = useAppStore();
const configStore = useConfigStore();
const firebaseStore = useFirebaseStore();

const opened = ref(false);
const text = ref(null);
const step = ref(null);

const { event, files } = storeToRefs(eventStore);
const { genres, countries, regions } = storeToRefs(configStore);


const imagePreview = computed(() => {
    return (file) => {
        return URL.createObjectURL(file);
    };
});

async function checkIfLocationExists(name) {
    if (!name) return false;

    try {
        return await firebaseStore.getDocumentByName("locations", name);

    } catch (error) {
        
        return false
    }

}

async function useAssistente(callback) {
    try {
        appStore.loading = true;
        appStore.loadingText = "Converting text...";

        const response = await chatgptStore.fetchEventAssistente(text.value);
        
        const content = JSON.parse(response.choices[0].message.content);
        
        event.value = {
            ...eventStore.event,
            ...content,
        };
        if (content.location && content.location.name) {
            const location = await checkIfLocationExists(content.location.name);
            
            if (location) {
                event.value.location.id = location.id;
                event.value.location.city = location.city;
                event.value.location.region = location.region;
                event.value.location.country = location.country;
                event.value.location.name = location.name;
                if (location.address) {
                    event.value.location.address = location.address;
                }
            }


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

function addPrice() {
    if (!event.value.price || !Array.isArray(event.value.price)) {
        event.value.price = [];
    }
    event.value.price.push({ name: null, value: null })
}

function addLink() {
    if (!event.value.links || !Array.isArray(event.value.links)) {
        event.value.links = [];
    }
    event.value.links.push({ name: "", url: "" })
}

async function submit() {
    
    const response = await eventStore.createEvent();
    if (response.ok) {
        eventStore.$reset();
        step.value = 1;
        text.value = null;
    }
    
}


// onMounted(async () => {
//     configStore.init();
//     await checkIfLocationExists("Floripa Shopping")
// })


</script>

<style lang="scss" scoped></style>