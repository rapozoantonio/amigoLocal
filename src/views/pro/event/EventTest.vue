<template>
    <form-card @submit="submitEvent" title="Editar Evento" action="Save event" :schema="eventSchema" :items="{ genres }"
        v-model:model="event" v-model:files="files"></form-card>
</template>

<script setup>
import { onBeforeMount } from 'vue';

import { storeToRefs } from 'pinia';

import FormCard from '@/components/form/FormCard.vue';
import FormField from '@/components/form/FormField.vue';
import eventSchema from '@/schemas/eventSchema';
import { useConfigStore } from '@/store/config';
import { useEventStore } from '@/store/event';

const eventStore = useEventStore();
const configStore = useConfigStore();
const { event, files } = storeToRefs(eventStore);
const { genres } = storeToRefs(configStore);
const { id } = defineProps(["id"]);

function submitEvent() {
    console.log("submit Event");
    eventStore.updateEvent();
}

onBeforeMount(async () => {
    try {
        const { ok, data } = await eventStore.getEventById(id);
        if (ok) {
            event.value = data;
        }
    } catch (error) {
        console.log({ error })
    }
})

</script>

<style lang="scss" scoped></style>