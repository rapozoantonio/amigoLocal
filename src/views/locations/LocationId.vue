<template>
    <div v-if="location">
        <!-- HERO  -->
        <section>
            <v-container>
                <v-row class="mt-10">
                    <v-col>
                        <v-btn class="pl-0" variant="plain" size="small"
                            :to="{ name: 'events', params: { country: location.country, region: location.region.id } }">
                            <v-icon start>mdi-chevron-left</v-icon>
                            <v-icon class="rounded-pill">fi fi-{{ location.country.toLowerCase() }} fis</v-icon>
                            <span class="ml-2">{{ location.region.name }}</span></v-btn>
                        <h1 class="text-h2 font-weight-bold">{{ location.name }}</h1>
                    </v-col>
                </v-row>
            </v-container>
        </section>
        <!-- TOOLBAR VIEW -->
        <section class="bg-black" v-if="false">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-tabs color="primary" density="compact">
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" variant="plain" slim exact
                                :to="{ name: 'location-info' }">Información general</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" exact variant="plain" slim
                                :to="{ name: 'location-events' }">Próximos eventos</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" variant="plain" slim exact
                                :to="{ name: 'location-past-events' }">Eventos passados</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" slim exact variant="plain"
                                :to="{ name: 'location-news' }">Noticias</v-tab>
                        </v-tabs>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider></v-divider>
        </section>
        <!-- MAIN VIEW -->
        <section>
            <router-view v-slot="{ Component }">
                <v-slide-x-transition mode="out-in">
                    <component :key="route.fullPath" :location="location" :is="Component"></component>
                </v-slide-x-transition>
            </router-view>
        </section>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

import { useLocationsStore } from '@/store/locations';

const { id } = defineProps(["id"]);
const locationsStore = useLocationsStore();
const { location } = storeToRefs(locationsStore);
const route = useRoute();

onMounted(() => {
    
    locationsStore.getLocationById(id)
})

</script>

<style lang="scss" scoped>
.w-min-0 {
    min-width: 0px !important;
}
</style>