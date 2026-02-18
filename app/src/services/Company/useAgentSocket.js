import { ref, onMounted, onUnmounted } from 'vue'
import { MockAgentSocket } from './agentSocket.mock.js'
import { AgentSocketWS } from './AgentSocketWS.js'

export function useAgentSocket({ token, codeUser, fullName }) {
  const connected = ref(false)
  const messages = ref([])
  const isProcessing = ref(false)
  let socket = null
  const showQuickActions = ref(false)
  const quickActions = ref([])

  const handleStepChange = (step, data) => {
    showQuickActions.value = step === 'waiting_user_input'

    if (showQuickActions.value && data.quick_actions) {
      quickActions.value = data.quick_actions
    }
  }

  const handleMessage = (msg) => {
    messages.value.push(msg)
    isProcessing.value = false
  }

  const connect = () => {
    socket = new AgentSocketWS({
      onAgentMessage: handleMessage,
      onStepChange: handleStepChange,
      token,
      codeUser,
      fullName
    })

    socket.connect()
    connected.value = true
  }

  const disconnect = () => {
    socket?.disconnect()
    connected.value = false
  }

  const sendMessage = (text) => {
    if (!socket) return

    isProcessing.value = true
    messages.value.unshift({
      role: 'user',
      text
    })

    socket.sendMessage(text)
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return {
    showQuickActions,
    connected,
    messages,
    isProcessing,
    sendMessage
  }
}
