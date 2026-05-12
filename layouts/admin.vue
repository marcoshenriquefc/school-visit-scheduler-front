<script setup lang="ts">
import type { UserRole } from '~/types/auth'

const authStore = useAuthStore()
const { can } = usePermissions()
const isSidebarOpen = ref(false)

interface NavItem { label: string; to: string; roles: UserRole[] }

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin', roles: ['ADMIN', 'MARKETING', 'COMMERCIAL', 'OPERATIONAL'] },
  { label: 'Formulários', to: '/admin/forms', roles: ['ADMIN', 'MARKETING'] },
  { label: 'Unidades', to: '/admin/units', roles: ['ADMIN', 'MARKETING', 'COMMERCIAL'] },
  { label: 'Séries', to: '/admin/grades', roles: ['ADMIN', 'MARKETING', 'COMMERCIAL'] },
  { label: 'Disponibilidade', to: '/admin/availability', roles: ['ADMIN', 'MARKETING'] },
  { label: 'Leads', to: '/admin/leads', roles: ['ADMIN', 'MARKETING', 'COMMERCIAL', 'OPERATIONAL'] },
  { label: 'Usuários', to: '/admin/users', roles: ['ADMIN'] },
  { label: 'API Keys', to: '/admin/api-keys', roles: ['ADMIN'] },
  { label: 'Logs', to: '/admin/logs', roles: ['ADMIN', 'OPERATIONAL'] }
]

const filteredNavItems = computed(() => navItems.filter((item) => authStore.user?.role && item.roles.includes(authStore.user.role) && !(item.to.includes('/users') && !can('manageUsers')) && !(item.to.includes('/api-keys') && !can('manageApiKeys')) && !(item.to.includes('/logs') && !can('viewLogs'))))

const handleLogout = async () => {
  authStore.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 lg:flex">
    <div v-if="isSidebarOpen" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="isSidebarOpen = false" />
    <aside class="fixed left-0 top-0 z-40 h-full w-72 bg-slate-900 text-white transition-transform lg:static lg:translate-x-0" :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="border-b border-slate-700 px-5 py-4 text-lg font-semibold">Handle Admin</div>
      <nav class="space-y-1 p-3">
        <NuxtLink v-for="item in filteredNavItems" :key="item.to" :to="item.to" class="block rounded px-3 py-2 text-sm hover:bg-slate-800">{{ item.label }}</NuxtLink>
      </nav>
    </aside>

    <div class="flex-1">
      <header class="flex items-center justify-between border-b bg-white px-4 py-3 lg:px-6">
        <button class="rounded border px-3 py-1 lg:hidden" @click="isSidebarOpen = true">Menu</button>
        <div class="ml-auto flex items-center gap-3">
          <div class="text-right text-sm">
            <p class="font-medium">{{ authStore.user?.email }}</p>
            <p class="text-slate-500">{{ authStore.user?.role }}</p>
          </div>
          <BaseButton variant="secondary" label="Logout" @click="handleLogout" />
        </div>
      </header>
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
