<template>
    <v-form @submit.prevent="createAndAssociate" ref="form">
        <v-row dense>
            <!-- FIELD NAME -->
            <v-col cols="12">
                <label class="text-caption required" for="adress">Name</label>
                <v-text-field :rules="[rules.required]" v-model="location.name" class="mt-1" id="name"
                    v-bind="fieldAttrs" label="Name"></v-text-field>
            </v-col>

            <!-- FIELD STREET ADDRESS -->
            <v-col cols="12">
                <label class="text-caption required" for="adress">Street Address</label>
                <v-text-field :rules="[rules.required]" v-model="location.address" class="mt-1" id="address"
                    ref="inputAddress" v-bind="fieldAttrs" label="Address"></v-text-field>
            </v-col>

            <!-- FIELD CITY -->
            <v-col cols="12">
                <label class="text-caption required" for="city">City</label>
                <v-text-field :rules="[rules.required]" v-model="location.city" class="mt-1" id="city"
                    v-bind="fieldAttrs" placeholder="City"></v-text-field>
            </v-col>

            <!-- FIELD COUNTRY -->
            <v-col cols="12">
                <label class="text-caption required" for="country">Country</label>
                <field-country class="mt-1" v-model="location.country"></field-country>
            </v-col>

            <!-- FIELD REGION -->
            <v-col cols="12">
                <label for="region" class="text-caption required ">Região</label>
                <field-region class="mt-1" v-model="location.region" :country="location.country || 'BR'"></field-region>
            </v-col>

            <v-col cols="12">
                <v-btn type="submit" class="mt-5" block color="primary">
                    Create and associate
                </v-btn>
            </v-col>
            <pre>
                {{ location }}

            </pre>
        </v-row>
    </v-form>
</template>

<script setup>
import {
  inject,
  ref,
} from 'vue';

import { storeToRefs } from 'pinia';

import FieldCountry from '@/promotion/components/fields/FieldCountry.vue';
import FieldRegion from '@/promotion/components/fields/FieldRegion.vue';
import { useLocationStore } from '@/promotion/store/location';

const locationStore = useLocationStore();

const emit = defineEmits(["create"])
const { location } = storeToRefs(locationStore);
const { fieldAttrs, rules } = inject("$helpers");
const form = ref(null);

async function createAndAssociate(event) {
    const { valid, errors } = await event
    
    if (valid) {
        const response = await locationStore.createLocation(false);
        
        if (response.ok) {
            emit("create", response.data.document)
        }
    }
    else {
        document.querySelector("#" + errors[0].id).focus();
        return false;
    }
}


</script>

<style lang="scss" scoped></style>