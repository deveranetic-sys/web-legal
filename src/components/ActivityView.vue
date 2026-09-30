<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
            Audit Trail & Integritas Data
          </span>
          <span class="text-xs text-slate-500 font-medium">Immutable Activity Ledger</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Audit Activity Log
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Jejak rekam kronologis seluruh aksi pengguna, modifikasi klausul kontrak, persetujuan opini hukum, dan otorisasi sistem.
        </p>
      </div>

      <div>
        <button
          @click="exportAuditLog"
          class="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
        >
          <Download class="w-4 h-4 text-slate-500" />
          <span>Ekspor Log Audit</span>
        </button>
      </div>
    </div>

    <!-- Activity Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th class="py-3 px-4">Waktu (Timestamp)</th>
              <th class="py-3 px-4">Pengguna & Peran</th>
              <th class="py-3 px-4">Modul Sistem</th>
              <th class="py-3 px-4 text-center">Tindakan</th>
              <th class="py-3 px-4">Keterangan Aktivitas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="log in activityLogs" :key="log.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                {{ log.timestamp }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="font-bold text-slate-900">{{ log.user || log.userName }}</div>
                <div class="text-[10px] text-slate-400">{{ log.userRole || 'LEGAL USER' }}</div>
              </td>
              <td class="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                {{ log.module }}
              </td>
              <td class="py-3 px-4 text-center whitespace-nowrap">
                <span
                  :class="getActionBadge(log.action)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="py-3 px-4 text-xs text-slate-700 min-w-[280px]">
                {{ log.description || log.details }}
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
import { Download } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const activityLogs = computed(() => legalStore.state.activityLogs);

function getActionBadge(action) {
  switch (action) {
    case 'CREATE': return 'bg-[#DCFCE7] text-[#166534]';
    case 'EDIT':
    case 'UPDATE_STATUS': return 'bg-blue-100 text-blue-800';
    case 'DELETE': return 'bg-[#FFE4E6] text-[#9F1239]';
    case 'SWITCH_ROLE': return 'bg-purple-100 text-purple-800';
    case 'APPROVAL': return 'bg-[#FEF3C7] text-[#92400E]';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function exportAuditLog() {
  let csv = 'Timestamp,User,Module,Action,Description\n';
  activityLogs.value.forEach(l => {
    csv += `"${l.timestamp}","${l.user || l.userName}","${l.module}","${l.action}","${l.description || l.details}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LMS_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}
</script>
