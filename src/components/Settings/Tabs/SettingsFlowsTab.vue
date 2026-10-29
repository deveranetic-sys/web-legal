<template>
  <div class="space-y-4">
    <!-- Info banner (Tactile Precision UI: border-first, shadow-none) -->
    <div class="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE]">
          <GitCommit class="w-4.5 h-4.5 text-[#2563EB]" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xs sm:text-sm font-semibold text-[#0F172A]">Konfigurasi Alur Persetujuan Bertingkat (Chain Approval Engine)</h3>
            <span class="erp-badge erp-badge-primary">
              Multi-Tier Routing
            </span>
          </div>
          <p class="text-[11px] text-[#64748B] mt-0.5 max-w-3xl leading-relaxed">
            SOP perseroan menetapkan dan mengunci 6 alur otorisasi berjenjang standar (AF-01 s/d AF-06): Tender Lelang, Permintaan Legal, Draf Kontrak Korporasi, Addendum VO, Settlement Sengketa, dan Opini Hukum.
          </p>
        </div>
      </div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-bold text-xs shrink-0 self-start md:self-center shadow-2xs">
        <Lock class="w-3.5 h-3.5 text-[#2563EB]" />
        <span>6 Alur Standar Terkunci</span>
      </div>
    </div>

    <!-- Filters & Search Bar (Tactile Control Bar) -->
    <div class="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-none flex flex-col sm:flex-row items-center justify-between gap-2.5">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari alur, modul, atau peran..."
          class="form-input form-input-search"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="filterModule"
          class="form-select sm:w-44"
        >
          <option value="ALL">Semua Modul</option>
          <option value="requests">Permintaan Legal</option>
          <option value="contracts">Manajemen Kontrak</option>
          <option value="tenders">Tender &amp; Pengadaan</option>
          <option value="opinions">Opini Hukum</option>
          <option value="disputes">Dispute &amp; Litigasi</option>
        </select>

        <select
          v-model="filterStatus"
          class="form-select sm:w-36"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Hanya Aktif</option>
          <option value="INACTIVE">Hanya Nonaktif</option>
        </select>
      </div>
    </div>

    <!-- Approval Flows Grid (Tactile Cards) -->
    <div v-if="filteredFlows.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <div
        v-for="flow in filteredFlows"
        :key="flow.id"
        class="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-none flex flex-col justify-between hover:border-[#CBD5E1] transition-colors"
      >
        <div class="space-y-3">
          <!-- Flow Card Header -->
          <div class="flex items-start justify-between gap-3 border-b border-[#F1F5F9] pb-3">
            <div class="flex items-start gap-3 min-w-0">
              <!-- Uniform SVG Lucide Icon Node (No Emoji) -->
              <div class="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <component :is="getFlowIcon(flow.icon || flow.module)" class="w-4.5 h-4.5 text-[#2563EB]" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="text-xs sm:text-sm font-semibold text-[#0F172A] truncate">{{ flow.name }}</h4>
                  <span class="erp-badge erp-badge-neutral text-[10px]">
                    {{ flow.category || flow.module || 'Umum' }}
                  </span>
                </div>
                <p class="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                  {{ flow.description }}
                </p>
                <!-- Metadata Badges -->
                <div class="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                  <span class="erp-badge erp-badge-neutral font-mono-tabular">
                    <Clock class="w-3 h-3 text-[#64748B]" />
                    SLA: {{ flow.slaDays || 3 }} Hari
                  </span>
                  <span v-if="flow.threshold && flow.threshold > 0" class="erp-badge erp-badge-warning font-mono-tabular">
                    Ambang Batas: &gt; {{ formatThreshold(flow.threshold) }}
                  </span>
                  <span v-else class="erp-badge erp-badge-neutral font-mono-tabular">
                    Tanpa Ambang Batas
                  </span>
                </div>
              </div>
            </div>

            <!-- Status Switch -->
            <div class="shrink-0 flex flex-col items-end gap-1">
              <span
                :class="flow.active ? 'erp-badge erp-badge-success' : 'erp-badge erp-badge-neutral'"
              >
                {{ flow.active ? 'AKTIF' : 'NONAKTIF' }}
              </span>
              <button
                @click="legalStore.toggleApprovalFlowStatus(flow.id)"
                class="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline cursor-pointer"
              >
                {{ flow.active ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
            </div>
          </div>

          <!-- Flow Stepper Visualization -->
          <div class="space-y-1.5">
            <div class="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
              <span>Rantai Persetujuan ({{ (flow.steps || []).length }} Tahap):</span>
              <span class="text-[#64748B] font-mono-tabular">Maker ➔ Checker ➔ Approver</span>
            </div>

            <div class="flex items-center flex-wrap gap-1.5 pt-0.5">
              <template v-for="(step, sIdx) in (flow.steps || [])" :key="step.level">
                <div class="flex items-center gap-1.5">
                  <div class="bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded-md flex flex-col min-w-[120px]">
                    <div class="flex items-center justify-between gap-1 text-[10px] text-[#64748B] font-mono-tabular">
                      <span>Tahap {{ step.level }}</span>
                      <span>{{ step.slaDays || 1 }}d SLA</span>
                    </div>
                    <span class="text-xs font-semibold text-[#0F172A] truncate mt-0.5" :title="step.name">{{ step.name }}</span>
                    <span class="text-[10px] font-bold font-mono-tabular text-[#2563EB] mt-0.5">{{ step.roleRequired }}</span>
                  </div>
                  <ChevronRight v-if="sIdx < (flow.steps || []).length - 1" class="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Flow Card Footer -->
        <div class="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
          <div class="text-[10px] text-[#64748B] font-mono-tabular">
            Terakhir diubah: <span class="font-medium text-[#0F172A]">{{ flow.lastUpdated || '2026-10-15' }}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center gap-1 text-[11px] text-[#64748B] font-medium bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-1 rounded-md">
              <Lock class="w-3 h-3 text-[#64748B]" />
              <span>Standar Inti Terkunci</span>
            </span>

            <button
              @click="$emit('open-edit-flow-modal', flow)"
              class="px-2.5 py-1 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold rounded-md transition cursor-pointer flex items-center gap-1"
            >
              <Edit3 class="w-3.5 h-3.5" />
              <span>Edit Parameter</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-[#E2E8F0] rounded-lg p-10 text-center space-y-2.5">
      <div class="w-10 h-10 rounded-md bg-[#F1F5F9] text-[#64748B] flex items-center justify-center mx-auto border border-[#E2E8F0]">
        <Search class="w-5 h-5" />
      </div>
      <h4 class="text-xs sm:text-sm font-semibold text-[#0F172A]">Tidak ada alur persetujuan yang cocok</h4>
      <p class="text-xs text-[#64748B] max-w-sm mx-auto">
        Silakan ubah kata kunci pencarian atau filter modul untuk menampilkan 6 alur persetujuan standar.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Lock,
  Search,
  Clock,
  Edit3,
  ChevronRight,
  ChevronDown,
  GitCommit,
  Scale,
  FileText,
  ClipboardList,
  Target,
  MessageSquareQuote,
  Handshake,
  Gavel,
  ShieldCheck,
  FileSpreadsheet,
  Workflow
} from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const emit = defineEmits(['open-edit-flow-modal']);

const searchQuery = ref('');
const filterModule = ref('ALL');
const filterStatus = ref('ALL');

const flows = computed(() => legalStore.state.approvalFlows || []);

const filteredFlows = computed(() => {
  return flows.value.filter(flow => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchQuery = !q ||
      (flow.name && flow.name.toLowerCase().includes(q)) ||
      (flow.description && flow.description.toLowerCase().includes(q)) ||
      (flow.category && flow.category.toLowerCase().includes(q)) ||
      (flow.steps && flow.steps.some(s => s.roleRequired && s.roleRequired.toLowerCase().includes(q)));

    let matchModule = true;
    if (filterModule.value !== 'ALL') {
      matchModule = flow.module === filterModule.value;
    }

    let matchStatus = true;
    if (filterStatus.value === 'ACTIVE') {
      matchStatus = !!flow.active;
    } else if (filterStatus.value === 'INACTIVE') {
      matchStatus = !flow.active;
    }

    return matchQuery && matchModule && matchStatus;
  });
});

// Helper to resolve icon from emoji, key, or module to clean Lucide SVG Icon
function getFlowIcon(iconOrModule) {
  if (!iconOrModule) return Scale;
  
  // Emoji mappings
  if (iconOrModule === '⚖️') return Scale;
  if (iconOrModule === '📝') return FileText;
  if (iconOrModule === '🎯') return Target;
  if (iconOrModule === '📑') return FileText;
  if (iconOrModule === '🤝') return Handshake;
  if (iconOrModule === '🎓') return MessageSquareQuote;
  if (iconOrModule === '🛡️') return ShieldCheck;
  if (iconOrModule === '🔍') return Search;

  // Key / Module mappings
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

function formatThreshold(val) {
  if (!val) return 'Rp 0';
  if (typeof val === 'string') return val;
  if (val >= 1000000000) {
    return `Rp ${(val / 1000000000).toLocaleString('id-ID')} Miliar`;
  }
  if (val >= 1000000) {
    return `Rp ${(val / 1000000).toLocaleString('id-ID')} Juta`;
  }
  return `Rp ${val.toLocaleString('id-ID')}`;
}
</script>