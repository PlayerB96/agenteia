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

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.onAgentMessage({
          role: 'agent',
          text: data.message ?? data.text ?? event.data
        })
      } catch {
        this.onAgentMessage({
          role: 'agent',
          text: event.data
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

  sendUserMessage(text) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        role: 'user',
        text
      }))
    }
  }

  disconnect() {
    this.shouldReconnect = false
    this.socket?.close()
  }
}
