<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        Auth Users
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
                                        <td class="text-right"><v-btn @click="editRole(item)" v-if="isHovering"
                                                size="x-small" variant="elevated" icon color="primary" @click.stop>
                                                <v-icon>mdi-account-edit</v-icon>
                                            </v-btn></td>
                                    </tr>
                                </v-hover>

                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog.opened">
            <v-card width="320" class="mx-auto">

                <v-card-title class="d-flex">
                    {{ dialog.title || 'Edit user' }}
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog" variant="text" icon size="x-small"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>

                <v-card-text>

                    <v-list-item class="bg-primary">
                        <v-list-item-title>{{ dialog.item?.email }}</v-list-item-title>
                        <v-list-item-subtitle>{{ dialog.item?.customClaims?.role }}</v-list-item-subtitle>
                    </v-list-item>

                    <v-select class="mt-4" v-model="newRole" :items="roles" item-title="role" return-object
                        label="New Role"></v-select>
                    <v-btn :loading="loading" :disabled="newRole?.role === dialog.item?.customClaims?.role"
                        color="primary" variant="elevated" @click="updateUserRole(dialog.item?.uid, newRole)"
                        block>Change
                        Role</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <form-dialog @submit="createPromoter" :schema="promoterRequestSchema" v-model:model="promoter"
            v-model:opened="opened" title="Criar promoter" labelType="left" action="Criar promoter"></form-dialog>
    </v-container>
</template>

<script setup>
import {
    computed,
    onMounted,
    ref,
} from 'vue';

import {
    functions,
    httpsCallable,
} from '@/plugins/firebase';

const loading = ref(false)
const users = ref([]);
const selectedUser = ref(null);
const search = ref(null);
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
    title: "Edit user"
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
    console.log("grantAdminRole");
    const user = users.value.find((u) => selectedUser.value === u.uid);
    if (!user) return;
    console.log("user");
    user.role = "admin";
    user.admin = true;
    const updateUserCustomClaims = httpsCallable(
        functions,
        "updateUserCustomClaims"
    );
    const response = await updateUserCustomClaims(user);
    console.log({ response });
}

function closeDialog() {
    dialog.value = {
        opened: false,
        item: null,
        title: "Edit user"
    }
}

async function updateUserRole(uid, customClaims) {
    try {
        loading.value = true;
        const updateRole = httpsCallable(functions, "updateRole");
        console.log({ uid, customClaims });
        const response = await updateRole({ uid, customClaims });
        console.log({ response });
        if (response.data.ok) {
            dialog.value.item.customClaims = response.data.data.customClaims
            dialog.value.item = null;
            dialog.value.opened = false;
        }
    } catch (error) {
        console.log({ error })
    }
    finally {
        loading.value = false;
    }

}

async function getAllUsers() {
    const getUsers = httpsCallable(functions, "getAllUsers");
    const response = await getUsers();
    console.log({ response });
    users.value = response.data.data;
}

function editRole(item) {
    dialog.value.opened = true;
    dialog.value.item = item;
    newRole.value = item.customClaims;
}


onMounted(() => {
    getAllUsers();
}) 
</script>



<style lang="scss" scoped></style>