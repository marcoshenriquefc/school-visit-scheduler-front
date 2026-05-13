<script setup lang="ts">
interface CalendarDay {
    key: string
    day: number
    isCurrentMonth: boolean
    isAvailable: boolean
    isSelected: boolean
}

const props = defineProps<{
    dates: string[]
    selectedDate: string | null
}>()
const emit = defineEmits<{ 'select-date': [date: string] }>()


const today = new Date()
const availableDateSet = computed(() => new Set(props.dates))
const initialDate = computed(() => {
    if (props.selectedDate) return new Date(`${props.selectedDate}T12:00:00`)
    if (props.dates.length) {
        return new Date(`${props.dates[0]}T12:00:00`)
    }

    return today
})
const currentYear = ref(initialDate.value.getFullYear())
const currentMonth = ref(initialDate.value.getMonth())
const monthLabel = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    })
})
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const toDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const calendarDays = computed<CalendarDay[]>(() => {
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
    const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)

    const startDay = firstDayOfMonth.getDay()
    const totalDays = lastDayOfMonth.getDate()

    const days: CalendarDay[] = []

    for (let i = 0; i < startDay; i++) {
        const date = new Date(currentYear.value, currentMonth.value, i - startDay + 1)
        const key = toDateKey(date)

        days.push({
            key,
            day: date.getDate(),
            isCurrentMonth: false,
            isAvailable: false,
            isSelected: props.selectedDate === key
        })
    }

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentYear.value, currentMonth.value, day)
        const key = toDateKey(date)

        days.push({
            key,
            day,
            isCurrentMonth: true,
            isAvailable: availableDateSet.value.has(key),
            isSelected: props.selectedDate === key
        })
    }

    const remainingDays = 42 - days.length

    for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(currentYear.value, currentMonth.value + 1, day)
        const key = toDateKey(date)

        days.push({
            key,
            day: date.getDate(),
            isCurrentMonth: false,
            isAvailable: false,
            isSelected: props.selectedDate === key
        })
    }

    return days
})

const previousMonth = () => {
    if (!canGoPreviousMonth.value) return

    const previousAvailableMonth = [...availableMonths.value]
        .reverse()
        .find((month) => month < currentMonthKey.value)

    if (!previousAvailableMonth) return

    const [year, month] = previousAvailableMonth.split('-').map(Number)

    currentYear.value = year
    currentMonth.value = month - 1
}
const nextMonth = () => {
    if (!canGoNextMonth.value) return

    const nextAvailableMonth = availableMonths.value.find(
        (month) => month > currentMonthKey.value
    )

    if (!nextAvailableMonth) return

    const [year, month] = nextAvailableMonth.split('-').map(Number)

    currentYear.value = year
    currentMonth.value = month - 1
}

const selectDate = (day: CalendarDay) => {
    if (!day.isAvailable) return

    emit('select-date', day.key)
}

const availableMonths = computed(() => {
    return [...new Set(
        props.dates.map((date) => date.slice(0, 7))
    )].sort()
})
const currentMonthKey = computed(() => {
    const month = String(currentMonth.value + 1).padStart(2, '0')
    return `${currentYear.value}-${month}`
})
const canGoPreviousMonth = computed(() => {
    return availableMonths.value.some((month) => month < currentMonthKey.value)
})
const canGoNextMonth = computed(() => {
    return availableMonths.value.some((month) => month > currentMonthKey.value)
})
</script>

<template>
    <div class="w-full max-w-md rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div class="mb-4 flex items-center justify-between">
            <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Mês anterior"
                :disabled="!canGoPreviousMonth"
                @click="previousMonth"
            >
                ←
            </button>

            <strong class="text-sm font-semibold capitalize text-slate-900"> {{ monthLabel }} </strong>

            <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Próximo mês"
                :disabled="!canGoNextMonth"
                @click="nextMonth"
            >
                →
            </button>
        </div>

        <div class="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
            <span v-for="weekDay in weekDays" :key="weekDay">
                {{ weekDay }}
            </span>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center">
            <button
                v-for="day in calendarDays"
                :key="day.key"
                type="button"
                class="flex aspect-square items-center justify-center rounded-xl text-sm transition"
                :class="[
                    day.isSelected
                        ? 'bg-blue-600 font-semibold text-white shadow-sm'
                        : '',
                    !day.isSelected && day.isAvailable
                        ? 'font-semibold text-slate-900 ring-1 ring-blue-200 hover:bg-blue-50'
                        : '',
                    !day.isAvailable
                        ? 'cursor-not-allowed text-slate-300'
                        : '',
                    !day.isCurrentMonth
                        ? 'opacity-40'
                        : ''
                ]"
                :disabled="!day.isAvailable"
                @click="selectDate(day)"
            >
                {{ day.day }}
            </button>
        </div>
    </div>
</template>