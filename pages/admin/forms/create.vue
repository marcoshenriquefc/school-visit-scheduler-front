<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { can } = usePermissions()
if (!can('createForm')) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
</script>
<template><div class="space-y-4"><h2 class="text-2xl font-semibold">Criar formulário</h2><BaseCard>Formulário de criação será implementado em módulo dedicado.</BaseCard></div></template>
