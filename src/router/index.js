import { createRouter, createWebHistory } from "vue-router";
import EventList from "../views/EventList.vue";
import EventPage from '../views/EventPage.vue'; // Import EventPage

const routes = [
  {
    path: "/",
    name: "EventList",
    component: EventList,
  },
  {
    path: '/event', // The URL path for EventPage
    name: 'EventPage',
    component: EventPage
  },
  // other routes...
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
