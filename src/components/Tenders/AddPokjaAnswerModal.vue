<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <h3 class="text-sm font-bold text-[#0F172A]">Catat Jawaban Resmi Panitia (BAPP)</h3>
        <button @click="closeModal" class="text-slate-400 hover:text-[#0F172A]">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Pertanyaan Sebelumnya</label>
          <div class="p-2.5 bg-[#F8FAFC] rounded-xl text-xs text-[#475569] border border-[#E2E8F0]">
            {{ item?.query }}
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Jawaban Pokja / Panitia *</label>
          <textarea
            v-model="form.answer"
            rows="3"
            required
            placeholder="Kutipan resmi dari Berita Acara Pemberian Penjelasan..."
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          ></textarea>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Efek / Tindak Lanjut pada Dokumen Penawaran</label>
          <input
            v-model="form.effect"
            type="text"
            placeholder="Contoh: Menyesuaikan BoQ item 4.2 dan kurva S pekerjaan"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          />
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
            Simpan Jawaban
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  item: Object
});
const emit = defineEmits(['close', 'submit']);

const defaultForm = () => ({
  answer: '',
  effect: ''
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
