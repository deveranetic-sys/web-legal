<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]">
            Audit Dokumen & Gap Analysis
          </span>
          <span class="text-xs text-[#475569] font-medium">Tracking Berkas Terpenuhi vs Masih Kurang</span>
        </div>
        <h2 class="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Audit Dokumen & Analisis Gap Lelang
        </h2>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi pemetaan dokumen persyaratan lelang: verifikasi berkas yang telah digunakan dan tindakan cepat melengkapi dokumen yang masih kurang.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="legalStore.exportGapAnalysisCSV()"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          title="Ekspor laporan gap analysis ke CSV"
        >
          <Download class="w-4 h-4 text-[#475569]" />
          <span>Ekspor Gap (CSV)</span>
        </button>

        <button
          @click="legalStore.navigate('documents')"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Archive class="w-4 h-4 text-[#6366F1]" />
          <span>Buka Dokumen Vault (Bank Kualifikasi)</span>
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- LANGKAH 1: DAFTAR PAKET LELANG (FORMAT LIST)             -->
    <!-- TAMPIL DULUAN (KLIK BARU LANGKAH 2 MUNCUL)                -->
    <!-- ======================================================== -->
    <div v-if="activeStep === 'list'" class="space-y-6 animate-in fade-in duration-200">
      <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <!-- List Header -->
        <div class="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC]/80">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                <Milestone class="w-3.5 h-3.5" />
                <span>LANGKAH 1</span>
              </span>
              <h3 class="text-base font-extrabold text-[#0F172A]">
                Pilih Paket Lelang untuk Audit Dokumen & Gap Analysis
              </h3>
            </div>
            <p class="text-xs text-[#475569] mt-0.5">
              Pilih dan klik salah satu paket lelang di bawah untuk membuka detail audit kelengkapan berkas legal, deteksi dokumen kurang, serta pemenuhan sertifikat.
            </p>
          </div>

          <!-- Quick Search Filter in List -->
          <div class="relative w-full sm:w-80">
            <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="tenderListSearch"
              type="text"
              placeholder="Cari nama tender, nomor, panitia, PIC..."
              class="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <!-- The Simplified Interactive List (Nama, Status, Kode) -->
        <div class="divide-y divide-[#E2E8F0]">
          <!-- ROW 1: KONSOLIDASI SEMUA PAKET (GLOBAL AUDIT) -->
          <div
            @click="openProjectGapDetail('ALL')"
            class="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center justify-between gap-4 group bg-slate-50/70"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-[10px] font-mono font-extrabold uppercase px-2 py-1 rounded-md bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] shrink-0">
                ALL
              </span>
              <span class="text-sm font-bold text-[#0F172A] group-hover:text-[#4338CA] transition-colors truncate">
                Semua Paket Lelang (Konsolidasi Global Lintas Tender)
              </span>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <span
                v-if="totalMissingDocs > 0"
                class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
              >
                {{ totalMissingDocs }} Dokumen Kurang
              </span>
              <span
                v-else
                class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
              >
                Dokumen Lengkap
              </span>
              <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <!-- ROWS 2..N: EACH TENDER ITEM (SIMPLE: KODE, NAMA, STATUS) -->
          <div
            v-for="tender in filteredTenderList"
            :key="tender.id"
            @click="openProjectGapDetail(tender.id)"
            class="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="font-mono text-xs font-bold text-[#4338CA] bg-[#EEF2FF] px-2.5 py-1 rounded-md border border-[#C7D2FE] shrink-0">
                {{ tender.id }}
              </span>

              <span
                v-if="tender.sector"
                :class="getSectorBadge(tender.sector).badgeClass"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1"
              >
                <span>{{ getSectorBadge(tender.sector).icon }}</span>
                <span>{{ getSectorBadge(tender.sector).label }}</span>
              </span>

              <span class="text-sm font-bold text-[#0F172A] group-hover:text-[#4338CA] transition-colors truncate">
                {{ tender.title }}
              </span>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <span
                v-if="getTenderMissingDocs(tender) > 0"
                class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
              >
                {{ getTenderMissingDocs(tender) }} Dokumen Kurang
              </span>
              <span
                v-else
                class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
              >
                Dokumen Lengkap
              </span>
              <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- LANGKAH 2: DETAIL AUDIT DOKUMEN & GAP ANALYSIS           -->
    <!-- HANYA MUNCUL SETELAH PAKET DI-KLIK DARI LANGKAH 1        -->
    <!-- ======================================================== -->
    <div v-else-if="activeStep === 'detail'" class="space-y-6 animate-in fade-in duration-200">
      <!-- Navigation Header Bar (Back to Step 1 & Quick Switcher) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <button
          @click="backToGapList"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EEF2FF] text-[#4338CA] hover:bg-[#283A52] text-xs font-bold transition-all cursor-pointer shadow-xs group"
        >
          <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>← Kembali ke Daftar Paket Lelang (Langkah 1)</span>
        </button>

        <!-- Breadcrumb & Switcher -->
        <div class="flex items-center gap-3 text-xs flex-wrap">
          <span class="text-[#475569]">Ganti Proyek:</span>
          <select
            :value="filterTenderId"
            @change="selectTender($event.target.value)"
            class="py-1.5 px-3 text-xs font-bold border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-[#F8FAFC] text-[#0F172A]"
          >
            <option value="ALL">Semua Paket (Konsolidasi Global)</option>
            <option v-for="t in tenders" :key="t.id" :value="t.id">
              {{ t.id }} - {{ t.title }}
            </option>
          </select>
        </div>
      </div>

      <!-- Focused Project Callout (when a specific project is selected) -->
      <div
        v-if="selectedTender"
        class="p-4 rounded-xl bg-gradient-to-r from-amber-50/50 via-white to-slate-50 border border-[#C7D2FE] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-mono text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2 py-0.5 rounded border border-[#C7D2FE]">
              {{ selectedTender.id }}
            </span>
            <span class="font-bold text-[#0F172A] text-sm">
              {{ selectedTender.title }}
            </span>
            <span class="text-[#475569] font-mono text-[11px]">
              ({{ selectedTender.tenderNumber }})
            </span>
          </div>
          <div class="text-[#475569] flex items-center gap-3 flex-wrap">
            <span>Panitia: <strong class="text-[#0F172A]">{{ selectedTender.organizer }}</strong></span>
            <span>•</span>
            <span>PIC: <strong class="text-[#0F172A]">{{ selectedTender.pic }}</strong></span>
            <span>•</span>
            <span>Pagu HPS: <strong class="text-[#0F172A] font-mono">{{ formatIDR(selectedTender.hpsValue) }}</strong></span>
            <span>•</span>
            <span>Batas Waktu: <strong class="text-[#0F172A]">{{ selectedTender.deadlineDate }} ({{ calculateDaysRemaining(selectedTender.deadlineDate) }} hari lagi)</strong></span>
          </div>
        </div>

        <button
          @click="goToTenderProgress(selectedTender.id)"
          class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
        >
          <Milestone class="w-4 h-4 text-[#6366F1]" />
          <span>Lihat Siklus 8 Tahapan Lelang Proyek Ini →</span>
        </button>
      </div>

      <!-- Focused Global Callout (when ALL is selected) -->
      <div
        v-else
        class="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#0B1325] text-white border border-[#C7D2FE] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold bg-blue-600 text-[#0F172A] px-2 py-0.5 rounded">
              GLOBAL
            </span>
            <span class="font-bold text-white text-sm">
              Audit Konsolidasi Lintas Seluruh Paket Lelang
            </span>
          </div>
          <p class="text-slate-300 text-xs">
            Menampilkan seluruh dokumen kurang dan status kelengkapan berkas dari seluruh {{ tenders.length }} proyek aktif.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-rose-300 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800 font-bold">
            {{ totalMissingDocs }} Total Dokumen Kurang
          </span>
        </div>
      </div>

      <!-- KPI SUMMARY GRID (DYNAMIC FOR SELECTED PROJECT / GLOBAL) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div class="bg-white p-4 rounded-xl border border-[#FECDD3] bg-rose-50/20 shadow-xs">
          <span class="text-xs font-semibold text-rose-700">
            {{ selectedTender ? 'Dokumen Kurang Proyek Ini' : 'Total Dokumen Kurang' }}
          </span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-rose-600">{{ activeMissingDocsCount }}</span>
            <span class="text-xs text-rose-600 font-medium">Persyaratan</span>
          </div>
          <div class="text-[11px] text-rose-700 font-semibold mt-1">
            {{ selectedTender ? `Prioritas Pelengkapan (${selectedTender.id})` : `${tendersWithMissingCount} Paket Lelang Terdampak` }}
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span class="text-xs font-semibold text-amber-700">Dokumen Wajib (Mandatory Gap)</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-amber-600">{{ activeMandatoryMissingCount }}</span>
            <span class="text-xs text-[#475569]">Wajib Gugur</span>
          </div>
          <div class="text-[11px] text-[#475569] mt-1">
            Kritikal untuk kelolosan evaluasi teknis/legal
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span class="text-xs font-semibold text-orange-700">Dokumen Kedaluwarsa</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-orange-600">{{ activeExpiredDocsCount }}</span>
            <span class="text-xs text-[#475569]">Perlu Perpanjangan</span>
          </div>
          <div class="text-[11px] text-[#475569] mt-1">
            Segera proses perpanjangan izin / sertifikat
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span class="text-xs font-semibold text-emerald-700">Dokumen Siap (Terpenuhi)</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-bold text-emerald-700">{{ activeFulfilledDocsCount }}</span>
            <span class="text-xs text-emerald-600 font-medium">/ {{ activeTotalDocsCount }} Total</span>
          </div>
          <div class="text-[11px] text-emerald-700 font-semibold mt-1">
            Tingkat Kesiapan {{ selectedTender ? 'Proyek' : 'Global' }}: {{ activeCompleteness }}%
          </div>
        </div>
      </div>

      <!-- Filters & Search Bar for Documents -->
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <!-- Search -->
          <div class="md:col-span-5 relative">
            <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama dokumen, paket lelang, nomor tender, instansi..."
              class="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] focus:border-[#C7D2FE] bg-white text-[#0F172A]"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A] text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Filter Paket Lelang -->
          <div class="md:col-span-3">
            <select
              v-model="filterTenderId"
              class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="ALL">Semua Paket Lelang ({{ tenders.length }})</option>
              <option v-for="t in tenders" :key="t.id" :value="t.id">
                {{ t.id }} - {{ t.tenderNumber }}
              </option>
            </select>
          </div>

          <!-- Filter Kategori Dokumen -->
          <div class="md:col-span-2">
            <select
              v-model="filterCategory"
              class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Legal Administrasi">Legal Administrasi</option>
              <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
              <option value="Finansial & Keuangan">Finansial & Keuangan</option>
              <option value="Kepatuhan & Integritas">Kepatuhan & Integritas</option>
            </select>
          </div>

          <!-- Filter Urgensi -->
          <div class="md:col-span-2">
            <select
              v-model="filterUrgency"
              class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            >
              <option value="ALL">Semua Status Gap</option>
              <option value="MANDATORY_ONLY">Hanya Dokumen Wajib</option>
              <option value="URGENT_DEADLINE">Tenggat < 7 Hari</option>
              <option value="EXPIRED_ONLY">Hanya Kedaluwarsa</option>
            </select>
          </div>
        </div>

        <!-- Quick Filter Pills -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[#475569]">Tampilkan:</span>
            <button
              @click="activeViewSection = 'action-list'"
              :class="activeViewSection === 'action-list' ? 'bg-[#1E293B] text-white font-bold' : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'"
              class="px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            >
              <FileWarning class="w-3.5 h-3.5 text-rose-400" />
              <span>Daftar Dokumen Kurang ({{ filteredMissingList.length }})</span>
            </button>
            <button
              @click="activeViewSection = 'matrix'"
              :class="activeViewSection === 'matrix' ? 'bg-[#1E293B] text-white font-bold' : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'"
              class="px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            >
              <LayoutGrid class="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Matriks Pemetaan Lintas Tender</span>
            </button>
            <button
              v-if="searchQuery || filterTenderId !== 'ALL' || filterCategory !== 'ALL' || filterUrgency !== 'ALL'"
              @click="resetFilters"
              class="text-rose-600 hover:text-rose-700 font-semibold underline ml-2 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>

          <div class="text-[#475569]">
            Ditemukan <span class="font-bold text-[#0F172A]">{{ filteredMissingList.length }}</span> item dokumen perlu penanganan
          </div>
        </div>
      </div>

      <!-- VIEW SECTION 1: DAFTAR TINDAKAN DOKUMEN KURANG -->
      <div v-if="activeViewSection === 'action-list'" class="space-y-4">
        <div v-if="filteredMissingList.length === 0" class="bg-white rounded-2xl border border-[#BBF7D0] p-8 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <h3 class="text-base font-bold text-[#0F172A]">
            Luar Biasa! Tidak Ada Dokumen Kurang Berdasarkan Filter Saat Ini
          </h3>
          <p class="text-xs text-[#475569] max-w-md mx-auto">
            Seluruh berkas persyaratan tender sudah terpenuhi dan valid, atau sesuaikan filter pencarian untuk melihat data lelang lainnya.
          </p>
        </div>

        <div
          v-for="item in filteredMissingList"
          :key="`${item.tenderId}-${item.docId}`"
          class="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#C7D2FE] transition-all p-4 space-y-3"
        >
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
            <!-- Document and Tender Info -->
            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Tender Badge -->
                <span class="font-mono text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2.5 py-0.5 rounded-md border border-[#C7D2FE]">
                  {{ item.tenderId }}
                </span>
                <span class="text-xs font-bold text-[#0F172A]">
                  {{ item.tenderTitle }}
                </span>
                <span class="text-xs text-[#475569] font-mono">
                  ({{ item.tenderNumber }})
                </span>
                <span class="text-xs text-[#475569]">
                  • {{ item.company }}
                </span>
              </div>

              <!-- Doc Name and Urgency Badges -->
              <div class="flex items-center gap-2 flex-wrap pt-1">
                <span
                  v-if="item.status === 'KURANG'"
                  class="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
                >
                  <AlertCircle class="w-3 h-3 text-rose-600" />
                  <span>KURANG</span>
                </span>
                <span
                  v-else-if="item.status === 'KEDALUWARSA'"
                  class="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200"
                >
                  <Clock class="w-3 h-3 text-orange-600" />
                  <span>KEDALUWARSA</span>
                </span>

                <span
                  v-if="item.isMandatory"
                  class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100/70 text-rose-800 border border-[#FECDD3]"
                >
                  Wajib Gugur
                </span>

                <span class="text-xs font-bold text-[#0F172A]">
                  {{ item.docName }}
                </span>
              </div>

              <!-- Panitia & Category -->
              <div class="text-xs text-[#475569] flex items-center gap-3 flex-wrap">
                <span>Panitia: <strong class="text-[#0F172A]">{{ item.organizer }}</strong></span>
                <span>•</span>
                <span>Kategori: <strong class="text-[#0F172A]">{{ item.category }}</strong></span>
                <span>•</span>
                <span>Batas Waktu: <strong class="text-rose-600">{{ item.deadline }} ({{ calculateDaysRemaining(item.deadline) }} hari lagi)</strong></span>
              </div>

              <!-- Notes or Bottleneck Explanation -->
              <div v-if="item.notes" class="text-xs text-[#0F172A] bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                <FileWarning class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div class="flex-1">
                  <span class="font-semibold text-[#0F172A]">Catatan Kendala:</span> {{ item.notes }}
                </div>
                <button
                  @click="promptEditNotes(item)"
                  class="text-[#6366F1] hover:text-[#0F172A] text-xs font-medium cursor-pointer"
                  title="Perbarui catatan"
                >
                  Edit
                </button>
              </div>
            </div>

            <!-- Action Buttons for this item -->
            <div class="flex md:flex-col items-center md:items-end gap-2 shrink-0">
              <!-- Quick Link from Vault -->
              <button
                @click="openLinkVaultModal(item)"
                class="px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                title="Tautkan dokumen dari Bank Dokumen Kualifikasi Master"
              >
                <Link2 class="w-3.5 h-3.5" />
                <span>Tautkan dari Bank Dokumen</span>
              </button>

              <!-- Mark Fulfilled Manually -->
              <button
                @click="markDocFulfilled(item)"
                class="px-3 py-1.5 bg-emerald-50 hover:bg-[#DCFCE7] text-[#166534] border border-emerald-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                title="Tandai berkas telah diterima dan terpenuhi"
              >
                <Check class="w-3.5 h-3.5" />
                <span>Tandai Terpenuhi</span>
              </button>

              <button
                @click="promptEditNotes(item)"
                class="px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Edit3 class="w-3.5 h-3.5 text-[#475569]" />
                <span>Catatan Kendala</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW SECTION 2: MATRIKS PEMETAAN LINTAS TENDER -->
      <div v-else-if="activeViewSection === 'matrix'" class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div class="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]/80">
          <div>
            <h3 class="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <LayoutGrid class="w-4 h-4 text-[#6366F1]" />
              <span>Matriks Pemetaan Kualifikasi Lintas Tender (Master Cross-Check)</span>
            </h3>
            <p class="text-xs text-[#475569] mt-0.5">
              Tinjauan cepat 10 dokumen kualifikasi legal utama terhadap masing-masing paket lelang yang terdaftar.
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-100/70 border-b border-[#E2E8F0] text-[#0F172A] font-bold">
                <th class="py-3 px-4 min-w-[200px]">Dokumen Kualifikasi Master</th>
                <th class="py-3 px-4 min-w-[130px]">Kategori</th>
                <th
                  v-for="t in (filterTenderId === 'ALL' ? tenders : tenders.filter(x => x.id === filterTenderId))"
                  :key="t.id"
                  class="py-3 px-3 text-center min-w-[140px] border-l border-[#E2E8F0]"
                >
                  <div class="font-mono text-xs text-[#0F172A]">{{ t.id }}</div>
                  <div class="text-[10px] text-[#475569] font-normal truncate max-w-[130px]" :title="t.title">
                    {{ t.title }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2E8F0]">
              <tr
                v-for="vDoc in masterMatrixList"
                :key="vDoc.code"
                class="hover:bg-[#F8FAFC] transition-colors"
              >
                <td class="py-3 px-4 font-semibold text-[#0F172A]">
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-[#0F172A]">
                      {{ vDoc.code }}
                    </span>
                    <span>{{ vDoc.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-[#475569]">
                  {{ vDoc.category }}
                </td>
                <td
                  v-for="t in (filterTenderId === 'ALL' ? tenders : tenders.filter(x => x.id === filterTenderId))"
                  :key="t.id"
                  class="py-3 px-3 text-center border-l border-[#E2E8F0]"
                >
                  <div v-if="getDocMatchInTender(t, vDoc.name) === 'TERPENUHI'" class="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-[#BBF7D0] text-[10px]">
                    <CheckCircle2 class="w-3 h-3" />
                    <span>Lengkap</span>
                  </div>
                  <div v-else-if="getDocMatchInTender(t, vDoc.name) === 'KURANG'" class="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-[#FECDD3] text-[10px]">
                    <XCircle class="w-3 h-3" />
                    <span>Kurang</span>
                  </div>
                  <div v-else-if="getDocMatchInTender(t, vDoc.name) === 'KEDALUWARSA'" class="inline-flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[10px]">
                    <Clock class="w-3 h-3" />
                    <span>Kedaluwarsa</span>
                  </div>
                  <div v-else class="text-[10px] text-slate-400">
                    - Tidak Wajib -
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Return Bar in Step 2 -->
      <div class="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <button
          @click="backToGapList"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] text-xs font-bold transition cursor-pointer shadow-xs"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>← Selesai & Kembali ke Daftar Paket Lelang (Langkah 1)</span>
        </button>

        <span class="text-xs text-[#475569]">
          Audit Mode: <strong class="text-[#0F172A]">{{ selectedTender ? selectedTender.id + ' • ' + selectedTender.title : 'Konsolidasi Global Lintas Tender' }}</strong>
        </span>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: TAUTKAN DOKUMEN DARI BANK DOKUMEN                -->
    <!-- ======================================================== -->
    <div
      v-if="isLinkModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/70 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C7D2FE] space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">
              Tautkan Dokumen dari Bank Dokumen Kualifikasi
            </h3>
            <p class="text-xs text-[#475569] mt-0.5">
              Pilih dokumen master perseroan yang cocok untuk memenuhi syarat paket lelang ini.
            </p>
          </div>
          <button @click="isLinkModalOpen = false" class="text-slate-400 hover:text-[#0F172A] cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="selectedMissingItem" class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
          <div class="text-[#475569]">Paket Lelang: <strong class="text-[#0F172A]">{{ selectedMissingItem.tenderNumber }}</strong></div>
          <div class="text-[#475569]">Dokumen yang Dibutuhkan:</div>
          <div class="font-bold text-[#0F172A] text-sm">{{ selectedMissingItem.docName }}</div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-[#0F172A]">Pilih Berkas dari Bank Dokumen:</label>
          <div class="max-h-60 overflow-y-auto space-y-2 border border-[#E2E8F0] rounded-xl p-2">
            <div
              v-for="vDoc in legalStore.state.tenderVault"
              :key="vDoc.id"
              @click="selectedVaultDocId = vDoc.id"
              :class="selectedVaultDocId === vDoc.id ? 'bg-[#1E293B] text-white border-[#C7D2FE]' : 'hover:bg-slate-50 text-[#0F172A] border-slate-200'"
              class="p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between gap-2"
            >
              <div class="min-w-0">
                <div class="font-bold truncate" :class="selectedVaultDocId === vDoc.id ? 'text-white' : 'text-[#0F172A]'">
                  {{ vDoc.name }}
                </div>
                <div class="text-[10px]" :class="selectedVaultDocId === vDoc.id ? 'text-slate-300' : 'text-[#475569]'">
                  {{ vDoc.code }} • {{ vDoc.number }}
                </div>
              </div>
              <span
                v-if="selectedVaultDocId === vDoc.id"
                class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-[#0F172A]"
              >
                Dipilih
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            @click="isLinkModalOpen = false"
            class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            @click="executeLinkVaultDoc"
            :disabled="!selectedVaultDocId"
            class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs disabled:opacity-50"
          >
            Tautkan & Penuhi Dokumen
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Milestone,
  Download,
  Archive,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileWarning,
  AlertCircle,
  Link2,
  Check,
  Edit3,
  LayoutGrid,
  X,
  ArrowLeft,
  ChevronRight
} from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining, formatIDR } from '../stores/legalStore';

// State
const activeStep = ref('list'); // 'list' or 'detail'
const tenderListSearch = ref('');
const searchQuery = ref('');
const filterTenderId = ref(legalStore.state.selectedTenderId || 'ALL');
const filterCategory = ref('ALL');
const filterUrgency = ref('ALL');
const activeViewSection = ref('action-list'); // 'action-list' or 'matrix'

const filteredTenderList = computed(() => {
  const q = tenderListSearch.value.toLowerCase().trim();
  if (!q) return tenders.value;
  return tenders.value.filter(t => 
    t.title.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q) ||
    (t.organizer && t.organizer.toLowerCase().includes(q)) ||
    (t.pic && t.pic.toLowerCase().includes(q))
  );
});

function openProjectGapDetail(id) {
  filterTenderId.value = id;
  if (id !== 'ALL') {
    legalStore.setSelectedTender(id);
  }
  activeStep.value = 'detail';
}

function getSectorBadge(sectorKey) {
  switch (sectorKey) {
    case 'KONSTRUKSI':
      return { label: 'Konstruksi', icon: '🏗️', badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]' };
    case 'PERTAMBANGAN':
      return { label: 'Pertambangan', icon: '⛏️', badgeClass: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' };
    case 'MIGAS':
      return { label: 'Minyak & Gas', icon: '🛢️', badgeClass: 'bg-[#FDF2F8] text-[#9D174D] border border-[#FCE7F3]' };
    case 'ENERGI':
      return { label: 'Energi Listrik', icon: '⚡', badgeClass: 'bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]' };
    default:
      return { label: 'Pengadaan Umum', icon: '📦', badgeClass: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]' };
  }
}

function backToGapList() {
  activeStep.value = 'list';
}

const selectedTender = computed(() => {
  if (filterTenderId.value === 'ALL') return null;
  return tenders.value.find(t => t.id === filterTenderId.value) || null;
});

function selectTender(id) {
  filterTenderId.value = id;
  if (id !== 'ALL') {
    legalStore.setSelectedTender(id);
  }
}

function goToTenderProgress(tenderId) {
  legalStore.setSelectedTender(tenderId);
  legalStore.setTenderTab('pipeline');
}

function getTenderMissingDocs(t) {
  return t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
}

function getTenderCompleteness(t) {
  if (!t.documents || t.documents.length === 0) return 100;
  const fulfilled = t.documents.filter(d => d.status === 'TERPENUHI').length;
  return Math.round((fulfilled / t.documents.length) * 100);
}

const activeMissingDocsCount = computed(() => {
  if (selectedTender.value) {
    return getTenderMissingDocs(selectedTender.value);
  }
  return totalMissingDocs.value;
});

const activeMandatoryMissingCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.filter(d => (d.status === 'KURANG' || d.status === 'KEDALUWARSA') && d.isMandatory).length || 0;
  }
  return mandatoryMissingDocsCount.value;
});

const activeExpiredDocsCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.filter(d => d.status === 'KEDALUWARSA').length || 0;
  }
  return expiredDocsCount.value;
});

const activeFulfilledDocsCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.filter(d => d.status === 'TERPENUHI').length || 0;
  }
  return totalFulfilledDocs.value;
});

const activeTotalDocsCount = computed(() => {
  if (selectedTender.value) {
    return selectedTender.value.documents?.length || 0;
  }
  return totalAllDocs.value;
});

const activeCompleteness = computed(() => {
  if (activeTotalDocsCount.value === 0) return 100;
  return Math.round((activeFulfilledDocsCount.value / activeTotalDocsCount.value) * 100);
});

const isLinkModalOpen = ref(false);
const selectedMissingItem = ref(null);
const selectedVaultDocId = ref(null);

// Computed datasets from store
const tenders = computed(() => legalStore.state.tenders || []);

const totalAllDocs = computed(() => {
  return tenders.value.reduce((acc, t) => acc + (t.documents?.length || 0), 0);
});

const totalFulfilledDocs = computed(() => {
  return tenders.value.reduce((acc, t) => {
    return acc + (t.documents?.filter(d => d.status === 'TERPENUHI').length || 0);
  }, 0);
});

const totalMissingDocs = computed(() => {
  return tenders.value.reduce((acc, t) => {
    return acc + (t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0);
  }, 0);
});

const tendersWithMissingCount = computed(() => {
  return tenders.value.filter(t => {
    return t.documents?.some(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA');
  }).length;
});

const overallCompleteness = computed(() => {
  if (totalAllDocs.value === 0) return 100;
  return Math.round((totalFulfilledDocs.value / totalAllDocs.value) * 100);
});

// All missing items aggregated across all tenders
const allMissingItems = computed(() => {
  const list = [];
  tenders.value.forEach(t => {
    (t.documents || []).forEach(d => {
      if (d.status === 'KURANG' || d.status === 'KEDALUWARSA') {
        list.push({
          tenderId: t.id,
          tenderNumber: t.tenderNumber,
          tenderTitle: t.title,
          organizer: t.organizer,
          company: t.company,
          deadline: t.deadlineDate,
          docId: d.id,
          docName: d.name,
          category: d.category,
          status: d.status,
          isMandatory: d.isMandatory,
          notes: d.notes,
          fileRef: d.fileRef
        });
      }
    });
  });
  return list;
});

const mandatoryMissingDocsCount = computed(() => {
  return allMissingItems.value.filter(item => item.isMandatory).length;
});

const expiredDocsCount = computed(() => {
  return allMissingItems.value.filter(item => item.status === 'KEDALUWARSA').length;
});

// Filtered missing items
const filteredMissingList = computed(() => {
  return allMissingItems.value.filter(item => {
    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchDoc = item.docName.toLowerCase().includes(q);
      const matchTender = item.tenderTitle.toLowerCase().includes(q) || item.tenderNumber.toLowerCase().includes(q);
      const matchOrg = item.organizer.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchDoc && !matchTender && !matchOrg && !matchNotes) return false;
    }

    // Tender Id filter
    if (filterTenderId.value !== 'ALL' && item.tenderId !== filterTenderId.value) {
      return false;
    }

    // Category filter
    if (filterCategory.value !== 'ALL' && item.category !== filterCategory.value) {
      return false;
    }

    // Urgency filter
    if (filterUrgency.value === 'MANDATORY_ONLY' && !item.isMandatory) {
      return false;
    }
    if (filterUrgency.value === 'URGENT_DEADLINE') {
      const days = calculateDaysRemaining(item.deadline);
      if (days > 7 || days < 0) return false;
    }
    if (filterUrgency.value === 'EXPIRED_ONLY' && item.status !== 'KEDALUWARSA') {
      return false;
    }

    return true;
  });
});

// Master Matrix template list (top 10 common qualification documents)
const masterMatrixList = [
  { code: 'NIB-OSS', name: 'Nomor Induk Berusaha (NIB OSS RBA)', category: 'Legal Administrasi' },
  { code: 'AKTA-AHU', name: 'Akta Notaris & SK Kemenkumham Terakhir', category: 'Legal Administrasi' },
  { code: 'SBU-LPJK', name: 'Sertifikat Badan Usaha (SBU Konstruksi)', category: 'Kualifikasi Teknis' },
  { code: 'ISO-9001', name: 'ISO 9001:2015 Sistem Manajemen Mutu', category: 'Kepatuhan & Integritas' },
  { code: 'ISO-14001', name: 'ISO 14001:2018 Sistem Manajemen Lingkungan', category: 'Kepatuhan & Integritas' },
  { code: 'ISO-45001', name: 'ISO 45001:2018 / SMK3 Sistem Manajemen K3', category: 'Kepatuhan & Integritas' },
  { code: 'KSWP-DJP', name: 'Konfirmasi Status Wajib Pajak (KSWP Valid)', category: 'Finansial & Keuangan' },
  { code: 'KAP-AUDIT', name: 'Laporan Keuangan Audited KAP (WTP)', category: 'Finansial & Keuangan' },
  { code: 'SKK-BANK', name: 'Surat Keterangan Dukungan Keuangan Bank', category: 'Finansial & Keuangan' },
  { code: 'NON-BLACKLIST', name: 'Surat Bebas Blacklist / Portal Inaproc LKPP', category: 'Legal Administrasi' }
];

function getDocMatchInTender(tender, masterDocName) {
  if (!tender.documents) return 'NONE';
  const query = masterDocName.toLowerCase().slice(0, 10);
  const found = tender.documents.find(d => d.name.toLowerCase().includes(query) || masterDocName.toLowerCase().includes(d.name.toLowerCase().slice(0, 10)));
  if (!found) return 'NONE';
  return found.status;
}

function quickFulfillFromMatrix(tenderId, vDoc) {
  const tender = tenders.value.find(t => t.id === tenderId);
  if (!tender) return;
  const doc = tender.documents?.find(d => d.name.toLowerCase().includes(vDoc.name.toLowerCase().slice(0, 10)));
  if (doc) {
    legalStore.toggleTenderDocStatus(tenderId, doc.id, 'TERPENUHI', `Dipenuhi via matriks kualifikasi (${vDoc.code})`);
  }
}

function markDocFulfilled(item) {
  legalStore.toggleTenderDocStatus(item.tenderId, item.docId, 'TERPENUHI', 'Diverifikasi dan dinyatakan lengkap');
}

function promptEditNotes(item) {
  const newNotes = window.prompt(`Perbarui catatan / kendala untuk "${item.docName}":`, item.notes || '');
  if (newNotes !== null) {
    legalStore.toggleTenderDocStatus(item.tenderId, item.docId, item.status, newNotes);
  }
}

function openLinkVaultModal(item) {
  selectedMissingItem.value = item;
  selectedVaultDocId.value = legalStore.state.tenderVault[0]?.id || null;
  isLinkModalOpen.value = true;
}

function executeLinkVaultDoc() {
  if (!selectedMissingItem.value || !selectedVaultDocId.value) return;
  legalStore.linkVaultDocToTender(selectedVaultDocId.value, selectedMissingItem.value.tenderId);
  isLinkModalOpen.value = false;
  selectedMissingItem.value = null;
}

function resetFilters() {
  searchQuery.value = '';
  filterTenderId.value = 'ALL';
  filterCategory.value = 'ALL';
  filterUrgency.value = 'ALL';
}
</script>
