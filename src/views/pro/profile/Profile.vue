<template>
    <div>
        <v-bottom-navigation grow>
            <v-btn :to="{ name: 'pro-profile-personal' }">
                <v-icon>mdi-history</v-icon>

                <span>Personal</span>
            </v-btn>
            <v-btn :to="{ name: 'pro-profile-account' }">
                <v-icon>mdi-heart</v-icon>

                <span>Account</span>
            </v-btn>

            <v-btn :to="{ name: 'pro-profile-promoter' }">
                <v-icon>mdi-map-marker</v-icon>

                <span>Promoter</span>
            </v-btn>

        </v-bottom-navigation>
        <router-view></router-view>
    </div>
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
import FormSteps from '@/components/form/FormSteps.vue';
import FormBox from '@/components/form/FormBox.vue';
import promoterSchema from '@/schemas/promoterSchema';

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