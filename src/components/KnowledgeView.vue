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
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex gap-3">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari undang-undang, nomor regulasi, klausul pasal, atau sektor..."
          class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
        />
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
            <span class="text-[11px] font-mono text-slate-400">{{ item.effectiveDate }}</span>
          </div>

          <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {{ item.title }}
          </h3>

          <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {{ item.summary }}
          </p>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-slate-500">Sektor: <span class="font-bold text-slate-700">{{ item.sector }}</span></span>
          <button
            @click="selectedReg = item"
            class="text-amber-700 hover:text-amber-800 font-bold cursor-pointer"
          >
            Lihat Poin Kunci & Pasal &rarr;
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Detail Regulasi -->
    <div
      v-if="selectedReg"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="selectedReg = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span class="text-[10px] font-bold text-amber-700 uppercase">{{ selectedReg.category }}</span>
            <h3 class="font-bold text-slate-900 text-sm mt-0.5">{{ selectedReg.title }}</h3>
          </div>
          <button @click="selectedReg = null" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <span class="font-bold text-slate-700 block mb-1">Ketentuan Pokok & Poin Kritis:</span>
            <p class="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {{ selectedReg.keyProvisions || selectedReg.summary }}
            </p>
          </div>
          <div class="text-slate-500 text-[11px]">
            Tanggal Berlaku: <span class="font-bold text-slate-700">{{ selectedReg.effectiveDate }}</span> • Referensi: {{ selectedReg.referenceNumber }}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button @click="selectedReg = null" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const searchQuery = ref('');
const selectedReg = ref(null);

const knowledge = computed(() => legalStore.state.knowledge);

const filteredKnowledge = computed(() => {
  return knowledge.value.filter(k => {
    const q = searchQuery.value.toLowerCase().trim();
    return !q || k.title.toLowerCase().includes(q) || k.summary.toLowerCase().includes(q) || k.sector.toLowerCase().includes(q);
  });
});
</script>
