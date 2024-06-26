<template>
    <form-steps @submit="submitEvent" title="Editar Evento" action="Save event" :schema="eventSchema"
        :items="{ genres }" v-model:model="event" v-model:files="files"></form-steps>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import FormSteps from '@/components/form/FormSteps.vue';
import eventSchema from '@/schemas/eventSchema';
import { useConfigStore } from '@/store/config';
import { useEventStore } from '@/store/event';

const eventStore = useEventStore();
const configStore = useConfigStore();
const { event, files } = storeToRefs(eventStore);
const { genres } = storeToRefs(configStore);
const { id } = defineProps(["id"]);


async function submitEvent() {
    console.log("submitEvent");
    const response = await eventStore.createEvent();
    if (response.ok) {
        eventStore.$reset();
    }
    console.log("submitForm");
}


</script>

<style lang="scss" scoped></style>