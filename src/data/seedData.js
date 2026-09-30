import rawData from './originalData.json' with { type: 'json' };

export const initialUsers = rawData.users;
export const initialRequests = rawData.requests;
export const initialContracts = rawData.contracts;
export const initialCorporate = rawData.corporate;
export const initialLicenses = rawData.licenses;
export const initialCompliance = rawData.compliance;
export const initialDisputes = rawData.disputes;
export const initialLDD = rawData.ldd;
export const initialLegalOpinions = rawData.opinions;
export const initialDocuments = rawData.documents;
export const initialCorrespondence = rawData.correspondence;
export const initialKnowledge = rawData.knowledge;
export const initialTemplates = rawData.templates;
export const initialClauses = rawData.clauses;
export const initialActivityLogs = rawData.activityLogs;

export const initialTenders = [
  {
    "id": "TND-2026-001",
    "tenderNumber": "PLN-EPROC-2026-0418",
    "title": "Pengadaan EPC Pembangkit Listrik Tenaga Surya (PLTS) Terapung 50 MW",
    "organizer": "PT PLN (Persero) Kantor Pusat",
    "company": "PT Nusantara Energi",
    "category": "Energi & Ketenagalistrikan",
    "sector": "ENERGI",
    "sectorLabel": "Energi & Ketenagalistrikan",
    "hpsValue": 145000000000,
    "bidValue": 138750000000,
    "announcementDate": "2026-02-10",
    "deadlineDate": "2026-04-15",
    "stage": "EVALUASI_PEMBUKTIAN",
    "status": "ACTIVE",
    "pic": "Budi Santoso, S.H., LL.M.",
    "location": "Waduk Cirata, Jawa Barat",
    "notes": "Klarifikasi teknis (Aanwijzing) selesai. Sedang tahap evaluasi sampul II (penawaran harga dan jaminan penawaran).",
    "locked": true,
    "hash": "SHA256:7f8b9a1c4d2e5f30e6a12b89c7d41f0a2e5d9c8b7a6f5e4d3c2b1a0f9e8d7c6b",
    "submittedAt": "2026-02-26 14:30",
    "gng": {
      "scores": {
        "fit": 5,
        "cap": 4,
        "com": 4,
        "risk": 4,
        "cash": 4,
        "tech": 5
      },
      "totalScore": 86,
      "decision": "GO",
      "note": "Kesesuaian strategis portofolio EBT konsisten dengan target dekarbonisasi korporasi. Margin proyek sehat 12.8%.",
      "by": "Direktur Utama",
      "date": "2026-02-11"
    },
    "pricing": {
      "directCost": 104500000000,
      "indirectCost": 9500000000,
      "riskContingency": 4200000000,
      "marginPercent": 12.8,
      "hpsRatio": 0.9569,
      "isBelow80HPS": false,
      "requiredPerformanceBond": 6937500000
    },
    "gates": [
      {
        "id": "gate-1",
        "name": "Gate 1: Teknis & Kualifikasi",
        "reviewer": "Technical Team Lead",
        "status": "SELESAI",
        "date": "2026-02-14",
        "note": "SBU Konstruksi & sertifikasi EBT terverifikasi lengkap"
      },
      {
        "id": "gate-2",
        "name": "Gate 2: Finansial & HPS",
        "reviewer": "CFO / Finance Head",
        "status": "SELESAI",
        "date": "2026-02-18",
        "note": "Analisis cash flow positif, modal kerja mencukupi"
      },
      {
        "id": "gate-3",
        "name": "Gate 3: Legal & Risiko",
        "reviewer": "Legal Counsel Lead",
        "status": "SELESAI",
        "date": "2026-02-22",
        "note": "Draft kontrak EPC memenuhi syarat standar FIDIC Silver Book"
      },
      {
        "id": "gate-4",
        "name": "Gate 4: Otorisasi Direksi / Final",
        "reviewer": "Direktur Utama",
        "status": "SELESAI",
        "date": "2026-02-25",
        "note": "Disetujui untuk final submission penawaran harga"
      }
    ],
    "clarifications": [
      {
        "id": "CLR-01",
        "query": "Apakah masa jaminan pemeliharaan (warranty period) solar inverter dapat dijamin oleh garansi prinsipal pabrikan 10 tahun?",
        "askedBy": "Tim Engineering",
        "date": "2026-02-16",
        "category": "Teknis & Spesifikasi",
        "impact": "Biaya Pemeliharaan",
        "answer": "Dapat diterima sepanjang menyertakan Surat Dukungan Asli Pabrikan bergaransi minimal 10 tahun.",
        "answeredAt": "2026-02-18",
        "status": "DIJAWAB",
        "effect": "Mengurangi risiko cadangan garansi internal"
      },
      {
        "id": "CLR-02",
        "query": "Mohon klarifikasi apakah titik interkoneksi gardu hubung 150 kV disediakan oleh PLN atau kontraktor EPC?",
        "askedBy": "Tim Teknis",
        "date": "2026-02-17",
        "category": "Ruang Lingkup (Scope)",
        "impact": "Biaya Konstruksi",
        "answer": "Titik interkoneksi disediakan PLN, kontraktor hanya menarik kabel sampai kubikel incoming.",
        "answeredAt": "2026-02-19",
        "status": "DIJAWAB",
        "effect": "Menghemat estimasi biaya kabel bawah air Rp 2.5 Miliar"
      }
    ],
    "result": null,
    "documents": [
      {
        "id": "TND-01-DOC-01",
        "name": "Akta Pendirian & Perubahan Terakhir (SK Kemenkumham)",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "AKTA-AHU-2025-0918.pdf",
        "notes": "SK Menkumham No. AHU-001928.AH.01.02.TH.2025 Valid",
        "expiryDate": null,
        "uploadedAt": "2026-02-12"
      },
      {
        "id": "TND-01-DOC-02",
        "name": "NIB Berbasis Risiko OSS RBA & Lampiran KBLI 42201",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "NIB-OSS-91200034182.pdf",
        "notes": "Sektor Ketenagalistrikan & Konstruksi Aktif",
        "expiryDate": null,
        "uploadedAt": "2026-02-12"
      },
      {
        "id": "TND-01-DOC-03",
        "name": "Sertifikat Badan Usaha (SBU) Jasa Pelaksana Konstruksi Ketenagalistrikan",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SBU-LPJK-EL001-2024.pdf",
        "notes": "Klasifikasi EL001 Kualifikasi Besar (B) Valid s/d 2027",
        "expiryDate": "2027-08-30",
        "uploadedAt": "2026-02-13"
      },
      {
        "id": "TND-01-DOC-04",
        "name": "Sertifikat Standar & Kelaikan Operasi Pembangkit EBT (SLO)",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SLO-DJKE-ESDM-2025.pdf",
        "notes": "Diterbitkan Dirjen Ketenagalistrikan ESDM",
        "expiryDate": "2029-01-15",
        "uploadedAt": "2026-02-13"
      },
      {
        "id": "TND-01-DOC-05",
        "name": "Sertifikat Tingkat Komponen Dalam Negeri (TKDN) Minimal 40%",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "TKDN-SOLAR-CELL-43PCT.pdf",
        "notes": "Verifikasi Kemenperin No. 1290/SJ-IND.8/TKDN/2025 (43.2%)",
        "expiryDate": "2028-11-10",
        "uploadedAt": "2026-02-14"
      },
      {
        "id": "TND-01-DOC-06",
        "name": "Sertifikat SMK3 PP 50/2012 & ISO 45001:2018 Lingkup EPC",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SMK3-EMAS-KEMNAKER-2025.pdf",
        "notes": "Tingkat Pencapaian 92% (Bendera Emas)",
        "expiryDate": "2028-05-20",
        "uploadedAt": "2026-02-14"
      },
      {
        "id": "TND-01-DOC-07",
        "name": "Surat Keterangan Pengalaman Kerja Sejenis (BAST & Kontrak Terakhir)",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "REF-KONTRAK-PLTS-SUMBA.pdf",
        "notes": "Nilai proyek Rp98 Miliar selesai 100% tanpa denda",
        "expiryDate": null,
        "uploadedAt": "2026-02-17"
      },
      {
        "id": "TND-01-DOC-08",
        "name": "Laporan Keuangan Audit Akuntan Publik 3 Tahun Terakhir (KAP)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "AUDIT-REPORT-KAP-2023-2025.pdf",
        "notes": "Opini Wajar Tanpa Pengecualian (WTP)",
        "expiryDate": null,
        "uploadedAt": "2026-02-18"
      },
      {
        "id": "TND-01-DOC-09",
        "name": "Jaminan Penawaran (Bid Bond / Bank Garansi) 2.5% Nilai HPS",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "BG-BID-BOND-MANDIRI-PLTS.pdf",
        "notes": "Bank Garansi Bank Mandiri Rp2.775.000.000 valid 90 hari",
        "expiryDate": "2026-05-15",
        "uploadedAt": "2026-02-18"
      },
      {
        "id": "TND-01-DOC-10",
        "name": "Surat Pernyataan Tidak Masuk Daftar Hitam (Blacklist LKPP/Kemenkeu)",
        "category": "Kepatuhan & Integritas",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "PERNYATAAN-NON-BLACKLIST.pdf",
        "notes": "Bermaterai cukup dan tercatat pada portal INAPROC",
        "expiryDate": null,
        "uploadedAt": "2026-02-12"
      }
    ]
  },
  {
    "id": "TND-2026-002",
    "tenderNumber": "IP-PENGADAAN-2026-089",
    "title": "Pengadaan Pasokan Batubara Medium-High CV 5.200 kkal Periode 2026",
    "organizer": "PT PLN Indonesia Power",
    "company": "PT Nusantara Energi",
    "category": "Pertambangan & Mineral",
    "sector": "PERTAMBANGAN",
    "sectorLabel": "Pertambangan & Mineral",
    "hpsValue": 320000000000,
    "bidValue": 308500000000,
    "announcementDate": "2026-02-15",
    "deadlineDate": "2026-03-25",
    "stage": "PENYAMPAIAN_PENAWARAN",
    "status": "ACTIVE",
    "pic": "Dimas Prasetyo, S.H.",
    "location": "PLTU Suralaya Unit 5-7, Cilegon",
    "notes": "Batas akhir unggah dokumen tinggal 10 hari kerja. Perlu percepatan 2 dokumen yang masih kurang.",
    "locked": false,
    "hash": null,
    "gng": {
      "scores": {
        "fit": 5,
        "cap": 5,
        "com": 4,
        "risk": 3,
        "cash": 4,
        "tech": 4
      },
      "totalScore": 83,
      "decision": "GO",
      "note": "Cadangan tambang mencukupi spesifikasi CV 5200 kkal, margin 11.2%.",
      "by": "Bid Committee",
      "date": "2026-02-16"
    },
    "pricing": {
      "directCost": 242000000000,
      "indirectCost": 21500000000,
      "riskContingency": 8500000000,
      "marginPercent": 11.2,
      "hpsRatio": 0.964,
      "isBelow80HPS": false,
      "requiredPerformanceBond": 15425000000
    },
    "gates": [
      {
        "id": "gate-1",
        "name": "Gate 1: Teknis & Kualifikasi",
        "reviewer": "Technical Team Lead",
        "status": "SELESAI",
        "date": "2026-02-20",
        "note": "Kesesuaian kalori & sertifikat surveyor terverifikasi"
      },
      {
        "id": "gate-2",
        "name": "Gate 2: Finansial & HPS",
        "reviewer": "CFO / Finance Head",
        "status": "SELESAI",
        "date": "2026-02-24",
        "note": "Skema termin bulanan disetujui"
      },
      {
        "id": "gate-3",
        "name": "Gate 3: Legal & Risiko",
        "reviewer": "Legal Counsel Lead",
        "status": "MENUNGGU",
        "date": null,
        "note": "Menunggu kelengkapan dokumen COA laboratorium Sucofindo dan DMO"
      },
      {
        "id": "gate-4",
        "name": "Gate 4: Otorisasi Direksi / Final",
        "reviewer": "Direktur Operasional",
        "status": "BERIKUTNYA",
        "date": null,
        "note": "Persetujuan akhir sebelum submission"
      }
    ],
    "clarifications": [
      {
        "id": "CLR-01",
        "query": "Apakah penyesuaian harga (Price Adjustment) mengikuti formula HBA (Harga Batubara Acuan) bulanan?",
        "askedBy": "Tim Niaga",
        "date": "2026-02-22",
        "category": "Komersial & Harga",
        "impact": "Formula Penagihan",
        "answer": "Ya, harga invoice disesuaikan formula HBA ESDM pada bulan pengapalan (B/L date).",
        "answeredAt": "2026-02-24",
        "status": "DIJAWAB",
        "effect": "Mitigasi volatilitas harga pasar"
      }
    ],
    "result": null,
    "documents": [
      {
        "id": "TND-02-DOC-01",
        "name": "IUP Operasi Produksi Batubara / IUPK Terdaftar MODI ESDM",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "IUP-OP-ESDM-MODI.pdf",
        "notes": "Nomor Register MODI: 541.15/ESDM-OP/2024",
        "expiryDate": "2034-08-11",
        "uploadedAt": "2026-02-18"
      },
      {
        "id": "TND-02-DOC-02",
        "name": "Persetujuan RKAB (Rencana Kerja dan Anggaran Biaya) 2026",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SK-RKAB-2026-ESDM.pdf",
        "notes": "Kuota produksi disetujui 2.500.000 Metrik Ton",
        "expiryDate": "2026-12-31",
        "uploadedAt": "2026-02-19"
      },
      {
        "id": "TND-02-DOC-03",
        "name": "Laporan Eksplorasi & Estimasi Cadangan (KCMI / JORC Code)",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "JORC-REPORT-CALIFORNIA-2025.pdf",
        "notes": "Disusun oleh Competent Person Indonesia (CPI)",
        "expiryDate": null,
        "uploadedAt": "2026-02-20"
      },
      {
        "id": "TND-02-DOC-04",
        "name": "Sertifikat Analisis Batubara (Certificate of Sampling & Analysis - COA)",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "KURANG",
        "fileRef": null,
        "notes": "Hasil pengujian laboratorium independen (Sucofindo / Carsurin) belum terbit",
        "expiryDate": null,
        "uploadedAt": null
      },
      {
        "id": "TND-02-DOC-05",
        "name": "Surat Izin Penggunaan Pelabuhan Jetty / Terminal Khusus Tersus",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "IZIN-TERSUS-HUBDAT-2024.pdf",
        "notes": "Izin Operasional Tersus dari Dirjen Hubla",
        "expiryDate": "2027-11-04",
        "uploadedAt": "2026-02-22"
      },
      {
        "id": "TND-02-DOC-06",
        "name": "Surat Pernyataan Kesanggupan DMO (Domestic Market Obligation) 25%",
        "category": "Kepatuhan & Integritas",
        "isMandatory": true,
        "status": "KURANG",
        "fileRef": null,
        "notes": "Menunggu tanda tangan basah & materai elektronik Direktur Operasional",
        "expiryDate": null,
        "uploadedAt": null
      },
      {
        "id": "TND-02-DOC-07",
        "name": "Bukti Pemenuhan Kewajiban Royalti / PNBP Batubara e-PNBP",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "NTPN-ROYALTI-SIMPONI-2025.pdf",
        "notes": "Lunas Triwulan IV 2025 dengan bukti NTPN",
        "expiryDate": null,
        "uploadedAt": "2026-02-23"
      },
      {
        "id": "TND-02-DOC-08",
        "name": "Jaminan Penawaran Bank Garansi Asli (Bid Bond)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "BIDBOND-BNI-PLTU-2026.pdf",
        "notes": "Terbit BNI Jakarta Pusat senilai Rp8.000.000.000 valid 90 hari kalender",
        "expiryDate": "2026-05-30",
        "uploadedAt": "2026-02-25"
      }
    ]
  },
  {
    "id": "TND-2026-003",
    "tenderNumber": "ESDM-DITJEN-2026-012",
    "title": "Jasa Konsultansi Amdal & Persetujuan Lingkungan Wilayah Usaha Pertambangan",
    "organizer": "Kementerian ESDM & Ditjen Minerba",
    "company": "PT Borneo Mineral Resources",
    "category": "Pertambangan & Mineral",
    "sector": "PERTAMBANGAN",
    "sectorLabel": "Pertambangan & Mineral",
    "hpsValue": 14200000000,
    "bidValue": 13650000000,
    "announcementDate": "2026-01-15",
    "deadlineDate": "2026-03-30",
    "stage": "EVALUASI_PEMBUKTIAN",
    "status": "ACTIVE",
    "pic": "Siti Rahmawati, S.H., M.H.",
    "location": "Kutai Kartanegara, Kalimantan Timur",
    "notes": "Kualifikasi lolos dengan nilai teknis 94.2. Sedang dijadwalkan wawancara pembuktian kualifikasi langsung di Ditjen Minerba.",
    "locked": true,
    "hash": "SHA256:3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef012",
    "submittedAt": "2026-01-29 11:00",
    "gng": {
      "scores": {
        "fit": 4,
        "cap": 5,
        "com": 4,
        "risk": 2,
        "cash": 4,
        "tech": 5
      },
      "totalScore": 80,
      "decision": "GO",
      "note": "Tim ahli KTPA/ATPA lengkap, risiko hukum minimal.",
      "by": "Direktur Konsultansi",
      "date": "2026-01-18"
    },
    "pricing": {
      "directCost": 9800000000,
      "indirectCost": 950000000,
      "riskContingency": 400000000,
      "marginPercent": 14.2,
      "hpsRatio": 0.961,
      "isBelow80HPS": false,
      "requiredPerformanceBond": 682500000
    },
    "gates": [
      {
        "id": "gate-1",
        "name": "Gate 1: Teknis & Kualifikasi",
        "reviewer": "Technical Team Lead",
        "status": "SELESAI",
        "date": "2026-01-22",
        "note": "Portofolio studi Amdal dan akreditasi LPJP terpenuhi"
      },
      {
        "id": "gate-2",
        "name": "Gate 2: Finansial & HPS",
        "reviewer": "CFO / Finance Head",
        "status": "SELESAI",
        "date": "2026-01-25",
        "note": "Remunerasi tenaga ahli sesuai billing rate INKINDO"
      },
      {
        "id": "gate-3",
        "name": "Gate 3: Legal & Risiko",
        "reviewer": "Legal Counsel Lead",
        "status": "SELESAI",
        "date": "2026-01-27",
        "note": "Perjanjian kerahasiaan data geologis disetujui"
      },
      {
        "id": "gate-4",
        "name": "Gate 4: Otorisasi Direksi / Final",
        "reviewer": "Direktur Utama",
        "status": "SELESAI",
        "date": "2026-01-28",
        "note": "Final submission disetujui"
      }
    ],
    "clarifications": [],
    "result": null,
    "documents": [
      {
        "id": "TND-03-DOC-01",
        "name": "Sertifikat Registrasi Lembaga Penyedia Jasa Penyusun (LPJP) Amdal KLHK",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "LPJP-KLHK-NO-0021-2024.pdf",
        "notes": "Terakreditasi A oleh KLHK Republik Indonesia",
        "expiryDate": "2027-04-10",
        "uploadedAt": "2026-01-20"
      },
      {
        "id": "TND-03-DOC-02",
        "name": "Sertifikasi Kompetensi Penyusun Amdal (KTPA / ATPA) Tim Ahli",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "KTPA-ATPA-TIM-AHLI-5-ORG.pdf",
        "notes": "5 Personil Ketua & Anggota Tim bersertifikat BNSP aktif",
        "expiryDate": "2027-09-15",
        "uploadedAt": "2026-01-20"
      },
      {
        "id": "TND-03-DOC-03",
        "name": "Akta Pendirian & Pengesahan Kemenkumham Perseroan",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "AKTA-BORNEO-AHU.pdf",
        "notes": "Lengkap beserta Berita Acara RUPS Terakhir",
        "expiryDate": null,
        "uploadedAt": "2026-01-21"
      },
      {
        "id": "TND-03-DOC-04",
        "name": "SPT Tahunan PPh Badan Tahun Pajak Terakhir",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SPT-BADAN-2024-BPE.pdf",
        "notes": "BPE DJP Online No. S-091823/PPB/WPJ.08/2025",
        "expiryDate": null,
        "uploadedAt": "2026-01-21"
      },
      {
        "id": "TND-03-DOC-05",
        "name": "Pakta Integritas Anti-Suap & Anti-Gratifikasi",
        "category": "Kepatuhan & Integritas",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "PAKTA-ESDM-MINERBA-2026.pdf",
        "notes": "Sesuai format baku LKPP & Kementerian ESDM",
        "expiryDate": null,
        "uploadedAt": "2026-01-22"
      },
      {
        "id": "TND-03-DOC-06",
        "name": "Jaminan Penawaran Konsultansi (Surety Bond Asli)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SURETY-BOND-JAMINDO-2026.pdf",
        "notes": "Diterbitkan PT Jamkrindo valid hingga April 2026",
        "expiryDate": "2026-04-30",
        "uploadedAt": "2026-01-22"
      },
      {
        "id": "TND-03-DOC-07",
        "name": "Surat Pernyataan Kesediaan Ditugaskan Seluruh Tenaga Ahli",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "KOMITMEN-AHLI-5-PERSONIL.pdf",
        "notes": "Ditandatangani bermaterai oleh seluruh tim ahli",
        "expiryDate": null,
        "uploadedAt": "2026-01-22"
      }
    ]
  },
  {
    "id": "TND-2026-004",
    "tenderNumber": "PTBA-LOG-2026-055",
    "title": "Sewa Jangka Panjang Alat Berat Excavator 100 Ton & Dump Truck 60 Ton",
    "organizer": "PT Bukit Asam Tbk (Mining Site Tanjung Enim)",
    "company": "PT Sinergi Tambang Gemilang",
    "category": "Pertambangan & Mineral",
    "sector": "PERTAMBANGAN",
    "sectorLabel": "Pertambangan & Mineral",
    "hpsValue": 88500000000,
    "bidValue": 84200000000,
    "announcementDate": "2026-02-28",
    "deadlineDate": "2026-04-20",
    "stage": "PENGUMUMAN_PENDAFTARAN",
    "status": "ACTIVE",
    "pic": "Anisa Maharani, S.H.",
    "location": "Tanjung Enim, Sumatera Selatan",
    "notes": "Tahap awal pendaftaran & unduh dokumen pemilihan. Masih terdapat 4 dokumen krusial yang harus disiapkan oleh vendor dan finance.",
    "locked": false,
    "hash": null,
    "gng": {
      "scores": {
        "fit": 4,
        "cap": 3,
        "com": 4,
        "risk": 3,
        "cash": 3,
        "tech": 4
      },
      "totalScore": 68,
      "decision": "GO_BERSYARAT",
      "note": "Ketergantungan pada surat dukungan ATPM dan jaminan pengiriman unit tepat waktu.",
      "by": "Bid Committee",
      "date": "2026-03-01"
    },
    "pricing": {
      "directCost": 65500000000,
      "indirectCost": 6200000000,
      "riskContingency": 3200000000,
      "marginPercent": 10.5,
      "hpsRatio": 0.951,
      "isBelow80HPS": false,
      "requiredPerformanceBond": 4210000000
    },
    "gates": [
      {
        "id": "gate-1",
        "name": "Gate 1: Teknis & Kualifikasi",
        "reviewer": "Technical Team Lead",
        "status": "REVISI",
        "date": "2026-03-03",
        "note": "Menunggu konfirmasi ATPM untuk 12 unit dump truck"
      },
      {
        "id": "gate-2",
        "name": "Gate 2: Finansial & HPS",
        "reviewer": "CFO / Finance Head",
        "status": "MENUNGGU",
        "date": null,
        "note": "Menunggu finalisasi penawaran sewa"
      },
      {
        "id": "gate-3",
        "name": "Gate 3: Legal & Risiko",
        "reviewer": "Legal Counsel Lead",
        "status": "BERIKUTNYA",
        "date": null,
        "note": "Klausul asuransi HEAR dan tanggung jawab kerusakan alat"
      },
      {
        "id": "gate-4",
        "name": "Gate 4: Otorisasi Direksi / Final",
        "reviewer": "Direktur Operasional",
        "status": "BERIKUTNYA",
        "date": null,
        "note": "Persetujuan akhir"
      }
    ],
    "clarifications": [],
    "result": null,
    "documents": [
      {
        "id": "TND-04-DOC-01",
        "name": "Surat Dukungan Resmi Pabrikan / ATPM (Letter of Support Komatsu/Caterpillar)",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "KURANG",
        "fileRef": null,
        "notes": "Menunggu konfirmasi ketersediaan unit armada baru dari PT United Tractors Tbk",
        "expiryDate": null,
        "uploadedAt": null
      },
      {
        "id": "TND-04-DOC-02",
        "name": "Sertifikat Kelayakan Operasi Alat Berat (SILO) dari Ditjen Minerba",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SILO-MINERBA-ARMADA-BATCH1.pdf",
        "notes": "12 Unit Excavator lolos uji kelayakan operasi",
        "expiryDate": "2027-01-10",
        "uploadedAt": "2026-03-02"
      },
      {
        "id": "TND-04-DOC-03",
        "name": "Laporan Keuangan Audit Terakhir Tahun Buku 2025",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "DALAM_PROSES",
        "fileRef": null,
        "notes": "Sedang proses finalisasi oleh Kantor Akuntan Publik (KAP Tanubrata)",
        "expiryDate": null,
        "uploadedAt": null
      },
      {
        "id": "TND-04-DOC-04",
        "name": "Polis Asuransi Alat Berat Heavy Equipment All Risks (HEAR)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "KURANG",
        "fileRef": null,
        "notes": "Perlu quotation resmi dari Asuransi Jasindo / Tugu Insurance",
        "expiryDate": null,
        "uploadedAt": null
      },
      {
        "id": "TND-04-DOC-05",
        "name": "Akta Pendirian & Perubahan Direksi/Komisaris Terakhir",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "AKTA-SINERGI-AHU-2025.pdf",
        "notes": "Akta Notaris No. 24 tanggal 15 Agustus 2025",
        "expiryDate": null,
        "uploadedAt": "2026-03-01"
      },
      {
        "id": "TND-04-DOC-06",
        "name": "NIB OSS RBA & KBLI 77309 (Aktivitas Penyewaan Alat Berat)",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "NIB-SINERGI-TAMBANG.pdf",
        "notes": "KBLI Utama aktif dan terverifikasi",
        "expiryDate": null,
        "uploadedAt": "2026-03-01"
      },
      {
        "id": "TND-04-DOC-07",
        "name": "Sertifikat ISO 45001:2018 (K3 Tambang) & ISO 9001:2015",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "ISO-45001-SINERGI.pdf",
        "notes": "Akreditasi KAN aktif hingga 2027",
        "expiryDate": "2027-06-30",
        "uploadedAt": "2026-03-02"
      },
      {
        "id": "TND-04-DOC-08",
        "name": "Jaminan Penawaran (Bank Garansi 2% Nilai HPS)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "KURANG",
        "fileRef": null,
        "notes": "Belum diajukan ke Bank Mandiri / BRI",
        "expiryDate": null,
        "uploadedAt": null
      }
    ]
  },
  {
    "id": "TND-2026-005",
    "tenderNumber": "PLN-JBB-2025-1102",
    "title": "Revitalisasi Proteksi Gardu Induk & Saluran Udara Tegangan Tinggi (SUTT) 150 kV",
    "organizer": "PT PLN (Persero) UIP JBB",
    "company": "PT Java Power Solutions",
    "category": "Energi & Ketenagalistrikan",
    "sector": "ENERGI",
    "sectorLabel": "Energi & Ketenagalistrikan",
    "hpsValue": 62000000000,
    "bidValue": 58900000000,
    "announcementDate": "2025-11-20",
    "deadlineDate": "2026-01-25",
    "stage": "SPPBJ_KONTRAK",
    "status": "WON",
    "pic": "Budi Santoso, S.H., LL.M.",
    "location": "Cawang - Gandul, DKI Jakarta",
    "notes": "Pemenang lelang resmi ditetapkan. SPPBJ telah terbit dan siap dikonversi menjadi Kontrak Korporasi aktif.",
    "locked": true,
    "hash": "SHA256:9f8e7d6c5b4a3210fedcba9876543210abcdef0123456789abcdef0123456789",
    "submittedAt": "2025-12-20 09:15",
    "gng": {
      "scores": {
        "fit": 5,
        "cap": 5,
        "com": 5,
        "risk": 4,
        "cash": 4,
        "tech": 5
      },
      "totalScore": 92,
      "decision": "GO",
      "note": "Peluang menang tinggi dengan reputasi pekerjaan Gardu Induk sejenis.",
      "by": "Direktur Operasional",
      "date": "2025-11-22"
    },
    "pricing": {
      "directCost": 44200000000,
      "indirectCost": 4100000000,
      "riskContingency": 1800000000,
      "marginPercent": 14.8,
      "hpsRatio": 0.95,
      "isBelow80HPS": false,
      "requiredPerformanceBond": 2945000000
    },
    "gates": [
      {
        "id": "gate-1",
        "name": "Gate 1: Teknis & Kualifikasi",
        "reviewer": "Technical Team Lead",
        "status": "SELESAI",
        "date": "2025-11-28",
        "note": "Lulus evaluasi teknis 96.5"
      },
      {
        "id": "gate-2",
        "name": "Gate 2: Finansial & HPS",
        "reviewer": "CFO / Finance Head",
        "status": "SELESAI",
        "date": "2025-12-05",
        "note": "Struktur harga kompetitif"
      },
      {
        "id": "gate-3",
        "name": "Gate 3: Legal & Risiko",
        "reviewer": "Legal Counsel Lead",
        "status": "SELESAI",
        "date": "2025-12-12",
        "note": "Syarat kepatuhan K3 dan jaminan terpenuhi"
      },
      {
        "id": "gate-4",
        "name": "Gate 4: Otorisasi Direksi / Final",
        "reviewer": "Direktur Utama",
        "status": "SELESAI",
        "date": "2025-12-18",
        "note": "Disetujui penuh"
      }
    ],
    "clarifications": [],
    "result": {
      "status": "MENANG",
      "date": "2026-02-05",
      "rank": 1,
      "winner": "PT Java Power Solutions",
      "winPrice": 58900000000,
      "note": "Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) No. SPPBJ-PLN-JBB-2026-019 telah terbit.",
      "lessons": [
        "Kekuatan sertifikasi personil K3 Listrik & dokumen kualifikasi lengkap memberi poin teknis tertinggi.",
        "Jaminan bank BCA yang cepat terbit memperlancar proses verifikasi pasca penetapan pemenang."
      ]
    },
    "documents": [
      {
        "id": "TND-05-DOC-01",
        "name": "Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) dari PLN",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SPPBJ-PLN-JBB-2026-019.pdf",
        "notes": "Diterbitkan General Manager PLN UIP JBB",
        "expiryDate": null,
        "uploadedAt": "2026-02-05"
      },
      {
        "id": "TND-05-DOC-02",
        "name": "Jaminan Pelaksanaan (Performance Bond 5% Nilai Kontrak)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "PERFORMANCE-BOND-BCA-2026.pdf",
        "notes": "Senilai Rp2.945.000.000 valid 180 hari kalender",
        "expiryDate": "2026-08-10",
        "uploadedAt": "2026-02-10"
      },
      {
        "id": "TND-05-DOC-03",
        "name": "Dokumen Verifikasi Pemilik Manfaat (Beneficial Ownership AHU)",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "BO-AHU-KEMENKUMHAM-2026.pdf",
        "notes": "Pernyataan BO terdaftar per Perpres No. 13/2018",
        "expiryDate": null,
        "uploadedAt": "2026-02-06"
      },
      {
        "id": "TND-05-DOC-04",
        "name": "Daftar Personil Ahli K3 Listrik & K3 Konstruksi Madya",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SKA-K3-LISTRIK-TIM.pdf",
        "notes": "SKP Ahli K3 Kemenaker aktif",
        "expiryDate": "2028-02-15",
        "uploadedAt": "2026-02-06"
      }
    ]
  },
  {
    "id": "TND-2026-006",
    "tenderNumber": "PUPR-BM-2026-1044",
    "title": "Pekerjaan Struktur Jembatan Cable Stayed & Oprit Akses Pelabuhan Patimban Paket 3B",
    "organizer": "Kementerian Pekerjaan Umum dan Perumahan Rakyat (Ditjen Bina Marga)",
    "company": "PT Nusantara Energi",
    "category": "Konstruksi & Infrastruktur",
    "sector": "KONSTRUKSI",
    "sectorLabel": "Konstruksi & Infrastruktur",
    "hpsValue": 220000000000,
    "bidValue": 171600000000,
    "announcementDate": "2026-02-18",
    "deadlineDate": "2026-04-05",
    "stage": "EVALUASI_PEMBUKTIAN",
    "status": "ACTIVE",
    "pic": "Budi Santoso, S.H., LL.M.",
    "location": "Subang, Jawa Barat",
    "notes": "Penawaran 78.0% HPS memicu klausul Perpres 16/2018 & Standar Dokumen Pemilihan LKPP: Wajib evaluasi kewajaran harga (EKH) & jaminan pelaksanaan 5% dari HPS (Rp11 Miliar).",
    "locked": false,
    "hash": null,
    "gng": {
      "scores": {
        "fit": 5,
        "cap": 4,
        "com": 4,
        "risk": 4,
        "cash": 3,
        "tech": 5
      },
      "totalScore": 78,
      "decision": "GO",
      "note": "Proyek strategis nasional, penawaran agresif 78% HPS didukung efisiensi rantai pasok beton pracetak terafiliasi.",
      "by": "Bid Committee & Direktur Konstruksi",
      "date": "2026-02-20"
    },
    "pricing": {
      "directCost": 139000000000,
      "indirectCost": 11500000000,
      "riskContingency": 5500000000,
      "marginPercent": 9.1,
      "hpsRatio": 0.78,
      "isBelow80HPS": true,
      "requiredPerformanceBond": 11000000000
    },
    "gates": [
      {
        "id": "gate-1",
        "name": "Gate 1: Teknis & Kualifikasi",
        "reviewer": "Technical Team Lead",
        "status": "SELESAI",
        "date": "2026-02-24",
        "note": "Metode kerja erection girder & perancah disetujui konsultan"
      },
      {
        "id": "gate-2",
        "name": "Gate 2: Finansial & HPS",
        "reviewer": "CFO / Finance Head",
        "status": "SELESAI",
        "date": "2026-02-28",
        "note": "Evaluasi kewajaran harga (EKH) siap dihadapi, cash flow bridging loan aman"
      },
      {
        "id": "gate-3",
        "name": "Gate 3: Legal & Risiko",
        "reviewer": "Legal Counsel Lead",
        "status": "MENUNGGU",
        "date": null,
        "note": "Verifikasi jaminan pelaksanaan 5% HPS (Rp11 M) dan klausul denda keterlambatan"
      },
      {
        "id": "gate-4",
        "name": "Gate 4: Otorisasi Direksi / Final",
        "reviewer": "Direktur Utama",
        "status": "BERIKUTNYA",
        "date": null,
        "note": "Menunggu persetujuan legal"
      }
    ],
    "clarifications": [
      {
        "id": "CLR-01",
        "query": "Apakah masa pelaksanaan 270 hari kalender termasuk masa uji beban jembatan dinamis (dynamic loading test)?",
        "askedBy": "Chief Engineer",
        "date": "2026-02-25",
        "category": "Teknis & Spesifikasi",
        "impact": "Jadwal & Biaya Uji",
        "answer": "Ya, uji beban dinamis harus diselesaikan dalam kurun 270 hari kalender sebelum serah terima pertama (PHO).",
        "answeredAt": "2026-02-27",
        "status": "DIJAWAB",
        "effect": "Penyesuaian kurva S pekerjaan akhir"
      }
    ],
    "result": null,
    "documents": [
      {
        "id": "TND-06-DOC-01",
        "name": "Sertifikat Badan Usaha (SBU) Jasa Konstruksi Sipil Jembatan (BS001 / SI004)",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SBU-LPJK-BS001-KUALIFIKASI-BESAR.pdf",
        "notes": "SBU LPJK Aktif Kualifikasi B2 Subklasifikasi Jembatan Layang",
        "expiryDate": "2027-10-15",
        "uploadedAt": "2026-02-21"
      },
      {
        "id": "TND-06-DOC-02",
        "name": "SKK Konstruksi Ahli Madya / Utama Bidang Teknik Jembatan & Jalan",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "SKK-AHLI-JEMBATAN-TIM.pdf",
        "notes": "General Superintendent bersertifikat LPJK jenjang 9",
        "expiryDate": "2028-04-12",
        "uploadedAt": "2026-02-21"
      },
      {
        "id": "TND-06-DOC-03",
        "name": "Dokumen Analisa Harga Satuan Pekerjaan (AHSP) & Penjelasan Kewajaran Harga (<80% HPS)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "AHSP-EKH-PATIMBAN-78PCT.pdf",
        "notes": "Rincian efisiensi batching plant milik sendiri dan komitmen pabrikan precast girder",
        "expiryDate": null,
        "uploadedAt": "2026-02-27"
      },
      {
        "id": "TND-06-DOC-04",
        "name": "Jaminan Penawaran (Bid Bond Bank Mandiri 2.5% HPS - Rp5.5 Miliar)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "BID-BOND-MANDIRI-PATIMBAN.pdf",
        "notes": "Asli telah diserahkan ke Pokja Ditjen Bina Marga",
        "expiryDate": "2026-06-15",
        "uploadedAt": "2026-02-25"
      },
      {
        "id": "TND-06-DOC-05",
        "name": "Rencana Keselamatan Konstruksi (RKK) & Sistem Manajemen K3 Konstruksi",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "RKK-PATIMBAN-PAKET3B.pdf",
        "notes": "Tanda tangan Ahli K3 Konstruksi & Direktur Operasional",
        "expiryDate": null,
        "uploadedAt": "2026-02-23"
      },
      {
        "id": "TND-06-DOC-06",
        "name": "Surat Komitmen Kesanggupan Penerbitan Jaminan Pelaksanaan 5% Nilai HPS (Rp11 Miliar)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "KOMITMEN-PERF-BOND-5PCT-HPS.pdf",
        "notes": "Surat dukungan bank penerbit garansi Mandiri Corporate",
        "expiryDate": null,
        "uploadedAt": "2026-02-28"
      }
    ]
  },
  {
    "id": "TND-2026-007",
    "tenderNumber": "PGAS-PROJ-2026-003",
    "title": "EPC Pembangunan Jaringan Pipa Transmisi Gas Bumi Dumai - Sei Mangkei 24 Inch",
    "organizer": "SKK Migas - PT Pertamina Gas (Pertagas)",
    "company": "PT Nusantara Energi",
    "category": "Minyak & Gas Bumi",
    "sector": "MIGAS",
    "sectorLabel": "Minyak & Gas Bumi",
    "hpsValue": 425000000000,
    "bidValue": 395250000000,
    "announcementDate": "2026-03-01",
    "deadlineDate": "2026-05-10",
    "stage": "AANWIJZING",
    "status": "ACTIVE",
    "pic": "Dimas Prasetyo, S.H.",
    "location": "Dumai - Sei Mangkei, Riau & Sumut",
    "notes": "Sedang berlangsung masa tanya jawab Pokja. Klarifikasi spesifikasi material pipa ASTM A106 Grade B dan pemenuhan TKDN minimum 40%.",
    "locked": false,
    "hash": null,
    "gng": {
      "scores": {
        "fit": 5,
        "cap": 5,
        "com": 4,
        "risk": 4,
        "cash": 4,
        "tech": 5
      },
      "totalScore": 89,
      "decision": "GO",
      "note": "Proyek EPC Midstream pipa gas, sinergi konsorsium pabrikan pipa baja ber-TKDN tinggi 46%.",
      "by": "VP EPC & Direktur Utama",
      "date": "2026-03-03"
    },
    "pricing": {
      "directCost": 312000000000,
      "indirectCost": 28000000000,
      "riskContingency": 12500000000,
      "marginPercent": 10.8,
      "hpsRatio": 0.93,
      "isBelow80HPS": false,
      "requiredPerformanceBond": 19762500000
    },
    "gates": [
      {
        "id": "gate-1",
        "name": "Gate 1: Teknis & Kualifikasi",
        "reviewer": "Technical Team Lead",
        "status": "SELESAI",
        "date": "2026-03-08",
        "note": "Sertifikat CIVD SKK Migas dan TKDN 46% memenuhi kriteria tender"
      },
      {
        "id": "gate-2",
        "name": "Gate 2: Finansial & HPS",
        "reviewer": "CFO / Finance Head",
        "status": "MENUNGGU",
        "date": null,
        "note": "Sedang validasi fasilitas Letter of Credit (L/C) impor fitting pipa"
      },
      {
        "id": "gate-3",
        "name": "Gate 3: Legal & Risiko",
        "reviewer": "Legal Counsel Lead",
        "status": "BERIKUTNYA",
        "date": null,
        "note": "Review draft Joint Operation Agreement (JOA) dengan mitra pabrikan"
      },
      {
        "id": "gate-4",
        "name": "Gate 4: Otorisasi Direksi / Final",
        "reviewer": "Direktur Utama",
        "status": "BERIKUTNYA",
        "date": null,
        "note": "Persetujuan akhir submission"
      }
    ],
    "clarifications": [
      {
        "id": "CLR-01",
        "query": "Apakah dokumen sertifikat Tingkat Komponen Dalam Negeri (TKDN) harus terverifikasi surveyor independen (PT Sucofindo / Surveyor Indonesia)?",
        "askedBy": "Tim Legal & TKDN",
        "date": "2026-03-05",
        "category": "Kepatuhan & Regulasi",
        "impact": "Evaluasi Pembobotan HEA",
        "answer": "Wajib menyertakan sertifikat tanda sah TKDN Kemenperin yang masih berlaku atau surat verifikasi resmi.",
        "answeredAt": "2026-03-07",
        "status": "DIJAWAB",
        "effect": "Berhak atas preferensi harga HEA 7.5%"
      }
    ],
    "result": null,
    "documents": [
      {
        "id": "TND-07-DOC-01",
        "name": "Surat Pengganti Dokumen Administrasi (SPDA) Centralized Integrated Vendor Database (CIVD) Migas",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "CIVD-MIGAS-SKK-2026.pdf",
        "notes": "Status Vendor Aktif & Terverifikasi di portal CIVD SKK Migas",
        "expiryDate": "2027-02-28",
        "uploadedAt": "2026-03-04"
      },
      {
        "id": "TND-07-DOC-02",
        "name": "Sertifikat Tingkat Komponen Dalam Negeri (TKDN) Pipa & Jasa EPC Minimum 40%",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "TKDN-PIPA-SEI-MANGKEI-46PCT.pdf",
        "notes": "Komitmen TKDN Gabungan Barang & Jasa 46.5%",
        "expiryDate": "2028-09-10",
        "uploadedAt": "2026-03-05"
      },
      {
        "id": "TND-07-DOC-03",
        "name": "Sertifikasi CSMS (Contractor Safety Management System) SKK Migas Kategori High Risk",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "CSMS-HIGH-RISK-SKK-MIGAS.pdf",
        "notes": "Nilai CSMS 94 (Lolos Prakualifikasi Risiko Tinggi)",
        "expiryDate": "2027-05-15",
        "uploadedAt": "2026-03-05"
      },
      {
        "id": "TND-07-DOC-04",
        "name": "Jaminan Penawaran (Bid Bond 2% HPS dari Bank Mandiri)",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "BID-BOND-MIGAS-PGAS.pdf",
        "notes": "Senilai Rp8.500.000.000 valid 120 hari kalender",
        "expiryDate": "2026-07-10",
        "uploadedAt": "2026-03-06"
      },
      {
        "id": "TND-07-DOC-05",
        "name": "Perjanjian Konsorsium / KSO Terbuka Beserta Pembagian Porsi Pekerjaan",
        "category": "Legal Administrasi",
        "isMandatory": true,
        "status": "KURANG",
        "fileRef": null,
        "notes": "Finalisasi akta notaris KSO antara Lead Member (60%) dan Technical Partner (40%)",
        "expiryDate": null,
        "uploadedAt": null
      }
    ]
  },
  {
    "id": "TND-2026-008",
    "tenderNumber": "KOMINFO-TI-2026-881",
    "title": "Pengadaan Server Data Center & Lisensi Cloud Enterprise",
    "organizer": "Kementerian Komunikasi dan Digital RI",
    "company": "PT Nusantara Energi",
    "category": "Pengadaan Barang & Jasa Umum",
    "sector": "UMUM",
    "sectorLabel": "Pengadaan Barang & Jasa Umum",
    "hpsValue": 18500000000,
    "bidValue": 16280000000,
    "announcementDate": "2026-03-12",
    "deadlineDate": "2026-04-18",
    "stage": "PENYAMPAIAN_PENAWARAN",
    "status": "ACTIVE",
    "pic": "Ratna Dewi, S.Kom., M.T.",
    "location": "Jakarta Pusat, DKI Jakarta",
    "notes": "Pengadaan perangkat server enterprise, router core jaringan, dan lisensi virtualization cluster dengan alur pengadaan umum 5 tahap.",
    "locked": false,
    "hash": null,
    "gng": {
      "scores": { "fit": 4, "cap": 5, "com": 5, "risk": 4, "cash": 5, "tech": 4 },
      "totalScore": 88,
      "decision": "GO",
      "note": "Kemitraan resmi Tier-1 distributor hardware dan dukungan prinsipal internasional.",
      "by": "Bid Committee IT & Procurement",
      "date": "2026-03-14"
    },
    "pricing": {
      "directCost": 13500000000,
      "indirectCost": 1200000000,
      "riskContingency": 480000000,
      "marginPercent": 11.2,
      "hpsRatio": 0.88,
      "isBelow80HPS": false,
      "requiredPerformanceBond": 814000000
    },
    "gates": [
      { "id": "gate-1", "name": "Gate 1: Teknis & Kualifikasi", "reviewer": "IT Infrastructure Lead", "status": "SELESAI", "date": "2026-03-18", "note": "Spesifikasi server dan ISO 27001 sesuai KAK" },
      { "id": "gate-2", "name": "Gate 2: Finansial & HPS", "reviewer": "Finance Manager", "status": "SELESAI", "date": "2026-03-20", "note": "Cash flow dan margin 11.2% terverifikasi aman" },
      { "id": "gate-3", "name": "Gate 3: Legal & Risiko", "reviewer": "Legal Counsel", "status": "MENUNGGU", "date": null, "note": "Pengecekan klausul SLA dan garansi purnajual" },
      { "id": "gate-4", "name": "Gate 4: Otorisasi Direksi / Final", "reviewer": "Direktur Operasional", "status": "BERIKUTNYA", "date": null, "note": "Persetujuan final sebelum upload" }
    ],
    "clarifications": [
      {
        "id": "CLR-01",
        "query": "Apakah surat otorisasi distributor resmi (Letter of Authorization / Manufacturer Authorization Form) dari prinsipal wajib dilegalisir notaris?",
        "askedBy": "Tim Legal & Partnership",
        "date": "2026-03-16",
        "category": "Administrasi & Syarat Prinsipal",
        "impact": "Keabsahan Surat Kuasa",
        "answer": "Cukup MAF asli bertanda tangan digital atau cap basah prinsipal resmi di Indonesia.",
        "answeredAt": "2026-03-17",
        "status": "DIJAWAB",
        "effect": "Mempermudah pemenuhan dokumen syarat teknis"
      }
    ],
    "result": null,
    "documents": [
      {
        "id": "TND-08-DOC-01",
        "name": "Surat Kuasa & MAF (Manufacturer Authorization Form) Resmi Prinsipal Hardware",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "MAF-DELL-ENTERPRISE-2026.pdf",
        "notes": "Dukungan penuh garansi 3 tahun 24/7 on-site service",
        "expiryDate": "2027-03-15",
        "uploadedAt": "2026-03-18"
      },
      {
        "id": "TND-08-DOC-02",
        "name": "Sertifikat ISO 27001:2022 Sistem Manajemen Keamanan Informasi",
        "category": "Kepatuhan & Integritas",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "ISO-27001-2022-SECURITY.pdf",
        "notes": "Terakreditasi KAN dan masih berlaku",
        "expiryDate": "2027-08-20",
        "uploadedAt": "2026-03-18"
      },
      {
        "id": "TND-08-DOC-03",
        "name": "Brosur Teknis Spesifikasi Server & Hasil Benchmark CPU/IOPS",
        "category": "Kualifikasi Teknis",
        "isMandatory": true,
        "status": "TERPENUHI",
        "fileRef": "BROCHURE-SPEC-SERVER-R760.pdf",
        "notes": "Sesuai rincian KAK dan kompatibel dengan infrastruktur eksisting",
        "expiryDate": null,
        "uploadedAt": "2026-03-19"
      },
      {
        "id": "TND-08-DOC-04",
        "name": "Surat Jaminan Penawaran / Bid Security Asli dari Bank",
        "category": "Finansial & Keuangan",
        "isMandatory": true,
        "status": "DALAM_PROSES",
        "fileRef": null,
        "notes": "Pengajuan Bank Mandiri sebesar 2% nilai HPS (Rp 370.000.000)",
        "expiryDate": "2026-06-30",
        "uploadedAt": null
      }
    ]
  }
];

export const initialTenderVaultDocs = [
  {
    id: 'VAULT-001',
    code: 'DOC-KBLI-NIB',
    name: 'Nomor Induk Berusaha (NIB OSS RBA) Berbasis Risiko',
    category: 'Legal Administrasi',
    issuer: 'Kementerian Investasi / BKPM RI',
    number: '9120003418291',
    issueDate: '2021-08-15',
    expiryDate: null,
    fileRef: 'NIB-OSS-91200034182.pdf',
    fileSize: '2.4 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-003', 'TND-2026-004', 'TND-2026-005'],
    notes: 'Mencakup KBLI 42201 (Konstruksi Jaringan Elektrikal), 35101 (Pembangkitan Tenaga Listrik), 62019 (Aktivitas Pemrograman)'
  },
  {
    id: 'VAULT-002',
    code: 'DOC-AKTA-AHU',
    name: 'Akta Pendirian & Perubahan Terakhir Beserta SK Kemenkumham',
    category: 'Legal Administrasi',
    issuer: 'Notaris & Dirjen AHU Kemenkumham RI',
    number: 'AHU-001928.AH.01.02.TH.2025',
    issueDate: '2025-06-18',
    expiryDate: null,
    fileRef: 'AKTA-AHU-2025-0918.pdf',
    fileSize: '8.1 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-003', 'TND-2026-004', 'TND-2026-005'],
    notes: 'Akta No. 42 Notaris Hendra Wijaya, S.H. memuat susunan Direksi dan Dewan Komisaris terbaru'
  },
  {
    id: 'VAULT-003',
    code: 'DOC-SBU-LPJK',
    name: 'Sertifikat Badan Usaha (SBU) Jasa Pelaksana Konstruksi Ketenagalistrikan',
    category: 'Kualifikasi Teknis',
    issuer: 'LPJK Kementerian PUPR',
    number: '0-3171-08-019-1-09-918231',
    issueDate: '2024-11-20',
    expiryDate: '2027-11-20',
    fileRef: 'SBU-LPJK-EL001-KUALIFIKASI-BESAR.pdf',
    fileSize: '3.6 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-005'],
    notes: 'Subkualifikasi Besar (B2) - Bidang EL001 & EL002 (Instalasi Pembangkit & Transmisi)'
  },
  {
    id: 'VAULT-004',
    code: 'DOC-ISO-9001',
    name: 'Sertifikasi ISO 9001:2015 Sistem Manajemen Mutu',
    category: 'Kepatuhan & Sertifikasi',
    issuer: 'PT Sucofindo (Persero)',
    number: 'QSC-01928-IDN',
    issueDate: '2024-05-14',
    expiryDate: '2027-05-14',
    fileRef: 'ISO-9001-2015-SUCOFINDO.pdf',
    fileSize: '1.8 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-004', 'TND-2026-005'],
    notes: 'Surveilans tahunan ke-1 lulus tanpa temuan major'
  },
  {
    id: 'VAULT-005',
    code: 'DOC-ISO-14001',
    name: 'Sertifikasi ISO 14001:2018 Sistem Manajemen Lingkungan',
    category: 'Kepatuhan & Sertifikasi',
    issuer: 'PT Sucofindo (Persero)',
    number: 'EMS-00421-IDN',
    issueDate: '2024-05-14',
    expiryDate: '2027-05-14',
    fileRef: 'ISO-14001-2018-SUCOFINDO.pdf',
    fileSize: '1.9 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-004'],
    notes: 'Standar pengelolaan lingkungan & limbah terakreditasi KAN'
  },
  {
    id: 'VAULT-006',
    code: 'DOC-ISO-45001',
    name: 'Sertifikasi ISO 45001:2018 / SMK3 Sistem Manajemen K3',
    category: 'Kepatuhan & Sertifikasi',
    issuer: 'TUV Rheinland Indonesia',
    number: 'OHS-45-09182',
    issueDate: '2023-10-30',
    expiryDate: '2026-10-30',
    fileRef: 'ISO-45001-K3-TUV-2023.pdf',
    fileSize: '2.1 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-004', 'TND-2026-005'],
    notes: 'Masa berlaku hingga Oktober 2026. Persiapan perpanjangan audit Q3 2026'
  },
  {
    id: 'VAULT-007',
    code: 'DOC-KSWP-DJP',
    name: 'Konfirmasi Status Wajib Pajak (KSWP Status Valid Ditjen Pajak)',
    category: 'Keuangan & Pajak',
    issuer: 'Direktorat Jenderal Pajak (KPP Pratama)',
    number: 'KSWP-DJP-2026-0192841',
    issueDate: '2026-01-05',
    expiryDate: '2026-12-31',
    fileRef: 'KSWP-VALID-DJP-2026.pdf',
    fileSize: '1.2 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-003', 'TND-2026-004', 'TND-2026-005'],
    notes: 'Status Valid: SPT Tahunan 2 tahun terakhir telah dilaporkan dan tidak ada tunggakan pajak'
  },
  {
    id: 'VAULT-008',
    code: 'DOC-AUDIT-KAP',
    name: 'Laporan Keuangan Audited Tahun Buku 2024 (Opini WTP oleh KAP Registered OJK)',
    category: 'Keuangan & Pajak',
    issuer: 'KAP Paul Hadiwinata, Hidajat & Rekan (PKF)',
    number: '00214/2.1054/AU.1/04/0918-1/1/III/2025',
    issueDate: '2025-03-28',
    expiryDate: '2026-04-30',
    fileRef: 'LAP-KEUANGAN-AUDITED-2024-WTP.pdf',
    fileSize: '14.5 MB',
    status: 'EXPIRING_SOON',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-004'],
    notes: 'Perlu diperbarui dengan Laporan Keuangan Audited Tahun Buku 2025 yang sedang difinalisasi oleh KAP'
  },
  {
    id: 'VAULT-009',
    code: 'DOC-SKK-MANDIRI',
    name: 'Surat Keterangan Dukungan Keuangan & Sisa Kemampuan Keuangan (SKK Bank)',
    category: 'Keuangan & Pajak',
    issuer: 'PT Bank Mandiri (Persero) Tbk - Commercial Banking',
    number: 'CB.JKT/REF/2026/0118',
    issueDate: '2026-02-01',
    expiryDate: '2026-08-01',
    fileRef: 'SKK-BANK-MANDIRI-2026.pdf',
    fileSize: '1.5 MB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002'],
    notes: 'Menyatakan fasilitas perbankan dan kesiapan pendanaan hingga Rp100.000.000.000'
  },
  {
    id: 'VAULT-010',
    code: 'DOC-LKPP-NON-BLACKLIST',
    name: 'Surat Pernyataan Bebas Blacklist & Cek Status Inaproc LKPP',
    category: 'Legal Administrasi',
    issuer: 'LKPP RI / Portal Inaproc',
    number: 'LKPP/DAFTAR-HITAM/CLEAN/2026-01',
    issueDate: '2026-01-10',
    expiryDate: '2026-07-10',
    fileRef: 'NON-BLACKLIST-LKPP-2026.pdf',
    fileSize: '950 KB',
    status: 'VALID',
    tendersUsed: ['TND-2026-001', 'TND-2026-002', 'TND-2026-003', 'TND-2026-004', 'TND-2026-005'],
    notes: 'Perseroan dan Pengurus tidak tercatat dalam Daftar Hitam Nasional LKPP'
  }
];

export const initialTenderBonds = [
  {
    id: 'BND-2026-001',
    tenderId: 'TND-2026-001',
    tenderTitle: 'EPC PLTS Terapung 50 MW Cirata',
    bondType: 'BID_BOND',
    bondTypeName: 'Jaminan Penawaran (Bid Bond)',
    bankIssuer: 'PT Bank Mandiri (Persero) Tbk',
    guaranteeNumber: 'BG/MDR/JKT/2026/04119',
    amount: 2775000000,
    percentage: '2.0% HPS',
    issueDate: '2026-02-15',
    expiryDate: '2026-05-15',
    daysValid: 90,
    beneficiary: 'PT PLN (Persero) Kantor Pusat',
    status: 'AKTIF',
    fileRef: 'BG-BID-BOND-MANDIRI-PLTS.pdf',
    notes: 'Wajib diserahkan sampul fisik sebelum batas akhir pembukaan penawaran sampul II'
  },
  {
    id: 'BND-2026-002',
    tenderId: 'TND-2026-002',
    tenderTitle: 'Retrofit Sistem Kontrol Emisi PLTU Suralaya Unit 5-7',
    bondType: 'BID_BOND',
    bondTypeName: 'Jaminan Penawaran (Bid Bond)',
    bankIssuer: 'PT Bank Rakyat Indonesia (Persero) Tbk',
    guaranteeNumber: 'BRI-BG-TND-2026-8812',
    amount: 1640000000,
    percentage: '2.0% HPS',
    issueDate: '2026-02-20',
    expiryDate: '2026-05-20',
    daysValid: 90,
    beneficiary: 'PT PLN Indonesia Power',
    status: 'AKTIF',
    fileRef: 'BG-BID-BOND-BRI-SURALAYA.pdf',
    notes: 'Asli bank garansi telah diverifikasi oleh tim panitia pengadaan'
  },
  {
    id: 'BND-2026-003',
    tenderId: 'TND-2026-003',
    tenderTitle: 'Pengembangan Terintegrasi Sistem IoT Monitoring RKAB',
    bondType: 'BID_BOND',
    bondTypeName: 'Jaminan Penawaran (Bid Bond)',
    bankIssuer: 'PT Bank Central Asia Tbk',
    guaranteeNumber: 'BCA/BG/COMM/2026/0129',
    amount: 450000000,
    percentage: '2.5% HPS',
    issueDate: '2026-03-01',
    expiryDate: '2026-06-01',
    daysValid: 90,
    beneficiary: 'Ditjen Mineral dan Batubara Kementerian ESDM',
    status: 'DALAM_PROSES',
    fileRef: null,
    notes: 'Draft bank garansi sudah diajukan ke BCA Corporate Banking Cabang Sudirman'
  },
  {
    id: 'BND-2026-004',
    tenderId: 'TND-2026-005',
    tenderTitle: 'Pembangunan Gardu Induk 150 kV Muara Tawar Extension',
    bondType: 'PERFORMANCE_BOND',
    bondTypeName: 'Jaminan Pelaksanaan (Performance Bond)',
    bankIssuer: 'PT Bank Central Asia Tbk',
    guaranteeNumber: 'BCA-PB-2026-00412',
    amount: 2945000000,
    percentage: '5.0% Kontrak',
    issueDate: '2026-02-10',
    expiryDate: '2026-08-10',
    daysValid: 180,
    beneficiary: 'PT PLN (Persero) UIP Jawa Bagian Barat',
    status: 'AKTIF',
    fileRef: 'PERFORMANCE-BOND-BCA-2026.pdf',
    notes: 'Syarat penerbitan SPPBJ & Kontrak Perjanjian EPC sudah terpenuhi'
  },
  {
    id: 'BND-2026-005',
    tenderId: 'TND-2026-004',
    tenderTitle: 'Jasa Pengelolaan Hauling Road & Fleet Management Tambang',
    bondType: 'BID_BOND',
    bondTypeName: 'Jaminan Penawaran (Bid Bond)',
    bankIssuer: 'PT Bank Negara Indonesia (Persero) Tbk',
    guaranteeNumber: 'BNI-BG-2026-09941',
    amount: 2300000000,
    percentage: '2.5% HPS',
    issueDate: '2026-02-25',
    expiryDate: '2026-05-25',
    daysValid: 90,
    beneficiary: 'PT Bukit Asam Tbk (PTBA)',
    status: 'AKTIF',
    fileRef: 'BG-BID-BOND-BNI-PTBA.pdf',
    notes: 'Diterbitkan BNI Corporate Banking Cabang Palembang'
  }
];


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

export const masterSectorChecklists = {
  KONSTRUKSI: {
    PERSIAPAN_PENGADAAN: [
      { id: 'k1', text: 'Telaah Kerangka Acuan Kerja (KAK) & Gambar DED Konsultan Perencana', checked: true },
      { id: 'k2', text: 'Verifikasi Nilai HPS (Harga Perkiraan Sendiri) & Pagu Anggaran Proyek', checked: true },
      { id: 'k3', text: 'Penyusunan Rencana Keselamatan Konstruksi (RKK) Awal', checked: false }
    ],
    PENGUMUMAN_PENDAFTARAN: [
      { id: 'k4', text: 'Unduh Dokumen Pemilihan dari Portal SPSE / LPSE PUPR', checked: true },
      { id: 'k5', text: 'Pengecekan Masa Berlaku Sertifikat Badan Usaha (SBU LPJK)', checked: true },
      { id: 'k6', text: 'Konfirmasi Pendaftaran Peserta Lelang di SPSE', checked: true }
    ],
    AANWIJZING: [
      { id: 'k7', text: 'Mengikuti Rapat Pemberian Penjelasan (Aanwijzing) Teknis Online', checked: true },
      { id: 'k8', text: 'Pelaksanaan Peninjauan Lapangan / Site Visit Bersama Pokja', checked: true },
      { id: 'k9', text: 'Telaah Berita Acara Pemberian Penjelasan (BAPP) & Addendum Dokumen', checked: true }
    ],
    PENYAMPAIAN_PENAWARAN: [
      { id: 'k10', text: 'Penyusunan Dokumen Administrasi & Kualifikasi Legalitas', checked: true },
      { id: 'k11', text: 'Penyusunan Metode Kerja, Analisa Alat Berat, & Struktur Tim Proyek', checked: true },
      { id: 'k12', text: 'Enkripsi & Unggah Dokumen Penawaran 3 Sampul (Apendo SPSE)', checked: true }
    ],
    EVALUASI_PEMBUKTIAN: [
      { id: 'k13', text: 'Verifikasi Tenaga Ahli SKK Konstruksi (Project Manager & Ahli K3)', checked: true },
      { id: 'k14', text: 'Analisa Evaluasi Kewajaran Harga (EKH) jika penawaran <80% HPS', checked: true },
      { id: 'k15', text: 'Pembuktian Kualifikasi Asli (Fisik Berkas & Wawancara Personel Inti)', checked: false }
    ],
    PENGUMUMAN_PEMENANG: [
      { id: 'k16', text: 'Pemantauan Pengumuman Penetapan Pemenang Urutan 1, 2, 3 di SPSE', checked: false },
      { id: 'k17', text: 'Review Berita Acara Hasil Pemilihan (BAHP)', checked: false }
    ],
    MASA_SANGGAH: [
      { id: 'k18', text: 'Monitoring Portal Sanggah SPSE (5 Hari Kerja)', checked: false },
      { id: 'k19', text: 'Penyiapan Dokumen Pendukung Tanggapan bila Ada Sanggahan Peserta', checked: false }
    ],
    SPPBJ_KONTRAK: [
      { id: 'k20', text: 'Penerimaan Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) dari PPK', checked: false },
      { id: 'k21', text: 'Penerbitan Bank Garansi Jaminan Pelaksanaan (5% Kontrak atau 5% HPS bila <80%)', checked: false },
      { id: 'k22', text: 'Penandatanganan Kontrak Kerja Konstruksi Standar PUPR & SPMK', checked: false }
    ]
  },
  PERTAMBANGAN: {
    PERSIAPAN_PENGADAAN: [
      { id: 'p1', text: 'Verifikasi Status Keaktifan IUP / IUPK pada Database MODI / MOMIv Ditjen Minerba', checked: true },
      { id: 'p2', text: 'Pengecekan Kuota Pasokan Batubara/Mineral pada RKAB Ditjen Minerba Tahun Berjalan', checked: true },
      { id: 'p3', text: 'Validasi Bukti Setor Royalti Batubara/Mineral pada SIMPONI e-PNBP', checked: true }
    ],
    PENGUMUMAN_PENDAFTARAN: [
      { id: 'p4', text: 'Registrasi pada Portal Rekanan Pengadaan Komoditas Tambang', checked: true },
      { id: 'p5', text: 'Penyampaian Laporan Estimasi Cadangan Competent Person (KCMI / JORC Code)', checked: true },
      { id: 'p6', text: 'Pemeriksaan Izin Lingkungan (Amdal) & Bukti Penempatan Jaminan Reklamasi', checked: false }
    ],
    AANWIJZING: [
      { id: 'p7', text: 'Aanwijzing Spesifikasi Mutu: Nilai Kalori (CV), Moisture, Ash, Sulfur, & HGI', checked: true },
      { id: 'p8', text: 'Klarifikasi Kelayakan Pelabuhan Muat (Jetty) / Terminal Khusus (Tersus)', checked: true },
      { id: 'p9', text: 'Penjelasan Klausul Draf Perjanjian Jual Beli Batubara (Coal Supply Agreement)', checked: true }
    ],
    PENYAMPAIAN_PENAWARAN: [
      { id: 'p10', text: 'Pelaksanaan Pre-Shipment Inspection & Sampling Batubara / Ore Lapangan', checked: true },
      { id: 'p11', text: 'Pengujian Laboratorium Surveyor Independen (Certificate of Analysis / Sucofindo)', checked: true },
      { id: 'p12', text: 'Pengajuan Jadwal Kapal / Tongkang (Laycan Window) & Penawaran Volume Pasokan', checked: false }
    ],
    EVALUASI_PEMBUKTIAN: [
      { id: 'p13', text: 'Bidding Penawaran Harga Berdasarkan Formula Penyesuaian Indeks HBA/HPM ESDM', checked: true },
      { id: 'p14', text: 'Verifikasi Batas Toleransi Parameter Kualitas Batubara (Rejection Limit)', checked: true },
      { id: 'p15', text: 'Uji Keandalan Rantai Pasok Tambang ke Titik Serah (FOB Barge / CIF PLTU)', checked: false }
    ],
    PENGUMUMAN_PEMENANG: [
      { id: 'p16', text: 'Verifikasi Pemenuhan Kuota Kewajiban Pasar Domestik (DMO) Minimal 25%', checked: false },
      { id: 'p17', text: 'Klarifikasi Kesiapan Armada Tongkang & Tugboat Pengangkut', checked: false }
    ],
    MASA_SANGGAH: [
      { id: 'p18', text: 'Penetapan Alokasi Tonase Pasokan Kuota Batubara / Mineral', checked: false },
      { id: 'p19', text: 'Konfirmasi Jadwal Pengapalan Perdana (Initial Shipment Laycan)', checked: false }
    ],
    SPPBJ_KONTRAK: [
      { id: 'p20', text: 'Penerbitan Surat Penetapan Pemasok Batubara / Mineral Terpilih', checked: false },
      { id: 'p21', text: 'Penyerahan Jaminan Pelaksanaan Pasokan Komoditas Tambang (Supply Bond)', checked: false },
      { id: 'p22', text: 'Penandatanganan Kontrak Jual-Beli Batubara / Ore Supply Agreement', checked: false }
    ]
  },
  MIGAS: {
    PERSIAPAN_PENGADAAN: [
      { id: 'm1', text: 'Verifikasi Keabsahan Surat Pengganti Dokumen Administrasi (SPDA) di CIVD SKK Migas', checked: true },
      { id: 'm2', text: 'Pengecekan Status Kualifikasi Sentral Kontraktor Kontrak Kerja Sama (KKKS)', checked: true },
      { id: 'm3', text: 'Pemeriksaan Daftar Hitam (Blacklist) Bersama Industri Hulu Migas', checked: true }
    ],
    PENGUMUMAN_PENDAFTARAN: [
      { id: 'm4', text: 'Verifikasi Akreditasi CSMS (Contractor Safety Management System) High Risk (>=70)', checked: true },
      { id: 'm5', text: 'Pemeriksaan Sertifikasi Pabrikasi Standar API / ASME / ISO', checked: true },
      { id: 'm6', text: 'Pendaftaran Minat Keikutsertaan Paket Pengadaan PTK-007 Buku Kedua', checked: true }
    ],
    AANWIJZING: [
      { id: 'm7', text: 'Mengikuti Pre-Bid Meeting Teknis & Penjelasan Ruang Lingkup Migas', checked: true },
      { id: 'm8', text: 'Klarifikasi Batasan Minimal Capaian TKDN Berdasarkan Buku APDN Kemenperin', checked: true },
      { id: 'm9', text: 'Penjelasan Klausul Garansi Teknis & Asuransi Oil & Gas (CAR / EAR)', checked: false }
    ],
    PENYAMPAIAN_PENAWARAN: [
      { id: 'm10', text: 'Penyampaian Sampul I: Dokumen Administrasi, Teknis, dan Komitmen TKDN (Tanpa Harga)', checked: true },
      { id: 'm11', text: 'Pengisian Formulir Komitmen Capaian TKDN (Self Assessment APDN)', checked: true },
      { id: 'm12', text: 'Penyerahan Bank Garansi Jaminan Penawaran (Bid Bond Standar SKK Migas)', checked: true }
    ],
    EVALUASI_PEMBUKTIAN: [
      { id: 'm13', text: 'Evaluasi Teknis Kualifikasi (Wajib Lolos Passing Grade Minimum 80 Poin)', checked: true },
      { id: 'm14', text: 'Verifikasi Komitmen TKDN oleh Lembaga Surveyor Independen Resmi (Sucofindo/SI)', checked: true },
      { id: 'm15', text: 'Klarifikasi Teknis & Pembuktian Spesifikasi Peralatan Khusus Migas', checked: false }
    ],
    PENGUMUMAN_PEMENANG: [
      { id: 'm16', text: 'Pembukaan Sampul II (Komersial / Harga Penawaran) Peserta yang Lolos Sampul I', checked: false },
      { id: 'm17', text: 'Perhitungan Harga Evaluasi Akhir (HEA): HEA = (1 - KP) x HP dengan Bobot Preferensi TKDN', checked: false },
      { id: 'm18', text: 'Penetapan Peringkat Penawaran Terendah Berdasarkan Nilai HEA', checked: false }
    ],
    MASA_SANGGAH: [
      { id: 'm19', text: 'Klarifikasi & Negosiasi terhadap Batas Owner Estimate (OE) Rahasia SKK Migas', checked: false },
      { id: 'm20', text: 'Masa Sanggah Pengadaan PTK-007 (3 Hari Kerja)', checked: false }
    ],
    SPPBJ_KONTRAK: [
      { id: 'm21', text: 'Penerbitan Letter of Intent (LOI) / Letter of Award (LOA) oleh KKKS', checked: false },
      { id: 'm22', text: 'Penyerahan Jaminan Pelaksanaan Migas (Performance Bond SKK Migas)', checked: false },
      { id: 'm23', text: 'Penandatanganan Kontrak Pengadaan Hulu Migas (EPCIC / Master Service Agreement)', checked: false }
    ]
  },
  ENERGI: {
    PERSIAPAN_PENGADAAN: [
      { id: 'e1', text: 'Verifikasi Keaktifan Rekanan pada Daftar Penyedia Terseleksi (DPT) PT PLN (Persero)', checked: true },
      { id: 'e2', text: 'Penelaahan Target Kuota Rencana Usaha Penyediaan Tenaga Listrik (RUPTL)', checked: true },
      { id: 'e3', text: 'Kajian Kerangka Regulasi Tarif Listrik EBT (Perpres No. 112/2022)', checked: true }
    ],
    PENGUMUMAN_PENDAFTARAN: [
      { id: 'e4', text: 'Pengambilan Dokumen Request for Proposal (RFP) EPC Pembangkit / PPA', checked: true },
      { id: 'e5', text: 'Pembentukan Konsorsium Pengembang / Special Purpose Vehicle (SPV)', checked: true },
      { id: 'e6', text: 'Konfirmasi Jaminan Penawaran Partisipasi (Bid Security Standar PLN)', checked: true }
    ],
    AANWIJZING: [
      { id: 'e7', text: 'Mengikuti Aanwijzing Teknis & Penjelasan Batasan Grid Code Interkoneksi Transmisi', checked: true },
      { id: 'e8', text: 'Studi Titik Evakuasi Daya Gardu Induk & Kapasitas Saluran Udara Tegangan Tinggi (SUTT)', checked: true },
      { id: 'e9', text: 'Klarifikasi Rancangan Kontrak Power Purchase Agreement (PPA 25-30 Tahun BOOT)', checked: false }
    ],
    PENYAMPAIAN_PENAWARAN: [
      { id: 'e10', text: 'Pengajuan Penawaran Struktur Tarif Listrik (cents USD / kWh atau Rp / kWh)', checked: true },
      { id: 'e11', text: 'Penyampaian Desain Teknis Pembangkit (Solar PV/Turbin), Degradasi Energi, & BESS', checked: true },
      { id: 'e12', text: 'Penyerahan Rencana Tingkat Komponen Dalam Negeri (TKDN Pembangkit Permenperin 54/2012)', checked: false }
    ],
    EVALUASI_PEMBUKTIAN: [
      { id: 'e13', text: 'Evaluasi Bankability Proyek & Penyerahan Letter of Support dari Sindikasi Bank', checked: true },
      { id: 'e14', text: 'Simulasi Financial Model, Internal Rate of Return (IRR), dan DSCR Proyek', checked: true },
      { id: 'e15', text: 'Pengujian Standar IEC / SNI Peralatan Inverter dan Modul Surya', checked: false }
    ],
    PENGUMUMAN_PEMENANG: [
      { id: 'e16', text: 'Pengecekan Komitmen Pengurusan Sertifikat Laik Operasi (SLO) Ditjen Ketenagalistrikan', checked: false },
      { id: 'e17', text: 'Verifikasi Kepatuhan Izin Lingkungan AMDAL dan Izin Pinjam Pakai Kawasan Hutan (IPPKH)', checked: false }
    ],
    MASA_SANGGAH: [
      { id: 'e18', text: 'Penetapan Pengembang Terpilih (Selected Bidder) oleh Direksi PLN', checked: false },
      { id: 'e19', text: 'Penerbitan Surat Penunjukan Pemenang (Letter of Award)', checked: false }
    ],
    SPPBJ_KONTRAK: [
      { id: 'e20', text: 'Penandatanganan Power Purchase Agreement (PPA) 25-30 Tahun dengan PT PLN', checked: false },
      { id: 'e21', text: 'Penyerahan Development Bond / Jaminan Pelaksanaan Pembangkit', checked: false },
      { id: 'e22', text: 'Pemenuhan Pembiayaan Proyek (Pencapaian Financial Close)', checked: false }
    ]
  },
  UMUM: {
    PERSIAPAN_PENGADAAN: [
      { id: 'u1', text: 'Telaah Kerangka Spesifikasi Teknis Barang / Jasa Umum', checked: true },
      { id: 'u2', text: 'Penetapan Harga Perkiraan Sendiri (HPS) Berdasarkan Survei Pasar', checked: true }
    ],
    PENGUMUMAN_PENDAFTARAN: [
      { id: 'u3', text: 'Unduh Dokumen Lelang & Persyaratan Kualifikasi Rekanan', checked: true },
      { id: 'u4', text: 'Pemeriksaan Legalitas Pokok NIB OSS & Kesesuaian KBLI', checked: true }
    ],
    PENYAMPAIAN_PENAWARAN: [
      { id: 'u5', text: 'Pengunggahan Dokumen Administrasi & Teknis Penawaran', checked: true },
      { id: 'u6', text: 'Penyampaian Penawaran Harga Komersial Awal', checked: false }
    ],
    EVALUASI_PEMBUKTIAN: [
      { id: 'u7', text: 'Evaluasi Kesesuaian Spesifikasi Teknis & Brosur Pabrikan', checked: true },
      { id: 'u8', text: 'Keikutsertaan E-Reverse Auction (Tawar Menawar Harga Online)', checked: false }
    ],
    SPPBJ_KONTRAK: [
      { id: 'u9', text: 'Penerimaan Penetapan Pemenang Pengadaan', checked: false },
      { id: 'u10', text: 'Penerbitan Surat Perintah Kerja (SPK) / Kontrak Pembelian', checked: false }
    ]
  }
};

export const masterSectorStageGuidance = {
  KONSTRUKSI: {
    PERSIAPAN_PENGADAAN: { regulatory: 'UU No. 2/2017 & Permen PUPR 14/2020', focus: 'Kajian KAK, DED, dan spesifikasi teknis PUPR', alert: 'Pastikan metode konstruksi teruji dan estimasi biaya mencakup mitigasi K3 Konstruksi (SMKK).' },
    PENGUMUMAN_PENDAFTARAN: { regulatory: 'Perpres 16/2018 jo 12/2021 Pasal 50', focus: 'Validasi SBU LPJK & kesesuaian KBLI 42xxx', alert: 'SBU wajib terdaftar aktif di LPJK Kementerian PUPR dan SIKoP LKPP.' },
    AANWIJZING: { regulatory: 'Dokumen Pemilihan SPSE Standar PUPR', focus: 'Peninjauan fisik lapangan (Site Visit) & tanya jawab Pokja', alert: 'Kehadiran dalam site visit wajib dicatat dalam Berita Acara Pemberian Penjelasan (BAPP).' },
    PENYAMPAIAN_PENAWARAN: { regulatory: 'Perpres 16/2018 Sistem 3 Sampul', focus: 'Pemasukan Administrasi, Teknis, dan Harga melalui Apendo', alert: 'Pastikan file terenkripsi sempurna dan tidak corrupt sebelum batas waktu penutupan (closing time).' },
    EVALUASI_PEMBUKTIAN: { regulatory: 'SE Menteri PUPR No. 18/SE/M/2021 & LKPP 12/2021', focus: 'Evaluasi EKH (<80% HPS) & Pembuktian Tenaga Ahli SKK', alert: 'CRITICAL: Bila penawaran <80% HPS, wajib siapkan analisa harga satuan timpang (AHSP) dan bukti kewajaran upah/bahan.' },
    PENGUMUMAN_PEMENANG: { regulatory: 'Perpres 16/2018 Pasal 51', focus: 'Penetapan Urutan Pemenang 1, 2, 3 oleh Pokja', alert: 'Periksa apakah ada selisih poin teknis atau keberatan dari calon pemenang cadangan.' },
    MASA_SANGGAH: { regulatory: 'Perpres 16/2018 (5 Hari Kerja)', focus: 'Masa Sanggah Melalui SPSE', alert: 'Jawab sanggahan secara faktual dengan merujuk dokumen penawaran dan berita acara resmi.' },
    SPPBJ_KONTRAK: { regulatory: 'Standar Kontrak Konstruksi PUPR & FIDIC Red/Silver', focus: 'Penerbitan SPPBJ, Jaminan Pelaksanaan 5%, dan SPMK', alert: 'Jaminan Pelaksanaan wajib 5% dari HPS (bukan 5% dari nilai kontrak) jika penawaran <80% HPS!' }
  },
  PERTAMBANGAN: {
    PERSIAPAN_PENGADAAN: { regulatory: 'UU No. 3/2020 Minerba & Kepmen ESDM No. 255.K/2022', focus: 'Verifikasi IUP/IUPK di MODI/MOMIv & Persetujuan Kuota RKAB', alert: 'Tanpa persetujuan kuota RKAB dari Ditjen Minerba, pasokan batubara/mineral dianggap ilegal.' },
    PENGUMUMAN_PENDAFTARAN: { regulatory: 'Standar KCMI 2017 & JORC Code 2012', focus: 'Laporan Estimasi Cadangan Competent Person & Jaminan Reklamasi', alert: 'Hanya laporan dari Competent Person Indonesia (CPI) terdaftar Perhapi/IAGI yang diakui.' },
    AANWIJZING: { regulatory: 'Standar Pasokan Energi Primer PT PLN Batubara', focus: 'Aanwijzing Mutu (CV, Moisture, Ash, Sulfur) & Kelayakan Jetty', alert: 'Pastikan pelabuhan muat (Jetty) memiliki izin Terminal Khusus (Tersus) / TUKS aktif dari Kemenhub.' },
    PENYAMPAIAN_PENAWARAN: { regulatory: 'ASTM D-3172 & ISO 17246 Standard Sampling', focus: 'Pengujian Laboratorium Sucofindo / Carsurin (COA)', alert: 'Certificate of Analysis (COA) resmi wajib diterbitkan surveyor independen terakreditasi KAN.' },
    EVALUASI_PEMBUKTIAN: { regulatory: 'Kepmen ESDM Formula HBA & HPM Mineral', focus: 'Bidding Harga Berdasarkan Penyesuaian Indeks HBA/HPM pada B/L', alert: 'Harga penawaran wajib mengacu formula indeks HBA bulanan ESDM dengan batas toleransi penolakan (rejection limit).' },
    PENGUMUMAN_PEMENANG: { regulatory: 'Kepmen ESDM No. 139.K/HK.02/MEM.B/2021 (DMO 25%)', focus: 'Verifikasi Kepatuhan Kuota DMO Minimal 25%', alert: 'Produsen yang belum melunasi kewajiban DMO 25% dikenakan sanksi denda dan pembekuan ekspor.' },
    MASA_SANGGAH: { regulatory: 'Alur Penunjukan Pasokan Komoditas Energi BUMN', focus: 'Alokasi Tonase Pasokan & Laycan Window Pengapalan', alert: 'Konfirmasi ketersediaan armada tongkang (barge 300 ft) dan jadwal docking.' },
    SPPBJ_KONTRAK: { regulatory: 'Coal / Ore Supply Agreement (FOB / CIF Basis)', focus: 'Tanda Tangan CSA & Jaminan Pelaksanaan Pasokan', alert: 'Klausul demurrage, deadfreight, dan penyesuaian harga (bonus-penalty) wajib dituangkan jelas.' }
  },
  MIGAS: {
    PERSIAPAN_PENGADAAN: { regulatory: 'Pedoman Tata Kerja PTK-007 Revisi 05 SKK Migas', focus: 'Verifikasi CIVD (Centralized Integrated Vendor Database) & SPDA', alert: 'SPDA (Surat Pengganti Dokumen Administrasi) wajib dalam status aktif di portal CIVD SKK Migas.' },
    PENGUMUMAN_PENDAFTARAN: { regulatory: 'PTK-007 Buku Kedua & Pedoman CSMS SKK Migas', focus: 'Verifikasi CSMS Kategori High Risk (Skor >= 70-80)', alert: 'Vendor tanpa sertifikat CSMS yang valid untuk kategori risiko proyek langsung digugurkan di tahap prakualifikasi.' },
    AANWIJZING: { regulatory: 'Permen ESDM 15/2013 & Buku APDN Kemenperin', focus: 'Pre-Bid Meeting & Komitmen Batasan Minimal TKDN', alert: 'Barang/jasa yang sudah ada dalam Buku APDN wajib digunakan dan tidak boleh disubstitusi impor.' },
    PENYAMPAIAN_PENAWARAN: { regulatory: 'PTK-007 SKK Migas Sistem 2 Sampul', focus: 'Pemasukan Sampul I (Administrasi & Teknis Tanpa Harga) + Bid Bond', alert: 'Jangan mencantumkan nominal harga di Sampul I! Pelanggaran akan mengakibatkan diskualifikasi mutlak.' },
    EVALUASI_PEMBUKTIAN: { regulatory: 'Evaluasi Teknis PTK-007 Passing Grade >= 80', focus: 'Verifikasi Kualifikasi Teknis & Audit TKDN Surveyor Resmi', alert: 'Hanya peserta yang lolos Passing Grade Teknis 80 yang berhak dibuka dokumen Sampul II (Komersial).' },
    PENGUMUMAN_PEMENANG: { regulatory: 'Formula HEA: HEA = (1 - KP) x HP SKK Migas', focus: 'Pembukaan Sampul II & Perhitungan Harga Evaluasi Akhir (HEA)', alert: 'Peserta dengan komitmen TKDN lebih tinggi berhak atas preferensi harga (KP) sehingga nilai HEA menjadi lebih murah!' },
    MASA_SANGGAH: { regulatory: 'Batas Rahasia Owner Estimate (OE) SKK Migas', focus: 'Klarifikasi OE & Masa Sanggah 3 Hari Kerja', alert: 'Penawaran di atas 100% OE SKK Migas wajib dinegosiasikan atau dinyatakan gugur bila gagal sepakat.' },
    SPPBJ_KONTRAK: { regulatory: 'Master Service Agreement / EPCIC Hulu Migas Standar SKK Migas', focus: 'Penerbitan LOI/LOA & Penyerahan Performance Bond', alert: 'Jaminan pelaksanaan wajib berupa Garansi Bank devisa yang disetujui KKKS & SKK Migas.' }
  },
  ENERGI: {
    PERSIAPAN_PENGADAAN: { regulatory: 'Perdir PLN No. 0022.P/DIR/2020 & Perpres 112/2022', focus: 'Verifikasi Daftar Penyedia Terseleksi (DPT) & Kuota RUPTL', alert: 'Penyedia wajib terdaftar di sistem DPT PLN sesuai bidang spesialisasi pembangkitan/transmisi.' },
    PENGUMUMAN_PENDAFTARAN: { regulatory: 'Request for Proposal (RFP) Independent Power Producer (IPP)', focus: 'Pembentukan Konsorsium SPV & Penyerahan Bid Security', alert: 'Lead member konsorsium wajib menguasai porsi ekuitas dominan dan rekam jejak sejenis.' },
    AANWIJZING: { regulatory: 'Aturan Jaringan Sistem Tenaga Listrik (Grid Code PLN)', focus: 'Studi Interkoneksi Grid & Evakuasi Daya Gardu Induk', alert: 'Pastikan kapasitas transmisi dan stability margin di Gardu Induk mampu menyerap intermitensi daya.' },
    PENYAMPAIAN_PENAWARAN: { regulatory: 'Permen ESDM Tarif Tenaga Listrik EBT', focus: 'Penawaran Tarif (cents USD/kWh) & Rencana TKDN Pembangkit', alert: 'Tarif penawaran harus berada di bawah Biaya Pokok Penyediaan (BPP) PLN setempat.' },
    EVALUASI_PEMBUKTIAN: { regulatory: 'Standar Bankability Lender Multilateral / Bank Sindikasi', focus: 'Evaluasi Kelayakan Finansial & Letter of Intent Pembiayaan', alert: 'Bankability Letter wajib menyatakan komitmen kesediaan mendanai minimal 70% belanja modal (Capex).' },
    PENGUMUMAN_PEMENANG: { regulatory: 'Permen ESDM No. 12/2021 Sertifikat Laik Operasi (SLO)', focus: 'Pemeriksaan Kesiapan SLO & Persetujuan AMDAL Pembangkit', alert: 'Rencana uji komisioning SLO oleh Lembaga Inspeksi Teknik (LIT) wajib terperinci.' },
    MASA_SANGGAH: { regulatory: 'Keputusan Direksi PT PLN (Persero)', focus: 'Penetapan Pengembang Terpilih (Selected Bidder) & LOA', alert: 'Pemberitahuan resmi kepada konsorsium pemenang untuk memulai proses finalisasi PPA.' },
    SPPBJ_KONTRAK: { regulatory: 'Power Purchase Agreement (PPA) BOOT 25-30 Tahun', focus: 'Tanda Tangan PPA, Development Bond, & Financial Close', alert: 'Penyedia wajib mencapai Financial Close dalam jangka waktu maksimal 12 bulan sejak penandatanganan PPA.' }
  },
  UMUM: {
    PERSIAPAN_PENGADAAN: { regulatory: 'Perpres 16/2018 (Pengadaan Barang & Jasa Sederhana)', focus: 'Penyusunan Spesifikasi Teknis & Survei Harga Pasar (HPS)', alert: 'Pastikan spesifikasi tidak mengarah ke merek tertentu kecuali untuk suku cadang eksisting.' },
    PENGUMUMAN_PENDAFTARAN: { regulatory: 'Portal LPSE / E-Procurement BUMN', focus: 'Pengunduhan Dokumen Lelang & Verifikasi Legalitas OSS', alert: 'NIB dan KBLI perusahaan wajib sesuai dengan komoditas yang dilelang.' },
    PENYAMPAIAN_PENAWARAN: { regulatory: 'Pemasukan Dokumen 1 Sampul / 2 Sampul Cepat', focus: 'Penyampaian Penawaran Teknis & Harga Awal', alert: 'Sertakan surat dukungan prinsipal / distributor resmi bila disyaratkan.' },
    EVALUASI_PEMBUKTIAN: { regulatory: 'E-Reverse Auction LKPP / BUMN', focus: 'Tawar-Menawar Harga Terbuka Secara Elektronik', alert: 'Tetapkan batas penurunan harga minimal (bid increment) agar marjin laba tetap terjaga.' },
    SPPBJ_KONTRAK: { regulatory: 'Surat Perintah Kerja (SPK) / Surat Perjanjian Jual Beli', focus: 'Penerbitan SPK & Pelaksanaan Pengiriman Barang', alert: 'Pastikan serah terima barang disertai Berita Acara Serah Terima (BAST) dan uji fungsi (UAT).' }
  }
};

export const initialCapabilityList = [
  { key: 'tender.view', label: 'Lihat Daftar & Detail Tender', category: 'Tender & Pengadaan' },
  { key: 'tender.edit', label: 'Kelola Tender & Dokumen Penawaran', category: 'Tender & Pengadaan' },
  { key: 'tender.approve', label: 'Otorisasi 4-Gate & Kunci Submission', category: 'Tender & Pengadaan' },
  { key: 'contract.view', label: 'Lihat Daftar & Detail Kontrak', category: 'Manajemen Kontrak' },
  { key: 'contract.edit', label: 'Buat & Edit Draf Kontrak Korporasi', category: 'Manajemen Kontrak' },
  { key: 'contract.approve', label: 'Sahkan & Tanda Tangan Kontrak', category: 'Manajemen Kontrak' },
  { key: 'request.create', label: 'Ajukan Tiket Permintaan Legal', category: 'Permintaan Layanan' },
  { key: 'request.manage', label: 'Disposisi & Kerjakan Tiket Legal', category: 'Permintaan Layanan' },
  { key: 'dispute.manage', label: 'Kelola Perkara Sengketa & Litigasi', category: 'Dispute & Litigasi' },
  { key: 'compliance.manage', label: 'Audit Kepatuhan & Perizinan (IUP/OSS)', category: 'Kepatuhan & Perizinan' },
  { key: 'vault.manage', label: 'Kelola Dokumen Vault & Bank Dokumen', category: 'Repositori & Vault' },
  { key: 'fin.view', label: 'Lihat Nilai Finansial, HPS & Komersial', category: 'Finansial & Nilai' },
  { key: 'settings.manage', label: 'Kelola Pengguna, Peran, Alur & Sistem', category: 'Administrasi Sistem' }
];

export const initialRolesMatrix = {
  ADMIN: {
    label: 'Administrator Sistem',
    description: 'Akses penuh ke seluruh modul, konfigurasi RBAC, pengguna, dan alur sistem.',
    caps: ['*'],
    isCustom: false
  },
  'LEGAL MANAGER': {
    label: 'Legal Operations Manager',
    description: 'Supervisi operasional divisi legal, persetujuan draf kontrak, dan pembagian tugas.',
    caps: [
      'tender.view', 'tender.edit', 'tender.approve',
      'contract.view', 'contract.edit', 'contract.approve',
      'request.create', 'request.manage',
      'dispute.manage', 'compliance.manage',
      'vault.manage', 'fin.view'
    ],
    isCustom: false
  },
  'LEGAL COUNSEL': {
    label: 'Senior Legal Counsel',
    description: 'Penyusunan penawaran tender, telaah kontrak, analisis risiko hukum, dan litigasi.',
    caps: [
      'tender.view', 'tender.edit',
      'contract.view', 'contract.edit',
      'request.create', 'request.manage',
      'dispute.manage', 'compliance.manage',
      'vault.manage', 'fin.view'
    ],
    isCustom: false
  },
  'LEGAL STAFF': {
    label: 'Legal Specialist & Admin',
    description: 'Administrasi berkas lelang, unggah vault dokumen, dan pencatatan perizinan.',
    caps: [
      'tender.view', 'tender.edit',
      'contract.view',
      'request.create',
      'compliance.manage', 'vault.manage'
    ],
    isCustom: false
  },
  REQUESTOR: {
    label: 'Requestor / Unit Bisnis',
    description: 'Pengajuan tiket kebutuhan hukum dan pemantauan status permohonan mandiri.',
    caps: [
      'request.create'
    ],
    isCustom: false
  },
  MANAGEMENT: {
    label: 'Direksi / Board of Directors',
    description: 'Otorisasi gate final, penandatanganan kontrak bernilai tinggi, dan monitoring eksekutif.',
    caps: [
      'tender.view', 'tender.approve',
      'contract.view', 'contract.approve',
      'fin.view', 'settings.manage'
    ],
    isCustom: false
  }
};

export const initialApprovalFlows = [
  {
    id: 'AF-01',
    doc: 'Evaluasi Go/No-Go Lelang',
    category: 'Tender & Pengadaan',
    maker: 'Bid Specialist / Tender Lead',
    checker: 'Legal & Risk Committee',
    approver: 'Direktur Operasional',
    threshold: 0,
    status: 'AKTIF',
    help: 'Evaluasi 6 kriteria tertimbang kelayakan korporasi sebelum tender diikuti'
  },
  {
    id: 'AF-02',
    doc: 'Paket Penawaran Lelang & Jaminan Bank',
    category: 'Tender & Pengadaan',
    maker: 'Legal Counsel',
    checker: 'Legal Operations Manager',
    approver: 'Direktur Utama',
    threshold: 10000000000,
    status: 'AKTIF',
    help: 'Penawaran di atas Rp 10 Miliar wajib mendapatkan otorisasi Direktur Utama'
  },
  {
    id: 'AF-03',
    doc: 'Persetujuan Draf Kontrak Korporasi Baru',
    category: 'Manajemen Kontrak',
    maker: 'Commercial Legal Counsel',
    checker: 'Head of Legal & Compliance',
    approver: 'Direksi Terkait',
    threshold: 5000000000,
    status: 'AKTIF',
    help: 'Review legalitas bertingkat sebelum penandatanganan kontrak kerja sama'
  },
  {
    id: 'AF-04',
    doc: 'Variation Order (VO) & Adendum Kontrak',
    category: 'Manajemen Kontrak',
    maker: 'Contract Specialist',
    checker: 'Contract Manager',
    approver: 'Project Director',
    threshold: 500000000,
    status: 'AKTIF',
    help: 'Adendum atau perubahan nilai proyek di atas Rp 500 Juta wajib ke Project Director'
  },
  {
    id: 'AF-05',
    doc: 'Kesepakatan Damai / Settlement Sengketa',
    category: 'Dispute & Litigasi',
    maker: 'Litigation Counsel',
    checker: 'General Counsel',
    approver: 'Direktur Utama',
    threshold: 0,
    status: 'AKTIF',
    help: 'Perdamaian di luar/dalam pengadilan mengikat hak perseroan'
  },
  {
    id: 'AF-06',
    doc: 'Termin Pembayaran & Penagihan (Billing)',
    category: 'Keuangan & Finansial',
    maker: 'Billing Specialist',
    checker: 'Finance Manager',
    approver: 'Chief Financial Officer (CFO)',
    threshold: 1000000000,
    status: 'AKTIF',
    help: 'Verifikasi BAST fisik dan persetujuan termin sebelum dana dicairkan'
  }
];

export const initialErpIntegrations = [
  {
    id: 'INT-01',
    name: 'HR & Payroll System (HRIS)',
    code: 'HR_PAYROLL',
    category: 'Sumber Daya Manusia',
    status: 'LIVE',
    type: 'REST API & Webhook',
    description: 'Sinkronisasi data advokat internal, kuasa hukum direksi, kehadiran, dan sertifikasi keahlian K3/SKK.',
    endpoint: 'https://hris.nusantara-energi.internal/api/v2',
    lastSync: 'Baru saja (2026-09-30 15:30)',
    latency: '24ms',
    itemsCount: '142 Karyawan'
  },
  {
    id: 'INT-02',
    name: 'Procurement & E-Procurement (SCM)',
    code: 'PROCUREMENT',
    category: 'Pengadaan & Logistik',
    status: 'BRIDGE',
    type: 'Bridge Connector',
    description: 'Integrasi master data rekanan vendor, status kualifikasi SBU/IUP, dan tracking PO/SPK.',
    endpoint: 'https://eproc.nusantara-energi.internal/bridge',
    lastSync: 'Hari ini (2026-09-30 13:15)',
    latency: '48ms',
    itemsCount: '384 Rekanan'
  },
  {
    id: 'INT-03',
    name: 'Accounting & Financial Ledger (SAP ERP)',
    code: 'FINANCE_GL',
    category: 'Keuangan & Akuntansi',
    status: 'LIVE',
    type: 'RFC / Direct OData',
    description: 'Otomatisasi pengakuan nilai kontrak (PSAK 72), termin penagihan, retensi, uang muka, dan garansi bank.',
    endpoint: 'https://sap-gateway.nusantara-energi.internal/odata',
    lastSync: 'Baru saja (2026-09-30 15:25)',
    latency: '18ms',
    itemsCount: '1,892 Jurnal'
  },
  {
    id: 'INT-04',
    name: 'Cloud Document Management (DMS Vault)',
    code: 'CLOUD_DMS',
    category: 'Penyimpanan Terdistribusi',
    status: 'LIVE',
    type: 'S3-Compatible Object Store',
    description: 'Penyimpanan terenkripsi AES-256 dokumen penawaran lelang, sertifikat akta, dan bukti legalitas.',
    endpoint: 's3://vault.nusantara-energi.internal',
    lastSync: 'Baru saja (2026-09-30 15:40)',
    latency: '12ms',
    itemsCount: '4.2 TB Tersimpan'
  },
  {
    id: 'INT-05',
    name: 'Enterprise SSO & IAM (Azure AD)',
    code: 'AZURE_SSO',
    category: 'Keamanan & Autentikasi',
    status: 'LIVE',
    type: 'SAML 2.0 / OAuth2',
    description: 'Otentikasi terpusat karyawan perseroan dan penegakan kebijakan Multi-Factor Authentication (MFA).',
    endpoint: 'https://login.microsoftonline.com/nusantara-energi',
    lastSync: 'Real-time Aktif',
    latency: '15ms',
    itemsCount: 'Active Directory OK'
  }
];

export const initialErpEmployees = [
  {
    nik: 'EMP-0100',
    name: 'Toha, S.H., M.H.',
    email: 'tohalegal@gmail.com',
    department: 'Legal & Corporate Governance',
    title: 'General Counsel & Lead Legal Director',
    phone: '+62 811-987-100',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'ADMIN'
  },
  {
    nik: 'EMP-0101',
    name: 'Budi Santoso, S.H., LL.M.',
    email: 'admin@legal.local',
    department: 'Legal & Corporate Governance',
    title: 'Head of Legal & Compliance',
    phone: '+62 811-987-101',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'ADMIN'
  },
  {
    nik: 'EMP-0102',
    name: 'Siti Rahmawati, S.H., M.H.',
    email: 'siti.rahma@legal.local',
    department: 'Legal Department',
    title: 'Legal Operations Manager',
    phone: '+62 812-223-102',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'LEGAL MANAGER'
  },
  {
    nik: 'EMP-0103',
    name: 'Dimas Prasetyo, S.H.',
    email: 'dimas.prasetyo@legal.local',
    department: 'Commercial Legal',
    title: 'Senior Legal Counsel',
    phone: '+62 813-334-103',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'LEGAL COUNSEL'
  },
  {
    nik: 'EMP-0104',
    name: 'Anisa Maharani, S.H.',
    email: 'anisa.maharani@legal.local',
    department: 'Legal Department',
    title: 'Legal Specialist & Administrator',
    phone: '+62 814-445-104',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'LEGAL STAFF'
  },
  {
    nik: 'EMP-0105',
    name: 'Hendra Gunawan, S.T., M.B.A.',
    email: 'hendra.gunawan@company.local',
    department: 'Project Development & Procurement',
    title: 'VP Project Development',
    phone: '+62 815-556-105',
    workLocation: 'Head Office Jakarta - Lt. 22',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'REQUESTOR'
  },
  {
    nik: 'EMP-0106',
    name: 'Ir. Bambang Trihatmodjo',
    email: 'bambang.tri@board.local',
    department: 'Board of Directors',
    title: 'President Director',
    phone: '+62 811-000-106',
    workLocation: 'Executive Boardroom - Lt. 35',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'MANAGEMENT'
  },
  // Karyawan ERP Baru yang Belum Di-Onboard ke LMS:
  {
    nik: 'EMP-0107',
    name: 'Dr. Kevin Sanjaya, S.H., LL.M.',
    email: 'kevin.sanjaya@perusahaan.co.id',
    department: 'Legal & Corporate Governance',
    title: 'VP Corporate Affairs & Compliance',
    phone: '+62 812-778-107',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'LEGAL COUNSEL'
  },
  {
    nik: 'EMP-0108',
    name: 'Ratna Dewi, S.E., Ak., CA',
    email: 'ratna.dewi@perusahaan.co.id',
    department: 'Finance & Treasury',
    title: 'Head of Finance & Treasury',
    phone: '+62 813-889-108',
    workLocation: 'Head Office Jakarta - Lt. 20',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'REQUESTOR'
  },
  {
    nik: 'EMP-0109',
    name: 'Ir. Fajar Nugroho, M.T.',
    email: 'fajar.nugroho@perusahaan.co.id',
    department: 'Procurement & Supply Chain',
    title: 'General Manager Procurement & Contracts',
    phone: '+62 817-990-109',
    workLocation: 'Supply Chain Hub - Lt. 19',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'REQUESTOR'
  },
  {
    nik: 'EMP-0110',
    name: 'Maya Indah, S.H.',
    email: 'maya.indah@perusahaan.co.id',
    department: 'Litigation & Dispute Resolution',
    title: 'Senior Litigation Counsel',
    phone: '+62 818-112-110',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'LEGAL COUNSEL'
  },
  {
    nik: 'EMP-0111',
    name: 'Agus Wicaksono, S.T.',
    email: 'agus.wicaksono@perusahaan.co.id',
    department: 'EPC & Mining Operations',
    title: 'Project Director EPC Energi & Tambang',
    phone: '+62 819-223-111',
    workLocation: 'Site Project Morowali / Jakarta',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'REQUESTOR'
  },
  {
    nik: 'EMP-0112',
    name: 'Dewi Lestari, S.Psi., M.M.',
    email: 'dewi.lestari@perusahaan.co.id',
    department: 'Human Capital & Organization',
    title: 'VP People & Culture',
    phone: '+62 812-334-112',
    workLocation: 'Head Office Jakarta - Lt. 18',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'REQUESTOR'
  },
  {
    nik: 'EMP-0113',
    name: 'Ahmad Fauzi, S.Kom., CISA',
    email: 'ahmad.fauzi@perusahaan.co.id',
    department: 'Information Technology',
    title: 'Lead IT Security & System Auditor',
    phone: '+62 815-445-113',
    workLocation: 'Cyber Hub - Lt. 25',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'ADMIN'
  },
  {
    nik: 'EMP-0114',
    name: 'Rina Kusumastuti, S.H.',
    email: 'rina.kusuma@perusahaan.co.id',
    department: 'Legal Department',
    title: 'Contract Specialist & Licensor',
    phone: '+62 816-556-114',
    workLocation: 'Head Office Jakarta - Lt. 28',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'LEGAL STAFF'
  },
  {
    nik: 'EMP-0115',
    name: 'Ir. Suryo Pranoto, M.Sc.',
    email: 'suryo.pranoto@board.local',
    department: 'Board of Directors',
    title: 'Director of Business Development',
    phone: '+62 811-667-115',
    workLocation: 'Executive Boardroom - Lt. 35',
    status: 'ACTIVE_EMPLOYEE',
    defaultRole: 'MANAGEMENT'
  }
];

export const defaultSeedData = {
  users: initialUsers.map(u => ({
    ...u,
    nik: u.id.replace('USR-', 'EMP-010'),
    isErpSynced: true,
    erpSource: 'Workday HRIS',
    active: u.active !== undefined ? u.active : true
  })),
  erpEmployees: initialErpEmployees,
  requests: initialRequests,
  contracts: initialContracts,
  corporate: initialCorporate,
  licenses: initialLicenses,
  compliance: initialCompliance,
  disputes: initialDisputes,
  ldd: initialLDD,
  opinions: initialLegalOpinions,
  documents: initialDocuments,
  correspondence: initialCorrespondence,
  knowledge: initialKnowledge,
  templates: initialTemplates,
  clauses: initialClauses,
  activityLogs: initialActivityLogs,
  tenders: initialTenders,
  tenderVault: initialTenderVaultDocs,
  tenderBonds: initialTenderBonds,
  masterDocTypes: initialMasterDocTypes,
  masterSectors: initialMasterSectors,
  masterStages: initialMasterTenderStages,
  masterContractTypes: initialMasterContractTypes,
  rolesMatrix: initialRolesMatrix,
  approvalFlows: initialApprovalFlows,
  erpIntegrations: initialErpIntegrations,
  currentUser: initialUsers[0]
};

