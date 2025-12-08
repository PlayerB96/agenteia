<script setup>
import { ref } from 'vue'
import { Building2, BarChart3, Settings, FileText } from 'lucide-vue-next'

defineProps({
  currentView: String,
  mobileOpen: Boolean
})

const emit = defineEmits(['update:currentView'])

const navItems = ref([
  { id: 'companies', label: 'Empresas', icon: Building2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
  { id: 'logs', label: 'Logs', icon: FileText },
])
</script>

<template>
  <aside :class="[
    'fixed lg:sticky top-0 left-0 w-72 bg-slate-800 border-r border-slate-700 py-8 flex flex-col h-screen z-40 transition-transform duration-300',
    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]">
    <div class="px-8 pb-8">
      <h1 class="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
        <component :is="Settings" class="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
        AgentIA
      </h1>
    </div>
    
    <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
      <div 
        v-for="item in navItems" 
        :key="item.id"
        :class="[
          'flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200',
          currentView === item.id 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        ]"
        @click="emit('update:currentView', item.id)"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>
