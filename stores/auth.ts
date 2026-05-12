import { defineStore } from 'pinia'
import type { AuthUser, LoginPayload } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>('handle_token', { default: () => null })
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  const token = computed(() => tokenCookie.value)
  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const setToken = (value: string | null) => {
    tokenCookie.value = value
  }

  const setUser = (value: AuthUser | null) => {
    user.value = value ? { userId: value.userId, email: value.email, role: value.role, name: value.name } : null
  }

  const login = async (payload: LoginPayload) => {
    isLoading.value = true
    try {
      const authService = useAuthService()
      const response = await authService.login(payload)
      setToken(response.token)
      setUser({ userId: response.user.id, email: response.user.email, role: response.user.role, name: response.user.name })
      await fetchMe()
    } finally {
      isLoading.value = false
    }
  }

  const fetchMe = async () => {
    if (!token.value) return
    try {
      const authService = useAuthService()
      const response = await authService.me()
      setUser({ userId: response.user.userId, email: response.user.email, role: response.user.role })
    } catch {
      logout()
      throw new Error('Your session has expired. Please sign in again.')
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const initialize = async () => {
    if (isInitialized.value) return
    if (token.value) {
      try { await fetchMe() } catch {}
    }
    isInitialized.value = true
  }

  return { user, token, isLoading, isAuthenticated, isInitialized, login, fetchMe, logout, initialize }
})
