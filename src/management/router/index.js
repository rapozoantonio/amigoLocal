// management/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Define routes without authentication requirements
const routes = [
  {
    path: "/",
    component: () => import("@/core/layouts/prod/LayoutProd.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        // Add aliases for dashboard
        alias: ["home", "admin-dashboard"],
        component: () => import("@/management/views/ProdEventList.vue"),
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
        path: "events/:id",
        name: "event-detail",
        component: () => import("@/management/views/ProdEventDetail.vue"),
        props: true,
      },
    ],
  },
  // Add a direct route for event-list for named route navigation
  {
    path: "/event-list",
    name: "event-list",
    component: () => import("@/management/views/ProdEventList.vue"),
  },
  
  // Auth-related routes (simplified for now)
  {
    path: "/login",
    name: "login",
    component: () => import("@/core/views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/core/views/Login.vue"), // Reuse login as placeholder
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/core/views/Login.vue"), // Reuse login as placeholder
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/management/views/ProdEventList.vue"), // Reuse event list as placeholder
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
    component: () => import("@/core/views/PathNotFound.vue"),
  },
];

// Create router instance with the correct base URL
const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

// Make router available globally for debugging
if (typeof window !== 'undefined') {
  window.managementRouter = router;
  
  // Log all registered routes
  console.log('Management Router Routes:', 
    router.getRoutes().map(r => ({ 
      name: r.name, 
      path: r.path,
      fullPath: r.path
    }))
  );
}

// Simple route guard - no auth checks
router.beforeEach((to, from, next) => {
  console.log(`Management router navigating to: ${to.fullPath}`);
  
  // Special handler for login redirections
  if (to.name === 'login' && to.query.redirect) {
    console.log('Login with redirect detected:', to.query.redirect);
  }
  
  // Intercept promotion routes
  if (to.fullPath.includes('/events/br/')) {
    console.log('Intercepted promotion redirect');
    next('/');
    return;
  }
  
  // Allow all navigation
  next();
});

export default router;