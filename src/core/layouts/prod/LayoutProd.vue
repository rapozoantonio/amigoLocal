<template>
  <v-app class="d-flex flex-column min-vh-100">
    <prod-bar />
    <prod-view class="flex-grow-1" />
    <loading-overlay />
    <!-- <footer-component /> -->
  </v-app>
</template>

<script setup>
import LoadingOverlay from "@/core/layouts/components/LoadingOverlay.vue";
import ProdBar from "./ProdAppBar.vue";
import FooterComponent from "../FooterComponent.vue";
import ProdView from "./ProdView.vue";
</script>
