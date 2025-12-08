<script setup>
import { ref, watch } from 'vue'
import { ClipboardList, Database, Settings, X } from 'lucide-vue-next'
import FeaturesTabs from './FeaturesTabs.vue'
import FeatureAccordion from './FeatureAccordion.vue'

const props = defineProps({
  company: Object
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
      console.log('Migrating legacy data for company:', data.name)
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
  emit('save', modalData.value)
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
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4" @click.self="emit('close')">
    <div class="bg-slate-800 border border-slate-700 rounded-xl md:rounded-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
      <div class="p-4 md:p-6 lg:p-8 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800 z-10">
        <h2 class="text-lg md:text-xl lg:text-2xl font-bold">{{ modalData.id ? 'Editar Empresa' : 'Nueva Empresa' }}</h2>
        <button class="text-slate-400 hover:text-white transition-colors" @click="emit('close')">
          <X class="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div class="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <!-- Información General -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-indigo-400 flex items-center gap-2">
            <ClipboardList class="w-4 h-4 md:w-5 md:h-5" />
            Información General
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300">Nombre de la Empresa</label>
              <input 
                type="text" 
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500" 
                v-model="modalData.name"
                placeholder="Ej: Tech Solutions Inc."
              >
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300">Dominio</label>
              <input 
                type="text" 
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500" 
                v-model="modalData.domain"
                placeholder="Ej: techsolutions.com"
              >
            </div>
          </div>
        </div>

        <!-- Base de Datos -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-indigo-400 flex items-center gap-2">
            <Database class="w-4 h-4 md:w-5 md:h-5" />
            Base de Datos
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300">Host</label>
              <input type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" v-model="modalData.database.host" placeholder="localhost">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300">Puerto</label>
              <input type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" v-model="modalData.database.port" placeholder="3306">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300">Nombre BD</label>
              <input type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" v-model="modalData.database.name" placeholder="db_name">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300">Usuario</label>
              <input type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" v-model="modalData.database.user" placeholder="root">
            </div>
          </div>
        </div>

        <!-- Funcionalidades por Categoría -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-indigo-400 flex items-center gap-2">
            <Settings class="w-4 h-4 md:w-5 md:h-5" />
            Funcionalidades e Inteligencia
          </h3>
          
          <FeaturesTabs 
            :active-tab="activeTab" 
            @update:activeTab="activeTab = $event" 
          />

          <!-- MARKETING TABS -->
          <div v-if="activeTab === 'marketing'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FeatureAccordion 
              title="Comunicación Automatizada"
              :enabled="modalData.featureCategories.marketing.comunicacion.enabled"
              :features="modalData.featureCategories.marketing.comunicacion.features"
              @update:enabled="updateSubcategory('marketing', 'comunicacion', 'enabled', $event)"
              @update:features="updateSubcategory('marketing', 'comunicacion', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                <div class="space-y-4">
                  <!-- WhatsApp -->
                  <div class="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div class="flex items-center justify-between mb-3">
                      <span class="font-medium">Campañas WhatsApp/Telegram</span>
                      <input type="checkbox" :checked="features.whatsapp?.enabled" @change="updateFeature('whatsapp', 'enabled', $event.target.checked)">
                    </div>
                    <div v-if="features.whatsapp?.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-indigo-500/30">
                      <input type="text" placeholder="API Key" class="bg-slate-800 border-slate-600 rounded px-3 py-1.5 text-sm w-full" :value="features.whatsapp.config.apiKey" @input="updateFeature('whatsapp', 'apiKey', $event.target.value)">
                      <input type="text" placeholder="Template ID" class="bg-slate-800 border-slate-600 rounded px-3 py-1.5 text-sm w-full" :value="features.whatsapp.config.templateId" @input="updateFeature('whatsapp', 'templateId', $event.target.value)">
                    </div>
                  </div>
                  <!-- Email -->
                  <div class="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div class="flex items-center justify-between mb-3">
                      <span class="font-medium">Email Marketing Inteligente</span>
                      <input type="checkbox" :checked="features.email?.enabled" @change="updateFeature('email', 'enabled', $event.target.checked)">
                    </div>
                    <div v-if="features.email?.enabled" class="pl-4 border-l-2 border-indigo-500/30">
                      <select class="bg-slate-800 border-slate-600 rounded px-3 py-1.5 text-sm w-full" :value="features.email.config.provider" @change="updateFeature('email', 'provider', $event.target.value)">
                        <option value="sendgrid">SendGrid</option>
                        <option value="aws">AWS SES</option>
                        <option value="mailgun">Mailgun</option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>
            </FeatureAccordion>

            <FeatureAccordion 
              title="Análisis y Personalización"
              :enabled="modalData.featureCategories.marketing.analisis.enabled"
              :features="modalData.featureCategories.marketing.analisis.features"
              @update:enabled="updateSubcategory('marketing', 'analisis', 'enabled', $event)"
              @update:features="updateSubcategory('marketing', 'analisis', 'features', $event)"
            >
               <template #default="{ updateFeature, features }">
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-2">
                    <span>Recomendación de Productos</span>
                    <input type="checkbox" :checked="features.recomendaciones?.enabled" @change="updateFeature('recomendaciones', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Segmentación de Clientes</span>
                    <input type="checkbox" :checked="features.segmentacion?.enabled" @change="updateFeature('segmentacion', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Optimización de Precios</span>
                    <input type="checkbox" :checked="features.pricing?.enabled" @change="updateFeature('pricing', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>
          </div>

          <!-- COMERCIAL TABS -->
          <div v-if="activeTab === 'comercial'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FeatureAccordion 
              title="Atención al Cliente"
              :enabled="modalData.featureCategories.comercial.atencion.enabled"
              :features="modalData.featureCategories.comercial.atencion.features"
               @update:enabled="updateSubcategory('comercial', 'atencion', 'enabled', $event)"
              @update:features="updateSubcategory('comercial', 'atencion', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                <div class="space-y-3">
                   <div class="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium">Chatbot Multicanal 24/7</span>
                      <input type="checkbox" :checked="features.chatbot?.enabled" @change="updateFeature('chatbot', 'enabled', $event.target.checked)">
                    </div>
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Gestión de Reclamos Auto</span>
                    <input type="checkbox" :checked="features.reclamos?.enabled" @change="updateFeature('reclamos', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>

             <FeatureAccordion 
              title="Ventas y Conversión"
              :enabled="modalData.featureCategories.comercial.ventas.enabled"
              :features="modalData.featureCategories.comercial.ventas.features"
               @update:enabled="updateSubcategory('comercial', 'ventas', 'enabled', $event)"
              @update:features="updateSubcategory('comercial', 'ventas', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                <div class="space-y-2">
                   <div class="flex items-center justify-between p-2">
                    <span>Lead Scoring</span>
                    <input type="checkbox" :checked="features.leadScoring?.enabled" @change="updateFeature('leadScoring', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Cross-selling / Up-selling</span>
                    <input type="checkbox" :checked="features.crossSelling?.enabled" @change="updateFeature('crossSelling', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Recuperación de Carritos</span>
                    <input type="checkbox" :checked="features.carrito?.enabled" @change="updateFeature('carrito', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>
          </div>

          <!-- SISTEMAS TABS -->
           <div v-if="activeTab === 'sistemas'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <FeatureAccordion 
              title="Gestión de Inventario"
              :enabled="modalData.featureCategories.sistemas.inventario.enabled"
              :features="modalData.featureCategories.sistemas.inventario.features"
               @update:enabled="updateSubcategory('sistemas', 'inventario', 'enabled', $event)"
              @update:features="updateSubcategory('sistemas', 'inventario', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                 <div class="space-y-2">
                   <div class="flex items-center justify-between p-2">
                    <span>Predicción de Demanda</span>
                    <input type="checkbox" :checked="features.prediccion?.enabled" @change="updateFeature('prediccion', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Alertas de Stock</span>
                    <input type="checkbox" :checked="features.alertas?.enabled" @change="updateFeature('alertas', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Optimización de Compras</span>
                    <input type="checkbox" :checked="features.compras?.enabled" @change="updateFeature('compras', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>

             <FeatureAccordion 
              title="Logística y Envíos"
              :enabled="modalData.featureCategories.sistemas.logistica.enabled"
              :features="modalData.featureCategories.sistemas.logistica.features"
               @update:enabled="updateSubcategory('sistemas', 'logistica', 'enabled', $event)"
              @update:features="updateSubcategory('sistemas', 'logistica', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                 <div class="space-y-2">
                   <div class="flex items-center justify-between p-2">
                    <span>Tracking Inteligente (WhatsApp/SMS)</span>
                    <input type="checkbox" :checked="features.tracking?.enabled" @change="updateFeature('tracking', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Optimización de Rutas</span>
                    <input type="checkbox" :checked="features.rutas?.enabled" @change="updateFeature('rutas', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>
           </div>

           <!-- E-COMMERCE TABS -->
           <div v-if="activeTab === 'ecommerce'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <FeatureAccordion 
              title="Experiencia de Compra"
              :enabled="modalData.featureCategories.ecommerce.compra.enabled"
              :features="modalData.featureCategories.ecommerce.compra.features"
               @update:enabled="updateSubcategory('ecommerce', 'compra', 'enabled', $event)"
              @update:features="updateSubcategory('ecommerce', 'compra', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                 <div class="space-y-3">
                   <div class="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium">Asistente de Compras IA</span>
                      <input type="checkbox" :checked="features.asistente?.enabled" @change="updateFeature('asistente', 'enabled', $event.target.checked)">
                    </div>
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Búsqueda Inteligente (NLP)</span>
                    <input type="checkbox" :checked="features.busqueda?.enabled" @change="updateFeature('busqueda', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>

             <FeatureAccordion 
              title="Omnicanalidad"
              :enabled="modalData.featureCategories.ecommerce.omnicanal.enabled"
              :features="modalData.featureCategories.ecommerce.omnicanal.features"
               @update:enabled="updateSubcategory('ecommerce', 'omnicanal', 'enabled', $event)"
              @update:features="updateSubcategory('ecommerce', 'omnicanal', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                <div class="flex items-center justify-between p-2">
                    <span>Sincronización Online/Offline</span>
                    <input type="checkbox" :checked="features.sync?.enabled" @change="updateFeature('sync', 'enabled', $event.target.checked)">
                </div>
                 <div class="flex items-center justify-between p-2">
                    <span>Click & Collect</span>
                    <input type="checkbox" :checked="features.clickCollect?.enabled" @change="updateFeature('clickCollect', 'enabled', $event.target.checked)">
                </div>
                <div class="flex items-center justify-between p-2">
                    <span>Programa de Fidelización</span>
                    <input type="checkbox" :checked="features.fidelizacion?.enabled" @change="updateFeature('fidelizacion', 'enabled', $event.target.checked)">
                </div>
              </template>
            </FeatureAccordion>
           </div>
        
            <!-- ANALISIS TABS -->
           <div v-if="activeTab === 'analisis'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <FeatureAccordion 
              title="Business Intelligence y Reportes"
              :enabled="modalData.featureCategories.analisis.bi.enabled"
              :features="modalData.featureCategories.analisis.bi.features"
               @update:enabled="updateSubcategory('analisis', 'bi', 'enabled', $event)"
              @update:features="updateSubcategory('analisis', 'bi', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                 <div class="space-y-3">
                   <div class="flex items-center justify-between p-2">
                    <span>Dashboards Automáticos (KPIs)</span>
                    <input type="checkbox" :checked="features.dashboards?.enabled" @change="updateFeature('dashboards', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Análisis de Sentimientos (RRSS)</span>
                    <input type="checkbox" :checked="features.sentimientos?.enabled" @change="updateFeature('sentimientos', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Predicción de Tendencias</span>
                    <input type="checkbox" :checked="features.tendencias?.enabled" @change="updateFeature('tendencias', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>
           </div>

        </div>
      </div>

      <div class="p-4 md:p-6 lg:p-8 border-t border-slate-700 bg-slate-800 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 sticky bottom-0">
        <button 
          class="w-full sm:w-auto px-4 md:px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors order-2 sm:order-1"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button 
          class="w-full sm:w-auto px-4 md:px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all order-1 sm:order-2"
          @click="handleSave"
        >
          {{ modalData.id ? 'Guardar Cambios' : 'Crear Empresa' }}
        </button>
      </div>
    </div>
  </div>
</template>
