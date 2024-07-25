<template>
    <div v-if="promoter">
        <v-list>
            <v-list-item>
                <template #prepend>
                    <v-avatar color="primary">
                        <v-icon>mdi-account-outline</v-icon>
                    </v-avatar>
                </template>
                <v-list-item-title>
                    {{ promoter?.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ promoter?.email }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    {{ promoter?.code }}
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup>
import {
  defineProps,
  inject,
} from 'vue';

const { fieldAttrs, rules } = inject("$helpers");
const promoter = defineModel();

</script>

<style lang="scss" scoped></style>