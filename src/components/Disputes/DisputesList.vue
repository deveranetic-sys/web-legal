<template>
  <div class="space-y-4">
    <div
      v-for="disp in disputes"
      :key="disp.id"
      class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {{ disp.caseNumber }}
            </span>
            <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              {{ disp.caseType }} • {{ disp.courtOrInstitution }}
            </span>
            <span
              :class="(disp.riskLevel || 'HIGH') === 'HIGH' ? 'bg-[#FFE4E6] text-[#9F1239]' : 'bg-[#FEF3C7] text-[#92400E]'"
              class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
            >
              Risiko: {{ disp.riskLevel || 'HIGH' }}
            </span>
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 mt-2">
            {{ disp.company }} vs. {{ disp.opponent }}
          </h3>
        </div>

        <div class="text-right sm:border-l sm:border-slate-100 sm:pl-4">
          <span class="text-xs text-slate-400 block">Nilai Klaim Sengketa:</span>
          <span class="text-base font-black text-slate-900 font-mono">{{ formatIDR(disp.disputeValue || disp.claimValue) }}</span>
        </div>
      </div>

      <!-- Summary & Next Hearing -->
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
        {{ disp.summary || disp.remarks }}
      </p>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
        <div class="flex flex-wrap items-center gap-4 text-slate-600">
          <div><span class="text-slate-400">Kuasa Hukum Eksternal:</span> <span class="font-bold">{{ disp.legalCounsel || disp.externalCounsel || disp.lawyer || 'Internal Legal' }}</span></div>
          <div class="flex items-center gap-2">
            <span class="text-slate-400">Sidang Berikutnya:</span>
            <span class="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{{ disp.nextHearingDate || disp.nextHearing || '-' }}</span>
            
            <!-- Quick Calendar Sync Button -->
            <div class="flex items-center gap-1 ml-1">
              <button
                @click="syncGoogle(disp)"
                class="p-1 rounded hover:bg-slate-100 text-purple-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-slate-200"
                title="Buka di Google Calendar"
              >
                <Calendar class="w-3.5 h-3.5 text-purple-600" />
                <span>Google Cal</span>
              </button>
              <button
                @click="syncICal(disp)"
                class="p-1 rounded hover:bg-slate-100 text-slate-600 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-slate-200"
                title="Unduh file .ics untuk Apple Calendar / Outlook"
              >
                <Download class="w-3.5 h-3.5 text-slate-500" />
                <span>.ics</span>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <button
            @click="$emit('open-edit', disp)"
            class="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
            title="Edit Data Sengketa"
          >
            <Pencil class="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            @click="confirmDeleteDispute(disp)"
            class="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
            title="Hapus Data Sengketa"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
          <button
            @click="$emit('open-timeline', disp)"
            class="px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition cursor-pointer whitespace-nowrap"
          >
            Lihat Kronologi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar, Download, Pencil, Trash2 } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../../stores/legalStore';
import { openGoogleCalendar, downloadICalFile } from '../../services/calendarService';

const props = defineProps({
  disputes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['open-edit', 'open-timeline']);

async function confirmDeleteDispute(disp) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Perkara Sengketa?',
    message: `Hapus perkara sengketa "${disp.caseNumber}" (${disp.company} vs ${disp.opponent})?`,
    confirmText: 'Ya, Hapus Perkara',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteDispute(disp.id);
  }
}

function syncGoogle(disp) {
  const event = {
    title: `[SIDANG LEGAL] ${disp.caseNumber} - ${disp.company} vs ${disp.opponent}`,
    description: `Perkara: ${disp.caseNumber}\nLembaga/Pengadilan: ${disp.courtOrInstitution}\nKuasa Hukum: ${disp.legalCounsel || disp.externalCounsel || '-'}\nKlaim: ${formatIDR(disp.disputeValue || disp.claimValue)}\n\nRingkasan: ${disp.summary || disp.remarks}`,
    location: disp.courtOrInstitution || 'Pengadilan Negeri / BANI Jakarta',
    startDate: disp.nextHearingDate || disp.nextHearing
  };
  openGoogleCalendar(event);
  legalStore.triggerToast(`Membuka Google Calendar untuk sidang ${disp.caseNumber}`, 'info');
}

function syncICal(disp) {
  const event = {
    title: `[SIDANG LEGAL] ${disp.caseNumber} - ${disp.company} vs ${disp.opponent}`,
    description: `Perkara: ${disp.caseNumber}\nLembaga/Pengadilan: ${disp.courtOrInstitution}\nKuasa Hukum: ${disp.legalCounsel || disp.externalCounsel || '-'}\nKlaim: ${formatIDR(disp.disputeValue || disp.claimValue)}\n\nRingkasan: ${disp.summary || disp.remarks}`,
    location: disp.courtOrInstitution || 'Pengadilan Negeri / BANI Jakarta',
    startDate: disp.nextHearingDate || disp.nextHearing
  };
  downloadICalFile(event);
  legalStore.triggerToast(`File kalender (.ics) berhasil diunduh untuk ${disp.caseNumber}`, 'success');
}
</script>
