<template>
  <div class="p-6 space-y-6 animate-in fade-in duration-150">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
      <div>
        <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <Award class="w-5 h-5 text-[#6366F1]" />
          <span>Hasil Penetapan Pemenang Lelang & Konversi Kontrak</span>
        </h3>
        <p class="text-xs text-[#475569] mt-0.5">
          Rekam hasil pengumuman resmi dan secara otomatis konversi paket yang menang menjadi Kontrak Korporasi aktif.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('open-record-result-modal')"
          class="px-4 py-2 bg-white border border-[#E2E8F0] hover:border-[#C7D2FE] text-[#0F172A] text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
        >
          Catat Hasil Pemenang
        </button>
      </div>
    </div>

    <!-- WON BANNER & ONE-CLICK CONVERT BUTTON -->
    <div
      v-if="tender.status === 'WON' || tender.status === 'WIN' || tender.status === 'CONVERTED'"
      class="p-6 rounded-2xl bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#ECFDF5] border-2 border-[#86EFAC] shadow-xs space-y-4"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Award class="w-6 h-6 text-emerald-600" />
            <span class="text-base font-extrabold text-emerald-900">
              SELAMAT! PAKET INI DINYATAKAN SEBAGAI PEMENANG LELANG (PERINGKAT 1)
            </span>
          </div>
          <p class="text-xs text-emerald-800">
            Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) telah diterbitkan. Paket siap ditransisikan ke manajemen kontrak aktif.
          </p>
        </div>

        <!-- Convert / Converted button -->
        <div>
          <button
            v-if="tender.status !== 'CONVERTED'"
            @click="handleConvertToContract"
            class="px-5 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <FileSignature class="w-4 h-4" />
            <span>Konversi Menjadi Kontrak Korporasi Sekarang →</span>
          </button>

          <div v-else class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold">
              ✓ Telah Dikonversi: {{ tender.convertedContractId }}
            </span>
            <button
              @click="legalStore.navigate('contracts', tender.convertedContractId)"
              class="px-3 py-1.5 bg-[#6366F1] text-white text-xs font-bold rounded-xl hover:bg-[#4F46E5] transition"
            >
              Buka di Modul Kontrak →
            </button>
          </div>
        </div>
      </div>

      <!-- Result Specs -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
          <div class="text-[10px] text-emerald-700 font-bold">Nilai Kontrak Dimenangkan</div>
          <div class="text-sm font-bold font-mono text-emerald-900 mt-0.5">
            {{ formatIDR(tender.result?.winPrice || tender.bidValue) }}
          </div>
        </div>

        <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
          <div class="text-[10px] text-emerald-700 font-bold">Entitas Pemenang</div>
          <div class="text-sm font-bold text-emerald-900 mt-0.5">
            {{ tender.result?.winner || tender.company }}
          </div>
        </div>

        <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
          <div class="text-[10px] text-emerald-700 font-bold">Sektor Industri</div>
          <div class="text-sm font-bold text-emerald-900 mt-0.5">
            {{ getSectorBadge(tender.sector).label }}
          </div>
        </div>

        <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
          <div class="text-[10px] text-emerald-700 font-bold">Tanggal Penetapan</div>
          <div class="text-sm font-bold text-emerald-900 mt-0.5">
            {{ tender.result?.date || '2026-02-05' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Lessons Learned List -->
    <div class="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-3">
      <h4 class="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
        <TrendingUp class="w-4 h-4 text-[#6366F1]" />
        <span>Evaluasi & Lessons Learned (Pembelajaran Tender Berikutnya)</span>
      </h4>

      <div class="space-y-2 text-xs">
        <div
          v-for="(lesson, lIdx) in (tender.result?.lessons || defaultLessons)"
          :key="lIdx"
          class="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[#0F172A] flex items-start gap-2"
        >
          <span class="font-bold text-[#4338CA]">{{ lIdx + 1 }}.</span>
          <span class="leading-relaxed">{{ lesson }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Award, FileSignature, TrendingUp } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../../../stores/legalStore';

const props = defineProps({
  tender: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-record-result-modal']);

const defaultLessons = [
  'Optimalisasi Tingkat Komponen Dalam Negeri (TKDN) sangat vital untuk margin preferensi.',
  'Struktur penawaran harga harus fleksibel terhadap fluktuasi nilai tukar (hedging).',
  'Penyiapan referensi pengalaman kerja sejenis harus lebih awal agar tidak terburu-buru.',
  'Negosiasi SLA (Service Level Agreement) dengan vendor tier-2 perlu diperketat.'
];

function getSectorBadge(sectorKey) {
  switch (sectorKey) {
    case 'KONSTRUKSI': return { label: 'Konstruksi', icon: '🏗️', badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]' };
    case 'PERTAMBANGAN': return { label: 'Pertambangan', icon: '⛏️', badgeClass: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' };
    case 'MIGAS': return { label: 'Minyak & Gas', icon: '🛢️', badgeClass: 'bg-[#FDF2F8] text-[#9D174D] border border-[#FCE7F3]' };
    case 'ENERGI': return { label: 'Energi Listrik', icon: '⚡', badgeClass: 'bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]' };
    default: return { label: 'Pengadaan Umum', icon: '📦', badgeClass: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]' };
  }
}

function handleConvertToContract() {
  if (!props.tender) return;
  legalStore.convertTenderToContract(props.tender.id);
  legalStore.triggerToast('Paket tender berhasil dikonversi menjadi Kontrak Korporasi!', 'success');
}
</script>
