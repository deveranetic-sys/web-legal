<template>
  <div>
    <!-- Mobile Sidebar Backdrop -->
    <div
      v-if="legalStore.state.isMobileSidebarOpen"
      @click="legalStore.state.isMobileSidebarOpen = false"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar Container (Surface #FFFFFF with border #E2E8F0) -->
    <aside
      :class="legalStore.state.isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white text-[#475569] flex flex-col transition-transform duration-200 ease-in-out border-r border-[#E2E8F0] shadow-xs"
    >
      <!-- Logo / Branding Area -->
      <div class="h-16 px-4 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center border border-[#C7D2FE] shadow-xs">
            <Scale class="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-bold text-[#0F172A] tracking-tight">LMS ENTERPRISE</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] font-bold border border-[#C7D2FE]">v2.6</span>
            </div>
            <p class="text-[10px] text-[#94A3B8] font-medium">Corporate Legal Operations</p>
          </div>
        </div>

        <button
          @click="legalStore.state.isMobileSidebarOpen = false"
          class="lg:hidden text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Menu Groups (Scrollable) -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
        <div v-for="(group, gIdx) in menuGroups" :key="gIdx" class="space-y-1">
          <div class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            {{ group.title }}
          </div>

          <button
            v-for="item in group.items"
            :key="item.id"
            @click="legalStore.navigate(item.id)"
            :class="isItemActive(item.id)
              ? 'bg-[#EEF2FF] text-[#4338CA] font-semibold border-l-[3px] border-[#6366F1] shadow-xs'
              : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-medium border-l-[3px] border-transparent'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-r-xl rounded-l-xs transition-all cursor-pointer text-left"
          >
            <div class="flex items-center gap-2.5">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0 transition-colors"
                :class="isItemActive(item.id) ? 'text-[#6366F1]' : 'text-[#94A3B8]'"
              />
              <span class="truncate">{{ item.name }}</span>
            </div>

            <!-- Dynamic Pastel Badge Counters -->
            <span
              v-if="item.badge"
              :class="item.badgeClass || 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]'"
              class="px-2 py-0.5 text-[10px] font-semibold rounded-full"
            >
              {{ item.badge }}
            </span>
          </button>
        </div>
      </nav>

      <!-- Bottom User Profile Card -->
      <div class="p-3 border-t border-[#E2E8F0] bg-[#F9FAFB]">
        <div class="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div class="w-8 h-8 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] flex items-center justify-center font-bold text-xs shrink-0">
            {{ getInitials(legalStore.state.currentUser?.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-[#0F172A] truncate">{{ legalStore.state.currentUser?.name }}</div>
            <div class="text-[10px] text-[#94A3B8] truncate">{{ legalStore.state.currentUser?.title }}</div>
          </div>
          <div class="shrink-0">
            <span
              class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]"
            >
              {{ legalStore.state.currentUser?.role }}
            </span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Scale,
  X,
  LayoutDashboard,
  ClipboardList,
  FileText,
  Building2,
  FileCheck2,
  ShieldCheck,
  Gavel,
  SearchCheck,
  MessageSquareQuote,
  Archive,
  Send,
  BookOpen,
  Library,
  BarChart3,
  History,
  Settings,
  FileSpreadsheet,
  Database
} from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const badges = computed(() => legalStore.badges.value);

const menuGroups = computed(() => [
  {
    title: 'Menu Utama',
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
      {
        id: 'requests',
        name: 'Permintaan Legal',
        icon: ClipboardList,
        badge: badges.value.pendingRequests || null,
        badgeClass: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]'
      },
      {
        id: 'contracts',
        name: 'Manajemen Kontrak',
        icon: FileText,
        badge: badges.value.expiringContracts || null,
        badgeClass: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
      }
    ]
  },
  {
    title: 'Arsip & Kepatuhan Tender',
    items: [
      {
        id: 'tenders',
        name: 'Register & Arsip Tender',
        icon: FileSpreadsheet,
        badge: badges.value.activeTenders || null,
        badgeClass: 'bg-[#E0F2FE] text-[#075985] border border-[#BAE6FD]'
      },
      {
        id: 'tender-documents',
        name: 'Verifikasi Dokumen Legalitas',
        icon: FileCheck2,
        badge: badges.value.tendersWithMissingDocs ? `${badges.value.tendersWithMissingDocs} Kurang` : null,
        badgeClass: 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3] font-bold'
      },
      {
        id: 'tender-bonds',
        name: 'Warkat Jaminan Bank (Bonds)',
        icon: ShieldCheck
      }
    ]
  },
  {
    title: 'Korporasi & Regulasi',
    items: [
      { id: 'corporate', name: 'Corporate', icon: Building2 },
      { id: 'licensing', name: 'Perizinan (OSS/IUP)', icon: FileCheck2 },
      {
        id: 'compliance',
        name: 'Compliance',
        icon: ShieldCheck,
        badge: badges.value.overdueCompliance || null,
        badgeClass: 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]'
      }
    ]
  },
  {
    title: 'Perkara & Analisis',
    items: [
      {
        id: 'disputes',
        name: 'Dispute & Litigation',
        icon: Gavel,
        badge: badges.value.activeDisputes || null,
        badgeClass: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]'
      },
      { id: 'ldd', name: 'Legal Due Diligence', icon: SearchCheck },
      {
        id: 'opinions',
        name: 'Legal Opinion',
        icon: MessageSquareQuote,
        badge: badges.value.pendingOpinions || null,
        badgeClass: 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
      }
    ]
  },
  {
    title: 'Repositori & Dokumen',
    items: [
      { id: 'documents', name: 'Dokumen Vault', icon: Archive },
      { id: 'correspondence', name: 'Surat Menyurat', icon: Send },
      { id: 'knowledge', name: 'Database Regulasi', icon: BookOpen },
      { id: 'templates', name: 'Template & Klausul', icon: Library }
    ]
  },
  {
    title: 'Laporan & Sistem',
    items: [
      { id: 'master-data', name: 'Data Master & Filter', icon: Database },
      { id: 'reports', name: 'Laporan Eksekutif', icon: BarChart3 },
      { id: 'activity', name: 'Audit Activity Log', icon: History },
      { id: 'settings', name: 'Pengaturan Sistem', icon: Settings }
    ]
  }
]);

function isItemActive(itemId) {
  if (legalStore.state.activeModule === 'tenders') {
    if (itemId === 'tenders' && (legalStore.state.activeTenderTab === 'pipeline' || !legalStore.state.activeTenderTab)) return true;
    if (itemId === 'tender-documents' && legalStore.state.activeTenderTab === 'gap-analysis') return true;
    if (itemId === 'tender-bonds' && legalStore.state.activeTenderTab === 'bonds') return true;
    return false;
  }
  return legalStore.state.activeModule === itemId;
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('');
}
</script>
