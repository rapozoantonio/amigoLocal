<template>
    <div>
        <v-autocomplete v-bind="{ ...fieldAttrs, ...$attrs }" v-model="fieldItems" :items="items" closable-chips
            auto-select-first :clear-on-select="true" chips multiple @update:modelValue="selectItems"
            clearable></v-autocomplete>
    </div>
</template>

<script setup>
import {
    defineProps,
    inject,
    onMounted,
    ref
} from 'vue';
const fieldModel = defineModel();
const { fieldAttrs, rules } = inject("$helpers");
const { labelType, label, action, items } = defineProps(["labelType", "label", "action", "items"]);
const fieldItems = ref([]);

function selectItems(payload) {
    items.forEach(item => {
        const itemId = item.replace(/ /gi, "_").toLowerCase();
        fieldModel.value[itemId] = false;
    });
    console.log(payload)
    payload.forEach(item => {
        const itemId = item.replace(/ /gi, "_").toLowerCase();
        fieldModel.value[itemId] = true;
    })
    // const categoryId = category.replace(/ /gi, "_").toLowerCase();
    // console.log(categoryId);
    // field[categoryId]
}

onMounted(() => {
    console.log("fieldModel", fieldModel.value);

    try {
        if (!fieldModel.value) {
            fieldModel.value = {}
        }
        items.forEach(item => {
            const itemId = item.replace(/ /gi, "_").toLowerCase();
            if (fieldModel.value[itemId] && fieldModel.value[itemId] === true) {
                fieldModel.value[itemId] = true;
            }
            else {
                fieldModel.value[itemId] = false;
            }
        });
    } catch (error) {
        console.log({ error })
    }

})



</script>