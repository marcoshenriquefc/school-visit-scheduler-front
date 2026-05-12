<script setup lang="ts">
const uiStore = useUiStore()
const isOffline = ref(false)

onMounted(() => {
  isOffline.value = !navigator.onLine
  window.addEventListener('online', () => (isOffline.value = false))
  window.addEventListener('offline', () => (isOffline.value = true))
})
</script>

<template>
  <div>
    <div v-if="isOffline" class="bg-amber-100 px-4 py-2 text-center text-sm text-amber-800">Connection unstable. Some actions may not be available.</div>
    <div v-if="uiStore.isGlobalLoading" class="fixed inset-0 z-[100] grid place-items-center bg-white/70"><BaseLoading /></div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BaseToast />
  </div>
</template>
