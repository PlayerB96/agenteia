import { ref, onMounted, onUnmounted } from 'vue'
import { AgentSocketWS } from './AgentSocketWS.js'
import { AgentSocketWorker } from './AgentSocketWorker.js'

export function useAgentSocket({ token, codeUser, fullName }) {
  const connected = ref(false)
  const messages = ref([])
  const isProcessing = ref(false)
  let socket = null
  let socket2 = null
  const showQuickActions = ref(false)
  const quickActions = ref([])
  const selectedAction = ref(null)
  const messageError = ref(false)

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

    if(data.ui_state == 'error'){
      messageError.value = true;
    }else{
      messageError.value = false
    }
  }

  const handleMessage = (msg) => {
    messages.value.push(msg)
    isProcessing.value = false
  }

  const connect = () => {
    if (socket) return
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

  const connectSocketWorker = () => {
    if (socket2) return

    socket2 = new AgentSocketWorker({
      token,
      codeUser,
      fullName,
    })

    socket2.connectAgentSocket()
  }

  const disconnectAll = () => {
    socket?.disconnect()
    socket2?.disconnect()
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

  /*const sendMessageWorker = (text) => {
    if (!socket2) return

    isProcessing.value = true
    messages.value.unshift({
      role: 'user',
      text
    })

    console.log(text)
    socket2.sendMessageWorker(text)
  }*/


  onMounted(connect)
  onUnmounted(disconnectAll)

  return {
    selectedAction,
    showQuickActions,
    quickActions,
    connected,
    messages,
    isProcessing,
    sendMessage,
    connectSocketWorker,
    messageError
  }
}
