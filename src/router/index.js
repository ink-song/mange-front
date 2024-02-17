import { createRouter, createWebHistory } from 'vue-router';
import customRoutes from './modules/custom';
import Layout from '@/components/Layout.vue';

const commonRoutes = [
  {
    path: '/',
    name: '',
    component: Layout,
    meta: {
      title: '首页',
    },
    redirect: '/weclome',
    children: [
      {
        path: '/weclome',
        name: '/weclome',
        component: () => import('@/views/Welcome.vue'),
        meta: {
          title: 'you are the Best !',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/common/login.vue'),
    meta: {
      title: '登录',
    },
  },

  {
    path: '/403',
    name: '403',
    component: () => import('@/views/common/Error_403.vue'),
    meta: {
      title: '403',
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/common/Error_500.vue'),
    meta: {
      title: '500',
    },
  },
];
const routes = [...commonRoutes, ...customRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
