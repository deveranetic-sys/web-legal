<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Sistem Layanan & Persetujuan Legal
          </span>
          <span class="text-xs text-[#475569] font-medium">SLA Standar: 3-5 Hari Kerja</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Permintaan Legal (Legal Requests)
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Portal permohonan telaah kontrak, persetujuan legal (*approval workflow*), opini hukum, dan konsultasi dari seluruh unit bisnis.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 shrink-0 flex-nowrap">
        <button
          v-if="pendingApprovalCount > 0 && canApprove"
          @click="filterStatus = 'PENDING_APPROVAL'"
          class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer whitespace-nowrap"
        >
          <ShieldAlert class="w-4 h-4 text-amber-600" />
          <span>Perlu Approval</span>
        </button>

        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md focus:ring-3 focus:ring-[#C7D2FE] text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Permohonan Baru</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-medium text-[#475569]">Total Tiket Masuk</span>
        <div class="text-2xl font-black text-[#0F172A] mt-1">{{ requests.length }}</div>
        <div class="text-[11px] text-[#475569] mt-0.5">Tahun Berjalan 2026</div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-semibold text-amber-700 flex items-center gap-1">
          <ShieldAlert class="w-3.5 h-3.5 text-amber-600" /> Menunggu Approval
        </span>
        <div class="text-2xl font-black text-amber-800 mt-1">{{ pendingApprovalCount }}</div>
        <div class="text-[11px] text-amber-700 font-semibold mt-0.5">Otorisasi Legal / Atasan</div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-semibold text-[#0F172A]">Sedang Ditelaah (In Review)</span>
        <div class="text-2xl font-black text-[#0F172A] mt-1">{{ inReviewCount }}</div>
        <div class="text-[11px] text-[#6366F1] font-semibold mt-0.5">Kajian Legal Counsel</div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-semibold text-emerald-700 flex items-center gap-1">
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Disetujui / Selesai
        </span>
        <div class="text-2xl font-black text-emerald-800 mt-1">{{ approvedOrCompletedCount }}</div>
        <div class="text-[11px] text-emerald-700 mt-0.5">Persetujuan Terbit</div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Search Input -->
        <div class="md:col-span-5 relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari perihal, nomor tiket, atau nama pemohon..."
            class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Filter Status -->
        <div class="md:col-span-3">
          <select
            v-model="filterStatus"
            class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer font-medium text-slate-800"
          >
            <option value="ALL">Semua Status Permohonan</option>
            <option value="PENDING_APPROVAL">Menunggu Approval (Pending)</option>
            <option value="SUBMITTED">Baru Diajukan (Submitted)</option>
            <option value="IN_REVIEW">Sedang Ditelaah (In Review)</option>
            <option value="APPROVED">Disetujui (Approved)</option>
            <option value="REVISION_REQUIRED">Perlu Revisi / Klarifikasi</option>
            <option value="REJECTED">Ditolak (Rejected)</option>
            <option value="COMPLETED">Selesai (Completed)</option>
            <option value="OVERDUE">Melewati Batas SLA (Overdue)</option>
          </select>
        </div>

        <!-- Filter Urgensi -->
        <div class="md:col-span-2">
          <select
            v-model="filterUrgency"
            class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option value="ALL">Semua Urgensi</option>
            <option value="HIGH">Tinggi (High)</option>
            <option value="MEDIUM">Sedang (Medium)</option>
            <option value="LOW">Rendah (Low)</option>
          </select>
        </div>

        <!-- Filter Jenis Permintaan -->
        <div class="md:col-span-2">
          <select
            v-model="filterType"
            class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option value="ALL">Semua Jenis</option>
            <option value="Contract Review">Contract Review</option>
            <option value="Drafting">Drafting Kontrak</option>
            <option value="Legal Opinion">Legal Opinion</option>
            <option value="Litigation Support">Dukungan Litigasi</option>
            <option value="Licensing Assistance">Konsultasi Izin</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table of Requests -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              <th scope="col" class="py-3 px-4">No. Tiket</th>
              <th scope="col" class="py-3 px-4">Perihal & Jenis Permohonan</th>
              <th scope="col" class="py-3 px-4">Pemohon & Unit</th>
              <th scope="col" class="py-3 px-4 text-center">Urgensi</th>
              <th scope="col" class="py-3 px-4">PIC Counsel</th>
              <th scope="col" class="py-3 px-4">Tenggat Waktu</th>
              <th scope="col" class="py-3 px-4 text-center">Status Alur Persetujuan</th>
              <th scope="col" class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="req in filteredRequests"
              :key="req.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Tiket -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span class="font-mono text-xs font-bold text-[#4338CA] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {{ req.ticketNumber || req.id }}
                </span>
                <div class="text-[11px] text-slate-400 mt-1">{{ req.requestDate }}</div>
              </td>

              <!-- Perihal -->
              <td class="py-3.5 px-4 min-w-[220px]">
                <div
                  @click="openDetail(req)"
                  class="font-bold text-[#0F172A] hover:text-[#6366F1] cursor-pointer transition-colors"
                >
                  {{ req.subject }}
                </div>
                <div class="text-xs text-[#475569] mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span class="font-semibold text-[#0F172A]">{{ req.requestType }}</span>
                  <span v-if="req.company" class="text-[#475569]">• {{ req.company }}</span>
                  <span
                    v-if="req.approvedBy"
                    class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                  >
                    ✓ Disetujui: {{ req.approvedBy }}
                  </span>
                </div>
              </td>

              <!-- Pemohon -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-medium text-[#0F172A]">{{ req.requestor }}</div>
                <div class="text-[11px] text-[#475569]">{{ req.department }}</div>
              </td>

              <!-- Urgensi -->
              <td class="py-3.5 px-4 whitespace-nowrap text-center">
                <span
                  :class="getUrgencyClass(req.urgency)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                >
                  {{ req.urgency }}
                </span>
              </td>

              <!-- PIC Counsel -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-[#0F172A]">
                  {{ req.assignedTo || 'Belum Ditugaskan' }}
                </div>
                <button
                  v-if="canManage"
                  @click="openAssign(req)"
                  class="text-[10px] text-[#6366F1] hover:text-[#4338CA] hover:underline font-semibold cursor-pointer block mt-0.5"
                >
                  Tugaskan PIC
                </button>
              </td>

              <!-- Deadline -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="text-xs font-semibold" :class="isOverdue(req.deadline) ? 'text-rose-600' : 'text-[#0F172A]'">
                  {{ req.deadline }}
                </div>
                <div class="text-[10px]" :class="isOverdue(req.deadline) ? 'text-rose-500 font-bold' : 'text-[#475569]'">
                  {{ getDeadlineBadge(req.deadline) }}
                </div>
              </td>

              <!-- Status & Approval Badge -->
              <td class="py-3.5 px-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClass(req.status)"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border"
                >
                  <component :is="getStatusIcon(req.status)" class="w-3 h-3" />
                  <span>{{ getStatusLabel(req.status) }}</span>
                </span>
              </td>

              <!-- Aksi -->
              <td class="py-3.5 px-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Quick Approval Button for Approvers -->
                  <button
                    v-if="canApprove && (req.status === 'SUBMITTED' || req.status === 'IN_REVIEW' || req.status === 'PENDING_APPROVAL' || req.status === 'REVISION_REQUIRED')"
                    @click="openApprovalModal(req)"
                    class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    title="Buka Panel Persetujuan Legal"
                  >
                    <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                    <span>Approval</span>
                  </button>

                  <button
                    @click="openDetail(req)"
                    class="p-1.5 rounded-lg text-[#475569] hover:text-[#6366F1] hover:bg-blue-50 transition cursor-pointer"
                    title="Lihat Detail Tiket"
                  >
                    <Eye class="w-4 h-4" />
                  </button>

                  <button
                    v-if="canManage"
                    @click="deleteItem(req)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus Tiket"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredRequests.length === 0">
              <td colspan="8" class="py-12 text-center text-slate-400">
                <Inbox class="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p class="text-sm font-semibold text-slate-700">Tidak ada tiket permohonan yang sesuai filter</p>
                <p class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau setel ulang filter.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODALS (Extracted) -->
    <AddRequestModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
    />

    <RequestDetailModal
      :request="selectedRequest"
      :can-approve="canApprove"
      :can-manage="canManage"
      @close="selectedRequest = null"
      @open-approval="openApprovalModal"
      @update-status="updateStatus"
    />

    <RequestApprovalModal
      :approval-target="approvalTarget"
      @close="approvalTarget = null"
    />

    <RequestAssignCounselModal
      :request="assigningRequest"
      @close="assigningRequest = null"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Inbox,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock
} from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';

// Extracted Modals
import AddRequestModal from './Requests/Modals/AddRequestModal.vue';
import RequestDetailModal from './Requests/Modals/RequestDetailModal.vue';
import RequestApprovalModal from './Requests/Modals/RequestApprovalModal.vue';
import RequestAssignCounselModal from './Requests/Modals/RequestAssignCounselModal.vue';

// Filters & State
const searchQuery = ref('');
const filterStatus = ref('ALL');
const filterUrgency = ref('ALL');
const filterType = ref('ALL');

const isAddModalOpen = ref(false);
const selectedRequest = ref(null);
const assigningRequest = ref(null);
const approvalTarget = ref(null);

// Computed Datasets
const requests = computed(() => legalStore.state.requests || []);

const inReviewCount = computed(() => {
  return requests.value.filter(r => r.status === 'IN_REVIEW').length;
});

const pendingApprovalCount = computed(() => {
  return requests.value.filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'SUBMITTED').length;
});

const approvedOrCompletedCount = computed(() => {
  return requests.value.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length;
});

const canManage = computed(() => {
  return legalStore.hasPermission('requests', 'edit');
});

const canApprove = computed(() => {
  const role = legalStore.state.currentUser?.role;
  return ['ADMIN', 'MANAGEMENT', 'LEGAL MANAGER', 'LEGAL COUNSEL'].includes(role) || canManage.value;
});

const filteredRequests = computed(() => {
  return requests.value.filter(r => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q ||
      r.subject.toLowerCase().includes(q) ||
      (r.ticketNumber && r.ticketNumber.toLowerCase().includes(q)) ||
      r.requestor.toLowerCase().includes(q);

    let matchStatus = true;
    if (filterStatus.value !== 'ALL') {
      if (filterStatus.value === 'OVERDUE') {
        matchStatus = r.status === 'OVERDUE' || (calculateDaysRemaining(r.deadline) < 0 && r.status !== 'COMPLETED' && r.status !== 'APPROVED');
      } else {
        matchStatus = r.status === filterStatus.value;
      }
    }

    const matchUrgency = filterUrgency.value === 'ALL' || r.urgency === filterUrgency.value;
    const matchType = filterType.value === 'ALL' || r.requestType === filterType.value;

    return matchSearch && matchStatus && matchUrgency && matchType;
  });
});

function isOverdue(deadline) {
  const days = calculateDaysRemaining(deadline);
  return days < 0;
}

function getDeadlineBadge(deadline) {
  const days = calculateDaysRemaining(deadline);
  if (days < 0) return `Terlambat ${Math.abs(days)} hari`;
  if (days === 0) return 'Hari ini (Tenggat Akhir)';
  return `Sisa ${days} hari kerja`;
}

function getUrgencyClass(urgency) {
  switch (urgency) {
    case 'HIGH': return 'bg-[#FFE4E6] text-[#9F1239]';
    case 'MEDIUM': return 'bg-[#FEF3C7] text-[#92400E]';
    case 'LOW': return 'bg-slate-100 text-slate-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'APPROVED': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse';
    case 'REVISION_REQUIRED': return 'bg-orange-50 text-orange-800 border-orange-200';
    case 'REJECTED': return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'SUBMITTED': return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'IN_REVIEW': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'COMPLETED': return 'bg-teal-50 text-teal-800 border-teal-200';
    case 'OVERDUE': return 'bg-rose-50 text-rose-800 border-rose-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'APPROVED': return 'Disetujui';
    case 'PENDING_APPROVAL': return 'Menunggu Approval';
    case 'REVISION_REQUIRED': return 'Perlu Revisi';
    case 'REJECTED': return 'Ditolak';
    case 'SUBMITTED': return 'Baru Diajukan';
    case 'IN_REVIEW': return 'Sedang Ditelaah';
    case 'COMPLETED': return 'Selesai';
    case 'OVERDUE': return 'Overdue SLA';
    default: return status;
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'APPROVED': return CheckCircle2;
    case 'PENDING_APPROVAL': return ShieldAlert;
    case 'REVISION_REQUIRED': return AlertCircle;
    case 'REJECTED': return XCircle;
    case 'SUBMITTED': return Clock;
    case 'IN_REVIEW': return ShieldCheck;
    case 'COMPLETED': return CheckCircle2;
    default: return Clock;
  }
}

function openDetail(req) {
  selectedRequest.value = req;
}

function openApprovalModal(req) {
  approvalTarget.value = req;
}

function openAssign(req) {
  assigningRequest.value = req;
}

function updateStatus(id, newStatus) {
  legalStore.updateRequestStatus(id, newStatus);
  if (selectedRequest.value && selectedRequest.value.id === id) {
    selectedRequest.value.status = newStatus;
  }
}

function deleteItem(req) {
  if (confirm(`Hapus tiket permohonan "${req.subject}"?`)) {
    legalStore.deleteRequest(req.id);
  }
}
</script>
