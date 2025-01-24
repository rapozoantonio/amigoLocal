<template>
  <v-divider class="mb-3"></v-divider>
  <v-card flat color="transparent" tile v-if="event">
    <v-row>
      <v-col cols="auto">
        <router-link :to="{ name: 'event-id', params: { id: event.id } }">
          <v-img
            width="215"
            max-height="150"
            :src="
              event.image
                ? event.image?.url
                : event.flyerFront
                ? event.flyerFront.url
                : '/img/placeholder_event_1.jpg'
            "
            cover
          ></v-img>
        </router-link>
      </v-col>
      <v-col class="d-flex flex-column">
        <router-link to="/events" class="text-grey-darken-1 font-weight-bold">
          {{ event.startDate }}
        </router-link>
        <div>
          <router-link
            :to="{ name: 'event-id', params: { id: event.id } }"
            class="text-h5 font-weight-bold link link-text"
          >
            {{ event.name }}
          </router-link>
        </div>
        <router-link to="/events" class="text-caption mt-2">
          <v-icon size="large" color="primaryIcon"
            >mdi-map-marker-radius-outline</v-icon
          >{{ event.location?.name }}
        </router-link>
        <p class="text-caption mt-2">
          <v-icon size="large" color="primaryIcon">mdi-account-multiple</v-icon>
          {{ event.followers }}
        </p>
      </v-col>
      <v-col cols="auto" align-self="end">
        <v-btn
          v-if="event.promoter?.code"
          size="x-small"
          rounded="pill"
          color="primaryIcon"
          ><v-icon start>mdi-ticket</v-icon>{{ event.promoter?.code }}</v-btn
        >
      </v-col>
    </v-row>
  </v-card>
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
