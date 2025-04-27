<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        Promoters
                    </v-card-title>
                    <v-card-text>
                        <!-- SEARCH FIELD -->
                        <v-text-field v-model="search" label="Search users" prepend-inner-icon="mdi-magnify"
                            density="compact" variant="outlined" hide-details single-line></v-text-field>

                        <!-- USERS TABLE -->
                        <v-data-table density="compact" hover :headers="headers" :items="users" item-value="uid"
                            select-strategy="single" v-model="selectedUser" :search="search">

                            <template #item="{ isSelected, toggleSelect, item }">
                                <v-hover v-slot:default="{ isHovering, props }">
                                    <tr v-bind="props"
                                        :class="{ 'bg-grey-lighten-4': isSelected({ ...item, value: item.uid, selectable: true }) }">
                                        <td>{{ item.uid }}</td>
                                        <td>{{ item.email }}</td>
                                        <td class="text-center"><v-chip :color="roleColor(item.customClaims.role)"
                                                size="small" variant="elevated" label>{{ item.customClaims.role
                                                }}</v-chip></td>
                                        <td class="text-center"><v-icon>{{ item.customClaims.admin ? 'mdi-check' :
                                            'mdi-close' }}</v-icon></td>
                                        <td class="text-center">{{ item.customClaims.levelAccess }}</td>
                                        <td class="text-right">
                                            <v-btn @click.stop="openPromoterRequestForm(item)"
                                                v-if="isHovering && item.customClaims.role !== 'admin' && item.customClaims.role !== 'pro'"
                                                size="x-small" variant="elevated" icon color="primary">
                                                <v-icon>mdi-account-edit</v-icon>
                                            </v-btn>
                                            <v-btn @click.stop="openPromoterEditForm(item)" v-else size="x-small"
                                                variant="elevated" icon color="secondary">
                                                <v-icon>mdi-account-edit</v-icon>
                                            </v-btn>
                                        </td>
                                    </tr>
                                </v-hover>

                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <form-dialog @submit="createPromoter" :schema="promoterRequestSchema" v-model:model="promoter"
            v-model:opened="dialog.opened" title="Criar promoter" labelType="left"
            action="Criar promoter"></form-dialog>

        <form-dialog @submit="updatePromoter" :schema="promoterRequestSchema" v-model:model="promoter"
            v-model:opened="editDialog.opened" title="Editar promoter" labelType="left"
            action="Update promoter"></form-dialog>
    </v-container>
</template>

<script setup>
import {
    computed,
    onMounted,
    ref,
    watch,
} from 'vue';

import FormDialog from '@/core/components/form/FormDialog.vue';
import {
    functions,
    httpsCallable,
} from '@/core/plugins/firebase';
import promoterRequestSchema from '@/core/schemas/promoterRequestSchema';
import { useAppStore } from '@/promotion/store/app';
import { useFirebaseStore } from '@/core/store/firebase';

const appStore = useAppStore();
const loading = ref(false)
const users = ref([]);
const selectedUser = ref(null);
const search = ref(null);
const promoter = ref({})
const firebaseStore = useFirebaseStore();
const groupBy = [
    {
        key: 'customClaims.role',
        order: 'asc',
    },
]

const roleColor = computed(() => {
    return (role) => {
        switch (role) {
            case "pro":
                return "purple";
                break;
            case "admin":
                return "green";
                break
            default:
                return "blue"
                break;
        }
    }
})
const newRole = ref(null);
const roles = [
    { role: "user", levelAccess: 1, admin: false },
    { role: "pro", levelAccess: 3, admin: false },
    { role: "admin", levelAccess: 9, admin: true },
]
const dialog = ref({
    opened: false,
    item: null,
    title: "Create Promoter"
})

const editDialog = ref({
    opened: false,
    item: null,
    title: "Edit Promoter"
})

const headers = [
    { title: "User ID", value: "uid" },
    { title: "Email", value: "email" },
    {
        title: "Custom Claims",
        align: "center",
        children: [
            { title: "Role", value: "customClaims.role", align: "center", },
            { title: "Admin", value: "customClaims.admin", align: "center", },
            { title: "Level Access", value: "customClaims.levelAccess", align: "center", },
        ]
    },
    { title: "Actions", align: "end" },
]

async function grantAdminRole() {

    const user = users.value.find((u) => selectedUser.value === u.uid);
    if (!user) return;

    user.role = "admin";
    user.admin = true;
    const updateUserCustomClaims = httpsCallable(
        functions,
        "updateUserCustomClaims"
    );
    const response = await updateUserCustomClaims(user);

}

function closeDialog() {
    dialog.value = {
        opened: false,
        item: null,
        title: "Create Promoter"
    }
}

async function updateUserRole(uid, customClaims) {
    try {
        loading.value = true;
        const updateRole = httpsCallable(functions, "updateRole");

        const response = await updateRole({ uid, customClaims });

        if (response.data.ok) {
            dialog.value.item.customClaims = response.data.data.customClaims
            dialog.value.item = null;
            dialog.value.opened = false;
        }
    } catch (error) {

    }
    finally {
        loading.value = false;
    }

}

async function getAllUsers() {
    const getUsers = httpsCallable(functions, "getAllUsers");
    const response = await getUsers();

    users.value = response.data.data;
}

function editRole(item) {
    dialog.value.opened = true;
    dialog.value.item = item;
    newRole.value = item.customClaims;
}

async function openPromoterRequestForm(pro) {
    promoter.value.name = pro.displayName;
    promoter.value.email = pro.email;
    promoter.value.id = pro.uid;
    dialog.value.opened = true;
    dialog.value.item = pro;

}

async function openPromoterEditForm(pro) {
    promoter.value.name = pro.displayName;
    promoter.value.email = pro.email;
    promoter.value.id = pro.uid;
    promoter.value.code = pro.customClaims.code;
    editDialog.value.opened = true;
    editDialog.value.item = pro;
}

async function createPromoter(promoter) {
    try {
        appStore.loading = true;
        appStore.loadingText = "Creating promoter..."
        promoter.createMethod = "admin-panel"
        const response = await firebaseStore.postDocument("promoters", promoter, "promoters");

        if (dialog.value.item?.customClaims.role !== "admin") {
            await updateUserRole(promoter.id, { role: "pro", levelAccess: 3, admin: false, code: promoter.code },)
        }

        if (response.ok) {
            response.notify("Promoter created", "The promoter has been created and the user's role has been updated")
        }

    } catch (error) {

    } finally {
        dialog.value.opened = false;
        dialog.value.item = null;
        appStore.loading = false;
        appStore.loadingText = ""
    }
}

async function updatePromoter(promoter) {
    try {
        appStore.loading = true;
        appStore.loadingText = "Creating promoter..."
        promoter.createMethod = "admin-panel"
        const response = await firebaseStore.putDocument("promoters", promoter.uid, promoter);

        if (dialog.value.item?.customClaims.role !== "admin") {
            await updateUserRole(promoter.id, { role: "pro", levelAccess: 3, admin: false, code: promoter.code },)
        }
        else {
            await updateUserRole(promoter.id, { role: "admin", levelAccess: 9, admin: true, code: promoter.code },)
        }

        if (response.ok) {
            response.notify("Promoter actualizado", "")
        }

    } catch (error) {

    } finally {
        dialog.value.opened = false;
        dialog.value.item = null;
        appStore.loading = false;
        appStore.loadingText = ""
    }
}
// watch(() => promoter.value.name, (newValue) => {
//     promoter.value.username = newValue;
// })


onMounted(() => {
    getAllUsers();
}) 
</script>



<style lang="scss" scoped></style>