export const useAvailabilityService = () => {
  const api = useApi()
  return { listByForm: (formId: string) => api.request(`/admin/forms/${formId}/availability`, { auth: true }) }
}
