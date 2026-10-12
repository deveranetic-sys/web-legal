<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <h3 class="text-sm font-bold text-[#0F172A]">Ajukan Pertanyaan Klarifikasi / Aanwijzing</h3>
        <button @click="closeModal" class="text-slate-400 hover:text-[#0F172A]">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Pertanyaan / Poin Klarifikasi *</label>
          <textarea
            v-model="form.query"
            rows="3"
            required
            placeholder="Contoh: Mohon konfirmasi apakah jaminan pelaksanaan dapat menggunakan Bank Garansi dari Bank Himbara non-lokal..."
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kategori Pertanyaan</label>
            <select
              v-model="form.category"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="Teknis & Spesifikasi">Teknis & Spesifikasi</option>
              <option value="Komersial & Harga">Komersial & Harga</option>
              <option value="Ruang Lingkup (Scope)">Ruang Lingkup (Scope)</option>
              <option value="Kepatuhan & Regulasi">Kepatuhan & Regulasi</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Estimasi Dampak</label>
            <input
              v-model="form.impact"
              type="text"
              placeholder="Contoh: Jadwal & Biaya"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
          >
            Kirim Pertanyaan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'submit']);

const defaultForm = () => ({
  query: '',
  category: 'Teknis & Spesifikasi',
  impact: ''
});
const form = ref(defaultForm());

watch(() => props.isOpen, (val) => {
  if (val) form.value = defaultForm();
});

function closeModal() {
  emit('close');
}

function submitForm() {
  emit('submit', { ...form.value });
}
</script>
