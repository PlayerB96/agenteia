<script setup>
defineProps({
  currentView: String,
  mobileOpen: Boolean,
});

const emit = defineEmits(["update:current-view"]);

import { Bot, Users, Settings, BarChart3 } from "lucide-vue-next";

const menuItems = [
  { id: "agents", label: "Agentes IA", icon: Bot },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "settings", label: "Configuración", icon: Settings },
];
</script>

<template>
  <aside
    :class="[
      'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex flex-col h-full p-4">
      <!-- Logo -->
      <div class="mb-8 pt-4">
        <h2
          class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Agenteia
        </h2>
        <p class="text-xs text-500 mt-1">Dashboard Empresarial</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="emit('update:current-view', item.id)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
            currentView === item.id
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'text-300 hover:bg-700 hover:text-100',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="font-medium">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Footer Info -->
      <div class="pt-4 border-t border-slate-700/50">
        <p class="text-xs text-slate-500 text-center">Company Dashboard v1.0</p>
      </div>
    </div>
  </aside>
</template>
