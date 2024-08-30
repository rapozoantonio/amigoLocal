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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
        redirect: "/events",
      },
      {
        path: "about",
        name: "About",
        component: () =>
          import(/* webpackChunkName: "about" */ "@/views/About.vue"),
      },
      {
        path: "events",
        name: "event-list",
        component: () =>
          import(
            /* webpackChunkName: "region-selector" */ "@/views/events/RegionSelector.vue"
          ),
      },
      {
        path: "events/:country/:region",
        // name: "events",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "events" */ "@/views/events/EventsPage.vue"
          ),
        children: [
          {
            path: "",
            name: "events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "events-all" */ "@/views/events/EventListAll.vue"
              ),
          },
          {
            path: "foryou",
            name: "events-foryou",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "events-foryou" */ "@/views/events/EventListForyou.vue"
              ),
          },
          {
            path: "new",
            name: "events-new",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "events-new" */ "@/views/events/EventListNew.vue"
              ),
          },
          {
            path: "bestpicks",
            name: "events-bestpicks",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "events-bestpicks" */ "@/views/events/EventListBestpicks.vue"
              ),
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
      {
        path: "promoters/:id",
        name: "promoter-id",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "promoter" */ "@/views/promoters/Promoter.vue"
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
          },
          {
            path: "events",
            name: "promoter-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "promoter-events" */ "@/views/promoters/PromoterEvents.vue"
              ),
          },
          {
            path: "past-events",
            name: "promoter-past-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "promoter-past-events" */ "@/views/promoters/PromoterPastEvents.vue"
              ),
          },
          {
            path: "news",
            name: "promoter-news",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "promoter-news" */ "@/views/promoters/PromoterNews.vue"
              ),
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
        children: [
          {
            path: "",
            name: "producer-info",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-info" */ "@/views/producers/ProducerInfo.vue"
              ),
          },
          {
            path: "events",
            name: "producer-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-events" */ "@/views/producers/ProducerEvents.vue"
              ),
          },
          {
            path: "past-events",
            name: "producer-past-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-past-events" */ "@/views/producers/ProducerPastEvents.vue"
              ),
          },
          {
            path: "news",
            name: "producer-news",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "producer-news" */ "@/views/producers/ProducerNews.vue"
              ),
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
        children: [
          {
            path: "",
            name: "location-info",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-info" */ "@/views/locations/LocationInfo.vue"
              ),
          },
          {
            path: "events",
            name: "location-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-events" */ "@/views/locations/LocationEvents.vue"
              ),
          },
          {
            path: "past-events",
            name: "location-past-events",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-past-events" */ "@/views/locations/LocationPastEvents.vue"
              ),
          },
          {
            path: "news",
            name: "location-news",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "location-news" */ "@/views/locations/LocationNews.vue"
              ),
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
        name: "pro-profile",

        component: () =>
          import(
            /* webpackChunkName: "pro-profile" */ "@/views/pro/Profile.vue"
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
        path: "events/autocreate",
        name: "pro-events-autocreate",

        component: () =>
          import(
            /* webpackChunkName: "pro-event-autocreate" */ "@/views/pro/event/EventAutoCreate2.vue"
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
        path: "events/create-steps",
        name: "pro-events-create-steps",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "pro-events-edit" */ "@/views/pro/event/EventTestSteps.vue"
          ),
      },
      {
        path: "events/:id/edit",
        name: "pro-events-edit",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "pro-events-edit" */ "@/views/pro/event/EventTest.vue"
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  

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

// router.beforeEach(async (to, from, next) => {
//   
//   
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//   const auth = useAuthStore();
//   const token = await auth.getUserClaims();
//   if (token) {
//     const userStore = useUserStore();
//     if (!userStore.user || userStore.user.uid !== token.claims.user_id) {
//       const user = await userStore.getUser(token.claims.user_id);
//       if (!user.completed) {
//         next({ name: "pro-profile", redirect: btoa(to.fullPath) });
//         return;
//       }
//     }
//   }
//   
//   
//   if (!requiresAuth) {
//     
//     next();
//     return;
//   }
//   
//   
//   const user = await auth.getCurrentUser();
//   
//   if (!user) {
//     
//     next({ name: "login", query: { redirect: btoa(to.fullPath) } });
//     return;
//   }
//   next();
// });

export default router;
