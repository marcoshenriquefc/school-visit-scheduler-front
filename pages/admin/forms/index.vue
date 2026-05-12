<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { can } = usePermissions()
if (!can('createForm') && !can('viewDashboard')) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
</script>
<template><div class="space-y-4"><h2 class="text-2xl font-semibold">Formulários</h2><BaseCard>Listagem de formulários em evolução.</BaseCard><NuxtLink v-if="can('createForm')" to="/admin/forms/create"><BaseButton label="Novo formulário"/></NuxtLink></div></template>
