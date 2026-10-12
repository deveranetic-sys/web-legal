<template>
  <div
    v-if="approvalTarget"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0]">
      
      <!-- Header -->
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-extrabold text-white text-base">Otorisasi Persetujuan Permintaan Legal</h3>
            <p class="text-[11px] text-slate-300">{{ approvalTarget.ticketNumber || approvalTarget.id }} • {{ approvalTarget.requestor }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
      </div>

      <div class="p-6 space-y-4 text-xs sm:text-sm">
        
        <!-- Summary info -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div class="font-bold text-slate-900 text-xs">{{ approvalTarget.subject }}</div>
          <div class="text-[11px] text-slate-500">{{ approvalTarget.requestType }} • Unit: {{ approvalTarget.department }}</div>
        </div>

        <!-- Approval Mode Switcher Tabs -->
        <div class="space-y-1.5">
          <label class="block font-bold text-slate-800 text-xs">Pilih Keputusan Persetujuan:</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="approvalMode = 'APPROVE'"
              :class="approvalMode === 'APPROVE' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
              class="py-2 px-2.5 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-1"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Setujui</span>
            </button>

            <button
              type="button"
              @click="approvalMode = 'REVISION'"
              :class="approvalMode === 'REVISION' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
              class="py-2 px-2.5 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-1"
            >
              <AlertCircle class="w-3.5 h-3.5" />
              <span>Minta Revisi</span>
            </button>

            <button
              type="button"
              @click="approvalMode = 'REJECT'"
              :class="approvalMode === 'REJECT' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
              class="py-2 px-2.5 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-1"
            >
              <XCircle class="w-3.5 h-3.5" />
              <span>Tolak</span>
            </button>
          </div>
        </div>

        <!-- Notes / Reason input -->
        <div class="space-y-1.5">
          <label class="block font-bold text-slate-800 text-xs">
            <span v-if="approvalMode === 'APPROVE'">Catatan Persetujuan (Opsional):</span>
            <span v-else-if="approvalMode === 'REVISION'">Poin Catatan Revisi yang Wajib Diperbaiki <span class="text-rose-500">*</span>:</span>
            <span v-else>Alasan Yuridis Penolakan <span class="text-rose-500">*</span>:</span>
          </label>
          <textarea
            v-model="approvalNotes"
            rows="3"
            :placeholder="approvalMode === 'APPROVE' ? 'Tuliskan catatan arahan pelaksanaan atau persetujuan bersyarat...' : (approvalMode === 'REVISION' ? 'Jelaskan klausul atau dokumen pendukung yang wajib dilengkapi pemohon...' : 'Jelaskan dasar pertimbangan hukum mengapa permohonan ini tidak dapat disetujui...')"
            class="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-slate-900 resize-none"
          ></textarea>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
          >
            Batal
          </button>

          <button
            type="button"
            @click="submitDecision"
            :class="approvalMode === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : (approvalMode === 'REVISION' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-rose-600 hover:bg-rose-700')"
            class="px-5 py-2 rounded-xl text-white font-bold cursor-pointer shadow-md transition text-xs flex items-center gap-1.5"
          >
            <Check class="w-4 h-4 stroke-[2.5]" />
            <span>
              {{ approvalMode === 'APPROVE' ? 'Setujui Permohonan' : (approvalMode === 'REVISION' ? 'Minta Revisi' : 'Tolak Permohonan') }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ShieldCheck, CheckCircle2, AlertCircle, XCircle, Check } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  approvalTarget: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const approvalMode = ref('APPROVE');
const approvalNotes = ref('');

function submitDecision() {
  if (!props.approvalTarget) return;
  const id = props.approvalTarget.id;

  if (approvalMode.value === 'APPROVE') {
    legalStore.approveRequest(id, approvalNotes.value);
  } else if (approvalMode.value === 'REVISION') {
    if (!approvalNotes.value.trim()) {
      legalStore.triggerToast('Catatan revisi wajib diisi agar pemohon mengetahui poin perbaikan.', 'error');
      return;
    }
    legalStore.requestRevision(id, approvalNotes.value);
  } else if (approvalMode.value === 'REJECT') {
    if (!approvalNotes.value.trim()) {
      legalStore.triggerToast('Alasan penolakan wajib diisi.', 'error');
      return;
    }
    legalStore.rejectRequest(id, approvalNotes.value);
  }

  approvalNotes.value = '';
  emit('close');
}
</script>
