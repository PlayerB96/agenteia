<script setup>
import { ref } from 'vue'
import { Target, Briefcase, Server, BarChart, ShoppingCart } from 'lucide-vue-next'

const props = defineProps({
  activeTab: String
})

const emit = defineEmits(['update:activeTab'])

const tabs = ref([
  { id: 'marketing', label: 'Marketing', icon: Target },
  { id: 'comercial', label: 'Comercial', icon: Briefcase },
  { id: 'sistemas', label: 'Sistemas', icon: Server },
  { id: 'analisis', label: 'Análisis', icon: BarChart },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
])
</script>

<template>
  <div class="border-b border-slate-700 mb-6">
    <div class="flex gap-1 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all whitespace-nowrap',
          activeTab === tab.id
            ? 'text-indigo-400 border-b-2 border-indigo-500'
            : 'text-slate-400 hover:text-slate-300'
        ]"
        @click="emit('update:activeTab', tab.id)"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
