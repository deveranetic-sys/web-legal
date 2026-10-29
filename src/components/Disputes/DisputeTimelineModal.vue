<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E2E8F0]">
      <!-- Header Section -->
      <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0 gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-mono text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
              {{ dispute.caseNumber }}
            </span>
            <span class="text-xs text-[#64748B] font-medium truncate">
              {{ dispute.caseType }} • {{ dispute.courtOrInstitution }}
            </span>
          </div>
          <h3 class="font-bold text-[#0F172A] text-base mt-1 truncate">
            Kronologi Tahapan Perkara: {{ dispute.company }} vs. {{ dispute.opponent }}
          </h3>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <!-- Button Tambah Kronologi Toggle -->
          <button
            @click="toggleAddForm"
            :class="showAddForm ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-600 hover:bg-purple-700 text-white'"
            class="px-3 h-8 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Tambah Tahapan Kronologi Baru"
          >
            <component :is="showAddForm ? X : Plus" class="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{{ showAddForm ? 'Tutup Form' : 'Tambah Kronologi' }}</span>
          </button>

          <!-- Close Modal Button -->
          <button
            @click="$emit('close')"
            class="w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition cursor-pointer"
            title="Tutup Modal"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Main Body Container -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
        <!-- FORM: Tambah Kronologi Baru (Expandable) -->
        <div
          v-if="showAddForm"
          class="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div class="flex items-center justify-between pb-2 border-b border-purple-200/80">
            <div class="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
              <PlusCircle class="w-4 h-4 text-purple-600" />
              <span>Input Tahapan Kronologi Sidang Baru</span>
            </div>
            <span class="text-[11px] text-purple-700">Lengkapi data agenda/sidang</span>
          </div>

          <form @submit.prevent="submitChronology" class="space-y-3">
            <!-- Preset & Title Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-[#0F172A] mb-1">
                  Pilih Preset Agenda Standar:
                </label>
                <select
                  v-model="selectedPreset"
                  @change="onPresetChange"
                  class="form-select text-xs w-full h-[36px]"
                >
                  <option value="">-- Ketik Bebas / Pilih Standar --</option>
                  <option v-for="p in presetStages" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-[#0F172A] mb-1">
                  Judul / Tahapan Agenda *
                </label>
                <input
                  v-model="chronologyForm.title"
                  type="text"
                  required
                  placeholder="Contoh: Sidang Mediasi II atau Penyampaian Replik"
                  class="form-input text-xs w-full h-[36px]"
                />
              </div>
            </div>

            <!-- Date & Hearing Sync Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label class="block font-semibold text-[#0F172A] mb-1">
                  Tanggal Pelaksanaan / Agenda *
                </label>
                <input
                  v-model="chronologyForm.date"
                  type="date"
                  required
                  class="form-input text-xs w-full h-[36px]"
                />
              </div>

              <div class="pb-1.5">
                <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    v-model="chronologyForm.updateNextHearing"
                    type="checkbox"
                    class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <span class="text-xs font-semibold text-[#0F172A]">
                    Sinkronkan sebagai Jadwal Sidang Berikutnya
                  </span>
                </label>
              </div>
            </div>

            <!-- Description / Agenda Notes -->
            <div>
              <label class="block font-semibold text-[#0F172A] mb-1">
                Keterangan & Catatan Agenda Persidangan *
              </label>
              <textarea
                v-model="chronologyForm.description"
                rows="2"
                required
                placeholder="Contoh: Majelis Arbiter memeriksa 15 dokumen alat bukti surat pemohon. Sidang berikutnya ditunda untuk mendengar keterangan saksi ahli..."
                class="form-input text-xs w-full p-2.5 leading-relaxed"
              ></textarea>
            </div>

            <!-- Action Buttons for Add Form -->
            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                @click="showAddForm = false"
                class="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F1F5F9] font-semibold text-xs cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer transition flex items-center gap-1.5"
              >
                <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Simpan Kronologi</span>
              </button>
            </div>
          </form>
        </div>

        <!-- TIMELINE LIST -->
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-1 border-b border-[#F1F5F9]">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-purple-600" />
              <span>Daftar Riwayat & Agenda Kronologis ({{ dispute.timeline?.length || 0 }})</span>
            </h4>
            <span class="text-[11px] text-[#94A3B8]">Urutan kronologis tanggal</span>
          </div>

          <div
            v-for="(step, idx) in sortedTimeline"
            :key="idx"
            class="flex items-start gap-3 relative pl-3 pb-5 border-l-2 border-purple-200 last:border-transparent group"
          >
            <!-- Timeline Dot -->
            <div
              :class="isFutureDate(step.date) ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-purple-600 ring-4 ring-purple-100'"
              class="w-3.5 h-3.5 rounded-full -translate-x-[9px] mt-0.5 shrink-0 transition"
            ></div>

            <!-- Content Card -->
            <div class="flex-1 min-w-0 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] hover:border-purple-200 transition">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-[#0F172A] text-xs sm:text-sm">{{ step.title }}</span>
                    <span
                      :class="isFutureDate(step.date) ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-200 text-slate-700 border-slate-300'"
                      class="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
                    >
                      {{ step.date }}
                    </span>
                    <span
                      v-if="step.date === (dispute.nextHearingDate || dispute.nextHearing)"
                      class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 uppercase"
                    >
                      Sidang Berikutnya
                    </span>
                  </div>
                  <p class="text-[#334155] mt-1.5 text-xs leading-relaxed whitespace-pre-line">
                    {{ step.description || step.agendaOrNotes }}
                  </p>
                </div>

                <!-- Delete Timeline Item Button -->
                <button
                  @click="handleDeleteChronology(idx, step)"
                  class="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer opacity-70 group-hover:opacity-100 shrink-0"
                  title="Hapus butir kronologi ini"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="!dispute.timeline || dispute.timeline.length === 0"
            class="text-[#64748B] text-center py-8 bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]"
          >
            <Calendar class="w-8 h-8 text-[#94A3B8] mx-auto mb-2 stroke-1" />
            <p class="font-bold text-xs text-[#0F172A]">Belum Ada Kronologi Persidangan</p>
            <p class="text-[11px] text-[#64748B] mt-0.5">
              Klik tombol "Tambah Kronologi" di atas untuk menambahkan tahapan agenda persidangan.
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-[#64748B] font-medium">
            Sidang Terdekat: <strong class="text-[#0F172A]">{{ dispute.nextHearingDate || dispute.nextHearing || '-' }}</strong>
          </span>
          <button
            @click="syncGoogle"
            class="px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-purple-700 font-bold text-xs hover:bg-[#F1F5F9] cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap transition"
          >
            <Calendar class="w-3.5 h-3.5 text-purple-600" />
            <span>Google Calendar</span>
          </button>
          <button
            @click="syncICal"
            class="px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] font-bold text-xs hover:bg-[#F1F5F9] cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap transition"
          >
            <Download class="w-3.5 h-3.5 text-[#64748B]" />
            <span>Unduh .ics</span>
          </button>
        </div>

        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap self-end sm:self-auto transition border border-[#CBD5E1]"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import {
  Calendar,
  Download,
  Plus,
  PlusCircle,
  X,
  Check,
  Clock,
  Trash2
} from 'lucide-vue-next';
import { legalStore, formatIDR } from '../../stores/legalStore';
import { openGoogleCalendar, downloadICalFile } from '../../services/calendarService';

const props = defineProps({
  dispute: {
    type: Object,
    required: true
  },
  initialOpenAdd: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const showAddForm = ref(props.initialOpenAdd);
const selectedPreset = ref('');

const presetStages = [
  'Pendaftaran Gugatan / Permohonan Arbitrase',
  'Sidang I: Pemeriksaan Legal Standing Para Pihak',
  'Sidang Mediasi I',
  'Sidang Mediasi II (Lanjutan)',
  'Penyampaian Jawaban & Eksepsi Tergugat',
  'Penyampaian Replik Penggugat',
  'Penyampaian Duplik Tergugat',
  'Pembuktian Surat & Dokumen Bukti',
  'Pemeriksaan Keterangan Saksi Fakta',
  'Pemeriksaan Keterangan Saksi Ahli Hukum',
  'Penyampaian Kesimpulan Para Pihak',
  'Musyawarah Majelis Hakim / Arbiter',
  'Pembacaan Putusan Akhir / Final Award BANI',
  'Aanmaning / Teguran Eksekusi Sukarela',
  'Pelaksanaan Sita Eksekusi Putusan'
];

const chronologyForm = reactive({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  updateNextHearing: false
});

const sortedTimeline = computed(() => {
  if (!props.dispute.timeline || !Array.isArray(props.dispute.timeline)) return [];
  return [...props.dispute.timeline].sort((a, b) => new Date(a.date) - new Date(b.date));
});

function toggleAddForm() {
  showAddForm.value = !showAddForm.value;
}

function onPresetChange() {
  if (selectedPreset.value) {
    chronologyForm.title = selectedPreset.value;
  }
}

function isFutureDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

function submitChronology() {
  if (!chronologyForm.title || !chronologyForm.date) {
    legalStore.triggerToast('Harap lengkapi judul dan tanggal kronologi!', 'warning');
    return;
  }

  legalStore.addDisputeChronology(props.dispute.id, {
    title: chronologyForm.title,
    date: chronologyForm.date,
    description: chronologyForm.description,
    updateNextHearing: chronologyForm.updateNextHearing
  });

  // Reset form
  chronologyForm.title = '';
  chronologyForm.date = new Date().toISOString().slice(0, 10);
  chronologyForm.description = '';
  chronologyForm.updateNextHearing = false;
  selectedPreset.value = '';
  showAddForm.value = false;
}

async function handleDeleteChronology(idx, step) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Butir Kronologi?',
    message: `Apakah Anda yakin ingin menghapus butir "${step.title}" (${step.date}) dari perkara ${props.dispute.caseNumber}?`,
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal',
    variant: 'danger'
  });

  if (confirmed) {
    legalStore.deleteDisputeChronology(props.dispute.id, idx);
  }
}

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
