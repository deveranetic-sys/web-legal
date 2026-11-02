<template>
  <div
    v-if="request"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-floating max-w-sm w-full p-5 border border-[#E2E8F0] space-y-4">
      <div class="flex items-center gap-2.5 pb-2 border-b border-[#E2E8F0]">
        <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shrink-0">
          <UserCheck class="w-4 h-4 text-[#2563EB]" />
        </div>
        <div>
          <h3 class="font-bold text-[#0F172A] text-sm">Tugaskan PIC Legal Counsel</h3>
          <p class="text-[11px] text-[#64748B]">Tiket: {{ request.ticketNumber || request.id }}</p>
        </div>
      </div>

      <p class="text-xs text-[#475569]">
        Pilih personil legal internal yang bertanggung jawab menelaah berkas permohonan ini:
      </p>
      
      <div>
        <select
          v-model="selectedCounsel"
          class="form-select font-semibold text-[#0F172A]"
        >
          <option value="Dimas Prasetyo, S.H.">Dimas Prasetyo, S.H. (Staff Legal Counsel)</option>
          <option value="Siti Rahmawati, S.H., M.H.">Siti Rahmawati, S.H., M.H. (Kepala Legal Operasional)</option>
          <option value="Budi Santoso, S.H., LL.M.">Budi Santoso, S.H., LL.M. (Head of Legal &amp; Compliance)</option>
          <option value="Anisa Maharani, S.H.">Anisa Maharani, S.H. (Staff Legal Specialist)</option>
          <option value="Budi Santoso, S.H., M.H.">Budi Santoso, S.H., M.H. (General Counsel)</option>
          <option value="Unassigned">-- Lepas Penugasan (Unassigned) --</option>
        </select>
      </div>

      <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
        <button
          @click="$emit('close')"
          class="px-3 py-1.5 text-xs text-[#64748B] hover:bg-slate-100 rounded-lg cursor-pointer transition border border-[#CBD5E1]"
        >
          Batal
        </button>
        <button
          @click="confirmAssign"
          class="px-4 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer transition shadow-xs flex items-center gap-1.5"
        >
          <Check class="w-3.5 h-3.5" />
          <span>Simpan Penugasan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { UserCheck, Check } from 'lucide-vue-next';
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
      const currentPic = req.picLegal || req.assignedTo;
      selectedCounsel.value = currentPic && currentPic !== 'Unassigned' 
        ? currentPic 
        : 'Dimas Prasetyo, S.H.';
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
