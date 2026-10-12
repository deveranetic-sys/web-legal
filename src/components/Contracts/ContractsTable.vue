<template>
  <div class="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs uppercase text-[#475569] font-semibold tracking-wider">
          <tr>
            <th scope="col" class="py-3 px-4">Nomor & ID</th>
            <th scope="col" class="py-3 px-4">Judul Kontrak & Entitas</th>
            <th scope="col" class="py-3 px-4">Mitra Rekanan</th>
            <th scope="col" class="py-3 px-4">Jenis</th>
            <th scope="col" class="py-3 px-4">Masa Berlaku</th>
            <th scope="col" class="py-3 px-4 text-right">Nilai Kontrak</th>
            <th scope="col" class="py-3 px-4 text-center">Status</th>
            <th scope="col" class="py-3 px-4 text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E8F0]">
          <tr
            v-for="contract in contracts"
            :key="contract.id"
            class="hover:bg-[#F8FAFC] transition-colors"
          >
            <!-- ID & Nomor -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="font-mono text-xs font-semibold text-[#0F172A] bg-blue-50 px-2 py-0.5 rounded border border-[#C7D2FE] w-fit">
                {{ contract.id }}
              </div>
              <div class="text-xs text-[#475569] mt-1 font-mono truncate max-w-[140px]" :title="contract.contractNumber">
                {{ contract.contractNumber }}
              </div>
            </td>

            <!-- Judul & Entitas -->
            <td class="py-3.5 px-4 min-w-[220px]">
              <div class="font-semibold text-[#0F172A] hover:text-[#6366F1] cursor-pointer transition-colors" @click="$emit('open-detail', contract)">
                {{ contract.contractTitle }}
              </div>
              <div class="flex items-center gap-1.5 mt-1 text-xs text-[#475569]">
                <Building2 class="w-3.5 h-3.5 text-[#475569]" />
                <span>{{ contract.company }}</span>
              </div>
            </td>

            <!-- Mitra Rekanan -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="font-medium text-[#0F172A]">{{ contract.counterparty }}</div>
              <div class="text-xs text-[#475569] mt-0.5 flex items-center gap-1">
                <span>PIC: {{ contract.pic || '-' }}</span>
              </div>
            </td>

            <!-- Tipe -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <span class="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-[#0F172A]">
                {{ contract.contractType }}
              </span>
            </td>

            <!-- Masa Berlaku -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="text-xs font-medium text-[#0F172A]">
                {{ formatDate(contract.expiryDate) }}
              </div>
              <!-- Sisa Hari Indicator -->
              <div class="mt-1">
                <span
                  v-if="getDaysRemaining(contract.expiryDate) < 0"
                  class="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded"
                >
                  Kedaluwarsa
                </span>
                <span
                  v-else-if="getDaysRemaining(contract.expiryDate) <= 7"
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded animate-pulse"
                >
                  Kritis (Sisa {{ getDaysRemaining(contract.expiryDate) }} Hari)
                </span>
                <span
                  v-else-if="getDaysRemaining(contract.expiryDate) <= 30"
                  class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded"
                >
                  Siaga (Sisa {{ getDaysRemaining(contract.expiryDate) }} Hari)
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 text-[11px] text-[#475569]"
                >
                  Sisa {{ getDaysRemaining(contract.expiryDate) }} Hari
                </span>
              </div>
            </td>

            <!-- Nilai Kontrak -->
            <td class="py-3.5 px-4 whitespace-nowrap text-right">
              <div class="font-semibold text-[#0F172A] font-mono text-xs">
                {{ formatIDR(contract.contractValue) }}
              </div>
              <div class="text-[11px] text-[#475569] mt-0.5">
                {{ contract.renewalStatus }}
              </div>
            </td>

            <!-- Status Badge -->
            <td class="py-3.5 px-4 whitespace-nowrap text-center">
              <span
                v-if="contract.status === 'ACTIVE'"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-[#BBF7D0]"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Aktif
              </span>
              <span
                v-else-if="contract.status === 'EXPIRING'"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-[#FDE68A]"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                Masa Siaga
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-[#475569] border border-[#E2E8F0]"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Kedaluwarsa
              </span>
            </td>

            <!-- Aksi -->
            <td class="py-3.5 px-4 whitespace-nowrap text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  @click="$emit('open-detail', contract)"
                  class="p-1.5 rounded-lg text-[#475569] hover:text-[#6366F1] hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Buka Lembar Telaah Detail"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  v-if="canCreateContract"
                  @click="$emit('open-edit', contract)"
                  class="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                  title="Edit Data Kontrak"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  v-if="canDeleteContract"
                  @click="confirmDelete(contract)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Kontrak (Izin Khusus)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="contracts.length === 0">
            <td colspan="8" class="py-12 text-center">
              <FileX class="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 class="text-base font-semibold text-[#0F172A]">Tidak ada kontrak yang sesuai</h4>
              <p class="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
                Kriteria pencarian atau filter yang Anda pilih saat ini tidak menemukan berkas perjanjian terkait.
              </p>
              <button
                @click="$emit('reset-filters')"
                class="mt-4 px-3 py-1.5 text-xs font-semibold text-[#4338CA] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer border border-[#C7D2FE]"
              >
                Reset Filter
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer -->
    <div class="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#475569]">
      <div>
        Menampilkan <span class="font-semibold text-[#0F172A]">{{ contracts.length }}</span> dari
        <span class="font-semibold text-[#0F172A]">{{ totalCount }}</span> entri register
      </div>
      <div class="flex items-center gap-1">
        <span class="text-[#475569]">Sistem terenkripsi AES-256 • Integritas Audit Trail Aktif</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Building2, Eye, Pencil, Trash2, FileX } from 'lucide-vue-next';
import { legalStore, formatIDR, calculateDaysRemaining } from '../../stores/legalStore';

const props = defineProps({
  contracts: {
    type: Array,
    required: true
  },
  totalCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['open-detail', 'open-edit', 'reset-filters']);

const canCreateContract = computed(() => {
  return legalStore.canAccess('Contract Management', 'create');
});

const canDeleteContract = computed(() => {
  return legalStore.canAccess('Contract Management', 'delete');
});

function getDaysRemaining(date) {
  return calculateDaysRemaining(date);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

async function confirmDelete(contract) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Kontrak Perjanjian?',
    message: `Apakah Anda yakin ingin menghapus kontrak "${contract.contractTitle}" (${contract.id})? Tindakan ini akan dicatat dalam Audit Trail.`,
    confirmText: 'Ya, Hapus Kontrak',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteContract(contract.id);
  }
}
</script>
