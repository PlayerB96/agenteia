import { ref, onMounted, onUnmounted } from 'vue'
import { MockAgentSocket } from './agentSocket.mock.js'
import { AgentSocketWS } from './AgentSocketWS.js'

export function useAgentSocket({ token, codeUser, fullName }) {
  const connected = ref(false)
  const messages = ref([])
  const isProcessing = ref(false)
  let socket = null

  const handleMessage = (msg) => {
    messages.value.unshift(msg)
    isProcessing.value = false
  }

  const connect = () => {
    socket = import.meta.env.DEV
      ? new MockAgentSocket(handleMessage)
      : new AgentSocketWS({
          onAgentMessage: handleMessage,
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

    socket.sendUserMessage(text)
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return {
    connected,
    messages,
    isProcessing,
    sendMessage
  }
}
