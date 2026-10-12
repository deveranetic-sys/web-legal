<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
      <div class="px-6 py-4 bg-[#1E293B] text-white flex items-center justify-between border-b border-[#1E293B]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
            <Pencil class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold">Edit Arsip Legal Korporasi</h3>
            <p class="text-[11px] text-slate-300">Perbarui data akta, sertifikat aset, dan dokumen legalitas grup</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="submitEditCorporateDoc" class="p-6 overflow-y-auto space-y-4 text-xs">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">
            Nama Dokumen / Judul Berkas Arsip *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Jenis / Kategori Arsip</label>
            <select
              v-model="form.documentType"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white text-[#0F172A]"
            >
              <option value="Akta Notaris & Korporasi">Akta Notaris & Korporasi</option>
              <option value="SK Pengesahan Kemenkumham">SK Pengesahan Kemenkumham</option>
              <option value="Sertifikat Tanah & Aset (HGB/SHM)">Sertifikat Tanah & Aset (HGB/SHM)</option>
              <option value="Perizinan Dasar (NIB/NPWP)">Perizinan Dasar (NIB/NPWP)</option>
              <option value="Sertifikasi Mutu (ISO/SMK3)">Sertifikasi Mutu (ISO/SMK3)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nomor Registrasi / Akta *</label>
            <input
              v-model="form.number"
              type="text"
              required
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A] font-mono"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Instansi Penerbit / Notaris</label>
            <input
              v-model="form.issuer"
              type="text"
              required
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan</label>
            <select
              v-model="form.company"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white text-[#0F172A]"
            >
              <option value="PT Nusantara Energi">PT Nusantara Energi</option>
              <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
              <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Tanggal Dokumen *</label>
            <input
              v-model="form.issueDate"
              type="date"
              required
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Masa Berlaku (Jika Ada)</label>
            <input
              v-model="form.expiryDate"
              type="date"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Catatan & Keterangan</label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A] resize-none"
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
  documentType: 'Akta Notaris & Korporasi',
  number: '',
  issuer: '',
  company: 'PT Nusantara Energi',
  issueDate: '',
  expiryDate: '',
  notes: ''
});

watch(
  () => props.doc,
  (doc) => {
    if (doc) {
      form.value = {
        name: doc.name || doc.documentName || '',
        documentType: doc.documentType || doc.category || 'Akta Notaris & Korporasi',
        number: doc.documentNumber || doc.number || '',
        issuer: doc.issuer || '',
        company: doc.company || 'PT Nusantara Energi',
        issueDate: doc.issueDate || new Date().toISOString().slice(0, 10),
        expiryDate: doc.expiryDate || '',
        notes: doc.notes || ''
      };
    }
  },
  { immediate: true }
);

function submitEditCorporateDoc() {
  if (!props.doc?.id) return;
  legalStore.updateCorporateDocument(props.doc.id, { ...form.value });
  emit('close');
}
</script>
