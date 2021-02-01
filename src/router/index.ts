import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/Landing.vue'),
  },
  {
    path: '/browse',
    name: 'browse',
    component: () => import('../views/Browse.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search.vue'),
  },
  {
    path: '/:type/:id',
    component: () => import('../views/Album.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
