<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const formId = ref('')
</script>
<template><div class="space-y-4"><h2 class="text-2xl font-semibold">Disponibilidade</h2><BaseCard><BaseInput v-model="formId" label="Form ID" placeholder="Informe o formulário"/><NuxtLink v-if="formId" :to="`/admin/forms/${formId}/availability`"><BaseButton label="Abrir disponibilidade do formulário" class="mt-3"/></NuxtLink></BaseCard></div></template>
