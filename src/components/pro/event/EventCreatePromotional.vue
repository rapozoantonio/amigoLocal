<template>
    <v-form @submit.prevent="submitForm" v-model="eventStore.sections[4]">
        <v-card color="transparent" max-width="600" flat>
            <!-- <v-card-title> Promoters </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" class="pb-0 pt-1">
                        <span class="text-caption">Promoter principal</span>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            rounded="pill"
                            color="primary"
                            required
                            id="promoter"
                            :rules="[rules.required, rules.lengthMin4]"
                            v-model="event.promoter"
                        >
                        </v-text-field>
                        {{ files }}
                    </v-col>
                </v-row>
            </v-card-text> -->
            <v-card-title class="mb-4"> Images </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6" class="pb-0 pt-0">
                        <span class="text-caption">Flyer Front</span>
                        <field-image v-model:model="event.flyerFront" v-model:files="files"
                            field="flyerFront"></field-image>

                    </v-col>

                    <v-col cols="12" md="6" class="pb-0 pt-0">
                        <span class="text-caption">Flyer back</span>
                        <field-image v-model:model="event.flyerBack" v-model:files="files"
                            field="flyerBack"></field-image>


                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-title> Links </v-card-title>
            <v-card-text>
                <field-links v-model="event.links"></field-links>
            </v-card-text>

            <v-card-title> Media </v-card-title>
            <v-card-text>
                <field-medias v-model="event.medias"></field-medias>
            </v-card-text>

            <v-card-title> Event visibility </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <span class="text-caption">Visibility</span>
                        <v-switch variant="outlined" density="compact" rounded="pill" color="primary">
                        </v-switch>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn variant="tonal" color="secondary" @click="prev">Prev</v-btn>
                <v-spacer> </v-spacer>
                <v-btn variant="tonal" color="success" type="submit">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import {
    computed,
    defineEmits,
} from 'vue';

import { storeToRefs } from 'pinia';

import FieldImage from '@/components/fields/FieldImage.vue';
import FieldLinks from '@/components/fields/FieldLinks.vue';
import FieldMedias from '@/components/fields/FieldMedias.vue';
import { useEventStore } from '@/store/event.js';

// import { defineProps } from "vue";

const { prev } = defineProps(["prev", "rules"]);
const eventStore = useEventStore();

const { event, files } = storeToRefs(eventStore);
const emit = defineEmits(["submit"]);

console.log({ files });
// const formValid = ref(false);

const imagePreview = computed(() => {
    return (file) => {
        return URL.createObjectURL(file);
    };
});

async function submitForm(e) {
    const results = await e;
    if (!results.valid) {
        document.querySelector("#" + results.errors[0].id).focus();
        return false;
    }
    return emit("submit");
}
</script>

<style lang="scss">
input[type="file"]+.v-field__input {
    padding: 0px;
}
</style>