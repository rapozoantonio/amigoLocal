<template>
    <v-form @submit.prevent="submitForm" v-model="eventStore.sections[3]">
        <v-card color="transparent" max-width="600" flat>
            <v-card-title> Detalhes </v-card-title>
            <v-card-text>
                <v-row>
                    <!-- DESCRIPTION -->
                    <v-col cols="12" class="pb-0 pt-1">
                        <label class="text-caption">Descrição do evento</label>
                        <v-textarea variant="outlined" density="compact" rounded="xl" color="primary" required
                            id="details" v-model="event.description">
                        </v-textarea>
                    </v-col>

                    <!-- IMAGE -->
                    <v-col cols="12" md="6" class="pb-0 pt-1">
                        <label for="image" class="text-caption">Image</label>
                        <field-image v-model:files="files" v-model:model="event.image" field="image"></field-image>
                    </v-col>

                    <!-- AGE -->
                    <!-- <v-col cols="6">
                        <span class="text-caption">Idade</span>
                        <v-select :items="ages" v-bind="fieldAttrs" item-title="name" item-value="value" id="age"
                            v-model="event.age">
                        </v-select>
                    </v-col> -->

                    <!-- PROMOTER -->
                    <v-col cols="12" md="6" class="pb-0 pt-1">
                        <label for="promoter" class="text-caption">Promoter</label>
                        <v-list-item v-if="event.promoter">
                            <template #prepend>
                                <v-avatar color="primary">
                                    <span>{{ event.promoter.name.charAt(0) }}
                                    </span>
                                </v-avatar>
                            </template>
                            <v-list-item-title>{{ event.promoter.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ event.promoter.email }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-col>

                    <!-- PRODUCER -->
                    <v-col cols="12">
                        <span class="text-caption">Produtora</span>
                        <field-producer v-model="event.producer"></field-producer>
                    </v-col>


                    <!-- PRICE -->
                    <v-col cols="12">
                        <span class="text-caption">Preço</span>
                        <field-price v-model="event.price"></field-price>
                    </v-col>


                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn variant="tonal" color="secondary" @click="prev">Prev</v-btn>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="primary" type="submit">Next</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import {
  computed,
  defineProps,
  inject,
} from 'vue';

import { storeToRefs } from 'pinia';

import FieldImage from '@/components/fields/FieldImage.vue';
import FieldPrice from '@/components/fields/FieldPrice.vue';
import FieldProducer from '@/components/fields/FieldProducer.vue';
// import { ref } from "vue";
import { useEventStore } from '@/store/event.js';

const { next, prev, rules } = defineProps(["next", "rules", "prev"]);
const { fieldAttrs } = inject("$helpers");

const eventStore = useEventStore();
const { event, ages, files } = storeToRefs(eventStore);

const imagePreview = computed(() => {
    return (file) => {
        return URL.createObjectURL(file);
    };
});
// const formValid = ref(false);
async function submitForm(e) {
    const results = await e;
    if (!results.valid) {
        document.querySelector("#" + results.errors[0].id).focus();
        return false;
    }
    console.log("submitForm");
    next();
}



function addPrice() {
    if (!event.value.price || !Array.isArray(event.value.price)) {
        event.value.price = [];
    }
    event.value.price.push({ name: null, value: null })
}

function removePrice(index) {
    if (event.value.price.length === 1) {
        event.value.price = null;
        return
    }
    event.value.price.splice(index, 1);
}

function addLink() {
    if (!event.value.links || !Array.isArray(event.value.links)) {
        event.value.links = [];
    }
    event.value.links.push({ name: "", url: "" })
}

</script>

<style lang="scss" scoped>
// label {
//     margin-left: 12px;
// }</style>
