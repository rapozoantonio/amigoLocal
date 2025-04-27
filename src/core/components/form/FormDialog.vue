<template>
    <!-- FORM DIALOG -->
    <v-dialog v-model="opened" :fullscreen="fullscreen" transition="dialog-bottom-transition">
        <!-- SLOT ACTIVATOR -->
        <template v-slot:activator="{ props: activatorProps }">
            <slot name="activator" v-bind="activatorProps"></slot>
        </template>
        <!-- FORM -->

        <v-form class="form-container" @submit.prevent="submitForm" style="height:100%">
            <v-card max-width="600" class="mx-auto">

                <!-- FORM HEADER -->
                <v-card-title class="mb-4 bg-primary d-flex">
                    <!-- SLOT HEADER PREPEND -->
                    <slot name="header-prepend"></slot>
                    <!-- FORM NAME -->
                    <span>{{ title || schema.name }}</span>
                    <!-- SLOT HEADER APPEND -->
                    <slot name="header-append"></slot>
                    <v-spacer></v-spacer>
                    <!-- DIALOG CLOSE BUTTON -->
                    <v-btn @click="opened = false" variant="text" size="x-small" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <!-- SLOT PREPEND -->
                <v-card-text v-if="$slots.prepend">
                    <slot name="prepend"></slot>
                </v-card-text>

                <!-- SLOT PREPEND INNER -->
                <v-card-text v-if="$slots['prepend-inner']">
                    <slot name="prepend-inner"></slot>
                </v-card-text>

                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12">
                            <!-- FORM SECTIONS -->
                            <template v-for="(section, index) in schema.sections" :key="section.name">
                                <!-- SECTION -->
                                <v-card-title v-if="section.name && section.name !== ''"
                                    class="mb-4 d-flex align-center" :class="[index > 0 ? 'mt-4' : '']">
                                    <!-- SLOT PREPEND HEADER SECTION -->
                                    <slot :name="'prepend-header-section-' + (index + 1)"></slot>
                                    <!-- SECTION NAME -->
                                    <span>
                                        {{ section.name }}
                                    </span>
                                    <!-- SLOT APPEND HEADER SECTION -->
                                    <slot :name="'append-header-section-' + (index + 1)"></slot>
                                </v-card-title>
                                <!-- SLOT PREPEND SECTION -->
                                <v-card-text v-if="$slots['prepend-section-' + (index + 1)]">
                                    <slot :name="'prepend-section-' + (index + 1)"></slot>
                                </v-card-text>
                                <!-- SECTION CONTENT -->
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-row>
                                                <template v-for="field in section.fields" :key="field.id">
                                                    <template v-if="field.type === 'object'">
                                                        <form-field :labelType="labelType"
                                                            v-for="child in field.children" :key="child.id"
                                                            :items="items ? items[child.id] : null"
                                                            v-model:files="files" v-model:model="model[field.id]"
                                                            :field="child.id" v-bind="child"></form-field>
                                                    </template>

                                                    <form-field :labelType="labelType" :items="items[field.id] || null"
                                                        v-else v-model:files="files" v-model:model="model"
                                                        :field="field.id" v-bind="field"></form-field>
                                                </template>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <!-- SLOT APPEND SECTION -->
                                <v-card-text v-if="$slots['append-section-' + (index + 1)]">
                                    <slot :name="'append-section-' + (index + 1)"></slot>
                                </v-card-text>
                            </template>

                        </v-col>
                    </v-row>
                </v-container>


                <!-- SLOT APPEND INNER -->
                <v-card-text v-if="$slots['append-inner']">
                    <slot name="append-inner"></slot>
                </v-card-text>

                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12">
                            <!-- ACTIONS -->
                            <v-card-text class="text-right">
                                <!-- SLOT ACTION PREPEND -->
                                <slot name="action-prepend"></slot>
                                <!-- ACTION BUTTON -->
                                <slot v-if="$slots['action-button']" name="action-button"></slot>
                                <v-btn v-else type="submit" variant="elevated" color="primary">{{ action ||
                                    "Enviar" }}</v-btn>
                                <!-- SLOT ACTION APPEND -->
                                <slot name="action-append"></slot>
                            </v-card-text>
                        </v-col>
                    </v-row>
                </v-container>



                <!-- SLOT APPEND -->
                <v-card-text v-if="$slots.append">
                    <slot name="append"></slot>
                </v-card-text>

            </v-card>
        </v-form>


    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import FormField from '@/core/components/form/FormField.vue';

const model = defineModel("model");
const opened = defineModel("opened");
const emit = defineEmits(["submit"])
const loading = ref(false);
const files = defineModel("files");
// const { schema, action, title, items } = defineProps(["schema", "action", "title", {"items"}]);
const { schema, action, title, items, fullscreen } = defineProps({
    schema: { type: Object, required: true },
    action: { type: String, default: "Save" },
    title: { type: String, default: "Edit record" },
    items: { type: Object, default: () => ({}) },
    labelType: {
        type: String, default: "up"  // in out left
    },
    fullscreen: { type: Boolean, default: false }
});

function closeDialog() {
    opened.value = false;
}

async function submitForm(event) {
    try {
        loading.value = true;
        const results = await event;

        if (!results.valid) {
            document.querySelector("#" + results.errors[0].id).focus();
            return false;
        }
        emit("submit", model.value, closeDialog);
    } catch (error) {

    } finally {
        loading.value = false;
    }
}

</script>

<style lang="scss" scoped></style>