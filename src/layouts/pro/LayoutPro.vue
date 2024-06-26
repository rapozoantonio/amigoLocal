<template>
    <v-app>
        <pro-bar />
        <pro-view />
        <pro-footer />
        <loading-overlay />
    </v-app>
</template>

<script setup>
import LoadingOverlay from '@/components/interface/LoadingOverlay.vue';

import ProBar from './ProAppBar.vue';
import ProFooter from './ProFooter.vue';
import ProView from './ProView.vue';
</script>
