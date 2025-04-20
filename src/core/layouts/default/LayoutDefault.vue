<template>
  <v-app class="d-flex flex-column min-vh-100">
    <default-view class="flex-grow-1" />
    <default-bar />
    <default-footer />
    <loading-overlay />
  </v-app>
</template>

<script setup>
import DefaultBar from "./DefaultAppBar.vue";

import DefaultView from "./DefaultView.vue";
import DefaultFooter from "../FooterComponent.vue";
import LoadingOverlay from "@/core/layouts/components/LoadingOverlay.vue";
</script>
