<template>
    <v-card border="thin" flat class="hostesses-table">
        <v-data-table :headers="tableHeaders" :items="hostesses" :items-per-page="10" item-value="id"
            class="elevation-0">
            <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                    <v-avatar size="32" :color="getAreaColor(item.area)" class="me-2">
                        <span class="text-caption text-white">
                            {{ item.name.charAt(0) }}
                        </span>
                    </v-avatar>
                    <span>{{ item.name }}</span>
                </div>
            </template>
            <template v-slot:item.confirmed="{ item }">
                <v-chip size="small" :color="item.confirmed ? 'success' : 'grey'" text-color="white">
                    {{ item.confirmed ? "Confirmada" : "Pendente" }}
                </v-chip>
            </template>
            <template v-slot:item.area="{ item }">
                <v-chip size="small" :color="getAreaColor(item.area)" text-color="white">
                    {{ item.area }}
                </v-chip>
            </template>
            <template v-slot:item.hours="{ item }">
                {{ calculateHours(item) }}h
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="d-flex">
                    <v-btn icon variant="text" size="small" color="primary" class="me-1" @click="editHostess(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" size="small" :color="item.confirmed ? 'error' : 'success'"
                        @click="toggleHostessStatus(item)">
                        <v-icon>
                            {{
                                item.confirmed
                                    ? "mdi-close-circle"
                                    : "mdi-check-circle"
                            }}
                        </v-icon>
                    </v-btn>
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<script setup>
import { toRefs, ref, computed } from 'vue';
import {
    mockHostesses,
    hostessTableHeaders,
    statusOptions,
    areaOptions,
    timelineHours,
    hourLabels,
    getAreaColor
} from '@/management/consts/hostessesMockData';

const emit = defineEmits(["hostess:edit", "hostess:update"]);

const props = defineProps(["hostesses"]);
const { hostesses } = toRefs(props);
const tableHeaders = ref(hostessTableHeaders);
const calculateHours = (hostess) => {
    if (!hostess.startTime || !hostess.endTime) return "0";
    const start = parseTimeToMinutes(hostess.startTime);
    let end = parseTimeToMinutes(hostess.endTime);
    if (end < start) end += 24 * 60;
    return ((end - start) / 60).toFixed(1);
};

const parseTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
};


function editHostess(hostess) {
    emit("hostess:edit", hostess);
}

function toggleHostessStatus(hostess) {
    const hostessToUpdate = { ...hostess, confirmed: !hostess.confirmed }
    emit("hostess:update", hostessToUpdate)
}















</script>

<style lang="scss" scoped></style>