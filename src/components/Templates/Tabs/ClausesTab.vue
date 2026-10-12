<template>
  <div class="space-y-4">
    <div v-if="filteredClauses.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <FileText class="w-6 h-6" />
      </div>
      <h4 class="text-base font-bold text-slate-800">Tidak ada klausul yang cocok</h4>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Tidak ditemukan klausul dengan kata kunci pencarian Anda. Anda dapat menambahkan klausul standar baru.
      </p>
      <button
        @click="$emit('open-add')"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Klausul</span>
      </button>
    </div>

    <div
      v-for="clause in filteredClauses"
      :key="clause.id"
      class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
            {{ clause.category }}
          </span>
          <span v-if="clause.standardModel" class="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {{ clause.standardModel }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="copyText(clause.content)"
            class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>Salin</span>
          </button>
          <button
            @click="$emit('open-edit', clause)"
            class="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
            title="Edit Klausul"
          >
            <Pencil class="w-3.5 h-3.5" />
          </button>
          <button
            @click="confirmDeleteClause(clause)"
            class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Hapus Klausul"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 class="text-base font-bold text-slate-900">{{ clause.title }}</h3>

      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-line select-all">
        {{ clause.content }}
      </div>

      <p class="text-xs text-slate-500 italic">
        Catatan Legal: {{ clause.explanation || clause.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FileText, Plus, Copy, Pencil, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['open-add', 'open-edit']);

const clauses = computed(() => legalStore.state.clauses || []);

const filteredClauses = computed(() => {
  const q = props.searchQuery.toLowerCase().trim();
  if (!q) return clauses.value;
  return clauses.value.filter(c => {
    const title = (c.title || '').toLowerCase();
    const content = (c.content || '').toLowerCase();
    const cat = (c.category || '').toLowerCase();
    const model = (c.standardModel || '').toLowerCase();
    return title.includes(q) || content.includes(q) || cat.includes(q) || model.includes(q);
  });
});

function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  legalStore.triggerToast('Teks klausul disalin ke clipboard!', 'success');
}

function confirmDeleteClause(clause) {
  if (confirm(`Apakah Anda yakin ingin menghapus klausul "${clause.title}"?`)) {
    legalStore.deleteClause(clause.id);
  }
}
</script>
