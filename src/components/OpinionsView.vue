<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
            Kajian Yuridis Formal
          </span>
          <span class="text-xs text-slate-500 font-medium">Dokumen Opini Resmi Korporasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Legal Opinion (Pendapat Hukum)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Kajian yuridis tertulis atas isu hukum krusial perseroan, analisis kepatuhan peraturan perundang-undangan, dan rekomendasi mitigasi risiko.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0 flex-nowrap">
        <button
          @click="isAddModalOpen = true"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Susun Opini Baru</span>
        </button>
        <button
          @click="printOpinion"
          class="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <Printer class="w-4 h-4 text-slate-500" />
          <span>Cetak Opini</span>
        </button>
      </div>
    </div>

    <!-- Main 2-Column Layout: Left List, Right Active Document Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: List of Legal Opinions -->
      <div class="lg:col-span-4 space-y-3">
        <div
          v-for="op in opinions"
          :key="op.id"
          @click="selectedOpinion = op"
          :class="selectedOpinion?.id === op.id ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'"
          class="p-4 rounded-2xl border transition cursor-pointer space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-[10px] font-bold text-slate-500">{{ op.id }}</span>
            <span
              :class="getApprovalBadge(op.approval)"
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
            >
              {{ op.approval }}
            </span>
          </div>

          <h4 class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">{{ op.title || op.issue || op.subject }}</h4>
          <p class="text-[11px] text-slate-500">Pemohon: {{ op.requestor }} • {{ op.date }}</p>
        </div>
      </div>

      <!-- Right Column: Formal Legal Opinion Document View -->
      <div v-if="selectedOpinion" class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <!-- Letterhead Simulation -->
        <div class="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div class="text-xs font-mono font-bold text-slate-500 tracking-wider">MEMORANDUM PENDAPAT HUKUM (LEGAL OPINION)</div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">{{ selectedOpinion.title || selectedOpinion.issue }}</h2>
            <div class="text-xs text-slate-500 mt-1">Ref: {{ selectedOpinion.opinionNumber || selectedOpinion.id }} • Tanggal: {{ selectedOpinion.date }} • Entitas: {{ selectedOpinion.company }}</div>
          </div>
          <div class="text-right flex items-center gap-2">
            <button
              @click="openEditOpinion(selectedOpinion)"
              class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs border border-amber-200 flex items-center gap-1 cursor-pointer"
              title="Edit Naskah Opini"
            >
              <Pencil class="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              @click="confirmDeleteOpinion(selectedOpinion)"
              class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer"
              title="Hapus Opini"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
            <span :class="getApprovalBadge(selectedOpinion.approval)" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
              {{ selectedOpinion.approval }}
            </span>
          </div>
        </div>

        <!-- Section I: Pokok Permasalahan -->
        <div>
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">I. Pokok Permasalahan Yuridis</h4>
          <p class="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {{ selectedOpinion.question || selectedOpinion.background }}
          </p>
        </div>

        <!-- Section II: Analisis Hukum -->
        <div>
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">II. Analisis & Dasar Hukum Positif</h4>
          <div class="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
            {{ selectedOpinion.legalAnalysis }}
          </div>
        </div>

        <!-- Section III: Kesimpulan & Rekomendasi -->
        <div class="p-4 rounded-xl bg-emerald-50/70 border border-[#BBF7D0] space-y-2">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-900">III. Kesimpulan Hukum & Rekomendasi Mitigasi</h4>
          <div class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {{ selectedOpinion.conclusion }}
          </div>
          <p class="text-xs text-emerald-800 mt-2 italic font-semibold">
            Rekomendasi: {{ selectedOpinion.recommendation }}
          </p>
        </div>

        <!-- Approval Action Bar for Legal Manager / General Counsel -->
        <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div class="text-xs text-slate-500">
            Penyusun: <span class="font-bold text-slate-700">{{ selectedOpinion.author }}</span> • Reviewer: <span class="font-bold text-slate-700">{{ selectedOpinion.reviewer }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="selectedOpinion.approval !== 'APPROVED'"
              @click="approveOpinion"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Setujui Opini (Approve)
            </button>
            <span v-else class="text-xs text-emerald-700 font-bold flex items-center gap-1">
              ✓ Telah Disahkan oleh Head of Legal
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL: Susun Opini Hukum Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-emerald-400" />
            <h3 class="font-extrabold text-white text-base">Susun Legal Opinion Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewOpinion" class="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Judul / Perihal Kajian Opini *</label>
            <input
              v-model="newOpForm.title"
              type="text"
              required
              placeholder="Contoh: Legal Opinion atas Keabsahan Pengalihan Saham Minoritas"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-semibold"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Pihak Pemohon (Requestor) *</label>
              <input
                v-model="newOpForm.requestor"
                type="text"
                required
                placeholder="Direksi / Divisi Komersial"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Entitas Perseroan</label>
              <select
                v-model="newOpForm.company"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 outline-none"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Indo Mineral Tambang">PT Indo Mineral Tambang</option>
                <option value="PT Trans Nusantara Logistik">PT Trans Nusantara Logistik</option>
                <option value="PT Energi Hijau Persada">PT Energi Hijau Persada</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">I. Pokok Permasalahan Yuridis *</label>
            <textarea
              v-model="newOpForm.background"
              required
              rows="2"
              placeholder="Latar belakang isu atau pertanyaan yuridis yang diajukan..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">II. Analisis & Dasar Hukum Positif *</label>
            <textarea
              v-model="newOpForm.legalAnalysis"
              required
              rows="3"
              placeholder="Uraian analisis pasal, peraturan perundang-undangan, dan doktrin hukum..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">III. Kesimpulan Hukum *</label>
              <textarea
                v-model="newOpForm.conclusion"
                required
                rows="2"
                placeholder="Kesimpulan hukum akhir..."
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
              ></textarea>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Rekomendasi Mitigasi *</label>
              <textarea
                v-model="newOpForm.recommendation"
                required
                rows="2"
                placeholder="Langkah aksi praktis mitigasi..."
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
              ></textarea>
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
              Simpan Opini
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Edit Opini Hukum -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isEditModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Pencil class="w-5 h-5 text-amber-400" />
            <h3 class="font-extrabold text-white text-base">Perbarui Naskah Legal Opinion</h3>
          </div>
          <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitEditOpinion" class="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Judul / Perihal Kajian Opini *</label>
            <input
              v-model="editOpForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-semibold"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Pihak Pemohon</label>
              <input
                v-model="editOpForm.requestor"
                type="text"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Status Pengesahan (Approval)</label>
              <select
                v-model="editOpForm.approval"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 outline-none font-bold"
              >
                <option value="APPROVED">APPROVED (Disetujui)</option>
                <option value="PENDING_APPROVAL">PENDING_APPROVAL (Menunggu Telaah)</option>
                <option value="REVISION">REVISION (Perlu Revisi)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">I. Pokok Permasalahan Yuridis *</label>
            <textarea
              v-model="editOpForm.background"
              required
              rows="2"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">II. Analisis & Dasar Hukum Positif *</label>
            <textarea
              v-model="editOpForm.legalAnalysis"
              required
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">III. Kesimpulan Hukum *</label>
              <textarea
                v-model="editOpForm.conclusion"
                required
                rows="2"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
              ></textarea>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Rekomendasi Mitigasi *</label>
              <textarea
                v-model="editOpForm.recommendation"
                required
                rows="2"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
              ></textarea>
            </div>
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
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
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
import { ref, computed, reactive, watch } from 'vue';
import { Printer, Plus, Pencil, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const opinions = computed(() => legalStore.state.opinions);
const selectedOpinion = ref(opinions.value[0] || null);

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

const newOpForm = reactive({
  title: '',
  requestor: 'Direksi / Unit Bisnis',
  company: 'PT Nusantara Energi',
  background: '',
  legalAnalysis: '',
  conclusion: '',
  recommendation: ''
});

const editOpForm = reactive({
  id: '',
  title: '',
  requestor: '',
  background: '',
  legalAnalysis: '',
  conclusion: '',
  recommendation: '',
  approval: 'PENDING_APPROVAL'
});

watch(opinions, (newList) => {
  if (!newList.some(o => o.id === selectedOpinion.value?.id) && newList.length > 0) {
    selectedOpinion.value = newList[0];
  }
}, { deep: true });

function getApprovalBadge(status) {
  switch (status) {
    case 'APPROVED': return 'bg-[#DCFCE7] text-[#166534]';
    case 'PENDING_APPROVAL': return 'bg-[#FEF3C7] text-[#92400E] animate-pulse';
    case 'REVISION': return 'bg-[#FFE4E6] text-[#9F1239]';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function submitNewOpinion() {
  const created = legalStore.addOpinion({ ...newOpForm });
  if (created) {
    selectedOpinion.value = created;
  }
  isAddModalOpen.value = false;
  newOpForm.title = '';
  newOpForm.background = '';
  newOpForm.legalAnalysis = '';
  newOpForm.conclusion = '';
  newOpForm.recommendation = '';
}

function openEditOpinion(op) {
  Object.assign(editOpForm, {
    id: op.id,
    title: op.title || op.issue || '',
    requestor: op.requestor || '',
    background: op.background || op.question || '',
    legalAnalysis: op.legalAnalysis || '',
    conclusion: op.conclusion || '',
    recommendation: op.recommendation || '',
    approval: op.approval || 'PENDING_APPROVAL'
  });
  isEditModalOpen.value = true;
}

function submitEditOpinion() {
  legalStore.updateOpinion(editOpForm.id, { ...editOpForm });
  if (selectedOpinion.value && selectedOpinion.value.id === editOpForm.id) {
    Object.assign(selectedOpinion.value, { ...editOpForm });
  }
  isEditModalOpen.value = false;
}

function confirmDeleteOpinion(op) {
  if (confirm(`Hapus opini hukum "${op.title || op.issue}"?`)) {
    legalStore.deleteOpinion(op.id);
  }
}

function approveOpinion() {
  if (selectedOpinion.value) {
    legalStore.updateOpinionApproval(selectedOpinion.value.id, 'APPROVED');
    selectedOpinion.value.approval = 'APPROVED';
  }
}

function printOpinion() {
  window.print();
}
</script>
