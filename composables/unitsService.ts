export const useUnitsService = () => {
  const api = useApi()
  return { list: () => api.request('/admin/units', { auth: true }) }
}
