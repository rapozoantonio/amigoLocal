<template>
    <v-input v-model="model">
        <template #default="{ isValid }">
            <v-btn :border="isValid.value == false ? 'md error opacity-100' : ''" variant="outlined"
                :icon="fieldParams?.variant === 'mini' ? false : true"
                :density="fieldParams?.variant === 'mini' ? 'comfortable' : 'default'"
                :size="fieldParams?.variant === 'mini' ? 'default' : 'small'">
                <template v-if="fieldParams?.variant === 'mini'">
                    <v-icon>{{ model }}</v-icon>
                    <v-icon end size="small">mdi-chevron-down</v-icon>
                </template>
                <template v-else>
                    <v-icon>{{ model }}</v-icon>
                </template>
                <v-menu activator="parent" max-width="220">
                    <v-card variant="tonal">
                        <v-card-text>
                            <v-row dense>
                                <v-col v-for="item in items" :key="item">
                                    <v-hover>
                                        <template v-slot:default="{ isHovering, props }">
                                            <v-btn v-bind="props" @click="updateModel(item)" size="small"
                                                :color="isHovering ? 'primary' : undefined" variant="tonal"
                                                :icon="item"></v-btn>
                                        </template>
                                    </v-hover>

                                </v-col>
                            </v-row>
                            <template v-if="fieldParams?.allowCustom !== false">
                                <v-divider class="my-4"><span class="text-caption">Ou insira o nome</span></v-divider>
                                <v-row @click.stop>
                                    <v-col cols="12">
                                        <v-text-field hide-details="auto" density="compact" v-model="model">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters align-content="center" class="mt-2">
                                    <v-col cols="auto">
                                        <v-avatar class="mr-2" color="primary" rounded="lg" size="small">
                                            <v-icon size="small">{{ model }}</v-icon>

                                        </v-avatar>
                                    </v-col>
                                    <v-col>

                                        <v-btn color="primary" variant="tonal" block>OK</v-btn>
                                    </v-col>
                                </v-row>
                            </template>

                        </v-card-text>
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

function updateModel(item) {
    model.value = item;
}

</script>

<style lang="scss" scoped></style>