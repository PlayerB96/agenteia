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
      //activar socket2 en el backend
      this.socketWorker.send(JSON.stringify({
        task_id: '89784498-fbe6-4c8b-8a46-b84d392fbdb4'
      }))
      //traer datos del socket2
      console.log('[socket2] conectado y listo para recibir')
    }

    this.socketWorker.onmessage = (event) => {
      const data = JSON.parse(event.data)

      this.onMessage?.(data)
    }
  }
}
