<template>
    <div>
        <div class="flex flex-column">
            <div>
                <h3>DETALHES</h3>
                <!-- DESCRICAO -->
                <div class="flex flex-column gap-2">
                    <label for="description">Descrição do evento</label>
                    <Textarea id="description" v-model="event.description" />
                </div>

                <h3>OUTRO</h3>
                <div class="flex flex-column gap-2">
                    <label for="price" class="ml-2">Custo</label>
                    <InputText v-model="event.price" type="number"></InputText>
                    <label for="price" class="ml-2">Idade</label>

                    <Dropdown
                        v-model="event.age"
                        :options="ages"
                        optionLabel="name"
                        optionValue="value"
                        class="w-full md:w-14rem"
                    />
                </div>
            </div>
        </div>
        <div class="flex justify-content-between py-4">
            <Button
                label="Back"
                severity="secondary"
                @click="props.prevCallback"
            />
            <Button label="Next" @click="props.nextCallback" />
        </div>
    </div>
</template>

<script setup >
import { useEventStore } from "@/store/event.js";
import { defineProps } from "vue";
import { storeToRefs } from "pinia";

const props = defineProps(["nextCallback", "prevCallback"]);

const store = useEventStore();
const { event, ages } = storeToRefs(store);
</script>

<style lang="scss" scoped>
</style>