<template>
    <v-autocomplete v-if="regions[country]" v-bind="{ ...fieldAttrs, ...$attrs }" :items="regions[country]"
        return-object item-title="name" id="region" v-model="region">
    </v-autocomplete>
    <v-autocomplete v-else :items="[{ name: 'All', id: 'all' }]" item-title="name" item-value="id" id="region"
        v-bind="{ ...fieldAttrs, ...$attrs }" v-model="region">
    </v-autocomplete>
</template>

<script setup>
import {
  defineModel,
  inject,
  watch,
} from 'vue';

import { storeToRefs } from 'pinia';

import { useConfigStore } from '@/store/config';

const region = defineModel();
const { country } = defineProps({ country: { type: String, default: "BR" } })
const configStore = useConfigStore();
const { regions } = storeToRefs(configStore);
const { fieldAttrs, rules } = inject("$helpers");


</script>

<style lang="scss" scoped></style>