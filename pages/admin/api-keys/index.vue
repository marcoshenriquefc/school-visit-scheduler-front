<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { can } = usePermissions()
if (!can('manageApiKeys')) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
</script>
<template><div class="space-y-4"><h2 class="text-2xl font-semibold">API Keys</h2><BaseCard>Gestão de API keys disponível para ADMIN.</BaseCard></div></template>
