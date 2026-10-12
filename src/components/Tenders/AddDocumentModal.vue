<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <h3 class="text-sm font-bold text-[#0F172A]">Tambah Syarat Dokumen Pengadaan</h3>
        <button @click="closeModal" class="text-slate-400 hover:text-[#0F172A]">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Nama Dokumen Persyaratan *</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: Sertifikat Kelaikan Operasi (SLO) atau Jaminan Penawaran"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kategori Dokumen</label>
            <select
              v-model="form.category"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="Legal Administrasi">Legal Administrasi</option>
              <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
              <option value="Finansial & Keuangan">Finansial & Keuangan</option>
              <option value="Kepatuhan & Integritas">Kepatuhan & Integritas</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Status Kesiapan</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="TERPENUHI">TERPENUHI (Sudah Siap)</option>
              <option value="KURANG">KURANG (Belum Ada Berkas)</option>
              <option value="DALAM_PROSES">DALAM PROSES (Sedang Diurus)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Catatan / Rincian Persyaratan</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Nomor dokumen, penerbit, atau catatan teknis..."
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
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
            Simpan Dokumen
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
  name: '',
  category: 'Legal Administrasi',
  status: 'KURANG',
  notes: ''
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
