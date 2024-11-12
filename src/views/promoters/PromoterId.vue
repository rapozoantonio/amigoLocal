<template>
    <div>
        <!-- HERO  -->
        <promoter-id-header :promoter="promoterInfo"></promoter-id-header>
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