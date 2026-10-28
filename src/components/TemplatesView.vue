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

      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
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

        <!-- Tombol Tambah Dinamis Sesuai Tab -->
        <button
          v-if="activeSubTab === 'clauses'"
          id="btn-add-clause-main"
          @click="openAddClause"
          class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Klausul</span>
        </button>

        <button
          v-else
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
    <div class="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-none flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="activeSubTab === 'clauses' ? 'Cari judul klausul atau isi kalimat...' : 'Cari template surat, somasi, kontrak...'"
          class="form-input form-input-search"
        />
      </div>

      <!-- Category Filter Dropdown (Tactile Precision UI: Single CSS form-select) -->
      <div class="sm:w-72 md:w-80 shrink-0 relative">
        <Filter class="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        
        <select
          v-if="activeSubTab === 'templates'"
          v-model="selectedCategory"
          class="form-select pl-9!"
        >
          <option v-for="cat in templateCategories" :key="cat.key" :value="cat.key">
            {{ cat.label }}
          </option>
        </select>

        <select
          v-else
          v-model="selectedClauseCategory"
          class="form-select pl-9!"
        >
          <option v-for="cat in clauseCategories" :key="cat.key" :value="cat.key">
            {{ cat.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- VIEW 1: Klausul Standar -->
    <ClausesTab
      v-if="activeSubTab === 'clauses'"
      :search-query="searchQuery"
      :selected-category="selectedClauseCategory"
      @open-add="openAddClause"
      @open-edit="openEditClause"
    />

    <!-- VIEW 2: Template Dokumen & Surat -->
    <TemplatesListTab
      v-else-if="activeSubTab === 'templates'"
      :search-query="searchQuery"
      :selected-category="selectedCategory"
      @open-add="isAddModalOpen = true"
      @preview="openPreview"
      @generate="openGenerator"
    />

    <!-- Modal Preview Template Draf -->
    <TemplatesPreviewModal
      v-if="previewTmpl"
      :template="previewTmpl"
      @close="previewTmpl = null"
      @generate="openGenerator"
    />

    <!-- Modal Tambah / Edit Klausul Standar -->
    <ClauseModal
      v-if="isClauseModalOpen"
      :is-edit="isEditClauseMode"
      :initial-data="selectedClauseData"
      @close="isClauseModalOpen = false"
    />

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
import { Search, Plus, Filter, ChevronDown } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import TemplateGeneratorModal from './TemplateGeneratorModal.vue';
import AddTemplateModal from './AddTemplateModal.vue';
import ClausesTab from './Templates/Tabs/ClausesTab.vue';
import TemplatesListTab from './Templates/Tabs/TemplatesListTab.vue';
import TemplatesPreviewModal from './Templates/Modals/TemplatesPreviewModal.vue';
import ClauseModal from './Templates/Modals/ClauseModal.vue';

const activeSubTab = ref('templates');
const searchQuery = ref('');
const selectedCategory = ref('ALL');
const selectedClauseCategory = ref('ALL');
const previewTmpl = ref(null);
const selectedTemplateForGen = ref(null);
const isAddModalOpen = ref(false);

const isClauseModalOpen = ref(false);
const isEditClauseMode = ref(false);
const selectedClauseData = ref({});

const clauses = computed(() => legalStore.state.clauses || []);
const templates = computed(() => legalStore.state.templates || []);

const templateCategories = [
  { key: 'ALL', label: 'Semua Kategori Template' },
  { key: 'SURAT', label: 'Template Surat & Somasi' },
  { key: 'KONTRAK', label: 'Kontrak & Perjanjian' },
  { key: 'CORPORATE', label: 'Korporasi & Legal' }
];

const clauseCategories = computed(() => {
  const cats = [...new Set(clauses.value.map(c => c.category).filter(Boolean))];
  return [
    { key: 'ALL', label: 'Semua Kategori Klausul' },
    ...cats.map(c => ({ key: c, label: c }))
  ];
});

function openAddClause() {
  isEditClauseMode.value = false;
  selectedClauseData.value = {};
  isClauseModalOpen.value = true;
}

function openEditClause(clause) {
  isEditClauseMode.value = true;
  selectedClauseData.value = { ...clause };
  isClauseModalOpen.value = true;
}

function openPreview(tmpl) {
  previewTmpl.value = tmpl;
}

function openGenerator(tmpl) {
  selectedTemplateForGen.value = tmpl;
}

function handleTemplateCreated() {
  activeSubTab.value = 'templates';
}
</script>
