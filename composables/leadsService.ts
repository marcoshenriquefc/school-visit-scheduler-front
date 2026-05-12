export const useLeadsService = () => {
  const api = useApi()
  return { list: () => api.request('/admin/leads', { auth: true }) }
}
