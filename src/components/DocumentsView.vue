<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#4338CA] border border-[#C7D2FE]">
            Digital Legal & Tender Vault
          </span>
          <span class="text-xs text-[#475569] font-medium">Tersimpan dengan Enkripsi AES-256 & Terverifikasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Dokumen Vault & Repositori Legal
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi penyimpanan akta korporasi, sertifikat tanah HGB, serta Bank Dokumen Kualifikasi Pengadaan Lelang (NIB, SBU, ISO, KSWP, dan Laporan KAP).
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 shrink-0 flex-nowrap">
        <button
          @click="openAddCorporateModal"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4 text-[#475569]" />
          <span>Registrasi Arsip</span>
        </button>

        <button
          @click="isAddVaultModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold shadow-xs focus:ring-3 focus:ring-[#C7D2FE] transition-all cursor-pointer whitespace-nowrap"
        >
          <UploadCloud class="w-4 h-4 text-white" />
          <span>Upload Dokumen</span>
        </button>
      </div>
    </div>

    <!-- Quick Metrics Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-medium text-[#475569]">Total Dokumen di Vault</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ totalAllVaultCount }}</span>
          <span class="text-xs text-[#475569]">Berkas Digital</span>
        </div>
        <div class="text-[11px] text-[#6366F1] font-semibold mt-1">
          {{ vaultDocs.length }} Kualifikasi • {{ corporateDocs.length }} Korporasi
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-emerald-700">Dokumen Kualifikasi Valid</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-emerald-700">{{ validDocsCount }}</span>
          <span class="text-xs text-emerald-600 font-medium">/ {{ vaultDocs.length }} Berkas</span>
        </div>
        <div class="text-[11px] text-[#475569] mt-1">
          Siap digunakan untuk pengadaan tender
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-[#0F172A]">Pemanfaatan di Tender</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ totalUtilizations }}</span>
          <span class="text-xs text-[#475569]">Kali Digunakan</span>
        </div>
        <div class="text-[11px] text-[#475569] mt-1">
          Tautan lintas paket lelang aktif
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-amber-700">Perlu Perpanjangan</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-amber-600">{{ expiringSoonDocsCount }}</span>
          <span class="text-xs text-[#475569]">Segera Habis</span>
        </div>
        <div class="text-[11px] text-rose-600 font-semibold mt-1">
          {{ expiredDocsCount }} Dokumen Sudah Kedaluwarsa
        </div>
      </div>
    </div>

    <!-- Segmented Navigation Tabs for Dokumen Vault -->
    <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-[#E2E8F0] overflow-x-auto text-xs sm:text-sm font-semibold">
      <button
        @click="activeVaultTab = 'ALL'"
        :class="activeVaultTab === 'ALL'
          ? 'bg-[#1E293B] text-white shadow-sm border border-[#C7D2FE]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
      >
        <Archive class="w-4 h-4 text-[#6366F1]" />
        <span>Semua Dokumen Vault</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#4338CA] text-[#6366F1]">
          {{ totalAllVaultCount }}
        </span>
      </button>

      <button
        @click="activeVaultTab = 'KUALIFIKASI'"
        :class="activeVaultTab === 'KUALIFIKASI'
          ? 'bg-[#1E293B] text-white shadow-sm border border-[#C7D2FE]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
      >
        <FileCheck2 class="w-4 h-4 text-[#6366F1]" />
        <span>Bank Dokumen Kualifikasi Lelang</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#4338CA] text-[#6366F1]">
          {{ vaultDocs.length }}
        </span>
      </button>

      <button
        @click="activeVaultTab = 'KORPORASI'"
        :class="activeVaultTab === 'KORPORASI'
          ? 'bg-[#1E293B] text-white shadow-sm border border-[#C7D2FE]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
      >
        <Building2 class="w-4 h-4 text-[#6366F1]" />
        <span>Arsip Dokumen Legal Korporasi</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-[#0F172A]">
          {{ corporateDocs.length }}
        </span>
      </button>
    </div>

    <!-- Search & Filter Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Search Input -->
        <div class="md:col-span-5 relative">
          <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama dokumen, kode, nomor izin, instansi, atau lokasi..."
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
        <div class="md:col-span-4">
          <select
            v-model="filterCategory"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Kategori Dokumen</option>
            <option value="Legal Administrasi">Legal Administrasi (NIB, Akta, AHU)</option>
            <option value="Kualifikasi Teknis">Kualifikasi Teknis (SBU, Pengalaman)</option>
            <option value="Kepatuhan & Integritas">Kepatuhan & Integritas (ISO, SMK3)</option>
            <option value="Finansial & Keuangan">Finansial & Keuangan (Pajak, Laporan KAP)</option>
            <option value="Corporate Deed">Akta Korporasi (Corporate Deed)</option>
            <option value="Land Title & HGB">Sertifikat Tanah / HGB</option>
            <option value="Insurance Policy">Polis Asuransi Proyek</option>
          </select>
        </div>

        <!-- Filter Status Validitas (Kualifikasi) -->
        <div class="md:col-span-3">
          <select
            v-model="filterStatus"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Status Validitas</option>
            <option value="VALID">Valid / Berlaku</option>
            <option value="EXPIRING_SOON">Segera Kedaluwarsa (&lt; 60 Hari)</option>
            <option value="EXPIRED">Sudah Kedaluwarsa</option>
          </select>
        </div>
      </div>

      <!-- Quick Reset & Summary count -->
      <div class="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs text-[#475569]">
        <div>
          Menampilkan <strong class="text-[#0F172A]">{{ displayedDocuments.length }}</strong> dokumen tersimpan di Vault
        </div>
        <button
          v-if="searchQuery || filterCategory !== 'ALL' || filterStatus !== 'ALL'"
          @click="resetFilters"
          class="text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="displayedDocuments.length === 0" class="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
      <FolderSearch class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h4 class="text-base font-bold text-[#0F172A]">Tidak ada dokumen yang sesuai dengan filter</h4>
      <p class="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
        Silakan bersihkan filter pencarian atau unggah dokumen kualifikasi baru ke dalam Vault.
      </p>
      <button
        @click="resetFilters"
        class="mt-4 px-4 py-2 text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] hover:bg-blue-100 rounded-xl transition cursor-pointer border border-[#C7D2FE]"
      >
        Bersihkan Filter
      </button>
    </div>

    <!-- UNIFIED VAULT TABLE -->
    <div v-else class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-slate-50/80 border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3.5 px-4 min-w-[260px]">Dokumen & Berkas Digital</th>
              <th class="py-3.5 px-4 min-w-[140px]">Tipe & Kategori</th>
              <th class="py-3.5 px-4 min-w-[160px]">Nomor & Instansi Penerbit</th>
              <th class="py-3.5 px-4 min-w-[140px]">Masa Berlaku</th>
              <th class="py-3.5 px-4 min-w-[160px]">Penggunaan di Tender</th>
              <th class="py-3.5 px-4 text-center min-w-[110px]">Status</th>
              <th class="py-3.5 px-4 text-right min-w-[140px]">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E2E8F0]">
            <tr
              v-for="doc in displayedDocuments"
              :key="doc.id"
              class="hover:bg-[#F8FAFC] transition-colors"
            >
              <!-- Col 1: Name, Code & File Reference -->
              <td class="py-3.5 px-4">
                <div class="flex items-start gap-2.5">
                  <div class="p-2 rounded-lg bg-slate-100 text-[#0F172A] shrink-0 mt-0.5">
                    <FileText class="w-4 h-4 text-[#6366F1]" />
                  </div>
                  <div class="space-y-1 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="font-mono text-[10px] font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2 py-0.5 rounded border border-[#C7D2FE]">
                        {{ doc.code || doc.id }}
                      </span>
                      <span
                        v-if="doc.isQualificationDoc"
                        class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-[#4338CA] border border-[#C7D2FE]"
                      >
                        Kualifikasi Lelang
                      </span>
                      <span
                        v-else
                        class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        Arsip Legal
                      </span>
                    </div>

                    <div class="font-bold text-[#0F172A] text-xs sm:text-sm">
                      {{ doc.name || doc.documentName }}
                    </div>

                    <!-- File attachment chip -->
                    <div v-if="doc.fileRef" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-[#0F172A] font-mono">
                      <Paperclip class="w-3 h-3 text-[#6366F1]" />
                      <span class="truncate max-w-[180px]">{{ doc.fileRef }}</span>
                      <span v-if="doc.fileSize" class="text-[#475569]">({{ doc.fileSize }})</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Col 2: Category -->
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-[#0F172A]">
                  {{ doc.category || doc.documentType }}
                </span>
                <div v-if="doc.company" class="text-[10px] text-[#475569] mt-0.5">
                  {{ doc.company }}
                </div>
              </td>

              <!-- Col 3: Number & Issuer -->
              <td class="py-3.5 px-4">
                <div class="font-mono text-xs text-[#0F172A] font-semibold truncate max-w-[180px]" :title="doc.number || doc.physicalLocation">
                  {{ doc.number || doc.physicalLocation || '-' }}
                </div>
                <div class="text-[10px] text-[#475569] mt-0.5 truncate max-w-[180px]">
                  {{ doc.issuer || 'Arsip Fisik Lemari Legal' }}
                </div>
              </td>

              <!-- Col 4: Expiry Date -->
              <td class="py-3.5 px-4">
                <div v-if="doc.expiryDate" class="space-y-0.5">
                  <div class="font-mono text-xs text-[#0F172A] font-semibold">
                    {{ doc.expiryDate }}
                  </div>
                  <div
                    class="text-[10px] font-semibold"
                    :class="calculateDaysRemaining(doc.expiryDate) <= 60 ? 'text-rose-600' : 'text-[#475569]'"
                  >
                    {{ calculateDaysRemaining(doc.expiryDate) < 0 ? 'Kedaluwarsa' : `${calculateDaysRemaining(doc.expiryDate)} Hari Lagi` }}
                  </div>
                </div>
                <div v-else class="text-xs text-slate-400">
                  Permanen / Tidak Terbatas
                </div>
              </td>

              <!-- Col 5: Tenders Used (Linkage) -->
              <td class="py-3.5 px-4">
                <div v-if="doc.tendersUsed && doc.tendersUsed.length > 0" class="flex flex-wrap gap-1">
                  <button
                    v-for="tId in doc.tendersUsed"
                    :key="tId"
                    @click="goToTenderDetail(tId)"
                    class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] hover:bg-blue-100 transition cursor-pointer"
                    title="Buka detail tender ini"
                  >
                    {{ tId }}
                  </button>
                </div>
                <div v-else-if="doc.isQualificationDoc" class="text-[10px] text-slate-400">
                  Belum ditautkan ke tender
                </div>
                <div v-else class="text-[10px] text-slate-400 font-mono">
                  {{ doc.confidentialityLevel || 'Confidential' }}
                </div>
              </td>

              <!-- Col 6: Status Badge -->
              <td class="py-3.5 px-4 text-center">
                <span
                  v-if="doc.isQualificationDoc"
                  :class="getStatusBadgeClass(doc)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                >
                  <CheckCircle2 v-if="getStatusLabel(doc) === 'Valid'" class="w-3 h-3 text-emerald-600" />
                  <Clock v-else class="w-3 h-3" />
                  <span>{{ getStatusLabel(doc) }}</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                >
                  Tersimpan di Vault
                </span>
              </td>

              <!-- Col 7: Actions -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Link to Tender (for qualification docs) -->
                  <button
                    v-if="doc.isQualificationDoc"
                    @click="openLinkTenderModal(doc)"
                    class="p-1.5 rounded-lg text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
                    title="Tautkan ke Paket Lelang Aktif"
                  >
                    <Link2 class="w-4 h-4" />
                  </button>

                  <!-- Download File -->
                  <button
                    @click="downloadDoc(doc)"
                    class="p-1.5 rounded-lg text-slate-600 hover:text-[#4338CA] hover:bg-blue-50 transition cursor-pointer"
                    title="Unduh Salinan Digital"
                  >
                    <Download class="w-4 h-4" />
                  </button>

                  <!-- Edit -->
                  <button
                    v-if="doc.isQualificationDoc"
                    @click="openEditVaultModal(doc)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                    title="Edit Dokumen Kualifikasi"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    v-else
                    @click="openEditCorporateModal(doc)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                    title="Edit Arsip Korporasi"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <!-- Delete -->
                  <button
                    v-if="doc.isQualificationDoc"
                    @click="confirmDeleteVaultDoc(doc)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus dari Dokumen Vault"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <button
                    v-else
                    @click="confirmDeleteCorporateDoc(doc)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus Arsip Korporasi"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals (Extracted) -->
    <AddVaultDocModal
      :is-open="isAddVaultModalOpen"
      @close="isAddVaultModalOpen = false"
    />

    <AddCorporateDocModal
      :is-open="isAddCorporateModalOpen"
      @close="isAddCorporateModalOpen = false"
    />

    <LinkTenderModal
      :is-open="isLinkTenderModalOpen"
      :selected-doc="selectedVaultDoc"
      @close="isLinkTenderModalOpen = false"
    />

    <EditVaultDocModal
      :is-open="isEditVaultModalOpen"
      :doc="editingVaultDoc"
      @close="isEditVaultModalOpen = false"
    />

    <EditCorporateDocModal
      :is-open="isEditCorporateModalOpen"
      :doc="editingCorporateDoc"
      @close="isEditCorporateModalOpen = false"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  UploadCloud,
  Search,
  FileText,
  Download,
  Archive,
  Building2,
  FileCheck2,
  CheckCircle2,
  Clock,
  Plus,
  Pencil,
  Link2,
  Trash2,
  FolderSearch
} from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';

// Extracted Modals
import AddVaultDocModal from './Documents/Modals/AddVaultDocModal.vue';
import AddCorporateDocModal from './Documents/Modals/AddCorporateDocModal.vue';
import LinkTenderModal from './Documents/Modals/LinkTenderModal.vue';
import EditVaultDocModal from './Documents/Modals/EditVaultDocModal.vue';
import EditCorporateDocModal from './Documents/Modals/EditCorporateDocModal.vue';

// State
const searchQuery = ref('');
const filterCategory = ref('ALL');
const filterStatus = ref('ALL');
const activeVaultTab = ref('ALL'); // 'ALL' | 'KUALIFIKASI' | 'KORPORASI'

const isAddVaultModalOpen = ref(false);
const isAddCorporateModalOpen = ref(false);
const isEditVaultModalOpen = ref(false);
const isEditCorporateModalOpen = ref(false);
const isLinkTenderModalOpen = ref(false);

const selectedVaultDoc = ref(null);
const editingVaultDoc = ref(null);
const editingCorporateDoc = ref(null);

// Store Datasets
const corporateDocs = computed(() => (legalStore.state.documents || []).map(d => ({
  ...d,
  isQualificationDoc: false
})));

const vaultDocs = computed(() => (legalStore.state.tenderVault || []).map(d => ({
  ...d,
  isQualificationDoc: true
})));

const totalAllVaultCount = computed(() => corporateDocs.value.length + vaultDocs.value.length);

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

const expiredDocsCount = computed(() => {
  return vaultDocs.value.filter(d => {
    if (!d.expiryDate) return false;
    return calculateDaysRemaining(d.expiryDate) < 0;
  }).length;
});

const totalUtilizations = computed(() => {
  return vaultDocs.value.reduce((acc, d) => acc + (d.tendersUsed?.length || 0), 0);
});

// Unified filtered documents
const displayedDocuments = computed(() => {
  let list = [];
  if (activeVaultTab.value === 'ALL') {
    list = [...vaultDocs.value, ...corporateDocs.value];
  } else if (activeVaultTab.value === 'KUALIFIKASI') {
    list = [...vaultDocs.value];
  } else if (activeVaultTab.value === 'KORPORASI') {
    list = [...corporateDocs.value];
  }

  return list.filter(doc => {
    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const name = (doc.name || doc.documentName || '').toLowerCase();
      const code = (doc.code || doc.id || '').toLowerCase();
      const number = (doc.number || doc.physicalLocation || '').toLowerCase();
      const issuer = (doc.issuer || doc.company || '').toLowerCase();
      if (!name.includes(q) && !code.includes(q) && !number.includes(q) && !issuer.includes(q)) {
        return false;
      }
    }

    // Category
    if (filterCategory.value !== 'ALL') {
      const cat = doc.category || doc.documentType;
      if (cat !== filterCategory.value) return false;
    }

    // Status (only applies if doc has expiryDate)
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

function getStatusBadgeClass(doc) {
  if (!doc.expiryDate) return 'bg-emerald-50 text-emerald-800 border-[#BBF7D0]';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'bg-rose-50 text-rose-800 border-[#FECDD3]';
  if (days <= 60) return 'bg-amber-50 text-amber-800 border-[#FDE68A]';
  return 'bg-emerald-50 text-emerald-800 border-[#BBF7D0]';
}

function getStatusLabel(doc) {
  if (!doc.expiryDate) return 'Valid';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'Kedaluwarsa';
  if (days <= 60) return 'Segera Kedaluwarsa';
  return 'Valid';
}

function goToTenderDetail(tenderId) {
  legalStore.navigate('tenders', tenderId);
}

function downloadDoc(doc) {
  legalStore.triggerToast(`Mengunduh salinan digital berkas: ${doc.fileRef || doc.name || doc.documentName}`, 'info');
}

function openAddCorporateModal() {
  isAddCorporateModalOpen.value = true;
}

function openEditCorporateModal(doc) {
  editingCorporateDoc.value = doc;
  isEditCorporateModalOpen.value = true;
}

function confirmDeleteCorporateDoc(doc) {
  const name = doc.name || doc.documentName;
  if (window.confirm(`Hapus arsip korporasi "${name}" dari Vault?`)) {
    legalStore.deleteCorporateDocument(doc.id);
  }
}

function openLinkTenderModal(doc) {
  selectedVaultDoc.value = doc;
  isLinkTenderModalOpen.value = true;
}

function openEditVaultModal(doc) {
  editingVaultDoc.value = doc;
  isEditVaultModalOpen.value = true;
}

function confirmDeleteVaultDoc(doc) {
  if (window.confirm(`Hapus dokumen "${doc.name}" dari Dokumen Vault?`)) {
    legalStore.deleteTenderVaultDoc(doc.id);
  }
}

function resetFilters() {
  searchQuery.value = '';
  filterCategory.value = 'ALL';
  filterStatus.value = 'ALL';
}
</script>
