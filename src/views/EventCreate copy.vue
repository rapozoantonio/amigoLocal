<template>
    <main class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-4 gap-8">
            <div class="col-span-1">
                <Listbox
                    v-model="eventMenuSelected"
                    :options="eventMenuItems"
                    optionLabel="name"
                    optionValue="value"
                    class="w-full md:w-14rem"
                >
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <div>
                                <span>{{ slotProps.option.value }} - </span
                                >{{ slotProps.option.name }}
                            </div>
                        </div>
                    </template>
                </Listbox>
                {{ eventMenuSelected }}
            </div>
            <!-- SECTION BASICO -->
            <div v-if="eventMenuSelected === 1" class="col-span-3 space-y-8">
                <card style="width: 50rem">
                    <template #content>
                        <h3>BÁSICO</h3>
                        <!-- EVENT NAME -->
                        <div class="flex flex-column gap-2">
                            <label for="name">Nome do evento</label>
                            <InputText id="name" v-model="event.name" />
                        </div>
                        <!-- START -->
                        <div class="flex mt-4">
                            <div class="flex flex-column gap-2 flex-grow-1">
                                <label for="name">Data de inicio</label>
                                <Calendar id="name" v-model="event.startDate" />
                            </div>
                            <div class="flex flex-column gap-2 flex-grow-1">
                                <label for="name">Hora de inicio</label>
                                <Calendar
                                    id="name"
                                    v-model="event.startTime"
                                    :stepMinute="15"
                                    timeOnly
                                />
                            </div>
                        </div>
                        <!-- END -->
                        <div class="flex mt-4">
                            <div class="flex flex-column gap-2 flex-grow">
                                <label for="name">Data de fim</label>
                                <Calendar id="name" v-model="event.endDate" />
                            </div>
                            <div class="flex flex-column gap-2 flex-grow">
                                <label for="name">Hora de fim</label>
                                <Calendar
                                    id="name"
                                    v-model="event.endTime"
                                    :stepMinute="15"
                                    timeOnly
                                />
                            </div>
                        </div>

                        <h3>LOCAL</h3>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex align-items-center">
                                <RadioButton
                                    v-model="event.local"
                                    value="known"
                                    inputId="known"
                                    name="known"
                                />
                                <label for="known" class="ml-2"
                                    >Local conhecido</label
                                >
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton
                                    v-model="event.local"
                                    inputId="unknown"
                                    name="unknown"
                                    value="unknown"
                                />
                                <label for="unknown" class="ml-2"
                                    >Local a definir</label
                                >
                            </div>
                        </div>

                        <section v-if="event.local === 'known'">
                            <div class="flex flex-column gap-2">
                                <label for="name">Local</label>
                                <InputText
                                    id="name"
                                    v-model="event.localName"
                                />
                            </div>
                        </section>
                        <section v-else>
                            <div class="flex mt-4">
                                <div class="flex flex-column gap-2 flex-grow">
                                    <label for="name">País</label>
                                    <InputText
                                        id="name"
                                        v-model="event.country"
                                    />
                                </div>
                                <div class="flex flex-column gap-2 flex-grow">
                                    <label for="name">Região</label>
                                    <InputText
                                        id="name"
                                        v-model="event.region"
                                    />
                                </div>
                            </div>
                            <div class="flex flex-column gap-2">
                                <label for="name">Local</label>
                                <InputText
                                    id="name"
                                    v-model="event.localName"
                                />
                            </div>
                        </section>
                    </template>
                </card>
            </div>

            <!-- SECTION LINEUP -->
            <div
                v-else-if="eventMenuSelected === 2"
                class="col-span-3 space-y-8"
            >
                <card style="width: 50rem">
                    <template #content>
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
                                v-model="selectedGenre1"
                                :options="genres"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Select a genre"
                                class="w-full md:w-14rem"
                            />
                            <Dropdown
                                v-model="selectedGenre2"
                                :options="genres"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Select a genre"
                                class="w-full md:w-14rem"
                            />
                        </div>
                    </template>
                </card>
            </div>

            <!-- SECTION DETALHES -->
            <div
                v-else-if="eventMenuSelected === 3"
                class="col-span-3 space-y-8"
            >
                <card style="width: 50rem">
                    <template #content>
                        <h3>DETALHES</h3>
                        <!-- DESCRICAO -->
                        <div class="flex flex-column gap-2">
                            <label for="description">Descrição do evento</label>
                            <Textarea
                                id="description"
                                v-model="event.description"
                            />
                        </div>

                        <h3>OUTRO</h3>
                        <div class="flex flex-column gap-2">
                            <label for="price" class="ml-2">Custo</label>
                            <InputText
                                v-model="event.price"
                                type="number"
                            ></InputText>
                            <label for="price" class="ml-2">Idade</label>

                            <Dropdown
                                v-model="event.age"
                                :options="ages"
                                optionLabel="name"
                                optionValue="value"
                                class="w-full md:w-14rem"
                            />
                        </div>
                    </template>
                </card>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from "vue";
import Listbox from "primevue/listbox";
import Card from "primevue/card";
import Calendar from "primevue/calendar";
import RadioButton from "primevue/radiobutton";
import Textarea from "primevue/textarea";

import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

const event = ref({
    name: null,
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    local: "known",
    localName: null,
});

// const lineup = ref("");
const selectedGenre1 = ref(null);
const selectedGenre2 = ref(null);
const genres = ref([
    { name: "Rock", value: "rock" },
    { name: "Pop", value: "pop" },
    { name: "Electronic", value: "electronic" },
]);

const eventMenuSelected = ref(1);
const eventMenuItems = ref([
    { name: "Básico", value: 1 },
    { name: "Lineup", value: 2 },
    { name: "Detalhes", value: 3 },
    { name: "Promocional", value: 4 },
]);

const ages = ref([
    { name: "+18", value: "+18" },
    { name: "+19", value: "+19" },
    { name: "+20", value: "+20" },
    { name: "+21", value: "+21" },
]);
</script>

<style scoped>
</style>

