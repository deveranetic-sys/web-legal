<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="p-5 sm:p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex items-start justify-between gap-4">
        <div class="space-y-1.5 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/15 text-indigo-200 border border-white/20">
              {{ contractType.code }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Sektor {{ contractType.sector }}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              ID: {{ contractType.id }}
            </span>
          </div>
          <h3 class="text-base sm:text-lg font-extrabold text-white leading-snug">
            {{ contractType.name }}
          </h3>
          <p class="text-xs text-slate-300">
            Standar Acuan: <strong>{{ contractType.standardFormat || 'Standar Korporasi Internal' }}</strong>
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 space-y-5 overflow-y-auto text-xs">
        <!-- Scope & Description -->
        <div class="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2">
          <div class="flex items-center gap-2 text-[#4338CA] font-bold">
            <FileText class="w-4 h-4" />
            <span>Ruang Lingkup & Deskripsi Kontrak</span>
          </div>
          <p class="text-[#334155] leading-relaxed">
            {{ contractType.description || 'Kontrak standar pelaksanaan pengadaan barang dan jasa korporasi.' }}
          </p>
        </div>

        <!-- Financial & Payment Preset Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-2">
            <div class="flex items-center gap-1.5 text-indigo-900 font-bold">
              <CreditCard class="w-4 h-4 text-[#4338CA]" />
              <span>Skema Termin Pembayaran Bawaan</span>
            </div>
            <div class="text-[11px] font-semibold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-100 inline-block">
              {{ contractType.paymentType || 'Milestone Berita Acara' }}
            </div>
            <p class="text-[11px] text-[#334155] leading-normal pt-1">
              {{ contractType.defaultPaymentTerms || 'Sesuai tahapan Berita Acara Serah Terima (BAST).' }}
            </p>
          </div>

          <div class="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-2">
            <div class="flex items-center gap-1.5 text-amber-900 font-bold">
              <ShieldAlert class="w-4 h-4 text-amber-600" />
              <span>Retensi & Masa Pemeliharaan</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-black text-amber-800">
                {{ contractType.retentionPercent || 0 }}%
              </span>
              <span class="text-xs text-amber-700 font-semibold">
                dari nilai total kontrak
              </span>
            </div>
            <p class="text-[11px] text-[#475569] leading-normal">
              Masa Pemeliharaan: <strong>{{ contractType.retentionPeriodDays || 0 }} Hari</strong> kalender sejak BAST-1 hingga BAST Akhir (FHO).
            </p>
          </div>
        </div>

        <!-- Legal Clauses & Dispute Forum -->
        <div class="bg-white p-4 rounded-2xl border border-[#E2E8F0] space-y-3.5 shadow-2xs">
          <div class="flex items-center gap-2 text-[#0F172A] font-bold">
            <Scale class="w-4 h-4 text-[#4338CA]" />
            <span>Klausul Hukum & Penyelesaian Sengketa</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="space-y-1 bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
              <span class="text-[11px] font-bold text-[#64748B] block">Forum Arbitrase / Pengadilan:</span>
              <span class="font-bold text-[#0F172A] flex items-center gap-1.5">
                <Gavel class="w-3.5 h-3.5 text-indigo-600" />
                {{ contractType.disputeForum || 'BANI (Badan Arbitrase Nasional Indonesia)' }}
              </span>
            </div>

            <div class="space-y-1 bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
              <span class="text-[11px] font-bold text-[#64748B] block">Hukum yang Mengatur (Governing Law):</span>
              <span class="font-bold text-[#0F172A]">
                {{ contractType.governingLaw || 'Hukum Republik Indonesia' }}
              </span>
            </div>
          </div>

          <div class="space-y-1 bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs">
            <span class="text-[11px] font-bold text-rose-800 block">Klausul Denda Keterlambatan (Default Penalty):</span>
            <p class="text-rose-950 font-medium leading-relaxed">
              {{ contractType.penaltyClause || '1‰ per hari keterlambatan (maksimum 5% dari nilai kontrak).' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
        <button
          type="button"
          @click="$emit('edit', contractType)"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Pencil class="w-3.5 h-3.5" />
          <span>Edit Konfigurasi Tipe Kontrak</span>
        </button>

        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-white hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  X,
  FileText,
  CreditCard,
  ShieldAlert,
  Scale,
  Gavel,
  Pencil
} from 'lucide-vue-next';

defineProps({
  contractType: {
    type: Object,
    required: true
  }
});

defineEmits(['close', 'edit']);
</script>
