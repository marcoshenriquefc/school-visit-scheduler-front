<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const dashboardService = useDashboardService()
const errorMessage = ref('')
const isLoading = ref(false)
const metrics = ref()

const filters = reactive({ formId: '', unitId: '', gradeId: '', startDate: '', endDate: '' })

const chartMax = (items: Array<{ value: number }>) => Math.max(1, ...items.map((item) => item.value))

const loadDashboard = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    metrics.value = await dashboardService.getMetrics({ ...filters })
  } catch (error) {
    errorMessage.value = getFriendlyErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold">Dashboard</h2>

    <BaseCard>
      <div class="grid gap-3 md:grid-cols-5">
        <BaseInput v-model="filters.formId" label="Formulário" placeholder="Form ID" />
        <BaseInput v-model="filters.unitId" label="Unidade" placeholder="Unit ID" />
        <BaseInput v-model="filters.gradeId" label="Série" placeholder="Grade ID" />
        <BaseInput v-model="filters.startDate" label="Período inicial" type="date" />
        <BaseInput v-model="filters.endDate" label="Período final" type="date" />
      </div>
      <div class="mt-3">
        <BaseButton :loading="isLoading" label="Aplicar filtros" @click="loadDashboard" />
      </div>
    </BaseCard>

    <BaseAlert v-if="errorMessage" type="error" :message="errorMessage" />
    <div v-else-if="isLoading" class="flex items-center gap-2"><BaseLoading /> Loading dashboard...</div>

    <template v-else-if="metrics">
      <div class="grid gap-3 md:grid-cols-5">
        <BaseCard>Total de leads: <strong>{{ metrics.totals.leads }}</strong></BaseCard>
        <BaseCard>Total agendados: <strong>{{ metrics.totals.scheduled }}</strong></BaseCard>
        <BaseCard>Compareceram: <strong>{{ metrics.totals.attended }}</strong></BaseCard>
        <BaseCard>Não compareceram: <strong>{{ metrics.totals.noShow }}</strong></BaseCard>
        <BaseCard>Cancelados: <strong>{{ metrics.totals.canceled }}</strong></BaseCard>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <BaseCard v-for="(series, title) in {
          'Leads por unidade': metrics.leadsByUnit,
          'Leads por série': metrics.leadsByGrade,
          'Agendamentos por data': metrics.schedulesByDate,
          'Agendamentos por horário': metrics.schedulesByHour,
          'Status Rubeus': metrics.rubeusStatus,
          'Horários mais procurados': metrics.topHours
        }" :key="title">
          <h3 class="mb-3 font-semibold">{{ title }}</h3>
          <div v-if="series.length" class="space-y-2">
            <div v-for="item in series" :key="item.label" class="space-y-1">
              <div class="flex justify-between text-sm"><span>{{ item.label }}</span><span>{{ item.value }}</span></div>
              <div class="h-2 rounded bg-slate-200"><div class="h-2 rounded bg-blue-600" :style="`width:${(item.value / chartMax(series))*100}%`" /></div>
            </div>
          </div>
          <EmptyState v-else title="No data" description="No indicators available for this chart." />
        </BaseCard>
      </div>
    </template>

    <EmptyState v-else title="No dashboard data" description="Try applying different filters." />
  </div>
</template>
