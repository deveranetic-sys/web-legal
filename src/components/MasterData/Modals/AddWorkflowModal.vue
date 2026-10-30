<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4338CA]">
            <GitFork class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">Tambah Skema Alur Tender Baru</h3>
            <p class="text-[11px] text-[#64748B] mt-0.5">Konfigurasi alur proses pengadaan, regulasi acuan, dan paket tahapan bawaan.</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition cursor-pointer"
          title="Tutup"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form Body -->
      <div class="p-6 overflow-y-auto max-h-[80vh]">
        <form @submit.prevent="handleSubmit" class="space-y-4 text-xs">
          <!-- Workflow Name -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Nama Skema Alur Tender *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: Pengadaan Jasa Konsultansi & Desain Engineering"
              class="form-input text-xs w-full h-[38px]"
            />
            <p class="text-[10px] text-[#64748B] mt-1">Nama alur yang akan tampil pada pilihan sektor pengadaan tender.</p>
          </div>

          <!-- Workflow Code & Icon -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#0F172A] mb-1">
                Kode Sektor / Alur (ID) *
              </label>
              <input
                v-model="form.code"
                type="text"
                required
                placeholder="Contoh: KONSULTANSI"
                class="form-input text-xs w-full h-[38px] font-mono uppercase"
              />
            </div>

            <div>
              <label class="block font-semibold text-[#0F172A] mb-1">
                Kode Template Alur
              </label>
              <input
                v-model="form.workflowTemplate"
                type="text"
                placeholder="Contoh: SPSE_KONSULTANSI_6"
                class="form-input text-xs w-full h-[38px] font-mono"
              />
            </div>
          </div>

          <!-- Icon Selector Grid -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1.5">
              Pilih Icon Identitas Sektor
            </label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="p in iconPresets"
                :key="p.id"
                type="button"
                @click="form.icon = p.id"
                :class="form.icon === p.id ? 'bg-[#EEF2FF] text-[#4338CA] border-[#6366F1] font-bold shadow-2xs' : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'"
                class="flex items-center gap-1.5 p-2 rounded-lg border text-[11px] transition cursor-pointer"
              >
                <component :is="p.icon" class="w-3.5 h-3.5 shrink-0" />
                <span class="truncate">{{ p.label }}</span>
              </button>
            </div>
          </div>

          <!-- Initial Stages Cloning Template Selection -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Paket Tahapan Awal (Salin Tahapan Standar) *
            </label>
            <select
              v-model="form.initialStagesTemplate"
              required
              class="form-select text-xs w-full h-[38px] font-semibold"
            >
              <option value="KONSTRUKSI">Duplikasi 8 Tahap Standar Konstruksi (SPSE PUPR)</option>
              <option value="PERTAMBANGAN">Duplikasi 8 Tahap Standar Pertambangan (RKAB & JORC Minerba)</option>
              <option value="MIGAS">Duplikasi 8 Tahap Standar Hulu Migas (PTK-007 SKK Migas)</option>
              <option value="ENERGI">Duplikasi 8 Tahap Standar Ketenagalistrikan (RUPTL & IPP PLN)</option>
              <option value="UMUM">Duplikasi 8 Tahap Standar Pengadaan Barang & Jasa Umum</option>
              <option value="EMPTY">-- Draf Kosong (Tanpa Tahapan Awal, Atur Manual) --</option>
            </select>
            <p class="text-[10px] text-[#64748B] mt-1">
              Tahapan bawaan dapat diubah, dihapus, atau diatur urutannya setelah skema dibuat.
            </p>
          </div>

          <!-- Regulatory & Default Contract -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#0F172A] mb-1">
                Dasar Hukum & Regulasi Acuan *
              </label>
              <input
                v-model="form.regulatoryBasis"
                type="text"
                required
                placeholder="Contoh: Perpres 16/2018 jo 12/2021"
                class="form-input text-xs w-full h-[38px]"
              />
            </div>

            <div>
              <label class="block font-semibold text-[#0F172A] mb-1">
                Tipe Kontrak Bawaan
              </label>
              <input
                v-model="form.defaultContractType"
                type="text"
                placeholder="Contoh: Kontrak Lumsum / Waktu Penugasan"
                class="form-input text-xs w-full h-[38px]"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Deskripsi & Karakteristik Alur Pengadaan
            </label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Jelaskan karakteristik proses tender, batasan peserta, dan tata kelola pengadaan pada sektor ini..."
              class="form-input text-xs w-full p-2.5 leading-relaxed resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F1F5F9] font-semibold text-xs cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-lg bg-[#4338CA] hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check class="w-4 h-4 stroke-[2.5]" />
              <span>Buat Skema Alur Tender</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  GitFork,
  X,
  Check,
  Building2,
  HardHat,
  Pickaxe,
  Flame,
  Zap,
  Package,
  Factory,
  Radio,
  Boxes
} from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'created']);

const iconPresets = [
  { id: 'Building2', label: 'Jasa/Korporasi', icon: Building2 },
  { id: 'Radio', label: 'IT & Telko', icon: Radio },
  { id: 'Package', label: 'Pengadaan', icon: Package },
  { id: 'Factory', label: 'Pabrikasi', icon: Factory },
  { id: 'HardHat', label: 'Konstruksi', icon: HardHat },
  { id: 'Pickaxe', label: 'Tambang', icon: Pickaxe },
  { id: 'Flame', label: 'Migas', icon: Flame },
  { id: 'Zap', label: 'Energi Listrik', icon: Zap }
];

const form = ref({
  name: '',
  code: '',
  icon: 'Building2',
  regulatoryBasis: 'Perpres 16/2018 jo 12/2021',
  workflowTemplate: '',
  defaultContractType: 'Kontrak Standar Korporasi',
  initialStagesTemplate: 'KONSTRUKSI',
  description: ''
});

function handleSubmit() {
  const code = (form.value.code || form.value.name.slice(0, 8)).trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  const templateCode = form.value.workflowTemplate.trim() || `SPSE_${code}_8`;

  emit('created', {
    name: form.value.name.trim(),
    code,
    icon: form.value.icon,
    regulatoryBasis: form.value.regulatoryBasis.trim(),
    workflowTemplate: templateCode,
    defaultContractType: form.value.defaultContractType.trim(),
    initialStagesTemplate: form.value.initialStagesTemplate,
    description: form.value.description.trim()
  });

  // Reset form
  form.value = {
    name: '',
    code: '',
    icon: 'Building2',
    regulatoryBasis: 'Perpres 16/2018 jo 12/2021',
    workflowTemplate: '',
    defaultContractType: 'Kontrak Standar Korporasi',
    initialStagesTemplate: 'KONSTRUKSI',
    description: ''
  };
}
</script>

