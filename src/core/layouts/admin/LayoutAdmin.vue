<template>
  <v-app class="d-flex flex-column min-vh-100">
    <admin-bar />
    <admin-view class="flex-grow-1" />
    <footer-component />
    <loading-overlay />
  </v-app>
</template>

<script setup>
import AdminBar from "./AdminAppBar.vue";
import AdminView from "./AdminView.vue";
import FooterComponent from "../FooterComponent.vue";
import LoadingOverlay from "@/core/layouts/components/LoadingOverlay.vue";
</script>
