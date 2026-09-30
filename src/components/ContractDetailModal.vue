<template>
  <div 
    v-if="legalStore.state.isContractDetailModalOpen && contract"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-floating max-w-3xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white text-[#0F172A]">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-semibold text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#C7D2FE]">
              {{ contract.id }}
            </span>
            <span 
              class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
              :class="getStatusBadgeClass(contract)"
            >
              {{ contract.status }}
            </span>
          </div>
          <h3 class="text-base font-bold text-[#0F172A] mt-1">{{ contract.contractTitle }}</h3>
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

      <!-- 4 Modal Sub-Tabs -->
      <div class="flex border-b border-[#E2E8F0] px-6 bg-white gap-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeSubTab = tab.id"
          class="py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer"
          :class="activeSubTab === tab.id ? 'border-[#6366F1] text-[#4338CA]' : 'border-transparent text-[#475569] hover:text-[#0F172A]'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-[#0F172A]">
        
        <!-- Tab 1: Ringkasan & Klausul -->
        <div v-if="activeSubTab === 'overview'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4 bg-[#F9FAFB] p-4 rounded-xl border border-[#E2E8F0]">
            <div>
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">Entitas Perusahaan</span>
              <span class="font-semibold text-[#0F172A] text-xs">{{ contract.company }}</span>
            </div>
            <div>
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">Pihak Mitra (Counterparty)</span>
              <span class="font-semibold text-[#0F172A] text-xs">{{ contract.counterparty }}</span>
            </div>
            <div>
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">Nomor Surat Perjanjian</span>
              <span class="font-mono font-semibold text-[#0F172A] text-xs">{{ contract.contractNumber }}</span>
            </div>
            <div>
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">Jenis / Tipe Kontrak</span>
              <span class="font-semibold text-[#0F172A] text-xs">{{ contract.contractType }}</span>
            </div>
            <div>
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">Tanggal Mulai Berlaku</span>
              <span class="font-semibold text-[#0F172A] text-xs">{{ contract.effectiveDate }}</span>
            </div>
            <div>
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">Tanggal Selesai (Expiry)</span>
              <span class="font-semibold text-[#0F172A] text-xs">{{ contract.expiryDate }}</span>
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-[#0F172A] mb-1">Kewajiban Pokok &amp; Ruang Lingkup:</h4>
            <p class="bg-[#FEF3C7]/40 p-3 rounded-xl border border-[#FDE68A] text-[#0F172A] leading-relaxed text-xs">
              {{ contract.keyObligations }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-[#F9FAFB] rounded-xl border border-[#E2E8F0]">
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">PIC Unit Bisnis</span>
              <span class="font-semibold text-[#0F172A]">{{ contract.pic }}</span>
            </div>
            <div class="p-3 bg-[#F9FAFB] rounded-xl border border-[#E2E8F0]">
              <span class="text-[#475569] text-[10px] uppercase font-semibold block">Penasihat Hukum (Legal PIC)</span>
              <span class="font-semibold text-[#0F172A]">{{ contract.legalPic }}</span>
            </div>
          </div>
        </div>

        <!-- Tab 2: Termin Pembayaran -->
        <div v-if="activeSubTab === 'payment'" class="space-y-4">
          <div class="p-5 bg-[#EEF2FF] text-[#0F172A] rounded-xl border border-[#C7D2FE] space-y-1">
            <span class="text-[10px] uppercase font-semibold text-[#4338CA]">Total Nilai Kontrak</span>
            <div class="text-2xl font-bold text-[#0F172A]">{{ formatIDR(contract.contractValue) }}</div>
            <span class="text-xs text-[#4338CA] font-medium">Mata Uang: {{ contract.currency }}</span>
          </div>

          <div>
            <h4 class="font-semibold text-[#0F172A] mb-1">Ketentuan Termin Pembayaran:</h4>
            <p class="p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E2E8F0] text-[#0F172A] leading-relaxed">
              {{ contract.paymentTerms }}
            </p>
          </div>
        </div>

        <!-- Tab 3: Riwayat Addendum -->
        <div v-if="activeSubTab === 'addendum'" class="space-y-3">
          <div class="p-3 bg-[#F9FAFB] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span class="font-semibold text-[#0F172A] block">Ketentuan Opsi Perpanjangan (Renewal)</span>
              <span class="text-[#475569] text-xs">{{ contract.renewalStatus }}</span>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
              Terdaftar
            </span>
          </div>

          <div v-if="contract.addendums && contract.addendums.length > 0" class="border-l-2 border-[#6366F1] pl-4 py-2 space-y-3">
            <div v-for="add in contract.addendums" :key="add.id">
              <div class="text-xs font-semibold text-[#0F172A]">{{ add.number }} • {{ add.date }}</div>
              <div class="text-xs text-[#475569]">{{ add.notes }}</div>
            </div>
          </div>

          <div v-else class="p-6 text-center text-[#94A3B8] bg-[#F9FAFB] rounded-xl border border-[#E2E8F0]">
            Belum ada addendum yang tercatat untuk kontrak ini.
          </div>
        </div>

        <!-- Tab 4: Berkas Salinan Kontrak -->
        <div v-if="activeSubTab === 'document'" class="space-y-3">
          <div class="p-6 bg-[#F9FAFB] rounded-xl border border-[#E2E8F0] text-center space-y-2">
            <svg class="w-12 h-12 text-[#6366F1] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div class="font-bold text-[#0F172A] text-sm">Salinan Berkas Asli Bertanda Tangan (PDF)</div>
            <p class="text-xs text-[#475569]">Berkas digital tersimpan aman pada repositori terenkripsi perseroan.</p>
            <button 
              @click="downloadPDF"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-xl text-xs transition cursor-pointer shadow-xs focus:ring-3 focus:ring-[#C7D2FE]"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh Berkas Salinan Asli</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-3.5 bg-[#F9FAFB] border-t border-[#E2E8F0] flex justify-end">
        <button 
          @click="closeModal" 
          class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-medium text-xs rounded-xl transition cursor-pointer"
        >
          Tutup Rincian
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { legalStore, formatIDR, calculateDaysRemaining } from '../stores/legalStore';

const activeSubTab = ref('overview');

const tabs = [
  { id: 'overview', label: '1. Ringkasan & Klausul' },
  { id: 'payment', label: '2. Termin Pembayaran' },
  { id: 'addendum', label: '3. Riwayat Addendum' },
  { id: 'document', label: '4. Berkas Digital' }
];

const contract = computed(() => legalStore.state.selectedContract);

function closeModal() {
  legalStore.state.isContractDetailModalOpen = false;
}

function getStatusBadgeClass(c) {
  const days = calculateDaysRemaining(c.expiryDate);
  if (c.status === 'ACTIVE') return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
  if (c.status === 'EXPIRING') {
    return days <= 7 ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]' : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
  }
  return 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]';
}

function downloadPDF() {
  legalStore.triggerToast('Mengunduh salinan berkas kontrak resmi (PDF)...', 'success');
}
</script>
