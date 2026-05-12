<script setup lang="ts">
definePageMeta({ layout: 'public-form' })
const route = useRoute()
const formState = usePublicScheduleForm()
const friendlyError = ref('')

const steps = ['Unidade & Série', 'Data', 'Horário', 'Seus Dados']

onMounted(async () => {
  try {
    await formState.loadBySlug(String(route.params.slug))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Formulário não encontrado.' })
  }
})

const formStatusMessage = computed(() => {
  if (!formState.form.value) return ''
  if (formState.form.value.status === 'PAUSED') return 'Este formulário está pausado no momento.'
  if (formState.form.value.status === 'CLOSED') return 'Este formulário está encerrado.'
  if (formState.form.value.status === 'DRAFT') return 'Formulário indisponível.'
  return ''
})

const submit = async () => {
  const ok = await formState.submit()
  if (!ok) friendlyError.value = formState.submitError.value || 'Não foi possível concluir o agendamento. Tente novamente.'
}
</script>

<template>
  <div class="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
    <template v-if="!formState.form.value">
      <div class="flex items-center gap-2"><BaseLoading /> Loading...</div>
    </template>
    <template v-else-if="formStatusMessage">
      <EmptyState :title="formStatusMessage" description="Verifique novamente mais tarde." />
    </template>
    <template v-else>
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-semibold">{{ formState.form.value.title }}</h1>
          <FormStepper :current-step="formState.currentStep" :steps="steps" />
        </div>

        <UnitGradeStep
          v-if="formState.currentStep === 1"
          :units="formState.activeUnits"
          :grades="formState.activeGrades"
          :selected-unit="formState.selectedUnit"
          :selected-grade="formState.selectedGrade"
          @select-unit="formState.selectUnit"
          @select-grade="formState.selectedGrade = $event"
        />

        <DateTimeStep
          v-if="formState.currentStep === 2"
          :dates="formState.availableDates"
          :selected-date="formState.selectedDate"
          :slots="formState.availableSlots"
          :selected-slot="formState.selectedSlot"
          :format-date="formState.formatPtDate"
          @select-date="formState.selectDate"
          @select-slot="formState.selectedSlot = $event"
        />

        <PersonalDataStep
          v-if="formState.currentStep === 3"
          :fields="formState.activeFields"
          :personal-data="formState.personalData"
          :dynamic-fields="formState.dynamicFields"
          :errors="formState.fieldErrors"
          :lgpd-text="formState.form.value.lgpdText"
          :is-submitting="formState.isSubmitting"
          @submit="submit"
        />

        <SuccessStep
          v-if="formState.currentStep === 4"
          :message="formState.form.value.finalMessage"
          :unit="formState.selectedUnit?.name || '-'"
          :date="formState.selectedDate ? formState.formatPtDate(formState.selectedDate) : '-'"
          :time="formState.selectedSlot ? `${formState.selectedSlot.startTime} — ${formState.selectedSlot.endTime}` : '-'"
          :grade="formState.selectedGrade?.name || '-'"
          :google-url="formState.googleCalendarUrl"
          @restart="formState.reset"
        />

        <BaseAlert v-if="friendlyError" type="error" :message="friendlyError" />

        <div v-if="formState.currentStep < 4" class="flex justify-between">
          <BaseButton variant="secondary" :disabled="formState.currentStep===1" label="Voltar" @click="formState.prevStep" />
          <BaseButton v-if="formState.currentStep < 3" label="Próximo" :disabled="!formState.canNext" @click="formState.nextStep" />
        </div>
      </div>
    </template>
  </div>
</template>
