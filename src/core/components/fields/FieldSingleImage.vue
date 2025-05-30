<template>

    <v-card v-if="model && model.url" variant="tonal" max-width="300" class="mr-4"
        border="md surface-variant opacity-100">
        <v-img class="selection " :class="['rounded-' + fieldAttrs.rounded]" :src="model.url">
            <v-fab absolute location="top end" class="mt-2 mr-2" @click="removeFile" size="small" density="comfortable"
                color="red" variant="elevated" icon="mdi-delete">
            </v-fab>
        </v-img>
    </v-card>
    <template v-else>
        <div v-if="model">
            <v-card variant="outlined" class="mb-3" border="md surface-variant opacity-100">
                <v-img class="selection" max-height="300" :class="['rounded-' + fieldAttrs.rounded]"
                    :src="imagePreview(model)" contain>
                    <v-fab absolute location="top end" class="mt-2 mr-2" @click="removeFile" size="small"
                        density="comfortable" color="red" variant="elevated" icon="mdi-delete"></v-fab>
                </v-img>
            </v-card>
        </div>
        <v-file-input @update:model-value="updateModel" :model-value="model" :show-size="1000"
            placeholder="Select your files" counter v-bind="{ ...fieldAttrs, ...$attrs }" class="pa-0"
            hide-details="auto" :clearable="false" :prepend-icon="null" :multiple="false">
            <template v-slot:label>
                <template v-if="!model">
                    <span>
                        <v-icon>mdi-camera</v-icon> Click or
                        drag file to add</span>
                </template>
                <template v-else>
                    <span>
                        {{ label }}</span>
                </template>
            </template>
            <template v-slot:selection>
                <p class="text-body-2 ml-4">Click or drag to change image</p>
            </template>
        </v-file-input>

    </template>

</template>

<script setup>
import { ref } from 'vue';
import {
    computed,
    inject,
} from 'vue';



const { fieldAttrs, rules } = inject("$helpers");
const { field, multiple, label } = defineProps(["field", "multiple", "label"]);
// import { VFileUpload } from 'vuetify/labs/VFileUpload'

const model = defineModel("model");
const files = defineModel("files");

const imagePreview = computed(() => {
    return (file) => {
        return URL.createObjectURL(file);
    };
});

function updateModel(files) {
    model.value = files;
}

function removeFile() {
    model.value = null
}

console.log({ files: files.value })
console.log({ model: model.value })

</script>

<style lang="scss" scoped></style>