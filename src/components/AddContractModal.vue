<template>
  <div 
    v-if="legalStore.state.isAddContractModalOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-floating max-w-3xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[92vh]">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white text-[#0F172A]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] flex items-center justify-center shrink-0">
            <FileText class="w-5 h-5 text-[#4338CA]" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">Pendaftaran Kontrak &amp; Perjanjian Baru</h3>
            <p class="text-xs text-[#475569]">Registrasikan dokumen perjanjian komersial lengkap beserta klausul termin pembayaran.</p>
          </div>
        </div>
        <button 
          @click="closeModal" 
          class="rounded-xl p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 4 Stepper Tabs Matching Detail Modal -->
      <div class="flex border-b border-[#E2E8F0] px-6 bg-[#F8FAFC] gap-2 overflow-x-auto custom-scrollbar">
        <button 
          v-for="(tab, idx) in tabs" 
          :key="tab.id"
          type="button"
          @click="activeSubTab = tab.id"
          class="py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          :class="activeSubTab === tab.id ? 'border-[#2563EB] text-[#2563EB] bg-white' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'"
        >
          <span 
            class="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
            :class="activeSubTab === tab.id ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#64748B]'"
          >
            {{ idx + 1 }}
          </span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Modal Body (Form) -->
      <form @submit.prevent="handleSubmit" id="add-contract-form" class="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-[#0F172A]">
        
        <!-- ============================================== -->
        <!-- TAB 1: Ringkasan & Klausul Pokok               -->
        <!-- ============================================== -->
        <div v-show="activeSubTab === 'overview'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Entitas Perseroan -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Entitas Perusahaan <span class="text-rose-600">*</span>
              </label>
              <select v-model="form.company" required class="form-select">
                <option v-for="ent in companyOptions" :key="ent" :value="ent">{{ ent }}</option>
              </select>
            </div>

            <!-- Pihak Mitra / Counterparty -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Pihak Mitra (Counterparty) <span class="text-rose-600">*</span>
              </label>
              <input 
                v-model="form.counterparty" 
                type="text" 
                required 
                placeholder="Contoh: PT PLN (Persero) / Siemens AG" 
                class="form-input font-medium"
              />
            </div>
          </div>

          <!-- Judul Kontrak -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Judul Perjanjian / Kontrak <span class="text-rose-600">*</span>
            </label>
            <input 
              v-model="form.contractTitle" 
              type="text" 
              required 
              placeholder="Contoh: Perjanjian Jual Beli Tenaga Listrik PLTS Cirata 50 MW" 
              class="form-input font-medium"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Nomor Surat Kontrak -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Nomor Surat Perjanjian <span class="text-rose-600">*</span>
              </label>
              <input 
                v-model="form.contractNumber" 
                type="text" 
                required 
                placeholder="PPA-PLN-NE-2026-001" 
                class="form-input font-mono font-semibold"
              />
            </div>

            <!-- Jenis / Tipe Kontrak -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Jenis / Tipe Kontrak <span class="text-rose-600">*</span>
              </label>
              <select v-model="form.contractType" required class="form-select">
                <option v-for="cType in contractTypeOptions" :key="cType" :value="cType">{{ cType }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Proyek Terkait -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Proyek Terkait</label>
              <input 
                v-model="form.project" 
                type="text" 
                placeholder="Contoh: PLTS Cirata Tahap 1" 
                class="form-input"
              />
            </div>

            <!-- Tanggal Efektif -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Tanggal Mulai Berlaku <span class="text-rose-600">*</span>
              </label>
              <input 
                v-model="form.effectiveDate" 
                type="date" 
                required 
                class="form-input"
              />
            </div>

            <!-- Tanggal Selesai (Expiry) -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Tanggal Selesai (Expiry) <span class="text-rose-600">*</span>
              </label>
              <input 
                v-model="form.expiryDate" 
                type="date" 
                required 
                class="form-input"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- PIC Unit Bisnis -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">PIC Unit Bisnis</label>
              <input 
                v-model="form.pic" 
                type="text" 
                placeholder="Contoh: Hendra Gunawan (Operasional)" 
                class="form-input"
              />
            </div>

            <!-- Legal PIC -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Penasihat Hukum (Legal PIC)</label>
              <input 
                v-model="form.legalPic" 
                type="text" 
                placeholder="Contoh: Budi Santoso, S.H., LL.M." 
                class="form-input"
              />
            </div>
          </div>

          <!-- Kewajiban Pokok -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Kewajiban Pokok &amp; Ruang Lingkup</label>
            <textarea 
              v-model="form.keyObligations" 
              rows="3" 
              placeholder="Tuliskan komitmen pokok pekerjaan, delivery order, target kuantitas, atau jaminan layanan..." 
              class="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
            ></textarea>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 2: Nilai & Ketentuan Termin Pembayaran      -->
        <!-- ============================================== -->
        <div v-show="activeSubTab === 'payment'" class="space-y-4">
          <!-- Nilai Kontrak & Mata Uang Strip -->
          <div class="p-4 bg-[#EEF2FF] rounded-xl border border-[#C7D2FE] space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-[#4338CA] mb-1.5">
                  Total Nilai Kontrak (Nominal) <span class="text-rose-600">*</span>
                </label>
                <div class="relative">
                  <input 
                    v-model.number="form.contractValue" 
                    type="number" 
                    min="0" 
                    step="1000"
                    required 
                    placeholder="450000000000" 
                    class="form-input font-mono font-bold text-sm text-[#0F172A] pr-12"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4338CA]">
                    {{ form.currency }}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#4338CA] mb-1.5">Mata Uang</label>
                <select v-model="form.currency" class="form-select font-bold">
                  <option value="IDR">IDR (Rupiah Indonesia)</option>
                  <option value="USD">USD (Dolar Amerika Serikat)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>

            <!-- Preview Terbilang Format IDR -->
            <div class="flex items-center justify-between text-xs pt-1 border-t border-[#C7D2FE]/60">
              <span class="text-[#4338CA] font-medium">Kalkulasi Resmi:</span>
              <span class="font-bold font-mono text-[#0F172A]">
                {{ form.currency }} {{ formatNumber(form.contractValue) }}
              </span>
            </div>
          </div>

          <!-- Preset Cepat Termin Pembayaran -->
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <label class="block text-xs font-semibold text-[#0F172A]">
                Ketentuan Termin Pembayaran &amp; Retensi <span class="text-rose-600">*</span>
              </label>
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-[#64748B]">Pilihan Preset:</span>
                <select 
                  v-model="selectedTermPreset" 
                  @change="applyTermPreset"
                  class="form-select form-select-sm text-xs w-64"
                >
                  <option value="">-- Terapkan Template Termin --</option>
                  <option value="milestone4">Termin 4 Tahap (DP 20%, Progress 50%, BAST 25%, Retensi 5%)</option>
                  <option value="milestone3">Termin 3 Tahap (DP 30%, BAST 65%, Retensi 5% 6 Bulan)</option>
                  <option value="monthly">Pembayaran Bulanan Sesuai Invoice COD 30 Hari</option>
                  <option value="lumpsum">Lump Sum 100% setelah BAST Pekerjaan Selesai</option>
                  <option value="retainer">Retainer Bulanan Tetap (Fixed Monthly Fee)</option>
                </select>
              </div>
            </div>

            <textarea 
              v-model="form.paymentTerms" 
              rows="4" 
              required
              placeholder="Rincikan tahapan pembayaran, syarat pencairan, bukti verifikasi BAST, dan retensi jaminan pemeliharaan..." 
              class="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono leading-relaxed"
            ></textarea>
            <p class="text-[11px] text-[#64748B]">
              Anda dapat memilih template cepat di atas atau mengetik butir klausul termin secara manual sesuai draf kontrak.
            </p>
          </div>

          <!-- Sanksi & Denda Keterlambatan -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Sanksi &amp; Denda Keterlambatan (Penalty)
            </label>
            <input 
              v-model="form.penalty" 
              type="text" 
              placeholder="Contoh: Denda unavailability 0.1% per hari dari nilai invoice maksimal 5% dari nilai kontrak." 
              class="form-input"
            />
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 3: Ketentuan Opsi & Legal                   -->
        <!-- ============================================== -->
        <div v-show="activeSubTab === 'legal'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Ketentuan Perpanjangan (Renewal) -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Ketentuan Opsi Perpanjangan (Renewal)
              </label>
              <select v-model="form.renewalStatus" class="form-select">
                <option value="Non-Renewable">Non-Renewable (Berakhir Tetap / Tanpa Perpanjangan Otomatis)</option>
                <option value="Perpanjangan atas Kesepakatan Tertulis">Perpanjangan atas Kesepakatan Tertulis Para Pihak</option>
                <option value="Perpanjangan Otomatis (Auto-Renewal)">Perpanjangan Otomatis (Auto-Renewal per Tahun)</option>
                <option value="Dapat Diperpanjang 1x Periode Tambahan">Dapat Diperpanjang 1x Periode Tambahan</option>
              </select>
            </div>

            <!-- Hukum yang Berlaku -->
            <div>
              <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Hukum yang Berlaku (Governing Law)
              </label>
              <input 
                v-model="form.governingLaw" 
                type="text" 
                placeholder="Hukum Republik Indonesia" 
                class="form-input"
              />
            </div>
          </div>

          <!-- Forum Penyelesaian Sengketa -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Forum Penyelesaian Sengketa (Dispute Resolution)
            </label>
            <select v-model="form.disputeResolution" class="form-select">
              <option value="Arbitrase BANI di Jakarta">Arbitrase BANI (Badan Arbitrase Nasional Indonesia) di Jakarta</option>
              <option value="Pengadilan Negeri Jakarta Pusat">Pengadilan Negeri Jakarta Pusat</option>
              <option value="Singapore International Arbitration Centre (SIAC)">Singapore International Arbitration Centre (SIAC)</option>
              <option value="Musyawarah Mufakat & Mediasi Terlebih Dahulu">Musyawarah Mufakat &amp; Mediasi Terlebih Dahulu</option>
            </select>
          </div>

          <!-- Catatan / Remarks -->
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">Catatan Tambahan &amp; Ringkasan Strategis</label>
            <textarea 
              v-model="form.remarks" 
              rows="3" 
              placeholder="Tuliskan catatan konsesi, status jaminan pelaksanaan, referensi nota dinas direksi..." 
              class="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
            ></textarea>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 4: Berkas Digital                          -->
        <!-- ============================================== -->
        <div v-show="activeSubTab === 'document'" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Tautan Berkas Salinan Asli (PDF)
            </label>
            <input 
              v-model="form.documentLink" 
              type="text" 
              placeholder="https://docs.legal.local/contracts/PPA-PLN-NE-2026-001.pdf" 
              class="form-input font-mono"
            />
          </div>

          <!-- Upload Simulator -->
          <div class="p-6 bg-[#F8FAFC] rounded-xl border-2 border-dashed border-[#CBD5E1] text-center space-y-2">
            <div class="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto border border-[#BFDBFE]">
              <Upload class="w-5 h-5 text-[#2563EB]" />
            </div>
            <div class="font-semibold text-xs text-[#0F172A]">Unggah Berkas Kontrak Bertanda Tangan (PDF)</div>
            <p class="text-[11px] text-[#64748B] max-w-sm mx-auto">
              Seret dan lepaskan berkas salinan resmi PDF ke area ini, atau klik tombol untuk memilih dari komputer.
            </p>
            <button 
              type="button" 
              @click="simulateUpload"
              class="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] cursor-pointer transition shadow-2xs"
            >
              Pilih Berkas PDF
            </button>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
            <span class="font-bold">ℹ Catatan:</span>
            <span>Kontrak yang didaftarkan akan otomatis masuk ke register pemantauan SLA, masa siaga 30 hari, serta pencatatan audit trail perseroan.</span>
          </div>
        </div>

      </form>

      <!-- Modal Footer -->
      <div class="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
        <button 
          type="button" 
          @click="closeModal" 
          class="px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#64748B] font-semibold text-xs rounded-xl border border-[#CBD5E1] transition cursor-pointer"
        >
          Batal
        </button>

        <div class="flex items-center gap-2">
          <!-- Tombol Sebelumnya -->
          <button 
            v-if="currentTabIndex > 0"
            type="button"
            @click="prevTab"
            class="px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#0F172A] font-semibold text-xs rounded-xl border border-[#CBD5E1] transition cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <!-- Tombol Lanjut -->
          <button 
            v-if="currentTabIndex < tabs.length - 1"
            type="button"
            @click="nextTab"
            class="px-4 py-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
          >
            <span>Lanjut: {{ tabs[currentTabIndex + 1].label.split('. ')[1] }}</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>

          <!-- Tombol Simpan -->
          <button 
            type="submit" 
            form="add-contract-form"
            class="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl shadow-xs transition cursor-pointer focus:ring-3 focus:ring-[#BFDBFE] flex items-center gap-1.5"
          >
            <Check class="w-4 h-4" />
            <span>Simpan &amp; Daftarkan Kontrak</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { 
  X, 
  FileText, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload 
} from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const activeSubTab = ref('overview');
const selectedTermPreset = ref('');

const tabs = [
  { id: 'overview', label: '1. Ringkasan & Klausul' },
  { id: 'payment', label: '2. Termin Pembayaran' },
  { id: 'legal', label: '3. Ketentuan Opsi & Legal' },
  { id: 'document', label: '4. Berkas Digital' }
];

const currentTabIndex = computed(() => {
  return tabs.findIndex(t => t.id === activeSubTab.value);
});

function nextTab() {
  const nextIdx = currentTabIndex.value + 1;
  if (nextIdx < tabs.length) {
    activeSubTab.value = tabs[nextIdx].id;
  }
}

function prevTab() {
  const prevIdx = currentTabIndex.value - 1;
  if (prevIdx >= 0) {
    activeSubTab.value = tabs[prevIdx].id;
  }
}

const companyOptions = [
  'PT Nusantara Energi',
  'PT Nusabara Sinergi Bersama',
  'PT Aksa Energi Palapa',
  'PT Java Power Solutions',
  'PT Borneo Mineral Resources',
  'PT Sumatera Green Energy',
  'PT Nusantara Holdings Utama'
];

const contractTypeOptions = [
  'Power Purchase Agreement (PPA)',
  'Engineering Procurement Construction (EPC)',
  'Coal / Mineral Supply Agreement (CSA)',
  'Equipment Supply & Maintenance',
  'Perjanjian Sewa Lahan & Bangunan (Lease)',
  'Insurance All Risks Policy',
  'IT & Telecommunications Agreement',
  'Freight Charter & Logistik',
  'Inspection & Survey Agreement',
  'Non-Disclosure Agreement (NDA)',
  'Surat Perintah Kerja (SPK) / Jasa Konsultansi'
];

const form = reactive({
  company: 'PT Nusantara Energi',
  counterparty: '',
  contractTitle: '',
  contractNumber: '',
  contractType: 'Power Purchase Agreement (PPA)',
  project: '',
  effectiveDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  contractValue: null,
  currency: 'IDR',
  pic: 'Hendra Gunawan',
  legalPic: 'Budi Santoso, S.H., LL.M.',
  keyObligations: 'Penyediaan pasokan daya listrik minimal 75 GWh per tahun sesuai availability factor.',
  paymentTerms: 'Termin I (DP 20%): Setelah penandatanganan kontrak.\nTermin II (Milestone 50%): Setelah BAST Progres Tahap 1 disetujui.\nTermin III (Selesai 25%): Setelah BAST Final Serah Terima Pekerjaan.\nRetensi (5%): Dicairkan setelah masa pemeliharaan 180 hari.',
  penalty: 'Denda keterlambatan 1‰ per hari kalender maksimal 5% dari nilai kontrak sebelum PPN.',
  renewalStatus: 'Non-Renewable',
  governingLaw: 'Hukum Republik Indonesia',
  disputeResolution: 'Arbitrase BANI di Jakarta',
  documentLink: '',
  remarks: 'Kontrak komersial strategis grup perseroan.'
});

function applyTermPreset() {
  const p = selectedTermPreset.value;
  if (p === 'milestone4') {
    form.paymentTerms = 
      '• Termin I (Uang Muka/DP): 20% setelah penandatanganan kontrak & penyerahan Jaminan DP.\n' +
      '• Termin II (Prestasi Fisik 50%): 30% setelah BAST Progres Tahap I disetujui Pengawas.\n' +
      '• Termin III (Selesai 100%): 45% setelah BAST I (Provisional Hand Over).\n' +
      '• Retensi: 5% dicairkan setelah masa pemeliharaan 180 hari & BAST II (Final Hand Over).';
  } else if (p === 'milestone3') {
    form.paymentTerms = 
      '• Termin I (Uang Muka): 30% dibayarkan paling lambat 14 hari kalender setelah SPMK.\n' +
      '• Termin II (Pelunasan 65%): Setelah seluruh barang/jasa diserahkan dan diverifikasi BAST.\n' +
      '• Garansi Retensi (5%): Ditahan selama masa garansi 6 (enam) bulan kalender.';
  } else if (p === 'monthly') {
    form.paymentTerms = 
      'Pembayaran dilakukan secara bulanan (Cash On Delivery) paling lambat 30 hari kalender setelah invoice resmi, faktur pajak, dan rekapitulasi pekerjaan disetujui.';
  } else if (p === 'lumpsum') {
    form.paymentTerms = 
      'Pembayaran Lump Sum sebesar 100% dari total nilai kontrak setelah seluruh ruang lingkup pekerjaan selesai 100% dan diterbitkan BAST final tanpa catatan komplain.';
  } else if (p === 'retainer') {
    form.paymentTerms = 
      'Honorarium retainer dibayarkan setiap awal bulan berjalan paling lambat tanggal 5, ditransfer ke rekening resmi penyedia jasa.';
  }
}

function formatNumber(val) {
  if (!val) return '0';
  return Number(val).toLocaleString('id-ID');
}

function simulateUpload() {
  form.documentLink = `https://docs.legal.local/contracts/${form.contractNumber || 'DOK-2026'}.pdf`;
  legalStore.triggerToast('Salinan berkas asli PDF berhasil disimulasikan & ditautkan!', 'info');
}

function closeModal() {
  legalStore.state.isAddContractModalOpen = false;
}

function handleSubmit() {
  if (!form.contractTitle || !form.contractNumber || !form.counterparty || !form.effectiveDate || !form.expiryDate) {
    legalStore.triggerToast('Mohon lengkapi seluruh field wajib (*)', 'warning');
    return;
  }

  if (form.expiryDate <= form.effectiveDate) {
    legalStore.triggerToast('Kesalahan: Tanggal berakhir harus lebih besar daripada tanggal efektif.', 'error');
    activeSubTab.value = 'overview';
    return;
  }

  const success = legalStore.addContract(form);
  if (success) {
    closeModal();
  }
}
</script>
