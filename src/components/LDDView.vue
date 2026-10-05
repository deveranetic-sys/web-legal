<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
            Uji Tuntas Hukum & Transaksi Korporasi
          </span>
          <span class="text-xs text-slate-500 font-medium">M&A, Ekuitas & Proyek Investasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Legal Due Diligence (LDD Workspace)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Pemeriksaan komprehensif kepatuhan aspek korporasi, perizinan, aset, kontrak material, sengketa, dan ketenagakerjaan target.
        </p>
      </div>

      <!-- Project Switcher & Actions -->
      <div class="flex items-center gap-2.5 shrink-0 flex-nowrap">
        <div class="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs">
          <FolderKanban class="w-4 h-4 text-emerald-600" />
          <span class="text-xs text-slate-500 font-medium">Proyek:</span>
          <select
            v-model="selectedProjectId"
            class="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            <option v-for="item in lddList" :key="item.id" :value="item.id">
              {{ item.projectName }}
            </option>
          </select>
        </div>

        <button
          v-if="activeLDD"
          @click="confirmDeleteProject(activeLDD)"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer whitespace-nowrap"
          title="Hapus Proyek LDD Ini"
        >
          <Trash2 class="w-4 h-4" />
          <span>Hapus Proyek</span>
        </button>

        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Proyek</span>
        </button>
      </div>
    </div>

    <!-- Active LDD Project Details -->
    <div v-if="activeLDD" class="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-md space-y-3">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span class="text-xs text-emerald-400 font-mono tracking-wider">PROJECT CODE: {{ activeLDD.id }}</span>
          <h2 class="text-xl sm:text-2xl font-black mt-1">{{ activeLDD.projectName }}</h2>
          <p class="text-xs text-slate-300 mt-0.5">Target Perusahaan: <span class="font-bold text-white">{{ activeLDD.targetCompany }}</span> • Lead Counsel: {{ activeLDD.leadCounsel }}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-white/10 px-3 py-2 rounded-xl text-center border border-white/10">
            <span class="text-[10px] text-slate-300 uppercase block">Temuan Red Flag</span>
            <span class="text-lg font-black text-rose-400">{{ redFlagCount }} Isu Kritis</span>
          </div>
          <div class="bg-white/10 px-3 py-2 rounded-xl text-center border border-white/10">
            <span class="text-[10px] text-slate-300 uppercase block">Checklist Clear</span>
            <span class="text-lg font-black text-emerald-400">{{ clearCount }} Aspek OK</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Checklist -->
    <div v-if="activeLDD" class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Checklist Uji Tuntas Aspek Legalitas</h3>
          <p class="text-xs text-slate-500">Klik tombol status untuk mengubah verifikasi (OK / FLAG / N/A)</p>
        </div>
        <button
          @click="isAddItemModalOpen = true"
          class="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer flex items-center gap-1"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Butir Audit</span>
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Kategori Aspek</th>
              <th class="py-3 px-4">Uraian Pemeriksaan Dokumen</th>
              <th class="py-3 px-4">Catatan Telaah & Risiko</th>
              <th class="py-3 px-4 text-center">Status Verifikasi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in activeLDD.checklist" :key="item.id" class="hover:bg-slate-50">
              <td class="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">{{ item.category }}</td>
              <td class="py-3.5 px-4 min-w-[200px] text-slate-700">{{ item.item }}</td>
              <td class="py-3.5 px-4 text-xs text-slate-600 min-w-[220px]">
                <span :class="item.status === 'FLAG' ? 'text-rose-700 font-semibold' : ''">
                  {{ item.notes || '-' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <button
                  @click="toggleStatus(item)"
                  :class="getBadgeClass(item.status)"
                  class="px-3 py-1 rounded-full text-xs font-black transition cursor-pointer hover:opacity-80"
                >
                  {{ item.status }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: Tambah Proyek LDD Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-emerald-400" />
            <h3 class="font-extrabold text-white text-base">Inisiasi Proyek Uji Tuntas (LDD)</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewLDD" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Nama Proyek LDD / Transaksi *</label>
            <input
              v-model="newLDDForm.projectName"
              type="text"
              required
              placeholder="Contoh: Akuisisi 60% Saham PT Barito Hydro Power"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Target Korporasi *</label>
              <input
                v-model="newLDDForm.targetCompany"
                type="text"
                required
                placeholder="PT Barito Hydro Power"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Lead Counsel</label>
              <input
                v-model="newLDDForm.leadCounsel"
                type="text"
                placeholder="Tim Legal M&A Corporate"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Tanggal Mulai</label>
              <input
                v-model="newLDDForm.startDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Target Penyelesaian</label>
              <input
                v-model="newLDDForm.targetCompletion"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
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
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Simpan Proyek
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Tambah Butir Audit LDD Baru -->
    <div
      v-if="isAddItemModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddItemModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <h3 class="font-extrabold text-white text-base">Tambah Butir Audit LDD</h3>
          <button @click="isAddItemModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitAddChecklistItem" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Kategori Aspek Audit *</label>
            <select
              v-model="newItemForm.category"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none"
            >
              <option value="Aspek Korporasi">Aspek Korporasi</option>
              <option value="Aspek Perizinan">Aspek Perizinan</option>
              <option value="Aspek Kontrak Material">Aspek Kontrak Material</option>
              <option value="Ketenagakerjaan">Ketenagakerjaan</option>
              <option value="Aset & Pertanahan">Aset & Pertanahan</option>
              <option value="Litigasi & Sengketa">Litigasi & Sengketa</option>
              <option value="Kepatuhan Lingkungan">Kepatuhan Lingkungan</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Uraian Pemeriksaan *</label>
            <input
              v-model="newItemForm.item"
              type="text"
              required
              placeholder="Misal: Uji keabsahan sertifikat tanah HGB pembangkit"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Status Awal</label>
            <select
              v-model="newItemForm.status"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none font-bold"
            >
              <option value="OK">OK (Memenuhi Syarat)</option>
              <option value="FLAG">FLAG (Temuan / Risiko)</option>
              <option value="NA">NA (Tidak Berlaku)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Catatan Hasil Telaah</label>
            <textarea
              v-model="newItemForm.notes"
              rows="2"
              placeholder="Catatan hasil verifikasi berkas..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              @click="isAddItemModalOpen = false"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Tambahkan Butir
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { Plus, FolderKanban, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const lddList = computed(() => legalStore.state.ldd);
const selectedProjectId = ref(lddList.value[0]?.id || 'LDD-2026-001');
const isAddModalOpen = ref(false);
const isAddItemModalOpen = ref(false);

const newLDDForm = reactive({
  projectName: '',
  targetCompany: '',
  leadCounsel: 'Tim Legal M&A Corporate',
  startDate: new Date().toISOString().slice(0, 10),
  targetCompletion: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10)
});

const newItemForm = reactive({
  category: 'Aspek Korporasi',
  item: '',
  status: 'OK',
  notes: ''
});

function submitNewLDD() {
  const created = legalStore.addLDDProject({ ...newLDDForm });
  if (created && created.id) {
    selectedProjectId.value = created.id;
  }
  isAddModalOpen.value = false;
  newLDDForm.projectName = '';
  newLDDForm.targetCompany = '';
}

function submitAddChecklistItem() {
  if (!activeLDD.value) return;
  legalStore.addLDDChecklistItem(activeLDD.value.id, { ...newItemForm });
  isAddItemModalOpen.value = false;
  newItemForm.item = '';
  newItemForm.notes = '';
}

function confirmDeleteProject(p) {
  if (confirm(`Hapus proyek uji tuntas "${p.projectName}"?`)) {
    legalStore.deleteLDDProject(p.id);
  }
}

watch(lddList, (newList) => {
  if (!newList.some(p => p.id === selectedProjectId.value) && newList.length > 0) {
    selectedProjectId.value = newList[0].id;
  }
}, { deep: true });

const activeLDD = computed(() => {
  return lddList.value.find(p => p.id === selectedProjectId.value) || lddList.value[0];
});

const redFlagCount = computed(() => {
  if (!activeLDD.value || !activeLDD.value.checklist) return 0;
  return activeLDD.value.checklist.filter(c => c.status === 'FLAG').length;
});

const clearCount = computed(() => {
  if (!activeLDD.value || !activeLDD.value.checklist) return 0;
  return activeLDD.value.checklist.filter(c => c.status === 'OK').length;
});

function getBadgeClass(status) {
  switch (status) {
    case 'OK': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'FLAG': return 'bg-[#FFE4E6] text-[#9F1239] border border-rose-300 animate-pulse';
    case 'NA': return 'bg-slate-100 text-slate-600 border border-slate-200';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function toggleStatus(item) {
  const next = item.status === 'OK' ? 'FLAG' : item.status === 'FLAG' ? 'NA' : 'OK';
  if (activeLDD.value) {
    legalStore.toggleLDDChecklistItem(activeLDD.value.id, item.id, next);
  }
}
</script>
