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
      <div class="shrink-0">
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Perkara</span>
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
        <div class="text-sm font-bold text-slate-900 mt-1 truncate">{{ nearestHearing.date }}</div>
        <div class="text-[11px] text-purple-700 font-semibold mt-0.5 truncate">{{ nearestHearing.institution }}</div>
      </div>
    </div>

    <!-- Dispute List Component -->
    <DisputesList
      :disputes="disputes"
      @open-edit="openEditModal"
      @open-timeline="openTimelineModal"
    />

    <!-- MODAL: Timeline & Kronologi Sidang -->
    <DisputeTimelineModal
      v-if="selectedDispute"
      :dispute="selectedDispute"
      @close="selectedDispute = null"
    />

    <!-- MODAL: Tambah / Edit Perkara Sengketa -->
    <DisputeFormModal
      v-if="isFormModalOpen"
      :is-edit="isEditMode"
      :initial-data="currentDisputeData"
      @close="isFormModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../stores/legalStore';
import DisputesList from './Disputes/DisputesList.vue';
import DisputeTimelineModal from './Disputes/DisputeTimelineModal.vue';
import DisputeFormModal from './Disputes/DisputeFormModal.vue';

const isFormModalOpen = ref(false);
const isEditMode = ref(false);
const currentDisputeData = ref({});
const selectedDispute = ref(null);

const disputes = computed(() => legalStore.state.disputes || []);

const highRiskCount = computed(() => {
  return disputes.value.filter(d => (d.riskLevel || 'HIGH') === 'HIGH').length;
});

const totalClaimValue = computed(() => {
  return disputes.value.reduce((acc, d) => acc + (Number(d.disputeValue || d.claimValue) || 0), 0);
});

const nearestHearing = computed(() => {
  const withDate = disputes.value.filter(d => d.nextHearingDate || d.nextHearing);
  if (withDate.length === 0) return { date: '-', institution: 'Tidak ada jadwal' };
  const sorted = [...withDate].sort((a, b) => {
    const da = new Date(a.nextHearingDate || a.nextHearing);
    const db = new Date(b.nextHearingDate || b.nextHearing);
    return da - db;
  });
  const first = sorted[0];
  return {
    date: first.nextHearingDate || first.nextHearing || '-',
    institution: first.courtOrInstitution || 'Pengadilan Negeri / BANI'
  };
});

function openAddModal() {
  isEditMode.value = false;
  currentDisputeData.value = {};
  isFormModalOpen.value = true;
}

function openEditModal(disp) {
  isEditMode.value = true;
  currentDisputeData.value = { ...disp };
  isFormModalOpen.value = true;
}

function openTimelineModal(disp) {
  selectedDispute.value = disp;
}

function formatCompactIDR(amount) {
  if (!amount) return 'Rp 0';
  if (amount >= 1_000_000_000_000) return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} T`;
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`;
  return formatIDR(amount);
}
</script>
