import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/LandingPage.vue'),
  },
  {
    path: '/browse',
    name: 'browse',
    component: () => import('../views/BrowsePage.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchPage.vue'),
  },
  {
    path: '/:type/:id',
    component: () => import('../views/AlbumPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
