<script setup>
import { watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../utils/useAuth";

const { login, isAuthenticated, userRole, isLoading, error } = useAuth();
const router = useRouter();
const route = useRoute();

const redirectUser = () => {
  if (isAuthenticated.value && userRole.value) {
    if (userRole.value === "saas_owner") {
      router.push("/admin");
    } else if (userRole.value === "company_admin") {
      router.push("/company");
    }
  }
};

// Watch for changes in auth state
watch([isAuthenticated, userRole, isLoading], () => {
  if (!isLoading.value) {
    redirectUser();
  }
});

// Check on mount in case already authenticated
onMounted(() => {
  if (!isLoading.value) {
    redirectUser();
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Login Container -->
    <div class="relative w-full max-w-md text-center">
      <!-- Logo/Brand -->
      <div class="mb-8">
        <h1 class="text-5xl font-bold text-white mb-2">
          <span
            class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Agenteia
          </span>
        </h1>
        <p class="text-slate-300 text-lg">Plataforma de Agentes IA</p>
      </div>

      <!-- Login Card -->
      <div
        class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8"
      >
        <!-- Loading State -->
        <div v-if="isLoading" class="py-8">
          <div
            class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          ></div>
          <p class="text-slate-300">Procesando autenticación...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-4">
          <div
            class="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6"
          >
            <p class="text-red-400 font-semibold mb-1">
              Error de Autenticación
            </p>
            <p class="text-red-300 text-sm">{{ error.message }}</p>
          </div>
          <button
            @click="login"
            class="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>

        <!-- Login Form -->
        <div v-else>
          <h2 class="text-2xl font-bold text-white mb-6">Bienvenido</h2>

          <p class="text-slate-400 mb-8">
            Inicia sesión para acceder a tu dashboard y gestionar tus agentes.
          </p>

          <button
            @click="login"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Iniciar Sesión con Auth0
          </button>

          <!-- Test Credentials Info -->
          <div
            class="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-left"
          >
            <p class="text-xs text-slate-400 font-semibold mb-2">Nota:</p>
            <p class="text-xs text-slate-500">
              Al iniciar sesión en Auth0, usa uno de los emails registrados en
              nuestro sistema mock para obtener el rol correcto (ej:
              admin@agenteia.com).
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
