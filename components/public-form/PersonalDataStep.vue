<script setup lang="ts">
    import type { PublicFormField } from "~/types/public-form";
    import DynamicFieldRenderer from "./DynamicFieldRenderer.vue";
    import BaseInput from "../BaseInput.vue";
    import BaseCheckbox from "../BaseCheckbox.vue";
    import BaseButton from "../BaseButton.vue";

    defineProps<{
        fields: PublicFormField[];
        personalData: {
            name: string;
            email: string;
            phone: string;
            lgpdAccepted: boolean;
        };
        dynamicFields: Record<string, unknown>;
        errors: Record<string, string>;
        lgpdText: string;
        isSubmitting: boolean;
    }>();
    defineEmits(["submit"]);
</script>

<template>
    <div class="space-y-3">
        <BaseInput
            v-model="personalData.name"
            label="Nome completo"
            :error="errors.name"
        />
        <BaseInput
            v-model="personalData.email"
            label="E-mail"
            type="email"
            :error="errors.email"
        />
        <BaseInput
            v-model="personalData.phone"
            label="Telefone"
            :error="errors.phone"
        />
        <DynamicFieldRenderer
            v-for="f in fields"
            :key="f.id"
            :field="f"
            :model-value="dynamicFields[f.name]"
            :error="errors[f.name]"
            @update:model-value="dynamicFields[f.name] = $event"
        />
        <BaseCheckbox
            v-model="personalData.lgpdAccepted"
            :label="lgpdText || 'Concordo com os termos da LGPD'"
        />
        <BaseButton
            :loading="isSubmitting"
            :disabled="isSubmitting"
            label="Confirmar Agendamento"
            @click="$emit('submit')"
        />
    </div>
</template>
