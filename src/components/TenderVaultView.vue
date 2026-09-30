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

    <!-- Document Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="doc in filteredVaultDocs"
        :key="doc.id"
        class="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#C7D2FE]/70 transition-all flex flex-col justify-between space-y-4"
      >
        <!-- Top Info Strip -->
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2.5 py-0.5 rounded border border-[#C7D2FE]">
                {{ doc.code }}
              </span>
              <span class="text-xs text-[#475569] font-medium bg-slate-100 px-2 py-0.5 rounded">
                {{ doc.category }}
              </span>
            </div>

            <!-- Expiry Status Badge -->
            <span
              :class="getStatusBadgeClass(doc)"
              class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border"
            >
              {{ getStatusLabel(doc) }}
            </span>
          </div>

          <h3 class="text-base font-bold text-[#0F172A]">
            {{ doc.name }}
          </h3>

          <div class="text-xs text-[#475569] space-y-1 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <div class="flex justify-between">
              <span>Nomor Registrasi / SK:</span>
              <strong class="text-[#0F172A] font-mono">{{ doc.number }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Instansi / Lembaga Penerbit:</span>
              <span class="text-[#0F172A] font-medium">{{ doc.issuer }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tanggal Terbit:</span>
              <span class="text-[#0F172A]">{{ doc.issueDate || '-' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Masa Berlaku:</span>
              <span v-if="!doc.expiryDate" class="text-emerald-700 font-semibold">
                Berlaku Selamanya
              </span>
              <span v-else :class="calculateDaysRemaining(doc.expiryDate) <= 60 ? 'text-amber-700 font-bold' : 'text-[#0F172A]'">
                {{ doc.expiryDate }} (Sisa {{ calculateDaysRemaining(doc.expiryDate) }} Hari)
              </span>
            </div>
          </div>

          <!-- Notes -->
          <p v-if="doc.notes" class="text-xs text-[#475569] italic">
            "{{ doc.notes }}"
          </p>

          <!-- Tenders Used Tag Strip -->
          <div class="pt-2 border-t border-slate-100 space-y-1.5">
            <span class="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
              Digunakan Pada Paket Lelang ({{ (doc.tendersUsed || []).length }}):
            </span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tId in doc.tendersUsed"
                :key="tId"
                @click="goToTender(tId)"
                class="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#0F172A] hover:bg-blue-50 text-[#4338CA] hover:text-[#0F172A] border border-slate-200 transition cursor-pointer"
                title="Buka tender ini"
              >
                <span>{{ tId }}</span>
                <ExternalLink class="w-2.5 h-2.5 text-[#475569]" />
              </span>
              <span v-if="!doc.tendersUsed || doc.tendersUsed.length === 0" class="text-xs text-slate-400 italic">
                Belum ditautkan ke paket aktif
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons Footer -->
        <div class="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <button
              @click="previewDoc(doc)"
              class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] transition cursor-pointer"
              title="Lihat berkas terlampir"
            >
              <FileText class="w-3.5 h-3.5 text-[#475569]" />
              <span>{{ doc.fileSize }}</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="openLinkTenderModal(doc)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] transition shadow-xs cursor-pointer"
            >
              <Link2 class="w-3.5 h-3.5" />
              <span>Tautkan ke Paket Lelang</span>
            </button>
            <button
              @click="confirmDelete(doc)"
              class="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer rounded-lg hover:bg-rose-50"
              title="Hapus dari bank dokumen"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: TAMBAH DOKUMEN MASTER BARU                        -->
    <!-- ======================================================== -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/70 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C7D2FE] space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">
              Tambah Master Dokumen Kualifikasi
            </h3>
            <p class="text-xs text-[#475569] mt-0.5">
              Simpan berkas master perusahaan ke repositori kualifikasi pengadaan.
            </p>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitAddVaultDoc" class="space-y-3 text-xs">
          <!-- File Attachment from Directory -->
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Lampiran Berkas / File Master (Dari Direktori Komputer)</label>
            <input
              type="file"
              ref="vaultFileInputRef"
              @change="onVaultFilePicked"
              class="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
            />
            
            <div
              v-if="newDocForm.fileRef"
              class="p-3 rounded-xl border border-[#BBF7D0] bg-emerald-50/40 flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <FileText class="w-5 h-5 text-emerald-700 shrink-0" />
                <div class="min-w-0">
                  <div class="font-bold text-[#0F172A] truncate text-xs">{{ newDocForm.fileRef }}</div>
                  <div class="text-[10px] text-emerald-700 font-semibold">{{ newDocForm.fileSize || '1.8 MB' }} • File Ter-upload & Terlampir</div>
                </div>
              </div>
              <button
                type="button"
                @click="triggerVaultFileBrowse"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-200 rounded-lg font-bold text-xs cursor-pointer"
              >
                Ganti File
              </button>
            </div>

            <div
              v-else
              @click="triggerVaultFileBrowse"
              class="p-4 rounded-xl border-2 border-dashed border-[#C7D2FE]/50 hover:border-[#1E293B] bg-[#F8FAFC] hover:bg-white text-center cursor-pointer transition space-y-1 group"
            >
              <UploadCloud class="w-5 h-5 text-[#6366F1] mx-auto group-hover:text-[#0F172A] transition-colors" />
              <p class="font-bold text-[#0F172A] text-xs">Pilih File dari Direktori Komputer Anda</p>
              <p class="text-[10px] text-[#475569]">Mendukung PDF, DOCX, XLSX, Scan Izin Resmi (Maks 25MB)</p>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Dokumen / Kualifikasi *</label>
            <input
              v-model="newDocForm.name"
              required
              type="text"
              placeholder="Contoh: Surat Izin Usaha Perdagangan (SIUP) / SBU EL003"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kategori Dokumen</label>
              <select
                v-model="newDocForm.category"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              >
                <option value="Legal Administrasi">Legal Administrasi</option>
                <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
                <option value="Keuangan & Pajak">Keuangan & Pajak</option>
                <option value="Kepatuhan & Sertifikasi">Kepatuhan & Sertifikasi</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kode Dokumen</label>
              <input
                v-model="newDocForm.code"
                type="text"
                placeholder="DOC-SIUP-01"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Nomor Registrasi / SK</label>
              <input
                v-model="newDocForm.number"
                type="text"
                placeholder="No. AHU-xxxx / 01928"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Instansi Penerbit</label>
              <input
                v-model="newDocForm.issuer"
                type="text"
                placeholder="Kemenkumham / LPJK / DJP"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tanggal Terbit</label>
              <input
                v-model="newDocForm.issueDate"
                type="date"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Masa Berlaku (Kosongkan jika selamanya)</label>
              <input
                v-model="newDocForm.expiryDate"
                type="date"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan Tambahan</label>
            <textarea
              v-model="newDocForm.notes"
              rows="2"
              placeholder="Keterangan spesifikasi berkas, masa berlaku audit, dsb..."
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              Simpan Dokumen Master
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: TAUTKAN KE PAKET LELANG TERTENTU                  -->
    <!-- ======================================================== -->
    <div
      v-if="isLinkTenderModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/70 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C7D2FE] space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">
              Tautkan Dokumen ke Paket Lelang
            </h3>
            <p class="text-xs text-[#475569] mt-0.5">
              Pilih paket lelang aktif yang membutuhkan dokumen kualifikasi ini.
            </p>
          </div>
          <button @click="isLinkTenderModalOpen = false" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="selectedVaultDoc" class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
          <div class="font-bold text-[#0F172A] text-sm">{{ selectedVaultDoc.name }}</div>
          <div class="text-[#475569]">Kode: <span class="font-mono text-[#0F172A] font-bold">{{ selectedVaultDoc.code }}</span> • {{ selectedVaultDoc.number }}</div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-[#0F172A]">Pilih Paket Lelang:</label>
          <div class="max-h-60 overflow-y-auto space-y-2 border border-[#E2E8F0] rounded-xl p-2">
            <div
              v-for="t in legalStore.state.tenders"
              :key="t.id"
              @click="targetTenderId = t.id"
              :class="targetTenderId === t.id ? 'bg-[#1E293B] text-white border-[#C7D2FE]' : 'hover:bg-slate-50 text-[#0F172A] border-slate-200'"
              class="p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between gap-2"
            >
              <div class="min-w-0">
                <div class="font-bold truncate" :class="targetTenderId === t.id ? 'text-white' : 'text-[#0F172A]'">
                  {{ t.title }}
                </div>
                <div class="text-[10px]" :class="targetTenderId === t.id ? 'text-slate-300' : 'text-[#475569]'">
                  {{ t.id }} • {{ t.tenderNumber }} • {{ t.organizer }}
                </div>
              </div>
              <span
                v-if="selectedVaultDoc?.tendersUsed?.includes(t.id)"
                class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#166534]"
              >
                Sudah Ditautkan
              </span>
              <span
                v-else-if="targetTenderId === t.id"
                class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-[#0F172A]"
              >
                Dipilih
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            @click="isLinkTenderModalOpen = false"
            class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            @click="executeLinkToTender"
            :disabled="!targetTenderId"
            class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs disabled:opacity-50"
          >
            Tautkan ke Tender Ini
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  UploadCloud,
  CheckCircle2,
  Plus,
  Search,
  FileText,
  Link2,
  Trash2,
  ExternalLink,
  X
} from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';

// State
const searchQuery = ref('');
const filterCategory = ref('ALL');
const filterStatus = ref('ALL');

const isAddModalOpen = ref(false);
const isLinkTenderModalOpen = ref(false);
const selectedVaultDoc = ref(null);
const targetTenderId = ref(null);
const vaultFileInputRef = ref(null);

const newDocForm = ref({
  name: '',
  code: '',
  category: 'Legal Administrasi',
  number: '',
  issuer: '',
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  fileRef: '',
  fileSize: '',
  notes: ''
});

function triggerVaultFileBrowse() {
  if (vaultFileInputRef.value) {
    vaultFileInputRef.value.click();
  }
}

function onVaultFilePicked(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  newDocForm.value.fileRef = file.name;
  if (file.size < 1024 * 1024) {
    newDocForm.value.fileSize = (file.size / 1024).toFixed(1) + ' KB';
  } else {
    newDocForm.value.fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  }
  if (!newDocForm.value.name) {
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    newDocForm.value.name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
}

// Computed
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
    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchCode = doc.code?.toLowerCase().includes(q);
      const matchNumber = doc.number?.toLowerCase().includes(q);
      const matchIssuer = doc.issuer?.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchNumber && !matchIssuer) return false;
    }

    // Category
    if (filterCategory.value !== 'ALL' && doc.category !== filterCategory.value) {
      return false;
    }

    // Status
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
  if (!doc.expiryDate) return 'bg-[#DCFCE7] text-[#166534] border-emerald-300';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'bg-[#FFE4E6] text-[#9F1239] border-rose-300';
  if (days <= 60) return 'bg-[#FEF3C7] text-[#92400E] border-amber-300';
  return 'bg-[#DCFCE7] text-[#166534] border-emerald-300';
}

function getStatusLabel(doc) {
  if (!doc.expiryDate) return 'Valid (Selamanya)';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'Kedaluwarsa';
  if (days <= 60) return 'Segera Kedaluwarsa';
  return 'Valid';
}

function goToTender(tenderId) {
  legalStore.setTenderTab('pipeline');
}

function previewDoc(doc) {
  legalStore.triggerToast(`Membuka berkas: ${doc.fileRef || doc.name}`, 'info');
}

function openLinkTenderModal(doc) {
  selectedVaultDoc.value = doc;
  targetTenderId.value = legalStore.state.tenders[0]?.id || null;
  isLinkTenderModalOpen.value = true;
}

function executeLinkToTender() {
  if (!selectedVaultDoc.value || !targetTenderId.value) return;
  legalStore.linkVaultDocToTender(selectedVaultDoc.value.id, targetTenderId.value);
  isLinkTenderModalOpen.value = false;
  selectedVaultDoc.value = null;
}

function submitAddVaultDoc() {
  legalStore.addTenderVaultDoc(newDocForm.value);
  isAddModalOpen.value = false;
  newDocForm.value = {
    name: '',
    code: '',
    category: 'Legal Administrasi',
    number: '',
    issuer: '',
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: '',
    fileRef: '',
    fileSize: '',
    notes: ''
  };
}

function confirmDelete(doc) {
  if (window.confirm(`Hapus dokumen "${doc.name}" dari Bank Dokumen Kualifikasi?`)) {
    legalStore.deleteTenderVaultDoc(doc.id);
  }
}
</script>
