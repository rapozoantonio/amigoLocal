<template>
    <section class="bg-grey-darken-4 flex-grow-1">
        <v-container>
            <v-row v-for="(events, day) in nextEvents" :key="day">
                <v-col cols="12" class="py-0">
                    <v-toolbar color="grey-darken-4" style="position: sticky; top: 48px; z-index: 999"
                        density="compact">
                        <v-toolbar-title>
                            <p class="text-h7">
                                <v-icon size="x-small">mdi-calendar</v-icon>
                                {{ day }}
                            </p>
                        </v-toolbar-title>
                    </v-toolbar>
                    <promoter-card-horizontal v-for="event in events" :key="event.id"
                        :event="event"></promoter-card-horizontal>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { storeToRefs } from 'pinia';

import PromoterCardHorizontal from '@/components/promoters/PromoterCardHorizontal.vue';
import { useEventsStore } from '@/store/events';

const eventsStore = useEventsStore();

const { nextEvents } = storeToRefs(eventsStore);
onMounted(async () => {
    const eventsPromoter = await eventsStore.getEventsByPromoterId("1");
    console.log(eventsPromoter);
    //console.log({eventsRegion});
});
</script>

<style lang="scss" scoped>
img {
    display: block;
    width: 100%;
}
</style>