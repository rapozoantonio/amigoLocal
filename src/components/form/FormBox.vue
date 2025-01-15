<template>
    <v-form class="form-container" @submit.prevent="submitForm">
        <v-card flat class="mx-auto" color="transparent">

            <template v-for="(section, index) in schema.sections" :key="section.name">
                <v-card-title v-if="section.name && section.name !== ''" class="mb-4"
                    :class="[index > 0 ? 'mt-4' : '']">
                    {{ section.name }}
                </v-card-title>
                <v-card-text>
                    <v-row :dense="dense">
                        <template v-for="field in section.fields" :key="field.id">
                            <template v-if="field.type === 'object'">
                                <form-field :labelType="labelType" v-for="child in field.children" :key="child.id"
                                    :items="items ? items[child.id] : null" v-model:files="files"
                                    v-model:model="model[field.id]" :field="child.id" v-bind="child"></form-field>
                            </template>

                            <form-field :labelType="labelType" :items="items[field.id] || null" v-else
                                v-model:files="files" v-model:model="model" :field="field.id"
                                v-bind="field"></form-field>
                        </template>

                    </v-row>

                </v-card-text>


            </template>
            <v-card-text>
                <v-row>
                    <v-col v-if="error" cols="12">
                        <v-alert density="compact" border="start" type="error" variant="outlined">
                            {{ error }}
                        </v-alert>
                    </v-col>
                    <v-col cols="12" :class="['text-' + buttonPosition]">
                        <v-btn :block="block" class="my-2" type="submit" variant="elevated" color="primary">{{ action ||
                            "Submit" }}</v-btn>
                    </v-col>
                </v-row>
                <slot name="append">
                    <p v-html="schema.append"></p>
                </slot>
            </v-card-text>


        </v-card>

    </v-form>
</template>

<script setup>
import { ref } from 'vue';

import FormField from '@/components/form/FormField.vue';

const model = defineModel("model");
const emit = defineEmits(["submit"])
const loading = ref(false);
const files = defineModel("files");
// const { schema, action, title, items } = defineProps(["schema", "action", "title", {"items"}]);
const { schema, action, title, items, block, error } = defineProps({
    schema: { type: Object, required: true },
    action: { type: String, default: "Save" },
    title: { type: String, default: "Edit record" },
    items: { type: Object, default: () => ({}) },
    labelType: {
        type: String, default: "up"  // in out left
    },
    dense: {
        type: Boolean, default: false
    },
    block: {
        type: Boolean, default: false
    },
    error: {
        type: [String, null]
    },
    buttonPosition: {
        type: String, default: "right"
    }
});

async function submitForm(event) {
    try {
        loading.value = true;
        const results = await event;
        if (!results.valid) {
            document.querySelector("#" + results.errors[0].id).focus();
            return false;
        }
        emit("submit");
    } catch (error) {

    } finally {
        loading.value = false;
    }
}

</script>

<style lang="scss" scoped></style>