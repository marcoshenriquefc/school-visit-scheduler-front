<script setup lang="ts">
import { z } from 'zod'
definePageMeta({ layout: 'admin' })
const authStore = useAuthStore()
if (!['ADMIN','MARKETING','COMMERCIAL'].includes(authStore.user?.role || '')) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
const unitsService = useUnitsService()
const form = reactive({ name:'', identifier:'', address:'', defaultCapacityPerHour:1, color:'#3366FF', isActive:true })
const errors = reactive<Record<string,string>>({})
const isLoading = ref(false)
const schema = z.object({ name:z.string().min(2), identifier:z.string().min(1), address:z.string().min(2), defaultCapacityPerHour:z.number().int().positive(), color:z.string().regex(/^#([A-Fa-f0-9]{6})$/), isActive:z.boolean() })
const submit = async () => { Object.keys(errors).forEach((k)=>delete errors[k]); const parsed=schema.safeParse(form); if(!parsed.success){ parsed.error.issues.forEach(i=>errors[i.path[0] as string]=i.message); return } isLoading.value=true; try{ await unitsService.create(parsed.data); await navigateTo('/admin/units') } catch(e){ errors.form=getFriendlyErrorMessage(e)} finally{ isLoading.value=false } }
</script>
<template><div class="space-y-4"><h2 class="text-2xl font-semibold">Criar unidade</h2><BaseCard><div class="grid gap-3 md:grid-cols-2"><BaseInput v-model="form.name" label="Nome" :error="errors.name"/><BaseInput v-model="form.identifier" label="Identificador" :error="errors.identifier"/><BaseInput v-model="form.address" label="Endereço" :error="errors.address" class="md:col-span-2"/><BaseInput v-model="form.defaultCapacityPerHour" label="Capacidade padrão por horário" type="number" :error="errors.defaultCapacityPerHour"/><BaseInput v-model="form.color" label="Cor da unidade" placeholder="#3366FF" :error="errors.color"/><BaseCheckbox v-model="form.isActive" label="Ativa"/></div><BaseAlert v-if="errors.form" type="error" :message="errors.form" class="mt-3"/><div class="mt-4"><BaseButton :loading="isLoading" label="Salvar" @click="submit"/></div></BaseCard></div></template>
