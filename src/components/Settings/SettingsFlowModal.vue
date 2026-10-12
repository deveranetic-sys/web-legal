<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#92400E]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Edit Konfigurasi Alur: {{ flowForm.title }}</h3>
            <p class="text-[10px] text-slate-500 mt-0.5">Ubah batas waktu SLA, kebijakan nilai (threshold), atau pemetaan peran.</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
        <form @submit.prevent="handleSaveFlow" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Target SLA / Batas Waktu (Hari)</label>
              <input
                v-model.number="flowForm.sla"
                type="number"
                min="1"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Ambang Batas Nilai / Threshold (Rp)</label>
              <input
                v-model="flowForm.threshold"
                type="text"
                placeholder="Misal: > 5 Milyar"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <p class="text-[10px] text-slate-500 mt-1">Hanya berlaku untuk tipe persetujuan bersyarat</p>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100">
            <h4 class="text-xs font-bold text-slate-900 mb-3">Pemetaan Peran (Role Routing Mapping)</h4>
            <div class="space-y-3">
              <!-- Level 1 (Maker) -->
              <div class="flex items-center gap-3">
                <span class="w-20 text-[10px] font-bold text-slate-400 shrink-0 uppercase">Level 1 (Pembuat)</span>
                <select
                  v-model="flowForm.makerRole"
                  class="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
                </select>
              </div>

              <!-- Level 2 (Checker) -->
              <div class="flex items-center gap-3">
                <span class="w-20 text-[10px] font-bold text-slate-400 shrink-0 uppercase">Level 2 (Pemeriksa)</span>
                <select
                  v-model="flowForm.checkerRole"
                  class="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
                </select>
              </div>

              <!-- Level 3 (Approver) -->
              <div class="flex items-center gap-3">
                <span class="w-20 text-[10px] font-bold text-slate-400 shrink-0 uppercase">Level 3 (Penandatangan)</span>
                <select
                  v-model="flowForm.approverRole"
                  class="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-[10px] text-amber-800 leading-relaxed">
              <strong>Peringatan Auditing:</strong> Perubahan konfigurasi alur persetujuan hanya akan berdampak pada pengajuan (request) baru setelah disimpan. Tiket yang sedang berjalan akan menggunakan alur versi sebelumnya.
            </p>
          </div>

          <div class="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check class="w-4 h-4" />
              Simpan & Terapkan Konfigurasi Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { X, Check } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialFlow: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const rolesMatrix = computed(() => legalStore.state.masterRoles || {});

const flowForm = ref({
  id: '',
  title: '',
  sla: '',
  threshold: '',
  makerRole: '',
  checkerRole: '',
  approverRole: ''
});

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.initialFlow) {
    flowForm.value = {
      id: props.initialFlow.id,
      title: props.initialFlow.name,
      sla: 3, // Dummy
      threshold: '> Rp 5 Milyar', // Dummy
      makerRole: props.initialFlow.steps[0]?.roleRequired || '',
      checkerRole: props.initialFlow.steps[1]?.roleRequired || '',
      approverRole: props.initialFlow.steps[2]?.roleRequired || ''
    };
  }
});

function handleSaveFlow() {
  legalStore.triggerToast(`Konfigurasi alur "${flowForm.value.title}" berhasil diperbarui.`, 'success');
  emit('close');
}
</script>
