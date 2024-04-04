<template>
    <div>
        <div class="flex flex-column">
            <div>
                <h3>LINEUP</h3>
                <!-- LINEUP -->
                <div class="flex flex-column gap-2">
                    <label for="lineup">Lineup</label>
                    <Textarea id="lineup" v-model="event.lineup" />
                </div>

                <h3>GENEROS</h3>
                <div class="flex flex-column gap-2">
                    <label for="genre" class="ml-2">Generos</label>
                    <Dropdown
                        v-model="event.genre1"
                        :options="genres"
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select a genre"
                        class="w-full md:w-14rem"
                    />
                    <Dropdown
                        v-model="event.genre2"
                        :options="genres"
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select a genre"
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
const { event, genres } = storeToRefs(store);
</script>

<style lang="scss" scoped>
</style>