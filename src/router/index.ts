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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutPage.vue'),
    },
    {
      path: '/books/:id',
      component: () => import('../views/HomePage.vue'),
      props: true,
    },
  ],
})

export default router
