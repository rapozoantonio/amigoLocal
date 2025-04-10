<template>
    <div>
        <v-row no-gutters v-for="(link, index) in links" :key="index" class="mb-2">
            <v-col cols="4">
                <v-text-field :rules="[rules.required]" v-bind="fieldAttrs" v-model="links[index].name"
                    placeholder="Link name" :rounded="fieldAttrs.rounded + ' e-0'"></v-text-field>
            </v-col>
            <v-col cols="8">
                <v-text-field :rules="[rules.required]" v-bind="fieldAttrs" v-model.lazy="links[index].url"
                    placeholder="Link url" append-icon="mdi-close" @click:append="removeLink(index)"
                    :rounded="fieldAttrs.rounded + ' s-0'"> </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="pt-0">
                <v-btn class="mb-4 " :class="[!links || links.length === 0 ? 'mt-2' : '']" @click="addLink"
                    variant="tonal"><v-icon start>mdi-plus</v-icon> Add
                    link</v-btn>
            </v-col>
        </v-row>
    </div>



</template>

<script setup>
import {
  defineModel,
  defineProps,
  inject,
} from 'vue';

const links = defineModel();


const { fieldAttrs, rules } = inject("$helpers");
// const { model } = defineProps(["model"]);

function addLink() {
    if (!links.value || !Array.isArray(links.value)) {
        links.value = [{ name: "", url: "" }];
        return
    }
    links.value.push({ name: "", url: "" })
}

function removeLink(index) {
    if (links.value.length === 1) {
        links.value = null;
        return;
    }
    links.value.splice(index, 1);
}

</script>

<style lang="scss" scoped></style>