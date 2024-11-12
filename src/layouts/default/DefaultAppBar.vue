<template>
  <div>
    <v-navigation-drawer v-if="xs" temporary v-model="opened">
      <v-list>
        <v-list-item link :to="item.to" v-for="item in items" :key="item.title">
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar flat density="compact">
      <v-container>
        <v-row align="center">
          <v-col cols="auto">
            <v-app-bar-nav-icon
              v-if="xs"
              @click="opened = !opened"
            ></v-app-bar-nav-icon>

            <v-btn v-else variant="plain" icon size="small">
              <v-icon icon="mdi-ticket" />
            </v-btn>
          </v-col>
          <v-col v-if="!xs">
            <nav>
              <v-btn
                :to="{ name: 'event-list' }"
                style="text-transform: none"
                variant="plain"
                >Eventos</v-btn
              >
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
  { title: "Todos os Eventos", to: "/events" },
  { title: "Eventos Rio de Janeiro", to: "/events/BR/riodejaneiro" },
  { title: "Eventos São Paulo", to: "/events/BR/saopaulo" },
  { title: "Eventos em Outros Estados", to: "/events/BR/riodejaneiro" },
  { title: "Carnaval", to: "/events/carnaval" },
  { title: "Reveillon", to: "/events/reveillon" },
]);
const { xs } = useDisplay();
const opened = ref(false);
</script>
