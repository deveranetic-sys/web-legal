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

    <!-- MODAL: Tambah Permohonan Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0]">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-indigo-400" />
            <h3 class="font-extrabold text-white text-base">Pengajuan Permohonan Legal Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewRequest" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Perihal / Judul Permohonan *</label>
            <input
              v-model="newForm.subject"
              type="text"
              required
              placeholder="Contoh: Telaah Draf Perjanjian Jual Beli Batubara dengan PT Indo Mining"
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Jenis Layanan Legal</label>
              <select
                v-model="newForm.requestType"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] outline-none"
              >
                <option value="Contract Review">Contract Review (Telaah)</option>
                <option value="Drafting">Drafting (Pembuatan Naskah)</option>
                <option value="Legal Opinion">Legal Opinion (Pendapat Hukum)</option>
                <option value="Litigation Support">Dukungan Litigasi / Somasi</option>
                <option value="Licensing Assistance">Konsultasi Izin OSS/IUP</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tingkat Urgensi</label>
              <select
                v-model="newForm.urgency"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] outline-none"
              >
                <option value="HIGH">Tinggi (High) - ≤ 2 Hari Kerja</option>
                <option value="MEDIUM">Sedang (Medium) - ≤ 5 Hari Kerja</option>
                <option value="LOW">Rendah (Low) - Reguler</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan</label>
              <select
                v-model="newForm.company"
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] outline-none"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
                <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Target Tenggat Waktu *</label>
              <input
                v-model="newForm.deadline"
                type="date"
                required
                class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[#0F172A]"
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
              class="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[#0F172A] resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 rounded-lg text-[#475569] hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Kirim Permohonan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Detail Tiket Permohonan & Riwayat Persetujuan -->
    <div
      v-if="selectedRequest"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="selectedRequest = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between shrink-0">
          <div>
            <span class="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-2 py-0.5 rounded">
              {{ selectedRequest.ticketNumber || selectedRequest.id }}
            </span>
            <h3 class="font-extrabold text-white text-base mt-1">{{ selectedRequest.subject }}</h3>
          </div>
          <button @click="selectedRequest = null" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <div class="p-6 space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
          
          <!-- Stepper Workflow Persetujuan -->
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Alur Persetujuan Permohonan:
            </span>
            <div class="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div class="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                1. Pengajuan ✓
              </div>
              <div
                :class="selectedRequest.status !== 'SUBMITTED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-300'"
                class="p-2 rounded-lg border"
              >
                2. Telaah Legal
              </div>
              <div
                :class="selectedRequest.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : (selectedRequest.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border-rose-300' : (selectedRequest.status === 'REVISION_REQUIRED' ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-slate-100 text-slate-500 border-slate-200'))"
                class="p-2 rounded-lg border"
              >
                3. Otorisasi Approval
              </div>
              <div
                :class="selectedRequest.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'"
                class="p-2 rounded-lg border"
              >
                4. Selesai
              </div>
            </div>
          </div>

          <!-- Rincian Data Tiket -->
          <div class="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
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
              <span :class="getStatusClass(selectedRequest.status)" class="px-2.5 py-0.5 rounded-full text-xs font-bold inline-block border mt-0.5">
                {{ getStatusLabel(selectedRequest.status) }}
              </span>
            </div>
          </div>

          <!-- Deskripsi Kebutuhan -->
          <div>
            <span class="font-bold text-[#0F172A] block mb-1">Rincian Deskripsi Permohonan:</span>
            <p class="text-[#0F172A] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl whitespace-pre-line">
              {{ selectedRequest.description }}
            </p>
          </div>

          <!-- Riwayat Approval Notes (Jika Ada) -->
          <div v-if="selectedRequest.approvalNotes || selectedRequest.rejectionReason || selectedRequest.revisionNotes" class="space-y-2">
            <span class="font-bold text-[#0F172A] block">Catatan Keputusan Persetujuan:</span>
            
            <div v-if="selectedRequest.status === 'APPROVED'" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div class="flex items-center justify-between font-bold text-xs">
                <span>✓ Disetujui oleh: {{ selectedRequest.approvedBy || 'Head of Legal' }}</span>
                <span class="text-[11px] text-emerald-700 font-normal">{{ selectedRequest.approvedAt }}</span>
              </div>
              <p class="text-xs text-emerald-800 italic">"{{ selectedRequest.approvalNotes || 'Permohonan disetujui tanpa syarat tambahan.' }}"</p>
            </div>

            <div v-if="selectedRequest.status === 'REJECTED'" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div class="flex items-center justify-between font-bold text-xs">
                <span>✕ Ditolak oleh: {{ selectedRequest.rejectedBy || 'Head of Legal' }}</span>
                <span class="text-[11px] text-rose-700 font-normal">{{ selectedRequest.rejectedAt }}</span>
              </div>
              <p class="text-xs text-rose-800 italic">"{{ selectedRequest.rejectionReason }}"</p>
            </div>

            <div v-if="selectedRequest.status === 'REVISION_REQUIRED'" class="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 space-y-1">
              <div class="flex items-center justify-between font-bold text-xs">
                <span>⚠ Catatan Revisi dari: {{ selectedRequest.revisionRequestedBy || 'Legal Counsel' }}</span>
                <span class="text-[11px] text-orange-700 font-normal">{{ selectedRequest.revisionRequestedAt }}</span>
              </div>
              <p class="text-xs text-orange-800 italic">"{{ selectedRequest.revisionNotes }}"</p>
            </div>
          </div>

          <!-- Action Workflow Controls -->
          <div v-if="canApprove || canManage" class="pt-3 border-t border-[#E2E8F0] space-y-2.5">
            <span class="font-bold text-[#0F172A] block">Tindakan Otorisasi & Persetujuan:</span>
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                v-if="canApprove"
                @click="openApprovalModal(selectedRequest); selectedRequest = null"
                class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <ShieldCheck class="w-4 h-4" />
                <span>Buka Approval</span>
              </button>

              <button
                v-if="canManage"
                @click="updateStatus(selectedRequest.id, 'IN_REVIEW')"
                class="px-3 py-1.5 rounded-xl bg-[#EEF2FF] text-[#4338CA] hover:bg-blue-100 font-bold text-xs cursor-pointer border border-[#C7D2FE] transition whitespace-nowrap"
              >
                Set Ditelaah
              </button>

              <button
                v-if="canManage"
                @click="updateStatus(selectedRequest.id, 'COMPLETED')"
                class="px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#166534] hover:bg-emerald-100 font-bold text-xs cursor-pointer border border-[#BBF7D0] transition whitespace-nowrap"
              >
                Set Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Approval & Persetujuan Permintaan Legal (Dedicated Approval Dialog) -->
    <div
      v-if="approvalTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="approvalTarget = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0]">
        
        <!-- Header -->
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-extrabold text-white text-base">Otorisasi Persetujuan Permintaan Legal</h3>
              <p class="text-[11px] text-slate-300">{{ approvalTarget.ticketNumber || approvalTarget.id }} • {{ approvalTarget.requestor }}</p>
            </div>
          </div>
          <button @click="approvalTarget = null" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <div class="p-6 space-y-4 text-xs sm:text-sm">
          
          <!-- Summary info -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div class="font-bold text-slate-900 text-xs">{{ approvalTarget.subject }}</div>
            <div class="text-[11px] text-slate-500">{{ approvalTarget.requestType }} • Unit: {{ approvalTarget.department }}</div>
          </div>

          <!-- Approval Mode Switcher Tabs -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-800 text-xs">Pilih Keputusan Persetujuan:</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="approvalMode = 'APPROVE'"
                :class="approvalMode === 'APPROVE' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
                class="py-2 px-2.5 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-1"
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>Setujui</span>
              </button>

              <button
                type="button"
                @click="approvalMode = 'REVISION'"
                :class="approvalMode === 'REVISION' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
                class="py-2 px-2.5 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-1"
              >
                <AlertCircle class="w-3.5 h-3.5" />
                <span>Minta Revisi</span>
              </button>

              <button
                type="button"
                @click="approvalMode = 'REJECT'"
                :class="approvalMode === 'REJECT' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
                class="py-2 px-2.5 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-1"
              >
                <XCircle class="w-3.5 h-3.5" />
                <span>Tolak</span>
              </button>
            </div>
          </div>

          <!-- Notes / Reason input -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-800 text-xs">
              <span v-if="approvalMode === 'APPROVE'">Catatan Persetujuan (Opsional):</span>
              <span v-else-if="approvalMode === 'REVISION'">Poin Catatan Revisi yang Wajib Diperbaiki <span class="text-rose-500">*</span>:</span>
              <span v-else>Alasan Yuridis Penolakan <span class="text-rose-500">*</span>:</span>
            </label>
            <textarea
              v-model="approvalNotes"
              rows="3"
              :placeholder="approvalMode === 'APPROVE' ? 'Tuliskan catatan arahan pelaksanaan atau persetujuan bersyarat...' : (approvalMode === 'REVISION' ? 'Jelaskan klausul atau dokumen pendukung yang wajib dilengkapi pemohon...' : 'Jelaskan dasar pertimbangan hukum mengapa permohonan ini tidak dapat disetujui...')"
              class="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-slate-900 resize-none"
            ></textarea>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              @click="approvalTarget = null"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>

            <button
              type="button"
              @click="submitApprovalDecision"
              :class="approvalMode === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : (approvalMode === 'REVISION' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-rose-600 hover:bg-rose-700')"
              class="px-5 py-2 rounded-xl text-white font-bold cursor-pointer shadow-md transition text-xs flex items-center gap-1.5"
            >
              <Check class="w-4 h-4 stroke-[2.5]" />
              <span>
                {{ approvalMode === 'APPROVE' ? 'Setujui Permohonan' : (approvalMode === 'REVISION' ? 'Minta Revisi' : 'Tolak Permohonan') }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Assign PIC Counsel -->
    <div
      v-if="assigningRequest"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="assigningRequest = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 border border-[#E2E8F0] space-y-4">
        <h3 class="font-bold text-[#0F172A] text-sm">Tugaskan PIC Legal Counsel</h3>
        <p class="text-xs text-[#475569]">Pilih personil legal internal yang bertanggung jawab menelaah berkas ini:</p>
        
        <select
          v-model="selectedCounsel"
          class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-[#0F172A] font-medium"
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
            class="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition shadow-xs"
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
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Inbox,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Check
} from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';

const searchQuery = ref('');
const filterStatus = ref('ALL');
const filterUrgency = ref('ALL');
const filterType = ref('ALL');

const isAddModalOpen = ref(false);
const selectedRequest = ref(null);
const assigningRequest = ref(null);
const selectedCounsel = ref('Dimas Prasetyo, S.H.');

const approvalTarget = ref(null);
const approvalMode = ref('APPROVE');
const approvalNotes = ref('');

const newForm = ref({
  subject: '',
  requestType: 'Contract Review',
  urgency: 'MEDIUM',
  company: 'PT Nusantara Energi',
  deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  description: ''
});

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
  approvalMode.value = 'APPROVE';
  approvalNotes.value = '';
}

function submitApprovalDecision() {
  if (!approvalTarget.value) return;
  const id = approvalTarget.value.id;

  if (approvalMode.value === 'APPROVE') {
    legalStore.approveRequest(id, approvalNotes.value);
  } else if (approvalMode.value === 'REVISION') {
    if (!approvalNotes.value.trim()) {
      legalStore.triggerToast('Catatan revisi wajib diisi agar pemohon mengetahui poin perbaikan.', 'error');
      return;
    }
    legalStore.requestRevision(id, approvalNotes.value);
  } else if (approvalMode.value === 'REJECT') {
    if (!approvalNotes.value.trim()) {
      legalStore.triggerToast('Alasan penolakan wajib diisi.', 'error');
      return;
    }
    legalStore.rejectRequest(id, approvalNotes.value);
  }

  approvalTarget.value = null;
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
