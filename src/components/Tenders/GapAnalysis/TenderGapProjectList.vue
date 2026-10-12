<template>
  <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
    <!-- List Header -->
    <div class="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC]/80">
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            <Milestone class="w-3.5 h-3.5" />
            <span>LANGKAH 1</span>
          </span>
          <h3 class="text-base font-extrabold text-[#0F172A]">
            Pilih Paket Lelang untuk Audit Dokumen & Gap Analysis
          </h3>
        </div>
        <p class="text-xs text-[#475569] mt-0.5">
          Pilih dan klik salah satu paket lelang di bawah untuk membuka detail audit kelengkapan berkas legal, deteksi dokumen kurang, serta pemenuhan sertifikat.
        </p>
      </div>

      <!-- Quick Search Filter in List -->
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="tenderListSearch"
          type="text"
          placeholder="Cari nama tender, nomor, panitia, PIC..."
          class="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
        />
      </div>
    </div>

    <!-- The Simplified Interactive List (Nama, Status, Kode) -->
    <div class="divide-y divide-[#E2E8F0]">
      <!-- ROW 1: KONSOLIDASI SEMUA PAKET (GLOBAL AUDIT) -->
      <div
        @click="$emit('select-tender', 'ALL')"
        class="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center justify-between gap-4 group bg-slate-50/70"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-[10px] font-mono font-extrabold uppercase px-2 py-1 rounded-md bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] shrink-0">
            ALL
          </span>
          <span class="text-sm font-bold text-[#0F172A] group-hover:text-[#4338CA] transition-colors truncate">
            Semua Paket Lelang (Konsolidasi Global Lintas Tender)
          </span>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <span
            v-if="totalMissingDocs > 0"
            class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
          >
            {{ totalMissingDocs }} Dokumen Kurang
          </span>
          <span
            v-else
            class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
          >
            Dokumen Lengkap
          </span>
          <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      <!-- ROWS 2..N: EACH TENDER ITEM (SIMPLE: KODE, NAMA, STATUS) -->
      <div
        v-for="tender in filteredTenderList"
        :key="tender.id"
        @click="$emit('select-tender', tender.id)"
        class="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span class="font-mono text-xs font-bold text-[#4338CA] bg-[#EEF2FF] px-2.5 py-1 rounded-md border border-[#C7D2FE] shrink-0">
            {{ tender.id }}
          </span>

          <span
            v-if="tender.sector"
            :class="getSectorBadge(tender.sector).badgeClass"
            class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1"
          >
            <span>{{ getSectorBadge(tender.sector).icon }}</span>
            <span>{{ getSectorBadge(tender.sector).label }}</span>
          </span>

          <span class="text-sm font-bold text-[#0F172A] group-hover:text-[#4338CA] transition-colors truncate">
            {{ tender.title }}
          </span>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <span
            v-if="getTenderMissingDocs(tender) > 0"
            class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
          >
            {{ getTenderMissingDocs(tender) }} Dokumen Kurang
          </span>
          <span
            v-else
            class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
          >
            Dokumen Lengkap
          </span>
          <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Milestone, Search, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  tenders: {
    type: Array,
    default: () => []
  },
  totalMissingDocs: {
    type: Number,
    default: 0
  }
});

defineEmits(['select-tender']);

const tenderListSearch = ref('');

const filteredTenderList = computed(() => {
  const q = tenderListSearch.value.toLowerCase().trim();
  if (!q) return props.tenders;
  return props.tenders.filter(t => 
    t.title.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q) ||
    (t.organizer && t.organizer.toLowerCase().includes(q)) ||
    (t.pic && t.pic.toLowerCase().includes(q))
  );
});

function getTenderMissingDocs(t) {
  return t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
}

function getSectorBadge(sectorKey) {
  switch (sectorKey) {
    case 'KONSTRUKSI':
      return { label: 'Konstruksi', icon: '🏗️', badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]' };
    case 'PERTAMBANGAN':
      return { label: 'Pertambangan', icon: '⛏️', badgeClass: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' };
    case 'MIGAS':
      return { label: 'Minyak & Gas', icon: '🛢️', badgeClass: 'bg-[#FDF2F8] text-[#9D174D] border border-[#FCE7F3]' };
    case 'ENERGI':
      return { label: 'Energi Listrik', icon: '⚡', badgeClass: 'bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]' };
    default:
      return { label: 'Pengadaan Umum', icon: '📦', badgeClass: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]' };
  }
}
</script>
