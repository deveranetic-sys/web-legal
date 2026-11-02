<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-floating max-w-2xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[92vh]">
      
      <!-- Modal Header (Tactile Clean UI) -->
      <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shrink-0">
            <Scale class="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <h3 class="font-bold text-[#0F172A] text-base">Pengajuan Permohonan Legal Baru</h3>
            <p class="text-xs text-[#64748B]">Registrasi permohonan telaah hukum, pembuatan naskah, dan penugasan PIC.</p>
          </div>
        </div>
        <button 
          @click="$emit('close')" 
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitNewRequest" id="add-request-form" class="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-[#0F172A]">
        
        <!-- Perihal / Judul -->
        <div>
          <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
            Perihal / Judul Permohonan <span class="text-rose-600">*</span>
          </label>
          <input
            v-model="form.subject"
            type="text"
            required
            placeholder="Contoh: Telaah Draf Perjanjian Jual Beli Batubara dengan PT Indo Mining"
            class="form-input font-medium"
          />
        </div>

        <!-- Grid 1: Jenis Layanan & Urgensi -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Jenis Layanan Legal <span class="text-rose-600">*</span>
            </label>
            <select v-model="form.requestType" class="form-select">
              <option value="Contract Review">Contract Review (Telaah Klausul Kontrak)</option>
              <option value="Contract Drafting">Contract Drafting (Pembuatan Naskah Baru)</option>
              <option value="Legal Opinion">Legal Opinion (Pendapat Hukum Resmi)</option>
              <option value="Litigation Support">Dukungan Litigasi &amp; Somasi</option>
              <option value="Licensing Assistance">Konsultasi Izin &amp; Kepatuhan Regulasi</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Tingkat Urgensi / Prioritas <span class="text-rose-600">*</span>
            </label>
            <select v-model="form.urgency" class="form-select font-semibold">
              <option value="HIGH">Tinggi (High) - Target ≤ 2 Hari Kerja</option>
              <option value="MEDIUM">Sedang (Medium) - Target ≤ 5 Hari Kerja</option>
              <option value="LOW">Rendah (Low) - Reguler</option>
            </select>
          </div>
        </div>

        <!-- Grid 2: Penugasan PIC Legal Counsel (Dedicated Section) -->
        <div class="p-4 bg-[#EEF2FF] rounded-xl border border-[#C7D2FE] space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-[#4338CA]">
              Penugasan PIC Legal Counsel <span class="text-rose-600">*</span>
            </label>
            <span class="text-[10px] font-semibold bg-white text-[#4338CA] px-2 py-0.5 rounded border border-[#C7D2FE]">
              PIC Internal Legal
            </span>
          </div>
          <select v-model="form.picLegal" class="form-select font-semibold text-[#0F172A]">
            <option value="Unassigned">-- Belum Ditugaskan (Otomatis Ditentukan Kepala Legal) --</option>
            <option v-for="counsel in legalCounselOptions" :key="counsel.name" :value="counsel.name">
              {{ counsel.name }} ({{ counsel.title }})
            </option>
          </select>
          <p class="text-[11px] text-[#4338CA] leading-relaxed">
            Pilih personil legal yang akan bertindak sebagai Penelaah Utama (Maker/Counsel) pada alur persetujuan permohonan ini.
          </p>
        </div>

        <!-- Grid 3: Entitas & Proyek -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Entitas Perseroan <span class="text-rose-600">*</span>
            </label>
            <select v-model="form.company" class="form-select">
              <option value="PT Nusantara Energi">PT Nusantara Energi</option>
              <option value="PT Nusabara Sinergi Bersama">PT Nusabara Sinergi Bersama</option>
              <option value="PT Aksa Energi Palapa">PT Aksa Energi Palapa</option>
              <option value="PT Java Power Solutions">PT Java Power Solutions</option>
              <option value="PT Borneo Mineral Resources">PT Borneo Mineral Resources</option>
              <option value="PT Sumatera Green Energy">PT Sumatera Green Energy</option>
              <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Proyek Terkait</label>
            <input
              v-model="form.project"
              type="text"
              placeholder="Contoh: PLTS 50 MW Cirata / Tambang Muara Enim"
              class="form-input"
            />
          </div>
        </div>

        <!-- Grid 4: Pemohon & Tenggat Waktu -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Nama Pemohon (Requestor)</label>
            <input
              v-model="form.requestor"
              type="text"
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Divisi / Departemen</label>
            <input
              v-model="form.department"
              type="text"
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Target Tenggat Waktu <span class="text-rose-600">*</span>
            </label>
            <input
              v-model="form.deadline"
              type="date"
              required
              class="form-input font-medium"
            />
          </div>
        </div>

        <!-- Latar Belakang & Deskripsi -->
        <div>
          <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
            Latar Belakang &amp; Pokok Permintaan <span class="text-rose-600">*</span>
          </label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            placeholder="Jelaskan pokok kebutuhan telaah klausul, risiko yang perlu diwaspadai, nilai transaksi, atau latar belakang komersial..."
            class="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none leading-relaxed"
          ></textarea>
        </div>

        <!-- Lampiran Dokumen -->
        <div>
          <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
            Nama Dokumen Lampiran / Term Sheet
          </label>
          <input
            v-model="form.attachmentName"
            type="text"
            placeholder="Contoh: Draf_Kontrak_PJB_IndoMining_v1.pdf"
            class="form-input font-mono"
          />
        </div>

      </form>

      <!-- Modal Footer -->
      <div class="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl text-[#64748B] hover:bg-slate-200/60 font-semibold cursor-pointer transition text-xs border border-[#CBD5E1]"
        >
          Batal
        </button>
        <button
          type="submit"
          form="add-request-form"
          class="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold cursor-pointer shadow-xs transition text-xs flex items-center gap-1.5"
        >
          <Check class="w-4 h-4" />
          <span>Kirim Permohonan &amp; Tugaskan</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Scale, X, Check } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const legalCounselOptions = [
  { name: 'Dimas Prasetyo, S.H.', title: 'Staff Legal Counsel' },
  { name: 'Siti Rahmawati, S.H., M.H.', title: 'Kepala Legal Operasional' },
  { name: 'Budi Santoso, S.H., LL.M.', title: 'Head of Legal & Compliance' },
  { name: 'Anisa Maharani, S.H.', title: 'Staff Legal Specialist' },
  { name: 'Budi Santoso, S.H., M.H.', title: 'General Counsel' }
];

const form = ref({
  subject: '',
  requestType: 'Contract Review',
  urgency: 'MEDIUM',
  company: 'PT Nusantara Energi',
  project: '',
  requestor: '',
  department: 'Project Development',
  picLegal: 'Dimas Prasetyo, S.H.',
  deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  description: '',
  attachmentName: ''
});

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        subject: '',
        requestType: 'Contract Review',
        urgency: 'MEDIUM',
        company: legalStore.state.currentEntity || 'PT Nusantara Energi',
        project: 'Proyek Korporasi',
        requestor: legalStore.state.currentUser?.name || 'Hendra Gunawan, S.T., M.B.A.',
        department: legalStore.state.currentUser?.department || 'Project Development',
        picLegal: 'Dimas Prasetyo, S.H.',
        deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        description: '',
        attachmentName: ''
      };
    }
  }
);

function submitNewRequest() {
  if (!form.value.subject || !form.value.description) {
    legalStore.triggerToast('Mohon lengkapi subjek dan rincian permohonan', 'warning');
    return;
  }

  legalStore.addRequest({ 
    ...form.value,
    assignedTo: form.value.picLegal 
  });
  emit('close');
}
</script>
