const WS_COMPANY_CODE = 'ln1'

export class AgentSocketWorker {
  constructor({ onMessage, token, codeUser, fullName }) {
    this.token = token
    this.codeUser = codeUser
    this.fullName = fullName
    this.onMessage = onMessage
  }
  connectAgentSocket() {
    const host = import.meta.env.VITE_BACKEND_HOST || '127.0.0.1'
    const port = import.meta.env.VITE_BACKEND_PORT || '8001'
    const url =
      `ws://${host}:${port}/ws/documentar_modulo` +
      `?token=${encodeURIComponent(this.token)}` +
      `&code_user=${encodeURIComponent(this.codeUser)}` +
      `&fullname=${encodeURIComponent(this.fullName)}` +
      `&company=${encodeURIComponent(WS_COMPANY_CODE)}`

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
