<template>
    <v-app>
        <pro-bar />
        <pro-view />
        <footer-component />
        <loading-overlay />
    </v-app>
</template>

<script setup>
import LoadingOverlay from '@/components/interface/LoadingOverlay.vue';

import ProBar from './ProAppBar.vue';
import FooterComponent from '../FooterComponent.vue';
import ProView from './ProView.vue';
</script>
