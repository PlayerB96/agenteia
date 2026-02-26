export class AgentSocketWorker {
  constructor({ onMessage, token, codeUser, fullName }) {
    this.token = token
    this.codeUser = codeUser
    this.fullName = fullName
    this.onMessage = onMessage
  }
  connectAgentSocket() {
    const url =
      `ws://172.16.0.240:8001/ws/documentar_modulo` +
      `?token=${encodeURIComponent(this.token)}` +
      `&code_user=${encodeURIComponent(this.codeUser)}` +
      `&fullname=${encodeURIComponent(this.fullName)}`

    this.socketWorker = new WebSocket(url)

    this.socketWorker.onopen = () => {
      console.log('[socket2] conectado OK')
    }

    this.socketWorker.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('[socket2]', data)

      this.onMessage?.(data)
    }
  }
}
