<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-[2px] animate-in fade-in duration-150">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-[#CBD5E1]">
      
      <!-- Modal Header (Tactile Precision UI) -->
      <div class="p-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-[#F8FAFC]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE] shrink-0">
            <component :is="getFlowIcon(flowForm.icon || flowForm.module)" class="w-4.5 h-4.5 text-[#2563EB]" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-semibold text-[#0F172A]">
                Edit Konfigurasi Alur: {{ flowForm.name }}
              </h3>
              <span class="inline-flex items-center gap-1 text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-1.5 py-0.5 rounded">
                <Lock class="w-3 h-3" /> Terkunci ({{ flowForm.id || 'AF' }})
              </span>
            </div>
            <p class="text-[11px] text-[#64748B] mt-0.5">
              Penyesuaian parameter operasional: SLA per tahap, peran berwenang, ambang batas (threshold), dan catatan lingkup.
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body Form -->
      <div class="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
        <form @submit.prevent="handleSaveFlow" id="flow-form" class="space-y-4">
          
          <!-- General Flow Details -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1">
                Nama Alur Persetujuan <span class="text-[#B91C1C]">*</span>
              </label>
              <input
                v-model="flowForm.name"
                type="text"
                required
                placeholder="Misal: Alur Persetujuan Addendum & VO Proyek"
                class="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs sm:text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-medium"
              />
            </div>

            <!-- Icon Picker Presets (Lucide Icons, No Emoji) -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Pilih Ikon Standar Alur</label>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button
                  v-for="preset in iconPresets"
                  :key="preset.id"
                  type="button"
                  @click="flowForm.icon = preset.id"
                  :class="isIconSelected(preset.id, preset.emojiAlias)
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] ring-1 ring-[#2563EB] font-semibold'
                    : 'bg-white hover:bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1] font-medium'"
                  class="h-8 px-2.5 rounded-md border text-xs flex items-center gap-1.5 cursor-pointer transition shadow-none"
                >
                  <component :is="preset.icon" class="w-3.5 h-3.5 shrink-0" />
                  <span>{{ preset.label }}</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Module Selection (Locked) -->
              <div>
                <label class="block text-xs font-semibold text-[#0F172A] mb-1">Modul Terkait (Terkunci)</label>
                <div class="relative">
                  <select
                    v-model="flowForm.module"
                    disabled
                    class="w-full pl-3 pr-8 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded-md text-xs sm:text-[13px] text-[#64748B] font-medium appearance-none cursor-not-allowed opacity-90"
                  >
                    <option value="requests">Permintaan Legal (Requests)</option>
                    <option value="contracts">Manajemen Kontrak</option>
                    <option value="tenders">Tender &amp; Pengadaan</option>
                    <option value="opinions">Opini Hukum</option>
                    <option value="disputes">Dispute &amp; Litigasi</option>
                    <option value="general">Umum / Lainnya</option>
                  </select>
                  <Lock class="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <!-- SLA Global -->
              <div>
                <label class="block text-xs font-semibold text-[#0F172A] mb-1">Total Target SLA (Hari)</label>
                <input
                  v-model.number="flowForm.slaDays"
                  type="number"
                  min="1"
                  max="60"
                  class="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs sm:text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono-tabular"
                />
              </div>
            </div>

            <!-- Threshold & Status -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#0F172A] mb-1">Ambang Batas Nilai / Threshold (Rp)</label>
                <input
                  v-model.number="flowForm.threshold"
                  type="number"
                  step="1000000"
                  placeholder="0 jika tanpa ambang batas nilai"
                  class="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs sm:text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono-tabular"
                />
                <p class="text-[10px] text-[#64748B] mt-0.5 font-mono-tabular">0 = Berlaku untuk seluruh transaksi</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#0F172A] mb-1">Status Aktivasi Alur</label>
                <label class="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    v-model="flowForm.active"
                    type="checkbox"
                    class="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB] border-[#CBD5E1]"
                  />
                  <span class="text-xs font-medium text-[#0F172A]">
                    {{ flowForm.active ? 'Aktif (Dapat dipilih pada pengajuan baru)' : 'Nonaktif (Ditangguhkan)' }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1">Deskripsi &amp; Ruang Lingkup Alur</label>
              <textarea
                v-model="flowForm.description"
                rows="2"
                placeholder="Penjelasan kriteria penggunaan alur persetujuan ini..."
                class="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs sm:text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Dynamic Multi-Tier Steps Builder -->
          <div class="pt-3 border-t border-[#E2E8F0] space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                  Tahapan Rantai Persetujuan (Chain Approval Steps)
                </h4>
                <p class="text-[11px] text-[#64748B]">
                  Dokumen akan melewati tahapan ini secara berurutan dari Tahap 1 hingga tahap akhir.
                </p>
              </div>
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded-md">
                <Lock class="w-3 h-3 text-[#64748B]" />
                <span>Struktur 3-Tier SOP Terkunci</span>
              </span>
            </div>

            <!-- Step items -->
            <div class="space-y-2">
              <div
                v-for="(step, idx) in flowForm.steps"
                :key="idx"
                class="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition space-y-2"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded bg-[#2563EB] text-white text-[11px] font-bold font-mono-tabular flex items-center justify-center shrink-0">
                      {{ idx + 1 }}
                    </span>
                    <span class="text-xs font-semibold text-[#0F172A]">
                      {{ idx === 0 ? 'Tahap 1 (Maker / Penelaah Awal)' : (idx === flowForm.steps.length - 1 ? `Tahap ${idx + 1} (Final Approver)` : `Tahap ${idx + 1} (Checker / Verifikator)`) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      v-if="idx > 0"
                      type="button"
                      @click="moveStep(idx, -1)"
                      class="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 rounded transition cursor-pointer"
                      title="Geser ke Atas"
                    >
                      <ArrowUp class="w-3.5 h-3.5" />
                    </button>
                    <button
                      v-if="idx < flowForm.steps.length - 1"
                      type="button"
                      @click="moveStep(idx, 1)"
                      class="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 rounded transition cursor-pointer"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-0.5">
                  <!-- Step Name -->
                  <div class="sm:col-span-6">
                    <label class="block text-[10px] font-medium text-[#64748B] mb-0.5">Nama Tahap / Aktivitas</label>
                    <input
                      v-model="step.name"
                      type="text"
                      required
                      placeholder="Misal: Review Kepatuhan Klausul"
                      class="w-full px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <!-- Role Required -->
                  <div class="sm:col-span-4">
                    <label class="block text-[10px] font-medium text-[#64748B] mb-0.5">Peran Yang Berwenang (RBAC)</label>
                    <div class="relative">
                      <select
                        v-model="step.roleRequired"
                        class="w-full pl-2.5 pr-7 py-1 bg-white border border-[#CBD5E1] rounded text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer appearance-none"
                      >
                        <option v-for="rName in availableRoles" :key="rName" :value="rName">
                          {{ rName }}
                        </option>
                      </select>
                      <ChevronDown class="w-3 h-3 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <!-- Step SLA -->
                  <div class="sm:col-span-2">
                    <label class="block text-[10px] font-medium text-[#64748B] mb-0.5">SLA (Hari)</label>
                    <input
                      v-model.number="step.slaDays"
                      type="number"
                      min="1"
                      max="30"
                      class="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] text-center font-mono-tabular"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Auditing Warning -->
          <div class="bg-[#FEF3C7] border border-[#FDE68A] rounded-md p-2.5 flex items-start gap-2">
            <ShieldAlert class="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <p class="text-[11px] text-[#92400E] leading-relaxed">
              <strong>Peringatan Kebijakan:</strong> Konfigurasi hierarki approval ini akan otomatis mengikat seluruh pengajuan berikutnya. Peran yang ditentukan harus dimiliki oleh pegawai aktif di modul Manajemen Pengguna &amp; RBAC.
            </p>
          </div>
        </form>
      </div>

      <!-- Modal Footer Actions -->
      <div class="p-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2 shrink-0 bg-[#F8FAFC]">
        <button
          type="button"
          @click="$emit('close')"
          class="px-3 py-1.5 rounded-md text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          form="flow-form"
          class="px-4 py-1.5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
        >
          <Check class="w-3.5 h-3.5" />
          <span>Simpan Parameter Alur</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  Lock,
  X,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  ChevronDown,
  Scale,
  FileText,
  Target,
  MessageSquareQuote,
  Handshake,
  Gavel,
  ShieldCheck,
  ClipboardList,
  FileSpreadsheet,
  GitCommit,
  Workflow
} from 'lucide-vue-next';
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

// Presets using Lucide Vue Next SVG Icons (No Emojis)
const iconPresets = [
  { id: 'Scale', emojiAlias: '⚖️', label: 'Timbangan Legal', icon: Scale },
  { id: 'FileText', emojiAlias: '📝', label: 'Kontrak Bisnis', icon: FileText },
  { id: 'Target', emojiAlias: '🎯', label: 'Lelang / Tender', icon: Target },
  { id: 'MessageSquareQuote', emojiAlias: '🎓', label: 'Opini Hukum', icon: MessageSquareQuote },
  { id: 'Handshake', emojiAlias: '🤝', label: 'Perdamaian / Damai', icon: Handshake },
  { id: 'Gavel', emojiAlias: '🔨', label: 'Litigasi & PHI', icon: Gavel },
  { id: 'ShieldCheck', emojiAlias: '🛡️', label: 'Kepatuhan Regulasi', icon: ShieldCheck },
  { id: 'ClipboardList', emojiAlias: '📋', label: 'Permintaan Unit', icon: ClipboardList }
];

function isIconSelected(presetId, emojiAlias) {
  const current = flowForm.value.icon;
  return current === presetId || current === emojiAlias;
}

// Icon helper function returning Lucide components
function getFlowIcon(iconOrModule) {
  if (!iconOrModule) return Scale;
  
  if (iconOrModule === '⚖️') return Scale;
  if (iconOrModule === '📝') return FileText;
  if (iconOrModule === '🎯') return Target;
  if (iconOrModule === '📑') return FileText;
  if (iconOrModule === '🤝') return Handshake;
  if (iconOrModule === '🎓') return MessageSquareQuote;
  if (iconOrModule === '🛡️') return ShieldCheck;
  if (iconOrModule === '🔍') return Scale;

  const key = String(iconOrModule).toLowerCase();
  if (key === 'scale' || key === 'requests') return Scale;
  if (key === 'filetext' || key === 'contracts') return FileText;
  if (key === 'target' || key === 'tenders') return Target;
  if (key === 'messagesquarequote' || key === 'opinions') return MessageSquareQuote;
  if (key === 'handshake' || key === 'disputes') return Handshake;
  if (key === 'gavel') return Gavel;
  if (key === 'clipboardlist') return ClipboardList;
  if (key === 'shieldcheck') return ShieldCheck;
  if (key === 'filespreadsheet') return FileSpreadsheet;
  if (key === 'gitcommit') return GitCommit;

  return Workflow || Scale;
}

const isEditing = computed(() => !!(props.flow && props.flow.id));

const availableRoles = computed(() => {
  const matrix = Object.keys(props.rolesMatrix || {}).length ? props.rolesMatrix : (legalStore.state.rolesMatrix || {});
  const keys = Object.keys(matrix);
  if (!keys.length) {
    return ['SUPER ADMIN', 'KEPALA LEGAL', 'STAFF LEGAL', 'REQUESTOR', 'DIREKTUR (DASHBOARD)'];
  }
  return keys;
});

const flowForm = ref({
  id: '',
  name: '',
  icon: 'Scale',
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
        icon: props.flow.icon || 'Scale',
        module: props.flow.module || 'requests',
        category: props.flow.category || 'Permintaan Legal',
        description: props.flow.description || '',
        slaDays: props.flow.slaDays || 3,
        threshold: props.flow.threshold || 0,
        active: props.flow.active !== undefined ? props.flow.active : true,
        steps: Array.isArray(props.flow.steps) && props.flow.steps.length
          ? JSON.parse(JSON.stringify(props.flow.steps))
          : [
            { level: 1, name: 'Penyusunan Draf (Maker)', roleRequired: 'STAFF LEGAL', slaDays: 1 },
            { level: 2, name: 'Review Kepatuhan (Checker)', roleRequired: 'KEPALA LEGAL', slaDays: 1 },
            { level: 3, name: 'Pengesahan Akhir (Approver)', roleRequired: 'DIREKTUR (DASHBOARD)', slaDays: 1 }
          ]
      };
    } else {
      // Creating new flow
      flowForm.value = {
        id: '',
        name: '',
        icon: 'Scale',
        module: 'requests',
        category: 'Permintaan Legal',
        description: '',
        slaDays: 3,
        threshold: 0,
        active: true,
        steps: [
          { level: 1, name: 'Pemeriksaan Awal (Maker)', roleRequired: 'STAFF LEGAL', slaDays: 1 },
          { level: 2, name: 'Review Manajerial (Checker)', roleRequired: 'KEPALA LEGAL', slaDays: 1 },
          { level: 3, name: 'Persetujuan Final (Approver)', roleRequired: 'DIREKTUR (DASHBOARD)', slaDays: 1 }
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
  
  // Auto select standard icon based on module if default
  if (flowForm.value.module === 'contracts') flowForm.value.icon = 'FileText';
  else if (flowForm.value.module === 'tenders') flowForm.value.icon = 'Target';
  else if (flowForm.value.module === 'opinions') flowForm.value.icon = 'MessageSquareQuote';
  else if (flowForm.value.module === 'disputes') flowForm.value.icon = 'Handshake';
  else flowForm.value.icon = 'Scale';
}

function addStep() {
  const newLvl = flowForm.value.steps.length + 1;
  flowForm.value.steps.push({
    level: newLvl,
    name: `Pemeriksaan Tahap ${newLvl}`,
    roleRequired: newLvl === 1 ? 'STAFF LEGAL' : (newLvl === 2 ? 'KEPALA LEGAL' : 'DIREKTUR (DASHBOARD)'),
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
      icon: flowForm.value.icon || 'Scale',
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
      icon: flowForm.value.icon || 'Scale',
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