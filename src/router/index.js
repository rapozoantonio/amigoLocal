import { createRouter, createWebHistory } from "vue-router";

// Composables
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";

const routes = [
  // PATH "/"
  {
    path: "/",
    component: () => import("@/layouts/default/LayoutDefault.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/events/RegionSelector.vue"),
      },
      //TODO: REVISAR
      {
        path: "select-region", //TODO OS EVENTOS
        name: "event-region-selector",
        component: () => import("@/views/events/EventRegionSelector.vue"),
      },
      //TODO: HOME RENDERIZAR
      {
        path: "events",
        name: "event-list",
        component: () => import("@/views/events/RegionSelector.vue"),
      },
      {
        path: "eventsAll/:country",
        props: true,
        component: () => import("@/views/events/EventsPageAll.vue"),
        children: [
          {
            path: "",
            name: "eventsAll",
            props: true,
            component: () => import("@/views/events/EventListAll.vue"),
          },
          {
            path: "carnaval",
            name: "eventsAll-carnaval",
            props: true,
            component: () => import("@/views/events/EventListAllCarnaval.vue"),
          },
          {
            path: "reveillon",
            name: "eventsAll-reveillon",
            props: true,
            component: () => import("@/views/events/EventListAllReveillon.vue"),
          },
          {
            path: "foryou",
            name: "eventsAll-foryou",
            props: true,
            component: () => import("@/views/events/EventListAllForyou.vue"),
          },
        ],
      },
      {
        path: "events/:country/:region",
        props: true,
        component: () => import("@/views/events/EventsPage.vue"),
        children: [
          {
            path: "",
            name: "events",
            props: true,
            component: () => import("@/views/events/EventListAll.vue"),
          },
          {
            path: "carnaval",
            name: "events-carnaval",
            props: true,
            component: () => import("@/views/events/EventListCarnaval.vue"),
          },
          {
            path: "reveillon",
            name: "events-reveillon",
            props: true,
            component: () => import("@/views/events/EventListReveillon.vue"),
          },
          {
            path: "foryou",
            name: "events-foryou",
            props: true,
            component: () => import("@/views/events/EventListForyou.vue"),
          },
        ],
      },
      {
        path: "event/:id",
        name: "event-id",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "event-id" */ "@/views/events/EventId.vue"
          ),
      },
      {
        path: "login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "register" */ "@/views/Register.vue"),
      },
      //TODO: change id to name, and search other router-link :to="{ name: 'promoter-id',
      {
        path: "promoters/:id",
        name: "promoter-id",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "promoter" */ "@/views/promoters/PromoterId.vue"
          ),
        children: [
          {
            path: "",
            name: "promoter-info",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "promoter-info" */ "@/views/promoters/PromoterInfo.vue"
              ),
            meta: {
              isActive: true,
            },
          },
          {
            path: "events",
            name: "promoter-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "promoter-events" */ "@/views/promoters/PromoterEvents.vue"
              ),
            meta: {
              isActive: false,
            },
          },
          {
            path: "past-events",
            name: "promoter-past-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "promoter-past-events" */ "@/views/promoters/PromoterPastEvents.vue"
              ),
            meta: {
              isActive: false,
            },
          },
          {
            path: "news",
            name: "promoter-news",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "promoter-news" */ "@/views/promoters/PromoterNews.vue"
              ),
            meta: {
              isActive: false,
            },
          },
        ],
      },
      {
        path: "producers/:id",
        name: "producer-id",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "producer" */ "@/views/producers/Producer.vue"
          ),
        meta: {
          isActive: false,
        },
        children: [
          {
            path: "",
            name: "producer-info",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-info" */ "@/views/producers/ProducerInfo.vue"
              ),
            meta: {
              isActive: false,
            },
          },
          {
            path: "events",
            name: "producer-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-events" */ "@/views/producers/ProducerEvents.vue"
              ),
            meta: {
              isActive: false,
            },
          },
          {
            path: "past-events",
            name: "producer-past-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-past-events" */ "@/views/producers/ProducerPastEvents.vue"
              ),
            meta: {
              isActive: false,
            },
          },
          {
            path: "news",
            name: "producer-news",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-news" */ "@/views/producers/ProducerNews.vue"
              ),
            meta: {
              isActive: false,
            },
          },
        ],
      },
      {
        path: "locations/:id",
        name: "location-id",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "location-id" */ "@/views/locations/Location.vue"
          ),
        meta: {
          isActive: true,
        },
        children: [
          {
            path: "",
            name: "location-info",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-info" */ "@/views/locations/LocationInfo.vue"
              ),
            meta: {
              isActive: true,
            },
          },
          {
            path: "events",
            name: "location-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-events" */ "@/views/locations/LocationEvents.vue"
              ),
            meta: {
              isActive: true,
            },
          },
          {
            path: "past-events",
            name: "location-past-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-past-events" */ "@/views/locations/LocationPastEvents.vue"
              ),
            meta: {
              isActive: true,
            },
          },
          {
            path: "news",
            name: "location-news",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-news" */ "@/views/locations/LocationNews.vue"
              ),
            meta: {
              isActive: true,
            },
          },
        ],
      },
    ],
  },
  //  PATH "/pro"
  {
    path: "/pro",
    component: () => import("@/layouts/pro/LayoutPro.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "profile",
        component: () =>
          import(
            /* webpackChunkName: "pro-profile" */ "@/views/pro/profile/Profile.vue"
          ),
        children: [
          {
            path: "",
            name: "pro-profile",
            component: () =>
              import(
                /* webpackChunkName: "pro-profile-personal" */ "@/views/pro/profile/ProfilePersonal.vue"
              ),
          },
          {
            path: "promoter",
            name: "pro-profile-promoter",
            component: () =>
              import(
                /* webpackChunkName: "pro-profile-promoter" */ "@/views/pro/profile/ProfilePromoter.vue"
              ),
          },
        ],
      },
      {
        path: "events/list",
        name: "pro-events-list",

        component: () =>
          import(
            /* webpackChunkName: "pro-event-create" */ "@/views/pro/event/EventListCRUD.vue"
          ),
      },
      {
        path: "events/create",
        name: "pro-events-create",

        component: () =>
          import(
            /* webpackChunkName: "pro-event-create" */ "@/views/pro/event/EventCreate.vue"
          ),
      },
      {
        path: "events/bulkcreate",
        name: "pro-events-bulk-create",

        component: () =>
          import(
            /* webpackChunkName: "pro-events-bulk-create" */ "@/views/pro/event/EventBulkCreate.vue"
          ),
      },
      {
        path: "locations/create",
        name: "pro-locations-create",

        component: () =>
          import(
            /* webpackChunkName: "pro-location-create" */ "@/views/pro/location/LocationCreate.vue"
          ),
      },
      {
        path: "locations/:id",
        name: "pro-locations-id",

        component: () =>
          import(
            /* webpackChunkName: "pro-location-id" */ "@/views/pro/location/LocationCreate.vue"
          ),
      },
      {
        path: "locations/:id/edit",
        name: "pro-locations-edit",

        component: () =>
          import(
            /* webpackChunkName: "pro-location-edit" */ "@/views/pro/location/LocationEdit.vue"
          ),
      },
      {
        path: "locations/:id/edit2",
        name: "pro-locations-edit2",

        component: () =>
          import(
            /* webpackChunkName: "pro-location-edit2" */ "@/views/pro/location/LocationEdit2.vue"
          ),
      },
      {
        path: "promoters/request",
        name: "pro-promoter-request",
        component: () =>
          import(
            /* webpackChunkName: "pro-promoter-request" */ "@/views/pro/promoter/PromoterRequest.vue"
          ),
      },
    ],
  },
  //  PATH "/admin"
  {
    path: "/admin",
    component: () => import("@/layouts/admin/LayoutAdmin.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    children: [
      {
        path: "users",
        name: "admin-users",

        component: () =>
          import(
            /* webpackChunkName: "admin-users" */ "@/views/admin/AdminUsers.vue"
          ),
      },
      {
        path: "promoters",
        name: "admin-promoters",

        component: () =>
          import(
            /* webpackChunkName: "admin-promoters" */ "@/views/admin/AdminPromoters.vue"
          ),
      },
      {
        path: "requests",
        name: "admin-requests",
        component: () =>
          import(
            /* webpackChunkName: "admin-requests" */ "@/views/admin/AdminRequests.vue"
          ),
      },
      {
        path: "config/event",
        name: "admin-config-events",
        component: () =>
          import(
            /* webpackChunkName: "events-config" */ "@/views/admin/EventsConfig.vue"
          ),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "path-not-found",
    component: () =>
      import(
        /* webpackChunkName: "path-not-found" */ "@/views/PathNotFound.vue"
      ),
  },
  {
    path: "/sitemap.xml",
    name: "sitemap",
    component: () => import("@/views/SitemapXML.vue"),
  },
  {
    path: "/termos-de-uso",
    name: "termos-de-uso",
    component: () => import("@/views/TermsOfUse.vue"),
  },
  {
    path: "/termos-de-privacidade",
    name: "termos-de-privacidade",
    component: () => import("@/views/PrivacyPolicy.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  // Check if any matched route has `isActive` set to `false`, for pages not ready to prod
  if (!isRouteActive(to)) {
    next({ name: "path-not-found" });
    return;
  } // Added missing closing brace here

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const authStore = useAuthStore();
  const userStore = useUserStore();

  if (!requiresAuth && !requiresAdmin) {
    next();
    return;
  }

  const user = await authStore.getCurrentUser();

  if (!user) {
    next({ name: "login", query: { redirect: btoa(to.fullPath) } });
    return;
  }

  if (!requiresAdmin) {
    next();
    return;
  }

  if (user.admin && user.role === "admin") {
    next();
    return;
  }

  next({ name: "error401" });
  return;
});

function isRouteActive(to) {
  return !to.matched.some((record) => record.meta.isActive === false);
}

export default router;
