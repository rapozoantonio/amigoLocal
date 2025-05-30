<template>
    <div v-if="currentUser">
        <v-list>
            <v-list-item>
                <template #prepend>
                    <v-avatar color="primary">
                        <v-icon>mdi-account-group</v-icon>
                    </v-avatar>
                </template>
                <v-list-item-title>
                    {{ currentUser?.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ currentUser?.email }}
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup>
import {
    defineProps,
    inject,
    onMounted,
} from 'vue';

import { useAuthStore } from '@/core/store/auth';

const { fieldAttrs, rules } = inject("$helpers");
const currentUser = defineModel();
const authStore = useAuthStore();

onMounted(() => {
    console.log("mounted auth user", authStore.user)
    console.log("mounted current user", currentUser.value)
    if (currentUser.value) {
        return
    }
    if (authStore.user) {
        currentUser.value = {
            id: authStore.user.uid,
            email: authStore.user.email,
        }
    }
})
</script>

<style lang="scss" scoped></style>