export const useFormsService = () => {
  const api = useApi()
  return { list: () => api.request('/admin/forms', { auth: true }) }
}
