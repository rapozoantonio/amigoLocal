<template>
  <form-card v-if="promoter" @submit="savePromoter" :schema="promoterSchema" v-model:model="promoter"
    v-model:files="files" labelType="up" title="Editar perfil promoter" action="Salvar"
    :items="{ language: languages, gender: genders }">

  </form-card>
</template>

<script setup>
import { inject, ref, watch } from "vue";

import { storeToRefs } from "pinia";
import FormCard from "@/promotion/components/form/FormCard.vue";
import { useFirebaseStore } from "@/promotion/store/firebase";
import { useUserStore } from "@/promotion/store/user";
import promoterSchema from "@/schemas/promoterSchema";
import { useAppStore } from "@/promotion/store/app";
const appStore = useAppStore();
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

async function savePromoter() {
  console.log("savepromoter")
  appStore.loading = true;
  appStore.loadingText = "Atualizando promoter...";
  try {
    const id = promoter.value.id;
    const entries = Object.entries(files.value);

    const filesToUpload = entries.reduce((total, [name, value]) => {
      if (!value) return total;
      if (Array.isArray(value)) {
        if (value[0]) {
          total.push({
            name: name,
            path: `promoters/${id}/${name}.${value[0].type.split("/").pop()}`,
            file: value[0],
          });
        }
      } else {
        total.push({
          name: name,
          path: `promoters/${id}/${name}.${value.type.split("/").pop()}`,
          file: value,
        });
      }

      return total;
    }, []);

    const pictures = await firebaseStore.uploadPictures(filesToUpload);

    pictures.forEach((p) => {
      promoter.value[p.name] = {
        path: p.path,
        url: p.url,
      };
    });

    const response = await firebaseStore.putDocument(
      "promoters",
      id,
      promoter.value
    );
    if (response.ok) {
      response.notify();
      return { ok: true };
    }
    return { ok: false };
  } catch (error) {
    return { ok: false, error };
  } finally {
    appStore.loading = false;
    appStore.loadingText = null;
  }
}
</script>

<style lang="scss" scoped>
.label {
  width: 75px;
}

:deep(.v-img) {
  width: 90px !important;
  height: 90px !important;
  
  .v-responsive__sizer {
    padding-bottom: 90px !important;
  }
}
</style>