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

const { label } = defineProps({ label: { type: [Boolean, String], default: false } })

const username = defineModel();
const { fieldAttrs } = inject("$helpers");

watch(() => username.value, (newValue) => {
    username.value = newValue?.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
})

onMounted(() => {
    if (username.value) {
        username.value = username.value.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    }
})

</script>

<style lang="scss" scoped></style>