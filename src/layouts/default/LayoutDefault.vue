<template>
    <v-app>
        <!-- <v-progress-circular color="primary" indeterminate></v-progress-circular> -->
        <default-view />
        <default-bar />
        <default-footer />
        <loading-overlay />
    </v-app>
</template>

<script setup>
console.log("layout default start")
import DefaultBar from "./DefaultAppBar.vue";
console.log("layout default appbar")

import DefaultView from "./DefaultView.vue";
console.log("layout default view")
import DefaultFooter from "./DefaultFooter.vue";
console.log("layout default footer")
import LoadingOverlay from "@/components/interface/LoadingOverlay.vue";
console.log("layout default end")

</script>
