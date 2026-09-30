import fs from 'fs';

const seedFilePath = '/Users/mac/Documents/antigravity/web-legal/src/data/seedData.js';
let content = fs.readFileSync(seedFilePath, 'utf8');

const masterDataCode = `
export const initialMasterDocTypes = [
  { id: 'MDT-01', code: 'LEGAL', name: 'Legal Administrasi', icon: 'Scale', color: '#4338CA', bgColor: '#EEF2FF', isMandatory: true, description: 'Akta pendirian, NIB OSS-RBA, SK Kemenkumham, NPWP, dan KBLI utama perseroan.', active: true },
  { id: 'MDT-02', code: 'TEKNIS', name: 'Kualifikasi Teknis', icon: 'Wrench', color: '#0369A1', bgColor: '#E0F2FE', isMandatory: true, description: 'SBU LPJK, SKK Konstruksi, CSMS Migas, SILO Alat Berat, dan JORC/KCMI.', active: true },
  { id: 'MDT-03', code: 'FINANSIAL', name: 'Finansial & Keuangan', icon: 'DollarSign', color: '#15803D', bgColor: '#DCFCE7', isMandatory: true, description: 'Laporan Audit KAP, SPT Tahunan, Bid Bond, dan Referensi Fasilitas Bank.', active: true },
  { id: 'MDT-04', code: 'KEPATUHAN', name: 'Kepatuhan & Integritas', icon: 'ShieldCheck', color: '#92400E', bgColor: '#FEF3C7', isMandatory: true, description: 'Pakta Integritas LKPP, Non-Blacklist INAPROC, Komitmen DMO 25%, dan TKDN.', active: true },
  { id: 'MDT-05', code: 'K3L', name: 'Lingkungan Hidup & K3', icon: 'Leaf', color: '#047857', bgColor: '#ECFDF5', isMandatory: false, description: 'Amdal, RKL-RPL, UKL-UPL, SMK3 PP 50/2012, ISO 14001, dan ISO 45001.', active: true },
  { id: 'MDT-06', code: 'KONTRAK', name: 'Dokumen Kontrak & SPPBJ', icon: 'FileSignature', color: '#6D28D9', bgColor: '#F5F3FF', isMandatory: false, description: 'SPPBJ Pokja, Surat Penunjukan, Kontrak Induk Perjanjian, dan Addendum.', active: true }
];

export const initialMasterSectors = [
  {
    id: 'SEC-01',
    code: 'KONSTRUKSI',
    name: 'Konstruksi & Infrastruktur',
    icon: '🏗️',
    badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]',
    regulatoryBasis: 'UU No. 2/2017 & Perpres 16/2018 jo 12/2021',
    defaultContractType: 'Engineering Procurement Construction (EPC)',
    hasBelow80Alert: true,
    workflowTemplate: 'SPSE_KONSTRUKSI_8',
    description: 'Pekerjaan sipil jalan, jembatan, gedung, dan terowongan dengan evaluasi EKH (<80% HPS) dan retensi masa pemeliharaan FHO.'
  },
  {
    id: 'SEC-02',
    code: 'PERTAMBANGAN',
    name: 'Pertambangan & Mineral',
    icon: '⛏️',
    badgeClass: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    regulatoryBasis: 'UU No. 3/2020 Minerba & Kepmen ESDM HBA/HPM',
    defaultContractType: 'Coal / Mineral Supply Agreement',
    hasBelow80Alert: false,
    workflowTemplate: 'MINERBA_TAMBANG_8',
    description: 'Pasokan komoditas batubara/mineral, sewa alat berat, dan studi cadangan JORC dengan formula indeks harga HBA.'
  },
  {
    id: 'SEC-03',
    code: 'MIGAS',
    name: 'Minyak & Gas Bumi',
    icon: '🛢️',
    badgeClass: 'bg-[#FDF2F8] text-[#9D174D] border border-[#FCE7F3]',
    regulatoryBasis: 'PTK-007 SKK Migas Revisi 05 & Permen ESDM 15/2013',
    defaultContractType: 'EPCIC Midstream / JOA Contract',
    hasBelow80Alert: false,
    workflowTemplate: 'PTK007_MIGAS_9',
    description: 'Pengadaan hulu & midstream migas wajib verifikasi SPDA CIVD, akreditasi keselamatan CSMS High Risk, dan evaluasi harga HEA berbasis preferensi TKDN.'
  },
  {
    id: 'SEC-04',
    code: 'ENERGI',
    name: 'Energi & Ketenagalistrikan',
    icon: '⚡',
    badgeClass: 'bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]',
    regulatoryBasis: 'Perdir PLN 0022.P/DIR/2020 & Perpres 112/2022',
    defaultContractType: 'Power Purchase Agreement (PPA)',
    hasBelow80Alert: false,
    workflowTemplate: 'PLN_ENERGI_8',
    description: 'Pembangkit listrik EBT (PLTS/PLTA), transmisi SUTT, dan gardu induk dengan studi interkoneksi grid dan sertifikasi SLO ESDM.'
  },
  {
    id: 'SEC-05',
    code: 'UMUM',
    name: 'Pengadaan Barang & Jasa Umum',
    icon: '📦',
    badgeClass: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
    regulatoryBasis: 'Perpres No. 16/2018 (Pengadaan Barang & Jasa Non-Konstruksi)',
    defaultContractType: 'Surat Perintah Kerja (SPK) / Kontrak Jual Beli',
    hasBelow80Alert: false,
    workflowTemplate: 'UMUM_SEDERHANA_5',
    description: 'Pengadaan barang, logistik operasional, IT, dan konsultansi korporasi umum dengan alur yang ringkas dan cepat.'
  }
];

export const initialMasterTenderStages = {
  KONSTRUKSI: [
    { key: 'PERSIAPAN_PENGADAAN', name: '1. Persiapan KAK & HPS', shortName: '1. KAK & HPS', description: 'Penyusunan KAK/spesifikasi teknis, DED, penetapan HPS, dan rancangan kontrak standar PUPR.' },
    { key: 'PENGUMUMAN_PENDAFTARAN', name: '2. Pengumuman & Pendaftaran SPSE', shortName: '2. Pengumuman', description: 'Pokja mengumumkan tender di SPSE, penyedia mengunduh Dokumen Pemilihan.' },
    { key: 'AANWIJZING', name: '3. Aanwijzing & Site Visit Lapangan', shortName: '3. Aanwijzing & Lapangan', description: 'Pemberian penjelasan teknis dan peninjauan fisik lapangan lokasi konstruksi.' },
    { key: 'PENYAMPAIAN_PENAWARAN', name: '4. Penyampaian Penawaran (3 Sampul)', shortName: '4. Upload Penawaran', description: 'Unggah dokumen administrasi, teknis, kualifikasi, dan harga penawaran.' },
    { key: 'EVALUASI_PEMBUKTIAN', name: '5. Evaluasi Teknis & EKH (<80% HPS)', shortName: '5. Evaluasi & EKH', description: 'Evaluasi teknis metode kerja, personel SKK, dan evaluasi kewajaran harga bila penawaran <80% HPS.' },
    { key: 'PENGUMUMAN_PEMENANG', name: '6. Penetapan & Pengumuman Pemenang', shortName: '6. Penetapan Pemenang', description: 'Penetapan urutan pemenang 1, 2, 3 oleh Pokja Pemilihan.' },
    { key: 'MASA_SANGGAH', name: '7. Masa Sanggah (5 Hari Kerja)', shortName: '7. Masa Sanggah', description: 'Masa pengajuan sanggahan bagi peserta lelang yang tidak puas terhadap evaluasi.' },
    { key: 'SPPBJ_KONTRAK', name: '8. SPPBJ, Jaminan 5% & Kontrak', shortName: '8. SPPBJ & Kontrak', description: 'Penerbitan SPPBJ, penyerahan Jaminan Pelaksanaan (5% Kontrak atau 5% HPS bila <80%), dan tanda tangan kontrak.' }
  ],
  PERTAMBANGAN: [
    { key: 'PERSIAPAN_PENGADAAN', name: '1. Verifikasi MODI & Persetujuan RKAB', shortName: '1. MODI & RKAB', description: 'Verifikasi legalitas IUP/IUPK aktif pada database MODI/MOMIv ESDM dan persetujuan kuota RKAB tahun berjalan.' },
    { key: 'PENGUMUMAN_PENDAFTARAN', name: '2. Registrasi Vendor & Validasi Cadangan JORC', shortName: '2. Registrasi & JORC', description: 'Pendaftaran rekanan dan penyerahan laporan estimasi cadangan Competent Person (KCMI/JORC Code).' },
    { key: 'AANWIJZING', name: '3. Aanwijzing Kualitas Spesifikasi & Tersus', shortName: '3. Aanwijzing Mutu', description: 'Penjelasan spesifikasi CV, moisture, ash, sulfur, dan izin operasional pelabuhan Jetty/Tersus.' },
    { key: 'PENYAMPAIAN_PENAWARAN', name: '4. Pengujian Sampling Independen (Sucofindo)', shortName: '4. Uji Mutu COA', description: 'Penyerahan Certificate of Sampling & Analysis (COA) dari surveyor independen terakreditasi.' },
    { key: 'EVALUASI_PEMBUKTIAN', name: '5. Bidding Penawaran Harga Indeks HBA/HPM', shortName: '5. Bidding Indeks HBA', description: 'Penawaran harga mengacu formula penyesuaian indeks HBA/HPM ESDM pada tanggal Bill of Lading (B/L).' },
    { key: 'PENGUMUMAN_PEMENANG', name: '6. Verifikasi Kuota DMO 25% & e-PNBP', shortName: '6. Verifikasi DMO', description: 'Klarifikasi komitmen pemenuhan DMO 25% dan bukti pelunasan royalti batubara pada SIMPONI e-PNBP.' },
    { key: 'MASA_SANGGAH', name: '7. Penetapan Alokasi Kuota Pasokan', shortName: '7. Alokasi Kuota', description: 'Penetapan volume pasokan tonase dan jadwal pengapalan (vessel/barge schedule).' },
    { key: 'SPPBJ_KONTRAK', name: '8. Coal Supply Agreement & Jaminan Reklamasi', shortName: '8. Kontrak Pasokan Tambang', description: 'Penandatanganan Perjanjian Jual Beli Batubara/Mineral dan penyerahan Jaminan Pelaksanaan Tambang.' }
  ],
  MIGAS: [
    { key: 'PERSIAPAN_PENGADAAN', name: '1. Verifikasi CIVD & SPDA SKK Migas', shortName: '1. CIVD & SPDA', description: 'Pengecekan keabsahan Surat Pengganti Dokumen Administrasi (SPDA) pada portal sentral CIVD SKK Migas.' },
    { key: 'PENGUMUMAN_PENDAFTARAN', name: '2. Prakualifikasi Keselamatan CSMS (High Risk)', shortName: '2. CSMS Migas', description: 'Evaluasi sertifikasi Contractor Safety Management System (CSMS) dengan skor kelayakan minimum >= 70-80.' },
    { key: 'AANWIJZING', name: '3. Pre-Bid Meeting & Penjelasan Komitmen TKDN', shortName: '3. Pre-Bid & TKDN', description: 'Penjelasan ruang lingkup migas, standar API/ASME, dan komitmen batasan minimum TKDN APDN Kemenperin.' },
    { key: 'PENYAMPAIAN_PENAWARAN', name: '4. Pembukaan Sampul I (Teknis & Kualifikasi)', shortName: '4. Sampul I (Teknis)', description: 'Pemeriksaan kepatuhan teknis tanpa membuka harga. Peserta wajib mencapai Passing Grade teknis >= 80.' },
    { key: 'EVALUASI_PEMBUKTIAN', name: '5. Verifikasi Komitmen TKDN Surveyor Kemenperin', shortName: '5. Verifikasi TKDN', description: 'Penilaian formulir capaian TKDN oleh verifikator independen resmi (PT Sucofindo / PT Surveyor Indonesia).' },
    { key: 'PENGUMUMAN_PEMENANG', name: '6. Pembukaan Sampul II (Komersial) & HEA', shortName: '6. Sampul II & HEA', description: 'Pembukaan harga komersial dan perhitungan Harga Evaluasi Akhir (HEA) dengan preferensi TKDN.' },
    { key: 'MASA_SANGGAH', name: '7. Klarifikasi Owner Estimate (OE) Tertutup', shortName: '7. Klarifikasi OE', description: 'Klarifikasi dan negosiasi harga penawaran terhadap batas Owner Estimate (OE) rahasia SKK Migas.' },
    { key: 'SPPBJ_KONTRAK', name: '8. Letter of Intent (LOI) & Kontrak Hulu Migas', shortName: '8. LOI & Kontrak Migas', description: 'Penerbitan LOI/LOA, penyerahan Jaminan Pelaksanaan Migas, dan penandatanganan Kontrak EPCIC / JOA.' }
  ],
  ENERGI: [
    { key: 'PERSIAPAN_PENGADAAN', name: '1. Kualifikasi DPT PLN & Penelaahan RUPTL', shortName: '1. DPT & RUPTL', description: 'Pemeriksaan status rekanan Daftar Penyedia Terseleksi (DPT) PLN dan kesesuaian kuota kapasitas RUPTL.' },
    { key: 'PENGUMUMAN_PENDAFTARAN', name: '2. Request for Proposal (RFP) EPC / PPA', shortName: '2. RFP PPA/EPC', description: 'Penerbitan dokumen pemilihan lelang EPC transmisi atau pengembang independen pembangkit (IPP).' },
    { key: 'AANWIJZING', name: '3. Studi Interkoneksi Grid & Uji Lingkungan', shortName: '3. Grid Study', description: 'Klarifikasi titik sambung evakuasi daya sistem transmisi dan studi analisis mengenai dampak lingkungan.' },
    { key: 'PENYAMPAIAN_PENAWARAN', name: '4. Penyampaian Penawaran Tarif (c/kWh) & EPC', shortName: '4. Penawaran Tarif', description: 'Penyerahan penawaran tarif listrik, struktur pendanaan ekuitas, dan spesifikasi turbin/solar inverter.' },
    { key: 'EVALUASI_PEMBUKTIAN', name: '5. Evaluasi Bankability & Letter of Support Lender', shortName: '5. Bankability', description: 'Verifikasi surat dukungan sindikasi bank (Mandiri, BRI, ADB, IFC) dan analisis cash flow proyek.' },
    { key: 'PENGUMUMAN_PEMENANG', name: '6. Verifikasi TKDN Pembangkit & SLO DJK', shortName: '6. TKDN & SLO', description: 'Verifikasi ketaatan Permenperin 54/2012 dan rencana pengujian Sertifikat Laik Operasi (SLO).' },
    { key: 'MASA_SANGGAH', name: '7. Selected Bidder & Letter of Award', shortName: '7. Selected Bidder', description: 'Penetapan pengembang/kontraktor terpilih oleh Direksi PLN.' },
    { key: 'SPPBJ_KONTRAK', name: '8. PPA / Kontrak EPC & Financial Close', shortName: '8. PPA & Financial Close', description: 'Penandatanganan Power Purchase Agreement 25-30 tahun atau kontrak EPC transmisi dan pemenuhan pembiayaan.' }
  ],
  UMUM: [
    { key: 'PERSIAPAN_PENGADAAN', name: '1. Persiapan Spesifikasi & HPS', shortName: '1. HPS & Syarat', description: 'Penyusunan spesifikasi teknis barang/jasa dan penetapan HPS pasar.' },
    { key: 'PENGUMUMAN_PENDAFTARAN', name: '2. Pengumuman & Unduh Dokumen', shortName: '2. Pengumuman', description: 'Pengumuman paket lelang pengadaan barang dan pendaftaran rekanan.' },
    { key: 'PENYAMPAIAN_PENAWARAN', name: '3. Pemasukan Penawaran Harga', shortName: '3. Penawaran', description: 'Penyampaian dokumen administrasi, teknis, dan penawaran harga.' },
    { key: 'EVALUASI_PEMBUKTIAN', name: '4. Evaluasi & E-Reverse Auction', shortName: '4. Evaluasi & Bidding', description: 'Evaluasi kualifikasi dan penawaran harga berulang (reverse auction).' },
    { key: 'SPPBJ_KONTRAK', name: '5. Penerbitan SPK / Kontrak Pembelian', shortName: '5. SPK & Kontrak', description: 'Penetapan pemenang dan penandatanganan Surat Perintah Kerja (SPK).' }
  ]
};

export const initialMasterContractTypes = [
  { id: 'CT-01', code: 'EPC', name: 'Engineering Procurement Construction (EPC)', sector: 'KONSTRUKSI', standardFormat: 'FIDIC Silver Book / Standar PUPR', active: true },
  { id: 'CT-02', code: 'CSA', name: 'Coal / Mineral Supply Agreement (FOB/CIF)', sector: 'PERTAMBANGAN', standardFormat: 'Perjanjian Pasokan Energi Primer PLN', active: true },
  { id: 'CT-03', code: 'PPA', name: 'Power Purchase Agreement (PPA 25-30 Tahun)', sector: 'ENERGI', standardFormat: 'Standard PLN PPA BOOT / BOO', active: true },
  { id: 'CT-04', code: 'PSC_JOA', name: 'Joint Operation Agreement / PSC Hulu Migas', sector: 'MIGAS', standardFormat: 'Standar PTK-007 SKK Migas', active: true },
  { id: 'CT-05', code: 'SPK', name: 'Surat Perintah Kerja (SPK) / Kontrak Jasa Umum', sector: 'UMUM', standardFormat: 'Standar Korporasi Internal', active: true }
];
`;

// Append to seedData.js right before export const defaultSeedData
const marker = 'export const defaultSeedData = {';
const idx = content.indexOf(marker);

if (idx === -1) {
  console.error('Marker not found!');
  process.exit(1);
}

const updatedContent = content.slice(0, idx) + masterDataCode + '\n' + content.slice(idx);

// Also add master data fields into defaultSeedData
const replacedSeed = updatedContent.replace(
  '  tenderBonds: initialTenderBonds,',
  `  tenderBonds: initialTenderBonds,
  masterDocTypes: initialMasterDocTypes,
  masterSectors: initialMasterSectors,
  masterStages: initialMasterTenderStages,
  masterContractTypes: initialMasterContractTypes,`
);

fs.writeFileSync(seedFilePath, replacedSeed, 'utf8');
console.log('Successfully added Master Data to seedData.js!');
