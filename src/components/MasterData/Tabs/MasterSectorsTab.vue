<template>
  <div class="space-y-4 animate-in fade-in duration-150">
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 text-xs">
      <p class="text-[#475569]">
        Daftar sektor industri menentukan template alur proses lelang, deteksi ambang batas HPS, dan jenis kontrak standar saat lelang dimenangkan.
      </p>
      <span class="text-[#475569] font-medium shrink-0">
        Total: <strong class="text-[#0F172A]">{{ masterSectors.length }}</strong> Sektor
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="sector in masterSectors"
        :key="sector.id"
        class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card hover:border-[#C7D2FE] transition-all space-y-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              {{ sector.icon }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#4338CA] border border-[#C7D2FE]">
                  {{ sector.code }}
                </span>
                <span
                  v-if="sector.hasBelow80Alert"
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
                >
                  Aturan &lt;80% HPS Aktif
                </span>
              </div>
              <h3 class="text-base font-extrabold text-[#0F172A] mt-1">
                {{ sector.name }}
              </h3>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              @click="openEditSector(sector)"
              class="p-1.5 text-slate-500 hover:text-[#4338CA] hover:bg-[#EEF2FF] rounded-lg transition cursor-pointer"
              title="Edit sektor"
            >
              <Edit3 class="w-4 h-4" />
            </button>
            <button
              @click="confirmDeleteSector(sector)"
              class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Hapus sektor"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <p class="text-xs text-[#475569] leading-relaxed">
          {{ sector.description }}
        </p>

        <div class="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[#475569]">Regulasi Pokok:</span>
            <strong class="text-[#0F172A]">{{ sector.regulatoryBasis }}</strong>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#475569]">Kontrak Default:</span>
            <strong class="text-[#4338CA]">{{ sector.defaultContractType }}</strong>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#475569]">Alur Workflow:</span>
            <span class="font-mono text-[11px] text-[#0F172A]">{{ sector.workflowTemplate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Edit3, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const masterSectors = computed(() => legalStore.state.masterSectors || []);

function openEditSector(sector) {
  const newName = window.prompt(`Perbarui nama sektor industri "${sector.name}":`, sector.name);
  if (newName) {
    legalStore.updateMasterSector(sector.id, { name: newName });
  }
}

function confirmDeleteSector(sector) {
  if (window.confirm(`Hapus sektor industri "${sector.name}" dari master data?`)) {
    legalStore.deleteMasterSector(sector.id);
  }
}
</script>
