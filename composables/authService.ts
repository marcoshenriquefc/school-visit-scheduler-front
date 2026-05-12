import { z } from 'zod'
import type { LoginPayload, LoginResponse } from '~/types/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const useAuthService = () => {
  const api = useApi()

  const login = async (payload: LoginPayload) => {
    loginSchema.parse(payload)
    return api.request<LoginResponse>('/auth/login', { method: 'POST', body: payload })
  }

  return { login }
}
