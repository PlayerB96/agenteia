<template>
  <div class="min-h-screen bg-900 text-100 font-sans flex">
    <CompanySidebar :current-view="'agents'" :mobile-open="false" class="hidden md:block" />
    <div class="flex-1 flex flex-col min-h-screen">
      <AgentHeader />
      <main class="flex-1 flex flex-col md:flex-row gap-6 p-0 md:p-8 h-full min-h-0">
        <!-- Chat principal -->
        <section class="flex-1 flex flex-col items-center justify-center h-full min-h-0">
          <div :class="['w-full max-w-4xl bg-800 border border-700 rounded-xl flex flex-col gap-4 min-h-[400px] h-full', maximized ? 'fixed inset-0 z-50 m-0 rounded-none max-w-none p-4 md:p-10' : 'p-4 md:p-8']" style="height:100%">
            <div class="flex-1 flex flex-col justify-end">
              <div class="overflow-y-auto max-h-[400px] mb-4 custom-scrollbar bg-700/10 rounded-lg p-2 transition-colors" :class="maximized ? 'max-h-none min-h-[60vh]' : ''">
                <div v-for="(msg, i) in history" :key="i" class="mb-2 flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                  <div class="flex items-end gap-2" :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
                    <component :is="msg.role === 'user' ? User : Bot" class="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
                    <span class="inline-block px-3 py-2 rounded-lg text-sm font-medium shadow-md"
                      :class="msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-700 text-100'">
                      {{ msg.text }}
                    </span>
                  </div>
                </div>
              </div>
              <form @submit.prevent="sendMessage" class="flex gap-2 mt-2">
                <input v-model="input" type="text" class="flex-1 bg-700 border border-600 rounded-lg px-4 py-2.5 text-200 focus:outline-none" placeholder="Escribe tu mensaje..." />
                <button type="submit" class="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1">
                  <Send class="w-4 h-4" /> Enviar
                </button>
              </form>
              <div class="mt-4 flex gap-2">
                <button class="flex items-center gap-2 px-3 py-2 bg-700 text-200 rounded hover:bg-indigo-500/10 transition-colors" @click="clearHistory">
                  <Sparkles class="w-5 h-5" />
                  <span>Nuevo Chat</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <!-- Panel derecho: info agente -->
        <aside class="w-full md:w-[440px] min-w-0 max-w-full md:min-w-[340px] md:max-w-md bg-800 border border-700 rounded-xl p-4 md:p-8 flex flex-col gap-8 h-full min-h-0">
          <div>
            <h2 class="text-lg font-bold mb-4">Opciones de {{ agentName.replace(/_/g, ' ') }}</h2>
            <ul class="space-y-2">
              <li>
                <span class="font-semibold text-100">Ver últimos 5 chats:</span>
                <ul class="pl-2 mt-1 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  <li v-for="(msg, i) in lastChats" :key="i" class="text-xs text-400 flex items-center gap-1">
                    <component :is="msg.role === 'user' ? User : Bot" class="w-3.5 h-3.5" />
                    <span class="font-bold text-100">{{ msg.role }}:</span> {{ msg.text }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-2">Pasos de la última acción</h3>
            <ul class="space-y-1">
              <li v-for="(step, i) in steps" :key="i" class="text-xs text-500">
                {{ step }}
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
    <!-- Sidebar mobile -->
    <CompanySidebar :current-view="'agents'" :mobile-open="true" class="block md:hidden fixed z-50 top-0 left-0 h-full w-64" />
  </div>
</template>



<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import CompanySidebar from '../components/CompanySidebar.vue'
import AgentHeader from '../components/AgentHeader.vue'
import { Bot, User, Send, Maximize2, Minimize, Sparkles } from 'lucide-vue-next'


const route = useRoute()
const agentName = route.params.agentName
const input = ref('')
const history = ref([
  { role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
])
const lastChats = computed(() => history.value.slice(-5));
const steps = ref([
  'Recibido mensaje',
  'Procesando intención',
  'Generando respuesta',
  'Enviando respuesta'
])
const maximized = ref(false)
function toggleMaximize() {
  maximized.value = !maximized.value
}

function sendMessage() {
  if (!input.value.trim()) return
  history.value.push({ role: 'user', text: input.value })
  // Simulación de respuesta del agente
  setTimeout(() => {
    history.value.push({ role: 'agent', text: 'Respuesta simulada de ' + agentName })
  }, 700)
  input.value = ''
}

function clearHistory() {
  history.value = [{ role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }]
  input.value = ''
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #23272f;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  background: #23272f;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 6px;
}
@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    scrollbar-color: #818cf8 #e5e7eb;
  }
  .custom-scrollbar::-webkit-scrollbar {
    background: #e5e7eb;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #818cf8;
  }
}

.flex-1 > main {
  min-height: 0;
}
main {
  height: 100%;
  min-height: 0;
}
section, aside {
  min-height: 0;
  height: 100%;
}
@media (max-width: 768px) {
  main {
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
  }
  aside {
    margin-top: 1rem;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    padding: 1rem;
  }
  section {
    margin-bottom: 0;
    padding: 0;
  }
}
</style>
