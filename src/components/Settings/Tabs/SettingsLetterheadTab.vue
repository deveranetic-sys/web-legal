<template>
  <div class="space-y-6">
    <!-- Header Title & Quick Entity Presets -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div>
        <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Building2 class="w-5 h-5 text-indigo-600" />
          Konfigurasi Kop Surat Resmi & Profil Korporasi
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Atur informasi kop resmi perseroan, alamat hukum, logo, dan gaya pembatas untuk seluruh korespondensi, somasi, SPK, dan memo hukum.
        </p>
      </div>

      <!-- Quick Preset Selector -->
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xs font-semibold text-slate-500">Pilih Profil Entitas:</span>
        <button
          v-for="(preset, entityName) in entityPresets"
          :key="entityName"
          @click="loadEntityPreset(entityName)"
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer"
          :class="form.companyName === preset.companyName
            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'"
        >
          {{ entityName.replace('PT ', '') }}
        </button>
      </div>
    </div>

    <!-- Main Two Column Workspace: Form Config on Left, Live Render Sheet on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- LEFT COLUMN: Form Inputs (7 Cols) -->
      <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        
        <!-- Section 1: Identitas Korporasi -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Building class="w-4 h-4" />
              1. Identitas Badan Hukum & Divisi
            </h4>
            <span class="text-[10px] text-slate-400 font-mono">Bagian Atas Kop</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="sm:col-span-2">
              <label class="block font-bold text-slate-700 mb-1">
                Nama Resmi Perusahaan (PT / Tbk) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.companyName"
                type="text"
                placeholder="PT NUSANTARA ENERGI TBK"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase tracking-wide"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">
                Departemen / Divisi Penerbit
              </label>
              <input
                v-model="form.division"
                type="text"
                placeholder="DEPARTEMEN LEGAL & KEPATUHAN KORPORAT"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">
                Slogan / Tagline Bisnis
              </label>
              <input
                v-model="form.tagline"
                type="text"
                placeholder="Penyedia Solusi Rekayasa Energi Terbarukan"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-xs italic"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Alamat Domisili Hukum & Kontak Resmi -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <MapPin class="w-4 h-4" />
              2. Alamat Domisili Hukum & Saluran Kontak
            </h4>
            <span class="text-[10px] text-slate-400 font-mono">Badan Surat Resmi</span>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">
                Gedung & Jalan Kantor Pusat <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.address"
                type="text"
                placeholder="Energy Tower Lt. 28, Kawasan SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Kota & Kode Pos</label>
                <input
                  v-model="form.cityPostal"
                  type="text"
                  placeholder="Jakarta Selatan 12190, Indonesia"
                  class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Nomor Telepon & Fax</label>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="(021) 5289-7000 / Fax: (021) 5289-7001"
                  class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Email Resmi Legal</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="legal@nusantara-energi.co.id"
                  class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Website Perusahaan</label>
                <input
                  v-model="form.website"
                  type="text"
                  placeholder="www.nusantara-energi.co.id"
                  class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Visual Logo & Gaya Garis Pembatas -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Palette class="w-4 h-4" />
              3. Visual Logo & Garis Pembatas (Border Style)
            </h4>
            <span class="text-[10px] text-slate-400 font-mono">Gaya Notaris & Korporat</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <!-- Logo Upload & Controls -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="block font-bold text-slate-700">Logo Perusahaan</label>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg border border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <img
                    v-if="form.logoUrl"
                    :src="form.logoUrl"
                    alt="Logo Kop"
                    class="w-full h-full object-contain p-1"
                  />
                  <Scale v-else class="w-6 h-6 text-indigo-600" />
                </div>

                <div class="space-y-1">
                  <input
                    ref="logoFileInput"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    class="hidden"
                    @change="handleLogoUpload"
                  />
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="$refs.logoFileInput.click()"
                      class="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-md font-semibold text-slate-700 text-[11px] cursor-pointer"
                    >
                      Unggah Logo
                    </button>
                    <button
                      v-if="form.logoUrl"
                      type="button"
                      @click="form.logoUrl = ''"
                      class="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-md font-medium text-[11px] cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                  <p class="text-[10px] text-slate-400">PNG transparan / SVG, maks 500 KB</p>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 flex items-center gap-2">
                <input
                  v-model="form.showLogo"
                  type="checkbox"
                  id="chkShowLogo"
                  class="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label for="chkShowLogo" class="font-medium text-slate-700 cursor-pointer select-none">
                  Tampilkan logo di pojok kiri/tengah kop
                </label>
              </div>
            </div>

            <!-- Border Style Selector -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="block font-bold text-slate-700">Gaya Garis Pembatas</label>
              <select
                v-model="form.borderStyle"
                class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="double">Garis Ganda Resmi (Double Line 3pt / 1pt)</option>
                <option value="single">Garis Tunggal Solid (Single Line 1.5pt)</option>
                <option value="bold">Garis Hitam Tebal (Solid Bold 2.5pt)</option>
                <option value="accent">Garis Aksen Warna Biru Navy (Accent Line)</option>
                <option value="none">Tanpa Garis Pembatas</option>
              </select>

              <div class="pt-2 border-t border-slate-200 flex items-center gap-2">
                <input
                  v-model="form.showTagline"
                  type="checkbox"
                  id="chkShowTagline"
                  class="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label for="chkShowTagline" class="font-medium text-slate-700 cursor-pointer select-none">
                  Tampilkan tagline di bawah nama perseroan
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Header Memo Internal (Legal Opinion) -->
        <div class="space-y-3 pb-2">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <FileSpreadsheet class="w-4 h-4" />
              4. Format Kop Memorandum Internal (Legal Opinion)
            </h4>
            <span class="text-[10px] text-slate-400 font-mono">Internal Dokumen</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Judul Dokumen Memo</label>
              <input
                v-model="form.memoTitle"
                type="text"
                placeholder="MEMORANDUM HUKUM / LEGAL OPINION"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nama Direktorat Pengirim</label>
              <input
                v-model="form.memoDept"
                type="text"
                placeholder="Corporate Legal & Compliance Directorate"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            @click="resetDefaults"
            class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Reset Standar Perseroan
          </button>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="saveConfig"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer flex items-center gap-2"
            >
              <Save class="w-4 h-4" />
              Simpan Profil Kop Surat
            </button>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Live Interactive Document Sheet Preview (5 Cols) -->
      <div class="lg:col-span-5 space-y-4 sticky top-6">
        
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 class="text-xs font-bold text-slate-900">Pratinjau Langsung (Live Preview)</h4>
            <p class="text-[11px] text-slate-400">Hasil tampilan cetak & ekspor dokumen Word</p>
          </div>

          <!-- Switch Preview Mode -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              @click="previewMode = 'OFFICIAL'"
              :class="previewMode === 'OFFICIAL' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 font-medium'"
              class="px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px]"
            >
              Kop Resmi
            </button>
            <button
              @click="previewMode = 'MEMO'"
              :class="previewMode === 'MEMO' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 font-medium'"
              class="px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px]"
            >
              Kop Memo
            </button>
          </div>
        </div>

        <!-- Simulated Physical Paper A4 Sheet -->
        <div class="bg-slate-100 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <div class="bg-white rounded-lg shadow-md border border-slate-300 p-6 sm:p-7 min-h-[460px] font-serif text-slate-900 flex flex-col justify-between">
            
            <!-- Dynamic Kop Render -->
            <div>
              <!-- OFFICIAL LETTERHEAD -->
              <div v-if="previewMode === 'OFFICIAL'" class="pb-3 mb-4 select-none" :class="borderClass">
                <div class="flex items-center gap-3 justify-center mb-1.5">
                  <div
                    v-if="form.showLogo"
                    class="w-10 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0"
                  >
                    <img
                      v-if="form.logoUrl"
                      :src="form.logoUrl"
                      alt="Logo"
                      class="w-full h-full object-contain"
                    />
                    <Scale v-else class="w-6 h-6 text-indigo-700" />
                  </div>
                  <div class="text-center">
                    <h2 class="text-xs sm:text-sm font-black tracking-wider uppercase font-sans text-slate-900 leading-tight">
                      {{ form.companyName || 'NAMA PERUSAHAAN' }}
                    </h2>
                    <p
                      v-if="form.showTagline && form.tagline"
                      class="text-[9px] text-indigo-800 font-sans italic font-medium"
                    >
                      {{ form.tagline }}
                    </p>
                  </div>
                </div>

                <div class="text-center space-y-0.5 text-[9px] text-slate-600 font-sans">
                  <p class="font-medium text-slate-700">
                    {{ form.division }}
                  </p>
                  <p>{{ form.address }}, {{ form.cityPostal }}</p>
                  <p class="text-slate-500">
                    Telp: {{ form.phone }} • Email: {{ form.email }} • Web: {{ form.website }}
                  </p>
                </div>
              </div>

              <!-- MEMO LETTERHEAD -->
              <div v-else class="border-b-2 border-slate-900 pb-3 mb-4 select-none font-sans text-xs">
                <div class="flex items-center justify-between border-b border-slate-300 pb-2 mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      LE
                    </div>
                    <div>
                      <h4 class="font-bold text-[11px] text-slate-900 uppercase">{{ form.companyName }}</h4>
                      <p class="text-[9px] text-slate-500">{{ form.memoDept }}</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">
                    INTERNAL ONLY
                  </span>
                </div>

                <div class="text-center my-2">
                  <h3 class="font-extrabold text-xs tracking-wider uppercase text-slate-900">
                    {{ form.memoTitle }}
                  </h3>
                  <span class="text-[10px] text-slate-500 font-mono">No: 048/NE-LEGAL/OPN/XI/2026</span>
                </div>

                <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] bg-slate-50 p-2 rounded border border-slate-200 mt-2">
                  <div><span class="font-bold text-slate-600">KEPADA:</span> Direksi Perseroan</div>
                  <div><span class="font-bold text-slate-600">TANGGAL:</span> 02 Nov 2026</div>
                  <div><span class="font-bold text-slate-600">DARI:</span> {{ form.division }}</div>
                  <div><span class="font-bold text-slate-600">PERIHAL:</span> Analisis Hukum Kontrak</div>
                </div>
              </div>

              <!-- Dummy Document Content -->
              <div class="space-y-2 text-[10px] sm:text-[11px] text-slate-700 leading-relaxed text-justify">
                <div class="flex justify-between text-[10px] font-mono text-slate-500 pb-1">
                  <span>Nomor: 014/NE-LEGAL/SOM/XI/2026</span>
                  <span>Jakarta, 02 November 2026</span>
                </div>
                <p class="font-bold text-slate-900">
                  Perihal: {{ previewMode === 'OFFICIAL' ? 'Surat Peringatan & Somasi I atas Wanprestasi Rekanan' : 'Telaah Yuridis Klausul Pembatasan Tanggung Jawab' }}
                </p>
                <p>
                  Dengan hormat, bertindak untuk dan atas nama serta mewakili kepentingan hukum <strong>{{ form.companyName }}</strong>, bersama ini kami sampaikan bahwa seluruh ketentuan kepatuhan dan hak kontraktual dilindungi sepenuhnya berdasarkan hukum Republik Indonesia.
                </p>
                <p class="text-slate-400 italic">
                  [Konten isi naskah draf dokumen hukum resmi yang digenerate oleh sistem...]
                </p>
              </div>
            </div>

            <!-- Bottom Signature Area -->
            <div class="pt-6 border-t border-slate-100 flex justify-between items-end text-[10px] text-slate-700">
              <div>
                <span class="text-[9px] text-slate-400 font-mono">Verifikasi e-Legal Engine</span>
              </div>
              <div class="text-right">
                <p class="font-bold text-slate-900">{{ form.companyName }}</p>
                <div class="h-10"></div>
                <p class="underline font-semibold">Direksi / Corporate Legal Counsel</p>
              </div>
            </div>

          </div>
        </div>

        <!-- Quick Test Export Button -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <span class="text-slate-500">Uji coba ekspor hasil kop:</span>
          <button
            @click="testExportWord"
            class="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <FileDown class="w-3.5 h-3.5 text-indigo-600" />
            Unduh Contoh (.doc)
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import {
  Building2,
  Building,
  MapPin,
  Palette,
  FileSpreadsheet,
  Save,
  Scale,
  FileDown
} from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';
import { entityLetterheadPresets, initialLetterheadConfig } from '../../../data/seedData';
import { downloadAsWordDoc } from '../../../services/templateGeneratorService';

const entityPresets = entityLetterheadPresets || {};

// Initialize form from legalStore.state.letterhead
const currentStoreConfig = legalStore.state.letterhead || initialLetterheadConfig;

const form = reactive({
  companyName: currentStoreConfig.companyName || 'PT NUSANTARA ENERGI TBK',
  division: currentStoreConfig.division || 'DEPARTEMEN LEGAL & KEPATUHAN KORPORAT',
  tagline: currentStoreConfig.tagline || 'Penyedia Solusi Rekayasa Energi Terbarukan & Infrastruktur Nasional',
  address: currentStoreConfig.address || 'Energy Tower Lt. 28, Kawasan SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53',
  cityPostal: currentStoreConfig.cityPostal || 'Jakarta Selatan 12190, Indonesia',
  phone: currentStoreConfig.phone || '(021) 5289-7000',
  fax: currentStoreConfig.fax || '(021) 5289-7001',
  email: currentStoreConfig.email || 'legal@nusantara-energi.co.id',
  website: currentStoreConfig.website || 'www.nusantara-energi.co.id',
  logoUrl: currentStoreConfig.logoUrl || '',
  borderStyle: currentStoreConfig.borderStyle || 'double',
  accentColor: currentStoreConfig.accentColor || '#1E3A8A',
  showLogo: currentStoreConfig.showLogo !== undefined ? currentStoreConfig.showLogo : true,
  showTagline: currentStoreConfig.showTagline !== undefined ? currentStoreConfig.showTagline : true,
  memoTitle: currentStoreConfig.memoTitle || 'MEMORANDUM HUKUM / LEGAL OPINION',
  memoDept: currentStoreConfig.memoDept || 'Corporate Legal & Compliance Directorate'
});

const previewMode = ref('OFFICIAL'); // 'OFFICIAL' | 'MEMO'
const logoFileInput = ref(null);

const borderClass = computed(() => {
  switch (form.borderStyle) {
    case 'double':
      return 'border-b-4 border-double border-slate-900';
    case 'single':
      return 'border-b-2 border-slate-900';
    case 'bold':
      return 'border-b-[3px] border-slate-900';
    case 'accent':
      return 'border-b-2 border-indigo-600';
    case 'none':
      return 'border-b-0';
    default:
      return 'border-b-4 border-double border-slate-900';
  }
});

function handleLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 800 * 1024) {
    legalStore.triggerToast('Ukuran berkas logo maksimal 800 KB', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    form.logoUrl = e.target.result;
    legalStore.triggerToast('Logo berhasil diunggah untuk kop surat', 'success');
  };
  reader.readAsDataURL(file);
}

function loadEntityPreset(entityName) {
  const preset = entityPresets[entityName];
  if (preset) {
    Object.assign(form, preset);
    legalStore.triggerToast(`Formulir diisi dengan profil entitas: ${entityName}`, 'info');
  }
}

function resetDefaults() {
  Object.assign(form, initialLetterheadConfig);
  legalStore.triggerToast('Formulir dikembalikan ke konfigurasi default perseroan', 'info');
}

function saveConfig() {
  legalStore.updateLetterhead({ ...form });
}

function testExportWord() {
  const sampleContent = `SURAT PERINGATAN / SOMASI WANPRESTASI
Nomor: 014/NE-LEGAL/SOM/XI/2026

Jakarta, 02 November 2026

Kepada Yth.,
Direksi PT Rekanan Teknik Mandiri
Jl. Gatot Subroto No. 44, Jakarta

Perihal: SOMASI I / TEGURAN HUKUM ATAS KELALAIAN PEKERJAAN

Dengan hormat,
Bertindak untuk dan atas nama serta mewakili kepentingan hukum ${form.companyName}, dengan ini kami sampaikan teguran resmi sehubungan dengan kelalaian pelaksanaan kewajiban kontraktual.

Kami memberikan batas waktu 7 (tujuh) hari kalender untuk segera menyelesaikan pemenuhan kewajiban tersebut.

Hormat kami,
${form.division}
${form.companyName}`;

  downloadAsWordDoc(
    `Contoh_Kop_${form.companyName.replace(/[^a-zA-Z0-9]/g, '_')}`,
    'Uji Coba Kop Surat',
    sampleContent,
    previewMode.value,
    form
  );
  legalStore.triggerToast('Berkas Word contoh dengan kop berhasil diunduh', 'success');
}
</script>
