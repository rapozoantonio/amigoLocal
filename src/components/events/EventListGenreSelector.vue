<template>
    <div class="d-inline-flex">
        <v-btn :color="selectedGenres?.length > 0 ? 'primary' : ''" variant="outlined" rounded="pill"
            @click="openSelector">Genero <span class="ml-1" v-if="selectedGenres?.length > 0">({{
                selectedGenres.length }})</span></v-btn>
        <v-navigation-drawer class="navigation" floating temporary width="350" location="right"
            v-model="genreSelectionOpened">
            <!-- <v-list >
                <v-list-item v-for="(genre) in genres" :key="genre" :to="{ query: { genre } }" link>

                    <v-list-item-title> {{ genre }} </v-list-item-title>
                </v-list-item>
            </v-list> -->

            <template v-slot:prepend>
                <v-text-field autofocus v-model="search"></v-text-field>
            </template>

            <v-item-group multiple v-model="selectedGenres">
                <v-item v-for="(genre) in filteredGenres" :key="genre" v-slot="{ isSelected, toggle }" :value="genre">
                    <v-list-item :disabled="eventsStore.getCountByGenre(genre) === 0 ? true : false"
                        :class="[isSelected ? 'text-primary' : '']" @click="toggle">
                        <v-list-item-title> {{ genre }} </v-list-item-title>
                        <template v-slot:append>
                            <span>
                                {{ eventsStore.getCountByGenre(genre) }}
                            </span>
                        </template>

                    </v-list-item>
                </v-item>
            </v-item-group>


            <template v-slot:append>
                <div class="d-flex justify-space-around mb-4 mt-4">
                    <v-btn variant="outlined" rounded="pill" @click="restabelecer">Restabelecer</v-btn>
                    <v-btn variant="outlined" rounded="pill" @click="buscar">Mostrar resultados</v-btn>

                </div>
            </template>
        </v-navigation-drawer>
    </div>
</template>

<script setup>
import {
    computed,
    onMounted,
    ref,
} from 'vue';

import { storeToRefs } from 'pinia';
import {
    useRoute,
    useRouter,
} from 'vue-router';

import { useConfigStore } from '@/store/config';
import { useEventsStore } from '@/store/events';

const eventsStore = useEventsStore()

// const { selectedGenres } = storeToRefs(eventsStore);
const { genres } = storeToRefs(useConfigStore());
const router = useRouter();
const route = useRoute();
const genreSelectionOpened = ref(false);
const selectedGenres = ref([]);
const search = ref(null);

const filteredGenres = computed(() => {
    return search.value && search.value !== '' ? genres.value.filter(g => new RegExp(search.value, "gi").test(g)) : genres.value;
})





function restabelecer() {
    selectedGenres.value = [];
}

function openSelector() {
    selectedGenres.value = route.query.genre ? route.query.genre : []
    genreSelectionOpened.value = true;

}

function buscar() {
    router.push({ query: { genre: selectedGenres.value } })
}



onMounted(() => {
    if (route.query.genre) {
        selectedGenres.value = route.query.genre
    }
})

</script>

<style lang="scss">
.v-navigation-drawer__content::-webkit-scrollbar {
    display: none;
}
</style>