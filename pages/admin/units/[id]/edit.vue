<script setup lang="ts">
import { z } from 'zod'
definePageMeta({ layout: 'admin' })
const authStore = useAuthStore()
if (!['ADMIN','MARKETING','COMMERCIAL'].includes(authStore.user?.role || '')) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
const route = useRoute(); const unitsService = useUnitsService(); const isLoading = ref(false); const errors = reactive<Record<string,string>>({})
const form = reactive({ name:'', identifier:'', address:'', defaultCapacityPerHour:1, color:'#3366FF', isActive:true })
const schema = z.object({ name:z.string().min(2), identifier:z.string().min(1), address:z.string().min(2), defaultCapacityPerHour:z.coerce.number().int().positive(), color:z.string().regex(/^#([A-Fa-f0-9]{6})$/), isActive:z.boolean() })
onMounted(async()=>{ const data=await unitsService.getById(String(route.params.id)); Object.assign(form,data) })
const submit = async () => { Object.keys(errors).forEach((k)=>delete errors[k]); const parsed=schema.safeParse(form); if(!parsed.success){ parsed.error.issues.forEach(i=>errors[i.path[0] as string]=i.message); return } isLoading.value=true; try{ await unitsService.update(String(route.params.id), parsed.data); await navigateTo('/admin/units') } catch(e){ errors.form=getFriendlyErrorMessage(e)} finally{ isLoading.value=false } }
</script>
<template><div class="space-y-4"><h2 class="text-2xl font-semibold">Editar unidade</h2><BaseCard><div class="grid gap-3 md:grid-cols-2"><BaseInput v-model="form.name" label="Nome" :error="errors.name"/><BaseInput v-model="form.identifier" label="Identificador" :error="errors.identifier"/><BaseInput v-model="form.address" label="Endereço" :error="errors.address" class="md:col-span-2"/><BaseInput v-model="form.defaultCapacityPerHour" label="Capacidade padrão por horário" type="number" :error="errors.defaultCapacityPerHour"/><BaseInput v-model="form.color" label="Cor da unidade" :error="errors.color"/><BaseCheckbox v-model="form.isActive" label="Ativa"/></div><BaseAlert v-if="errors.form" type="error" :message="errors.form" class="mt-3"/><div class="mt-4"><BaseButton :loading="isLoading" label="Salvar alterações" @click="submit"/></div></BaseCard></div></template>
