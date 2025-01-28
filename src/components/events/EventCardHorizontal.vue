<template>
  <v-divider class="mb-3"></v-divider>
  <v-card class="py-1" elevation="0" flat color="transparent" tile v-if="event">
    <v-row>
      <v-col cols="3">
        <router-link :to="{ name: 'event-id', params: { id: event.id } }">
          <v-img
            class="mr-4"
            width="75"
            max-height="100"
            :src="
              event.image
                ? event.image?.url
                : event.flyerFront
                ? event.flyerFront.url
                : '/img/placeholder_event_1.jpg'
            "
            cover
          ></v-img> </router-link
      ></v-col>

      <v-col cols="8" class="py-6">
        <v-row class="">
          <router-link
            :to="{ name: 'event-id', params: { id: event.id } }"
            class="text-h5 font-weight-bold link link-text"
          >
            {{ event.name }}
          </router-link>
        </v-row>
        <v-row class="d-flex justify-space-between align-center mt-4">
          <!-- <router-link to="/events" class="text-grey-darken-1 font-weight-bold">
          {{ event.startDate }}
        </router-link> -->

          <!-- <router-link
            :to="{ name: 'event-id', params: { id: event.id } }"
            class="text-h5 font-weight-bold link"
          >
            {{ event.name }}
          </router-link> -->

          <router-link to="/events" class="text-white text-caption mt-2">
            <v-icon size="large" color="primary"
              >mdi-map-marker-radius-outline</v-icon
            >{{ event.location?.name }}
          </router-link>
          <p class="text-white text-caption mt-2">
            <v-icon size="large" color="primary">mdi-account-multiple</v-icon>
            {{ event.followers }}
          </p>
        </v-row>
        <v-col cols="auto" align-self="end">
          <v-btn
            v-if="event.promoter?.code"
            size="x-small"
            rounded="pill"
            color="primary"
            ><v-icon start>mdi-ticket</v-icon>{{ event.promoter?.code }}</v-btn
          >
        </v-col>
      </v-col>
    </v-row>
  </v-card>
  <v-divider class=""></v-divider>
</template>

<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped>
// Move this to top to set base icon color
:deep(.v-icon[color="primaryIcon"]) {
  color: rgb(var(--v-theme-primaryIcon)) !important;
}

// Rest of your styles remain the same
a {
  text-decoration: none;
  color: rgb(var(--v-theme-link-text));
  &:hover { color: rgb(var(--v-theme-primary)); }
}
// Base link styles
a {
 text-decoration: none;
 color: rgb(var(--v-theme-link-text));

 &:hover {
   color: rgb(var(--v-theme-primary));
   
   .v-icon {
     color: rgb(var(--v-theme-primaryIcon)) !important;
   }
 }
}

// Keep v-icon color
:deep(.v-icon) {
 color: rgb(var(--v-theme-primaryIcon)) !important;
}

// Event title specific styles
.text-h5.link {
 color: rgb(var(--v-theme-link-text));

 &:hover, &:visited:hover {
   color: rgb(var(--v-theme-primary));
 }

 &:visited {
   color: rgb(var(--v-theme-link-text));
 }
}

// Location link specific styles 
.text-caption {
 color: rgb(var(--v-theme-link-text));

 &:hover {
   color: rgb(var(--v-theme-primary));
 }
}
</style>
