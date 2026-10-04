<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
    <div class="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Top Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/30">
            ⚡
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                Generator Draf Otomatis
              </span>
              <span class="text-xs text-slate-400 font-mono">{{ template.id }}</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              {{ template.title || template.templateName }}
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

      <!-- Main Body: Two Columns (Form Inputs on Left, Real-Time Generated Preview on Right) -->
      <div class="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        <!-- Left: Variable Inputs Form (5 Cols) -->
        <div class="lg:col-span-5 p-5 sm:p-6 space-y-4 bg-slate-50/50 overflow-y-auto max-h-[75vh]">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Variabel Isian Perjanjian
            </h4>
            <button
              @click="resetToDefaults"
              class="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Reset Default
            </button>
          </div>

          <div class="space-y-3.5 text-xs">
            <!-- Nomor & Tanggal -->
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nomor Dokumen</label>
                <input
                  v-model="form.docNumber"
                  type="text"
                  class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Tanggal Dokumen</label>
                <input
                  v-model="form.docDate"
                  type="date"
                  class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <!-- Pihak Pertama (Internal) -->
            <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <span class="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider block">Pihak Pertama (Perseroan)</span>
              <div>
                <label class="block font-medium text-slate-600 mb-0.5">Nama Entitas</label>
                <input
                  v-model="form.firstParty"
                  type="text"
                  class="w-full p-1.5 border border-slate-300 rounded-md font-semibold text-slate-900"
                />
              </div>
              <div>
                <label class="block font-medium text-slate-600 mb-0.5">Penandatangan / Jabatan</label>
                <input
                  v-model="form.firstPartyRep"
                  type="text"
                  class="w-full p-1.5 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
            </div>

            <!-- Pihak Kedua (Mitra / Counterparty) -->
            <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <span class="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider block">Pihak Kedua (Mitra / Rekanan)</span>
              <div>
                <label class="block font-medium text-slate-600 mb-0.5">Nama Perusahaan Lawan</label>
                <input
                  v-model="form.secondParty"
                  type="text"
                  placeholder="PT Mitra Jaya Abadi"
                  class="w-full p-1.5 border border-slate-300 rounded-md font-semibold text-slate-900"
                />
              </div>
              <div>
                <label class="block font-medium text-slate-600 mb-0.5">Penandatangan / Jabatan</label>
                <input
                  v-model="form.secondPartyRep"
                  type="text"
                  placeholder="Nama Direktur / Kuasa"
                  class="w-full p-1.5 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
              <div>
                <label class="block font-medium text-slate-600 mb-0.5">Domisili / Alamat</label>
                <input
                  v-model="form.secondPartyAddress"
                  type="text"
                  class="w-full p-1.5 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
            </div>

            <!-- Objek / Maksud Perjanjian -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Objek / Maksud Kerjasama</label>
              <textarea
                v-model="form.subjectOrPurpose"
                rows="2"
                class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <!-- Nilai & Jangka Waktu -->
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nilai Kontrak (Rp)</label>
                <input
                  v-model.number="form.contractValue"
                  type="number"
                  step="50000000"
                  class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Jangka Waktu</label>
                <input
                  v-model="form.durationMonths"
                  type="text"
                  class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <!-- Forum Arbitrase / Hukum -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Forum Arbitrase / Penyelesaian Sengketa</label>
              <select
                v-model="form.arbitrationForum"
                class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="Badan Arbitrase Nasional Indonesia (BANI) di Jakarta">Badan Arbitrase Nasional Indonesia (BANI) Jakarta</option>
                <option value="Pengadilan Negeri Jakarta Pusat">Pengadilan Negeri Jakarta Pusat</option>
                <option value="Singapore International Arbitration Centre (SIAC)">SIAC (Singapore International Arbitration Centre)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Right: Real-Time Generated Document Output (7 Cols) -->
        <div class="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between bg-white max-h-[75vh] overflow-y-auto">
          <div class="space-y-4">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-200">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-xs font-bold text-slate-800">Preview Naskah Resmi Jadi</span>
              </div>
              <span class="text-[11px] text-slate-400">Siap Cetak & Tandatangan</span>
            </div>

            <!-- Letterhead & Legal Document Render Box -->
            <div
              id="printable-document-box"
              class="border border-slate-300 rounded-xl p-6 sm:p-8 bg-white shadow-xs font-serif text-slate-900 text-xs sm:text-sm leading-relaxed space-y-4 select-all"
            >
              <!-- Formal Corporate Letterhead -->
              <div class="text-center border-b-2 border-slate-900 pb-3 mb-4 space-y-0.5">
                <h2 class="text-sm sm:text-base font-black tracking-wider uppercase font-sans text-slate-900">
                  {{ form.firstParty }}
                </h2>
                <p class="text-[10px] sm:text-xs text-slate-600 font-sans">
                  Energy Tower 28th Fl., SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190
                </p>
                <p class="text-[9px] sm:text-[10px] text-slate-400 font-sans">
                  Telp: (021) 5289-7000 • Email: legal@nusantara-energi.co.id • Portal: lmstoha.ai.studio
                </p>
              </div>

              <!-- Main Document Text with dynamic replacements -->
              <div class="whitespace-pre-line text-justify font-serif text-xs text-slate-800 leading-normal">
                {{ generatedContent }}
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <div class="p-4 px-6 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span>Format: <strong>Word (.doc)</strong>, <strong>PDF / Print</strong>, atau <strong>Salin Draf</strong></span>
        </div>

        <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <!-- Copy Button -->
          <button
            @click="copyGeneratedText"
            class="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition shadow-2xs whitespace-nowrap"
          >
            <Copy class="w-3.5 h-3.5 text-slate-600" />
            <span>Salin Draf</span>
          </button>

          <!-- Print / PDF Button -->
          <button
            @click="printDocument"
            class="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition shadow-2xs whitespace-nowrap"
          >
            <Printer class="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak PDF</span>
          </button>

          <!-- Download Word (.doc) Button -->
          <button
            @click="downloadWord"
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition whitespace-nowrap"
          >
            <FileDown class="w-4 h-4" />
            <span>Unduh Word</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { X, Copy, Printer, FileDown } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import { DEFAULT_TEMPLATE_FIELDS, generateLegalDocument, downloadAsWordDoc } from '../services/templateGeneratorService';

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

// Reactive form pre-filled with context from legalStore and defaults
const form = reactive({
  ...DEFAULT_TEMPLATE_FIELDS,
  firstParty: legalStore.state.currentEntity || DEFAULT_TEMPLATE_FIELDS.firstParty,
  docNumber: `${Math.floor(100 + Math.random() * 900)}/NE-LEGAL/${props.template.id}/X/2026`,
  subjectOrPurpose: props.template.title || props.template.templateName || DEFAULT_TEMPLATE_FIELDS.subjectOrPurpose
});

function resetToDefaults() {
  Object.assign(form, {
    ...DEFAULT_TEMPLATE_FIELDS,
    firstParty: legalStore.state.currentEntity || DEFAULT_TEMPLATE_FIELDS.firstParty,
    docNumber: `${Math.floor(100 + Math.random() * 900)}/NE-LEGAL/${props.template.id}/X/2026`
  });
  legalStore.triggerToast('Formulir direset ke isian standar', 'info');
}

// Compute real-time generated content
const generatedContent = computed(() => {
  return generateLegalDocument(props.template.id, form);
});

function copyGeneratedText() {
  navigator.clipboard.writeText(generatedContent.value);
  legalStore.triggerToast('Naskah kontrak berhasil disalin ke clipboard!', 'success');
}

function printDocument() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${props.template.title || 'Dokumen Hukum'}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #111; margin: 2.5cm; }
        .letterhead { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; font-family: sans-serif; }
        .letterhead h2 { margin: 0; font-size: 14pt; }
        .letterhead p { margin: 2px 0; font-size: 8.5pt; color: #444; }
        .content { white-space: pre-wrap; text-align: justify; }
        @media print {
          @page { margin: 2cm; }
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="letterhead">
        <h2>${form.firstParty}</h2>
        <p>Energy Tower 28th Fl., SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190</p>
        <p>Telp: (021) 5289-7000 | Email: legal@nusantara-energi.co.id | Portal: lmstoha.ai.studio</p>
      </div>
      <div class="content">${generatedContent.value.replace(/\n/g, '<br/>')}</div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

function downloadWord() {
  const filename = `${props.template.id}_${props.template.title || 'Dokumen'}`;
  downloadAsWordDoc(filename, props.template.title, generatedContent.value);
  legalStore.triggerToast(`Berhasil mengunduh dokumen Word: ${filename}.doc`, 'success');
  
  legalStore.addActivityLog({
    module: 'Templates & Generator',
    action: 'GENERATE_DOC',
    recordId: props.template.id,
    description: `Mengunduh draf perjanjian siap pakai: ${props.template.title} dengan nomor ${form.docNumber}`
  });
}
</script>
