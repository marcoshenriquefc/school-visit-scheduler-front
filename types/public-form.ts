export type PublicFormStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'DRAFT'
export type PublicFieldType = 'TEXT' | 'EMAIL' | 'PHONE' | 'SELECT' | 'CHECKBOX' | 'RADIO' | 'TEXTAREA' | 'DATE' | 'HIDDEN'

export interface PublicFormSlot { id: string; date: string; startTime: string; endTime: string; capacity: number; isBlocked: boolean; blockReason?: string }
export interface PublicFormUnit { idUnit: string; name: string; identifier: string; address: string; color?: string; isActive: boolean; slots: PublicFormSlot[] }
export interface PublicFormGrade { gradeId: string; name: string; identifier: string; isActive: boolean }
export interface PublicFormField { id: string; label: string; name: string; type: PublicFieldType; placeholder?: string; isRequired: boolean; options?: string[]; order: number; isActive: boolean }
export interface PublicForm { id: string; campaignIdentifier: string; title: string; slug: string; finalMessage: string; lgpdText: string; startDate: string; endDate: string; status: PublicFormStatus; formUnits: PublicFormUnit[]; formGrades: PublicFormGrade[]; formFields: PublicFormField[] }
export interface SchedulePayload { formId: string; unitId: string; gradeId: string; availabilitySlotId: string; name: string; email: string; phone: string; lgpdAccepted: boolean; dynamicFields: Record<string, unknown> }
export interface ScheduleSuccessResponse { id?: string; cancelToken?: string }
