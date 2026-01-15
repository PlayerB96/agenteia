<script setup>
import { ref, watch } from 'vue'
import { ClipboardList, Database, Settings, X } from 'lucide-vue-next'
import FeaturesTabs from '../components/FeaturesTabs.vue'
import FeatureAccordion from '../components/FeatureAccordion.vue'

const props = defineProps({
  company: Object,
  saving: Boolean
})

const emit = defineEmits(['close', 'save'])

const activeTab = ref('marketing')

const getEmptyModalData = () => ({
  id: null,
  name: '',
  domain: '',
  active: true,
  database: {
    host: '',
    port: '3306',
    name: '',
    user: ''
  },
  featureCategories: {
    marketing: {
      comunicacion: {
        enabled: false,
        features: {
          whatsapp: { enabled: false, config: { apiKey: '', templateId: '' } },
          email: { enabled: false, config: { provider: 'sendgrid', apiKey: '' } },
          sms: { enabled: false, config: { provider: 'twilio' } }
        }
      },
      analisis: {
        enabled: false,
        features: {
          recomendaciones: { enabled: false, config: { algorithm: 'hybrid' } },
          segmentacion: { enabled: false, config: { autoUpdate: true } },
          pricing: { enabled: false, config: { strategy: 'dynamic' } }
        }
      }
    },
    comercial: {
      atencion: {
        enabled: false,
        features: {
          chatbot: { enabled: false, config: { channels: ['web'], language: 'es' } },
          reclamos: { enabled: false, config: { autoEscalate: true } },
          postventa: { enabled: false, config: { surveyDelay: '24h' } }
        }
      },
      ventas: {
        enabled: false,
        features: {
          leadScoring: { enabled: false, config: { threshold: 70 } },
          crossSelling: { enabled: false, config: { maxSuggestions: 3 } },
          carrito: { enabled: false, config: { sequence: 'aggressive' } }
        }
      }
    },
    sistemas: {
      inventario: {
        enabled: false,
        features: {
          prediccion: { enabled: false, config: { horizon: '30d' } },
          alertas: { enabled: false, config: { minStock: 10 } },
          compras: { enabled: false, config: { approvalRequired: true } }
        }
      },
      logistica: {
        enabled: false,
        features: {
          tracking: { enabled: false, config: { provider: 'dhl' } },
          rutas: { enabled: false, config: { optimization: 'distance' } },
          rma: { enabled: false, config: { autoApprove: false } }
        }
      }
    },
    analisis: {
      bi: {
        enabled: false,
        features: {
          dashboards: { enabled: false, config: { refreshRate: '1h' } },
          sentimientos: { enabled: false, config: { sources: ['twitter', 'facebook'] } },
          tendencias: { enabled: false, config: { model: 'lstm' } }
        }
      }
    },
    ecommerce: {
      compra: {
        enabled: false,
        features: {
          asistente: { enabled: false, config: { personality: 'friendly' } },
          busqueda: { enabled: false, config: { semantic: true } },
          comparador: { enabled: false, config: { attributes: ['price', 'specs'] } }
        }
      },
      omnicanal: {
        enabled: false,
        features: {
          sync: { enabled: false, config: { interval: '5m' } },
          clickCollect: { enabled: false, config: { locations: [] } },
          fidelizacion: { enabled: false, config: { pointsRatio: 0.1 } }
        }
      }
    }
  }
})

const modalData = ref(getEmptyModalData())

watch(() => props.company, (newCompany) => {
  if (newCompany) {
    // Deep copy to avoid reference issues
    const data = JSON.parse(JSON.stringify(newCompany))
    
    // Ensure all structure exists even if old data format
    const empty = getEmptyModalData()
    
    if (!data.featureCategories) {
      data.featureCategories = empty.featureCategories
      
      // Ensure database structure exists
      if (!data.database) {
        data.database = empty.database
      }

      // Map legacy features if they exist and is Array
      if (Array.isArray(data.features)) {
        console.log('Features found (Array):', data.features)
        
        data.features.forEach(f => {
          const name = f.name.toLowerCase()
          
          if (name === 'whatsapp') {
            data.featureCategories.marketing.comunicacion.enabled = true
            data.featureCategories.marketing.comunicacion.features.whatsapp = {
              enabled: f.enabled,
              config: { apiKey: '', templateId: '' }
            }
          }
          
          if (name === 'email') {
            data.featureCategories.marketing.comunicacion.enabled = true
            data.featureCategories.marketing.comunicacion.features.email = {
              enabled: f.enabled,
              config: { provider: 'sendgrid', apiKey: '' }
            }
          }
          
          if (name === 'sms') {
            data.featureCategories.marketing.comunicacion.enabled = true
            data.featureCategories.marketing.comunicacion.features.sms = {
              enabled: f.enabled,
              config: { provider: 'twilio' }
            }
          }
          
          if (name === 'ai custom' || name === 'aimodel') {
            data.featureCategories.ecommerce.compra.enabled = true
            data.featureCategories.ecommerce.compra.features.asistente = {
              enabled: f.enabled,
              config: { personality: 'friendly' }
            }
          }
        })
      }
    } else {
       // Merge with empty to ensure all new fields prevent undefined errors if schema changed
       if (!data.database) {
          data.database = empty.database
       }
    }

    modalData.value = data
  } else {
    modalData.value = getEmptyModalData()
  }
}, { immediate: true })

const handleSave = () => {
  emit('save', {
    id: modalData.value.id ?? null,
    name: modalData.value.name,
    domain: modalData.value.domain,
    active: modalData.value.active,
    database: {
      host: modalData.value.database.host,
      port: modalData.value.database.port,
      name: modalData.value.database.name,
      user: modalData.value.database.user
    }
  })
}

const updateSubcategory = (category, subcategory, field, value) => {
  if (field === 'enabled') {
    modalData.value.featureCategories[category][subcategory].enabled = value
  } else if (field === 'features') {
    modalData.value.featureCategories[category][subcategory].features = value
  }
}
</script>

<template>
    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
      <header class="mb-6 md:mb-8 flex justify-between items-start">
        zzzz
      </header>
  </main>
</template>
