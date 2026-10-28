<template>
  <div
    v-if="request"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between shrink-0">
        <div>
          <span class="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-2 py-0.5 rounded">
            {{ request.ticketNumber || request.id }}
          </span>
          <h3 class="font-extrabold text-white text-base mt-1">{{ request.subject }}</h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
      </div>

      <div class="p-6 space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
        
        <!-- Multi-tier Chain Approval Timeline -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                Alur Persetujuan Bertingkat (Chain Approval):
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-[#4338CA]">
                {{ chainSteps.length }} Tahap
              </span>
            </div>
            <span class="text-[11px] font-semibold text-slate-500">
              Tahap Aktif: Level {{ currentActiveLevel }}
            </span>
          </div>

          <!-- Dynamic Steps List -->
          <div class="space-y-2.5">
            <div
              v-for="step in chainSteps"
              :key="step.level"
              class="p-3 rounded-xl border transition-all"
              :class="getStepBoxClass(step)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-start gap-2.5">
                  <div
                    class="w-6 h-6 rounded-lg font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5"
                    :class="getStepBadgeClass(step)"
                  >
                    <Check v-if="step.status === 'APPROVED'" class="w-3.5 h-3.5 stroke-[3]" />
                    <X v-else-if="step.status === 'REJECTED'" class="w-3.5 h-3.5 stroke-[3]" />
                    <AlertCircle v-else-if="step.status === 'REVISION_REQUIRED'" class="w-3.5 h-3.5 stroke-[3]" />
                    <Clock v-else-if="step.status === 'PENDING'" class="w-3.5 h-3.5 stroke-[2.5] animate-pulse" />
                    <span v-else>{{ step.level }}</span>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-slate-900 text-xs">
                        Tahap {{ step.level }}: {{ step.name }}
                      </span>
                      <span class="px-2 py-0.2 rounded text-[10px] font-extrabold bg-slate-200/70 text-slate-800">
                        {{ step.roleRequired }}
                      </span>
                    </div>

                    <!-- Step Decision Info -->
                    <div v-if="step.status === 'APPROVED'" class="text-[11px] text-emerald-800 mt-1 space-y-0.5">
                      <div>✓ Disetujui oleh: <strong>{{ step.approverName || 'Legal Authority' }}</strong> ({{ step.approverRole || step.roleRequired }}) • <span class="text-slate-500">{{ step.actionDate }}</span></div>
                      <div v-if="step.notes" class="italic text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded border border-emerald-200/60 mt-1">
                        "{{ step.notes }}"
                      </div>
                    </div>

                    <div v-else-if="step.status === 'REVISION_REQUIRED'" class="text-[11px] text-orange-900 mt-1 space-y-0.5">
                      <div>⚠ Permintaan Revisi dari: <strong>{{ step.approverName || 'Reviewer' }}</strong> • <span class="text-slate-500">{{ step.actionDate }}</span></div>
                      <div class="italic text-orange-800 bg-orange-100/60 px-2 py-1 rounded border border-orange-200 mt-1">
                        "{{ step.notes }}"
                      </div>
                    </div>

                    <div v-else-if="step.status === 'REJECTED'" class="text-[11px] text-rose-900 mt-1 space-y-0.5">
                      <div>✕ Ditolak oleh: <strong>{{ step.approverName || 'Approver' }}</strong> • <span class="text-slate-500">{{ step.actionDate }}</span></div>
                      <div class="italic text-rose-800 bg-rose-100/60 px-2 py-1 rounded border border-rose-200 mt-1">
                        "{{ step.notes }}"
                      </div>
                    </div>

                    <div v-else-if="step.status === 'PENDING'" class="text-[11px] text-amber-800 mt-1 flex items-center gap-1.5 font-semibold">
                      <span>Sedang menunggu persetujuan dari pejabat dengan peran:</span>
                      <span class="font-extrabold text-[#4338CA]">{{ step.roleRequired }}</span>
                      <span class="text-slate-400 font-normal">({{ step.slaDays || 1 }}d SLA)</span>
                    </div>

                    <div v-else class="text-[11px] text-slate-400 mt-0.5">
                      Menunggu penyelesaian tahap sebelumnya
                    </div>
                  </div>
                </div>

                <!-- Status pill -->
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border"
                  :class="getStepPillClass(step)"
                >
                  {{ getStepStatusLabel(step.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rincian Data Tiket -->
        <div class="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
          <div>
            <span class="text-[11px] text-[#475569] block">Pemohon / Unit:</span>
            <span class="font-bold text-[#0F172A]">{{ request.requestor }}</span>
            <span class="text-[#475569]"> ({{ request.department }})</span>
          </div>
          <div>
            <span class="text-[11px] text-[#475569] block">PIC Legal Counsel:</span>
            <span class="font-bold text-[#0F172A]">{{ request.assignedTo || 'Belum Ditugaskan' }}</span>
          </div>
          <div>
            <span class="text-[11px] text-[#475569] block">Tenggat Waktu:</span>
            <span class="font-bold text-[#0F172A]">{{ request.deadline }}</span>
          </div>
          <div>
            <span class="text-[11px] text-[#475569] block">Status Terkini:</span>
            <span :class="getStatusClass(request.status)" class="px-2.5 py-0.5 rounded-full text-xs font-bold inline-block border mt-0.5">
              {{ getStatusLabel(request.status) }}
            </span>
          </div>
        </div>

        <!-- Deskripsi Kebutuhan -->
        <div>
          <span class="font-bold text-[#0F172A] block mb-1">Rincian Deskripsi Permohonan:</span>
          <p class="text-[#0F172A] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl whitespace-pre-line">
            {{ request.description }}
          </p>
        </div>

        <!-- Action Workflow Controls -->
        <div v-if="canApprove || canManage" class="pt-3 border-t border-[#E2E8F0] space-y-2.5">
          <span class="font-bold text-[#0F172A] block">Tindakan Otorisasi & Persetujuan:</span>
          <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              v-if="canApprove"
              @click="$emit('open-approval', request)"
              class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <ShieldCheck class="w-4 h-4" />
              <span>Buka Panel Approval</span>
            </button>

            <button
              v-if="canManage"
              @click="handleStatusUpdate(request.id, 'IN_REVIEW')"
              class="px-3 py-1.5 rounded-xl bg-[#EEF2FF] text-[#4338CA] hover:bg-blue-100 font-bold text-xs cursor-pointer border border-[#C7D2FE] transition whitespace-nowrap"
            >
              Set Ditelaah
            </button>

            <button
              v-if="canManage"
              @click="handleStatusUpdate(request.id, 'COMPLETED')"
              class="px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#166534] hover:bg-emerald-100 font-bold text-xs cursor-pointer border border-[#BBF7D0] transition whitespace-nowrap"
            >
              Set Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ShieldCheck, Check, X, AlertCircle, Clock } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  request: {
    type: Object,
    default: null
  },
  canApprove: {
    type: Boolean,
    default: false
  },
  canManage: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'open-approval', 'update-status']);

const chainSteps = computed(() => {
  if (!props.request) return [];
  if (Array.isArray(props.request.approvalChain) && props.request.approvalChain.length) {
    return props.request.approvalChain;
  }
  // Fallback default 3 steps
  return [
    { level: 1, name: 'Pemeriksaan Awal Dokumen (Maker)', roleRequired: 'STAFF LEGAL', status: props.request.status === 'SUBMITTED' ? 'PENDING' : 'APPROVED' },
    { level: 2, name: 'Verifikasi Kepatuhan & Klausul (Checker)', roleRequired: 'KEPALA LEGAL', status: props.request.status === 'IN_REVIEW' ? 'PENDING' : (props.request.status === 'APPROVED' ? 'APPROVED' : 'WAITING') },
    { level: 3, name: 'Persetujuan Final & Otorisasi (Approver)', roleRequired: 'DIREKTUR (DASHBOARD)', status: props.request.status === 'APPROVED' ? 'APPROVED' : 'WAITING' }
  ];
});

const currentActiveLevel = computed(() => {
  if (!props.request) return 1;
  return props.request.currentApprovalLevel || 1;
});

function getStepBoxClass(step) {
  switch (step.status) {
    case 'APPROVED': return 'bg-emerald-50/70 border-emerald-200';
    case 'PENDING': return 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300';
    case 'REVISION_REQUIRED': return 'bg-orange-50 border-orange-200';
    case 'REJECTED': return 'bg-rose-50 border-rose-200';
    default: return 'bg-white border-slate-200 opacity-60';
  }
}

function getStepBadgeClass(step) {
  switch (step.status) {
    case 'APPROVED': return 'bg-emerald-600 text-white';
    case 'PENDING': return 'bg-amber-500 text-white';
    case 'REVISION_REQUIRED': return 'bg-orange-500 text-white';
    case 'REJECTED': return 'bg-rose-600 text-white';
    default: return 'bg-slate-200 text-slate-600';
  }
}

function getStepPillClass(step) {
  switch (step.status) {
    case 'APPROVED': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';
    case 'REVISION_REQUIRED': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'REJECTED': return 'bg-rose-100 text-rose-800 border-rose-300';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
}

function getStepStatusLabel(st) {
  switch (st) {
    case 'APPROVED': return 'Disetujui';
    case 'PENDING': return 'Menunggu Approval';
    case 'REVISION_REQUIRED': return 'Perlu Revisi';
    case 'REJECTED': return 'Ditolak';
    default: return 'Antrean';
  }
}

function handleStatusUpdate(id, newStatus) {
  legalStore.updateRequestStatus(id, newStatus);
  emit('update-status', id, newStatus);
}

function getStatusClass(status) {
  switch (status) {
    case 'APPROVED': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse';
    case 'REVISION_REQUIRED': return 'bg-orange-50 text-orange-800 border-orange-200';
    case 'REJECTED': return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'SUBMITTED': return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'IN_REVIEW': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'COMPLETED': return 'bg-teal-50 text-teal-800 border-teal-200';
    case 'OVERDUE': return 'bg-rose-50 text-rose-800 border-rose-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'APPROVED': return 'Disetujui';
    case 'PENDING_APPROVAL': return 'Menunggu Approval';
    case 'REVISION_REQUIRED': return 'Perlu Revisi';
    case 'REJECTED': return 'Ditolak';
    case 'SUBMITTED': return 'Baru Diajukan';
    case 'IN_REVIEW': return 'Sedang Ditelaah';
    case 'COMPLETED': return 'Selesai';
    case 'OVERDUE': return 'Overdue SLA';
    default: return status;
  }
}
</script>
