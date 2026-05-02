/** Código de compañía enviado en el query del WebSocket (backend). */
const WS_COMPANY_CODE = 'ln1'

export class AgentSocketWS {
  constructor({ onAgentMessage, token, codeUser, fullName, onStepChange}) {
    this.onAgentMessage = onAgentMessage
    this.token = token
    this.codeUser = codeUser
    this.fullName = fullName

    this.socket = null
    this.reconnectDelay = 5000
    this.maxRetries = 5
    this.retries = 0
    this.shouldReconnect = true
    this.onStepChange = onStepChange
  }

  connect() {
    const host = import.meta.env.VITE_BACKEND_HOST || '127.0.0.1'
    const port = import.meta.env.VITE_WS_CHAT_PORT || '8000'
    const url = `ws://${host}:${port}/ws/chat` +
      `?token=${encodeURIComponent(this.token)}` +
      `&code_user=${encodeURIComponent(this.codeUser)}` +
      `&fullname=${encodeURIComponent(this.fullName)}` +
      `&company=${encodeURIComponent(WS_COMPANY_CODE)}`

    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      console.log('WS conectado')
    }

    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.message) {
        this.onAgentMessage({
          role: 'agent',
          text: data.message,
          intent: data.intent,
          step: data.step,
          error: data.ui_state === 'error'
        })
      }

      if(this.onStepChange) {
        this.onStepChange(data)
      }
    }

    this.socket.onerror = (err) => {
      console.error('WS error', err)
    }

    this.socket.onclose = () => {
      console.log('WS desconectado')

      if (this.shouldReconnect && this.retries < this.maxRetries) {
        this.retries++
        setTimeout(() => this.connect(), this.reconnectDelay)
      }
    }
  }


  sendMessage(text) {
    const payload = {
        type: "message",
        message: text,
        params_required: null
    }
    this.socket.send(JSON.stringify(payload))//solo enviar texto, el backend se encarga de armar el mensaje completo con intent y step
  }
  
  sendMessage1(text) {
    const payload = {
        type: "close",
        message: "true",
        params_required: text
    }
    this.socket.send(JSON.stringify(payload))//solo enviar texto, el backend se encarga de armar el mensaje completo con intent y step
  }

  documentarAccion(text) {
    const data = JSON.parse(text)

    const payload = {
        type: data.type,
        message: data.message,
        params_required: data.params_required
    }
    this.socket.send(JSON.stringify(payload))
    console.log(JSON.stringify(payload))
  }
  disconnect() {
    this.shouldReconnect = false
    this.socket?.close()
  }
}
