import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/:appId",
      name: "app",
      component: HomeView,
    },
    {
      path: "/:appId/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
