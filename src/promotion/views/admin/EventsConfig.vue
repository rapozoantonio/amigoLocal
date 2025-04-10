<template>
    <v-container>
        <v-row v-if="eventConfig">
            <v-col cols="12">
                <h1>Event Config</h1>
                <v-btn @click="configStore.saveEventConfig">Save</v-btn>
            </v-col>
            <v-col cols="12">
                <v-card variant="tonal">
                    <v-card-title>
                        <v-icon size="x-small">mdi-music</v-icon> Genres
                    </v-card-title>
                    <v-card-text>
                        <v-chip color="primary" variant="elevated" class="mr-2 mb-2" size="large" label
                            v-for="(genre, index) in eventConfig.genres" :key="genre" closable
                            @click:close="removeGenre(index)">
                            <span class="text-subtitle-1">
                                {{ genre }}
                            </span>
                        </v-chip>
                        <v-text-field placeholder="Add a new genre" density="compact" class="mt-2" hide-details="auto"
                            variant="outlined" v-model="newGenre" @keydown.enter="addGenre">
                            <template #append>
                                <v-btn @click="addGenre" variant="outlined" color="primary">
                                    <v-icon start>mdi-plus-circle</v-icon>
                                    Add genre
                                </v-btn>
                            </template>
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card variant="tonal">
                    <v-card-title>
                        <v-icon size="x-small">mdi-account-check</v-icon> Ages
                    </v-card-title>
                    <v-card-text>
                        <v-chip color="primary" variant="elevated" class="mr-2 mb-2" size="large" label
                            v-for="(age, index) in eventConfig.ages" :key="age" closable
                            @click:close="removeGenre(index)">
                            <span class="text-subtitle-1">
                                {{ age }}
                            </span>
                        </v-chip>
                        <v-text-field placeholder="Add a new genre" density="compact" class="mt-2" hide-details="auto"
                            variant="outlined" @click:append="addAge" v-model="newAge" @keydown.enter="addAge">
                            <template #append>
                                <v-btn @click="addAge" variant="outlined" color="primary">
                                    <v-icon start>mdi-plus-circle</v-icon>
                                    Add age
                                </v-btn>
                            </template>
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import {
  onMounted,
  ref,
} from 'vue';

import { storeToRefs } from 'pinia';

import { useConfigStore } from '@/promotion/store/config';

const configStore = useConfigStore();
const { eventConfig } = storeToRefs(configStore);

const newGenre = ref("");
const newAge = ref("");



function addGenre() {
    eventConfig.value.genres.push(newGenre.value);
    eventConfig.value.genres.sort();
    newGenre.value = "";
}

function removeGenre() {
    
}

function addAge() {
    eventConfig.value.ages.push(newAge.value);
    eventConfig.value.ages.sort();
    newAge.value = "";
}

// function removeAge(index) {
//     ages.value.splice(index, 1);
// }

onMounted(() => {
    configStore.getEventConfig();
})

</script>

<style lang="scss" scoped></style>