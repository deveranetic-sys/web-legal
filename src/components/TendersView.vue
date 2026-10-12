<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Arsip Dokumen & Kepatuhan Legalitas Tender
          </span>
          <span class="text-xs text-[#475569] font-medium">Verifikasi Berkas Kualifikasi & Jaminan Warkat Bank</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Arsip Legalitas Tender & Verifikasi Dokumen
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi pengarsipan berkas legalitas lelang, verifikasi keabsahan warkat bank garansi, kepatuhan dokumen kualifikasi, dan transisi ke kontrak korporasi.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="legalStore.exportTendersCSV()"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          title="Ekspor rekapitulasi arsip tender ke CSV"
        >
          <Download class="w-4 h-4 text-[#475569]" />
          <span>Ekspor CSV</span>
        </button>

        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4 text-white" />
          <span>Registrasi Berkas Tender Baru</span>
        </button>
      </div>
    </div>

    <!-- Dedicated Sub-Module Navigation Bar (Tender & Lelang) -->
    <div class="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] overflow-x-auto text-xs sm:text-sm font-medium">
      <button
        @click="legalStore.setTenderTab('pipeline')"
        :class="(legalStore.state.activeTenderTab === 'pipeline' || !legalStore.state.activeTenderTab)
          ? 'bg-white text-[#4338CA] shadow-xs font-semibold border border-[#E2E8F0]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
      >
        <FileSpreadsheet class="w-4 h-4 text-[#6366F1]" />
        <span>Register & Arsip Tender</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
          {{ activeTendersCount }}
        </span>
      </button>

      <button
        @click="legalStore.setTenderTab('gap-analysis')"
        :class="legalStore.state.activeTenderTab === 'gap-analysis'
          ? 'bg-white text-[#4338CA] shadow-xs font-semibold border border-[#E2E8F0]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
      >
        <FileCheck2 class="w-4 h-4 text-[#6366F1]" />
        <span>Verifikasi Dokumen Legalitas</span>
        <span
          v-if="totalMissingDocs > 0"
          class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
        >
          {{ totalMissingDocs }} Kurang
        </span>
      </button>

      <button
        @click="legalStore.setTenderTab('bonds')"
        :class="legalStore.state.activeTenderTab === 'bonds'
          ? 'bg-white text-[#4338CA] shadow-xs font-semibold border border-[#E2E8F0]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
      >
        <ShieldCheck class="w-4 h-4 text-[#6366F1]" />
        <span>Warkat Jaminan Bank (Bonds)</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
          {{ (legalStore.state.tenderBonds || []).length }}
        </span>
      </button>

      <button
        @click="legalStore.navigate('documents')"
        class="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#475569] hover:text-[#0F172A] hover:bg-white/70 rounded-lg transition cursor-pointer font-medium"
        title="Buka Dokumen Vault di Repositori & Dokumen"
      >
        <Archive class="w-3.5 h-3.5 text-[#6366F1]" />
        <span>Buka Dokumen Vault ↗</span>
      </button>
    </div>

    <!-- SUB-MODULE 1: PROGRESS & PIPELINE LELANG -->
    <div v-if="legalStore.state.activeTenderTab === 'pipeline' || !legalStore.state.activeTenderTab" class="space-y-6">
      
      <!-- ======================================================== -->
      <!-- LANGKAH 1: DAFTAR PAKET LELANG (FORMAT LIST)             -->
      <!-- HANYA TAMPIL SAAT LANGKAH 1 AKTIF (SEBELUM KLIK PROYEK)  -->
      <!-- ======================================================== -->
      <div v-if="activeProjectStep === 'list'" class="space-y-6 animate-in fade-in duration-200">
        <!-- Quick Metrics Strip -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
            <span class="text-xs font-medium text-[#475569]">Total Paket Terdaftar</span>
            <div class="flex items-baseline justify-between mt-1">
              <span class="text-2xl font-bold text-[#0F172A]">{{ tenders.length }}</span>
              <span class="text-xs text-[#475569]">Paket Proyek</span>
            </div>
            <div class="text-[11px] text-[#6366F1] font-semibold mt-1">
              {{ activeTendersCount }} Paket Sedang Berjalan
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
            <span class="text-xs font-medium text-[#475569]">Nilai Total Pagu (HPS)</span>
            <div class="flex items-baseline justify-between mt-1">
              <span class="text-xl font-bold text-[#0F172A] truncate" :title="formatIDR(totalHpsValue)">
                {{ formatCompactIDR(totalHpsValue) }}
              </span>
              <span class="text-xs text-[#475569]">IDR</span>
            </div>
            <div class="text-[11px] text-[#475569] mt-1">
              Penawaran: <strong class="text-[#0F172A]">{{ formatCompactIDR(totalBidValue) }}</strong>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
            <span class="text-xs font-semibold text-emerald-600">Dokumen Digunakan (Siap)</span>
            <div class="flex items-baseline justify-between mt-1">
              <span class="text-2xl font-bold text-emerald-700">{{ totalFulfilledDocs }}</span>
              <span class="text-xs text-emerald-600 font-medium">/ {{ totalAllDocs }} Berkas</span>
            </div>
            <div class="text-[11px] text-emerald-700 font-semibold mt-1">
              Tingkat Kesiapan: {{ overallCompleteness }}%
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#C7D2FE] transition-colors">
            <span class="text-xs font-semibold text-rose-600">Dokumen Masih Kurang (Gap)</span>
            <div class="flex items-baseline justify-between mt-1">
              <span class="text-2xl font-bold text-rose-600">{{ totalMissingDocs }}</span>
              <span class="text-xs text-rose-600 font-medium">Perlu Disiapkan</span>
            </div>
            <div class="text-[11px] text-rose-600 font-semibold mt-1">
              {{ tendersWithMissingCount }} Paket Butuh Kelengkapan
            </div>
          </div>
        </div>

        <!-- Gap Alert Banner (Dokumen Yang Masih Kurang) -->
        <div v-if="totalMissingDocs > 0" class="bg-white border-l-4 border-rose-500 rounded-xl p-4 shadow-sm border border-[#E2E8F0]">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <AlertCircle class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <h3 class="text-sm font-bold text-[#0F172A]">
                  Perhatian: Terdapat {{ totalMissingDocs }} Dokumen Persyaratan yang Belum Lengkap / Kurang
                </h3>
                <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-[#FECDD3]">
                  Kritikal Sebelum Batas Akhir Penawaran
                </span>
              </div>
              <p class="text-xs text-[#475569] mt-1">
                Berikut ringkasan berkas wajib tender yang statusnya masih <strong>KURANG</strong> atau <strong>KEDALUWARSA</strong>. Segera mintakan ke unit bisnis, tim finance, atau legal counsel terkait:
              </p>
              <div class="mt-2.5 flex flex-wrap gap-2">
                <span
                  v-for="item in missingDocsSummary.slice(0, 5)"
                  :key="item.docId"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-rose-50 text-rose-800 border border-[#FECDD3]"
                >
                  <FileWarning class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span><strong>{{ item.tenderId }}:</strong> {{ item.docName }}</span>
                </span>
                <span v-if="missingDocsSummary.length > 5" class="text-xs text-[#475569] self-center">
                  +{{ missingDocsSummary.length - 5 }} dokumen lainnya
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters & Search Toolbar -->
        <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <!-- Search Input -->
            <div class="md:col-span-4 relative">
              <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari judul tender, nomor lelang, panitia..."
                class="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] focus:border-[#C7D2FE] bg-white text-[#0F172A]"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A] text-xs"
              >
                ✕
              </button>
            </div>

            <!-- Filter Sektor (Konstruksi, Tambang, Migas, Energi, Umum) -->
            <div class="md:col-span-3">
              <select
                v-model="filterSector"
                class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="ALL">🏢 Semua Sektor Industri</option>
                <option value="KONSTRUKSI">🏗️ Konstruksi & Infrastruktur</option>
                <option value="PERTAMBANGAN">⛏️ Pertambangan & Mineral</option>
                <option value="MIGAS">🛢️ Minyak & Gas Bumi</option>
                <option value="ENERGI">⚡ Energi & Ketenagalistrikan</option>
                <option value="UMUM">📦 Pengadaan Barang & Jasa Umum</option>
              </select>
            </div>

            <!-- Filter Tahapan Lelang -->
            <div class="md:col-span-3">
              <select
                v-model="filterStage"
                class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="ALL">Semua Tahapan Lelang</option>
                <option value="PERSIAPAN_PENGADAAN">1. Tahap Persiapan Pengadaan</option>
                <option value="PENGUMUMAN_PENDAFTARAN">2. Pengumuman Lelang & Pendaftaran</option>
                <option value="AANWIJZING">3. Pemberian Penjelasan (Aanwijzing)</option>
                <option value="PENYAMPAIAN_PENAWARAN">4. Penyampaian & Pembukaan Penawaran</option>
                <option value="EVALUASI_PEMBUKTIAN">5. Evaluasi Penawaran & Pembuktian</option>
                <option value="PENGUMUMAN_PEMENANG">6. Penetapan & Pengumuman Pemenang</option>
                <option value="MASA_SANGGAH">7. Masa Sanggah</option>
                <option value="SPPBJ_KONTRAK">8. Penerbitan SPPBJ & Kontrak</option>
              </select>
            </div>

            <!-- Filter Kesiapan Dokumen -->
            <div class="md:col-span-2">
              <select
                v-model="filterDocReadiness"
                class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="ALL">Semua Kesiapan</option>
                <option value="HAS_MISSING">Ada Dokumen Kurang</option>
                <option value="COMPLETE">100% Dokumen Lengkap</option>
              </select>
            </div>
          </div>

          <!-- Quick Pill Filters & View Toggle -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[#475569]">Filter Cepat:</span>
              <button
                @click="setQuickFilter('ALL')"
                :class="filterStage === 'ALL' && filterDocReadiness === 'ALL' && filterSector === 'ALL' ? 'bg-[#1E293B] text-white font-medium shadow-xs' : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Semua ({{ tenders.length }})
              </button>
              <button
                @click="filterSector = 'KONSTRUKSI'"
                :class="filterSector === 'KONSTRUKSI' ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] font-bold' : 'bg-slate-100 text-[#475569] hover:bg-slate-200'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                🏗️ Konstruksi
              </button>
              <button
                @click="filterSector = 'PERTAMBANGAN'"
                :class="filterSector === 'PERTAMBANGAN' ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-bold' : 'bg-slate-100 text-[#475569] hover:bg-slate-200'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                ⛏️ Tambang
              </button>
              <button
                @click="filterSector = 'MIGAS'"
                :class="filterSector === 'MIGAS' ? 'bg-[#FDF2F8] text-[#9D174D] border border-[#FCE7F3] font-bold' : 'bg-slate-100 text-[#475569] hover:bg-slate-200'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                🛢️ Migas
              </button>
              <button
                @click="filterSector = 'ENERGI'"
                :class="filterSector === 'ENERGI' ? 'bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5] font-bold' : 'bg-slate-100 text-[#475569] hover:bg-slate-200'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                ⚡ Energi
              </button>
              <button
                @click="setQuickFilter('ACTIVE')"
                :class="filterDocReadiness === 'HAS_MISSING' ? 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] font-medium' : 'bg-[#FFE4E6] text-[#9F1239] hover:bg-rose-100'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Perlu Dokumen ({{ tendersWithMissingCount }})
              </button>
              <button
                v-if="hasActiveFilter"
                @click="resetFilters"
                class="text-rose-600 hover:text-rose-700 font-semibold underline ml-2 cursor-pointer"
              >
                Reset Filter
              </button>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-[#475569]">
                Menampilkan <span class="font-bold text-[#0F172A]">{{ filteredTenders.length }}</span> dari {{ tenders.length }} paket
              </div>
              <div class="text-xs font-semibold text-[#475569] flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <List class="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Format List Proyek</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTenders.length === 0" class="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <FolderSearch class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 class="text-base font-bold text-[#0F172A]">Tidak ada data paket lelang yang sesuai</h4>
          <p class="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            Silakan sesuaikan kriteria pencarian atau bersihkan filter untuk menampilkan paket pengadaan lainnya.
          </p>
          <button
            @click="resetFilters"
            class="mt-4 px-4 py-2 text-xs font-bold text-[#4338CA] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-xl transition cursor-pointer border border-[#C7D2FE]"
          >
            Bersihkan Semua Filter
          </button>
        </div>

        <!-- The Interactive List (Simple: Nama, Status, Kode, Sektor) -->
        <div v-else class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <!-- List Header -->
          <div class="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]/80">
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                  <Milestone class="w-3.5 h-3.5" />
                  <span>LANGKAH 1</span>
                </span>
                <h3 class="text-base font-extrabold text-[#0F172A]">
                  Daftar Paket Lelang Proyek
                </h3>
              </div>
              <p class="text-xs text-[#475569] mt-0.5">
                Klik salah satu paket lelang untuk membuka detail lengkap: Siklus 8 Tahap, Dokumen Vault, Go/No-Go, Pricing &lt;80% HPS, dan 4-Gate Review.
              </p>
            </div>
            
            <div class="text-xs text-[#475569] bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] shrink-0 font-medium">
              Ditemukan: <strong class="text-[#0F172A] font-bold">{{ filteredTenders.length }}</strong> paket lelang
            </div>
          </div>

          <!-- List Rows -->
          <div class="divide-y divide-[#E2E8F0]">
            <div
              v-for="tender in filteredTenders"
              :key="tender.id"
              @click="openProjectDetail(tender.id)"
              class="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
            >
              <!-- Left: Kode, Sektor Badge & Nama Proyek -->
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <span class="font-mono text-xs font-bold bg-[#EEF2FF] text-[#4338CA] px-2.5 py-1 rounded-md border border-[#C7D2FE] shrink-0">
                  {{ tender.id }}
                </span>

                <!-- Sektor Badge -->
                <span
                  :class="getSectorBadge(tender.sector).badgeClass"
                  class="text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1"
                >
                  <span>{{ getSectorBadge(tender.sector).icon }}</span>
                  <span>{{ getSectorBadge(tender.sector).label }}</span>
                </span>

                <span class="text-sm font-bold text-[#0F172A] group-hover:text-[#4338CA] transition-colors truncate">
                  {{ tender.title }}
                </span>

                <!-- <80% HPS Tag if triggered -->
                <span
                  v-if="tender.pricing?.isBelow80HPS || (tender.bidValue && tender.hpsValue && (tender.bidValue / tender.hpsValue < 0.8))"
                  class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3] shrink-0"
                  title="Penawaran di bawah 80% HPS: Wajib evaluasi kewajaran harga dan jaminan 5% HPS"
                >
                  <AlertTriangle class="w-3 h-3 text-[#9F1239]" />
                  &lt;80% HPS
                </span>

                <!-- Submission Locked Badge -->
                <span
                  v-if="tender.locked"
                  class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] shrink-0"
                >
                  <Lock class="w-3 h-3" />
                  Terkunci
                </span>
              </div>

              <!-- Right: Status Badge & Chevron -->
              <div class="flex items-center gap-3 shrink-0">
                <span
                  :class="getTenderStatusBadgeClass(tender.status)"
                  class="text-xs font-bold uppercase px-2.5 py-1 rounded-full"
                >
                  {{ getTenderStatusLabel(tender.status) }}
                </span>
                <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div> <!-- Closes activeProjectStep === 'list' -->

      <!-- ======================================================== -->
      <!-- LANGKAH 2: DETAIL PROGRESS & FITUR ADOPSI ERP PROYEK     -->
      <!-- HANYA MUNCUL SETELAH PROYEK DI-KLIK PADA LANGKAH 1      -->
      <!-- ======================================================== -->
      <div v-else-if="activeProjectStep === 'detail' && currentSelectedTender" class="space-y-4 animate-in fade-in duration-200">
        
        <!-- Navigation Header Bar (Back to List & Quick Switcher) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <button
            @click="backToProjectList"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EEF2FF] text-[#4338CA] hover:bg-[#E0E7FF] text-xs font-bold transition-all cursor-pointer shadow-xs group border border-[#C7D2FE]"
          >
            <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>← Kembali ke Daftar Paket Lelang (Langkah 1)</span>
          </button>

          <!-- Breadcrumb & Switcher -->
          <div class="flex items-center gap-3 text-xs flex-wrap">
            <span class="text-[#475569]">Ganti Proyek:</span>
            <select
              :value="currentSelectedTender.id"
              @change="openProjectDetail($event.target.value)"
              class="py-1.5 px-3 text-xs font-bold border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-[#F8FAFC] text-[#0F172A]"
            >
              <option v-for="t in filteredTenders" :key="t.id" :value="t.id">
                {{ t.id }} - {{ t.title }}
              </option>
            </select>
          </div>
        </div>

        <!-- Section Step 2 Container -->
        <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
          
          <!-- Section Step 2 Header Banner -->
          <div class="p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div class="space-y-2.5 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#6366F1] text-white shadow-sm">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>LANGKAH 2: DETAIL PROYEK & WORKFLOW</span>
                  </span>

                  <!-- Sektor Badge -->
                  <span
                    :class="getSectorBadge(currentSelectedTender.sector).badgeClass"
                    class="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                  >
                    <span>{{ getSectorBadge(currentSelectedTender.sector).icon }}</span>
                    <span>Sektor: {{ getSectorBadge(currentSelectedTender.sector).label }}</span>
                  </span>

                  <span class="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded border border-white/20">
                    {{ currentSelectedTender.id }}
                  </span>

                  <span
                    :class="getTenderStatusBadgeClass(currentSelectedTender.status)"
                    class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full"
                  >
                    {{ getTenderStatusLabel(currentSelectedTender.status) }}
                  </span>

                  <!-- Package Freeze Status -->
                  <span
                    v-if="currentSelectedTender.locked"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                    title="Paket telah dikunci dengan hash kriptografis untuk mencegah perubahan data sebelum submit"
                  >
                    <Lock class="w-3 h-3" />
                    <span>SUBMISSION TERKUNCI</span>
                  </span>
                </div>

                <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {{ currentSelectedTender.title }}
                </h2>

                <div class="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                  <span class="flex items-center gap-1.5">
                    <Building2 class="w-4 h-4 text-[#C7D2FE]" />
                    <span>Panitia / Pokja: <strong class="text-white">{{ currentSelectedTender.organizer }}</strong></span>
                  </span>
                  <span>•</span>
                  <span>Entitas: <strong class="text-white">{{ currentSelectedTender.company }}</strong></span>
                  <span>•</span>
                  <span>PIC: <strong class="text-white">{{ currentSelectedTender.pic }}</strong></span>
                  <span>•</span>
                  <span>No. Tender: <strong class="font-mono text-white">{{ currentSelectedTender.tenderNumber }}</strong></span>
                </div>
              </div>

              <!-- Financial Snapshot & Countdown -->
              <div class="flex flex-wrap lg:flex-col lg:items-end justify-between gap-3 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs shrink-0">
                <div class="text-left lg:text-right">
                  <div class="text-[11px] text-slate-300 uppercase font-bold tracking-wider">Pagu Anggaran HPS</div>
                  <div class="text-xl font-extrabold text-[#C7D2FE] font-mono">
                    {{ formatIDR(currentSelectedTender.hpsValue) }}
                  </div>
                  <div class="text-xs text-slate-300 mt-0.5">
                    Penawaran: <span class="font-bold text-white font-mono">{{ formatIDR(currentSelectedTender.bidValue) }}</span>
                    <span class="ml-1 text-[11px] font-bold text-emerald-400">
                      ({{ ((currentSelectedTender.bidValue / currentSelectedTender.hpsValue) * 100).toFixed(1) }}% HPS)
                    </span>
                  </div>
                </div>

                <div class="text-left lg:text-right">
                  <div
                    v-if="calculateDaysRemaining(currentSelectedTender.deadlineDate) < 0"
                    class="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/20"
                  >
                    <Clock class="w-3.5 h-3.5" />
                    <span>Lelang Telah Berakhir</span>
                  </div>
                  <div
                    v-else-if="calculateDaysRemaining(currentSelectedTender.deadlineDate) <= 7"
                    class="inline-flex items-center gap-1 text-xs font-bold text-rose-200 bg-rose-900/60 px-2.5 py-1 rounded-lg border border-rose-500/50 animate-pulse"
                  >
                    <AlertTriangle class="w-3.5 h-3.5 text-rose-400" />
                    <span>Masa Kritis (Sisa {{ calculateDaysRemaining(currentSelectedTender.deadlineDate) }} Hari)</span>
                  </div>
                  <div
                    v-else
                    class="inline-flex items-center gap-1 text-xs font-semibold text-white bg-white/15 px-2.5 py-1 rounded-lg border border-white/20"
                  >
                    <Clock class="w-3.5 h-3.5 text-[#C7D2FE]" />
                    <span>Batas: {{ currentSelectedTender.deadlineDate }} ({{ calculateDaysRemaining(currentSelectedTender.deadlineDate) }} Hari)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================================================== -->
          <!-- PASTEL SUB-TAB NAVIGATION BAR (DETAIL WORKFLOW TABS)     -->
          <!-- ======================================================== -->
          <div class="flex items-center gap-1.5 p-2 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-x-auto text-xs font-bold">
            <button
              @click="activeDetailTab = 'stages'"
              :class="activeDetailTab === 'stages'
                ? 'bg-white text-[#4338CA] shadow-xs border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <Milestone class="w-4 h-4 text-[#6366F1]" />
              <span>1. Siklus 8 Tahap SPSE</span>
            </button>

            <button
              @click="activeDetailTab = 'documents'"
              :class="activeDetailTab === 'documents'
                ? 'bg-white text-[#4338CA] shadow-xs border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <FileCheck2 class="w-4 h-4 text-[#6366F1]" />
              <span>2. Audit Dokumen Persyaratan</span>
              <span
                v-if="getMissingDocsCount(currentSelectedTender) > 0"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE4E6] text-[#9F1239]"
              >
                {{ getMissingDocsCount(currentSelectedTender) }} Kurang
              </span>
            </button>

            <button
              @click="activeDetailTab = 'gng'"
              :class="activeDetailTab === 'gng'
                ? 'bg-white text-[#4338CA] shadow-xs border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <Calculator class="w-4 h-4 text-[#6366F1]" />
              <span>3. Evaluasi Go / No-Go</span>
              <span
                v-if="currentSelectedTender.gng"
                :class="getGNGDecisionBadgeClass(currentSelectedTender.gng.decision)"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              >
                {{ currentSelectedTender.gng.decision }} ({{ currentSelectedTender.gng.totalScore }})
              </span>
            </button>

            <button
              @click="activeDetailTab = 'pricing'"
              :class="activeDetailTab === 'pricing'
                ? 'bg-white text-[#4338CA] shadow-xs border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <DollarSign class="w-4 h-4 text-[#6366F1]" />
              <span>4. Pricing & Analisis HPS</span>
              <span
                v-if="currentSelectedTender.pricing?.isBelow80HPS"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE4E6] text-[#9F1239] animate-pulse"
              >
                &lt;80% HPS
              </span>
            </button>

            <button
              @click="activeDetailTab = 'gates'"
              :class="activeDetailTab === 'gates'
                ? 'bg-white text-[#4338CA] shadow-xs border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <ShieldCheck class="w-4 h-4 text-[#6366F1]" />
              <span>5. Review 4-Gate & Kunci</span>
              <span
                v-if="currentSelectedTender.locked"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534]"
              >
                Kunci Aktif
              </span>
            </button>

            <button
              @click="activeDetailTab = 'clarifications'"
              :class="activeDetailTab === 'clarifications'
                ? 'bg-white text-[#4338CA] shadow-xs border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <HelpCircle class="w-4 h-4 text-[#6366F1]" />
              <span>6. Log Aanwijzing</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#4338CA]">
                {{ (currentSelectedTender.clarifications || []).length }}
              </span>
            </button>

            <button
              @click="activeDetailTab = 'result'"
              :class="activeDetailTab === 'result'
                ? 'bg-white text-[#4338CA] shadow-xs border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <Award class="w-4 h-4 text-[#6366F1]" />
              <span>7. Hasil & Kontrak</span>
              <span
                v-if="currentSelectedTender.status === 'WON' || currentSelectedTender.status === 'WIN'"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534]"
              >
                Menang
              </span>
            </button>
          </div>

          <!-- ============================================== -->
          <!-- TAB 1: SIKLUS TAHAPAN LELANG DINAMIS PER SEKTOR -->
          <!-- ============================================== -->
          <TenderStagesTab
            v-if="activeDetailTab === 'stages'"
            :tender="currentSelectedTender"
            @change-tab="tab => activeDetailTab = tab"
          />

          <!-- ============================================== -->
          <!-- TAB 2: AUDIT DOKUMEN PERSYARATAN               -->
          <!-- ============================================== -->
          <TenderDocumentsTab
            v-if="activeDetailTab === 'documents'"
            :tender="currentSelectedTender"
          />

          <!-- ============================================== -->
          <!-- TAB 3: EVALUASI KELAYAKAN (GO / NO-GO)         -->
          <!-- ============================================== -->
          <TenderGNGTab
            v-if="activeDetailTab === 'gng'"
            :tender="currentSelectedTender"
          />
          <!-- TAB 4: PRICING & ANALISIS HPS (<80% HPS)       -->
          <!-- ============================================== -->
          <TenderPricingTab
            v-if="activeDetailTab === 'pricing'"
            :tender="currentSelectedTender"
          />

          <!-- ============================================== -->
          <!-- TAB 5: REVIEW 4-GATE & PENGUNCIAN PAKET        -->
          <!-- ============================================== -->
          <TenderGatesTab
            v-if="activeDetailTab === 'gates'"
            :tender="currentSelectedTender"
            @open-unlock-modal="isUnlockModalOpen = true"
          />

          <!-- ============================================== -->
          <!-- TAB 6: LOG AANWIJZING & KLARIFIKASI            -->
          <!-- ============================================== -->
          <TenderClarificationsTab
            v-if="activeDetailTab === 'clarifications'"
            :tender="currentSelectedTender"
            @open-add-clarification-modal="isAddClarificationModalOpen = true"
            @open-answer-modal="openAnswerClarModal"
          />

          <!-- ============================================== -->
          <!-- TAB 7: HASIL LELANG & KONVERSI KONTRAK         -->
          <!-- ============================================== -->
          <TenderResultTab
            v-if="activeDetailTab === 'result'"
            :tender="currentSelectedTender"
            @open-record-result-modal="openRecordResultModal"
          />

          <!-- Bottom Return Bar in Step 2 -->
          <div class="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              @click="backToProjectList"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>← Selesai & Kembali ke Daftar Paket Lelang (Langkah 1)</span>
            </button>

            <span class="text-xs text-[#475569]">
              Proyek: <strong class="text-[#0F172A]">{{ currentSelectedTender.id }}</strong> • {{ currentSelectedTender.title }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- END SUB-MODULE 1: PROGRESS & PIPELINE LELANG -->

    <!-- SUB-MODULE 2: AUDIT DOKUMEN & GAP ANALYSIS -->
    <TenderGapAnalysisView v-else-if="legalStore.state.activeTenderTab === 'gap-analysis'" />

    <!-- SUB-MODULE 3: JAMINAN BANK & BID BOND -->
    <TenderBondsView v-else-if="legalStore.state.activeTenderTab === 'bonds'" />

    <!-- ============================================== -->
    <!-- MODAL: DAFTARKAN PAKET LELANG BARU -->
    <RegisterTenderModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @submit="submitNewTender"
    />

    <!-- Hidden file input for direct document uploading -->
    <input
      ref="directDocFileInputRef"
      type="file"
      class="hidden"
      @change="onDirectDocFilePicked"
    />



    <!-- MODAL: TAMBAH PERTANYAAN AANWIJZING -->
    <AddAanwijzingQuestionModal
      :is-open="isAddClarificationModalOpen"
      @close="isAddClarificationModalOpen = false"
      @submit="handleAddClarification"
    />

    <!-- MODAL: CATAT JAWABAN POKJA -->
    <AddPokjaAnswerModal
      :is-open="isAnswerClarModalOpen"
      :item="selectedClarToAnswer"
      @close="isAnswerClarModalOpen = false"
      @submit="handleAnswerClarification"
    />

    <!-- MODAL: CATAT HASIL PEMENANG LELANG -->
    <WinnerResultModal
      :is-open="isRecordResultModalOpen"
      @close="isRecordResultModalOpen = false"
      @submit="handleRecordResult"
    />

    <!-- MODAL: BUKA KUNCI PAKET (UNLOCK) -->
    <UnlockTenderModal
      :is-open="isUnlockModalOpen"
      @close="isUnlockModalOpen = false"
      @submit="handleUnlockPackage"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import RegisterTenderModal from './Tenders/RegisterTenderModal.vue';

import AddAanwijzingQuestionModal from './Tenders/AddAanwijzingQuestionModal.vue';
import AddPokjaAnswerModal from './Tenders/AddPokjaAnswerModal.vue';
import WinnerResultModal from './Tenders/WinnerResultModal.vue';
import UnlockTenderModal from './Tenders/UnlockTenderModal.vue';
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Paperclip,
  FolderOpen,
  Download,
  Plus,
  Search,
  Building2,
  Tag,
  MapPin,
  Clock,
  AlertTriangle,
  AlertCircle,
  FileWarning,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Edit3,
  FileText,
  FileSpreadsheet,
  Milestone,
  LayoutGrid,
  List,
  Eye,
  Trash2,
  FolderSearch,
  Archive,
  FileCheck2,
  Info,
  Lock,
  Unlock,
  Hash,
  DollarSign,
  Calculator,
  HelpCircle,
  Award,
  FileSignature,
  TrendingUp
} from 'lucide-vue-next';
import { legalStore, formatIDR, calculateDaysRemaining } from '../stores/legalStore';
import TenderGapAnalysisView from './TenderGapAnalysisView.vue';
import TenderBondsView from './TenderBondsView.vue';
import TenderResultTab from './Tenders/Tabs/TenderResultTab.vue';
import TenderClarificationsTab from './Tenders/Tabs/TenderClarificationsTab.vue';
import TenderGatesTab from './Tenders/Tabs/TenderGatesTab.vue';
import TenderStagesTab from './Tenders/Tabs/TenderStagesTab.vue';
import TenderDocumentsTab from './Tenders/Tabs/TenderDocumentsTab.vue';
import TenderGNGTab from './Tenders/Tabs/TenderGNGTab.vue';
import TenderPricingTab from './Tenders/Tabs/TenderPricingTab.vue';

// State Navigation
const activeProjectStep = ref('list'); // 'list' (Langkah 1) or 'detail' (Langkah 2)
const activeDetailTab = ref('stages'); // 'stages', 'documents', 'gng', 'pricing', 'gates', 'clarifications', 'result'
const searchQuery = ref('');
const filterStage = ref('ALL');
const filterDocReadiness = ref('ALL');
const filterSector = ref('ALL');
const docSubFilter = ref('ALL');

// Modals
const isAddModalOpen = ref(false);

const isAddClarificationModalOpen = ref(false);
const isAnswerClarModalOpen = ref(false);
const isRecordResultModalOpen = ref(false);
const isUnlockModalOpen = ref(false);


const selectedClarToAnswer = ref(null);


// Sektor Definitions
const sectorOptions = [
  { value: 'KONSTRUKSI', label: 'Konstruksi & Infrastruktur', icon: '🏗️' },
  { value: 'PERTAMBANGAN', label: 'Pertambangan & Mineral', icon: '⛏️' },
  { value: 'MIGAS', label: 'Minyak & Gas Bumi', icon: '🛢️' },
  { value: 'ENERGI', label: 'Energi & Ketenagalistrikan', icon: '⚡' },
  { value: 'UMUM', label: 'Pengadaan Barang & Jasa Umum', icon: '📦' }
];

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




// Interactive GNG & Pricing state
// Default Gates & Lessons
// Computed Selection
const tenders = computed(() => legalStore.state.tenders || []);

const selectedTenderId = computed({
  get: () => legalStore.state.selectedTenderId || (tenders.value[0]?.id || 'TND-2026-001'),
  set: (val) => legalStore.setSelectedTender(val)
});

const currentSelectedTender = computed(() => {
  return tenders.value.find(t => t.id === selectedTenderId.value) || tenders.value[0] || null;
});

// Sync GNG & Pricing when tender changes
watch(currentSelectedTender, (t) => {
  if (!t) return;
}, { immediate: true });

// Metric Computations
const activeTendersCount = computed(() => {
  return tenders.value.filter(t => t.status === 'ACTIVE').length;
});

const totalHpsValue = computed(() => {
  return tenders.value.reduce((acc, t) => acc + (Number(t.hpsValue) || 0), 0);
});

const totalBidValue = computed(() => {
  return tenders.value.reduce((acc, t) => acc + (Number(t.bidValue) || 0), 0);
});

const totalAllDocs = computed(() => {
  return tenders.value.reduce((acc, t) => acc + (t.documents?.length || 0), 0);
});

const totalFulfilledDocs = computed(() => {
  return tenders.value.reduce((acc, t) => {
    const fulfilled = t.documents?.filter(d => d.status === 'TERPENUHI').length || 0;
    return acc + fulfilled;
  }, 0);
});

const totalMissingDocs = computed(() => {
  return tenders.value.reduce((acc, t) => {
    const missing = t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
    return acc + missing;
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

const missingDocsSummary = computed(() => {
  const list = [];
  tenders.value.forEach(t => {
    t.documents?.forEach(d => {
      if (d.status === 'KURANG' || d.status === 'KEDALUWARSA') {
        list.push({
          tenderId: t.id,
          tenderTitle: t.title,
          docId: d.id,
          docName: d.name,
          category: d.category,
          status: d.status
        });
      }
    });
  });
  return list;
});

const hasActiveFilter = computed(() => {
  return searchQuery.value !== '' || filterStage.value !== 'ALL' || filterDocReadiness.value !== 'ALL' || filterSector.value !== 'ALL';
});

const filteredTenders = computed(() => {
  return tenders.value.filter(t => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchNumber = t.tenderNumber?.toLowerCase().includes(q);
      const matchOrganizer = t.organizer?.toLowerCase().includes(q);
      const matchPic = t.pic?.toLowerCase().includes(q);
      const matchDoc = t.documents?.some(d => d.name.toLowerCase().includes(q));
      if (!matchTitle && !matchNumber && !matchOrganizer && !matchPic && !matchDoc) return false;
    }

    if (filterStage.value !== 'ALL' && t.stage !== filterStage.value) {
      return false;
    }

    if (filterSector.value !== 'ALL' && t.sector !== filterSector.value) {
      return false;
    }

    if (filterDocReadiness.value === 'HAS_MISSING') {
      const hasMissing = t.documents?.some(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA');
      if (!hasMissing) return false;
    } else if (filterDocReadiness.value === 'COMPLETE') {
      const isComplete = t.documents?.length > 0 && t.documents.every(d => d.status === 'TERPENUHI');
      if (!isComplete) return false;
    }

    return true;
  });
});

// Dynamic Stepper Stages List per Sektor (Konstruksi vs Pertambangan vs Migas vs Energi vs Umum)
// Handlers & Helpers
function openProjectDetail(tenderId) {
  legalStore.setSelectedTender(tenderId);
  activeProjectStep.value = 'detail';
}

function backToProjectList() {
  activeProjectStep.value = 'list';
}

function setQuickFilter(type) {
  if (type === 'ALL') {
    filterStage.value = 'ALL';
    filterDocReadiness.value = 'ALL';
    filterSector.value = 'ALL';
  } else if (type === 'ACTIVE') {
    filterDocReadiness.value = 'HAS_MISSING';
  } else if (type === 'COMPLETE') {
    filterDocReadiness.value = 'COMPLETE';
  }
}

function resetFilters() {
  searchQuery.value = '';
  filterStage.value = 'ALL';
  filterDocReadiness.value = 'ALL';
  filterSector.value = 'ALL';
}

function formatCompactIDR(value) {
  if (!value) return 'Rp 0';
  if (value >= 1_000_000_000_000) return 'Rp ' + (value / 1_000_000_000_000).toFixed(1) + ' T';
  if (value >= 1_000_000_000) return 'Rp ' + (value / 1_000_000_000).toFixed(1) + ' M';
  if (value >= 1_000_000) return 'Rp ' + (value / 1_000_000).toFixed(1) + ' Jt';
  return formatIDR(value);
}


function getTenderStatusLabel(status) {
  switch (status) {
    case 'ACTIVE': return 'Berjalan (Aktif)';
    case 'WIN':
    case 'WON': return 'Menang Lelang';
    case 'CONVERTED': return 'Dikonversi ke Kontrak';
    case 'LOST': return 'Gugur / Kalah';
    case 'CANCELLED': return 'Dibatalkan';
    default: return status;
  }
}

function getTenderStatusBadgeClass(status) {
  switch (status) {
    case 'ACTIVE': return 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]';
    case 'WIN':
    case 'WON':
    case 'CONVERTED': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'LOST': return 'bg-slate-100 text-slate-700 border border-slate-200';
    case 'CANCELLED': return 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]';
    default: return 'bg-slate-100 text-slate-800';
  }
}


// Stage and Doc Actions

function submitNewTender(formData) {
  legalStore.addTender(formData);
  isAddModalOpen.value = false;
  legalStore.triggerToast(`Tender ${formData.tenderNumber} berhasil didaftarkan`, 'success');
}

// GNG & Pricing Handlers
// 4-Gate Review Handlers
function handleUnlockPackage(reason) {
  if (!currentSelectedTender.value) return;
  legalStore.unlockTenderPackage(currentSelectedTender.value.id, reason);
  isUnlockModalOpen.value = false;
}

// Aanwijzing Handlers
function handleAddClarification(formData) {
  if (!currentSelectedTender.value) return;
  legalStore.addTenderClarification(currentSelectedTender.value.id, formData);
  isAddClarificationModalOpen.value = false;
}

function openAnswerClarModal(c) {
  selectedClarToAnswer.value = c;
  isAnswerClarModalOpen.value = true;
}

function handleAnswerClarification(formData) {
  if (!currentSelectedTender.value || !selectedClarToAnswer.value) return;
  legalStore.answerTenderClarification(
    currentSelectedTender.value.id,
    selectedClarToAnswer.value.id,
    formData.answer,
    formData.effect
  );
  isAnswerClarModalOpen.value = false;
  selectedClarToAnswer.value = null;
}

// Result & Conversion Handlers
function openRecordResultModal() {
  if (!currentSelectedTender.value) return;
  isRecordResultModalOpen.value = true;
}

function handleRecordResult(formData) {
  if (!currentSelectedTender.value) return;
  legalStore.recordTenderResult(currentSelectedTender.value.id, formData);
  isRecordResultModalOpen.value = false;
}

</script>
