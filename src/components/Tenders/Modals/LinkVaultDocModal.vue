<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/70 backdrop-blur-xs"
  >
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C7D2FE] space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div>
          <h3 class="text-base font-bold text-[#0F172A]">
            Tautkan Dokumen dari Bank Dokumen Kualifikasi
          </h3>
          <p class="text-xs text-[#475569] mt-0.5">
            Pilih dokumen master perseroan yang cocok untuk memenuhi syarat paket lelang ini.
          </p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div v-if="selectedItem" class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
        <div class="text-[#475569]">Paket Lelang: <strong class="text-[#0F172A]">{{ selectedItem.tenderNumber }}</strong></div>
        <div class="text-[#475569]">Dokumen yang Dibutuhkan:</div>
        <div class="font-bold text-[#0F172A] text-sm">{{ selectedItem.docName }}</div>
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-bold text-[#0F172A]">Pilih Berkas dari Bank Dokumen:</label>
        <div class="max-h-60 overflow-y-auto space-y-2 border border-[#E2E8F0] rounded-xl p-2">
          <div
            v-for="vDoc in legalStore.state.tenderVault"
            :key="vDoc.id"
            @click="selectedVaultDocId = vDoc.id"
            :class="selectedVaultDocId === vDoc.id ? 'bg-[#1E293B] text-white border-[#C7D2FE]' : 'hover:bg-slate-50 text-[#0F172A] border-slate-200'"
            class="p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between gap-2"
          >
            <div class="min-w-0">
              <div class="font-bold truncate" :class="selectedVaultDocId === vDoc.id ? 'text-white' : 'text-[#0F172A]'">
                {{ vDoc.name }}
              </div>
              <div class="text-[10px]" :class="selectedVaultDocId === vDoc.id ? 'text-slate-300' : 'text-[#475569]'">
                {{ vDoc.code }} • {{ vDoc.number }}
              </div>
            </div>
            <span
              v-if="selectedVaultDocId === vDoc.id"
              class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-[#0F172A]"
            >
              Dipilih
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer text-xs"
        >
          Batal
        </button>
        <button
          type="button"
          @click="executeLinkVaultDoc"
          :disabled="!selectedVaultDocId"
          class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs disabled:opacity-50"
        >
          Tautkan & Penuhi Dokumen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  selectedItem: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const selectedVaultDocId = ref(null);

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      selectedVaultDocId.value = legalStore.state.tenderVault?.[0]?.id || null;
    }
  }
);

function executeLinkVaultDoc() {
  if (!props.selectedItem || !selectedVaultDocId.value) return;
  legalStore.linkVaultDocToTender(selectedVaultDocId.value, props.selectedItem.tenderId);
  emit('close');
}
</script>
