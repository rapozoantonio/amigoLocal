<template>
    <v-col cols="12" :md="expanded ? 12 : 6">
        <v-card min-height="360" flat border="thin" class="chart-card">
            <v-card-title class="chart-title">
                <div class="d-flex  align-center w-100">
                    <template v-if="$slots['title']">
                        <slot name="title"></slot>
                    </template>
                    <div v-else class="text-subtitle-1 font-weight-bold">
                        {{ title }}
                    </div>
                    <v-spacer></v-spacer>
                    <template v-if="$slots['title-actions']">
                        <slot name="title-actions"></slot>
                    </template>
                    <template v-else>
                        <v-chip variant="text" color="primary" size="small" prepend-icon="mdi-clock-outline">
                            Actualizado em tempo real
                        </v-chip>
                    </template>
                    <v-btn variant="text" class="ml-2" density="compact"
                        :icon="`mdi-unfold-${expanded ? 'less' : 'more'}-vertical`"
                        @click="expanded = !expanded"></v-btn>
                </div>
            </v-card-title>
            <v-card-text class="chart-content h-100">
                <slot></slot>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const { title, size } = defineProps(["title", "size"])
const expanded = ref(true);


onMounted(() => {
    if (size === "small") {
        expanded.value = false;
    }
})
</script>

<style lang="scss" scoped></style>