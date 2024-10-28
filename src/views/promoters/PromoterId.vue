<template>
    <div>
        <!-- HERO  -->

        <promoter-id-header :promoter="promoterInfo"></promoter-id-header>
        <!-- TOOLBAR VIEW -->
        <section class="bg-black" v-if="true">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-tabs color="primary" density="compact">
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" exact variant="plain" slim
                                :to="{ name: 'promoter-events' }">Proximos eventos</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" variant="plain" slim exact
                                :to="{ name: 'promoter-past-events' }">Carnaval</v-tab>
                            <v-tab class="text-subtitle-2 px-0 mr-4 w-min-0" slim exact variant="plain"
                                :to="{ name: 'promoter-news' }">Reveillon</v-tab>
                        </v-tabs>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider></v-divider>
        </section>
        <promoter-event-list></promoter-event-list>
        <!-- MAIN VIEW -->


    </div>
</template>

<script setup>
// TODO: promoter-event-list not working, fix it
import PromoterIdHeader from '@/components/promoters/PromoterIdHeader.vue';
import PromoterEventList from '@/components/promoters/PromoterEventList.vue';

import { useEventsStore } from '@/store/events';
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';
const { id, entity } = defineProps(["id", "entity"]);
const promoterInfo = {
    Id: 'WfQ8VLzzoIRPSePLaeCc2lvyPO03',
    PromoterName: 'Promoter Name',
    PromoterCode: 'PROMOTERCODE',
    LastUpdate: '2022-02-02',
    Followers: 127,
    LocationArray: ['Rio de Janeiro', 'São Paulo', 'Belo Horizonte', 'Brasília'],
    EventCategoryArray: ['Open-Bar'],	
    MusicTypeArray: ['Rock', 'Pop', 'Sertanejo'],
    Instagram: '@jubilos',
    Twitter: '@jubilos',
    Tiktok: '@jubilos',
    Whatsapp: '21999999999',	
};
const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);

onMounted(() => {
    eventsStore.getEventById('YU6axFX6Oy6dZg7molHT');
    eventsStore.getEventsByRegion("BR");
});
</script>

<style lang="scss" scoped>
.w-min-0 {
    min-width: 0px !important;
}
</style>