<template>
    <v-card border="thin" flat class="promoters-table">
        <v-data-table :headers="tableHeaders" :items="promoters" :items-per-page="10" item-value="id"
            class="elevation-0">
            <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                    <v-avatar size="32" :color="item.active ? 'success' : 'grey'" class="me-2">
                        <span class="text-caption text-white">{{
                            item.name.charAt(0)
                            }}</span>
                    </v-avatar>
                    <span>{{ item.name }}</span>
                </div>
            </template>
            <template v-slot:item.active="{ item }">
                <v-chip size="small" :color="item.active ? 'success' : 'grey'" text-color="white">
                    {{ item.active ? "Ativo" : "Inativo" }}
                </v-chip>
            </template>
            <template v-slot:item.conversionRate="{ item }">
                {{ calculateConversionRate(item) }}%
            </template>
            <template v-slot:item.revenue="{ item }">
                {{ formatCurrency(item.revenue) }}
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="d-flex">
                    <v-btn icon variant="text" size="small" color="primary" class="me-1" @click="editPromoter(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" size="small" :color="item.active ? 'error' : 'success'"
                        @click="togglePromoterStatus(item)">
                        <v-icon>
                            {{
                                item.active ? "mdi-account-off" : "mdi-account-check"
                            }}
                        </v-icon>
                    </v-btn>
                </div>
            </template>
        </v-data-table>
    </v-card>

</template>

<script setup>
import { toRefs, ref } from 'vue';

import {
    promoterTableHeaders,
    calculateConversionRate,
    formatCurrency
} from '@/management/consts/promotersMockData';


const emit = defineEmits(["promoter:edit", "promoter:update"])


const props = defineProps(["promoters"]);
const { promoters } = toRefs(props);
const tableHeaders = ref(promoterTableHeaders);


function editPromoter(promoter) {
    emit("promoter:edit", promoter);
}

function togglePromoterStatus(promoter) {
    const promoterToUpdate = { ...promoter, active: !promoter.active }
    emit("promoter:update", promoterToUpdate)
}


</script>

<style lang="scss" scoped></style>