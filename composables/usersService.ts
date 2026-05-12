import { z } from 'zod'
import type { UserRole } from '~/types/auth'

export interface UserItem {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8).optional(),
  role: z.enum(['ADMIN', 'MARKETING', 'OPERATIONAL', 'COMMERCIAL'])
})

export const useUsersService = () => {
  const api = useApi()
  return {
    list: () => api.request<UserItem[]>('/admin/users', { auth: true }),
    getById: (id: string) => api.request<UserItem>(`/admin/users/${id}`, { auth: true }),
    create: (payload: { name: string; email: string; password: string; role: UserRole }) => api.request<UserItem>('/admin/users', { method: 'POST', auth: true, body: payload }),
    update: (id: string, payload: { name?: string; role?: UserRole; password?: string }) => api.request<UserItem>(`/admin/users/${id}`, { method: 'PUT', auth: true, body: payload }),
    deactivate: (id: string) => api.request(`/admin/users/${id}/deactivate`, { method: 'PATCH', auth: true }),
    activate: (id: string) => api.request(`/admin/users/${id}/activate`, { method: 'PATCH', auth: true })
  }
}
