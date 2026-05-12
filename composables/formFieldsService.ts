export type FieldType = 'TEXT' | 'EMAIL' | 'PHONE' | 'SELECT' | 'CHECKBOX' | 'RADIO' | 'TEXTAREA' | 'DATE' | 'HIDDEN'

export interface FormField {
  id: string
  label: string
  name: string
  type: FieldType
  placeholder?: string
  isRequired: boolean
  options?: string[]
  order: number
  isActive: boolean
}

export interface FormFieldPayload {
  label: string
  name: string
  type: FieldType
  placeholder?: string
  isRequired: boolean
  options?: string[]
  order: number
}

export const useFormFieldsService = () => {
  const api = useApi()
  return {
    list: (formId: string) => api.request<FormField[]>(`/admin/forms/${formId}/fields`, { auth: true }),
    create: (formId: string, payload: FormFieldPayload) => api.request<FormField>(`/admin/forms/${formId}/fields`, { method: 'POST', auth: true, body: payload }),
    update: (formId: string, fieldId: string, payload: Partial<FormFieldPayload>) => api.request<FormField>(`/admin/forms/${formId}/fields/${fieldId}`, { method: 'PUT', auth: true, body: payload }),
    activate: (formId: string, fieldId: string) => api.request<FormField>(`/admin/forms/${formId}/fields/${fieldId}/activate`, { method: 'PATCH', auth: true }),
    deactivate: (formId: string, fieldId: string) => api.request<FormField>(`/admin/forms/${formId}/fields/${fieldId}/deactivate`, { method: 'PATCH', auth: true }),
    reorder: (formId: string, fieldOrders: Array<{ id: string; order: number }>) => api.request(`/admin/forms/${formId}/fields/reorder`, { method: 'PUT', auth: true, body: { fieldOrders } })
  }
}
