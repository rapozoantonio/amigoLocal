<template>
    <template v-if="location">
        <form-card @submit="saveLocation" v-model:model="location" title="Edit Location" action="Save Location"
            :schema="locationSchema" v-model:files="files"></form-card>
    </template>


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
import FormCard from '@/promotion/components/form/FormCard.vue';
import locationSchema from '@/core/schemas/locationSchema';
// FIREBASE
import { useFirebaseStore } from '@/core/store/firebase';
import { Loader } from '@googlemaps/js-api-loader';

const firebaseStore = useFirebaseStore();
const route = useRoute();
const center = ref({ lat: 40.689247, lng: -74.044502 });
const mapRef = ref(null);
const form = ref(null);
const markerRef = ref(null);
const inputAddress = ref(null);
const location = ref(null);
const files = {
    image: null
}

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
    // await initGoogleMaps();

})

</script>

<style lang="scss">
.v-field__input[name="name"] {
    font-size: 32px;
}
</style>