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
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Kewajiban</span>
        </button>
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
              <th class="py-3 px-4 text-center">Status Pemenuhan</th>
              <th class="py-3 px-4 text-center">Pengingat Kalender</th>
              <th class="py-3 px-4 text-right">Aksi</th>
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
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="openEditCompliance(item)"
                    class="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                    title="Edit Kewajiban"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDeleteCompliance(item)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Hapus Kewajiban"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: Tambah Kewajiban Kepatuhan Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-indigo-400" />
            <h3 class="font-extrabold text-white text-base">Tambah Kewajiban Kepatuhan Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewCompliance" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Nama Kewajiban Kepatuhan *</label>
            <input
              v-model="newForm.requirement"
              type="text"
              required
              placeholder="Contoh: Laporan Kinerja Pengelolaan Lingkungan (RKL-RPL) Semester I"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Dasar Hukum / Regulasi *</label>
              <input
                v-model="newForm.legalBasis"
                type="text"
                required
                placeholder="Misal: PP No. 22/2021 & AMDAL"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Frekuensi Pelaporan</label>
              <select
                v-model="newForm.frequency"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none"
              >
                <option value="Per Semester">Per Semester</option>
                <option value="Triwulanan (Quarterly)">Triwulanan (Quarterly)</option>
                <option value="Tahunan (Annual)">Tahunan (Annual)</option>
                <option value="Insidental / Sesuai Permintaan">Insidental / Sesuai Permintaan</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Instansi Pengawas</label>
              <input
                v-model="newForm.authority"
                type="text"
                placeholder="Kementerian ESDM / KLHK / BKPM"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Entitas Perseroan</label>
              <select
                v-model="newForm.company"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Indo Mineral Tambang">PT Indo Mineral Tambang</option>
                <option value="PT Trans Nusantara Logistik">PT Trans Nusantara Logistik</option>
                <option value="PT Energi Hijau Persada">PT Energi Hijau Persada</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Batas Akhir (Deadline) *</label>
              <input
                v-model="newForm.deadline"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">PIC Pelaksana</label>
              <input
                v-model="newForm.pic"
                type="text"
                placeholder="Nama PIC Legal / HSE"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              />
            </div>
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
              class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Simpan Kewajiban
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Edit Kewajiban Kepatuhan -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isEditModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Pencil class="w-5 h-5 text-amber-400" />
            <h3 class="font-extrabold text-white text-base">Perbarui Kewajiban Kepatuhan</h3>
          </div>
          <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitEditCompliance" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Nama Kewajiban Kepatuhan *</label>
            <input
              v-model="editForm.requirement"
              type="text"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Dasar Hukum *</label>
              <input
                v-model="editForm.legalBasis"
                type="text"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Frekuensi</label>
              <select
                v-model="editForm.frequency"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none"
              >
                <option value="Per Semester">Per Semester</option>
                <option value="Triwulanan (Quarterly)">Triwulanan (Quarterly)</option>
                <option value="Tahunan (Annual)">Tahunan (Annual)</option>
                <option value="Insidental / Sesuai Permintaan">Insidental / Sesuai Permintaan</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Batas Akhir (Deadline) *</label>
              <input
                v-model="editForm.deadline"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Status Kepatuhan</label>
              <select
                v-model="editForm.status"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none font-bold"
              >
                <option value="COMPLIANT">COMPLIANT (Terpenuhi)</option>
                <option value="UPCOMING">UPCOMING (Mendatang)</option>
                <option value="OVERDUE">OVERDUE (Terlambat)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">PIC Pelaksana</label>
            <input
              v-model="editForm.pic"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { Calendar, Download, Plus, Pencil, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import { openGoogleCalendar, downloadICalFile } from '../services/calendarService';

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

const newForm = reactive({
  requirement: '',
  legalBasis: '',
  frequency: 'Per Semester',
  authority: 'Kementerian ESDM / KLHK',
  company: 'PT Nusantara Energi',
  deadline: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  pic: 'Compliance Specialist',
  status: 'UPCOMING'
});

const editForm = reactive({
  id: '',
  requirement: '',
  legalBasis: '',
  frequency: '',
  authority: '',
  company: '',
  deadline: '',
  pic: '',
  status: 'UPCOMING'
});

function openEditCompliance(item) {
  Object.assign(editForm, {
    id: item.id,
    requirement: item.requirement || '',
    legalBasis: item.legalBasis || '',
    frequency: item.frequency || 'Per Semester',
    authority: item.authority || '',
    company: item.company || 'PT Nusantara Energi',
    deadline: item.deadline || '',
    pic: item.pic || '',
    status: item.status || 'UPCOMING'
  });
  isEditModalOpen.value = true;
}

function submitNewCompliance() {
  legalStore.addComplianceObligation({ ...newForm });
  isAddModalOpen.value = false;
  newForm.requirement = '';
  newForm.legalBasis = '';
}

function submitEditCompliance() {
  legalStore.updateComplianceObligation(editForm.id, { ...editForm });
  isEditModalOpen.value = false;
}

function confirmDeleteCompliance(item) {
  if (confirm(`Hapus kewajiban kepatuhan "${item.requirement}"?`)) {
    legalStore.deleteComplianceObligation(item.id);
  }
}

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
