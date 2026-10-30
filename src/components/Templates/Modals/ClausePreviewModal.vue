<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="p-5 sm:p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex items-start justify-between gap-4">
        <div class="space-y-1.5 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/15 text-indigo-200 border border-white/20">
              {{ clause.id || 'CLS' }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {{ clause.category || 'Proteksi Risiko' }}
            </span>
            <span v-if="clause.standardModel" class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {{ clause.standardModel }}
            </span>
          </div>

          <h3 class="text-base sm:text-lg font-extrabold text-white leading-snug">
            {{ clause.title }}
          </h3>
          <p class="text-xs text-slate-300">
            Draf Naskah Klausul Baku Standar Legal &amp; Kontrak Perseroan
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 space-y-5 overflow-y-auto text-xs">
        <!-- Teks / Draf Naskah Klausul -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-[#0F172A] flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-[#4338CA]" />
              <span>Rumusan Lengkap Draf Naskah Klausul:</span>
            </span>
            <span class="text-[10px] text-slate-400 font-mono">Dapat disalin langsung ke draf perjanjian</span>
          </div>

          <div class="bg-[#F8FAFC] p-4 rounded-2xl border border-[#CBD5E1] font-mono text-xs text-[#0F172A] leading-relaxed whitespace-pre-line select-all shadow-inner">
            {{ clauseContent }}
          </div>
        </div>

        <!-- Catatan Mitigasi Risiko / Panduan Legal -->
        <div v-if="clauseExplanation" class="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1.5">
          <div class="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
            <ShieldAlert class="w-4 h-4 text-amber-600 shrink-0" />
            <span>Catatan Yuridis &amp; Batasan Negosiasi (Risk Notes):</span>
          </div>
          <p class="text-[11px] text-[#78350F] leading-relaxed">
            {{ clauseExplanation }}
          </p>
        </div>

        <!-- Tags Koleksi -->
        <div v-if="clause.tags && clause.tags.length" class="space-y-1.5">
          <span class="text-[11px] font-bold text-[#64748B] block">Tag &amp; Taksonomi:</span>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              v-for="tag in clause.tags"
              :key="tag"
              class="px-2.5 py-0.5 rounded-md bg-indigo-50 text-[#4338CA] border border-indigo-100 text-[10px] font-semibold"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
        <button
          type="button"
          @click="$emit('edit', clause)"
          class="px-3.5 py-2 bg-white hover:bg-slate-100 text-[#4338CA] border border-indigo-200 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Pencil class="w-3.5 h-3.5" />
          <span>Edit Klausul</span>
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="copyDraft"
            class="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-[#CBD5E1] font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Copy class="w-3.5 h-3.5 text-indigo-600" />
            <span>Salin Draf Naskah</span>
          </button>

          <button
            type="button"
            @click="$emit('generate', clause)"
            class="px-3.5 py-2 bg-[#4338CA] hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Buka generator naskah interaktif berbasis merge fields"
          >
            <Zap class="w-3.5 h-3.5" />
            <span>Generate Naskah</span>
          </button>

          <button
            type="button"
            @click="$emit('close')"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { X, FileText, ShieldAlert, Copy, Pencil, Zap } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  clause: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'edit', 'generate']);

const clauseContent = computed(() => {
  return props.clause.content || props.clause.standardLanguage || 'Belum ada draf rumusan untuk klausul ini.';
});

const clauseExplanation = computed(() => {
  return props.clause.explanation || props.clause.riskNotes || props.clause.description || '';
});

function copyDraft() {
  if (!clauseContent.value) return;
  navigator.clipboard.writeText(clauseContent.value);
  legalStore.triggerToast('Draf naskah klausul berhasil disalin ke clipboard!', 'success');
}
</script>

