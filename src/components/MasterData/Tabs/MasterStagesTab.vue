<template>
  <div class="space-y-5 animate-in fade-in duration-150">
    <!-- Sector Selector & Actions Bar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shrink-0">
          <component :is="getSectorIcon(getSelectedSectorObj?.icon)" class="w-4 h-4" />
        </div>
        <div>
          <span class="font-bold text-[#0F172A] block text-xs">Pilih Sektor Industri:</span>
          <span class="text-[11px] text-[#64748B]">Tampilkan dan sesuaikan urutan tahapan tender</span>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
        <div class="w-full sm:w-72">
          <select
            v-model="selectedWorkflowSector"
            class="form-select text-xs w-full h-[38px] font-semibold"
          >
            <option
              v-for="s in masterSectors"
              :key="s.code"
              :value="s.code"
            >
              {{ s.name }} ({{ s.code }})
            </option>
          </select>
        </div>

        <button
          @click="openAddStageModal"
          class="px-3.5 h-[38px] bg-[#4338CA] hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
          title="Tambah butir tahapan (step) baru ke dalam alur sektor ini"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Butir Tahap</span>
        </button>

        <button
          @click="handleResetStages"
          class="px-3 h-[38px] bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
          title="Kembalikan urutan tahapan sektor ini ke konfigurasi bawaan"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Standar</span>
        </button>
      </div>
    </div>

    <!-- Sector Workflow Presentation Card -->
    <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden space-y-0">
      <!-- Sector Info Banner Header -->
      <div class="p-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <component :is="getSectorIcon(getSelectedSectorObj?.icon)" class="w-4 h-4 text-indigo-300" />
            </div>
            <h3 class="text-base sm:text-lg font-bold">
              Alur Tahapan Tender: {{ getSelectedSectorObj?.name }}
            </h3>
          </div>
          <p class="text-xs text-slate-300">
            Regulasi Acuan: <strong>{{ getSelectedSectorObj?.regulatoryBasis }}</strong> • Template: <span class="font-mono text-emerald-400">{{ getSelectedSectorObj?.workflowTemplate }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
            {{ currentSectorStages.length }} Tahapan Terdaftar
          </span>
        </div>
      </div>

      <!-- Stages Stepper Grid / List with Interactive Controls -->
      <div class="p-6 divide-y divide-[#E2E8F0]">
        <div
          v-for="(stage, idx) in currentSectorStages"
          :key="stage.key || idx"
          class="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5 group hover:bg-[#F8FAFC]/60 p-2.5 rounded-xl transition"
        >
          <!-- Stage Number Badge -->
          <div class="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
            {{ idx + 1 }}
          </div>

          <!-- Stage Info Body -->
          <div class="flex-1 space-y-1.5 min-w-0">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-sm font-extrabold text-[#0F172A]">
                  {{ stage.name }}
                </h4>
                <span
                  v-if="stage.shortName && stage.shortName !== stage.name"
                  class="text-[10px] font-bold text-[#4338CA] bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded"
                >
                  {{ stage.shortName }}
                </span>
                <span class="font-mono text-[10px] text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1]">
                  {{ stage.key }}
                </span>
              </div>

              <!-- Stage Control Action Buttons -->
              <div class="flex items-center gap-1 shrink-0 opacity-90 group-hover:opacity-100 transition">
                <!-- Move Up Button -->
                <button
                  @click="handleMoveStage(idx, -1)"
                  :disabled="idx === 0"
                  class="w-7 h-7 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="Pindahkan ke urutan sebelumnya (Geser Naik)"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>

                <!-- Move Down Button -->
                <button
                  @click="handleMoveStage(idx, 1)"
                  :disabled="idx === currentSectorStages.length - 1"
                  class="w-7 h-7 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="Pindahkan ke urutan berikutnya (Geser Turun)"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>

                <!-- Edit Stage Button -->
                <button
                  @click="openEditStageModal(stage, idx)"
                  class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center transition cursor-pointer shadow-2xs ml-0.5"
                  title="Edit nama dan deskripsi tahapan ini"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>

                <!-- Delete Stage Button -->
                <button
                  @click="handleDeleteStage(stage, idx)"
                  :disabled="currentSectorStages.length <= 1"
                  class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="Hapus tahapan ini dari alur"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Stage Description -->
            <p class="text-xs text-[#475569] leading-relaxed whitespace-pre-line">
              {{ stage.description }}
            </p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="currentSectorStages.length === 0" class="py-12 text-center text-[#64748B]">
          <GitFork class="w-10 h-10 mx-auto text-[#94A3B8] stroke-1 mb-2" />
          <p class="font-bold text-sm text-[#0F172A]">Belum Ada Tahapan Tender Terdaftar</p>
          <p class="text-xs text-[#64748B] mt-1">
            Klik tombol "Tambah Tahap" atau "Reset Standar" untuk mengisi alur proses pengadaan sektor ini.
          </p>
          <button
            @click="handleResetStages"
            class="mt-3 px-3 py-1.5 bg-[#4338CA] hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Muat Alur Standar Sektor
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Tambah / Edit Tahapan Tender -->
    <StageModal
      :is-open="isStageModalOpen"
      :is-edit="isEditStage"
      :sector-code="selectedWorkflowSector"
      :sector-name="getSelectedSectorObj?.name"
      :initial-data="editingStageData"
      :total-stages="currentSectorStages.length"
      @close="isStageModalOpen = false"
      @save="handleSaveStage"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  HardHat,
  Pickaxe,
  Flame,
  Zap,
  Package,
  Building2,
  Factory,
  Radio,
  Wrench,
  Mountain,
  Boxes,
  Plus,
  RotateCcw,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  GitFork
} from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';
import StageModal from '../Modals/StageModal.vue';

const selectedWorkflowSector = ref('KONSTRUKSI');

const isStageModalOpen = ref(false);
const isEditStage = ref(false);
const editingStageIndex = ref(-1);
const editingStageData = ref({});

const masterSectors = computed(() => legalStore.state.masterSectors || []);

function getSectorIcon(iconName) {
  const map = {
    hardhat: HardHat, '🏗️': HardHat, konstruksi: HardHat,
    pickaxe: Pickaxe, '⛏️': Pickaxe, pertambangan: Pickaxe, tambang: Pickaxe,
    flame: Flame, '🛢️': Flame, migas: Flame,
    zap: Zap, '⚡': Zap, energi: Zap,
    package: Package, '📦': Package, umum: Package,
    building2: Building2, '🏢': Building2, korporasi: Building2,
    factory: Factory, '🏭': Factory,
    radio: Radio, '📡': Radio, telko: Radio,
    wrench: Wrench, '🔧': Wrench,
    mountain: Mountain, '⛰️': Mountain,
    boxes: Boxes
  };
  const key = String(iconName || '').toLowerCase().trim();
  return map[key] || Building2;
}

const getSelectedSectorObj = computed(() => {
  return masterSectors.value.find(s => s.code === selectedWorkflowSector.value) || masterSectors.value[0];
});

const currentSectorStages = computed(() => {
  return legalStore.getStagesForSector(selectedWorkflowSector.value);
});

function openAddStageModal() {
  isEditStage.value = false;
  editingStageIndex.value = -1;
  editingStageData.value = {};
  isStageModalOpen.value = true;
}

function openEditStageModal(stage, idx) {
  isEditStage.value = true;
  editingStageIndex.value = idx;
  editingStageData.value = { ...stage, index: idx };
  isStageModalOpen.value = true;
}

function handleSaveStage(payload) {
  if (isEditStage.value && editingStageIndex.value >= 0) {
    legalStore.updateStageInSector(selectedWorkflowSector.value, editingStageIndex.value, payload);
  } else {
    const insertIdx = payload.insertPosition === 'start' ? 0 : -1;
    legalStore.addStageToSector(selectedWorkflowSector.value, payload, insertIdx);
  }
  isStageModalOpen.value = false;
}

function handleMoveStage(idx, direction) {
  legalStore.moveStageInSector(selectedWorkflowSector.value, idx, direction);
}

async function handleDeleteStage(stage, idx) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Tahapan Tender?',
    message: `Apakah Anda yakin ingin menghapus tahapan "${stage.name}" (${stage.key}) dari alur sektor ${selectedWorkflowSector.value}?`,
    confirmText: 'Ya, Hapus Tahap',
    cancelText: 'Batal',
    variant: 'danger'
  });

  if (confirmed) {
    legalStore.deleteStageFromSector(selectedWorkflowSector.value, idx);
  }
}

async function handleResetStages() {
  const confirmed = await legalStore.confirm({
    title: 'Reset Alur Tahapan ke Standar?',
    message: `Kembalikan seluruh urutan dan rincian tahapan untuk sektor ${selectedWorkflowSector.value} ke template konfigurasi standar awal? Perubahan kustom yang telah dibuat akan ditimpa.`,
    confirmText: 'Ya, Kembalikan ke Standar',
    cancelText: 'Batal',
    variant: 'warning'
  });

  if (confirmed) {
    legalStore.resetSectorStagesToDefault(selectedWorkflowSector.value);
  }
}

function setSector(code) {
  selectedWorkflowSector.value = code;
}

// Expose openAddModal and setSector for MasterDataView
defineExpose({
  setSector,
  openAddModal: openAddStageModal
});
</script>
