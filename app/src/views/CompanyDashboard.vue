<script setup>
import { ref, computed } from "vue";
import { Menu, X, LogOut, Users, Settings } from "lucide-vue-next";
import { useAuth } from "../utils/useAuth";
import CompanySidebar from "../components/CompanySidebar.vue";
import AgentConfig from "../components/AgentConfig.vue";
import CompanyStats from "../components/CompanyStats.vue";
import { mockAgents } from "../data/mockAgents.js";

const { user, logout } = useAuth();
const currentView = ref("agents");
const mobileMenuOpen = ref(false);
const agents = ref(mockAgents);

const stats = computed(() => ({
  totalAgents: agents.value.length,
  activeAgents: agents.value.filter((a) => a.active).length,
  totalMessages: agents.value.reduce((sum, a) => sum + a.messagesHandled, 0),
  avgResponseTime: "2.1s",
}));

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div class="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
    <!-- Mobile Menu Button -->
    <button
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors"
    >
      <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <!-- Mobile Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <CompanySidebar
      :current-view="currentView"
      :mobile-open="mobileMenuOpen"
      @update:current-view="
        currentView = $event;
        mobileMenuOpen = false;
      "
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
      <header class="mb-6 md:mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold mb-2">
            Dashboard Empresarial
          </h1>
          <p class="text-slate-400 text-sm md:text-base">
            Gestiona tus agentes IA y configuraciones
          </p>
          <p v-if="user" class="text-slate-500 text-xs mt-1">
            {{ user.name || user.email }}
          </p>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
        >
          <LogOut class="w-4 h-4" />
          <span class="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </header>

      <!-- Stats Grid -->
      <CompanyStats :stats="stats" />

      <!-- Main Content -->
      <div class="mt-8">
        <AgentConfig v-if="currentView === 'agents'" :agents="agents" />

        <div
          v-else-if="currentView === 'users'"
          class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center"
        >
          <Users class="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h3 class="text-xl font-semibold text-slate-300 mb-2">
            Gestión de Usuarios
          </h3>
          <p class="text-slate-500">
            Próximamente: Invita y gestiona usuarios de tu empresa
          </p>
        </div>

        <div
          v-else-if="currentView === 'settings'"
          class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center"
        >
          <Settings class="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h3 class="text-xl font-semibold text-slate-300 mb-2">
            Configuración
          </h3>
          <p class="text-slate-500">
            Próximamente: Configura tu empresa y preferencias
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
