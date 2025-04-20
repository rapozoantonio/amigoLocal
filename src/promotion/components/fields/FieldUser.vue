<template>
  <div>
    <v-autocomplete
      v-if="users"
      v-bind="{ ...fieldAttrs, ...$attrs }"
      v-model="user"
      :items="users"
      item-value="id"
      item-title="name"
      @update:modelValue="changeUser"
      clearable
    >
      <template #prepend-item>
        <v-list-item density="compact">
          <v-list-item-subtitle>Users</v-list-item-subtitle>
          <template #append>
            <v-btn variant="text" @click="openDialog" size="sm" color="primary">
              Add User
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
        <v-btn icon="mdi-close" @click="changeUser(null)"></v-btn>
      </template>
    </v-alert>
  </div>
</template>

<script setup>
import { defineModel, inject, ref } from "vue";

import { storeToRefs } from "pinia";

import userSchema from "@/core/schemas/quickUserSchema";
import { useConfigStore } from "@/promotion/store/config";
import { useUserStore } from "@/promotion/store/user";
import { useUsersStore } from "@/store/users";

import FormDialog from "../form/FormDialog.vue";

const { fieldAttrs, rules } = inject("$helpers");

const usersStore = useUsersStore();
const userStore = useUserStore();
const configStore = useConfigStore();

const { users } = storeToRefs(usersStore);
const { user: newUser } = storeToRefs(userStore);
const { countries } = storeToRefs(configStore);

const model = defineModel();
const user = ref(null);
const dialog = ref(false);

function openDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

async function createAndAssociate() {
  const response = await userStore.createUser(false);
  if (response.ok) {
    // emit("create", response.data.document)
    associateUser(response.data.document);
  }
}

function changeUser(e) {
  const user = users.value.find((p) => p.id === e);
  if (user) {
    model.value = { name: user.name, id: user.id };
  } else {
    model.value = null;
    user.value = null;
  }
}

async function associateUser(user) {
  await usersStore.pushUser(user);
  user.value = user.id;
  changeUser(user.id);
  closeDialog();
}
</script>

<style lang="scss" scoped></style>
