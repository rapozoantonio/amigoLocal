<template>


    <v-card variant="tonal">
        <v-card-title>
            <div class="d-flex">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <td v-bind="props" class="num-col text-center">
                            <v-btn variant="tonal" density="compact" v-if="isHovering" icon="mdi-close"
                                @click="removeGuest"></v-btn>
                            <v-btn variant="tonal" v-else density="compact" icon>{{ index + 1 }}</v-btn>
                        </td>
                    </template>
                </v-hover>
                <div class="editable-row flex-grow-1">
                    <div v-if="isEditing" class="edit-input">
                        <v-text-field v-model="guestFormName" dense hide-details solo autofocus
                            @keyup.enter="disableEditing" @blur="disableEditing" />
                    </div>
                    <div v-else class="editable-content">
                        <span>{{ guest.name }}</span>
                        <v-btn icon size="x-small" class="edit-icon ml-4" @click.stop="enableEditing">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </div>
                </div>

            </div>
        </v-card-title>
        <v-card-text>
            <div>
                <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                <v-menu v-else v-model="showStatusMenu" :close-on-content-click="false" location="top">
                    <template v-slot:activator="{ props }">
                        <v-chip label :color="status.color" v-bind="props">
                            <span><v-icon>{{ status.icon }}</v-icon> {{ status.text }}</span>
                        </v-chip>
                    </template>

                    <!-- EXISTING GUEST -->
                    <v-card variant="tonal" min-width="300" v-if="existingGuests && existingGuests.length > 0">
                        <v-card-title class="d-flex justify-space-between align-center">
                            <span class="text-body-2">Encontrado esses usuarios:</span>
                            <v-btn @click="showStatusMenu = false" density="compact" variant="text"
                                icon="mdi-close"></v-btn>
                        </v-card-title>
                        <v-list>
                            <v-list-item v-for="(existingGuest, i) in existingGuests" :key="i"
                                prepend-icon="mdi-account" :title="existingGuest.name">
                                <template v-slot:append="{ isSelected }">
                                    <v-icon color="green" v-if="isSelected">
                                        mdi-check-circle
                                    </v-icon>
                                    <v-icon v-else>
                                        mdi-circle
                                    </v-icon>
                                </template>
                                <template v-slot:subtitle>
                                    <span class="mr-2" v-if="existingGuest.taxId"><v-icon>mdi-account</v-icon>{{
                                        existingGuest.taxId }}</span>
                                    <span class="mr-2" v-if="existingGuest.phone"><v-icon>mdi-phone</v-icon>{{
                                        existingGuest.phone }}</span>
                                    <span class="mr-2" v-if="existingGuest.email"><v-icon>mdi-email</v-icon>{{
                                        existingGuest.email }}</span>
                                    <span class="mr-2" v-if="existingGuest.instagram"><v-icon>mdi-instagram</v-icon>{{
                                        existingGuest.instagram }}</span>
                                </template>

                            </v-list-item>
                        </v-list>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-tooltip open-delay="600" content-class="bg-red-darken-2 border" location="top">
                                <span class="text-white">Esse item sera removido da lista para adicionar</span>
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" variant="tonal" color="error" @click="removeGuest">
                                        Ok, pode remover-lo
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip open-delay="600" content-class="bg-green-darken-2 border" location="top">
                                <span class="text-white">Pode editar esse convidado</span>
                                <template #activator="{ props }">
                                    <v-btn color="success" v-bind="props" variant="tonal"
                                        @click="showStatusMenu = false">
                                        Vou modificar-lo
                                    </v-btn>
                                </template>
                            </v-tooltip>

                        </v-card-actions>
                    </v-card>

                    <!-- EXISTING CUSTOMER -->
                    <v-card variant="tonal" min-width="300"
                        v-else-if="existingCustomers && existingCustomers.length > 0">
                        <v-card-title class="d-flex justify-space-between align-center">
                            <span class="text-body-2">Selecione um usuario</span>
                            <v-btn @click="showStatusMenu = false" density="compact" variant="text"
                                icon="mdi-close"></v-btn>
                        </v-card-title>
                        <v-list v-model:selected="selectedExistingCustomer">

                            <v-list-item v-for="(existingCustomer, i) in existingCustomers" :key="i"
                                :value="existingCustomer" :title="existingCustomer.name">

                                <template v-slot:append="{ isSelected }">
                                    <v-icon color="green" v-if="isSelected">
                                        mdi-check-circle
                                    </v-icon>
                                    <v-icon v-else>
                                        mdi-circle
                                    </v-icon>
                                </template>
                                <template v-slot:subtitle>
                                    <span class="mr-2 text-caption" v-if="existingCustomer.taxId"><v-icon size="x-small"
                                            start>mdi-card-account-details</v-icon>{{
                                                existingCustomer.taxId }}</span>
                                    <span class="mr-2" v-if="existingCustomer.phone"><v-icon>mdi-phone</v-icon>{{
                                        existingCustomer.phone }}</span>
                                    <span class="mr-2" v-if="existingCustomer.email"><v-icon>mdi-email</v-icon>{{
                                        existingCustomer.email }}</span>
                                    <span class="mr-2"
                                        v-if="existingCustomer.instagram"><v-icon>mdi-instagram</v-icon>{{
                                            existingCustomer.instagram }}</span>
                                </template>

                            </v-list-item>
                        </v-list>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-tooltip open-delay="600" content-class="bg-red-darken-2 border" location="top">
                                <span class="text-white">Esse usuario será considerado como um novo usuario</span>
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" variant="tonal" color="error" @click="selectNewCustomer">
                                        É um usuario novo
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip open-delay="600" content-class="bg-green-darken-2 border" location="top">
                                <span class="text-white">Confirmar convidado recurrente</span>
                                <template #activator="{ props }">
                                    <v-btn color="success" v-bind="props"
                                        :disabled="!selectedExistingCustomer || selectedExistingCustomer.length === 0"
                                        variant="tonal" @click="selectExistingCustomer">
                                        Confirmar
                                    </v-btn>
                                </template>
                            </v-tooltip>

                        </v-card-actions>
                    </v-card>

                    <v-card v-else> </v-card>
                </v-menu>
            </div>
        </v-card-text>
    </v-card>


    <v-list-item v-if="false">
        <template #title>
            <div class="editable-row">
                <div v-if="isEditing" class="edit-input">
                    <v-text-field v-model="guestFormName" dense hide-details solo autofocus
                        @keyup.enter="disableEditing" @blur="disableEditing" />
                </div>
                <div v-else class="editable-content">
                    <span>{{ guest.name }}</span>
                    <v-btn icon size="x-small" class="edit-icon ml-4" @click.stop="enableEditing">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </div>
            </div>
        </template>
        <template #prepend>
            <v-hover>
                <template v-slot:default="{ isHovering, props }">
                    <v-btn variant="tonal" density="compact" v-if="isHovering" icon="mdi-close" v-bind="props"
                        @click="removeGuest"></v-btn>
                    <v-btn variant="tonal" v-else density="compact" icon>{{ index + 1 }}</v-btn>
                </template>
            </v-hover>
        </template>
        <template #append></template>
        <template #subtitle>
            <div>
                <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                <v-menu v-else v-model="showStatusMenu" :close-on-content-click="false" location="top">
                    <template v-slot:activator="{ props }">
                        <v-chip label :color="status.color" v-bind="props">
                            <span><v-icon>{{ status.icon }}</v-icon> {{ status.text }}</span>
                        </v-chip>
                    </template>

                    <!-- EXISTING GUEST -->
                    <v-card variant="tonal" min-width="300" v-if="existingGuests && existingGuests.length > 0">
                        <v-card-title class="d-flex justify-space-between align-center">
                            <span class="text-body-2">Encontrado esses usuarios:</span>
                            <v-btn @click="showStatusMenu = false" density="compact" variant="text"
                                icon="mdi-close"></v-btn>
                        </v-card-title>
                        <v-list>
                            <v-list-item v-for="(existingGuest, i) in existingGuests" :key="i"
                                prepend-icon="mdi-account" :title="existingGuest.name">
                                <template v-slot:append="{ isSelected }">
                                    <v-icon color="green" v-if="isSelected">
                                        mdi-check-circle
                                    </v-icon>
                                    <v-icon v-else>
                                        mdi-circle
                                    </v-icon>
                                </template>
                                <template v-slot:subtitle>
                                    <span class="mr-2" v-if="existingGuest.taxId"><v-icon>mdi-account</v-icon>{{
                                        existingGuest.taxId }}</span>
                                    <span class="mr-2" v-if="existingGuest.phone"><v-icon>mdi-phone</v-icon>{{
                                        existingGuest.phone }}</span>
                                    <span class="mr-2" v-if="existingGuest.email"><v-icon>mdi-email</v-icon>{{
                                        existingGuest.email }}</span>
                                    <span class="mr-2" v-if="existingGuest.instagram"><v-icon>mdi-instagram</v-icon>{{
                                        existingGuest.instagram }}</span>
                                </template>

                            </v-list-item>
                        </v-list>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-tooltip open-delay="600" content-class="bg-red-darken-2 border" location="top">
                                <span class="text-white">Esse item sera removido da lista para adicionar</span>
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" variant="tonal" color="error" @click="removeGuest">
                                        Ok, pode remover-lo
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip open-delay="600" content-class="bg-green-darken-2 border" location="top">
                                <span class="text-white">Pode editar esse convidado</span>
                                <template #activator="{ props }">
                                    <v-btn color="success" v-bind="props" variant="tonal"
                                        @click="showStatusMenu = false">
                                        Vou modificar-lo
                                    </v-btn>
                                </template>
                            </v-tooltip>

                        </v-card-actions>
                    </v-card>

                    <!-- EXISTING CUSTOMER -->
                    <v-card variant="tonal" min-width="300"
                        v-else-if="existingCustomers && existingCustomers.length > 0">
                        <v-card-title class="d-flex justify-space-between align-center">
                            <span class="text-body-2">Selecione um usuario</span>
                            <v-btn @click="showStatusMenu = false" density="compact" variant="text"
                                icon="mdi-close"></v-btn>
                        </v-card-title>
                        <v-list v-model:selected="selectedExistingCustomer">

                            <v-list-item v-for="(existingCustomer, i) in existingCustomers" :key="i"
                                :value="existingCustomer" :title="existingCustomer.name">

                                <template v-slot:append="{ isSelected }">
                                    <v-icon color="green" v-if="isSelected">
                                        mdi-check-circle
                                    </v-icon>
                                    <v-icon v-else>
                                        mdi-circle
                                    </v-icon>
                                </template>
                                <template v-slot:subtitle>
                                    <span class="mr-2 text-caption" v-if="existingCustomer.taxId"><v-icon size="x-small"
                                            start>mdi-card-account-details</v-icon>{{
                                                existingCustomer.taxId }}</span>
                                    <span class="mr-2" v-if="existingCustomer.phone"><v-icon>mdi-phone</v-icon>{{
                                        existingCustomer.phone }}</span>
                                    <span class="mr-2" v-if="existingCustomer.email"><v-icon>mdi-email</v-icon>{{
                                        existingCustomer.email }}</span>
                                    <span class="mr-2"
                                        v-if="existingCustomer.instagram"><v-icon>mdi-instagram</v-icon>{{
                                            existingCustomer.instagram }}</span>
                                </template>

                            </v-list-item>
                        </v-list>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-tooltip open-delay="600" content-class="bg-red-darken-2 border" location="top">
                                <span class="text-white">Esse usuario será considerado como um novo usuario</span>
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" variant="tonal" color="error" @click="selectNewCustomer">
                                        É um usuario novo
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip open-delay="600" content-class="bg-green-darken-2 border" location="top">
                                <span class="text-white">Confirmar convidado recurrente</span>
                                <template #activator="{ props }">
                                    <v-btn color="success" v-bind="props"
                                        :disabled="!selectedExistingCustomer || selectedExistingCustomer.length === 0"
                                        variant="tonal" @click="selectExistingCustomer">
                                        Confirmar
                                    </v-btn>
                                </template>
                            </v-tooltip>

                        </v-card-actions>
                    </v-card>

                    <v-card v-else> </v-card>
                </v-menu>
            </div>
        </template>
    </v-list-item>

    <tr>

        <td class="gender-col text-center">
            <v-btn icon @click="toggleGender" variant="flat" size="small" :color="guest.gender === 'Female'
                ? 'pink-darken-2'
                : guest.gender === 'Male'
                    ? 'blue-darken-4'
                    : 'grey-darken-3'
                ">
                <v-icon>
                    {{
                        guest.gender === "Female"
                            ? "mdi-gender-female"
                            : guest.gender === "Male" ? "mdi-gender-male" : "mdi-gender-male-female"
                    }}
                </v-icon>
            </v-btn>
        </td>
        <td class=" text-right">

        </td>
    </tr>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { useEventListStore } from "@/management/store/eventList";



const guest = defineModel("guest");
const statusOk = defineModel("status");
const { index, eventId } = defineProps(["index", "eventId"]);
const emit = defineEmits(["guest:remove"]);
const isEditing = ref(false);
const eventListStore = useEventListStore();
const loading = ref(false);
const existingCustomers = ref(null);
const existingGuests = ref(null);
const guestFormName = ref(null);

const selectedExistingCustomer = ref(null);
const selectedExistingGuest = ref(null);
const showStatusMenu = ref(false);
const status = computed(() => {
    if (existingGuests.value && existingGuests.value.length > 0) {
        statusOk.value = false;
        return {
            icon: "mdi-close",
            text: "Convidado ja foi adicionado",
            color: "red"
        }
    }
    else if (existingCustomers.value && existingCustomers.value.length > 0) {
        statusOk.value = false;
        return {
            icon: "mdi-account",
            text: "Cliente encontrado",
            color: "blue"
        }
    }
    else {
        statusOk.value = true;
        return {
            icon: "mdi-check",
            text: "Pronto para adicionar",
            color: "green"
        }
    }
})

const subtitle = computed(() => {
    return
})

function selectNewCustomer() {
    existingCustomers.value = null;
    showStatusMenu.value = false;
}

function selectExistingCustomer() {
    guest.value = selectedExistingCustomer.value[0];
    existingCustomers.value = null;
    selectedExistingCustomer.value = [];
    showStatusMenu.value = false;
}

function removeGuest() {
    emit("guest:remove", index);
    showStatusMenu.value = false;

}

function toggleGender() {
    guest.value.gender = guest.value.gender === null ? guest.value.gender = "Male" : guest.value.gender === "Male" ? guest.value.gender = "Female" : guest.value.gender = null;
}

function enableEditing() {
    guestFormName.value = guest.value.name;
    isEditing.value = true;
}

function disableEditing() {
    isEditing.value = false;
    if (guestFormName.value === guest.value.name) return;

    guest.value.name = guestFormName.value;

    if (loading.value) return
    // checkForDuplicates();
}

async function checkForDuplicates() {
    console.log("checkForDuplicates", guest.value);
    try {
        loading.value = true;
        // CHECK IF GUEST IS ALREADY IN THE EVENT
        const resultExistInEvent = await eventListStore.checkIfGuestExistsInServer(guest.value, eventId);
        existingGuests.value = resultExistInEvent.result;
        console.log({ resultExistInEvent });

        // CHECK IF GUEST IS A CUSTOMER
        const resultExistCustomer = await eventListStore.checkIfCustomerExists(guest.value);
        existingCustomers.value = resultExistCustomer.result;
        console.log({ resultExistCustomer });

    } catch (error) {
        console.log({ error });
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await checkForDuplicates();
})


</script>

<style lang="scss" scoped></style>
