<template>
    <div>
        <template v-if="children && matrix">
            <v-row no-gutters v-for="(child, index) in children" :key="child.id" align="center"
                :class="index % 2 === 0 ? 'bg-grey-darken-4' : 'bg-grey-darken-3'">
                <v-col cols="auto">
                    <span>{{ child.label }}</span>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto" v-for="scope in child.scopes" :key="scope">
                    <v-checkbox hide-details="auto" :label="scope" color="primary"
                        v-model="matrix[`${child.id}.${scope}`]"></v-checkbox>

                </v-col>
            </v-row>
        </template>

    </div>
</template>

<script setup>
import {
    defineModel,
    defineProps,
    computed,
    inject,
    onMounted,
    onBeforeMount
} from 'vue';
import FormField from '../../../core/components/form/FormField.vue';
const matrix = defineModel();
const { fieldAttrs, rules } = inject("$helpers");
const { children, labelType, label, action, } = defineProps(["children", "labelType", "label", "action"]);


const col = computed(() => {
    return (size) => {
        if (typeof size === "number") {
            return size
        }
        return size === "xs" ? "6" : size === "sm" ? "12" : size === "md" ? "12" : "12"
    }

})

const md = computed(() => {
    return (size) => {
        if (typeof size === "number") {
            return size
        }
        return size === "xs" ? "3" : size === "sm" ? "6" : size === "md" ? "9" : "12"
    }

})

onMounted(() => {
    if (matrix.value === null || matrix.value === undefined || Object.keys(matrix.value).length === 0) {
        // matrix.value = {};
        console.log(matrix.value);

        children.forEach((child) => {
            // matrix.value[`${child.id}`] = false;

            child.scopes.forEach(scope => {
                console.log(matrix.value);
                matrix.value[`${child.id}.${scope}`] = false;
            })
        })
    }

})

</script>