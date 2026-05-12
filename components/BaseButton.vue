<script setup lang="ts">
interface Props { label?: string; variant?: 'primary'|'secondary'|'success'|'danger'; loading?: boolean; disabled?: boolean; type?: 'button'|'submit'|'reset' }
const props = withDefaults(defineProps<Props>(), { variant: 'primary', type: 'button', loading: false, disabled: false })
const classes = computed(() => ({ primary:'bg-blue-600 text-white', secondary:'bg-slate-200 text-slate-900', success:'bg-emerald-600 text-white', danger:'bg-rose-600 text-white' }[props.variant]))
</script>
<template><button :type="type" :disabled="disabled || loading" class="rounded px-4 py-2 text-sm font-medium disabled:opacity-60" :class="classes"><span v-if="loading">Loading...</span><span v-else><slot>{{ label }}</slot></span></button></template>
