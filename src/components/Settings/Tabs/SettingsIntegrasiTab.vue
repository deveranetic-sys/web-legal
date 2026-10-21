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
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-slate-900">Koneksi ERP & Service Boundary Adapter</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-[#4338CA]">
              REST / gRPC Bridge
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
            Legal Management System bertindak sebagai sub-sistem independen (*era-legal-service*). Mengonsumsi data master karyawan (HRIS), memvalidasi status PO Contract Gate (Procurement PRC-07), dan berbagi penomoran surat resmi dengan e-Office (EOF-01/02).
          </p>
        </div>
      </div>

      <button
        @click="runIntegrityTest"
        :disabled="isRunningAudit"
        class="px-4 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start md:self-center disabled:opacity-50"
      >
        <svg v-if="isRunningAudit" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <ShieldCheck v-else class="w-4 h-4 stroke-[2.5]" />
        <span>{{ isRunningAudit ? 'Mengaudit Data...' : 'Audit Integritas Data' }}</span>
      </button>
    </div>

    <!-- Data Integrity Diagnostic Card (If Run) -->
    <div v-if="auditResults" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">Hasil Audit Relasi &amp; Service Boundary</h4>
            <p class="text-[11px] text-slate-500">Pemeriksaan integritas referensi data pengguna, entitas, kontrak, dan approval chain.</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ✓ {{ auditResults.passedChecks }} / {{ auditResults.totalChecks }} Pengujian Lolos
          </span>
          <span v-if="auditResults.failedChecks > 0" class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            ✕ {{ auditResults.failedChecks }} Perlu Perhatian
          </span>
        </div>
      </div>

      <!-- Test checklist grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div
          v-for="(item, idx) in auditResults.details"
          :key="idx"
          class="p-3 rounded-xl border flex items-start gap-2.5 transition"
          :class="item.status === 'PASSED' ? 'bg-slate-50/80 border-slate-200' : 'bg-rose-50 border-rose-200'"
        >
          <span
            class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold"
            :class="item.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-200 text-rose-800'"
          >
            {{ item.status === 'PASSED' ? '✓' : '✕' }}
          </span>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-slate-800">{{ item.title }}</span>
              <span class="text-[10px] text-slate-400 font-medium">({{ item.category }})</span>
            </div>
            <p class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              {{ item.message }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ERP Bridge Services Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="erp in (legalStore.state.erpIntegrations || [])"
        :key="erp.code"
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-indigo-200 transition"
      >
        <div class="space-y-3">
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
              :class="erp.status === 'Connected' || erp.status === 'CONNECTED' ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' : 'bg-amber-100 text-amber-800 border-amber-200'"
              class="px-2 py-0.5 rounded-full text-[9px] font-extrabold border"
            >
              {{ erp.status === 'Connected' || erp.status === 'CONNECTED' ? 'TERHUBUNG' : 'SIMULASI MOCK' }}
            </span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed min-h-[40px]">
            {{ erp.description }}
          </p>
        </div>

        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-[10px] text-slate-400 font-medium">
            Status: <span class="text-slate-600 font-semibold">{{ erp.lastSync }}</span>
          </div>
          <button
            @click="testConnection(erp.code)"
            :disabled="erp.testing"
            class="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-[#4338CA] hover:text-[#4338CA] text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50"
          >
            <span v-if="erp.testing" class="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>{{ erp.testing ? 'Menguji...' : 'Uji Koneksi Ping' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ShieldCheck, CheckCircle2 } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';
import { runDataIntegrityCheck } from '../../../utils/dataIntegrityValidator';

const isRunningAudit = ref(false);
const auditResults = ref(null);

function runIntegrityTest() {
  isRunningAudit.value = true;
  setTimeout(() => {
    auditResults.value = runDataIntegrityCheck();
    isRunningAudit.value = false;
    legalStore.triggerToast(
      `Audit selesai: ${auditResults.value.passedChecks} dari ${auditResults.value.totalChecks} pemeriksaan lolos!`,
      'success'
    );
  }, 400);
}

function testConnection(code) {
  legalStore.testErpConnection(code);
}
</script>
