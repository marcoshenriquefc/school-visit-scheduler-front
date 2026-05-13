<script setup lang="ts">
import BaseAlert from '~/components/BaseAlert.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseLoading from '~/components/BaseLoading.vue'
import EmptyState from '~/components/EmptyState.vue'
import DateTimeStep from '~/components/public-form/DateTimeStep.vue'
import FormStepper from '~/components/public-form/FormStepper.vue'
import PersonalDataStep from '~/components/public-form/PersonalDataStep.vue'
import SuccessStep from '~/components/public-form/SuccessStep.vue'
import UnitGradeStep from '~/components/public-form/UnitGradeStep.vue'

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
    <div class="form-area min-h-screen">
        <template v-if="!formState.form.value">
            <div class="flex items-center gap-2">
                <BaseLoading /> Loading...
            </div>
        </template>

        <template v-else-if="formStatusMessage">
            <EmptyState :title="formStatusMessage" description="Verifique novamente mais tarde." />
        </template>

        <template v-else>
            <div class="space-y-6 mx-auto max-w-4xl p-6">
                <div>
                    <FormStepper :current-step="formState.currentStep.value" :steps="steps" />
                </div>

                <section class="form-float-box">
                    <div class="text-area">
                        <h1 class="text-2xl font-semibold">{{ formState.form.value.title }}</h1>
                    </div>

                    <UnitGradeStep
                        v-if="formState.currentStep.value === 1"
                        :units="formState.activeUnits.value"
                        :grades="formState.activeGrades.value"
                        :selected-unit="formState.selectedUnit.value"
                        :selected-grade="formState.selectedGrade.value"
                        @select-unit="formState.selectUnit"
                        @select-grade="formState.selectedGrade.value = $event"
                    />
                    <DateTimeStep
                        v-if="formState.currentStep.value === 2"
                        :dates="formState.availableDates.value"
                        :selected-date="formState.selectedDate.value"
                        :slots="formState.availableSlots.value"
                        :selected-slot="formState.selectedSlot.value"
                        :format-date="formState.formatPtDate"
                        @select-date="formState.selectDate"
                        @select-slot="formState.selectedSlot.value = $event"
                    />
                    <PersonalDataStep
                        v-if="formState.currentStep.value === 3"
                        :fields="formState.activeFields.value"
                        :personal-data="formState.personalData"
                        :dynamic-fields="formState.dynamicFields"
                        :errors="formState.fieldErrors"
                        :lgpd-text="formState.form.value.lgpdText"
                        :is-submitting="formState.isSubmitting.value"
                        @submit="submit"
                    />
                    <SuccessStep
                        v-if="formState.currentStep.value === 4"
                        :message="formState.form.value.finalMessage"
                        :unit="formState.selectedUnit.value?.name || '-'"
                        :date="formState.selectedDate.value ? formState.formatPtDate(formState.selectedDate.value) : '-'"
                        :time="formState.selectedSlot.value ? `${formState.selectedSlot.value.startTime} — ${formState.selectedSlot.value.endTime}` : '-'"
                        :grade="formState.selectedGrade.value?.name || '-'"
                        :google-url="formState.googleCalendarUrl.value"
                        @restart="formState.reset"
                    />

                    
                    <div v-if="formState.currentStep.value < 4" class="flex justify-between button-area">
                        <BaseButton
                            v-if="formState.currentStep.value !==1"
                            variant="secondary"
                            :disabled="formState.currentStep.value===1"
                            label="Voltar"
                            @click="formState.prevStep"
                        />
                        <BaseButton
                            v-if="formState.currentStep.value < 3"
                            label="Próximo ->"
                            :disabled="!formState.canNext"
                            extra-class="submit-button"
                            @click="formState.nextStep"
                        />
                    </div>
                </section>

                <BaseAlert v-if="friendlyError" type="error" :message="friendlyError" />

            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.form-area {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    background-color: #f6f7f9;

    .form-float-box {
        background-color: #fff;
        border-radius: 1.5rem;
        padding: 2rem;
        border: 1px solid hsl(220 16% 90%);
        max-width: 600px;
        
        .text-area{
            margin-bottom: 20px;
        }
    }
}

.button-area{
    margin-top: 32px;
    .submit-button {
        margin-left: auto;
    }
}
</style>
