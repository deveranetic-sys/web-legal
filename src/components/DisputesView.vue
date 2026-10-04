<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            Litigasi, Arbitrase & Sengketa
          </span>
          <span class="text-xs text-slate-500 font-medium">BANI & Pengadilan Negeri</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Manajemen Sengketa & Perkara (Dispute & Litigation)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Pengawasan perkara aktif di BANI Arbitration Center, peradilan perdata/PHI, mitigasi eksposur klaim finansial, dan jadwal persidangan.
        </p>
      </div>

      <!-- Action Button -->
      <div class="shrink-0">
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Perkara</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Perkara Aktif</span>
        <div class="text-2xl font-black text-slate-900 mt-1">{{ disputes.length }}</div>
        <div class="text-[11px] text-purple-600 font-semibold mt-0.5">Sedang Berjalan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-rose-600 font-semibold">Risiko Tinggi (High Risk)</span>
        <div class="text-2xl font-black text-rose-600 mt-1">{{ highRiskCount }}</div>
        <div class="text-[11px] text-rose-600 mt-0.5">Eksposur Finansial Signifikan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Total Nilai Tuntutan / Klaim</span>
        <div class="text-lg font-black text-slate-900 mt-1 truncate" :title="formatIDR(totalClaimValue)">
          {{ formatCompactIDR(totalClaimValue) }}
        </div>
        <div class="text-[11px] text-slate-400 mt-0.5">Estimasi Total Kerugian</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Sidang Terdekat</span>
        <div class="text-sm font-bold text-slate-900 mt-1 truncate">29 Sep 2026</div>
        <div class="text-[11px] text-purple-700 font-semibold mt-0.5">BANI Arbitration Jakarta</div>
      </div>
    </div>

    <!-- Dispute List -->
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
                :class="disp.riskLevel === 'HIGH' ? 'bg-[#FFE4E6] text-[#9F1239]' : 'bg-[#FEF3C7] text-[#92400E]'"
                class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
              >
                Risiko: {{ disp.riskLevel }}
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 mt-2">
              {{ disp.company }} vs. {{ disp.opponent }}
            </h3>
          </div>

          <div class="text-right sm:border-l sm:border-slate-100 sm:pl-4">
            <span class="text-xs text-slate-400 block">Nilai Klaim Sengketa:</span>
            <span class="text-base font-black text-slate-900 font-mono">{{ formatIDR(disp.disputeValue) }}</span>
          </div>
        </div>

        <!-- Summary & Next Hearing -->
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          {{ disp.summary }}
        </p>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
          <div class="flex flex-wrap items-center gap-4 text-slate-600">
            <div><span class="text-slate-400">Kuasa Hukum Eksternal:</span> <span class="font-bold">{{ disp.legalCounsel }}</span></div>
            <div class="flex items-center gap-2">
              <span class="text-slate-400">Sidang Berikutnya:</span>
              <span class="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{{ disp.nextHearingDate }}</span>
              
              <!-- Quick Calendar Sync Button -->
              <div class="flex items-center gap-1 ml-1">
                <button
                  @click="syncDisputeToGoogle(disp)"
                  class="p-1 rounded hover:bg-slate-100 text-purple-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-slate-200"
                  title="Buka di Google Calendar"
                >
                  <Calendar class="w-3.5 h-3.5 text-purple-600" />
                  <span>Google Cal</span>
                </button>
                <button
                  @click="syncDisputeToICal(disp)"
                  class="p-1 rounded hover:bg-slate-100 text-slate-600 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-slate-200"
                  title="Unduh file .ics untuk Apple Calendar / Outlook"
                >
                  <Download class="w-3.5 h-3.5 text-slate-500" />
                  <span>.ics</span>
                </button>
              </div>
            </div>
          </div>

          <button
            @click="selectedDispute = disp"
            class="px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition cursor-pointer self-start sm:self-auto whitespace-nowrap"
          >
            Lihat Kronologi
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Timeline & Kronologi Sidang -->
    <div
      v-if="selectedDispute"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="selectedDispute = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <span class="font-mono text-xs font-bold text-purple-700">{{ selectedDispute.caseNumber }}</span>
            <h3 class="font-extrabold text-slate-900 text-base mt-0.5">Kronologi Tahapan Perkara</h3>
          </div>
          <button @click="selectedDispute = null" class="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 text-xs">
          <div
            v-for="(step, idx) in selectedDispute.timeline"
            :key="idx"
            class="flex items-start gap-3 relative pl-2 pb-4 border-l-2 border-purple-200 last:border-0"
          >
            <div class="w-3 h-3 rounded-full bg-purple-600 -translate-x-[7px] mt-1 shrink-0"></div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-xs sm:text-sm">{{ step.title }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ step.date }}</span>
              </div>
              <p class="text-slate-600 mt-1 leading-relaxed">{{ step.description }}</p>
            </div>
          </div>

          <div v-if="!selectedDispute.timeline || selectedDispute.timeline.length === 0" class="text-slate-400 text-center py-6">
            Belum ada kronologi persidangan yang ditambahkan.
          </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-medium">Sidang: {{ selectedDispute.nextHearingDate }}</span>
            <button
              @click="syncDisputeToGoogle(selectedDispute)"
              class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-purple-700 font-bold text-xs hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <Calendar class="w-3.5 h-3.5 text-purple-600" />
              <span>Google Calendar</span>
            </button>
            <button
              @click="syncDisputeToICal(selectedDispute)"
              class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <Download class="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh .ics</span>
            </button>
          </div>

          <button @click="selectedDispute = null" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Tambah Perkara / Sengketa Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-purple-400" />
            <h3 class="font-extrabold text-white text-base">Pendaftaran Perkara & Sengketa Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewDispute" class="p-6 space-y-4 text-xs sm:text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Nomor Perkara / Register *</label>
              <input
                v-model="newDisputeForm.caseNumber"
                type="text"
                required
                placeholder="45/BANI/ARB/2026"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 font-mono"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Pihak Lawan (Opponent) *</label>
              <input
                v-model="newDisputeForm.opponent"
                type="text"
                required
                placeholder="PT Mitra Jaya Abadi"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Jenis Sengketa</label>
              <select
                v-model="newDisputeForm.caseType"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 outline-none"
              >
                <option value="Arbitrase BANI">Arbitrase BANI</option>
                <option value="Perdata / Wanprestasi">Perdata / Wanprestasi</option>
                <option value="Perburuhan (PHI)">Perburuhan (PHI)</option>
                <option value="Tata Usaha Negara (PTUN)">Tata Usaha Negara (PTUN)</option>
                <option value="Sengketa Lahan">Sengketa Lahan</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Lembaga / Pengadilan</label>
              <input
                v-model="newDisputeForm.courtOrInstitution"
                type="text"
                required
                placeholder="BANI Arbitration Jakarta"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Nilai Klaim / Tuntutan (Rp)</label>
              <input
                v-model.number="newDisputeForm.disputeValue"
                type="number"
                step="10000000"
                required
                placeholder="2500000000"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Tingkat Risiko Eksposur</label>
              <select
                v-model="newDisputeForm.riskLevel"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 outline-none font-bold"
              >
                <option value="HIGH">Tinggi (High Risk)</option>
                <option value="MEDIUM">Sedang (Medium Risk)</option>
                <option value="LOW">Rendah (Low Risk)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Entitas Perseroan</label>
              <select
                v-model="newDisputeForm.company"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 outline-none"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
                <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Jadwal Sidang Berikutnya</label>
              <input
                v-model="newDisputeForm.nextHearingDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Kuasa Hukum / Counsel Penanggung Jawab</label>
            <input
              v-model="newDisputeForm.legalCounsel"
              type="text"
              placeholder="Tim Litigasi Internal & Retained Lawyer"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Ringkasan Pokok Perkara & Petitum *</label>
            <textarea
              v-model="newDisputeForm.summary"
              required
              rows="3"
              placeholder="Jelaskan dasar tuntutan, kronologi wanprestasi/perbuatan melawan hukum, serta langkah mitigasi..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Simpan Perkara
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { Plus, Calendar, Download } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../stores/legalStore';
import { openGoogleCalendar, downloadICalFile } from '../services/calendarService';

const isAddModalOpen = ref(false);
const selectedDispute = ref(null);

const newDisputeForm = reactive({
  caseNumber: '',
  opponent: '',
  caseType: 'Arbitrase BANI',
  courtOrInstitution: 'BANI Arbitration Jakarta',
  disputeValue: 5000000000,
  riskLevel: 'HIGH',
  company: 'PT Nusantara Energi',
  nextHearingDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  legalCounsel: 'Tim Internal Legal Counsel',
  summary: ''
});

function submitNewDispute() {
  legalStore.addDispute({ ...newDisputeForm });
  isAddModalOpen.value = false;
  newDisputeForm.caseNumber = '';
  newDisputeForm.opponent = '';
  newDisputeForm.summary = '';
}

const disputes = computed(() => legalStore.state.disputes);

const highRiskCount = computed(() => {
  return disputes.value.filter(d => d.riskLevel === 'HIGH').length;
});

const totalClaimValue = computed(() => {
  return disputes.value.reduce((acc, d) => acc + (d.disputeValue || 0), 0);
});

function formatCompactIDR(amount) {
  if (!amount) return 'Rp 0';
  if (amount >= 1_000_000_000_000) return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} T`;
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`;
  return formatIDR(amount);
}

function syncDisputeToGoogle(disp) {
  const event = {
    title: `[SIDANG LEGAL] ${disp.caseNumber} - ${disp.company} vs ${disp.opponent}`,
    description: `Perkara: ${disp.caseNumber}\nLembaga/Pengadilan: ${disp.courtOrInstitution}\nKuasa Hukum: ${disp.legalCounsel}\nKlaim: ${formatIDR(disp.disputeValue)}\n\nRingkasan: ${disp.summary}`,
    location: disp.courtOrInstitution || 'Pengadilan Negeri / BANI Jakarta',
    startDate: disp.nextHearingDate
  };
  openGoogleCalendar(event);
  legalStore.triggerToast(`Membuka Google Calendar untuk sidang ${disp.caseNumber}`, 'info');
}

function syncDisputeToICal(disp) {
  const event = {
    title: `[SIDANG LEGAL] ${disp.caseNumber} - ${disp.company} vs ${disp.opponent}`,
    description: `Perkara: ${disp.caseNumber}\nLembaga/Pengadilan: ${disp.courtOrInstitution}\nKuasa Hukum: ${disp.legalCounsel}\nKlaim: ${formatIDR(disp.disputeValue)}\n\nRingkasan: ${disp.summary}`,
    location: disp.courtOrInstitution || 'Pengadilan Negeri / BANI Jakarta',
    startDate: disp.nextHearingDate
  };
  downloadICalFile(event);
  legalStore.triggerToast(`File kalender (.ics) berhasil diunduh untuk ${disp.caseNumber}`, 'success');
}
</script>
