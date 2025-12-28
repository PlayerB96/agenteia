<script setup>  
  import { ref, markRaw, onMounted, watch } from "vue";
  import {
    MessageSquare,
    Mail,
    Smartphone,
    Webhook,
    Brain,
    Menu,
    X,
    LogOut,
  } from "lucide-vue-next";
  import { useAuth } from "../utils/useAuth";
  import AdminSidebar from "../components/AdminSidebar.vue";
  import StatsGrid from "../components/StatsGrid.vue";
  import CompanyList from "../components/CompanyList.vue";
  import CompanyModal from "../components/CompanyModal.vue";

  import { inject } from 'vue'

  const theme = inject('theme')
  const toggleTheme = inject('toggleTheme')
  
  const { user, logout } = useAuth();
  const currentView = ref("companies");
  const showModal = ref(false);
  const selectedCompany = ref(null);
  const mobileMenuOpen = ref(false);

  const stats = ref({
    activeCompanies: 24,
    totalAgents: 156,
    messagesTotal: 12847,
    uptime: 99.9,
  });

  const companies = ref([
    {
      id: 1,
      name: "Tech Solutions Inc.",
      domain: "techsolutions.com",
      active: true,
      features: [
        { name: "WhatsApp", icon: markRaw(MessageSquare), enabled: true },
        { name: "Email", icon: markRaw(Mail), enabled: true },
        { name: "SMS", icon: markRaw(Smartphone), enabled: false },
        { name: "Webhooks", icon: markRaw(Webhook), enabled: true },
      ],
    },
    {
      id: 2,
      name: "Global Marketing Co.",
      domain: "globalmarketing.io",
      active: true,
      features: [
        { name: "WhatsApp", icon: markRaw(MessageSquare), enabled: true },
        { name: "Email", icon: markRaw(Mail), enabled: true },
        { name: "SMS", icon: markRaw(Smartphone), enabled: true },
        { name: "AI Custom", icon: markRaw(Brain), enabled: true },
      ],
    },
    {
      id: 3,
      name: "E-commerce Plus",
      domain: "ecommerceplus.com",
      active: false,
      features: [
        { name: "WhatsApp", icon: markRaw(MessageSquare), enabled: true },
        { name: "Email", icon: markRaw(Mail), enabled: false },
        { name: "Webhooks", icon: markRaw(Webhook), enabled: true },
      ],
    },
  ]);

  const openModal = (company = null) => {
    selectedCompany.value = company;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    selectedCompany.value = null;
  };

  const saveCompany = async (companyData) => {
    try {
      if (companyData.id) {
        // UPDATE
        const { data } = await axios.post(
          `/worker-agent-config/company/${companyData.id}`, //MODIFICAR WORKER API
          companyData
        )

        const index = companies.value.findIndex(c => c.id === data.id)
        if (index !== -1) companies.value[index] = data

      } else {
        // CREATE
        const { data } = await axios.post(
          '/worker-agent-config/company',
          companyData
        )

        companies.value.push(data)
      }

      closeModal()
    } catch (error) {
      console.error(error)
      // toast / alert
    }
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const handleLogout = () => {
    logout();
  };
</script>

<template>
  <div class="flex min-h-screen font-sans bg-900 text-100">
    <!-- Mobile Menu Button -->
    <button
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors"
    >
      <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <!-- Mobile Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <AdminSidebar
      :current-view="currentView"
      :mobile-open="mobileMenuOpen"
      @update:current-view="
        currentView = $event;
        mobileMenuOpen = false;
      "
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
      <header class="mb-6 md:mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold mb-2">
            Dashboard de Configuración
          </h1>
          <p class="text-slate-400 text-sm md:text-base">
            Gestiona las empresas y sus configuraciones de agentes IA
          </p>
          <p v-if="user" class="text-slate-500 text-xs mt-1">
            Bienvenido, {{ user.name || user.email }}
          </p>
        </div>
        <button
          @click="toggleTheme"
          class="px-4 py-2 rounded-lg transition
                bg-slate-200 text-slate-900
                dark:bg-slate-700 dark:text-white"
        >
          {{ theme === 'dark' ? '🌙 Dark' : '☀️ Light' }}
        </button>
        <button
          @click="handleLogout"
          class="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
        >
          <LogOut class="w-4 h-4" />
          <span class="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </header>

      <StatsGrid :stats="stats" />

      <CompanyList :companies="companies" @open-modal="openModal" />
    </main>

    <CompanyModal
      v-if="showModal"
      :company="selectedCompany"
      @close="closeModal"
      @save="saveCompany"
    />
  </div>
</template>
