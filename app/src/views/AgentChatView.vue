<template>
  <div class="h-dvh bg-900 text-100 font-sans flex overflow-hidden">

    <!-- Mobile Menu Button -->
    <button @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-800 border border-700 rounded-lg text-white hover:bg-700 transition-colors">
      <span v-if="!mobileMenuOpen">☰</span>
      <span v-else>✕</span>
    </button>

    <!-- Mobile Overlay -->
    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 bg-black/50 z-30" @click="mobileMenuOpen = false" />

    <!-- Sidebar -->
    <CompanySidebar v-if="!maximized" :current-view="currentView" :mobile-open="mobileMenuOpen"
      :current-subtab="currentSubtab" @update:current-view="currentView = $event; mobileMenuOpen = false"
      @update:current-subtab="currentSubtab = $event" />


    <!-- Main -->
    <div :class="[
      'flex-1 flex flex-col min-h-0 transition-all',
      maximized ? 'p-0' : 'p-4 md:p-6 lg:p-8'
    ]">
      <AgentHeader v-if="!maximized" />

      <!-- Selector agente -->
      <div class="mb-4">
        <template v-if="agentName && agentName !== 'chat'">
          <span class="inline-block bg-indigo-700/30 text-indigo-200 px-4 py-2 rounded-lg font-bold text-lg">
            Chat de agente: {{ agentName.replace(/_/g, ' ') }}
          </span>
        </template>

        <template v-else>
          <div
            class="inline-flex flex-wrap items-center gap-2 bg-indigo-700/30 text-indigo-200 px-4 py-2 rounded-lg font-bold">
            <label class="mr-2">Selecciona agente:</label>
            <select v-model="selectedAgent" class="bg-700 border border-600 rounded px-2 py-1">
              <option v-for="agent in agents" :key="agent.name" :value="agent.name">
                {{ agent.name }}
              </option>
            </select>
            <button @click="goToAgentChat"
              class="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
              Ir al chat
            </button>
          </div>
        </template>
      </div>

      <!-- Chat + Aside -->
      <main v-if="agentName && agentName !== 'chat'" class="flex-1 min-h-0 flex flex-col md:flex-row gap-6">

        <!-- Chat -->
        <section class="flex-1 min-h-0 flex">
          <div ref="chatContainer" :class="[
            'relative flex flex-col bg-800 border border-700 transition-all duration-300',
            maximized
              ? 'fixed inset-0 z-[9999] rounded-none w-screen h-screen'
              : 'w-full max-w mx-auto rounded-xl p-4 md:p-8'
          ]">


            <!-- Botón Maximizar -->
            <button @click="toggleMaximize"
              class="absolute top-3 right-3 z-20 p-2 rounded-lg bg-700 hover:bg-600 transition">
              <component :is="maximized ? Minimize : Maximize2" class="w-5 h-5" />
            </button>

            <!-- Opciones superiores -->
            <div v-if="maximized" class="mb-4 bg-900 border border-700 rounded-lg">
              <button @click="showOptions = !showOptions"
                class="w-full flex items-center justify-between px-4 py-2 font-semibold hover:bg-800">
                Opciones de {{ agentName.replace(/_/g, ' ') }}
                <span>{{ showOptions ? '▲' : '▼' }}</span>
              </button>

              <div v-if="showOptions" class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-semibold mb-2">Últimos mensajes</h3>
                  <ul class="max-h-32 overflow-y-auto space-y-1 text-xs scrollbar-thin">
                    <li v-for="(msg, i) in lastChats" :key="i" class="flex gap-1">
                      <component :is="msg.role === 'user' ? User : Bot" class="w-3 h-3" />
                      <span class="font-bold">{{ msg.role }}:</span>
                      {{ msg.text }}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 class="font-semibold mb-2">Pasos</h3>
                  <ul class="text-xs space-y-1">
                    <li v-for="(step, i) in steps" :key="i">{{ step }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Mensajes -->
            <div class="flex-1 overflow-y-auto mb-4 p-2 rounded-lg bg-700/10 scrollbar-thin">
              <div v-for="(msg, i) in history" :key="i" class="mb-2 flex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                <div class="flex items-end gap-2" :class="msg.role === 'user' && 'flex-row-reverse'">
                  <component :is="msg.role === 'user' ? User : Bot" class="w-5 h-5 text-indigo-400" />
                  <span class="px-3 py-2 rounded-lg text-sm shadow"
                    :class="msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-700 text-100'">
                    {{ msg.text }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Input -->
            <form @submit.prevent="sendMessage" class="flex gap-2 m-4">
              <input v-model="input" placeholder="Escribe tu mensaje…"
                class="flex-1 bg-700 border border-600 rounded-lg px-4 py-2 focus:outline-none" />
              <button class="px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center gap-1">
                <Send class="w-4 h-4" /> Enviar
              </button>
            </form>

            <!-- Acciones -->
            <button @click="clearHistory"
              class="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-700 rounded hover:bg-indigo-500/10">
              <Sparkles class="w-5 h-5" /> Nuevo Chat
            </button>

          </div>
        </section>

        <!-- Aside -->
        <aside v-if="!maximized"
          class="w-full md:w-[420px] bg-800 border border-700 rounded-xl p-4 md:p-8 flex flex-col gap-8">
          <div>
            <h2 class="font-bold mb-4">Opciones de {{ agentName.replace(/_/g, ' ') }}</h2>
            <ul class="max-h-32 overflow-y-auto space-y-1 text-xs scrollbar-thin">
              <li v-for="(msg, i) in lastChats" :key="i" class="flex gap-1">
                <component :is="msg.role === 'user' ? User : Bot" class="w-3 h-3" />
                <span class="font-bold">{{ msg.role }}:</span>
                {{ msg.text }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Pasos</h3>
            <ul class="text-xs space-y-1">
              <li v-for="(step, i) in steps" :key="i">{{ step }}</li>
            </ul>
          </div>
        </aside>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AgentHeader from '../components/AgentHeader.vue'
import CompanySidebar from '../components/CompanySidebar.vue'
import { Bot, User, Send, Maximize2, Minimize, Sparkles } from 'lucide-vue-next'
import { mockAgents } from '../data/mockAgents.js'

const route = useRoute()
const agentName = route.params.agentName

const agents = ref(mockAgents)
const selectedAgent = ref(agents.value[0]?.name || '')
const input = ref('')

const history = ref([
  { role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
])

const lastChats = computed(() => history.value.slice(-5))

const steps = ref([
  'Recibido mensaje',
  'Procesando intención',
  'Generando respuesta',
  'Enviando respuesta'
])

const maximized = ref(false)
const showOptions = ref(true)

const currentView = ref('agents')
const currentSubtab = ref('chat-agente')
const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function toggleMaximize() {
  maximized.value = !maximized.value
}

watch(maximized, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

function sendMessage() {
  if (!input.value.trim()) return
  history.value.push({ role: 'user', text: input.value })
  setTimeout(() => {
    history.value.push({ role: 'agent', text: 'Respuesta simulada de ' + agentName })
  }, 700)
  input.value = ''
}

function clearHistory() {
  history.value = [{ role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }]
  input.value = ''
}

function goToAgentChat() {
  if (!selectedAgent.value) return
  const agentParam = selectedAgent.value.replace(/\s+/g, '_')
  window.location.href = `/company/${agentParam}`
}
</script>
