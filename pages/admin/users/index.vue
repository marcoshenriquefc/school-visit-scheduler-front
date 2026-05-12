<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const authStore = useAuthStore()
if (authStore.user?.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
const service = useUsersService()
const users = ref<any[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const confirmDeactivateId = ref<string | null>(null)

const load = async () => {
  isLoading.value = true
  try { users.value = await service.list() } catch (e) { errorMessage.value = getFriendlyErrorMessage(e) } finally { isLoading.value = false }
}
const toggleActive = async (user: any) => {
  if (user.isActive) { confirmDeactivateId.value = user.id; return }
  await service.activate(user.id); await load()
}
const confirmDeactivate = async () => {
  if (!confirmDeactivateId.value) return
  await service.deactivate(confirmDeactivateId.value)
  confirmDeactivateId.value = null
  await load()
}
onMounted(load)
</script>
<template><div class="space-y-4"><div class="flex items-center justify-between"><h2 class="text-2xl font-semibold">Usuários</h2><NuxtLink to="/admin/users/create"><BaseButton label="Novo usuário"/></NuxtLink></div><BaseAlert v-if="errorMessage" type="error" :message="errorMessage"/><div v-else-if="isLoading" class="flex items-center gap-2"><BaseLoading/> Loading users...</div><BaseTable v-else-if="users.length"><thead><tr><th class="p-2">Nome</th><th>Email</th><th>Perfil</th><th>Status</th><th>Ações</th></tr></thead><tbody><tr v-for="user in users" :key="user.id" class="border-b"><td class="p-2">{{user.name}}</td><td>{{user.email}}</td><td>{{user.role}}</td><td><BaseBadge :variant="user.isActive ? 'success':'danger'">{{ user.isActive ? 'Ativo':'Inativo' }}</BaseBadge></td><td class="space-x-2"><NuxtLink :to="`/admin/users/${user.id}/edit`"><BaseButton variant="secondary" label="Editar"/></NuxtLink><BaseButton :variant="user.isActive ? 'danger':'success'" :label="user.isActive ? 'Desativar':'Ativar'" @click="toggleActive(user)"/></td></tr></tbody></BaseTable><EmptyState v-else title="Sem usuários" description="Nenhum usuário encontrado."/><ConfirmDialog :open="Boolean(confirmDeactivateId)" title="Desativar usuário" description="Deseja realmente desativar este usuário?" @cancel="confirmDeactivateId = null" @confirm="confirmDeactivate"/></div></template>
