<template>
  <div 
    v-if="legalStore.state.isAddContractModalOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-floating max-w-2xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
      
      <div class="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white text-[#0F172A]">
        <div>
          <h3 class="text-base font-bold text-[#0F172A]">Pendaftaran Kontrak Baru</h3>
          <p class="text-xs text-[#475569]">Registrasikan perjanjian komersial baru ke database hukum perseroan.</p>
        </div>
        <button 
          @click="closeModal" 
          class="rounded-xl p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Entitas Perusahaan *</label>
            <select v-model="form.company" required class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
              <option value="PT Nusantara Energi">PT Nusantara Energi</option>
              <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
              <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Pihak Mitra (Counterparty) *</label>
            <input v-model="form.counterparty" type="text" required placeholder="Contoh: PT PLN (Persero)" class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
          </div>
        </div>

        <div>
          <label class="block font-semibold text-[#0F172A] mb-1">Judul Perjanjian *</label>
          <input v-model="form.contractTitle" type="text" required placeholder="Contoh: Perjanjian Jual Beli Tenaga Listrik 50 MW" class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Nomor Surat Kontrak *</label>
            <input v-model="form.contractNumber" type="text" required placeholder="PPA-PLN-NE-2026-001" class="w-full rounded-xl border border-[#E2E8F0] p-2.5 font-mono text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
          </div>
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Jenis Kontrak *</label>
            <select v-model="form.contractType" required class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
              <option value="Power Purchase Agreement (PPA)">Power Purchase Agreement (PPA)</option>
              <option value="EPC Contract">EPC Contract</option>
              <option value="Coal Supply Agreement (CSA)">Coal Supply Agreement (CSA)</option>
              <option value="Sewa Alat Berat & Maintenance">Sewa Alat Berat &amp; Maintenance</option>
              <option value="Insurance All Risks">Insurance All Risks</option>
              <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Tanggal Mulai Berlaku *</label>
            <input v-model="form.effectiveDate" type="date" required class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
          </div>
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Tanggal Berakhir (Expiry) *</label>
            <input v-model="form.expiryDate" type="date" required class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Nilai Kontrak (Nominal) *</label>
            <input v-model.number="form.contractValue" type="number" required min="0" placeholder="15000000000" class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
          </div>
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">Mata Uang *</label>
            <select v-model="form.currency" class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]">
              <option value="IDR">IDR (Rupiah Indonesia)</option>
              <option value="USD">USD (Dolar Amerika)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-semibold text-[#0F172A] mb-1">Kewajiban Pokok &amp; Lingkup Pekerjaan</label>
          <textarea v-model="form.keyObligations" rows="2" placeholder="Tuliskan ringkasan komitmen pekerjaan utama..." class="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]"></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-medium rounded-xl transition cursor-pointer">
            Batal
          </button>
          <button type="submit" class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-xl shadow-xs transition cursor-pointer focus:ring-3 focus:ring-[#C7D2FE]">
            Simpan Kontrak
          </button>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { legalStore } from '../stores/legalStore';

const form = reactive({
  company: 'PT Nusantara Energi',
  counterparty: '',
  contractTitle: '',
  contractNumber: '',
  contractType: 'Power Purchase Agreement (PPA)',
  effectiveDate: '',
  expiryDate: '',
  contractValue: null,
  currency: 'IDR',
  keyObligations: ''
});

function closeModal() {
  legalStore.state.isAddContractModalOpen = false;
}

function handleSubmit() {
  if (form.expiryDate <= form.effectiveDate) {
    legalStore.triggerToast('Kesalahan: Tanggal berakhir harus lebih besar daripada tanggal efektif.', 'error');
    return;
  }

  const success = legalStore.addContract(form);
  if (success) {
    closeModal();
  }
}
</script>
