<template>
  <div class="space-y-5 animate-in fade-in duration-150">
    <!-- Sector Selector Bar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2">
        <span class="font-bold text-[#0F172A]">Pilih Sektor untuk Melihat Alur:</span>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="s in masterSectors"
          :key="s.code"
          @click="selectedWorkflowSector = s.code"
          :class="selectedWorkflowSector === s.code
            ? 'bg-[#6366F1] text-white font-bold shadow-xs'
            : 'bg-[#F1F5F9] text-[#475569] hover:bg-slate-200'"
          class="px-3 py-1.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5 shrink-0"
        >
          <span>{{ s.icon }}</span>
          <span>{{ s.name }}</span>
        </button>
      </div>
    </div>

    <!-- Sector Workflow Presentation Card -->
    <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden space-y-0">
      <div class="p-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ getSelectedSectorObj?.icon }}</span>
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
import { legalStore } from '../../../stores/legalStore';

const selectedWorkflowSector = ref('KONSTRUKSI');

const masterSectors = computed(() => legalStore.state.masterSectors || []);

const getSelectedSectorObj = computed(() => {
  return masterSectors.value.find(s => s.code === selectedWorkflowSector.value) || masterSectors.value[0];
});

const currentSectorStages = computed(() => {
  return legalStore.getStagesForSector(selectedWorkflowSector.value);
});
</script>
