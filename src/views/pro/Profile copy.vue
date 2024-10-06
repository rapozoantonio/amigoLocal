<template>
    <v-form @submit.prevent="saveProfile">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card v-if="user">
                        <v-card-title>Profile</v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- DISPLAY NAME -->
                                <v-col cols="12" class="d-flex align-center">
                                    <label for="name" class="mr-4">Name</label>
                                    <v-text-field v-bind="fieldAttrs" id="name" label="" required class="required"
                                        v-model="user.name"></v-text-field>
                                </v-col>


                                <v-col cols="6">
                                    <label for="name">Phone</label>
                                    <v-text-field v-bind="fieldAttrs" id="phone" label="Phone"
                                        v-model="user.phoneNumber"></v-text-field>
                                </v-col>
                                <!-- USERNAME -->
                                <!-- <v-col cols="12">
                                    <label for="name">Username</label>
                                    <v-text-field v-bind="fieldAttrs" id="username"
                                        v-model="user.username"></v-text-field>
                                </v-col> -->


                                <!-- LANGUAGE -->
                                <v-col cols="6">
                                    <label for="language">Language</label>
                                    <v-select :items="languages" v-bind="fieldAttrs" label="Language *" id="language"
                                        class="required" required v-model="user.language"></v-select>
                                </v-col>


                                <!-- BIRTHDAY -->
                                <v-col cols="6">
                                    <!-- <label for="birthday">Birthday</label> -->
                                    <v-date-input view-mode="year" v-bind="fieldAttrs" id="birthday" class="required"
                                        @update:viewMode="updateViewMode" prepend-icon="" label="Birthday *"
                                        v-model="user.birthday"></v-date-input>
                                </v-col>


                                <!-- GENDER -->
                                <v-col cols="6">
                                    <!-- <label for="gender">Gender</label> -->
                                    <v-select :items="['Masculino', 'Feminino', 'Prefiro não dizer']" label="Gender"
                                        v-bind="fieldAttrs" id="gender" v-model="user.gender"></v-select>
                                </v-col>


                                <!-- COUNTRY -->
                                <v-col cols="6">
                                    <!-- <label for="country">Country</label> -->
                                    <v-text-field v-bind="fieldAttrs" id="country" label="Country" required
                                        class="required" v-model="user.country"></v-text-field>
                                </v-col>

                                <!-- REGION -->
                                <v-col cols="6">
                                    <!-- <label for="region">Region</label> -->
                                    <v-text-field v-bind="fieldAttrs" id="region" label="Region" class="required"
                                        v-model="user.region"></v-text-field>
                                </v-col>

                                <v-col cols="12" class="text-right">
                                    <v-btn class="mr-auto" color="primary" :loading="loading"
                                        type="submit">Salvar</v-btn>
                                </v-col>


                            </v-row>
                        </v-card-text>
                        <pre>
                {{ user }}
            </pre>
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
} from 'vue';

import { storeToRefs } from 'pinia';
import { VDateInput } from 'vuetify/labs/VDateInput';

import { useFirebaseStore } from '@/store/firebase';
import { useUserStore } from '@/store/user';

const { fieldAttrs } = inject("$helpers");

const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const loading = ref(false);
const languages = ref([
    { title: "English", value: "en" },
    { title: "Spanish", value: "es" },
    { title: "Portuguese", value: "pt" },
    { title: "Italian", value: "it" },
]);

const firebaseStore = useFirebaseStore();

async function saveProfile(event) {
    try {
        loading.value = true;
        const results = await event;
        if (!results.valid) {
            document.querySelector("#" + results.errors[0].id).focus();
            return false;
        }


    } catch (error) {
        
    } finally {
        loading.value = false;
    }
}

function updateViewMode(viewmode) {
    
}


</script>

<style lang="scss"></style>