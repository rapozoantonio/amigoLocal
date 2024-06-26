<template>
    <div>
        <v-row no-gutters v-for="(p, i) in price" :key="i" class="mb-2">
            <v-col cols="4">
                <v-text-field :rules="[rules.required]" v-bind="fieldAttrs" v-model="price[i].name"
                    placeholder="Price name" :rounded="fieldAttrs.rounded + ' e-0'"></v-text-field>
            </v-col>
            <v-col cols="8">
                <v-text-field :rules="[rules.notNull]" v-bind="fieldAttrs" v-model.number="price[i].value"
                    placeholder="Price value" append-icon="mdi-close" @click:append="removePrice(i)"
                    :rounded="fieldAttrs.rounded + ' s-0'"></v-text-field>
            </v-col>
        </v-row>
        <v-row class="mt-0">
            <v-col cols="12" class="mt-1 mb-4 pt-0">
                <v-btn @click="addPrice" variant="tonal"><v-icon start>mdi-plus</v-icon> Add
                    price</v-btn>
            </v-col>
        </v-row>

    </div>
</template>

<script setup>
import {
  defineProps,
  inject,
} from 'vue';

const { fieldAttrs, rules } = inject("$helpers");
const price = defineModel();

function addPrice() {
    console.log("add price")
    if (!price.value || !Array.isArray(price.value)) {
        price.value = [{ name: null, value: null }];
        return
    }
    price.value.push({ name: null, value: null })
}

function removePrice(index) {
    if (price.value.length === 1) {
        price.value = null;
        return;
    }
    price.value.splice(index, 1);
}

</script>

<style lang="scss" scoped></style>