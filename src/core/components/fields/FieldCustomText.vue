<template>
    <div>
        <v-text-field v-bind="{ ...fieldAttrs, ...$attrs }" v-model="username"
            :label="label ? typeof label === 'string' ? label : 'Username' : ''" clearable>
        </v-text-field>
    </div>
</template>

<script setup>
import {
    defineModel,
    inject,
    onMounted,
    watch,
} from 'vue';

const { label, textType } = defineProps({ label: { type: [Boolean, String], default: false }, textType: { type: String, default: "custom-text" } })

const username = defineModel();
const { fieldAttrs } = inject("$helpers");

watch(() => username.value, (newValue) => {
    if (/username/.test(textType)) {
        username.value = newValue?.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    }
    if (/instagram/.test(textType)) {
        username.value = newValue ? "@" + newValue?.replace(/ /g, "").replace(/@/g, "").toLowerCase() : newValue;
    }
    if (/lower/.test(textType)) {
        username.value = newValue?.toLowerCase();
    }
})

onMounted(() => {
    if (username.value) {
        if (/username/.test(textType)) {
            username.value = username.value.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
        }
        if (/instagram/.test(textType)) {
            username.value = username.value ? "@" + username.value.replace(/ /g, "").replace(/@/g, "").toLowerCase() : username.value;
        }
        if (/lower/.test(textType)) {
            username.value = username.value.toLowerCase();
        }

    }
})

</script>

<style lang="scss" scoped></style>