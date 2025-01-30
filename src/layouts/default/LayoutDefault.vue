<template>
  <v-app>
    <default-view />
    <default-bar />
    <default-footer />
    <loading-overlay />
  </v-app>
</template>

<script setup>
import DefaultBar from "./DefaultAppBar.vue";

import DefaultView from "./DefaultView.vue";
import DefaultFooter from "../FooterComponent.vue";
import LoadingOverlay from "@/components/interface/LoadingOverlay.vue";
</script>
