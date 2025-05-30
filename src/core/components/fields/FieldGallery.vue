<template>
    <div>
        <v-row dense>
            <template v-if="Array.isArray(model)">
                <v-fade-transition group>
                    <v-col v-for="(file, index) in model" :key="index" cols="12" lg="2" md="3" sm="4">
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card variant="outlined" border="md surface-variant opacity-100" max-width="300"
                                class="mx-auto" v-bind="props">
                                <v-img class="selection" :class="['rounded-' + fieldAttrs.rounded]"
                                    :src="file.url || imagePreview(file)" contain>
                                    <v-slide-y-transition>
                                        <template v-if="isHovering">
                                            <div>
                                                <v-fab absolute location="top end" @click="removeFile(index)"
                                                    class="mt-1 mr-1" size="small" density="comfortable" color="red"
                                                    variant="elevated" icon="mdi-delete"></v-fab>
                                                <div class="d-flex flex-column">
                                                    <v-btn class=" ml-1" icon="mdi-arrow-up" size="small"
                                                        variant="elevated" @click="moveUp(index)" density="comfortable"
                                                        color="blue-grey" elevation="20"></v-btn>
                                                    <v-btn class="mt-1 ml-1" icon="mdi-arrow-down" size="small"
                                                        variant="elevated" @click="moveDown(index)"
                                                        density="comfortable" color="blue-grey" elevation="20"></v-btn>
                                                </div>

                                            </div>
                                        </template>
                                    </v-slide-y-transition>
                                </v-img>
                            </v-card>


                        </v-hover>
                        <p v-if="file.size" class="text-caption text-right">
                            {{ (file.size / (1024 * 1024)).toFixed(2) }} Mb
                        </p>
                    </v-col>

                </v-fade-transition>
            </template>
            <v-col key="add" class="custom-field">
                <v-file-upload density="comfortable" @update:model-value="updateModel" :multiple="true">
                    <template v-slot:title>
                        <p class="text-body-1 text-center">Click to add files or Drop files here</p>
                    </template>
                    <template v-slot:icon>
                        <v-icon class="mb-0" size="x-small">mdi-upload</v-icon>
                    </template>

                    <template v-slot:item="{ props: itemProps }">
                        <v-file-upload-item v-if="false" v-bind="itemProps" lines="one" nav>
                        </v-file-upload-item>
                    </template>
                </v-file-upload>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import {
    computed,
    inject,
} from 'vue';



const { fieldAttrs, rules } = inject("$helpers");
const { field, multiple, label, max } = defineProps(["field", "multiple", "label", "max"]);
import { VFileUpload, VFileUploadItem } from 'vuetify/labs/VFileUpload'

const model = defineModel("model");
const files = defineModel("files");
const swal = inject("$swal");
const imagePreview = computed(() => {
    return (file) => {
        return URL.createObjectURL(file);
    };
});

function updateModel(files) {
    if (files === null || files.length === 0) {
        return;
    }
    console.log({ files })
    console.log({ max })
    const modelSize = model.value ? model.value.length : 0
    if (max && (files.length + modelSize) > max) {
        swal.fire({
            title: "Limit reached",
            html: "This field only allow " + max + " items",
            icon: "error"
        })
        return;
    }

    if (Array.isArray(model.value)) {
        model.value = [...model.value, ...files];
    }
    else {
        model.value = files;
    }
}

function removeFile(index) {
    model.value.splice(index, 1)
}

function moveUp(index) {
    if (index > 0) {
        [model.value[index - 1], model.value[index]] = [model.value[index], model.value[index - 1]]
    }
}

function moveDown(index) {
    if (index < model.value.length - 1) {
        [model.value[index], model.value[index + 1]] = [model.value[index + 1], model.value[index]]
    }
}

console.log({ files: files.value })

</script>

<style lang="scss">
.custom-field .v-file-upload {
    padding: 20px 0px;
    height: 100%;
}
</style>