export class AgentSocketWorker {
  constructor({ token, codeUser, fullName }) {
    this.token = token
    this.codeUser = codeUser
    this.fullName = fullName
  }
  connectAgentSocket() {
    const url =
      `ws://172.16.0.240:8001/ws/documentar` +
      `?token=${encodeURIComponent(this.token)}` +
      `&code_user=${encodeURIComponent(this.codeUser)}` +
      `&fullname=${encodeURIComponent(this.fullName)}`

    this.socketWorker = new WebSocket(url)
    
    this.socketWorker.onopen = () => {
      console.log('Worker WS conectado')
      this.sendMessageWorker(text)
    }

    this.socketWorker.onmessage = (event) => {
      console.log(event)
      /*const data = JSON.parse(event.data)
      
      this.handleAgentEvent(data)

      // 🔹 cuando todo esté done → pedir archivo
      if (this.isProcesoCompleto(data.estado)) {
        ws.close()
        this.obtenerDocumento(payload)
      }*/
    }
  }
  
  sendMessageWorker(text) {
    console.log('todo bien worker: ',text)
    this.socketWorker.send(text)//solo enviar texto, el backend se encarga de armar el mensaje completo con intent y step
  }
}
