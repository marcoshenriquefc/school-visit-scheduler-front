export type UserRole = 'ADMIN' | 'MARKETING' | 'COMMERCIAL' | 'OPERATIONAL'

export interface AuthUser {
  userId: string
  email: string
  role: UserRole
  name?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
}

export interface MeResponse {
  user: {
    userId: string
    role: UserRole
    email: string
  }
}
