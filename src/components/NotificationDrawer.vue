<template>
  <div 
    class="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white shadow-floating border-l border-[#E2E8F0] transform transition-transform duration-200 ease-in-out flex flex-col"
    :class="legalStore.state.isNotificationDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white text-[#0F172A]">
      <div class="flex items-center gap-2">
        <Bell class="w-5 h-5 text-[#6366F1]" />
        <h3 class="font-bold text-[#0F172A] text-sm">Pemberitahuan Sistem Legal</h3>
      </div>
      <button 
        @click="legalStore.state.isNotificationDrawerOpen = false" 
        class="text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer transition"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
      
      <!-- Critical Expiry Alert -->
      <div 
        v-for="contract in criticalContracts" 
        :key="contract.id"
        class="p-3 bg-[#FFE4E6] border border-[#FECDD3] rounded-xl space-y-1 cursor-pointer hover:bg-[#FFE4E6]/80 transition shadow-xs"
        @click="openContract(contract.id)"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-[#9F1239] uppercase tracking-wider">Peringatan Kritis (&le;7 Hari)</span>
          <span class="font-mono text-[10px] font-bold text-[#9F1239]">{{ contract.daysRemaining }} hari lagi</span>
        </div>
        <div class="font-bold text-[#0F172A]">{{ contract.id }}: {{ contract.contractTitle }}</div>
        <p class="text-[#475569] text-[11px]">Mitra: {{ contract.counterparty }} • Segera siapkan addendum/terminasi.</p>
      </div>

      <!-- Warning Expiry Alert -->
      <div 
        v-for="contract in warningContracts" 
        :key="contract.id"
        class="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl space-y-1 cursor-pointer hover:bg-[#FEF3C7]/80 transition shadow-xs"
        @click="openContract(contract.id)"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-[#92400E] uppercase tracking-wider">Peringatan Siaga (&le;30 Hari)</span>
          <span class="font-mono text-[10px] font-bold text-[#92400E]">{{ contract.daysRemaining }} hari lagi</span>
        </div>
        <div class="font-bold text-[#0F172A]">{{ contract.id }}: {{ contract.contractTitle }}</div>
        <p class="text-[#475569] text-[11px]">Mitra: {{ contract.counterparty }}</p>
      </div>

      <!-- Overdue Request Alert -->
      <div
        v-for="req in overdueRequests"
        :key="req.id"
        class="p-3 bg-[#FFE4E6] border border-[#FECDD3] rounded-xl space-y-1 cursor-pointer hover:bg-[#FFE4E6]/80 transition shadow-xs"
        @click="openRequest(req.id)"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-[#9F1239] uppercase tracking-wider">SLA Overdue</span>
          <span class="font-mono text-[10px] font-bold text-[#9F1239]">Melewati Tenggat</span>
        </div>
        <div class="font-bold text-[#0F172A]">{{ req.ticketNumber || req.id }}: {{ req.subject }}</div>
        <p class="text-[#475569] text-[11px]">Pemohon: {{ req.requestor }} ({{ req.department }})</p>
      </div>

      <!-- Hearing Alert -->
      <div
        @click="openDispute"
        class="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl space-y-1 cursor-pointer hover:bg-[#E0E7FF] transition shadow-xs"
      >
        <span class="text-[10px] font-bold text-[#4338CA] uppercase tracking-wider block">Agenda Sidang Litigasi</span>
        <div class="font-bold text-[#0F172A]">Perkara BANI Turbin No. 45021: Pembuktian Ahli</div>
        <p class="text-[#475569] text-[11px]">Dijadwalkan besok lusa di BANI Arbitration Center Jakarta.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bell, X } from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';

const criticalContracts = computed(() => {
  return legalStore.state.contracts
    .filter(c => c.status !== 'EXPIRED')
    .map(c => ({ ...c, daysRemaining: calculateDaysRemaining(c.expiryDate) }))
    .filter(c => c.daysRemaining <= 7 && c.daysRemaining >= 0);
});

const warningContracts = computed(() => {
  return legalStore.state.contracts
    .filter(c => c.status !== 'EXPIRED')
    .map(c => ({ ...c, daysRemaining: calculateDaysRemaining(c.expiryDate) }))
    .filter(c => c.daysRemaining > 7 && c.daysRemaining <= 30);
});

const overdueRequests = computed(() => {
  return legalStore.state.requests.filter(r => {
    if (r.status === 'OVERDUE') return true;
    const days = calculateDaysRemaining(r.deadline);
    return days < 0 && r.status !== 'COMPLETED' && r.status !== 'CLOSED';
  });
});

function openContract(id) {
  legalStore.state.isNotificationDrawerOpen = false;
  legalStore.navigate('contracts', id);
  const found = legalStore.state.contracts.find(c => c.id === id);
  if (found) {
    legalStore.state.selectedContract = found;
    legalStore.state.isContractDetailModalOpen = true;
  }
}

function openRequest(id) {
  legalStore.state.isNotificationDrawerOpen = false;
  legalStore.navigate('requests', id);
}

function openDispute() {
  legalStore.state.isNotificationDrawerOpen = false;
  legalStore.navigate('disputes');
}
</script>
