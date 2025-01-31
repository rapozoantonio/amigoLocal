<template>
    <v-container v-if="regions" class="py-0" >
        <v-row>
            <v-col cols="12">
                <!-- Adjusted button size and font size for mobile -->
                <v-btn variant="plain" height="60" @click="regionSelectionOpened = true">
                    <v-avatar size="24" class="mr-2">
                        <v-img :src="'https://flagcdn.com/' + country.toLowerCase() + '.svg'"></v-img>
                    </v-avatar>
                    <span class="text-h6">{{ regionById(region, country.toUpperCase()).name }}</span>
                    <v-icon class="ml-2" size="medium">mdi-chevron-down</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <!-- Responsive navigation drawer -->
        <v-navigation-drawer floating temporary :width="drawerWidth" location="right" v-model="regionSelectionOpened">
            <v-list>
                <v-list-item :to="{ name: 'events', params: { country, region: region.id } }"
                    v-for="(region) in regions[country.toUpperCase()]" :key="region.id" link>

                    <template v-slot:prepend>
                        <v-avatar size="24">
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
  computed,
} from 'vue';

import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

import { useConfigStore } from '@/store/config';

const route = useRoute();
const { region, country } = route.params;
const configStore = useConfigStore();

const { regions, regionById } = storeToRefs(configStore);

const regionSelectionOpened = ref(false);

// Responsive drawer width
const drawerWidth = computed(() => {
    return window.innerWidth > 600 ? 350 : window.innerWidth * 0.9;
});

onMounted(() => {
    configStore.getEventConfig();
})
</script>
