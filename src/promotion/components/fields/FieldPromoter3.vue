<template>
  <div>
    <v-autocomplete
      v-if="promoters"
      v-bind="{ ...fieldAttrs, ...$attrs }"
      v-model="promoter"
      :items="promoters"
      item-value="id"
      item-title="name"
      @update:modelValue="changePromoter"
      clearable
    >
      <template #prepend-item>
        <v-list-item density="compact">
          <v-list-item-subtitle>Promoters</v-list-item-subtitle>
          <template #append>
            <v-btn variant="text" @click="openDialog" size="sm" color="primary">
              Add Promoter
              <v-icon class="ml-2" end>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
        </v-list-item>
        <v-divider class="mb-2"></v-divider>
      </template>
      <template v-slot:item="{ item, props }">
        <v-list-item v-bind="props">
          <v-list-item-subtitle
            >{{ item.raw.username }} ({{
              item.raw.country
            }})</v-list-item-subtitle
          >
        </v-list-item>
      </template>
    </v-autocomplete>

    <v-alert class="mt-4" variant="outlined" v-if="model">
      <template #text>
        <p class="text-h6">{{ model.name }}</p>
        <p class="text-body-2">{{ model.username }}</p>
      </template>

      <template #prepend>
        <v-icon class="mt-4">mdi-account-group</v-icon>
      </template>

      <template #close>
        <v-btn icon="mdi-close" @click="changePromoter(null)"></v-btn>
      </template>
    </v-alert>

    <form-dialog
      v-model:opened="dialog"
      v-if="newPromoter"
      @submit="createAndAssociate"
      action="Create and Associate"
      :schema="promoterSchema"
      v-model:model="newPromoter"
      labelType="in"
      title="Add promoter"
    ></form-dialog>

    <!-- <v-dialog v-model="dialog" v-if="false">
            <v-card max-width="500" min-width="300" class="mx-auto">
                <v-card-title class="d-flex justify-space-between">
                    <span>Create Promoter</span>
                    <v-btn @click="closeDialog" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <quick-create-promoter @create="associatePromoter"></quick-create-promoter>
                </v-card-text>
            </v-card>
        </v-dialog> -->
  </div>
</template>

<script setup>
import { defineModel, inject, ref } from "vue";

import { storeToRefs } from "pinia";

import promoterSchema from "@/core/schemas/quickPromoterSchema";
import { useConfigStore } from "@/promotion/store/config";
import { usePromoterStore } from "@/promotion/store/promoters";
import { usePromotersStore } from "@/promotion/store/promoters";

import FormDialog from "../form/FormDialog.vue";

const { fieldAttrs, rules } = inject("$helpers");

const promotersStore = usePromotersStore();
const promoterStore = usePromoterStore();
const configStore = useConfigStore();

const { promoters } = storeToRefs(promotersStore);
const { promoter: newPromoter } = storeToRefs(promoterStore);
const { countries } = storeToRefs(configStore);

const model = defineModel();
const promoter = ref(null);
const dialog = ref(false);

function openDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

async function createAndAssociate() {
  const response = await promoterStore.createPromoter(false);
  if (response.ok) {
    // emit("create", response.data.document)
    associatePromoter(response.data.document);
  }
}

function changePromoter(e) {
  const prod = promoters.value.find((p) => p.id === e);
  if (prod) {
    model.value = { name: prod.name, username: prod.username, id: prod.id };
  } else {
    model.value = null;
    promoter.value = null;
  }
}

async function associatePromoter(prod) {
  await promotersStore.pushPromoter(prod);
  promoter.value = prod.id;
  changePromoter(prod.id);
  closeDialog();
}
</script>

<style lang="scss" scoped></style>
