<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center border border-[#C7D2FE] text-[#6366F1]">
            <FileSpreadsheet class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-white">Pendaftaran Paket Lelang & Pengadaan Baru</h3>
            <p class="text-xs text-slate-300">Catat paket tender dengan opsi sektor: Konstruksi, Tambang, Migas, Energi, dll.</p>
          </div>
        </div>
        <button @click="closeModal" class="text-slate-400 hover:text-white p-1 cursor-pointer transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
        <!-- Sektor Selection -->
        <div class="p-3.5 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE]">
          <label class="block font-bold text-[#4338CA] mb-1.5 text-xs">
            Sektor Proyek / Industri Lelang *
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <label
              v-for="s in sectorOptions"
              :key="s.value"
              :class="form.sector === s.value ? 'bg-white text-[#4338CA] border-2 border-[#6366F1] shadow-xs' : 'bg-white/60 text-[#475569] border border-[#E2E8F0] hover:bg-white'"
              class="flex items-center gap-2 p-2 rounded-xl cursor-pointer text-xs font-bold transition"
            >
              <input
                type="radio"
                v-model="form.sector"
                :value="s.value"
                class="sr-only"
              />
              <span>{{ s.icon }}</span>
              <span class="truncate">{{ s.label }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Judul / Nama Paket Pengadaan *</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Contoh: Pekerjaan Pembangunan Terowongan & Jembatan Patimban Paket 4"
            class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nomor Pengumuman / Tender *</label>
            <input
              v-model="form.tenderNumber"
              type="text"
              required
              placeholder="Contoh: PUPR-BM-2026-902"
              class="w-full px-3 py-2.5 text-xs font-mono border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Instansi / Panitia Penyelenggara *</label>
            <input
              v-model="form.organizer"
              type="text"
              required
              placeholder="Contoh: Balai Besar Pelaksanaan Jalan Nasional PUPR"
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan Peserta *</label>
            <select
              v-model="form.company"
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="PT Nusantara Energi">PT Nusantara Energi</option>
              <option value="PT Java Power Solutions">PT Java Power Solutions</option>
              <option value="PT Borneo Mineral Resources">PT Borneo Mineral Resources</option>
              <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Kategori Pengadaan</label>
            <input
              v-model="form.category"
              type="text"
              placeholder="Contoh: Konstruksi & Rekayasa Sipil"
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Pagu Anggaran HPS (IDR) *</label>
            <input
              v-model.number="form.hpsValue"
              type="number"
              min="0"
              required
              placeholder="Contoh: 150000000000"
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Estimasi Nilai Penawaran (IDR)</label>
            <input
              v-model.number="form.bidValue"
              type="number"
              min="0"
              placeholder="Contoh: 125000000000"
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Tahapan Saat Ini</label>
            <select
              v-model="form.stage"
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="PERSIAPAN_PENGADAAN">1. Persiapan Pengadaan</option>
              <option value="PENGUMUMAN_PENDAFTARAN">2. Pengumuman & Pendaftaran</option>
              <option value="AANWIJZING">3. Pemberian Penjelasan</option>
              <option value="PENYAMPAIAN_PENAWARAN">4. Penyampaian Penawaran</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Batas Akhir Penawaran *</label>
            <input
              v-model="form.deadlineDate"
              type="date"
              required
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">PIC Legal / Bid Lead</label>
            <input
              v-model="form.pic"
              type="text"
              placeholder="Contoh: Budi Santoso, S.H."
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Catatan Tambahan</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Catatan ruang lingkup atau syarat khusus lelang..."
            class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus class="w-4 h-4" />
            <span>Daftarkan Paket</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { FileSpreadsheet, X, Plus } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'submit']);

const sectorOptions = [
  { value: 'KONSTRUKSI', label: 'Konstruksi & Infrastruktur', icon: '🏗️' },
  { value: 'PERTAMBANGAN', label: 'Pertambangan & Mineral', icon: '⛏️' },
  { value: 'MIGAS', label: 'Minyak & Gas Bumi', icon: '🛢️' },
  { value: 'ENERGI', label: 'Energi & Ketenagalistrikan', icon: '⚡' },
  { value: 'UMUM', label: 'Pengadaan Barang & Jasa Umum', icon: '📦' }
];

const defaultForm = () => ({
  title: '',
  tenderNumber: '',
  organizer: '',
  company: 'PT Nusantara Energi',
  category: 'Konstruksi & Infrastruktur',
  sector: 'KONSTRUKSI',
  hpsValue: null,
  bidValue: null,
  deadlineDate: '',
  stage: 'PERSIAPAN_PENGADAAN',
  pic: 'Budi Santoso, S.H., LL.M.',
  notes: ''
});

const form = ref(defaultForm());

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = defaultForm();
  }
});

function closeModal() {
  emit('close');
}

function submitForm() {
  emit('submit', { ...form.value });
}
</script>
