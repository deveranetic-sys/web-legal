<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Edit3 v-if="isEdit" class="w-5 h-5 text-indigo-400" />
          <Send v-else class="w-5 h-5 text-indigo-400" />
          <div>
            <h3 class="font-extrabold text-white text-base">
              {{ isEdit ? 'Edit Data Korespondensi' : 'Catat Surat Resmi Baru' }}
            </h3>
            <p class="text-xs text-slate-400 font-mono">
              {{ isEdit ? form.letterNumber : 'Pencatatan korespondensi legal & lampiran berkas' }}
            </p>
          </div>
        </div>
        <button @click="closeModal" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Nomor Surat Resmi *</label>
            <input
              v-model="form.letterNumber"
              type="text"
              required
              placeholder="045/NE-LEG/SOM/X/2026"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-mono"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Arah Surat *</label>
            <select
              v-model="form.direction"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none font-semibold"
            >
              <option value="KELUAR">Surat Keluar (Outgoing)</option>
              <option value="MASUK">Surat Masuk (Incoming)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Jenis Surat</label>
            <select
              v-model="form.type"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none"
            >
              <option value="Surat Somasi">Surat Somasi (Peringatan)</option>
              <option value="Surat Kuasa Khusus">Surat Kuasa Khusus</option>
              <option value="Surat Perintah Kerja (SPK)">Surat Perintah Kerja (SPK)</option>
              <option value="Surat Tanggapan Wanprestasi">Surat Tanggapan Wanprestasi</option>
              <option value="Nota Dinas Legal">Nota Dinas Legal</option>
              <option value="Surat Permohonan Izin">Surat Permohonan Izin</option>
              <option value="Incoming Letter">Surat Masuk / Klarifikasi</option>
              <option value="Legal Notice">Legal Notice & Peringatan</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">PIC Legal Counsel</label>
            <input
              v-model="form.pic"
              type="text"
              placeholder="Dimas Prasetyo, S.H."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-800 mb-1">Perihal / Pokok Surat *</label>
          <input
            v-model="form.subject"
            type="text"
            required
            placeholder="Contoh: Surat Somasi I..."
            class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Pengirim Surat *</label>
            <input
              v-model="form.sender"
              type="text"
              required
              placeholder="PT Nusantara Energi"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Tujuan / Penerima *</label>
            <input
              v-model="form.recipient"
              type="text"
              required
              placeholder="Direksi PT Mineral"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Tanggal Surat</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Tenggat Waktu / Batas</label>
            <input
              v-model="form.deadline"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Status Pengiriman</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none font-bold"
            >
              <option value="SENT">Terkirim (SENT)</option>
              <option value="RECEIVED">Diterima (RECEIVED)</option>
              <option value="IN_REVIEW">Dalam Review (IN_REVIEW)</option>
              <option value="REPLIED">Dibalas (REPLIED)</option>
              <option value="DRAFT">Draf (DRAFT)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-800 mb-1">Ringkasan & Keterangan</label>
          <textarea
            v-model="form.summary"
            rows="2"
            placeholder="Catatan nomor resi pos/kurir..."
            class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none"
          ></textarea>
        </div>

        <!-- File Attachment Uploader -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block font-bold text-slate-800">Berkas Lampiran Surat (Attachment)</label>
          <div
            class="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-4 text-center bg-slate-50 transition cursor-pointer relative"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.zip"
              @change="handleFileUpload"
            />
            <div v-if="!form.fileName && !form.fileRef" class="space-y-1">
              <UploadCloud class="w-7 h-7 text-slate-400 mx-auto" />
              <p class="text-xs font-semibold text-slate-700">
                Klik untuk {{ isEdit ? 'mengganti/' : '' }}unggah berkas surat
              </p>
              <p class="text-[10px] text-slate-400">Ukuran maksimal hingga 25 MB</p>
            </div>
            <div v-else class="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
              <div class="flex items-center gap-2 truncate">
                <Paperclip class="w-4 h-4 text-emerald-600 shrink-0" />
                <span class="font-bold truncate">{{ form.fileName || form.fileRef }}</span>
                <span class="text-emerald-700 font-mono text-[10px]">({{ form.fileSize || '1.5 MB' }})</span>
              </div>
              <button
                type="button"
                @click.stop="removeFile"
                class="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Hapus berkas"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer shadow-xs transition text-xs"
          >
            {{ isEdit ? 'Simpan Perubahan' : 'Simpan Surat' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Send, Edit3, UploadCloud, Paperclip, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  isEdit: Boolean,
  initialData: Object
});

const emit = defineEmits(['close', 'submit']);

const fileInput = ref(null);

const defaultForm = () => ({
  id: '',
  letterNumber: '',
  type: 'Surat Somasi',
  direction: 'KELUAR',
  subject: '',
  sender: 'PT Nusantara Energi (Legal Dept)',
  recipient: '',
  date: new Date().toISOString().slice(0, 10),
  deadline: '',
  pic: 'Dimas Prasetyo, S.H.',
  status: 'SENT',
  summary: '',
  fileName: '',
  fileRef: '',
  fileSize: '',
  fileDataUrl: null
});

const form = ref(defaultForm());

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.isEdit && props.initialData) {
      form.value = { ...defaultForm(), ...props.initialData };
    } else {
      const nextNum = Math.floor(100 + Math.random() * 900);
      form.value = {
        ...defaultForm(),
        letterNumber: `${nextNum}/NE-LEG/SOM/X/2026`
      };
    }
  }
});

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  form.value.fileName = file.name;
  form.value.fileRef = file.name;
  form.value.fileSize = formatFileSize(file.size);
  const reader = new FileReader();
  reader.onload = (event) => {
    form.value.fileDataUrl = event.target.result;
  };
  reader.readAsDataURL(file);
}

function removeFile() {
  form.value.fileName = '';
  form.value.fileRef = '';
  form.value.fileSize = '';
  form.value.fileDataUrl = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function closeModal() {
  emit('close');
}

function submitForm() {
  emit('submit', { ...form.value });
}

function formatFileSize(bytes) {
  if (!bytes) return '1.2 MB';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
</script>
