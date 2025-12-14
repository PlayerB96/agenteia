import { computed, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import mockUsers from '../data/mockUsers.json'

// Global State (Singleton)
const manualUser = ref(null)
const manualToken = ref(null)
const manualIsLoading = ref(false)
const manualError = ref(null)

// Initialize from LocalStorage once
const token = localStorage.getItem('auth_token')
const userFromLocalStorage = localStorage.getItem('auth_user')
if (token && userFromLocalStorage) {
  manualToken.value = token
  manualUser.value = JSON.parse(userFromLocalStorage)
}

export function useAuth() {
  const { loginWithRedirect, logout: auth0Logout, user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading, error: auth0Error } = useAuth0()

  // Combined State
  const isAuthenticated = computed(() => auth0IsAuthenticated.value || !!manualToken.value)
  const isLoading = computed(() => auth0IsLoading.value || manualIsLoading.value)
  const user = computed(() => auth0User.value || manualUser.value)
  const error = computed(() => auth0Error.value || manualError.value)

  // Map Auth0 user to our internal roles based on email
  const userRole = computed(() => {
    if (!user.value?.email) return null
    
    // 1. Try to get role from Auth0 Custom Claim
    // Namespace required by Auth0 for custom claims
    const auth0Role = user.value['https://agenteia.com/role']
    console.log('Auth0 User:', user.value)
    console.log('Detected Role:', auth0Role)
    
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

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleLogout = () => {
    // Clear manual session if any
    manualUser.value = null
    manualToken.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')

    auth0Logout({ logoutParams: { returnTo: window.location.origin } })
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
