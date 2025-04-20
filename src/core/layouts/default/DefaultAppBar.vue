<template>
  <div>
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-if="xs" temporary v-model="opened" location="left">
      <v-list nav>
        <template v-for="item in navigationItems" :key="item.to">
          <v-list-item
            :to="item.to"
            :active="isRouteActive(item.to)"
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
        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <v-app-bar-nav-icon
              v-if="xs"
              @click.stop="opened = !opened"
            ></v-app-bar-nav-icon>

            <v-btn
              v-else
              variant="plain"
              icon
              size="small"
              to="/"
              :aria-label="'Home'"
            >
              <v-icon icon="mdi-ticket" />
            </v-btn>
          </v-col>

          <!-- Desktop Navigation -->
          <v-col v-if="!xs">
            <nav>
              <v-menu open-on-hover location="bottom" close-on-content-click>
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="text-none"
                    variant="plain"
                    :active="isEventRoute"
                  >
                    Eventos
                    <v-icon end>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-list nav density="compact">
                  <template v-for="item in navigationItems" :key="item.to">
                    <v-list-item
                      :to="item.to"
                      :active="isRouteActive(item.to)"
                      @click="handleNavigation(item)"
                      :value="item.to"
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
import { ref, computed } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useRoute, useRouter } from "vue-router";
import ProfileButton from "@/core/components/interface/ProfileButton.vue";
import { useAuthStore } from "@/core/store/auth";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const { xs } = useDisplay();
const opened = ref(false);

const navigationItems = [
  {
    title: "Todos os Eventos",
    to: "/select-region",
    type: "select-region",
  },
  {
    title: "Eventos Rio de Janeiro",
    to: "/events/BR/riodejaneiro",
    type: "events",
  },
  // {
  //   title: "Eventos São Paulo",
  //   to: "/events/BR/saopaulo",
  //   type: "events",
  // },
  {
    title: "Carnaval",
    to: "/eventsAll/BR/carnaval",
    type: "eventsAll",
  },
  {
    title: "Reveillon",
    to: "/eventsAll/BR/reveillon",
    type: "eventsAll",
  },
];

// Check if current route is an event-related route
const isEventRoute = computed(() => {
  return (
    route.path.includes("/events") ||
    route.path.includes("/eventsAll") ||
    route.path === "/select-region"
  );
});

// Check if a specific route is active
const isRouteActive = (path) => {
  return route.path === path;
};

const handleNavigation = async (item) => {
  opened.value = false;

  try {
    switch (item.type) {
      case "select-region":
      case "events":
      case "eventsAll":
        await router.push(item.to);
        break;
      case "named":
        await router.push({ name: item.name });
        break;
      default:
        console.warn(`Unknown navigation type: ${item.type}`);
    }
  } catch (error) {
    if (error.name === "NavigationDuplicated") {
      // Ignore navigation to current location
      return;
    }
    console.error("Navigation error:", error);
  }
};

// Close drawer on route change
router.afterEach(() => {
  opened.value = false;
});
</script>

<style scoped>
.v-btn {
  letter-spacing: normal;
}

/* Ensure proper hover states */
.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

/* Ensure proper active states */
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.2);
}
</style>
