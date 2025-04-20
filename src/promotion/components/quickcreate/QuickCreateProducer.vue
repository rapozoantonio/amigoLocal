<template>
    <form-dialog v-if="producer" @submit="createAndAssociate2" :schema="producerSchema" v-model:model="producer" dense
        v-model.files="files" labelType="up" title="Create Promoter" action="Save">
    </form-dialog>
    <v-form v-if="false" @submit.prevent="createAndAssociate" ref="form">
        <v-row dense>
            <!-- FIELD NAME -->
            <v-col cols="12">
                <label class="text-caption required" for="name">Name</label>
                <v-text-field :rules="[rules.required]" v-model="producer.name" class="mt-1" id="name"
                    v-bind="fieldAttrs" label="Name"></v-text-field>
            </v-col>

            <!-- FIELD STREET ADDRESS -->
            <v-col cols="12">
                <label class="text-caption required" for="username">Username</label>
                <v-text-field :rules="[rules.required]" v-model="producer.username" class="mt-1" id="username"
                    v-bind="fieldAttrs" label="Username"></v-text-field>
            </v-col>

            <!-- FIELD CITY -->
            <v-col cols="12">
                <label class="text-caption" for="description">Description</label>
                <v-text-field v-model="producer.description" class="mt-1" id="description" v-bind="fieldAttrs"
                    placeholder="Description"></v-text-field>
            </v-col>

            <!-- FIELD COUNTRY -->
            <v-col cols="12">
                <label class="text-caption required" for="country">Country</label>
                <field-country class="mt-1" v-model="producer.country"></field-country>
            </v-col>



            <v-col cols="12">
                <v-btn type="submit" class="mt-5" block color="primary">
                    Create and associate
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup>
import {
  inject,
  ref,
} from 'vue';

import { storeToRefs } from 'pinia';

import FieldCountry from '@/promotion/components/fields/FieldCountry.vue';
import FieldRegion from '@/promotion/components/fields/FieldRegion.vue';
import FormBox from '@/core/components/form/FormBox.vue';
import FormCard from '@/promotion/components/form/FormCard.vue';
import FormDialog from '@/promotion/components/form/FormDialog.vue';
import producerSchema from '@/core/schemas/quickProducerSchema';
import { useProducerStore } from '@/promotion/store/producer';

FormCard

const producerStore = useProducerStore();

const emit = defineEmits(["create"])
const { producer } = storeToRefs(producerStore);
const { fieldAttrs, rules } = inject("$helpers");
const form = ref(null);

const files = ref({})

async function createAndAssociate(event) {
    const { valid, errors } = await event
    
    if (valid) {
        const response = await producerStore.createProducer(false);
        
        if (response.ok) {
            emit("create", response.data.document)
        }
    }
    else {
        document.querySelector("#" + errors[0].id).focus();
        return false;
    }
}

async function createAndAssociate2(event) {

    const response = await producerStore.createProducer(false);
    
    if (response.ok) {
        emit("create", response.data.document)
    }

}


</script>

<style lang="scss" scoped></style>