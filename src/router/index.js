import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/LayoutDefault.vue'),
    children: [
      {
        path: "",
        name: "EventList",
        component: () => import(/* webpackChunkName: "EventList" */ '@/views/EventList.vue'),
      },
      {
        path: 'event', // The URL path for EventPage
        name: 'EventPage',
        component: () => import(/* webpackChunkName: "EventPage" */ '@/views/EventPage.vue'),
      },
    ]
  },
  {
    path: '/pro',
    component: () => import('@/layouts/pro/LayoutPro.vue'),
    children: [
      {
        path: 'events/create', // The URL path for EventCreate
        name: 'EventCreate',
        component: () => import(/* webpackChunkName: "EventCreate" */ '@/views/EventCreate.vue'),
      }
    ]
  }
  // other routes...
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
