<template>
  <header class="h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
    <!-- Left: Mobile Trigger & Active Module Breadcrumb -->
    <div class="flex items-center gap-3">
      <button
        @click="legalStore.state.isMobileSidebarOpen = true"
        class="lg:hidden p-2 rounded-xl text-[#1E293B] hover:bg-slate-100 transition-colors"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div>
        <div class="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
          Surya Era Enterprise Legal Suite
        </div>
        <h2 class="text-base sm:text-lg font-extrabold text-[#0B1325] leading-tight">
          {{ moduleTitle }}
        </h2>
      </div>
    </div>

    <!-- Right Header Controls -->
    <div class="flex items-center gap-2 sm:gap-3">
      
      <!-- Entity Switcher Dropdown -->
      <div class="hidden md:flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-1">
        <Building2 class="w-3.5 h-3.5 text-blue-500" />
        <select
          :value="legalStore.state.currentEntity"
          @change="legalStore.changeEntity($event.target.value)"
          class="bg-transparent text-xs font-bold text-[#1E293B] focus:outline-none cursor-pointer"
        >
          <option value="PT Nusantara Energi">PT Nusantara Energi (Holding)</option>
          <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
          <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
        </select>
      </div>

      <!-- Quick Search Trigger -->
      <button
        @click="legalStore.state.isSearchModalOpen = true"
        class="hidden sm:flex items-center gap-2 bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] text-xs text-[#64748B] px-3 py-1.5 rounded-xl transition cursor-pointer"
      >
        <Search class="w-3.5 h-3.5 text-blue-500" />
        <span>Cari berkas...</span>
        <kbd class="bg-white px-1.5 py-0.5 rounded text-[10px] font-mono text-[#64748B] border border-[#E2E8F0]">⌘K</kbd>
      </button>

      <!-- Notification Bell -->
      <button
        @click="legalStore.state.isNotificationDrawerOpen = !legalStore.state.isNotificationDrawerOpen"
        class="relative p-2 rounded-xl text-[#1E293B] hover:bg-slate-100 transition cursor-pointer"
        title="Pemberitahuan Sistem"
      >
        <Bell class="w-5 h-5" />
        <span
          v-if="hasCriticalAlerts"
          class="absolute top-1.5 right-1.5 flex h-2.5 w-2.5"
        >
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
      </button>

      <!-- Role Switcher Dropdown (Soft Indigo Pastel Accent) -->
      <div class="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
        <select
          :value="legalStore.state.currentUser?.role"
          @change="legalStore.switchRole($event.target.value)"
          class="bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] text-xs font-semibold rounded-xl py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] cursor-pointer shadow-xs hover:bg-[#E0E7FF] transition"
        >
          <option value="ADMIN">Role: ADMIN (Full Access)</option>
          <option value="LEGAL MANAGER">Role: LEGAL MANAGER</option>
          <option value="LEGAL COUNSEL">Role: LEGAL COUNSEL</option>
          <option value="LEGAL STAFF">Role: LEGAL STAFF</option>
          <option value="REQUESTOR">Role: REQUESTOR (Unit Bisnis)</option>
          <option value="MANAGEMENT">Role: MANAGEMENT (BOD/BOC)</option>
        </select>
      </div>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { Menu, Building2, Search, Bell } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const moduleTitles = {
  dashboard: 'Dashboard Eksekutif & Ringkasan Operasional Legal',
  requests: 'Manajemen Permintaan Legal (Legal Requests)',
  contracts: 'Register & Siklus Hidup Kontrak Korporasi',
  tenders: 'Tender & Pengadaan Proyek (Progress & Pipeline Lelang)',
  'tender-documents': 'Audit Dokumen Tender & Gap Analysis',
  'tender-bonds': 'Jaminan Bank & Bid Bond Pengadaan',
  corporate: 'Profil Korporat, Anggaran Dasar & Kepengurusan',
  licensing: 'Perizinan Berusaha (OSS RBA & PB-UMKU)',
  compliance: 'Kepatuhan Regulasi & Kewajiban Hukum Berkala',
  disputes: 'Sengketa, Arbitrase BANI & Perkara Litigasi',
  ldd: 'Legal Due Diligence (Uji Tuntas Hukum)',
  opinions: 'Legal Opinion (Pendapat Hukum & Analisis Risiko)',
  documents: 'Vault Repositori Dokumen Legal & Arsip Asli',
  correspondence: 'Administrasi Surat Menyurat, Somasi & Kuasa',
  knowledge: 'Database Regulasi, Peraturan & Yurisprudensi MA',
  templates: 'Template Kontrak Standar & Perpustakaan Klausul',
  reports: 'Laporan Eksekutif, Analisis Beban Kerja & Nilai',
  activity: 'Audit Activity Log & Jejak Integritas Sistem',
  settings: 'Pengaturan Sistem, Matriks RBAC & Konfigurasi'
};

const moduleTitle = computed(() => {
  return moduleTitles[legalStore.state.activeModule] || 'Legal Management System';
});

const hasCriticalAlerts = computed(() => {
  return (legalStore.kpis.value?.criticalContractsCount || 0) > 0 || (legalStore.kpis.value?.overdueRequestsCount || 0) > 0;
});
</script>
