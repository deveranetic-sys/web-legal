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
        class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#4338CA]">
            {{ tmpl.category }}
          </span>
          <h3 class="text-base font-bold text-slate-900">{{ tmpl.templateName }}</h3>
          <p class="text-xs text-slate-600">{{ tmpl.description }}</p>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">Format Word & PDF</span>
          <button
            @click="downloadTemplate(tmpl)"
            class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs cursor-pointer flex items-center gap-1"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Unduh Draf</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Copy, Download } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const activeSubTab = ref('clauses');
const searchQuery = ref('');

const clauses = computed(() => legalStore.state.clauses);
const templates = computed(() => legalStore.state.templates);

const filteredClauses = computed(() => {
  return clauses.value.filter(c => {
    const q = searchQuery.value.toLowerCase().trim();
    return !q || c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q);
  });
});

const filteredTemplates = computed(() => {
  return templates.value.filter(t => {
    const q = searchQuery.value.toLowerCase().trim();
    return !q || t.templateName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  });
});

function copyText(text) {
  navigator.clipboard.writeText(text);
  legalStore.triggerToast('Klausul berhasil disalin ke clipboard!', 'success');
}

function downloadTemplate(tmpl) {
  legalStore.triggerToast(`Mengunduh template: ${tmpl.templateName}`, 'info');
}
</script>
