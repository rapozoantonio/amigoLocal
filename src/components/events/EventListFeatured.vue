<template>
    <section class="bg-grey-darken-4 flex-grow-1">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <p class="text-caption ml-4 text-grey mt-2">
                        Eventos em breve
                    </p>
                </v-col>

                <!-- <v-col cols="12">
                    <v-progress-linear indeterminate></v-progress-linear>
                </v-col> -->
                <v-col cols="12">
                    <p class="text-h4 ml-4 text-red mt-2">/ Popular</p>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-slide-group :center-active="true" show-arrows>
                        <v-slide-group-item v-for="event in featuredEvents" :key="event.id"
                            v-slot="{ isSelected, toggle }">
                            <event-card-vertical class="mr-5" :event="event"></event-card-vertical>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-col>
            </v-row>

            <!-- <v-row>
                <v-col v-for="event in featuredEvents" :key="event.id">
                    <event-card-vertical :event="event"></event-card-vertical>
                </v-col>
            </v-row> -->
        </v-container>
    </section>
</template>

<script setup>
import { useEventsStore } from "@/store/events";
import { storeToRefs } from "pinia";
import EventCardVertical from "@/components/events/EventCardVertical.vue";

const eventsStore = useEventsStore();

const { featuredEvents, loading } = storeToRefs(eventsStore);

// const events = ref([
//     {
//         title: "TRANSC.END with BOB MOSES",
//         date: "SAT, 30 DEC",
//         location: "Morro Da Urca",
//         image: "/img/path-to-event-image.jpg",
//         attendees: 58,
//     },
//     {
//         title: "4 FINEST EARS - RÉVEILLON 2024",
//         date: "SUN, 31 DEC",
//         location: "TBA - Rua Tenente Marcin Pinto, n125, Gávea - RJ",
//         image: "/img/path-to-event-image.jpg",
//         attendees: 8,
//     },
//     {
//         title: "Reveillon NEW ´24 - Sheraton Grand Rio Hotel & Resort",
//         date: "SUN, 31 DEC",
//         location: "TBA - Sheraton Grand Rio Hotel & Resort (Leblon)",
//         image: "/img/path-to-event-image.jpg",
//         attendees: 7,
//     },
//     {
//         title: "Terraço do Amor by Fica Comigo",
//         date: "SAT, 30 DEC",
//         location: "TBA - Sheraton Grand Rio Hotel & Resort",
//         image: "/img/path-to-event-image.jpg",
//         attendees: 2,
//     },

//     // Add more events as needed
// ]);
</script>

<style lang="scss" scoped></style>