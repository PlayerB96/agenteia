<script setup>  
  import { ref, markRaw, onMounted, watch } from "vue";
  import {
    ArrowBigLeftDash,
    Sun,
    MoonStar,
    Menu,
    X,
    LogOut,
  } from "lucide-vue-next";
  import { useAuth } from "../utils/useAuth";
  import AdminSidebar from "../components/AdminSidebar.vue";
  import CompanyList from "../components/CompanyList.vue";
  import CompanyForm from "../components/CompanyForm.vue";
  import { fetchCompanyById, updateCompany, createCompany, fetchDashboardCompany } from '../services/companyService'
  import { showSwalAlert } from '../components/SwalAlert.js'
  import { useRouter, useRoute } from 'vue-router'
  import { inject } from 'vue'
  import { computed } from 'vue'

  const theme = inject('theme')
  const toggleTheme = inject('toggleTheme')
  const isEdit = computed(() => !!route.params.id)
  const { user, logout } = useAuth();
  const currentView = ref("companies");
  const companies = ref([])
  const showModal = ref(false);
  const mobileMenuOpen = ref(false);
  const StatsAgent = ref({})
  const router = useRouter()
  const route = useRoute()
  const company = ref({})
  const dashboard = ref({})
  const saving = ref(false)
  const loadCompany = async () => {
    company.value = await fetchCompanyById(route.params.id)
  }

  const loadDashboardCompany = async () => {
    dashboard.value = await fetchDashboardCompany(route.params.id)
  }

  
  onMounted(async () => {
    if (isEdit.value) {
      company.value = await fetchCompanyById(route.params.id)
      dashboard.value = await fetchDashboardCompany(route.params.id)
    }
  })

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const handleLogout = () => {
    logout();
  };
  
  const goBack = () => {
    router.push('/admin')
  }

  const saveCompany = async (companyData) => {
    if (saving.value) return
    try {
      saving.value = true

      if (companyData.id) {
        // ✏️ UPDATE
        await updateCompany(companyData.id, companyData)
        goBack()
      } else {
        // ➕ CREATE
        await createCompany(companyData)
        goBack()
      }
      showSwalAlert({
        icon: 'success',
        title: 'Guardado',
        text: 'La empresa fue guardada correctamente',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      showSwalAlert({
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
        <div class="flex items-center gap-3 self-center">
          <button
            @click="goBack"
            class="text-2xl bg-700 rounded-lg px-4 py-2 "
            title="Volver"
          >
            <ArrowBigLeftDash class="h-5 w-5"/>
          </button>
          <h1 class="text-2xl text-3xl font-bold mb-2">
            {{ isEdit ? 'Editar Empresa' : 'Nueva Empresa' }}
          </h1>
        </div>
        <div class="flex items-center gap-2 self-center">
          <button
            @click="toggleTheme"
            class="px-4 py-2 rounded-lg transition
                  bg-100
                  dark:bg-900 text-100"
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
      
      <CompanyForm
        :company="company"
        :dashboard="dashboard"
        :saving="saving"
        @save="saveCompany"
        @cancel="goBack"
      />
    </main>
  </div>
</template>
