<template>
    <!-- FORM DIALOG -->
    <v-dialog v-model="opened" :fullscreen="fullscreen" transition="dialog-bottom-transition">
        <!-- SLOT ACTIVATOR -->
        <template v-slot:activator="{ props: activatorProps }">
            <slot name="activator" v-bind="{ props: activatorProps }"></slot>
        </template>
        <!-- FORM -->
        <v-form class="form-container" @submit.prevent="submitForm" style="height:100%" ref="form" :loading="loading">
            <template #default="{ validate, reset, resetValidation, errors }"> <v-card max-width="600" class="mx-auto">
                    <!-- FORM HEADER -->
                    <v-card-title class="bg-primary d-flex">
                        <!-- SLOT HEADER PREPEND -->
                        <slot name="header-prepend" v-bind="{ validate, reset, resetValidation, errors }"></slot>
                        <!-- FORM NAME -->
                        <span>{{ title || schema.name }}</span>
                        <!-- SLOT HEADER APPEND -->
                        <slot name="header-append" v-bind="{ validate, reset, resetValidation, errors }"></slot>
                        <v-spacer></v-spacer>
                        <!-- DIALOG CLOSE BUTTON -->
                        <v-btn @click="opened = false" variant="text" size="x-small" icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <!-- SLOT PREPEND -->
                    <v-card-text v-if="$slots.prepend">
                        <slot name="prepend" v-bind="{ validate, reset, resetValidation, errors }"></slot>
                    </v-card-text>

                    <!-- SLOT PREPEND INNER -->
                    <v-card-text class="pb-0" v-if="$slots['prepend-inner']">
                        <slot name="prepend-inner" v-bind="{ validate, reset, resetValidation, errors }"></slot>
                    </v-card-text>
                    <!-- <pre>
                        {{ model }}

                    </pre> -->
                    <v-container>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <!-- FORM SECTIONS -->
                                <template v-for="(section, index) in schema.sections" :key="section.name">
                                    <!-- SECTION -->
                                    <v-card-title v-if="section.name && section.name !== ''"
                                        class="mb-4 d-flex align-center" :class="[index > 0 ? 'mt-0' : '']">
                                        <!-- SLOT PREPEND HEADER SECTION -->
                                        <slot :name="'prepend-header-section-' + (index + 1)"
                                            v-bind="{ validate, reset, resetValidation, errors }"></slot>
                                        <!-- SECTION NAME -->
                                        <span>
                                            {{ section.name }}
                                        </span>
                                        <!-- SLOT APPEND HEADER SECTION -->
                                        <slot :name="'append-header-section-' + (index + 1)"
                                            v-bind="{ validate, reset, resetValidation, errors }"></slot>
                                    </v-card-title>
                                    <!-- SLOT PREPEND SECTION -->
                                    <v-card-text v-if="$slots['prepend-section-' + (index + 1)]">
                                        <slot :name="'prepend-section-' + (index + 1)"
                                            v-bind="{ validate, reset, resetValidation, errors }"></slot>
                                    </v-card-text>
                                    <!-- SECTION CONTENT -->
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-row>
                                                    <template v-for="field in section.fields" :key="field.id">
                                                        <template v-if="$slots['field-' + field.id]">
                                                            <slot :name="'field-' + field.id"
                                                                v-bind="{ fieldParams: schema.fieldParams, field, model, items: items[field.id], }">
                                                            </slot>
                                                        </template>
                                                        <template v-else>
                                                            <template v-if="field.type === 'object'">
                                                                <form-field
                                                                    :labelType="schema.fieldParams?.labelType || labelType"
                                                                    v-for="child in field.children" :key="child.id"
                                                                    :items="items ? items[child.id] : null"
                                                                    v-model:files="files"
                                                                    v-model:model="model[field.id]" :field="child.id"
                                                                    :fieldParams="schema.fieldParams"
                                                                    v-bind="child"></form-field>
                                                            </template>

                                                            <form-field v-else
                                                                :labelType="schema.fieldParams?.labelType || labelType"
                                                                :items="items[field.id] || null" v-model:files="files"
                                                                v-model:model="model" :field="field.id"
                                                                :fieldParams="schema.fieldParams"
                                                                v-bind="field"></form-field>
                                                        </template>

                                                    </template>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <!-- SLOT APPEND SECTION -->
                                    <v-card-text v-if="$slots['append-section-' + (index + 1)]">
                                        <slot :name="'append-section-' + (index + 1)"
                                            v-bind="{ validate, reset, resetValidation, errors }"></slot>
                                    </v-card-text>
                                </template>

                            </v-col>
                        </v-row>
                    </v-container>


                    <!-- SLOT APPEND INNER -->
                    <v-card-text v-if="$slots['append-inner']">
                        <slot name="append-inner" v-bind="{ validate, reset, resetValidation, errors, model }"></slot>
                    </v-card-text>

                    <v-container>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <!-- ACTIONS -->
                                <!-- <v-scale-transition mode="out-in" origin="center right" hide-on-leave> -->
                                <v-card-text class="text-right pt-0">
                                    <v-row dense justify="end">
                                        <v-col cols="auto" v-if="$slots['action-prepend']">
                                            <!-- SLOT ACTION PREPEND -->
                                            <slot name="action-prepend"
                                                v-bind="{ validate, reset, resetValidation, errors, submit, loading, disabled: loading, }">
                                            </slot>
                                        </v-col>

                                        <v-col cols="auto" v-if="$slots['cancel-button'] || cancel">
                                            <!-- CANCEL BUTTON -->
                                            <slot v-if="$slots['cancel-button']" name="cancel-button"
                                                v-bind="{ disabled: loading, validate, reset, resetValidation, errors, loading }">
                                            </slot>
                                            <v-btn v-else-if="cancel" :variant="schema.buttonVariant || 'elevated'"
                                                size="large" @click="opened = false" :disabled="loading">{{
                                                    typeof
                                                        cancel ===
                                                        "string" ? cancel : "Cancelar" }}</v-btn>
                                        </v-col>
                                        <v-col cols="auto">
                                            <!-- ACTION BUTTON -->
                                            <slot v-if="$slots['action-button']" name="action-button"
                                                v-bind="{ validate, reset, resetValidation, errors, submit, loading }">
                                            </slot>
                                            <v-btn v-else type="submit" size="large"
                                                :variant="schema.buttonVariant || 'elevated'" :disabled="loading"
                                                :color="schema.actionColor || 'primary'">{{
                                                    action ||
                                                    "Enviar" }}</v-btn>
                                        </v-col>
                                        <v-col cols="auto" v-if="$slots['action-append']">
                                            <slot name="action-append"
                                                v-bind="{ submit, validate, reset, resetValidation, errors }">
                                            </slot>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <!-- <v-card-text class="text-right pt-0" v-else>
                                        <v-btn color="primary" variant="elevated" :loading="true"> </v-btn>
                                    </v-card-text> -->
                                <!-- </v-scale-transition> -->
                                <v-progress-linear v-if="loading" indeterminate color="primary"
                                    height="6"></v-progress-linear>
                            </v-col>
                        </v-row>
                    </v-container>

                    <!-- SLOT APPEND -->
                    <v-card-text v-if="$slots.append">

                        <slot name="append" v-bind="{ validate, reset, resetValidation, errors, model }"></slot>
                    </v-card-text>
                </v-card></template>
        </v-form>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import FormField from '@/core/components/form/FormField.vue';

const model = defineModel("model");
const opened = defineModel("opened");
const emit = defineEmits(["submit"])
const loading = defineModel("loading");
const files = defineModel("files");
const form = ref(null);
// const { schema, action, title, items } = defineProps(["schema", "action", "title", {"items"}]);
const { schema, action, title, items, fullscreen, cancel, loadingBtn } = defineProps({
    schema: { type: Object, required: true },
    action: { type: String, default: "Save" },
    title: { type: String, default: "Edit record" },
    items: { type: Object, default: () => ({}) },
    labelType: {
        type: String, default: "up"  // in out left
    },
    fullscreen: { type: Boolean, default: false },
    cancel: { type: [Boolean, String], default: false },
    loadingBtn: { type: Boolean, default: false },
});

function closeDialog() {
    opened.value = false;
    loading.value = false;
}

async function submitForm(event, type = "submit") {
    try {
        loading.value = true;
        const results = await event;

        if (!results.valid) {
            loading.value = false;
            document.querySelector("#" + results.errors[0].id).focus();
            return false;
        }
        console.log("submitted");


        emit("submit", model.value, closeDialog, type);

    } catch (error) {

    }
}

async function submit(type = "submit") {
    try {
        loading.value = true;
        const results = await form.value.validate();

        if (!results.valid) {
            loading.value = false;
            document.querySelector("#" + results.errors[0].id).focus();
            return false;
        }
        emit("submit", model.value, closeDialog, type);

    } catch (error) {

    }
}

</script>

<style lang="scss" scoped></style>