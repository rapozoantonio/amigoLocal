<template>
    <v-card border="thin" flat class="leaderboard-card">
        <v-tabs v-model="leaderboardMetric" color="primary" align-tabs="center" class="mb-2">
            <v-tab value="guests">Convidados</v-tab>
            <v-tab value="checkIns">Check-ins</v-tab>
            <v-tab value="revenue">Receita</v-tab>
            <v-tab value="conversion">Conversão</v-tab>
        </v-tabs>
        <v-window v-model="leaderboardMetric">
            <v-window-item v-for="metric in [
                'guests',
                'checkIns',
                'revenue',
                'conversion',
            ]" :key="metric" :value="metric">
                <div class="leaderboard-list pa-2">
                    <div v-for="(promoter, index) in getSortedPromotersByMetric(
                        promoters,
                        metric
                    )" :key="promoter.id" class="leaderboard-item d-flex align-center pa-3 mb-2" :class="{
                        'top-1': index === 0,
                        'top-2': index === 1,
                        'top-3': index === 2,
                    }">
                        <div class="rank-badge" :class="`rank-${index + 1}`">
                            {{ index + 1 }}
                        </div>
                        <v-avatar size="40" :color="getLeaderboardAvatarColor(index)" class="ms-2">
                            <span class="text-white">{{
                                promoter.name.charAt(0)
                                }}</span>
                        </v-avatar>
                        <div class="ms-3 flex-grow-1">
                            <div class="font-weight-medium">
                                {{ promoter.name }}
                            </div>
                            <div class="text-caption text-grey-darken-1">
                                {{ promoter.active ? "Ativo" : "Inativo" }} •
                                {{ promoter.guests }} convidados
                            </div>
                        </div>
                        <div class="metric-value font-weight-bold">
                            <template v-if="metric === 'guests'">
                                {{ promoter.guests }}
                            </template>
                            <template v-else-if="metric === 'checkIns'">
                                {{ promoter.checkIns }}
                            </template>
                            <template v-else-if="metric === 'revenue'">
                                {{ formatCurrency(promoter.revenue) }}
                            </template>
                            <template v-else-if="metric === 'conversion'">
                                {{ calculateConversionRate(promoter) }}%
                            </template>
                        </div>
                    </div>
                </div>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script setup>

import { ref, toRefs } from 'vue';
import {
    mockPromoters,
    promoterTableHeaders,
    statusOptions,
    calculateConversionRate,
    formatCurrency,
    getLeaderboardAvatarColor,
    getSortedPromotersByMetric
} from '@/management/consts/promotersMockData';

const leaderboardMetric = ref("guests");

const props = defineProps(["promoters"]);
const { promoters } = toRefs(props);




</script>
