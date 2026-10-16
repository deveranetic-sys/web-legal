<template>
  <div class="space-y-6">
    <!-- Info banner -->
    <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div class="flex items-start gap-3.5">
        <div class="w-11 h-11 rounded-xl bg-amber-100 text-[#92400E] flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-slate-900">Konfigurasi Alur Persetujuan Bertingkat (Chain Approval Engine)</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/60 text-amber-900 border border-amber-300">
              Multi-Tier Routing
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Konfigurasi alur otorisasi berjenjang (Maker ➔ Checker ➔ Approver) untuk seluruh modul operasional hukum: Permintaan Legal, Kontrak, Tender, Opini Hukum, dan Sengketa. Dokumen akan diteruskan otomatis berdasarkan hierarki peran yang ditentukan.
          </p>
        </div>
      </div>
      <button
        @click="$emit('open-add-flow-modal')"
        class="px-4 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start md:self-center"
      >
        <Plus class="w-4 h-4 stroke-[2.5]" />
        <span>+ Tambah Alur Baru</span>
      </button>
    </div>

    <!-- Filters & Search Bar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari alur, modul, atau peran..."
          class="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="filterModule"
          class="flex-1 sm:flex-none py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer font-medium text-slate-800"
        >
          <option value="ALL">Semua Modul</option>
          <option value="requests">Permintaan Legal</option>
          <option value="contracts">Manajemen Kontrak</option>
          <option value="tenders">Tender & Pengadaan</option>
          <option value="opinions">Opini Hukum</option>
          <option value="disputes">Dispute & Litigasi</option>
        </select>

        <select
          v-model="filterStatus"
          class="flex-1 sm:flex-none py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer font-medium text-slate-800"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Hanya Aktif</option>
          <option value="INACTIVE">Hanya Nonaktif</option>
        </select>
      </div>
    </div>

    <!-- Approval Flows Grid -->
    <div v-if="filteredFlows.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div
        v-for="flow in filteredFlows"
        :key="flow.id"
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all"
      >
        <div class="space-y-4">
          <!-- Flow Card Header -->
          <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div class="flex items-start gap-3">
              <span class="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">{{ flow.icon || '⚖️' }}</span>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="text-sm font-bold text-slate-900">{{ flow.name }}</h4>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {{ flow.category || flow.module || 'Umum' }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {{ flow.description }}
                </p>
                <!-- Metadata Badges -->
                <div class="flex items-center gap-2 mt-2 flex-wrap text-[10px]">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1">
                    <Clock class="w-3 h-3 text-slate-500" />
                    SLA Global: {{ flow.slaDays || 3 }} Hari
                  </span>
                  <span v-if="flow.threshold && flow.threshold > 0" class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    Threshold: &gt; {{ formatThreshold(flow.threshold) }}
                  </span>
                  <span v-else class="px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 font-medium border border-slate-200">
                    Tanpa Ambang Batas
                  </span>
                </div>
              </div>
            </div>

            <!-- Status Switch -->
            <div class="shrink-0 flex flex-col items-end gap-1.5">
              <span
                :class="flow.active ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
              >
                {{ flow.active ? 'AKTIF' : 'NONAKTIF' }}
              </span>
              <button
                @click="legalStore.toggleApprovalFlowStatus(flow.id)"
                class="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                {{ flow.active ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
            </div>
          </div>

          <!-- Flow Stepper Visualization -->
          <div class="space-y-2">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Urutan Persetujuan Bertingkat ({{ (flow.steps || []).length }} Tahap):</span>
              <span class="text-slate-500 font-medium">Maker ➔ Checker ➔ Approver</span>
            </div>

            <div class="flex items-center flex-wrap gap-2 pt-1">
              <template v-for="(step, sIdx) in (flow.steps || [])" :key="step.level">
                <div class="flex items-center gap-2">
                  <div
                    class="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 px-3 py-2 rounded-xl flex flex-col min-w-[130px] transition"
                  >
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-[9px] text-slate-500 font-bold">Tahap {{ step.level }}</span>
                      <span class="text-[9px] text-slate-400">{{ step.slaDays || 1 }}d SLA</span>
                    </div>
                    <span class="text-[11px] font-bold text-slate-900 truncate" :title="step.name">{{ step.name }}</span>
                    <span class="text-[10px] font-extrabold text-[#4338CA] mt-0.5">{{ step.roleRequired }}</span>
                  </div>
                  <svg v-if="sIdx < (flow.steps || []).length - 1" class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Flow Card Footer -->
        <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div class="text-[10px] text-slate-400">
            Terakhir diubah: <span class="font-medium text-slate-600">{{ flow.lastUpdated || '2026-10-15' }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="confirmDeleteFlow(flow)"
              class="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1"
              title="Hapus Alur Persetujuan"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>

            <button
              @click="$emit('open-edit-flow-modal', flow)"
              class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Edit3 class="w-3.5 h-3.5" />
              <span>Edit Alur</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <Search class="w-6 h-6" />
      </div>
      <h4 class="text-sm font-bold text-slate-900">Tidak ada alur persetujuan yang cocok</h4>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Silakan ubah filter kata kunci pencarian atau buat alur persetujuan baru untuk modul hukum yang diinginkan.
      </p>
      <button
        @click="$emit('open-add-flow-modal')"
        class="px-4 py-2 bg-[#4338CA] text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
      >
        <Plus class="w-4 h-4 stroke-[2.5]" />
        <span>Buat Alur Baru</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus, Search, Clock, Edit3, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const emit = defineEmits(['open-edit-flow-modal', 'open-add-flow-modal']);

const searchQuery = ref('');
const filterModule = ref('ALL');
const filterStatus = ref('ALL');

const flows = computed(() => legalStore.state.approvalFlows || []);

const filteredFlows = computed(() => {
  return flows.value.filter(flow => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchQuery = !q ||
      (flow.name && flow.name.toLowerCase().includes(q)) ||
      (flow.description && flow.description.toLowerCase().includes(q)) ||
      (flow.category && flow.category.toLowerCase().includes(q)) ||
      (flow.steps && flow.steps.some(s => s.roleRequired && s.roleRequired.toLowerCase().includes(q)));

    let matchModule = true;
    if (filterModule.value !== 'ALL') {
      matchModule = flow.module === filterModule.value;
    }

    let matchStatus = true;
    if (filterStatus.value === 'ACTIVE') {
      matchStatus = !!flow.active;
    } else if (filterStatus.value === 'INACTIVE') {
      matchStatus = !flow.active;
    }

    return matchQuery && matchModule && matchStatus;
  });
});

function formatThreshold(val) {
  if (!val) return 'Rp 0';
  if (typeof val === 'string') return val;
  if (val >= 1000000000) {
    return `Rp ${(val / 1000000000).toLocaleString('id-ID')} Miliar`;
  }
  if (val >= 1000000) {
    return `Rp ${(val / 1000000).toLocaleString('id-ID')} Juta`;
  }
  return `Rp ${val.toLocaleString('id-ID')}`;
}

async function confirmDeleteFlow(flow) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Alur Persetujuan?',
    message: `Apakah Anda yakin ingin menghapus alur "${flow.name}"? Pengajuan baru untuk modul terkait tidak akan dapat menggunakan alur ini.`,
    confirmText: 'Ya, Hapus Alur',
    cancelText: 'Batal',
    variant: 'danger'
  });

  if (confirmed) {
    legalStore.deleteApprovalFlow(flow.id);
  }
}
</script>
