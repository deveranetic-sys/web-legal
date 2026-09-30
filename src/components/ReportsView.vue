<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
            Laporan Kinerja & Analisis Hukum
          </span>
          <span class="text-xs text-slate-500 font-medium">Laporan Periode Tahunan 2026</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Laporan Eksekutif Manajemen Legal
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Agregasi statistik penanganan perkara, portofolio nilai komitmen kontrak bisnis, serta tingkat kepatuhan regulasi korporasi.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="exportFullReport"
          class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5"
        >
          <Download class="w-4 h-4" />
          <span>Ekspor Laporan Komprehensif (CSV)</span>
        </button>
      </div>
    </div>

    <!-- Executive Metric Highlights -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Tingkat Penyelesaian SLA</span>
        <div class="text-3xl font-black text-emerald-600 mt-1">{{ resolutionRate }}%</div>
        <p class="text-[11px] text-slate-400 mt-1">Rata-rata respons 2.8 hari</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Total Nilai Kontrak Dikelola</span>
        <div class="text-2xl font-black text-slate-900 mt-1 truncate" :title="formatIDR(totalContractValue)">
          {{ formatCompactIDR(totalContractValue) }}
        </div>
        <p class="text-[11px] text-slate-400 mt-1">{{ contracts.length }} Kontrak Aktif</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Rasio Kepatuhan Regulasi</span>
        <div class="text-3xl font-black text-[#4338CA] mt-1">85%</div>
        <p class="text-[11px] text-slate-400 mt-1">Audit Mandatori ESDM & BKPM</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Eksposur Finansial Sengketa</span>
        <div class="text-2xl font-black text-rose-600 mt-1 truncate">
          {{ formatCompactIDR(totalDisputeValue) }}
        </div>
        <p class="text-[11px] text-rose-500 font-semibold mt-1">3 Perkara Berjalan</p>
      </div>
    </div>

    <!-- Analytics Breakdown Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Breakdown Permohonan Legal Menurut Jenis -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 class="font-extrabold text-slate-900 text-sm">Distribusi Jenis Pekerjaan Legal</h3>
        <div class="space-y-3 text-xs">
          <div v-for="(cnt, type) in requestTypeStats" :key="type" class="space-y-1">
            <div class="flex justify-between font-bold text-slate-700">
              <span>{{ type }}</span>
              <span>{{ cnt }} Berkas ({{ Math.round((cnt / requests.length) * 100) }}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                class="bg-blue-600 h-2 rounded-full"
                :style="{ width: `${(cnt / requests.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Breakdown Status Portofolio Kontrak -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 class="font-extrabold text-slate-900 text-sm">Status Portofolio Kontrak Korporasi</h3>
        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <div class="flex justify-between font-bold text-slate-700">
              <span class="text-emerald-700">Kontrak Aktif Operasional</span>
              <span>{{ activeContractsCount }} ({{ Math.round((activeContractsCount / contracts.length) * 100) }}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                class="bg-emerald-500 h-2 rounded-full"
                :style="{ width: `${(activeContractsCount / contracts.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between font-bold text-slate-700">
              <span class="text-amber-700">Masa Siaga & Kritis (&le;30 Hari)</span>
              <span>{{ expiringContractsCount }} ({{ Math.round((expiringContractsCount / contracts.length) * 100) }}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                class="bg-amber-500 h-2 rounded-full"
                :style="{ width: `${(expiringContractsCount / contracts.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between font-bold text-slate-700">
              <span class="text-slate-500">Kedaluwarsa / Selesai</span>
              <span>{{ expiredContractsCount }} ({{ Math.round((expiredContractsCount / contracts.length) * 100) }}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                class="bg-slate-400 h-2 rounded-full"
                :style="{ width: `${(expiredContractsCount / contracts.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Download } from 'lucide-vue-next';
import { legalStore, formatIDR, calculateDaysRemaining } from '../stores/legalStore';

const requests = computed(() => legalStore.state.requests);
const contracts = computed(() => legalStore.state.contracts);
const disputes = computed(() => legalStore.state.disputes);

const completedRequests = computed(() => {
  return requests.value.filter(r => r.status === 'COMPLETED' || r.status === 'CLOSED').length;
});

const resolutionRate = computed(() => {
  if (requests.value.length === 0) return 100;
  return Math.round((completedRequests.value / requests.value.length) * 100);
});

const totalContractValue = computed(() => {
  return contracts.value.reduce((acc, c) => acc + (c.contractValue || 0), 0);
});

const totalDisputeValue = computed(() => {
  return disputes.value.reduce((acc, d) => acc + (d.disputeValue || 0), 0);
});

const activeContractsCount = computed(() => contracts.value.filter(c => c.status === 'ACTIVE').length);

const expiringContractsCount = computed(() => {
  return contracts.value.filter(c => {
    const days = calculateDaysRemaining(c.expiryDate);
    return days <= 30 && c.status !== 'EXPIRED';
  }).length;
});

const expiredContractsCount = computed(() => {
  return contracts.value.filter(c => c.status === 'EXPIRED' || calculateDaysRemaining(c.expiryDate) < 0).length;
});

const requestTypeStats = computed(() => {
  const map = {};
  requests.value.forEach(r => {
    map[r.requestType] = (map[r.requestType] || 0) + 1;
  });
  return map;
});

function formatCompactIDR(amount) {
  if (!amount) return 'Rp 0';
  if (amount >= 1_000_000_000_000) return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} T`;
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`;
  return formatIDR(amount);
}

function exportFullReport() {
  legalStore.exportContractsCSV();
}
</script>
