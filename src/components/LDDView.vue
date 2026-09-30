<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
            Uji Tuntas Hukum & Transaksi Korporasi
          </span>
          <span class="text-xs text-slate-500 font-medium">M&A, Ekuitas & Proyek Investasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Legal Due Diligence (LDD Workspace)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Pemeriksaan komprehensif kepatuhan aspek korporasi, perizinan, aset, kontrak material, sengketa, dan ketenagakerjaan target.
        </p>
      </div>

      <!-- Project Switcher -->
      <div class="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs">
        <span class="text-xs text-slate-500 font-medium">Pilih Proyek LDD:</span>
        <select
          v-model="selectedProjectId"
          class="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
        >
          <option v-for="item in lddList" :key="item.id" :value="item.id">
            {{ item.projectName }}
          </option>
        </select>
      </div>
    </div>

    <!-- Active LDD Project Details -->
    <div v-if="activeLDD" class="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-md space-y-3">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span class="text-xs text-emerald-400 font-mono tracking-wider">PROJECT CODE: {{ activeLDD.id }}</span>
          <h2 class="text-xl sm:text-2xl font-black mt-1">{{ activeLDD.projectName }}</h2>
          <p class="text-xs text-slate-300 mt-0.5">Target Perusahaan: <span class="font-bold text-white">{{ activeLDD.targetCompany }}</span> • Lead Counsel: {{ activeLDD.leadCounsel }}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-white/10 px-3 py-2 rounded-xl text-center border border-white/10">
            <span class="text-[10px] text-slate-300 uppercase block">Temuan Red Flag</span>
            <span class="text-lg font-black text-rose-400">{{ redFlagCount }} Isu Kritis</span>
          </div>
          <div class="bg-white/10 px-3 py-2 rounded-xl text-center border border-white/10">
            <span class="text-[10px] text-slate-300 uppercase block">Checklist Clear</span>
            <span class="text-lg font-black text-emerald-400">{{ clearCount }} Aspek OK</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Checklist -->
    <div v-if="activeLDD" class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Checklist Uji Tuntas Aspek Legalitas</h3>
          <p class="text-xs text-slate-500">Klik tombol status untuk mengubah verifikasi (OK / FLAG / N/A)</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Kategori Aspek</th>
              <th class="py-3 px-4">Uraian Pemeriksaan Dokumen</th>
              <th class="py-3 px-4">Catatan Telaah & Risiko</th>
              <th class="py-3 px-4 text-center">Status Verifikasi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in activeLDD.checklist" :key="item.id" class="hover:bg-slate-50">
              <td class="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">{{ item.category }}</td>
              <td class="py-3.5 px-4 min-w-[200px] text-slate-700">{{ item.item }}</td>
              <td class="py-3.5 px-4 text-xs text-slate-600 min-w-[220px]">
                <span :class="item.status === 'FLAG' ? 'text-rose-700 font-semibold' : ''">
                  {{ item.notes || '-' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <button
                  @click="toggleStatus(item)"
                  :class="getBadgeClass(item.status)"
                  class="px-3 py-1 rounded-full text-xs font-black transition cursor-pointer hover:opacity-80"
                >
                  {{ item.status }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { legalStore } from '../stores/legalStore';

const lddList = computed(() => legalStore.state.ldd);
const selectedProjectId = ref(lddList.value[0]?.id || 'LDD-2026-001');

const activeLDD = computed(() => {
  return lddList.value.find(p => p.id === selectedProjectId.value) || lddList.value[0];
});

const redFlagCount = computed(() => {
  if (!activeLDD.value || !activeLDD.value.checklist) return 0;
  return activeLDD.value.checklist.filter(c => c.status === 'FLAG').length;
});

const clearCount = computed(() => {
  if (!activeLDD.value || !activeLDD.value.checklist) return 0;
  return activeLDD.value.checklist.filter(c => c.status === 'OK').length;
});

function getBadgeClass(status) {
  switch (status) {
    case 'OK': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'FLAG': return 'bg-[#FFE4E6] text-[#9F1239] border border-rose-300 animate-pulse';
    case 'NA': return 'bg-slate-100 text-slate-600 border border-slate-200';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function toggleStatus(item) {
  const next = item.status === 'OK' ? 'FLAG' : item.status === 'FLAG' ? 'NA' : 'OK';
  item.status = next;
  legalStore.triggerToast(`Verifikasi ${item.category} diset ke ${next}`, 'info');
}
</script>
