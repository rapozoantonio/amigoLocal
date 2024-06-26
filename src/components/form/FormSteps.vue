<template>
    <!-- FORM STEPS -->
    <v-container>
        <v-row>
            <!-- FORM -->
            <v-col cols="12">
                <!-- STEPPER -->
                <v-stepper bg-color="transparent" flat ref="stepper" v-model="step" class="d-flex" color="primary"
                    v-slot:default="{ next, prev }">

                    <!-- HEADER -->
                    <v-stepper-header flat v-show="!xs" class="flex-column justify-start pt-5 mr-4 flex-shrink-0">
                        <!-- SLOT HEADER PREPEND -->
                        <slot name="header-prepend"></slot>
                        <!-- HEADER ITEM -->
                        <v-stepper-item v-for="(header, index) in headers" :key="header" class="pb-2 pt-2"
                            :complete="formValid[index]" :editable="step > index || formValid[index]" :title="header"
                            :value="index + 1" color="primary" selected-class="text-primary font-weight-bold">
                        </v-stepper-item>
                        <!-- SLOT HEADER APPEND -->
                        <slot name="header-append"></slot>
                    </v-stepper-header>

                    <!-- FORM CONTENT -->
                    <v-stepper-window class="flex-grow-1 mx-0 ma-0" style="margin: 0px">
                        <!-- SLOT PREPEND -->
                        <slot name="prepend"></slot>
                        <!-- FORM SECTION -->
                        <v-stepper-window-item :value="index + 1" v-for="(section, index) in schema.sections"
                            :key="section.name">
                            <v-form ref="formEl" v-model="formValid[index]" class="flex-grow-1">
                                <!-- SECTION -->
                                <v-card max-width="1000">

                                    <!-- SLOT PREPEND INNER -->
                                    <v-card-text v-if="$slots['prepend-inner']">
                                        <slot name="prepend-inner"></slot>
                                    </v-card-text>

                                    <!-- SLOT PREPEND SECTION -->
                                    <v-card-text v-if="$slots['prepend-section-' + (index + 1)]">
                                        <slot :name="'prepend-section-' + (index + 1)"></slot>
                                    </v-card-text>

                                    <!-- SECTION NAME -->
                                    <v-card-title class="mb-2">{{ section.name }}</v-card-title>

                                    <!-- SECTION CONTENT -->
                                    <v-card-text class="px-6">
                                        <!-- FIELDS -->
                                        <v-row>
                                            <template v-for="field in section.fields" :key="field.id">
                                                <template v-if="field.type === 'object'">
                                                    <form-field :labelType="labelType" v-for="child in field.children"
                                                        :key="child.id" :items="items ? items[child.id] : null"
                                                        v-model:files="files" v-model:model="model[field.id]"
                                                        :field="child.id" v-bind="child"></form-field>
                                                </template>

                                                <form-field :labelType="labelType" :items="items[field.id] || null"
                                                    v-else v-model:files="files" v-model:model="model" :field="field.id"
                                                    v-bind="field"></form-field>
                                            </template>
                                        </v-row>

                                        <!-- ACTIONS -->
                                        <v-row>
                                            <!-- SLOT ACTION PREPEND -->
                                            <v-col cols="auto" v-if="$slots['action-prepend']">
                                                <slot name="action-prepend"></slot>
                                            </v-col>

                                            <!-- SLOT ACTION PREPEND SECTION -->
                                            <v-col cols="auto" v-if="$slots['action-prepend-section-' + (index + 1)]">
                                                <slot :name="'action-prepend-section-' + (index + 1)"></slot>
                                            </v-col>

                                            <!-- ACTION BUTTON -->
                                            <v-col cols="auto">
                                                <v-btn color="warning" :disabled="step === 1" @click="prev">Prev</v-btn>
                                            </v-col>

                                            <v-spacer></v-spacer>

                                            <!-- SLOT ACTION MIDDLE SECTION -->
                                            <v-col cols="auto" v-if="$slots['action-middle-section-' + (index + 1)]">
                                                <slot :name="'action-middle-section-' + (index + 1)"></slot>
                                            </v-col>

                                            <!-- SLOT ACTION MIDDLE -->
                                            <v-col cols="auto" v-if="$slots['action-middle']">
                                                <slot name="action-middle"></slot>
                                            </v-col>

                                            <v-spacer></v-spacer>

                                            <!-- ACTION BUTTON -->
                                            <v-col cols="auto">
                                                <v-btn color="primary"
                                                    @click="nextStep(index, schema.sections.length === step ? submitForm : next)">{{
                                                        schema.sections.length
                                                            === step
                                                            ?
                                                            'Submit' :
                                                            'Next' }}</v-btn>
                                            </v-col>

                                            <!-- SLOT ACTION APPEND SECTION-->
                                            <v-col cols="auto" v-if="$slots['action-append-section-' + (index + 1)]">
                                                <slot :name="'action-append-section-' + (index + 1)"></slot>
                                            </v-col>

                                            <!-- SLOT ACTION APPEND -->
                                            <v-col cols="auto" v-if="$slots['action-append']">
                                                <slot name="action-append"></slot>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>

                                    <!-- SLOT APPEND SECTION -->
                                    <v-card-text v-if="$slots['append-section-' + (index + 1)]">
                                        <slot :name="'append-section-' + (index + 1)"></slot>
                                    </v-card-text>

                                    <!-- SLOT APPEND INNER -->
                                    <v-card-text v-if="$slots['append-inner']">
                                        <slot name="append-inner"></slot>
                                    </v-card-text>

                                </v-card>
                            </v-form>
                        </v-stepper-window-item>

                        <!-- SLOT APPEND -->
                        <slot name="append"></slot>

                    </v-stepper-window>
                </v-stepper>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import {
    computed,
    onMounted,
    ref,
} from 'vue';

import { useDisplay } from 'vuetify/lib/framework.mjs';

import FormField from '@/components/form/FormField.vue';

const formEl = ref(null);
// FORM COMPONENT
const model = defineModel("model");
const emit = defineEmits(["submit"])
const loading = ref(false);
const files = defineModel("files");
const { schema, action, title, items } = defineProps({
    schema: { type: Object, required: true },
    action: { type: String, default: "Save" },
    title: { type: String, default: "Edit record" },
    items: { type: Object, default: () => ({}) },
    labelType: {
        type: String, default: "up"  // in out left
    },
    dense: {
        type: Boolean, default: false
    }
});

// Components
const headers = computed(() => {
    return schema?.sections.reduce((total, section) => {
        if (section.type === "section") {
            total.push(section.name);
        }
        return total;
    }, [])
});

const formValid = ref(schema.sections.map(() => null));

const stepper = ref(null);
const step = ref(1);
const { xs } = useDisplay();

async function submitForm() {
    try {
        if (formValid.value.every(f => f)) {
            emit("submit");
            step.value = 1;
        }
        else {
            console.log("not a valid form");
        }

    } catch (error) {
        console.log("formSteps", { error });
    }
}

async function nextStep(index, callback) {
    console.log({ index })
    const results = await formEl.value[index].validate();
    console.log({ results })
    if (!results.valid) {
        document.querySelector("#" + results.errors[0].id).focus();
        return false;
    }
    callback();
}




</script>

<style lang="scss" scoped></style>