<template>
    <event-dashboard-card title="Receita por Lista" size="small">
        <template #title-actions>
            <v-chip variant="tonal" label color="success" size="small" prepend-icon="mdi-cash">
                {{ helpers.formatCurrency(totalRevenue) }}
            </v-chip>
        </template>
        <div class="mt-2">
            <div v-for="(list, index) in listRevenue" :key="index" class="list-revenue-item mb-3">
                <div class="d-flex justify-space-between align-center mb-1">
                    <div class="d-flex align-center">
                        <v-avatar rounded="sm" size="20" class="mr-2" :color="list.color">
                            <v-icon size="12" color="white">{{ list.icon }}</v-icon>
                        </v-avatar>
                        <span class="text-body-2">{{ list.name }}</span>
                    </div>
                    <span class="text-body-2 font-weight-medium">{{
                        helpers.formatCurrency(list.revenue)
                    }}</span>
                </div>
                <v-progress-linear :model-value="(list.revenue / totalRevenue) * 100" :color="list.color" rounded="lg"
                    :height="6"></v-progress-linear>

                <div class="d-flex justify-space-between text-caption text-grey mt-1">
                    <span>{{ list.checkIns }} check-ins</span>
                    <span>{{
                        Math.round((list.revenue / totalRevenue) * 100)
                    }}%</span>
                </div>
            </div>
        </div>
        <div class="text-center mt-2 mb-4">
            <v-chip :color="revenueProgress.color" size="small">
                {{ revenueProgress.text }}
            </v-chip>
        </div>
    </event-dashboard-card>
</template>

<script setup>
import { toRefs, computed, inject } from 'vue';
import EventDashboardCard from './EventDashboardCard.vue';

const props = defineProps(["listRevenue", "totalRevenue", "revenuePrediction"]);
const helpers = inject("$helpers");
const { listRevenue, totalRevenue, revenuePrediction } = toRefs(props);

// Revenue progress status
const revenueProgress = computed(() => {
    const percentage = Math.round(
        (totalRevenue.value / revenuePrediction.value) * 100
    );

    if (percentage >= 100) {
        return { text: "Meta atingida!", color: "success" };
    } else if (percentage >= 75) {
        return { text: `${percentage}% da meta`, color: "info" };
    } else if (percentage >= 50) {
        return { text: `${percentage}% da meta`, color: "warning" };
    } else {
        return { text: `${percentage}% da meta`, color: "error" };
    }
});


</script>

<style lang="scss" scoped></style>