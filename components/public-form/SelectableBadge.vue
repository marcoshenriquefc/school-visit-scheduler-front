<script setup lang="ts">
withDefaults(
    defineProps<{
        selected: boolean
        color?: string
        isUnit?: boolean
    }>(),
    {
        isUnit: false
    }
)
</script>
<template>
    <button
        class="rounded-full border px-4 py-2 text-sm"
        :style="selected && color ? `border-color:${color};background:${color}22; ` : ''"
        :class="selected ? 'border-blue-500 bg-blue-50' : 'border-slate-300'"
    >
        <div v-if="isUnit" class="icon-area" :style="`background:${color}10`">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 w-4 h-4" style="color: rgb(124, 58, 237)">
                <path :style="`stroke:${color};`" d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path :style="`stroke:${color};`" d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <path :style="`stroke:${color};`" d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                <path :style="`stroke:${color};`" d="M10 6h4"></path>
                <path :style="`stroke:${color};`" d="M10 10h4"></path>
                <path :style="`stroke:${color};`" d="M10 14h4"></path>
                <path :style="`stroke:${color};`" d="M10 18h4"></path>
            </svg>
        </div>

        <slot />
    </button>
</template>

<style lang="scss" scoped>
    .icon-area{
        display: flex;
        justify-content: center;
        align-items: center;

        padding: 4px;
        border-radius: 4px;

        svg {
            height: 24px;
            width: 24px;
        }
    }
</style>