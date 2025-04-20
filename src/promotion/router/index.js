// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/core/store/auth";

const routes = [
  {
    path: "/",
    component: () => import("@/core/layouts/default/LayoutDefault.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/RegionSelector.vue"),
      },
      {
        path: "select-region",
        name: "event-region-selector",
        component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventRegionSelector.vue"),
      },
      {
        path: "events",
        name: "event-list",
        component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/RegionSelector.vue"),
      },
      {
        path: "eventsAll/:country",
        props: true,
        component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventsPageAll.vue"),
        children: [
          {
            path: "",
            name: "eventsAll",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListAll.vue"),
          },
          {
            path: "carnaval",
            name: "eventsAll-carnaval",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListAllCarnaval.vue"),
          },
          {
            path: "reveillon",
            name: "eventsAll-reveillon",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListAllReveillon.vue"),
          },
          {
            path: "foryou",
            name: "eventsAll-foryou",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListAllForyou.vue"),
          },
        ],
      },
      {
        path: "events/:country/:region",
        props: true,
        component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventsPage.vue"),
        children: [
          {
            path: "",
            name: "events",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListAll.vue"),
          },
          {
            path: "carnaval",
            name: "events-carnaval",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListCarnaval.vue"),
          },
          {
            path: "reveillon",
            name: "events-reveillon",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListReveillon.vue"),
          },
          {
            path: "foryou",
            name: "events-foryou",
            props: true,
            component: () => import(/* webpackChunkName: "events" */ "@/promotion/views/events/EventListForyou.vue"),
          },
        ],
      },
      {
        path: "event/:id",
        name: "event-id",
        props: true,
        component: () => import(/* webpackChunkName: "event-single" */ "@/promotion/views/events/EventId.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import(/* webpackChunkName: "auth" */ "@/core/views/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import(/* webpackChunkName: "auth" */ "@/core/views/Register.vue"),
      },
      {
        path: "promoters/:id",
        name: "promoter-id",
        props: true,
        component: () => import(/* webpackChunkName: "promoter" */ "@/promotion/views/promoters/PromoterId.vue"),
        children: [
          {
            path: "",
            name: "promoter-info",
            props: true,
            component: () => import(/* webpackChunkName: "promoter" */ "@/promotion/views/promoters/PromoterInfo.vue"),
            meta: { isActive: true },
          },
          {
            path: "events",
            name: "promoter-events",
            props: true,
            component: () => import(/* webpackChunkName: "promoter" */ "@/promotion/views/promoters/PromoterEvents.vue"),
            meta: { isActive: false },
          },
          {
            path: "past-events",
            name: "promoter-past-events",
            props: true,
            component: () => import(/* webpackChunkName: "promoter" */ "@/promotion/views/promoters/PromoterPastEvents.vue"),
            meta: { isActive: false },
          },
          {
            path: "news",
            name: "promoter-news",
            props: true,
            component: () => import(/* webpackChunkName: "promoter" */ "@/promotion/views/promoters/PromoterNews.vue"),
            meta: { isActive: false },
          },
        ],
      },
      {
        path: "producers/:id",
        name: "producer-id",
        props: true,
        component: () => import(/* webpackChunkName: "producer" */ "@/promotion/views/producers/Producer.vue"),
        meta: { isActive: false },
        children: [
          {
            path: "",
            name: "producer-info",
            props: true,
            component: () => import(/* webpackChunkName: "producer" */ "@/promotion/views/producers/ProducerInfo.vue"),
            meta: { isActive: false },
          },
          {
            path: "events",
            name: "producer-events",
            props: true,
            component: () => import(/* webpackChunkName: "producer" */ "@/promotion/views/producers/ProducerEvents.vue"),
            meta: { isActive: false },
          },
          {
            path: "past-events",
            name: "producer-past-events",
            props: true,
            component: () => import(/* webpackChunkName: "producer" */ "@/promotion/views/producers/ProducerPastEvents.vue"),
            meta: { isActive: false },
          },
          {
            path: "news",
            name: "producer-news",
            props: true,
            component: () => import(/* webpackChunkName: "producer" */ "@/promotion/views/producers/ProducerNews.vue"),
            meta: { isActive: false },
          },
        ],
      },
      {
        path: "locations/:id",
        name: "location-id",
        props: true,
        component: () => import(/* webpackChunkName: "location" */ "@/promotion/views/locations/Location.vue"),
        meta: { isActive: true },
        children: [
          {
            path: "",
            name: "location-info",
            props: true,
            component: () => import(/* webpackChunkName: "location" */ "@/promotion/views/locations/LocationInfo.vue"),
            meta: { isActive: true },
          },
          {
            path: "events",
            name: "location-events",
            props: true,
            component: () => import(/* webpackChunkName: "location" */ "@/promotion/views/locations/LocationEvents.vue"),
            meta: { isActive: true },
          },
          {
            path: "past-events",
            name: "location-past-events",
            props: true,
            component: () => import(/* webpackChunkName: "location" */ "@/promotion/views/locations/LocationPastEvents.vue"),
            meta: { isActive: true },
          },
          {
            path: "news",
            name: "location-news",
            props: true,
            component: () => import(/* webpackChunkName: "location" */ "@/promotion/views/locations/LocationNews.vue"),
            meta: { isActive: true },
          },
        ],
      },
    ],
  },
  {
    path: "/pro",
    component: () => import(/* webpackChunkName: "pro-layout" */ "@/core/layouts/pro/LayoutPro.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "profile",
        component: () => import(/* webpackChunkName: "pro-profile" */ "@/promotion/views/pro/profile/Profile.vue"),
        children: [
          {
            path: "",
            name: "pro-profile",
            component: () => import(/* webpackChunkName: "pro-profile" */ "@/promotion/views/pro/profile/ProfilePersonal.vue"),
          },
          {
            path: "promoter",
            name: "pro-profile-promoter",
            component: () => import(/* webpackChunkName: "pro-profile" */ "@/promotion/views/pro/profile/ProfilePromoter.vue"),
          },
        ],
      },
      {
        path: "events/list",
        name: "pro-events-list",
        component: () => import(/* webpackChunkName: "pro-events" */ "@/promotion/views/pro/event/EventListCRUD.vue"),
      },
      {
        path: "events/create",
        name: "pro-events-create",
        component: () => import(/* webpackChunkName: "pro-events" */ "@/promotion/views/pro/event/EventCreate.vue"),
      },
      {
        path: "events/bulkcreate",
        name: "pro-events-bulk-create",
        component: () => import(/* webpackChunkName: "pro-events" */ "@/promotion/views/pro/event/EventBulkCreate.vue"),
      },
      {
        path: "locations/create",
        name: "pro-locations-create",
        component: () => import(/* webpackChunkName: "pro-locations" */ "@/promotion/views/pro/location/LocationCreate.vue"),
      },
      {
        path: "locations/:id",
        name: "pro-locations-id",
        component: () => import(/* webpackChunkName: "pro-locations" */ "@/promotion/views/pro/location/LocationCreate.vue"),
      },
      {
        path: "locations/:id/edit",
        name: "pro-locations-edit",
        component: () => import(/* webpackChunkName: "pro-locations" */ "@/promotion/views/pro/location/LocationEdit.vue"),
      },
      {
        path: "locations/:id/edit2",
        name: "pro-locations-edit2",
        component: () => import(/* webpackChunkName: "pro-locations" */ "@/promotion/views/pro/location/LocationEdit2.vue"),
      },
      {
        path: "promoters/request",
        name: "pro-promoter-request",
        component: () => import(/* webpackChunkName: "pro-promoter" */ "@/promotion/views/pro/promoter/PromoterRequest.vue"),
      },
    ],
  },
  {
    path: "/admin",
    component: () => import(/* webpackChunkName: "admin-layout" */ "@/core/layouts/admin/LayoutAdmin.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    children: [
      {
        path: "users",
        name: "admin-users",
        component: () => import(/* webpackChunkName: "admin" */ "@/promotion/views/admin/AdminUsers.vue"),
      },
      {
        path: "promoters",
        name: "admin-promoters",
        component: () => import(/* webpackChunkName: "admin" */ "@/promotion/views/admin/AdminPromoters.vue"),
      },
      {
        path: "requests",
        name: "admin-requests",
        component: () => import(/* webpackChunkName: "admin" */ "@/promotion/views/admin/AdminRequests.vue"),
      },
      {
        path: "config/event",
        name: "admin-config-events",
        component: () => import(/* webpackChunkName: "admin" */ "@/promotion/views/admin/EventsConfig.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "path-not-found",
    component: () => import(/* webpackChunkName: "error" */ "@/core/views/PathNotFound.vue"),
  },
  {
    path: "/sitemap.xml",
    name: "sitemap",
    component: () => import(/* webpackChunkName: "static" */ "@/core/views/SitemapXML.vue"),
  },
  {
    path: "/termos-de-uso",
    name: "termos-de-uso",
    component: () => import(/* webpackChunkName: "static" */ "@/core/views/TermsOfUse.vue"),
  },
  {
    path: "/termos-de-privacidade",
    name: "termos-de-privacidade",
    component: () => import(/* webpackChunkName: "static" */ "@/core/views/PrivacyPolicy.vue"),
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