<template>
  <div class="space-y-6">
    <!-- Info banner -->
    <div class="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 text-[#4338CA] flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-900">Koneksi ERP & Layanan Pihak Ketiga</h3>
          <p class="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
            Legal Management System bertindak sebagai hub terpusat. Data organisasi (HRIS) dan persetujuan komersial tersinkronisasi otomatis dengan ERP perusahaan (SAP / Workday).
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="erp in (legalStore.state.masterErpIntegrations || [])"
        :key="erp.code"
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0">
              {{ erp.icon }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900">{{ erp.name }}</h4>
              <div class="text-[10px] text-slate-500 font-mono mt-0.5">{{ erp.endpoint }}</div>
            </div>
          </div>
          <span
            :class="erp.status === 'CONNECTED' ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' : 'bg-red-100 text-red-800 border-red-200'"
            class="px-2 py-0.5 rounded-full text-[9px] font-extrabold border"
          >
            {{ erp.status === 'CONNECTED' ? 'TERHUBUNG' : 'GANGGUAN' }}
          </span>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed min-h-[40px]">
          {{ erp.description }}
        </p>

        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-[10px] text-slate-400 font-medium">
            Sinkronisasi terakhir: <span class="text-slate-600">{{ erp.lastSync }}</span>
          </div>
          <button
            @click="legalStore.testErpConnection(erp.code)"
            class="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#4338CA] hover:text-[#4338CA] text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer text-center"
          >
            Uji Koneksi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { legalStore } from '../../../stores/legalStore';
</script>
