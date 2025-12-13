<script setup>
import { ref } from "vue";
import { login, redirectByRole } from "../utils/mockAuth.js";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const handleSubmit = () => {
  error.value = "";

  // Validation
  if (!email.value || !password.value) {
    error.value = "Por favor ingresa email y contraseña";
    return;
  }

  loading.value = true;

  // Simulate API delay
  setTimeout(() => {
    const result = login(email.value, password.value);

    if (result.success) {
      // Redirect based on role
      redirectByRole(result.user.role);
    } else {
      error.value = result.error;
      loading.value = false;
    }
  }, 500);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm"
    >
      {{ error }}
    </div>

    <!-- Email Input -->
    <div>
      <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
        Email
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
        class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        placeholder="tu@email.com"
      />
    </div>

    <!-- Password Input -->
    <div>
      <label
        for="password"
        class="block text-sm font-medium text-slate-300 mb-2"
      >
        Contraseña
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
        class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        placeholder="••••••••"
      />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <span v-if="!loading">Iniciar Sesión</span>
      <span v-else class="flex items-center justify-center">
        <svg
          class="animate-spin h-5 w-5 mr-2"
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
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Iniciando...
      </span>
    </button>
  </form>
</template>
