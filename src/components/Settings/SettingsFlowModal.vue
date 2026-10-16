<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
      
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-[#92400E] flex items-center justify-center font-bold text-lg border border-amber-200">
            <span>{{ flowForm.icon || '⚖️' }}</span>
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-900">
              {{ isEditing ? `Edit Konfigurasi Alur: ${flowForm.name}` : 'Tambah Alur Persetujuan Baru' }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Tentukan tahapan hierarki otorisasi, peran approver, target SLA, dan ambang batas nilai (threshold).
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body Form -->
      <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
        <form @submit.prevent="handleSaveFlow" id="flow-form" class="space-y-5">
          
          <!-- General Flow Details -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Nama Alur Persetujuan <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="flowForm.name"
                type="text"
                required
                placeholder="Misal: Alur Persetujuan Addendum & VO Proyek"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Icon Picker -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Ikon / Simbol</label>
                <div class="flex items-center gap-1.5">
                  <input
                    v-model="flowForm.icon"
                    type="text"
                    maxlength="4"
                    class="w-12 px-2 py-2 text-center bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                  <div class="flex items-center gap-1 flex-wrap">
                    <button
                      v-for="ico in emojiPresets"
                      :key="ico"
                      type="button"
                      @click="flowForm.icon = ico"
                      class="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-xs cursor-pointer border border-slate-100"
                    >
                      {{ ico }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Module Selection -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Modul Terkait</label>
                <select
                  v-model="flowForm.module"
                  @change="handleModuleChange"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium cursor-pointer"
                >
                  <option value="requests">Permintaan Legal (Requests)</option>
                  <option value="contracts">Manajemen Kontrak</option>
                  <option value="tenders">Tender & Pengadaan</option>
                  <option value="opinions">Opini Hukum</option>
                  <option value="disputes">Dispute & Litigasi</option>
                  <option value="general">Umum / Lainnya</option>
                </select>
              </div>

              <!-- SLA Global -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Total Target SLA (Hari)</label>
                <input
                  v-model.number="flowForm.slaDays"
                  type="number"
                  min="1"
                  max="60"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <!-- Threshold & Status -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Ambang Batas Nilai / Threshold (Rp)</label>
                <input
                  v-model.number="flowForm.threshold"
                  type="number"
                  step="1000000"
                  placeholder="0 jika tanpa ambang batas nilai"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <p class="text-[10px] text-slate-400 mt-0.5">Misal: 5000000000 untuk transaksi &gt; Rp 5 Miliar</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Status Aktivasi Alur</label>
                <label class="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    v-model="flowForm.active"
                    type="checkbox"
                    class="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 border-slate-300"
                  />
                  <span class="text-xs font-semibold text-slate-700">
                    {{ flowForm.active ? 'Aktif (Dapat dipilih pada pengajuan baru)' : 'Nonaktif (Arsip/Ditangguhkan)' }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Ruang Lingkup Alur</label>
              <textarea
                v-model="flowForm.description"
                rows="2"
                placeholder="Penjelasan kriteria penggunaan alur persetujuan ini..."
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Dynamic Multi-Tier Steps Builder -->
          <div class="pt-3 border-t border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Tahapan Rantai Persetujuan (Chain Approval Steps)
                </h4>
                <p class="text-[11px] text-slate-500">
                  Dokumen akan melewati tahapan ini secara berurutan dari Tahap 1 hingga tahap akhir.
                </p>
              </div>
              <button
                type="button"
                @click="addStep"
                class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#4338CA] text-xs font-bold transition cursor-pointer flex items-center gap-1 border border-indigo-200 shadow-2xs"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>Tambah Tahap</span>
              </button>
            </div>

            <!-- Step items -->
            <div class="space-y-2.5">
              <div
                v-for="(step, idx) in flowForm.steps"
                :key="idx"
                class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-[#4338CA] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                      {{ idx + 1 }}
                    </span>
                    <span class="text-xs font-bold text-slate-800">
                      {{ idx === 0 ? 'Tahap 1 (Maker / Penelaah Awal)' : (idx === flowForm.steps.length - 1 ? `Tahap ${idx + 1} (Final Approver)` : `Tahap ${idx + 1} (Checker / Verifikator)`) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      v-if="idx > 0"
                      type="button"
                      @click="moveStep(idx, -1)"
                      class="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-md transition cursor-pointer"
                      title="Geser ke Atas"
                    >
                      <ArrowUp class="w-3.5 h-3.5" />
                    </button>
                    <button
                      v-if="idx < flowForm.steps.length - 1"
                      type="button"
                      @click="moveStep(idx, 1)"
                      class="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-md transition cursor-pointer"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown class="w-3.5 h-3.5" />
                    </button>
                    <button
                      v-if="flowForm.steps.length > 1"
                      type="button"
                      @click="removeStep(idx)"
                      class="p-1 text-rose-500 hover:bg-rose-100 rounded-md transition cursor-pointer ml-1"
                      title="Hapus Tahap Ini"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
                  <!-- Step Name -->
                  <div class="sm:col-span-6">
                    <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Tahap / Aktivitas</label>
                    <input
                      v-model="step.name"
                      type="text"
                      required
                      placeholder="Misal: Review Kepatuhan Klausul"
                      class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                  </div>

                  <!-- Role Required -->
                  <div class="sm:col-span-4">
                    <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Peran Yang Berwenang (RBAC)</label>
                    <select
                      v-model="step.roleRequired"
                      class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#4338CA] focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                    >
                      <option v-for="rName in availableRoles" :key="rName" :value="rName">
                        {{ rName }}
                      </option>
                    </select>
                  </div>

                  <!-- Step SLA -->
                  <div class="sm:col-span-2">
                    <label class="block text-[10px] font-bold text-slate-500 mb-0.5">SLA (Hari)</label>
                    <input
                      v-model.number="step.slaDays"
                      type="number"
                      min="1"
                      max="30"
                      class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Auditing Warning -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-[11px] text-amber-800 leading-relaxed">
              <strong>Peringatan Kebijakan:</strong> Konfigurasi hierarki approval ini akan otomatis mengikat seluruh pengajuan berikutnya. Peran yang ditentukan harus dimiliki oleh pegawai aktif di modul Manajemen Pengguna &amp; RBAC.
            </p>
          </div>
        </form>
      </div>

      <!-- Modal Footer Actions -->
      <div class="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0 bg-slate-50/50">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          form="flow-form"
          class="px-5 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <Check class="w-4 h-4 stroke-[2.5]" />
          <span>{{ isEditing ? 'Simpan Perubahan Alur' : 'Buat Alur Persetujuan' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { X, Check, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  flow: {
    type: Object,
    default: null
  },
  rolesMatrix: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

const emojiPresets = ['⚖️', '📝', '🎯', '📑', '🤝', '🎓', '🛡️', '🔍'];

const isEditing = computed(() => !!(props.flow && props.flow.id));

const availableRoles = computed(() => {
  const matrix = Object.keys(props.rolesMatrix || {}).length ? props.rolesMatrix : (legalStore.state.rolesMatrix || {});
  const keys = Object.keys(matrix);
  if (!keys.length) {
    return ['ADMIN', 'LEGAL COUNSEL', 'LEGAL MANAGER', 'MANAGEMENT', 'LEGAL STAFF', 'REQUESTOR'];
  }
  return keys;
});

const flowForm = ref({
  id: '',
  name: '',
  icon: '⚖️',
  module: 'requests',
  category: 'Permintaan Legal',
  description: '',
  slaDays: 3,
  threshold: 0,
  active: true,
  steps: []
});

watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.flow) {
      // Editing existing flow
      flowForm.value = {
        id: props.flow.id,
        name: props.flow.name || props.flow.title || '',
        icon: props.flow.icon || '⚖️',
        module: props.flow.module || 'requests',
        category: props.flow.category || 'Permintaan Legal',
        description: props.flow.description || '',
        slaDays: props.flow.slaDays || 3,
        threshold: props.flow.threshold || 0,
        active: props.flow.active !== undefined ? props.flow.active : true,
        steps: Array.isArray(props.flow.steps) && props.flow.steps.length
          ? JSON.parse(JSON.stringify(props.flow.steps))
          : [
            { level: 1, name: 'Penyusunan Draf (Maker)', roleRequired: 'LEGAL COUNSEL', slaDays: 1 },
            { level: 2, name: 'Review Kepatuhan (Checker)', roleRequired: 'LEGAL MANAGER', slaDays: 1 },
            { level: 3, name: 'Pengesahan Akhir (Approver)', roleRequired: 'MANAGEMENT', slaDays: 1 }
          ]
      };
    } else {
      // Creating new flow
      flowForm.value = {
        id: '',
        name: '',
        icon: '⚖️',
        module: 'requests',
        category: 'Permintaan Legal',
        description: '',
        slaDays: 3,
        threshold: 0,
        active: true,
        steps: [
          { level: 1, name: 'Pemeriksaan Awal (Maker)', roleRequired: 'LEGAL COUNSEL', slaDays: 1 },
          { level: 2, name: 'Review Manajerial (Checker)', roleRequired: 'LEGAL MANAGER', slaDays: 1 },
          { level: 3, name: 'Persetujuan Final (Approver)', roleRequired: 'MANAGEMENT', slaDays: 1 }
        ]
      };
    }
  }
});

function handleModuleChange() {
  const map = {
    requests: 'Permintaan Legal',
    contracts: 'Manajemen Kontrak',
    tenders: 'Tender & Pengadaan',
    opinions: 'Opini Hukum',
    disputes: 'Dispute & Litigasi',
    general: 'Umum'
  };
  flowForm.value.category = map[flowForm.value.module] || 'Umum';
}

function addStep() {
  const newLvl = flowForm.value.steps.length + 1;
  flowForm.value.steps.push({
    level: newLvl,
    name: `Pemeriksaan Tahap ${newLvl}`,
    roleRequired: newLvl === 1 ? 'LEGAL COUNSEL' : (newLvl === 2 ? 'LEGAL MANAGER' : 'MANAGEMENT'),
    slaDays: 1
  });
  reindexSteps();
}

function removeStep(idx) {
  if (flowForm.value.steps.length <= 1) {
    legalStore.triggerToast('Minimal harus ada 1 tahap persetujuan.', 'warning');
    return;
  }
  flowForm.value.steps.splice(idx, 1);
  reindexSteps();
}

function moveStep(idx, direction) {
  const target = idx + direction;
  if (target < 0 || target >= flowForm.value.steps.length) return;
  const temp = flowForm.value.steps[idx];
  flowForm.value.steps[idx] = flowForm.value.steps[target];
  flowForm.value.steps[target] = temp;
  reindexSteps();
}

function reindexSteps() {
  flowForm.value.steps.forEach((s, i) => {
    s.level = i + 1;
  });
}

function handleSaveFlow() {
  if (!flowForm.value.name.trim()) {
    legalStore.triggerToast('Nama alur persetujuan wajib diisi.', 'error');
    return;
  }

  if (!flowForm.value.steps.length) {
    legalStore.triggerToast('Alur harus memiliki minimal 1 tahap persetujuan.', 'error');
    return;
  }

  reindexSteps();

  if (isEditing.value) {
    legalStore.updateApprovalFlow(flowForm.value.id, {
      name: flowForm.value.name.trim(),
      icon: flowForm.value.icon || '⚖️',
      module: flowForm.value.module,
      category: flowForm.value.category,
      description: flowForm.value.description,
      slaDays: Number(flowForm.value.slaDays) || 3,
      threshold: Number(flowForm.value.threshold) || 0,
      active: flowForm.value.active,
      steps: flowForm.value.steps
    });
  } else {
    legalStore.addApprovalFlow({
      name: flowForm.value.name.trim(),
      icon: flowForm.value.icon || '⚖️',
      module: flowForm.value.module,
      category: flowForm.value.category,
      description: flowForm.value.description,
      slaDays: Number(flowForm.value.slaDays) || 3,
      threshold: Number(flowForm.value.threshold) || 0,
      active: flowForm.value.active,
      steps: flowForm.value.steps
    });
  }

  emit('close');
}
</script>
