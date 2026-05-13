export type LeadStatus = 'SCHEDULED' | 'ATTENDED' | 'NO_SHOW' | 'RESCHEDULED' | 'CANCELED'
export type RubeusStatus = | 'PENDING' | 'SENT' | 'ERROR' | 'RESENT';

export interface LeadItem {
  id: string
  name: string
  email: string
  phone: string
  formName?: string
  unitName?: string
  gradeName?: string
  date?: string
  time?: string
  status: LeadStatus
  rubeusStatus?: string
  createdAt: string
}

export interface LeadDetails extends LeadItem {
  dynamicFields?: Record<string, string>
  rubeusError?: string
  logs?: Array<{ date: string; message: string }>
  updatedAt?: string
}

export interface LeadsListResponse {
  items: LeadItem[]
  page: number
  limit: number
  total: number
}

type LeadsQuery = {
  page?: number
  limit?: number
  formId?: string
  unitId?: string
  gradeId?: string
  status?: LeadStatus | ''
  rubeusStatus?: RubeusStatus | ''
  startDate?: string
  endDate?: string
  search?: string
}


const removeEmptyQueryParams = (query: LeadsQuery) => {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => {
      return value !== undefined && value !== null && value !== ''
    })
  )
}

export const useLeadsService = () => {
  const api = useApi()
  

  return {
    list: (query: Record<string, unknown>) =>
      api.request<LeadsListResponse>( '/admin/leads', {
        auth: true,
        query: removeEmptyQueryParams(query)
      }
    ),
    getById: (id: string) => api.request<LeadDetails>(`/admin/leads/${id}`, { auth: true }),
    updateStatus: (id: string, status: LeadStatus) => api.request(`/admin/leads/${id}/status`, { method: 'PATCH', auth: true, body: { status } }),
    resendRubeus: (id: string) => api.request(`/admin/leads/${id}/rubeus/retry`, { method: 'POST', auth: true }),
    exportCsv: (query: Record<string, unknown>) => api.request<string>('/admin/leads/export/csv', { auth: true, query, responseType: 'text' as never }),
    exportPdf: (query: Record<string, unknown>) => api.request<Blob>('/admin/leads/export/pdf', { auth: true, query, responseType: 'blob' as never })
  }
}
