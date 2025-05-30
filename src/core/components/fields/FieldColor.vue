<template>
    <v-input v-model="model">
        <template #default="{ isValid }">
            <v-btn :border="isValid.value == false ? 'md error opacity-100' : ''"
                :density="fieldParams?.variant === 'mini' ? 'comfortable' : 'default'"
                :color="fieldParams?.variant === 'mini' ? 'null' : model || '#ffffff'"
                :variant="fieldParams?.variant === 'mini' ? 'tonal' : 'elevated'" class="px-0">
                <template v-if="fieldParams?.variant === 'mini'">
                    <v-avatar size="20" :color="model || '#ffffff'"></v-avatar>
                    <v-icon end size="small">mdi-chevron-down</v-icon>
                </template>
                <v-menu activator="parent">
                    <v-card variant="tonal">
                        <v-color-picker v-model="model" :swatches="swatches" hide-canvas hide-inputs show-swatches
                            hide-sliders mode="hex"></v-color-picker>
                    </v-card>
                </v-menu>
            </v-btn>

        </template>
    </v-input>

</template>

<script setup>
import { computed } from 'vue';
import {
    defineModel,
    inject,
    onMounted,
    watch,
} from 'vue';

const { label, type, items, fieldParams } = defineProps({ label: { type: [Boolean, String], default: false }, type: { type: String, default: "color" }, items: { type: Array, default: () => [] }, fieldParams: { type: [Object, null] } })

const model = defineModel();
const { fieldAttrs } = inject("$helpers");
const columns = 4;

const defaultSwatches = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#607D8B",
    "#9E9E9E"
]


const swatches = computed(() => {
    if (!items || items.length === 0) {
        const defaults = [];
        for (let i = 0; i < defaultSwatches.length; i += columns) {
            defaults.push(defaultSwatches.slice(i, i + columns));
        }
        return defaults;
    }
    const result = [];
    for (let i = 0; i < items.length; i += columns) {
        result.push(items.slice(i, i + columns));
    }
    return result;
})


onMounted(() => {
    if (fieldParams.random && !model.value) {
        const randomIndex = Math.round(Math.random() * (defaultSwatches.length - 1))
        model.value = defaultSwatches[randomIndex];
    }
})

</script>

<style lang="scss" scoped></style>