<template>
  <div
    v-if="loading.show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 flex items-center gap-3.5 max-w-sm w-full animate-in zoom-in-95 duration-150">
      <div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
        <Loader2 class="w-5 h-5 text-indigo-600 animate-spin" />
      </div>

      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-extrabold text-slate-900 tracking-tight">Memproses Tindakan</h4>
        <p class="text-[11px] text-slate-500 mt-0.5 truncate">{{ loading.message || 'Mohon tunggu sebentar...' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const loading = computed(() => legalStore.state.globalLoading);
</script>
