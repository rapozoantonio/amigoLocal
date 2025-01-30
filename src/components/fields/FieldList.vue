<template>
    <div>
        <p class="mb-2 ml-2 text-caption" v-if="labelType === 'in'">{{ label }}</p>
        <v-row no-gutters v-for="(item, index) in list" :key="index" class="mb-2 bg-grey-darken-4 pa-1 pb-2">

            <v-row dense v-if="children && list[index]">
                <v-col cols="auto" class="mt-2">
                    <v-chip size="small">
                        <span>{{ index + 1 }}</span>
                    </v-chip>
                </v-col>
                <v-col>
                    <v-row dense>
                        <form-field :labelType="labelType" v-for="(child) in children" :key="child.id"
                            v-model:model="list[index]" :field="child.id" v-bind="child"></form-field>
                    </v-row>
                </v-col>
                <v-col cols="auto" class="mt-2">
                    <v-btn @click="removeItem(index)" icon variant="text"
                        size="x-small"><v-icon>mdi-close</v-icon></v-btn>
                </v-col>
            </v-row>
        </v-row>
        <v-row>
            <v-col cols="12" class="pt-2">
                <v-btn class="mb-4 " :class="[!list || list.length === 0 ? 'mt-2' : '']" @click="addItem"
                    variant="tonal"><v-icon start>mdi-plus</v-icon> Add
                    item</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import {
    defineModel,
    defineProps,
    computed,
    inject,
    onMounted
} from 'vue';
import FormField from '../form/FormField.vue';
const list = defineModel();
const { fieldAttrs, rules } = inject("$helpers");
const { children, labelType, label } = defineProps(["children", "labelType", "label"]);


function addItem() {
    const child = children.reduce((final, item) => {
        final[item.id] = "";
        return final
    }, {})
    if (!list.value || !Array.isArray(list.value)) {
        list.value = [child];
        return
    }
    list.value.push(child)
}

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

function removeItem(index) {
    if (list.value.length === 1) {
        list.value = null;
        return;
    }
    list.value.splice(index, 1);
}

onMounted(() => {
    console.log({ children })
})

</script>

<style lang="scss" scoped></style>