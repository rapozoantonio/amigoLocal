<template>
    <v-card class="hostess-card" border="thin" :class="{ 'hostess-confirmed': hostess.confirmed }">
        <div class="hostess-header d-flex px-4 pt-4 pb-2">
            <v-avatar size="64" :color="getAreaColor(hostess.area)">
                <span v-if="!hostess.avatar" class="text-h5 text-white">
                    {{ hostess.name.charAt(0) }}
                </span>
                <v-img v-else :src="hostess.avatar" alt="avatar" />
            </v-avatar>
            <div class="ms-4 flex-grow-1">
                <div class="d-flex justify-space-between align-center">
                    <div class="text-subtitle-1 font-weight-bold">
                        {{ hostess.name }}
                    </div>
                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon variant="text" size="small" class="ma-0">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list density="compact">
                            <v-list-item prepend-icon="mdi-pencil" title="Editar" @click="editHostess(hostess)" />
                            <v-list-item :prepend-icon="hostess.confirmed
                                ? 'mdi-close-circle'
                                : 'mdi-check-circle'
                                " :title="hostess.confirmed
                                    ? 'Remover confirmação'
                                    : 'Confirmar presença'
                                    " @click="toggleHostessStatus(hostess)" />
                            <v-list-item prepend-icon="mdi-delete" base-color="red" title="Deletar"
                                @click="deleteHostess(hostess)" />

                        </v-list>
                    </v-menu>
                </div>
                <div class="text-caption text-grey-darken-1">
                    <v-icon size="14" start>mdi-phone</v-icon>
                    {{ hostess.phone }}
                </div>
                <div class="text-caption text-grey-darken-1 mt-1 d-flex align-center">
                    <v-icon size="14" class="me-1">mdi-map-marker</v-icon>
                    <v-chip size="x-small" :color="getAreaColor(hostess.area)" class="area-chip">
                        {{ hostess.area }}
                    </v-chip>
                </div>
                <div class="mt-1">
                    <v-chip size="x-small" :color="hostess.confirmed ? 'success' : 'grey'" class="status-chip">
                        {{ hostess.confirmed ? "Confirmada" : "Pendente" }}
                    </v-chip>
                </div>
            </div>
        </div>
        <v-divider />
        <v-card-text class="pa-0">
            <div class="schedule-info d-flex text-center">
                <div class="schedule-block flex-1 pa-2">
                    <div class="text-caption text-grey">Entrada</div>
                    <div class="text-body-1 font-weight-bold">
                        {{ hostess.startTime }}
                    </div>
                </div>
                <v-divider vertical />
                <div class="schedule-block flex-1 pa-2">
                    <div class="text-caption text-grey">Saída</div>
                    <div class="text-body-1 font-weight-bold">
                        {{ hostess.endTime }}
                    </div>
                </div>
                <v-divider vertical />
                <div class="schedule-block flex-1 pa-2">
                    <div class="text-caption text-grey">Horas</div>
                    <div class="text-body-1 font-weight-bold">
                        {{ calculateHours }}
                    </div>
                </div>
            </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-2">
            <v-btn variant="text" color="primary" prepend-icon="mdi-pencil" block @click="editHostess(hostess)">
                Editar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import {
    mockHostesses,
    hostessTableHeaders,
    statusOptions,
    areaOptions,
    timelineHours,
    hourLabels,
    getAreaColor
} from '@/management/consts/hostessesMockData';
import { toRefs, computed } from 'vue';

const props = defineProps(["hostess"]);
const { hostess } = toRefs(props);
const emit = defineEmits(["hostess:edit", "hostess:update", "hostess:delete"]);

const calculateHours = computed(() => {
    if (!hostess.value.startTime || !hostess.value.endTime) return "0";
    const start = parseTimeToMinutes(hostess.value.startTime);
    let end = parseTimeToMinutes(hostess.value.endTime);
    if (end < start) end += 24 * 60;
    return ((end - start) / 60).toFixed(1);
});

const parseTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
};


function editHostess(hostess) {
    emit("hostess:edit", hostess);
}

function deleteHostess(hostess) {
    emit("hostess:delete", hostess);
}

function toggleHostessStatus(hostess) {
    const hostessToUpdate = { ...hostess, confirmed: !hostess.confirmed };
    emit("hostess:update", hostessToUpdate);
}

</script>

<style lang="scss" scoped></style>