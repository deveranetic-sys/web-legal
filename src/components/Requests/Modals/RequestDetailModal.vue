<template>
  <div
    v-if="request"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
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
        
        <!-- Stepper Workflow Persetujuan -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Alur Persetujuan Permohonan:
          </span>
          <div class="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
            <div class="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
              1. Pengajuan ✓
            </div>
            <div
              :class="request.status !== 'SUBMITTED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-300'"
              class="p-2 rounded-lg border"
            >
              2. Telaah Legal
            </div>
            <div
              :class="request.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : (request.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border-rose-300' : (request.status === 'REVISION_REQUIRED' ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-slate-100 text-slate-500 border-slate-200'))"
              class="p-2 rounded-lg border"
            >
              3. Otorisasi Approval
            </div>
            <div
              :class="request.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'"
              class="p-2 rounded-lg border"
            >
              4. Selesai
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

        <!-- Riwayat Approval Notes (Jika Ada) -->
        <div v-if="request.approvalNotes || request.rejectionReason || request.revisionNotes" class="space-y-2">
          <span class="font-bold text-[#0F172A] block">Catatan Keputusan Persetujuan:</span>
          
          <div v-if="request.status === 'APPROVED'" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <div class="flex items-center justify-between font-bold text-xs">
              <span>✓ Disetujui oleh: {{ request.approvedBy || 'Head of Legal' }}</span>
              <span class="text-[11px] text-emerald-700 font-normal">{{ request.approvedAt }}</span>
            </div>
            <p class="text-xs text-emerald-800 italic">"{{ request.approvalNotes || 'Permohonan disetujui tanpa syarat tambahan.' }}"</p>
          </div>

          <div v-if="request.status === 'REJECTED'" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
            <div class="flex items-center justify-between font-bold text-xs">
              <span>✕ Ditolak oleh: {{ request.rejectedBy || 'Head of Legal' }}</span>
              <span class="text-[11px] text-rose-700 font-normal">{{ request.rejectedAt }}</span>
            </div>
            <p class="text-xs text-rose-800 italic">"{{ request.rejectionReason }}"</p>
          </div>

          <div v-if="request.status === 'REVISION_REQUIRED'" class="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 space-y-1">
            <div class="flex items-center justify-between font-bold text-xs">
              <span>⚠ Catatan Revisi dari: {{ request.revisionRequestedBy || 'Legal Counsel' }}</span>
              <span class="text-[11px] text-orange-700 font-normal">{{ request.revisionRequestedAt }}</span>
            </div>
            <p class="text-xs text-orange-800 italic">"{{ request.revisionNotes }}"</p>
          </div>
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
              <span>Buka Approval</span>
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
import { ShieldCheck } from 'lucide-vue-next';
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
