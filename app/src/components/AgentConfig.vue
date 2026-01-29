<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();

const goToAgentChat = (agent) => {
  if (agent && agent.name) {
    const agentUrl = agent.name.replace(/\s+/g, '_');
    router.push(`/company/${encodeURIComponent(agentUrl)}`);
  }
};
import { showSwalAlert } from './SwalAlert.js';
import { Plus, Power, PowerOff, Edit, Trash2 } from "lucide-vue-next";
import ModalAddAgent from "./ModalAddAgent.vue";
const props = defineProps({
  agents: Array,
});

const showAddModal = ref(false);
const modalMode = ref("add"); // add | edit
const selectedAgent = ref(null);

const openAdd = () => {
  if (props.agents && props.agents.length >= 4) {
    showSwalAlert({
      icon: 'warning',
      title: 'Límite alcanzado',
      text: 'Ya tienes creados todos los agentes permitidos (4).',
    });
    return;
  }
  modalMode.value = "add";
  selectedAgent.value = null;
  showAddModal.value = true;
};

const openEdit = (agent) => {
  modalMode.value = "edit";
  selectedAgent.value = { ...agent }; // copia segura
  showAddModal.value = true;
};

const reloadAgents = () => {
  // Placeholder for reloading agents after add/edit
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-100">Mis Agentes IA</h2>
      <button
        @click="openAdd"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg hover:scale-105"
      >
        <Plus class="w-4 h-4" />
        Nuevo Agente
      </button>
    </div>

    <!-- Agents Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="agent in agents"
        :key="agent.id"
        class="bg-800 border border-700 rounded-xl p-4 sm:p-6 hover:border-600 cursor-pointer hover:shadow-lg transition-all duration-200"
        @click="goToAgentChat(agent)"
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-100 mb-1 break-words">
              {{ agent.name }}
            </h3>
            <p class="text-sm text-400 break-words">{{ agent.description }}</p>
          </div>
          <div
            :class=" [
              'px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0',
              agent.active
                ? 'bg-green-500 text-200 border border-600'
                : 'bg-700 text-100 border border-600',
            ]"
          >
            {{ agent.active ? "Activo" : "Inactivo" }}
          </div>
        </div>

        <!-- Features -->
        <div class="flex flex-wrap gap-2 mb-4">
          <div v-if="agent.features.length === 0">
            <div
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-600 text-100 border border-600"
            >
              <span>Sin Canales configurados</span>
            </div>
          </div>
          <div
            v-else
            v-for="feature in agent.features"
            :key="feature.name"
            :class=" [
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs',
              feature.enabled
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                : 'bg-700 text-100 border border-600',
            ]"
          >
            <component :is="feature.icon" class="w-3.5 h-3.5" />
            <span>{{ feature.name }}</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-700">
          <div>
            <p class="text-xs text-500 mb-1">Mensajes</p>
            <p class="text-lg font-semibold text-100">
              {{ agent.messagesHandled.toLocaleString() }}
            </p>
          </div>
          <div>
            <p class="text-xs text-500 mb-1">Tiempo Resp.</p>
            <p class="text-lg font-semibold text-100">
              {{ agent.avgResponseTime }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-700 hover:bg-700 text-200 rounded-lg text-sm"
            @click.stop="openEdit(agent)"
          >
            <Edit class="w-4 h-4" />
            Editar
          </button>
          <button
            :class=" [
              'flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm',
              agent.active
                ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30',
            ]"
          >
            <component :is="agent.active ? PowerOff : Power" class="w-4 h-4" />
          </button>
          <button
            class="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="agents.length === 0" class="text-center py-16">
      <div
        class="w-20 h-20 bg-800 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Plus class="w-10 h-10 text-600" />
      </div>
      <h3 class="text-xl font-semibold text-300 mb-2">
        No tienes agentes aún
      </h3>
      <p class="text-500 mb-6">Crea tu primer agente IA para comenzar</p>
      <button
        @click="openAdd"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-100 rounded-lg"
      >
        Crear Agente
      </button>
    </div>

    <ModalAddAgent
      v-model="showAddModal"
      :mode="'modalMode'"
      :agent="selectedAgent"
      @handleSave="reloadAgents"
    />
  </div>
</template>
