<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Modul Operasional Utama
          </span>
          <span class="text-xs text-[#475569] font-medium">Versi Register 2026.1</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Register & Manajemen Kontrak
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi siklus hidup perjanjian bisnis, klausul esensial, adendum, dan pemantauan masa kedaluwarsa.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 shrink-0 flex-nowrap">
        <button
          @click="legalStore.exportContractsCSV()"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-sm font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          title="Ekspor daftar kontrak ke file CSV"
        >
          <Download class="w-4 h-4 text-[#475569]" />
          <span>Ekspor CSV</span>
        </button>

        <button
          v-if="canCreateContract"
          @click="legalStore.state.isAddContractModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4 text-white" />
          <span>Tambah Kontrak</span>
        </button>
        <div v-else class="text-xs text-[#475569] bg-slate-100 px-3 py-2 rounded-lg border border-[#E2E8F0] whitespace-nowrap">
          Peran <span class="font-bold text-[#0F172A]">{{ legalStore.state.currentUser?.role }}</span> dibatasi (hanya baca).
        </div>
      </div>
    </div>

    <!-- Permission Warning for Requestor -->
    <div v-if="!canAccessModule" class="bg-amber-50 border border-[#FDE68A] rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h4 class="text-sm font-bold text-amber-900">Perhatian Hak Akses RBAC</h4>
        <p class="text-xs text-amber-700 mt-0.5">
          Role <span class="font-bold">{{ legalStore.state.currentUser?.role }}</span> dalam matriks kewenangan tidak memiliki izin edit/tulis pada modul ini. Data ditampilkan dalam mode pratinjau terbatas.
        </p>
      </div>
    </div>

    <!-- Quick Metrics Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
        <span class="text-xs font-medium text-[#475569]">Total Kontrak Terdata</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ contracts.length }}</span>
          <span class="text-xs text-[#475569]">Berkas</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
        <span class="text-xs font-semibold text-emerald-600">Status Aktif & Valid</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-emerald-700">{{ activeContractsCount }}</span>
          <span class="text-xs text-emerald-600 font-medium">Operasional</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
        <span class="text-xs font-semibold text-amber-600">Masa Siaga (≤ 30 Hari)</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-amber-700">{{ expiringCount }}</span>
          <span class="text-xs text-amber-600 font-medium">Perlu Review</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
        <span class="text-xs font-medium text-[#475569]">Nilai Komitmen Tercatat</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-lg font-bold text-[#0F172A] truncate" :title="formatIDR(totalValue)">
            {{ formatCompactIDR(totalValue) }}
          </span>
          <span class="text-xs text-[#475569]">IDR</span>
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Search Input -->
        <div class="md:col-span-5 relative">
          <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul kontrak, nomor, mitra rekanan, atau ID..."
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

        <!-- Filter Status -->
        <div class="md:col-span-3">
          <select
            v-model="filterStatus"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif (Valid)</option>
            <option value="EXPIRING">Masa Siaga (≤ 30 Hari)</option>
            <option value="EXPIRED">Kedaluwarsa</option>
          </select>
        </div>

        <!-- Filter Tipe Kontrak -->
        <div class="md:col-span-2">
          <select
            v-model="filterType"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Tipe</option>
            <option value="PPA">PPA</option>
            <option value="EPC">EPC</option>
            <option value="CSA">CSA</option>
            <option value="Sewa">Sewa</option>
            <option value="Insurance">Asuransi</option>
            <option value="Konsultansi">Konsultansi</option>
          </select>
        </div>

        <!-- Filter Entitas -->
        <div class="md:col-span-2">
          <select
            v-model="filterEntity"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Entitas</option>
            <option value="PT Nusantara Energi">PT Nusantara Energi</option>
            <option value="PT Java Power Solutions">PT Java Power Solutions</option>
            <option value="PT Borneo Mineral Resources">PT Borneo Mineral</option>
            <option value="PT Sumatera Green Energy">PT Sumatera Green</option>
          </select>
        </div>
      </div>

      <!-- Quick Pill Filters & Active count -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[#475569]">Filter Cepat:</span>
          <button
            @click="setQuickFilter('ALL')"
            :class="filterStatus === 'ALL' && filterType === 'ALL' ? 'bg-[#1E293B] text-white font-medium shadow-xs' : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'"
            class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Semua ({{ contracts.length }})
          </button>
          <button
            @click="setQuickFilter('ACTIVE')"
            :class="filterStatus === 'ACTIVE' ? 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] font-medium' : 'bg-[#DCFCE7] text-[#166534] hover:bg-emerald-100'"
            class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Aktif ({{ activeContractsCount }})
          </button>
          <button
            @click="setQuickFilter('EXPIRING')"
            :class="filterStatus === 'EXPIRING' ? 'bg-[#1E293B] text-amber-400 font-medium' : 'bg-[#FEF3C7] text-[#92400E] hover:bg-amber-100'"
            class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Siaga ({{ expiringCount }})
          </button>
          <button
            v-if="hasActiveFilter"
            @click="resetFilters"
            class="text-rose-600 hover:text-rose-700 font-semibold underline ml-2 cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>

        <div class="text-[#475569]">
          Menampilkan <span class="font-bold text-[#0F172A]">{{ filteredContracts.length }}</span> dari {{ contracts.length }} kontrak
        </div>
      </div>
    </div>

    <!-- Contract Register Table Component -->
    <ContractsTable
      :contracts="filteredContracts"
      :total-count="contracts.length"
      @open-detail="openContractDetail"
      @open-edit="openEditModal"
      @reset-filters="resetFilters"
    />

    <!-- Edit Contract Modal -->
    <EditContractModal
      v-if="isEditModalOpen"
      :contract="selectedEditContract"
      @close="isEditModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Download,
  Plus,
  Search,
  AlertTriangle
} from 'lucide-vue-next';
import { legalStore, formatIDR, calculateDaysRemaining } from '../stores/legalStore';
import ContractsTable from './Contracts/ContractsTable.vue';
import EditContractModal from './Contracts/EditContractModal.vue';

const searchQuery = ref('');
const filterStatus = ref('ALL');
const filterType = ref('ALL');
const filterEntity = ref('ALL');

const isEditModalOpen = ref(false);
const selectedEditContract = ref(null);

function openEditModal(contract) {
  selectedEditContract.value = contract;
  isEditModalOpen.value = true;
}

const contracts = computed(() => legalStore.state.contracts);

const activeContractsCount = computed(() => {
  return contracts.value.filter(c => c.status === 'ACTIVE').length;
});

const expiringCount = computed(() => {
  return contracts.value.filter(c => {
    const days = calculateDaysRemaining(c.expiryDate);
    return days <= 30 && c.status !== 'EXPIRED';
  }).length;
});

const totalValue = computed(() => {
  return contracts.value.reduce((acc, c) => acc + (c.contractValue || 0), 0);
});

const hasActiveFilter = computed(() => {
  return searchQuery.value !== '' || filterStatus.value !== 'ALL' || filterType.value !== 'ALL' || filterEntity.value !== 'ALL';
});

const canAccessModule = computed(() => {
  return legalStore.canAccess('Contract Management', 'view');
});

const canCreateContract = computed(() => {
  return legalStore.canAccess('Contract Management', 'create');
});

const filteredContracts = computed(() => {
  return contracts.value.filter(c => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      c.id.toLowerCase().includes(q) ||
      c.contractNumber.toLowerCase().includes(q) ||
      c.contractTitle.toLowerCase().includes(q) ||
      c.counterparty.toLowerCase().includes(q);

    let matchesStatus = true;
    if (filterStatus.value === 'ACTIVE') {
      matchesStatus = c.status === 'ACTIVE';
    } else if (filterStatus.value === 'EXPIRING') {
      const days = calculateDaysRemaining(c.expiryDate);
      matchesStatus = days <= 30 && c.status !== 'EXPIRED';
    } else if (filterStatus.value === 'EXPIRED') {
      matchesStatus = c.status === 'EXPIRED' || calculateDaysRemaining(c.expiryDate) < 0;
    }

    const matchesType = filterType.value === 'ALL' || c.contractType === filterType.value;
    const matchesEntity = filterEntity.value === 'ALL' || c.company === filterEntity.value;

    return matchesSearch && matchesStatus && matchesType && matchesEntity;
  });
});

function formatCompactIDR(amount) {
  if (!amount) return 'Rp 0';
  if (amount >= 1_000_000_000_000) {
    return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} Triliun`;
  }
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)} Juta`;
  }
  return formatIDR(amount);
}

function setQuickFilter(status) {
  filterStatus.value = status;
}

function resetFilters() {
  searchQuery.value = '';
  filterStatus.value = 'ALL';
  filterType.value = 'ALL';
  filterEntity.value = 'ALL';
}

function openContractDetail(contract) {
  legalStore.state.selectedContract = contract;
  legalStore.state.isContractDetailModalOpen = true;
}
</script>
