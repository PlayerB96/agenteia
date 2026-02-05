import { ref, onMounted, onUnmounted } from 'vue'
import { MockAgentSocket } from './agentSocket.mock.js'

export function useAgentSocket() {
  const connected = ref(false)
  const messages = ref([])
  const isProcessing = ref(false)
  let socket = null

  const handleMessage = (msg) => {
    messages.value.unshift(msg)
    isProcessing.value = false
  }

  const connect = () => {
    socket = new MockAgentSocket(handleMessage)
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
