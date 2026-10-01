<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            Standarisasi Klausul Kontrak
          </span>
          <span class="text-xs text-slate-500 font-medium">Model BANI & FIDIC Standard</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Template Dokumen & Perpustakaan Klausul
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Koleksi template baku perjanjian (NDA, MoU, Jual Beli Listrik) dan klausul proteksi risiko (Ganti Rugi, Arbitrase BANI, Force Majeure).
        </p>
      </div>

      <!-- Sub-tabs: Klausul vs Template Dokumen -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        <button
          @click="activeSubTab = 'clauses'"
          :class="activeSubTab === 'clauses' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
          class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
        >
          Perpustakaan Klausul ({{ clauses.length }})
        </button>
        <button
          @click="activeSubTab = 'templates'"
          :class="activeSubTab === 'templates' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
          class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
        >
          Template Perjanjian ({{ templates.length }})
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex gap-3">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="activeSubTab === 'clauses' ? 'Cari judul klausul atau isi kalimat...' : 'Cari template kontrak...'"
          class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
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

    <!-- VIEW 2: Template Dokumen -->
    <div v-else-if="activeSubTab === 'templates'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="tmpl in filteredTemplates"
        :key="tmpl.id"
        class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#4338CA]">
              {{ tmpl.category }}
            </span>
            <span v-if="tmpl.language" class="text-[11px] font-medium text-slate-400">
              {{ tmpl.language }}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900">{{ tmpl.title || tmpl.templateName }}</h3>
          <p class="text-xs text-slate-600 leading-relaxed">{{ tmpl.description }}</p>

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

        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <button
              v-if="tmpl.contentSample"
              @click="openPreview(tmpl)"
              class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1"
            >
              <Eye class="w-3.5 h-3.5 text-slate-500" />
              <span>Lihat Draf</span>
            </button>

            <button
              @click="openGenerator(tmpl)"
              class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition"
            >
              <Zap class="w-3.5 h-3.5" />
              <span>⚡ Generate Naskah</span>
            </button>
          </div>

          <button
            @click="downloadTemplate(tmpl)"
            class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1"
            title="Unduh draf standar"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Preview Template Draf -->
    <div
      v-if="previewTmpl"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
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
              <span>Salin Teks Draf</span>
            </button>
            <button
              @click="openGenerator(previewTmpl); previewTmpl = null"
              class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Zap class="w-3.5 h-3.5" />
              <span>Isi Variabel & Generate Naskah</span>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Copy, Download, Eye, X, Zap } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import TemplateGeneratorModal from './TemplateGeneratorModal.vue';

const activeSubTab = ref('templates');
const searchQuery = ref('');
const previewTmpl = ref(null);
const selectedTemplateForGen = ref(null);

const clauses = computed(() => legalStore.state.clauses || []);
const templates = computed(() => legalStore.state.templates || []);

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
    return !q || name.includes(q) || desc.includes(q) || cat.includes(q);
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
  const name = tmpl.title || tmpl.templateName;
  legalStore.triggerToast(`Mengunduh template: ${name}`, 'info');
}
</script>
