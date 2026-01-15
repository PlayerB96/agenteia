<script setup>  
  import { ref, markRaw, onMounted, watch } from "vue";
  import {
    Sun,
    MoonStar,
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
  import { fetchCompanies, createCompany, updateCompany, deleteCompany, toggleCompany, fetchDashboard } from '../services/companyService'
  import Swal from 'sweetalert2'

  import { inject } from 'vue'

  const theme = inject('theme')
  const toggleTheme = inject('toggleTheme')
  
  const { user, logout } = useAuth();
  const currentView = ref("companies");
  const companies = ref([])
  const showModal = ref(false);
  const selectedCompany = ref(null);
  const mobileMenuOpen = ref(false);
  const stats = ref({})


  const loadStats = async () => {
    const data = await fetchDashboard()
    if (data) stats.value = data
  }

  // 🔁 Cargar listado
  const loadCompanies = async () => {
    companies.value = await fetchCompanies()
  }
  
  onMounted(() => {
    loadCompanies()
    loadStats()
  })

  const openModal = (company = null) => {
    selectedCompany.value = company;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    selectedCompany.value = null;
  };

  const saving = ref(false)
  const saveCompany = async (companyData) => {
    if (saving.value) return
    try {
      saving.value = true
      let savedCompany

      if (companyData.id) {
        // ✏️ UPDATE
        savedCompany = await updateCompany(companyData.id, companyData)
      } else {
        // ➕ CREATE
        savedCompany = await createCompany(companyData)
      }
      
      closeModal();
      await loadCompanies()

      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'La empresa fue guardada correctamente',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        timer: 1500,
        showConfirmButton: false
      })
    } finally {
      saving.value = false
    }
  }

  const removeCompany = async (company) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar empresa?',
      text: `Se eliminará "${company.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!confirm.isConfirmed) return

    try {
      await deleteCompany(company.id)
      await loadCompanies() // 🔄 refresca listado
      Swal.fire('Eliminado', 'Empresa eliminada correctamente', 'success')
    } catch (e) {
      console.error(e)
      Swal.fire('Error', 'No se pudo eliminar', 'error')
    }
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const toggleCompanyActive = async (company) => {
    try {
      company.active = company.active ? 0 : 1
      await toggleCompany(company.id, company)
      await loadCompanies()
    } catch (error) {
      console.error('Error cambiando estado:', error)
    }
  }

  const handleLogout = () => {
    logout();
  };
</script>

<template>
  <div class="flex min-h-screen font-sans bg-900 text-100">
    <!-- Mobile Menu Button -->
    <button
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 border border-700 rounded-lg text-white hover:bg-slate-700 transition-colors"
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
        <div class="flex items-center gap-2 self-center">
          <button
            @click="toggleTheme"
            class="px-4 py-2 rounded-lg transition
                  bg-slate-100
                  dark:bg-slate-900 dark:text-white"
            title="Cambiar Tema"
          >
            <MoonStar v-if="theme === 'dark'" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
          >
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <StatsGrid :stats="stats" />

      <CompanyList 
      :companies="companies" 
      @open-modal="openModal" 
      @delete="removeCompany"
      @toggle-active="toggleCompanyActive" 
      />
    </main>

    <CompanyModal
      v-if="showModal"
      :company="selectedCompany"
      :saving="saving"
      @close="closeModal"
      @save="saveCompany"
    />
  </div>
</template>
