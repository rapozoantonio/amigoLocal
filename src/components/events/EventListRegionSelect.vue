<template>
    <v-container v-if="regions">
        <v-row>
            <v-col cols="12">
                <v-btn variant="plain" height="100" @click="regionSelectionOpened = true">
                    <v-avatar size="30" class="mr-4">
                        <v-img :src="'https://flagcdn.com/' + country.toLowerCase() + '.svg'"></v-img>
                    </v-avatar>
                    <span class="text-h4">{{ regionById(region, country.toUpperCase()).name }}</span>
                    <v-icon class="ml-2" size="x-large">mdi-chevron-down</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-navigation-drawer floating temporary width="350" location="right" v-model="regionSelectionOpened">
            <v-list>
                <v-list-item :to="{ name: 'events', params: { country, region: region.id } }"
                    v-for="(region) in regions[country.toUpperCase()]" :key="region.id" link>

                    <template v-slot:prepend>
                        <v-avatar size="30">
                            <v-img :src="'https://flagcdn.com/' + country.toLowerCase() + '.svg'"></v-img>
                        </v-avatar>
                    </template>
                    <v-list-item-title> {{ region.name }} </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<script setup>
import {
  onMounted,
  ref,
} from 'vue';

import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

import { useConfigStore } from '@/store/config';

const route = useRoute();
const { region, country } = route.params;
const configStore = useConfigStore();

const { regions, regionById } = storeToRefs(configStore);

const regionSelectionOpened = ref(false);

// function selectRegion(region) {
//     region.value = city;
//     regionSelectionOpened.value = false;
// }

onMounted(() => {
    configStore.getEventConfig();
})
</script>

<style lang="scss" scoped></style>