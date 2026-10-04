<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E]">
            Perpustakaan Hukum Positif
          </span>
          <span class="text-xs text-slate-500 font-medium">JDIH & Putusan Mahkamah Agung</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Database Regulasi & Preseden Hukum
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Kompilasi undang-undang sektoral ketenagalistrikan, penanaman modal PMA, ketenagakerjaan, serta yurisprudensi penting.
        </p>
      </div>

      <!-- Action Button -->
      <div class="shrink-0">
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 transition cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Regulasi</span>
        </button>
      </div>
    </div>

    <!-- Search Bar & Category Filter -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari undang-undang, nomor regulasi, klausul pasal, atau sektor..."
          class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div class="w-full sm:w-56">
        <select
          v-model="filterCategory"
          class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none bg-white text-slate-800 font-medium cursor-pointer"
        >
          <option value="ALL">Semua Kategori Regulasi</option>
          <option value="Undang-Undang">Undang-Undang (UU)</option>
          <option value="Peraturan Pemerintah">Peraturan Pemerintah (PP)</option>
          <option value="Peraturan Menteri ESDM">Peraturan Menteri ESDM</option>
          <option value="Peraturan BKPM">Peraturan BKPM</option>
          <option value="Peraturan KLHK">Peraturan KLHK</option>
          <option value="Putusan Mahkamah Agung">Putusan Mahkamah Agung</option>
        </select>
      </div>
    </div>

    <!-- Regulation Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in filteredKnowledge"
        :key="item.id"
        class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-[#FDE68A]">
              {{ item.category }}
            </span>
            <span class="text-[11px] font-mono text-slate-400">{{ item.effectiveDate || item.date }}</span>
          </div>

          <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {{ item.title }}
          </h3>

          <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">
            {{ item.summary }}
          </p>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-slate-500">Sektor: <span class="font-bold text-slate-700">{{ item.sector || item.legalTopic }}</span></span>
          <button
            @click="selectedReg = item"
            class="text-amber-700 hover:text-amber-800 font-bold cursor-pointer whitespace-nowrap"
          >
            Lihat Poin
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Detail Regulasi -->
    <div
      v-if="selectedReg"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="selectedReg = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span class="text-[10px] font-bold text-amber-700 uppercase">{{ selectedReg.category }}</span>
            <h3 class="font-bold text-slate-900 text-sm mt-0.5">{{ selectedReg.title }}</h3>
          </div>
          <button @click="selectedReg = null" class="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <span class="font-bold text-slate-700 block mb-1">Ketentuan Pokok & Poin Kritis:</span>
            <p class="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line">
              {{ selectedReg.keyProvisions || selectedReg.summary }}
            </p>
          </div>
          <div class="text-slate-500 text-[11px] space-y-1">
            <div>Tanggal Berlaku: <span class="font-bold text-slate-700">{{ selectedReg.effectiveDate || selectedReg.date }}</span> • Nomor: {{ selectedReg.referenceNumber || selectedReg.regulationNumber }}</div>
            <div v-if="selectedReg.source">Sumber JDIH: <span class="font-semibold text-slate-700">{{ selectedReg.source }}</span></div>
            <div v-if="selectedReg.link" class="pt-1">
              <a :href="selectedReg.link" target="_blank" class="text-indigo-600 hover:underline font-bold inline-flex items-center gap-1">
                Buka Tautan JDIH Resmi ↗
              </a>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button @click="selectedReg = null" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Tambah Regulasi Sektoral Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-amber-400" />
            <h3 class="font-extrabold text-white text-base">Entri Regulasi & Preseden Hukum Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewRegulation" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Judul Peraturan / Regulasi *</label>
            <input
              v-model="newRegForm.title"
              type="text"
              required
              placeholder="Contoh: Permen ESDM No. 11/2021 tentang Pelaksanaan Usaha Ketenagalistrikan"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Kategori Dokumen Hukum</label>
              <select
                v-model="newRegForm.category"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 outline-none"
              >
                <option value="Undang-Undang">Undang-Undang (UU)</option>
                <option value="Peraturan Pemerintah">Peraturan Pemerintah (PP)</option>
                <option value="Peraturan Menteri ESDM">Peraturan Menteri ESDM</option>
                <option value="Peraturan BKPM">Peraturan BKPM</option>
                <option value="Peraturan KLHK">Peraturan KLHK</option>
                <option value="Putusan Mahkamah Agung">Putusan Mahkamah Agung</option>
                <option value="Peraturan Perusahaan">Peraturan Internal Perusahaan</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Sektor Industri Terkait</label>
              <select
                v-model="newRegForm.sector"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 outline-none"
              >
                <option value="Ketenagalistrikan & Energi">Ketenagalistrikan & Energi</option>
                <option value="Pertambangan Mineral & Batubara">Pertambangan Mineral & Batubara</option>
                <option value="Korporat & Penanaman Modal (PMA)">Korporat & Penanaman Modal (PMA)</option>
                <option value="Ketenagakerjaan & Hubungan Industrial">Ketenagakerjaan & Hubungan Industrial</option>
                <option value="Lingkungan Hidup & Kehutanan">Lingkungan Hidup & Kehutanan</option>
                <option value="Perpajakan & Bea Cukai">Perpajakan & Bea Cukai</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Nomor Referensi / Regulasi *</label>
              <input
                v-model="newRegForm.referenceNumber"
                type="text"
                required
                placeholder="Permen ESDM 11/2021"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 font-mono"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Tanggal Berlaku Efektif</label>
              <input
                v-model="newRegForm.effectiveDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Sumber Dokumen / Instansi</label>
              <input
                v-model="newRegForm.source"
                type="text"
                placeholder="JDIH Kementerian ESDM"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Tautan Web JDIH (URL)</label>
              <input
                v-model="newRegForm.link"
                type="url"
                placeholder="https://jdih.esdm.go.id"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Ringkasan Ketentuan / Abstrak *</label>
            <textarea
              v-model="newRegForm.summary"
              required
              rows="2"
              placeholder="Jelaskan pokok substansi ketentuan, latar belakang diterbitkan, atau batas waktu penyesuaian..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Ketentuan Pokok & Pasal Kritis</label>
            <textarea
              v-model="newRegForm.keyProvisions"
              rows="3"
              placeholder="Tuliskan nomor pasal penting dan sanksi atau kewajiban mandatori yang wajib dipatuhi perusahaan..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Simpan Regulasi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { Search, Plus } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const searchQuery = ref('');
const filterCategory = ref('ALL');
const isAddModalOpen = ref(false);
const selectedReg = ref(null);

const newRegForm = reactive({
  title: '',
  category: 'Peraturan Menteri ESDM',
  sector: 'Ketenagalistrikan & Energi',
  referenceNumber: '',
  effectiveDate: new Date().toISOString().slice(0, 10),
  source: 'JDIH Kementerian ESDM',
  link: 'https://jdih.esdm.go.id',
  summary: '',
  keyProvisions: ''
});

function submitNewRegulation() {
  legalStore.addKnowledge({ ...newRegForm });
  isAddModalOpen.value = false;
  newRegForm.title = '';
  newRegForm.referenceNumber = '';
  newRegForm.summary = '';
  newRegForm.keyProvisions = '';
}

const knowledge = computed(() => legalStore.state.knowledge);

const filteredKnowledge = computed(() => {
  return knowledge.value.filter(k => {
    const q = searchQuery.value.toLowerCase().trim();
    const title = (k.title || '').toLowerCase();
    const summary = (k.summary || '').toLowerCase();
    const sector = (k.sector || k.legalTopic || '').toLowerCase();
    const cat = (k.category || '').toLowerCase();

    const matchesSearch = !q || title.includes(q) || summary.includes(q) || sector.includes(q);
    const matchesCategory = filterCategory.value === 'ALL' || cat.includes(filterCategory.value.toLowerCase());

    return matchesSearch && matchesCategory;
  });
});
</script>
