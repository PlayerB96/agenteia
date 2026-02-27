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
  const showExecuteButton = ref(false)
  const showChat = ref(true)
  const showParamForm = ref(false)
  const lastExecutedParams = ref([])
  const currentTaskId = ref(null)
  const documentUrl = ref('')
  const mostrarDocumento = ref(false)
  const tiempoRestante = ref('')
  const documentoExpirado = ref(false)
  let expirationTimer = null

  const handleStepChange = (data) => {
    if(data.ui_controls?.show_action_buttons) {
      showQuickActions.value = true
    }else{
      showQuickActions.value = false
    }

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
      showParamForm.value = true
      selectedAction.value = data.metadata_public?.selected_action
    }else{
      showParamForm.value = false
    }

    //mostrar chat
    if(data.ui_controls?.show_chat) {
      showChat.value = true
    }else{
      showChat.value = false
    }

    //mostrar error
    if(data.ui_state == 'error'){
      messageError.value = true;
    }else{
      messageError.value = false
    }

    //mostrar bot
    if(data.ui_controls?.show_execute_button){
      showExecuteButton.value = true
      //llenar required_params nuevamente
      lastExecutedParams.value = data.required_params ?? []
    }else{
      showExecuteButton.value = false
    }

    if(data.task_id) {
      currentTaskId.value = data.task_id
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
    if (socket2?.socketWorker?.readyState === WebSocket.OPEN) {
      console.log('socket2 ya conectado')
      return
    }
    socket2 = new AgentSocketWorker({
      token,
      codeUser,
      fullName,
      onMessage: handleWorkerMessage,
    })

    socket2.connectAgentSocket()
  }

  const disconnectAll = () => {
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

  const documentarWorker = (text) => {
    if (!socket) return

    isProcessing.value = true
    messages.value.unshift({
      role: 'user',
      text
    })

    socket.documentarAccion(text)
  }

  const startExpirationCountdown = (createdAt, secondsToExpire) => {
    const expiresAt = createdAt.getTime() + secondsToExpire * 1000

    // limpiar si ya existía
    if (expirationTimer) {
      clearInterval(expirationTimer)
    }

    expirationTimer = setInterval(() => {
      const remainingMs = expiresAt - Date.now()

      if (remainingMs <= 0) {
        clearInterval(expirationTimer)
        tiempoRestante.value = 'Expirado'
        documentoExpirado.value = true
        return
      }

      const totalSeconds = Math.floor(remainingMs / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60

      tiempoRestante.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
    }, 1000)
  }
  
  const handleWorkerMessage = (data) => {
    if (!data || typeof data !== 'object') return
    if (!data.url) return

    console.log('Documento listo:', data.url)

    const createdAt = new Date(data.created_at.replace(' ', 'T'))

    documentUrl.value = data.url
    mostrarDocumento.value = true
    isProcessing.value = false
    documentoExpirado.value = false

    startExpirationCountdown(createdAt, data.tiempo_expiracion)
  }


  onMounted(connect)
  onMounted(connectSocketWorker)
  onUnmounted(disconnectAll)
  onUnmounted(() => {
    if (expirationTimer) {
      clearInterval(expirationTimer)
    }
  })

  return {
    selectedAction,
    showQuickActions,
    quickActions,
    connected,
    messages,
    isProcessing,
    sendMessage,
    connectSocketWorker,
    documentarWorker,
    messageError,
    showExecuteButton,
    showChat,
    lastExecutedParams,
    showParamForm,
    currentTaskId,
    documentUrl,
    mostrarDocumento,
    handleWorkerMessage,
    tiempoRestante,
    documentoExpirado,
  }
}
