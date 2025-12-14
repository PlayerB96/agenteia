import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import mockUsers from '../data/mockUsers.json'

export function useAuth() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0()

  // Map Auth0 user to our internal roles based on email
  const userRole = computed(() => {
    if (!user.value?.email) return null
    
    // 1. Try to get role from Auth0 Custom Claim
    // Namespace required by Auth0 for custom claims
    const auth0Role = user.value['https://agenteia.com/role']
    // console.log('Auth0 User:', user.value)
    // console.log('Detected Role:', auth0Role)
    
    if (auth0Role) return auth0Role

    // 2. Fallback: Find user in our mock DB
    // mockUsers is an array directly, not { users: [...] }
    const internalUser = mockUsers.find(u => u.email === user.value.email)
    
    // 3. Final Fallback: New User
    return internalUser ? internalUser.role : 'new_user'
  })

  const hasRole = (role) => {
    return userRole.value === role
  }

  const handleLogin = (options) => {
    loginWithRedirect(options)
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return {
    // Auth0 primitives
    isAuthenticated,
    isLoading,
    user,
    error,
    
    // Custom logic
    userRole,
    hasRole,
    login: handleLogin,
    logout: handleLogout
  }
}
