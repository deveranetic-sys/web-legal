<template>
  <div class="p-6 space-y-6 animate-in fade-in duration-150">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
      <div>
        <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <ShieldCheck class="w-5 h-5 text-[#6366F1]" />
          <span>4-Gate Review Matrix & Penguncian Paket Submission</span>
        </h3>
        <p class="text-xs text-[#475569] mt-0.5">
          Persetujuan berjenjang wajib lolos Gate 1 s/d 4 sebelum dokumen penawaran dikunci dengan SHA-256 hash.
        </p>
      </div>

      <!-- Freeze Action Button -->
      <div>
        <button
          v-if="!tender.locked"
          @click="handleLockPackage"
          class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
        >
          <Lock class="w-4 h-4" />
          <span>Kunci Paket Penawaran (Freeze Submission)</span>
        </button>

        <div v-else class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] text-xs font-bold">
            <Lock class="w-4 h-4" />
            <span>Paket Terkunci (Hash Integritas Aktif)</span>
          </span>
          <button
            @click="$emit('open-unlock-modal')"
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Buka Kunci
          </button>
        </div>
      </div>
    </div>

    <!-- Hash Integrity Banner if locked -->
    <div
      v-if="tender.locked"
      class="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-[#059669]" />
          <strong class="font-bold">Paket Submission Terkunci & Bersertifikasi Integritas</strong>
        </div>
        <div class="font-mono text-[11px] text-[#047857] truncate max-w-xl">
          {{ tender.hash || 'SHA256:7f8b9a1c4d2e5f30e6a12b89c7d41f0a2e5d9c8b7a6f5e4d3c2b1a0f9e8d7c6b' }}
        </div>
      </div>

      <div class="text-[11px] text-[#047857] shrink-0 font-medium">
        Waktu Kunci: <strong>{{ tender.submittedAt || '2026-03-30 14:00' }}</strong>
      </div>
    </div>

    <!-- 4-Gate Matrix Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(gate, gIdx) in (tender.gates || defaultGates)"
        :key="gate.id"
        class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-3 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase text-[#475569]">
              Tahap {{ gIdx + 1 }} dari 4
            </span>
            <span
              :class="getGateStatusBadgeClass(gate.status)"
              class="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
            >
              {{ gate.status }}
            </span>
          </div>

          <h4 class="text-xs font-extrabold text-[#0F172A] mt-1.5 leading-snug">
            {{ gate.name }}
          </h4>

          <div class="text-[11px] text-[#475569] mt-1">
            Reviewer: <strong class="text-[#0F172A]">{{ gate.reviewer }}</strong>
          </div>

          <div v-if="gate.note" class="text-[11px] text-[#475569] mt-2 p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            "{{ gate.note }}"
          </div>

          <div v-if="gate.date" class="text-[10px] text-slate-400 mt-2">
            Disetujui: {{ gate.date }} ({{ gate.approvedBy || gate.reviewer }})
          </div>
        </div>

        <!-- Gate Actions -->
        <div v-if="!tender.locked" class="pt-2 border-t border-[#E2E8F0] flex items-center gap-2">
          <button
            v-if="gate.status !== 'SELESAI'"
            @click="handleApproveGate(gate.id)"
            class="flex-1 py-1.5 px-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[11px] font-bold rounded-lg transition cursor-pointer text-center"
          >
            Setujui Gate
          </button>
          <button
            v-if="gate.status !== 'SELESAI'"
            @click="handleRejectGate(gate.id)"
            class="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-[11px] font-medium rounded-lg transition cursor-pointer"
          >
            Revisi
          </button>
          <span v-else class="text-[11px] text-[#166534] font-bold flex items-center gap-1">
            <Check class="w-3.5 h-3.5 text-[#166534]" /> Lolos Gate
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShieldCheck, Lock, Check } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  tender: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-unlock-modal']);

const defaultGates = [
  { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2026-02-14', note: 'Kesesuaian spesifikasi & kapasitas peralatan lengkap' },
  { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'MENUNGGU', date: null, note: 'Validasi cash flow & skema termin' },
  { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'BERIKUTNYA', date: null, note: 'Pengecekan draft kontrak & mitigasi penalti' },
  { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Utama', status: 'BERIKUTNYA', date: null, note: 'Persetujuan akhir sebelum submission' }
];

function getGateStatusBadgeClass(status) {
  switch (status) {
    case 'SELESAI': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'MENUNGGU': return 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
    case 'REVISI': return 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]';
    default: return 'bg-slate-100 text-slate-600';
  }
}

function handleLockPackage() {
  if (!props.tender) return;
  legalStore.lockTenderPackage(props.tender.id);
  legalStore.triggerToast('Paket penawaran berhasil dikunci!', 'success');
}

function handleApproveGate(gateId) {
  if (!props.tender) return;
  legalStore.approveTenderGate(props.tender.id, gateId, 'Disetujui setelah verifikasi kriteria.');
}

function handleRejectGate(gateId) {
  if (!props.tender) return;
  const reason = window.prompt('Masukkan catatan revisi untuk gate ini:');
  if (reason) {
    legalStore.rejectTenderGate(props.tender.id, gateId, reason);
  }
}
</script>
