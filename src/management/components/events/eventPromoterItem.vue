<template>
    <v-card class="promoter-card" border="thin" :class="{ 'promoter-active': promoter.active }">
        <div class="promoter-header d-flex px-4 pt-4 pb-2">
            <v-avatar size="64" :color="promoter.active ? 'success' : 'grey'">
                <span v-if="!promoter.avatar" class="text-h5 text-white">
                    {{ promoter.name.charAt(0) }}
                </span>
                <v-img v-else :src="promoter.avatar" alt="avatar" />
            </v-avatar>
            <div class="ml-4 flex-grow-1">
                <div class="d-flex justify-space-between align-center">
                    <div class="text-subtitle-1 font-weight-bold">
                        {{ promoter.name }}
                    </div>
                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon variant="text" size="small" class="ma-0">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list density="compact">
                            <v-list-item prepend-icon="mdi-pencil" title="Editar" @click="editPromoter(promoter)" />
                            <v-list-item :prepend-icon="promoter.active
                                ? 'mdi-account-off'
                                : 'mdi-account-check'
                                " :title="promoter.active ? 'Desativar' : 'Ativar'"
                                @click="togglePromoterStatus(promoter)" />
                            <v-list-item base-color="red" prepend-icon="mdi-delete" title="Deletar"
                                @click="deletePromoter(promoter)" />

                        </v-list>
                    </v-menu>
                </div>
                <div class="text-caption text-grey-darken-1">
                    <v-icon size="14" start>mdi-email</v-icon>
                    {{ promoter.email }}
                </div>
                <div class="text-caption text-grey-darken-1">
                    <v-icon size="14" start>mdi-phone</v-icon>
                    {{ promoter.phone }}
                </div>
                <v-chip size="x-small" :color="promoter.active ? 'success' : 'grey'" class="mt-1">
                    {{ promoter.active ? "Ativo" : "Inativo" }}
                </v-chip>
            </div>
        </div>
        <v-divider />
        <v-card-text class="pa-0">
            <div class="performance-stats d-flex text-center">
                <div class="stat-block flex-1 pa-2">
                    <div class="text-body-1 font-weight-bold">
                        {{ promoter.guests }}
                    </div>
                    <div class="text-caption">Convidados</div>
                </div>
                <v-divider vertical />
                <div class="stat-block flex-1 pa-2">
                    <div class="text-body-1 font-weight-bold">
                        {{ promoter.checkIns }}
                    </div>
                    <div class="text-caption">Check-ins</div>
                </div>
                <v-divider vertical />
                <div class="stat-block flex-1 pa-2">
                    <div class="text-body-1 font-weight-bold">
                        {{ formatCurrency(promoter.revenue) }}
                    </div>
                    <div class="text-caption">Receita</div>
                </div>
            </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-2">
            <v-btn variant="text" color="primary" prepend-icon="mdi-pencil" block @click="editPromoter(promoter)">
                Editar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import {
    formatCurrency,
} from '@/management/consts/promotersMockData';
import { toRefs } from 'vue';


const props = defineProps(["promoter"]);
const { promoter } = toRefs(props);
const emit = defineEmits(["promoter:edit", "promoter:update", "promoter:delete"])

function editPromoter(promoter) {
    emit("promoter:edit", promoter);
}

function deletePromoter(promoter) {
    emit("promoter:delete", promoter);
}

function togglePromoterStatus(promoter) {
    const promoterToUpdate = { ...promoter, active: !promoter.active }
    emit("promoter:update", promoterToUpdate)
}

</script>
