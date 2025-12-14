import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import { useAuth } from '../utils/useAuth'

// Views
import Login from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import CompanyDashboard from '../views/CompanyDashboard.vue'

import Callback from '../views/Callback.vue'
import Onboarding from '../views/Onboarding.vue'

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
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    meta: { requiresAuth: true, role: 'new_user' }
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
    
    const { isAuthenticated, isLoading, hasRole, login, userRole } = useAuth()
    
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
      console.log('Router Guard Check:', {
        path: to.path,
        requiredRole: to.meta.role,
        actualRole: userRole.value
      })
      
      // If user is new_user, ALWAYS redirect to onboarding (unless they are already going there)
      if (userRole.value === 'new_user' && to.path !== '/onboarding') {
          return next('/onboarding')
      }

      // If user tries to go to onboarding but is NOT a new_user, redirect to their dashboard
      if (to.path === '/onboarding' && userRole.value !== 'new_user') {
          if (userRole.value === 'saas_owner') return next('/admin')
          if (userRole.value === 'company_admin') return next('/company')
      }
      
      if (!hasRole(to.meta.role)) {
        // Instead of alerting, just redirect based on their actual role to avoid getting stuck
        if (userRole.value === 'saas_owner') return next('/admin')
        if (userRole.value === 'company_admin') return next('/company')
        if (userRole.value === 'new_user') return next('/onboarding')
        
        // Fallback
        return next('/login')
      }
    }
  }
  
  next()
})

export default router
