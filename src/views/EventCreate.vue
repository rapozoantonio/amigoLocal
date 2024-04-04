<template>
    <div class="grid mx-auto" style="max-width: 960px">
        <div class="col mx-auto">
            <form ref="eventForm" @submit.prevent>
                <Stepper orientation="vertical" class="-ml-2">
                    <StepperPanel header="BÁSICO">
                        <template #content="{ nextCallback }">
                            <event-step-basico
                                :next-callback="nextCallback"
                            ></event-step-basico>
                        </template>
                    </StepperPanel>
                    <StepperPanel header="LINEUP">
                        <template #content="{ prevCallback, nextCallback }">
                            <event-step-lineup
                                :next-callback="nextCallback"
                                :prev-callback="prevCallback"
                            ></event-step-lineup>
                        </template>
                    </StepperPanel>
                    <StepperPanel header="DETALHES">
                        <template #content="{ prevCallback, nextCallback }">
                            <event-step-detalhes
                                :next-callback="nextCallback"
                                :prev-callback="prevCallback"
                            ></event-step-detalhes>
                        </template>
                    </StepperPanel>
                    <StepperPanel header="PROMOÇÃO">
                        <template #content="{ prevCallback }">
                            <event-step-promo
                                :prev-callback="prevCallback"
                            ></event-step-promo>
                        </template>
                    </StepperPanel>
                </Stepper>
            </form>
        </div>
    </div>
</template>

<script setup>
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
import EventStepBasico from "@/views/event/create/EventStepBasico.vue";
import EventStepLineup from "@/views/event/create/EventStepLineup.vue";
import EventStepDetalhes from "@/views/event/create/EventStepDetalhes.vue";
import EventStepPromo from "@/views/event/create/EventStepPromo.vue";

// import { useEventStore } from "@/store/event.js";
// import { storeToRefs } from "pinia";

// const store = useEventStore();
// const { event } = storeToRefs(store);

// // const lineup = ref("");
// const selectedGenre1 = ref(null);
// const selectedGenre2 = ref(null);
// const genres = ref([
//     { name: "Rock", value: "rock" },
//     { name: "Pop", value: "pop" },
//     { name: "Electronic", value: "electronic" },
// ]);

// const eventMenuSelected = ref(1);
// const eventMenuItems = ref([
//     { name: "Básico", value: 1 },
//     { name: "Lineup", value: 2 },
//     { name: "Detalhes", value: 3 },
//     { name: "Promocional", value: 4 },
// ]);

// const ages = ref([
//     { name: "+18", value: "+18" },
//     { name: "+19", value: "+19" },
//     { name: "+20", value: "+20" },
//     { name: "+21", value: "+21" },
// ]);
</script>

<style scoped>
</style>

