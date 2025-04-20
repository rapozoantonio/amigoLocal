<template>
    <div>
        <v-autocomplete v-if="locations" v-bind="{ ...fieldAttrs, ...$attrs }" v-model="location.name"
            :items="locations" item-value="id" item-title="name" @update:modelValue="changeLocation" clearable>
            <template #prepend-item>
                <v-list-item density="compact">
                    <v-list-item-subtitle>Locations</v-list-item-subtitle>
                    <template #append>
                        <v-btn variant="text" @click="openDialog" size="sm" color="primary">
                            Add Location
                            <v-icon class="ml-2" end>mdi-plus-circle</v-icon>
                        </v-btn>
                    </template>
                </v-list-item>
                <v-divider class="mb-2"></v-divider>

                <!-- <div class="text-center">
                                    <v-btn variant="plain">Add Location</v-btn>
                                </div> -->
            </template>
            <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props">
                    <v-list-item-subtitle>{{ item.raw.address }} - {{ item.raw.region?.name
                        }}, {{ item.raw.country
                        }}</v-list-item-subtitle>
                </v-list-item>
            </template>
        </v-autocomplete>

        <v-alert class="mt-4" variant="outlined" v-if="location.id">
            <template #text>
                <p class="text-h6">{{ location.name }}</p>
                <p class="text-body-2">{{ location.address }}</p>
                <p class="text-body-2">
                    <span v-if="location.city"> {{ location.city }},</span>
                    {{ location.region?.name || location.region }} - {{
                        location.country }}
                </p>
            </template>

            <template #prepend>
                <v-icon class="mt-4">mdi-map-marker</v-icon>
            </template>

            <template #close>
                <v-btn icon="mdi-close" @click="changeLocation"></v-btn>
            </template>
        </v-alert>


        <form-dialog v-model:opened="dialog" v-if="newLocation" @submit="createAndAssociate"
            action="Create and Associate" :schema="locationSchema" v-model:model="newLocation" labelType="in"
            title="Add location"></form-dialog>

    </div>

</template>

<script setup>
import {
    defineModel,
    inject,
    onMounted,
    ref,
    watch,
    toRefs
} from 'vue';

import { storeToRefs } from 'pinia';

import QuickCreateLocation
    from '@/promotion/components/quickcreate/QuickCreateLocation.vue';
import locationSchema from '@/core/schemas/locationSchema';
import { useConfigStore } from '@/promotion/store/config';
import { useLocationStore } from '@/promotion/store/location';
import { useLocationsStore } from '@/promotion/store/locations';

import FormDialog from '../form/FormDialog.vue';

const { fieldAttrs, rules } = inject("$helpers");

const locationsStore = useLocationsStore();
const locationStore = useLocationStore();
const configStore = useConfigStore();

const { locations } = storeToRefs(locationsStore);
const { location: newLocation } = storeToRefs(locationStore);

const location = defineModel();
const locationToSearch = ref(null);
const dialog = ref(false);
const props = defineProps(["region", "country"]);
const { region, country } = toRefs(props);
function openDialog() {
    dialog.value = true;
}

function closeDialog() {
    dialog.value = false;
}

function changeLocation(e) {
    const loc = locations.value.find((l) => l.id === e);
    if (loc) {
        location.value.name = loc.name;
        location.value.country = loc.country;
        location.value.region = loc.region;
        location.value.city = loc.city;
        location.value.address = loc.address;
        location.value.id = loc.id;
    }
    else {
        location.value.name = null;
        location.value.country = "BR";
        location.value.region = null;
        location.value.city = null;
        location.value.address = null;
        location.value.id = null;
    }
}

async function createAndAssociate() {

    const response = await locationStore.createLocation(false);
    if (response.ok) {
        // emit("create", response.data.document)
        associateLocation(response.data.document)
    }

}

async function associateLocation(loc) {
    await locationsStore.pushLocation(loc);
    locationToSearch.value = loc.id;
    changeLocation(loc.id);
    closeDialog();
}

watch(region, (newValue) => {
    console.log("region", newValue)
    locationsStore.getLocations({ region: newValue.id, country: country.value });
})

watch(country, (newValue) => {
    console.log("country", newValue)
    locationsStore.getLocations({ region: region.value.id, country: newValue });
})


onMounted(() => {
    console.log("onmounted")
    locationsStore.getLocations({ country: country.value, region: region.value });
})

</script>

<style lang="scss" scoped></style>