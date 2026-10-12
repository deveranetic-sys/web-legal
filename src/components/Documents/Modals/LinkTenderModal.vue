<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0]">
      <div class="px-6 py-4 bg-[#1E293B] text-white flex items-center justify-between border-b border-[#1E293B]">
        <div class="flex items-center gap-2">
          <Link2 class="w-4 h-4 text-[#6366F1]" />
          <h3 class="text-sm font-bold">Tautkan ke Paket Lelang</h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4 text-xs">
        <div v-if="selectedDoc" class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
          <div class="font-bold text-[#0F172A] text-sm">{{ selectedDoc.name }}</div>
          <div class="text-[#475569]">Kode: <span class="font-mono text-[#0F172A] font-bold">{{ selectedDoc.code }}</span> • {{ selectedDoc.number }}</div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Pilih Paket Lelang Sasaran *</label>
          <select
            v-model="targetTenderId"
            class="w-full py-2.5 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white text-[#0F172A] text-xs font-semibold"
          >
            <option v-for="t in tenders" :key="t.id" :value="t.id">
              {{ t.id }} - {{ t.title }} ({{ t.company }})
            </option>
          </select>
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
            @click="executeLinkToTender"
            class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs"
          >
            Tautkan Dokumen Sekarang
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { Link2, X } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  selectedDoc: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const tenders = computed(() => legalStore.state.tenders || []);
const targetTenderId = ref(null);

watch(
  () => props.isOpen,
  (val) => {
    if (val && tenders.value.length > 0) {
      targetTenderId.value = tenders.value[0].id;
    }
  },
  { immediate: true }
);

function executeLinkToTender() {
  if (!props.selectedDoc || !targetTenderId.value) return;
  legalStore.linkVaultDocToTender(props.selectedDoc.id, targetTenderId.value);
  emit('close');
}
</script>
