<template>
  <div class="p-6 space-y-6 animate-in fade-in duration-150">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
      <div>
        <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <Calculator class="w-5 h-5 text-[#6366F1]" />
          <span>Kalkulator & Evaluator Kelayakan Tender (Go / No-Go Decision)</span>
        </h3>
        <p class="text-xs text-[#475569] mt-0.5">
          Adopsi standar evaluasi multi-kriteria pembobotan internal sebelum perseroan memutuskan ikut serta dalam lelang.
        </p>
      </div>

      <!-- Live Decision Result Badge -->
      <div class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-[10px] text-[#475569] font-bold uppercase">Skor Kelayakan</div>
          <div class="text-2xl font-black font-mono text-[#0F172A]">
            {{ calculatedGNGTotal }}/100
          </div>
        </div>

        <div
          :class="getGNGDecisionBadgeClass(calculatedGNGDecision)"
          class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border shadow-xs"
        >
          {{ calculatedGNGDecision }}
        </div>
      </div>
    </div>

    <!-- Scoring Rubric / Explanation -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
      <div class="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534]">
        <strong class="block text-sm font-bold">Skor &ge; 75 : REKOMENDASI "GO"</strong>
        <span>Peluang menang tinggi, risiko terkendali, dan margin finansial memenuhi target profitabilitas.</span>
      </div>
      <div class="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
        <strong class="block text-sm font-bold">Skor 60 - 74 : "GO BERSYARAT"</strong>
        <span>Perlu mitigasi risiko kontrak, negosiasi harga vendor lokal, atau persetujuan khusus Direksi.</span>
      </div>
      <div class="p-3 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] text-[#9F1239]">
        <strong class="block text-sm font-bold">Skor &lt; 60 : "NO-GO"</strong>
        <span>Risiko penalti berat, kapasitas alat/tim tidak cukup, atau potensi kerugian finansial.</span>
      </div>
    </div>

    <!-- 6 Weighted Evaluation Criteria Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Kriteria 1: Strategic Fit -->
      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <label class="font-bold text-[#0F172A] text-xs">
            1. Kesesuaian Strategis & Sektor KBLI (Bobot 20%)
          </label>
          <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
            Nilai: {{ gngForm.fit }}/5
          </span>
        </div>
        <input
          v-model.number="gngForm.fit"
          type="range"
          min="1"
          max="5"
          step="1"
          class="w-full accent-[#6366F1] cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-[#475569]">
          <span>1: Kurang Sesuai</span>
          <span>3: Cukup Relevan</span>
          <span>5: Inti Bisnis Unggulan</span>
        </div>
      </div>

      <!-- Kriteria 2: Team Capacity -->
      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <label class="font-bold text-[#0F172A] text-xs">
            2. Kapasitas Tim, Personel Ahli & Alat (Bobot 15%)
          </label>
          <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
            Nilai: {{ gngForm.cap }}/5
          </span>
        </div>
        <input
          v-model.number="gngForm.cap"
          type="range"
          min="1"
          max="5"
          step="1"
          class="w-full accent-[#6366F1] cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-[#475569]">
          <span>1: Kekurangan Tim/Alat</span>
          <span>3: Tim Siap 70%</span>
          <span>5: Personel Lengkap & Tersedia</span>
        </div>
      </div>

      <!-- Kriteria 3: Commercial Margin -->
      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <label class="font-bold text-[#0F172A] text-xs">
            3. Margin Komersial & Profitabilitas Proyek (Bobot 25%)
          </label>
          <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
            Nilai: {{ gngForm.com }}/5
          </span>
        </div>
        <input
          v-model.number="gngForm.com"
          type="range"
          min="1"
          max="5"
          step="1"
          class="w-full accent-[#6366F1] cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-[#475569]">
          <span>1: Margin Sangat Tipis (&lt;5%)</span>
          <span>3: Wajar (8-11%)</span>
          <span>5: Sangat Sehat (&gt;14%)</span>
        </div>
      </div>

      <!-- Kriteria 4: Legal & Contractual Risk -->
      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <label class="font-bold text-[#0F172A] text-xs">
            4. Risiko Hukum, Denda & Klausul Kontrak (Bobot 15%)
          </label>
          <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
            Nilai: {{ gngForm.risk }}/5
          </span>
        </div>
        <input
          v-model.number="gngForm.risk"
          type="range"
          min="1"
          max="5"
          step="1"
          class="w-full accent-[#6366F1] cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-[#475569]">
          <span>1: Klausul Berat / Asimetris</span>
          <span>3: Risiko Dapat Dikelola</span>
          <span>5: Kontrak Standar Bersahabat</span>
        </div>
      </div>

      <!-- Kriteria 5: Cash Flow & Bid Bond -->
      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <label class="font-bold text-[#0F172A] text-xs">
            5. Kemampuan Cash Flow & Bank Garansi (Bobot 15%)
          </label>
          <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
            Nilai: {{ gngForm.cash }}/5
          </span>
        </div>
        <input
          v-model.number="gngForm.cash"
          type="range"
          min="1"
          max="5"
          step="1"
          class="w-full accent-[#6366F1] cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-[#475569]">
          <span>1: Fasilitas Kredit Terbatas</span>
          <span>3: Cash Flow Cukup</span>
          <span>5: Fasilitas Bank Garansi Kuat</span>
        </div>
      </div>

      <!-- Kriteria 6: Technical Competitiveness -->
      <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <label class="font-bold text-[#0F172A] text-xs">
            6. Keunggulan Teknis & Spesifikasi Barang/Jasa (Bobot 10%)
          </label>
          <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
            Nilai: {{ gngForm.tech }}/5
          </span>
        </div>
        <input
          v-model.number="gngForm.tech"
          type="range"
          min="1"
          max="5"
          step="1"
          class="w-full accent-[#6366F1] cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-[#475569]">
          <span>1: Tanpa Keunggulan Khusus</span>
          <span>3: Bersaing Seimbang</span>
          <span>5: Rekam Jejak Unggul / TKDN Tinggi</span>
        </div>
      </div>
    </div>

    <!-- Notes & Sign-off -->
    <div class="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
      <label class="block font-bold text-[#0F172A] text-xs">
        Catatan Justifikasi & Rekomendasi Bid Committee / Direksi
      </label>
      <textarea
        v-model="gngForm.note"
        rows="2"
        placeholder="Tuliskan alasan strategis, syarat persetujuan, atau catatan mitigasi risiko..."
        class="w-full p-3 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
      ></textarea>

      <div class="flex items-center justify-between pt-2">
        <span class="text-[11px] text-[#475569]">
          Terakhir dievaluasi oleh: <strong>{{ tender.gng?.by || 'Belum disimpan' }}</strong>
          <span v-if="tender.gng?.date">({{ tender.gng.date }})</span>
        </span>

        <button
          @click="handleSaveGNG"
          class="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <Check class="w-4 h-4" />
          <span>Simpan Keputusan Go / No-Go</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Calculator, Check } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  tender: {
    type: Object,
    required: true
  }
});

const gngForm = ref({
  fit: 4,
  cap: 4,
  com: 4,
  risk: 3,
  cash: 4,
  tech: 4,
  note: ''
});

const calculatedGNGTotal = computed(() => {
  const weights = { fit: 20, cap: 15, com: 25, risk: 15, cash: 15, tech: 10 };
  let total = 0;
  total += (gngForm.value.fit / 5) * weights.fit;
  total += (gngForm.value.cap / 5) * weights.cap;
  total += (gngForm.value.com / 5) * weights.com;
  total += (gngForm.value.risk / 5) * weights.risk;
  total += (gngForm.value.cash / 5) * weights.cash;
  total += (gngForm.value.tech / 5) * weights.tech;
  return Math.round(total);
});

const calculatedGNGDecision = computed(() => {
  const sc = calculatedGNGTotal.value;
  if (sc >= 75) return 'GO';
  if (sc >= 60) return 'GO_BERSYARAT';
  return 'NO_GO';
});

function getGNGDecisionBadgeClass(decision) {
  switch (decision) {
    case 'GO': return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
    case 'GO_BERSYARAT': return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'NO_GO': return 'bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3]';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function handleSaveGNG() {
  if (!props.tender) return;
  legalStore.updateTenderGNG(
    props.tender.id,
    gngForm.value,
    calculatedGNGDecision.value,
    gngForm.value.note
  );
  legalStore.triggerToast('Keputusan Go / No-Go berhasil disimpan!', 'success');
}

function initForm() {
  const t = props.tender;
  if (!t) return;
  if (t.gng?.scores) {
    gngForm.value = {
      fit: t.gng.scores.fit || 4,
      cap: t.gng.scores.cap || 4,
      com: t.gng.scores.com || 4,
      risk: t.gng.scores.risk || 3,
      cash: t.gng.scores.cash || 4,
      tech: t.gng.scores.tech || 4,
      note: t.gng.note || ''
    };
  } else {
    gngForm.value = {
      fit: 4, cap: 4, com: 4, risk: 3, cash: 4, tech: 4, note: ''
    };
  }
}

watch(() => props.tender, () => {
  initForm();
}, { deep: true });

onMounted(() => {
  initForm();
});
</script>
