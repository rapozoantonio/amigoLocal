<template>
    <v-divider class="mb-2"></v-divider>
    <v-card flat color="transparent" tile v-if="event">
      <v-row no-gutters class="align-center">
        <!-- Event Image -->
        <v-col cols="2">
          <router-link :to="{ name: 'event-id', params: { id: event.id } }">
            <v-img
              height="45"
              :src="event.image ? event.image?.url : event.flyerFront ? event.flyerFront.url : '/img/placeholder_event_1.jpg'"
              contain
            ></v-img>
          </router-link>
        </v-col>
  
        <!-- Event Details -->
        <v-col cols="7" class="px-1">
          <div class="d-flex justify-space-between flex-wrap">
            <router-link 
              :to="{ name: 'event-id', params: { id: event.id } }"
              class="text-h6 link"
            >
              {{ event.name }} 
            </router-link>
          </div>
          <div v-if="event.location?.name" class="d-flex align-center my-1"> <!-- Conditional rendering based on location -->
            <v-icon size="small" color="red">mdi-map-marker-outline</v-icon>
            <router-link to="/events" class="text-caption">
              {{ event.location.name }}
            </router-link>
          </div>
        </v-col>
  
        <!-- Promoter Code and Followers -->
        <v-col cols="3" class="d-flex justify-end align-center">
          <div class="my-1">
            <v-btn
              v-if="event.promoter?.code"
              size="small"
              rounded="pill"
              color="red-darken-4"
            >
              <v-icon size="small">mdi-ticket</v-icon>{{ event.promoter?.code }}
            </v-btn>
            <p class="text-caption">
              <v-icon size="small" color="red">mdi-account-outline</v-icon>
              {{ event.followers }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </template>
<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

a:visited {
  color: initial;
}

a:hover {
  color: rgba(var(--v-theme-primary));
}
</style>
