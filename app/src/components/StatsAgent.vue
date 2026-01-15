<script setup>
import { Building2, Bot, MessageSquare, Zap } from 'lucide-vue-next'

defineProps({
  statsAgent: Object
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div 
      v-for="row in statsAgent" :key="row.id" 
      class="bg-700 border rounded-2xl p-6 hover:-translate-y-1 hover:shadow-black/30">
      <div class="flex justify-between items-center mb-4">
        <span class="text-400 text-sm uppercase tracking-wider font-semibold">{{ row.label }}</span>
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"
        :class="[
        'bg-gradient-to-r', row.color]"
        >
          <component
            :is="row.icon"
            class="w-5 h-5 text-200"
          />
        </div>
      </div>
      <div class="text-sm text-emerald-400-ag flex items-center gap-1">
        <span class="text-200">{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>
