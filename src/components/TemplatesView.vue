<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            Standarisasi Klausul & Naskah Legal
          </span>
          <span class="text-xs text-slate-500 font-medium">Model BANI, FIDIC & Standar Korporasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Template Dokumen & Perpustakaan Klausul
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Koleksi template baku surat legal, perjanjian bisnis (NDA, MoU, Jual Beli Listrik), dan klausul proteksi risiko.
        </p>
      </div>

      <div class="flex items-center gap-2.5 shrink-0 flex-nowrap">
        <!-- Sub-tabs: Klausul vs Template Dokumen -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            @click="activeSubTab = 'clauses'"
            :class="activeSubTab === 'clauses' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap"
          >
            Klausul Standar ({{ clauses.length }})
          </button>
          <button
            @click="activeSubTab = 'templates'"
            :class="activeSubTab === 'templates' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap"
          >
            Template Dokumen ({{ templates.length }})
          </button>
        </div>

        <!-- Tombol Tambah Template -->
        <button
          id="btn-add-template-main"
          @click="isAddModalOpen = true"
          class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Template</span>
        </button>
      </div>
    </div>

    <!-- Filter & Search Bar Section -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="activeSubTab === 'clauses' ? 'Cari judul klausul atau isi kalimat...' : 'Cari template surat, somasi, kontrak...'"
          class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Category Filter Pills (When on Templates Tab) -->
      <div v-if="activeSubTab === 'templates'" class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="cat in templateCategories"
          :key="cat.key"
          @click="selectedCategory = cat.key"
          :class="selectedCategory === cat.key ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'"
          class="px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- VIEW 1: Klausul Standar -->
    <div v-if="activeSubTab === 'clauses'" class="space-y-4">
      <div
        v-for="clause in filteredClauses"
        :key="clause.id"
        class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
            {{ clause.category }}
          </span>
          <button
            @click="copyText(clause.content)"
            class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>Salin Klausul</span>
          </button>
        </div>

        <h3 class="text-base font-bold text-slate-900">{{ clause.title }}</h3>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-line select-all">
          {{ clause.content }}
        </div>

        <p class="text-xs text-slate-500 italic">
          Catatan Legal: {{ clause.explanation }}
        </p>
      </div>
    </div>

    <!-- VIEW 2: Template Dokumen & Surat -->
    <div v-else-if="activeSubTab === 'templates'" class="space-y-4">
      <div v-if="filteredTemplates.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <FileText class="w-6 h-6" />
        </div>
        <h4 class="text-base font-bold text-slate-800">Tidak ada template yang cocok</h4>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Tidak ditemukan template dengan kata kunci atau filter yang Anda pilih. Anda dapat menambahkan template baru dengan tombol di bawah.
        </p>
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Template</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tmpl in filteredTemplates"
          :key="tmpl.id"
          class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span
                :class="isLetterTemplate(tmpl) ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-[#4338CA] border border-blue-100'"
                class="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
              >
                {{ tmpl.category }}
              </span>

              <div class="flex items-center gap-1.5">
                <span v-if="tmpl.language" class="text-[11px] font-medium text-slate-400">
                  {{ tmpl.language }}
                </span>
                <button
                  v-if="isUserAdded(tmpl)"
                  @click="confirmDeleteTemplate(tmpl)"
                  class="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Hapus template ini"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Title & Description -->
            <div>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {{ tmpl.title || tmpl.templateName }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-3">
                {{ tmpl.description }}
              </p>
            </div>

            <!-- Uploaded File Badge -->
            <div
              v-if="tmpl.fileName"
              class="px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold flex items-center justify-between gap-2"
            >
              <div class="flex items-center gap-1.5 truncate">
                <Paperclip class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span class="truncate">Berkas: {{ tmpl.fileName }}</span>
              </div>
              <span class="text-emerald-700 font-mono text-[10px] shrink-0" v-if="tmpl.fileSize">
                {{ tmpl.fileSize }}
              </span>
            </div>

            <!-- Klausul yang Termasuk -->
            <div v-if="tmpl.clausesIncluded && tmpl.clausesIncluded.length" class="space-y-1.5 pt-1">
              <span class="text-[11px] font-semibold text-slate-700 block">Klausul Kunci Termasuk:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="clauseName in tmpl.clausesIncluded"
                  :key="clauseName"
                  class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                >
                  {{ clauseName }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <button
                v-if="tmpl.contentSample"
                @click="openPreview(tmpl)"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1 transition"
              >
                <Eye class="w-3.5 h-3.5 text-slate-500" />
                <span>Lihat Draf</span>
              </button>

              <button
                @click="openGenerator(tmpl)"
                class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition"
              >
                <Zap class="w-3.5 h-3.5" />
                <span>Generate Naskah</span>
              </button>
            </div>

            <button
              @click="downloadTemplate(tmpl)"
              class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1 transition"
              :title="tmpl.fileName ? 'Unduh berkas asli template' : 'Unduh draf teks'"
            >
              <Download class="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh Berkas</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Preview Template Draf -->
    <div
      v-if="previewTmpl"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        <!-- Header -->
        <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#4338CA]">
              {{ previewTmpl.category }}
            </span>
            <h3 class="text-lg font-bold text-slate-900 mt-1">{{ previewTmpl.title || previewTmpl.templateName }}</h3>
          </div>
          <button
            @click="previewTmpl = null"
            class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body Content -->
        <div class="p-6 overflow-y-auto space-y-4">
          <p class="text-xs text-slate-500">{{ previewTmpl.description }}</p>

          <div v-if="previewTmpl.fileName" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Paperclip class="w-4 h-4 text-emerald-600" />
            <span>Berkas Lampiran: <strong>{{ previewTmpl.fileName }}</strong> ({{ previewTmpl.fileSize }})</span>
          </div>

          <div class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-line select-all overflow-x-auto border border-slate-800">
            {{ previewTmpl.contentSample }}
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span class="text-xs text-slate-500">{{ previewTmpl.language || 'Bahasa Indonesia' }}</span>
          <div class="flex items-center gap-2">
            <button
              @click="copyText(previewTmpl.contentSample)"
              class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Copy class="w-3.5 h-3.5" />
              <span>Salin Draf</span>
            </button>
            <button
              @click="openGenerator(previewTmpl); previewTmpl = null"
              class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Zap class="w-3.5 h-3.5" />
              <span>Generate Naskah</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Interactive Template Generator with Merge Fields -->
    <TemplateGeneratorModal
      v-if="selectedTemplateForGen"
      :template="selectedTemplateForGen"
      @close="selectedTemplateForGen = null"
    />

    <!-- Modal Tambah Template Baru -->
    <AddTemplateModal
      v-if="isAddModalOpen"
      @close="isAddModalOpen = false"
      @created="handleTemplateCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Search,
  Copy,
  Download,
  Eye,
  X,
  Zap,
  Plus,
  FileText,
  Paperclip,
  Trash2
} from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import TemplateGeneratorModal from './TemplateGeneratorModal.vue';
import AddTemplateModal from './AddTemplateModal.vue';

const activeSubTab = ref('templates');
const searchQuery = ref('');
const selectedCategory = ref('ALL');
const previewTmpl = ref(null);
const selectedTemplateForGen = ref(null);
const isAddModalOpen = ref(false);

const clauses = computed(() => legalStore.state.clauses || []);
const templates = computed(() => legalStore.state.templates || []);

const templateCategories = [
  { key: 'ALL', label: 'Semua Template' },
  { key: 'SURAT', label: 'Template Surat & Somasi' },
  { key: 'KONTRAK', label: 'Kontrak & Perjanjian' },
  { key: 'OPINION', label: 'Legal Opinion & Lainnya' }
];

function isLetterTemplate(tmpl) {
  const cat = (tmpl.category || '').toLowerCase();
  const title = (tmpl.title || tmpl.templateName || '').toLowerCase();
  const tags = (tmpl.tags || []).join(' ').toLowerCase();
  return (
    cat.includes('surat') ||
    cat.includes('somasi') ||
    cat.includes('spk') ||
    cat.includes('korespondensi') ||
    cat.includes('dispute') ||
    title.includes('surat') ||
    title.includes('somasi') ||
    title.includes('spk') ||
    tags.includes('surat') ||
    tags.includes('somasi')
  );
}

function isUserAdded(tmpl) {
  return tmpl.fileName || tmpl.uploadedAt || tmpl.id?.startsWith('TMPL-008') || Number(tmpl.id?.replace('TMPL-', '')) > 7;
}

const filteredClauses = computed(() => {
  return clauses.value.filter(c => {
    const q = searchQuery.value.toLowerCase().trim();
    return !q || (c.title || '').toLowerCase().includes(q) || (c.content || '').toLowerCase().includes(q);
  });
});

const filteredTemplates = computed(() => {
  return templates.value.filter(t => {
    const q = searchQuery.value.toLowerCase().trim();
    const name = (t.title || t.templateName || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const cat = (t.category || '').toLowerCase();

    const matchesQuery = !q || name.includes(q) || desc.includes(q) || cat.includes(q);
    if (!matchesQuery) return false;

    if (selectedCategory.value === 'ALL') return true;
    if (selectedCategory.value === 'SURAT') return isLetterTemplate(t);
    if (selectedCategory.value === 'KONTRAK') {
      return cat.includes('contract') || cat.includes('agreement') || cat.includes('perjanjian') || cat.includes('mou') || cat.includes('nda') || cat.includes('epc');
    }
    if (selectedCategory.value === 'OPINION') {
      return cat.includes('opinion') || cat.includes('kepatuhan') || cat.includes('nota');
    }
    return true;
  });
});

function openPreview(tmpl) {
  previewTmpl.value = tmpl;
}

function openGenerator(tmpl) {
  selectedTemplateForGen.value = tmpl;
}

function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  legalStore.triggerToast('Teks berhasil disalin ke clipboard!', 'success');
}

function downloadTemplate(tmpl) {
  const name = tmpl.title || tmpl.templateName || 'Template_Legal';
  
  if (tmpl.fileDataUrl && tmpl.fileName) {
    const a = document.createElement('a');
    a.href = tmpl.fileDataUrl;
    a.download = tmpl.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    legalStore.triggerToast(`Mengunduh berkas template: ${tmpl.fileName}`, 'success');
  } else {
    const content = tmpl.contentSample || `${name}\n\n${tmpl.description || ''}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    legalStore.triggerToast(`Mengunduh draf template: ${name}`, 'success');
  }
}

function confirmDeleteTemplate(tmpl) {
  const title = tmpl.title || tmpl.templateName;
  if (confirm(`Apakah Anda yakin ingin menghapus template "${title}"?`)) {
    legalStore.deleteTemplate(tmpl.id);
  }
}

function handleTemplateCreated(created) {
  activeSubTab.value = 'templates';
  selectedCategory.value = 'ALL';
}
</script>
