<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Siklus Pengadaan & Tender Multi-Sektor
          </span>
          <span class="text-xs text-[#475569] font-medium">Konstruksi, Pertambangan, Migas, Energi & Umum</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Tracking Progress Lelang & Audit Dokumen
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi pemantauan 8 tahapan lelang SPSE, evaluasi Go/No-Go, mitigasi penawaran &lt;80% HPS, review 4-gate, dan konversi kontrak korporasi.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="legalStore.exportTendersCSV()"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          title="Ekspor rekapitulasi progress lelang ke CSV"
        >
          <Download class="w-4 h-4 text-[#475569]" />
          <span>Ekspor CSV</span>
        </button>

        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4 text-white" />
          <span>Daftarkan Paket Lelang</span>
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
        <span>Progress & Pipeline Lelang</span>
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
        <span>Audit Dokumen & Gap Analysis</span>
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
        <span>Jaminan Bank & Bid Bond</span>
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
          <div v-if="activeDetailTab === 'stages'" class="p-6 space-y-6 animate-in fade-in duration-150">
            <!-- Dynamic Sector Workflow Header Banner -->
            <div class="bg-gradient-to-r from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] p-5 rounded-2xl border border-[#C7D2FE] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div class="space-y-1.5">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-2xl">{{ currentSectorObj.icon }}</span>
                  <h3 class="text-base font-extrabold text-[#0F172A]">
                    Alur Kerja Tender: {{ currentSectorObj.name }}
                  </h3>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6366F1] text-white shadow-xs">
                    {{ stagesList.length }} Tahapan Proses
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-[#4338CA] border border-[#C7D2FE]">
                    Template: {{ currentSectorObj.workflowTemplate }}
                  </span>
                </div>
                <p class="text-xs text-[#475569]">
                  Dasar Regulasi: <strong class="text-[#0F172A]">{{ currentSectorObj.regulatoryBasis }}</strong> • {{ currentSectorObj.description }}
                </p>
              </div>

              <!-- Quick Sector Switcher Dropdown -->
              <div class="flex items-center gap-2 self-start md:self-auto shrink-0 bg-white p-2 rounded-xl border border-[#E2E8F0] shadow-xs">
                <span class="text-[11px] font-bold text-[#475569]">Ganti Sektor Alur:</span>
                <select
                  :value="currentSelectedTender.sector"
                  @change="handleChangeTenderSector($event.target.value)"
                  class="text-xs font-bold text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg px-2.5 py-1 outline-none cursor-pointer hover:bg-[#E0E7FF] transition"
                >
                  <option v-for="sec in (legalStore.state.masterSectors || sectorOptions)" :key="sec.code || sec.value" :value="sec.code || sec.value">
                    {{ sec.icon }} {{ sec.name || sec.label }} ({{ (legalStore.getStagesForSector(sec.code || sec.value) || []).length }} Tahap)
                  </option>
                </select>
              </div>
            </div>

            <!-- Stepper Navigation Controls & Progress Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-[#4338CA] bg-[#EEF2FF] px-3.5 py-1.5 rounded-xl border border-[#C7D2FE] shadow-xs flex items-center gap-2">
                  <Milestone class="w-4 h-4 text-[#6366F1]" />
                  <span>Tahap {{ getStageIndex(currentSelectedTender.stage) + 1 }} dari {{ stagesList.length }}:</span>
                  <strong class="text-[#0F172A]">{{ getStageLabel(currentSelectedTender.stage) }}</strong>
                </span>
              </div>

              <!-- Stage Advance Controls -->
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  @click="advanceStage(currentSelectedTender.id, -1)"
                  :disabled="getStageIndex(currentSelectedTender.stage) <= 0"
                  class="px-3.5 py-1.5 text-xs font-bold text-[#0F172A] bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition cursor-pointer"
                >
                  ← Tahap Sebelumnya
                </button>
                <button
                  @click="advanceStage(currentSelectedTender.id, 1)"
                  :disabled="getStageIndex(currentSelectedTender.stage) >= stagesList.length - 1"
                  class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition cursor-pointer shadow-xs"
                >
                  Maju ke Tahap Selanjutnya →
                </button>
              </div>
            </div>

            <!-- Stepper Track -->
            <div class="py-2">
              <div class="overflow-x-auto pb-4 scrollbar-none">
                <div class="flex items-start min-w-[840px] justify-between relative px-2">
                  <!-- Connecting Line -->
                  <div class="absolute left-10 right-10 top-4 h-1.5 bg-slate-200 z-0"></div>
                  <div
                    class="absolute left-10 top-4 h-1.5 bg-[#6366F1] z-0 transition-all duration-300"
                    :style="{ width: getStageProgressWidth(currentSelectedTender.stage) }"
                  ></div>

                  <!-- Steps -->
                  <div
                    v-for="(stageItem, sIdx) in stagesList"
                    :key="stageItem.key"
                    @click="updateStage(currentSelectedTender.id, stageItem.key)"
                    class="relative z-10 flex flex-col items-center cursor-pointer group px-2"
                    :title="'Klik untuk berpindah ke tahapan: ' + stageItem.name"
                  >
                    <div
                      :class="getStageCircleClass(currentSelectedTender.stage, stageItem.key, sIdx)"
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all shadow-xs"
                    >
                      <Check v-if="isStageCompleted(currentSelectedTender.stage, stageItem.key)" class="w-4 h-4" />
                      <span v-else>{{ sIdx + 1 }}</span>
                    </div>
                    <span
                      :class="currentSelectedTender.stage === stageItem.key ? 'text-[#0F172A] font-extrabold underline decoration-[#6366F1] decoration-2' : 'text-[#475569] font-medium group-hover:text-[#0F172A]'"
                      class="text-[11px] mt-2 text-center max-w-[100px] leading-tight"
                    >
                      {{ stageItem.shortName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- STAGE PROCESS EXECUTION WORKSPACE -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
              <!-- LEFT CARD (7 cols): Pedoman Regulasi & Interactive Checklist Tahap Aktif -->
              <div class="lg:col-span-7 space-y-4">
                <!-- Pedoman & Regulasi Box -->
                <div class="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-3">
                  <div class="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <div class="flex items-center gap-2">
                      <Info class="w-4 h-4 text-[#6366F1]" />
                      <h4 class="font-extrabold text-[#0F172A] text-sm">
                        Pedoman & Klausul Tahap: {{ getStageLabel(currentSelectedTender.stage) }}
                      </h4>
                    </div>
                    <span class="text-[11px] font-mono font-bold text-[#4338CA] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#C7D2FE]">
                      {{ currentStageGuidance.regulatory }}
                    </span>
                  </div>

                  <p class="text-xs text-[#0F172A] leading-relaxed">
                    {{ getStageDescription(currentSelectedTender.stage) }}
                  </p>

                  <!-- Specific Sector Warning / Alert Callout -->
                  <div v-if="currentStageGuidance.alert" class="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs flex items-start gap-2.5">
                    <AlertTriangle class="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <div class="space-y-0.5">
                      <div class="font-bold text-[11px] uppercase tracking-wide">Fokus Verifikasi: {{ currentStageGuidance.focus }}</div>
                      <p class="text-[11px] leading-relaxed">{{ currentStageGuidance.alert }}</p>
                    </div>
                  </div>
                </div>

                <!-- Interactive Checklist Box for This Stage -->
                <div class="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-4">
                  <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#E2E8F0]">
                    <div class="flex items-center gap-2">
                      <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                      <h4 class="font-extrabold text-[#0F172A] text-sm">
                        Daftar Periksa & Tindakan Kunci Tahap Ini
                      </h4>
                    </div>

                    <div class="flex items-center gap-2 text-xs">
                      <span class="font-bold font-mono text-[#0F172A]">
                        {{ completedChecklistCount }} / {{ currentStageChecklist.length }} Selesai
                      </span>
                      <button
                        @click="handleCompleteAllChecklist"
                        class="px-2.5 py-1 text-[11px] font-bold text-[#4338CA] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition cursor-pointer"
                      >
                        Tandai Semua Selesai
                      </button>
                    </div>
                  </div>

                  <!-- Checklist Progress Bar -->
                  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      :class="checklistCompletionPercent === 100 ? 'bg-emerald-500' : 'bg-[#6366F1]'"
                      class="h-full transition-all duration-300"
                      :style="{ width: checklistCompletionPercent + '%' }"
                    ></div>
                  </div>

                  <!-- Checklist Items List -->
                  <div class="space-y-2">
                    <div
                      v-for="item in currentStageChecklist"
                      :key="item.id"
                      @click="handleToggleChecklistItem(item.id)"
                      :class="item.checked ? 'bg-[#F0FDF4] border-[#BBF7D0]' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'"
                      class="p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          :class="item.checked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-slate-300 text-transparent'"
                          class="w-5 h-5 rounded-md border flex items-center justify-center transition shadow-2xs shrink-0"
                        >
                          <Check class="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span
                          :class="item.checked ? 'text-emerald-950 font-bold line-through opacity-80' : 'text-[#0F172A] font-medium'"
                          class="text-xs leading-snug"
                        >
                          {{ item.text }}
                        </span>
                      </div>

                      <span
                        :class="item.checked ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' : 'text-slate-400 bg-white border border-slate-200'"
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      >
                        {{ item.checked ? 'Terpenuhi' : 'Belum' }}
                      </span>
                    </div>
                  </div>

                  <!-- Completion Alert & Advance Button if all done -->
                  <div
                    v-if="checklistCompletionPercent === 100 && getStageIndex(currentSelectedTender.stage) < stagesList.length - 1"
                    class="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-between gap-3 text-xs"
                  >
                    <div class="flex items-center gap-2 text-[#166534] font-bold">
                      <CheckCircle2 class="w-4 h-4" />
                      <span>Seluruh tindakan tahap ini telah selesai diverifikasi!</span>
                    </div>
                    <button
                      @click="advanceStage(currentSelectedTender.id, 1)"
                      class="px-3.5 py-1.5 bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                    >
                      Maju ke Tahap Selanjutnya →
                    </button>
                  </div>
                </div>
              </div>

              <!-- RIGHT CARD (5 cols): Sector Specific Stage Calculator / Guidance Tool -->
              <div class="lg:col-span-5 space-y-4">
                <div class="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-4">
                  <div class="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                    <span class="text-lg">{{ currentSectorObj.icon }}</span>
                    <div>
                      <h4 class="font-extrabold text-[#0F172A] text-sm">
                        Alat Analisis Sektor: {{ currentSectorObj.name }}
                      </h4>
                      <div class="text-[10px] text-[#475569]">Perhitungan parameter kepatuhan sektor lelang aktif</div>
                    </div>
                  </div>

                  <!-- TOOL 1: KONSTRUKSI (Kalkulator 80% HPS & Jaminan 5% HPS) -->
                  <div v-if="currentSelectedTender.sector === 'KONSTRUKSI'" class="space-y-3 text-xs">
                    <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <div class="text-[11px] font-bold text-[#0F172A]">Simulasi Ambang Batas 80% HPS (Perpres 16/2018):</div>
                      <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                          <div class="text-[10px] text-[#475569]">HPS Panitia</div>
                          <div class="font-bold font-mono text-[#0F172A]">{{ formatIDR(currentSelectedTender.hpsValue) }}</div>
                        </div>
                        <div class="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                          <div class="text-[10px] text-[#475569]">Batas 80% HPS</div>
                          <div class="font-bold font-mono text-[#9F1239]">{{ formatIDR(currentSelectedTender.hpsValue * 0.8) }}</div>
                        </div>
                      </div>
                      <div
                        :class="pricingIsBelow80 ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]' : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'"
                        class="p-2.5 rounded-lg font-bold text-[11px]"
                      >
                        <div v-if="pricingIsBelow80">
                          ⚠️ Penawaran di bawah 80% HPS ({{ ((currentSelectedTender.bidValue / (currentSelectedTender.hpsValue || 1)) * 100).toFixed(1) }}%). Wajib EKH & Jaminan Pelaksanaan 5% HPS ({{ formatIDR(currentSelectedTender.hpsValue * 0.05) }}).
                        </div>
                        <div v-else>
                          ✓ Penawaran di atas 80% HPS ({{ ((currentSelectedTender.bidValue / (currentSelectedTender.hpsValue || 1)) * 100).toFixed(1) }}%). Jaminan Pelaksanaan standar 5% Kontrak ({{ formatIDR(currentSelectedTender.bidValue * 0.05) }}).
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- TOOL 2: PERTAMBANGAN (Kalkulator HBA & Kuota DMO 25%) -->
                  <div v-else-if="currentSelectedTender.sector === 'PERTAMBANGAN'" class="space-y-3 text-xs">
                    <div class="p-3 rounded-xl bg-[#FEF3C7]/40 border border-[#FDE68A] space-y-2">
                      <div class="text-[11px] font-bold text-[#92400E]">Formula Penyesuaian Harga Indeks HBA & DMO:</div>
                      <div class="space-y-1.5 text-[11px] text-[#92400E]">
                        <div class="flex items-center justify-between">
                          <span>Indeks HBA ESDM (GAR 6322):</span>
                          <span class="font-bold font-mono text-[#0F172A]">$128.50 / Ton</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span>Spesifikasi Batubara Penawaran:</span>
                          <span class="font-bold text-[#0F172A]">5.500 kcal/kg GAR</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span>Estimasi Harga FOB Barge:</span>
                          <span class="font-bold font-mono text-[#047857]">$111.78 / MT (~Rp 1.765.000)</span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-[#FDE68A]">
                          <span>Status Pemenuhan Kuota DMO 25%:</span>
                          <span class="font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">TERPENUHI (28.4%)</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-[10px] text-[#475569] italic">
                      *Mengacu Kepmen ESDM No. 255.K/2022. Pembayaran disesuaikan Certificate of Analysis Sucofindo pada saat B/L.
                    </div>
                  </div>

                  <!-- TOOL 3: MIGAS (Kalkulator HEA PTK-007 SKK Migas) -->
                  <div v-else-if="currentSelectedTender.sector === 'MIGAS'" class="space-y-3 text-xs">
                    <div class="p-3 rounded-xl bg-[#FDF2F8] border border-[#FCE7F3] space-y-2">
                      <div class="text-[11px] font-bold text-[#9D174D]">Perhitungan Harga Evaluasi Akhir (HEA) PTK-007:</div>
                      <div class="space-y-1.5 text-[11px] text-[#9D174D]">
                        <div class="flex items-center justify-between">
                          <span>Komitmen Capaian TKDN:</span>
                          <span class="font-bold text-[#0F172A]">46.0% (Passing Grade >= 35%)</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span>Koefisien Preferensi (KP):</span>
                          <span class="font-bold font-mono text-[#4338CA]">7.5% (Maksimal Kemenperin)</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span>Harga Penawaran Nominal (HP):</span>
                          <span class="font-bold font-mono text-[#0F172A]">{{ formatIDR(currentSelectedTender.bidValue) }}</span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-[#FCE7F3] text-xs">
                          <span class="font-bold text-[#0F172A]">Nilai HEA (Untuk Peringkat):</span>
                          <span class="font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {{ formatIDR(currentSelectedTender.bidValue * (1 - 0.075)) }}
                          </span>
                        </div>
                      </div>
                      <p class="text-[10px] text-[#475569] mt-1">
                        Formula: <code>HEA = (1 - KP) × HP</code>. Keunggulan TKDN 46% memberikan diskon kompetitif 7.5% pada perangkingan Pokja.
                      </p>
                    </div>
                  </div>

                  <!-- TOOL 4: ENERGI (Kalkulator Tarif Listrik c/kWh vs BPP PLN) -->
                  <div v-else-if="currentSelectedTender.sector === 'ENERGI'" class="space-y-3 text-xs">
                    <div class="p-3 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] space-y-2">
                      <div class="text-[11px] font-bold text-[#047857]">Evaluasi Tarif Listrik EBT vs BPP PLN:</div>
                      <div class="space-y-1.5 text-[11px] text-[#047857]">
                        <div class="flex items-center justify-between">
                          <span>Penawaran Tarif Proyek:</span>
                          <span class="font-bold font-mono text-[#0F172A]">6.85 cents USD / kWh</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span>Batas BPP Pembangkitan PLN:</span>
                          <span class="font-bold font-mono text-[#0F172A]">7.42 cents USD / kWh</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span>Margin Efisiensi Tarif:</span>
                          <span class="font-bold font-mono text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">Hemat 7.68%</span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-[#D1FAE5]">
                          <span>Status Bankability Lender:</span>
                          <span class="font-bold text-[#166534]">Mandiri & ADB (AAA Rated)</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-[10px] text-[#475569] italic">
                      *Mengacu Perpres 112/2022 tentang Percepatan Pengembangan Energi Terbarukan.
                    </div>
                  </div>

                  <!-- TOOL 5: UMUM (E-Reverse Auction Simulator) -->
                  <div v-else class="space-y-3 text-xs">
                    <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <div class="text-[11px] font-bold text-[#0F172A]">Simulasi Penurunan Harga E-Reverse Auction:</div>
                      <div class="space-y-1.5 text-[11px] text-[#475569]">
                        <div class="flex items-center justify-between">
                          <span>HPS Pengadaan:</span>
                          <span class="font-bold font-mono text-[#0F172A]">{{ formatIDR(currentSelectedTender.hpsValue) }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span>Penawaran Terkini:</span>
                          <span class="font-bold font-mono text-[#4338CA]">{{ formatIDR(currentSelectedTender.bidValue) }}</span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                          <span>Batas Minimum Penurunan (Bid Increment):</span>
                          <span class="font-bold text-[#0F172A]">Rp 25.000.000 / Klik</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Navigate to Document Audit -->
                  <div class="pt-2 border-t border-[#E2E8F0]">
                    <button
                      @click="activeDetailTab = 'documents'"
                      class="w-full py-2 px-3 bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] text-xs font-bold rounded-xl border border-[#E2E8F0] transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FileCheck2 class="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>Periksa Dokumen Prasyarat (Tab 2) →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TAB 2: AUDIT DOKUMEN PERSYARATAN               -->
          <!-- ============================================== -->
          <div v-if="activeDetailTab === 'documents'" class="p-6 space-y-5 animate-in fade-in duration-150">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
              <div class="space-y-1">
                <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                  <FileCheck2 class="w-5 h-5 text-[#6366F1]" />
                  <span>Audit Dokumen Persyaratan & Kelengkapan Berkas</span>
                </h3>
                <p class="text-xs text-[#475569]">
                  Periksa status pemenuhan dokumen kualifikasi legalitas, teknis, dan finansial untuk paket <strong class="text-[#0F172A]">{{ currentSelectedTender.title }}</strong>.
                </p>
              </div>

              <!-- Quick Action & Add Button -->
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  @click="openAddDocModal(currentSelectedTender)"
                  class="px-3.5 py-2 text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>Tambah Syarat Dokumen</span>
                </button>

                <button
                  @click="legalStore.setTenderTab('vault')"
                  class="px-3.5 py-2 text-xs font-bold text-[#0F172A] bg-white border border-[#E2E8F0] hover:border-[#C7D2FE] rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Archive class="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>Buka Bank Dokumen Master</span>
                </button>
              </div>
            </div>

            <!-- Readiness Bar & Sub-Filters -->
            <div class="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-4 flex-wrap flex-1">
                <!-- Percentage Ring / Bar -->
                <div class="flex items-center gap-3">
                  <div class="w-36 bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      :class="getCompletenessColor(getTenderCompleteness(currentSelectedTender))"
                      class="h-full rounded-full transition-all duration-500"
                      :style="{ width: getTenderCompleteness(currentSelectedTender) + '%' }"
                    ></div>
                  </div>
                  <span class="font-extrabold text-[#0F172A] text-sm font-mono">
                    {{ getTenderCompleteness(currentSelectedTender) }}% Kesiapan
                  </span>
                </div>

                <div class="flex items-center gap-2 text-xs">
                  <span class="inline-flex items-center gap-1 text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-lg font-semibold border border-[#BBF7D0]">
                    <CheckCircle2 class="w-3.5 h-3.5 text-[#166534]" />
                    <span>{{ getFulfilledDocsCount(currentSelectedTender) }} Terpenuhi</span>
                  </span>

                  <span
                    v-if="getMissingDocsCount(currentSelectedTender) > 0"
                    class="inline-flex items-center gap-1 text-[#9F1239] bg-[#FFE4E6] px-2.5 py-1 rounded-lg font-bold border border-[#FECDD3]"
                  >
                    <XCircle class="w-3.5 h-3.5 text-[#9F1239]" />
                    <span>{{ getMissingDocsCount(currentSelectedTender) }} Dokumen Kurang</span>
                  </span>
                </div>
              </div>

              <!-- Filter Kategori Dokumen -->
              <div class="flex items-center gap-2 text-xs">
                <span class="text-[#475569]">Filter:</span>
                <select
                  v-model="docSubFilter"
                  class="py-1 px-2.5 text-xs font-medium border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A] outline-none"
                >
                  <option value="ALL">Semua Berkas ({{ currentSelectedTender.documents?.length || 0 }})</option>
                  <option value="TERPENUHI">Terpenuhi Saja</option>
                  <option value="KURANG">Hanya Yang Kurang / Gap</option>
                </select>
              </div>
            </div>

            <!-- Documents Table -->
            <div class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
                  <tr>
                    <th class="py-3 px-4">Nama Dokumen Persyaratan</th>
                    <th class="py-3 px-4">Kategori Berkas</th>
                    <th class="py-3 px-4">Lampiran Berkas (File)</th>
                    <th class="py-3 px-4">Masa Berlaku</th>
                    <th class="py-3 px-4">Status Kesiapan</th>
                    <th class="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E2E8F0]">
                  <tr
                    v-for="doc in getFilteredTenderDocs(currentSelectedTender)"
                    :key="doc.id"
                    :class="getDocRowBorderClass(doc.status)"
                    class="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <!-- Doc Name & Notes -->
                    <td class="py-3 px-4">
                      <div class="font-bold text-[#0F172A]">{{ doc.name }}</div>
                      <div v-if="doc.notes" class="text-[11px] text-[#475569] mt-0.5">
                        {{ doc.notes }}
                      </div>
                    </td>

                    <!-- Category -->
                    <td class="py-3 px-4 text-[#475569] whitespace-nowrap">
                      {{ doc.category }}
                    </td>

                    <!-- Attached File -->
                    <td class="py-3 px-4">
                      <div v-if="doc.fileRef" class="flex items-center gap-1.5 font-mono text-[11px] text-[#4338CA]">
                        <Paperclip class="w-3.5 h-3.5 text-[#6366F1]" />
                        <span class="truncate max-w-[180px]" :title="doc.fileRef">{{ doc.fileRef }}</span>
                      </div>
                      <div v-else class="text-[11px] text-slate-400 italic">
                        Belum dilampirkan
                      </div>
                    </td>

                    <!-- Expiry -->
                    <td class="py-3 px-4 whitespace-nowrap text-[#475569]">
                      {{ doc.expiryDate || 'Seumur Hidup / Tidak Ada' }}
                    </td>

                    <!-- Status Badge -->
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span
                        :class="getDocStatusBadgeClass(doc.status)"
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        {{ getDocStatusLabel(doc.status) }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <!-- Direct File Attachment Button -->
                        <button
                          @click="triggerDirectDocUpload(currentSelectedTender.id, doc)"
                          class="p-1.5 text-slate-500 hover:text-[#4338CA] hover:bg-[#EEF2FF] rounded-lg transition cursor-pointer"
                          title="Unggah berkas langsung dari komputer"
                        >
                          <UploadCloud class="w-4 h-4" />
                        </button>

                        <!-- Toggle Status Button -->
                        <button
                          @click="setDocStatus(currentSelectedTender.id, doc.id, doc.status === 'TERPENUHI' ? 'KURANG' : 'TERPENUHI')"
                          :class="doc.status === 'TERPENUHI' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'"
                          class="p-1.5 rounded-lg transition cursor-pointer"
                          :title="doc.status === 'TERPENUHI' ? 'Ubah status ke Kurang' : 'Tandai dokumen Terpenuhi'"
                        >
                          <Check v-if="doc.status !== 'TERPENUHI'" class="w-4 h-4" />
                          <X v-else class="w-4 h-4" />
                        </button>

                        <!-- Edit Notes -->
                        <button
                          @click="promptEditDocNotes(currentSelectedTender.id, doc)"
                          class="p-1.5 text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Edit catatan berkas"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TAB 3: EVALUASI KELAYAKAN (GO / NO-GO)         -->
          <!-- ============================================== -->
          <div v-if="activeDetailTab === 'gng'" class="p-6 space-y-6 animate-in fade-in duration-150">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Calculator class="w-5 h-5 text-[#6366F1]" />
                  <span>Kalkulator & Evaluator Kelayakan Tender (Go / No-Go Decision)</span>
                </h3>
                <p class="text-xs text-[#475569] mt-0.5">
                  Adopsi standar evaluasi multi-kriteria pembobotan internal sebelum perseroan memutuskan ikut serta dalam lelang.
                </p>
              </div>

              <!-- Live Decision Result Badge -->
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <div class="text-[10px] text-[#475569] font-bold uppercase">Skor Kelayakan</div>
                  <div class="text-2xl font-black font-mono text-[#0F172A]">
                    {{ calculatedGNGTotal }}/100
                  </div>
                </div>

                <div
                  :class="getGNGDecisionBadgeClass(calculatedGNGDecision)"
                  class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border shadow-xs"
                >
                  {{ calculatedGNGDecision }}
                </div>
              </div>
            </div>

            <!-- Scoring Rubric / Explanation -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534]">
                <strong class="block text-sm font-bold">Skor &ge; 75 : REKOMENDASI "GO"</strong>
                <span>Peluang menang tinggi, risiko terkendali, dan margin finansial memenuhi target profitabilitas.</span>
              </div>
              <div class="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
                <strong class="block text-sm font-bold">Skor 60 - 74 : "GO BERSYARAT"</strong>
                <span>Perlu mitigasi risiko kontrak, negosiasi harga vendor lokal, atau persetujuan khusus Direksi.</span>
              </div>
              <div class="p-3 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] text-[#9F1239]">
                <strong class="block text-sm font-bold">Skor &lt; 60 : "NO-GO"</strong>
                <span>Risiko penalti berat, kapasitas alat/tim tidak cukup, atau potensi kerugian finansial.</span>
              </div>
            </div>

            <!-- 6 Weighted Evaluation Criteria Form -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Kriteria 1: Strategic Fit -->
              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-[#0F172A] text-xs">
                    1. Kesesuaian Strategis & Sektor KBLI (Bobot 20%)
                  </label>
                  <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
                    Nilai: {{ gngForm.fit }}/5
                  </span>
                </div>
                <input
                  v-model.number="gngForm.fit"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  class="w-full accent-[#6366F1] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-[#475569]">
                  <span>1: Kurang Sesuai</span>
                  <span>3: Cukup Relevan</span>
                  <span>5: Inti Bisnis Unggulan</span>
                </div>
              </div>

              <!-- Kriteria 2: Team Capacity -->
              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-[#0F172A] text-xs">
                    2. Kapasitas Tim, Personel Ahli & Alat (Bobot 15%)
                  </label>
                  <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
                    Nilai: {{ gngForm.cap }}/5
                  </span>
                </div>
                <input
                  v-model.number="gngForm.cap"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  class="w-full accent-[#6366F1] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-[#475569]">
                  <span>1: Kekurangan Tim/Alat</span>
                  <span>3: Tim Siap 70%</span>
                  <span>5: Personel Lengkap & Tersedia</span>
                </div>
              </div>

              <!-- Kriteria 3: Commercial Margin -->
              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-[#0F172A] text-xs">
                    3. Margin Komersial & Profitabilitas Proyek (Bobot 25%)
                  </label>
                  <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
                    Nilai: {{ gngForm.com }}/5
                  </span>
                </div>
                <input
                  v-model.number="gngForm.com"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  class="w-full accent-[#6366F1] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-[#475569]">
                  <span>1: Margin Sangat Tipis (&lt;5%)</span>
                  <span>3: Wajar (8-11%)</span>
                  <span>5: Sangat Sehat (&gt;14%)</span>
                </div>
              </div>

              <!-- Kriteria 4: Legal & Contractual Risk -->
              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-[#0F172A] text-xs">
                    4. Risiko Hukum, Denda & Klausul Kontrak (Bobot 15%)
                  </label>
                  <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
                    Nilai: {{ gngForm.risk }}/5
                  </span>
                </div>
                <input
                  v-model.number="gngForm.risk"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  class="w-full accent-[#6366F1] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-[#475569]">
                  <span>1: Klausul Berat / Asimetris</span>
                  <span>3: Risiko Dapat Dikelola</span>
                  <span>5: Kontrak Standar Bersahabat</span>
                </div>
              </div>

              <!-- Kriteria 5: Cash Flow & Bid Bond -->
              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-[#0F172A] text-xs">
                    5. Kemampuan Cash Flow & Bank Garansi (Bobot 15%)
                  </label>
                  <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
                    Nilai: {{ gngForm.cash }}/5
                  </span>
                </div>
                <input
                  v-model.number="gngForm.cash"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  class="w-full accent-[#6366F1] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-[#475569]">
                  <span>1: Fasilitas Kredit Terbatas</span>
                  <span>3: Cash Flow Cukup</span>
                  <span>5: Fasilitas Bank Garansi Kuat</span>
                </div>
              </div>

              <!-- Kriteria 6: Technical Competitiveness -->
              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-2">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-[#0F172A] text-xs">
                    6. Keunggulan Teknis & Spesifikasi Barang/Jasa (Bobot 10%)
                  </label>
                  <span class="font-mono font-bold text-xs text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded">
                    Nilai: {{ gngForm.tech }}/5
                  </span>
                </div>
                <input
                  v-model.number="gngForm.tech"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  class="w-full accent-[#6366F1] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-[#475569]">
                  <span>1: Tanpa Keunggulan Khusus</span>
                  <span>3: Bersaing Seimbang</span>
                  <span>5: Rekam Jejak Unggul / TKDN Tinggi</span>
                </div>
              </div>
            </div>

            <!-- Notes & Sign-off -->
            <div class="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <label class="block font-bold text-[#0F172A] text-xs">
                Catatan Justifikasi & Rekomendasi Bid Committee / Direksi
              </label>
              <textarea
                v-model="gngForm.note"
                rows="2"
                placeholder="Tuliskan alasan strategis, syarat persetujuan, atau catatan mitigasi risiko..."
                class="w-full p-3 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              ></textarea>

              <div class="flex items-center justify-between pt-2">
                <span class="text-[11px] text-[#475569]">
                  Terakhir dievaluasi oleh: <strong>{{ currentSelectedTender.gng?.by || 'Belum disimpan' }}</strong>
                  <span v-if="currentSelectedTender.gng?.date">({{ currentSelectedTender.gng.date }})</span>
                </span>

                <button
                  @click="handleSaveGNG"
                  class="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check class="w-4 h-4" />
                  <span>Simpan Keputusan Go / No-Go</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TAB 4: PRICING & ANALISIS HPS (<80% HPS)       -->
          <!-- ============================================== -->
          <div v-if="activeDetailTab === 'pricing'" class="p-6 space-y-6 animate-in fade-in duration-150">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                  <DollarSign class="w-5 h-5 text-[#6366F1]" />
                  <span>Struktur Pricing & Deteksi Anomali HPS (&lt;80% Pagu)</span>
                </h3>
                <p class="text-xs text-[#475569] mt-0.5">
                  Analisis perbandingan harga penawaran terhadap HPS panitia sesuai aturan Perpres 16/2018 & LKPP.
                </p>
              </div>
            </div>

            <!-- REGULATORY ALERT BANNER IF BID < 80% HPS -->
            <div
              v-if="pricingIsBelow80"
              class="p-5 rounded-2xl bg-[#FFE4E6] border-2 border-[#FDA4AF] text-[#9F1239] shadow-sm space-y-2 animate-in zoom-in-95 duration-150"
            >
              <div class="flex items-center gap-2">
                <AlertTriangle class="w-5 h-5 text-[#9F1239] shrink-0" />
                <h4 class="text-sm font-extrabold tracking-tight">
                  PERINGATAN REGULASI PENGADAAN (PERPRES 16/2018 & LKPP NO. 12/2021)
                </h4>
              </div>
              <p class="text-xs leading-relaxed">
                Penawaran diajukan sebesar <strong>{{ formatIDR(pricingForm.bidValue) }}</strong> atau
                <strong>{{ ((pricingForm.bidValue / (pricingForm.hpsValue || 1)) * 100).toFixed(1) }}%</strong> dari Nilai HPS (<strong>di bawah batas ambang 80% HPS</strong>).
              </p>
              <div class="p-3 bg-white/80 rounded-xl text-xs space-y-1 font-medium border border-[#FECDD3]">
                <div class="flex items-center gap-2 text-rose-900 font-bold">
                  <span>✓ Kewajiban 1:</span>
                  <span>Wajib menyiapkan Dokumen Evaluasi Kewajaran Harga (EKH) dan Analisa Harga Satuan Pekerjaan (AHSP) timpang.</span>
                </div>
                <div class="flex items-center gap-2 text-rose-900 font-bold">
                  <span>✓ Kewajiban 2:</span>
                  <span>
                    Besaran Jaminan Pelaksanaan (Performance Bond) naik menjadi <strong>5% dari Nilai HPS</strong>
                    (sebesar <strong class="underline font-mono">{{ formatIDR(pricingForm.hpsValue * 0.05) }}</strong>), BUKAN 5% dari nilai kontrak!
                  </span>
                </div>
              </div>
            </div>

            <!-- Financial Comparison Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div class="text-[11px] text-[#475569] font-semibold">Pagu HPS Panitia</div>
                <div class="text-xl font-bold font-mono text-[#0F172A] mt-1">
                  {{ formatIDR(pricingForm.hpsValue) }}
                </div>
                <div class="text-[10px] text-[#475569] mt-1">Owner Estimate (OE) Pokja</div>
              </div>

              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                <div class="text-[11px] text-[#475569] font-semibold">Nilai Penawaran Peserta</div>
                <div class="text-xl font-bold font-mono text-[#4338CA] mt-1">
                  {{ formatIDR(pricingForm.bidValue) }}
                </div>
                <div class="text-[10px] text-emerald-600 font-semibold mt-1">
                  Rasio: {{ ((pricingForm.bidValue / (pricingForm.hpsValue || 1)) * 100).toFixed(1) }}% HPS
                </div>
              </div>

              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                <div class="text-[11px] text-[#475569] font-semibold">Target Margin Laba</div>
                <div class="text-xl font-bold font-mono text-emerald-700 mt-1">
                  {{ pricingForm.marginPercent }}%
                </div>
                <div class="text-[10px] text-[#475569] mt-1">
                  Estimasi Laba: <strong>{{ formatIDR((pricingForm.bidValue * pricingForm.marginPercent) / 100) }}</strong>
                </div>
              </div>

              <div class="p-4 rounded-xl border border-[#E2E8F0] bg-[#EEF2FF]">
                <div class="text-[11px] text-[#4338CA] font-semibold">Jaminan Pelaksanaan (PB)</div>
                <div class="text-xl font-bold font-mono text-[#4338CA] mt-1">
                  {{ formatIDR(pricingIsBelow80 ? pricingForm.hpsValue * 0.05 : pricingForm.bidValue * 0.05) }}
                </div>
                <div class="text-[10px] text-[#4338CA] font-semibold mt-1">
                  {{ pricingIsBelow80 ? 'Wajib 5% HPS (Klausul <80%)' : '5% dari Nilai Kontrak' }}
                </div>
              </div>
            </div>

            <!-- Cost Breakdown Inputs -->
            <div class="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-4">
              <h4 class="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Rincian Estimasi Biaya & Struktur Penawaran (Cost Breakdown)
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label class="block font-bold text-[#0F172A] mb-1">Pagu HPS Panitia (IDR)</label>
                  <input
                    v-model.number="pricingForm.hpsValue"
                    type="number"
                    min="0"
                    class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
                  />
                </div>

                <div>
                  <label class="block font-bold text-[#0F172A] mb-1">Nilai Penawaran (IDR)</label>
                  <input
                    v-model.number="pricingForm.bidValue"
                    type="number"
                    min="0"
                    class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
                  />
                </div>

                <div>
                  <label class="block font-bold text-[#0F172A] mb-1">Biaya Langsung (Direct Cost)</label>
                  <input
                    v-model.number="pricingForm.directCost"
                    type="number"
                    min="0"
                    placeholder="Material, Pekerja, Alat"
                    class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
                  />
                </div>

                <div>
                  <label class="block font-bold text-[#0F172A] mb-1">Target Margin (%)</label>
                  <input
                    v-model.number="pricingForm.marginPercent"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full p-2.5 border border-[#E2E8F0] rounded-xl font-mono text-xs bg-white text-[#0F172A] outline-none focus:ring-2 focus:ring-[#C7D2FE]"
                  />
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button
                  @click="handleSavePricing"
                  class="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check class="w-4 h-4" />
                  <span>Perbarui Analisis Pricing & HPS</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TAB 5: REVIEW 4-GATE & PENGUNCIAN PAKET        -->
          <!-- ============================================== -->
          <div v-if="activeDetailTab === 'gates'" class="p-6 space-y-6 animate-in fade-in duration-150">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                  <ShieldCheck class="w-5 h-5 text-[#6366F1]" />
                  <span>4-Gate Review Matrix & Penguncian Paket Submission</span>
                </h3>
                <p class="text-xs text-[#475569] mt-0.5">
                  Persetujuan berjenjang wajib lolos Gate 1 s/d 4 sebelum dokumen penawaran dikunci dengan SHA-256 hash.
                </p>
              </div>

              <!-- Freeze Action Button -->
              <div>
                <button
                  v-if="!currentSelectedTender.locked"
                  @click="handleLockPackage"
                  class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Lock class="w-4 h-4" />
                  <span>Kunci Paket Penawaran (Freeze Submission)</span>
                </button>

                <div v-else class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] text-xs font-bold">
                    <Lock class="w-4 h-4" />
                    <span>Paket Terkunci (Hash Integritas Aktif)</span>
                  </span>
                  <button
                    @click="isUnlockModalOpen = true"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Buka Kunci
                  </button>
                </div>
              </div>
            </div>

            <!-- Hash Integrity Banner if locked -->
            <div
              v-if="currentSelectedTender.locked"
              class="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-[#059669]" />
                  <strong class="font-bold">Paket Submission Terkunci & Bersertifikasi Integritas</strong>
                </div>
                <div class="font-mono text-[11px] text-[#047857] truncate max-w-xl">
                  {{ currentSelectedTender.hash || 'SHA256:7f8b9a1c4d2e5f30e6a12b89c7d41f0a2e5d9c8b7a6f5e4d3c2b1a0f9e8d7c6b' }}
                </div>
              </div>

              <div class="text-[11px] text-[#047857] shrink-0 font-medium">
                Waktu Kunci: <strong>{{ currentSelectedTender.submittedAt || '2026-03-30 14:00' }}</strong>
              </div>
            </div>

            <!-- 4-Gate Matrix Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="(gate, gIdx) in (currentSelectedTender.gates || defaultGates)"
                :key="gate.id"
                class="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase text-[#475569]">
                      Tahap {{ gIdx + 1 }} dari 4
                    </span>
                    <span
                      :class="getGateStatusBadgeClass(gate.status)"
                      class="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                    >
                      {{ gate.status }}
                    </span>
                  </div>

                  <h4 class="text-xs font-extrabold text-[#0F172A] mt-1.5 leading-snug">
                    {{ gate.name }}
                  </h4>

                  <div class="text-[11px] text-[#475569] mt-1">
                    Reviewer: <strong class="text-[#0F172A]">{{ gate.reviewer }}</strong>
                  </div>

                  <div v-if="gate.note" class="text-[11px] text-[#475569] mt-2 p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    "{{ gate.note }}"
                  </div>

                  <div v-if="gate.date" class="text-[10px] text-slate-400 mt-2">
                    Disetujui: {{ gate.date }} ({{ gate.approvedBy || gate.reviewer }})
                  </div>
                </div>

                <!-- Gate Actions -->
                <div v-if="!currentSelectedTender.locked" class="pt-2 border-t border-[#E2E8F0] flex items-center gap-2">
                  <button
                    v-if="gate.status !== 'SELESAI'"
                    @click="handleApproveGate(gate.id)"
                    class="flex-1 py-1.5 px-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[11px] font-bold rounded-lg transition cursor-pointer text-center"
                  >
                    Setujui Gate
                  </button>
                  <button
                    v-if="gate.status !== 'SELESAI'"
                    @click="handleRejectGate(gate.id)"
                    class="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-[11px] font-medium rounded-lg transition cursor-pointer"
                  >
                    Revisi
                  </button>
                  <span v-else class="text-[11px] text-[#166534] font-bold flex items-center gap-1">
                    <Check class="w-3.5 h-3.5 text-[#166534]" /> Lolos Gate
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TAB 6: LOG AANWIJZING & KLARIFIKASI            -->
          <!-- ============================================== -->
          <div v-if="activeDetailTab === 'clarifications'" class="p-6 space-y-5 animate-in fade-in duration-150">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                  <HelpCircle class="w-5 h-5 text-[#6366F1]" />
                  <span>Log Aanwijzing & Berita Acara Pemberian Penjelasan (BAPP)</span>
                </h3>
                <p class="text-xs text-[#475569] mt-0.5">
                  Daftar pertanyaan teknis dan komersial yang diajukan ke Pokja serta dampaknya terhadap penawaran.
                </p>
              </div>

              <button
                @click="isAddClarificationModalOpen = true"
                class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus class="w-4 h-4" />
                <span>Tambah Pertanyaan Aanwijzing</span>
              </button>
            </div>

            <!-- Clarifications Table -->
            <div v-if="(currentSelectedTender.clarifications || []).length > 0" class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
                  <tr>
                    <th class="py-3 px-4">No & Pertanyaan Diajukan</th>
                    <th class="py-3 px-4">Kategori & Dampak</th>
                    <th class="py-3 px-4">Jawaban Resmi Panitia (Pokja)</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E2E8F0]">
                  <tr
                    v-for="c in currentSelectedTender.clarifications"
                    :key="c.id"
                    class="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td class="py-3 px-4 max-w-sm">
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-[10px] font-bold text-[#4338CA] bg-[#EEF2FF] px-1.5 py-0.5 rounded">
                          {{ c.id }}
                        </span>
                        <span class="text-[11px] text-[#475569]">{{ c.date }}</span>
                      </div>
                      <div class="font-bold text-[#0F172A] mt-1">{{ c.query }}</div>
                      <div class="text-[10px] text-[#475569] mt-0.5">Penanya: {{ c.askedBy }}</div>
                    </td>

                    <td class="py-3 px-4 whitespace-nowrap">
                      <div class="font-semibold text-[#0F172A]">{{ c.category }}</div>
                      <div class="text-[11px] text-[#475569] mt-0.5">Dampak: {{ c.impact }}</div>
                    </td>

                    <td class="py-3 px-4 max-w-md">
                      <div v-if="c.answer" class="text-xs text-[#0F172A] leading-relaxed">
                        {{ c.answer }}
                        <div v-if="c.effect" class="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          Efek: {{ c.effect }}
                        </div>
                      </div>
                      <div v-else class="text-xs text-amber-700 italic">
                        Menunggu jawaban pada Berita Acara Pemberian Penjelasan (BAPP)
                      </div>
                    </td>

                    <td class="py-3 px-4 whitespace-nowrap">
                      <span
                        :class="c.status === 'DIJAWAB' ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]' : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'"
                        class="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      >
                        {{ c.status === 'DIJAWAB' ? 'DIJAWAB POKJA' : 'MENUNGGU POKJA' }}
                      </span>
                    </td>

                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        @click="openAnswerClarModal(c)"
                        class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-lg transition cursor-pointer"
                      >
                        Catat Jawaban
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="p-8 text-center border border-dashed border-[#E2E8F0] rounded-2xl bg-white text-xs text-[#475569]">
              Belum ada pertanyaan aanwijzing yang dicatatkan untuk paket lelang ini.
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TAB 7: HASIL LELANG & KONVERSI KONTRAK         -->
          <!-- ============================================== -->
          <div v-if="activeDetailTab === 'result'" class="p-6 space-y-6 animate-in fade-in duration-150">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Award class="w-5 h-5 text-[#6366F1]" />
                  <span>Hasil Penetapan Pemenang Lelang & Konversi Kontrak</span>
                </h3>
                <p class="text-xs text-[#475569] mt-0.5">
                  Rekam hasil pengumuman resmi dan secara otomatis konversi paket yang menang menjadi Kontrak Korporasi aktif.
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="openRecordResultModal"
                  class="px-4 py-2 bg-white border border-[#E2E8F0] hover:border-[#C7D2FE] text-[#0F172A] text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Catat Hasil Pemenang
                </button>
              </div>
            </div>

            <!-- WON BANNER & ONE-CLICK CONVERT BUTTON -->
            <div
              v-if="currentSelectedTender.status === 'WON' || currentSelectedTender.status === 'WIN' || currentSelectedTender.status === 'CONVERTED'"
              class="p-6 rounded-2xl bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#ECFDF5] border-2 border-[#86EFAC] shadow-xs space-y-4"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <Award class="w-6 h-6 text-emerald-600" />
                    <span class="text-base font-extrabold text-emerald-900">
                      SELAMAT! PAKET INI DINYATAKAN SEBAGAI PEMENANG LELANG (PERINGKAT 1)
                    </span>
                  </div>
                  <p class="text-xs text-emerald-800">
                    Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) telah diterbitkan. Paket siap ditransisikan ke manajemen kontrak aktif.
                  </p>
                </div>

                <!-- Convert / Converted button -->
                <div>
                  <button
                    v-if="currentSelectedTender.status !== 'CONVERTED'"
                    @click="handleConvertToContract"
                    class="px-5 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
                  >
                    <FileSignature class="w-4 h-4" />
                    <span>Konversi Menjadi Kontrak Korporasi Sekarang →</span>
                  </button>

                  <div v-else class="flex items-center gap-2">
                    <span class="px-3 py-1.5 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold">
                      ✓ Telah Dikonversi: {{ currentSelectedTender.convertedContractId }}
                    </span>
                    <button
                      @click="legalStore.navigate('contracts', currentSelectedTender.convertedContractId)"
                      class="px-3 py-1.5 bg-[#6366F1] text-white text-xs font-bold rounded-xl hover:bg-[#4F46E5] transition"
                    >
                      Buka di Modul Kontrak →
                    </button>
                  </div>
                </div>
              </div>

              <!-- Result Specs -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
                  <div class="text-[10px] text-emerald-700 font-bold">Nilai Kontrak Dimenangkan</div>
                  <div class="text-sm font-bold font-mono text-emerald-900 mt-0.5">
                    {{ formatIDR(currentSelectedTender.result?.winPrice || currentSelectedTender.bidValue) }}
                  </div>
                </div>

                <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
                  <div class="text-[10px] text-emerald-700 font-bold">Entitas Pemenang</div>
                  <div class="text-sm font-bold text-emerald-900 mt-0.5">
                    {{ currentSelectedTender.result?.winner || currentSelectedTender.company }}
                  </div>
                </div>

                <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
                  <div class="text-[10px] text-emerald-700 font-bold">Sektor Industri</div>
                  <div class="text-sm font-bold text-emerald-900 mt-0.5">
                    {{ getSectorBadge(currentSelectedTender.sector).label }}
                  </div>
                </div>

                <div class="p-3 bg-white/80 rounded-xl border border-emerald-200">
                  <div class="text-[10px] text-emerald-700 font-bold">Tanggal Penetapan</div>
                  <div class="text-sm font-bold text-emerald-900 mt-0.5">
                    {{ currentSelectedTender.result?.date || '2026-02-05' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Lessons Learned List -->
            <div class="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-3">
              <h4 class="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp class="w-4 h-4 text-[#6366F1]" />
                <span>Evaluasi & Lessons Learned (Pembelajaran Tender Berikutnya)</span>
              </h4>

              <div class="space-y-2 text-xs">
                <div
                  v-for="(lesson, lIdx) in (currentSelectedTender.result?.lessons || defaultLessons)"
                  :key="lIdx"
                  class="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[#0F172A] flex items-start gap-2"
                >
                  <span class="font-bold text-[#4338CA]">{{ lIdx + 1 }}.</span>
                  <span class="leading-relaxed">{{ lesson }}</span>
                </div>
              </div>
            </div>
          </div>

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
    <!-- MODAL: DAFTARKAN PAKET LELANG BARU             -->
    <!-- ============================================== -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center border border-[#C7D2FE] text-[#6366F1]">
              <FileSpreadsheet class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Pendaftaran Paket Lelang & Pengadaan Baru</h3>
              <p class="text-xs text-slate-300">Catat paket tender dengan opsi sektor: Konstruksi, Tambang, Migas, Energi, dll.</p>
            </div>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white p-1 cursor-pointer transition">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitNewTender" class="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <!-- Sektor Selection (Pilihan Konstruksi, Tambang, dll) -->
          <div class="p-3.5 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE]">
            <label class="block font-bold text-[#4338CA] mb-1.5 text-xs">
              Sektor Proyek / Industri Lelang *
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="s in sectorOptions"
                :key="s.value"
                :class="newTenderForm.sector === s.value ? 'bg-white text-[#4338CA] border-2 border-[#6366F1] shadow-xs' : 'bg-white/60 text-[#475569] border border-[#E2E8F0] hover:bg-white'"
                class="flex items-center gap-2 p-2 rounded-xl cursor-pointer text-xs font-bold transition"
              >
                <input
                  type="radio"
                  v-model="newTenderForm.sector"
                  :value="s.value"
                  class="sr-only"
                />
                <span>{{ s.icon }}</span>
                <span class="truncate">{{ s.label }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Judul / Nama Paket Pengadaan *</label>
            <input
              v-model="newTenderForm.title"
              type="text"
              required
              placeholder="Contoh: Pekerjaan Pembangunan Terowongan & Jembatan Patimban Paket 4"
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Nomor Pengumuman / Tender *</label>
              <input
                v-model="newTenderForm.tenderNumber"
                type="text"
                required
                placeholder="Contoh: PUPR-BM-2026-902"
                class="w-full px-3 py-2.5 text-xs font-mono border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Instansi / Panitia Penyelenggara *</label>
              <input
                v-model="newTenderForm.organizer"
                type="text"
                required
                placeholder="Contoh: Balai Besar Pelaksanaan Jalan Nasional PUPR"
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan Peserta *</label>
              <select
                v-model="newTenderForm.company"
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Java Power Solutions">PT Java Power Solutions</option>
                <option value="PT Borneo Mineral Resources">PT Borneo Mineral Resources</option>
                <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kategori Pengadaan</label>
              <input
                v-model="newTenderForm.category"
                type="text"
                placeholder="Contoh: Konstruksi & Rekayasa Sipil"
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Pagu Anggaran HPS (IDR) *</label>
              <input
                v-model.number="newTenderForm.hpsValue"
                type="number"
                min="0"
                required
                placeholder="Contoh: 150000000000"
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Estimasi Nilai Penawaran (IDR)</label>
              <input
                v-model.number="newTenderForm.bidValue"
                type="number"
                min="0"
                placeholder="Contoh: 125000000000"
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tahapan Saat Ini</label>
              <select
                v-model="newTenderForm.stage"
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="PERSIAPAN_PENGADAAN">1. Persiapan Pengadaan</option>
                <option value="PENGUMUMAN_PENDAFTARAN">2. Pengumuman & Pendaftaran</option>
                <option value="AANWIJZING">3. Pemberian Penjelasan</option>
                <option value="PENYAMPAIAN_PENAWARAN">4. Penyampaian Penawaran</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Batas Akhir Penawaran *</label>
              <input
                v-model="newTenderForm.deadlineDate"
                type="date"
                required
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">PIC Legal / Bid Lead</label>
              <input
                v-model="newTenderForm.pic"
                type="text"
                placeholder="Contoh: Budi Santoso, S.H."
                class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan Tambahan</label>
            <textarea
              v-model="newTenderForm.notes"
              rows="2"
              placeholder="Catatan ruang lingkup atau syarat khusus lelang..."
              class="w-full px-3 py-2.5 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] text-[#0F172A] bg-white"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus class="w-4 h-4" />
              <span>Daftarkan Paket</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Hidden file input for direct document uploading -->
    <input
      ref="directDocFileInputRef"
      type="file"
      class="hidden"
      @change="onDirectDocFilePicked"
    />

    <!-- MODAL: TAMBAH SYARAT DOKUMEN -->
    <div
      v-if="isAddDocModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddDocModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Tambah Syarat Dokumen Pengadaan</h3>
          <button @click="isAddDocModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <form @submit.prevent="submitNewDocRequirement" class="space-y-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Dokumen Persyaratan *</label>
            <input
              v-model="newDocForm.name"
              type="text"
              required
              placeholder="Contoh: Sertifikat Kelaikan Operasi (SLO) atau Jaminan Penawaran"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kategori Dokumen</label>
              <select
                v-model="newDocForm.category"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="Legal Administrasi">Legal Administrasi</option>
                <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
                <option value="Finansial & Keuangan">Finansial & Keuangan</option>
                <option value="Kepatuhan & Integritas">Kepatuhan & Integritas</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Status Kesiapan</label>
              <select
                v-model="newDocForm.status"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="TERPENUHI">TERPENUHI (Sudah Siap)</option>
                <option value="KURANG">KURANG (Belum Ada Berkas)</option>
                <option value="DALAM_PROSES">DALAM PROSES (Sedang Diurus)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan / Rincian Persyaratan</label>
            <textarea
              v-model="newDocForm.notes"
              rows="2"
              placeholder="Nomor dokumen, penerbit, atau catatan teknis..."
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddDocModalOpen = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
            >
              Simpan Dokumen
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: TAMBAH PERTANYAAN AANWIJZING -->
    <div
      v-if="isAddClarificationModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddClarificationModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Ajukan Pertanyaan Klarifikasi / Aanwijzing</h3>
          <button @click="isAddClarificationModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <form @submit.prevent="handleAddClarification" class="space-y-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Pertanyaan / Poin Klarifikasi *</label>
            <textarea
              v-model="clarificationForm.query"
              rows="3"
              required
              placeholder="Contoh: Mohon konfirmasi apakah jaminan pelaksanaan dapat menggunakan Bank Garansi dari Bank Himbara non-lokal..."
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kategori Pertanyaan</label>
              <select
                v-model="clarificationForm.category"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option value="Teknis & Spesifikasi">Teknis & Spesifikasi</option>
                <option value="Komersial & Harga">Komersial & Harga</option>
                <option value="Ruang Lingkup (Scope)">Ruang Lingkup (Scope)</option>
                <option value="Kepatuhan & Regulasi">Kepatuhan & Regulasi</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Estimasi Dampak</label>
              <input
                v-model="clarificationForm.impact"
                type="text"
                placeholder="Contoh: Jadwal & Biaya"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddClarificationModalOpen = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
            >
              Kirim Pertanyaan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: CATAT JAWABAN POKJA -->
    <div
      v-if="isAnswerClarModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAnswerClarModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Catat Jawaban Resmi Panitia (BAPP)</h3>
          <button @click="isAnswerClarModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <form @submit.prevent="handleAnswerClarification" class="space-y-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Pertanyaan Sebelumnya</label>
            <div class="p-2.5 bg-[#F8FAFC] rounded-xl text-xs text-[#475569] border border-[#E2E8F0]">
              {{ selectedClarToAnswer?.query }}
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Jawaban Pokja / Panitia *</label>
            <textarea
              v-model="answerForm.answer"
              rows="3"
              required
              placeholder="Kutipan resmi dari Berita Acara Pemberian Penjelasan..."
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Efek / Tindak Lanjut pada Dokumen Penawaran</label>
            <input
              v-model="answerForm.effect"
              type="text"
              placeholder="Contoh: Menyesuaikan BoQ item 4.2 dan kurva S pekerjaan"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAnswerClarModalOpen = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
            >
              Simpan Jawaban
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: CATAT HASIL PEMENANG LELANG -->
    <div
      v-if="isRecordResultModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isRecordResultModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Catat Hasil Pengumuman Pemenang</h3>
          <button @click="isRecordResultModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <form @submit.prevent="handleRecordResult" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Hasil Akhir *</label>
              <select
                v-model="resultForm.resultStatus"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl font-bold bg-white text-[#0F172A]"
              >
                <option value="MENANG">MENANG (Juara 1)</option>
                <option value="KALAH">GUGUR / KALAH</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Peringkat Akhir</label>
              <input
                v-model.number="resultForm.rank"
                type="number"
                min="1"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl font-mono bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Pemenang Terpilih</label>
            <input
              v-model="resultForm.winner"
              type="text"
              placeholder="Contoh: PT Nusantara Energi (atau nama konsorsium/kompetitor)"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nilai Penawaran Pemenang (IDR)</label>
            <input
              v-model.number="resultForm.winPrice"
              type="number"
              min="0"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl font-mono bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan Evaluasi Pokja</label>
            <textarea
              v-model="resultForm.note"
              rows="2"
              placeholder="Surat keputusan penetapan pemenang atau evaluasi teknis/harga..."
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#0F172A]"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isRecordResultModalOpen = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
            >
              Simpan Hasil
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: BUKA KUNCI PAKET (UNLOCK) -->
    <div
      v-if="isUnlockModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isUnlockModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E2E8F0] p-6 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Buka Kunci Paket Penawaran</h3>
          <button @click="isUnlockModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <p class="text-xs text-[#475569]">
          Membuka kunci paket akan menonaktifkan status freeze dan hash submission agar revisi administratif dapat dilakukan.
        </p>

        <div>
          <label class="block font-bold text-[#0F172A] mb-1">Alasan Pembukaan Kunci *</label>
          <textarea
            v-model="unlockReasonInput"
            rows="2"
            placeholder="Contoh: Koreksi lampiran AHSP atas permintaan klarifikasi panitia..."
            class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#0F172A]"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
          <button
            @click="isUnlockModalOpen = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
          >
            Batal
          </button>
          <button
            @click="handleUnlockPackage"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
          >
            Konfirmasi Buka Kunci
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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
const isAddDocModalOpen = ref(false);
const isAddClarificationModalOpen = ref(false);
const isAnswerClarModalOpen = ref(false);
const isRecordResultModalOpen = ref(false);
const isUnlockModalOpen = ref(false);

const activeTenderForDoc = ref(null);
const directDocFileInputRef = ref(null);
const directUploadTargetDoc = ref(null);
const selectedClarToAnswer = ref(null);
const unlockReasonInput = ref('Koreksi administratif dokumen penawaran');

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

// Form Models
const newTenderForm = ref({
  title: '',
  tenderNumber: '',
  organizer: '',
  company: 'PT Nusantara Energi',
  category: 'Konstruksi & Infrastruktur',
  sector: 'KONSTRUKSI',
  hpsValue: null,
  bidValue: null,
  deadlineDate: '',
  stage: 'PERSIAPAN_PENGADAAN',
  pic: 'Budi Santoso, S.H., LL.M.',
  notes: ''
});

const newDocForm = ref({
  name: '',
  category: 'Legal Administrasi',
  status: 'KURANG',
  notes: ''
});

const clarificationForm = ref({
  query: '',
  category: 'Teknis & Spesifikasi',
  impact: 'Spesifikasi & Biaya',
  askedBy: 'Tim Rekayasa & Legal'
});

const answerForm = ref({
  answer: '',
  effect: ''
});

const resultForm = ref({
  resultStatus: 'MENANG',
  winner: '',
  rank: 1,
  winPrice: null,
  note: ''
});

// Interactive GNG & Pricing state
const gngForm = ref({
  fit: 4,
  cap: 4,
  com: 4,
  risk: 3,
  cash: 4,
  tech: 4,
  note: ''
});

const pricingForm = ref({
  hpsValue: 0,
  bidValue: 0,
  directCost: 0,
  marginPercent: 11.5
});

// Default Gates & Lessons
const defaultGates = [
  { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2026-02-14', note: 'Kesesuaian spesifikasi & kapasitas peralatan lengkap' },
  { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'MENUNGGU', date: null, note: 'Validasi cash flow & skema termin' },
  { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'BERIKUTNYA', date: null, note: 'Pengecekan draft kontrak & mitigasi penalti' },
  { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Utama', status: 'BERIKUTNYA', date: null, note: 'Persetujuan akhir sebelum submission' }
];

const defaultLessons = [
  'Verifikasi dini masa berlaku berkas Dokumen Vault menghemat waktu persiapan submission hingga 60%.',
  'Penawaran dengan struktur biaya langsung efisien dan pemenuhan TKDN memberi nilai keunggulan kompetitif.',
  'Komunikasi aktif pada masa Aanwijzing memperjelas ruang lingkup pekerjaan dan menurunkan risiko klaim di kemudian hari.'
];

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
  if (t.gng?.scores) {
    gngForm.value = {
      fit: t.gng.scores.fit || 4,
      cap: t.gng.scores.cap || 4,
      com: t.gng.scores.com || 4,
      risk: t.gng.scores.risk || 3,
      cash: t.gng.scores.cash || 4,
      tech: t.gng.scores.tech || 4,
      note: t.gng.note || ''
    };
  }
  pricingForm.value = {
    hpsValue: t.hpsValue || 0,
    bidValue: t.bidValue || 0,
    directCost: t.pricing?.directCost || Math.round((t.bidValue || 0) * 0.78),
    marginPercent: t.pricing?.marginPercent || 11.5
  };
}, { immediate: true });

// Live GNG Calculation
const calculatedGNGTotal = computed(() => {
  const weights = { fit: 20, cap: 15, com: 25, risk: 15, cash: 15, tech: 10 };
  let total = 0;
  total += (gngForm.value.fit / 5) * weights.fit;
  total += (gngForm.value.cap / 5) * weights.cap;
  total += (gngForm.value.com / 5) * weights.com;
  total += (gngForm.value.risk / 5) * weights.risk;
  total += (gngForm.value.cash / 5) * weights.cash;
  total += (gngForm.value.tech / 5) * weights.tech;
  return Math.round(total);
});

const calculatedGNGDecision = computed(() => {
  const sc = calculatedGNGTotal.value;
  if (sc >= 75) return 'GO';
  if (sc >= 60) return 'GO_BERSYARAT';
  return 'NO_GO';
});

// Live Pricing <80% HPS check
const pricingIsBelow80 = computed(() => {
  if (!pricingForm.value.hpsValue || pricingForm.value.hpsValue <= 0) return false;
  return (pricingForm.value.bidValue / pricingForm.value.hpsValue) < 0.8;
});

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
const currentSectorObj = computed(() => {
  const code = currentSelectedTender.value?.sector || 'KONSTRUKSI';
  return (legalStore.state.masterSectors || []).find(s => s.code === code) || {
    code,
    name: currentSelectedTender.value?.sectorLabel || code,
    icon: '🏗️',
    regulatoryBasis: 'Perpres 16/2018',
    workflowTemplate: 'SPSE_KONSTRUKSI_8',
    description: 'Pengadaan Terstruktur'
  };
});

const currentStageGuidance = computed(() => {
  if (!currentSelectedTender.value) return {};
  return legalStore.getStageGuidance(currentSelectedTender.value.sector, currentSelectedTender.value.stage);
});

const currentStageChecklist = computed(() => {
  if (!currentSelectedTender.value) return [];
  return legalStore.getStageChecklist(
    currentSelectedTender.value.sector,
    currentSelectedTender.value.stage,
    currentSelectedTender.value.id
  );
});

const completedChecklistCount = computed(() => {
  return currentStageChecklist.value.filter(i => i.checked).length;
});

const checklistCompletionPercent = computed(() => {
  const len = currentStageChecklist.value.length;
  if (!len) return 100;
  return Math.round((completedChecklistCount.value / len) * 100);
});

function handleToggleChecklistItem(itemId) {
  if (!currentSelectedTender.value) return;
  legalStore.toggleStageChecklistItem(
    currentSelectedTender.value.id,
    currentSelectedTender.value.stage,
    itemId
  );
}

function handleCompleteAllChecklist() {
  if (!currentSelectedTender.value) return;
  legalStore.completeAllStageChecklist(
    currentSelectedTender.value.id,
    currentSelectedTender.value.stage
  );
}

function handleChangeTenderSector(newSector) {
  if (!currentSelectedTender.value) return;
  legalStore.updateTenderSector(currentSelectedTender.value.id, newSector);
}

const stagesList = computed(() => {
  const sector = currentSelectedTender.value?.sector || 'KONSTRUKSI';
  return legalStore.getStagesForSector(sector);
});

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

function getTenderCompleteness(t) {
  if (!t.documents || t.documents.length === 0) return 0;
  const fulfilled = t.documents.filter(d => d.status === 'TERPENUHI').length;
  return Math.round((fulfilled / t.documents.length) * 100);
}

function getFulfilledDocsCount(t) {
  return t.documents?.filter(d => d.status === 'TERPENUHI').length || 0;
}

function getMissingDocsCount(t) {
  return t.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
}

function getCompletenessColor(pct) {
  if (pct === 100) return 'bg-emerald-500';
  if (pct >= 75) return 'bg-[#6366F1]';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}

function getStageIndex(stageKey) {
  return stagesList.value.findIndex(s => s.key === stageKey);
}

function getStageProgressWidth(currentStageKey) {
  const idx = getStageIndex(currentStageKey);
  if (idx <= 0) return '0%';
  const len = stagesList.value.length;
  if (len <= 1) return '100%';
  const pct = (idx / (len - 1)) * 100;
  return pct + '%';
}

function isStageCompleted(currentStageKey, checkStageKey) {
  const curIdx = getStageIndex(currentStageKey);
  const chkIdx = getStageIndex(checkStageKey);
  return curIdx > chkIdx;
}

function getStageCircleClass(currentStageKey, stepStageKey, sIdx) {
  const curIdx = getStageIndex(currentStageKey);
  if (currentStageKey === stepStageKey) {
    return 'bg-[#6366F1] text-white ring-4 ring-[#C7D2FE] scale-110';
  }
  if (curIdx > sIdx) {
    return 'bg-[#0F172A] text-white border border-[#0F172A]';
  }
  return 'bg-white text-slate-400 border border-slate-300';
}

function getStageLabel(stageKey) {
  const found = stagesList.value.find(s => s.key === stageKey);
  return found ? found.name : stageKey;
}

function getStageDescription(stageKey) {
  const found = stagesList.value.find(s => s.key === stageKey);
  return found ? found.description : '';
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

function getDocStatusLabel(status) {
  switch (status) {
    case 'TERPENUHI': return 'Terpenuhi (Valid)';
    case 'KURANG': return 'Kurang (Belum Ada)';
    case 'DALAM_PROSES': return 'Dalam Proses Pengurusan';
    case 'KEDALUWARSA': return 'Kedaluwarsa (Perlu Update)';
    default: return status;
  }
}

function getDocStatusBadgeClass(status) {
  switch (status) {
    case 'TERPENUHI': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'KURANG': return 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]';
    case 'DALAM_PROSES': return 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
    default: return 'bg-slate-100 text-slate-800';
  }
}

function getDocRowBorderClass(status) {
  switch (status) {
    case 'KURANG': return 'border-rose-100 bg-rose-50/20';
    case 'DALAM_PROSES': return 'border-amber-100 bg-amber-50/20';
    default: return 'border-[#E2E8F0]';
  }
}

function getFilteredTenderDocs(tender) {
  if (!tender.documents) return [];
  if (docSubFilter.value === 'ALL') return tender.documents;
  if (docSubFilter.value === 'TERPENUHI') return tender.documents.filter(d => d.status === 'TERPENUHI');
  if (docSubFilter.value === 'KURANG') return tender.documents.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA' || d.status === 'DALAM_PROSES');
  return tender.documents;
}

function getGNGDecisionBadgeClass(decision) {
  switch (decision) {
    case 'GO': return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
    case 'GO_BERSYARAT': return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'NO_GO': return 'bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3]';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getGateStatusBadgeClass(status) {
  switch (status) {
    case 'SELESAI': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'MENUNGGU': return 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
    case 'REVISI': return 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]';
    default: return 'bg-slate-100 text-slate-600';
  }
}

// Stage and Doc Actions
function updateStage(tenderId, stageKey) {
  legalStore.updateTenderStage(tenderId, stageKey);
}

function advanceStage(tenderId, direction) {
  const t = tenders.value.find(item => item.id === tenderId);
  if (!t) return;
  const currentIdx = stagesList.value.findIndex(s => s.key === t.stage);
  const targetIdx = currentIdx + direction;
  if (targetIdx >= 0 && targetIdx < stagesList.value.length) {
    legalStore.updateTenderStage(tenderId, stagesList.value[targetIdx].key);
  }
}

function setDocStatus(tenderId, docId, status) {
  legalStore.toggleTenderDocStatus(tenderId, docId, status);
}

function promptEditDocNotes(tenderId, doc) {
  const currentNotes = doc.notes || '';
  const newNotes = window.prompt('Perbarui catatan untuk dokumen "' + doc.name + '":', currentNotes);
  if (newNotes !== null) {
    legalStore.toggleTenderDocStatus(tenderId, doc.id, doc.status, newNotes);
  }
}

function triggerDirectDocUpload(tenderId, doc) {
  directUploadTargetDoc.value = { tenderId, docId: doc.id, docName: doc.name };
  if (directDocFileInputRef.value) {
    directDocFileInputRef.value.value = '';
    directDocFileInputRef.value.click();
  }
}

function onDirectDocFilePicked(e) {
  const file = e.target.files?.[0];
  if (!file || !directUploadTargetDoc.value) return;
  const { tenderId, docId } = directUploadTargetDoc.value;
  const sizeStr = file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(0) + ' KB';
  legalStore.attachFileToTenderDoc(tenderId, docId, file.name, sizeStr);
  directUploadTargetDoc.value = null;
}

function openAddDocModal(tender) {
  activeTenderForDoc.value = tender;
  newDocForm.value = {
    name: '',
    category: 'Legal Administrasi',
    status: 'KURANG',
    notes: '',
    isMandatory: true
  };
  isAddDocModalOpen.value = true;
}

function submitNewDocRequirement() {
  if (!activeTenderForDoc.value) return;
  legalStore.addTenderDocument(activeTenderForDoc.value.id, newDocForm.value);
  isAddDocModalOpen.value = false;
}

function submitNewTender() {
  legalStore.addTender(newTenderForm.value);
  isAddModalOpen.value = false;
  newTenderForm.value = {
    title: '',
    tenderNumber: '',
    organizer: '',
    company: 'PT Nusantara Energi',
    category: 'Konstruksi & Infrastruktur',
    sector: 'KONSTRUKSI',
    hpsValue: null,
    bidValue: null,
    deadlineDate: '',
    stage: 'PERSIAPAN_PENGADAAN',
    pic: 'Budi Santoso, S.H., LL.M.',
    notes: ''
  };
}

// GNG & Pricing Handlers
function handleSaveGNG() {
  if (!currentSelectedTender.value) return;
  legalStore.updateTenderGNG(
    currentSelectedTender.value.id,
    gngForm.value,
    calculatedGNGDecision.value,
    gngForm.value.note
  );
}

function handleSavePricing() {
  if (!currentSelectedTender.value) return;
  legalStore.updateTenderPricing(currentSelectedTender.value.id, pricingForm.value);
}

// 4-Gate Review Handlers
function handleApproveGate(gateId) {
  if (!currentSelectedTender.value) return;
  legalStore.approveTenderGate(currentSelectedTender.value.id, gateId, 'Disetujui setelah verifikasi kriteria.');
}

function handleRejectGate(gateId) {
  if (!currentSelectedTender.value) return;
  const reason = window.prompt('Masukkan catatan revisi untuk gate ini:');
  if (reason) {
    legalStore.rejectTenderGate(currentSelectedTender.value.id, gateId, reason);
  }
}

function handleLockPackage() {
  if (!currentSelectedTender.value) return;
  legalStore.lockTenderPackage(currentSelectedTender.value.id);
}

function handleUnlockPackage() {
  if (!currentSelectedTender.value) return;
  legalStore.unlockTenderPackage(currentSelectedTender.value.id, unlockReasonInput.value);
  isUnlockModalOpen.value = false;
}

// Aanwijzing Handlers
function handleAddClarification() {
  if (!currentSelectedTender.value) return;
  legalStore.addTenderClarification(currentSelectedTender.value.id, clarificationForm.value);
  isAddClarificationModalOpen.value = false;
  clarificationForm.value = {
    query: '',
    category: 'Teknis & Spesifikasi',
    impact: 'Spesifikasi & Biaya',
    askedBy: 'Tim Rekayasa & Legal'
  };
}

function openAnswerClarModal(c) {
  selectedClarToAnswer.value = c;
  answerForm.value = {
    answer: c.answer || '',
    effect: c.effect || ''
  };
  isAnswerClarModalOpen.value = true;
}

function handleAnswerClarification() {
  if (!currentSelectedTender.value || !selectedClarToAnswer.value) return;
  legalStore.answerTenderClarification(
    currentSelectedTender.value.id,
    selectedClarToAnswer.value.id,
    answerForm.value.answer,
    answerForm.value.effect
  );
  isAnswerClarModalOpen.value = false;
  selectedClarToAnswer.value = null;
}

// Result & Conversion Handlers
function openRecordResultModal() {
  if (!currentSelectedTender.value) return;
  resultForm.value = {
    resultStatus: 'MENANG',
    winner: currentSelectedTender.value.company,
    rank: 1,
    winPrice: currentSelectedTender.value.bidValue,
    note: 'Surat Penunjukan Penyedia (SPPBJ) resmi diterbitkan.'
  };
  isRecordResultModalOpen.value = true;
}

function handleRecordResult() {
  if (!currentSelectedTender.value) return;
  legalStore.recordTenderResult(currentSelectedTender.value.id, resultForm.value);
  isRecordResultModalOpen.value = false;
}

function handleConvertToContract() {
  if (!currentSelectedTender.value) return;
  const newContract = legalStore.convertTenderToContract(currentSelectedTender.value.id);
}
</script>
