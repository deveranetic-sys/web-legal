<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Jaminan Finansial & Mitigasi Risiko
          </span>
          <span class="text-xs text-[#475569] font-medium">Bank Garansi & Surety Bond</span>
        </div>
        <h2 class="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Jaminan Bank & Bid Bond Lelang
        </h2>
        <p class="text-sm text-[#475569] mt-1">
          Pemantauan siklus hidup jaminan tender: Bid Bond, Performance Bond, masa berlaku garansi bank penerbit, serta koordinasi pengembalian jaminan saat tender usai.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4 text-[#6366F1]" />
          <span>Catatkan Jaminan Bank Baru</span>
        </button>
      </div>
    </div>

    <!-- Quick Metrics Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-[#475569]">Total Nilai Jaminan Aktif</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-xl font-bold text-[#0F172A] truncate" :title="formatIDR(totalActiveBondValue)">
            {{ formatCompactIDR(totalActiveBondValue) }}
          </span>
          <span class="text-xs text-[#475569]">IDR</span>
        </div>
        <div class="text-[11px] text-[#6366F1] font-semibold mt-1">
          {{ activeBondsCount }} Garansi Bank Aktif
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-emerald-700">Bid Bond (Jaminan Penawaran)</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-emerald-700">{{ bidBondsCount }}</span>
          <span class="text-xs text-[#475569]">Paket Lelang</span>
        </div>
        <div class="text-[11px] text-emerald-700 font-semibold mt-1">
          {{ formatCompactIDR(totalBidBondValue) }}
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-[#4338CA]">Performance Bond (Pelaksanaan)</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#4338CA]">{{ performanceBondsCount }}</span>
          <span class="text-xs text-[#475569]">Kontrak Berjalan</span>
        </div>
        <div class="text-[11px] text-[#4338CA] font-semibold mt-1">
          5% dari Nilai Kontrak
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-amber-700">Jatuh Tempo Dekat (&lt; 30 Hari)</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-amber-600">{{ criticalBondsCount }}</span>
          <span class="text-xs text-[#475569]">Perlu Perpanjangan/Klaim</span>
        </div>
        <div class="text-[11px] text-amber-700 font-semibold mt-1">
          Koordinasi dengan Bank Penerbit
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Search -->
        <div class="md:col-span-5 relative">
          <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nomor garansi, nama paket lelang, bank penerbit, beneficiary..."
            class="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] focus:border-[#C7D2FE] bg-white text-[#0F172A]"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A] text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- Filter Jenis Jaminan -->
        <div class="md:col-span-3">
          <select
            v-model="filterBondType"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Jenis Jaminan</option>
            <option value="BID_BOND">Jaminan Penawaran (Bid Bond)</option>
            <option value="PERFORMANCE_BOND">Jaminan Pelaksanaan (Performance Bond)</option>
            <option value="ADVANCE_PAYMENT">Jaminan Uang Muka</option>
            <option value="MAINTENANCE_BOND">Jaminan Pemeliharaan</option>
          </select>
        </div>

        <!-- Filter Bank Penerbit -->
        <div class="md:col-span-2">
          <select
            v-model="filterBank"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Bank</option>
            <option value="Mandiri">Bank Mandiri</option>
            <option value="BRI">Bank BRI</option>
            <option value="BCA">Bank BCA</option>
            <option value="BNI">Bank BNI</option>
          </select>
        </div>

        <!-- Filter Status -->
        <div class="md:col-span-2">
          <select
            v-model="filterStatus"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Status</option>
            <option value="AKTIF">Aktif</option>
            <option value="DALAM_PROSES">Dalam Proses</option>
            <option value="DIKEMBALIKAN">Sudah Dikembalikan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bonds List / Table -->
    <div class="space-y-4">
      <div
        v-for="bond in filteredBonds"
        :key="bond.id"
        class="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#C7D2FE]/70 transition-all space-y-4"
      >
        <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <!-- Main Info -->
          <div class="space-y-2 flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2.5 py-0.5 rounded border border-[#C7D2FE]">
                {{ bond.id }}
              </span>
              <span class="text-xs font-mono font-bold text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                No: {{ bond.guaranteeNumber }}
              </span>
              <span
                :class="getBondStatusBadgeClass(bond.status)"
                class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
              >
                {{ bond.status }}
              </span>
              <span class="text-xs text-[#475569]">
                Penerbit: <strong class="text-[#0F172A]">{{ bond.bankIssuer }}</strong>
              </span>
            </div>

            <!-- Bond Title -->
            <div class="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck class="w-5 h-5 text-[#6366F1] shrink-0" />
              <span>{{ bond.bondTypeName }}</span>
              <span class="text-xs text-[#475569] font-normal">({{ bond.percentage }})</span>
            </div>

            <!-- Tender & Beneficiary Reference -->
            <div class="text-xs text-[#475569] space-y-1">
              <div>
                Paket Lelang: <strong class="text-[#0F172A]">{{ bond.tenderTitle }}</strong>
                <span class="font-mono text-[#475569] ml-1">({{ bond.tenderId }})</span>
              </div>
              <div>
                Penerima Jaminan (Beneficiary): <strong class="text-[#0F172A]">{{ bond.beneficiary }}</strong>
              </div>
            </div>

            <!-- Notes -->
            <p v-if="bond.notes" class="text-xs text-[#475569] bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 italic">
              "{{ bond.notes }}"
            </p>
          </div>

          <!-- Financial Nominal & Validity Column -->
          <div class="flex flex-col sm:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <!-- Amount -->
            <div class="text-left sm:text-right">
              <div class="text-[11px] text-[#475569] uppercase font-bold">Nilai Jaminan (IDR)</div>
              <div class="text-xl font-extrabold text-[#0F172A] font-mono">
                {{ formatIDR(bond.amount) }}
              </div>
              <div class="text-xs text-[#475569]">
                Durasi: <strong>{{ bond.daysValid }} Hari Kalender</strong>
              </div>
            </div>

            <!-- Expiry countdown -->
            <div class="text-left sm:text-right">
              <div class="text-[11px] text-[#475569]">Masa Berlaku Hingga:</div>
              <div
                v-if="calculateDaysRemaining(bond.expiryDate) <= 30 && calculateDaysRemaining(bond.expiryDate) >= 0 && bond.status === 'AKTIF'"
                class="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-[#FDE68A] animate-pulse mt-0.5"
              >
                <Clock class="w-3 h-3 text-amber-600" />
                <span>{{ bond.expiryDate }} (Sisa {{ calculateDaysRemaining(bond.expiryDate) }} Hari)</span>
              </div>
              <div v-else class="text-xs font-semibold text-[#0F172A] mt-0.5">
                {{ bond.expiryDate }} ({{ calculateDaysRemaining(bond.expiryDate) }} Hari)
              </div>
            </div>

            <!-- Status Changer & Actions -->
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-if="bond.status === 'AKTIF'"
                @click="updateStatus(bond.id, 'DIKEMBALIKAN')"
                class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] transition cursor-pointer"
                title="Tandai garansi bank telah dikembalikan oleh panitia pengadaan"
              >
                ✓ Tandai Dikembalikan
              </button>

              <button
                v-if="bond.status === 'DALAM_PROSES'"
                @click="updateStatus(bond.id, 'AKTIF')"
                class="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#1E293B] text-white hover:bg-[#283A52] transition cursor-pointer"
              >
                Aktifkan Jaminan
              </button>

              <button
                @click="confirmDelete(bond)"
                class="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer rounded-lg hover:bg-rose-50"
                title="Hapus pencatatan jaminan bank"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: CATATKAN JAMINAN BANK BARU                        -->
    <!-- ======================================================== -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/70 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C7D2FE] space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">
              Catatkan Garansi Bank / Jaminan Tender Baru
            </h3>
            <p class="text-xs text-[#475569] mt-0.5">
              Simpan nomor registrasi dan rincian jaminan penawaran / pelaksanaan proyek.
            </p>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitAddBond" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Pilih Paket Lelang Terkait *</label>
            <select
              v-model="newBondForm.tenderId"
              required
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            >
              <option v-for="t in legalStore.state.tenders" :key="t.id" :value="t.id">
                {{ t.id }} - {{ t.title }} ({{ t.organizer }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Jenis Jaminan *</label>
              <select
                v-model="newBondForm.bondType"
                @change="onBondTypeChange"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              >
                <option value="BID_BOND">Jaminan Penawaran (Bid Bond)</option>
                <option value="PERFORMANCE_BOND">Jaminan Pelaksanaan (Performance Bond)</option>
                <option value="ADVANCE_PAYMENT">Jaminan Uang Muka</option>
                <option value="MAINTENANCE_BOND">Jaminan Pemeliharaan</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Bank Penerbit *</label>
              <select
                v-model="newBondForm.bankIssuer"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              >
                <option value="PT Bank Mandiri (Persero) Tbk">PT Bank Mandiri (Persero) Tbk</option>
                <option value="PT Bank Rakyat Indonesia (Persero) Tbk">PT Bank Rakyat Indonesia (Persero) Tbk</option>
                <option value="PT Bank Central Asia Tbk">PT Bank Central Asia Tbk</option>
                <option value="PT Bank Negara Indonesia (Persero) Tbk">PT Bank Negara Indonesia (Persero) Tbk</option>
                <option value="PT Asuransi Jasa Indonesia (Jasindo)">PT Asuransi Jasa Indonesia (Jasindo)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Nomor Garansi Bank *</label>
              <input
                v-model="newBondForm.guaranteeNumber"
                required
                type="text"
                placeholder="BG/MDR/JKT/2026/..."
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Nilai Nominal (IDR) *</label>
              <input
                v-model.number="newBondForm.amount"
                required
                type="number"
                placeholder="Contoh: 1500000000"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tanggal Penerbitan</label>
              <input
                v-model="newBondForm.issueDate"
                type="date"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Jatuh Tempo (Expiry Date) *</label>
              <input
                v-model="newBondForm.expiryDate"
                required
                type="date"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Penerima Jaminan (Beneficiary)</label>
            <input
              v-model="newBondForm.beneficiary"
              type="text"
              placeholder="PT PLN (Persero) / Kementerian ESDM..."
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan</label>
            <textarea
              v-model="newBondForm.notes"
              rows="2"
              placeholder="Catatan penyerahan warkat asli, syarat klaim, dsb..."
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              Catatkan Garansi Bank
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Plus,
  Search,
  ShieldCheck,
  Clock,
  Trash2,
  X
} from 'lucide-vue-next';
import { legalStore, formatIDR, calculateDaysRemaining } from '../stores/legalStore';

// State
const searchQuery = ref('');
const filterBondType = ref('ALL');
const filterBank = ref('ALL');
const filterStatus = ref('ALL');

const isAddModalOpen = ref(false);

const newBondForm = ref({
  tenderId: 'TND-2026-001',
  tenderTitle: '',
  bondType: 'BID_BOND',
  bondTypeName: 'Jaminan Penawaran (Bid Bond)',
  bankIssuer: 'PT Bank Mandiri (Persero) Tbk',
  guaranteeNumber: '',
  amount: null,
  percentage: '2% HPS',
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  daysValid: 90,
  beneficiary: '',
  status: 'AKTIF',
  notes: ''
});

// Computed
const bonds = computed(() => legalStore.state.tenderBonds || []);

const activeBonds = computed(() => bonds.value.filter(b => b.status === 'AKTIF'));
const activeBondsCount = computed(() => activeBonds.value.length);

const totalActiveBondValue = computed(() => {
  return activeBonds.value.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
});

const bidBonds = computed(() => bonds.value.filter(b => b.bondType === 'BID_BOND' && b.status === 'AKTIF'));
const bidBondsCount = computed(() => bidBonds.value.length);
const totalBidBondValue = computed(() => {
  return bidBonds.value.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
});

const performanceBonds = computed(() => bonds.value.filter(b => b.bondType === 'PERFORMANCE_BOND' && b.status === 'AKTIF'));
const performanceBondsCount = computed(() => performanceBonds.value.length);

const criticalBondsCount = computed(() => {
  return activeBonds.value.filter(b => {
    const days = calculateDaysRemaining(b.expiryDate);
    return days <= 30 && days >= 0;
  }).length;
});

const filteredBonds = computed(() => {
  return bonds.value.filter(bond => {
    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchNum = bond.guaranteeNumber?.toLowerCase().includes(q);
      const matchTender = bond.tenderTitle?.toLowerCase().includes(q) || bond.tenderId?.toLowerCase().includes(q);
      const matchBank = bond.bankIssuer?.toLowerCase().includes(q);
      const matchBen = bond.beneficiary?.toLowerCase().includes(q);
      if (!matchNum && !matchTender && !matchBank && !matchBen) return false;
    }

    // Bond Type
    if (filterBondType.value !== 'ALL' && bond.bondType !== filterBondType.value) {
      return false;
    }

    // Bank
    if (filterBank.value !== 'ALL' && !bond.bankIssuer?.toLowerCase().includes(filterBank.value.toLowerCase())) {
      return false;
    }

    // Status
    if (filterStatus.value !== 'ALL' && bond.status !== filterStatus.value) {
      return false;
    }

    return true;
  });
});

function formatCompactIDR(value) {
  if (!value) return 'Rp 0';
  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toFixed(1)} T`;
  }
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  }
  return formatIDR(value);
}

function getBondStatusBadgeClass(status) {
  switch (status) {
    case 'AKTIF': return 'bg-[#DCFCE7] text-[#166534] border-emerald-300';
    case 'DALAM_PROSES': return 'bg-[#FEF3C7] text-[#92400E] border-amber-300';
    case 'DIKEMBALIKAN': return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'KLAIM': return 'bg-[#FFE4E6] text-[#9F1239] border-rose-300';
    default: return 'bg-slate-100 text-slate-800';
  }
}

function onBondTypeChange() {
  const typeMap = {
    BID_BOND: { name: 'Jaminan Penawaran (Bid Bond)', pct: '2% HPS' },
    PERFORMANCE_BOND: { name: 'Jaminan Pelaksanaan (Performance Bond)', pct: '5% Kontrak' },
    ADVANCE_PAYMENT: { name: 'Jaminan Uang Muka', pct: '20% Kontrak' },
    MAINTENANCE_BOND: { name: 'Jaminan Pemeliharaan', pct: '5% Kontrak' }
  };
  const selected = typeMap[newBondForm.value.bondType];
  if (selected) {
    newBondForm.value.bondTypeName = selected.name;
    newBondForm.value.percentage = selected.pct;
  }
}

function updateStatus(id, newStatus) {
  legalStore.updateTenderBondStatus(id, newStatus);
}

function submitAddBond() {
  const foundTender = legalStore.state.tenders.find(t => t.id === newBondForm.value.tenderId);
  if (foundTender) {
    newBondForm.value.tenderTitle = foundTender.title;
    if (!newBondForm.value.beneficiary) {
      newBondForm.value.beneficiary = foundTender.organizer;
    }
  }
  legalStore.addTenderBond(newBondForm.value);
  isAddModalOpen.value = false;
  newBondForm.value = {
    tenderId: 'TND-2026-001',
    tenderTitle: '',
    bondType: 'BID_BOND',
    bondTypeName: 'Jaminan Penawaran (Bid Bond)',
    bankIssuer: 'PT Bank Mandiri (Persero) Tbk',
    guaranteeNumber: '',
    amount: null,
    percentage: '2% HPS',
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: '',
    daysValid: 90,
    beneficiary: '',
    status: 'AKTIF',
    notes: ''
  };
}

function confirmDelete(bond) {
  if (window.confirm(`Hapus pencatatan garansi bank "${bond.guaranteeNumber}"?`)) {
    legalStore.deleteTenderBond(bond.id);
  }
}
</script>
