<template>
  <v-toolbar color="background" class="sticky-toolbar" density="compact">
    <v-toolbar-title>
      <div class="text-grey-darken-1 d-flex align-center py-1">
        <v-icon size="18" class="mr-2">mdi-calendar</v-icon>
        <span class="text-subtitle-1 text-sm-h6 font-weight-medium">
          {{ day }}
        </span>
      </div>
    </v-toolbar-title>
  </v-toolbar>
</template>
<script setup>
const { day } = defineProps(["day"]);
</script>
