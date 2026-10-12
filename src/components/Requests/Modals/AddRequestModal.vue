<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0]">
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Plus class="w-5 h-5 text-indigo-400" />
          <h3 class="font-extrabold text-white text-base">Pengajuan Permohonan Legal Baru</h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
      </div>

      <form @submit.prevent="submitNewRequest" class="p-6 space-y-4 text-xs sm:text-sm">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Perihal / Judul Permohonan *</label>
          <input
            v-model="form.subject"
            type="text"
            required
            placeholder="Contoh: Telaah Draf Perjanjian Jual Beli Batubara dengan PT Indo Mining"
            class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[#0F172A]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Jenis Layanan Legal</label>
            <select
              v-model="form.requestType"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] outline-none"
            >
              <option value="Contract Review">Contract Review (Telaah)</option>
              <option value="Drafting">Drafting (Pembuatan Naskah)</option>
              <option value="Legal Opinion">Legal Opinion (Pendapat Hukum)</option>
              <option value="Litigation Support">Dukungan Litigasi / Somasi</option>
              <option value="Licensing Assistance">Konsultasi Izin OSS/IUP</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Tingkat Urgensi</label>
            <select
              v-model="form.urgency"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] outline-none"
            >
              <option value="HIGH">Tinggi (High) - ≤ 2 Hari Kerja</option>
              <option value="MEDIUM">Sedang (Medium) - ≤ 5 Hari Kerja</option>
              <option value="LOW">Rendah (Low) - Reguler</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan</label>
            <select
              v-model="form.company"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] outline-none"
            >
              <option value="PT Nusantara Energi">PT Nusantara Energi</option>
              <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
              <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Target Tenggat Waktu *</label>
            <input
              v-model="form.deadline"
              type="date"
              required
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[#0F172A]"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Latar Belakang & Kebutuhan *</label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            placeholder="Jelaskan pokok kebutuhan telaah klausul, risiko yang perlu diwaspadai, atau latar belakang transaksi..."
            class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[#0F172A] resize-none"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg text-[#475569] hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold cursor-pointer shadow-md transition text-xs"
          >
            Kirim Permohonan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const form = ref({
  subject: '',
  requestType: 'Contract Review',
  urgency: 'MEDIUM',
  company: 'PT Nusantara Energi',
  deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  description: ''
});

function submitNewRequest() {
  legalStore.addRequest({ ...form.value });
  form.value = {
    subject: '',
    requestType: 'Contract Review',
    urgency: 'MEDIUM',
    company: 'PT Nusantara Energi',
    deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    description: ''
  };
  emit('close');
}
</script>
