export class MockAgentSocket {
  constructor(onAgentMessage) {
    this.onAgentMessage = onAgentMessage
    this.interval = null
  }

  connect() {
    console.log('WS mock conectado')
  }

  disconnect() {
    clearInterval(this.interval)
    console.log('WS mock desconectado')
  }
}
