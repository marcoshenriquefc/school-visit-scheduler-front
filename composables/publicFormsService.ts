import type { PublicForm, SchedulePayload, ScheduleSuccessResponse } from '~/types/public-form'

export const usePublicFormsService = () => {
  const api = useApi()
  return {
    getForm: (slug: string) => api.request<PublicForm>(`/public/forms/${slug}`),
    getFormData: (slug: string) => api.request<PublicForm>(`/public/forms/${slug}/data`),
    getUnits: (slug: string) => api.request(`/public/forms/${slug}/units`),
    getGrades: (slug: string) => api.request(`/public/forms/${slug}/grades`),
    getFields: (slug: string) => api.request(`/public/forms/${slug}/fields`),
    submitSchedule: (payload: SchedulePayload) => api.request<ScheduleSuccessResponse>('/public/schedules', { method: 'POST', body: payload })
  }
}
