<template>
  <div class="space-y-4">
    <!-- Top Search & Quick Stats -->
    <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div class="flex-1 relative">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="templateSearch"
          type="text"
          placeholder="Cari template surat somasi, SPK, surat kuasa, klarifikasi..."
          class="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="font-medium">Total: <strong>{{ filteredLetterTemplates.length }}</strong> template surat</span>
      </div>
    </div>

    <!-- Grid Template Surat Cards -->
    <div v-if="filteredLetterTemplates.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <FileText class="w-6 h-6" />
      </div>
      <h4 class="text-base font-bold text-slate-800">Tidak ada template surat yang cocok</h4>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Belum ada template surat yang sesuai dengan kata kunci pencarian Anda. Klik tombol di bawah untuk menambahkan template baru.
      </p>
      <button
        @click="$emit('open-add')"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Template</span>
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="tmpl in filteredLetterTemplates"
        :key="tmpl.id"
        class="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {{ tmpl.category }}
            </span>

            <div class="flex items-center gap-2">
              <span v-if="tmpl.language" class="text-[11px] font-medium text-slate-400">
                {{ tmpl.language }}
              </span>
              <button
                v-if="isUserAdded(tmpl)"
                @click="confirmDeleteTemplate(tmpl)"
                class="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Hapus template ini"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Title & Description -->
          <div>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {{ tmpl.title || tmpl.templateName }}
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-3">
              {{ tmpl.description }}
            </p>
          </div>

          <!-- Uploaded File Badge -->
          <div
            v-if="tmpl.fileName"
            class="px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-1.5 truncate">
              <Paperclip class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span class="truncate">Berkas: {{ tmpl.fileName }}</span>
            </div>
            <span class="text-emerald-700 font-mono text-[10px] shrink-0" v-if="tmpl.fileSize">
              {{ tmpl.fileSize }}
            </span>
          </div>

          <!-- Klausul / Variabel Termasuk -->
          <div v-if="tmpl.clausesIncluded && tmpl.clausesIncluded.length" class="space-y-1 pt-1">
            <span class="text-[10px] font-semibold text-slate-700 block">Klausul & Komponen:</span>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="clauseName in tmpl.clausesIncluded"
                :key="clauseName"
                class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px]"
              >
                {{ clauseName }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom Action Buttons -->
        <div class="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <button
              v-if="tmpl.contentSample"
              @click="$emit('preview', tmpl)"
              class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1 transition"
            >
              <Eye class="w-3.5 h-3.5 text-slate-500" />
              <span>Lihat Draf</span>
            </button>

            <button
              @click="$emit('generate', tmpl)"
              class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition"
            >
              <Zap class="w-3.5 h-3.5" />
              <span>Generate Surat</span>
            </button>
          </div>

          <button
            @click="downloadTemplate(tmpl)"
            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1 transition"
            :title="tmpl.fileName ? 'Unduh berkas asli template' : 'Unduh draf teks'"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh Berkas</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Search,
  FileText,
  Paperclip,
  Eye,
  Zap,
  Download,
  Trash2,
  Plus
} from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const emit = defineEmits(['open-add', 'preview', 'generate']);

const templateSearch = ref('');

const allTemplates = computed(() => legalStore.state.templates || []);

function isLetterTemplate(tmpl) {
  const cat = (tmpl.category || '').toLowerCase();
  const title = (tmpl.title || tmpl.templateName || '').toLowerCase();
  const tags = (tmpl.tags || []).join(' ').toLowerCase();
  return (
    cat.includes('surat') ||
    cat.includes('somasi') ||
    cat.includes('spk') ||
    cat.includes('korespondensi') ||
    cat.includes('dispute') ||
    title.includes('surat') ||
    title.includes('somasi') ||
    title.includes('spk') ||
    tags.includes('surat') ||
    tags.includes('somasi') ||
    tmpl.fileName?.toLowerCase().includes('surat') ||
    tmpl.fileName?.toLowerCase().includes('somasi')
  );
}

function isUserAdded(tmpl) {
  return tmpl.fileName || tmpl.uploadedAt || tmpl.id?.startsWith('TMPL-008') || Number(tmpl.id?.replace('TMPL-', '')) > 7;
}

const letterTemplates = computed(() => {
  return allTemplates.value.filter(isLetterTemplate);
});

const filteredLetterTemplates = computed(() => {
  const q = templateSearch.value.toLowerCase().trim();
  if (!q) return letterTemplates.value;
  return letterTemplates.value.filter(t => {
    const title = (t.title || t.templateName || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const cat = (t.category || '').toLowerCase();
    return title.includes(q) || desc.includes(q) || cat.includes(q);
  });
});

async function confirmDeleteTemplate(tmpl) {
  const title = tmpl.title || tmpl.templateName;
  const confirmed = await legalStore.confirm({
    title: 'Hapus Template Surat?',
    message: `Apakah Anda yakin ingin menghapus template "${title}"?`,
    confirmText: 'Ya, Hapus Template',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteTemplate(tmpl.id);
  }
}

function downloadTemplate(tmpl) {
  const name = tmpl.title || tmpl.templateName || 'Template_Surat';
  if (tmpl.fileDataUrl && tmpl.fileName) {
    const a = document.createElement('a');
    a.href = tmpl.fileDataUrl;
    a.download = tmpl.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    legalStore.triggerToast(`Mengunduh berkas surat: ${tmpl.fileName}`, 'success');
  } else {
    const content = tmpl.contentSample || `${name}\n\n${tmpl.description || ''}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    legalStore.triggerToast(`Mengunduh draf naskah surat: ${name}`, 'success');
  }
}
</script>
