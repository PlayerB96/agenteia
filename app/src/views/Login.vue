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
    } else if (userRole.value === "new_user") {
      router.push("/onboarding");
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
        <div v-if="isLoading" class="py-12">
          <div
            class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"
          ></div>
          <p class="text-slate-300 animate-pulse">Conectando con el servidor...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-8">
          <div
            class="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-8"
          >
            <div class="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-4">
                <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <p class="text-red-400 font-semibold mb-2">
              Error de Autenticación
            </p>
            <p class="text-red-300 text-sm">{{ error.message }}</p>
          </div>
          <button
            @click="login"
            class="w-full py-4 px-6 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Intentar de nuevo
          </button>
        </div>

        <!-- Social Login Only -->
        <div v-else class="py-4">
          <h2 class="text-3xl font-bold text-white mb-4">Bienvenido</h2>
          
          <p class="text-slate-400 mb-10 text-lg">
            Selecciona tu cuenta para continuar
          </p>

          <div class="space-y-4">
              <!-- Google Button -->
              <button
                @click="login({ authorizationParams: { connection: 'google-oauth2' } })"
                class="group w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/10"
              >
                <div class="p-1 bg-white rounded-full">
                    <svg class="w-6 h-6" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        style="fill: #4285f4"
                    ></path>
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        style="fill: #34a853"
                    ></path>
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        style="fill: #fbbc05"
                    ></path>
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        style="fill: #ea4335"
                    ></path>
                    </svg>
                </div>
                <span class="text-lg">Continuar con Google</span>
              </button>

              <!-- Microsoft Button Removed as per user request -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
