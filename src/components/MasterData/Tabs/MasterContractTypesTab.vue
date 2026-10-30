<template>
  <div class="space-y-4 animate-in fade-in duration-150">
    <!-- Context Banner -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-50 text-[#4338CA] border border-indigo-100 flex items-center justify-center shrink-0">
          <FileSignature class="w-4 h-4" />
        </div>
        <p class="text-[#475569] leading-relaxed">
          Cetak biru (blueprint) kontrak korporasi yang diterapkan otomatis saat tender dinyatakan <strong>Menang (Won)</strong>.
          <span class="text-[#4338CA] font-semibold block sm:inline sm:ml-1">Klik pada item untuk membaca klausul & termin lengkap.</span>
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-xs text-[#64748B] font-medium">
          Total: <strong class="text-[#0F172A]">{{ filteredContractTypes.length }}</strong> dari {{ masterContractTypes.length }} Tipe
        </span>
      </div>
    </div>

    <!-- Search, Filter & View Controls -->
    <div class="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari kode, nama tipe kontrak, atau standar acuan..."
          class="w-full pl-9 pr-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
        />
      </div>

      <!-- Controls: Sector Filter, View Mode, Add Button -->
      <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <select
          v-model="filterSector"
          class="form-select text-xs h-[38px] min-w-[150px] border-[#CBD5E1] rounded-xl font-semibold text-[#0F172A]"
        >
          <option value="ALL">Semua Sektor ({{ masterContractTypes.length }})</option>
          <option v-for="s in masterSectors" :key="s.code" :value="s.code">
            {{ s.name }} ({{ s.code }})
          </option>
        </select>

        <!-- View Switcher -->
        <div class="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-white text-[#4338CA] shadow-2xs font-bold' : 'text-slate-500 hover:text-[#0F172A] font-medium'"
            class="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Tampilan Kartu (Direkomendasikan)"
          >
            <LayoutGrid class="w-3.5 h-3.5" />
            <span class="hidden md:inline">Kartu</span>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-white text-[#4338CA] shadow-2xs font-bold' : 'text-slate-500 hover:text-[#0F172A] font-medium'"
            class="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Tampilan Baris Sederhana"
          >
            <List class="w-3.5 h-3.5" />
            <span class="hidden md:inline">Baris</span>
          </button>
        </div>

        <button
          @click="openAddModal"
          class="px-3.5 h-[38px] bg-[#4338CA] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Tipe Kontrak</span>
        </button>
      </div>
    </div>

    <!-- VIEW MODE 1: High-Readability Card Grid (Default) -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ct in filteredContractTypes"
        :key="ct.id"
        @click="openDetailModal(ct)"
        class="group bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#818CF8] hover:shadow-md hover:bg-indigo-50/20 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative"
      >
        <!-- Top Row: Code Badge, Sector & Actions -->
        <div>
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                {{ ct.code }}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Sektor {{ ct.sector }}
              </span>
            </div>

            <!-- Edit & Delete Buttons (with click.stop to avoid triggering detail) -->
            <div class="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
              <button
                @click.stop="openEditModal(ct)"
                class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                title="Edit Tipe Kontrak"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                @click.stop="confirmDeleteContractType(ct)"
                class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Hapus Tipe Kontrak"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Contract Title -->
          <h3 class="text-sm font-extrabold text-[#0F172A] group-hover:text-[#4338CA] transition-colors mt-3 leading-snug">
            {{ ct.name }}
          </h3>

          <!-- Standard Format -->
          <div class="text-[11px] text-[#64748B] font-medium flex items-center gap-1.5 mt-1.5">
            <BookOpen class="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span class="truncate">Acuan: <strong>{{ ct.standardFormat || 'Standar Korporasi Internal' }}</strong></span>
          </div>

          <!-- Brief Scope Summary -->
          <p class="text-xs text-[#475569] mt-2.5 line-clamp-2 leading-relaxed">
            {{ ct.description || 'Kontrak standar pelaksanaan pengadaan barang dan jasa korporasi.' }}
          </p>
        </div>

        <!-- Bottom Row: Click affordance & Status -->
        <div class="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
          <span class="text-[11px] font-bold text-[#4338CA] group-hover:underline flex items-center gap-1">
            <span>Lihat Detail & Klausul</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>

          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="ct.active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'"
          >
            {{ ct.active !== false ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 2: Clean Streamlined Row Table (Click row to view detail) -->
    <div v-else class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
          <tr>
            <th class="py-3 px-4">Tipe Kontrak</th>
            <th class="py-3 px-4">Sektor Industri</th>
            <th class="py-3 px-4">Standar Format Acuan</th>
            <th class="py-3 px-4 text-center">Status</th>
            <th class="py-3 px-4 text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E8F0]">
          <tr
            v-for="ct in filteredContractTypes"
            :key="ct.id"
            @click="openDetailModal(ct)"
            class="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
            title="Klik baris untuk melihat detail dan klausul lengkap"
          >
            <!-- Code & Name -->
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-2.5">
                <span class="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] shrink-0">
                  {{ ct.code }}
                </span>
                <div>
                  <div class="font-bold text-[#0F172A] group-hover:text-[#4338CA] transition-colors leading-snug">
                    {{ ct.name }}
                  </div>
                  <div class="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                    {{ ct.description || 'Kontrak standar pelaksanaan pengadaan barang dan jasa.' }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Sector -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {{ ct.sector }}
              </span>
            </td>

            <!-- Standard Format -->
            <td class="py-3.5 px-4 text-[#475569] font-medium">
              {{ ct.standardFormat || 'Standar Korporasi Internal' }}
            </td>

            <!-- Status -->
            <td class="py-3.5 px-4 text-center whitespace-nowrap">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="ct.active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'"
              >
                {{ ct.active !== false ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>

            <!-- Actions (with click.stop) -->
            <td class="py-3.5 px-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click.stop="openDetailModal(ct)"
                  class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                  title="Lihat Detail & Klausul Lengkap"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click.stop="openEditModal(ct)"
                  class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                  title="Edit Tipe Kontrak"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  @click.stop="confirmDeleteContractType(ct)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Hapus Tipe Kontrak"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredContractTypes.length === 0"
      class="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3"
    >
      <div class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
        <FileSignature class="w-6 h-6" />
      </div>
      <div>
        <h4 class="text-sm font-bold text-[#0F172A]">Tidak ada tipe kontrak yang sesuai</h4>
        <p class="text-xs text-[#64748B] mt-0.5">
          Coba sesuaikan kata kunci pencarian atau filter sektor industri.
        </p>
      </div>
      <button
        @click="resetFilters"
        class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
      >
        Reset Filter
      </button>
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
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  BookOpen,
  ArrowRight,
  LayoutGrid,
  List
} from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';
import ContractTypeDetailModal from '../Modals/ContractTypeDetailModal.vue';
import AddContractTypeModal from '../Modals/AddContractTypeModal.vue';

const searchQuery = ref('');
const filterSector = ref('ALL');
const viewMode = ref('grid'); // 'grid' (card view) or 'list' (clean row table)

const isModalOpen = ref(false);
const selectedContractForEdit = ref(null);
const selectedContractForDetail = ref(null);

const masterContractTypes = computed(() => legalStore.state.masterContractTypes || []);
const masterSectors = computed(() => legalStore.state.masterSectors || []);

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

function resetFilters() {
  searchQuery.value = '';
  filterSector.value = 'ALL';
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
