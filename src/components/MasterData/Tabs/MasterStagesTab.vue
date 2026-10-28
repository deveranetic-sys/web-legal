<template>
  <div class="space-y-5 animate-in fade-in duration-150">
    <!-- Sector Selector Bar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shrink-0">
          <component :is="getSectorIcon(getSelectedSectorObj?.icon)" class="w-4 h-4" />
        </div>
        <div>
          <span class="font-bold text-[#0F172A] block text-xs">Pilih Sektor Industri:</span>
          <span class="text-[11px] text-[#64748B]">Tampilkan alur dan tahapan tender terdaftar</span>
        </div>
      </div>

      <div class="w-full sm:w-80">
        <select
          v-model="selectedWorkflowSector"
          class="form-select"
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
    </div>

    <!-- Sector Workflow Presentation Card -->
    <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden space-y-0">
      <div class="p-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <component :is="getSectorIcon(getSelectedSectorObj?.icon)" class="w-4 h-4 text-indigo-300" />
            </div>
            <h3 class="text-lg font-bold">
              Alur Tahapan Tender Sektor: {{ getSelectedSectorObj?.name }}
            </h3>
          </div>
          <p class="text-xs text-slate-300">
            Regulasi: <strong>{{ getSelectedSectorObj?.regulatoryBasis }}</strong> • Template: <span class="font-mono text-emerald-400">{{ getSelectedSectorObj?.workflowTemplate }}</span>
          </p>
        </div>

        <div class="shrink-0">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
            {{ currentSectorStages.length }} Tahapan
          </span>
        </div>
      </div>

      <!-- Stages Stepper Grid / List -->
      <div class="p-6 divide-y divide-[#E2E8F0]">
        <div
          v-for="(stage, idx) in currentSectorStages"
          :key="stage.key"
          class="py-4 first:pt-0 last:pb-0 flex items-start gap-4 group"
        >
          <div class="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {{ idx + 1 }}
          </div>

          <div class="flex-1 space-y-1 min-w-0">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h4 class="text-sm font-extrabold text-[#0F172A]">
                {{ stage.name }}
              </h4>
              <span class="font-mono text-[10px] text-[#475569] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                {{ stage.key }}
              </span>
            </div>
            <p class="text-xs text-[#475569] leading-relaxed">
              {{ stage.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
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
  Boxes
} from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const selectedWorkflowSector = ref('KONSTRUKSI');

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
</script>
