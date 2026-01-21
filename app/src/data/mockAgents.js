// Mock data for agents
import { markRaw } from 'vue'
import { MessageSquare, Mail, Smartphone, Webhook, Brain } from 'lucide-vue-next'

export const mockAgents = [
  {
    id: 1,
    name: 'Agente Soporte',
    description: 'Atención al cliente y servicio',
    active: true,
    features: [
      { name: 'WhatsApp', icon: markRaw(MessageSquare), enabled: true },
      { name: 'Email', icon: markRaw(Mail), enabled: true },
      { name: 'SMS', icon: markRaw(Smartphone), enabled: true }
    ],
    messagesHandled: 1247,
    avgResponseTime: '2.3s'
  },
  {
    id: 2,
    name: 'Agente Comercial',
    description: 'Agente para ventas y conversión',
    active: true,
    features: [
      { name: 'WhatsApp', icon: markRaw(MessageSquare), enabled: true },
      { name: 'Webhooks', icon: markRaw(Webhook), enabled: true },
      { name: 'Email', icon: markRaw(Mail), enabled: false }
    ],
    messagesHandled: 856,
    avgResponseTime: '1.8s'
  },
  {
    id: 3,
    name: 'Agente Marketing',
    description: 'Campañas y engagement',
    active: false,
    features: [
      { name: 'WhatsApp', icon: markRaw(MessageSquare), enabled: true },
      { name: 'Email', icon: markRaw(Mail), enabled: true }
    ],
    messagesHandled: 0,
    avgResponseTime: '-'
  },
  {
    id: 4,
    name: 'Agente Sistemas',
    description: 'Automatización e infrastructura',
    active: true,
    features: [
      { name: 'AI Custom', icon: markRaw(Brain), enabled: true },
      { name: 'Email', icon: markRaw(Mail), enabled: true },
      { name: 'SMS', icon: markRaw(Smartphone), enabled: false }
    ],
    messagesHandled: 9,
    avgResponseTime: '6.5s'
  }
]
