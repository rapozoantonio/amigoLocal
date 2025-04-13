// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/promotion/store/auth";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/LayoutDefault.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/RegionSelector.vue"),
      },
    ],
  },
  {
    path: "/prod",
    component: () => import(/* webpackChunkName: "pro-layout" */ "@/layouts/prod/LayoutProd.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "events/list",
        name: "prod-events-list",
        component: () => import(/* webpackChunkName: "pro-events" */ "@/promotion/views/prod/event/ProdEventList.vue"),
      },
      {
        path: "event",
        name: "prod-event",
        component: () => import(/* webpackChunkName: "pro-events" */ "@/promotion/views/prod/event/ProdEventDetail.vue"),
      },
      {
        path: "events/create",
        name: "prod-events-create",
        component: () => import(/* webpackChunkName: "pro-events" */ "@/promotion/views/prod/event/EventCreate.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "path-not-found",
    component: () => import(/* webpackChunkName: "error" */ "@/promotion/views/PathNotFound.vue"),
  },
  {
    path: "/sitemap.xml",
    name: "sitemap",
    component: () => import(/* webpackChunkName: "static" */ "@/promotion/views/SitemapXML.vue"),
  },
  {
    path: "/termos-de-uso",
    name: "termos-de-uso",
    component: () => import(/* webpackChunkName: "static" */ "@/promotion/views/TermsOfUse.vue"),
  },
  {
    path: "/termos-de-privacidade",
    name: "termos-de-privacidade",
    component: () => import(/* webpackChunkName: "static" */ "@/promotion/views/PrivacyPolicy.vue"),
  },
];

// Optimized authentication check
const checkAuth = async (to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (!requiresAuth && !requiresAdmin) return true;

  const authStore = useAuthStore();
  const user = await authStore.getCurrentUser();

  if (!user) {
    return {
      name: "login",
      query: { redirect: btoa(to.fullPath) }
    };
  }

  if (requiresAdmin && (!user.admin || user.role !== "admin")) {
    return { name: "error401" };
  }

  return true;
};

// Create router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
});

// Route guard
router.beforeEach(async (to) => {
  // Check for inactive routes
  if (to.matched.some(record => record.meta.isActive === false)) {
    return { name: "path-not-found" };
  }

  return await checkAuth(to);
});

export default router;