export interface ApiErrorResponse {
  message: string
  details: unknown | null
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
}

export interface EntityBase {
  id: string
  createdAt?: string
  updatedAt?: string
}

export interface Unit extends EntityBase { name: string; identifier: string; isActive: boolean }
export interface Grade extends EntityBase { name: string; identifier: string; isActive: boolean }
export interface Form extends EntityBase { title: string; slug: string; status: string }
export interface Lead extends EntityBase { name: string; email: string; status: string }
