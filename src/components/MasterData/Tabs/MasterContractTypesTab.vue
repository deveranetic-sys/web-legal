<template>
  <div class="space-y-4 animate-in fade-in duration-150">
    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-[#64748B] block">Total Blueprint Tipe Kontrak</span>
          <div class="text-xl font-black text-[#0F172A] mt-0.5">{{ masterContractTypes.length }} Tipe</div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-indigo-50 text-[#4338CA] border border-indigo-100 flex items-center justify-center">
          <FileSignature class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-[#64748B] block">Sektor Industri Terkait</span>
          <div class="text-xl font-black text-indigo-700 mt-0.5">{{ uniqueSectorsCount }} Sektor</div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
          <Layers class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-[#64748B] block">Penyelesaian Sengketa Utama</span>
          <div class="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
            <Scale class="w-3.5 h-3.5 text-indigo-600" />
            <span>BANI, SIAC & Arbitrase</span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
          <ShieldCheck class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 flex-1 max-w-md">
        <div class="relative w-full">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kode, nama kontrak, atau standar acuan..."
            class="w-full pl-9 pr-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <select
          v-model="filterSector"
          class="form-select text-xs h-[38px] min-w-[140px] border-[#CBD5E1] rounded-xl font-semibold text-[#0F172A]"
        >
          <option value="ALL">Semua Sektor</option>
          <option v-for="s in masterSectors" :key="s.code" :value="s.code">
            {{ s.name }} ({{ s.code }})
          </option>
        </select>

        <button
          @click="openAddModal"
          class="px-3.5 h-[38px] bg-[#4338CA] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Tipe Kontrak</span>
        </button>
      </div>
    </div>

    <!-- Contract Types Table -->
    <div class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
          <tr>
            <th class="py-3 px-4">Kode & Nama Tipe Kontrak</th>
            <th class="py-3 px-4">Sektor & Format Acuan</th>
            <th class="py-3 px-4">Skema Termin & Retensi</th>
            <th class="py-3 px-4">Forum Sengketa</th>
            <th class="py-3 px-4 text-center">Status</th>
            <th class="py-3 px-4 text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E8F0]">
          <tr
            v-for="ct in filteredContractTypes"
            :key="ct.id"
            class="hover:bg-[#F8FAFC] transition-colors"
          >
            <td class="py-3.5 px-4">
              <div class="flex items-start gap-2">
                <span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-50 text-[#4338CA] border border-indigo-200 shrink-0 mt-0.5">
                  {{ ct.code }}
                </span>
                <div>
                  <div class="font-bold text-[#0F172A] leading-snug">{{ ct.name }}</div>
                  <div class="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                    {{ ct.description || 'Kontrak standar pengadaan korporasi.' }}
                  </div>
                </div>
              </div>
            </td>

            <td class="py-3.5 px-4 whitespace-nowrap">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                {{ ct.sector }}
              </span>
              <div class="text-[11px] text-[#475569] font-medium">
                {{ ct.standardFormat || 'Standar Internal' }}
              </div>
            </td>

            <td class="py-3.5 px-4">
              <div class="font-semibold text-[#0F172A] text-[11px]">
                {{ ct.paymentType || 'Milestone Berita Acara' }}
              </div>
              <div class="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                <span class="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  Retensi {{ ct.retentionPercent || 0 }}%
                </span>
                <span v-if="ct.retentionPeriodDays">({{ ct.retentionPeriodDays }} Hari)</span>
              </div>
            </td>

            <td class="py-3.5 px-4">
              <div class="text-[11px] text-[#0F172A] font-semibold flex items-center gap-1">
                <Gavel class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span class="line-clamp-1">{{ ct.disputeForum || 'BANI / PN' }}</span>
              </div>
              <div class="text-[10px] text-[#64748B] mt-0.5">
                {{ ct.governingLaw || 'Hukum RI' }}
              </div>
            </td>

            <td class="py-3.5 px-4 text-center whitespace-nowrap">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="ct.active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'"
              >
                {{ ct.active !== false ? 'Aktif' : 'Non-Aktif' }}
              </span>
            </td>

            <td class="py-3.5 px-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click="openDetailModal(ct)"
                  class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                  title="Lihat Detail & Pratinjau Klausul Kontrak"
                >
                  <Eye class="w-4 h-4" />
                </button>

                <button
                  @click="openEditModal(ct)"
                  class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                  title="Edit Master Tipe Kontrak"
                >
                  <Pencil class="w-4 h-4" />
                </button>

                <button
                  @click="confirmDeleteContractType(ct)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Hapus Tipe Kontrak"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredContractTypes.length === 0">
            <td colspan="6" class="py-8 text-center text-[#64748B]">
              <FileSignature class="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p class="font-bold">Tidak ada tipe kontrak yang sesuai pencarian</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Silakan reset kata kunci pencarian atau tambah tipe kontrak baru.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <ContractTypeDetailModal
      v-if="selectedContractForDetail"
      :contract-type="selectedContractForDetail"
      @close="selectedContractForDetail = null"
      @edit="handleEditFromDetail"
    />

    <!-- Add / Edit Modal -->
    <AddContractTypeModal
      v-if="isModalOpen"
      :contract-type-to-edit="selectedContractForEdit"
      @close="closeAddEditModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  FileSignature,
  Layers,
  Scale,
  ShieldCheck,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Gavel
} from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';
import ContractTypeDetailModal from '../Modals/ContractTypeDetailModal.vue';
import AddContractTypeModal from '../Modals/AddContractTypeModal.vue';

const searchQuery = ref('');
const filterSector = ref('ALL');

const isModalOpen = ref(false);
const selectedContractForEdit = ref(null);
const selectedContractForDetail = ref(null);

const masterContractTypes = computed(() => legalStore.state.masterContractTypes || []);
const masterSectors = computed(() => legalStore.state.masterSectors || []);

const uniqueSectorsCount = computed(() => {
  const sectors = new Set(masterContractTypes.value.map(c => c.sector));
  return sectors.size;
});

const filteredContractTypes = computed(() => {
  return masterContractTypes.value.filter(ct => {
    const matchesSector = filterSector.value === 'ALL' || ct.sector === filterSector.value;
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return matchesSector;

    const matchesQuery =
      (ct.name && ct.name.toLowerCase().includes(query)) ||
      (ct.code && ct.code.toLowerCase().includes(query)) ||
      (ct.standardFormat && ct.standardFormat.toLowerCase().includes(query)) ||
      (ct.sector && ct.sector.toLowerCase().includes(query));

    return matchesSector && matchesQuery;
  });
});

function openAddModal() {
  selectedContractForEdit.value = null;
  isModalOpen.value = true;
}

function openEditModal(ct) {
  selectedContractForEdit.value = ct;
  isModalOpen.value = true;
}

function openDetailModal(ct) {
  selectedContractForDetail.value = ct;
}

function handleEditFromDetail(ct) {
  selectedContractForDetail.value = null;
  openEditModal(ct);
}

function closeAddEditModal() {
  isModalOpen.value = false;
  selectedContractForEdit.value = null;
}

function handleSaved() {
  closeAddEditModal();
}

async function confirmDeleteContractType(ct) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Tipe Kontrak?',
    message: `Hapus tipe kontrak "${ct.name}" (${ct.code}) dari master data? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: 'Ya, Hapus Tipe Kontrak',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteMasterContractType(ct.id);
  }
}
</script>
