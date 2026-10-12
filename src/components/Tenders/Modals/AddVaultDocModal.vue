<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/70 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C7D2FE] space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div>
          <h3 class="text-base font-bold text-[#0F172A]">
            Tambah Master Dokumen Kualifikasi
          </h3>
          <p class="text-xs text-[#475569] mt-0.5">
            Simpan berkas master perusahaan ke repositori kualifikasi pengadaan.
          </p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3 text-xs">
        <!-- File Attachment from Directory -->
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Lampiran Berkas / File Master (Dari Direktori Komputer)</label>
          <input
            type="file"
            ref="vaultFileInputRef"
            @change="onVaultFilePicked"
            class="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
          />
          
          <div
            v-if="form.fileRef"
            class="p-3 rounded-xl border border-[#BBF7D0] bg-emerald-50/40 flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <FileText class="w-5 h-5 text-emerald-700 shrink-0" />
              <div class="min-w-0">
                <div class="font-bold text-[#0F172A] truncate text-xs">{{ form.fileRef }}</div>
                <div class="text-[10px] text-emerald-700 font-semibold">{{ form.fileSize || '1.8 MB' }} • File Ter-upload & Terlampir</div>
              </div>
            </div>
            <button
              type="button"
              @click="triggerVaultFileBrowse"
              class="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-200 rounded-lg font-bold text-xs cursor-pointer"
            >
              Ganti File
            </button>
          </div>

          <div
            v-else
            @click="triggerVaultFileBrowse"
            class="p-4 rounded-xl border-2 border-dashed border-[#C7D2FE]/50 hover:border-[#1E293B] bg-[#F8FAFC] hover:bg-white text-center cursor-pointer transition space-y-1 group"
          >
            <UploadCloud class="w-5 h-5 text-[#6366F1] mx-auto group-hover:text-[#0F172A] transition-colors" />
            <p class="font-bold text-[#0F172A] text-xs">Pilih File dari Direktori Komputer Anda</p>
            <p class="text-[10px] text-[#475569]">Mendukung PDF, DOCX, XLSX, Scan Izin Resmi (Maks 25MB)</p>
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Nama Dokumen / Kualifikasi *</label>
          <input
            v-model="form.name"
            required
            type="text"
            placeholder="Contoh: Surat Izin Usaha Perdagangan (SIUP) / SBU EL003"
            class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kategori Dokumen</label>
            <select
              v-model="form.category"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            >
              <option value="Legal Administrasi">Legal Administrasi</option>
              <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
              <option value="Keuangan & Pajak">Keuangan & Pajak</option>
              <option value="Kepatuhan & Sertifikasi">Kepatuhan & Sertifikasi</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kode Dokumen</label>
            <input
              v-model="form.code"
              type="text"
              placeholder="DOC-SIUP-01"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nomor Registrasi / SK</label>
            <input
              v-model="form.number"
              type="text"
              placeholder="No. AHU-xxxx / 01928"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Instansi Penerbit</label>
            <input
              v-model="form.issuer"
              type="text"
              placeholder="Kemenkumham / LPJK / DJP"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Tanggal Terbit</label>
            <input
              v-model="form.issueDate"
              type="date"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Masa Berlaku (Kosongkan jika selamanya)</label>
            <input
              v-model="form.expiryDate"
              type="date"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Catatan Tambahan</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Keterangan spesifikasi berkas, masa berlaku audit, dsb..."
            class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            Simpan Dokumen Master
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X, UploadCloud, FileText } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

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

function submitForm() {
  legalStore.addTenderVaultDoc(form.value);
  emit('close');
}
</script>
