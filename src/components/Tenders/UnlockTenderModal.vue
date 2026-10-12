<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <h3 class="text-sm font-bold text-[#0F172A]">Buka Kunci Paket Penawaran</h3>
        <button @click="closeModal" class="text-slate-400 hover:text-[#0F172A]">✕</button>
      </div>

      <p class="text-xs text-[#475569]">
        Membuka kunci paket akan menonaktifkan status freeze dan hash submission agar revisi administratif dapat dilakukan.
      </p>

      <div>
        <label class="block font-bold text-[#0F172A] mb-1">Alasan Pembukaan Kunci *</label>
        <textarea
          v-model="reason"
          rows="2"
          placeholder="Contoh: Koreksi lampiran AHSP atas permintaan klarifikasi panitia..."
          class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#0F172A]"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
        >
          Batal
        </button>
        <button
          @click="submitReason"
          class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
        >
          Konfirmasi Buka Kunci
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'submit']);

const reason = ref('Koreksi administratif dokumen penawaran');

watch(() => props.isOpen, (val) => {
  if (val) reason.value = 'Koreksi administratif dokumen penawaran';
});

function closeModal() {
  emit('close');
}

function submitReason() {
  emit('submit', reason.value);
}
</script>
