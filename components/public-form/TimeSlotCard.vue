<script setup lang="ts">
    defineProps<{
        selected: boolean;
        time: string;
        capacity: number
    }>();
</script>
<template>
    <button
        class="w-full rounded border p-3 text-left"
        :class="selected ? 'border-blue-500 bg-blue-50' : 'border-slate-300'"
    >
        <p class="font-medium">{{ time }}</p>
        <p class="text-sm text-slate-500">{{ capacity }} vagas</p>
    </button>
</template>
