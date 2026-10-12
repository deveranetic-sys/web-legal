<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs border border-[#E2E8F0]">
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <h3 class="text-sm font-bold text-[#0F172A]">Tambah Master Sektor Industri</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Nama Sektor Industri *</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: Telekomunikasi & Teknologi Informasi"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kode Sektor (ID)</label>
            <input
              v-model="form.code"
              type="text"
              required
              placeholder="Contoh: TELKO"
              class="w-full px-3 py-2 text-xs font-mono uppercase border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Icon Emoji</label>
            <input
              v-model="form.icon"
              type="text"
              placeholder="📡"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Dasar Regulasi Pokok</label>
          <input
            v-model="form.regulatoryBasis"
            type="text"
            placeholder="Contoh: UU Telekomunikasi & Permen Kominfo"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          />
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Tipe Kontrak Default</label>
          <input
            v-model="form.defaultContractType"
            type="text"
            placeholder="Contoh: Service Level Agreement (SLA) & IT Contract"
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          />
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Deskripsi Sektor</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Karakteristik pengadaan dan kualifikasi yang dipersyaratkan..."
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
            Simpan Sektor
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
  icon: '🏢',
  regulatoryBasis: '',
  defaultContractType: '',
  description: ''
});

function submitForm() {
  legalStore.addMasterSector(form.value);
  emit('close');
}
</script>
