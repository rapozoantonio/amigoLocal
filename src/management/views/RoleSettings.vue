<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-list color="primary">
                        <v-list-item color="primary" v-for="role in roles" :key="role.id" :title="role.id"
                            prepend-icon="mdi-account-key" @click="openEditDialog(role)">
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-plus-circle" title="Criar Role" @click="openCreateDialog">
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>


        <!-- <v-btn @click="openCreateDialog">Create Role</v-btn> -->
        <form-dialog fullscreen v-model:opened="showDialog" v-model:model="roleForm" :schema="jubilosRoleSchema"
            @submit="updateRole" :title="action === 'create' ? 'Criar Role' : 'Editar Role'">

            <template v-if="action === 'edit'" #field-id="{ model }">
                <v-container>
                    <v-row><v-col cols="12">
                            <v-chip label>Role <span class="text-blue-grey-lighten-2 ml-2 font-weight-bold">{{ model.id
                            }}</span>
                            </v-chip>
                        </v-col></v-row>
                </v-container>
            </template>

            <template #append-inner="{ model }">
                <v-container>
                    <v-row>
                        <v-col cols="12" v-for="(scopes, key) in permissions" :key="key" class="px-6">
                            <v-card variant="outlined" color="blue-grey">
                                <v-card-title>{{ key }}</v-card-title>
                                <v-card-text class="text-white mt-2">
                                    <v-hover v-for="(scope) in scopes" :key="scope.id">
                                        <template #default="{ isHovering, props }">
                                            <v-row v-bind="props" align="center"
                                                :class="[isHovering ? 'bg-blue-grey-darken-4' : '']">
                                                <v-col class="pb-1">
                                                    <span class="text-subtitle-1 pl-5">{{ scope.label }}</span>
                                                </v-col>
                                                <v-col class="pb-1">
                                                    <v-row>
                                                        <v-col v-for="action in scope.actions" :key="action">
                                                            <v-checkbox density="compact" :hide-details="true"
                                                                color="blue-grey"
                                                                v-model="model.permissions[`${scope.id}.${action}`]"
                                                                :label="action"></v-checkbox>
                                                        </v-col>

                                                    </v-row>
                                                </v-col>
                                                <v-col class="pa-0" cols="12">
                                                    <v-divider></v-divider>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </v-hover>

                                </v-card-text>

                            </v-card>
                        </v-col>
                    </v-row>


                </v-container>
            </template>
        </form-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import FormDialog from '@/core/components/form/FormDialog.vue';
import jubilosRoleSchema from '@/core/schemas/jubilosRoleSchema';
import { useFirebaseStore } from '@/core/store/firebase';
import { collection } from 'firebase/firestore';


const permissions = {
    "EventList Modules": [
        { id: "eventList.module.events", label: "Events", actions: ["READ", "WRITE", "DELETE"] },
        { id: "eventList.module.guests", label: "Guests", actions: ["READ", "WRITE", "DELETE"] },
        { id: "eventList.module.promoters", label: "Promoters", actions: ["READ", "WRITE", "DELETE"] },
        { id: "eventList.module.lists", label: "Lists", actions: ["READ", "WRITE", "DELETE"] },
        { id: "eventList.module.hostesses", label: "Hostesses", actions: ["READ", "WRITE", "DELETE"] },
    ],
    "EventList Actions": [
        { id: "eventList.actions.checkin", label: "Guest Check-in", actions: ["WRITE"] },
    ]
}
const showDialog = ref(false);
const roleForm = ref({
    permissions: {},
});

const action = ref(null);

const roles = ref(null);
const selectedRole = ref(null);
const firebaseStore = useFirebaseStore();

function openEditDialog(role) {
    action.value = "edit";
    roleForm.value = {
        ...role
    };
    showDialog.value = true;
}

function openCreateDialog() {
    action.value = "create";
    roleForm.value = {
        permissions: {}
    };
    const permissionsList = Object.values(permissions).reduce((total, p) => {
        total.push(...p);
        return total;
    }, []);
    console.log({ permissionsList })
    permissionsList.forEach((scope) => {
        scope.actions.forEach((action) => {
            roleForm.value.permissions[scope.id + "." + action] = false;
        })
    })
    showDialog.value = true;
}

async function updateRole(role, close) {
    console.log("updateRole", role)
    try {
        const update = await firebaseStore.putDocument("roles", role.id, role);
        console.log({ update });
        close();
    } catch (error) {
        console.log({ error })
    } finally {
        close();

    }

}

async function submitRole(role, close) {
    console.log({ role })
    if (action.value === "create") {
        createRole(role, close);
    }
    else {
        updateRole(role, close);
    }
}

async function createRole(role, close) {
    console.log("createRole", role)

    try {
        const update = await firebaseStore.postDocument("roles", role);
        console.log({ update });
        close();
    } catch (error) {
        console.log({ error })
    } finally {
        close();
    }
}

async function getRoles() {
    try {
        const rolesResponse = await firebaseStore.getCollection({ collection: "roles" });
        if (rolesResponse.ok) {
            roles.value = rolesResponse.data
        }
    } catch (error) {
        console.log({ error });
    }
}

onMounted(() => {
    getRoles();
})
</script>

<style lang="scss" scoped></style>