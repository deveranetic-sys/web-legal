<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="doc in docs"
      :key="doc.id"
      class="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#C7D2FE]/70 transition-all flex flex-col justify-between space-y-4"
    >
      <!-- Top Info Strip -->
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2.5 py-0.5 rounded border border-[#C7D2FE]">
              {{ doc.code }}
            </span>
            <span class="text-xs text-[#475569] font-medium bg-slate-100 px-2 py-0.5 rounded">
              {{ doc.category }}
            </span>
          </div>

          <!-- Expiry Status Badge -->
          <span
            :class="getStatusBadgeClass(doc)"
            class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border"
          >
            {{ getStatusLabel(doc) }}
          </span>
        </div>

        <h3 class="text-base font-bold text-[#0F172A]">
          {{ doc.name }}
        </h3>

        <div class="text-xs text-[#475569] space-y-1 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          <div class="flex justify-between">
            <span>Nomor Registrasi / SK:</span>
            <strong class="text-[#0F172A] font-mono">{{ doc.number }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Instansi / Lembaga Penerbit:</span>
            <span class="text-[#0F172A] font-medium">{{ doc.issuer }}</span>
          </div>
          <div class="flex justify-between">
            <span>Tanggal Terbit:</span>
            <span class="text-[#0F172A]">{{ doc.issueDate || '-' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Masa Berlaku:</span>
            <span v-if="!doc.expiryDate" class="text-emerald-700 font-semibold">
              Berlaku Selamanya
            </span>
            <span v-else :class="calculateDaysRemaining(doc.expiryDate) <= 60 ? 'text-amber-700 font-bold' : 'text-[#0F172A]'">
              {{ doc.expiryDate }} (Sisa {{ calculateDaysRemaining(doc.expiryDate) }} Hari)
            </span>
          </div>
        </div>

        <!-- Notes -->
        <p v-if="doc.notes" class="text-xs text-[#475569] italic">
          "{{ doc.notes }}"
        </p>

        <!-- Tenders Used Tag Strip -->
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
            Digunakan Pada Paket Lelang ({{ (doc.tendersUsed || []).length }}):
          </span>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tId in doc.tendersUsed"
              :key="tId"
              @click="goToTender(tId)"
              class="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#0F172A] hover:bg-blue-50 text-[#4338CA] hover:text-[#0F172A] border border-slate-200 transition cursor-pointer"
              title="Buka tender ini"
            >
              <span>{{ tId }}</span>
              <ExternalLink class="w-2.5 h-2.5 text-[#475569]" />
            </span>
            <span v-if="!doc.tendersUsed || doc.tendersUsed.length === 0" class="text-xs text-slate-400 italic">
              Belum ditautkan ke paket aktif
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-2">
          <button
            @click="previewDoc(doc)"
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] transition cursor-pointer"
            title="Lihat berkas terlampir"
          >
            <FileText class="w-3.5 h-3.5 text-[#475569]" />
            <span>{{ doc.fileSize }}</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('open-link', doc)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] transition shadow-xs cursor-pointer"
          >
            <Link2 class="w-3.5 h-3.5" />
            <span>Tautkan ke Paket Lelang</span>
          </button>
          <button
            @click="confirmDelete(doc)"
            class="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer rounded-lg hover:bg-rose-50"
            title="Hapus dari bank dokumen"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileText, Link2, Trash2, ExternalLink } from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../../stores/legalStore';

const props = defineProps({
  docs: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['open-link']);

function getStatusBadgeClass(doc) {
  if (!doc.expiryDate) return 'bg-[#DCFCE7] text-[#166534] border-emerald-300';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'bg-[#FFE4E6] text-[#9F1239] border-rose-300';
  if (days <= 60) return 'bg-[#FEF3C7] text-[#92400E] border-amber-300';
  return 'bg-[#DCFCE7] text-[#166534] border-emerald-300';
}

function getStatusLabel(doc) {
  if (!doc.expiryDate) return 'Valid (Selamanya)';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'Kedaluwarsa';
  if (days <= 60) return 'Segera Kedaluwarsa';
  return 'Valid';
}

function goToTender(tenderId) {
  legalStore.setTenderTab('pipeline');
}

function previewDoc(doc) {
  legalStore.triggerToast(`Membuka berkas: ${doc.fileRef || doc.name}`, 'info');
}

async function confirmDelete(doc) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Dokumen Master Kualifikasi?',
    message: `Hapus dokumen "${doc.name}" (${doc.code}) dari Bank Dokumen Kualifikasi?`,
    confirmText: 'Ya, Hapus Dokumen',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteTenderVaultDoc(doc.id);
  }
}
</script>
