import type { Unit } from '~/types/api'

export interface UnitsFilter { name?: string; identifier?: string; isActive?: 'true' | 'false' | '' }
export interface UnitPayload {
  name: string
  identifier: string
  address: string
  defaultCapacityPerHour: number
  color: string
  isActive: boolean
}

export const useUnitsService = () => {
  const api = useApi()
  return {
    list: (query: UnitsFilter = {}) => api.request<Unit[]>('/admin/units', { auth: true, query }),
    getById: (id: string) => api.request<Unit>(`/admin/units/${id}`, { auth: true }),
    create: (payload: UnitPayload) => api.request<Unit>('/admin/units', { method: 'POST', auth: true, body: payload }),
    update: (id: string, payload: Partial<UnitPayload>) => api.request<Unit>(`/admin/units/${id}`, { method: 'PUT', auth: true, body: payload }),
    activate: (id: string) => api.request<Unit>(`/admin/units/${id}/activate`, { method: 'PATCH', auth: true }),
    deactivate: (id: string) => api.request<Unit>(`/admin/units/${id}/deactivate`, { method: 'PATCH', auth: true })
  }
}
