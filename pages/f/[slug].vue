<script setup lang="ts">
definePageMeta({ layout: 'public-form' })
const route = useRoute()
const service = usePublicFormsService()
const formData = ref<unknown>(null)
onMounted(async () => { formData.value = await service.getForm(String(route.params.slug)) })
</script>
<template><div class="space-y-4"><h2 class="text-2xl font-semibold">Public Form</h2><BaseCard><pre class="text-xs">{{ formData }}</pre></BaseCard></div></template>
