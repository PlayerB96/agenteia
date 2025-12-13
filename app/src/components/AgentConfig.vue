<script setup>
import { ref } from "vue";
import { Plus, Power, PowerOff, Edit, Trash2 } from "lucide-vue-next";

const props = defineProps({
  agents: Array,
});

const showAddModal = ref(false);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-white">Mis Agentes IA</h2>
      <button
        @click="showAddModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105"
      >
        <Plus class="w-4 h-4" />
        Nuevo Agente
      </button>
    </div>

    <!-- Agents Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="agent in agents"
        :key="agent.id"
        class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white mb-1">
              {{ agent.name }}
            </h3>
            <p class="text-sm text-slate-400">{{ agent.description }}</p>
          </div>
          <div
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              agent.active
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600',
            ]"
          >
            {{ agent.active ? "Activo" : "Inactivo" }}
          </div>
        </div>

        <!-- Features -->
        <div class="flex flex-wrap gap-2 mb-4">
          <div
            v-for="feature in agent.features"
            :key="feature.name"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs',
              feature.enabled
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                : 'bg-slate-700/30 text-slate-500 border border-slate-600/30',
            ]"
          >
            <component :is="feature.icon" class="w-3.5 h-3.5" />
            <span>{{ feature.name }}</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-700">
          <div>
            <p class="text-xs text-slate-500 mb-1">Mensajes</p>
            <p class="text-lg font-semibold text-white">
              {{ agent.messagesHandled.toLocaleString() }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Tiempo Resp.</p>
            <p class="text-lg font-semibold text-white">
              {{ agent.avgResponseTime }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
          >
            <Edit class="w-4 h-4" />
            Editar
          </button>
          <button
            :class="[
              'flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm',
              agent.active
                ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30',
            ]"
          >
            <component :is="agent.active ? PowerOff : Power" class="w-4 h-4" />
          </button>
          <button
            class="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="agents.length === 0" class="text-center py-16">
      <div
        class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Plus class="w-10 h-10 text-slate-600" />
      </div>
      <h3 class="text-xl font-semibold text-slate-300 mb-2">
        No tienes agentes aún
      </h3>
      <p class="text-slate-500 mb-6">Crea tu primer agente IA para comenzar</p>
      <button
        @click="showAddModal = true"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all"
      >
        Crear Agente
      </button>
    </div>

    <!-- Add Modal Placeholder -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="showAddModal = false"
    >
      <div
        class="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full"
        @click.stop
      >
        <h3 class="text-2xl font-bold text-white mb-4">Crear Nuevo Agente</h3>
        <p class="text-slate-400 mb-6">Funcionalidad próximamente disponible</p>
        <button
          @click="showAddModal = false"
          class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>
