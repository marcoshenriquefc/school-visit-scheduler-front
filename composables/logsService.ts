export interface AdminLog {
  id: string
  dateTime: string
  entity: string
  action: string
  user: string
  origin: string
  summary: string
  details: string
}

export const useLogsService = () => {
  const api = useApi()
  return {
    list: (query: Record<string, string>) => api.request<AdminLog[]>('/admin/logs', { auth: true, query })
  }
}
