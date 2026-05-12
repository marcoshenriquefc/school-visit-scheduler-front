export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  await authStore.initialize()

  if (to.path === '/login' && authStore.isAuthenticated) return navigateTo('/admin')
  if (to.path.startsWith('/admin') && !authStore.isAuthenticated) return navigateTo('/login')

  if (!to.path.startsWith('/admin') || !authStore.user) return

  const { can } = usePermissions()
  const pathChecks: Array<{ match: (path: string) => boolean; permission: Parameters<typeof can>[0] }> = [
    { match: (p) => p.startsWith('/admin/users'), permission: 'manageUsers' },
    { match: (p) => p.startsWith('/admin/api-keys'), permission: 'manageApiKeys' },
    { match: (p) => p.startsWith('/admin/logs'), permission: 'viewLogs' },
    { match: (p) => p.startsWith('/admin/forms') && p.includes('/availability'), permission: 'editAvailability' },
    { match: (p) => p === '/admin' || p.startsWith('/admin/dashboard'), permission: 'viewDashboard' }
  ]

  const denied = pathChecks.find((item) => item.match(to.path) && !can(item.permission))
  if (denied) return navigateTo('/403')
})
