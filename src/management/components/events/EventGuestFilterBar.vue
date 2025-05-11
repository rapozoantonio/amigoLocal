<template>
    <v-container fluid class="pb-1">
        <v-row dense>
            <v-col cols="8">
                <v-text-field hide-details="auto" density="compact" variant="outlined" v-model="search"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-autocomplete hide-details="auto" label="Status" :items="items['status']" density="compact"
                    variant="outlined" v-model="status"></v-autocomplete>
            </v-col>
            <v-col cols="2">
                <v-autocomplete hide-details="auto" label="Lista" :items="items['list']" density="compact"
                    variant="outlined" item-value="id" item-title="name" v-model="list" return-object>
                    <template #prepend-item>
                        <v-list-item title="All" @click="list = 'all'"></v-list-item>
                    </template>

                </v-autocomplete>
            </v-col>
        </v-row>
        <v-row no-gutters v-if="isFiltering">
            <v-col cols="12" class="mt-2">
                <p class="text-caption">
                    <v-icon class="mr-1">mdi-filter</v-icon>
                    Filtrando convidados por
                    <v-chip class="mr-2" label size="small" density="compact" v-if="search">
                        Palavra-chave '{{ search }}'
                    </v-chip>
                    <v-chip class="mr-2" label size="small" density="compact" v-if="status && status !== 'all'">
                        Status'{{ status }}'
                    </v-chip>
                    <v-chip class="mr-2" label size="small" density="compact" v-if="list && list !== 'all'">
                        Lista '{{ list?.name }}'
                    </v-chip>
                </p>
            </v-col>
        </v-row>
        <v-row no-gutters v-else><v-col cols="12" class="mt-2">
                <p class="text-caption">Mostrando todos os resultados</p>
            </v-col></v-row>
    </v-container>
</template>

<script setup>
import { toRefs, computed } from 'vue';
const props = defineProps(["items"]);
const { items } = toRefs(props);
const search = defineModel("search");
const status = defineModel("status");
const list = defineModel("list");

const isFiltering = computed(() => {
    return (search.value && search.value !== "") || (status.value && status.value !== "all") || (list.value && list.value !== "all")
})


</script>
