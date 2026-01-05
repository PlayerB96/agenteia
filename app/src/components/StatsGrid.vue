<script setup>
import { Building2, Bot, MessageSquare, Zap } from 'lucide-vue-next'

defineProps({
  stats: Object
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-800 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
      <div class="flex justify-between items-center mb-4">
        <span class="text-400 text-sm uppercase tracking-wider font-semibold">Empresas Activas</span>
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
          <Building2 class="w-6 h-6" />
        </div>
      </div>
      <div class="text-3xl font-bold mb-1">{{ stats.activeCompanies }}</div>
      <div class="text-sm text-emerald-400-ag flex items-center gap-1">
        <span>↑</span> 12% este mes
      </div>
    </div>

    <div class="bg-800 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
      <div class="flex justify-between items-center mb-4">
        <span class="text-400 text-sm uppercase tracking-wider font-semibold">Total Agentes</span>
        <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center dark:bg-purple-400/20 dark:text-purple-400">
          <Bot class="w-6 h-6" />
        </div>
      </div>
      <div class="text-3xl font-bold mb-1">{{ stats.totalAgents }}</div>
      <div class="text-sm text-emerald-400-ag flex items-center gap-1">
        <span>↑</span> 8% este mes
      </div>
    </div>

    <div class="bg-800 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
      <div class="flex justify-between items-center mb-4">
        <span class="text-400 text-sm uppercase tracking-wider font-semibold">Mensajes Hoy</span>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <MessageSquare class="w-6 h-6" />
        </div>
      </div>
      <div class="text-3xl font-bold mb-1">{{ stats.messagesTotal }}</div>
      <div class="text-sm text-emerald-400-ag flex items-center gap-1">
        <span>↑</span> 24% vs ayer
      </div>
    </div>

    <div class="bg-800 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
      <div class="flex justify-between items-center mb-4">
        <span class="text-400 text-sm uppercase tracking-wider font-semibold">Uptime</span>
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
          <Zap class="w-6 h-6" />
        </div>
      </div>
      <div class="text-3xl font-bold mb-1">{{ stats.uptime }}%</div>
      <div class="text-sm text-emerald-400-ag font-medium">Óptimo</div>
    </div>
  </div>
</template>
