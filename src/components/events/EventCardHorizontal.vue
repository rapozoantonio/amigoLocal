<template>
  <v-divider class="mb-3"></v-divider>
  <v-card class="py-1" elevation="0" flat color="transparent" tile v-if="event">
    <v-row align="center">
      <!-- Added align="center" -->
      <!-- Image column - responsive width -->
      <v-col cols="3" sm="2" md="1">
        <router-link :to="{ name: 'event-id', params: { id: event.id } }">
          <v-img
            class="mr-4"
            :width="$vuetify.display.mdAndUp ? '100' : '75'"
            :max-height="$vuetify.display.mdAndUp ? '120' : '100'"
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

      <!-- Content column - adaptive width -->
      <v-col cols="9" sm="10" md="11">
        <v-row no-gutters>
          <!-- Event Title -->
          <v-col cols="12" class="mb-2">
            <router-link
              :to="{ name: 'event-id', params: { id: event.id } }"
              class="text-h5 font-weight-bold link link-text"
            >
              {{ event.name }}
            </router-link>
          </v-col>

          <!-- Info Row -->
          <v-col cols="12">
            <v-row align="center" justify="space-between" no-gutters>
              <!-- Location -->
              <v-col cols="auto">
                <router-link
                  to="/events"
                  class="text-caption d-flex align-center"
                >
                  <v-icon size="large" color="primaryIcon" class="mr-1">
                    mdi-map-marker-radius-outline
                  </v-icon>
                  {{ event.location?.name }}
                </router-link>
              </v-col>

              <!-- Followers -->
              <v-col cols="auto">
                <span class="text-caption d-flex align-center">
                  <v-icon size="large" color="primaryIcon" class="mr-1">
                    mdi-account-multiple
                  </v-icon>
                  {{ event.followers }}
                </span>
              </v-col>

              <!-- Promoter Code -->
              <v-col cols="auto" v-if="event.promoter?.code">
                <v-btn size="x-small" rounded="pill">
                  <v-icon start color="primaryIcon">mdi-ticket</v-icon>
                  {{ event.promoter?.code }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
  <v-divider></v-divider>
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
  &:hover {
    color: rgb(var(--v-theme-primary));
  }
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

  &:hover,
  &:visited:hover {
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
