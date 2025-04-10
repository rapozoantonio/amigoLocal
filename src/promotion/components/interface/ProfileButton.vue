<template>
  <v-btn size="32" icon v-if="auth.user">
    <v-avatar size="32" color="primary">
      <template v-if="auth.user.photoURL">
        <v-img :src="auth.user.photoURL"></v-img>
      </template>
      <span v-else>{{ initials }}</span>
    </v-avatar>
    <v-menu activator="parent">
      <v-card min-width="240">
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
                {{ auth.user?.role }}
              </v-chip>
            </v-list-item-title>
            <v-list-item-subtitle>{{ auth.user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="mt-2"></v-divider>

          <v-list-item :to="{ name: 'pro-profile' }" link>
            <template #prepend> <v-icon>mdi-account</v-icon></template>
            <v-list-item-title> Perfil </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'pro-events-create' }" link>
            <template #prepend> <v-icon>mdi-calendar-star</v-icon></template>
            <v-list-item-title> Criar Evento </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'pro-events-list' }" link>
            <template #prepend> <v-icon>mdi-calendar-multiple-check</v-icon></template>
            <v-list-item-title> Lista de Eventos </v-list-item-title>
          </v-list-item>

          <!-- Add theme toggle -->
          <v-list-item @click="toggleTheme" link>
            <template #prepend>
              <v-icon>{{ themeIcon }}</v-icon>
            </template>
            <v-list-item-title>
              {{ theme.global.current.value.dark ? "Modo Claro" : "Modo Escuro" }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <template #prepend> <v-icon>mdi-logout</v-icon></template>
            <v-list-item-title @click="logout">
              Finalizar sessão
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-btn>

  <v-btn :to="{ name: 'login', query: { redirect } }" v-else> Sign In </v-btn>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/promotion/store/auth";
import { useTheme } from 'vuetify'

const route = useRoute();
const router = useRouter();

const initials = computed(() => {
  if (!auth.user || !auth.user.displayName) return null;
  const initArray = auth.user.displayName.split(" ");
  const firstLetter = initArray[0] ? initArray[0][0] : null;
  const secondLetter = initArray[1] ? initArray[1][0] : "";
  if (!firstLetter) return null;

  return firstLetter + secondLetter;
});

const redirect = computed(() => {
  return btoa(route.fullPath);
});

const auth = useAuthStore();

async function logout() {
  await auth.logout();
  navigation.reload();
}

const theme = useTheme()

const themeIcon = computed(() => {
  return theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'
})

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
