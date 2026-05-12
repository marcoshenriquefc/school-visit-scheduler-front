<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const currentPage = ref(1)
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">UI Reference</h2>
    <BaseCard class="space-y-3">
      <BaseButton label="Primary" />
      <BaseInput model-value="" label="Input" />
      <BaseSelect model-value="a" :options="[{ label: 'Option A', value: 'a' }]" />
      <BaseTextarea model-value="" label="Textarea" />
      <BaseCheckbox :model-value="false" label="Checkbox" />
      <BaseBadge>Badge</BaseBadge>
      <div class="flex gap-2">
        <FormStatusBadge status="DRAFT" />
        <FormStatusBadge status="ACTIVE" />
        <FormStatusBadge status="PAUSED" />
        <FormStatusBadge status="CLOSED" />
      </div>
      <BaseAlert message="Informational alert" />
      <BaseLoading />
      <EmptyState title="No records" description="There is no data available." />
      <BasePagination :page="currentPage" :total-pages="10" @update:page="currentPage = $event" />
    </BaseCard>
  </div>
</template>
