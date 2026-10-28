<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
            Kajian Yuridis Formal
          </span>
          <span class="text-xs text-[#64748B] font-medium">Dokumen Opini Resmi Korporasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Legal Opinion (Pendapat Hukum)
        </h1>
        <p class="text-xs sm:text-sm text-[#475569] mt-1">
          Kajian yuridis tertulis atas isu hukum krusial perseroan, analisis kepatuhan peraturan perundang-undangan, dan rekomendasi mitigasi risiko.
        </p>
      </div>

      <div class="flex items-center gap-2.5 shrink-0 flex-nowrap">
        <button
          @click="isAddModalOpen = true"
          class="px-4 h-[38px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Susun Opini Baru</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-medium text-[#64748B]">Total Dokumen Opini</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ totalCount }}</span>
          <span class="text-xs text-[#64748B]">Naskah</span>
        </div>
        <div class="text-[11px] text-[#2563EB] font-semibold mt-1">
          Register Formal Perseroan
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-medium text-emerald-700">Disahkan (Approved)</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-emerald-700">{{ approvedCount }}</span>
          <span class="text-xs text-emerald-600">Final</span>
        </div>
        <div class="text-[11px] text-emerald-600 font-semibold mt-1">
          Kekuatan Hukum Mengikat
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-medium text-amber-700">Menunggu Persetujuan</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-amber-700">{{ pendingCount }}</span>
          <span class="text-xs text-amber-600">Review</span>
        </div>
        <div class="text-[11px] text-amber-600 font-semibold mt-1">
          Dalam Telaah Head of Legal
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-medium text-rose-700">Perlu Revisi</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-rose-700">{{ revisionCount }}</span>
          <span class="text-xs text-rose-600">Catatan</span>
        </div>
        <div class="text-[11px] text-rose-600 font-semibold mt-1">
          Memerlukan Pendalaman Analisis
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative w-full sm:flex-1 sm:max-w-md">
        <Search class="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nomor ref, perihal kajian, pemohon, atau entitas..."
          class="form-input form-input-search text-xs h-[38px]"
        />
      </div>

      <!-- Status Filter Dropdown -->
      <div class="w-full sm:w-auto shrink-0 flex items-center gap-2">
        <span class="text-xs text-[#64748B] font-medium whitespace-nowrap hidden sm:inline">Status:</span>
        <select
          v-model="statusFilter"
          class="form-select text-xs font-semibold h-[38px] w-full sm:w-48"
        >
          <option value="ALL">Semua Status ({{ totalCount }})</option>
          <option value="APPROVED">Disetujui ({{ approvedCount }})</option>
          <option value="PENDING_APPROVAL">Menunggu ({{ pendingCount }})</option>
          <option value="REVISION">Perlu Revisi ({{ revisionCount }})</option>
        </select>
      </div>
    </div>

    <!-- TABLE LIST: Legal Opinion Registry -->
    <div class="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs uppercase text-[#64748B] font-bold">
            <tr>
              <th class="py-3 px-4 min-w-[130px]">No. Ref & Tanggal</th>
              <th class="py-3 px-4 min-w-[260px]">Perihal / Isu Kajian Hukum</th>
              <th class="py-3 px-4 min-w-[180px]">Pemohon & Entitas</th>
              <th class="py-3 px-4 min-w-[150px]">Penyusun (Counsel)</th>
              <th class="py-3 px-4 text-center min-w-[130px]">Status</th>
              <th class="py-3 px-4 text-right min-w-[120px]">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F1F5F9]">
            <tr
              v-for="op in filteredOpinions"
              :key="op.id"
              @click="openDetailOpinion(op)"
              class="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
            >
              <!-- 1. Ref & Date -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-mono font-bold text-xs text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  {{ op.id }}
                </div>
                <div class="text-[11px] text-[#64748B] mt-0.5">
                  {{ op.requestDate || op.date || '-' }}
                </div>
              </td>

              <!-- 2. Issue / Title -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-[#0F172A] text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                  {{ op.issue || op.title }}
                </div>
                <p class="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                  {{ op.question || op.background || '-' }}
                </p>
              </td>

              <!-- 3. Requestor & Entity -->
              <td class="py-3.5 px-4">
                <div class="font-semibold text-xs text-[#0F172A]">
                  {{ op.requestor || '-' }}
                </div>
                <div class="text-[11px] text-[#64748B] truncate max-w-[200px]" :title="op.company">
                  {{ op.company || op.department || 'PT Nusantara Energi' }}
                </div>
              </td>

              <!-- 4. Counsel & Reviewer -->
              <td class="py-3.5 px-4">
                <div class="font-semibold text-xs text-[#0F172A]">
                  {{ op.pic || op.author || 'Tim Legal' }}
                </div>
                <div class="text-[11px] text-[#64748B] truncate max-w-[180px]" :title="op.reviewer">
                  Rev: {{ op.reviewer || '-' }}
                </div>
              </td>

              <!-- 5. Status Badge -->
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <span
                  :class="getApprovalBadge(op.approval)"
                  class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-current/20 inline-block shadow-2xs"
                >
                  {{ op.approval }}
                </span>
              </td>

              <!-- 6. Actions (Symbol Only) -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5" @click.stop>
                  <!-- View Detail Symbol Button -->
                  <button
                    @click="openDetailOpinion(op)"
                    class="w-8 h-8 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] border border-transparent hover:border-[#BFDBFE] flex items-center justify-center transition cursor-pointer shadow-2xs"
                    title="Lihat Naskah Memorandum Lengkap"
                  >
                    <Eye class="w-4 h-4" />
                  </button>

                  <!-- Edit Symbol Button -->
                  <button
                    @click="openEditOpinion(op)"
                    class="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
                    title="Edit Naskah Opini"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete Symbol Button -->
                  <button
                    @click="confirmDeleteOpinion(op)"
                    class="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
                    title="Hapus Opini"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredOpinions.length === 0">
              <td colspan="6" class="py-12 text-center text-[#64748B]">
                <FileText class="w-10 h-10 mx-auto text-[#94A3B8] stroke-1 mb-2" />
                <p class="font-bold text-sm text-[#0F172A]">Tidak Ada Dokumen Opini Hukum</p>
                <p class="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                  {{ searchQuery ? 'Tidak ada hasil yang sesuai dengan filter pencarian.' : 'Belum ada memorandum legal opinion yang terdaftar di dalam sistem.' }}
                </p>
                <button
                  v-if="searchQuery || statusFilter !== 'ALL'"
                  @click="searchQuery = ''; statusFilter = 'ALL'"
                  class="mt-3 px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Reset Filter & Pencarian
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL DETAIL: FORMAL LEGAL OPINION MEMORANDUM DOCUMENT   -->
    <!-- (Terbuka saat baris atau tombol simbol mata diklik)      -->
    <!-- ======================================================== -->
    <div
      v-if="isDetailModalOpen && selectedOpinion"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      @click.self="isDetailModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#CBD5E1]">
        <!-- Top Toolbar Header -->
        <div class="px-6 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-[#2563EB] border border-[#BFDBFE]">
              {{ selectedOpinion.id }}
            </span>
            <span class="text-xs text-[#64748B] font-medium hidden sm:inline">
              Memorandum Naskah Resmi
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Print Action -->
            <button
              @click="printOpinion"
              class="px-3 h-8 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F1F5F9] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Cetak Naskah Opini"
            >
              <Printer class="w-3.5 h-3.5 text-[#64748B]" />
              <span class="hidden sm:inline">Cetak</span>
            </button>

            <!-- Edit Symbol -->
            <button
              @click="openEditFromDetail(selectedOpinion)"
              class="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Edit Naskah Opini"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>

            <!-- Delete Symbol -->
            <button
              @click="confirmDeleteOpinion(selectedOpinion)"
              class="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Hapus Opini"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>

            <!-- Close Button -->
            <button
              @click="isDetailModalOpen = false"
              class="w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition cursor-pointer ml-1"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Scrollable Document Letterhead Body -->
        <div class="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-white">
          <!-- Letterhead Header Box -->
          <div class="border-b-2 border-[#0F172A] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="text-[11px] font-mono font-bold text-[#64748B] tracking-wider uppercase">
                MEMORANDUM PENDAPAT HUKUM (LEGAL OPINION)
              </div>
              <h2 class="text-sm sm:text-base font-bold text-[#0F172A] mt-0.5 leading-snug">
                {{ selectedOpinion.title || selectedOpinion.issue }}
              </h2>
              <div class="text-xs text-[#64748B] mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span>Ref: <strong class="text-[#0F172A]">{{ selectedOpinion.opinionNumber || selectedOpinion.id }}</strong></span>
                <span>•</span>
                <span>Tanggal: <strong class="text-[#0F172A]">{{ selectedOpinion.date || selectedOpinion.requestDate || '-' }}</strong></span>
                <span>•</span>
                <span>Entitas: <strong class="text-[#0F172A]">{{ selectedOpinion.company || legalStore.state.currentEntity }}</strong></span>
              </div>
            </div>

            <div class="shrink-0 self-start sm:self-center">
              <span
                :class="getApprovalBadge(selectedOpinion.approval)"
                class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border border-current/20 shadow-2xs inline-block"
              >
                {{ selectedOpinion.approval }}
              </span>
            </div>
          </div>

          <!-- Section I: Pokok Permasalahan -->
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              <span>I. Pokok Permasalahan Yuridis</span>
            </h4>
            <p class="text-xs sm:text-sm text-[#0F172A] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              {{ selectedOpinion.question || selectedOpinion.background || '-' }}
            </p>
          </div>

          <!-- Section II: Analisis Hukum -->
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              <span>II. Analisis & Dasar Hukum Positif</span>
            </h4>
            <div class="text-xs sm:text-sm text-[#334155] leading-relaxed space-y-2 whitespace-pre-line bg-white p-4 rounded-xl border border-[#E2E8F0]">
              <div v-if="selectedOpinion.legalBasis" class="text-xs font-semibold text-[#0F172A] mb-2 pb-2 border-b border-[#F1F5F9]">
                Dasar Hukum: <span class="font-normal text-[#475569]">{{ selectedOpinion.legalBasis }}</span>
              </div>
              {{ selectedOpinion.analysis || selectedOpinion.legalAnalysis || '-' }}
            </div>
          </div>

          <!-- Section III: Kesimpulan & Rekomendasi -->
          <div class="p-4 rounded-xl bg-emerald-50/70 border border-[#BBF7D0] space-y-3">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>III. Kesimpulan Hukum & Rekomendasi Mitigasi</span>
            </h4>
            <div class="text-xs sm:text-sm text-[#0F172A] font-medium leading-relaxed">
              {{ selectedOpinion.conclusion || '-' }}
            </div>
            <div class="text-xs text-emerald-900 mt-2 p-3 rounded-lg bg-emerald-100/60 border border-emerald-200/80">
              <strong class="block mb-0.5">Rekomendasi Tindakan:</strong>
              <div class="whitespace-pre-line text-[#166534]">{{ selectedOpinion.recommendation || '-' }}</div>
            </div>
          </div>

          <!-- Approval Action Bar for Legal Manager / General Counsel -->
          <div class="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="text-xs text-[#64748B]">
              Penyusun: <strong class="text-[#0F172A]">{{ selectedOpinion.pic || selectedOpinion.author || '-' }}</strong>
              <span class="mx-1.5">•</span>
              Reviewer: <strong class="text-[#0F172A]">{{ selectedOpinion.reviewer || '-' }}</strong>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="selectedOpinion.approval !== 'APPROVED'"
                @click="approveOpinion"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>Setujui Opini (Approve)</span>
              </button>
              <span v-else class="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                <span>Telah Disahkan oleh Head of Legal</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: Susun Opini Hukum Baru                            -->
    <!-- ======================================================== -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-[#CBD5E1] max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 bg-white text-[#0F172A] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-[#2563EB]" />
            <h3 class="font-bold text-[#0F172A] text-base">Susun Legal Opinion Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewOpinion" class="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Judul / Perihal Kajian Opini *</label>
            <input
              v-model="newOpForm.title"
              type="text"
              required
              placeholder="Misal: Uji Yuridis Akuisisi PLTA Minihidro 10 MW"
              class="form-input"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Unit Pemohon / Requestor</label>
              <input
                v-model="newOpForm.requestor"
                type="text"
                placeholder="Direksi / Unit Bisnis"
                class="form-input"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan</label>
              <input
                v-model="newOpForm.company"
                type="text"
                placeholder="PT Nusantara Energi"
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">I. Pokok Permasalahan Yuridis *</label>
            <textarea
              v-model="newOpForm.background"
              required
              rows="3"
              placeholder="Uraikan latar belakang masalah dan pertanyaan hukum yang dimintakan pendapat..."
              class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">II. Analisis & Dasar Hukum Positif *</label>
            <textarea
              v-model="newOpForm.legalAnalysis"
              required
              rows="4"
              placeholder="Uraikan kajian peraturan perundang-undangan, klausul AD/ART, atau yurisprudensi..."
              class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs leading-relaxed"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">III. Kesimpulan Hukum *</label>
              <textarea
                v-model="newOpForm.conclusion"
                required
                rows="3"
                placeholder="Konklusi legal tim hukum..."
                class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs"
              ></textarea>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Rekomendasi Mitigasi *</label>
              <textarea
                v-model="newOpForm.recommendation"
                required
                rows="3"
                placeholder="Rekomendasi tindakan pencegahan risiko..."
                class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer shadow-xs transition text-xs"
            >
              Simpan Opini
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: Edit Opini Hukum                                  -->
    <!-- ======================================================== -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isEditModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-[#CBD5E1] max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 bg-white text-[#0F172A] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <Pencil class="w-5 h-5 text-amber-500" />
            <h3 class="font-bold text-[#0F172A] text-base">Perbarui Naskah Legal Opinion</h3>
          </div>
          <button @click="isEditModalOpen = false" class="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitEditOpinion" class="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Judul / Perihal Kajian Opini *</label>
            <input
              v-model="editOpForm.title"
              type="text"
              required
              class="form-input font-semibold"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Unit Pemohon / Requestor</label>
              <input
                v-model="editOpForm.requestor"
                type="text"
                class="form-input"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Status Pengesahan (Approval)</label>
              <select
                v-model="editOpForm.approval"
                class="form-select font-bold"
              >
                <option value="APPROVED">APPROVED (Disahkan)</option>
                <option value="PENDING_APPROVAL">PENDING_APPROVAL (Menunggu Telaah)</option>
                <option value="REVISION">REVISION (Perlu Revisi)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">I. Pokok Permasalahan Yuridis *</label>
            <textarea
              v-model="editOpForm.background"
              required
              rows="3"
              class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">II. Analisis & Dasar Hukum Positif *</label>
            <textarea
              v-model="editOpForm.legalAnalysis"
              required
              rows="4"
              class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs leading-relaxed"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">III. Kesimpulan Hukum *</label>
              <textarea
                v-model="editOpForm.conclusion"
                required
                rows="3"
                class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs"
              ></textarea>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Rekomendasi Mitigasi *</label>
              <textarea
                v-model="editOpForm.recommendation"
                required
                rows="3"
                class="w-full p-2.5 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 outline-none text-[#0F172A] resize-none text-xs"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="px-4 py-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer shadow-xs transition text-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { Printer, Plus, Pencil, Trash2, Eye, Search, FileText, CheckCircle2, X } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const opinions = computed(() => legalStore.state.opinions || []);
const selectedOpinion = ref(null);

const searchQuery = ref('');
const statusFilter = ref('ALL');

const isDetailModalOpen = ref(false);
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

// Metrics
const totalCount = computed(() => opinions.value.length);
const approvedCount = computed(() => opinions.value.filter(o => o.approval === 'APPROVED').length);
const pendingCount = computed(() => opinions.value.filter(o => o.approval === 'PENDING_APPROVAL').length);
const revisionCount = computed(() => opinions.value.filter(o => o.approval === 'REVISION').length);

// Filtered Opinions for Table List
const filteredOpinions = computed(() => {
  return opinions.value.filter(op => {
    // 1. Status Filter
    if (statusFilter.value !== 'ALL' && op.approval !== statusFilter.value) {
      return false;
    }
    // 2. Search Query
    if (!searchQuery.value.trim()) return true;
    const q = searchQuery.value.toLowerCase().trim();
    const matchId = (op.id || '').toLowerCase().includes(q);
    const matchIssue = (op.issue || op.title || '').toLowerCase().includes(q);
    const matchRequestor = (op.requestor || '').toLowerCase().includes(q);
    const matchCompany = (op.company || '').toLowerCase().includes(q);
    const matchDept = (op.department || '').toLowerCase().includes(q);
    const matchQuestion = (op.question || op.background || '').toLowerCase().includes(q);
    return matchId || matchIssue || matchRequestor || matchCompany || matchDept || matchQuestion;
  });
});

const newOpForm = reactive({
  title: '',
  requestor: 'Direksi / Unit Bisnis',
  company: 'PT Nusantara Energi',
  background: '',
  legalAnalysis: '',
  conclusion: '',
  recommendation: ''
});

const editOpForm = reactive({
  id: '',
  title: '',
  requestor: '',
  background: '',
  legalAnalysis: '',
  conclusion: '',
  recommendation: '',
  approval: 'PENDING_APPROVAL'
});

function getApprovalBadge(status) {
  switch (status) {
    case 'APPROVED': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'PENDING_APPROVAL': return 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] animate-pulse';
    case 'REVISION': return 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]';
    default: return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

function openDetailOpinion(op) {
  selectedOpinion.value = op;
  isDetailModalOpen.value = true;
}

function submitNewOpinion() {
  const created = legalStore.addOpinion({ ...newOpForm });
  isAddModalOpen.value = false;
  newOpForm.title = '';
  newOpForm.background = '';
  newOpForm.legalAnalysis = '';
  newOpForm.conclusion = '';
  newOpForm.recommendation = '';
  if (created) {
    openDetailOpinion(created);
  }
}

function openEditOpinion(op) {
  Object.assign(editOpForm, {
    id: op.id,
    title: op.title || op.issue || '',
    requestor: op.requestor || '',
    background: op.background || op.question || '',
    legalAnalysis: op.legalAnalysis || op.analysis || '',
    conclusion: op.conclusion || '',
    recommendation: op.recommendation || '',
    approval: op.approval || 'PENDING_APPROVAL'
  });
  isEditModalOpen.value = true;
}

function openEditFromDetail(op) {
  openEditOpinion(op);
}

function submitEditOpinion() {
  legalStore.updateOpinion(editOpForm.id, { ...editOpForm });
  if (selectedOpinion.value && selectedOpinion.value.id === editOpForm.id) {
    Object.assign(selectedOpinion.value, { ...editOpForm });
  }
  isEditModalOpen.value = false;
}

async function confirmDeleteOpinion(op) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Opini Hukum',
    message: `Apakah Anda yakin ingin menghapus opini hukum "${op.title || op.issue}"?`,
    confirmText: 'Ya, Hapus',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteOpinion(op.id);
    if (selectedOpinion.value?.id === op.id) {
      isDetailModalOpen.value = false;
      selectedOpinion.value = null;
    }
  }
}

function approveOpinion() {
  if (selectedOpinion.value) {
    legalStore.updateOpinionApproval(selectedOpinion.value.id, 'APPROVED');
    selectedOpinion.value.approval = 'APPROVED';
  }
}

function printOpinion() {
  window.print();
}
</script>
