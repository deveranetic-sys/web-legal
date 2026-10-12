<template>
  <div
    v-if="dialog.show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="handleCancel"
    @keydown.esc="handleCancel"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      <!-- Dialog Header & Icon -->
      <div class="p-6 pb-4 flex items-start gap-3.5">
        <div
          :class="{
            'bg-rose-50 text-rose-600 border border-rose-200': dialog.variant === 'danger',
            'bg-amber-50 text-amber-600 border border-amber-200': dialog.variant === 'warning',
            'bg-indigo-50 text-indigo-600 border border-indigo-200': dialog.variant === 'info'
          }"
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        >
          <AlertTriangle v-if="dialog.variant === 'danger' || dialog.variant === 'warning'" class="w-5 h-5 stroke-[2.2]" />
          <HelpCircle v-else class="w-5 h-5 stroke-[2.2]" />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-base font-extrabold text-slate-900 tracking-tight">
            {{ dialog.title }}
          </h3>
          <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
            {{ dialog.message }}
          </p>

          <!-- Input for prompt mode -->
          <div v-if="dialog.isPrompt" class="mt-3.5">
            <input
              ref="promptInputRef"
              v-model="dialog.inputValue"
              type="text"
              :placeholder="dialog.inputPlaceholder || 'Ketik di sini...'"
              @keydown.enter.prevent="handleConfirm"
              class="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 bg-slate-50/50 hover:bg-white text-slate-900 transition shadow-inner"
            />
          </div>
        </div>

        <button
          @click="handleCancel"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
          title="Tutup dialog"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Action Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 border border-slate-200/80 bg-white transition cursor-pointer"
        >
          {{ dialog.cancelText || 'Batal' }}
        </button>

        <button
          type="button"
          @click="handleConfirm"
          :class="{
            'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20': dialog.variant === 'danger',
            'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20': dialog.variant === 'warning',
            'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20': dialog.variant === 'info'
          }"
          class="px-4.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          ref="confirmBtnRef"
        >
          {{ dialog.confirmText || (dialog.isPrompt ? 'Simpan' : 'Lanjutkan') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { AlertTriangle, HelpCircle, X } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const dialog = computed(() => legalStore.state.confirmDialog);
const confirmBtnRef = ref(null);
const promptInputRef = ref(null);

watch(
  () => dialog.value.show,
  (val) => {
    if (val) {
      nextTick(() => {
        if (dialog.value.isPrompt && promptInputRef.value) {
          promptInputRef.value.focus();
          promptInputRef.value.select();
        } else {
          confirmBtnRef.value?.focus();
        }
      });
    }
  }
);

function handleConfirm() {
  legalStore.resolveConfirm(true);
}

function handleCancel() {
  legalStore.resolveConfirm(false);
}
</script>
