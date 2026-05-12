export interface Slot {
  id: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  occupied?: number
  isBlocked: boolean
  blockReason?: string
}

export const useAvailabilityService = () => {
  const api = useApi()
  return {
    generate: (formId: string, payload: unknown) => api.request(`/admin/forms/${formId}/availability/generate`, { method: 'POST', auth: true, body: payload }),
    createManual: (formId: string, payload: unknown) => api.request(`/admin/forms/${formId}/availability`, { method: 'POST', auth: true, body: payload }),
    listByForm: (formId: string, query: Record<string, unknown> = {}) => api.request<Slot[]>(`/admin/forms/${formId}/availability`, { auth: true, query }),
    block: (slotId: string, blockReason: string) => api.request(`/admin/availability/${slotId}/block`, { method: 'PATCH', auth: true, body: { blockReason } }),
    unblock: (slotId: string) => api.request(`/admin/availability/${slotId}/unblock`, { method: 'PATCH', auth: true }),
    update: (slotId: string, payload: unknown) => api.request(`/admin/availability/${slotId}`, { method: 'PUT', auth: true, body: payload })
  }
}
