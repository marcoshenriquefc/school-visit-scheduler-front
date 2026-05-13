<script setup lang="ts">
    import type { PublicFormSlot } from "~/types/public-form";
    import SelectableBadge from "./SelectableBadge.vue";
    import TimeSlotCard from "./TimeSlotCard.vue";
    import DateCalendar from './DateCalendar.vue'

    const props = defineProps<{
        dates: string[];
        selectedDate: string | null;
        slots: PublicFormSlot[];
        selectedSlot: PublicFormSlot | null;
        formatDate: (v: string) => string;
    }>();

    defineEmits(["select-date", "select-slot"]);
</script>


<template>
    <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
            <p class="mb-2 font-medium">Escolha uma data</p>

            <DateCalendar
                :dates="dates"
                :selected-date="selectedDate"
                @select-date="$emit('select-date', $event)"
            />
        </div>
        
        <div>
            <p class="mb-2 font-medium">Horário</p>
            <div class="grid gap-2 md:grid-cols-2">
                <TimeSlotCard
                    v-for="s in slots"
                    :key="s.id"
                    :selected="selectedSlot?.id === s.id"
                    :time="`${s.startTime} — ${s.endTime}`"
                    :capacity="s.capacity"
                    @click="$emit('select-slot', s)"
                />
            </div>
        </div>
    </div>
</template>
