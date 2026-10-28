<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
      <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <span class="font-mono text-xs font-bold text-purple-700">{{ dispute.caseNumber }}</span>
          <h3 class="font-extrabold text-slate-900 text-base mt-0.5">Kronologi Tahapan Perkara</h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
      </div>

      <div class="p-6 overflow-y-auto space-y-4 text-xs">
        <div
          v-for="(step, idx) in dispute.timeline"
          :key="idx"
          class="flex items-start gap-3 relative pl-2 pb-4 border-l-2 border-purple-200 last:border-0"
        >
          <div class="w-3 h-3 rounded-full bg-purple-600 -translate-x-[7px] mt-1 shrink-0"></div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-xs sm:text-sm">{{ step.title }}</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ step.date }}</span>
            </div>
            <p class="text-slate-600 mt-1 leading-relaxed">{{ step.description || step.agendaOrNotes }}</p>
          </div>
        </div>

        <div v-if="!dispute.timeline || dispute.timeline.length === 0" class="text-slate-400 text-center py-6">
          Belum ada kronologi persidangan yang ditambahkan.
        </div>
      </div>

      <div class="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-500 font-medium">Sidang: {{ dispute.nextHearingDate || dispute.nextHearing || '-' }}</span>
          <button
            @click="syncGoogle"
            class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-purple-700 font-bold text-xs hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <Calendar class="w-3.5 h-3.5 text-purple-600" />
            <span>Google Calendar</span>
          </button>
          <button
            @click="syncICal"
            class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh .ics</span>
          </button>
        </div>

        <button @click="$emit('close')" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap self-end sm:self-auto">
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar, Download } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../../stores/legalStore';
import { openGoogleCalendar, downloadICalFile } from '../../services/calendarService';

const props = defineProps({
  dispute: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

function syncGoogle() {
  const event = {
    title: `[SIDANG LEGAL] ${props.dispute.caseNumber} - ${props.dispute.company} vs ${props.dispute.opponent}`,
    description: `Perkara: ${props.dispute.caseNumber}\nLembaga/Pengadilan: ${props.dispute.courtOrInstitution}\nKuasa Hukum: ${props.dispute.legalCounsel || props.dispute.externalCounsel || '-'}\nKlaim: ${formatIDR(props.dispute.disputeValue || props.dispute.claimValue)}\n\nRingkasan: ${props.dispute.summary || props.dispute.remarks}`,
    location: props.dispute.courtOrInstitution || 'Pengadilan Negeri / BANI Jakarta',
    startDate: props.dispute.nextHearingDate || props.dispute.nextHearing
  };
  openGoogleCalendar(event);
  legalStore.triggerToast(`Membuka Google Calendar untuk sidang ${props.dispute.caseNumber}`, 'info');
}

function syncICal() {
  const event = {
    title: `[SIDANG LEGAL] ${props.dispute.caseNumber} - ${props.dispute.company} vs ${props.dispute.opponent}`,
    description: `Perkara: ${props.dispute.caseNumber}\nLembaga/Pengadilan: ${props.dispute.courtOrInstitution}\nKuasa Hukum: ${props.dispute.legalCounsel || props.dispute.externalCounsel || '-'}\nKlaim: ${formatIDR(props.dispute.disputeValue || props.dispute.claimValue)}\n\nRingkasan: ${props.dispute.summary || props.dispute.remarks}`,
    location: props.dispute.courtOrInstitution || 'Pengadilan Negeri / BANI Jakarta',
    startDate: props.dispute.nextHearingDate || props.dispute.nextHearing
  };
  downloadICalFile(event);
  legalStore.triggerToast(`File kalender (.ics) berhasil diunduh untuk ${props.dispute.caseNumber}`, 'success');
}
</script>
