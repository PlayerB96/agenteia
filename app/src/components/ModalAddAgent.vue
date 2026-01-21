<script setup>
import { reactive, ref, watch } from "vue";
import { X, ClipboardList } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  agent: {
    type: Object,
    default: null
  }
});

const modalAgent = reactive({
  id: null,
  name: 0,
  description: "",
})

const saving = ref(false);
const emit = defineEmits(["update:modelValue"]);

const handleSave = () => {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    emit("saved");
    emit("update:modelValue", false);
  }, 1000);
}

/* 🔄 Cargar datos al editar */
watch(
  () => props.agent,
  (agent) => {
    if (agent) {
      modalAgent.id = agent.id;
      modalAgent.name = agent.name;
      modalAgent.description = agent.description;
    } else {
      modalAgent.id = null;
      modalAgent.name = 0;
      modalAgent.description = "";
    }
  },
  { immediate: true }
);
</script>
<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
    <div class="bg-800 border border-slate-700 rounded-xl md:rounded-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
      <div class="p-4 md:p-6 lg:p-8 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-800 z-10">
        <h2 class="text-lg md:text-xl lg:text-2xl font-bold">{{ modalAgent.id ? 'Editar Agente' : 'Nuevo Agente' }}</h2>
        <button class="text-400 hover:text-white transition-colors" @click="emit('update:modelValue', false)">
          <X class="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      <!-- OVERLAY DE LOADING -->
      <div
        v-if="saving"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm
              z-50 flex flex-col items-center justify-center gap-4"
      >
        <svg class="animate-spin h-10 w-10 text-indigo-400" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>

        <p class="text-sm text-slate-300 font-medium">
          Guardando agente…
        </p>
      </div>

      <div class="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <!-- Información General -->
          <h3 class="text-base md:text-lg font-semibold text-indigo-400 flex items-center gap-2">
            <ClipboardList class="w-4 h-4 md:w-5 md:h-5" />
            Información General
          </h3>
          <div class="space-y-2">
            <label class="text-sm font-medium text-300">Nombre del agente</label>
            <select v-model="modalAgent.name" class="w-full bg-700 border border-600 rounded-lg px-3 py-2 text-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full">
              <option value="0">Seleccione agente</option>
              <option value="Agente Soporte">Agente Soporte</option>
              <option value="Agente Comercial">Agente Comercial</option>
              <option value="Agente Marketing">Agente Marketing</option>
              <option value="Agente Sistemas">Agente Sistemas</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-300">Descripción</label>
            <textarea v-model="modalAgent.description" class="w-full bg-700 border border-600 rounded-lg px-3 py-2 text-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"></textarea>
          </div>
      </div>
      <div class="p-4 md:p-6 lg:p-8 border-t border-700 bg-800 flex flex-col sm:flex-row justify-end md:gap-4 sticky bottom-0">
        <button 
          class="w-full sm:w-auto px-4 md:px-6 py-2.5 rounded-xl font-medium text-300 hover:text-white hover:bg-700 transition-colors order-2 sm:order-1"
          @click="emit('update:modelValue', false)"
        >
          Cancelar
        </button>
        <button 
          :disabled="saving"
          @click="handleSave"
          class="
            w-full sm:w-auto
            px-4 md:px-6 py-2.5
            rounded-xl font-medium text-white
            bg-gradient-to-r from-indigo-500 to-purple-600
            hover:from-indigo-600 hover:to-purple-700
            shadow-lg shadow-indigo-500/30
            transition-all
            order-1 sm:order-2
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          <!-- Spinner -->
          <svg
            v-if="saving"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <!-- Texto -->
          <span>
            <template v-if="saving">
              Guardando...
            </template>
            <template v-else>
              {{ modalAgent.id ? 'Guardar Cambios' : 'Crear Agente' }}
            </template>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>