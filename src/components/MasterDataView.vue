<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Pusat Pengaturan Legal & Pengadaan
          </span>
          <span class="text-xs text-[#475569]">Master Data Engine</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1">
          Master Data & Taksonomi Tender
        </h1>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="exportMasterDataJSON"
          class="px-3.5 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Download class="w-4 h-4 text-slate-500" />
          <span>Ekspor JSON</span>
        </button>

        <button
          v-if="activeTab !== 'stages'"
          @click="openAddModalForCurrentTab"
          class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>{{ getAddButtonLabel }}</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs Bar -->
    <div class="flex items-center gap-2 border-b border-[#E2E8F0] overflow-x-auto pb-px">
      <button
        @click="activeTab = 'doctypes'"
        :class="activeTab === 'doctypes'
          ? 'border-[#6366F1] text-[#6366F1] font-bold'
          : 'border-transparent text-[#475569] hover:text-[#0F172A] font-medium'"
        class="pb-3 px-3 border-b-2 text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
      >
        <FolderTree class="w-4 h-4" />
        <span>1. Kategori Dokumen ({{ masterDocTypes.length }})</span>
      </button>

      <button
        @click="activeTab = 'sectors'"
        :class="activeTab === 'sectors'
          ? 'border-[#6366F1] text-[#6366F1] font-bold'
          : 'border-transparent text-[#475569] hover:text-[#0F172A] font-medium'"
        class="pb-3 px-3 border-b-2 text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
      >
        <Layers class="w-4 h-4" />
        <span>2. Sektor & Klasifikasi ({{ masterSectors.length }})</span>
      </button>

      <button
        @click="activeTab = 'stages'"
        :class="activeTab === 'stages'
          ? 'border-[#6366F1] text-[#6366F1] font-bold'
          : 'border-transparent text-[#475569] hover:text-[#0F172A] font-medium'"
        class="pb-3 px-3 border-b-2 text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
      >
        <GitFork class="w-4 h-4" />
        <span>3. Alur Tahapan Tender</span>
      </button>

      <button
        @click="activeTab = 'contracts'"
        :class="activeTab === 'contracts'
          ? 'border-[#6366F1] text-[#6366F1] font-bold'
          : 'border-transparent text-[#475569] hover:text-[#0F172A] font-medium'"
        class="pb-3 px-3 border-b-2 text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
      >
        <FileSignature class="w-4 h-4" />
        <span>4. Tipe Kontrak Default ({{ masterContractTypes.length }})</span>
      </button>
    </div>

    <!-- Active Tab Components -->
    <MasterDocTypesTab v-if="activeTab === 'doctypes'" />
    <MasterSectorsTab v-else-if="activeTab === 'sectors'" />
    <MasterStagesTab v-else-if="activeTab === 'stages'" />
    <MasterContractTypesTab v-else-if="activeTab === 'contracts'" />

    <!-- Modals -->
    <AddDocTypeModal
      v-if="isAddDocTypeModalOpen"
      @close="isAddDocTypeModalOpen = false"
    />

    <AddSectorModal
      v-if="isAddSectorModalOpen"
      @close="isAddSectorModalOpen = false"
    />

    <AddContractTypeModal
      v-if="isAddContractTypeModalOpen"
      @close="isAddContractTypeModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import {
  FolderTree,
  Layers,
  GitFork,
  FileSignature,
  Plus,
  Download
} from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

// Code-split tabs and modals
const MasterDocTypesTab = defineAsyncComponent(() => import('./MasterData/Tabs/MasterDocTypesTab.vue'));
const MasterSectorsTab = defineAsyncComponent(() => import('./MasterData/Tabs/MasterSectorsTab.vue'));
const MasterStagesTab = defineAsyncComponent(() => import('./MasterData/Tabs/MasterStagesTab.vue'));
const MasterContractTypesTab = defineAsyncComponent(() => import('./MasterData/Tabs/MasterContractTypesTab.vue'));
const AddDocTypeModal = defineAsyncComponent(() => import('./MasterData/Modals/AddDocTypeModal.vue'));
const AddSectorModal = defineAsyncComponent(() => import('./MasterData/Modals/AddSectorModal.vue'));
const AddContractTypeModal = defineAsyncComponent(() => import('./MasterData/Modals/AddContractTypeModal.vue'));

const activeTab = ref('doctypes'); // 'doctypes', 'sectors', 'stages', 'contracts'

const isAddDocTypeModalOpen = ref(false);
const isAddSectorModalOpen = ref(false);
const isAddContractTypeModalOpen = ref(false);

const masterDocTypes = computed(() => legalStore.state.masterDocTypes || []);
const masterSectors = computed(() => legalStore.state.masterSectors || []);
const masterContractTypes = computed(() => legalStore.state.masterContractTypes || []);

const getAddButtonLabel = computed(() => {
  switch (activeTab.value) {
    case 'doctypes': return 'Tambah Tipe Dokumen';
    case 'sectors': return 'Tambah Sektor Industri';
    case 'contracts': return 'Tambah Tipe Kontrak';
    default: return 'Tambah Data';
  }
});

function openAddModalForCurrentTab() {
  if (activeTab.value === 'doctypes') {
    isAddDocTypeModalOpen.value = true;
  } else if (activeTab.value === 'sectors') {
    isAddSectorModalOpen.value = true;
  } else if (activeTab.value === 'contracts') {
    isAddContractTypeModalOpen.value = true;
  }
}

function exportMasterDataJSON() {
  const data = {
    docTypes: legalStore.state.masterDocTypes,
    sectors: legalStore.state.masterSectors,
    stages: legalStore.state.masterStages,
    contractTypes: legalStore.state.masterContractTypes,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `LMS_Master_Data_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  legalStore.triggerToast('Master Data berhasil diekspor (JSON)', 'success');
}
</script>
