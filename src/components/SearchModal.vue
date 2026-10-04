<template>
  <div 
    v-if="legalStore.state.isSearchModalOpen" 
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-100"
    @click.self="legalStore.state.isSearchModalOpen = false"
  >
    <div class="bg-white rounded-2xl shadow-floating max-w-xl w-full overflow-hidden border border-[#E2E8F0]">
      
      <!-- Input bar -->
      <div class="p-3.5 border-b border-[#E2E8F0] flex items-center gap-2.5 bg-white">
        <Search class="w-4 h-4 text-[#6366F1]" />
        <input 
          v-model="searchQuery" 
          ref="searchInputRef"
          type="text" 
          placeholder="Ketik kata kunci kontrak, nomor surat, tiket permohonan, lelang, regulasi..." 
          class="w-full text-xs outline-none bg-transparent text-[#0F172A] placeholder-[#94A3B8]"
        />
        <kbd 
          @click="legalStore.state.isSearchModalOpen = false" 
          class="text-[10px] text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-[#E2E8F0] transition"
        >ESC</kbd>
      </div>

      <!-- Results list -->
      <div class="p-3 max-h-80 overflow-y-auto space-y-1.5 text-xs text-[#0F172A]">
        <div v-if="!searchQuery.trim()" class="text-xs text-[#94A3B8] px-2 py-4 text-center">
          Ketik kata kunci untuk mencari di seluruh modul (Kontrak, Permohonan, Lelang, Regulasi, Sengketa)...
        </div>

        <div v-else-if="allResults.length === 0" class="text-xs text-[#94A3B8] px-2 py-4 text-center">
          Tidak ditemukan data yang sesuai dengan kata kunci "{{ searchQuery }}".
        </div>

        <div 
          v-for="item in allResults" 
          :key="item.id"
          @click="selectItem(item)"
          class="p-2.5 hover:bg-[#F8FAFC] rounded-xl cursor-pointer flex items-center justify-between transition border border-transparent hover:border-[#E2E8F0]"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                {{ item.type }}
              </span>
              <span class="font-semibold text-[#0F172A]">{{ item.id }}: {{ item.title }}</span>
            </div>
            <div class="text-[11px] text-[#475569] mt-0.5">{{ item.subtitle }}</div>
          </div>
          <span class="text-xs font-semibold text-[#4338CA] hover:text-[#6366F1]">
            Buka &rarr;
          </span>
        </div>
      </div>

      <div class="px-4 py-2.5 bg-[#F9FAFB] border-t border-[#E2E8F0] text-[11px] text-[#94A3B8] flex justify-between">
        <span>Tekan ESC untuk menutup</span>
        <span>Navigasi instan ke modul terkait</span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Search } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const searchQuery = ref('');
const searchInputRef = ref(null);

watch(() => legalStore.state.isSearchModalOpen, (isOpen) => {
  if (isOpen) {
    searchQuery.value = '';
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
});

const allResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return [];
  const results = [];

  // Contracts
  legalStore.state.contracts.forEach(c => {
    if (c.contractTitle.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.counterparty.toLowerCase().includes(q)) {
      results.push({
        id: c.id,
        module: 'contracts',
        type: 'Kontrak',
        title: c.contractTitle,
        subtitle: `Mitra: ${c.counterparty} • ${c.contractNumber}`
      });
    }
  });

  // Requests
  legalStore.state.requests.forEach(r => {
    if (r.subject.toLowerCase().includes(q) || (r.ticketNumber && r.ticketNumber.toLowerCase().includes(q)) || r.requestor.toLowerCase().includes(q)) {
      results.push({
        id: r.id,
        module: 'requests',
        type: 'Permintaan',
        title: r.subject,
        subtitle: `Pemohon: ${r.requestor} (${r.department})`
      });
    }
  });

  // Disputes
  legalStore.state.disputes.forEach(d => {
    if (d.opponent.toLowerCase().includes(q) || d.caseNumber.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)) {
      results.push({
        id: d.id,
        module: 'disputes',
        type: 'Sengketa',
        title: `${d.company} vs ${d.opponent}`,
        subtitle: `${d.caseNumber} • ${d.courtOrInstitution}`
      });
    }
  });

  // Knowledge
  legalStore.state.knowledge.forEach(k => {
    if (k.title.toLowerCase().includes(q) || k.summary.toLowerCase().includes(q)) {
      results.push({
        id: k.id,
        module: 'knowledge',
        type: 'Regulasi',
        title: k.title,
        subtitle: `${k.category} • ${k.sector}`
      });
    }
  });

  // Tenders & Lelang (Hanya jika modul aktif)
  if (legalStore.state.ENABLE_TENDER_MODULE) {
    (legalStore.state.tenders || []).forEach(t => {
      const hasDocMatch = t.documents?.some(d => d.name.toLowerCase().includes(q));
      if (t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.tenderNumber.toLowerCase().includes(q) || t.organizer.toLowerCase().includes(q) || hasDocMatch) {
        const missingCount = t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
        results.push({
          id: t.id,
          module: 'tenders',
          type: 'Lelang & Dokumen',
          title: t.title,
          subtitle: `Instansi: ${t.organizer} • ${t.stage} • ${missingCount > 0 ? `${missingCount} Dokumen Kurang` : 'Lengkap 100%'}`
        });
      }
    });
  }

  return results.slice(0, 10);
});

function selectItem(item) {
  legalStore.state.isSearchModalOpen = false;
  legalStore.navigate(item.module, item.id);
}
</script>
