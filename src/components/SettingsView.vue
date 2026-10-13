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

      <button
        @click="activeTab = 'storage'"
        :class="activeTab === 'storage' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <HardDrive class="w-4 h-4" />
        Kapasitas & Cadangan Data
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

    <!-- Storage & Backup Tab Panel -->
    <div v-else-if="activeTab === 'storage'" class="space-y-6">
      <!-- Storage Capacity Card -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-indigo-50 text-[#4338CA] rounded-xl border border-indigo-100">
              <Database class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Kapasitas Penyimpanan LocalStorage</h3>
              <p class="text-xs text-slate-500">Pemantauan kuota penyimpanan browser dan integritas data lokal</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
            ✓ Status Optimal ({{ storageUsage.percent }}% Terpakai)
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1.5 pt-2">
          <div class="flex justify-between text-xs font-semibold text-slate-700">
            <span>Terpakai: {{ storageUsage.totalFormatted }}</span>
            <span>Batas Aman Browser: {{ storageUsage.maxFormatted }}</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
            <div
              class="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              :style="{ width: `${Math.max(1, storageUsage.percent)}%` }"
            ></div>
          </div>
          <p class="text-[11px] text-slate-400">
            Terdiri dari {{ storageUsage.lmsKeyCount }} dataset reaktif terkompresi. Fitur auto-capping log aktif melindungi dari overflow.
          </p>
        </div>
      </div>

      <!-- Backup and Restore Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Backup Card -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
              <Download class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900">Cadangkan Seluruh Data (Export JSON)</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Unduh seluruh register kontrak, data lelang, dokumen, opini hukum, dan pengaturan RBAC ke dalam satu berkas cadangan JSON yang aman.
            </p>
          </div>
          <button
            @click="backupAllData"
            class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Download class="w-4 h-4" />
            <span>Unduh Berkas Cadangan (.json)</span>
          </button>
        </div>

        <!-- Restore Card -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="p-2.5 bg-amber-50 text-amber-700 rounded-xl w-fit">
              <Upload class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900">Pulihkan Data (Restore JSON)</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Muat kembali data dari berkas cadangan sebelumnya. Sistem akan memvalidasi skema berkas sebelum memperbarui memori browser.
            </p>
          </div>
          <div>
            <input
              ref="fileInputRef"
              type="file"
              accept=".json"
              class="hidden"
              @change="handleRestoreFile"
            />
            <button
              @click="triggerFileInput"
              class="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Upload class="w-4 h-4" />
              <span>Pilih Berkas Cadangan & Pulihkan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

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
import { ref, computed, defineAsyncComponent } from 'vue';
import { Database, HardDrive, Download, Upload } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import { storage } from '../services/storage';

// Code-split tabs and modals
const SettingsRoleModal = defineAsyncComponent(() => import('./Settings/SettingsRoleModal.vue'));
const SettingsFlowModal = defineAsyncComponent(() => import('./Settings/SettingsFlowModal.vue'));
const SettingsUserModal = defineAsyncComponent(() => import('./Settings/SettingsUserModal.vue'));
const SettingsFlowsTab = defineAsyncComponent(() => import('./Settings/Tabs/SettingsFlowsTab.vue'));
const SettingsIntegrasiTab = defineAsyncComponent(() => import('./Settings/Tabs/SettingsIntegrasiTab.vue'));
const SettingsRolesTab = defineAsyncComponent(() => import('./Settings/Tabs/SettingsRolesTab.vue'));
const SettingsUsersTab = defineAsyncComponent(() => import('./Settings/Tabs/SettingsUsersTab.vue'));

// Active Sub-tab ('roles' | 'users' | 'flows' | 'integrasi' | 'storage')
const activeTab = ref('roles');

// Datasets from store
const users = computed(() => legalStore.state.users || []);
const rolesMatrix = computed(() => legalStore.state.rolesMatrix || {});
const approvalFlows = computed(() => legalStore.state.approvalFlows || []);

// Storage Diagnostics and Backup
const storageUsage = ref(storage.getStorageUsage());
const fileInputRef = ref(null);

function refreshStorageUsage() {
  storageUsage.value = storage.getStorageUsage();
}

function backupAllData() {
  const backupObj = storage.exportAllJSON();
  const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `LMS_Cadangan_Data_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  legalStore.triggerToast('Seluruh data berhasil dicadangkan (JSON).', 'success');
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

async function handleRestoreFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const confirmed = await legalStore.confirm({
    title: 'Pulihkan Data dari Berkas?',
    message: `Apakah Anda yakin ingin memulihkan data dari berkas "${file.name}"? Data saat ini akan ditimpa dengan isi cadangan.`,
    confirmText: 'Ya, Pulihkan Data',
    cancelText: 'Batal',
    variant: 'warning'
  });

  if (!confirmed) {
    event.target.value = '';
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const count = storage.importAllJSON(parsed);
        const freshData = storage.initStorage();
        Object.assign(legalStore.state, freshData);
        refreshStorageUsage();
        legalStore.triggerToast(`Berhasil memulihkan ${count} dataset dari berkas cadangan!`, 'success');
      } catch {
        legalStore.triggerToast('Gagal memulihkan data: Format berkas JSON tidak valid.', 'error');
      }
    };
    reader.readAsText(file);
  } catch {
    legalStore.triggerToast('Terjadi kesalahan membaca berkas.', 'error');
  } finally {
    event.target.value = '';
  }
}

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
    refreshStorageUsage();
    isResetting.value = false;
    legalStore.hideLoading();
  }, 600);
}
</script>
