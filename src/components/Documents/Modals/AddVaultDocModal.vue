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
            <UploadCloud class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold">Registrasi Dokumen Kualifikasi Lelang</h3>
            <p class="text-[11px] text-slate-300">Simpan dokumen master kualifikasi ke dalam Dokumen Vault</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="submitAddVaultDoc" class="p-6 overflow-y-auto space-y-4 text-xs">
        <!-- File Dropzone & Direct Upload -->
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">
            File Dokumen Asli (Upload dari Direktori Komputer) *
          </label>
          <input
            type="file"
            ref="vaultFileInputRef"
            @change="onVaultFilePicked"
            class="hidden"
          />
          <div
            v-if="!form.fileRef"
            @click="triggerVaultFileBrowse"
            class="border-2 border-dashed border-[#C7D2FE] hover:border-[#C7D2FE] rounded-xl p-5 text-center bg-[#F8FAFC] hover:bg-blue-50/50 transition cursor-pointer"
          >
            <UploadCloud class="w-8 h-8 text-[#6366F1] mx-auto mb-2" />
            <div class="font-bold text-[#0F172A] text-xs">Klik untuk memilih file dari komputer / direktori lokal</div>
            <div class="text-[11px] text-[#475569] mt-0.5">Mendukung format PDF, DOCX, ZIP, JPG (Maks. 50 MB)</div>
          </div>
          <div
            v-else
            class="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-[#BBF7D0]"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <Paperclip class="w-4 h-4 text-emerald-600 shrink-0" />
              <div class="min-w-0">
                <div class="font-bold text-[#0F172A] text-xs truncate">{{ form.fileRef }}</div>
                <div class="text-[11px] text-[#475569]">Ukuran: {{ form.fileSize || 'Terlampir' }}</div>
              </div>
            </div>
            <button
              type="button"
              @click="triggerVaultFileBrowse"
              class="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
            >
              Ganti File
            </button>
          </div>
        </div>

        <!-- Document Code & Name -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kode Master *</label>
            <input
              v-model="form.code"
              type="text"
              placeholder="Contoh: NIB-2025"
              required
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none font-mono"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-bold text-[#0F172A] mb-1">Nama Dokumen Kualifikasi *</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nama sertifikat / perizinan / laporan"
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
              placeholder="Nomor dokumen resmi"
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
              placeholder="Kementerian / Lembaga / KAP"
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
            <label class="block font-bold text-[#0F172A] mb-1">Masa Berlaku (Kosongkan bila Permanen)</label>
            <input
              v-model="form.expiryDate"
              type="date"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
            />
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Catatan / Ringkasan Dokumen</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Keterangan batasan, ruang lingkup kualifikasi, atau catatan legal..."
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
            <UploadCloud class="w-3.5 h-3.5" />
            <span>Simpan Dokumen</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadCloud, Paperclip, X } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const vaultFileInputRef = ref(null);

const form = ref({
  name: '',
  code: '',
  category: 'Legal Administrasi',
  number: '',
  issuer: '',
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  fileRef: '',
  fileSize: '',
  notes: ''
});

function triggerVaultFileBrowse() {
  if (vaultFileInputRef.value) {
    vaultFileInputRef.value.click();
  }
}

function onVaultFilePicked(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  form.value.fileRef = file.name;
  if (file.size < 1024 * 1024) {
    form.value.fileSize = (file.size / 1024).toFixed(1) + ' KB';
  } else {
    form.value.fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  }
  if (!form.value.name) {
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    form.value.name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
}

function submitAddVaultDoc() {
  legalStore.addTenderVaultDoc({ ...form.value });
  form.value = {
    name: '',
    code: '',
    category: 'Legal Administrasi',
    number: '',
    issuer: '',
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: '',
    fileRef: '',
    fileSize: '',
    notes: ''
  };
  emit('close');
}
</script>
