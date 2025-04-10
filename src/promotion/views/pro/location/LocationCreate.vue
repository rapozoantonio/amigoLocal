<template>
    <v-form @submit.prevent="createLocation" ref="form">
        <v-toolbar class="toolbar" density="compact">
            <v-container>
                <v-row>
                    <v-col cols="auto">
                        <p class="text-h6">Create Location</p>
                    </v-col>
                    <v-col class="text-right">
                        <v-btn type="button" :to="{ name: 'home' }" size="small" variant="elevated" color="grey"
                            class="ml-4">
                            Cancelar
                        </v-btn>
                        <v-btn v-if="location.region" type="submit" size="small" variant="elevated" color="primary"
                            class="ml-4">
                            Salvar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>
        <v-container>
            <!-- <v-container v-show="location.region"> -->
            <v-row>

                <v-col>
                    <!-- FIELD LOCATION NAME -->
                    <v-text-field placeholder="Location name" variant="underlined" name="name" v-model="location.name"
                        id="name" density="compact">
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" md="7">
                            <v-card flat>
                                <v-card-title>
                                    Address Info
                                </v-card-title>
                                <v-card-text>
                                    <v-row no-gutters>

                                        <!-- FIELD STREET ADDRESS -->
                                        <v-col cols="8">
                                            <label class="text-caption required" for="adress">Street Address</label>
                                            <v-text-field :rules="[rules.required]" v-model="location.address"
                                                class="mt-1" id="address" ref="inputAddress" density="compact"
                                                variant="outlined" placeholder="Address"></v-text-field>
                                        </v-col>
                                        <!-- FIELD POSTAL CODE -->
                                        <v-col class="pl-4" cols="4">
                                            <label class="text-caption required" for="postalcode">Postal Code</label>
                                            <v-text-field :rules="[rules.required]" v-model="location.postalcode"
                                                class="mt-1" id="postalcode" density="compact" variant="outlined"
                                                placeholder="Postal Code"></v-text-field>
                                        </v-col>
                                        <!-- FIELD CITY -->
                                        <v-col cols="6">
                                            <label class="text-caption required" for="city">City</label>
                                            <v-text-field :rules="[rules.required]" v-model="location.city" class="mt-1"
                                                id="city" density="compact" variant="outlined"
                                                placeholder="City"></v-text-field>
                                        </v-col>
                                        <!-- FIELD STATE -->
                                        <v-col class="pl-4" cols="6">
                                            <label class="text-caption" for="state">State</label>
                                            <v-text-field v-model="location.state" class="mt-1" id="state"
                                                density="compact" variant="outlined" placeholder="State"></v-text-field>
                                        </v-col>

                                        <!-- FIELD COUNTRY -->
                                        <v-col cols="6">
                                            <label class="text-caption required" for="country">Country</label>
                                            <field-country v-model="location.country"
                                                :rules="[rules.required]"></field-country>

                                            <!-- <v-autocomplete :rules="[rules.required]" v-model="location.country"
                                                class="mt-1" id="country" :items="countries" density="compact"
                                                variant="outlined" item-value="code" item-title="names.pt"
                                                placeholder="Country"></v-autocomplete> -->
                                        </v-col>
                                        <!-- FIELD REGION -->
                                        <v-col class="pl-4" cols="6">
                                            <label for="region" class="text-caption required ">Região</label>
                                            <field-region class="mt-1" v-model="location.region"
                                                :country="location.country || 'BR'"></field-region>
                                        </v-col>


                                        <!-- ACTION BUTTON - CREATE -->
                                        <!-- <v-col cols="12" class="text-right">
                                            <v-btn type="submit" block class="ml-auto mt-5" variant="elevated"
                                                color="primary">
                                                Criar location
                                            </v-btn>
                                        </v-col> -->
                                    </v-row>

                                </v-card-text>

                            </v-card>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-card flat>
                                <v-card-title>
                                    Geographic Position
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field v-model="location.lat" class="mb-2" hide-details="auto"
                                                id="lat" density="compact" variant="outlined"
                                                placeholder="Latitude"></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field v-model="location.lng" class="mb-2" hide-details="auto"
                                                id="lng" density="compact" variant="outlined"
                                                placeholder="Longitude"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <GoogleMap ref="mapRef" api-key="AIzaSyB52zq22w8i3VaNhWg7ukAE0v-ErxULRng="
                                        style="width: 100%; height: 215px" :center="center" :zoom="15">
                                        <Marker ref="markerRef" @dragend="handlePositionChange"
                                            @position_changed="handleChangePosition" :key="center.lat"
                                            :options="{ position: center, draggable: true }" />
                                    </GoogleMap>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12">
                            <v-card flat>
                                <v-card-title>
                                    Details
                                </v-card-title>
                                <v-card-text>
                                    <v-row no-gutters>

                                        <!-- FIELD DESCRIPTION -->
                                        <v-col cols="12">
                                            <label class="text-caption" for="description">Description</label>
                                            <v-textarea v-model="location.description" class="mt-1" id="description"
                                                density="compact" variant="outlined"
                                                placeholder="Description"></v-textarea>
                                        </v-col>

                                        <!-- FIELD WEBSITE -->
                                        <v-col cols="12">
                                            <label class="text-caption" for="links">Links</label>
                                            <field-links v-model="location.links"></field-links>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <pre>

    {{ location }}
</pre>
        </v-container>
        <v-container v-show="!location.region">
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title>
                            Choose the region where the Location belongs
                        </v-card-title>
                        <v-card-text>
                            <v-chip-group v-if="countries.length > 1 || !location.country" color="primary"
                                variant="elevated" mandatory v-model="location.country">
                                <v-chip label v-for="country in countries" :value="country.code" :key="country.code">{{
                                    country.names.pt }}</v-chip>
                            </v-chip-group>
                            <v-chip-group color="primary" variant="tonal" v-model="location.region">
                                <v-chip label size="large" v-for="region in regions[location.country]"
                                    :value="region.id" :key="region.id">{{ region.name
                                    }}</v-chip>
                            </v-chip-group>
                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
            {{ location }}
        </v-container>
    </v-form>

</template>

<script setup>
// VUE 
import {
    computed,
    onMounted,
    ref,
    watch,
} from 'vue';

import { storeToRefs } from 'pinia';
// GOOGLE MAPS 
import {
    GoogleMap,
    Marker,
} from 'vue3-google-map';
import { useDisplay } from 'vuetify/lib/framework.mjs';

// VARIABLES
import Allcountries from '@/assets/countries.js';
import regions from '@/assets/regions.js';
import FieldCountry from '@/promotion/components/fields/FieldCountry.vue';
import FieldLinks from '@/promotion/components/fields/FieldLinks.vue';
import FieldRegion from '@/promotion/components/fields/FieldRegion.vue';
// FIREBASE
import { useFirebaseStore } from '@/promotion/store/firebase';
import { useLocationStore } from '@/promotion/store/location';
import { Loader } from '@googlemaps/js-api-loader';

const countries = computed(() => {
    return Allcountries.filter(c => c.featured)
})

const rules = ref({
    required: (value) => !!value || "Field is required",
    lengthMin4: (value) => value.length > 3 || "Must be at least 4 characters",
    lengthMin: (value) => value.length > 0 || "Field is required",
});

const firebaseStore = useFirebaseStore();
const locationStore = useLocationStore();
const { xs } = useDisplay();
const center = ref({ lat: 40.689247, lng: -74.044502 });
const mapRef = ref(null);
const form = ref(null);
const markerRef = ref(null);
const inputAddress = ref(null);
const { location } = storeToRefs(locationStore);


function handleChangePosition(pos) {
    
    
    
}

function handlePositionChange({ latLng }) {
    center.value.lat = latLng.lat();
    center.value.lng = latLng.lng();
    location.value.lat = latLng.lat();
    location.value.lng = latLng.lng();
    mapRef.value.map.panTo({ lat: latLng.lat(), lng: latLng.lng() });
}

async function createLocation(event) {
    const { valid, errors } = await event
    

    if (valid) {
        const response = await locationStore.createLocation();
        
    }
    else {
        document.querySelector("#" + errors[0].id).focus();
        return false;
    }

}

watch(() => location.value.country, () => {
    location.value.region = null;
})

async function initGoogleMaps() {
    const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        version: "weekly",
    });
    
    // 
    const input = document.querySelector("#address");
    
    const Places = await loader.importLibrary('places');
    
    const autocomplete = new Places.Autocomplete(input);
    

    function returnAddressComponent(components, include, type = "long_name") {
        const comp = components.find(c => c.types.includes(include));
        if (comp) {
            return comp[type];
        }
        else {
            return null;
        }
    }

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        center.value.lat = lat;
        center.value.lng = lng;
        
        mapRef.value.map.panTo({ lat, lng });
        location.value.name = place.name;
        location.value.address = returnAddressComponent(place.address_components, "route") + " " + returnAddressComponent(place.address_components, "street_number");
        location.value.postalcode = returnAddressComponent(place.address_components, "postal_code");
        location.value.city = returnAddressComponent(place.address_components, "administrative_area_level_2");
        location.value.state = returnAddressComponent(place.address_components, "administrative_area_level_1");
        location.value.country = returnAddressComponent(place.address_components, "country", "short_name");
        location.value.lat = lat;
        location.value.lng = lng;
    });
}

onMounted(async () => {
    await initGoogleMaps();
})

</script>

<style lang="scss">
.v-field__input[name="name"] {
    font-size: 32px;
}

.toolbar {
    position: sticky;
    top: 0px;
    z-index: 1004;
}
</style>