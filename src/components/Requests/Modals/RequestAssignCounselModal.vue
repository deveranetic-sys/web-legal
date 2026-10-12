<template>
  <div
    v-if="request"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 border border-[#E2E8F0] space-y-4">
      <h3 class="font-bold text-[#0F172A] text-sm">Tugaskan PIC Legal Counsel</h3>
      <p class="text-xs text-[#475569]">Pilih personil legal internal yang bertanggung jawab menelaah berkas ini:</p>
      
      <select
        v-model="selectedCounsel"
        class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] font-medium"
      >
        <option value="Budi Santoso, S.H., LL.M.">Budi Santoso, S.H., LL.M. (Head of Legal)</option>
        <option value="Siti Rahmawati, S.H., M.H.">Siti Rahmawati, S.H., M.H. (Legal Operations)</option>
        <option value="Dimas Prasetyo, S.H.">Dimas Prasetyo, S.H. (Senior Counsel)</option>
        <option value="Anisa Maharani, S.H.">Anisa Maharani, S.H. (Legal Specialist)</option>
      </select>

      <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
        <button
          @click="$emit('close')"
          class="px-3 py-1.5 text-xs text-[#475569] hover:bg-slate-100 rounded-lg cursor-pointer transition"
        >
          Batal
        </button>
        <button
          @click="confirmAssign"
          class="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition shadow-xs"
        >
          Simpan Penugasan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  request: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const selectedCounsel = ref('Dimas Prasetyo, S.H.');

watch(
  () => props.request,
  (req) => {
    if (req) {
      selectedCounsel.value = req.assignedTo && req.assignedTo !== 'Unassigned' ? req.assignedTo : 'Dimas Prasetyo, S.H.';
    }
  },
  { immediate: true }
);

function confirmAssign() {
  if (props.request) {
    legalStore.assignRequestPIC(props.request.id, selectedCounsel.value);
    emit('close');
  }
}
</script>
