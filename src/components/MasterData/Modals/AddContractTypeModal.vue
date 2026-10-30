<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 text-xs border border-[#E2E8F0] max-h-[92vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 text-[#4338CA] border border-indigo-200 flex items-center justify-center font-bold">
            <component :is="isEditing ? Pencil : Plus" class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#0F172A]">
              {{ isEditing ? 'Edit Master Tipe Kontrak' : 'Tambah Master Tipe Kontrak Baru' }}
            </h3>
            <p class="text-[11px] text-[#64748B]">
              {{ isEditing ? 'Perbarui taksonomi, klausul default, dan skema termin kontrak' : 'Definisikan tipe kontrak korporasi baru dan standar termin pembayarannya' }}
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition"
        >
          ✕
        </button>
      </div>

      <!-- Form Body (Scrollable) -->
      <form id="contractTypeForm" @submit.prevent="submitForm" class="space-y-4 overflow-y-auto pr-1">
        <!-- Section 1: Identitas & Format Acuan -->
        <div class="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
          <div class="font-bold text-[#0F172A] text-xs flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#4338CA]"></span>
            <span>1. Identitas & Format Acuan Kontrak</span>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Tipe Kontrak *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: Operation & Maintenance (O&M) Agreement"
              class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kode Singkatan Kontrak *</label>
              <input
                v-model="form.code"
                type="text"
                required
                placeholder="Contoh: O_AND_M"
                class="w-full px-3 py-2 text-xs font-mono uppercase border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Sektor Industri Relevan *</label>
              <select
                v-model="form.sector"
                required
                class="form-select text-xs w-full h-[38px] bg-white border border-[#CBD5E1] rounded-xl"
              >
                <option v-for="s in masterSectors" :key="s.code" :value="s.code">
                  {{ s.name }} ({{ s.code }})
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Standar Format Acuan Dokumen</label>
            <input
              v-model="form.standardFormat"
              type="text"
              placeholder="Contoh: FIDIC Silver Book / Standar PUPR / PTK-007"
              class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Deskripsi & Ruang Lingkup Kontrak</label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Jelaskan karakteristik, ruang lingkup pekerjaan, dan penerapan tipe kontrak ini..."
              class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            ></textarea>
          </div>
        </div>

        <!-- Section 2: Finansial & Termin Bawaan -->
        <div class="space-y-3 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100">
          <div class="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>2. Skema Finansial & Termin Pembayaran Default</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Jenis Skema Termin</label>
              <select
                v-model="form.paymentType"
                class="form-select text-xs w-full h-[38px] bg-white border border-[#CBD5E1] rounded-xl"
              >
                <option value="Termin Bertahap (Milestone Progress)">Termin Bertahap (Milestone Progress)</option>
                <option value="Lump Sum 100% Pasca BAST">Lump Sum 100% Pasca BAST</option>
                <option value="Per Pengapalan (Bill of Lading / LC)">Per Pengapalan (Bill of Lading / LC)</option>
                <option value="Bulanan Rekapitulasi (Monthly Billing)">Bulanan Rekapitulasi (Monthly Billing)</option>
                <option value="Cash Call Berkala (Monthly Advance)">Cash Call Berkala (Monthly Advance)</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-bold text-[#0F172A] mb-1">Retensi (%)</label>
                <input
                  v-model.number="form.retentionPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="5"
                  class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label class="block font-bold text-[#0F172A] mb-1">Masa Garansi (Hari)</label>
                <input
                  v-model.number="form.retentionPeriodDays"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="365"
                  class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Template Skema Termin Pembayaran Bawaan</label>
            <input
              v-model="form.defaultPaymentTerms"
              type="text"
              placeholder="Contoh: 4 Tahap (Uang Muka 20%, Progress 40%, Progress 35%, Retensi 5%)"
              class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <!-- Section 3: Ketentuan Hukum & Klausul Default -->
        <div class="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
          <div class="font-bold text-[#0F172A] text-xs flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>3. Klausul Hukum, Denda & Penyelesaian Sengketa</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Forum Penyelesaian Sengketa Default</label>
              <input
                v-model="form.disputeForum"
                type="text"
                placeholder="Contoh: BANI (Badan Arbitrase Nasional Indonesia)"
                class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Hukum yang Mengatur (Governing Law)</label>
              <input
                v-model="form.governingLaw"
                type="text"
                placeholder="Contoh: Hukum Republik Indonesia"
                class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Klausul Denda Keterlambatan (Default Penalty Clause)</label>
            <input
              v-model="form.penaltyClause"
              type="text"
              placeholder="Contoh: 1‰ per hari keterlambatan, maksimum 5% dari nilai kontrak"
              class="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
        </div>
      </form>

      <!-- Modal Footer -->
      <div class="flex justify-between items-center pt-3 border-t border-[#E2E8F0] shrink-0">
        <span class="text-[11px] text-slate-400">
          * Kolom wajib diisi
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl cursor-pointer transition text-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            form="contractTypeForm"
            class="px-4 py-2 bg-[#4338CA] hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer shadow-xs transition text-xs flex items-center gap-1.5"
          >
            <span>{{ isEditing ? 'Simpan Perubahan' : 'Tambahkan Tipe Kontrak' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Plus, Pencil } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  contractTypeToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);

const isEditing = computed(() => Boolean(props.contractTypeToEdit && props.contractTypeToEdit.id));
const masterSectors = computed(() => legalStore.state.masterSectors || []);

const form = ref({
  name: '',
  code: '',
  sector: 'KONSTRUKSI',
  standardFormat: '',
  description: '',
  paymentType: 'Termin Bertahap (Milestone Progress)',
  defaultPaymentTerms: '',
  retentionPercent: 5,
  retentionPeriodDays: 365,
  governingLaw: 'Hukum Republik Indonesia',
  disputeForum: 'BANI (Badan Arbitrase Nasional Indonesia)',
  penaltyClause: '1‰ per hari keterlambatan, maksimum 5% dari nilai kontrak'
});

watch(
  () => props.contractTypeToEdit,
  (val) => {
    if (val) {
      form.value = {
        name: val.name || '',
        code: val.code || '',
        sector: val.sector || 'KONSTRUKSI',
        standardFormat: val.standardFormat || '',
        description: val.description || '',
        paymentType: val.paymentType || 'Termin Bertahap (Milestone Progress)',
        defaultPaymentTerms: val.defaultPaymentTerms || '',
        retentionPercent: val.retentionPercent ?? 5,
        retentionPeriodDays: val.retentionPeriodDays ?? 365,
        governingLaw: val.governingLaw || 'Hukum Republik Indonesia',
        disputeForum: val.disputeForum || 'BANI (Badan Arbitrase Nasional Indonesia)',
        penaltyClause: val.penaltyClause || '1‰ per hari keterlambatan, maksimum 5% dari nilai kontrak'
      };
    } else {
      form.value = {
        name: '',
        code: '',
        sector: 'KONSTRUKSI',
        standardFormat: '',
        description: '',
        paymentType: 'Termin Bertahap (Milestone Progress)',
        defaultPaymentTerms: '4 Tahap (Uang Muka 20%, Progress 40%, Progress 35%, Retensi 5%)',
        retentionPercent: 5,
        retentionPeriodDays: 365,
        governingLaw: 'Hukum Republik Indonesia',
        disputeForum: 'BANI (Badan Arbitrase Nasional Indonesia)',
        penaltyClause: '1‰ per hari keterlambatan, maksimum 5% dari nilai kontrak'
      };
    }
  },
  { immediate: true }
);

function submitForm() {
  if (isEditing.value) {
    legalStore.updateMasterContractType(props.contractTypeToEdit.id, form.value);
  } else {
    legalStore.addMasterContractType(form.value);
  }
  emit('saved');
  emit('close');
}
</script>
