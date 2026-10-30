<template>
  <div class="space-y-4 animate-in fade-in duration-150">
    <!-- Empty State -->
    <div v-if="filteredClauses.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3 shadow-xs">
      <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4338CA] flex items-center justify-center mx-auto border border-indigo-100">
        <FileText class="w-6 h-6" />
      </div>
      <h4 class="text-base font-bold text-[#0F172A]">Tidak ada klausul yang cocok</h4>
      <p class="text-xs text-[#64748B] max-w-md mx-auto">
        Tidak ditemukan klausul dengan kata kunci pencarian Anda. Anda dapat menambahkan klausul standar baru.
      </p>
      <button
        @click="$emit('open-add')"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4338CA] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Klausul Baru</span>
      </button>
    </div>

    <!-- Clauses Cards Grid -->
    <div
      v-for="clause in filteredClauses"
      :key="clause.id"
      class="bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-indigo-200 shadow-xs space-y-3.5 transition"
    >
      <!-- Top Row: Category, ID, Model & Action Icons -->
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {{ clause.id }}
          </span>
          <span class="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4338CA] border border-indigo-100">
            {{ clause.category }}
          </span>
          <span v-if="clause.standardModel" class="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {{ clause.standardModel }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <button
            @click="$emit('open-edit', clause)"
            class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
            title="Edit Klausul Baku"
          >
            <Pencil class="w-3.5 h-3.5" />
          </button>
          <button
            @click="confirmDeleteClause(clause)"
            class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Hapus Klausul"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Title -->
      <div>
        <h3 class="text-sm sm:text-base font-extrabold text-[#0F172A] leading-snug">
          {{ clause.title }}
        </h3>
      </div>

      <!-- Draf Naskah Preview Box (Clickable to open full preview) -->
      <div
        @click="openClausePreview(clause)"
        class="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] font-mono text-xs text-[#0F172A] leading-relaxed line-clamp-3 select-all hover:border-indigo-300 hover:bg-indigo-50/20 transition cursor-pointer"
        title="Klik untuk membuka draf naskah lengkap"
      >
        {{ getClauseContent(clause) }}
      </div>

      <!-- Catatan Mitigasi Risiko -->
      <div v-if="getClauseExplanation(clause)" class="text-xs text-[#78350F] bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2">
        <ShieldAlert class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p class="leading-relaxed text-[11px]">
          <strong>Catatan Yuridis:</strong> {{ getClauseExplanation(clause) }}
        </p>
      </div>

      <!-- Bottom Action Buttons: Lihat Draf, Generate Naskah & Salin Teks -->
      <div class="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            @click="openClausePreview(clause)"
            class="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-[#4338CA] font-bold text-xs cursor-pointer flex items-center gap-1.5 transition shadow-2xs"
          >
            <Eye class="w-3.5 h-3.5 text-[#4338CA]" />
            <span>Lihat Draf Naskah</span>
          </button>

          <button
            @click="$emit('generate', clause)"
            class="px-3 py-1.5 rounded-lg bg-[#4338CA] hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition"
            title="Generate naskah resmi interaktif berbasis merge fields"
          >
            <Zap class="w-3.5 h-3.5" />
            <span>Generate Naskah</span>
          </button>
        </div>

        <button
          @click="copyText(getClauseContent(clause))"
          class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition"
        >
          <Copy class="w-3.5 h-3.5 text-slate-500" />
          <span>Salin Teks</span>
        </button>
      </div>
    </div>

    <!-- Modal Pratinjau Draf Klausul Lengkap -->
    <ClausePreviewModal
      v-if="selectedClauseForPreview"
      :clause="selectedClauseForPreview"
      @close="selectedClauseForPreview = null"
      @edit="handleEditFromPreview"
      @generate="handleGenerateFromPreview"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { FileText, Plus, Copy, Pencil, Trash2, Eye, Zap, ShieldAlert } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';
import ClausePreviewModal from '../Modals/ClausePreviewModal.vue';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedCategory: {
    type: String,
    default: 'ALL'
  }
});

const emit = defineEmits(['open-add', 'open-edit', 'generate']);

const selectedClauseForPreview = ref(null);

const clauses = computed(() => legalStore.state.clauses || []);

const filteredClauses = computed(() => {
  let list = clauses.value;
  if (props.selectedCategory && props.selectedCategory !== 'ALL') {
    list = list.filter(c => c.category === props.selectedCategory);
  }
  const q = props.searchQuery.toLowerCase().trim();
  if (!q) return list;
  return list.filter(c => {
    const title = (c.title || '').toLowerCase();
    const content = (c.content || c.standardLanguage || '').toLowerCase();
    const cat = (c.category || '').toLowerCase();
    const model = (c.standardModel || '').toLowerCase();
    return title.includes(q) || content.includes(q) || cat.includes(q) || model.includes(q);
  });
});

function getClauseContent(clause) {
  return clause.content || clause.standardLanguage || 'Belum ada draf naskah yang ditetapkan untuk klausul ini.';
}

function getClauseExplanation(clause) {
  return clause.explanation || clause.riskNotes || clause.description || '';
}

function openClausePreview(clause) {
  selectedClauseForPreview.value = clause;
}

function handleEditFromPreview(clause) {
  selectedClauseForPreview.value = null;
  emit('open-edit', clause);
}

function handleGenerateFromPreview(clause) {
  selectedClauseForPreview.value = null;
  emit('generate', clause);
}

function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  legalStore.triggerToast('Teks klausul disalin ke clipboard!', 'success');
}

async function confirmDeleteClause(clause) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Klausul Baku?',
    message: `Apakah Anda yakin ingin menghapus klausul "${clause.title}"? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: 'Ya, Hapus Klausul',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteClause(clause.id);
  }
}
</script>
