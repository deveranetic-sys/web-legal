<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="pb-4 border-b border-[#E2E8F0] space-y-3.5">
      <!-- Tulisan Diatas -->
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
            Uji Tuntas Hukum & Transaksi Korporasi
          </span>
          <span class="text-xs text-[#64748B] font-medium">M&A, Ekuitas & Proyek Investasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Legal Due Diligence (LDD Workspace)
        </h1>
        <p class="text-xs sm:text-sm text-[#475569] mt-1 max-w-3xl leading-relaxed">
          Pemeriksaan komprehensif kepatuhan aspek korporasi, perizinan, aset, kontrak material, sengketa, dan ketenagakerjaan target.
        </p>
      </div>

      <!-- Controls: Dropdown dan Dua Button Diletakkan di Ujung Bawah Tulisan Diatas -->
      <div class="flex flex-wrap items-center gap-2.5 pt-0.5">
        <!-- Project Selector (Input Group: Prefix Terpisah, Zero Overlap) -->
        <div class="flex items-center rounded-lg border border-[#CBD5E1] bg-white h-[38px] shadow-2xs hover:border-[#94A3B8] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-500/15 transition overflow-hidden w-auto min-w-[260px] sm:min-w-[340px] md:min-w-[420px] max-w-[560px]">
          <div class="flex items-center gap-1.5 px-3 bg-[#F8FAFC] border-r border-[#E2E8F0] h-full text-[#64748B] text-xs font-semibold shrink-0 select-none">
            <FolderKanban class="w-4 h-4 text-[#2563EB]" />
            <span>Proyek:</span>
          </div>
          <div class="relative flex items-center flex-1 min-w-0 h-full">
            <select
              v-model="selectedProjectId"
              class="w-full h-full bg-transparent text-xs font-bold text-[#0F172A] pl-3 pr-8 outline-none cursor-pointer appearance-none truncate"
              title="Pilih Proyek Uji Tuntas LDD"
            >
              <option v-for="item in lddList" :key="item.id" :value="item.id">
                {{ item.projectName || item.project }}
              </option>
            </select>
            <ChevronDown class="w-4 h-4 text-[#64748B] absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        <!-- Hapus Proyek (Danger Action) -->
        <button
          v-if="activeLDD"
          @click="confirmDeleteProject(activeLDD)"
          class="inline-flex items-center gap-1.5 px-3.5 h-[38px] rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer whitespace-nowrap"
          title="Hapus Proyek LDD Ini"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Hapus Proyek</span>
        </button>

        <!-- Tambah Proyek (Primary CTA) -->
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-1.5 px-4 h-[38px] rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Proyek</span>
        </button>
      </div>
    </div>

    <!-- Active LDD Project Details -->
    <div v-if="activeLDD" class="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-md space-y-3">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span class="text-xs text-emerald-400 font-mono tracking-wider">PROJECT CODE: {{ activeLDD.id }}</span>
          <h2 class="text-xl sm:text-2xl font-black mt-1">{{ activeLDD.projectName || activeLDD.project }}</h2>
          <p class="text-xs text-slate-300 mt-0.5">Target Perusahaan: <span class="font-bold text-white">{{ activeLDD.targetCompany }}</span> • Lead Counsel: {{ activeLDD.leadCounsel || activeLDD.pic }}</p>
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
    <div v-if="activeLDD" class="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div class="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-[#0F172A] text-sm">Checklist Uji Tuntas Aspek Legalitas</h3>
          <p class="text-xs text-[#64748B]">Klik tombol badge status untuk mengubah verifikasi (OK / FLAG / N/A)</p>
        </div>
        <button
          @click="isAddItemModalOpen = true"
          class="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus class="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Tambah Butir Audit</span>
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-[#F8FAFC] text-[#64748B] text-xs uppercase font-bold border-b border-[#E2E8F0]">
            <tr>
              <th class="py-3 px-4">Kategori Aspek</th>
              <th class="py-3 px-4">Uraian Pemeriksaan Dokumen</th>
              <th class="py-3 px-4">Catatan Telaah & Risiko</th>
              <th class="py-3 px-4 text-center">Status Verifikasi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F1F5F9]">
            <tr v-for="item in activeLDD.checklist" :key="item.id" class="hover:bg-[#F8FAFC] transition-colors">
              <td class="py-3.5 px-4 font-bold text-[#0F172A] whitespace-nowrap">{{ item.category }}</td>
              <td class="py-3.5 px-4 min-w-[200px] text-[#334155] font-medium">{{ item.item }}</td>
              <td class="py-3.5 px-4 text-xs text-[#64748B] min-w-[220px]">
                <span :class="item.status === 'FLAG' ? 'text-rose-700 font-semibold' : ''">
                  {{ item.notes || '-' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <button
                  @click="toggleStatus(item)"
                  :class="getBadgeClass(item.status)"
                  class="px-3 py-1 rounded-full text-xs font-black transition cursor-pointer hover:opacity-85 shadow-2xs"
                  title="Klik untuk ubah verifikasi"
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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#CBD5E1]">
        <div class="px-6 py-4 bg-white text-[#0F172A] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-[#2563EB]" />
            <h3 class="font-bold text-[#0F172A] text-base">Inisiasi Proyek Uji Tuntas (LDD)</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewLDD" class="p-6 space-y-4 text-xs sm:text-sm overflow-y-auto">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Proyek LDD / Transaksi *</label>
            <input
              v-model="newLDDForm.projectName"
              type="text"
              required
              placeholder="Contoh: Akuisisi 60% Saham PT Barito Hydro Power"
              class="form-input"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Target Korporasi *</label>
              <input
                v-model="newLDDForm.targetCompany"
                type="text"
                required
                placeholder="PT Barito Hydro Power"
                class="form-input"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Lead Counsel</label>
              <input
                v-model="newLDDForm.leadCounsel"
                type="text"
                placeholder="Tim Legal M&A Corporate"
                class="form-input"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tanggal Mulai</label>
              <input
                v-model="newLDDForm.startDate"
                type="date"
                required
                class="form-input"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Target Penyelesaian</label>
              <input
                v-model="newLDDForm.targetCompletion"
                type="date"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer shadow-xs transition text-xs"
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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddItemModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#CBD5E1]">
        <div class="px-6 py-4 bg-white text-[#0F172A] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-[#2563EB]" />
            <h3 class="font-bold text-[#0F172A] text-base">Tambah Butir Audit LDD</h3>
          </div>
          <button @click="isAddItemModalOpen = false" class="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitAddChecklistItem" class="p-6 space-y-4 text-xs sm:text-sm overflow-y-auto">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kategori Aspek Audit *</label>
            <select
              v-model="newItemForm.category"
              class="form-select text-xs font-semibold"
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
            <label class="block font-bold text-[#0F172A] mb-1">Uraian Pemeriksaan *</label>
            <input
              v-model="newItemForm.item"
              type="text"
              required
              placeholder="Misal: Uji keabsahan sertifikat tanah HGB pembangkit"
              class="form-input"
            />
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Status Awal</label>
            <select
              v-model="newItemForm.status"
              class="form-select text-xs font-bold"
            >
              <option value="OK">OK (Memenuhi Syarat)</option>
              <option value="FLAG">FLAG (Temuan / Risiko)</option>
              <option value="NA">NA (Tidak Berlaku)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan Hasil Telaah</label>
            <textarea
              v-model="newItemForm.notes"
              rows="2"
              placeholder="Catatan hasil verifikasi berkas..."
              class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddItemModalOpen = false"
              class="px-4 py-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer shadow-xs transition text-xs"
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
import { Plus, FolderKanban, Trash2, ChevronDown } from 'lucide-vue-next';
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

async function confirmDeleteProject(p) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Proyek LDD',
    message: `Apakah Anda yakin ingin menghapus proyek uji tuntas "${p.projectName}"?`,
    confirmText: 'Ya, Hapus',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteLDDProject(p.id);
  }
}

watch(() => lddList.value.map(p => p.id).join(','), () => {
  if (!lddList.value.some(p => p.id === selectedProjectId.value) && lddList.value.length > 0) {
    selectedProjectId.value = lddList.value[0].id;
  }
});

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
