<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h3 class="text-base font-bold text-slate-900">Perbarui Data Kontrak</h3>
          <p class="text-xs text-slate-500">ID: {{ editForm.id }} • {{ editForm.contractNumber }}</p>
        </div>
        <button @click="$emit('close')" class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-700 mb-1">Judul Kontrak / Perjanjian *</label>
            <input v-model="editForm.contractTitle" required type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Nomor Surat Perjanjian *</label>
            <input v-model="editForm.contractNumber" required type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Entitas Perseroan</label>
            <select v-model="editForm.company" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="PT Nusantara Energi">PT Nusantara Energi</option>
              <option value="PT Indo Mineral Tambang">PT Indo Mineral Tambang</option>
              <option value="PT Trans Nusantara Logistik">PT Trans Nusantara Logistik</option>
              <option value="PT Energi Hijau Persada">PT Energi Hijau Persada</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Mitra Rekanan (Counterparty) *</label>
            <input v-model="editForm.counterparty" required type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Tipe / Kategori Kontrak</label>
            <select v-model="editForm.contractType" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="Perjanjian Jual Beli Listrik (PPA)">Perjanjian Jual Beli Listrik (PPA)</option>
              <option value="Perjanjian Pasokan Batubara (Supply)">Perjanjian Pasokan Batubara (Supply)</option>
              <option value="Engineering Procurement Construction (EPC)">Engineering Procurement Construction (EPC)</option>
              <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</option>
              <option value="Perjanjian Sewa Lahan & Bangunan">Perjanjian Sewa Lahan & Bangunan</option>
              <option value="Perjanjian Kerja Sama Distribusi">Perjanjian Kerja Sama Distribusi</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Tanggal Mulai Berlaku</label>
            <input v-model="editForm.effectiveDate" type="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Tanggal Selesai (Expiry) *</label>
            <input v-model="editForm.expiryDate" required type="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Nilai Kontrak (IDR) *</label>
            <input v-model.number="editForm.contractValue" required type="number" min="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Status Kontrak</label>
            <select v-model="editForm.status" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="ACTIVE">ACTIVE (Berlaku)</option>
              <option value="EXPIRING">EXPIRING (Masa Siaga)</option>
              <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
              <option value="TERMINATED">TERMINATED (Dihentikan)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">PIC Unit Bisnis</label>
            <input v-model="editForm.pic" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Legal Counsel PIC</label>
            <input v-model="editForm.legalPic" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-700 mb-1">Klausul Kewajiban Pokok</label>
            <textarea v-model="editForm.keyObligations" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>

          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-700 mb-1">Termin Pembayaran & Retensi</label>
            <input v-model="editForm.paymentTerms" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer">
            Batal
          </button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { X } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  contract: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const editForm = reactive({
  id: '',
  contractTitle: '',
  contractNumber: '',
  company: '',
  counterparty: '',
  contractType: '',
  effectiveDate: '',
  expiryDate: '',
  contractValue: 0,
  pic: '',
  legalPic: '',
  status: 'ACTIVE',
  renewalStatus: '',
  keyObligations: '',
  paymentTerms: ''
});

onMounted(() => {
  if (props.contract) {
    Object.assign(editForm, {
      id: props.contract.id,
      contractTitle: props.contract.contractTitle || '',
      contractNumber: props.contract.contractNumber || '',
      company: props.contract.company || 'PT Nusantara Energi',
      counterparty: props.contract.counterparty || '',
      contractType: props.contract.contractType || 'Perjanjian Jual Beli Listrik (PPA)',
      effectiveDate: props.contract.effectiveDate || '',
      expiryDate: props.contract.expiryDate || '',
      contractValue: props.contract.contractValue || 0,
      pic: props.contract.pic || '',
      legalPic: props.contract.legalPic || '',
      status: props.contract.status || 'ACTIVE',
      renewalStatus: props.contract.renewalStatus || '',
      keyObligations: props.contract.keyObligations || '',
      paymentTerms: props.contract.paymentTerms || ''
    });
  }
});

function submitForm() {
  legalStore.updateContract(editForm.id, { ...editForm });
  emit('close');
}
</script>
