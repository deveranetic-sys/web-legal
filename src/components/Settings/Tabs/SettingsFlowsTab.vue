<template>
  <div class="space-y-4 animate-in fade-in duration-150">
    <!-- Compact Info Banner -->
    <div class="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-50 text-[#4338CA] border border-indigo-100 flex items-center justify-center shrink-0 font-bold">
          <GitCommit class="w-4 h-4 text-[#4338CA]" />
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="text-xs sm:text-sm font-extrabold text-[#0F172A]">
              Konfigurasi Alur Persetujuan Bertingkat (Chain Approval Engine)
            </h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#4338CA] border border-indigo-200">
              Multi-Tier Routing
            </span>
          </div>
          <p class="text-[11px] text-[#64748B] mt-0.5 leading-normal">
            SOP perseroan mengunci 6 alur otorisasi berjenjang standar (AF-01 s/d AF-06) dengan pembagian peran Maker, Checker, dan Approver.
          </p>
        </div>
      </div>

      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#4338CA] border border-indigo-200 font-bold text-xs shrink-0 self-start sm:self-center shadow-2xs">
        <Lock class="w-3.5 h-3.5 text-[#4338CA]" />
        <span>6 Alur Standar Terkunci</span>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari kode alur, nama, atau peran..."
          class="w-full pl-9 pr-3 py-2 text-xs border border-[#CBD5E1] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
        <select
          v-model="filterModule"
          class="form-select text-xs h-[38px] sm:w-48 border-[#CBD5E1] rounded-xl font-semibold text-[#0F172A]"
        >
          <option value="ALL">Semua Modul ({{ flows.length }})</option>
          <option value="requests">Permintaan Legal</option>
          <option value="contracts">Manajemen Kontrak</option>
          <option value="tenders">Tender &amp; Pengadaan</option>
          <option value="opinions">Opini Hukum</option>
          <option value="disputes">Dispute &amp; Litigasi</option>
        </select>

        <select
          v-model="filterStatus"
          class="form-select text-xs h-[38px] sm:w-36 border-[#CBD5E1] rounded-xl font-semibold text-[#0F172A]"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Hanya Aktif</option>
          <option value="INACTIVE">Hanya Nonaktif</option>
        </select>
      </div>
    </div>

    <!-- Approval Flows List: Stacked Downwards, Clean & Compact -->
    <div v-if="filteredFlows.length > 0" class="space-y-3">
      <div
        v-for="flow in filteredFlows"
        :key="flow.id"
        class="bg-white border border-[#E2E8F0] hover:border-[#818CF8] hover:shadow-sm rounded-xl p-4 transition-all flex flex-col gap-3 shadow-2xs overflow-hidden w-full"
      >
        <!-- Card Top Row: Identity, Badges & Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Flow Icon & Title Info -->
          <div class="flex items-start gap-3 min-w-0 flex-1">
            <div class="w-9 h-9 rounded-xl bg-indigo-50 text-[#4338CA] border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
              <component :is="getFlowIcon(flow.icon || flow.module)" class="w-4.5 h-4.5 text-[#4338CA]" />
            </div>

            <div class="min-w-0 flex-1">
              <!-- Badges Row -->
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {{ flow.id }}
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#4338CA] border border-indigo-100 shrink-0">
                  {{ flow.category || flow.module || 'Umum' }}
                </span>
                <span class="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock class="w-3 h-3 text-slate-400" />
                  SLA Total: {{ flow.slaDays || 3 }} Hari
                </span>
                <span
                  v-if="flow.threshold && flow.threshold > 0"
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
                >
                  Ambang Batas: &gt; {{ formatThreshold(flow.threshold) }}
                </span>
                <span
                  v-else
                  class="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full"
                >
                  Tanpa Ambang Batas
                </span>
              </div>

              <!-- Title & Brief Description -->
              <h4 class="text-sm font-extrabold text-[#0F172A] mt-1 leading-snug">
                {{ flow.name }}
              </h4>
              <p class="text-[11px] text-[#64748B] mt-0.5 line-clamp-1 leading-normal">
                {{ flow.description }}
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <!-- Status Toggle Button -->
            <button
              @click="legalStore.toggleApprovalFlowStatus(flow.id)"
              :class="flow.active ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'"
              class="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              :title="flow.active ? 'Klik untuk menonaktifkan alur ini' : 'Klik untuk mengaktifkan alur ini'"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="flow.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
              ></span>
              <span>{{ flow.active ? 'AKTIF' : 'NONAKTIF' }}</span>
            </button>

            <!-- Edit Parameter Button -->
            <button
              @click="$emit('open-edit-flow-modal', flow)"
              class="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#4338CA] border border-indigo-200 hover:border-indigo-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Sesuaikan SLA, peran otorisasi, dan ambang batas alur ini"
            >
              <Edit3 class="w-3.5 h-3.5 text-[#4338CA]" />
              <span>Edit Parameter</span>
            </button>
          </div>
        </div>

        <!-- Card Bottom Row: Linear Stepper Pipeline (Stacked Downward, 100% Contained) -->
        <div class="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 space-y-2">
          <!-- Stepper Header Label -->
          <div class="flex items-center justify-between text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">
            <span class="flex items-center gap-1.5">
              <span>Rantai Persetujuan</span>
              <span class="text-slate-400 font-normal">({{ (flow.steps || []).length }} Level Otorisasi):</span>
            </span>
            <span class="text-[#4338CA] font-bold font-mono lowercase tracking-normal">
              maker ➔ checker ➔ approver
            </span>
          </div>

          <!-- Steps Stacked Downward (Clean, Compact & Immune to Overflow) -->
          <div class="space-y-1.5">
            <div
              v-for="step in (flow.steps || [])"
              :key="step.level"
              class="bg-white border border-[#E2E8F0] hover:border-indigo-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 shadow-2xs transition"
            >
              <!-- Left: Step Level & Name -->
              <div class="flex items-center gap-2.5 min-w-0 flex-1">
                <div class="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-[#4338CA] font-black text-[10px] flex items-center justify-center shrink-0">
                  {{ step.level }}
                </div>
                <span class="text-xs font-bold text-[#0F172A] truncate" :title="step.name">
                  {{ step.name }}
                </span>
              </div>

              <!-- Right: Role Required & SLA -->
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[10px] font-extrabold text-[#4338CA] bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded font-mono uppercase">
                  {{ step.roleRequired }}
                </span>
                <span class="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-mono shrink-0">
                  {{ step.slaDays || 1 }}d SLA
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Meta (Subtle & Inline) -->
        <div class="flex items-center justify-between text-[10px] text-[#64748B] pt-0.5">
          <div class="flex items-center gap-2">
            <span>Terakhir diperbarui: <strong class="text-[#0F172A]">{{ flow.lastUpdated || '2026-10-15' }}</strong></span>
            <span>•</span>
            <span class="flex items-center gap-1 text-slate-500">
              <Lock class="w-3 h-3 text-slate-400" /> Standar SOP Inti Terkunci
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center space-y-2.5 shadow-2xs">
      <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
        <Search class="w-5 h-5" />
      </div>
      <h4 class="text-xs sm:text-sm font-bold text-[#0F172A]">Tidak ada alur persetujuan yang cocok</h4>
      <p class="text-xs text-[#64748B] max-w-sm mx-auto">
        Silakan ubah kata kunci pencarian atau sesuaikan filter modul untuk menampilkan 6 alur persetujuan standar.
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

defineEmits(['open-edit-flow-modal']);

const searchQuery = ref('');
const filterModule = ref('ALL');
const filterStatus = ref('ALL');

const flows = computed(() => legalStore.state.approvalFlows || []);

const filteredFlows = computed(() => {
  return flows.value.filter(flow => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchQuery = !q ||
      (flow.id && flow.id.toLowerCase().includes(q)) ||
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
