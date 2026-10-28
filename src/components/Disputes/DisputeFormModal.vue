<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <component :is="isEdit ? Pencil : Plus" class="w-5 h-5 text-purple-400" />
          <h3 class="font-extrabold text-white text-base">
            {{ isEdit ? 'Perbarui Data Sengketa' : 'Pendaftaran Perkara & Sengketa Baru' }}
          </h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-4 text-xs sm:text-sm overflow-y-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Nomor Perkara / Register *</label>
            <input
              v-model="form.caseNumber"
              type="text"
              required
              placeholder="45/BANI/ARB/2026"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 font-mono"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Pihak Lawan (Opponent) *</label>
            <input
              v-model="form.opponent"
              type="text"
              required
              placeholder="PT Mitra Jaya Abadi"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Klasifikasi Sengketa</label>
            <select
              v-model="form.caseType"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 outline-none"
            >
              <option value="Arbitrase BANI">Arbitrase BANI</option>
              <option value="Gugatan Perdata (Wanprestasi)">Gugatan Perdata (Wanprestasi)</option>
              <option value="Gugatan Perdata (PMH)">Gugatan Perdata (PMH)</option>
              <option value="Sengketa Tata Usaha Negara (PTUN)">Sengketa Tata Usaha Negara (PTUN)</option>
              <option value="Ketenagakerjaan (PHI)">Ketenagakerjaan (PHI)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Pengadilan / Lembaga Arbitrase</label>
            <input
              v-model="form.courtOrInstitution"
              type="text"
              required
              placeholder="BANI Arbitration Jakarta / PN Jakpus"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Nilai Tuntutan / Gugatan (IDR) *</label>
            <input
              v-model.number="form.disputeValue"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 font-mono font-bold"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Tingkat Risiko Finansial</label>
            <select
              v-model="form.riskLevel"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 outline-none font-bold"
            >
              <option value="HIGH">Tinggi (High Risk)</option>
              <option value="MEDIUM">Sedang (Medium Risk)</option>
              <option value="LOW">Rendah (Low Risk)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Entitas Perseroan</label>
            <select
              v-model="form.company"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 outline-none"
            >
              <option value="PT Nusantara Energi">PT Nusantara Energi</option>
              <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
              <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
              <option value="PT Indo Mineral Tambang">PT Indo Mineral Tambang</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Jadwal Sidang Berikutnya</label>
            <input
              v-model="form.nextHearingDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-800 mb-1">Kuasa Hukum / Counsel Penanggung Jawab</label>
          <input
            v-model="form.legalCounsel"
            type="text"
            placeholder="Tim Litigasi Internal & Retained Lawyer"
            class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-800 mb-1">Ringkasan Pokok Perkara & Petitum *</label>
          <textarea
            v-model="form.summary"
            required
            rows="3"
            placeholder="Jelaskan dasar tuntutan, kronologi wanprestasi/perbuatan melawan hukum, serta langkah mitigasi..."
            class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 resize-none"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
          >
            {{ isEdit ? 'Simpan Perubahan' : 'Simpan Perkara' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Pencil } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

const form = ref({
  caseNumber: '',
  opponent: '',
  caseType: 'Arbitrase BANI',
  courtOrInstitution: 'BANI Arbitration Jakarta',
  disputeValue: 5000000000,
  riskLevel: 'HIGH',
  company: 'PT Nusantara Energi',
  nextHearingDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  legalCounsel: 'Tim Internal Legal Counsel',
  summary: ''
});

onMounted(() => {
  if (props.isEdit && props.initialData) {
    form.value = {
      caseNumber: props.initialData.caseNumber || '',
      opponent: props.initialData.opponent || '',
      caseType: props.initialData.caseType || 'Arbitrase BANI',
      courtOrInstitution: props.initialData.courtOrInstitution || '',
      disputeValue: props.initialData.disputeValue || 0,
      riskLevel: props.initialData.riskLevel || 'HIGH',
      company: props.initialData.company || 'PT Nusantara Energi',
      nextHearingDate: props.initialData.nextHearingDate || '',
      legalCounsel: props.initialData.legalCounsel || '',
      summary: props.initialData.summary || ''
    };
  }
});

function submitForm() {
  if (props.isEdit && props.initialData.id) {
    legalStore.updateDispute(props.initialData.id, { ...form.value });
    legalStore.triggerToast('Data perkara sengketa berhasil diperbarui!', 'success');
  } else {
    legalStore.addDispute({ ...form.value });
    legalStore.triggerToast('Perkara sengketa baru berhasil didaftarkan!', 'success');
  }
  emit('close');
}
</script>
