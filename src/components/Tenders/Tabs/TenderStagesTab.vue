<template>
  <div class="p-6 space-y-6 animate-in fade-in duration-150">
    <!-- Dynamic Sector Workflow Header Banner -->
    <div class="bg-gradient-to-r from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] p-5 rounded-2xl border border-[#C7D2FE] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2 flex-wrap">
          <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shrink-0">
            <component :is="getSectorIcon(currentSectorObj.icon)" class="w-4.5 h-4.5" />
          </div>
          <h3 class="text-base font-extrabold text-[#0F172A]">
            Alur Kerja Tender: {{ currentSectorObj.name }}
          </h3>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6366F1] text-white shadow-xs">
            {{ stagesList.length }} Tahapan Proses
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-[#4338CA] border border-[#C7D2FE]">
            Template: {{ currentSectorObj.workflowTemplate }}
          </span>
        </div>
        <p class="text-xs text-[#475569]">
          Dasar Regulasi: <strong class="text-[#0F172A]">{{ currentSectorObj.regulatoryBasis }}</strong> • {{ currentSectorObj.description }}
        </p>
      </div>

      <!-- Quick Sector Switcher Dropdown -->
      <div class="flex items-center gap-2 self-start md:self-auto shrink-0 bg-white p-2 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-[11px] font-bold text-[#475569]">Ganti Sektor Alur:</span>
        <select
          :value="tender.sector"
          @change="handleChangeTenderSector($event.target.value)"
          class="text-xs font-bold text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg px-2.5 py-1 outline-none cursor-pointer hover:bg-[#E0E7FF] transition"
        >
          <option v-for="sec in (legalStore.state.masterSectors || [])" :key="sec.code || sec.value" :value="sec.code || sec.value">
            {{ sec.name || sec.label }} ({{ (legalStore.getStagesForSector(sec.code || sec.value) || []).length }} Tahap)
          </option>
        </select>
      </div>
    </div>

    <!-- Stepper Navigation Controls & Progress Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-[#4338CA] bg-[#EEF2FF] px-3.5 py-1.5 rounded-xl border border-[#C7D2FE] shadow-xs flex items-center gap-2">
          <Milestone class="w-4 h-4 text-[#6366F1]" />
          <span>Tahap {{ getStageIndex(tender.stage) + 1 }} dari {{ stagesList.length }}:</span>
          <strong class="text-[#0F172A]">{{ getStageLabel(tender.stage) }}</strong>
        </span>
      </div>

      <!-- Stage Advance Controls -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          @click="advanceStage(-1)"
          :disabled="getStageIndex(tender.stage) <= 0"
          class="px-3.5 py-1.5 text-xs font-bold text-[#0F172A] bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition cursor-pointer"
        >
          ← Tahap Sebelumnya
        </button>
        <button
          @click="advanceStage(1)"
          :disabled="getStageIndex(tender.stage) >= stagesList.length - 1"
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition cursor-pointer shadow-xs"
        >
          Maju ke Tahap Selanjutnya →
        </button>
      </div>
    </div>

    <!-- Stepper Track -->
    <div class="py-2">
      <div class="overflow-x-auto pb-4 scrollbar-none">
        <div class="flex items-start min-w-[840px] justify-between relative px-2">
          <!-- Connecting Line -->
          <div class="absolute left-10 right-10 top-4 h-1.5 bg-slate-200 z-0"></div>
          <div
            class="absolute left-10 top-4 h-1.5 bg-[#6366F1] z-0 transition-all duration-300"
            :style="{ width: getStageProgressWidth(tender.stage) }"
          ></div>

          <!-- Steps -->
          <div
            v-for="(stageItem, sIdx) in stagesList"
            :key="stageItem.key"
            @click="updateStage(stageItem.key)"
            class="relative z-10 flex flex-col items-center cursor-pointer group px-2"
            :title="'Klik untuk berpindah ke tahapan: ' + stageItem.name"
          >
            <div
              :class="getStageCircleClass(tender.stage, stageItem.key, sIdx)"
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all shadow-xs"
            >
              <Check v-if="isStageCompleted(tender.stage, stageItem.key)" class="w-4 h-4" />
              <span v-else>{{ sIdx + 1 }}</span>
            </div>
            <span
              :class="tender.stage === stageItem.key ? 'text-[#0F172A] font-extrabold underline decoration-[#6366F1] decoration-2' : 'text-[#475569] font-medium group-hover:text-[#0F172A]'"
              class="text-[11px] mt-2 text-center max-w-[100px] leading-tight"
            >
              {{ stageItem.shortName }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- STAGE PROCESS EXECUTION WORKSPACE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
      <!-- LEFT CARD (7 cols): Pedoman Regulasi & Interactive Checklist Tahap Aktif -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Pedoman & Regulasi Box -->
        <div class="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div class="flex items-center gap-2">
              <Info class="w-4 h-4 text-[#6366F1]" />
              <h4 class="font-extrabold text-[#0F172A] text-sm">
                Pedoman & Klausul Tahap: {{ getStageLabel(tender.stage) }}
              </h4>
            </div>
            <span class="text-[11px] font-mono font-bold text-[#4338CA] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#C7D2FE]">
              {{ currentStageGuidance.regulatory }}
            </span>
          </div>

          <p class="text-xs text-[#0F172A] leading-relaxed">
            {{ getStageDescription(tender.stage) }}
          </p>

          <!-- Specific Sector Warning / Alert Callout -->
          <div v-if="currentStageGuidance.alert" class="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs flex items-start gap-2.5">
            <AlertTriangle class="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div class="space-y-0.5">
              <div class="font-bold text-[11px] uppercase tracking-wide">Fokus Verifikasi: {{ currentStageGuidance.focus }}</div>
              <p class="text-[11px] leading-relaxed">{{ currentStageGuidance.alert }}</p>
            </div>
          </div>
        </div>

        <!-- Interactive Checklist Box for This Stage -->
        <div class="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#E2E8F0]">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <h4 class="font-extrabold text-[#0F172A] text-sm">
                Daftar Periksa & Tindakan Kunci Tahap Ini
              </h4>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold font-mono text-[#0F172A]">
                {{ completedChecklistCount }} / {{ currentStageChecklist.length }} Selesai
              </span>
              <button
                @click="handleCompleteAllChecklist"
                class="px-2.5 py-1 text-[11px] font-bold text-[#4338CA] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition cursor-pointer"
              >
                Tandai Semua Selesai
              </button>
            </div>
          </div>

          <!-- Checklist Progress Bar -->
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              :class="checklistCompletionPercent === 100 ? 'bg-emerald-500' : 'bg-[#6366F1]'"
              class="h-full transition-all duration-300"
              :style="{ width: checklistCompletionPercent + '%' }"
            ></div>
          </div>

          <!-- Checklist Items List -->
          <div class="space-y-2">
            <div
              v-for="item in currentStageChecklist"
              :key="item.id"
              @click="handleToggleChecklistItem(item.id)"
              :class="item.checked ? 'bg-[#F0FDF4] border-[#BBF7D0]' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'"
              class="p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none"
            >
              <div class="flex items-center gap-2.5">
                <div
                  :class="item.checked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-slate-300 text-transparent'"
                  class="w-5 h-5 rounded-md border flex items-center justify-center transition shadow-2xs shrink-0"
                >
                  <Check class="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span
                  :class="item.checked ? 'text-emerald-950 font-bold line-through opacity-80' : 'text-[#0F172A] font-medium'"
                  class="text-xs leading-snug"
                >
                  {{ item.text }}
                </span>
              </div>

              <span
                :class="item.checked ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' : 'text-slate-400 bg-white border border-slate-200'"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
              >
                {{ item.checked ? 'Terpenuhi' : 'Belum' }}
              </span>
            </div>
          </div>

          <!-- Completion Alert & Advance Button if all done -->
          <div
            v-if="checklistCompletionPercent === 100 && getStageIndex(tender.stage) < stagesList.length - 1"
            class="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-2 text-[#166534] font-bold">
              <CheckCircle2 class="w-4 h-4" />
              <span>Seluruh tindakan tahap ini telah selesai diverifikasi!</span>
            </div>
            <button
              @click="advanceStage(1)"
              class="px-3.5 py-1.5 bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
            >
              Maju ke Tahap Selanjutnya →
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT CARD (5 cols): Sector Specific Stage Calculator / Guidance Tool -->
      <div class="lg:col-span-5 space-y-4">
        <div class="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <div class="w-7 h-7 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shrink-0">
              <component :is="getSectorIcon(currentSectorObj.icon)" class="w-4 h-4" />
            </div>
            <div>
              <h4 class="font-extrabold text-[#0F172A] text-sm">
                Alat Analisis Sektor: {{ currentSectorObj.name }}
              </h4>
              <div class="text-[10px] text-[#475569]">Perhitungan parameter kepatuhan sektor lelang aktif</div>
            </div>
          </div>

          <!-- TOOL 1: KONSTRUKSI (Kalkulator 80% HPS & Jaminan 5% HPS) -->
          <div v-if="tender.sector === 'KONSTRUKSI'" class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div class="text-[11px] font-bold text-[#0F172A]">Simulasi Ambang Batas 80% HPS (Perpres 16/2018):</div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <div class="text-[10px] text-[#475569]">HPS Panitia</div>
                  <div class="font-bold font-mono text-[#0F172A]">{{ formatIDR(tender.hpsValue) }}</div>
                </div>
                <div class="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <div class="text-[10px] text-[#475569]">Batas 80% HPS</div>
                  <div class="font-bold font-mono text-[#9F1239]">{{ formatIDR(tender.hpsValue * 0.8) }}</div>
                </div>
              </div>
              <div
                :class="pricingIsBelow80 ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]' : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'"
                class="p-2.5 rounded-lg font-bold text-[11px]"
              >
                <div v-if="pricingIsBelow80">
                  ⚠️ Penawaran di bawah 80% HPS ({{ ((tender.bidValue / (tender.hpsValue || 1)) * 100).toFixed(1) }}%). Wajib EKH & Jaminan Pelaksanaan 5% HPS ({{ formatIDR(tender.hpsValue * 0.05) }}).
                </div>
                <div v-else>
                  ✓ Penawaran di atas 80% HPS ({{ ((tender.bidValue / (tender.hpsValue || 1)) * 100).toFixed(1) }}%). Jaminan Pelaksanaan standar 5% Kontrak ({{ formatIDR(tender.bidValue * 0.05) }}).
                </div>
              </div>
            </div>
          </div>

          <!-- TOOL 2: PERTAMBANGAN (Kalkulator HBA & Kuota DMO 25%) -->
          <div v-else-if="tender.sector === 'PERTAMBANGAN'" class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-[#FEF3C7]/40 border border-[#FDE68A] space-y-2">
              <div class="text-[11px] font-bold text-[#92400E]">Formula Penyesuaian Harga Indeks HBA & DMO:</div>
              <div class="space-y-1.5 text-[11px] text-[#92400E]">
                <div class="flex items-center justify-between">
                  <span>Indeks HBA ESDM (GAR 6322):</span>
                  <span class="font-bold font-mono text-[#0F172A]">$128.50 / Ton</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Spesifikasi Batubara Penawaran:</span>
                  <span class="font-bold text-[#0F172A]">5.500 kcal/kg GAR</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Estimasi Harga FOB Barge:</span>
                  <span class="font-bold font-mono text-[#047857]">$111.78 / MT (~Rp 1.765.000)</span>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-[#FDE68A]">
                  <span>Status Pemenuhan Kuota DMO 25%:</span>
                  <span class="font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">TERPENUHI (28.4%)</span>
                </div>
              </div>
            </div>
            <div class="text-[10px] text-[#475569] italic">
              *Mengacu Kepmen ESDM No. 255.K/2022. Pembayaran disesuaikan Certificate of Analysis Sucofindo pada saat B/L.
            </div>
          </div>

          <!-- TOOL 3: MIGAS (Kalkulator HEA PTK-007 SKK Migas) -->
          <div v-else-if="tender.sector === 'MIGAS'" class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-[#FDF2F8] border border-[#FCE7F3] space-y-2">
              <div class="text-[11px] font-bold text-[#9D174D]">Perhitungan Harga Evaluasi Akhir (HEA) PTK-007:</div>
              <div class="space-y-1.5 text-[11px] text-[#9D174D]">
                <div class="flex items-center justify-between">
                  <span>Komitmen Capaian TKDN:</span>
                  <span class="font-bold text-[#0F172A]">46.0% (Passing Grade >= 35%)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Koefisien Preferensi (KP):</span>
                  <span class="font-bold font-mono text-[#4338CA]">7.5% (Maksimal Kemenperin)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Harga Penawaran Nominal (HP):</span>
                  <span class="font-bold font-mono text-[#0F172A]">{{ formatIDR(tender.bidValue) }}</span>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-[#FCE7F3] text-xs">
                  <span class="font-bold text-[#0F172A]">Nilai HEA (Untuk Peringkat):</span>
                  <span class="font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {{ formatIDR(tender.bidValue * (1 - 0.075)) }}
                  </span>
                </div>
              </div>
              <p class="text-[10px] text-[#475569] mt-1">
                Formula: <code>HEA = (1 - KP) × HP</code>. Keunggulan TKDN 46% memberikan diskon kompetitif 7.5% pada perangkingan Pokja.
              </p>
            </div>
          </div>

          <!-- TOOL 4: ENERGI (Kalkulator Tarif Listrik c/kWh vs BPP PLN) -->
          <div v-else-if="tender.sector === 'ENERGI'" class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] space-y-2">
              <div class="text-[11px] font-bold text-[#047857]">Evaluasi Tarif Listrik EBT vs BPP PLN:</div>
              <div class="space-y-1.5 text-[11px] text-[#047857]">
                <div class="flex items-center justify-between">
                  <span>Penawaran Tarif Proyek:</span>
                  <span class="font-bold font-mono text-[#0F172A]">6.85 cents USD / kWh</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Batas BPP Pembangkitan PLN:</span>
                  <span class="font-bold font-mono text-[#0F172A]">7.42 cents USD / kWh</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Margin Efisiensi Tarif:</span>
                  <span class="font-bold font-mono text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">Hemat 7.68%</span>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-[#D1FAE5]">
                  <span>Status Bankability Lender:</span>
                  <span class="font-bold text-[#166534]">Mandiri & ADB (AAA Rated)</span>
                </div>
              </div>
            </div>
            <div class="text-[10px] text-[#475569] italic">
              *Mengacu Perpres 112/2022 tentang Percepatan Pengembangan Energi Terbarukan.
            </div>
          </div>

          <!-- TOOL 5: UMUM (E-Reverse Auction Simulator) -->
          <div v-else class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div class="text-[11px] font-bold text-[#0F172A]">Simulasi Penurunan Harga E-Reverse Auction:</div>
              <div class="space-y-1.5 text-[11px] text-[#475569]">
                <div class="flex items-center justify-between">
                  <span>HPS Pengadaan:</span>
                  <span class="font-bold font-mono text-[#0F172A]">{{ formatIDR(tender.hpsValue) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Penawaran Terkini:</span>
                  <span class="font-bold font-mono text-[#4338CA]">{{ formatIDR(tender.bidValue) }}</span>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                  <span>Batas Minimum Penurunan (Bid Increment):</span>
                  <span class="font-bold text-[#0F172A]">Rp 25.000.000 / Klik</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Navigate to Document Audit -->
          <div class="pt-2 border-t border-[#E2E8F0]">
            <button
              @click="$emit('change-tab', 'documents')"
              class="w-full py-2 px-3 bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] text-xs font-bold rounded-xl border border-[#E2E8F0] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileCheck2 class="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Periksa Dokumen Prasyarat (Tab 2) →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Milestone,
  Check,
  Info,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  HardHat,
  Pickaxe,
  Flame,
  Zap,
  Package,
  Building2,
  Factory,
  Radio,
  Wrench,
  Mountain,
  Boxes
} from 'lucide-vue-next';
import { legalStore, formatIDR } from '../../../stores/legalStore';

function getSectorIcon(iconName) {
  const map = {
    hardhat: HardHat, '🏗️': HardHat, konstruksi: HardHat,
    pickaxe: Pickaxe, '⛏️': Pickaxe, pertambangan: Pickaxe, tambang: Pickaxe,
    flame: Flame, '🛢️': Flame, migas: Flame,
    zap: Zap, '⚡': Zap, energi: Zap,
    package: Package, '📦': Package, umum: Package,
    building2: Building2, '🏢': Building2, korporasi: Building2,
    factory: Factory, '🏭': Factory,
    radio: Radio, '📡': Radio, telko: Radio,
    wrench: Wrench, '🔧': Wrench,
    mountain: Mountain, '⛰️': Mountain,
    boxes: Boxes
  };
  const key = String(iconName || '').toLowerCase().trim();
  return map[key] || Building2;
}

const props = defineProps({
  tender: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['change-tab']);

const currentSectorObj = computed(() => {
  const code = props.tender.sector || 'KONSTRUKSI';
  return (legalStore.state.masterSectors || []).find(s => s.code === code) || {
    code,
    name: props.tender.sectorLabel || code,
    icon: 'HardHat',
    regulatoryBasis: 'Perpres 16/2018',
    workflowTemplate: 'SPSE_KONSTRUKSI_8',
    description: 'Pengadaan Terstruktur'
  };
});

const stagesList = computed(() => {
  const sector = props.tender.sector || 'KONSTRUKSI';
  return legalStore.getStagesForSector(sector);
});

const currentStageGuidance = computed(() => {
  return legalStore.getStageGuidance(props.tender.sector, props.tender.stage);
});

const currentStageChecklist = computed(() => {
  return legalStore.getStageChecklist(
    props.tender.sector,
    props.tender.stage,
    props.tender.id
  );
});

const completedChecklistCount = computed(() => {
  return currentStageChecklist.value.filter(i => i.checked).length;
});

const checklistCompletionPercent = computed(() => {
  const len = currentStageChecklist.value.length;
  if (!len) return 100;
  return Math.round((completedChecklistCount.value / len) * 100);
});

const pricingIsBelow80 = computed(() => {
  if (!props.tender.hpsValue || props.tender.hpsValue <= 0) return false;
  return (props.tender.bidValue / props.tender.hpsValue) < 0.8;
});

function handleToggleChecklistItem(itemId) {
  legalStore.toggleStageChecklistItem(
    props.tender.id,
    props.tender.stage,
    itemId
  );
}

function handleCompleteAllChecklist() {
  legalStore.completeAllStageChecklist(
    props.tender.id,
    props.tender.stage
  );
}

function handleChangeTenderSector(newSector) {
  legalStore.updateTenderSector(props.tender.id, newSector);
}

function getStageIndex(stageKey) {
  return stagesList.value.findIndex(s => s.key === stageKey);
}

function getStageProgressWidth(currentStageKey) {
  const idx = getStageIndex(currentStageKey);
  if (idx <= 0) return '0%';
  const len = stagesList.value.length;
  if (len <= 1) return '100%';
  const pct = (idx / (len - 1)) * 100;
  return pct + '%';
}

function isStageCompleted(currentStageKey, checkStageKey) {
  const curIdx = getStageIndex(currentStageKey);
  const chkIdx = getStageIndex(checkStageKey);
  return curIdx > chkIdx;
}

function getStageCircleClass(currentStageKey, stepStageKey, sIdx) {
  const curIdx = getStageIndex(currentStageKey);
  if (currentStageKey === stepStageKey) {
    return 'bg-[#6366F1] text-white ring-4 ring-[#C7D2FE] scale-110';
  }
  if (curIdx > sIdx) {
    return 'bg-emerald-600 text-white border border-emerald-600';
  }
  return 'bg-white text-slate-400 border border-slate-300';
}

function getStageLabel(stageKey) {
  const found = stagesList.value.find(s => s.key === stageKey);
  return found ? found.name : stageKey;
}

function getStageDescription(stageKey) {
  const found = stagesList.value.find(s => s.key === stageKey);
  return found ? found.description : '';
}

function updateStage(stageKey) {
  legalStore.updateTenderStage(props.tender.id, stageKey);
}

function advanceStage(direction) {
  const currentIdx = stagesList.value.findIndex(s => s.key === props.tender.stage);
  const targetIdx = currentIdx + direction;
  if (targetIdx >= 0 && targetIdx < stagesList.value.length) {
    legalStore.updateTenderStage(props.tender.id, stagesList.value[targetIdx].key);
  }
}
</script>
