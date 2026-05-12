import type { NitroFetchOptions } from 'nitropack'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const uiStore = useUiStore()

  const request = async <T>(url: string, options: NitroFetchOptions<string> & { auth?: boolean; showGlobalLoading?: boolean } = {}): Promise<T> => {
    const { auth = false, showGlobalLoading = false, headers, ...rest } = options

    try {
      if (showGlobalLoading) uiStore.setLoading(true)
      return await $fetch<T>(url, {
        baseURL: config.public.apiBaseUrl,
        ...rest,
        headers: {
          ...headers,
          ...(auth && authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {})
        },
        onResponseError({ response }) {
          if (response.status === 401) {
            authStore.logout()
            navigateTo('/login')
          }
        }
      })
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error))
    } finally {
      if (showGlobalLoading) uiStore.setLoading(false)
    }
  }

  return { request }
}
