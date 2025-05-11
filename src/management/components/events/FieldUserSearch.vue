<template>
    <v-autocomplete placeholder="Selecione o promoter" prepend-inner-icon="mdi-account" variant="outlined"
        density="compact" hide-details="auto" return-object @update:model-value="emitResult" item-title="name"
        :items="items"></v-autocomplete>
</template>

<script setup>
import { useFirebaseStore } from '@/core/store/firebase';
import { onMounted, toRefs, ref } from 'vue';

const emit = defineEmits(["select"])

const firebaseStore = useFirebaseStore();
const props = defineProps(["entity"]);
const { entity } = toRefs(props);
const items = ref([]);

function emitResult(payload) {
    console.log({ payload });
    emit("select", payload);
}

onMounted(async () => {
    try {
        const result = await firebaseStore.getCollection({ collection: entity.value });
        if (result.ok) {
            items.value = result.data;
        }
    } catch (error) {
        console.log({ error })
    }
})



</script>
