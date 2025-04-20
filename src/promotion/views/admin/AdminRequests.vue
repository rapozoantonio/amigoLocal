<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="100h">
                <v-card>
                    <v-tabs v-model="activeTab" bg-color="primary">
                        <v-tab :value="1">Promoters</v-tab>
                        <v-tab :value="2">Events</v-tab>
                        <v-tab :value="3">Producers</v-tab>
                    </v-tabs>

                    <v-tabs-window v-model="activeTab">
                        <v-tabs-window-item :value="1">
                            <v-toolbar density="compact">
                                <v-container>
                                    <v-row>
                                        <v-spacer></v-spacer>
                                        <v-col cols="auto">
                                            <v-btn @click="opened = true" variant="elevated" color="primary">Add
                                                Promoter</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-toolbar>
                            <form-dialog @submit="createPromoter" :schema="promoterRequestSchema"
                                v-model:model="promoter" v-model:opened="opened" title="Criar promoter" labelType="left"
                                action="Criar promoter"></form-dialog>

                            <v-list v-if="promoterRequest">
                                <v-list-item v-for="request in promoterRequest" :key="request.id">
                                    <v-list-item-title>
                                        {{ request.model.name }} <v-chip class="ml-2" size="small" label
                                            variant="tonal">{{
                                                request.model.username }}</v-chip>
                                    </v-list-item-title>
                                    <template #append>
                                        <template v-if="request.approved">
                                            <v-chip color="success" variant="tonal">
                                                APPROVED
                                            </v-chip>
                                        </template>
                                        <template v-else>
                                            <v-btn class="mr-2" size="x-small" color="error" icon="mdi-close"></v-btn>
                                            <v-btn @click="approveRequest(request)" class="mr-2" size="x-small"
                                                color="success" icon="mdi-check"></v-btn>
                                        </template>

                                    </template>
                                </v-list-item>
                            </v-list>



                            <!-- <div v-if="promoterRequest">
                                    <v-card v-for="request in promoterRequest" :key="request.id">
                                        <v-card-text>
                                            <p>
                                                {{ request.model }}
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </div> -->
                        </v-tabs-window-item>

                        <v-tabs-window-item :value="2">
                            Events
                        </v-tabs-window-item>

                        <v-tabs-window-item :value="3">
                            Producers
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script setup>
import {
    onMounted,
    ref,
    watch,
} from 'vue';

import FormDialog from '@/promotion/components/form/FormDialog.vue';
import {
    functions,
    httpsCallable,
} from '@/core/plugins/firebase';
import promoterRequestSchema from '@/schemas/promoterRequestSchema';
import { useAppStore } from '@/promotion/store/app';
import { useFirebaseStore } from '@/promotion/store/firebase';

const firebaseStore = useFirebaseStore();
const appStore = useAppStore();
const promoter = ref({});

const activeTab = ref(1);
const promoterRequest = ref(null);
const opened = ref(false);

async function getPromoterRequests() {
    const response = await firebaseStore.getCollection({ collection: "requests", query: { entity: "promoters", status: "pending" } })

    if (response.ok) {
        promoterRequest.value = response.data;
    }
}

async function approveRequest(request) {
    try {
        request.model.createMethod = "user-request"
        await firebaseStore.postDocument(request.entity, request.model, "promoters");
        await firebaseStore.putDocument("requests", request.id, { approved: true, status: "approved" });
        await updateUserRole(request.id, { role: "pro", levelAccess: 3, admin: false, code: request.model.code },)
        request.approved = true;
    } catch (error) {

    }
}

async function createPromoter(promoter) {
    try {
        appStore.loading = true;
        appStore.loadingText = "Creating promoter..."
        promoter.createMethod = "user-request"
        await firebaseStore.postDocument("promoters", promoter, "promoters");
        await updateUserRole(request.id, { role: "pro", levelAccess: 3, admin: false, code: promoter.code },)
        request.approved = true;
    } catch (error) {

    } finally {
        appStore.loading = false;
        appStore.loadingText = ""
    }
}

async function updateUserRole(uid, customClaims) {
    try {
        const updateRole = httpsCallable(functions, "updateRole");

        const response = await updateRole({ uid, customClaims });

        if (response.data.ok) {
            return { ok: true };
        }
        return { ok: false };
    } catch (error) {

        return { ok: false };

    }
    // finally {
    //     loading.value = false;
    // }

}

watch(() => promoter.value.name, (newValue) => {
    promoter.value.username = newValue;
})

onMounted(async () => {
    await getPromoterRequests();

})


</script>

<style lang="scss" scoped></style>