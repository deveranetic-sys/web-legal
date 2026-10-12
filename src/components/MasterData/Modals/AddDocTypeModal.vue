<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs border border-[#E2E8F0]">
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <h3 class="text-sm font-bold text-[#0F172A]">Tambah Master Tipe Dokumen</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Nama Kategori Dokumen *</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: Dokumen Kelaikan Alat & SILO"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kode Singkat (Prefix)</label>
            <input
              v-model="form.code"
              type="text"
              placeholder="Contoh: SILO"
              class="w-full px-3 py-2 text-xs font-mono uppercase border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Sifat Dokumen</label>
            <select
              v-model="form.isMandatory"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option :value="true">Wajib Baku</option>
              <option :value="false">Opsional</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Deskripsi Ruang Lingkup Dokumen</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Cakupan berkas yang termasuk dalam kategori ini..."
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl cursor-pointer"
          >
            Simpan Tipe Dokumen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { legalStore } from '../../../stores/legalStore';

const emit = defineEmits(['close']);

const form = ref({
  name: '',
  code: '',
  isMandatory: true,
  description: ''
});

function submitForm() {
  legalStore.addMasterDocType(form.value);
  emit('close');
}
</script>
