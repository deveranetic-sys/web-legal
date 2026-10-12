<template>
  <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
    <div class="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]/80">
      <div>
        <h3 class="text-sm font-bold text-[#0F172A] flex items-center gap-2">
          <LayoutGrid class="w-4 h-4 text-[#6366F1]" />
          <span>Matriks Pemetaan Kualifikasi Lintas Tender (Master Cross-Check)</span>
        </h3>
        <p class="text-xs text-[#475569] mt-0.5">
          Tinjauan cepat 10 dokumen kualifikasi legal utama terhadap masing-masing paket lelang yang terdaftar.
        </p>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="bg-slate-100/70 border-b border-[#E2E8F0] text-[#0F172A] font-bold">
            <th class="py-3 px-4 min-w-[200px]">Dokumen Kualifikasi Master</th>
            <th class="py-3 px-4 min-w-[130px]">Kategori</th>
            <th
              v-for="t in displayedTenders"
              :key="t.id"
              class="py-3 px-3 text-center min-w-[140px] border-l border-[#E2E8F0]"
            >
              <div class="font-mono text-xs text-[#0F172A]">{{ t.id }}</div>
              <div class="text-[10px] text-[#475569] font-normal truncate max-w-[130px]" :title="t.title">
                {{ t.title }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E8F0]">
          <tr
            v-for="vDoc in masterMatrixList"
            :key="vDoc.code"
            class="hover:bg-[#F8FAFC] transition-colors"
          >
            <td class="py-3 px-4 font-semibold text-[#0F172A]">
              <div class="flex items-center gap-1.5">
                <span class="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-[#0F172A]">
                  {{ vDoc.code }}
                </span>
                <span>{{ vDoc.name }}</span>
              </div>
            </td>
            <td class="py-3 px-4 text-[#475569]">
              {{ vDoc.category }}
            </td>
            <td
              v-for="t in displayedTenders"
              :key="t.id"
              class="py-3 px-3 text-center border-l border-[#E2E8F0]"
            >
              <div v-if="getDocMatchInTender(t, vDoc.name) === 'TERPENUHI'" class="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-[#BBF7D0] text-[10px]">
                <CheckCircle2 class="w-3 h-3" />
                <span>Lengkap</span>
              </div>
              <div v-else-if="getDocMatchInTender(t, vDoc.name) === 'KURANG'" class="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-[#FECDD3] text-[10px]">
                <XCircle class="w-3 h-3" />
                <span>Kurang</span>
              </div>
              <div v-else-if="getDocMatchInTender(t, vDoc.name) === 'KEDALUWARSA'" class="inline-flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[10px]">
                <Clock class="w-3 h-3" />
                <span>Kedaluwarsa</span>
              </div>
              <div v-else class="text-[10px] text-slate-400">
                - Tidak Wajib -
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { LayoutGrid, CheckCircle2, XCircle, Clock } from 'lucide-vue-next';

const props = defineProps({
  tenders: {
    type: Array,
    default: () => []
  },
  filterTenderId: {
    type: String,
    default: 'ALL'
  }
});

const displayedTenders = computed(() => {
  if (props.filterTenderId === 'ALL') return props.tenders;
  return props.tenders.filter(x => x.id === props.filterTenderId);
});

// Master Matrix template list (top 10 common qualification documents)
const masterMatrixList = [
  { code: 'NIB-OSS', name: 'Nomor Induk Berusaha (NIB OSS RBA)', category: 'Legal Administrasi' },
  { code: 'AKTA-AHU', name: 'Akta Notaris & SK Kemenkumham Terakhir', category: 'Legal Administrasi' },
  { code: 'SBU-LPJK', name: 'Sertifikat Badan Usaha (SBU Konstruksi)', category: 'Kualifikasi Teknis' },
  { code: 'ISO-9001', name: 'ISO 9001:2015 Sistem Manajemen Mutu', category: 'Kepatuhan & Integritas' },
  { code: 'ISO-14001', name: 'ISO 14001:2018 Sistem Manajemen Lingkungan', category: 'Kepatuhan & Integritas' },
  { code: 'ISO-45001', name: 'ISO 45001:2018 / SMK3 Sistem Manajemen K3', category: 'Kepatuhan & Integritas' },
  { code: 'KSWP-DJP', name: 'Konfirmasi Status Wajib Pajak (KSWP Valid)', category: 'Finansial & Keuangan' },
  { code: 'KAP-AUDIT', name: 'Laporan Keuangan Audited KAP (WTP)', category: 'Finansial & Keuangan' },
  { code: 'SKK-BANK', name: 'Surat Keterangan Dukungan Keuangan Bank', category: 'Finansial & Keuangan' },
  { code: 'NON-BLACKLIST', name: 'Surat Bebas Blacklist / Portal Inaproc LKPP', category: 'Legal Administrasi' }
];

function getDocMatchInTender(tender, masterDocName) {
  if (!tender.documents) return 'NONE';
  const query = masterDocName.toLowerCase().slice(0, 10);
  const found = tender.documents.find(d => d.name.toLowerCase().includes(query) || masterDocName.toLowerCase().includes(d.name.toLowerCase().slice(0, 10)));
  if (!found) return 'NONE';
  return found.status;
}
</script>
