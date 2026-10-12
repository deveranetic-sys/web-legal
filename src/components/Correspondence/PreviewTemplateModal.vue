<template>
  <div
    v-if="isOpen && template"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
      <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            {{ template.category }}
          </span>
          <h3 class="text-lg font-bold text-slate-900 mt-1">{{ template.title || template.templateName }}</h3>
        </div>
        <button
          @click="closeModal"
          class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-4">
        <p class="text-xs text-slate-500">{{ template.description }}</p>

        <div v-if="template.fileName" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Paperclip class="w-4 h-4 text-emerald-600" />
          <span>Berkas Lampiran: <strong>{{ template.fileName }}</strong> ({{ template.fileSize }})</span>
        </div>

        <div class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-line select-all border border-slate-800">
          {{ template.contentSample }}
        </div>
      </div>

      <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span class="text-xs text-slate-500">{{ template.language || 'Bahasa Indonesia' }}</span>
        <div class="flex items-center gap-2">
          <button
            @click="copyText"
            class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>Salin Naskah</span>
          </button>
          <button
            @click="generateTemplate"
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Zap class="w-3.5 h-3.5" />
            <span>Generate Naskah</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Paperclip, Copy, Zap } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isOpen: Boolean,
  template: Object
});

const emit = defineEmits(['close', 'generate']);

function closeModal() {
  emit('close');
}

function copyText() {
  if (!props.template || !props.template.contentSample) return;
  navigator.clipboard.writeText(props.template.contentSample);
  legalStore.triggerToast('Teks naskah surat disalin ke clipboard!', 'success');
}

function generateTemplate() {
  emit('generate', props.template);
  closeModal();
}
</script>
