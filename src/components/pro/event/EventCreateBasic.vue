<template>
    <v-form @submit.prevent="submitForm" v-model="eventStore.sections[1]">
        <v-card color="transparent" max-width="600" flat>
            <!-- HEADER BASICO -->
            <v-card-title>
                <div class="d-flex align-center">
                    <span> Basico </span>
                    <v-spacer> </v-spacer>
                    <event-create-gpt-assistence></event-create-gpt-assistence>
                </div>
            </v-card-title>
            <v-card-text>
                <v-row dense>
                    <!-- Field event.name -->
                    <v-col cols="12" class="pb-0 pt-2 required">
                        <label class="text-caption required">Event name</label>
                        <v-text-field class="required" v-bind="fieldAttrs" :rules="[rules.required, rules.lengthMin4]"
                            required v-model="event.name">
                        </v-text-field>
                    </v-col>
                    <!-- Field event.startDate -->
                    <v-col cols="8" sm="6" class="pb-0 pt-2 required">
                        <label class="text-caption required">Start Date</label>
                        <v-text-field v-bind="fieldAttrs" type="date" id="startDate" :rules="[rules.required]" required
                            v-model="event.startDate">
                        </v-text-field>
                    </v-col>
                    <!-- Field event.startTime -->
                    <v-col cols="4" sm="6" class="pb-0 pt-2">
                        <label class="text-caption ">Start Time</label>
                        <v-text-field v-bind="fieldAttrs" type="time" id="startTime" v-model="event.startTime">
                        </v-text-field>
                    </v-col>
                    <!-- Field event.endDate -->
                    <v-col cols="8" sm="6" class="pb-0 pt-2">
                        <label class="text-caption">End Date</label>
                        <v-text-field v-bind="fieldAttrs" type="date" :min="event.startDate" id="endDate"
                            v-model="event.endDate">
                        </v-text-field>
                    </v-col>
                    <!-- Field event.endTime -->
                    <v-col cols="4" sm="6" class="pb-0 pt-2">
                        <label class="text-caption">End Time</label>
                        <v-text-field v-bind="fieldAttrs" type="time" id="endTime" v-model="event.endTime">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <!-- HEADER LOCAL -->
            <v-card-title> Local </v-card-title>
            <v-card-text>
                <!-- <v-row>
                    <v-col cols="12">
                        <v-radio-group v-model="localDefined" class="d-flex" inline>
                            <v-radio label="Local conhecido" :value="true"></v-radio>
                            <v-radio label="Local a definir" :value="false"></v-radio>
                        </v-radio-group>
                    </v-col>
                </v-row> -->
                <v-row v-if="localDefined" dense>
                    <!-- Field event.location -->
                    <v-col cols="12">
                        <span class="text-caption">Local do evento</span>
                        <field-location v-model="event.location"></field-location>

                    </v-col>
                </v-row>
                <v-row v-if="false" dense>
                    <!-- Field event.location.country -->
                    <v-col cols="6">
                        <span class="text-caption">Country</span>
                        <field-country v-model="event.location.country"></field-country>

                    </v-col>
                    <!-- Field event.location.region -->
                    <v-col cols="6">
                        <span class="text-caption">Região</span>
                        <field-region v-model="event.location.region"
                            :country="event.location.country || 'BR'"></field-region>
                    </v-col>

                    <!-- Field event.location.name -->
                    <v-col cols="12">
                        <span class="text-caption">Local do evento</span>
                        <v-text-field prefix="TBA -" v-bind="fieldAttrs" v-model="event.location.name">
                        </v-text-field>
                    </v-col>
                </v-row>

            </v-card-text>
            <!-- ACTIONS -->
            <v-card-actions>
                <!-- BUTTON SUBMIT -->
                <v-btn variant="tonal" color="primary" type="submit" class="ml-auto">Próximo</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import {
  defineProps,
  inject,
  onMounted,
  ref,
  watch,
} from 'vue';

import { storeToRefs } from 'pinia';

import FieldCountry from '@/components/fields/FieldCountry.vue';
import FieldLocation from '@/components/fields/FieldLocation.vue';
import FieldRegion from '@/components/fields/FieldRegion.vue';
import EventCreateGptAssistence
  from '@/components/pro/event/EventCreateGptAssistence.vue';
import { useConfigStore } from '@/store/config';
import { useEventStore } from '@/store/event.js';

// import { useLocationsStore } from '@/store/locations';

const { next, rules } = defineProps(["next", "rules"]);
const eventStore = useEventStore();
const configStore = useConfigStore();
// const locationsStore = useLocationsStore();

const { event, $v } = storeToRefs(eventStore);
const { countries, regions } = storeToRefs(configStore);
// const { locations } = storeToRefs(locationsStore);
const { fieldAttrs } = inject("$helpers");




// const formValid = ref(false);
const localDefined = ref(true);
const location = ref(null);

async function submitForm(e) {
    const results = await e;
    if (!results.valid) {
        document.querySelector("#" + results.errors[0].id).focus();
        return false;
    }
    
    next();
}

watch(() => event.value.location.country, () => {
    event.value.location.region = null;
})

// function changeLocation(e) {
//     
//     const location = locations.value.find((l) => l.id === e);
//     
//     if (location) {
//         event.value.location = {
//             name: location.name,
//             country: location.country,
//             region: location.region,
//             city: location.city,
//             address: location.address,
//             id: location.id,
//         }
//     }
//     else {
//         event.value.location = {
//             name: null,
//             country: "BR",
//             region: null,
//             city: null,
//             address: null,
//             id: null,
//         }
//     }
// }

// onMounted(() => {
//     locationsStore.getLocations();
// })
</script>

<style lang="scss" scoped>
label {
    margin-left: 10px;
}
</style>