<template>
    <div class="flex-grow-1" v-if="model && model.url" style="position:relative">
        <v-btn @click="model = null" size="small" color="red" variant="elevated" class="btn-close" icon>
            <v-icon>mdi-delete</v-icon></v-btn>
        <v-img max-height="300" :src="model.url">
        </v-img>
    </div>
    <template v-else>
        <v-file-input @update:model-value="updateModel" :model-value="model" :show-size="1000"
            placeholder="Select your files" counter v-bind="{ ...fieldAttrs, ...$attrs }" class="pa-0"
            :clearable="false" :prepend-icon="null" :multiple="multiple">
            <template v-slot:label>
                <template v-if="!model">
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
                <!-- <template v-if="Array.isArray(model)">
                    <template v-for="(file, index) in model" :key="index">
                        <v-img width="200" height="300" class="selection" :class="['rounded-' + fieldAttrs.rounded]"
                            :src="imagePreview(file)">
                            <v-btn @click.stop>close</v-btn>
                        </v-img>
                    </template>
</template>
<template v-else>
                    <v-img class=" selection" :class="['rounded-' + fieldAttrs.rounded]" :src="imagePreview(model)">
                    </v-img>
                </template> -->
                <p class="text-body-2 ml-4">Click or drag to add more</p>

            </template>
        </v-file-input>
        <div class="d-flex flex-wrap">
            <template v-if="Array.isArray(model)">
                <template v-for="(file, index) in model" :key="index">
                    <v-card variant="tonal" width="200" height="300" class="mr-4">
                        <v-img class="selection " :class="['rounded-' + fieldAttrs.rounded]" :src="imagePreview(file)">
                            <v-btn @click.stop="removeFile(index)">close</v-btn>
                        </v-img>

                    </v-card>

                </template>
            </template>
            <template v-else>
                <v-img v-if="model" class=" selection" :class="['rounded-' + fieldAttrs.rounded]"
                    :src="imagePreview(model)">
                </v-img>
            </template>
        </div>

    </template>
    <pre v-if="model">
    {{ model }}

</pre>
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

    if (files === null || files.length === 0) {
        return;
    }
    console.log({ files })
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

console.log({ files: files.value })

</script>

<style lang="scss" scoped></style>