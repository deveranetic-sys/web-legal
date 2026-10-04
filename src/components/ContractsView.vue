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
            class="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A] text-xs"
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

    <!-- Contract Register Table -->
    <div class="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs uppercase text-[#475569] font-semibold tracking-wider">
            <tr>
              <th scope="col" class="py-3 px-4">Nomor & ID</th>
              <th scope="col" class="py-3 px-4">Judul Kontrak & Entitas</th>
              <th scope="col" class="py-3 px-4">Mitra Rekanan</th>
              <th scope="col" class="py-3 px-4">Jenis</th>
              <th scope="col" class="py-3 px-4">Masa Berlaku</th>
              <th scope="col" class="py-3 px-4 text-right">Nilai Kontrak</th>
              <th scope="col" class="py-3 px-4 text-center">Status</th>
              <th scope="col" class="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E2E8F0]">
            <tr
              v-for="contract in filteredContracts"
              :key="contract.id"
              class="hover:bg-[#F8FAFC] transition-colors"
            >
              <!-- ID & Nomor -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-mono text-xs font-semibold text-[#0F172A] bg-blue-50 px-2 py-0.5 rounded border border-[#C7D2FE] w-fit">
                  {{ contract.id }}
                </div>
                <div class="text-xs text-[#475569] mt-1 font-mono truncate max-w-[140px]" :title="contract.contractNumber">
                  {{ contract.contractNumber }}
                </div>
              </td>

              <!-- Judul & Entitas -->
              <td class="py-3.5 px-4 min-w-[220px]">
                <div class="font-semibold text-[#0F172A] hover:text-[#6366F1] cursor-pointer transition-colors" @click="openContractDetail(contract)">
                  {{ contract.contractTitle }}
                </div>
                <div class="flex items-center gap-1.5 mt-1 text-xs text-[#475569]">
                  <Building2 class="w-3.5 h-3.5 text-[#475569]" />
                  <span>{{ contract.company }}</span>
                </div>
              </td>

              <!-- Mitra Rekanan -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-medium text-[#0F172A]">{{ contract.counterparty }}</div>
                <div class="text-xs text-[#475569] mt-0.5 flex items-center gap-1">
                  <span>PIC: {{ contract.pic || '-' }}</span>
                </div>
              </td>

              <!-- Tipe -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-[#0F172A]">
                  {{ contract.contractType }}
                </span>
              </td>

              <!-- Masa Berlaku -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-[#0F172A]">
                  {{ formatDate(contract.expiryDate) }}
                </div>
                <!-- Sisa Hari Indicator -->
                <div class="mt-1">
                  <span
                    v-if="getDaysRemaining(contract.expiryDate) < 0"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded"
                  >
                    Kedaluwarsa
                  </span>
                  <span
                    v-else-if="getDaysRemaining(contract.expiryDate) <= 7"
                    class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded animate-pulse"
                  >
                    Kritis (Sisa {{ getDaysRemaining(contract.expiryDate) }} Hari)
                  </span>
                  <span
                    v-else-if="getDaysRemaining(contract.expiryDate) <= 30"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded"
                  >
                    Siaga (Sisa {{ getDaysRemaining(contract.expiryDate) }} Hari)
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 text-[11px] text-[#475569]"
                  >
                    Sisa {{ getDaysRemaining(contract.expiryDate) }} Hari
                  </span>
                </div>
              </td>

              <!-- Nilai Kontrak -->
              <td class="py-3.5 px-4 whitespace-nowrap text-right">
                <div class="font-semibold text-[#0F172A] font-mono text-xs">
                  {{ formatIDR(contract.contractValue) }}
                </div>
                <div class="text-[11px] text-[#475569] mt-0.5">
                  {{ contract.renewalStatus }}
                </div>
              </td>

              <!-- Status Badge -->
              <td class="py-3.5 px-4 whitespace-nowrap text-center">
                <span
                  v-if="contract.status === 'ACTIVE'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-[#BBF7D0]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Aktif
                </span>
                <span
                  v-else-if="contract.status === 'EXPIRING'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-[#FDE68A]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  Masa Siaga
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-[#475569] border border-[#E2E8F0]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Kedaluwarsa
                </span>
              </td>

              <!-- Aksi -->
              <td class="py-3.5 px-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="openContractDetail(contract)"
                    class="p-1.5 rounded-lg text-[#475569] hover:text-[#6366F1] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Buka Lembar Telaah Detail"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    v-if="canDeleteContract"
                    @click="confirmDelete(contract)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Kontrak (Izin Khusus)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredContracts.length === 0">
              <td colspan="8" class="py-12 text-center">
                <FileX class="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 class="text-base font-semibold text-[#0F172A]">Tidak ada kontrak yang sesuai</h4>
                <p class="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
                  Kriteria pencarian atau filter yang Anda pilih saat ini tidak menemukan berkas perjanjian terkait.
                </p>
                <button
                  @click="resetFilters"
                  class="mt-4 px-3 py-1.5 text-xs font-semibold text-[#4338CA] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer border border-[#C7D2FE]"
                >
                  Reset Filter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer / Pagination simulation -->
      <div class="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#475569]">
        <div>
          Menampilkan <span class="font-semibold text-[#0F172A]">{{ filteredContracts.length }}</span> dari
          <span class="font-semibold text-[#0F172A]">{{ contracts.length }}</span> entri register
        </div>
        <div class="flex items-center gap-1">
          <span class="text-[#475569]">Sistem terenkripsi AES-256 • Integritas Audit Trail Aktif</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Download,
  Plus,
  Search,
  Building2,
  Eye,
  Trash2,
  FileX,
  AlertTriangle
} from 'lucide-vue-next';
import { legalStore, formatIDR, calculateDaysRemaining } from '../stores/legalStore';

const searchQuery = ref('');
const filterStatus = ref('ALL');
const filterType = ref('ALL');
const filterEntity = ref('ALL');

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

const canDeleteContract = computed(() => {
  return legalStore.canAccess('Contract Management', 'delete');
});

const filteredContracts = computed(() => {
  return contracts.value.filter(c => {
    // Search query matching
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      c.id.toLowerCase().includes(q) ||
      c.contractNumber.toLowerCase().includes(q) ||
      c.contractTitle.toLowerCase().includes(q) ||
      c.counterparty.toLowerCase().includes(q);

    // Status matching
    let matchesStatus = true;
    if (filterStatus.value === 'ACTIVE') {
      matchesStatus = c.status === 'ACTIVE';
    } else if (filterStatus.value === 'EXPIRING') {
      const days = calculateDaysRemaining(c.expiryDate);
      matchesStatus = days <= 30 && c.status !== 'EXPIRED';
    } else if (filterStatus.value === 'EXPIRED') {
      matchesStatus = c.status === 'EXPIRED' || calculateDaysRemaining(c.expiryDate) < 0;
    }

    // Type matching
    const matchesType = filterType.value === 'ALL' || c.contractType === filterType.value;

    // Entity matching
    const matchesEntity = filterEntity.value === 'ALL' || c.company === filterEntity.value;

    return matchesSearch && matchesStatus && matchesType && matchesEntity;
  });
});

function getDaysRemaining(date) {
  return calculateDaysRemaining(date);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

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

function confirmDelete(contract) {
  if (confirm(`Apakah Anda yakin ingin menghapus kontrak "${contract.contractTitle}" (${contract.id})? Tindakan ini akan dicatat dalam Audit Trail.`)) {
    legalStore.deleteContract(contract.id);
  }
}
</script>
