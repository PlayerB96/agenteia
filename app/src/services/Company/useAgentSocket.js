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
  const selectedAction = ref(null)

  const handleStepChange = (data) => {
    showQuickActions.value =
      data.ui_controls.show_action_buttons

    const actions = data.metadata_public?.matched_actions??[]
    console.log(data)
    quickActions.value = actions.map(opt => ({
      id: opt.id,
      label: opt.id,
      icon: '',
      payload: opt.id
    }))
    
    //capturar selected_action
    if(data.ui_controls?.show_param_form) {
      selectedAction.value = data.metadata_public?.selected_action
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
    selectedAction,
    showQuickActions,
    quickActions,
    connected,
    messages,
    isProcessing,
    sendMessage
  }
}
