<template>
    <div class="bg-black" color="#000">
        <v-container>
            <v-row no-gutters justify="center" justify-md="space-between" align="center">
                <v-col cols="auto">
                    <v-tabs color="primary" density="compact">
                        <v-tab exact variant="text" size="small" style="text-transform: none"
                            :to="{ name: 'events', query: route.query }">
                            All
                        </v-tab>
                        <v-tab exact variant="text" size="small" style="text-transform: none"
                            :to="{ name: 'events-foryou', query: route.query }">
                            For you
                        </v-tab>
                        <!-- <v-tab exact variant="text" size="small" style="text-transform: none"
                            :to="{ name: 'events-new' }">
                            New
                        </v-tab> -->
                        <v-tab exact variant="text" size="small" style="text-transform: none"
                            :to="{ name: 'events-bestpicks', query: route.query }">
                            Best picks
                        </v-tab>
                    </v-tabs>
                    <!-- <v-btn variant="text" size="small" style="text-transform: none">Todos</v-btn>
                    <v-btn variant="text" size="small" style="text-transform: none">Para você</v-btn>
                    <v-btn variant="text" size="small" style="text-transform: none">Novo</v-btn>
                    <v-btn variant="text" size="small" style="text-transform: none">Best picks</v-btn> -->
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto">
                    <v-btn class="mx-1" variant="outlined" rounded="pill" style="text-transform: none">Todos</v-btn>
                    <event-list-genre-selector></event-list-genre-selector>
                    <!-- <v-btn class="mx-1" variant="outlined" rounded="pill" style="text-transform: none">Novo</v-btn> -->
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

import EventListGenreSelector from './EventListGenreSelector.vue';

const route = useRoute();

console.log({ route })
</script>

<style lang="scss" scoped></style>