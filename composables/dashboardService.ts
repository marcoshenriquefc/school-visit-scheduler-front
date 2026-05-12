import type { DashboardMetrics } from '~/types/api'

export interface DashboardFilters {
  formId?: string
  unitId?: string
  gradeId?: string
  startDate?: string
  endDate?: string
}

export const useDashboardService = () => {
  const api = useApi()
  return {
    getMetrics: (params: DashboardFilters) => api.request<DashboardMetrics>('/admin/dashboard', { auth: true, query: params })
  }
}
