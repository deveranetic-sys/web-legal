<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
      <div class="px-6 py-4 bg-[#1E293B] text-white flex items-center justify-between border-b border-[#1E293B]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-[#4338CA] flex items-center justify-center border border-[#C7D2FE] text-[#6366F1]">
            <Pencil class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold">Edit Dokumen Kualifikasi Lelang</h3>
            <p class="text-[11px] text-slate-300">Perbarui rincian dokumen master di Dokumen Vault</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="submitEditVaultDoc" class="p-6 overflow-y-auto space-y-4 text-xs">
        <!-- Document Code & Name -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kode Master *</label>
            <input
              v-model="form.code"
              type="text"
              required
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none font-mono"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-bold text-[#0F172A] mb-1">Nama Dokumen Kualifikasi *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
            />
          </div>
        </div>

        <!-- Category & Number -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kategori Dokumen *</label>
            <select
              v-model="form.category"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white"
            >
              <option value="Legal Administrasi">Legal Administrasi</option>
              <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
              <option value="Kepatuhan & Integritas">Kepatuhan & Integritas</option>
              <option value="Finansial & Keuangan">Finansial & Keuangan</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nomor Registrasi / SK</label>
            <input
              v-model="form.number"
              type="text"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none font-mono"
            />
          </div>
        </div>

        <!-- Issuer & Dates -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Instansi Penerbit</label>
            <input
              v-model="form.issuer"
              type="text"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Tanggal Terbit</label>
            <input
              v-model="form.issueDate"
              type="date"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Masa Berlaku</label>
            <input
              v-model="form.expiryDate"
              type="date"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
            />
          </div>
        </div>

        <!-- File Ref Info -->
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Referensi Nama Berkas Digital</label>
          <input
            v-model="form.fileRef"
            type="text"
            class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none font-mono"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Catatan / Ringkasan Dokumen</label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
          ></textarea>
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
            type="submit"
            class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs flex items-center gap-1.5"
          >
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Pencil, X } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  doc: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const form = ref({
  name: '',
  code: '',
  category: 'Legal Administrasi',
  number: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  fileRef: '',
  fileSize: '',
  notes: ''
});

watch(
  () => props.doc,
  (doc) => {
    if (doc) {
      form.value = {
        name: doc.name || '',
        code: doc.code || '',
        category: doc.category || 'Legal Administrasi',
        number: doc.number || '',
        issuer: doc.issuer || '',
        issueDate: doc.issueDate || new Date().toISOString().slice(0, 10),
        expiryDate: doc.expiryDate || '',
        fileRef: doc.fileRef || '',
        fileSize: doc.fileSize || '',
        notes: doc.notes || ''
      };
    }
  },
  { immediate: true }
);

function submitEditVaultDoc() {
  if (!props.doc?.id) return;
  legalStore.updateTenderVaultDoc(props.doc.id, { ...form.value });
  emit('close');
}
</script>
