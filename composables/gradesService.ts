import type { Grade } from '~/types/api'

export interface GradesFilter { name?: string; identifier?: string; isActive?: 'true' | 'false' | '' }
export interface GradePayload { name: string; identifier: string; isActive: boolean }

export const useGradesService = () => {
  const api = useApi()
  return {
    list: (query: GradesFilter = {}) => api.request<Grade[]>('/admin/grades', { auth: true, query }),
    getById: (id: string) => api.request<Grade>(`/admin/grades/${id}`, { auth: true }),
    create: (payload: GradePayload) => api.request<Grade>('/admin/grades', { method: 'POST', auth: true, body: payload }),
    update: (id: string, payload: Partial<GradePayload>) => api.request<Grade>(`/admin/grades/${id}`, { method: 'PUT', auth: true, body: payload }),
    activate: (id: string) => api.request<Grade>(`/admin/grades/${id}/activate`, { method: 'PATCH', auth: true }),
    deactivate: (id: string) => api.request<Grade>(`/admin/grades/${id}/deactivate`, { method: 'PATCH', auth: true })
  }
}
