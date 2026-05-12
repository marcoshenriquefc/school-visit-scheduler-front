import { defineStore } from 'pinia'
import type { AuthUser, LoginPayload, LoginResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>('handle_token', { default: () => null })
  const user = ref<AuthUser | null>(null)
  const token = computed(() => tokenCookie.value)

  const setSession = (payload: LoginResponse) => {
    tokenCookie.value = payload.token
    user.value = payload.user
  }

  const clearSession = () => {
    tokenCookie.value = null
    user.value = null
  }

  const login = async (payload: LoginPayload) => {
    const authService = useAuthService()
    const data = await authService.login(payload)
    setSession(data)
  }

  return { user, token, login, setSession, clearSession }
})
