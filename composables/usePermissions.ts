import type { UserRole } from '~/types/auth'

type PermissionKey =
  | 'createForm'
  | 'editAvailability'
  | 'cancelSchedule'
  | 'exportLeads'
  | 'viewDashboard'
  | 'resendRubeus'
  | 'manageUsers'
  | 'manageApiKeys'
  | 'viewLogs'

const permissionMap: Record<PermissionKey, UserRole[]> = {
  createForm: ['ADMIN', 'MARKETING'],
  editAvailability: ['ADMIN', 'MARKETING', 'COMMERCIAL'],
  cancelSchedule: ['ADMIN', 'MARKETING', 'COMMERCIAL', 'OPERATIONAL'],
  exportLeads: ['ADMIN', 'MARKETING', 'COMMERCIAL'],
  viewDashboard: ['ADMIN', 'MARKETING', 'COMMERCIAL', 'OPERATIONAL'],
  resendRubeus: ['ADMIN', 'MARKETING', 'COMMERCIAL'],
  manageUsers: ['ADMIN'],
  manageApiKeys: ['ADMIN'],
  viewLogs: ['ADMIN']
}

export const usePermissions = () => {
  const authStore = useAuthStore()
  const hasRole = (...roles: UserRole[]) => !!authStore.user?.role && roles.includes(authStore.user.role)
  const can = (permission: PermissionKey) => !!authStore.user?.role && permissionMap[permission].includes(authStore.user.role)
  return { can, hasRole, permissionMap }
}
