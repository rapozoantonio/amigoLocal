<template>
  <v-main>
    <router-view :key="route.path" />
  </v-main>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

</script>
