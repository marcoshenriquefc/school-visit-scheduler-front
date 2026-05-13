import { z } from "zod";
import type {
  PublicForm,
  PublicFormField,
  PublicFormGrade,
  PublicFormSlot,
  PublicFormUnit,
  SchedulePayload,
} from "~/types/public-form";

export const usePublicScheduleForm = () => {
  const service = usePublicFormsService();
  const currentStep = ref(1);
  const form = ref<PublicForm | null>(null);
  const selectedUnit = ref<PublicFormUnit | null>(null);
  const selectedGrade = ref<PublicFormGrade | null>(null);
  const selectedDate = ref<string | null>(null);
  const selectedSlot = ref<PublicFormSlot | null>(null);
  const personalData = reactive({
    name: "",
    email: "",
    phone: "",
    lgpdAccepted: false,
  });
  const dynamicFields = reactive<Record<string, unknown>>({});
  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);
  const fieldErrors = reactive<Record<string, string>>({});

  const activeUnits = computed(
    () => form.value?.formUnits.filter((u) => u.isActive) || [],
  );
  const activeGrades = computed(
    () => form.value?.formGrades.filter((g) => g.isActive) || [],
  );
  const activeFields = computed<PublicFormField[]>(() =>
    (form.value?.formFields || [])
      .filter((f) => f.isActive && f.name !== "phone")
      .sort((a, b) => a.order - b.order),
  );
  // const availableDates = computed(() => {
  //   if (!selectedUnit.value || !form.value) return [] as string[];
  //   return [
  //     ...new Set(
  //       selectedUnit.value.slots
  //         .filter(
  //           (s) =>
  //             !s.isBlocked &&
  //             toDateKey(s.date) >= toDateKey(form.value!.startDate) &&
  //             toDateKey(s.date) <= toDateKey(form.value!.endDate),
  //         )
  //         .map((s) => toDateKey(s.date)),
  //     ),
  //   ];
  // });

  const availableDates = computed(() => {
    if (!selectedUnit.value || !form.value) return []

    const startDate = toDateKey(form.value.startDate)
    const endDate = toDateKey(form.value.endDate)


    const dates = selectedUnit.value.slots
      .filter((slot) => {
        const slotDate = toDateKey(slot.date)

        return (
          !slot.isBlocked &&
          slotDate >= startDate &&
          slotDate <= endDate
        )
      })
      .map((slot) => toDateKey(slot.date))

    return [...new Set(dates)].sort()
  })
  console.log("Avaliable Dates", availableDates)

  const availableSlots = computed(() =>
    (selectedUnit.value?.slots || []).filter(
      (s) => !s.isBlocked && toDateKey(s.date) === selectedDate.value,
    ),
  );

  const loadBySlug = async (slug: string) => {
    form.value = await service.getFormData(slug);
  };
  const toDateKey = (iso: string) =>
    new Date(iso).toLocaleDateString("en-CA", {
      timeZone: "America/Fortaleza",
    }
  );
  const formatPtDate = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");

  const canNext = computed(() => {
    if (currentStep.value === 1)
      return Boolean(selectedUnit.value && selectedGrade.value);
    if (currentStep.value === 2)
      return Boolean(selectedDate.value && selectedSlot.value);
    if (currentStep.value === 3) return Boolean(personalData.lgpdAccepted);
    return false;
  });

  const nextStep = () => {
    if (canNext.value) currentStep.value += 1;
  };
  const prevStep = () => {
    if (currentStep.value > 1) currentStep.value -= 1;
  };
  const selectUnit = (unit: PublicFormUnit) => {
    selectedUnit.value = unit;
    selectedDate.value = null;
    selectedSlot.value = null;
  };
  const selectDate = (date: string) => {
    selectedDate.value = date;
    selectedSlot.value = null;
  };

  const submit = async () => {
    Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k]);
    submitError.value = null;
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(8),
      lgpdAccepted: z.literal(true),
    });
    const parsed = schema.safeParse(personalData);
    if (!parsed.success) {
      parsed.error.issues.forEach(
        (i) => (fieldErrors[i.path[0] as string] = i.message),
      );
      return false;
    }
    for (const field of activeFields.value) {
      if (field.isRequired && !dynamicFields[field.name]) {
        fieldErrors[field.name] = "Required field";
      }
    }
    if (Object.keys(fieldErrors).length) return false;
    if (
      !form.value ||
      !selectedUnit.value ||
      !selectedGrade.value ||
      !selectedSlot.value
    )
      return false;
    isSubmitting.value = true;
    try {
      const payload: SchedulePayload = {
        formId: form.value.id,
        unitId: selectedUnit.value.idUnit,
        gradeId: selectedGrade.value.gradeId,
        availabilitySlotId: selectedSlot.value.id,
        name: personalData.name,
        email: personalData.email,
        phone: personalData.phone,
        lgpdAccepted: true,
        dynamicFields,
      };
      await service.submitSchedule(payload);
      currentStep.value = 4;
      return true;
    } catch (e) {
      submitError.value = getFriendlyErrorMessage(e);
      if (submitError.value.toLowerCase().includes("dispon"))
        currentStep.value = 2;
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const reset = () => {
    currentStep.value = 1;
    selectedUnit.value = null;
    selectedGrade.value = null;
    selectedDate.value = null;
    selectedSlot.value = null;
    personalData.name = "";
    personalData.email = "";
    personalData.phone = "";
    personalData.lgpdAccepted = false;
    Object.keys(dynamicFields).forEach((k) => delete dynamicFields[k]);
  };
  const googleCalendarUrl = computed(() => {
    if (
      !form.value ||
      !selectedUnit.value ||
      !selectedGrade.value ||
      !selectedDate.value ||
      !selectedSlot.value
    )
      return "#";
    const start = `${selectedDate.value}T${selectedSlot.value.startTime}:00`;
    const end = `${selectedDate.value}T${selectedSlot.value.endTime}:00`;
    const dt = (v: string) => v.replace(/[-:]/g, "").replace(".000", "");
    const text = encodeURIComponent(
      `Visita à Escola SESI - ${selectedUnit.value.name}`,
    );
    const details = encodeURIComponent(
      `Agendamento realizado pelo formulário ${form.value.title}. Série/Nível de interesse: ${selectedGrade.value.name}.`,
    );
    const location = encodeURIComponent(selectedUnit.value.address || "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}&dates=${dt(start)}/${dt(end)}`;
  });

  return {
    currentStep,
    form,
    selectedUnit,
    selectedGrade,
    selectedDate,
    selectedSlot,
    personalData,
    dynamicFields,
    isSubmitting,
    submitError,
    fieldErrors,
    activeUnits,
    activeGrades,
    activeFields,
    availableDates,
    availableSlots,
    loadBySlug,
    nextStep,
    prevStep,
    canNext,
    selectUnit,
    selectDate,
    submit,
    reset,
    googleCalendarUrl,
    formatPtDate,
  };
};
