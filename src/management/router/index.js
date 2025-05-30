// management/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/core/store/auth";
import Login from "@/core/views/Login.vue";
import Register from "@/core/views/Register.vue";
import PathNotFound from "@/core/views/PathNotFound.vue";

// Define routes without authentication requirements
const routes = [
  {
    path: "/",
    component: () => import("@/core/layouts/prod/LayoutProd.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        // Add aliases for dashboard
        alias: ["home", "admin-dashboard"],
        component: () => import("@/management/views/PricingPlans.vue"),
      },
      {
        path: "events",
        name: "events-list",
        // Add alias for event-list (singular) to match existing components
        alias: "/event-list",
        component: () => import("@/management/views/ProdEventList.vue"),
      },
      {
        path: "events/create",
        name: "event-create",
        component: () => import("@/management/views/EventCreate.vue"),
      },
      {
        path: "events/:eventId",
        name: "event-id",
        component: () => import("@/management/views/ProdEventDetail.vue"),
        props: true,
      },
      {
        path: "profile",
        name: "pro-profile",
        component: () => import("@/management/views/ProdEventList.vue"), // Reuse event list as placeholder
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/management/views/ProdEventList.vue"), // Reuse event list as placeholder
      },
      {
        path: "roles",
        name: "roles",
        component: () => import("@/management/views/RoleSettings.vue"), // Reuse event list as placeholder
      },
    ],
  },
  // Add a direct route for event-list for named route navigation
  {
    path: "/event-list",
    name: "event-list",
    component: () => import("@/management/views/ProdEventList.vue"),
    meta: { requiresAuth: true },
  },

  // Auth-related routes - use local management views
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: Login, // Use Login as placeholder
  },

  // Redirects for promotion routes
  {
    path: "/events/:country/:region(.*)",
    redirect: "/",
  },
  {
    path: "/events/:country",
    redirect: "/",
  },
  {
    path: "/admin",
    redirect: "/",
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: PathNotFound,
  },
];

// Create router instance with the correct base URL
const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

// Make router available globally for debugging
if (typeof window !== "undefined") {
  window.managementRouter = router;

  // Log all registered routes
  console.log(
    "Management Router Routes:",
    router.getRoutes().map((r) => ({
      name: r.name,
      path: r.path,
      fullPath: r.path,
    }))
  );
}

// Auth guard for protected routes
router.beforeEach(async (to, from, next) => {
  console.log(`Management router navigating to: ${to.fullPath}`);

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!requiresAuth) {
    next();
    return;
  }

  const authStore = useAuthStore();
  const user = await authStore.getCurrentUser();

  if (!user && requiresAuth) {
    // Redirect to login with return path
    next({
      name: "login",
      query: { redirect: btoa(to.fullPath) },
    });
    return;
  }

  // Special handler for login redirections
  if (to.name === "login" && to.query.redirect) {
    console.log("Login with redirect detected:", to.query.redirect);
  }

  // Intercept promotion routes
  if (to.fullPath.includes("/events/br/")) {
    console.log("Intercepted promotion redirect");
    next("/");
    return;
  }

  // Allow all navigation
  next();
});

export default router;
