export type UserRole = 'ADMIN' | 'MARKETING' | 'COMMERCIAL' | 'OPERATIONAL'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}
