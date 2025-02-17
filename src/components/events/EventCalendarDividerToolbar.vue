<template>
  <v-toolbar color="background" class="sticky-toolbar" density="compact">
    <v-toolbar-title class="d-flex align-center text-grey-darken-1">
      <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
      <span class="text-subtitle-1 font-weight-medium">
        {{ day }}
      </span>
    </v-toolbar-title>
  </v-toolbar>
</template>

<script setup>
const { day } = defineProps(["day"]);
</script>

<style scoped>
.sticky-toolbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>