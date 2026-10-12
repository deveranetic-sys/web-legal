<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-[#4338CA]">
            Administrasi & Tata Kelola
          </span>
          <span class="text-xs text-slate-500 font-medium">Enterprise RBAC & Approval Engine</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Pengaturan Sistem & Kontrol Akses
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Konfigurasi terpusat hak akses peran (RBAC), alur persetujuan multi-jenjang berjenjang eskalasi, manajemen akun terintegrasi ERP, dan konektivitas bridge enterprise.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="resetToDefault"
          :disabled="isResetting"
          class="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-[#FECDD3] text-rose-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
        >
          <svg v-if="isResetting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isResetting ? 'Mereset Data...' : 'Reset Data Simulasi' }}</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
      <button
        @click="activeTab = 'roles'"
        :class="activeTab === 'roles' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Matriks Peran & Izin (RBAC)
      </button>

      <button
        @click="activeTab = 'users'"
        :class="activeTab === 'users' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Manajemen Pengguna & ERP ({{ users.length }})
      </button>

      <button
        @click="activeTab = 'flows'"
        :class="activeTab === 'flows' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Alur Persetujuan ({{ approvalFlows.length }})
      </button>

      <button
        @click="activeTab = 'integrasi'"
        :class="activeTab === 'integrasi' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Integrasi ERP & Layanan
      </button>
    </div>

    <!-- Active Tab Content Components -->
    <SettingsRolesTab
      v-if="activeTab === 'roles'"
      :roles-matrix="rolesMatrix"
      @open-add-role-modal="isRoleModalOpen = true"
    />

    <SettingsUsersTab
      v-else-if="activeTab === 'users'"
      :users="users"
      :roles-matrix="rolesMatrix"
      @open-add-user-modal="openAddUserModal"
      @open-edit-user-modal="openEditUserModal"
    />

    <SettingsFlowsTab
      v-else-if="activeTab === 'flows'"
      @open-edit-flow-modal="openEditFlowModal"
    />

    <SettingsIntegrasiTab
      v-else-if="activeTab === 'integrasi'"
    />

    <!-- MODALS -->
    <SettingsUserModal
      :is-open="isUserModalOpen"
      :is-editing="isEditingUser"
      :initial-user="editingUserObj"
      @close="isUserModalOpen = false"
    />

    <SettingsRoleModal
      :is-open="isRoleModalOpen"
      :roles-matrix="rolesMatrix"
      @close="isRoleModalOpen = false"
    />

    <SettingsFlowModal
      :is-open="isFlowModalOpen"
      :flow="editingFlowObj"
      :roles-matrix="rolesMatrix"
      @close="isFlowModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SettingsRoleModal from './Settings/SettingsRoleModal.vue';
import SettingsFlowModal from './Settings/SettingsFlowModal.vue';
import SettingsUserModal from './Settings/SettingsUserModal.vue';
import SettingsFlowsTab from './Settings/Tabs/SettingsFlowsTab.vue';
import SettingsIntegrasiTab from './Settings/Tabs/SettingsIntegrasiTab.vue';
import SettingsRolesTab from './Settings/Tabs/SettingsRolesTab.vue';
import SettingsUsersTab from './Settings/Tabs/SettingsUsersTab.vue';
import { legalStore } from '../stores/legalStore';

// Active Sub-tab ('roles' | 'users' | 'flows' | 'integrasi')
const activeTab = ref('roles');

// Datasets from store
const users = computed(() => legalStore.state.users || []);
const rolesMatrix = computed(() => legalStore.state.rolesMatrix || {});
const approvalFlows = computed(() => legalStore.state.approvalFlows || []);

// Modal States
const isUserModalOpen = ref(false);
const isEditingUser = ref(false);
const editingUserObj = ref(null);

const isRoleModalOpen = ref(false);
const isFlowModalOpen = ref(false);
const editingFlowObj = ref(null);
const isResetting = ref(false);

function openAddUserModal() {
  isEditingUser.value = false;
  editingUserObj.value = null;
  isUserModalOpen.value = true;
}

function openEditUserModal(u) {
  isEditingUser.value = true;
  editingUserObj.value = u;
  isUserModalOpen.value = true;
}

function openEditFlowModal(flow) {
  editingFlowObj.value = flow;
  isFlowModalOpen.value = true;
}

async function resetToDefault() {
  const confirmed = await legalStore.confirm({
    title: 'Reset Data Simulasi?',
    message: 'Tindakan ini akan mengembalikan seluruh data register, kontrak, tender, dan konfigurasi RBAC ke kondisi data awal (default). Data perubahan saat ini akan dihapus.',
    confirmText: 'Ya, Reset Sekarang',
    cancelText: 'Batalkan',
    variant: 'danger'
  });

  if (!confirmed) return;

  isResetting.value = true;
  legalStore.showLoading('Mengatur ulang database simulasi...');

  setTimeout(() => {
    legalStore.resetToDefault();
    isResetting.value = false;
    legalStore.hideLoading();
  }, 600);
}
</script>
