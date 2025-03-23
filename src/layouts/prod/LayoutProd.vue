<template>
  <v-app class="d-flex flex-column min-vh-100">
    <prod-bar />
    <prod-view class="flex-grow-1" />
    <footer-component />
    <loading-overlay />
  </v-app>
</template>

<script setup>
import LoadingOverlay from "@/components/interface/LoadingOverlay.vue";
import ProdBar from "./ProdAppBar.vue";
import FooterComponent from "../FooterComponent.vue";
import ProdView from "./ProdView.vue";
</script>
