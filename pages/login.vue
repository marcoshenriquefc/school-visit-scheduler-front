<script setup lang="ts">
definePageMeta({ layout: 'default' })

const authStore = useAuthStore()
const authService = useAuthService()
const form = reactive({ email: '', password: '' })
const fieldErrors = reactive<{ email?: string; password?: string }>({})
const errorMessage = ref('')

const submitLogin = async () => {
  errorMessage.value = ''
  fieldErrors.email = ''
  fieldErrors.password = ''

  const parsed = authService.loginSchema.safeParse(form)
  if (!parsed.success) {
    fieldErrors.email = parsed.error.formErrors.fieldErrors.email?.[0]
    fieldErrors.password = parsed.error.formErrors.fieldErrors.password?.[0]
    return
  }

  try {
    await authStore.login(parsed.data)
    await navigateTo('/admin')
  } catch (error) {
    errorMessage.value = getFriendlyErrorMessage(error)
  }
}
</script>

<template>
  <div class="mx-auto mt-20 max-w-md px-4">
    <BaseCard>
      <h2 class="mb-4 text-xl font-semibold">Handle Admin Login</h2>
      <form class="space-y-3" @submit.prevent="submitLogin">
        <BaseInput v-model="form.email" label="Email" type="email" :error="fieldErrors.email" />
        <BaseInput v-model="form.password" label="Password" type="password" :error="fieldErrors.password" />
        <BaseAlert v-if="errorMessage" type="error" :message="errorMessage" />
        <BaseButton type="submit" class="w-full" label="Sign in" :loading="authStore.isLoading" :disabled="authStore.isLoading" />
      </form>
    </BaseCard>
  </div>
</template>
