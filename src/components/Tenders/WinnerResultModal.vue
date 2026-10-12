<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <h3 class="text-sm font-bold text-[#0F172A]">Catat Hasil Pengumuman Pemenang</h3>
        <button @click="closeModal" class="text-slate-400 hover:text-[#0F172A]">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Hasil Akhir *</label>
            <select
              v-model="form.resultStatus"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl font-bold bg-white text-[#0F172A]"
            >
              <option value="MENANG">MENANG (Juara 1)</option>
              <option value="KALAH">GUGUR / KALAH</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Peringkat Akhir</label>
            <input
              v-model.number="form.rank"
              type="number"
              min="1"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl font-mono bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Nama Pemenang Terpilih</label>
          <input
            v-model="form.winner"
            type="text"
            placeholder="Contoh: PT Nusantara Energi (atau nama konsorsium/kompetitor)"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#0F172A]"
          />
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Nilai Penawaran Pemenang (IDR)</label>
          <input
            v-model.number="form.winPrice"
            type="number"
            min="0"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl font-mono bg-white text-[#0F172A]"
          />
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Catatan Evaluasi Pokja</label>
          <textarea
            v-model="form.note"
            rows="2"
            placeholder="Surat keputusan penetapan pemenang atau evaluasi teknis/harga..."
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#0F172A]"
          ></textarea>
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
            Simpan Hasil
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
  resultStatus: 'MENANG',
  rank: 1,
  winner: '',
  winPrice: null,
  note: ''
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
