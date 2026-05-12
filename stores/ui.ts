import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const isGlobalLoading = ref(false)
  const toastMessage = ref('')
  const toastType = ref<'success' | 'error' | 'info'>('info')

  const setLoading = (value: boolean) => {
    isGlobalLoading.value = value
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toastMessage.value = message
    toastType.value = type
  }

  return { isGlobalLoading, toastMessage, toastType, setLoading, showToast }
})
