import { z } from 'zod'
import type { LoginPayload, LoginResponse, MeResponse } from '~/types/auth'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must have at least 8 characters.')
})

export const useAuthService = () => {
  const api = useApi()

  const login = async (payload: LoginPayload) => {
    loginSchema.parse(payload)
    return api.request<LoginResponse>('/auth/login', { method: 'POST', body: payload })
  }

  const me = async () => api.request<MeResponse>('/auth/me', { auth: true })

  return { login, me, loginSchema }
}
