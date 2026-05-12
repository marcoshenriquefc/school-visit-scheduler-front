<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const authStore = useAuthStore()
const unitsService = useUnitsService()
const canManage = computed(() => ['ADMIN', 'MARKETING', 'COMMERCIAL'].includes(authStore.user?.role || ''))

const filters = reactive({ name: '', identifier: '', isActive: '' as ''|'true'|'false' })
const units = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const confirmId = ref<string | null>(null)

const loadUnits = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try { units.value = await unitsService.list(filters) } catch (error) { errorMessage.value = getFriendlyErrorMessage(error) } finally { isLoading.value = false }
}

const toggleStatus = async (id: string, isActive: boolean) => {
  if (!canManage.value) return
  if (isActive) {
    confirmId.value = id
    return
  }
  await unitsService.activate(id)
  await loadUnits()
}

const confirmDeactivate = async () => {
  if (!confirmId.value) return
  await unitsService.deactivate(confirmId.value)
  confirmId.value = null
  await loadUnits()
}

onMounted(loadUnits)
</script>
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between"><h2 class="text-2xl font-semibold">Unidades</h2><NuxtLink v-if="canManage" to="/admin/units/create"><BaseButton label="Nova unidade" /></NuxtLink></div>
    <BaseCard><div class="grid gap-3 md:grid-cols-4"><BaseInput v-model="filters.name" label="Nome"/><BaseInput v-model="filters.identifier" label="Identificador"/><BaseSelect v-model="filters.isActive" label="Status" :options="[{label:'Todos',value:''},{label:'Ativo',value:'true'},{label:'Inativo',value:'false'}]"/><div class="flex items-end"><BaseButton :loading="isLoading" label="Filtrar" @click="loadUnits"/></div></div></BaseCard>
    <BaseAlert v-if="errorMessage" type="error" :message="errorMessage"/>
    <div v-else-if="isLoading" class="flex items-center gap-2"><BaseLoading/> Loading units...</div>
    <BaseTable v-else-if="units.length"><thead><tr class="border-b bg-slate-50 text-left"><th class="p-2">Nome</th><th class="p-2">Identificador</th><th class="p-2">Capacidade</th><th class="p-2">Status</th><th class="p-2">Ações</th></tr></thead><tbody><tr v-for="unit in units" :key="unit.id" class="border-b"><td class="p-2">{{ unit.name }}</td><td class="p-2">{{ unit.identifier }}</td><td class="p-2">{{ unit.defaultCapacityPerHour }}</td><td class="p-2"><BaseBadge :variant="unit.isActive ? 'success':'danger'">{{ unit.isActive ? 'Ativo' : 'Inativo' }}</BaseBadge></td><td class="p-2 space-x-2"><NuxtLink :to="`/admin/units/${unit.id}/edit`"><BaseButton v-if="canManage" variant="secondary" label="Editar"/></NuxtLink><BaseButton v-if="canManage" :variant="unit.isActive ? 'danger':'success'" :label="unit.isActive ? 'Desativar':'Ativar'" @click="toggleStatus(unit.id, unit.isActive)"/></td></tr></tbody></BaseTable>
    <EmptyState v-else title="Sem unidades" description="Nenhuma unidade encontrada."/>
    <ConfirmDialog :open="Boolean(confirmId)" title="Desativar unidade" description="Deseja realmente desativar esta unidade?" @cancel="confirmId = null" @confirm="confirmDeactivate"/>
  </div>
</template>
