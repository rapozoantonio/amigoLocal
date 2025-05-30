<template>
    <event-dashboard-card title="Desempenho de Promotores" size="small">
        <template #title-actions>
            <v-btn variant="text" color="primary" size="small" rounded class="text-none px-2"
                @click="showAllPromoters = !showAllPromoters">
                {{ showAllPromoters ? "Top 3" : "Ver todos" }}
            </v-btn>
        </template>
        <div class="promoter-list">
            <div v-for="(promoter, index) in displayedPromoters" :key="promoter.id" class="promoter-item"
                :class="{ 'top-promoter': index < 3 }">
                <div class="d-flex align-center">
                    <div class="promoter-rank" :class="{ 'top-rank': index < 3 }">
                        {{ index + 1 }}
                    </div>
                    <div class="promoter-avatar">
                        <v-avatar size="32" :color="promoter.color">
                            <span class="text-white">{{
                                promoter.email.charAt(0)
                                }}</span>
                        </v-avatar>
                    </div>
                    <div class="promoter-details ml-2">
                        <div class="promoter-name">{{ promoter.email }}</div>
                        <div class="promoter-stats text-caption">
                            {{ promoter.guests }} convidados •
                            {{ formatCurrency(promoter.revenue) }}
                        </div>
                    </div>
                </div>

                <div class="promoter-progress">
                    <div class="progress-bar" :style="{
                        width: `${(promoter.guests / guests.length) * 100}%`,
                        backgroundColor: promoter.color,
                    }"></div>
                </div>
            </div>
        </div>
    </event-dashboard-card>
</template>

<script setup>
import { toRefs, ref, computed, inject } from 'vue';
import EventDashboardCard from './EventDashboardCard.vue';
const { getRandomColor, formatCurrency } = inject("$helpers");


const props = defineProps(["guests", "promoters"]);
const { guests, promoters } = toRefs(props);


const showAllPromoters = ref(false);

// Filter promoters based on showAll toggle
const displayedPromoters = computed(() => {
    return showAllPromoters.value ? promotersList.value : promotersList.value.slice(0, 3);
});

const promotersList = computed(() => {
    if (!promoters.value && promoters.value.length === 0) {
        return [];
    }

    const guestPromotersId = [...new Set(guests.value.map((guest) => guest.promoter.id))];
    console.log({ guestPromotersId });

    const promotersObject = guests.value.reduce((total, guest) => {
        if (!total.hasOwnProperty(guest.promoter.id)) {
            total[guest.promoter.id] = guest.promoter;
        }
        return total
    }, {});


    const colorsArray = Object.values(promotersObject).reduce((finalColors, list) => {
        const color = getRandomColor([...finalColors]);
        finalColors.push(color);
        return finalColors;
    }, [])


    console.log({ promotersObject })
    return Object.values(promotersObject).map((promoter, index) => {
        return {
            ...promoter,
            color: colorsArray[index],
            guests: guests.value.filter(guest => guest.promoter.id === promoter.id).length,
            revenue: guests.value.reduce((total, guest) => {
                if (guest.promoter.id === promoter.id) {
                    total = total + (guest.price ? guest.price : 0);
                }
                return total;
            }, 0)
        }
    })
});





</script>

<style lang="scss" scoped></style>