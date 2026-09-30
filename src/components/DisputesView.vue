<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            Litigasi, Arbitrase & Sengketa
          </span>
          <span class="text-xs text-slate-500 font-medium">BANI & Pengadilan Negeri</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Manajemen Sengketa & Perkara (Dispute & Litigation)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Pengawasan perkara aktif di BANI Arbitration Center, peradilan perdata/PHI, mitigasi eksposur klaim finansial, dan jadwal persidangan.
        </p>
      </div>

      <!-- Action Button -->
      <div>
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Daftarkan Perkara Baru</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Perkara Aktif</span>
        <div class="text-2xl font-black text-slate-900 mt-1">{{ disputes.length }}</div>
        <div class="text-[11px] text-purple-600 font-semibold mt-0.5">Sedang Berjalan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-rose-600 font-semibold">Risiko Tinggi (High Risk)</span>
        <div class="text-2xl font-black text-rose-600 mt-1">{{ highRiskCount }}</div>
        <div class="text-[11px] text-rose-600 mt-0.5">Eksposur Finansial Signifikan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Total Nilai Tuntutan / Klaim</span>
        <div class="text-lg font-black text-slate-900 mt-1 truncate" :title="formatIDR(totalClaimValue)">
          {{ formatCompactIDR(totalClaimValue) }}
        </div>
        <div class="text-[11px] text-slate-400 mt-0.5">Estimasi Total Kerugian</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Sidang Terdekat</span>
        <div class="text-sm font-bold text-slate-900 mt-1 truncate">29 Sep 2026</div>
        <div class="text-[11px] text-purple-700 font-semibold mt-0.5">BANI Arbitration Jakarta</div>
      </div>
    </div>

    <!-- Dispute List -->
    <div class="space-y-4">
      <div
        v-for="disp in disputes"
        :key="disp.id"
        class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {{ disp.caseNumber }}
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                {{ disp.caseType }} • {{ disp.courtOrInstitution }}
              </span>
              <span
                :class="disp.riskLevel === 'HIGH' ? 'bg-[#FFE4E6] text-[#9F1239]' : 'bg-[#FEF3C7] text-[#92400E]'"
                class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
              >
                Risiko: {{ disp.riskLevel }}
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 mt-2">
              {{ disp.company }} vs. {{ disp.opponent }}
            </h3>
          </div>

          <div class="text-right sm:border-l sm:border-slate-100 sm:pl-4">
            <span class="text-xs text-slate-400 block">Nilai Klaim Sengketa:</span>
            <span class="text-base font-black text-slate-900 font-mono">{{ formatIDR(disp.disputeValue) }}</span>
          </div>
        </div>

        <!-- Summary & Next Hearing -->
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          {{ disp.summary }}
        </p>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
          <div class="flex items-center gap-4 text-slate-600">
            <div><span class="text-slate-400">Kuasa Hukum Eksternal:</span> <span class="font-bold">{{ disp.legalCounsel }}</span></div>
            <div><span class="text-slate-400">Sidang Berikutnya:</span> <span class="font-bold text-purple-700">{{ disp.nextHearingDate }}</span></div>
          </div>

          <button
            @click="selectedDispute = disp"
            class="px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
          >
            Lihat Kronologi & Tahapan Sidang ({{ disp.timeline?.length || 0 }})
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Timeline & Kronologi Sidang -->
    <div
      v-if="selectedDispute"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="selectedDispute = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <span class="font-mono text-xs font-bold text-purple-700">{{ selectedDispute.caseNumber }}</span>
            <h3 class="font-extrabold text-slate-900 text-base mt-0.5">Kronologi Tahapan Perkara</h3>
          </div>
          <button @click="selectedDispute = null" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 text-xs">
          <div
            v-for="(step, idx) in selectedDispute.timeline"
            :key="idx"
            class="flex items-start gap-3 relative pl-2 pb-4 border-l-2 border-purple-200 last:border-0"
          >
            <div class="w-3 h-3 rounded-full bg-purple-600 -translate-x-[7px] mt-1 shrink-0"></div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-xs sm:text-sm">{{ step.title }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ step.date }}</span>
              </div>
              <p class="text-slate-600 mt-1 leading-relaxed">{{ step.description }}</p>
            </div>
          </div>

          <div v-if="!selectedDispute.timeline || selectedDispute.timeline.length === 0" class="text-slate-400 text-center py-6">
            Belum ada kronologi persidangan yang ditambahkan.
          </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button @click="selectedDispute = null" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-xs cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../stores/legalStore';

const isAddModalOpen = ref(false);
const selectedDispute = ref(null);

const disputes = computed(() => legalStore.state.disputes);

const highRiskCount = computed(() => {
  return disputes.value.filter(d => d.riskLevel === 'HIGH').length;
});

const totalClaimValue = computed(() => {
  return disputes.value.reduce((acc, d) => acc + (d.disputeValue || 0), 0);
});

function formatCompactIDR(amount) {
  if (!amount) return 'Rp 0';
  if (amount >= 1_000_000_000_000) return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} T`;
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`;
  return formatIDR(amount);
}
</script>
