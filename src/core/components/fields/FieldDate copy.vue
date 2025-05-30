<template>
    <v-text-field v-model="model" v-bind="{ ...fieldAttrs, ...$attrs }" type="date" clearable>
        <v-menu activator="parent" location="top">
            <v-card variant="tonal">
                <v-date-picker hide-header @update:model-value="updateModel"></v-date-picker>
            </v-card>
        </v-menu>
    </v-text-field>
</template>

<script setup>
import {
    defineModel,
    inject,
    onMounted,
    watch,
} from 'vue';

const { label } = defineProps({ label: { type: [Boolean, String], default: false } })

const model = defineModel();
const { fieldAttrs } = inject("$helpers");


function updateModel(value) {
    if (!value) model.value = value;
    console.log({ value })
    const date = value.toISOString().split("T")[0];
    model.value = date;
}
onMounted(() => {
})

</script>

<style lang="scss" scoped></style>