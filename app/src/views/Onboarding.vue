<script setup>
import { useAuth } from "../utils/useAuth";
import { useRouter } from "vue-router";

const { logout, user } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout();
};

const features = [
  {
    title: "Agentes IA",
    description: "Crea y gestiona agentes inteligentes para automatizar tareas.",
    icon: "🤖",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Análisis de Datos",
    description: "Visualiza métricas y rendimiento en tiempo real.",
    icon: "📊",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Marketing",
    description: "Optimiza campañas y generación de leads.",
    icon: "📢",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "CRM",
    description: "Gestiona relaciones con clientes de forma automatizada.",
    icon: "🤝",
    color: "from-emerald-500 to-green-500",
  },
];
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white p-6">
    <!-- Navbar -->
    <nav class="flex justify-between items-center mb-12 max-w-7xl mx-auto">
      <div class="flex items-center space-x-2">
        <span class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Agenteia</span>
      </div>
      <button
        @click="handleLogout"
        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700"
      >
        Cerrar Sesión
      </button>
    </nav>

    <!-- Hero Section -->
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
        <img
          v-if="user?.picture"
          :src="user.picture"
          alt="Profile"
          class="w-16 h-16 rounded-full border-4 border-slate-900"
        />
        <div v-else class="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-900 font-bold text-2xl">
            {{ user?.name?.charAt(0) || 'U' }}
        </div>
      </div>
      
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Bienvenido, {{ user?.name }}
      </h1>
      <p class="text-xl text-slate-400">
        Tu cuenta está creada. Explora todas las posibilidades que Agenteia tiene para tu empresa.
      </p>
      
      <div class="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg inline-block text-left">
          <p class="text-yellow-200 text-sm flex items-center">
              <span class="mr-2">👋</span>
              <span>Actualmente tu cuenta tiene permisos de visualización. Contacta a un administrador para configurar tu organización.</span>
          </p>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all hover:transform hover:-translate-y-1"
      >
        <!-- Gradient Border Effect -->
        <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" :class="feature.color"></div>
        
        <div class="text-4xl mb-4">{{ feature.icon }}</div>
        <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
        <p class="text-slate-400 text-sm">{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>
