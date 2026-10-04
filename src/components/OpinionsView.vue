<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
            Kajian Yuridis Formal
          </span>
          <span class="text-xs text-slate-500 font-medium">Dokumen Opini Resmi Korporasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Legal Opinion (Pendapat Hukum)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Kajian yuridis tertulis atas isu hukum krusial perseroan, analisis kepatuhan peraturan perundang-undangan, dan rekomendasi mitigasi risiko.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0 flex-nowrap">
        <button
          @click="printOpinion"
          class="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <Printer class="w-4 h-4 text-slate-500" />
          <span>Cetak Opini</span>
        </button>
      </div>
    </div>

    <!-- Main 2-Column Layout: Left List, Right Active Document Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: List of Legal Opinions -->
      <div class="lg:col-span-4 space-y-3">
        <div
          v-for="op in opinions"
          :key="op.id"
          @click="selectedOpinion = op"
          :class="selectedOpinion?.id === op.id ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'"
          class="p-4 rounded-2xl border transition cursor-pointer space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-[10px] font-bold text-slate-500">{{ op.id }}</span>
            <span
              :class="getApprovalBadge(op.approval)"
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
            >
              {{ op.approval }}
            </span>
          </div>

          <h4 class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">{{ op.issue }}</h4>
          <p class="text-[11px] text-slate-500">Pemohon: {{ op.requestor }} • {{ op.date }}</p>
        </div>
      </div>

      <!-- Right Column: Formal Legal Opinion Document View -->
      <div v-if="selectedOpinion" class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <!-- Letterhead Simulation -->
        <div class="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div class="text-xs font-mono font-bold text-slate-500 tracking-wider">MEMORANDUM PENDAPAT HUKUM (LEGAL OPINION)</div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">{{ selectedOpinion.issue }}</h2>
            <div class="text-xs text-slate-500 mt-1">Ref: {{ selectedOpinion.id }} • Tanggal: {{ selectedOpinion.date }}</div>
          </div>
          <div class="text-right">
            <span :class="getApprovalBadge(selectedOpinion.approval)" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
              {{ selectedOpinion.approval }}
            </span>
          </div>
        </div>

        <!-- Section I: Pokok Permasalahan -->
        <div>
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">I. Pokok Permasalahan Yuridis</h4>
          <p class="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {{ selectedOpinion.question || selectedOpinion.background }}
          </p>
        </div>

        <!-- Section II: Analisis Hukum -->
        <div>
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">II. Analisis & Dasar Hukum Positif</h4>
          <div class="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
            {{ selectedOpinion.legalAnalysis }}
          </div>
        </div>

        <!-- Section III: Kesimpulan & Rekomendasi -->
        <div class="p-4 rounded-xl bg-emerald-50/70 border border-[#BBF7D0] space-y-2">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-900">III. Kesimpulan Hukum & Rekomendasi Mitigasi</h4>
          <div class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {{ selectedOpinion.conclusion }}
          </div>
          <p class="text-xs text-emerald-800 mt-2 italic font-semibold">
            Rekomendasi: {{ selectedOpinion.recommendation }}
          </p>
        </div>

        <!-- Approval Action Bar for Legal Manager / General Counsel -->
        <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div class="text-xs text-slate-500">
            Penyusun: <span class="font-bold text-slate-700">{{ selectedOpinion.author }}</span> • Reviewer: <span class="font-bold text-slate-700">{{ selectedOpinion.reviewer }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="selectedOpinion.approval !== 'APPROVED'"
              @click="approveOpinion"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Setujui Opini (Approve)
            </button>
            <span v-else class="text-xs text-emerald-700 font-bold flex items-center gap-1">
              ✓ Telah Disahkan oleh Head of Legal
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Printer } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const opinions = computed(() => legalStore.state.opinions);
const selectedOpinion = ref(opinions.value[0] || null);

function getApprovalBadge(status) {
  switch (status) {
    case 'APPROVED': return 'bg-[#DCFCE7] text-[#166534]';
    case 'PENDING_APPROVAL': return 'bg-[#FEF3C7] text-[#92400E] animate-pulse';
    case 'REVISION': return 'bg-[#FFE4E6] text-[#9F1239]';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function approveOpinion() {
  if (selectedOpinion.value) {
    legalStore.updateOpinionApproval(selectedOpinion.value.id, 'APPROVED');
    selectedOpinion.value.approval = 'APPROVED';
  }
}

function printOpinion() {
  window.print();
}
</script>
