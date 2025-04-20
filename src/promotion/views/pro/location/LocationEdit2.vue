<template>
    {{ location }}
    <v-form ref="form" v-if="location">
        <v-container>
            <v-row>
                <v-col>
                    <!-- FIELD LOCATION NAME -->
                    <v-text-field placeholder="Location name" variant="underlined" name="name" v-model="location.name"
                        id="name" density="compact">
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="7">
                            <v-card>
                                <v-card-title>
                                    Address Info
                                </v-card-title>
                                <v-card-text>
                                    <v-row no-gutters>

                                        <!-- FIELD STREET ADDRESS -->
                                        <v-col cols="8">
                                            <label class="text-caption" for="adress">Street Address</label>
                                            <v-text-field v-model="location.address" class="mt-1" id="address"
                                                ref="inputAddress" density="compact" variant="outlined"
                                                placeholder="Address"></v-text-field>
                                        </v-col>
                                        <!-- FIELD POSTAL CODE -->
                                        <v-col class="pl-4" cols="4">
                                            <label class="text-caption" for="postalcode">Postal Code</label>
                                            <v-text-field v-model="location.postalcode" class="mt-1" id="postalcode"
                                                density="compact" variant="outlined"
                                                placeholder="Postal Code"></v-text-field>
                                        </v-col>
                                        <!-- FIELD CITY -->
                                        <v-col cols="5">
                                            <label class="text-caption" for="city">City</label>
                                            <v-text-field v-model="location.city" class="mt-1" id="city"
                                                density="compact" variant="outlined" placeholder="City"></v-text-field>
                                        </v-col>
                                        <!-- FIELD STATE -->
                                        <v-col class="pl-4" cols="4">
                                            <label class="text-caption" for="state">State</label>
                                            <v-text-field v-model="location.state" class="mt-1" id="state"
                                                density="compact" variant="outlined" placeholder="State"></v-text-field>
                                        </v-col>
                                        <!-- FIELD COUNTRY -->
                                        <v-col class="pl-4" cols="3">
                                            <label class="text-caption" for="country">Country</label>
                                            <v-autocomplete v-model="location.country" class="mt-1" id="country"
                                                :items="countries" density="compact" variant="outlined"
                                                item-value="code" item-title="names.pt"
                                                placeholder="Country"></v-autocomplete>
                                        </v-col>

                                        <!-- ACTION BUTTON - CREATE -->
                                        <v-col class="text-right">
                                            <v-btn @click="saveLocation" block class="ml-auto mt-5" variant="elevated"
                                                color="primary">
                                                Save location
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-card-text>

                            </v-card>
                        </v-col>
                        <v-col cols="5">
                            <v-card>
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
                                        style="width: 100%; height: 250px" :center="location.lat ? location : center"
                                        :zoom="15">
                                        <Marker ref="markerRef" @dragend="handlePositionChange"
                                            @position_changed="handleChangePosition" :key="location.lat"
                                            :options="{ position: location, draggable: true }" />
                                    </GoogleMap>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-form>

</template>

<script setup>
// VUE 
import {
    onMounted,
    ref,
} from 'vue';

import { useRoute } from 'vue-router';
// GOOGLE MAPS 
import {
    GoogleMap,
    Marker,
} from 'vue3-google-map';

// VARIABLES
import countries from '@/core/assets/countries.js';
// FIREBASE
import { useFirebaseStore } from '@/promotion/store/firebase';
import { Loader } from '@googlemaps/js-api-loader';

const firebaseStore = useFirebaseStore();
const route = useRoute();
const center = ref({ lat: 40.689247, lng: -74.044502 });
const mapRef = ref(null);
const form = ref(null);
const markerRef = ref(null);
const inputAddress = ref(null);
const location = ref(null);

function handleChangePosition(pos) {
    
    
    
}

function handlePositionChange({ latLng }) {
    center.value.lat = latLng.lat();
    center.value.lng = latLng.lng();
    location.value.lat = latLng.lat();
    location.value.lng = latLng.lng();
    mapRef.value.map.panTo({ lat: latLng.lat(), lng: latLng.lng() });
}

async function saveLocation() {
    const response = await firebaseStore.putDocument("locations", route.params.id, location.value);
    if (response.ok) {
        response.notify();
    }
}

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

async function getLocation() {
    const response = await firebaseStore.getDocumentById("locations", route.params.id);
    if (response.ok) {
        location.value = response.data;
        
    }
    
}

onMounted(async () => {
    await getLocation();
    await initGoogleMaps();

})

</script>

<style lang="scss">
.v-field__input[name="name"] {
    font-size: 32px;
}
</style>