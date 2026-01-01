<script setup>
import { computed } from 'vue'
import { MessageSquare, Mail, Smartphone, Webhook, Brain, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue'

const loading = ref(false)
const error = ref(null)

const props = defineProps({
  companies: Array
})

const emit = defineEmits(['openModal', 'delete'])

const getActiveFeatures = (company) => {
  const active = []
  
  // Handle new nested structure
  if (company.featureCategories) {
    const cats = company.featureCategories
    
    // Marketing -> Communication
    if (cats.marketing?.comunicacion?.features) {
      if (cats.marketing.comunicacion.features.whatsapp?.enabled) {
        active.push({ name: 'WhatsApp', icon: MessageSquare, enabled: true })
      }
      if (cats.marketing.comunicacion.features.email?.enabled) {
        active.push({ name: 'Email', icon: Mail, enabled: true })
      }
      if (cats.marketing.comunicacion.features.sms?.enabled) {
        active.push({ name: 'SMS', icon: Smartphone, enabled: true })
      }
    }
    
    // Ecommerce -> Purchase
    if (cats.ecommerce?.compra?.features) {
      if (cats.ecommerce.compra.features.asistente?.enabled) {
        active.push({ name: 'AI Custom', icon: Brain, enabled: true })
      }
    }
    
    // Add more mappings as needed for visual summary
  } 
  // Handle legacy array structure (fallback if featureCategories missing or strict legacy mode)
  else if (Array.isArray(company.features)) {
     return company.features
  }
  
  return active  
}
</script>

<template>
  <section class="bg-800 border border-slate-700 rounded-2xl p-4 md:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-xl md:text-2xl font-bold">Empresas Configuradas</h2>
      <button 
        class="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
        @click="emit('openModal', null)"
      >
        <span>➕</span>
        Nueva Empresa
      </button>
    </div>

    <div class="space-y-4">
      <div 
        v-for="company in companies" 
        :key="company.id"
        class="bg-700 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 md:p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 group"
        @click="emit('openModal', company)"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
          <div class="flex-1">
            <h3 class="text-lg md:text-xl font-semibold mb-1 group-hover:text-indigo-400 transition-colors text-200">{{ company.name }}</h3>
            <p class="text-200 text-sm">{{ company.domain }}</p>
          </div>
          <span 
            :class="[
              'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap',
              company.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            ]"
          >
            {{ company.active ? 'Activo' : 'Inactivo' }}
          </span>
            <!-- click.stop para detener la propagación de abrir modal -->
            <button
              @click.stop="$emit('delete', company)"
              class="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 />
            </button>
        </div>
        
        <!-- <div class="flex gap-2 md:gap-3 flex-wrap">
          <span 
            v-for="feature in getActiveFeatures(company)" 
            :key="feature.name"
            :class="[
              'px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1.5 md:gap-2 border',
              feature.enabled 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                : 'bg-800 border-slate-700 text-500 opacity-50'
            ]"
          >
            <component :is="feature.icon" class="w-3 h-3 md:w-4 md:h-4" />
            <span class="hidden sm:inline">{{ feature.name }}</span>
          </span>
        </div> -->
      </div>
    </div>
  </section>
</template>
