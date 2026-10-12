<template>
  <div class="space-y-6">
    <!-- Info banner -->
    <div class="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-[#92400E] flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-900">Konfigurasi Alur Persetujuan Bertingkat (Workflow)</h3>
          <p class="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
            Sistem me-routing dokumen dan tiket secara otomatis berdasarkan hierarki di bawah ini. Pastikan Anda telah menugaskan (assign) pegawai dengan peran (role) yang tepat.
          </p>
        </div>
      </div>
    </div>

    <!-- Approval Flows List -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div
        v-for="flow in (legalStore.state.masterApprovalFlows || [])"
        :key="flow.id"
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ flow.icon }}</span>
                <h4 class="text-sm font-bold text-slate-900">{{ flow.name }}</h4>
              </div>
              <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {{ flow.description }}
              </p>
            </div>
            <div class="shrink-0 flex flex-col items-end gap-2">
              <span
                :class="flow.active ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              >
                {{ flow.active ? 'AKTIF' : 'NONAKTIF' }}
              </span>
              <button
                @click="legalStore.toggleApprovalFlowStatus(flow.id)"
                class="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Ubah Status
              </button>
            </div>
          </div>

          <!-- Flow Steps -->
          <div class="space-y-3">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Urutan Persetujuan ({{ (flow.steps || []).length }} Tahap):
            </div>
            <div class="flex items-center flex-wrap gap-2">
              <template v-for="(step, sIdx) in (flow.steps || [])" :key="step.level">
                <div class="flex items-center gap-2">
                  <div
                    class="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex flex-col"
                  >
                    <span class="text-[9px] text-slate-400 font-bold">Lvl {{ step.level }}: {{ step.name }}</span>
                    <span class="text-xs font-bold text-[#4338CA]">{{ step.roleRequired }}</span>
                  </div>
                  <svg v-if="sIdx < (flow.steps || []).length - 1" class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div class="text-[10px] text-slate-400">
            Terakhir diubah: <span class="font-medium text-slate-600">{{ flow.lastUpdated }}</span>
          </div>
          <button
            @click="$emit('open-edit-flow-modal', flow)"
            class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Alur
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { legalStore } from '../../../stores/legalStore';

const emit = defineEmits(['open-edit-flow-modal']);
</script>
