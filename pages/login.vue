<script setup lang="ts">
definePageMeta({ layout: 'default' })
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()

const submitLogin = async () => {
  try {
    errorMessage.value = ''
    await authStore.login({ email: email.value, password: password.value })
    await navigateTo('/admin')
  } catch (error) {
    errorMessage.value = getFriendlyErrorMessage(error)
  }
}
</script>
<template><div class="mx-auto mt-20 max-w-md"><BaseCard><h2 class="mb-4 text-xl font-semibold">Login</h2><form class="space-y-3" @submit.prevent="submitLogin"><BaseInput v-model="email" label="Email" type="email"/><BaseInput v-model="password" label="Password" type="password"/><BaseAlert v-if="errorMessage" type="error" :message="errorMessage"/><BaseButton type="submit" label="Sign in" class="w-full"/></form></BaseCard></div></template>
