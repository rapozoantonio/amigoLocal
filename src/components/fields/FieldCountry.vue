<template>
    <div>
        <v-autocomplete v-if="countries" hide-details="auto" :items="countries" item-value="code" item-title="names.pt"
            v-bind="{ ...fieldAttrs, ...$attrs }" v-model="country"
            :label="label ? typeof label === 'string' ? label : 'Country' : ''" mandatory>
            <template v-slot:prepend-inner>
                <v-avatar size="x-small">
                    <v-img :src="'https://flagcdn.com/' + country?.toLowerCase() + '.svg'"></v-img>
                </v-avatar>
            </template>
            <template v-slot:item="{ props, item }">
                <v-list-item density="compact" v-bind="props" :prepend-avatar="item.raw.flag"
                    :title="item.raw.names.pt">
                    <template v-slot:prepend>
                        <v-avatar size="small">
                            <v-img :src="'https://flagcdn.com/' + item.raw.code?.toLowerCase() + '.svg'"></v-img>
                        </v-avatar>
                    </template>
                </v-list-item>
            </template>
        </v-autocomplete>
    </div>
</template>

<script setup>
import {
  defineModel,
  inject,
} from 'vue';

import { storeToRefs } from 'pinia';

import { useConfigStore } from '@/store/config';

const { label } = defineProps({ label: { type: [Boolean, String], default: false } })

const country = defineModel();
const configStore = useConfigStore();
const { countries } = storeToRefs(configStore);
const { fieldAttrs, rules } = inject("$helpers");

</script>

<style lang="scss" scoped></style>