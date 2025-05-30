<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card v-bind="props" :elevation="isHovering ? 4 : 1" border="thin" class="h-100 list-card">
            <v-card-title class="d-flex justify-space-between align-center py-3">
                <span class="text-subtitle-1 font-weight-medium text-truncate">
                    <v-icon :color="list.active ? 'success' : 'red'">mdi-circle-medium</v-icon> {{ list.name }}
                </span>
                <v-menu location="bottom end">
                    <template v-slot:activator="{ props: menuProps }">
                        <v-btn v-bind="menuProps" icon variant="text" size="small" @click.stop>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list density="compact">
                        <v-list-item prepend-icon="mdi-pencil" title="Edit list" @click="editList(list)" />
                        <v-list-item v-if="list.active" prepend-icon="mdi-pause-circle" title="Pause list"
                            @click="toggleListStatus(list)" />
                        <v-list-item v-else prepend-icon="mdi-play-circle" title="Activate list"
                            @click="toggleListStatus(list)" />
                        <v-list-item prepend-icon="mdi-content-duplicate" title="Duplicate list"
                            @click="duplicateList(list)" />
                        <v-divider />
                        <v-list-item prepend-icon="mdi-delete" title="Delete list" class="text-error"
                            @click.stop="deleteList(list)" />
                    </v-list>
                </v-menu>
            </v-card-title>

            <v-divider />
            <v-card-text class="py-3">
                <div class="d-flex justify-space-between mb-3">
                    <div class="text-center">
                        <div class="text-h6">{{ totals.guestCount }}</div>
                        <div class="text-caption">Guests</div>
                    </div>
                    <div class="text-center">
                        <div class="text-h6">{{ totals.checkIns }}</div>
                        <div class="text-caption">Check-ins</div>
                    </div>
                    <div class="text-center">
                        <div class="text-h6">
                            {{ list.quota > 0 ? list.quota : "∞" }}
                        </div>
                        <div class="text-caption">Quota</div>
                    </div>
                </div>
                <!-- Price Display -->
                <div class="text-center mb-3">
                    <div class="text-h6">{{ formatPrice(list.price) }}</div>
                    <div class="text-caption">Price</div>
                </div>
                <!-- Cut-off Time Display -->
                <div class="text-center mb-3">
                    <div v-if="list.cutoffTime" class="text-h6">
                        {{ list.cutoffTime }}
                    </div>
                    <div v-else class="text-h6 text-grey">No Cut-off Time</div>
                    <div class="text-caption">Cut-off Time</div>
                </div>
                <v-progress-linear v-if="list.quota > 0" :model-value="progressPercentage" :color="progressColor"
                    height="12" rounded class="mt-2" />
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-3">
                <v-btn variant="outlined" color="primary" prepend-icon="mdi-account-plus" rounded="pill"
                    @click.stop="openBulkGuestModal(list)" block>
                    Add Guest
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-hover>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
// PARAMS
const props = defineProps(["list", "totals"]);
const { list, totals } = toRefs(props);

// COMPUTED PROPERTIES
const progressColor = computed(() => {
    return progressPercentage.value >= 100
        ? "error"
        : progressPercentage.value >= 75
            ? "warning"
            : "success";
});
const progressPercentage = computed(() => {
    return Math.min((totals.value.checkIns / list.value.quota) * 100, 100) || 0;
});
const formatPrice = computed(() => {
    return (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",

        }).format(price);
    }
})
const eventId = computed(() => {
    return route.params.eventId
})

const emit = defineEmits(["list:duplicate", "list:update", "list:delete", "list:edit", "list:addGuest"])

// METHODS
async function openBulkGuestModal(list) {
    emit("list:addGuest", list);
}
async function deleteList(list) {
    emit("list:delete", list)
}
async function duplicateList(list) {
    emit("list:duplicate", list);
}
async function toggleListStatus(list) {
    const isActive = list.active;
    emit("list:update", { ...list, active: !list.active }, "status");
}
async function editList(list) {
    emit("list:edit", list);
}


</script>
