<template>
  <header class="h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
    <!-- Left: Mobile Trigger & Active Module Breadcrumb -->
    <div class="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
      <button
        @click="legalStore.state.isMobileSidebarOpen = true"
        class="lg:hidden p-2 rounded-xl text-[#1E293B] hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div class="min-w-0">
        <div class="text-[9px] sm:text-[10px] font-bold text-[#64748B] uppercase tracking-widest truncate">
          Surya Era Enterprise Legal Suite
        </div>
        <h2 class="text-sm sm:text-lg font-extrabold text-[#0B1325] leading-tight truncate">
          {{ moduleTitle }}
        </h2>
      </div>
    </div>

    <!-- Right Header Controls -->
    <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
      
      <!-- Entity Switcher Dropdown -->
      <div class="hidden md:flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2.5 py-1.5 relative">
        <Building2 class="w-3.5 h-3.5 text-[#2563EB] shrink-0 pointer-events-none" />
        <select
          :value="legalStore.state.currentEntity"
          @change="legalStore.changeEntity($event.target.value)"
          class="bg-transparent text-xs font-semibold text-[#0F172A] focus:outline-none cursor-pointer appearance-none pr-7 outline-none"
        >
          <option value="PT Nusantara Energi">PT Nusantara Energi (Holding)</option>
          <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
          <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
        </select>
        <ChevronDown class="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <!-- Quick Search Trigger -->
      <button
        @click="legalStore.state.isSearchModalOpen = true"
        class="hidden sm:flex items-center gap-2 bg-[#F8FAFC] hover:bg-slate-100 border border-[#CBD5E1] text-xs text-[#64748B] px-2.5 py-1.5 rounded-md transition cursor-pointer"
      >
        <Search class="w-3.5 h-3.5 text-[#2563EB]" />
        <span>Cari berkas...</span>
        <kbd class="bg-white px-1.5 py-0.2 rounded text-[10px] font-mono-tabular text-[#64748B] border border-[#CBD5E1]">⌘K</kbd>
      </button>

      <!-- Notification Bell -->
      <button
        @click="legalStore.state.isNotificationDrawerOpen = !legalStore.state.isNotificationDrawerOpen"
        class="relative p-1.5 rounded-md text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#CBD5E1] transition cursor-pointer"
        title="Pemberitahuan Sistem"
      >
        <Bell class="w-4 h-4 text-[#475569]" />
        <span
          v-if="hasCriticalAlerts"
          class="absolute top-1 right-1 flex h-2 w-2"
        >
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      </button>

      <!-- Role Switcher Dropdown (Tactile Precision with Chevron) -->
      <div class="flex items-center gap-1.5 pl-2 border-l border-[#E2E8F0]">
        <div class="relative">
          <select
            :value="legalStore.state.currentUser?.role"
            @change="legalStore.switchRole($event.target.value)"
            class="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold rounded-md py-1.5 pl-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer appearance-none max-w-[155px] sm:max-w-none truncate"
          >
            <option value="SUPER ADMIN">Super Admin</option>
            <option value="KEPALA LEGAL">Kepala Legal</option>
            <option value="STAFF LEGAL">Staff Legal</option>
            <option value="REQUESTOR">Requestor</option>
            <option value="DIREKTUR (DASHBOARD)">Direktur (dashboard)</option>
          </select>
          <ChevronDown class="w-3.5 h-3.5 text-[#2563EB] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { Menu, Building2, Search, Bell, ChevronDown } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const moduleTitles = {
  dashboard: 'Dashboard Eksekutif & Ringkasan Operasional Legal',
  requests: 'Manajemen Permintaan Legal (Legal Requests)',
  contracts: 'Register & Siklus Hidup Kontrak Korporasi',
  tenders: 'Arsip Legalitas & Register Paket Tender',
  'tender-documents': 'Verifikasi Kelengkapan Dokumen Kualifikasi Tender',
  'tender-bonds': 'Arsip Warkat Jaminan Bank & Bid Bond',
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
