// Mock data for agents
import { markRaw } from 'vue'
import { MessageSquare, Mail, Smartphone, Webhook, Brain } from 'lucide-vue-next'

export const mockAgents = [
  {
    id: 1,
    name: 'Agente de Soporte',
    description: 'Atiende consultas de clientes 24/7',
    active: true,
    features: [
      { name: 'WhatsApp', icon: markRaw(MessageSquare), enabled: true },
      { name: 'Email', icon: markRaw(Mail), enabled: true },
      { name: 'SMS', icon: markRaw(Smartphone), enabled: false }
    ],
    messagesHandled: 1247,
    avgResponseTime: '2.3s'
  },
  {
    id: 2,
    name: 'Agente de Ventas',
    description: 'Ayuda con el proceso de compra',
    active: true,
    features: [
      { name: 'WhatsApp', icon: markRaw(MessageSquare), enabled: true },
      { name: 'Webhooks', icon: markRaw(Webhook), enabled: true }
    ],
    messagesHandled: 856,
    avgResponseTime: '1.8s'
  },
  {
    id: 3,
    name: 'Agente Personalizado',
    description: 'Configuración avanzada con IA',
    active: false,
    features: [
      { name: 'AI Custom', icon: markRaw(Brain), enabled: true },
      { name: 'Email', icon: markRaw(Mail), enabled: true }
    ],
    messagesHandled: 0,
    avgResponseTime: '-'
  }
]
