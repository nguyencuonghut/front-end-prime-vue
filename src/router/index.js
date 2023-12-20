import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';
import AppLayout from '@/layout/AppLayout.vue';
import AuthLayout from '@/layout/AuthLayout.vue';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
            path: '/',
            name: 'Dashboard',
            component: () => import('@/views/HomeView.vue')
        },
        {
            path: '/users',
            name: 'Users',
            component: () => import('@/views/UsersView.vue')
        },
      ]
    },
    {
      path: "/auth",
      redirect: "/login",
      name: "Auth",
      component: AuthLayout,
      meta: {isGuest: true},
      children: [
        {
          path: "/login",
          name: "Login",
          component: LoginView,
        },
      ],
    },
  ]
})

router.beforeEach((to, from, next) => {
  const store = useAuthStore();
  if (to.meta.requiresAuth && !store.user.token) {
    next({ name: "Login" });
  } else if (store.user.token && to.meta.isGuest) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});
export default router
