<template>
  <div class="space-y-6">
    
    <!-- Welcome Banner (Pastel Surface with Soft Indigo Accents) -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white text-[#0F172A] rounded-2xl p-6 lg:p-7 shadow-card border border-[#E2E8F0] relative overflow-hidden bg-gradient-to-r from-white via-[#F9FAFB] to-[#EEF2FF]/60">
      <!-- Soft Pastel Glow Accent -->
      <div class="absolute -right-8 -bottom-8 w-64 h-64 bg-[#EEF2FF] rounded-full blur-3xl pointer-events-none opacity-70"></div>
      
      <div class="space-y-1.5 z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] text-xs font-semibold">
          <span>✦</span>
          <span>Surya Era Enterprise Legal Suite</span>
        </div>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">Executive Legal Operations Dashboard</h2>
        <p class="text-[#475569] text-xs lg:text-sm max-w-2xl leading-relaxed">
          Sentralisasi portofolio kontrak komersial, permohonan legal unit bisnis, tender pengadaan, sengketa BANI/Litigasi, dan kepatuhan regulasi grup perseroan.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 z-10">
        <button 
          @click="legalStore.exportContractsCSV()"
          class="flex items-center gap-1.5 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] border border-[#C7D2FE] text-xs font-semibold px-4 py-2.5 transition active:scale-95 cursor-pointer shadow-xs"
        >
          <Download class="w-4 h-4 text-[#4338CA]" />
          <span>Ekspor Ringkasan</span>
        </button>
        <button 
          v-if="canCreateContract"
          @click="openAddContract"
          class="flex items-center gap-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold px-4 py-2.5 shadow-sm transition active:scale-95 cursor-pointer focus:ring-3 focus:ring-[#C7D2FE]"
        >
          <Plus class="w-4 h-4" />
          <span>Daftar Kontrak Baru</span>
        </button>
      </div>
    </div>

    <!-- 6 KPI METRIC CARDS (Section 2.2 Standard Pastel Anatomy) -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      
      <!-- Metric 1: Permintaan Aktif -->
      <div
        @click="legalStore.navigate('requests')"
        class="bg-white rounded-xl p-5 shadow-card hover:shadow-floating transition-all duration-200 cursor-pointer border border-[#E2E8F0] hover:border-[#C7D2FE] flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] flex items-center justify-center">
            <ClipboardList class="w-5 h-5 text-[#4338CA]" />
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#4338CA]">
            Proses
          </span>
        </div>
        <div class="mt-3">
          <div class="text-[13px] text-[#475569] font-medium">Permintaan Aktif</div>
          <div class="text-3xl font-semibold text-[#0F172A] mt-0.5">{{ legalStore.kpis.value.pendingRequestsCount }}</div>
          <div class="text-xs text-[#94A3B8] mt-1.5 truncate">Dalam proses telaah</div>
        </div>
      </div>

      <!-- Metric 2: Overdue SLA -->
      <div
        @click="legalStore.navigate('requests')"
        class="bg-white rounded-xl p-5 shadow-card hover:shadow-floating transition-all duration-200 cursor-pointer border border-[#E2E8F0] hover:border-[#FECDD3] flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3] flex items-center justify-center">
            <AlertTriangle class="w-5 h-5 text-[#9F1239]" />
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFE4E6] text-[#9F1239]">
            Kritis
          </span>
        </div>
        <div class="mt-3">
          <div class="text-[13px] text-[#475569] font-medium">Overdue SLA</div>
          <div class="text-3xl font-semibold text-[#9F1239] mt-0.5">{{ legalStore.kpis.value.overdueRequestsCount }}</div>
          <div class="text-xs text-[#9F1239] font-medium mt-1.5 truncate">Tindakan segera</div>
        </div>
      </div>

      <!-- Metric 3: Kontrak Aktif -->
      <div
        @click="legalStore.navigate('contracts')"
        class="bg-white rounded-xl p-5 shadow-card hover:shadow-floating transition-all duration-200 cursor-pointer border border-[#E2E8F0] hover:border-[#BBF7D0] flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] flex items-center justify-center">
            <FileText class="w-5 h-5 text-[#166534]" />
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#166534]">
            Aktif
          </span>
        </div>
        <div class="mt-3">
          <div class="text-[13px] text-[#475569] font-medium">Kontrak Aktif</div>
          <div class="text-3xl font-semibold text-[#0F172A] mt-0.5">{{ legalStore.kpis.value.activeContractsCount }}</div>
          <div class="text-xs text-[#166534] font-medium mt-1.5 truncate">{{ formatCompactIDR(legalStore.kpis.value.totalContractValue) }}</div>
        </div>
      </div>

      <!-- Metric 4: Masa Siaga Kontrak -->
      <div
        @click="legalStore.navigate('contracts')"
        class="bg-white rounded-xl p-5 shadow-card hover:shadow-floating transition-all duration-200 cursor-pointer border border-[#E2E8F0] hover:border-[#FDE68A] flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] flex items-center justify-center">
            <Clock class="w-5 h-5 text-[#92400E]" />
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E]">
            Siaga
          </span>
        </div>
        <div class="mt-3">
          <div class="text-[13px] text-[#475569] font-medium">Masa Siaga</div>
          <div class="text-3xl font-semibold text-[#92400E] mt-0.5">{{ legalStore.kpis.value.expiringContractsCount }}</div>
          <div class="text-xs text-[#92400E] font-medium mt-1.5 truncate">{{ legalStore.kpis.value.criticalContractsCount }} kritis (&le;7 hari)</div>
        </div>
      </div>

      <!-- Metric 5: Kepatuhan Regulasi -->
      <div
        @click="legalStore.navigate('compliance')"
        class="bg-white rounded-xl p-5 shadow-card hover:shadow-floating transition-all duration-200 cursor-pointer border border-[#E2E8F0] hover:border-[#BBF7D0] flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] flex items-center justify-center">
            <ShieldCheck class="w-5 h-5 text-[#166534]" />
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#166534]">
            Mandatori
          </span>
        </div>
        <div class="mt-3">
          <div class="text-[13px] text-[#475569] font-medium">Kepatuhan</div>
          <div class="text-3xl font-semibold text-[#166534] mt-0.5">{{ legalStore.kpis.value.complianceScore }}%</div>
          <div class="text-xs text-[#475569] mt-1.5 truncate">ESDM & Minerba</div>
        </div>
      </div>

      <!-- Metric 6: Sengketa Litigasi -->
      <div
        @click="legalStore.navigate('disputes')"
        class="bg-white rounded-xl p-5 shadow-card hover:shadow-floating transition-all duration-200 cursor-pointer border border-[#E2E8F0] hover:border-[#BAE6FD] flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#075985] border border-[#BAE6FD] flex items-center justify-center">
            <Scale class="w-5 h-5 text-[#075985]" />
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E0F2FE] text-[#075985]">
            BANI
          </span>
        </div>
        <div class="mt-3">
          <div class="text-[13px] text-[#475569] font-medium">Sengketa</div>
          <div class="text-3xl font-semibold text-[#0F172A] mt-0.5">{{ legalStore.kpis.value.activeDisputesCount }}</div>
          <div class="text-xs text-[#075985] font-medium mt-1.5 truncate">Arbitrase BANI</div>
        </div>
      </div>

    </div>

    <!-- MAIN TWO COLUMNS -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- LEFT (8 COLS): URGENT CONTRACTS WATCHLIST -->
      <div class="lg:col-span-8 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-[#0F172A]">Daftar Pantau Kontrak Kritis (Urgent Watchlist)</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
              Sisa &le; 30 Hari
            </span>
          </div>
          <button 
            @click="legalStore.navigate('contracts')" 
            class="text-xs font-semibold text-[#4338CA] hover:text-[#6366F1] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Buka Register Lengkap</span>
            <span>&rarr;</span>
          </button>
        </div>

        <!-- Contract Cards -->
        <div class="space-y-3">
          <div 
            v-for="contract in urgentContracts" 
            :key="contract.id"
            class="bg-white border rounded-xl p-4 transition-all duration-200 hover:shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            :class="contract.daysRemaining <= 7 ? 'border-[#FECDD3] bg-[#FFE4E6]/20' : 'border-[#E2E8F0] hover:border-[#C7D2FE]'"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-[#0F172A]">{{ contract.id }}</span>
                <span class="text-[#CBD5E1]">•</span>
                <span class="text-xs font-semibold text-[#475569]">{{ contract.company }}</span>
                <span class="text-[#CBD5E1]">•</span>
                <span class="text-[11px] text-[#94A3B8]">{{ contract.contractType }}</span>
              </div>
              <h4 class="font-bold text-[#0F172A] text-sm hover:text-[#6366F1] transition cursor-pointer" @click="viewDetail(contract)">
                {{ contract.contractTitle }}
              </h4>
              <p class="text-xs text-[#475569]">
                Mitra: <span class="font-semibold text-[#0F172A]">{{ contract.counterparty }}</span> • Nilai: <span class="font-mono font-semibold text-[#0F172A]">{{ formatIDR(contract.contractValue) }}</span>
              </p>
            </div>

            <div class="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0">
              <span 
                v-if="contract.daysRemaining <= 7"
                class="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3] flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-[#9F1239] animate-ping"></span>
                Kritis: {{ contract.daysRemaining }} Hari Lagi
              </span>
              <span 
                v-else
                class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-[#92400E]"></span>
                Siaga: {{ contract.daysRemaining }} Hari Lagi
              </span>
              <button 
                @click="viewDetail(contract)" 
                class="text-xs font-semibold text-[#4338CA] hover:text-[#6366F1] hover:underline cursor-pointer transition-colors"
              >
                Buka Lembar Telaah &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT (4 COLS): CALENDAR OF LEGAL EVENTS & TENDER STATUS -->
      <div class="lg:col-span-4 space-y-5">
        <div>
          <h3 class="text-base font-bold text-[#0F172A] mb-3">Agenda & Sidang Hukum (2026)</h3>

          <div class="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-card space-y-3.5">
            
            <div class="flex gap-3 pb-3 border-b border-[#E2E8F0]">
              <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4338CA] flex flex-col items-center justify-center shrink-0 border border-[#C7D2FE] font-bold">
                <span class="text-[9px] uppercase font-bold text-[#4338CA]">SEP</span>
                <span class="text-xs font-black">29</span>
              </div>
              <div>
                <div class="font-bold text-[#0F172A] text-xs">Sidang BANI: Pemeriksaan Ahli</div>
                <div class="text-[11px] text-[#475569] mt-0.5">Sengketa Wanprestasi Turbin PLTU Palapa</div>
                <span class="inline-block mt-1 text-[10px] font-semibold text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-0.5 rounded-md">BANI Arbitration Center</span>
              </div>
            </div>

            <div class="flex gap-3 pb-3 border-b border-[#E2E8F0]">
              <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4338CA] flex flex-col items-center justify-center shrink-0 border border-[#C7D2FE] font-bold">
                <span class="text-[9px] uppercase font-bold text-[#4338CA]">OKT</span>
                <span class="text-xs font-black">05</span>
              </div>
              <div>
                <div class="font-bold text-[#0F172A] text-xs">Closing Amandemen PPA Cirata</div>
                <div class="text-[11px] text-[#475569] mt-0.5">Penandatanganan addendum perpanjangan COD</div>
                <span class="inline-block mt-1 text-[10px] font-semibold text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-0.5 rounded-md">Kantor Pusat PLN</span>
              </div>
            </div>

            <div class="flex gap-3 pb-3 border-b border-[#E2E8F0]">
              <div class="w-10 h-10 rounded-xl bg-[#FFE4E6] text-[#9F1239] flex flex-col items-center justify-center shrink-0 border border-[#FECDD3] font-bold">
                <span class="text-[9px] uppercase font-bold text-[#9F1239]">OKT</span>
                <span class="text-xs font-black">15</span>
              </div>
              <div>
                <div class="font-bold text-[#0F172A] text-xs">Batas Laporan LKPM Q3-2026</div>
                <div class="text-[11px] text-[#475569] mt-0.5">Kewajiban pelaporan realisasi investasi BKPM</div>
                <span class="inline-block mt-1 text-[10px] font-semibold text-[#9F1239] bg-[#FFE4E6] border border-[#FECDD3] px-2 py-0.5 rounded-md">OSS RBA BKPM</span>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4338CA] flex flex-col items-center justify-center shrink-0 border border-[#C7D2FE] font-bold">
                <span class="text-[9px] uppercase font-bold text-[#4338CA]">NOV</span>
                <span class="text-xs font-black">10</span>
              </div>
              <div>
                <div class="font-bold text-[#0F172A] text-xs">RUPS Luar Biasa Perseroan</div>
                <div class="text-[11px] text-[#475569] mt-0.5">Perubahan susunan direksi dan modal disetor</div>
                <span class="inline-block mt-1 text-[10px] font-semibold text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-0.5 rounded-md">Notaris & Kemenkumham</span>
              </div>
            </div>

          </div>
        </div>

        <!-- TENDER & LELANG PROGRESS WIDGET -->
        <div class="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-card space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <FileSpreadsheet class="w-4 h-4 text-[#6366F1]" />
              <h3 class="text-sm font-bold text-[#0F172A]">Kesiapan Dokumen Tender</h3>
            </div>
            <button
              @click="legalStore.navigate('tenders')"
              class="text-xs font-semibold text-[#4338CA] hover:text-[#6366F1] hover:underline cursor-pointer"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div class="space-y-2.5">
            <div
              v-for="tender in activeTendersList.slice(0, 3)"
              :key="tender.id"
              @click="legalStore.navigate('tenders')"
              class="p-3 rounded-xl border border-[#E2E8F0] hover:border-[#C7D2FE] transition-colors cursor-pointer bg-[#F9FAFB] hover:bg-white"
            >
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-semibold text-[#0F172A] truncate max-w-[170px]" :title="tender.title">{{ tender.id }}: {{ tender.title }}</span>
                <span
                  :class="tenderMissingCount(tender) === 0 ? 'text-[#166534] bg-[#DCFCE7] border-[#BBF7D0]' : 'text-[#9F1239] bg-[#FFE4E6] border-[#FECDD3]'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                >
                  {{ tenderMissingCount(tender) === 0 ? 'Lengkap 100%' : `${tenderMissingCount(tender)} Kurang` }}
                </span>
              </div>
              <div class="text-[11px] text-[#475569] flex items-center justify-between">
                <span class="truncate max-w-[140px]">{{ tender.organizer }}</span>
                <span class="font-medium text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-0.5 rounded-md text-[10px]">{{ tender.stage }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Download,
  Plus,
  ClipboardList,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  Scale,
  FileSpreadsheet
} from 'lucide-vue-next';
import { legalStore, formatIDR } from '../stores/legalStore';

const urgentContracts = computed(() => legalStore.urgentContracts.value);
const activeTendersList = computed(() => (legalStore.state.tenders || []).filter(t => t.status === 'ACTIVE'));

function tenderMissingCount(tender) {
  return tender.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
}

const canCreateContract = computed(() => {
  return legalStore.hasPermission('contracts', 'create');
});

function formatCompactIDR(amount) {
  if (!amount) return 'Rp 0';
  if (amount >= 1_000_000_000_000) return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} Triliun`;
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`;
  return formatIDR(amount);
}

function openAddContract() {
  legalStore.state.isAddContractModalOpen = true;
}

function viewDetail(contract) {
  legalStore.state.selectedContract = contract;
  legalStore.state.isContractDetailModalOpen = true;
}
</script>
