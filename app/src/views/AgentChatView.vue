<style scoped>
.chat-enter-active {
  transition: all 0.75s ease;
}

.chat-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.chat-leave-active {
  transition: all 0.5s ease;
}

.chat-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
<template>
  <div class="flex min-h-screen font-sans bg-900 text-100">

    <!-- Mobile Menu Button -->
    <button @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-800 border border-700 rounded-lg text-white hover:bg-700">
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
    <main :class="[
      maximized ? 'lg:p-0 pt-16' : 'flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8'
    ]">
      <AgentHeader v-if="!maximized" />

      <!-- Selector agente -->
      <div class="mb-4">
        <template v-if="agentName && agentName !== 'chat'">
          <span class="inline-block bg-700 text-200 px-4 py-2 rounded-lg font-bold text-lg">
            Chat de agente: {{ agentName.replace(/_/g, ' ') }}
            {{ connected ? '🟢' : '🔴' }}
          </span>
        </template>

        <template v-else>
          <div
            class="inline-flex flex-wrap items-center gap-2 bg-700 text-200 px-4 py-2 rounded-lg font-bold">
            <label class="mr-2 text-200">Selecciona agente:</label>
            <select v-model="selectedAgent" class="bg-700 border border-600 rounded px-2 py-1">
              <option v-for="agent in agents" :key="agent.name" :value="agent.name">
                {{ agent.name }}
              </option>
            </select>
            <button @click="goToAgentChat"
              class="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
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
            'relative flex flex-col bg-800 border border-700',
            maximized
              ? 'fixed inset-0 z-[9999] rounded-none w-screen h-screen'
              : 'w-full max-w mx-auto rounded-xl p-4 md:p-8'
          ]" :style="maximized ? { width: '99vw', height: '99vh' } : {}"
          >


            <!-- Botón Maximizar -->
            <button @click="toggleMaximize"
              class="absolute top-3 right-3 z-20 p-2 rounded-lg bg-700 hover:bg-600">
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
                  <ul class="text-xs space-y-2">
                    <li v-for="(step, i) in steps" :key="i" class="flex inline-center gap-2">
                      <component
                        :is="stepIcon(step.status)"
                        class="w-4 h-4"
                        :class="{
                          'text-gray-500': step.status === 'pending',
                          'text-yellow-400 animate-spin': step.status === 'active',
                          'text-green-500': step.status === 'done'
                        }"
                      />
                      <span
                        :class="{
                          'text-300': step.status === 'pending',
                          'text-100 font-semibold': step.status === 'active',
                          'text-green-400': step.status === 'done'
                        }"
                      >
                        {{ step.label }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Mensajes -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto mb-4 p-2 rounded-lg bg-700/10 scrollbar-thin">
              <TransitionGroup
                name="chat"
                tag="div"
                class="flex-1 overflow-y-auto mb-4 p-2 rounded-lg bg-700/10 scrollbar-thin"
              >
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
              </TransitionGroup>
              <div v-if="isProcessing" class="flex items-center gap-2 text-sm text-400 px-2">
                <Bot class="w-4 h-4 animate-pulse" />
                <span>El agente está escribiendo…</span>
              </div>
            </div>
            <!-- Acciones rápidas -->
            <div
              v-if="showQuickActions"
              class="flex flex-wrap justify-center gap-2"
            >
              <button
                v-for="action in quickActions"
                :key="action.id"
                @click="runQuickAction(action)"
                class="flex items-center gap-2 px-3 py-2 rounded-full
                      bg-700 hover:bg-indigo-500/20
                      border border-600 text-sm"
              >
                <component :is="action.icon" class="w-4 h-4 text-indigo-400" />
                {{ action.label }}
              </button>
            </div>
            <!-- Input -->
            <form @submit.prevent="sendMessage" class="flex gap-2 m-4">
              <input v-model="input" placeholder="Escribe tu mensaje…" :disabled="isProcessing"
                class="flex-1 bg-700 border border-600 rounded-lg px-4 py-2 focus:outline-none" />
              <button type="submit" class="px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center gap-1">
                <Send class="w-4 h-4" /> <div class="hidden sm:inline">Enviar</div>
              </button>
            </form>

            <!-- Acciones -->
            <button @click="clearHistory"
              class="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-700 rounded hover:bg-indigo-500/10">
              <MessageCircle class="w-4 h-4 text-indigo-400"/> Nuevo Chat
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
            <ul class="text-xs space-y-2">
              <li v-for="step in steps" :key="step.id" class="flex items-center gap-2">
                <component
                  :is="stepIcon(step.status)"
                  class="w-4 h-4"
                  :class="{
                    'text-gray-500': step.status === 'pending',
                    'text-yellow-400 animate-spin': step.status === 'active',
                    'text-green-500': step.status === 'done'
                  }"
                />
                <span
                  :class="{
                    'text-300': step.status === 'pending',
                    'text-100 font-semibold': step.status === 'active',
                    'text-green-400': step.status === 'done'
                  }"
                >
                  {{ step.label }}
                </span>
              </li>
            </ul>
          </div>
          <!-- Chats recientes -->
          <div class="flex-1">
            <h3 class="font-semibold mb-2">Chats recientes</h3>

            <ul class="space-y-2 text-sm">
              <li
                v-for="chat in chatHistory"
                :key="chat.id"
                @click="loadChat(chat)"
                class="cursor-pointer p-2 rounded-lg
                      bg-700 hover:bg-indigo-500/10"
                :class="[
                  chat.id === activeChatId
                    ? 'bg-indigo-500/20 ring-1 ring-indigo-400'
                    : 'bg-700 hover:bg-indigo-500/10'
                ]"
              >
                <p class="font-medium truncate">{{ chat.title }}</p>
                <p class="text-xs text-400 flex items-center gap-1">
                  <MessageCircle class="w-3 h-3 text-indigo-400" />
                  {{ new Date(chat.createdAt).toLocaleTimeString() }}
                </p>
              </li>
            </ul>
          </div>
        </aside>

      </main>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AgentHeader from '../components/AgentHeader.vue'
import CompanySidebar from '../components/CompanySidebar.vue'
import { Bot, User, Send, Maximize2, Minimize, MessageCircle } from 'lucide-vue-next'
import { mockAgents } from '../data/mockAgents.js'
import { useAgentSocket } from '../services/Company/useAgentSocket.js'
import { MockAgentSocket } from '../services/Company/agentSocket.mock.js'
import { startAgentMock } from '../services/Company/agent.service.mock.js'
import { Clock, Loader2, CheckCircle } from 'lucide-vue-next'
import { FileText, FilePlus } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const {
  connected,
  messages,
  sendMessage: sendToSocket,
  isProcessing
} = useAgentSocket({
  token: 'secret123',
  codeUser: 'USER001',
  fullName: 'Juan Perez1'
})

const quickActions = ref([
  {
    id: 'documentar',
    label: 'Documentar',
    icon: FileText,
    payload: 'Documentar'
  },
  {
    id: 'generar',
    label: 'Generar documento',
    icon: FilePlus,
    payload: 'Generar documento'
  }
])

const showQuickActions = computed(() =>
  !isProcessing.value
)

const stepIcon = (status) => {
  if (status === 'pending') return Clock
  if (status === 'active') return Loader2
  if (status === 'done') return CheckCircle
}

//const { connected, messages, isProcessing, sendMessage: sendToSocket } = useAgentSocket()
const route = useRoute()
const agentName = route.params.agentName

const agents = ref(mockAgents)
const selectedAgent = ref(agents.value[0]?.name || '')
const input = ref('')
const currentStep = ref(0)

const history = ref([
  { role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
])
const chatHistory = ref([])
const activeChatId = ref(null)

const lastChats = computed(() => history.value.slice(-5))

const steps = ref([
  { id: 1, label: 'Recibiendo mensaje', status: 'pending' },
  { id: 2, label: 'Analizando intención', status: 'pending' },
  { id: 3, label: 'Procesando información', status: 'pending' },
  { id: 4, label: 'Generando respuesta', status: 'pending' },
  { id: 5, label: 'Respuesta enviada', status: 'pending' }
])


const maximized = ref(false)
const showOptions = ref(true)

const currentView = ref('agents')
const currentSubtab = ref('chat-agente')
const mobileMenuOpen = ref(false)

const messagesContainer = ref(null)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function toggleMaximize() {
  maximized.value = !maximized.value
}

watch(
  () => [maximized.value, isProcessing.value, messages.value],
  ([maximizedVal, isProcessingVal, newMessages]) => {
    document.body.style.overflowX = maximizedVal ? 'hidden' : 'auto'


    if (isProcessingVal) {
      currentStep.value = 0

      setTimeout(() => {
        steps.value[0].status = 'done'
        steps.value[1].status = 'active'
      }, 300)

      setTimeout(() => {
        steps.value[1].status = 'done'
        steps.value[2].status = 'active'
      }, 700)

      setTimeout(() => {
        steps.value[2].status = 'done'
        steps.value[3].status = 'active'
      }, 1100)

      setTimeout(() => {
        steps.value[3].status = 'done'
        steps.value[4].status = 'active'
      }, 1500)

      setTimeout(() => {
        steps.value[4].status = 'done'
        currentStep.value = 5
      }, 1900)

      //regresar todo a pending
      setTimeout(() => {
        steps.value.forEach(s => s.status = 'pending')
        currentStep.value = 0
      }, 5000)
    }

    newMessages.forEach(msg => {
      history.value.push(msg)
    })

    messages.value.length = 0 // limpiamos el buffer
  }
)

watch(
  () => history.value.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

function startProcessingSteps() {
  steps.value.forEach(s => s.status = 'pending')
  steps.value[0].status = 'pending'
}

async function sendMessage() {
  if (isProcessing.value) return

  const text = input.value.trim()
  if (!text) return

  // recién aquí conectas / usas socket
  sendToSocket(text)
  
  input.value = ''

  try {
    isProcessing.value = true

    const res = await startAgentMock(text)

    startProcessingSteps()


  } catch (err) {
    isProcessing.value = false

    history.value.push({
      role: 'agent',
      text: err.response?.data?.message || 'Ocurrió un error al iniciar el agente'
    })

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'No se pudo procesar la solicitud'
    })
  }
}

function clearHistory() {
  persistCurrentChat()
  if (history.value.length > 1) {
    if (!activeChatId.value){
      const chatId = Date.now() 
      chatHistory.value.unshift({
        id: chatId,
        title: getChatTitle(history.value),
        messages: [...history.value],
        createdAt: new Date()
      })
    }

    // solo 3 recientes
    chatHistory.value = chatHistory.value.slice(0, 3)
  }

  activeChatId.value = null
  history.value = [
    { role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
  ]

  input.value = ''
  steps.value.forEach(s => s.status = 'pending')
}

function goToAgentChat() {
  if (!selectedAgent.value) return
  const agentParam = selectedAgent.value.replace(/\s+/g, '_')
  window.location.href = `/company/${agentParam}`
}

async function runQuickAction(action) {
  sendToSocket(action.payload)

  await nextTick()
  scrollToBottom(false)
}

function scrollToBottom(smooth = true) {
  if (!messagesContainer.value) return

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

function getChatTitle(messages) {
  const firstUserMsg = messages.find(m => m.role === 'user')
  return firstUserMsg
    ? firstUserMsg.text.slice(0, 30)
    : 'Nuevo chat'
}

function loadChat(chat) {
  activeChatId.value = chat.id
  history.value = [...chat.messages]
}

function persistCurrentChat() {
  if (!activeChatId.value || history.value.length <= 1) return

  const chat = chatHistory.value.find(c => c.id === activeChatId.value)
  if (chat) {
    chat.messages = [...history.value]
    chat.updatedAt = new Date()
  }
}

</script>
