export const useGradesService = () => {
  const api = useApi()
  return { list: () => api.request('/admin/grades', { auth: true }) }
}
