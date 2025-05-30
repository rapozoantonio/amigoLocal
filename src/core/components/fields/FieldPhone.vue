<template>
    <div class="d-flex align-top">
        <v-btn height="40" variant="outlined" class="pa-0 mr-0" style="border: solid 2px rgba(255,255,255,0.4)"
            :rounded="fieldAttrs.rounded ? fieldAttrs.rounded + ' e-0' : 'e-0'">
            <v-icon size="25" :key="selectedCountry">
                <v-img contain :src="'https://flagcdn.com/' + selectedCountry?.toLowerCase() + '.svg'"></v-img>
            </v-icon>
            <v-icon class="ml-1" size="x-small">mdi-menu-down</v-icon>
            <v-menu v-model="showMenuCountry" eager activator="parent" :close-on-content-click="false">
                <v-card width="300">
                    <v-text-field density="compact" ref="countrySearchInput" v-model="countrySearch"
                        placeholder="Buscar por pais ou codigo"></v-text-field>
                    <v-list max-height="300">
                        <v-list-item v-for="(country) in filteredCountries" :key="country.code" :value="country.code"
                            @click="selectCountry(country.code)">
                            <v-list-item-title>
                                <v-icon size="25" start>
                                    <v-img contain
                                        :src="'https://flagcdn.com/' + country?.code?.toLowerCase() + '.svg'">
                                    </v-img>
                                </v-icon>
                                {{ country.title }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>

                </v-card>
            </v-menu>
        </v-btn>
        <v-text-field @input="changeInput" v-bind="{ ...fieldAttrs, ...$attrs }"
            :rules="[() => { return (phoneNumber && !valid) ? 'Number Invalido' : true }, ...$attrs.rules]"
            v-model="phoneNumber" :label="label ? typeof label === 'string' ? label : 'Phone' : ''"
            validate-on="invalid-input" :rounded="fieldAttrs.rounded ? fieldAttrs.rounded + ' s-0' : 's-0'">
            <template #append-inner>
                <v-icon v-tooltip:top="'Número valido'" v-if="valid" color="success">mdi-check-circle</v-icon>
                <v-icon v-tooltip:top="'Número não é valido'" v-else-if="phoneNumber"
                    color="error">mdi-close-circle</v-icon>
            </template>
        </v-text-field>

    </div>
</template>

<script setup>
import {
    defineModel, inject, ref
} from 'vue';

import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';


import * as countryCodes from "country-codes-list";
import { phone } from 'phone';
import { computed } from 'vue';

const phoneNumber = ref(null);

const showMenuCountry = ref(false);
const selectedCountry = ref("BR")
const countrySearch = ref(null);
const countrySearchInput = ref(null);
const myCountryCodesObject = countryCodes.customList(
    "countryCode",
    "{countryNameEn}: +{countryCallingCode}"
);

const valid = ref(false);

const filteredCountries = computed(() => {
    if (!countrySearch.value || countrySearch.value === "") return Object.entries(myCountryCodesObject).map(e => ({ title: e[1], code: e[0] }));

    return Object.entries(myCountryCodesObject).map(e => ({ title: e[1], code: e[0] })).filter(country => {
        const regex = new RegExp(countrySearch.value, "gi");
        return regex.test(country.title || country.code)
    })
})

console.log(myCountryCodesObject)

const { label } = defineProps({ label: { type: [Boolean, String], default: false } })
const { fieldAttrs } = inject("$helpers");
const model = defineModel();
const phoneInputFocus = ref(false);

function focusCountryInput() {
    console.log({ countrySearchInput: countrySearchInput.value })
    countrySearchInput.value.click();
}

function focusPhoneInput() {
    phoneInputFocus.value = true;
}

function selectCountry(code) {
    selectedCountry.value = code;
    showMenuCountry.value = false;
    countrySearch.value = null;
    validatePhone();
}

function validatePhone() {
    const response = phone(phoneNumber.value, { country: selectedCountry.value });
    console.log({ phoneResponse: response })
    if (response.isValid) {
        valid.value = response.isValid;
        model.value = response.phoneNumber;
    }
    else {
        valid.value = false;
        model.value = null;

    }
}

function changeInput() {
    validatePhone();
}
</script>

<style lang="scss" scoped></style>