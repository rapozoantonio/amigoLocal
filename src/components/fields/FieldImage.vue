<template>
    <div class="flex-grow-1" v-if="model && model.url" style="position:relative">
        <v-btn @click="model = null" size="small" color="red" variant="elevated" class="btn-close" icon>
            <v-icon>mdi-delete</v-icon></v-btn>
        <v-img :src="model.url">
        </v-img>
    </div>
    <v-file-input v-else v-model="files[field]" :show-size="1000" placeholder="Select your files" counter
        v-bind="{ ...fieldAttrs, ...$attrs }" class="pa-0" :clearable="false" :prepend-icon="null" :multiple="multiple">
        <template v-slot:label>
            <template v-if="!files[field]">
                <span>
                    <v-icon>mdi-camera</v-icon> Click or
                    drag files to add</span>
            </template>
            <template v-else>
                <span>
                    {{ label }}</span>
            </template>
        </template>

        <template v-slot:selection>
            <template v-if="Array.isArray(files[field])">
                <template v-for="(file, index) in files[field]" :key="index">
                    <v-img class="selection" :class="['rounded-' + fieldAttrs.rounded]" :src="imagePreview(file)">
                    </v-img>
                </template>
            </template>
            <template v-else>
                <v-img class=" selection" :class="['rounded-' + fieldAttrs.rounded]" :src="imagePreview(files[field])">
                </v-img>
            </template>

        </template>
    </v-file-input>
    {{ files[field] }}

</template>

<script setup>
import {
  computed,
  inject,
} from 'vue';

const { fieldAttrs, rules } = inject("$helpers");
const { field, multiple, label } = defineProps(["field", "multiple", "label"]);
const model = defineModel("model");
const files = defineModel("files");

const imagePreview = computed(() => {
    return (file) => {
        return URL.createObjectURL(file);
    };
});

</script>

<style lang="scss" scoped></style>