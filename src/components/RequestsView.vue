<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Sistem Layanan Internal
          </span>
          <span class="text-xs text-[#475569] font-medium">SLA Standar: 3-5 Hari Kerja</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Permintaan Legal (Legal Requests)
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Portal permohonan telaah kontrak, legal opinion, perizinan, dan konsultasi hukum dari seluruh unit bisnis perseroan.
        </p>
      </div>

      <!-- Action Button -->
      <div>
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4 text-[#6366F1]" />
          <span>Pengajuan Permohonan Baru</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-medium text-[#475569]">Total Tiket Masuk</span>
        <div class="text-2xl font-black text-[#0F172A] mt-1">{{ requests.length }}</div>
        <div class="text-[11px] text-[#475569] mt-0.5">Tahun Berjalan 2026</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-semibold text-[#0F172A]">Dalam Proses Telaah</span>
        <div class="text-2xl font-black text-[#0F172A] mt-1">{{ inReviewCount }}</div>
        <div class="text-[11px] text-[#6366F1] font-semibold mt-0.5">Sedang dikaji Counsel</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-semibold text-rose-600">Melewati Batas (Overdue)</span>
        <div class="text-2xl font-black text-rose-600 mt-1">{{ overdueCount }}</div>
        <div class="text-[11px] text-rose-600 font-semibold mt-0.5">Prioritas Penanganan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition">
        <span class="text-xs font-semibold text-emerald-600">Selesai (Completed)</span>
        <div class="text-2xl font-black text-emerald-700 mt-1">{{ completedCount }}</div>
        <div class="text-[11px] text-emerald-600 mt-0.5">Arsip Jawaban Terbit</div>
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
            class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Filter Status -->
        <div class="md:col-span-3">
          <select
            v-model="filterStatus"
            class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="SUBMITTED">Baru Diajukan (Submitted)</option>
            <option value="IN_REVIEW">Sedang Ditelaah (In Review)</option>
            <option value="COMPLETED">Selesai (Completed)</option>
            <option value="OVERDUE">Melewati Batas (Overdue)</option>
          </select>
        </div>

        <!-- Filter Urgensi -->
        <div class="md:col-span-2">
          <select
            v-model="filterUrgency"
            class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              <th scope="col" class="py-3 px-4 text-center">Status</th>
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
                <span class="font-mono text-xs font-bold text-[#4338CA] bg-blue-50 px-2 py-0.5 rounded">
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
                <div class="text-xs text-[#475569] mt-0.5">
                  <span class="font-semibold text-[#0F172A]">{{ req.requestType }}</span>
                  <span v-if="req.company" class="text-[#475569]"> • {{ req.company }}</span>
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
                  class="text-[10px] text-[#6366F1] hover:text-[#B8976C] hover:underline font-semibold cursor-pointer"
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

              <!-- Status -->
              <td class="py-3.5 px-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClass(req.status)"
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold"
                >
                  {{ getStatusLabel(req.status) }}
                </span>
              </td>

              <!-- Aksi -->
              <td class="py-3.5 px-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1.5">
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

    <!-- MODAL: Tambah Permohonan Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-150">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ClipboardList class="w-5 h-5 text-[#6366F1]" />
            <h3 class="font-extrabold text-white text-sm sm:text-base">Pengajuan Permohonan Legal Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewRequest" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Perihal Permohonan *</label>
            <input
              v-model="newForm.subject"
              required
              type="text"
              placeholder="Contoh: Review Draft Amandemen Perjanjian Jual Beli Listrik"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Jenis Layanan Legal</label>
              <select
                v-model="newForm.requestType"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A] outline-none"
              >
                <option value="Contract Review">Contract Review</option>
                <option value="Drafting">Drafting Kontrak</option>
                <option value="Legal Opinion">Legal Opinion</option>
                <option value="Litigation Support">Dukungan Litigasi</option>
                <option value="Licensing Assistance">Konsultasi Izin</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tingkat Urgensi</label>
              <select
                v-model="newForm.urgency"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A] outline-none"
              >
                <option value="HIGH">Tinggi (High) - &le; 2 Hari</option>
                <option value="MEDIUM">Sedang (Medium) - &le; 5 Hari</option>
                <option value="LOW">Rendah (Low) - Reguler</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan</label>
              <select
                v-model="newForm.company"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A] outline-none"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings</option>
                <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Target Tenggat Waktu</label>
              <input
                v-model="newForm.deadline"
                type="date"
                required
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Latar Belakang & Kebutuhan *</label>
            <textarea
              v-model="newForm.description"
              required
              rows="3"
              placeholder="Jelaskan pokok kebutuhan telaah klausul, risiko yang perlu diwaspadai, atau latar belakang transaksi..."
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 rounded-lg text-[#475569] hover:bg-slate-100 font-semibold cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold cursor-pointer shadow-sm transition"
            >
              Kirim Permohonan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Detail Tiket Permohonan -->
    <div
      v-if="selectedRequest"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="selectedRequest = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#E2E8F0]">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <span class="font-mono text-xs font-bold text-[#6366F1] bg-blue-50 border border-[#C7D2FE] px-2 py-0.5 rounded">
              {{ selectedRequest.ticketNumber || selectedRequest.id }}
            </span>
            <h3 class="font-extrabold text-white text-base mt-1">{{ selectedRequest.subject }}</h3>
          </div>
          <button @click="selectedRequest = null" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <div class="p-6 space-y-4 text-xs sm:text-sm">
          <div class="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <div>
              <span class="text-[11px] text-[#475569] block">Pemohon / Unit:</span>
              <span class="font-bold text-[#0F172A]">{{ selectedRequest.requestor }}</span>
              <span class="text-[#475569]"> ({{ selectedRequest.department }})</span>
            </div>
            <div>
              <span class="text-[11px] text-[#475569] block">PIC Legal Counsel:</span>
              <span class="font-bold text-[#0F172A]">{{ selectedRequest.assignedTo || 'Belum Ditugaskan' }}</span>
            </div>
            <div>
              <span class="text-[11px] text-[#475569] block">Tenggat Waktu:</span>
              <span class="font-bold text-[#0F172A]">{{ selectedRequest.deadline }}</span>
            </div>
            <div>
              <span class="text-[11px] text-[#475569] block">Status Terkini:</span>
              <span :class="getStatusClass(selectedRequest.status)" class="px-2 py-0.5 rounded-full text-xs font-bold">
                {{ getStatusLabel(selectedRequest.status) }}
              </span>
            </div>
          </div>

          <div>
            <span class="font-bold text-[#0F172A] block mb-1">Rincian Deskripsi:</span>
            <p class="text-[#0F172A] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
              {{ selectedRequest.description }}
            </p>
          </div>

          <!-- Counsel Workflow Controls -->
          <div v-if="canManage" class="pt-3 border-t border-[#E2E8F0] space-y-2">
            <span class="font-bold text-[#0F172A] block">Update Status Penyelesaian:</span>
            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="updateStatus(selectedRequest.id, 'IN_REVIEW')"
                class="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4338CA] hover:bg-blue-600/25 font-bold text-xs cursor-pointer border border-[#C7D2FE] transition"
              >
                Set: Sedang Ditelaah (In Review)
              </button>
              <button
                @click="updateStatus(selectedRequest.id, 'COMPLETED')"
                class="px-3 py-1.5 rounded-lg bg-[#DCFCE7] text-[#166534] hover:bg-emerald-100 font-bold text-xs cursor-pointer border border-[#BBF7D0] transition"
              >
                Set: Selesai & Terbitkan Opini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Assign PIC Counsel -->
    <div
      v-if="assigningRequest"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="assigningRequest = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 border border-[#E2E8F0] space-y-4">
        <h3 class="font-bold text-[#0F172A] text-sm">Tugaskan PIC Legal Counsel</h3>
        <p class="text-xs text-[#475569]">Pilih personil legal internal yang bertanggung jawab menelaah berkas ini:</p>
        
        <select
          v-model="selectedCounsel"
          class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
        >
          <option value="Budi Santoso, S.H., LL.M.">Budi Santoso, S.H., LL.M. (Head of Legal)</option>
          <option value="Siti Rahmawati, S.H., M.H.">Siti Rahmawati, S.H., M.H. (Legal Operations)</option>
          <option value="Dimas Prasetyo, S.H.">Dimas Prasetyo, S.H. (Senior Counsel)</option>
          <option value="Anisa Maharani, S.H.">Anisa Maharani, S.H. (Legal Specialist)</option>
        </select>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
          <button
            @click="assigningRequest = null"
            class="px-3 py-1.5 text-xs text-[#475569] hover:bg-slate-100 rounded-lg cursor-pointer transition"
          >
            Batal
          </button>
          <button
            @click="confirmAssign"
            class="px-4 py-1.5 text-xs font-bold text-[#6366F1] bg-[#1E293B] hover:bg-[#283A52] border border-[#C7D2FE] rounded-lg cursor-pointer transition shadow-xs"
          >
            Simpan Penugasan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus, Search, Eye, Trash2, Inbox, ClipboardList } from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';

const searchQuery = ref('');
const filterStatus = ref('ALL');
const filterUrgency = ref('ALL');
const filterType = ref('ALL');

const isAddModalOpen = ref(false);
const selectedRequest = ref(null);
const assigningRequest = ref(null);
const selectedCounsel = ref('Dimas Prasetyo, S.H.');

const newForm = ref({
  subject: '',
  requestType: 'Contract Review',
  urgency: 'MEDIUM',
  company: 'PT Nusantara Energi',
  deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  description: ''
});

const requests = computed(() => legalStore.state.requests);

const inReviewCount = computed(() => {
  return requests.value.filter(r => r.status === 'IN_REVIEW').length;
});

const overdueCount = computed(() => {
  return requests.value.filter(r => {
    if (r.status === 'OVERDUE') return true;
    const days = calculateDaysRemaining(r.deadline);
    return days < 0 && r.status !== 'COMPLETED' && r.status !== 'CLOSED';
  }).length;
});

const completedCount = computed(() => {
  return requests.value.filter(r => r.status === 'COMPLETED' || r.status === 'CLOSED').length;
});

const canManage = computed(() => {
  return legalStore.hasPermission('requests', 'edit');
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
        matchStatus = r.status === 'OVERDUE' || (calculateDaysRemaining(r.deadline) < 0 && r.status !== 'COMPLETED');
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
    case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
    case 'IN_REVIEW': return 'bg-[#FEF3C7] text-[#92400E]';
    case 'COMPLETED': return 'bg-[#DCFCE7] text-[#166534]';
    case 'OVERDUE': return 'bg-[#FFE4E6] text-[#9F1239]';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'SUBMITTED': return 'Submitted';
    case 'IN_REVIEW': return 'In Review';
    case 'COMPLETED': return 'Completed';
    case 'OVERDUE': return 'Overdue SLA';
    default: return status;
  }
}

function openDetail(req) {
  selectedRequest.value = req;
}

function openAssign(req) {
  assigningRequest.value = req;
  selectedCounsel.value = req.assignedTo && req.assignedTo !== 'Unassigned' ? req.assignedTo : 'Dimas Prasetyo, S.H.';
}

function confirmAssign() {
  if (assigningRequest.value) {
    legalStore.assignRequestPIC(assigningRequest.value.id, selectedCounsel.value);
    assigningRequest.value = null;
  }
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

function submitNewRequest() {
  legalStore.addRequest({
    subject: newForm.value.subject,
    requestType: newForm.value.requestType,
    urgency: newForm.value.urgency,
    company: newForm.value.company,
    deadline: newForm.value.deadline,
    description: newForm.value.description
  });

  newForm.value = {
    subject: '',
    requestType: 'Contract Review',
    urgency: 'MEDIUM',
    company: 'PT Nusantara Energi',
    deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    description: ''
  };
  isAddModalOpen.value = false;
}
</script>
