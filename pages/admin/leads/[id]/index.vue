<script setup lang="ts">
import type { LeadStatus } from "~/composables/leadsService";
definePageMeta({ layout: "admin" });
const authStore = useAuthStore();
const canResend = computed(() =>
  ["ADMIN", "MARKETING", "COMMERCIAL"].includes(authStore.user?.role || ""),
);
const route = useRoute();
const service = useLeadsService();
const lead = ref<any | null>(null);
const isLoading = ref(false);
const errorMessage = ref("");
const load = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    lead.value = await service.getById(String(route.params.id));
  } catch (e) {
    errorMessage.value = getFriendlyErrorMessage(e);
  } finally {
    isLoading.value = false;
  }
};
const changeStatus = async (status: LeadStatus) => {
  if (!lead.value) return;
  await service.updateStatus(lead.value.id, status);
  await load();
};
const resend = async () => {
  if (!lead.value || !canResend.value) return;
  await service.resendRubeus(lead.value.id);
  await load();
};
onMounted(load);
</script>
<template>
  <div class="space-y-4">
    <NuxtLink to="/admin/leads" class="text-blue-600">← Voltar</NuxtLink>
    <h2 class="text-2xl font-semibold">Detalhes do lead</h2>
    <BaseAlert v-if="errorMessage" type="error" :message="errorMessage" />
    <div v-else-if="isLoading" class="flex items-center gap-2">
      <BaseLoading /> Loading lead...
    </div>
    <EmptyState
      v-else-if="!lead"
      title="Lead não encontrado"
      description="Não foi possível localizar o lead."
    /><template v-else
      ><BaseCard class="space-y-2"
        ><h3 class="font-semibold">Dados pessoais</h3>
        <p><strong>Nome:</strong> {{ lead.name }}</p>
        <p><strong>Email:</strong> {{ lead.email }}</p>
        <p><strong>Telefone:</strong> {{ lead.phone }}</p></BaseCard
      ><BaseCard class="space-y-2"
        ><h3 class="font-semibold">Agendamento</h3>
        <p><strong>Formulário:</strong> {{ lead.formName }}</p>
        <p><strong>Unidade:</strong> {{ lead.unitName }}</p>
        <p><strong>Série:</strong> {{ lead.gradeName }}</p>
        <p><strong>Data/Horário:</strong> {{ lead.date }} {{ lead.time }}</p>
        <p>
          <strong>Status Rubeus:</strong>
          <BaseBadge
            :variant="lead.rubeusStatus === 'ERROR' ? 'danger' : 'neutral'"
            >{{ lead.rubeusStatus || "-" }}</BaseBadge
          >
        </p>
        <BaseAlert
          v-if="lead.rubeusError"
          type="error"
          :message="lead.rubeusError" /></BaseCard
      ><BaseCard
        ><h3 class="font-semibold mb-2">Campos dinâmicos</h3>
        <div
          v-if="lead.dynamicFields && Object.keys(lead.dynamicFields).length"
          class="space-y-1"
        >
          <p v-for="(value, key) in lead.dynamicFields" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </p>
        </div>
        <EmptyState v-else title="Sem campos dinâmicos" /></BaseCard
      ><BaseCard
        ><h3 class="font-semibold mb-2">Logs de integração</h3>
        <div v-if="lead.logs?.length" class="space-y-1">
          <p v-for="log in lead.logs" :key="log.date + log.message">
            <strong>{{ log.date }}:</strong> {{ log.message }}
          </p>
        </div>
        <EmptyState v-else title="Sem logs" /></BaseCard
      ><BaseCard class="space-y-2"
        ><h3 class="font-semibold">Ações</h3>
        <BaseSelect
          :model-value="lead.status"
          label="Status"
          :options="
            ['SCHEDULED', 'ATTENDED', 'NO_SHOW', 'RESCHEDULED', 'CANCELED'].map(
              (s) => ({ label: s, value: s }),
            )
          "
          @update:model-value="changeStatus($event as LeadStatus)"
        />
        <div class="flex gap-2">
          <BaseButton
            v-if="canResend"
            variant="secondary"
            label="Reenviar ao Rubeus"
            @click="resend"
          /><NuxtLink to="/admin/leads"
            ><BaseButton variant="secondary" label="Voltar para listagem"
          /></NuxtLink>
        </div>
        <p class="text-xs text-slate-500">
          Criado em: {{ lead.createdAt }} | Atualizado em: {{ lead.updatedAt }}
        </p></BaseCard
      ></template
    >
  </div>
</template>
