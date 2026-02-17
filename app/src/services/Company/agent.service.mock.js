import { AgentSocketWS } from './AgentSocketWS.js'

export function startAgentMock(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      // Simula error
      if (text.toLowerCase().includes('error')) {
        reject({
          response: {
            status: 400,
            data: {
              message: 'Solicitud inválida para este agente'
            }
          }
        })
        return
      }

      // Simula éxito
      resolve({
        status: 200,
        data: {
          ok: true,
          message: 'Agente iniciado'
        }
      })

    }, 600)
  })
}
