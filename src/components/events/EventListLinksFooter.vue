<template>
    <v-container class="pb-16">
        <v-row class="pt-10">
            <v-col>
                <p class="text-subtitle-1 text-grey">Discovery</p>
                <div class="d-flex align-center">
                    <router-link class="text-h6 link" to="/about">About</router-link>
                    <span class="text-h5 mx-4">/</span>
                    <router-link class="text-h6 link" to="/">Ticket</router-link>
                    <span class="text-h5 mx-4">/</span>
                    <router-link class="text-h6 link" to="/">Resale</router-link>
                </div>
            </v-col>
            <v-col cols="auto">
                <p class="text-subtitle-1 text-grey">Get All</p>
                <div class="d-flex align-center">
                    <router-link class="text-h6 link" to="/">Al Guide</router-link>
                    <span class="text-h5 mx-4">/</span>
                    <router-link class="text-h6 link" to="/">RA scanner</router-link>
                </div>
            </v-col>
        </v-row>
        <v-row class="pt-10">
            <v-col cols="12">
                <p class="text-h5 text-grey mb-4">Você é um promoter?</p>
                <v-btn :to="{ name: 'pro-events-create' }" style="text-transform: none" color="primary"
                    variant="elevated" rounded="pill">
                    <span> Enviar evento </span>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const items = [
    {
        title: "About",
        disabled: false,
        href: "breadcrumbs_dashboard",
    },
    {
        title: "Ticket",
        disabled: false,
        href: "breadcrumbs_link_1",
    },
    {
        title: "Resale",
        disabled: false,
        href: "breadcrumbs_link_2",
    },
];
</script>

<style lang="scss" scoped></style>