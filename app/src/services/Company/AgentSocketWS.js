export class AgentSocketWS {
  constructor({ onAgentMessage, token, codeUser, fullName }) {
    this.onAgentMessage = onAgentMessage
    this.token = token
    this.codeUser = codeUser
    this.fullName = fullName

    this.socket = null
    this.reconnectDelay = 5000
    this.maxRetries = 5
    this.retries = 0
    this.shouldReconnect = true
  }

  connect() {
    const url = `ws://172.16.0.240:8001/ws/chat` +
      `?token=${encodeURIComponent(this.token)}` +
      `&code_user=${encodeURIComponent(this.codeUser)}` +
      `&fullname=${encodeURIComponent(this.fullName)}`

    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      console.log('WS conectado')
    }

    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log('WS mensaje recibido', data)

      if (data.llm_response) {
        this.onAgentMessage({
          role: 'agent',
          text: data.llm_response,
          intent: data.intent,
          step: data.step
        })
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
    this.socket.send(JSON.stringify({
      message: text,
      code_user: this.codeUser,
      fullname: this.fullName,
      canal: 'ws'
    }))
  }

  disconnect() {
    this.shouldReconnect = false
    this.socket?.close()
  }
}
