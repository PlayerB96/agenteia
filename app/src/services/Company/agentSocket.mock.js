export class MockAgentSocket {
  constructor(onAgentMessage) {
    this.onAgentMessage = onAgentMessage
    this.interval = null
  }

  connect() {
    console.log('WS mock conectado')

    // Mensajes automáticos del agente
    /*this.interval = setInterval(() => {
      this.onAgentMessage({
        role: 'agent',
        text: this.randomMessage()
      })
    }, 3000)*/
  }

  disconnect() {
    clearInterval(this.interval)
    console.log('WS mock desconectado')
  }

  sendUserMessage(text) {
    // Simula respuesta del agente
    setTimeout(() => {
      this.onAgentMessage({
        role: 'agent',
        text: this.randomMessage()
      })
    }, 1200)
  }

  randomMessage() {
    const msgs = [
      'Hola, estoy listo para ayudarte.',
      'Estoy procesando tu solicitud…',
      '¿Podrías darme más detalles?',
      'Perfecto, ya entendí 👍',
      'Déjame validar eso un momento…',
      'Estoy en camino, te voy a avisar cuando esté listo.',
      'Estoy trabajando en ello, te avisare cuando esté listo.',
      'No entendí lo que me dices, puedes repetirlo?.'
    ]
    return msgs[Math.floor(Math.random() * msgs.length)]
  }
}
