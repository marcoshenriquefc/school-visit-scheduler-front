export const useUsersService = () => {
  const api = useApi()
  return { list: () => api.request('/admin/users', { auth: true }) }
}
