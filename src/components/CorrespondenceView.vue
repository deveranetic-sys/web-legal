<template>
  <div class="space-y-4">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
            Administrasi Surat Menyurat, Somasi & Kuasa
          </span>
          <span class="text-[11px] text-slate-500 font-medium">Buku Register Digital</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Surat Menyurat & Korespondensi Legal
        </h1>
      </div>

      <div class="flex items-center gap-2 shrink-0 flex-nowrap">
        <!-- Sub-tabs Switcher -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            @click="activeTab = 'register'"
            :class="activeTab === 'register' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap"
          >
            Register Surat ({{ correspondence.length }})
          </button>
          <button
            @click="activeTab = 'templates'"
            :class="activeTab === 'templates' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Template Surat</span>
            <span class="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
              {{ letterTemplates.length }}
            </span>
          </button>
        </div>

        <!-- Tombol Tambah Template Surat (when on templates tab) -->
        <button
          v-if="activeTab === 'templates'"
          id="btn-add-letter-template"
          @click="openAddTemplate"
          :class="[
            'px-3.5 py-2 rounded-xl',
            'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800',
            'text-white font-bold text-xs shadow-sm transition cursor-pointer',
            'flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.98] whitespace-nowrap'
          ]"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Template</span>
        </button>

        <!-- Tombol Catat Surat (when on register tab) -->
        <button
          v-if="activeTab === 'register'"
          id="btn-catat-surat"
          @click="openAddCorrespondence"
          :class="[
            'px-3.5 py-2 rounded-xl',
            'bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs',
            'transition cursor-pointer flex items-center gap-1.5',
            'hover:scale-[1.01] active:scale-[0.98] whitespace-nowrap'
          ]"
        >
          <Send class="w-4 h-4" />
          <span>Catat Surat</span>
        </button>
      </div>
    </div>

    <!-- VIEW 1: Buku Register Surat -->
    <CorrespondenceRegisterTab
      v-if="activeTab === 'register'"
      @select-detail="openDetailCorrespondence"
      @edit-item="openEditCorrespondence"
    />

    <!-- VIEW 2: Koleksi Template Surat -->
    <CorrespondenceTemplatesTab
      v-else-if="activeTab === 'templates'"
      @open-add="openAddTemplate"
      @preview="openPreview"
      @generate="openGenerator"
    />

    <!-- Form Modal (Create & Edit) -->
    <CorrespondenceFormModal
      :is-open="isFormModalOpen"
      :is-edit="isEditMode"
      :initial-data="currentFormData"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Detail Modal -->
    <CorrespondenceDetailModal
      :is-open="!!selectedCorrDetail"
      :item="selectedCorrDetail"
      @close="selectedCorrDetail = null"
      @edit="openEditCorrespondence"
    />

    <!-- Preview Template Modal -->
    <PreviewTemplateModal
      :is-open="!!previewTmpl"
      :template="previewTmpl"
      @close="previewTmpl = null"
      @generate="openGenerator"
    />

    <!-- Modal Interactive Template Generator -->
    <TemplateGeneratorModal
      v-if="selectedTemplateForGen"
      :template="selectedTemplateForGen"
      @close="selectedTemplateForGen = null"
    />

    <!-- Modal Tambah Template Surat -->
    <AddTemplateModal
      v-if="isAddModalOpen"
      defaultCategory="Template Surat (Korespondensi / Somasi)"
      @close="isAddModalOpen = false"
      @created="handleTemplateCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Send, Plus } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import TemplateGeneratorModal from './TemplateGeneratorModal.vue';
import AddTemplateModal from './AddTemplateModal.vue';
import CorrespondenceFormModal from './Correspondence/CorrespondenceFormModal.vue';
import CorrespondenceDetailModal from './Correspondence/CorrespondenceDetailModal.vue';
import PreviewTemplateModal from './Correspondence/PreviewTemplateModal.vue';
import CorrespondenceRegisterTab from './Correspondence/CorrespondenceRegisterTab.vue';
import CorrespondenceTemplatesTab from './Correspondence/CorrespondenceTemplatesTab.vue';

const activeTab = ref('register');
const isAddModalOpen = ref(false);
const previewTmpl = ref(null);
const selectedTemplateForGen = ref(null);
const selectedCorrDetail = ref(null);

const isFormModalOpen = ref(false);
const isEditMode = ref(false);
const currentFormData = ref({});

const correspondence = computed(() => legalStore.state.correspondence || []);
const allTemplates = computed(() => legalStore.state.templates || []);

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
    tags.includes('somasi') ||
    tmpl.fileName?.toLowerCase().includes('surat') ||
    tmpl.fileName?.toLowerCase().includes('somasi')
  );
}

const letterTemplates = computed(() => {
  return allTemplates.value.filter(isLetterTemplate);
});

function openAddCorrespondence() {
  isEditMode.value = false;
  currentFormData.value = {};
  isFormModalOpen.value = true;
}

function openEditCorrespondence(item) {
  const isInc = item.direction === 'MASUK' || (item.type || '').toLowerCase().includes('incoming') || (item.type || '').toLowerCase().includes('masuk');
  isEditMode.value = true;
  currentFormData.value = {
    ...item,
    direction: isInc ? 'MASUK' : 'KELUAR',
    type: item.type || 'Surat Somasi',
    pic: item.pic || 'Legal Counsel',
    status: item.status || 'SENT'
  };
  isFormModalOpen.value = true;
}

function handleFormSubmit(formData) {
  if (isEditMode.value) {
    legalStore.updateCorrespondence(formData.id, formData);
  } else {
    legalStore.addCorrespondence(formData);
  }
  isFormModalOpen.value = false;
}

function openDetailCorrespondence(item) {
  selectedCorrDetail.value = item;
}

function openAddTemplate() {
  isAddModalOpen.value = true;
}

function openPreview(tmpl) {
  previewTmpl.value = tmpl;
}

function openGenerator(tmpl) {
  selectedTemplateForGen.value = tmpl;
}

function handleTemplateCreated() {
  activeTab.value = 'templates';
}
</script>
