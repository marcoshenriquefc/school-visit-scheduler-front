<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()
const isAdmin = computed(() => useRoute().path.startsWith('/admin'))
</script>
<template><div class="mx-auto mt-20 max-w-xl rounded bg-white p-6 text-center shadow"><h1 class="text-3xl font-semibold">{{ props.error?.statusCode || 500 }}</h1><p class="mt-2">Ocorreu um problema. Tente novamente em instantes.</p><NuxtLink v-if="isAdmin" to="/admin" class="mt-4 inline-block text-blue-600">Voltar ao dashboard</NuxtLink><NuxtLink v-else to="/" class="mt-4 inline-block text-blue-600">Voltar ao início</NuxtLink></div></template>
