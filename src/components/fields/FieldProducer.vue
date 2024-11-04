<template>
  <div>
    <v-autocomplete
      v-if="producers"
      v-bind="{ ...fieldAttrs, ...$attrs }"
      v-model="producer"
      :items="producers"
      item-value="id"
      item-title="name"
      @update:modelValue="changeProducer"
      clearable
    >
      <template #prepend-item>
        <v-list-item density="compact">
          <v-list-item-subtitle>Producers</v-list-item-subtitle>
          <template #append>
            <v-btn variant="text" @click="openDialog" size="sm" color="primary">
              Add Producer
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
        <v-icon class="mt-4">mdi-account-multiple</v-icon>
      </template>

      <template #close>
        <v-btn icon="mdi-close" @click="changeProducer(null)"></v-btn>
      </template>
    </v-alert>

    <form-dialog
      v-model:opened="dialog"
      v-if="newProducer"
      @submit="createAndAssociate"
      action="Create and Associate"
      :schema="producerSchema"
      v-model:model="newProducer"
      labelType="in"
      title="Add promoter"
    ></form-dialog>

    <!-- <v-dialog v-model="dialog" v-if="false">
            <v-card max-width="500" min-width="300" class="mx-auto">
                <v-card-title class="d-flex justify-space-between">
                    <span>Create Producer</span>
                    <v-btn @click="closeDialog" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <quick-create-producer @create="associateProducer"></quick-create-producer>
                </v-card-text>
            </v-card>
        </v-dialog> -->
  </div>
</template>

<script setup>
import { defineModel, inject, ref } from "vue";

import { storeToRefs } from "pinia";

import QuickCreateProducer from "@/components/quickcreate/QuickCreateProducer.vue";
import producerSchema from "@/schemas/quickProducerSchema";
import { useConfigStore } from "@/store/config";
import { useProducerStore } from "@/store/producer";
import { useProducersStore } from "@/store/producers";

import FormDialog from "../form/FormDialog.vue";

const { fieldAttrs, rules } = inject("$helpers");

const producersStore = useProducersStore();
const producerStore = useProducerStore();
const configStore = useConfigStore();

const { producers } = storeToRefs(producersStore);
const { producer: newProducer } = storeToRefs(producerStore);
const { countries } = storeToRefs(configStore);

const model = defineModel();
const producer = ref(null);
const dialog = ref(false);

function openDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

async function createAndAssociate() {
  const response = await producerStore.createProducer(false);
  if (response.ok) {
    // emit("create", response.data.document)
    associateProducer(response.data.document);
  }
}

function changeProducer(e) {
  const prod = producers.value.find((p) => p.id === e);
  if (prod) {
    model.value = { name: prod.name, username: prod.username, id: prod.id };
  } else {
    model.value = null;
    producer.value = null;
  }
}

async function associateProducer(prod) {
  await producersStore.pushProducer(prod);
  producer.value = prod.id;
  changeProducer(prod.id);
  closeDialog();
}
</script>

<style lang="scss" scoped></style>
