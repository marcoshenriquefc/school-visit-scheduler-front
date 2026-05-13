<script setup lang="ts">
    import BaseAlert from '~/components/BaseAlert.vue';
    import BaseBadge from '~/components/BaseBadge.vue';
    import BaseButton from '~/components/BaseButton.vue';
    import BaseCard from '~/components/BaseCard.vue';
    import BaseInput from '~/components/BaseInput.vue';
    import BaseLoading from '~/components/BaseLoading.vue';
    import BaseSelect from '~/components/BaseSelect.vue';
    import ConfirmDialog from '~/components/ConfirmDialog.vue';
import type { Grade } from '~/types/api';

    definePageMeta({ layout: "admin" });
    const authStore = useAuthStore();
    const gradesService = useGradesService();
    const canManage = computed(() =>
        ["ADMIN", "MARKETING"].includes(authStore.user?.role || ""),
    );
    const filters = reactive({
        name: "",
        identifier: "",
        isActive: "" as "" | "true" | "false",
    });
    const grades = ref<Grade[]>([])
    const isLoading = ref(false);
    const errorMessage = ref("");
    const confirmId = ref<string | null>(null);
    const loadGrades = async () => {
        isLoading.value = true;
        errorMessage.value = "";
        try {
            grades.value = await gradesService.list(filters);
        }
        catch (e) {
            errorMessage.value = getFriendlyErrorMessage(e);
        }
        finally {
            isLoading.value = false;
        }
    };
    const toggleStatus = async (id: string, isActive: boolean) => {
        if (!canManage.value) return;
        if (isActive) {
            confirmId.value = id;
            return;
        }
        await gradesService.activate(id);
        await loadGrades();
    };
    const confirmDeactivate = async () => {
        if (!confirmId.value) return;
        await gradesService.deactivate(confirmId.value);
        confirmId.value = null;
        await loadGrades();
    };
    onMounted(loadGrades);
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold">Séries</h2>
            <NuxtLink v-if="canManage" to="/admin/grades/create">
                <BaseButton label="Nova série"/>
            </NuxtLink>
        </div>

        <BaseCard>
            <div class="grid gap-3 md:grid-cols-4">
                <BaseInput v-model="filters.name" label="Nome" />
                <BaseInput v-model="filters.identifier" label="Identificador"/>
                <BaseSelect
                    v-model="filters.isActive"
                    label="Status"
                    :options="[
                        { label: 'Todos', value: '' },
                        { label: 'Ativo', value: 'true' },
                        { label: 'Inativo', value: 'false' },
                    ]"
                />
                <div class="flex items-end">
                    <BaseButton
                        :loading="isLoading"
                        label="Filtrar"
                        @click="loadGrades"
                    />
                </div>
            </div>
        </BaseCard>
        
        <BaseAlert v-if="errorMessage" type="error" :message="errorMessage" />
        <div v-else-if="isLoading" class="flex items-center gap-2">
            <BaseLoading /> Loading grades...
        </div>

        <BaseTable v-else-if="grades.length">
            <thead>
                <tr class="border-b bg-slate-50 text-left">
                    <th class="p-2">Nome</th>
                    <th class="p-2">Identificador</th>
                    <th class="p-2">Status</th>
                    <th class="p-2">Ações</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="grade in grades" :key="grade.id" class="border-b">
                    <td class="p-2">{{ grade.name }}</td>
                    <td class="p-2">{{ grade.identifier }}</td>
                    <td class="p-2">
                        <BaseBadge :variant="grade.isActive ? 'success' : 'danger'">{{ grade.isActive ? "Ativo" : "Inativo" }}</BaseBadge>
                    </td>
                    <td class="p-2 space-x-2">
                        <NuxtLink :to="`/admin/grades/${grade.id}/edit`" >
                            <BaseButton
                                v-if="canManage"
                                variant="secondary"
                                label="Editar"
                            />
                        </NuxtLink>

                        <BaseButton
                            v-if="canManage"
                            :variant="grade.isActive ? 'danger' : 'success'"
                            :label="grade.isActive ? 'Desativar' : 'Ativar'"
                            @click="toggleStatus(grade.id, grade.isActive)"
                        />
                    </td>
                </tr>
            </tbody>
        </BaseTable>

        <EmptyState
            v-else
            title="Sem séries"
            description="Nenhuma série encontrada."
        />
        <ConfirmDialog
            :open="Boolean(confirmId)"
            title="Desativar série"
            description="Deseja realmente desativar esta série?"
            @cancel="confirmId = null"
            @confirm="confirmDeactivate"
        />
    </div>
</template>
