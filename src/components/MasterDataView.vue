<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
            Pengaturan & Konfigurasi Sistem
          </span>
          <span class="text-xs text-[#475569] font-medium">Standardisasi Metadata & Filter Global</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Pusat Data Master & Filter
        </h1>
        <p class="text-sm text-[#475569] mt-1">
          Sentralisasi pengelolaan tipe dokumen, klasifikasi sektor industri, workflow tahapan lelang lintas sektor, dan tipe kontrak perjanjian.
        </p>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="exportMasterDataJSON"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
        >
          <Download class="w-4 h-4 text-[#475569]" />
          <span>Ekspor JSON</span>
        </button>

        <button
          @click="openAddModalForCurrentTab"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
        >
          <Plus class="w-4 h-4 text-white" />
          <span>{{ getAddButtonLabel }}</span>
        </button>
      </div>
    </div>

    <!-- Sub-Navigation Tabs (Pastel Style) -->
    <div class="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] overflow-x-auto text-xs sm:text-sm font-medium">
      <button
        @click="activeTab = 'doctypes'"
        :class="activeTab === 'doctypes'
          ? 'bg-white text-[#4338CA] shadow-xs font-semibold border border-[#E2E8F0]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
      >
        <FolderTree class="w-4 h-4 text-[#6366F1]" />
        <span>Tipe & Kategori Dokumen</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#4338CA]">
          {{ masterDocTypes.length }}
        </span>
      </button>

      <button
        @click="activeTab = 'sectors'"
        :class="activeTab === 'sectors'
          ? 'bg-white text-[#4338CA] shadow-xs font-semibold border border-[#E2E8F0]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
      >
        <Layers class="w-4 h-4 text-[#6366F1]" />
        <span>Sektor Industri & Klasifikasi</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#4338CA]">
          {{ masterSectors.length }}
        </span>
      </button>

      <button
        @click="activeTab = 'stages'"
        :class="activeTab === 'stages'
          ? 'bg-white text-[#4338CA] shadow-xs font-semibold border border-[#E2E8F0]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
      >
        <GitFork class="w-4 h-4 text-[#6366F1]" />
        <span>Workflow Tahapan Tender per Sektor</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#166534]">
          Berbeda per Sektor
        </span>
      </button>

      <button
        @click="activeTab = 'contracts'"
        :class="activeTab === 'contracts'
          ? 'bg-white text-[#4338CA] shadow-xs font-semibold border border-[#E2E8F0]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
      >
        <FileSignature class="w-4 h-4 text-[#6366F1]" />
        <span>Tipe Kontrak & Format Acuan</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#4338CA]">
          {{ masterContractTypes.length }}
        </span>
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 1: TIPE & KATEGORI DOKUMEN                           -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'doctypes'" class="space-y-4 animate-in fade-in duration-150">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 text-xs">
        <p class="text-[#475569]">
          Kategori dokumen ini menjadi rujukan otomatis pada <strong>Audit Dokumen Tender</strong>, <strong>Dokumen Vault</strong>, dan <strong>Formulir Kualifikasi Rekanan</strong>.
        </p>
        <span class="text-[#475569] font-medium shrink-0">
          Total: <strong class="text-[#0F172A]">{{ masterDocTypes.length }}</strong> Tipe
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="docType in masterDocTypes"
          :key="docType.id"
          class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card hover:border-[#C7D2FE] transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                {{ docType.code }}
              </span>
              <span
                :class="docType.isMandatory ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]' : 'bg-slate-100 text-slate-600'"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                {{ docType.isMandatory ? 'Wajib Baku' : 'Opsional' }}
              </span>
            </div>

            <h3 class="text-base font-extrabold text-[#0F172A] mt-2">
              {{ docType.name }}
            </h3>

            <p class="text-xs text-[#475569] mt-1 leading-relaxed">
              {{ docType.description }}
            </p>
          </div>

          <div class="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span class="text-[11px] text-[#475569]">
              ID: <strong>{{ docType.id }}</strong>
            </span>

            <div class="flex items-center gap-1">
              <button
                @click="openEditDocType(docType)"
                class="p-1.5 text-slate-500 hover:text-[#4338CA] hover:bg-[#EEF2FF] rounded-lg transition cursor-pointer"
                title="Edit tipe dokumen"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDeleteDocType(docType)"
                class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Hapus tipe dokumen"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 2: SEKTOR INDUSTRI & KLASIFIKASI                     -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'sectors'" class="space-y-4 animate-in fade-in duration-150">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 text-xs">
        <p class="text-[#475569]">
          Daftar sektor industri menentukan template alur proses lelang, deteksi ambang batas HPS, dan jenis kontrak standar saat lelang dimenangkan.
        </p>
        <span class="text-[#475569] font-medium shrink-0">
          Total: <strong class="text-[#0F172A]">{{ masterSectors.length }}</strong> Sektor
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="sector in masterSectors"
          :key="sector.id"
          class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card hover:border-[#C7D2FE] transition-all space-y-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                {{ sector.icon }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#4338CA] border border-[#C7D2FE]">
                    {{ sector.code }}
                  </span>
                  <span
                    v-if="sector.hasBelow80Alert"
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
                  >
                    Aturan &lt;80% HPS Aktif
                  </span>
                </div>
                <h3 class="text-base font-extrabold text-[#0F172A] mt-1">
                  {{ sector.name }}
                </h3>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="openEditSector(sector)"
                class="p-1.5 text-slate-500 hover:text-[#4338CA] hover:bg-[#EEF2FF] rounded-lg transition cursor-pointer"
                title="Edit sektor"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDeleteSector(sector)"
                class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Hapus sektor"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <p class="text-xs text-[#475569] leading-relaxed">
            {{ sector.description }}
          </p>

          <div class="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-[#475569]">Regulasi Pokok:</span>
              <strong class="text-[#0F172A]">{{ sector.regulatoryBasis }}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#475569]">Kontrak Default:</span>
              <strong class="text-[#4338CA]">{{ sector.defaultContractType }}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#475569]">Alur Workflow:</span>
              <span class="font-mono text-[11px] text-[#0F172A]">{{ sector.workflowTemplate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 3: WORKFLOW TAHAPAN TENDER PER SEKTOR                -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'stages'" class="space-y-5 animate-in fade-in duration-150">
      <!-- Sector Selector Bar -->
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-bold text-[#0F172A]">Pilih Sektor untuk Melihat Alur:</span>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            v-for="s in masterSectors"
            :key="s.code"
            @click="selectedWorkflowSector = s.code"
            :class="selectedWorkflowSector === s.code
              ? 'bg-[#6366F1] text-white font-bold shadow-xs'
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-slate-200'"
            class="px-3 py-1.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5 shrink-0"
          >
            <span>{{ s.icon }}</span>
            <span>{{ s.name }}</span>
          </button>
        </div>
      </div>

      <!-- Sector Workflow Presentation Card -->
      <div class="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden space-y-0">
        <div class="p-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ getSelectedSectorObj?.icon }}</span>
              <h3 class="text-lg font-bold">
                Alur Tahapan Tender Sektor: {{ getSelectedSectorObj?.name }}
              </h3>
            </div>
            <p class="text-xs text-slate-300">
              Regulasi: <strong>{{ getSelectedSectorObj?.regulatoryBasis }}</strong> • Template: <span class="font-mono text-emerald-400">{{ getSelectedSectorObj?.workflowTemplate }}</span>
            </p>
          </div>

          <div class="shrink-0">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              {{ currentSectorStages.length }} Tahapan
            </span>
          </div>
        </div>

        <!-- Stages Stepper Grid / List -->
        <div class="p-6 divide-y divide-[#E2E8F0]">
          <div
            v-for="(stage, idx) in currentSectorStages"
            :key="stage.key"
            class="py-4 first:pt-0 last:pb-0 flex items-start gap-4 group"
          >
            <div class="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {{ idx + 1 }}
            </div>

            <div class="flex-1 space-y-1 min-w-0">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <h4 class="text-sm font-extrabold text-[#0F172A]">
                  {{ stage.name }}
                </h4>
                <span class="font-mono text-[10px] text-[#475569] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                  {{ stage.key }}
                </span>
              </div>
              <p class="text-xs text-[#475569] leading-relaxed">
                {{ stage.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 4: TIPE KONTRAK & FORMAT ACUAN                      -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'contracts'" class="space-y-4 animate-in fade-in duration-150">
      <div class="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 text-xs">
        <p class="text-[#475569]">
          Tipe kontrak korporasi yang dihasilkan otomatis saat paket lelang dinyatakan <strong>Menang (Won)</strong> dan dikonversi ke Modul Kontrak.
        </p>
        <span class="text-[#475569] font-medium shrink-0">
          Total: <strong class="text-[#0F172A]">{{ masterContractTypes.length }}</strong> Tipe
        </span>
      </div>

      <div class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
            <tr>
              <th class="py-3 px-4">Kode & Nama Tipe Kontrak</th>
              <th class="py-3 px-4">Sektor Industri</th>
              <th class="py-3 px-4">Standar Format Acuan</th>
              <th class="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E2E8F0]">
            <tr
              v-for="ct in masterContractTypes"
              :key="ct.id"
              class="hover:bg-[#F8FAFC] transition-colors"
            >
              <td class="py-3 px-4">
                <div class="font-bold text-[#0F172A]">{{ ct.name }}</div>
                <div class="font-mono text-[10px] text-[#4338CA] mt-0.5">{{ ct.code }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="font-semibold text-[#0F172A]">{{ ct.sector }}</span>
              </td>
              <td class="py-3 px-4 text-[#475569]">
                {{ ct.standardFormat }}
              </td>
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <button
                  @click="confirmDeleteContractType(ct)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Hapus tipe kontrak"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: TAMBAH TIPE DOKUMEN -->
    <div
      v-if="isAddDocTypeModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddDocTypeModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs border border-[#E2E8F0]">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Tambah Master Tipe Dokumen</h3>
          <button @click="isAddDocTypeModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <form @submit.prevent="submitAddDocType" class="space-y-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Kategori Dokumen *</label>
            <input
              v-model="docTypeForm.name"
              type="text"
              required
              placeholder="Contoh: Dokumen Kelaikan Alat & SILO"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kode Singkat (Prefix)</label>
              <input
                v-model="docTypeForm.code"
                type="text"
                placeholder="Contoh: SILO"
                class="w-full px-3 py-2 text-xs font-mono uppercase border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Sifat Dokumen</label>
              <select
                v-model="docTypeForm.isMandatory"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option :value="true">Wajib Baku</option>
                <option :value="false">Opsional</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Deskripsi Ruang Lingkup Dokumen</label>
            <textarea
              v-model="docTypeForm.description"
              rows="2"
              placeholder="Cakupan berkas yang termasuk dalam kategori ini..."
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddDocTypeModalOpen = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
            >
              Simpan Tipe Dokumen
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: TAMBAH SEKTOR INDUSTRI -->
    <div
      v-if="isAddSectorModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddSectorModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs border border-[#E2E8F0]">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Tambah Master Sektor Industri</h3>
          <button @click="isAddSectorModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <form @submit.prevent="submitAddSector" class="space-y-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Sektor Industri *</label>
            <input
              v-model="sectorForm.name"
              type="text"
              required
              placeholder="Contoh: Telekomunikasi & Teknologi Informasi"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kode Sektor (ID)</label>
              <input
                v-model="sectorForm.code"
                type="text"
                required
                placeholder="Contoh: TELKO"
                class="w-full px-3 py-2 text-xs font-mono uppercase border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Icon Emoji</label>
              <input
                v-model="sectorForm.icon"
                type="text"
                placeholder="📡"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Dasar Regulasi Pokok</label>
            <input
              v-model="sectorForm.regulatoryBasis"
              type="text"
              placeholder="Contoh: UU Telekomunikasi & Permen Kominfo"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Tipe Kontrak Default</label>
            <input
              v-model="sectorForm.defaultContractType"
              type="text"
              placeholder="Contoh: Service Level Agreement (SLA) & IT Contract"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Deskripsi Sektor</label>
            <textarea
              v-model="sectorForm.description"
              rows="2"
              placeholder="Karakteristik pengadaan dan kualifikasi yang dipersyaratkan..."
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddSectorModalOpen = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
            >
              Simpan Sektor
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: TAMBAH TIPE KONTRAK -->
    <div
      v-if="isAddContractTypeModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddContractTypeModalOpen = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs border border-[#E2E8F0]">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 class="text-sm font-bold text-[#0F172A]">Tambah Master Tipe Kontrak</h3>
          <button @click="isAddContractTypeModalOpen = false" class="text-slate-400 hover:text-[#0F172A]">✕</button>
        </div>

        <form @submit.prevent="submitAddContractType" class="space-y-3">
          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Nama Tipe Kontrak *</label>
            <input
              v-model="contractTypeForm.name"
              type="text"
              required
              placeholder="Contoh: Operation & Maintenance (O&M) Agreement"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Kode Kontrak</label>
              <input
                v-model="contractTypeForm.code"
                type="text"
                placeholder="O_AND_M"
                class="w-full px-3 py-2 text-xs font-mono uppercase border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label class="block font-bold text-[#0F172A] mb-1">Sektor Relevan</label>
              <select
                v-model="contractTypeForm.sector"
                class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
              >
                <option v-for="s in masterSectors" :key="s.code" :value="s.code">{{ s.name }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#0F172A] mb-1">Standar Format Acuan</label>
            <input
              v-model="contractTypeForm.standardFormat"
              type="text"
              placeholder="Contoh: Standar Kontrak BUMN & LPSE"
              class="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#C7D2FE] bg-white text-[#0F172A]"
            />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              @click="isAddContractTypeModalOpen = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl"
            >
              Simpan Tipe Kontrak
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  FolderTree,
  Layers,
  GitFork,
  FileSignature,
  Plus,
  Download,
  Trash2,
  Edit3,
  Check,
  X
} from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const activeTab = ref('doctypes'); // 'doctypes', 'sectors', 'stages', 'contracts'
const selectedWorkflowSector = ref('KONSTRUKSI');

const isAddDocTypeModalOpen = ref(false);
const isAddSectorModalOpen = ref(false);
const isAddContractTypeModalOpen = ref(false);

const docTypeForm = ref({
  name: '',
  code: '',
  isMandatory: true,
  description: ''
});

const sectorForm = ref({
  name: '',
  code: '',
  icon: '🏢',
  regulatoryBasis: '',
  defaultContractType: '',
  description: ''
});

const contractTypeForm = ref({
  name: '',
  code: '',
  sector: 'KONSTRUKSI',
  standardFormat: ''
});

// Master Datasets from legalStore
const masterDocTypes = computed(() => legalStore.state.masterDocTypes || []);
const masterSectors = computed(() => legalStore.state.masterSectors || []);
const masterContractTypes = computed(() => legalStore.state.masterContractTypes || []);

const getSelectedSectorObj = computed(() => {
  return masterSectors.value.find(s => s.code === selectedWorkflowSector.value) || masterSectors.value[0];
});

const currentSectorStages = computed(() => {
  return legalStore.getStagesForSector(selectedWorkflowSector.value);
});

const getAddButtonLabel = computed(() => {
  switch (activeTab.value) {
    case 'doctypes': return 'Tambah Tipe Dokumen';
    case 'sectors': return 'Tambah Sektor Industri';
    case 'contracts': return 'Tambah Tipe Kontrak';
    default: return 'Tambah Data';
  }
});

function openAddModalForCurrentTab() {
  if (activeTab.value === 'doctypes') {
    docTypeForm.value = { name: '', code: '', isMandatory: true, description: '' };
    isAddDocTypeModalOpen.value = true;
  } else if (activeTab.value === 'sectors') {
    sectorForm.value = { name: '', code: '', icon: '🏢', regulatoryBasis: '', defaultContractType: '', description: '' };
    isAddSectorModalOpen.value = true;
  } else if (activeTab.value === 'contracts') {
    contractTypeForm.value = { name: '', code: '', sector: 'KONSTRUKSI', standardFormat: '' };
    isAddContractTypeModalOpen.value = true;
  }
}

function submitAddDocType() {
  legalStore.addMasterDocType(docTypeForm.value);
  isAddDocTypeModalOpen.value = false;
}

function openEditDocType(item) {
  const newName = window.prompt(`Perbarui nama kategori dokumen "${item.name}":`, item.name);
  if (newName) {
    legalStore.updateMasterDocType(item.id, { name: newName });
  }
}

function confirmDeleteDocType(item) {
  if (window.confirm(`Hapus tipe dokumen "${item.name}" dari master data?`)) {
    legalStore.deleteMasterDocType(item.id);
  }
}

function submitAddSector() {
  legalStore.addMasterSector(sectorForm.value);
  isAddSectorModalOpen.value = false;
}

function openEditSector(sector) {
  const newName = window.prompt(`Perbarui nama sektor industri "${sector.name}":`, sector.name);
  if (newName) {
    legalStore.updateMasterSector(sector.id, { name: newName });
  }
}

function confirmDeleteSector(sector) {
  if (window.confirm(`Hapus sektor industri "${sector.name}" dari master data?`)) {
    legalStore.deleteMasterSector(sector.id);
  }
}

function submitAddContractType() {
  legalStore.addMasterContractType(contractTypeForm.value);
  isAddContractTypeModalOpen.value = false;
}

function confirmDeleteContractType(ct) {
  if (window.confirm(`Hapus tipe kontrak "${ct.name}" dari master data?`)) {
    legalStore.deleteMasterContractType(ct.id);
  }
}

function exportMasterDataJSON() {
  const data = {
    docTypes: legalStore.state.masterDocTypes,
    sectors: legalStore.state.masterSectors,
    stages: legalStore.state.masterStages,
    contractTypes: legalStore.state.masterContractTypes,
    exportedAt: new Date().toISOString()
  };

  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonStr);
  link.setAttribute('download', `LMS_Master_Data_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  legalStore.triggerToast('Master Data berhasil diekspor (JSON)', 'success');
}
</script>
