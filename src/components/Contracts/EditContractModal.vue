<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-floating max-w-2xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
              {{ editForm.id }}
            </span>
            <span class="text-xs text-[#64748B] font-mono">{{ editForm.contractNumber }}</span>
          </div>
          <h3 class="text-base font-bold text-[#0F172A] mt-1">Perbarui Data &amp; Klausul Kontrak</h3>
        </div>
        <button @click="$emit('close')" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitForm" class="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-[#0F172A]">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Judul Kontrak -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Judul Kontrak / Perjanjian *</label>
            <input v-model="editForm.contractTitle" required type="text" class="form-input font-medium" />
          </div>

          <!-- Nomor Kontrak -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Nomor Surat Perjanjian *</label>
            <input v-model="editForm.contractNumber" required type="text" class="form-input font-mono font-semibold" />
          </div>

          <!-- Entitas Perseroan -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Entitas Perseroan</label>
            <select v-model="editForm.company" class="form-select">
              <option v-for="ent in companyOptions" :key="ent" :value="ent">{{ ent }}</option>
            </select>
          </div>

          <!-- Mitra Rekanan -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Mitra Rekanan (Counterparty) *</label>
            <input v-model="editForm.counterparty" required type="text" class="form-input" />
          </div>

          <!-- Tipe Kontrak -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Tipe / Kategori Kontrak</label>
            <select v-model="editForm.contractType" class="form-select">
              <option v-for="cType in contractTypeOptions" :key="cType" :value="cType">{{ cType }}</option>
            </select>
          </div>

          <!-- Proyek Terkait -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Proyek Terkait</label>
            <input v-model="editForm.project" type="text" class="form-input" />
          </div>

          <!-- Status Kontrak -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Status Kontrak</label>
            <select v-model="editForm.status" class="form-select font-semibold">
              <option value="ACTIVE">ACTIVE (Berlaku / Valid)</option>
              <option value="EXPIRING">EXPIRING (Masa Siaga ≤ 30 Hari)</option>
              <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
              <option value="TERMINATED">TERMINATED (Dihentikan)</option>
            </select>
          </div>

          <!-- Tanggal Mulai -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Tanggal Mulai Berlaku</label>
            <input v-model="editForm.effectiveDate" type="date" class="form-input" />
          </div>

          <!-- Tanggal Selesai -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Tanggal Selesai (Expiry) *</label>
            <input v-model="editForm.expiryDate" required type="date" class="form-input" />
          </div>

          <!-- Nilai Kontrak -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Nilai Kontrak (Nominal) *</label>
            <input v-model.number="editForm.contractValue" required type="number" min="0" class="form-input font-mono font-bold" />
          </div>

          <!-- Mata Uang -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Mata Uang</label>
            <select v-model="editForm.currency" class="form-select font-bold">
              <option value="IDR">IDR (Rupiah Indonesia)</option>
              <option value="USD">USD (Dolar Amerika Serikat)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>

          <!-- PIC Unit Bisnis -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">PIC Unit Bisnis</label>
            <input v-model="editForm.pic" type="text" class="form-input" />
          </div>

          <!-- Legal Counsel PIC -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Legal Counsel PIC</label>
            <input v-model="editForm.legalPic" type="text" class="form-input" />
          </div>

          <!-- Opsi Perpanjangan -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Opsi Perpanjangan (Renewal)</label>
            <select v-model="editForm.renewalStatus" class="form-select">
              <option value="Non-Renewable">Non-Renewable (Berakhir Tetap)</option>
              <option value="Perpanjangan atas Kesepakatan Tertulis">Perpanjangan atas Kesepakatan Tertulis Para Pihak</option>
              <option value="Perpanjangan Otomatis (Auto-Renewal)">Perpanjangan Otomatis (Auto-Renewal)</option>
              <option value="Dapat Diperpanjang 1x Periode Tambahan">Dapat Diperpanjang 1x Periode Tambahan</option>
            </select>
          </div>

          <!-- Forum Sengketa -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Forum Penyelesaian Sengketa</label>
            <select v-model="editForm.disputeResolution" class="form-select">
              <option value="Arbitrase BANI di Jakarta">Arbitrase BANI di Jakarta</option>
              <option value="Pengadilan Negeri Jakarta Pusat">Pengadilan Negeri Jakarta Pusat</option>
              <option value="Singapore International Arbitration Centre (SIAC)">Singapore International Arbitration Centre (SIAC)</option>
              <option value="Musyawarah Mufakat & Mediasi Terlebih Dahulu">Musyawarah Mufakat &amp; Mediasi Terlebih Dahulu</option>
            </select>
          </div>

          <!-- Klausul Kewajiban Pokok -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Klausul Kewajiban Pokok &amp; Ruang Lingkup</label>
            <textarea v-model="editForm.keyObligations" rows="2" class="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] resize-none"></textarea>
          </div>

          <!-- Termin Pembayaran & Retensi -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Ketentuan Termin Pembayaran &amp; Retensi</label>
            <textarea v-model="editForm.paymentTerms" rows="3" class="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#2563EB] leading-relaxed"></textarea>
          </div>

          <!-- Sanksi & Denda Keterlambatan -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Sanksi &amp; Denda Keterlambatan (Penalty)</label>
            <input v-model="editForm.penalty" type="text" class="form-input" />
          </div>
        </div>

        <div class="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] font-semibold text-xs border border-[#CBD5E1] cursor-pointer transition">
            Batal
          </button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs cursor-pointer shadow-xs transition">
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

const companyOptions = [
  'PT Nusantara Energi',
  'PT Nusabara Sinergi Bersama',
  'PT Aksa Energi Palapa',
  'PT Java Power Solutions',
  'PT Borneo Mineral Resources',
  'PT Sumatera Green Energy',
  'PT Nusantara Holdings Utama'
];

const contractTypeOptions = [
  'Power Purchase Agreement (PPA)',
  'Engineering Procurement Construction (EPC)',
  'Coal / Mineral Supply Agreement (CSA)',
  'Equipment Supply & Maintenance',
  'Perjanjian Sewa Lahan & Bangunan (Lease)',
  'Insurance All Risks Policy',
  'IT & Telecommunications Agreement',
  'Freight Charter & Logistik',
  'Inspection & Survey Agreement',
  'Non-Disclosure Agreement (NDA)',
  'Surat Perintah Kerja (SPK) / Jasa Konsultansi'
];

const editForm = reactive({
  id: '',
  contractTitle: '',
  contractNumber: '',
  company: '',
  counterparty: '',
  contractType: '',
  project: '',
  effectiveDate: '',
  expiryDate: '',
  contractValue: 0,
  currency: 'IDR',
  pic: '',
  legalPic: '',
  status: 'ACTIVE',
  renewalStatus: '',
  keyObligations: '',
  paymentTerms: '',
  penalty: '',
  disputeResolution: '',
  governingLaw: ''
});

onMounted(() => {
  if (props.contract) {
    Object.assign(editForm, {
      id: props.contract.id,
      contractTitle: props.contract.contractTitle || '',
      contractNumber: props.contract.contractNumber || '',
      company: props.contract.company || 'PT Nusantara Energi',
      counterparty: props.contract.counterparty || '',
      contractType: props.contract.contractType || 'Power Purchase Agreement (PPA)',
      project: props.contract.project || '',
      effectiveDate: props.contract.effectiveDate || '',
      expiryDate: props.contract.expiryDate || '',
      contractValue: props.contract.contractValue || 0,
      currency: props.contract.currency || 'IDR',
      pic: props.contract.pic || '',
      legalPic: props.contract.legalPic || '',
      status: props.contract.status || 'ACTIVE',
      renewalStatus: props.contract.renewalStatus || 'Non-Renewable',
      keyObligations: props.contract.keyObligations || '',
      paymentTerms: props.contract.paymentTerms || '',
      penalty: props.contract.penalty || '',
      disputeResolution: props.contract.disputeResolution || 'Arbitrase BANI di Jakarta',
      governingLaw: props.contract.governingLaw || 'Hukum Republik Indonesia'
    });
  }
});

function submitForm() {
  legalStore.updateContract(editForm.id, { ...editForm });
  emit('close');
}
</script>
