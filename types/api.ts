export interface ApiErrorResponse {
  message: string
  details: unknown | null
}

export interface DashboardMetrics {
  totals: { leads: number; scheduled: number; attended: number; noShow: number; canceled: number }
  leadsByUnit: Array<{ label: string; value: number }>
  leadsByGrade: Array<{ label: string; value: number }>
  schedulesByDate: Array<{ label: string; value: number }>
  schedulesByHour: Array<{ label: string; value: number }>
  rubeusStatus: Array<{ label: string; value: number }>
  topHours: Array<{ label: string; value: number }>
}

export interface Unit {
  id: string
  name: string
  identifier: string
  address: string
  defaultCapacityPerHour: number
  color: string
  isActive: boolean
}

export interface Grade {
  id: string
  name: string
  identifier: string
  isActive: boolean
}
