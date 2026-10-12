<template>
  <div class="space-y-4 animate-in fade-in duration-150">
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 text-xs">
      <p class="text-[#475569]">
        Tipe kontrak korporasi yang dihasilkan otomatis saat paket lelang dinyatakan <strong>Menang (Won)</strong> dan dikonversi ke Modul Kontrak.
      </p>
      <span class="text-[#475569] font-medium shrink-0">
        Total: <strong class="text-[#0F172A]">{{ masterContractTypes.length }}</strong> Tipe
      </span>
    </div>

    <div class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
          <tr>
            <th class="py-3 px-4">Kode & Nama Tipe Kontrak</th>
            <th class="py-3 px-4">Sektor Industri</th>
            <th class="py-3 px-4">Standar Format Acuan</th>
            <th class="py-3 px-4 text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E8F0]">
          <tr
            v-for="ct in masterContractTypes"
            :key="ct.id"
            class="hover:bg-[#F8FAFC] transition-colors"
          >
            <td class="py-3 px-4">
              <div class="font-bold text-[#0F172A]">{{ ct.name }}</div>
              <div class="font-mono text-[10px] text-[#4338CA] mt-0.5">{{ ct.code }}</div>
            </td>
            <td class="py-3 px-4 whitespace-nowrap">
              <span class="font-semibold text-[#0F172A]">{{ ct.sector }}</span>
            </td>
            <td class="py-3 px-4 text-[#475569]">
              {{ ct.standardFormat }}
            </td>
            <td class="py-3 px-4 text-right whitespace-nowrap">
              <button
                @click="confirmDeleteContractType(ct)"
                class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Hapus tipe kontrak"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const masterContractTypes = computed(() => legalStore.state.masterContractTypes || []);

async function confirmDeleteContractType(ct) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Tipe Kontrak?',
    message: `Hapus tipe kontrak "${ct.name}" dari master data?`,
    confirmText: 'Ya, Hapus Tipe Kontrak',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteMasterContractType(ct.id);
  }
}
</script>
