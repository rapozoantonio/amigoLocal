<template>
    <v-app>
        <admin-bar />
        <admin-view />
        <footer-component />
        <loading-overlay />
    </v-app>
</template>

<script setup>
import AdminBar from "./AdminAppBar.vue";
import AdminView from "./AdminView.vue";
import FooterComponent from "../FooterComponent.vue";
import LoadingOverlay from "@/components/interface/LoadingOverlay.vue";
</script>
