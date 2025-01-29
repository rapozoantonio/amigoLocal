<template>
  <div>
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-if="xs" temporary v-model="opened">
      <v-list>
        <template v-for="item in navigationItems" :key="item.title">
          <v-list-item
            :to="item.to"
            @click="handleNavigation(item)"
            link
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
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

          <!-- Desktop Navigation -->
          <v-col v-if="!xs">
            <nav>
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    style="text-transform: none"
                    variant="plain"
                  >
                    Eventos
                    <v-icon right>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <template v-for="item in navigationItems" :key="item.title">
                    <v-list-item
                      @click="handleNavigation(item)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
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
import { useRoute, useRouter } from "vue-router";
import ProfileButton from "@/components/interface/ProfileButton.vue";
import { useAuthStore } from "@/store/auth";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const { xs } = useDisplay();
const opened = ref(false);

const navigationItems = ref([
  { 
    title: "Todos os Eventos", 
    to: "/select-region",
    type: "select-region"
  },
  {
    title: "Eventos Rio de Janeiro",
    to: "/events/BR/riodejaneiro",
    type: "events"
  },
  { 
    title: "Eventos São Paulo", 
    to: "/events/BR/saopaulo",
    type: "events"
  },
  { 
    title: "Carnaval", 
    name: "events-carnaval",
    type: "named"
  },
  { 
    title: "Reveillon", 
    name: "events-reveillon",
    type: "named"
  },
]);

const handleNavigation = (item) => {
  opened.value = false;
  
  if (item.type === 'select-region') {
    router.push('/select-region');
  } else if (item.type === 'events') {
    router.push(item.to);
  } else if (item.type === 'named') {
    router.push({ name: item.name });
  }
};
</script>

<style scoped>
.v-btn {
  letter-spacing: normal;
}
</style>