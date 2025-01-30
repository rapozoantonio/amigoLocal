<template>
  <div style="padding-top: 42px">
  <router-view :key="route.path" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

</script>
