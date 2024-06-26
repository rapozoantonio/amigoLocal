<template>
    <form-card v-if="user" @submit="saveProfile" :schema="userSchema" v-model:model="user" v-model:files="files"
        labelType="left" title="Edit Profile" action="Save" :items="{ language: languages, gender: genders }">

        <template #prepend>
            <v-alert v-if="!user.completed" title="Complete seu perfil" variant="tonal" closable border="start">Complete
                seu perfil para aceder as funcionalidades personalizadas</v-alert>
        </template>
    </form-card>
    <v-form v-if="false" @submit.prevent="saveProfile">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card v-if="user">
                        <v-card-title class="mb-4">Personal Settings</v-card-title>
                        <v-card-text>
                            <v-alert v-if="!user.completed" class="mb-8" title="Complete seu perfil" variant="tonal"
                                closable border="start">Complete
                                seu
                                perfil</v-alert>
                            <v-row>
                                <!-- DISPLAY NAME -->
                                <v-col cols="12" class="d-flex required">
                                    <label for="name" class="label">Name</label>
                                    <v-text-field v-bind="fieldAttrs" id="name" name="name" label="" required
                                        :rules="[rules.required]" v-model="user.name"></v-text-field>
                                </v-col>


                                <v-col cols="12" class="d-flex">
                                    <label for="phone" class="label">Phone</label>
                                    <v-text-field v-bind="fieldAttrs" id="phone" label="" name="phone"
                                        v-model="user.phoneNumber"></v-text-field>
                                </v-col>
                                <!-- USERNAME -->
                                <!-- <v-col cols="12">
                                    <label for="name">Username</label>
                                    <v-text-field v-bind="fieldAttrs" id="username"
                                        v-model="user.username"></v-text-field>
                                </v-col> -->


                                <!-- LANGUAGE -->
                                <v-col cols="12" class="d-flex required">
                                    <label for="language" class="label">Language</label>
                                    <v-select :items="languages" v-bind="fieldAttrs" name="language" label=""
                                        id="language" :rules="[rules.required]" class="required" required
                                        v-model="user.language"></v-select>
                                </v-col>


                                <!-- BIRTHDAY -->
                                <v-col cols="12" class="d-flex required">
                                    <label for="birthday" class="label">Birthday</label>
                                    <v-text-field view-mode="year" v-bind="fieldAttrs" name="birthday" id="birthday"
                                        type="date" class="required" :rules="[rules.required]" required prepend-icon=""
                                        label="" v-model="user.birthday"></v-text-field>
                                </v-col>


                                <!-- GENDER -->
                                <v-col cols="12" class="d-flex">
                                    <label for="gender" class="label">Gender</label>
                                    <v-select :items="['Masculino', 'Feminino', 'Prefiro não dizer']" label=""
                                        name="gender" v-bind="fieldAttrs" id="gender" v-model="user.gender"></v-select>
                                </v-col>


                                <!-- COUNTRY -->
                                <v-col cols="12" class="d-flex required">
                                    <label for="country" class="label">Country</label>
                                    <v-text-field v-bind="fieldAttrs" id="country" label="Country" required
                                        name="country" :rules="[rules.required]" class="required"
                                        v-model="user.country"></v-text-field>
                                </v-col>

                                <!-- REGION -->
                                <v-col cols="12" class="d-flex required">
                                    <label for="region" class="label">Region</label>
                                    <v-text-field v-bind="fieldAttrs" id="region" label="Region" class="required"
                                        name="region" :rules="[rules.required]" v-model="user.region"></v-text-field>
                                </v-col>

                                <v-col cols="12" class="text-right">
                                    <v-btn class="mr-auto" color="primary" :loading="loading"
                                        type="submit">Salvar</v-btn>
                                </v-col>


                            </v-row>
                        </v-card-text>
                        <!-- <pre>
                {{ user }}
            </pre> -->
                    </v-card>
                </v-col>
            </v-row>

        </v-container>

    </v-form>
</template>

<script setup>
import {
  inject,
  ref,
  watch,
} from 'vue';

import { storeToRefs } from 'pinia';
import { VDateInput } from 'vuetify/labs/VDateInput';

import FormCard from '@/components/form/FormCard.vue';
import userSchema from '@/schemas/userSchema';
import { useFirebaseStore } from '@/store/firebase';
import { useUserStore } from '@/store/user';

const { fieldAttrs } = inject("$helpers");

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
        console.log("saveProfile")
        loading.value = true;
        const results = await event;
        console.log({ results })
        // if (!results.valid) {
        //     document.querySelector("#" + results.errors[0].id).focus();
        //     return false;
        // }
        user.value.completed = true;
        const response = await firebaseStore.putDocument("users", user.value.uid, user.value);

        if (response.ok) {
            response.notify("", "Your personal settings is successfully updated")
        }

        console.log({ response })


    } catch (error) {
        console.log("profile", { error });
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