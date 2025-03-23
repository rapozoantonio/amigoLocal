<template>
  <div>
    <v-navigation-drawer app width="320" v-if="xs" temporary v-model="opened">
      <v-toolbar density="compact" color="background">
        <v-container>
          <v-row align="center">
            <v-col cols="auto">
              <v-icon>mdi-ticket</v-icon>
            </v-col>
            <v-col cols="auto">
              <span class="ml-4 text-h6">Jubilos</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn icon="mdi-close" @click="opened = false"></v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar>
      <v-list>
        <v-list-item>
          <template #prepend>
            <v-avatar size="30" v-if="auth.user" color="primary">
              <template v-if="auth.user.photoURL">
                <v-img :src="auth.user.photoURL"></v-img>
              </template>
              <span v-else>{{ initials }}</span></v-avatar>
          </template>
          <v-list-item-title class="d-flex justify-space-between">
            <span>
              {{ auth.user?.displayName }}
            </span>
            <v-chip label size="x-small">
              {{ auth.user.role }}
            </v-chip>
          </v-list-item-title>
          <v-list-item-subtitle>{{ auth.user?.email }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider></v-divider>

        <VListSubheader></VListSubheader>
        <v-list-item link :to="item.to" v-for="item in items" :key="item.title">
          <template #prepend>
            <v-avatar size="30">
              <v-icon> {{ item.icon }}</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat density="compact">
      <v-container>
        <v-row align="center">
          <v-col cols="auto">
            <v-app-bar-nav-icon v-if="xs" @click="opened = !opened"></v-app-bar-nav-icon>

            <v-btn v-else variant="plain" icon size="small" to="/">
              <v-icon icon="mdi-ticket" />
            </v-btn>
          </v-col>
          <v-col v-if="!xs">
            <nav>
              <v-btn :to="{ name: 'event-list' }" style="text-transform: none" variant="plain">Eventos</v-btn>
            </nav>
          </v-col>
          <v-spacer></v-spacer>

          <v-col cols="auto">
            <profile-button></profile-button>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useDisplay } from "vuetify/lib/framework.mjs";

import ProfileButton from "@/components/interface/ProfileButton.vue";
import { useAuthStore } from "@/store/auth";

const auth = useAuthStore();

const items = ref([
  { title: "Eventos", to: "/events", icon: "mdi-calendar" },
  { title: "Precisa de Ajuda?", to: "/contact", icon: "mdi-face-agent" },
]);
const { xs } = useDisplay();
const opened = ref(false);
</script>
