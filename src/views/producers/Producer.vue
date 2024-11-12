<template>
    <div v-if="producer">
        <!-- HERO  -->
        <section class="bg-grey-darken-4">
            <v-container>
                <v-row class="mt-10">
                    <v-col>
                        <v-btn class="pl-0" variant="plain" size="small">
                            <v-icon start>mdi-chevron-left</v-icon>
                            <v-icon class="rounded-pill">fi fi-es fis</v-icon>
                            <span class="ml-2">Madrid</span></v-btn>
                        <h1 class="text-h2 font-weight-bold">{{ producer.name }}</h1>
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
                                :to="{ name: 'producer-info' }">Información general</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" exact variant="plain" slim
                                :to="{ name: 'producer-events' }">Próximos eventos</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" variant="plain" slim exact
                                :to="{ name: 'producer-past-events' }">Eventos passados</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" slim exact variant="plain"
                                :to="{ name: 'producer-news' }">Noticias</v-tab>
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
                    <component :is="Component" :key="$route.fullPath" :producer="producer"></component>
                </v-slide-x-transition>
            </router-view>
        </section>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';

import { useProducersStore } from '@/store/producers';

const { id, entity } = defineProps(["id", "entity"]);

const producersStore = useProducersStore();

const { producer } = storeToRefs(producersStore);

onMounted(() => {
    
    producersStore.getProducerById(id);
})

</script>

<style lang="scss" scoped>
.w-min-0 {
    min-width: 0px !important;
}
</style>