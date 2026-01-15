<script setup>
import { computed } from 'vue'
import { MessageSquare, Mail, Smartphone, Webhook, Brain, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const loading = ref(false)
const error = ref(null)

const props = defineProps({
  companies: Array
})

const activeCompanies = computed(() =>
  props.companies.filter(c => Number(c.active) === 1)
)

const inactiveCompanies = computed(() =>
  props.companies.filter(c => Number(c.active) === 0)
)

const emit = defineEmits(['openModal', 'delete', 'toggle-active'])

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

const router = useRouter()
const route = useRoute()

const goEdit = (id) => {
  router.push(`/companies/${id}/edit`)
}
</script>

<template>
  <section class="bg-800 border border-700 rounded-2xl p-4 md:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-xl text-2xl font-bold">Empresas Configuradas</h2>
      <button 
        class="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
        @click="router.push({ name: 'NewCompany' })"
      >
        <span class="text-lg">+</span>
        Nueva Empresa
      </button>
    </div>

    <div class="space-y-4">
      <h3 class="text-sm uppercase text-emerald-400-ag font-bold tracking-wider mb-2">
        Empresas Activas ({{ activeCompanies.length }})
      </h3>

      <div class="space-y-4">
          <div
            v-for="company in activeCompanies"
            :key="company.id"
            class="bg-700 border border-700 hover:border-indigo-500/50 rounded-xl p-4 md:p-6 cursor-pointer transition-all"
            @click="goEdit(company.id)"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
              <div class="flex-1">
                <h3 class="text-lg md:text-xl font-semibold mb-1 group-hover:text-indigo-400 transition-colors text-200">{{ company.name }}</h3>
                <p class="text-200 text-sm">{{ company.domain }}</p>
              </div>
              <span 
                :class="[
                  'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap',
                  //company.active == 1 is true else false
                  company.active == 1 ? 'bg-emerald-500/10 text-emerald-400-ag' : 'bg-red-500/10 text-red-400'
                ]"
              >
                {{ company.active == 1 ? 'Activo' : 'Inactivo' }}
              </span>
              <!-- SWITCH -->
              <button
                @click.stop="$emit('toggle-active', company)"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="company.active ? 'bg-emerald-400-ag' : 'bg-600'"
                title="Activar / Desactivar"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="company.active ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
              <!-- click.stop para detener la propagación de abrir modal -->
              <button
                @click.stop="$emit('delete', company)"
                class="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 />
              </button>
            </div>
          </div>
      </div>
      <h3 class="text-sm uppercase text-red-400 font-bold tracking-wider mt-8 mb-2">
        Empresas Inactivas ({{ inactiveCompanies.length }})
      </h3>

      <div class="space-y-4">
        <div
          v-for="company in inactiveCompanies"
          :key="company.id"
          class="bg-700 border border-700 hover:border-red-500/40 rounded-xl p-4 md:p-6 cursor-pointer transition-all"
          @click="goEdit(company.id)"
        >
            <div class="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
              <div class="flex-1">
                <h3 class="text-lg md:text-xl font-semibold mb-1 group-hover:text-indigo-400 transition-colors text-200">{{ company.name }}</h3>
                <p class="text-200 text-sm">{{ company.domain }}</p>
              </div>
              <span 
                :class="[
                  'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap',
                  //company.active == 1 is true else false
                  company.active == 1 ? 'bg-emerald-500/10 text-emerald-400-ag' : 'bg-red-500/10 text-red-400'
                ]"
              >
                {{ company.active == 1 ? 'Activo' : 'Inactivo' }}
              </span>
              <!-- SWITCH -->
              <button
                @click.stop="$emit('toggle-active', company)"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="company.active ? 'bg-emerald-400-ag' : 'bg-600'"
                title="Activar / Desactivar"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="company.active ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
              <!-- click.stop para detener la propagación de abrir modal -->
              <button
                @click.stop="$emit('delete', company)"
                class="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 />
              </button>
            </div>
        </div>
      </div>
    </div>
  </section>
</template>
