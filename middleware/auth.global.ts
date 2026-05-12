export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  if (to.path.startsWith('/admin') && !authStore.token) {
    return navigateTo('/login')
  }
})
