<template>
  <div class="p-6 space-y-6 animate-in fade-in duration-150">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
      <div>
        <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <DollarSign class="w-5 h-5 text-[#6366F1]" />
          <span>Struktur Pricing & Deteksi Anomali HPS (&lt;80% Pagu)</span>
        </h3>
        <p class="text-xs text-[#475569] mt-0.5">
          Analisis perbandingan harga penawaran terhadap HPS panitia sesuai aturan Perpres 16/2018 & LKPP.
        </p>
      </div>
    </div>

    <!-- REGULATORY ALERT BANNER IF BID < 80% HPS -->
    <div
      v-if="pricingIsBelow80"
      class="p-5 rounded-2xl bg-[#FFE4E6] border-2 border-[#FDA4AF] text-[#9F1239] shadow-sm space-y-2 animate-in zoom-in-95 duration-150"
    >
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-5 h-5 text-[#9F1239] shrink-0" />
        <h4 class="text-sm font-extrabold tracking-tight">
          PERINGATAN REGULASI PENGADAAN (PERPRES 16/2018 & LKPP NO. 12/2021)
        </h4>
      </div>
      <p class="text-xs leading-relaxed">
        Penawaran diajukan sebesar <strong>{{ formatIDR(pricingForm.bidValue) }}</strong> atau
        <strong>{{ ((pricingForm.bidValue / (pricingForm.hpsValue || 1)) * 100).toFixed(1) }}%</strong> dari Nilai HPS (<strong>di bawah batas ambang 80% HPS</strong>).
      </p>
      <div class="p-3 bg-white/80 rounded-xl text-xs space-y-1 font-medium border border-[#FECDD3]">
        <div class="flex items-center gap-2 text-rose-900 font-bold">
          <span>✓ Kewajiban 1:</span>
          <span>Wajib menyiapkan Dokumen Evaluasi Kewajaran Harga (EKH) dan Analisa Harga Satuan Pekerjaan (AHSP) timpang.</span>
        </div>
        <div class="flex items-center gap-2 text-rose-900 font-bold">
          <span>✓ Kewajiban 2:</span>
          <span>
            Besaran Jaminan Pelaksanaan (Performance Bond) naik menjadi <strong>5% dari Nilai HPS</strong>
            (sebesar <strong class="underline font-mono">{{ formatIDR(pricingForm.hpsValue * 0.05) }}</strong>), BUKAN 5% dari nilai kontrak!
          </span>
        </div>
      </div>
    </div>

    <!-- Financial Comparison Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
        <div class="text-[11px] text-[#475569] font-semibold">Pagu HPS Panitia</div>
        <div class="text-xl font-bold font-mono text-[#0F172A] mt-1">
          {{ formatIDR(pricingForm.hpsValue) }}
        </div>
        <div class="text-[10px] text-[#475569] mt-1">Owner Estimate (OE) Pokja</div>
      </div>

      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
        <div class="text-[11px] text-[#475569] font-semibold">Nilai Penawaran Peserta</div>
        <div class="text-xl font-bold font-mono text-[#4338CA] mt-1">
          {{ formatIDR(pricingForm.bidValue) }}
        </div>
        <div class="text-[10px] text-emerald-600 font-semibold mt-1">
          Rasio: {{ ((pricingForm.bidValue / (pricingForm.hpsValue || 1)) * 100).toFixed(1) }}% HPS
        </div>
      </div>

      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
        <div class="text-[11px] text-[#475569] font-semibold">Target Margin Laba</div>
        <div class="text-xl font-bold font-mono text-emerald-700 mt-1">
          {{ pricingForm.marginPercent }}%
        </div>
        <div class="text-[10px] text-[#475569] mt-1">
          Estimasi Laba: <strong>{{ formatIDR((pricingForm.bidValue * pricingForm.marginPercent) / 100) }}</strong>
        </div>
      </div>

      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-[#EEF2FF]">
        <div class="text-[11px] text-[#4338CA] font-semibold">Jaminan Pelaksanaan (PB)</div>
        <div class="text-xl font-bold font-mono text-[#4338CA] mt-1">
          {{ formatIDR(pricingIsBelow80 ? pricingForm.hpsValue * 0.05 : pricingForm.bidValue * 0.05) }}
        </div>
        <div class="text-[10px] text-[#4338CA] font-semibold mt-1">
          {{ pricingIsBelow80 ? 'Wajib 5% HPS (Klausul <80%)' : '5% dari Nilai Kontrak' }}
        </div>
      </div>
    </div>

    <!-- Cost Breakdown Inputs -->
    <div class="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-4">
      <h4 class="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
        Rincian Estimasi Biaya & Struktur Penawaran (Cost Breakdown)
      </h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Pagu HPS Panitia (IDR)</label>
          <input
            v-model.number="pricingForm.hpsValue"
            type="number"
            min="0"
            class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
          />
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Nilai Penawaran (IDR)</label>
          <input
            v-model.number="pricingForm.bidValue"
            type="number"
            min="0"
            class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
          />
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Biaya Langsung (Direct Cost)</label>
          <input
            v-model.number="pricingForm.directCost"
            type="number"
            min="0"
            placeholder="Material, Pekerja, Alat"
            class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
          />
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Target Margin (%)</label>
          <input
            v-model.number="pricingForm.marginPercent"
            type="number"
            step="0.1"
            min="0"
            class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
          />
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button
          @click="handleSavePricing"
          class="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <Check class="w-4 h-4" />
          <span>Perbarui Analisis Pricing & HPS</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { DollarSign, AlertTriangle, Check } from 'lucide-vue-next';
import { legalStore, formatIDR } from '../../../stores/legalStore';

const props = defineProps({
  tender: {
    type: Object,
    required: true
  }
});

const pricingForm = ref({
  hpsValue: 0,
  bidValue: 0,
  directCost: 0,
  marginPercent: 11.5
});

const pricingIsBelow80 = computed(() => {
  if (!pricingForm.value.hpsValue || pricingForm.value.hpsValue <= 0) return false;
  return (pricingForm.value.bidValue / pricingForm.value.hpsValue) < 0.8;
});

function initForm() {
  const t = props.tender;
  if (!t) return;
  pricingForm.value = {
    hpsValue: t.hpsValue || 0,
    bidValue: t.bidValue || 0,
    directCost: t.pricing?.directCost || Math.round((t.bidValue || 0) * 0.78),
    marginPercent: t.pricing?.marginPercent || 11.5
  };
}

watch(() => props.tender, () => {
  initForm();
}, { deep: true });

onMounted(() => {
  initForm();
});

function handleSavePricing() {
  if (!props.tender) return;
  legalStore.updateTenderPricing(props.tender.id, pricingForm.value);
  legalStore.triggerToast('Analisis Pricing berhasil diperbarui', 'success');
}
</script>
