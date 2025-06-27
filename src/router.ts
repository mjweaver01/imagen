import { createRouter, createWebHistory } from 'vue-router'
import Home from './routes/Home.vue'
import Login from './routes/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem('imagen_authenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next('/login')
  } else if (to.name === 'Login' && isAuthenticated) {
    // Redirect to home if user is already authenticated and trying to access login
    next('/')
  } else {
    next()
  }
})

export default router
