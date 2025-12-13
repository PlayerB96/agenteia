import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import { useAuth } from '../utils/useAuth'

// Views
import Login from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import CompanyDashboard from '../views/CompanyDashboard.vue'

import Callback from '../views/Callback.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'saas_owner' }
  },
  {
    path: '/company',
    name: 'CompanyDashboard',
    component: CompanyDashboard,
    meta: { requiresAuth: true, role: 'company_admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Custom navigation guard that combines Auth0 guard with Role checking
router.beforeEach(async (to, from, next) => {
  // 1. Check if route requires auth
  if (to.meta.requiresAuth) {
    // We need to use the authGuard from SDK to ensure user is loaded
    // But authGuard is a route guard function itself.
    // A simpler approach is to check our composable, but we need to wait for loading.
    
    const { isAuthenticated, isLoading, hasRole, login } = useAuth()
    
    // Wait for Auth0 to load
    // In a real app we might show a loading spinner
    // For simplicity we'll just proceed if loaded, or rely on Auth0's guard if we used it directly
    
    // Let's use the official authGuard for the authentication part
    const authResult = await authGuard(to)
    
    if (!authResult) {
      return next('/login')
    }
    
    // 2. Check Role
    if (to.meta.role) {
      // We need to wait for user to be populated to check role
      // The authGuard ensures isAuthenticated is true, so user should be there
      if (!hasRole(to.meta.role)) {
        alert(`Acceso denegado. Se requiere rol: ${to.meta.role}`)
        return next('/login')
      }
    }
  }
  
  next()
})

export default router
