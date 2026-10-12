<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Repositori Master Kualifikasi
          </span>
          <span class="text-xs text-[#475569] font-medium">Kualifikasi Lelang & Sertifikasi</span>
        </div>
        <h2 class="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Bank Dokumen Kualifikasi Tender
        </h2>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi berkas legalitas, izin teknis, sertifikat ISO/SBU, dan laporan keuangan perusahaan yang siap digunakan sewaktu-waktu untuk pemenuhan syarat lelang pengadaan.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4 text-[#6366F1]" />
          <span>Tambah Dokumen Master</span>
        </button>
      </div>
    </div>

    <!-- KPI Summary Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-[#475569]">Total Dokumen Master</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ vaultDocs.length }}</span>
          <span class="text-xs text-[#475569]">Berkas Siap</span>
        </div>
        <div class="text-[11px] text-[#6366F1] font-semibold mt-1">
          Tersertifikasi & Terverifikasi
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-emerald-700">Status Valid / Aktif</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-emerald-600">{{ validDocsCount }}</span>
          <span class="text-xs text-emerald-600 font-medium">Dokumen</span>
        </div>
        <div class="text-[11px] text-emerald-700 font-semibold mt-1">
          Siap dilampirkan tanpa kendala
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-amber-700">Segera Kedaluwarsa (&lt; 60 Hari)</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-amber-600">{{ expiringSoonDocsCount }}</span>
          <span class="text-xs text-[#475569]">Perlu Perpanjangan</span>
        </div>
        <div class="text-[11px] text-amber-700 font-semibold mt-1">
          Jadwalkan pembaharuan audit/izin
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-[#0F172A]">Total Utilisasi Tender</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ totalUtilizations }}</span>
          <span class="text-xs text-[#475569]">Penggunaan</span>
        </div>
        <div class="text-[11px] text-[#475569] mt-1">
          Pada seluruh paket lelang aktif
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Search -->
        <div class="md:col-span-6 relative">
          <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama dokumen master, kode, nomor izin/SK, penerbit..."
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

        <!-- Filter Kategori -->
        <div class="md:col-span-3">
          <select
            v-model="filterCategory"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Legal Administrasi">Legal Administrasi</option>
            <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
            <option value="Keuangan & Pajak">Keuangan & Pajak</option>
            <option value="Kepatuhan & Sertifikasi">Kepatuhan & Sertifikasi</option>
          </select>
        </div>

        <!-- Filter Status -->
        <div class="md:col-span-3">
          <select
            v-model="filterStatus"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Status Masa Berlaku</option>
            <option value="VALID">Valid / Berlaku Selamanya</option>
            <option value="EXPIRING_SOON">Segera Kedaluwarsa</option>
            <option value="EXPIRED">Kedaluwarsa</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Document Cards Grid Component -->
    <TenderVaultCards
      :docs="filteredVaultDocs"
      @open-link="openLinkTenderModal"
    />

    <!-- Modal: Tambah Dokumen Master Baru -->
    <AddVaultDocModal
      v-if="isAddModalOpen"
      @close="isAddModalOpen = false"
    />

    <!-- Modal: Tautkan Dokumen ke Paket Lelang -->
    <LinkTenderModal
      v-if="isLinkTenderModalOpen"
      :doc="selectedVaultDoc"
      @close="isLinkTenderModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus, Search } from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';
import TenderVaultCards from './Tenders/TenderVaultCards.vue';
import AddVaultDocModal from './Tenders/Modals/AddVaultDocModal.vue';
import LinkTenderModal from './Tenders/Modals/LinkTenderModal.vue';

const searchQuery = ref('');
const filterCategory = ref('ALL');
const filterStatus = ref('ALL');

const isAddModalOpen = ref(false);
const isLinkTenderModalOpen = ref(false);
const selectedVaultDoc = ref(null);

const vaultDocs = computed(() => legalStore.state.tenderVault || []);

const validDocsCount = computed(() => {
  return vaultDocs.value.filter(d => {
    if (!d.expiryDate) return true;
    return calculateDaysRemaining(d.expiryDate) > 60;
  }).length;
});

const expiringSoonDocsCount = computed(() => {
  return vaultDocs.value.filter(d => {
    if (!d.expiryDate) return false;
    const days = calculateDaysRemaining(d.expiryDate);
    return days <= 60 && days >= 0;
  }).length;
});

const totalUtilizations = computed(() => {
  return vaultDocs.value.reduce((acc, d) => acc + (d.tendersUsed?.length || 0), 0);
});

const filteredVaultDocs = computed(() => {
  return vaultDocs.value.filter(doc => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchCode = doc.code?.toLowerCase().includes(q);
      const matchNumber = doc.number?.toLowerCase().includes(q);
      const matchIssuer = doc.issuer?.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchNumber && !matchIssuer) return false;
    }

    if (filterCategory.value !== 'ALL' && doc.category !== filterCategory.value) {
      return false;
    }

    if (filterStatus.value === 'VALID') {
      if (doc.expiryDate && calculateDaysRemaining(doc.expiryDate) <= 60) return false;
    } else if (filterStatus.value === 'EXPIRING_SOON') {
      if (!doc.expiryDate) return false;
      const days = calculateDaysRemaining(doc.expiryDate);
      if (days > 60 || days < 0) return false;
    } else if (filterStatus.value === 'EXPIRED') {
      if (!doc.expiryDate) return false;
      if (calculateDaysRemaining(doc.expiryDate) >= 0) return false;
    }

    return true;
  });
});

function openLinkTenderModal(doc) {
  selectedVaultDoc.value = doc;
  isLinkTenderModalOpen.value = true;
}
</script>
