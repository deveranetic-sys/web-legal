<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Administrasi Korespondensi Hukum
          </span>
          <span class="text-xs text-slate-500 font-medium">Buku Register Surat Masuk & Keluar</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Surat Menyurat & Korespondensi Legal
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Pencatatan resmi somasi hukum, surat kuasa khusus, tanggapan peringatan wanprestasi, dan nota dinas legal korporasi.
        </p>
      </div>

      <div>
        <button
          @click="openAddDemo"
          class="px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white focus:ring-3 focus:ring-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center gap-1.5"
        >
          <Send class="w-4 h-4" />
          <span>Buat Surat Legal Baru</span>
        </button>
      </div>
    </div>

    <!-- Table of Correspondence -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th class="py-3 px-4">Nomor Surat</th>
              <th class="py-3 px-4">Jenis Surat</th>
              <th class="py-3 px-4">Perihal / Pokok Surat</th>
              <th class="py-3 px-4">Pengirim & Tujuan</th>
              <th class="py-3 px-4">Tanggal</th>
              <th class="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in correspondence" :key="item.id" class="hover:bg-slate-50">
              <td class="py-3.5 px-4 font-mono text-xs font-bold text-[#4338CA] whitespace-nowrap">
                {{ item.letterNumber }}
              </td>
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  :class="item.type === 'Somasi / Peringatan Hukum' ? 'bg-[#FFE4E6] text-[#9F1239]' : 'bg-slate-100 text-slate-700'"
                  class="px-2 py-0.5 rounded text-[11px] font-bold"
                >
                  {{ item.type }}
                </span>
              </td>
              <td class="py-3.5 px-4 min-w-[220px]">
                <div class="font-bold text-slate-900">{{ item.subject }}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">{{ item.summary }}</div>
              </td>
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="text-xs font-semibold text-slate-800">Dari: {{ item.sender }}</div>
                <div class="text-[11px] text-slate-500">Kepada: {{ item.recipient }}</div>
              </td>
              <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">{{ item.date }}</td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <span
                  :class="item.status === 'SENT' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-blue-100 text-blue-800'"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Send } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const correspondence = computed(() => legalStore.state.correspondence);

function openAddDemo() {
  legalStore.triggerToast('Formulir Pembuatan Surat Legal Baru siap digunakan.', 'info');
}
</script>
