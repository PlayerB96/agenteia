<script setup>
defineProps({
  stats: Object,
});

import { Bot, Activity, MessageSquare, Clock } from "lucide-vue-next";
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    <!-- Total Agents -->
    <div
      class="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6"
    >
      <div class="flex items-center justify-between mb-2">
        <Bot class="w-8 h-8 text-blue-400" />
      </div>
      <p class="text-2xl md:text-3xl font-bold text-white mb-1">
        {{ stats.totalAgents }}
      </p>
      <p class="text-sm text-slate-400">Total Agentes</p>
    </div>

    <!-- Active Agents -->
    <div
      class="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6"
    >
      <div class="flex items-center justify-between mb-2">
        <Activity class="w-8 h-8 text-green-400" />
      </div>
      <p class="text-2xl md:text-3xl font-bold text-white mb-1">
        {{ stats.activeAgents }}
      </p>
      <p class="text-sm text-slate-400">Agentes Activos</p>
    </div>

    <!-- Total Messages -->
    <div
      class="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6"
    >
      <div class="flex items-center justify-between mb-2">
        <MessageSquare class="w-8 h-8 text-purple-400" />
      </div>
      <p class="text-2xl md:text-3xl font-bold text-white mb-1">
        {{ stats.totalMessages.toLocaleString() }}
      </p>
      <p class="text-sm text-slate-400">Mensajes Procesados</p>
    </div>

    <!-- Avg Response Time -->
    <div
      class="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6"
    >
      <div class="flex items-center justify-between mb-2">
        <Clock class="w-8 h-8 text-orange-400" />
      </div>
      <p class="text-2xl md:text-3xl font-bold text-white mb-1">
        {{ stats.avgResponseTime }}
      </p>
      <p class="text-sm text-slate-400">Tiempo Promedio</p>
    </div>
  </div>
</template>
