<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]">
            Audit Dokumen & Gap Analysis
          </span>
          <span class="text-xs text-[#475569] font-medium">Tracking Berkas Terpenuhi vs Masih Kurang</span>
        </div>
        <h2 class="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Audit Dokumen & Analisis Gap Lelang
        </h2>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi pemetaan dokumen persyaratan lelang: verifikasi berkas yang telah digunakan dan tindakan cepat melengkapi dokumen yang masih kurang.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="legalStore.exportGapAnalysisCSV()"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          title="Ekspor laporan gap analysis ke CSV"
        >
          <Download class="w-4 h-4 text-[#475569]" />
          <span>Ekspor Gap (CSV)</span>
        </button>

        <button
          @click="legalStore.navigate('documents')"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Archive class="w-4 h-4 text-[#6366F1]" />
          <span>Buka Dokumen Vault (Bank Kualifikasi)</span>
        </button>
      </div>
    </div>

    <!-- LANGKAH 1: DAFTAR PAKET LELANG (EXTRACTED COMPONENT) -->
    <TenderGapProjectList
      v-if="activeStep === 'list'"
      :tenders="tenders"
      :total-missing-docs="totalMissingDocs"
      @select-tender="openProjectGapDetail"
      class="animate-in fade-in duration-200"
    />

    <!-- ======================================================== -->
    <!-- LANGKAH 2: DETAIL AUDIT DOKUMEN & GAP ANALYSIS           -->
    <!-- HANYA MUNCUL SETELAH PAKET DI-KLIK DARI LANGKAH 1        -->
    <!-- ======================================================== -->
    <div v-else-if="activeStep === 'detail'" class="space-y-6 animate-in fade-in duration-200">
      <!-- Navigation Header Bar (Back to Step 1 & Quick Switcher) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <button
          @click="backToGapList"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EEF2FF] text-[#4338CA] hover:bg-[#283A52] text-xs font-bold transition-all cursor-pointer shadow-xs group"
        >
          <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>← Kembali ke Daftar Paket Lelang (Langkah 1)</span>
        </button>

        <!-- Breadcrumb & Switcher -->
        <div class="flex items-center gap-3 text-xs flex-wrap">
          <span class="text-[#475569]">Ganti Proyek:</span>
          <select
            :value="filterTenderId"
            @change="selectTender($event.target.value)"
            class="py-1.5 px-3 text-xs font-bold border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-[#F8FAFC] text-[#0F172A]"
          >
            <option value="ALL">Semua Paket (Konsolidasi Global)</option>
            <option v-for="t in tenders" :key="t.id" :value="t.id">
              {{ t.id }} - {{ t.title }}
            </option>
          </select>
        </div>
      </div>

      <!-- Focused Project Callout (when a specific project is selected) -->
      <div
        v-if="selectedTender"
        class="p-4 rounded-xl bg-gradient-to-r from-amber-50/50 via-white to-slate-50 border border-[#C7D2FE] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-mono text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2 py-0.5 rounded border border-[#C7D2FE]">
              {{ selectedTender.id }}
            </span>
            <span class="font-bold text-[#0F172A] text-sm">
              {{ selectedTender.title }}
            </span>
            <span class="text-[#475569] font-mono text-[11px]">
              ({{ selectedTender.tenderNumber }})
            </span>
          </div>
          <div class="text-[#475569] flex items-center gap-3 flex-wrap">
            <span>Panitia: <strong class="text-[#0F172A]">{{ selectedTender.organizer }}</strong></span>
            <span>•</span>
            <span>PIC: <strong class="text-[#0F172A]">{{ selectedTender.pic }}</strong></span>
            <span>•</span>
            <span>Pagu HPS: <strong class="text-[#0F172A] font-mono">{{ formatIDR(selectedTender.hpsValue) }}</strong></span>
            <span>•</span>
            <span>Batas Waktu: <strong class="text-[#0F172A]">{{ selectedTender.deadlineDate }} ({{ calculateDaysRemaining(selectedTender.deadlineDate) }} hari lagi)</strong></span>
          </div>
        </div>

        <button
          @click="goToTenderProgress(selectedTender.id)"
          class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
        >
          <Milestone class="w-4 h-4 text-[#6366F1]" />
          <span>Lihat Siklus 8 Tahapan Lelang Proyek Ini →</span>
        </button>
      </div>

      <!-- Focused Global Callout (when ALL is selected) -->
      <div
        v-else
        class="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#0B1325] text-white border border-[#C7D2FE] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold bg-blue-600 text-[#0F172A] px-2 py-0.5 rounded">
              GLOBAL
            </span>
            <span class="font-bold text-white text-sm">
              Audit Konsolidasi Lintas Seluruh Paket Lelang
            </span>
          </div>
          <p class="text-slate-300 text-xs">
            Menampilkan seluruh dokumen kurang dan status kelengkapan berkas dari seluruh {{ tenders.length }} proyek aktif.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-rose-300 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800 font-bold">
            {{ totalMissingDocs }} Total Dokumen Kurang
          </span>
        </div>
      </div>

      <!-- KPI SUMMARY GRID (DYNAMIC FOR SELECTED PROJECT / GLOBAL) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div class="bg-white p-4 rounded-xl border border-[#FECDD3] bg-rose-50/20 shadow-xs">
          <span class="text-xs font-semibold text-rose-700">
            {{ selectedTender ? 'Dokumen Kurang Proyek Ini' : 'Total Dokumen Kurang' }}
          </span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-rose-600">{{ activeMissingDocsCount }}</span>
            <span class="text-xs text-rose-600 font-medium">Persyaratan</span>
          </div>
          <div class="text-[11px] text-rose-700 font-semibold mt-1">
            {{ selectedTender ? `Prioritas Pelengkapan (${selectedTender.id})` : `${tendersWithMissingCount} Paket Lelang Terdampak` }}
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span class="text-xs font-semibold text-amber-700">Dokumen Wajib (Mandatory Gap)</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-amber-600">{{ activeMandatoryMissingCount }}</span>
            <span class="text-xs text-[#475569]">Wajib Gugur</span>
          </div>
          <div class="text-[11px] text-[#475569] mt-1">
            Kritikal untuk kelolosan evaluasi teknis/legal
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span class="text-xs font-semibold text-orange-700">Dokumen Kedaluwarsa</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-orange-600">{{ activeExpiredDocsCount }}</span>
            <span class="text-xs text-[#475569]">Perlu Perpanjangan</span>
          </div>
          <div class="text-[11px] text-[#475569] mt-1">
            Segera proses perpanjangan izin / sertifikat
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span class="text-xs font-semibold text-emerald-700">Dokumen Siap (Terpenuhi)</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-emerald-700">{{ activeFulfilledDocsCount }}</span>
            <span class="text-xs text-emerald-600 font-medium">/ {{ activeTotalDocsCount }} Total</span>
          </div>
          <div class="text-[11px] text-emerald-700 font-semibold mt-1">
            Tingkat Kesiapan {{ selectedTender ? 'Proyek' : 'Global' }}: {{ activeCompleteness }}%
          </div>
        </div>
      </div>

      <!-- Filters & Search Bar for Documents -->
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <!-- Search -->
          <div class="md:col-span-5 relative">
            <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama dokumen, paket lelang, nomor tender, instansi..."
              class="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] focus:border-[#C7D2FE] bg-white text-[#0F172A]"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A] text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Filter Paket Lelang -->
          <div class="md:col-span-3">
            <select
              v-model="filterTenderId"
              class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="ALL">Semua Paket Lelang ({{ tenders.length }})</option>
              <option v-for="t in tenders" :key="t.id" :value="t.id">
                {{ t.id }} - {{ t.tenderNumber }}
              </option>
            </select>
          </div>

          <!-- Filter Kategori Dokumen -->
          <div class="md:col-span-2">
            <select
              v-model="filterCategory"
              class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Legal Administrasi">Legal Administrasi</option>
              <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
              <option value="Finansial & Keuangan">Finansial & Keuangan</option>
              <option value="Kepatuhan & Integritas">Kepatuhan & Integritas</option>
            </select>
          </div>

          <!-- Filter Urgensi -->
          <div class="md:col-span-2">
            <select
              v-model="filterUrgency"
              class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="ALL">Semua Status Gap</option>
              <option value="MANDATORY_ONLY">Hanya Dokumen Wajib</option>
              <option value="URGENT_DEADLINE">Tenggat < 7 Hari</option>
              <option value="EXPIRED_ONLY">Hanya Kedaluwarsa</option>
            </select>
          </div>
        </div>

        <!-- Quick Filter Pills -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[#475569]">Tampilkan:</span>
            <button
              @click="activeViewSection = 'action-list'"
              :class="activeViewSection === 'action-list' ? 'bg-[#1E293B] text-white font-bold' : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'"
              class="px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            >
              <FileWarning class="w-3.5 h-3.5 text-rose-400" />
              <span>Daftar Dokumen Kurang ({{ filteredMissingList.length }})</span>
            </button>
            <button
              @click="activeViewSection = 'matrix'"
              :class="activeViewSection === 'matrix' ? 'bg-[#1E293B] text-white font-bold' : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'"
              class="px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            >
              <LayoutGrid class="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Matriks Pemetaan Lintas Tender</span>
            </button>
            <button
              v-if="searchQuery || filterTenderId !== 'ALL' || filterCategory !== 'ALL' || filterUrgency !== 'ALL'"
              @click="resetFilters"
              class="text-rose-600 hover:text-rose-700 font-semibold underline ml-2 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>

          <div class="text-[#475569]">
            Ditemukan <span class="font-bold text-[#0F172A]">{{ filteredMissingList.length }}</span> item dokumen perlu penanganan
          </div>
        </div>
      </div>

      <!-- VIEW SECTION 1: DAFTAR TINDAKAN DOKUMEN KURANG -->
      <TenderGapActionList
        v-if="activeViewSection === 'action-list'"
        :items="filteredMissingList"
        @open-link="openLinkVaultModal"
        @fulfill="markDocFulfilled"
        @edit-notes="promptEditNotes"
      />

      <!-- VIEW SECTION 2: MATRIKS PEMETAAN LINTAS TENDER -->
      <TenderGapMatrix
        v-else-if="activeViewSection === 'matrix'"
        :tenders="tenders"
        :filter-tender-id="filterTenderId"
      />

      <!-- Bottom Return Bar in Step 2 -->
      <div class="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <button
          @click="backToGapList"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] text-xs font-bold transition cursor-pointer shadow-xs"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>← Selesai & Kembali ke Daftar Paket Lelang (Langkah 1)</span>
        </button>

        <span class="text-xs text-[#475569]">
          Audit Mode: <strong class="text-[#0F172A]">{{ selectedTender ? selectedTender.id + ' • ' + selectedTender.title : 'Konsolidasi Global Lintas Tender' }}</strong>
        </span>
      </div>
    </div>

    <!-- MODAL: TAUTKAN DOKUMEN DARI BANK DOKUMEN -->
    <LinkVaultDocModal
      :is-open="isLinkModalOpen"
      :selected-item="selectedMissingItem"
      @close="isLinkModalOpen = false"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Download,
  Archive,
  Search,
  FileWarning,
  LayoutGrid,
  ArrowLeft,
  Milestone
} from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining, formatIDR } from '../stores/legalStore';

// Extracted Sub-Components & Modals
import TenderGapProjectList from './Tenders/GapAnalysis/TenderGapProjectList.vue';
import TenderGapActionList from './Tenders/GapAnalysis/TenderGapActionList.vue';
import TenderGapMatrix from './Tenders/GapAnalysis/TenderGapMatrix.vue';
import LinkVaultDocModal from './Tenders/Modals/LinkVaultDocModal.vue';

// State
const activeStep = ref('list'); // 'list' or 'detail'
const searchQuery = ref('');
const filterTenderId = ref(legalStore.state.selectedTenderId || 'ALL');
const filterCategory = ref('ALL');
const filterUrgency = ref('ALL');
const activeViewSection = ref('action-list'); // 'action-list' or 'matrix'

const isLinkModalOpen = ref(false);
const selectedMissingItem = ref(null);

// Computed datasets from store
const tenders = computed(() => legalStore.state.tenders || []);

const selectedTender = computed(() => {
  if (filterTenderId.value === 'ALL') return null;
  return tenders.value.find(t => t.id === filterTenderId.value) || null;
});

function openProjectGapDetail(id) {
  filterTenderId.value = id;
  if (id !== 'ALL') {
    legalStore.setSelectedTender(id);
  }
  activeStep.value = 'detail';
}

function backToGapList() {
  activeStep.value = 'list';
}

function selectTender(id) {
  filterTenderId.value = id;
  if (id !== 'ALL') {
    legalStore.setSelectedTender(id);
  }
}

function goToTenderProgress(tenderId) {
  legalStore.setSelectedTender(tenderId);
  legalStore.setTenderTab('pipeline');
}

function getTenderMissingDocs(t) {
  return t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
}

const totalAllDocs = computed(() => {
  return tenders.value.reduce((acc, t) => acc + (t.documents?.length || 0), 0);
});

const totalFulfilledDocs = computed(() => {
  return tenders.value.reduce((acc, t) => {
    return acc + (t.documents?.filter(d => d.status === 'TERPENUHI').length || 0);
  }, 0);
});

const totalMissingDocs = computed(() => {
  return tenders.value.reduce((acc, t) => {
    return acc + (t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0);
  }, 0);
});

const tendersWithMissingCount = computed(() => {
  return tenders.value.filter(t => {
    return t.documents?.some(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA');
  }).length;
});

const activeMissingDocsCount = computed(() => {
  if (selectedTender.value) {
    return getTenderMissingDocs(selectedTender.value);
  }
  return totalMissingDocs.value;
});

const activeMandatoryMissingCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.filter(d => (d.status === 'KURANG' || d.status === 'KEDALUWARSA') && d.isMandatory).length || 0;
  }
  return mandatoryMissingDocsCount.value;
});

const activeExpiredDocsCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.filter(d => d.status === 'KEDALUWARSA').length || 0;
  }
  return expiredDocsCount.value;
});

const activeFulfilledDocsCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.filter(d => d.status === 'TERPENUHI').length || 0;
  }
  return totalFulfilledDocs.value;
});

const activeTotalDocsCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.length || 0;
  }
  return totalAllDocs.value;
});

const activeCompleteness = computed(() => {
  if (activeTotalDocsCount.value === 0) return 100;
  return Math.round((activeFulfilledDocsCount.value / activeTotalDocsCount.value) * 100);
});

// All missing items aggregated across all tenders
const allMissingItems = computed(() => {
  const list = [];
  tenders.value.forEach(t => {
    (t.documents || []).forEach(d => {
      if (d.status === 'KURANG' || d.status === 'KEDALUWARSA') {
        list.push({
          tenderId: t.id,
          tenderNumber: t.tenderNumber,
          tenderTitle: t.title,
          organizer: t.organizer,
          company: t.company,
          deadline: t.deadlineDate,
          docId: d.id,
          docName: d.name,
          category: d.category,
          status: d.status,
          isMandatory: d.isMandatory,
          notes: d.notes,
          fileRef: d.fileRef
        });
      }
    });
  });
  return list;
});

const mandatoryMissingDocsCount = computed(() => {
  return allMissingItems.value.filter(item => item.isMandatory).length;
});

const expiredDocsCount = computed(() => {
  return allMissingItems.value.filter(item => item.status === 'KEDALUWARSA').length;
});

// Filtered missing items
const filteredMissingList = computed(() => {
  return allMissingItems.value.filter(item => {
    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchDoc = item.docName.toLowerCase().includes(q);
      const matchTender = item.tenderTitle.toLowerCase().includes(q) || item.tenderNumber.toLowerCase().includes(q);
      const matchOrg = item.organizer.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchDoc && !matchTender && !matchOrg && !matchNotes) return false;
    }

    // Tender Id filter
    if (filterTenderId.value !== 'ALL' && item.tenderId !== filterTenderId.value) {
      return false;
    }

    // Category filter
    if (filterCategory.value !== 'ALL' && item.category !== filterCategory.value) {
      return false;
    }

    // Urgency filter
    if (filterUrgency.value === 'MANDATORY_ONLY' && !item.isMandatory) {
      return false;
    }
    if (filterUrgency.value === 'URGENT_DEADLINE') {
      const days = calculateDaysRemaining(item.deadline);
      if (days > 7 || days < 0) return false;
    }
    if (filterUrgency.value === 'EXPIRED_ONLY' && item.status !== 'KEDALUWARSA') {
      return false;
    }

    return true;
  });
});

function markDocFulfilled(item) {
  legalStore.toggleTenderDocStatus(item.tenderId, item.docId, 'TERPENUHI', 'Diverifikasi dan dinyatakan lengkap');
}

function promptEditNotes(item) {
  const newNotes = window.prompt(`Perbarui catatan / kendala untuk "${item.docName}":`, item.notes || '');
  if (newNotes !== null) {
    legalStore.toggleTenderDocStatus(item.tenderId, item.docId, item.status, newNotes);
  }
}

function openLinkVaultModal(item) {
  selectedMissingItem.value = item;
  isLinkModalOpen.value = true;
}

function resetFilters() {
  searchQuery.value = '';
  filterTenderId.value = 'ALL';
  filterCategory.value = 'ALL';
  filterUrgency.value = 'ALL';
}
</script>
