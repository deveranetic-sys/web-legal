<template>
  <div>
    <!-- Fallback Disaster Recovery Interface -->
    <div
      v-if="hasError"
      class="min-h-[500px] flex items-center justify-center p-6 animate-in fade-in duration-300"
    >
      <div class="max-w-2xl w-full bg-white rounded-2xl border border-rose-200 shadow-xl overflow-hidden">
        <!-- Top alert band -->
        <div class="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <ShieldAlert class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-base font-bold tracking-tight">Terjadi Galat Tak Terduga</h2>
              <p class="text-xs text-rose-100">Modul terlindungi oleh Global Error Boundary LMS TOHA</p>
            </div>
          </div>
          <span class="text-[11px] font-mono bg-white/20 px-2.5 py-1 rounded-full text-white">
            {{ errorTimestamp }}
          </span>
        </div>

        <!-- Body description -->
        <div class="p-6 space-y-4">
          <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 leading-relaxed">
            <strong class="font-bold">Informasi:</strong> Terjadi exception runtime saat me-render tampilan modul aktif. Seluruh data transaksi di LocalStorage dan database browser Anda <strong>tetap aman</strong> dan tidak mengalami kerusakan.
          </div>

          <!-- Error message summary -->
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-mono text-xs text-slate-800 break-words">
            <span class="text-rose-600 font-bold">Error:</span> {{ errorMessage }}
          </div>

          <!-- Actions Bar -->
          <div class="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              @click="retryModule"
              class="px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw class="w-4 h-4" />
              <span>Muat Ulang Modul Ini</span>
            </button>

            <button
              @click="goDashboard"
              class="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Home class="w-4 h-4 text-slate-500" />
              <span>Kembali ke Dashboard</span>
            </button>

            <button
              @click="downloadEmergencyBackup"
              class="px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ml-auto"
              title="Unduh seluruh data lokal sebagai arsip darurat"
            >
              <Download class="w-4 h-4 text-emerald-600" />
              <span>Cadangkan Data Darurat (JSON)</span>
            </button>
          </div>

          <!-- Collapsible Technical Diagnostic -->
          <div class="pt-3 border-t border-slate-200 text-xs">
            <button
              @click="showDetails = !showDetails"
              class="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{{ showDetails ? '▲ Sembunyikan' : '▼ Lihat' }} Rincian Diagnosa Teknis (Stack Trace)</span>
            </button>

            <div v-if="showDetails" class="mt-2.5 space-y-2">
              <div class="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap">
{{ errorStack || 'Stack trace tidak tersedia.' }}
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-500">
                <span>Komponen Lifecycle: {{ errorInfo || 'Unspecified hook' }}</span>
                <button
                  @click="copyError"
                  class="text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  {{ copied ? '✓ Berhasil Disalin' : 'Salin Pesan Error' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Normal slot view if no error -->
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue';
import {
  ShieldAlert,
  RefreshCw,
  Home,
  Download
} from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const hasError = ref(false);
const errorMessage = ref('');
const errorStack = ref('');
const errorInfo = ref('');
const errorTimestamp = ref('');
const showDetails = ref(false);
const copied = ref(false);

onErrorCaptured((err, instance, info) => {
  hasError.value = true;
  errorMessage.value = err?.message || 'Unknown runtime error occurred';
  errorStack.value = err?.stack || '';
  errorInfo.value = info || '';
  errorTimestamp.value = new Date().toLocaleTimeString('id-ID');

  console.error('[AppErrorBoundary] Captured exception:', {
    err,
    instance,
    info
  });

  // Stop error from bubbling up to browser window
  return false;
});

function retryModule() {
  hasError.value = false;
  errorMessage.value = '';
  errorStack.value = '';
  showDetails.value = false;
}

function goDashboard() {
  hasError.value = false;
  legalStore.navigate('dashboard');
}

function downloadEmergencyBackup() {
  try {
    const backupData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lms_')) {
        try {
          backupData[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          backupData[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LMS_Emergency_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    legalStore.triggerToast('Cadangan data darurat berhasil diunduh.', 'success');
  } catch (e) {
    console.error('Failed to create emergency backup:', e);
  }
}

function copyError() {
  const text = `LMS TOHA Error Diagnostic\nTime: ${errorTimestamp.value}\nMessage: ${errorMessage.value}\nInfo: ${errorInfo.value}\nStack:\n${errorStack.value}`;
  navigator.clipboard?.writeText(text).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  });
}
</script>
