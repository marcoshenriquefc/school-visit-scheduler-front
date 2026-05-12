<script setup lang="ts">
interface Props {
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED'
}

const props = defineProps<Props>()

const badgeVariant = computed(() => {
  if (props.status === 'ACTIVE') return 'success'
  if (props.status === 'PAUSED') return 'warning'
  if (props.status === 'CLOSED') return 'danger'
  return 'neutral'
})
</script>

<template>
  <BaseBadge :variant="badgeVariant">
    {{ status }}
  </BaseBadge>
</template>
