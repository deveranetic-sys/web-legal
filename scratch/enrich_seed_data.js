import fs from 'fs';
import path from 'path';

const seedFilePath = '/Users/mac/Documents/antigravity/web-legal/src/data/seedData.js';
let content = fs.readFileSync(seedFilePath, 'utf8');

// We will construct the new initialTenders array with full rich data
const newTenders = [
  {
    id: 'TND-2026-001',
    tenderNumber: 'PLN-EPROC-2026-0418',
    title: 'Pengadaan EPC Pembangkit Listrik Tenaga Surya (PLTS) Terapung 50 MW',
    organizer: 'PT PLN (Persero) Kantor Pusat',
    company: 'PT Nusantara Energi',
    category: 'Energi & Ketenagalistrikan',
    sector: 'ENERGI',
    sectorLabel: 'Energi & Ketenagalistrikan',
    hpsValue: 145000000000,
    bidValue: 138750000000,
    announcementDate: '2026-02-10',
    deadlineDate: '2026-04-15',
    stage: 'EVALUASI_PEMBUKTIAN',
    status: 'ACTIVE',
    pic: 'Budi Santoso, S.H., LL.M.',
    location: 'Waduk Cirata, Jawa Barat',
    notes: 'Klarifikasi teknis (Aanwijzing) selesai. Sedang tahap evaluasi sampul II (penawaran harga dan jaminan penawaran).',
    locked: true,
    hash: 'SHA256:7f8b9a1c4d2e5f30e6a12b89c7d41f0a2e5d9c8b7a6f5e4d3c2b1a0f9e8d7c6b',
    submittedAt: '2026-02-26 14:30',
    gng: {
      scores: { fit: 5, cap: 4, com: 4, risk: 4, cash: 4, tech: 5 },
      totalScore: 86,
      decision: 'GO',
      note: 'Kesesuaian strategis portofolio EBT konsisten dengan target dekarbonisasi korporasi. Margin proyek sehat 12.8%.',
      by: 'Direktur Utama',
      date: '2026-02-11'
    },
    pricing: {
      directCost: 104500000000,
      indirectCost: 9500000000,
      riskContingency: 4200000000,
      marginPercent: 12.8,
      hpsRatio: 0.9569,
      isBelow80HPS: false,
      requiredPerformanceBond: 6937500000
    },
    gates: [
      { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2026-02-14', note: 'SBU Konstruksi & sertifikasi EBT terverifikasi lengkap' },
      { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'SELESAI', date: '2026-02-18', note: 'Analisis cash flow positif, modal kerja mencukupi' },
      { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'SELESAI', date: '2026-02-22', note: 'Draft kontrak EPC memenuhi syarat standar FIDIC Silver Book' },
      { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Utama', status: 'SELESAI', date: '2026-02-25', note: 'Disetujui untuk final submission penawaran harga' }
    ],
    clarifications: [
      { id: 'CLR-01', query: 'Apakah masa jaminan pemeliharaan (warranty period) solar inverter dapat dijamin oleh garansi prinsipal pabrikan 10 tahun?', askedBy: 'Tim Engineering', date: '2026-02-16', category: 'Teknis & Spesifikasi', impact: 'Biaya Pemeliharaan', answer: 'Dapat diterima sepanjang menyertakan Surat Dukungan Asli Pabrikan bergaransi minimal 10 tahun.', answeredAt: '2026-02-18', status: 'DIJAWAB', effect: 'Mengurangi risiko cadangan garansi internal' },
      { id: 'CLR-02', query: 'Mohon klarifikasi apakah titik interkoneksi gardu hubung 150 kV disediakan oleh PLN atau kontraktor EPC?', askedBy: 'Tim Teknis', date: '2026-02-17', category: 'Ruang Lingkup (Scope)', impact: 'Biaya Konstruksi', answer: 'Titik interkoneksi disediakan PLN, kontraktor hanya menarik kabel sampai kubikel incoming.', answeredAt: '2026-02-19', status: 'DIJAWAB', effect: 'Menghemat estimasi biaya kabel bawah air Rp 2.5 Miliar' }
    ],
    result: null,
    documents: [
      {
        id: 'TND-01-DOC-01',
        name: 'Akta Pendirian & Perubahan Terakhir (SK Kemenkumham)',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'AKTA-AHU-2025-0918.pdf',
        notes: 'SK Menkumham No. AHU-001928.AH.01.02.TH.2025 Valid',
        expiryDate: null,
        uploadedAt: '2026-02-12'
      },
      {
        id: 'TND-01-DOC-02',
        name: 'NIB Berbasis Risiko OSS RBA & Lampiran KBLI 42201',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'NIB-OSS-91200034182.pdf',
        notes: 'Sektor Ketenagalistrikan & Konstruksi Aktif',
        expiryDate: null,
        uploadedAt: '2026-02-12'
      },
      {
        id: 'TND-01-DOC-03',
        name: 'Sertifikat Badan Usaha (SBU) Jasa Pelaksana Konstruksi Ketenagalistrikan',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SBU-LPJK-EL001-2024.pdf',
        notes: 'Klasifikasi EL001 Kualifikasi Besar (B) Valid s/d 2027',
        expiryDate: '2027-08-30',
        uploadedAt: '2026-02-13'
      },
      {
        id: 'TND-01-DOC-04',
        name: 'Sertifikat Standar & Kelaikan Operasi Pembangkit EBT (SLO)',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SLO-DJKE-ESDM-2025.pdf',
        notes: 'Diterbitkan Dirjen Ketenagalistrikan ESDM',
        expiryDate: '2029-01-15',
        uploadedAt: '2026-02-13'
      },
      {
        id: 'TND-01-DOC-05',
        name: 'Sertifikat Tingkat Komponen Dalam Negeri (TKDN) Minimal 40%',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'TKDN-SOLAR-CELL-43PCT.pdf',
        notes: 'Verifikasi Kemenperin No. 1290/SJ-IND.8/TKDN/2025 (43.2%)',
        expiryDate: '2028-11-10',
        uploadedAt: '2026-02-14'
      },
      {
        id: 'TND-01-DOC-06',
        name: 'Sertifikat SMK3 PP 50/2012 & ISO 45001:2018 Lingkup EPC',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SMK3-EMAS-KEMNAKER-2025.pdf',
        notes: 'Tingkat Pencapaian 92% (Bendera Emas)',
        expiryDate: '2028-05-20',
        uploadedAt: '2026-02-14'
      },
      {
        id: 'TND-01-DOC-07',
        name: 'Surat Keterangan Pengalaman Kerja Sejenis (BAST & Kontrak Terakhir)',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'REF-KONTRAK-PLTS-SUMBA.pdf',
        notes: 'Nilai proyek Rp98 Miliar selesai 100% tanpa denda',
        expiryDate: null,
        uploadedAt: '2026-02-17'
      },
      {
        id: 'TND-01-DOC-08',
        name: 'Laporan Keuangan Audit Akuntan Publik 3 Tahun Terakhir (KAP)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'AUDIT-REPORT-KAP-2023-2025.pdf',
        notes: 'Opini Wajar Tanpa Pengecualian (WTP)',
        expiryDate: null,
        uploadedAt: '2026-02-18'
      },
      {
        id: 'TND-01-DOC-09',
        name: 'Jaminan Penawaran (Bid Bond / Bank Garansi) 2.5% Nilai HPS',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'BG-BID-BOND-MANDIRI-PLTS.pdf',
        notes: 'Bank Garansi Bank Mandiri Rp2.775.000.000 valid 90 hari',
        expiryDate: '2026-05-15',
        uploadedAt: '2026-02-18'
      },
      {
        id: 'TND-01-DOC-10',
        name: 'Surat Pernyataan Tidak Masuk Daftar Hitam (Blacklist LKPP/Kemenkeu)',
        category: 'Kepatuhan & Integritas',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'PERNYATAAN-NON-BLACKLIST.pdf',
        notes: 'Bermaterai cukup dan tercatat pada portal INAPROC',
        expiryDate: null,
        uploadedAt: '2026-02-12'
      }
    ]
  },
  {
    id: 'TND-2026-002',
    tenderNumber: 'IP-PENGADAAN-2026-089',
    title: 'Pengadaan Pasokan Batubara Medium-High CV 5.200 kkal Periode 2026',
    organizer: 'PT PLN Indonesia Power',
    company: 'PT Nusantara Energi',
    category: 'Pertambangan & Mineral',
    sector: 'PERTAMBANGAN',
    sectorLabel: 'Pertambangan & Mineral',
    hpsValue: 320000000000,
    bidValue: 308500000000,
    announcementDate: '2026-02-15',
    deadlineDate: '2026-03-25',
    stage: 'PENYAMPAIAN_PENAWARAN',
    status: 'ACTIVE',
    pic: 'Dimas Prasetyo, S.H.',
    location: 'PLTU Suralaya Unit 5-7, Cilegon',
    notes: 'Batas akhir unggah dokumen tinggal 10 hari kerja. Perlu percepatan 2 dokumen yang masih kurang.',
    locked: false,
    hash: null,
    gng: {
      scores: { fit: 5, cap: 5, com: 4, risk: 3, cash: 4, tech: 4 },
      totalScore: 83,
      decision: 'GO',
      note: 'Cadangan tambang mencukupi spesifikasi CV 5200 kkal, margin 11.2%.',
      by: 'Bid Committee',
      date: '2026-02-16'
    },
    pricing: {
      directCost: 242000000000,
      indirectCost: 21500000000,
      riskContingency: 8500000000,
      marginPercent: 11.2,
      hpsRatio: 0.964,
      isBelow80HPS: false,
      requiredPerformanceBond: 15425000000
    },
    gates: [
      { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2026-02-20', note: 'Kesesuaian kalori & sertifikat surveyor terverifikasi' },
      { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'SELESAI', date: '2026-02-24', note: 'Skema termin bulanan disetujui' },
      { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'MENUNGGU', date: null, note: 'Menunggu kelengkapan dokumen COA laboratorium Sucofindo dan DMO' },
      { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Operasional', status: 'BERIKUTNYA', date: null, note: 'Persetujuan akhir sebelum submission' }
    ],
    clarifications: [
      { id: 'CLR-01', query: 'Apakah penyesuaian harga (Price Adjustment) mengikuti formula HBA (Harga Batubara Acuan) bulanan?', askedBy: 'Tim Niaga', date: '2026-02-22', category: 'Komersial & Harga', impact: 'Formula Penagihan', answer: 'Ya, harga invoice disesuaikan formula HBA ESDM pada bulan pengapalan (B/L date).', answeredAt: '2026-02-24', status: 'DIJAWAB', effect: 'Mitigasi volatilitas harga pasar' }
    ],
    result: null,
    documents: [
      {
        id: 'TND-02-DOC-01',
        name: 'IUP Operasi Produksi Batubara / IUPK Terdaftar MODI ESDM',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'IUP-OP-ESDM-MODI.pdf',
        notes: 'Nomor Register MODI: 541.15/ESDM-OP/2024',
        expiryDate: '2034-08-11',
        uploadedAt: '2026-02-18'
      },
      {
        id: 'TND-02-DOC-02',
        name: 'Persetujuan RKAB (Rencana Kerja dan Anggaran Biaya) 2026',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SK-RKAB-2026-ESDM.pdf',
        notes: 'Kuota produksi disetujui 2.500.000 Metrik Ton',
        expiryDate: '2026-12-31',
        uploadedAt: '2026-02-19'
      },
      {
        id: 'TND-02-DOC-03',
        name: 'Laporan Eksplorasi & Estimasi Cadangan (KCMI / JORC Code)',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'JORC-REPORT-CALIFORNIA-2025.pdf',
        notes: 'Disusun oleh Competent Person Indonesia (CPI)',
        expiryDate: null,
        uploadedAt: '2026-02-20'
      },
      {
        id: 'TND-02-DOC-04',
        name: 'Sertifikat Analisis Batubara (Certificate of Sampling & Analysis - COA)',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Hasil pengujian laboratorium independen (Sucofindo / Carsurin) belum terbit',
        expiryDate: null,
        uploadedAt: null
      },
      {
        id: 'TND-02-DOC-05',
        name: 'Surat Izin Penggunaan Pelabuhan Jetty / Terminal Khusus Tersus',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'IZIN-TERSUS-HUBDAT-2024.pdf',
        notes: 'Izin Operasional Tersus dari Dirjen Hubla',
        expiryDate: '2027-11-04',
        uploadedAt: '2026-02-22'
      },
      {
        id: 'TND-02-DOC-06',
        name: 'Surat Pernyataan Kesanggupan DMO (Domestic Market Obligation) 25%',
        category: 'Kepatuhan & Integritas',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Menunggu tanda tangan basah & materai elektronik Direktur Operasional',
        expiryDate: null,
        uploadedAt: null
      },
      {
        id: 'TND-02-DOC-07',
        name: 'Bukti Pemenuhan Kewajiban Royalti / PNBP Batubara e-PNBP',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'NTPN-ROYALTI-SIMPONI-2025.pdf',
        notes: 'Lunas Triwulan IV 2025 dengan bukti NTPN',
        expiryDate: null,
        uploadedAt: '2026-02-23'
      },
      {
        id: 'TND-02-DOC-08',
        name: 'Jaminan Penawaran Bank Garansi Asli (Bid Bond)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'BIDBOND-BNI-PLTU-2026.pdf',
        notes: 'Terbit BNI Jakarta Pusat senilai Rp8.000.000.000 valid 90 hari kalender',
        expiryDate: '2026-05-30',
        uploadedAt: '2026-02-25'
      }
    ]
  },
  {
    id: 'TND-2026-003',
    tenderNumber: 'ESDM-DITJEN-2026-012',
    title: 'Jasa Konsultansi Amdal & Persetujuan Lingkungan Wilayah Usaha Pertambangan',
    organizer: 'Kementerian ESDM & Ditjen Minerba',
    company: 'PT Borneo Mineral Resources',
    category: 'Pertambangan & Mineral',
    sector: 'PERTAMBANGAN',
    sectorLabel: 'Pertambangan & Mineral',
    hpsValue: 14200000000,
    bidValue: 13650000000,
    announcementDate: '2026-01-15',
    deadlineDate: '2026-03-30',
    stage: 'EVALUASI_PEMBUKTIAN',
    status: 'ACTIVE',
    pic: 'Siti Rahmawati, S.H., M.H.',
    location: 'Kutai Kartanegara, Kalimantan Timur',
    notes: 'Kualifikasi lolos dengan nilai teknis 94.2. Sedang dijadwalkan wawancara pembuktian kualifikasi langsung di Ditjen Minerba.',
    locked: true,
    hash: 'SHA256:3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef012',
    submittedAt: '2026-01-29 11:00',
    gng: {
      scores: { fit: 4, cap: 5, com: 4, risk: 2, cash: 4, tech: 5 },
      totalScore: 80,
      decision: 'GO',
      note: 'Tim ahli KTPA/ATPA lengkap, risiko hukum minimal.',
      by: 'Direktur Konsultansi',
      date: '2026-01-18'
    },
    pricing: {
      directCost: 9800000000,
      indirectCost: 950000000,
      riskContingency: 400000000,
      marginPercent: 14.2,
      hpsRatio: 0.961,
      isBelow80HPS: false,
      requiredPerformanceBond: 682500000
    },
    gates: [
      { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2026-01-22', note: 'Portofolio studi Amdal dan akreditasi LPJP terpenuhi' },
      { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'SELESAI', date: '2026-01-25', note: 'Remunerasi tenaga ahli sesuai billing rate INKINDO' },
      { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'SELESAI', date: '2026-01-27', note: 'Perjanjian kerahasiaan data geologis disetujui' },
      { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Utama', status: 'SELESAI', date: '2026-01-28', note: 'Final submission disetujui' }
    ],
    clarifications: [],
    result: null,
    documents: [
      {
        id: 'TND-03-DOC-01',
        name: 'Sertifikat Registrasi Lembaga Penyedia Jasa Penyusun (LPJP) Amdal KLHK',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'LPJP-KLHK-NO-0021-2024.pdf',
        notes: 'Terakreditasi A oleh KLHK Republik Indonesia',
        expiryDate: '2027-04-10',
        uploadedAt: '2026-01-20'
      },
      {
        id: 'TND-03-DOC-02',
        name: 'Sertifikasi Kompetensi Penyusun Amdal (KTPA / ATPA) Tim Ahli',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'KTPA-ATPA-TIM-AHLI-5-ORG.pdf',
        notes: '5 Personil Ketua & Anggota Tim bersertifikat BNSP aktif',
        expiryDate: '2027-09-15',
        uploadedAt: '2026-01-20'
      },
      {
        id: 'TND-03-DOC-03',
        name: 'Akta Pendirian & Pengesahan Kemenkumham Perseroan',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'AKTA-BORNEO-AHU.pdf',
        notes: 'Lengkap beserta Berita Acara RUPS Terakhir',
        expiryDate: null,
        uploadedAt: '2026-01-21'
      },
      {
        id: 'TND-03-DOC-04',
        name: 'SPT Tahunan PPh Badan Tahun Pajak Terakhir',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SPT-BADAN-2024-BPE.pdf',
        notes: 'BPE DJP Online No. S-091823/PPB/WPJ.08/2025',
        expiryDate: null,
        uploadedAt: '2026-01-21'
      },
      {
        id: 'TND-03-DOC-05',
        name: 'Pakta Integritas Anti-Suap & Anti-Gratifikasi',
        category: 'Kepatuhan & Integritas',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'PAKTA-ESDM-MINERBA-2026.pdf',
        notes: 'Sesuai format baku LKPP & Kementerian ESDM',
        expiryDate: null,
        uploadedAt: '2026-01-22'
      },
      {
        id: 'TND-03-DOC-06',
        name: 'Jaminan Penawaran Konsultansi (Surety Bond Asli)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SURETY-BOND-JAMINDO-2026.pdf',
        notes: 'Diterbitkan PT Jamkrindo valid hingga April 2026',
        expiryDate: '2026-04-30',
        uploadedAt: '2026-01-22'
      },
      {
        id: 'TND-03-DOC-07',
        name: 'Surat Pernyataan Kesediaan Ditugaskan Seluruh Tenaga Ahli',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'KOMITMEN-AHLI-5-PERSONIL.pdf',
        notes: 'Ditandatangani bermaterai oleh seluruh tim ahli',
        expiryDate: null,
        uploadedAt: '2026-01-22'
      }
    ]
  },
  {
    id: 'TND-2026-004',
    tenderNumber: 'PTBA-LOG-2026-055',
    title: 'Sewa Jangka Panjang Alat Berat Excavator 100 Ton & Dump Truck 60 Ton',
    organizer: 'PT Bukit Asam Tbk (Mining Site Tanjung Enim)',
    company: 'PT Sinergi Tambang Gemilang',
    category: 'Pertambangan & Mineral',
    sector: 'PERTAMBANGAN',
    sectorLabel: 'Pertambangan & Mineral',
    hpsValue: 88500000000,
    bidValue: 84200000000,
    announcementDate: '2026-02-28',
    deadlineDate: '2026-04-20',
    stage: 'PENGUMUMAN_PENDAFTARAN',
    status: 'ACTIVE',
    pic: 'Anisa Maharani, S.H.',
    location: 'Tanjung Enim, Sumatera Selatan',
    notes: 'Tahap awal pendaftaran & unduh dokumen pemilihan. Masih terdapat 4 dokumen krusial yang harus disiapkan oleh vendor dan finance.',
    locked: false,
    hash: null,
    gng: {
      scores: { fit: 4, cap: 3, com: 4, risk: 3, cash: 3, tech: 4 },
      totalScore: 68,
      decision: 'GO_BERSYARAT',
      note: 'Ketergantungan pada surat dukungan ATPM dan jaminan pengiriman unit tepat waktu.',
      by: 'Bid Committee',
      date: '2026-03-01'
    },
    pricing: {
      directCost: 65500000000,
      indirectCost: 6200000000,
      riskContingency: 3200000000,
      marginPercent: 10.5,
      hpsRatio: 0.951,
      isBelow80HPS: false,
      requiredPerformanceBond: 4210000000
    },
    gates: [
      { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'REVISI', date: '2026-03-03', note: 'Menunggu konfirmasi ATPM untuk 12 unit dump truck' },
      { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'MENUNGGU', date: null, note: 'Menunggu finalisasi penawaran sewa' },
      { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'BERIKUTNYA', date: null, note: 'Klausul asuransi HEAR dan tanggung jawab kerusakan alat' },
      { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Operasional', status: 'BERIKUTNYA', date: null, note: 'Persetujuan akhir' }
    ],
    clarifications: [],
    result: null,
    documents: [
      {
        id: 'TND-04-DOC-01',
        name: 'Surat Dukungan Resmi Pabrikan / ATPM (Letter of Support Komatsu/Caterpillar)',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Menunggu konfirmasi ketersediaan unit armada baru dari PT United Tractors Tbk',
        expiryDate: null,
        uploadedAt: null
      },
      {
        id: 'TND-04-DOC-02',
        name: 'Sertifikat Kelayakan Operasi Alat Berat (SILO) dari Ditjen Minerba',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SILO-MINERBA-ARMADA-BATCH1.pdf',
        notes: '12 Unit Excavator lolos uji kelayakan operasi',
        expiryDate: '2027-01-10',
        uploadedAt: '2026-03-02'
      },
      {
        id: 'TND-04-DOC-03',
        name: 'Laporan Keuangan Audit Terakhir Tahun Buku 2025',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'DALAM_PROSES',
        fileRef: null,
        notes: 'Sedang proses finalisasi oleh Kantor Akuntan Publik (KAP Tanubrata)',
        expiryDate: null,
        uploadedAt: null
      },
      {
        id: 'TND-04-DOC-04',
        name: 'Polis Asuransi Alat Berat Heavy Equipment All Risks (HEAR)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Perlu quotation resmi dari Asuransi Jasindo / Tugu Insurance',
        expiryDate: null,
        uploadedAt: null
      },
      {
        id: 'TND-04-DOC-05',
        name: 'Akta Pendirian & Perubahan Direksi/Komisaris Terakhir',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'AKTA-SINERGI-AHU-2025.pdf',
        notes: 'Akta Notaris No. 24 tanggal 15 Agustus 2025',
        expiryDate: null,
        uploadedAt: '2026-03-01'
      },
      {
        id: 'TND-04-DOC-06',
        name: 'NIB OSS RBA & KBLI 77309 (Aktivitas Penyewaan Alat Berat)',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'NIB-SINERGI-TAMBANG.pdf',
        notes: 'KBLI Utama aktif dan terverifikasi',
        expiryDate: null,
        uploadedAt: '2026-03-01'
      },
      {
        id: 'TND-04-DOC-07',
        name: 'Sertifikat ISO 45001:2018 (K3 Tambang) & ISO 9001:2015',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'ISO-45001-SINERGI.pdf',
        notes: 'Akreditasi KAN aktif hingga 2027',
        expiryDate: '2027-06-30',
        uploadedAt: '2026-03-02'
      },
      {
        id: 'TND-04-DOC-08',
        name: 'Jaminan Penawaran (Bank Garansi 2% Nilai HPS)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Belum diajukan ke Bank Mandiri / BRI',
        expiryDate: null,
        uploadedAt: null
      }
    ]
  },
  {
    id: 'TND-2026-005',
    tenderNumber: 'PLN-JBB-2025-1102',
    title: 'Revitalisasi Proteksi Gardu Induk & Saluran Udara Tegangan Tinggi (SUTT) 150 kV',
    organizer: 'PT PLN (Persero) UIP JBB',
    company: 'PT Java Power Solutions',
    category: 'Energi & Ketenagalistrikan',
    sector: 'ENERGI',
    sectorLabel: 'Energi & Ketenagalistrikan',
    hpsValue: 62000000000,
    bidValue: 58900000000,
    announcementDate: '2025-11-20',
    deadlineDate: '2026-01-25',
    stage: 'SPPBJ_KONTRAK',
    status: 'WON',
    pic: 'Budi Santoso, S.H., LL.M.',
    location: 'Cawang - Gandul, DKI Jakarta',
    notes: 'Pemenang lelang resmi ditetapkan. SPPBJ telah terbit dan siap dikonversi menjadi Kontrak Korporasi aktif.',
    locked: true,
    hash: 'SHA256:9f8e7d6c5b4a3210fedcba9876543210abcdef0123456789abcdef0123456789',
    submittedAt: '2025-12-20 09:15',
    gng: {
      scores: { fit: 5, cap: 5, com: 5, risk: 4, cash: 4, tech: 5 },
      totalScore: 92,
      decision: 'GO',
      note: 'Peluang menang tinggi dengan reputasi pekerjaan Gardu Induk sejenis.',
      by: 'Direktur Operasional',
      date: '2025-11-22'
    },
    pricing: {
      directCost: 44200000000,
      indirectCost: 4100000000,
      riskContingency: 1800000000,
      marginPercent: 14.8,
      hpsRatio: 0.950,
      isBelow80HPS: false,
      requiredPerformanceBond: 2945000000
    },
    gates: [
      { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2025-11-28', note: 'Lulus evaluasi teknis 96.5' },
      { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'SELESAI', date: '2025-12-05', note: 'Struktur harga kompetitif' },
      { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'SELESAI', date: '2025-12-12', note: 'Syarat kepatuhan K3 dan jaminan terpenuhi' },
      { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Utama', status: 'SELESAI', date: '2025-12-18', note: 'Disetujui penuh' }
    ],
    clarifications: [],
    result: {
      status: 'MENANG',
      date: '2026-02-05',
      rank: 1,
      winner: 'PT Java Power Solutions',
      winPrice: 58900000000,
      note: 'Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) No. SPPBJ-PLN-JBB-2026-019 telah terbit.',
      lessons: [
        'Kekuatan sertifikasi personil K3 Listrik & dokumen kualifikasi lengkap memberi poin teknis tertinggi.',
        'Jaminan bank BCA yang cepat terbit memperlancar proses verifikasi pasca penetapan pemenang.'
      ]
    },
    documents: [
      {
        id: 'TND-05-DOC-01',
        name: 'Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) dari PLN',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SPPBJ-PLN-JBB-2026-019.pdf',
        notes: 'Diterbitkan General Manager PLN UIP JBB',
        expiryDate: null,
        uploadedAt: '2026-02-05'
      },
      {
        id: 'TND-05-DOC-02',
        name: 'Jaminan Pelaksanaan (Performance Bond 5% Nilai Kontrak)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'PERFORMANCE-BOND-BCA-2026.pdf',
        notes: 'Senilai Rp2.945.000.000 valid 180 hari kalender',
        expiryDate: '2026-08-10',
        uploadedAt: '2026-02-10'
      },
      {
        id: 'TND-05-DOC-03',
        name: 'Dokumen Verifikasi Pemilik Manfaat (Beneficial Ownership AHU)',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'BO-AHU-KEMENKUMHAM-2026.pdf',
        notes: 'Pernyataan BO terdaftar per Perpres No. 13/2018',
        expiryDate: null,
        uploadedAt: '2026-02-06'
      },
      {
        id: 'TND-05-DOC-04',
        name: 'Daftar Personil Ahli K3 Listrik & K3 Konstruksi Madya',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SKA-K3-LISTRIK-TIM.pdf',
        notes: 'SKP Ahli K3 Kemenaker aktif',
        expiryDate: '2028-02-15',
        uploadedAt: '2026-02-06'
      }
    ]
  },
  {
    id: 'TND-2026-006',
    tenderNumber: 'PUPR-BM-2026-1044',
    title: 'Pekerjaan Struktur Jembatan Cable Stayed & Oprit Akses Pelabuhan Patimban Paket 3B',
    organizer: 'Kementerian Pekerjaan Umum dan Perumahan Rakyat (Ditjen Bina Marga)',
    company: 'PT Nusantara Energi',
    category: 'Konstruksi & Infrastruktur',
    sector: 'KONSTRUKSI',
    sectorLabel: 'Konstruksi & Infrastruktur',
    hpsValue: 220000000000,
    bidValue: 171600000000,
    announcementDate: '2026-02-18',
    deadlineDate: '2026-04-05',
    stage: 'EVALUASI_PEMBUKTIAN',
    status: 'ACTIVE',
    pic: 'Budi Santoso, S.H., LL.M.',
    location: 'Subang, Jawa Barat',
    notes: 'Penawaran 78.0% HPS memicu klausul Perpres 16/2018 & Standar Dokumen Pemilihan LKPP: Wajib evaluasi kewajaran harga (EKH) & jaminan pelaksanaan 5% dari HPS (Rp11 Miliar).',
    locked: false,
    hash: null,
    gng: {
      scores: { fit: 5, cap: 4, com: 4, risk: 4, cash: 3, tech: 5 },
      totalScore: 78,
      decision: 'GO',
      note: 'Proyek strategis nasional, penawaran agresif 78% HPS didukung efisiensi rantai pasok beton pracetak terafiliasi.',
      by: 'Bid Committee & Direktur Konstruksi',
      date: '2026-02-20'
    },
    pricing: {
      directCost: 139000000000,
      indirectCost: 11500000000,
      riskContingency: 5500000000,
      marginPercent: 9.1,
      hpsRatio: 0.78,
      isBelow80HPS: true,
      requiredPerformanceBond: 11000000000
    },
    gates: [
      { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2026-02-24', note: 'Metode kerja erection girder & perancah disetujui konsultan' },
      { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'SELESAI', date: '2026-02-28', note: 'Evaluasi kewajaran harga (EKH) siap dihadapi, cash flow bridging loan aman' },
      { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'MENUNGGU', date: null, note: 'Verifikasi jaminan pelaksanaan 5% HPS (Rp11 M) dan klausul denda keterlambatan' },
      { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Utama', status: 'BERIKUTNYA', date: null, note: 'Menunggu persetujuan legal' }
    ],
    clarifications: [
      { id: 'CLR-01', query: 'Apakah masa pelaksanaan 270 hari kalender termasuk masa uji beban jembatan dinamis (dynamic loading test)?', askedBy: 'Chief Engineer', date: '2026-02-25', category: 'Teknis & Spesifikasi', impact: 'Jadwal & Biaya Uji', answer: 'Ya, uji beban dinamis harus diselesaikan dalam kurun 270 hari kalender sebelum serah terima pertama (PHO).', answeredAt: '2026-02-27', status: 'DIJAWAB', effect: 'Penyesuaian kurva S pekerjaan akhir' }
    ],
    result: null,
    documents: [
      {
        id: 'TND-06-DOC-01',
        name: 'Sertifikat Badan Usaha (SBU) Jasa Konstruksi Sipil Jembatan (BS001 / SI004)',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SBU-LPJK-BS001-KUALIFIKASI-BESAR.pdf',
        notes: 'SBU LPJK Aktif Kualifikasi B2 Subklasifikasi Jembatan Layang',
        expiryDate: '2027-10-15',
        uploadedAt: '2026-02-21'
      },
      {
        id: 'TND-06-DOC-02',
        name: 'SKK Konstruksi Ahli Madya / Utama Bidang Teknik Jembatan & Jalan',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'SKK-AHLI-JEMBATAN-TIM.pdf',
        notes: 'General Superintendent bersertifikat LPJK jenjang 9',
        expiryDate: '2028-04-12',
        uploadedAt: '2026-02-21'
      },
      {
        id: 'TND-06-DOC-03',
        name: 'Dokumen Analisa Harga Satuan Pekerjaan (AHSP) & Penjelasan Kewajaran Harga (<80% HPS)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'AHSP-EKH-PATIMBAN-78PCT.pdf',
        notes: 'Rincian efisiensi batching plant milik sendiri dan komitmen pabrikan precast girder',
        expiryDate: null,
        uploadedAt: '2026-02-27'
      },
      {
        id: 'TND-06-DOC-04',
        name: 'Jaminan Penawaran (Bid Bond Bank Mandiri 2.5% HPS - Rp5.5 Miliar)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'BID-BOND-MANDIRI-PATIMBAN.pdf',
        notes: 'Asli telah diserahkan ke Pokja Ditjen Bina Marga',
        expiryDate: '2026-06-15',
        uploadedAt: '2026-02-25'
      },
      {
        id: 'TND-06-DOC-05',
        name: 'Rencana Keselamatan Konstruksi (RKK) & Sistem Manajemen K3 Konstruksi',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'RKK-PATIMBAN-PAKET3B.pdf',
        notes: 'Tanda tangan Ahli K3 Konstruksi & Direktur Operasional',
        expiryDate: null,
        uploadedAt: '2026-02-23'
      },
      {
        id: 'TND-06-DOC-06',
        name: 'Surat Komitmen Kesanggupan Penerbitan Jaminan Pelaksanaan 5% Nilai HPS (Rp11 Miliar)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'KOMITMEN-PERF-BOND-5PCT-HPS.pdf',
        notes: 'Surat dukungan bank penerbit garansi Mandiri Corporate',
        expiryDate: null,
        uploadedAt: '2026-02-28'
      }
    ]
  },
  {
    id: 'TND-2026-007',
    tenderNumber: 'PGAS-PROJ-2026-003',
    title: 'EPC Pembangunan Jaringan Pipa Transmisi Gas Bumi Dumai - Sei Mangkei 24 Inch',
    organizer: 'SKK Migas - PT Pertamina Gas (Pertagas)',
    company: 'PT Nusantara Energi',
    category: 'Minyak & Gas Bumi',
    sector: 'MIGAS',
    sectorLabel: 'Minyak & Gas Bumi',
    hpsValue: 425000000000,
    bidValue: 395250000000,
    announcementDate: '2026-03-01',
    deadlineDate: '2026-05-10',
    stage: 'AANWIJZING',
    status: 'ACTIVE',
    pic: 'Dimas Prasetyo, S.H.',
    location: 'Dumai - Sei Mangkei, Riau & Sumut',
    notes: 'Sedang berlangsung masa tanya jawab Pokja. Klarifikasi spesifikasi material pipa ASTM A106 Grade B dan pemenuhan TKDN minimum 40%.',
    locked: false,
    hash: null,
    gng: {
      scores: { fit: 5, cap: 5, com: 4, risk: 4, cash: 4, tech: 5 },
      totalScore: 89,
      decision: 'GO',
      note: 'Proyek EPC Midstream pipa gas, sinergi konsorsium pabrikan pipa baja ber-TKDN tinggi 46%.',
      by: 'VP EPC & Direktur Utama',
      date: '2026-03-03'
    },
    pricing: {
      directCost: 312000000000,
      indirectCost: 28000000000,
      riskContingency: 12500000000,
      marginPercent: 10.8,
      hpsRatio: 0.93,
      isBelow80HPS: false,
      requiredPerformanceBond: 19762500000
    },
    gates: [
      { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: '2026-03-08', note: 'Sertifikat CIVD SKK Migas dan TKDN 46% memenuhi kriteria tender' },
      { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'MENUNGGU', date: null, note: 'Sedang validasi fasilitas Letter of Credit (L/C) impor fitting pipa' },
      { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'BERIKUTNYA', date: null, note: 'Review draft Joint Operation Agreement (JOA) dengan mitra pabrikan' },
      { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Utama', status: 'BERIKUTNYA', date: null, note: 'Persetujuan akhir submission' }
    ],
    clarifications: [
      { id: 'CLR-01', query: 'Apakah dokumen sertifikat Tingkat Komponen Dalam Negeri (TKDN) harus terverifikasi surveyor independen (PT Sucofindo / Surveyor Indonesia)?', askedBy: 'Tim Legal & TKDN', date: '2026-03-05', category: 'Kepatuhan & Regulasi', impact: 'Evaluasi Pembobotan HEA', answer: 'Wajib menyertakan sertifikat tanda sah TKDN Kemenperin yang masih berlaku atau surat verifikasi resmi.', answeredAt: '2026-03-07', status: 'DIJAWAB', effect: 'Berhak atas preferensi harga HEA 7.5%' }
    ],
    result: null,
    documents: [
      {
        id: 'TND-07-DOC-01',
        name: 'Surat Pengganti Dokumen Administrasi (SPDA) Centralized Integrated Vendor Database (CIVD) Migas',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'CIVD-MIGAS-SKK-2026.pdf',
        notes: 'Status Vendor Aktif & Terverifikasi di portal CIVD SKK Migas',
        expiryDate: '2027-02-28',
        uploadedAt: '2026-03-04'
      },
      {
        id: 'TND-07-DOC-02',
        name: 'Sertifikat Tingkat Komponen Dalam Negeri (TKDN) Pipa & Jasa EPC Minimum 40%',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'TKDN-PIPA-SEI-MANGKEI-46PCT.pdf',
        notes: 'Komitmen TKDN Gabungan Barang & Jasa 46.5%',
        expiryDate: '2028-09-10',
        uploadedAt: '2026-03-05'
      },
      {
        id: 'TND-07-DOC-03',
        name: 'Sertifikasi CSMS (Contractor Safety Management System) SKK Migas Kategori High Risk',
        category: 'Kualifikasi Teknis',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'CSMS-HIGH-RISK-SKK-MIGAS.pdf',
        notes: 'Nilai CSMS 94 (Lolos Prakualifikasi Risiko Tinggi)',
        expiryDate: '2027-05-15',
        uploadedAt: '2026-03-05'
      },
      {
        id: 'TND-07-DOC-04',
        name: 'Jaminan Penawaran (Bid Bond 2% HPS dari Bank Mandiri)',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'BID-BOND-MIGAS-PGAS.pdf',
        notes: 'Senilai Rp8.500.000.000 valid 120 hari kalender',
        expiryDate: '2026-07-10',
        uploadedAt: '2026-03-06'
      },
      {
        id: 'TND-07-DOC-05',
        name: 'Perjanjian Konsorsium / KSO Terbuka Beserta Pembagian Porsi Pekerjaan',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Finalisasi akta notaris KSO antara Lead Member (60%) dan Technical Partner (40%)',
        expiryDate: null,
        uploadedAt: null
      }
    ]
  }
];

// Now replace initialTenders in the file
const startMarker = 'export const initialTenders = [';
const endMarker = 'export const initialTenderVaultDocs = [';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const replacement = `export const initialTenders = ${JSON.stringify(newTenders, null, 2)};\n\n`;
const newContent = content.slice(0, startIndex) + replacement + content.slice(endIndex);

fs.writeFileSync(seedFilePath, newContent, 'utf8');
console.log('Successfully enriched initialTenders in seedData.js!');
