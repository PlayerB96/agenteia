<template>
  <header class="mb-6 md:mb-8 flex justify-between items-start">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold mb-2">
        Dashboard Empresarial
      </h1>
      <p class="text-400 text-sm md:text-base">
        Gestiona tus agentes IA y configuraciones
      </p>
      <p v-if="user" class="text-500 text-xs mt-1">
        {{ user.name || user.email }}
      </p>
    </div>
    <div class="flex items-center gap-2 self-center">
      <button
        @click="toggleTheme"
        class="px-4 py-2 rounded-lg transition bg-100 dark:bg-900 text-100"
        title="Cambiar Tema"
      >
        <MoonStar v-if="theme === 'dark'" class="w-5 h-5" />
        <Sun v-else class="w-5 h-5" />
      </button>
      <button
        @click="handleLogout"
        class="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
      >
        <LogOut class="w-4 h-4" />
        <span class="hidden sm:inline">Cerrar Sesión</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import { MoonStar, Sun, LogOut } from 'lucide-vue-next'
import { useAuth } from '../utils/useAuth'

const { user, logout } = useAuth()
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')

const handleLogout = () => {
  logout()
}
</script>

<style scoped>
.agent-header {
  background: var(--tw-bg-opacity) linear-gradient(90deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));
  border-radius: 1rem;
  padding: 2rem 2.5rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
}
@media (max-width: 768px) {
  .agent-header {
    padding: 1rem 1rem;
    border-radius: 0.75rem;
  }
}
</style>
