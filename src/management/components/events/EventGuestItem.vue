<template>
    <v-hover>
        <template v-slot:default="{ isHovering, props }">
            <v-list-item class="mb-2" v-bind="props" lines="two" :variant="isHovering ? 'tonal' : 'outlined'"
                border="sm" rounded="lg" color="primary">
                <template #prepend>
                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon variant="text" color="grey" size="small" class="action-btn me-2">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list density="compact">
                            <v-list-item @click="editGuest(guest)" prepend-icon="mdi-pencil" title="Editar" />
                            <v-list-item v-if="guest.status !== 'cancelled'" @click="cancelGuest(guest)"
                                prepend-icon="mdi-cancel" title="Cancelar" />
                            <v-list-item v-if="guest.status === 'cancelled'" @click="restoreGuest(guest)"
                                prepend-icon="mdi-restore" title="Restaurar" />
                            <v-divider />
                            <v-list-item @click="deleteGuest(guest)" prepend-icon="mdi-delete" title="Excluir"
                                class="text-error" />
                        </v-list>
                    </v-menu>

                </template>
                <template #title>
                    <p>{{ guest.name }}</p>
                </template>

                <template #append>
                    <v-chip size="x-small" :color="getStatusColor(guest.status)" text-color="white"
                        class="status-chip ms-2 mr-2">
                        {{ getStatusText(guest.status) }}
                    </v-chip>
                    <v-btn v-if="guest.status === 'pending'" icon variant="flat" color="success"
                        :size="$vuetify.display.xs ? 'large' : 'small'" class="action-btn" :loading="loading"
                        @click="performCheckIn(guest)">
                        <v-icon>{{ $vuetify.display.xs ? 'mdi-check-circle' : 'mdi-check' }}</v-icon>
                        <v-tooltip activator="parent" location="top">Check-in</v-tooltip>
                    </v-btn>
                    <v-btn v-else-if="guest.status === 'checked-in'" icon variant="text" color="error" size="small"
                        class="action-btn" :loading="loading" @click="undoCheckIn(guest)">
                        <v-icon>mdi-undo</v-icon>
                        <v-tooltip activator="parent" location="top">Desfazer Check-in</v-tooltip>
                    </v-btn>
                </template>
            </v-list-item>

        </template>
    </v-hover>
</template>

<script setup>
import { computed, ref, inject, toRefs } from 'vue';

import { useRoute } from 'vue-router';

import {
    getStatusColor,
    getStatusText,
} from '@/management/consts/guestsMockData';

// STORES
const route = useRoute();

// PROPS
const props = defineProps(["guest", "lists", "loading"]);

const { guest, lists, loading } = toRefs(props);
const emit = defineEmits(["update", "edit", "checkin", "delete"])

const swal = inject("$swal");

// METHODS
function performCheckIn() {
    emit("checkin", { ...guest.value });
}
function undoCheckIn() {
    const guestDoc = { ...guest.value, checkInNotes: null, checkInTime: null, checkInBy: null, status: "pending" }
    updateGuest(guestDoc, "undoCheckIn");
}
function deleteGuest(guest) {
    emit("delete", guest)
}
function cancelGuest() {
    const guestDoc = { ...guest.value, status: "cancelled" }
    updateGuest(guestDoc, "cancel");
}
function editGuest() {
    emit("edit", { ...guest.value })
}
function restoreGuest() {
    const guestDoc = { ...guest.value, status: "pending" }
    updateGuest(guestDoc, "restore");
}
function updateGuest(guest, type = "update") {
    emit("update", guest, type)
}

</script>

<style lang="scss" scoped></style>