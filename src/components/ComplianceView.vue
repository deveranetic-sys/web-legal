<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFE4E6] text-[#9F1239]">
            Kepatuhan Hukum & Regulasi
          </span>
          <span class="text-xs text-slate-500 font-medium">Compliance Health Rate: 85%</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Kepatuhan & Pengawasan Regulasi (Compliance)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Matriks kewajiban hukum berkala perseroan: Pelaporan LKPM BKPM, RKL-RPL Lingkungan Hidup, WLKP Ketenagakerjaan, dan ESDM.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-[#BBF7D0] font-bold">
          ✓ Audit Trail Kepatuhan Aktif
        </span>
      </div>
    </div>

    <!-- Quick Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Total Kewajiban Terdata</span>
        <div class="text-2xl font-black text-slate-900 mt-1">{{ complianceItems.length }}</div>
        <div class="text-[11px] text-slate-400 mt-0.5">Kewajiban Mandatori UU</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs font-semibold text-emerald-600">Sudah Terpenuhi (Compliant)</span>
        <div class="text-2xl font-black text-emerald-700 mt-1">{{ compliantCount }}</div>
        <div class="text-[11px] text-emerald-600 mt-0.5">Bukti tanda terima valid</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs font-semibold text-rose-600">Terlambat (Overdue)</span>
        <div class="text-2xl font-black text-rose-600 mt-1">{{ overdueCount }}</div>
        <div class="text-[11px] text-rose-600 font-semibold mt-0.5">Segera submit laporan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs font-semibold text-[#4338CA]">Mendatang (Upcoming)</span>
        <div class="text-2xl font-black text-[#4338CA] mt-1">{{ upcomingCount }}</div>
        <div class="text-[11px] text-[#4338CA] mt-0.5">Jadwal periode berjalan</div>
      </div>
    </div>

    <!-- Table of Compliance Obligations -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 class="font-bold text-slate-900 text-sm">Daftar Kewajiban Kepatuhan Mandatori</h3>
        <span class="text-xs text-slate-500">Klik status untuk mengubah status kepatuhan secara langsung</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th class="py-3 px-4">Nama Kewajiban & Dasar Hukum</th>
              <th class="py-3 px-4">Entitas Perseroan</th>
              <th class="py-3 px-4">Batas Akhir (Deadline)</th>
              <th class="py-3 px-4">PIC Pelaksana</th>
              <th class="py-3 px-4">Dokumen Bukti</th>
              <th class="py-3 px-4 text-center">Status Pemenuhan</th>
              <th class="py-3 px-4 text-center">Pengingat Kalender</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in complianceItems" :key="item.id" class="hover:bg-slate-50">
              <td class="py-3.5 px-4 min-w-[240px]">
                <div class="font-bold text-slate-900">{{ item.requirement }}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">{{ item.legalBasis }}</div>
              </td>
              <td class="py-3.5 px-4 text-slate-700">{{ item.company }}</td>
              <td class="py-3.5 px-4 font-semibold whitespace-nowrap" :class="item.status === 'OVERDUE' ? 'text-rose-600' : 'text-slate-800'">
                {{ item.deadline }}
              </td>
              <td class="py-3.5 px-4 text-slate-700 whitespace-nowrap">{{ item.pic }}</td>
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span v-if="item.evidenceDoc" class="text-[#4338CA] hover:underline cursor-pointer font-medium text-xs">
                  {{ item.evidenceDoc }}
                </span>
                <span v-else class="text-slate-400 italic text-[11px]">Belum diunggah</span>
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <button
                  @click="cycleStatus(item)"
                  :class="getStatusBadgeClass(item.status)"
                  class="px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer hover:opacity-80 shadow-2xs"
                  title="Klik untuk mengubah status"
                >
                  {{ item.status }}
                </button>
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="syncComplianceToGoogle(item)"
                    class="p-1 px-2 rounded-md hover:bg-indigo-50 text-indigo-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-indigo-200 transition"
                    title="Buka di Google Calendar"
                  >
                    <Calendar class="w-3.5 h-3.5 text-indigo-600" />
                    <span>Google Cal</span>
                  </button>
                  <button
                    @click="syncComplianceToICal(item)"
                    class="p-1 px-2 rounded-md hover:bg-slate-100 text-slate-600 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-slate-200 transition"
                    title="Unduh file .ics"
                  >
                    <Download class="w-3.5 h-3.5 text-slate-500" />
                    <span>.ics</span>
                  </button>
                </div>
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
import { Calendar, Download } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import { openGoogleCalendar, downloadICalFile } from '../services/calendarService';

const complianceItems = computed(() => legalStore.state.compliance);

const compliantCount = computed(() => complianceItems.value.filter(c => c.status === 'COMPLIANT').length);
const overdueCount = computed(() => complianceItems.value.filter(c => c.status === 'OVERDUE').length);
const upcomingCount = computed(() => complianceItems.value.filter(c => c.status === 'UPCOMING').length);

function getStatusBadgeClass(status) {
  switch (status) {
    case 'COMPLIANT': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'OVERDUE': return 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]';
    case 'UPCOMING': return 'bg-blue-100 text-blue-800 border border-[#C7D2FE]';
    default: return 'bg-slate-100 text-slate-800';
  }
}

function cycleStatus(item) {
  const nextStatus = item.status === 'UPCOMING' ? 'COMPLIANT' : item.status === 'COMPLIANT' ? 'OVERDUE' : 'UPCOMING';
  legalStore.updateComplianceStatus(item.id, nextStatus);
}

function syncComplianceToGoogle(item) {
  const event = {
    title: `[DEADLINE COMPLIANCE] ${item.requirement} - ${item.company}`,
    description: `Kewajiban: ${item.requirement}\nDasar Hukum: ${item.legalBasis}\nEntitas: ${item.company}\nPIC: ${item.pic}\nStatus: ${item.status}`,
    location: item.company,
    startDate: item.deadline
  };
  openGoogleCalendar(event);
  legalStore.triggerToast(`Membuka Google Calendar untuk deadline ${item.requirement}`, 'info');
}

function syncComplianceToICal(item) {
  const event = {
    title: `[DEADLINE COMPLIANCE] ${item.requirement} - ${item.company}`,
    description: `Kewajiban: ${item.requirement}\nDasar Hukum: ${item.legalBasis}\nEntitas: ${item.company}\nPIC: ${item.pic}\nStatus: ${item.status}`,
    location: item.company,
    startDate: item.deadline
  };
  downloadICalFile(event);
  legalStore.triggerToast(`File kalender (.ics) berhasil diunduh untuk ${item.requirement}`, 'success');
}
</script>
