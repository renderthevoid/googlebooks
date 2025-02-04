import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/books', 
    },
    {
      path: '/books',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/books/:id',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutPage.vue'),
    },

  ],
})

export default router
