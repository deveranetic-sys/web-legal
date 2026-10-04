<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#4338CA] border border-[#C7D2FE]">
            Digital Legal & Tender Vault
          </span>
          <span class="text-xs text-[#475569] font-medium">Tersimpan dengan Enkripsi AES-256 & Terverifikasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Dokumen Vault & Repositori Legal
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi penyimpanan akta korporasi, sertifikat tanah HGB, serta Bank Dokumen Kualifikasi Pengadaan Lelang (NIB, SBU, ISO, KSWP, dan Laporan KAP).
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 shrink-0 flex-nowrap">
        <button
          @click="openAddCorporateModal"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4 text-[#475569]" />
          <span>Registrasi Arsip</span>
        </button>

        <button
          @click="isAddVaultModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold shadow-xs focus:ring-3 focus:ring-[#C7D2FE] transition-all cursor-pointer whitespace-nowrap"
        >
          <UploadCloud class="w-4 h-4 text-white" />
          <span>Upload Dokumen</span>
        </button>
      </div>
    </div>

    <!-- Quick Metrics Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-medium text-[#475569]">Total Dokumen di Vault</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ totalAllVaultCount }}</span>
          <span class="text-xs text-[#475569]">Berkas Digital</span>
        </div>
        <div class="text-[11px] text-[#6366F1] font-semibold mt-1">
          {{ vaultDocs.length }} Kualifikasi • {{ corporateDocs.length }} Korporasi
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-emerald-700">Dokumen Kualifikasi Valid</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-emerald-700">{{ validDocsCount }}</span>
          <span class="text-xs text-emerald-600 font-medium">/ {{ vaultDocs.length }} Berkas</span>
        </div>
        <div class="text-[11px] text-[#475569] mt-1">
          Siap digunakan untuk pengadaan tender
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-[#0F172A]">Pemanfaatan di Tender</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-[#0F172A]">{{ totalUtilizations }}</span>
          <span class="text-xs text-[#475569]">Kali Digunakan</span>
        </div>
        <div class="text-[11px] text-[#475569] mt-1">
          Tautan lintas paket lelang aktif
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <span class="text-xs font-semibold text-amber-700">Perlu Perpanjangan</span>
        <div class="flex items-baseline justify-between mt-1">
          <span class="text-2xl font-bold text-amber-600">{{ expiringSoonDocsCount }}</span>
          <span class="text-xs text-[#475569]">Segera Habis</span>
        </div>
        <div class="text-[11px] text-rose-600 font-semibold mt-1">
          {{ expiredDocsCount }} Dokumen Sudah Kedaluwarsa
        </div>
      </div>
    </div>

    <!-- Segmented Navigation Tabs for Dokumen Vault -->
    <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-[#E2E8F0] overflow-x-auto text-xs sm:text-sm font-semibold">
      <button
        @click="activeVaultTab = 'ALL'"
        :class="activeVaultTab === 'ALL'
          ? 'bg-[#1E293B] text-white shadow-sm border border-[#C7D2FE]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
      >
        <Archive class="w-4 h-4 text-[#6366F1]" />
        <span>Semua Dokumen Vault</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#4338CA] text-[#6366F1]">
          {{ totalAllVaultCount }}
        </span>
      </button>

      <button
        @click="activeVaultTab = 'KUALIFIKASI'"
        :class="activeVaultTab === 'KUALIFIKASI'
          ? 'bg-[#1E293B] text-white shadow-sm border border-[#C7D2FE]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
      >
        <FileCheck2 class="w-4 h-4 text-[#6366F1]" />
        <span>Bank Dokumen Kualifikasi Lelang</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#4338CA] text-[#6366F1]">
          {{ vaultDocs.length }}
        </span>
      </button>

      <button
        @click="activeVaultTab = 'KORPORASI'"
        :class="activeVaultTab === 'KORPORASI'
          ? 'bg-[#1E293B] text-white shadow-sm border border-[#C7D2FE]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer"
      >
        <Building2 class="w-4 h-4 text-[#6366F1]" />
        <span>Arsip Dokumen Legal Korporasi</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-[#0F172A]">
          {{ corporateDocs.length }}
        </span>
      </button>
    </div>

    <!-- Search & Filter Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Search Input -->
        <div class="md:col-span-5 relative">
          <Search class="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama dokumen, kode, nomor izin, instansi, atau lokasi..."
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

        <!-- Filter Kategori -->
        <div class="md:col-span-4">
          <select
            v-model="filterCategory"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Kategori Dokumen</option>
            <option value="Legal Administrasi">Legal Administrasi (NIB, Akta, AHU)</option>
            <option value="Kualifikasi Teknis">Kualifikasi Teknis (SBU, Pengalaman)</option>
            <option value="Kepatuhan & Integritas">Kepatuhan & Integritas (ISO, SMK3)</option>
            <option value="Finansial & Keuangan">Finansial & Keuangan (Pajak, Laporan KAP)</option>
            <option value="Corporate Deed">Akta Korporasi (Corporate Deed)</option>
            <option value="Land Title & HGB">Sertifikat Tanah / HGB</option>
            <option value="Insurance Policy">Polis Asuransi Proyek</option>
          </select>
        </div>

        <!-- Filter Status Validitas (Kualifikasi) -->
        <div class="md:col-span-3">
          <select
            v-model="filterStatus"
            class="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
          >
            <option value="ALL">Semua Status Validitas</option>
            <option value="VALID">Valid / Berlaku</option>
            <option value="EXPIRING_SOON">Segera Kedaluwarsa (&lt; 60 Hari)</option>
            <option value="EXPIRED">Sudah Kedaluwarsa</option>
          </select>
        </div>
      </div>

      <!-- Quick Reset & Summary count -->
      <div class="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs text-[#475569]">
        <div>
          Menampilkan <strong class="text-[#0F172A]">{{ displayedDocuments.length }}</strong> dokumen tersimpan di Vault
        </div>
        <button
          v-if="searchQuery || filterCategory !== 'ALL' || filterStatus !== 'ALL'"
          @click="resetFilters"
          class="text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="displayedDocuments.length === 0" class="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
      <FolderSearch class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h4 class="text-base font-bold text-[#0F172A]">Tidak ada dokumen yang sesuai dengan filter</h4>
      <p class="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
        Silakan bersihkan filter pencarian atau unggah dokumen kualifikasi baru ke dalam Vault.
      </p>
      <button
        @click="resetFilters"
        class="mt-4 px-4 py-2 text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] hover:bg-blue-100 rounded-xl transition cursor-pointer border border-[#C7D2FE]"
      >
        Bersihkan Filter
      </button>
    </div>

    <!-- UNIFIED VAULT TABLE -->
    <div v-else class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-slate-50/80 border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3.5 px-4 min-w-[260px]">Dokumen & Berkas Digital</th>
              <th class="py-3.5 px-4 min-w-[140px]">Tipe & Kategori</th>
              <th class="py-3.5 px-4 min-w-[160px]">Nomor & Instansi Penerbit</th>
              <th class="py-3.5 px-4 min-w-[140px]">Masa Berlaku</th>
              <th class="py-3.5 px-4 min-w-[160px]">Penggunaan di Tender</th>
              <th class="py-3.5 px-4 text-center min-w-[110px]">Status</th>
              <th class="py-3.5 px-4 text-right min-w-[140px]">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E2E8F0]">
            <tr
              v-for="doc in displayedDocuments"
              :key="doc.id"
              class="hover:bg-[#F8FAFC] transition-colors"
            >
              <!-- Col 1: Name, Code & File Reference -->
              <td class="py-3.5 px-4">
                <div class="flex items-start gap-2.5">
                  <div class="p-2 rounded-lg bg-slate-100 text-[#0F172A] shrink-0 mt-0.5">
                    <FileText class="w-4 h-4 text-[#6366F1]" />
                  </div>
                  <div class="space-y-1 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="font-mono text-[10px] font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2 py-0.5 rounded border border-[#C7D2FE]">
                        {{ doc.code || doc.id }}
                      </span>
                      <span
                        v-if="doc.isQualificationDoc"
                        class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-[#4338CA] border border-[#C7D2FE]"
                      >
                        Kualifikasi Lelang
                      </span>
                      <span
                        v-else
                        class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        Arsip Legal
                      </span>
                    </div>

                    <div class="font-bold text-[#0F172A] text-xs sm:text-sm">
                      {{ doc.name || doc.documentName }}
                    </div>

                    <!-- File attachment chip -->
                    <div v-if="doc.fileRef" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-[#0F172A] font-mono">
                      <Paperclip class="w-3 h-3 text-[#6366F1]" />
                      <span class="truncate max-w-[180px]">{{ doc.fileRef }}</span>
                      <span v-if="doc.fileSize" class="text-[#475569]">({{ doc.fileSize }})</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Col 2: Category -->
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-[#0F172A]">
                  {{ doc.category || doc.documentType }}
                </span>
                <div v-if="doc.company" class="text-[10px] text-[#475569] mt-0.5">
                  {{ doc.company }}
                </div>
              </td>

              <!-- Col 3: Number & Issuer -->
              <td class="py-3.5 px-4">
                <div class="font-mono text-xs text-[#0F172A] font-semibold truncate max-w-[180px]" :title="doc.number || doc.physicalLocation">
                  {{ doc.number || doc.physicalLocation || '-' }}
                </div>
                <div class="text-[10px] text-[#475569] mt-0.5 truncate max-w-[180px]">
                  {{ doc.issuer || 'Arsip Fisik Lemari Legal' }}
                </div>
              </td>

              <!-- Col 4: Expiry Date -->
              <td class="py-3.5 px-4">
                <div v-if="doc.expiryDate" class="space-y-0.5">
                  <div class="font-mono text-xs text-[#0F172A] font-semibold">
                    {{ doc.expiryDate }}
                  </div>
                  <div
                    class="text-[10px] font-semibold"
                    :class="calculateDaysRemaining(doc.expiryDate) <= 60 ? 'text-rose-600' : 'text-[#475569]'"
                  >
                    {{ calculateDaysRemaining(doc.expiryDate) < 0 ? 'Kedaluwarsa' : `${calculateDaysRemaining(doc.expiryDate)} Hari Lagi` }}
                  </div>
                </div>
                <div v-else class="text-xs text-slate-400">
                  Permanen / Tidak Terbatas
                </div>
              </td>

              <!-- Col 5: Tenders Used (Linkage) -->
              <td class="py-3.5 px-4">
                <div v-if="doc.tendersUsed && doc.tendersUsed.length > 0" class="flex flex-wrap gap-1">
                  <button
                    v-for="tId in doc.tendersUsed"
                    :key="tId"
                    @click="goToTenderDetail(tId)"
                    class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] hover:bg-blue-100 transition cursor-pointer"
                    title="Buka detail tender ini"
                  >
                    {{ tId }}
                  </button>
                </div>
                <div v-else-if="doc.isQualificationDoc" class="text-[10px] text-slate-400">
                  Belum ditautkan ke tender
                </div>
                <div v-else class="text-[10px] text-slate-400 font-mono">
                  {{ doc.confidentialityLevel || 'Confidential' }}
                </div>
              </td>

              <!-- Col 6: Status Badge -->
              <td class="py-3.5 px-4 text-center">
                <span
                  v-if="doc.isQualificationDoc"
                  :class="getStatusBadgeClass(doc)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                >
                  <CheckCircle2 v-if="getStatusLabel(doc) === 'Valid'" class="w-3 h-3 text-emerald-600" />
                  <Clock v-else class="w-3 h-3" />
                  <span>{{ getStatusLabel(doc) }}</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                >
                  Tersimpan di Vault
                </span>
              </td>

              <!-- Col 7: Actions -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Link to Tender (for qualification docs) -->
                  <button
                    v-if="doc.isQualificationDoc"
                    @click="openLinkTenderModal(doc)"
                    class="p-1.5 rounded-lg text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
                    title="Tautkan ke Paket Lelang Aktif"
                  >
                    <Link2 class="w-4 h-4" />
                  </button>

                  <!-- Download File -->
                  <button
                    @click="downloadDoc(doc)"
                    class="p-1.5 rounded-lg text-slate-600 hover:text-[#4338CA] hover:bg-blue-50 transition cursor-pointer"
                    title="Unduh Salinan Digital"
                  >
                    <Download class="w-4 h-4" />
                  </button>

                  <!-- Delete (qualification docs) -->
                  <button
                    v-if="doc.isQualificationDoc"
                    @click="confirmDelete(doc)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus dari Dokumen Vault"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: UPLOAD DOKUMEN KUALIFIKASI BARU        -->
    <!-- ============================================== -->
    <div
      v-if="isAddVaultModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
      @click.self="isAddVaultModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 bg-[#1E293B] text-white flex items-center justify-between border-b border-[#1E293B]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-[#4338CA] flex items-center justify-center border border-[#C7D2FE] text-[#6366F1]">
              <UploadCloud class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold">Registrasi Dokumen Kualifikasi Lelang</h3>
              <p class="text-[11px] text-slate-300">Simpan dokumen master kualifikasi ke dalam Dokumen Vault</p>
            </div>
          </div>
          <button @click="isAddVaultModalOpen = false" class="text-slate-400 hover:text-white transition cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitAddVaultDoc" class="p-6 overflow-y-auto space-y-4 text-xs">
          <!-- File Dropzone & Direct Upload -->
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">
              File Dokumen Asli (Upload dari Direktori Komputer) *
            </label>
            <input
              type="file"
              ref="vaultFileInputRef"
              @change="onVaultFilePicked"
              class="hidden"
            />
            <div
              v-if="!newDocForm.fileRef"
              @click="triggerVaultFileBrowse"
              class="border-2 border-dashed border-[#C7D2FE] hover:border-[#C7D2FE] rounded-xl p-5 text-center bg-[#F8FAFC] hover:bg-blue-50/50 transition cursor-pointer"
            >
              <UploadCloud class="w-8 h-8 text-[#6366F1] mx-auto mb-2" />
              <div class="font-bold text-[#0F172A] text-xs">Klik untuk memilih file dari komputer / direktori lokal</div>
              <div class="text-[11px] text-[#475569] mt-0.5">Mendukung format PDF, DOCX, ZIP, JPG (Maks. 50 MB)</div>
            </div>
            <div
              v-else
              class="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-[#BBF7D0]"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <Paperclip class="w-4 h-4 text-emerald-600 shrink-0" />
                <div class="min-w-0">
                  <div class="font-bold text-[#0F172A] text-xs truncate">{{ newDocForm.fileRef }}</div>
                  <div class="text-[11px] text-[#475569]">Ukuran: {{ newDocForm.fileSize || 'Terlampir' }}</div>
                </div>
              </div>
              <button
                type="button"
                @click="triggerVaultFileBrowse"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
              >
                Ganti File
              </button>
            </div>
          </div>

          <!-- Document Code & Name -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kode Master *</label>
              <input
                v-model="newDocForm.code"
                type="text"
                placeholder="Contoh: NIB-2025"
                required
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none font-mono"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-bold text-[#0F172A] mb-1">Nama Dokumen Kualifikasi *</label>
              <input
                v-model="newDocForm.name"
                type="text"
                placeholder="Nama sertifikat / perizinan / laporan"
                required
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
              />
            </div>
          </div>

          <!-- Category & Number -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kategori Dokumen *</label>
              <select
                v-model="newDocForm.category"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white"
              >
                <option value="Legal Administrasi">Legal Administrasi</option>
                <option value="Kualifikasi Teknis">Kualifikasi Teknis</option>
                <option value="Kepatuhan & Integritas">Kepatuhan & Integritas</option>
                <option value="Finansial & Keuangan">Finansial & Keuangan</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Nomor Registrasi / SK</label>
              <input
                v-model="newDocForm.number"
                type="text"
                placeholder="Nomor dokumen resmi"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none font-mono"
              />
            </div>
          </div>

          <!-- Issuer & Dates -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Instansi Penerbit</label>
              <input
                v-model="newDocForm.issuer"
                type="text"
                placeholder="Kementerian / Lembaga / KAP"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tanggal Terbit</label>
              <input
                v-model="newDocForm.issueDate"
                type="date"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Masa Berlaku (Kosongkan bila Permanen)</label>
              <input
                v-model="newDocForm.expiryDate"
                type="date"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
              />
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan / Ringkasan Dokumen</label>
            <textarea
              v-model="newDocForm.notes"
              rows="2"
              placeholder="Keterangan batasan, ruang lingkup kualifikasi, atau catatan legal..."
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddVaultModalOpen = false"
              class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs flex items-center gap-1.5"
            >
              <UploadCloud class="w-3.5 h-3.5" />
              <span>Simpan Dokumen</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: REGISTRASI ARSIP KORPORASI BARU        -->
    <!-- ============================================== -->
    <div
      v-if="isAddCorporateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
      @click.self="isAddCorporateModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 bg-[#1E293B] text-white flex items-center justify-between border-b border-[#1E293B]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Plus class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold">Registrasi Arsip Legal Korporasi</h3>
              <p class="text-[11px] text-slate-300">Penyimpanan akta, sertifikat aset, dan dokumen legalitas grup</p>
            </div>
          </div>
          <button @click="isAddCorporateModalOpen = false" class="text-slate-400 hover:text-white transition cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitAddCorporateDoc" class="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">
              Nama Dokumen / Judul Berkas Arsip *
            </label>
            <input
              v-model="newCorpForm.name"
              type="text"
              required
              placeholder="Contoh: Akta Notaris No. 45 - Perubahan Susunan Direksi & Komisaris"
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Jenis / Kategori Arsip</label>
              <select
                v-model="newCorpForm.documentType"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white text-[#0F172A]"
              >
                <option value="Akta Notaris & Korporasi">Akta Notaris & Korporasi</option>
                <option value="SK Pengesahan Kemenkumham">SK Pengesahan Kemenkumham</option>
                <option value="Sertifikat Tanah & Aset (HGB/SHM)">Sertifikat Tanah & Aset (HGB/SHM)</option>
                <option value="Perizinan Dasar (NIB/NPWP)">Perizinan Dasar (NIB/NPWP)</option>
                <option value="Sertifikasi Mutu (ISO/SMK3)">Sertifikasi Mutu (ISO/SMK3)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Nomor Registrasi / Akta *</label>
              <input
                v-model="newCorpForm.number"
                type="text"
                required
                placeholder="45/NOT-JKT/2026"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A] font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Instansi Penerbit / Notaris</label>
              <input
                v-model="newCorpForm.issuer"
                type="text"
                required
                placeholder="Notaris Hj. Fatimah, S.H., M.Kn."
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Entitas Perseroan</label>
              <select
                v-model="newCorpForm.company"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white text-[#0F172A]"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
                <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Tanggal Dokumen *</label>
              <input
                v-model="newCorpForm.issueDate"
                type="date"
                required
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Masa Berlaku (Jika Ada)</label>
              <input
                v-model="newCorpForm.expiryDate"
                type="date"
                class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Catatan & Keterangan</label>
            <textarea
              v-model="newCorpForm.notes"
              rows="2"
              placeholder="Catatan klausul pembatasan, riwayat perubahan, atau keterangan lokasi salinan fisik..."
              class="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none text-[#0F172A] resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddCorporateModalOpen = false"
              class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs flex items-center gap-1.5"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Simpan Arsip</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: TAUTKAN DOKUMEN KE PAKET LELANG        -->
    <!-- ============================================== -->
    <div
      v-if="isLinkTenderModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
      @click.self="isLinkTenderModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0]">
        <div class="px-6 py-4 bg-[#1E293B] text-white flex items-center justify-between border-b border-[#1E293B]">
          <div class="flex items-center gap-2">
            <Link2 class="w-4 h-4 text-[#6366F1]" />
            <h3 class="text-sm font-bold">Tautkan ke Paket Lelang</h3>
          </div>
          <button @click="isLinkTenderModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <div v-if="selectedVaultDoc" class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div class="font-bold text-[#0F172A] text-sm">{{ selectedVaultDoc.name }}</div>
            <div class="text-[#475569]">Kode: <span class="font-mono text-[#0F172A] font-bold">{{ selectedVaultDoc.code }}</span> • {{ selectedVaultDoc.number }}</div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Pilih Paket Lelang Sasaran *</label>
            <select
              v-model="targetTenderId"
              class="w-full py-2.5 px-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#C7D2FE] outline-none bg-white text-[#0F172A] text-xs font-semibold"
            >
              <option v-for="t in tenders" :key="t.id" :value="t.id">
                {{ t.id }} - {{ t.title }} ({{ t.company }})
              </option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isLinkTenderModalOpen = false"
              class="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold rounded-xl transition cursor-pointer text-xs"
            >
              Batal
            </button>
            <button
              type="button"
              @click="executeLinkToTender"
              class="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] font-bold rounded-xl shadow-md transition cursor-pointer text-xs"
            >
              Tautkan Dokumen Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  UploadCloud,
  Search,
  FileText,
  Download,
  Archive,
  Building2,
  FileCheck2,
  CheckCircle2,
  Clock,
  Plus,
  Link2,
  Trash2,
  Paperclip,
  FolderSearch,
  X
} from 'lucide-vue-next';
import { legalStore, calculateDaysRemaining } from '../stores/legalStore';

// State
const searchQuery = ref('');
const filterCategory = ref('ALL');
const filterStatus = ref('ALL');
const activeVaultTab = ref('ALL'); // 'ALL' | 'KUALIFIKASI' | 'KORPORASI'

const isAddVaultModalOpen = ref(false);
const isAddCorporateModalOpen = ref(false);
const isLinkTenderModalOpen = ref(false);
const selectedVaultDoc = ref(null);
const targetTenderId = ref(null);
const vaultFileInputRef = ref(null);

const newDocForm = ref({
  name: '',
  code: '',
  category: 'Legal Administrasi',
  number: '',
  issuer: '',
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  fileRef: '',
  fileSize: '',
  notes: ''
});

const newCorpForm = ref({
  name: '',
  documentType: 'Akta Notaris & Korporasi',
  number: '',
  issuer: 'Notaris Hj. Fatimah, S.H., M.Kn.',
  company: 'PT Nusantara Energi',
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  notes: ''
});

// Store Datasets
const corporateDocs = computed(() => (legalStore.state.documents || []).map(d => ({
  ...d,
  isQualificationDoc: false
})));

const vaultDocs = computed(() => (legalStore.state.tenderVault || []).map(d => ({
  ...d,
  isQualificationDoc: true
})));

const tenders = computed(() => legalStore.state.tenders || []);

const totalAllVaultCount = computed(() => corporateDocs.value.length + vaultDocs.value.length);

const validDocsCount = computed(() => {
  return vaultDocs.value.filter(d => {
    if (!d.expiryDate) return true;
    return calculateDaysRemaining(d.expiryDate) > 60;
  }).length;
});

const expiringSoonDocsCount = computed(() => {
  return vaultDocs.value.filter(d => {
    if (!d.expiryDate) return false;
    const days = calculateDaysRemaining(d.expiryDate);
    return days <= 60 && days >= 0;
  }).length;
});

const expiredDocsCount = computed(() => {
  return vaultDocs.value.filter(d => {
    if (!d.expiryDate) return false;
    return calculateDaysRemaining(d.expiryDate) < 0;
  }).length;
});

const totalUtilizations = computed(() => {
  return vaultDocs.value.reduce((acc, d) => acc + (d.tendersUsed?.length || 0), 0);
});

// Unified filtered documents
const displayedDocuments = computed(() => {
  let list = [];
  if (activeVaultTab.value === 'ALL') {
    list = [...vaultDocs.value, ...corporateDocs.value];
  } else if (activeVaultTab.value === 'KUALIFIKASI') {
    list = [...vaultDocs.value];
  } else if (activeVaultTab.value === 'KORPORASI') {
    list = [...corporateDocs.value];
  }

  return list.filter(doc => {
    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const name = (doc.name || doc.documentName || '').toLowerCase();
      const code = (doc.code || doc.id || '').toLowerCase();
      const number = (doc.number || doc.physicalLocation || '').toLowerCase();
      const issuer = (doc.issuer || doc.company || '').toLowerCase();
      if (!name.includes(q) && !code.includes(q) && !number.includes(q) && !issuer.includes(q)) {
        return false;
      }
    }

    // Category
    if (filterCategory.value !== 'ALL') {
      const cat = doc.category || doc.documentType;
      if (cat !== filterCategory.value) return false;
    }

    // Status (only applies if doc has expiryDate)
    if (filterStatus.value === 'VALID') {
      if (doc.expiryDate && calculateDaysRemaining(doc.expiryDate) <= 60) return false;
    } else if (filterStatus.value === 'EXPIRING_SOON') {
      if (!doc.expiryDate) return false;
      const days = calculateDaysRemaining(doc.expiryDate);
      if (days > 60 || days < 0) return false;
    } else if (filterStatus.value === 'EXPIRED') {
      if (!doc.expiryDate) return false;
      if (calculateDaysRemaining(doc.expiryDate) >= 0) return false;
    }

    return true;
  });
});

// File Upload helper
function triggerVaultFileBrowse() {
  if (vaultFileInputRef.value) {
    vaultFileInputRef.value.click();
  }
}

function onVaultFilePicked(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  newDocForm.value.fileRef = file.name;
  if (file.size < 1024 * 1024) {
    newDocForm.value.fileSize = (file.size / 1024).toFixed(1) + ' KB';
  } else {
    newDocForm.value.fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  }
  if (!newDocForm.value.name) {
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    newDocForm.value.name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
}

function getStatusBadgeClass(doc) {
  if (!doc.expiryDate) return 'bg-emerald-50 text-emerald-800 border-[#BBF7D0]';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'bg-rose-50 text-rose-800 border-[#FECDD3]';
  if (days <= 60) return 'bg-amber-50 text-amber-800 border-[#FDE68A]';
  return 'bg-emerald-50 text-emerald-800 border-[#BBF7D0]';
}

function getStatusLabel(doc) {
  if (!doc.expiryDate) return 'Valid';
  const days = calculateDaysRemaining(doc.expiryDate);
  if (days < 0) return 'Kedaluwarsa';
  if (days <= 60) return 'Segera Kedaluwarsa';
  return 'Valid';
}

function goToTenderDetail(tenderId) {
  legalStore.navigate('tenders', tenderId);
}

function downloadDoc(doc) {
  legalStore.triggerToast(`Mengunduh salinan digital berkas: ${doc.fileRef || doc.name || doc.documentName}`, 'info');
}

function openAddCorporateModal() {
  isAddCorporateModalOpen.value = true;
}

function submitAddCorporateDoc() {
  legalStore.addCorporateDocument(newCorpForm.value);
  isAddCorporateModalOpen.value = false;
  newCorpForm.value = {
    name: '',
    documentType: 'Akta Notaris & Korporasi',
    number: '',
    issuer: 'Notaris Hj. Fatimah, S.H., M.Kn.',
    company: 'PT Nusantara Energi',
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: '',
    notes: ''
  };
}

function openLinkTenderModal(doc) {
  selectedVaultDoc.value = doc;
  targetTenderId.value = tenders.value[0]?.id || null;
  isLinkTenderModalOpen.value = true;
}

function executeLinkToTender() {
  if (!selectedVaultDoc.value || !targetTenderId.value) return;
  legalStore.linkVaultDocToTender(selectedVaultDoc.value.id, targetTenderId.value);
  isLinkTenderModalOpen.value = false;
  selectedVaultDoc.value = null;
}

function submitAddVaultDoc() {
  legalStore.addTenderVaultDoc(newDocForm.value);
  isAddVaultModalOpen.value = false;
  newDocForm.value = {
    name: '',
    code: '',
    category: 'Legal Administrasi',
    number: '',
    issuer: '',
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: '',
    fileRef: '',
    fileSize: '',
    notes: ''
  };
}

function confirmDelete(doc) {
  if (window.confirm(`Hapus dokumen "${doc.name}" dari Dokumen Vault?`)) {
    legalStore.deleteTenderVaultDoc(doc.id);
  }
}

function resetFilters() {
  searchQuery.value = '';
  filterCategory.value = 'ALL';
  filterStatus.value = 'ALL';
}
</script>
