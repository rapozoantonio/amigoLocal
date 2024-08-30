<template>
    <div>
        <form-card v-if="!requestExists" @submit="submitRequest" :schema="promoterRequestSchema"
            v-model:model="promoter" title="Solicitação para promoter" labelType="left" action="Enviar"></form-card>
        <v-empty-state v-else headline="You already sent a request" title="Your request is pending"></v-empty-state>
    </div>
</template>

<script setup>
import {
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from 'vue';

import { storeToRefs } from 'pinia';

import FormCard from '@/components/form/FormCard.vue';
import promoterRequestSchema from '@/schemas/promoterRequestSchema';
import { useAuthStore } from '@/store/auth';
import { useFirebaseStore } from '@/store/firebase';

const authStore = useAuthStore();
const firebaseStore = useFirebaseStore();
const { user } = storeToRefs(authStore);

const promoter = ref({
    id: null,
    name: null,
    email: null,
    username: null
})

const requestExists = ref(false);




// onBeforeMount(async () => {
//     if (user.value) {
//         promoter.value.id = user.value.uid;
//         promoter.value.email = user.value.email;
//         promoter.value.name = user.value.displayName;
//         promoter.value.username = user.value.displayName;

//         await checkIfRequestAlreadyExists();
//     }
// })


async function checkIfRequestAlreadyExists() {
    try {
        const response = await firebaseStore.getDocumentById("requests", promoter.value.id);
        if (response.ok && response.data) {
            requestExists.value = true;
            return true;
        }
        return false;
    } catch (error) {
        
        return false;
    }
}

async function submitRequest() {
    try {
        const response = await firebaseStore.postDocument("requests", { model: promoter.value, id: promoter.value.id }, "promoterRequest");
        if (response.ok) {
            response.notify("Request sent", "Your request has been sent to be approved");
        }
    } catch (error) {
        
    }
}

async function init() {
    if (user.value) {
        promoter.value.id = user.value.uid;
        promoter.value.email = user.value.email;
        promoter.value.name = user.value.displayName;
        promoter.value.username = user.value.displayName;

        await checkIfRequestAlreadyExists();
    }
}

watch(() => promoter.value.name, (newValue) => {
    promoter.value.username = newValue;
})

await init();


</script>

<style lang="scss" scoped></style>