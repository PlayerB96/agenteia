<script setup>
import { ref } from 'vue'
import { Target, Briefcase, Server, BarChart, ShoppingCart, Laptop, Megaphone, MessageCircleMore } from 'lucide-vue-next'

const props = defineProps({
  activeTab: String
})

const emit = defineEmits(['update:activeTab'])

const tabs = ref([
  { id: 'comercial', label: 'Agente Comercial', icon: ShoppingCart },
  { id: 'sistemas', label: 'Agente Sistemas', icon: Laptop },
  { id: 'soporte', label: 'Agente Soporte', icon: MessageCircleMore },
  { id: 'marketing', label: 'Agente Marketing', icon: Megaphone },
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
            : 'text-400 hover:text-300'
        ]"
        @click="emit('update:activeTab', tab.id)"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
