export const useDashboardService = () => {
  const api = useApi()
  return { getMetrics: () => api.request('/admin/dashboard', { auth: true }) }
}
