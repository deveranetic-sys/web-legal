<template>
  <div class="space-y-4 animate-in fade-in duration-150">
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 text-xs">
      <p class="text-[#475569]">
        Kategori dokumen ini menjadi rujukan otomatis pada <strong>Audit Dokumen Tender</strong>, <strong>Dokumen Vault</strong>, dan <strong>Formulir Kualifikasi Rekanan</strong>.
      </p>
      <span class="text-[#475569] font-medium shrink-0">
        Total: <strong class="text-[#0F172A]">{{ masterDocTypes.length }}</strong> Tipe
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="docType in masterDocTypes"
        :key="docType.id"
        class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card hover:border-[#C7D2FE] transition-all flex flex-col justify-between space-y-4"
      >
        <div>
          <div class="flex items-center justify-between">
            <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
              {{ docType.code }}
            </span>
            <span
              :class="docType.isMandatory ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]' : 'bg-slate-100 text-slate-600'"
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {{ docType.isMandatory ? 'Wajib Baku' : 'Opsional' }}
            </span>
          </div>

          <h3 class="text-base font-extrabold text-[#0F172A] mt-2">
            {{ docType.name }}
          </h3>

          <p class="text-xs text-[#475569] mt-1 leading-relaxed">
            {{ docType.description }}
          </p>
        </div>

        <div class="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
          <span class="text-[11px] text-[#475569]">
            ID: <strong>{{ docType.id }}</strong>
          </span>

          <div class="flex items-center gap-1">
            <button
              @click="openEditDocType(docType)"
              class="p-1.5 text-slate-500 hover:text-[#4338CA] hover:bg-[#EEF2FF] rounded-lg transition cursor-pointer"
              title="Edit tipe dokumen"
            >
              <Edit3 class="w-4 h-4" />
            </button>
            <button
              @click="confirmDeleteDocType(docType)"
              class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Hapus tipe dokumen"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Edit3, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const masterDocTypes = computed(() => legalStore.state.masterDocTypes || []);

function openEditDocType(item) {
  const newName = window.prompt(`Perbarui nama kategori dokumen "${item.name}":`, item.name);
  if (newName) {
    legalStore.updateMasterDocType(item.id, { name: newName });
  }
}

function confirmDeleteDocType(item) {
  if (window.confirm(`Hapus tipe dokumen "${item.name}" dari master data?`)) {
    legalStore.deleteMasterDocType(item.id);
  }
}
</script>
