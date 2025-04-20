<template>
  <!-- <form-steps v-if="user" @submit="saveProfile" :schema="userSchema" v-model:model="user" v-model:files="files"
        labelType="left" title="Edit Profile" action="Save" :items="{ language: languages, gender: genders }">

        <template #prepend>
            <v-alert v-if="!user.completed" title="Complete seu perfil" variant="tonal" closable border="start">Complete
                seu perfil para aceder as funcionalidades personalizadas</v-alert>
        </template>
</form-steps> -->

  <v-container>
        <v-row>
            <!-- FORM -->
            <v-col cols="12">
                <!-- STEPPER -->
                <v-stepper bg-color="transparent" flat ref="stepper" v-model="step" class="d-flex" color="primary"
                    v-slot:default="{ next, prev }">

                    <!-- HEADER -->
                    <v-stepper-header flat v-show="!xs" class="flex-column justify-start pt-5 mr-4 flex-shrink-0">

                        <v-stepper-item class="pb-2 pt-2" title="Personal Info" value="personal_info" color="primary"
                            selected-class="text-primary font-weight-bold" editable icon="mdi-account">
                        </v-stepper-item>

                        <v-stepper-item class="pb-2 pt-2" title="Account Settings" value="account_info" color="primary"
                            selected-class="text-primary font-weight-bold" editable icon="mdi-cogs">
                        </v-stepper-item>

                        <v-stepper-item class="pb-2 pt-2" title="Promoter Settings" value="promoter_settings"
                            color="primary" selected-class="text-primary font-weight-bold" editable
                            icon="mdi-account-star">
                        </v-stepper-item>

                    </v-stepper-header>

                    <!-- FORM CONTENT -->
                    <v-stepper-window class="flex-grow-1 mx-0 ma-0" style="margin: 0px">

                        <v-stepper-window-item value="personal_info">
                            <form-box v-if="user" @submit="saveProfile" :schema="userSchema" v-model:model="user"
                                v-model:files="files" labelType="left" title="Edit Profile" action="Save"
                                :items="{ language: languages, gender: genders }">

                                <template #prepend>
                                    <v-alert v-if="!user.completed" title="Complete seu perfil" variant="tonal" closable
                                        border="start">Complete
                                        seu perfil para aceder as funcionalidades personalizadas</v-alert>
                                </template>
                            </form-box>
                        </v-stepper-window-item>

                        <v-stepper-window-item value="account_info">
                            <form-box v-if="user" @submit="saveProfile" :schema="userSchema" v-model:model="user"
                                v-model:files="files" labelType="left" title="Edit Profile" action="Save"
                                :items="{ language: languages, gender: genders }">

                                <template #prepend>
                                    <v-alert v-if="!user.completed" title="Complete seu perfil" variant="tonal" closable
                                        border="start">Complete
                                        seu perfil para aceder as funcionalidades personalizadas</v-alert>
                                </template>
                            </form-box>
                        </v-stepper-window-item>

                        <v-stepper-window-item value="promoter_settings">
                            <form-box v-if="user" @submit="saveProfile" :schema="promoterSchema" v-model:model="user"
                                v-model:files="files" labelType="up" title="Edit Profile" action="Save"
                                :items="{ language: languages, gender: genders }">

                                <template #prepend>
                                    <v-alert v-if="!user.completed" title="Complete seu perfil" variant="tonal" closable
                                        border="start">Complete
                                        seu perfil para aceder as funcionalidades personalizadas</v-alert>
                                </template>
                            </form-box>
                        </v-stepper-window-item>

                    </v-stepper-window>
                </v-stepper>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { inject, ref, watch } from "vue";

import { storeToRefs } from "pinia";
import { VDateInput } from "vuetify/labs/VDateInput";

import FormCard from "@/promotion/components/form/FormCard.vue";
import userSchema from "@/core/schemas/userSchema";
import { useFirebaseStore } from "@/core/store/firebase";
import { useUserStore } from "@/promotion/store/user";
import FormSteps from "@/promotion/components/form/FormSteps.vue";
import FormBox from "@/core/components/form/FormBox.vue";
import promoterSchema from "@/core/schemas/promoterSchema";

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

const genders = ref(["Masculino", "Feminino", "Prefiro não dizer"]);

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
    const response = await firebaseStore.putDocument(
      "users",
      user.value.uid,
      user.value
    );

    if (response.ok) {
      response.notify("", "Your personal settings is successfully updated");
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
