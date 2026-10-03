<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <FilePlus2 class="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                Pustaka Standar Legal
              </span>
              <span class="text-xs text-slate-400 font-medium">Formulir Template Baru</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              Tambah Template Surat & Dokumen
            </h3>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200 transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body (Scrollable Form) -->
      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
        
        <!-- Field 1: Label / Nama Template -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block font-bold text-slate-800 text-xs">
              Label / Nama Template <span class="text-rose-500">*</span>
            </label>
            <span class="text-[11px] text-slate-400">Wajib diisi</span>
          </div>
          <div class="relative">
            <input
              v-model="form.label"
              type="text"
              required
              placeholder="Contoh: Surat Somasi Wanprestasi Mitra Vendor, Surat Kuasa Khusus, SPK Pengadaan Barang"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-xs sm:text-sm shadow-2xs"
            />
          </div>

          <!-- Quick Suggestion Chips for Label -->
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span class="text-[10px] text-slate-400 font-semibold">Saran Cepat:</span>
            <button
              v-for="sug in suggestions"
              :key="sug"
              type="button"
              @click="applySuggestion(sug)"
              class="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[10px] font-medium transition cursor-pointer border border-slate-200"
            >
              + {{ sug }}
            </button>
          </div>
        </div>

        <!-- Field 2: Kategori & Bahasa -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-800 mb-1 text-xs">
              Kategori Template <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.category"
              class="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium shadow-2xs cursor-pointer"
            >
              <option value="Template Surat (Korespondensi / Somasi)">Template Surat (Korespondensi / Somasi)</option>
              <option value="Surat Kuasa & Otorisasi Legal">Surat Kuasa & Otorisasi Legal</option>
              <option value="Surat Perintah Kerja (SPK)">Surat Perintah Kerja (SPK)</option>
              <option value="Surat Tanggapan & Klarifikasi">Surat Tanggapan & Klarifikasi</option>
              <option value="Perjanjian Kerjasama (MoU & NDA)">Perjanjian Kerjasama (MoU & NDA)</option>
              <option value="Kontrak Pengadaan & Jasa">Kontrak Pengadaan & Jasa</option>
              <option value="Legal Opinion & Nota Dinas">Legal Opinion & Nota Dinas</option>
              <option value="Dokumen Kepatuhan Lainnya">Dokumen Kepatuhan Lainnya</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1 text-xs">
              Bahasa Naskah
            </label>
            <select
              v-model="form.language"
              class="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium shadow-2xs cursor-pointer"
            >
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Bilingual (ID/EN)">Bilingual (Bahasa Indonesia & English)</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        <!-- Field 3: Deskripsi Template -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block font-bold text-slate-800 text-xs">
              Deskripsi Template <span class="text-rose-500">*</span>
            </label>
            <span class="text-[11px] text-slate-400">Ringkasan tujuan & dasar penggunaan</span>
          </div>
          <textarea
            v-model="form.description"
            rows="3"
            required
            placeholder="Jelaskan tujuan surat/dokumen, kondisi penggunaan (misal: keterlambatan kewajiban > 14 hari), dasar hukum, dan instruksi ringkas pengisiannya..."
            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium shadow-2xs resize-none"
          ></textarea>
        </div>

        <!-- Field 4: Upload Template File -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block font-bold text-slate-800 text-xs">
              Upload Berkas Template
            </label>
            <span class="text-[11px] text-indigo-600 font-medium">Word (.docx), PDF (.pdf), Teks (.txt)</span>
          </div>

          <!-- Dropzone area -->
          <div
            v-if="!uploadedFile"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="isDragging ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200' : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50'"
            class="relative border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer group"
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".docx,.doc,.pdf,.txt,.rtf,.md"
              class="hidden"
              @change="handleFileChange"
            />
            
            <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs group-hover:scale-105 group-hover:border-indigo-300 transition-all">
              <UploadCloud class="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <p class="text-xs sm:text-sm font-bold text-slate-800">
                Tarik & letakkan berkas template di sini, atau <span class="text-indigo-600 underline">pilih dari perangkat</span>
              </p>
              <p class="text-[11px] text-slate-500 mt-1">
                Maksimal ukuran 25 MB • Format: .docx, .doc, .pdf, .txt, .md
              </p>
            </div>
          </div>

          <!-- Selected File Preview Card -->
          <div
            v-else
            class="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-150"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-xs">
                {{ fileExtension }}
              </div>
              <div class="min-w-0">
                <div class="font-bold text-slate-900 truncate text-xs sm:text-sm">{{ uploadedFile.name }}</div>
                <div class="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>{{ formatFileSize(uploadedFile.size) }}</span>
                  <span>•</span>
                  <span class="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check class="w-3 h-3 stroke-[2.5]" /> Berkas Siap Diunggah
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                @click="triggerFileInput"
                class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold transition cursor-pointer"
              >
                Ganti
              </button>
              <button
                type="button"
                @click="removeFile"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Hapus berkas"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Field 5: Klausul / Variabel Kunci Termasuk (Tags) -->
        <div class="space-y-1.5">
          <label class="block font-bold text-slate-800 text-xs">
            Klausul Kunci & Variabel Pengisian
          </label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="clause in availableClauses"
              :key="clause"
              type="button"
              @click="toggleClause(clause)"
              :class="form.clausesIncluded.includes(clause)
                ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'"
              class="px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer border border-transparent"
            >
              {{ form.clausesIncluded.includes(clause) ? '✓ ' : '+ ' }}{{ clause }}
            </button>
          </div>
        </div>

        <!-- Field 6: Pratinjau Teks Template (Collapsible) -->
        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            @click="isDraftExpanded = !isDraftExpanded"
            class="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left cursor-pointer transition"
          >
            <div class="flex items-center gap-2">
              <FileText class="w-4 h-4 text-indigo-600" />
              <span class="font-bold text-slate-800 text-xs">
                Pratinjau / Sesuaikan Naskah Draf Template (Opsional)
              </span>
            </div>
            <span class="text-[11px] text-slate-500 font-medium">
              {{ isDraftExpanded ? 'Sembunyikan ▲' : 'Tampilkan & Edit ▼' }}
            </span>
          </button>

          <div v-if="isDraftExpanded" class="p-4 bg-white space-y-2 border-t border-slate-200">
            <p class="text-[11px] text-slate-500">
              Gunakan placeholder seperti <code class="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">[NOMOR_SURAT]</code>, <code class="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">[NAMA_PENERIMA]</code>, <code class="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">[TANGGAL]</code> agar otomatis diisi oleh generator naskah.
            </p>
            <textarea
              v-model="form.contentSample"
              rows="6"
              class="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            ></textarea>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="!form.label.trim() || !form.description.trim()"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer text-xs flex items-center gap-2"
          >
            <CheckCircle2 class="w-4 h-4 stroke-[2.5]" />
            <span>Simpan & Daftarkan Template</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import {
  X,
  FilePlus2,
  UploadCloud,
  Check,
  CheckCircle2,
  Trash2,
  FileText
} from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const props = defineProps({
  defaultCategory: {
    type: String,
    default: 'Template Surat (Korespondensi / Somasi)'
  }
});

const emit = defineEmits(['close', 'created']);

const isDragging = ref(false);
const isDraftExpanded = ref(false);
const fileInputRef = ref(null);
const uploadedFile = ref(null);
const fileDataUrl = ref(null);

const form = reactive({
  label: '',
  category: props.defaultCategory,
  language: 'Bahasa Indonesia',
  description: '',
  contentSample: '',
  clausesIncluded: ['Identitas Para Pihak', 'Dasar Perihal', 'Ketetapan Hukum']
});

const suggestions = [
  'Surat Somasi Wanprestasi Mitra',
  'Surat Kuasa Khusus Litigasi',
  'Surat Perintah Kerja (SPK) Vendor',
  'Surat Tanggapan Somasi Lawan',
  'Surat Permohonan Audiensi / Izin'
];

const availableClauses = [
  'Identitas Para Pihak',
  'Dasar Perihal',
  'Tenggat Waktu 7 Hari',
  'Peringatan Wanprestasi',
  'Reservasi Hak Gugat',
  'Klausul Ganti Rugi',
  'Kerahasiaan',
  'Penyelesaian Sengketa BANI'
];

const fileExtension = computed(() => {
  if (!uploadedFile.value || !uploadedFile.value.name) return 'FILE';
  const parts = uploadedFile.value.name.split('.');
  return parts[parts.length - 1].toUpperCase();
});

function applySuggestion(sug) {
  form.label = sug;
  if (!form.description) {
    if (sug.includes('Somasi')) {
      form.description = 'Format surat peringatan resmi (Somasi) terkait kelalaian atau keterlambatan pemenuhan kewajiban kontraktual pihak mitra dengan tenggat 7 hari.';
    } else if (sug.includes('Kuasa')) {
      form.description = 'Format surat kuasa khusus perwakilan direksi kepada tim legal internal atau advokat eksternal untuk pengurusan perkara perdata atau pidana.';
    } else if (sug.includes('SPK')) {
      form.description = 'Format baku Surat Perintah Kerja (SPK) pengadaan jasa operasional dan pemeliharaan bernilai ringkas dengan ketentuan pembayaran berjangka.';
    } else if (sug.includes('Tanggapan')) {
      form.description = 'Surat resmi tanggapan yuridis atas somasi atau teguran hukum yang dilayangkan pihak lawan dengan dalil bantahan yang sah.';
    }
  }
  updateDefaultContentSample();
}

function updateDefaultContentSample() {
  const lbl = form.label || 'SURAT RESMI';
  form.contentSample = `SURAT RESMI PERUSAHAAN\nNOMOR: [NOMOR_SURAT]\nLAMPIRAN: [LAMPIRAN]\nPERIHAL: ${lbl.toUpperCase()}\n\nJakarta, [TANGGAL]\n\nKepada Yth.,\nDireksi / Pimpinan [NAMA_PENERIMA]\n[ALAMAT_PENERIMA]\ndi Tempat\n\nDengan hormat,\nBertindak untuk dan atas nama kepentingan hukum PT NUSANTARA ENERGI, bersama ini kami sampaikan:\n\n1. [POKOK_DASAR_HUKUM_1]\n2. [URAIAN_FAKTA_DAN_KEWAJIBAN]\n3. [TUNTUTAN_ATAU_TENGGAT_WAKTU]\n\nDemikian surat ini kami sampaikan untuk menjadi perhatian dan dilaksanakan dengan penuh itikad baik.\n\nHormat kami,\nPT NUSANTARA ENERGI\n\n\n[NAMA_PENANDATANGAN]\n[JABATAN]`;
}

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

function handleFileChange(event) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    processFile(file);
  }
}

function handleDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files && event.dataTransfer.files[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file) {
  uploadedFile.value = file;
  
  // If label is still empty, derive from file name
  if (!form.label) {
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    form.label = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    updateDefaultContentSample();
  }

  // Read data URL for authentic download later
  const reader = new FileReader();
  reader.onload = (e) => {
    fileDataUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // If text or markdown file, also read text content into sample
  if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    const textReader = new FileReader();
    textReader.onload = (e) => {
      form.contentSample = e.target.result;
      isDraftExpanded.value = true;
    };
    textReader.readAsText(file);
  }
}

function removeFile() {
  uploadedFile.value = null;
  fileDataUrl.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
}

function toggleClause(clause) {
  const idx = form.clausesIncluded.indexOf(clause);
  if (idx > -1) {
    form.clausesIncluded.splice(idx, 1);
  } else {
    form.clausesIncluded.push(clause);
  }
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function handleSubmit() {
  if (!form.label.trim()) {
    legalStore.triggerToast('Label / Nama Template wajib diisi.', 'error');
    return;
  }
  if (!form.description.trim()) {
    legalStore.triggerToast('Deskripsi Template wajib diisi.', 'error');
    return;
  }

  if (!form.contentSample) {
    updateDefaultContentSample();
  }

  const payload = {
    label: form.label.trim(),
    title: form.label.trim(),
    templateName: form.label.trim(),
    category: form.category,
    language: form.language,
    description: form.description.trim(),
    contentSample: form.contentSample,
    clausesIncluded: form.clausesIncluded,
    fileName: uploadedFile.value ? uploadedFile.value.name : null,
    fileSize: uploadedFile.value ? formatFileSize(uploadedFile.value.size) : null,
    fileDataUrl: fileDataUrl.value || null
  };

  const created = legalStore.addTemplate(payload);
  emit('created', created);
  emit('close');
}
</script>
