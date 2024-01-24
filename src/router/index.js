import { createRouter, createWebHistory } from 'vue-router'
import customRoutes from './modules/custom';
const commonRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/common/login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/common/Error_404.vue"),
    meta: {
      title: "404",
    },
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/common/Error_403.vue"),
    meta: {
      title: "403",
    },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/common/Error_500.vue"),
    meta: {
      title: "500",
    },
  },
  {
    path: "/",
    name: "/",
    component: () => import("@/views/common/login.vue"),
    meta: {
      title: "重定向",
    },
  },
];
const routes = [...commonRoutes, ...customRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
