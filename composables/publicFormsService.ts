export const usePublicFormsService = () => {
  const api = useApi()
  return {
    getForm: (slug: string) => api.request(`/public/forms/${slug}`),
    getUnits: (slug: string) => api.request(`/public/forms/${slug}/units`),
    getGrades: (slug: string) => api.request(`/public/forms/${slug}/grades`),
    getFields: (slug: string) => api.request(`/public/forms/${slug}/fields`)
  }
}
