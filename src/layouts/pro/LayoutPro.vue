<template>
  <v-app class="d-flex flex-column min-vh-100">
    <pro-bar />
    <pro-view class="flex-grow-1" />
    <footer-component />
    <loading-overlay />
  </v-app>
</template>

<script setup>
import LoadingOverlay from "@/layouts/components/LoadingOverlay.vue";
import ProBar from "./ProAppBar.vue";
import FooterComponent from "../FooterComponent.vue";
import ProView from "./ProView.vue";
</script>
