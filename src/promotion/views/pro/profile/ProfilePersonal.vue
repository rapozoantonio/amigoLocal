<template>
    <form-card v-if="user" @submit="saveProfile" :schema="userSchema" v-model:model="user" v-model:files="files"
        labelType="up" title="Edit Personal Info" action="Save" :items="{ language: languages, gender: genders }">
        <template #prepend>
            <v-alert v-if="!user.completed" title="Complete seu perfil" variant="tonal" closable border="start">Complete
                seu perfil para aceder as funcionalidades personalizadas</v-alert>
        </template>
    </form-card>

</template>

<script setup>
import {
    inject,
    ref,
    watch,
} from 'vue';

import { storeToRefs } from 'pinia';
import { VDateInput } from 'vuetify/labs/VDateInput';

import FormCard from '@/core/components/form/FormCard.vue';
import userSchema from '@/core/schemas/userSchema';
import { useFirebaseStore } from '@/core/store/firebase';
import { useUserStore } from '@/promotion/store/user';
import FormSteps from '@/core/components/form/FormSteps.vue';
import FormBox from '@/core/components/form/FormBox.vue';
import promoterSchema from '@/core/schemas/promoterSchema';

const { fieldAttrs } = inject("$helpers");

const step = ref("personal_info");

const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const loading = ref(false);
const languages = ref([
    { name: "English", value: "en" },
    { name: "Spanish", value: "es" },
    { name: "Portuguese", value: "pt" },
    { name: "Italian", value: "it" },
]);
const rules = ref({
    required: (value) => !!value || "Field is required",
});

const genders = ref([
    "Masculino", "Feminino", "Prefiro não dizer"
])

const files = ref({});

const firebaseStore = useFirebaseStore();

async function saveProfile(event) {
    try {

        loading.value = true;
        const results = await event;

        // if (!results.valid) {
        //     document.querySelector("#" + results.errors[0].id).focus();
        //     return false;
        // }
        user.value.completed = true;
        const response = await firebaseStore.putDocument("users", user.value.uid, user.value);

        if (response.ok) {
            response.notify("", "Your personal settings is successfully updated")
        }




    } catch (error) {

    } finally {
        loading.value = false;
    }
}



</script>

<style lang="scss" scoped>
.label {
    width: 75px;
}
</style>