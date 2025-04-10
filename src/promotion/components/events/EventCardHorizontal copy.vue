<template>
  <v-card flat>
    <v-row>
      <v-col cols="auto">
        <LazyImage
          :src="event.image.url"
          :alt="`Event cover for ${event.name}`"
          width="215"
          max-height="150"
          fit="cover"
        />
      </v-col>
      <v-col>
        <p class="text-grey-darken-1 font-weight-bold">
          {{ event.startDate }}
        </p>
        <p class="text-h5 font-weight-bold">
          {{ event.name }}
        </p>
        <p class="text-caption pl-1 mt-2">
          <v-icon size="large" color="primaryIcon">mdi-map-marker</v-icon>
          {{ event.location.name }}
        </p>
        <p class="text-caption pl-1 mt-2">
          <v-icon size="large" color="primaryIcon">mdi-account-group</v-icon>
          {{ event.following }}
        </p>
      </v-col>
      <v-col cols="auto" align-self="end">
        <v-btn
          v-if="event.code"
          size="x-small"
          rounded="pill"
          color="primaryIcon"
          ><v-icon start>mdi-ticket</v-icon>{{ event.code }}</v-btn
        >
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import LazyImage from "@/promotion/components/common/LazyImage.vue";
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped></style>
