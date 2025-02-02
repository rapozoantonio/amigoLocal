<template>
  <form-card v-if="promoter" @submit="saveProfile" :schema="promoterSchema" v-model:model="promoter"
    v-model:files="files" labelType="up" title="Editar perfil promoter" action="Salvar"
    :items="{ language: languages, gender: genders }">

  </form-card>
</template>

<script setup>
import { inject, ref, watch } from "vue";

import { storeToRefs } from "pinia";
import FormCard from "@/components/form/FormCard.vue";
import { useFirebaseStore } from "@/store/firebase";
import { useUserStore } from "@/store/user";
import promoterSchema from "@/schemas/promoterSchema";

const userStore = useUserStore();
const { promoter } = storeToRefs(userStore);
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
    promoter.value.completed = true;
    const response = await firebaseStore.putDocument(
      "promoters",
      promoter.value.uid,
      promoter.value
    );

    if (response.ok) {
      response.notify("", "Your promoter settings is successfully updated");
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
