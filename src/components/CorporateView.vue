<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            Tata Kelola Perseroan
          </span>
          <span class="text-xs text-slate-500 font-medium">Buku Daftar Saham & Akta Notaris</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Corporate Governance & Profil Legalitas
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Struktur kepemilikan saham perseroan, susunan pengurus Direksi/Komisaris, serta riwayat legalitas anggaran dasar.
        </p>
      </div>

      <!-- Entity Switcher (Input Group: Prefix Terpisah, Zero Overlap) -->
      <div class="flex items-center rounded-lg border border-[#CBD5E1] bg-white h-[38px] shadow-2xs hover:border-[#94A3B8] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-500/15 transition overflow-hidden shrink-0 w-auto min-w-[260px] sm:min-w-[320px] max-w-[400px]">
        <div class="flex items-center gap-1.5 px-3 bg-[#F8FAFC] border-r border-[#E2E8F0] h-full text-[#64748B] text-xs font-semibold shrink-0 select-none">
          <Building2 class="w-4 h-4 text-[#2563EB]" />
          <span>Perseroan:</span>
        </div>
        <div class="relative flex items-center flex-1 min-w-0 h-full">
          <select
            v-model="selectedEntityId"
            class="w-full h-full bg-transparent text-xs font-bold text-[#0F172A] pl-3 pr-8 outline-none cursor-pointer appearance-none truncate"
            title="Pilih Entitas Perseroan"
          >
            <option v-for="c in corporateList" :key="c.id" :value="c.id">
              {{ c.companyName }}
            </option>
          </select>
          <ChevronDown class="w-4 h-4 text-[#64748B] absolute right-2.5 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Active Entity Summary Card -->
    <div v-if="activeCorp" class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-xs text-indigo-300 font-mono tracking-wider">LEGAL IDENTITY • NIB: {{ activeCorp.nib || '9120003450912' }}</span>
          <h2 class="text-xl sm:text-2xl font-black mt-1">{{ activeCorp.companyName }}</h2>
          <p class="text-xs text-slate-300 mt-1">NPWP: {{ activeCorp.npwp }} • Notaris: {{ incDeed.notary || incDeed.notaryName || 'Aulia Taufani, S.H., M.Kn.' }}</p>
        </div>
        <div class="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
          <div>
            <div class="text-[10px] text-slate-300 uppercase">Modal Ditempatkan</div>
            <div class="text-base font-extrabold text-emerald-400">{{ formatIDR(activeCorp.capital?.issued || activeCorp.paidCapital) }}</div>
          </div>
          <div class="border-l border-white/20 pl-4">
            <div class="text-[10px] text-slate-300 uppercase">Modal Dasar</div>
            <div class="text-base font-extrabold text-slate-200">{{ formatIDR(activeCorp.capital?.authorized || activeCorp.shareCapital) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub-tabs: Profil, Pemegang Saham, Pengurus -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
      <button
        @click="activeSubTab = 'profile'"
        :class="activeSubTab === 'profile' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:bg-slate-100 font-medium'"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer whitespace-nowrap"
      >
        Profil Korporat & Akta
      </button>
      <button
        @click="activeSubTab = 'shareholders'"
        :class="activeSubTab === 'shareholders' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:bg-slate-100 font-medium'"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer whitespace-nowrap"
      >
        Pemegang Saham & Beneficial Ownership ({{ activeCorp?.shareholders?.length || 0 }})
      </button>
      <button
        @click="activeSubTab = 'management'"
        :class="activeSubTab === 'management' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:bg-slate-100 font-medium'"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer whitespace-nowrap"
      >
        Direksi & Dewan Komisaris ({{ (activeCorp?.directors?.length || 0) + (activeCorp?.commissioners?.length || 0) }})
      </button>
    </div>

    <!-- TAB 1: Profil Korporat & Akta -->
    <div v-if="activeSubTab === 'profile' && activeCorp" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Akta Pendirian -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <FileText class="w-4 h-4 text-indigo-600" />
          <span>Akta Pendirian Perseroan</span>
        </h3>

        <div class="space-y-2.5 text-xs text-slate-700">
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">Nomor Akta Pendirian:</span>
            <span class="font-mono font-bold">{{ incDeed.number || incDeed.deedNumber || 'No. 45' }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">Tanggal Akta:</span>
            <span class="font-semibold">{{ incDeed.date || incDeed.deedDate || '2015-03-12' }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">Notaris Pembuat Akta:</span>
            <span class="font-semibold">{{ incDeed.notary || incDeed.notaryName || 'Aulia Taufani, S.H., M.Kn.' }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">SK Pengesahan Kemenkumham:</span>
            <span class="font-mono font-bold text-indigo-700">{{ incDeed.skMenkumham || incDeed.ahuNumber || 'AHU-0012984.AH.01.01.TAHUN 2015' }}</span>
          </div>
        </div>
      </div>

      <!-- Akta Perubahan Terakhir -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <FileCheck2 class="w-4 h-4 text-emerald-600" />
          <span>Akta Perubahan Terakhir (Anggaran Dasar)</span>
        </h3>

        <div class="space-y-2.5 text-xs text-slate-700">
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">Nomor Akta Perubahan:</span>
            <span class="font-mono font-bold">{{ latestDeed.number || latestDeed.deedNumber || 'No. 18' }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">Tanggal Akta Perubahan:</span>
            <span class="font-semibold">{{ latestDeed.date || latestDeed.deedDate || '2024-05-10' }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">Notaris:</span>
            <span class="font-semibold">{{ latestDeed.notary || latestDeed.notaryName || 'Fanny Stephanie, S.H., M.Kn.' }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-400">SK / Penerimaan Pemberitahuan:</span>
            <span class="font-mono font-bold text-emerald-700">{{ latestDeed.skMenkumham || latestDeed.ahuNumber || 'AHU-0044521.AH.01.02.TAHUN 2024' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Pemegang Saham (Shareholders) -->
    <div v-if="activeSubTab === 'shareholders' && activeCorp" class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Daftar Pemegang Saham (Buku Register)</h3>
          <p class="text-xs text-slate-500">Struktur permodalan disetor dan pemilik manfaat akhir (Beneficial Owner)</p>
        </div>
        <button
          @click="exportShareholdersCSV"
          class="self-start sm:self-auto px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer whitespace-nowrap"
        >
          Unduh Daftar Saham
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Nama Pemegang Saham</th>
              <th class="py-3 px-4">Tipe Entitas</th>
              <th class="py-3 px-4 text-right">Jumlah Lembar</th>
              <th class="py-3 px-4 text-right">Persentase (%)</th>
              <th class="py-3 px-4 text-right">Nilai Nominal (IDR)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="sh in (activeCorp.shareholders || [])" :key="sh.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-bold text-slate-900">{{ sh.name }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {{ sh.type }}
                </span>
              </td>
              <td class="py-3 px-4 text-right font-mono">{{ sh.shares?.toLocaleString('id-ID') }}</td>
              <td class="py-3 px-4 text-right font-bold text-indigo-700">{{ sh.percentage }}%</td>
              <td class="py-3 px-4 text-right font-mono font-bold">{{ formatIDR(sh.nominalValue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: Direksi & Dewan Komisaris (Management) -->
    <div v-if="activeSubTab === 'management' && activeCorp" class="space-y-6">
      <!-- Direksi -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 bg-slate-50 border-b border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm">Susunan Direksi (Board of Directors)</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Nama Direktur</th>
                <th class="py-3 px-4">Jabatan</th>
                <th class="py-3 px-4">Kewarganegaraan</th>
                <th class="py-3 px-4">Periode Menjabat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="dir in (activeCorp.directors || [])" :key="dir.id" class="hover:bg-slate-50">
                <td class="py-3 px-4 font-bold text-slate-900">{{ dir.name }}</td>
                <td class="py-3 px-4 font-semibold text-[#4338CA]">{{ dir.title || dir.position }}</td>
                <td class="py-3 px-4 text-slate-600">{{ dir.nationality || 'Indonesia' }}</td>
                <td class="py-3 px-4 text-slate-500">{{ dir.period || (dir.periodStart ? `${dir.periodStart} s/d ${dir.periodEnd}` : '2024 - 2029') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dewan Komisaris -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 bg-slate-50 border-b border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm">Susunan Dewan Komisaris (Board of Commissioners)</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Nama Komisaris</th>
                <th class="py-3 px-4">Jabatan</th>
                <th class="py-3 px-4">Kewarganegaraan</th>
                <th class="py-3 px-4">Periode Menjabat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="com in (activeCorp.commissioners || [])" :key="com.id" class="hover:bg-slate-50">
                <td class="py-3 px-4 font-bold text-slate-900">{{ com.name }}</td>
                <td class="py-3 px-4 font-semibold text-indigo-700">{{ com.title || com.position }}</td>
                <td class="py-3 px-4 text-slate-600">{{ com.nationality || 'Indonesia' }}</td>
                <td class="py-3 px-4 text-slate-500">{{ com.period || (com.periodStart ? `${com.periodStart} s/d ${com.periodEnd}` : '2024 - 2029') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Building2, FileText, FileCheck2, ChevronDown } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../stores/legalStore';

const activeSubTab = ref('profile');
const corporateList = computed(() => legalStore.state.corporate);

const selectedEntityId = ref(corporateList.value[0]?.id || 'CORP-001');

const activeCorp = computed(() => {
  return corporateList.value.find(c => c.id === selectedEntityId.value) || corporateList.value[0];
});

const incDeed = computed(() => {
  if (!activeCorp.value) return {};
  if (activeCorp.value.incorporationDeed) return activeCorp.value.incorporationDeed;
  const pendirian = activeCorp.value.deeds?.find(d => d.deedType?.toLowerCase().includes('pendirian'));
  return pendirian || activeCorp.value.deeds?.[0] || {};
});

const latestDeed = computed(() => {
  if (!activeCorp.value) return {};
  if (activeCorp.value.latestDeed) return activeCorp.value.latestDeed;
  if (activeCorp.value.deeds && activeCorp.value.deeds.length > 1) {
    return activeCorp.value.deeds[activeCorp.value.deeds.length - 1];
  }
  return activeCorp.value.deeds?.[0] || {};
});

function exportShareholdersCSV() {
  if (!activeCorp.value) return;
  let csv = 'Nama Pemegang Saham,Tipe,Lembar Saham,Persentase,Nominal\n';
  activeCorp.value.shareholders.forEach(sh => {
    csv += `"${sh.name}","${sh.type}","${sh.shares}","${sh.percentage}%","${sh.nominalValue}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Buku_Saham_${activeCorp.value.companyName.replace(/\s+/g, '_')}.csv`;
  a.click();
}
</script>
