# DOKUMEN SPESIFIKASI TEKNIS & PENAWARAN MODUL
## MODUL TAMBAHAN ERP: LEGAL MANAGEMENT SYSTEM (LMS) ENTERPRISE
**Integrasi Penuh Single Sign-On (SSO) & Master Data Karyawan ERP**

---

### INFORMASI DOKUMEN & RINGKASAN EKSEKUTIF

| Parameter | Deskripsi |
|---|---|
| **Nama Modul** | **Enterprise Legal Management System (LMS) Add-on** |
| **Tipe Pengadaan** | Modul Tambahan (Add-on Module) untuk ERP Eksisting |
| **Model Integrasi** | Single Sign-On (SSO OIDC / OAuth2 / SAML) + Sync User Directory ERP |
| **Arsitektur Frontend** | Vue.js 3, Tailwind CSS, Lucide Icons, Vite Architecture |
| **Penyimpanan Data** | Reactive State & Storage Layer + REST API Endpoint Ready |
| **Total Nilai Investasi** | **Rp 40.000.000,- (Empat Puluh Juta Rupiah)** *(Nett / All-In Implementation)* |
| **Masa Garansi & SLA** | 3 Bulan Free Support, Bug Fixing & Pendampingan UAT |

---

## 1. LATAR BELAKANG & TUJUAN INTEGRASI

Perusahaan telah memiliki infrastruktur ERP yang matang untuk tata kelola pengguna (*User Management*) dan Autentikasi Tunggal (*Single Sign-On / SSO*). Untuk melengkapi proses bisnis korporasi dalam aspek hukum, perlindungan risiko kontrak, kepatuhan perizinan, dan kualifikasi lelang tender, diimplementasikan modul **Legal Management System (LMS)** sebagai subsistem terintegrasi.

### Keuntungan Utama Integrasi dengan ERP:
1. **Single Identity (SSO)**: Pengguna tidak perlu mengingat kredensial baru. Akses modul legal langsung terafiliasi dengan akun login ERP.
2. **Role-Based Access Control (RBAC)**: Pemetaan hak akses (General Counsel, Legal Specialist, Contract Drafter, Auditor, Direksi) otomatis disinkronkan dari jabatan dan unit kerja di ERP HRIS.
3. **Audit Trail Terpusat**: Seluruh tindakan penambahan, pengubahan, approval, dan penghapusan dokumen legal tercatat dengan identitas resmi karyawan ERP.
4. **End-to-End Workflow**: Integrasi konversi proses bisnis, mulai dari tender yang dimenangkan langsung dikonversi menjadi Kontrak Korporasi pada modul legal dan ERP Keuangan.

---

## 2. DETAIL LENGKAP FITUR MODUL LEGAL (14 FITUR UTAMA)

Berikut adalah rincian fungsionalitas komprehensif dari modul Legal Management System:

```
┌─────────────────────────────────────────────────────────────────────────┐
│              EKOSISTEM ERP & SINGLE SIGN-ON (SSO) GATEWAY               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (OAuth2 / SAML / REST API Sync)
┌────────────────────────────────────▼────────────────────────────────────┐
│              LEGAL MANAGEMENT SYSTEM (LMS) ENTERPRISE                   │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Executive Dashboard & Analytics │  8. Legal Due Diligence (LDD)     │
│  2. Legal Service Request (Ticketing)│  9. Legal Opinions & Kajian Hukum │
│  3. Contract Lifecycle (CLM)        │ 10. Template & Klausul Baku       │
│  4. Bank Dokumen Kualifikasi Tender │ 11. Digital Legal & Tender Vault  │
│  5. Perizinan OSS, PB-UMKU & IUP    │ 12. Register Surat Masuk/Keluar   │
│  6. Kepatuhan & Audit (Compliance)  │ 13. JDIH & Regulasi Hukum         │
│  7. Sengketa & Litigasi Korporasi   │ 14. RBAC & ERP Activity Log       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### FITUR 1: Executive Dashboard & Legal Intelligence Analytics
* **Deskripsi**: Pusat pemantauan visual metrik kesehatan legal perusahaan secara real-time.
* **Fungsionalitas**:
  * Ringkasan Total Kontrak Aktif, Total Nilai Komitmen Finansial, dan Peringatan Kontrak Segera Kedaluwarsa (*Expiring in 30/60/90 days*).
  * Metrik Kesiapan Dokumen Kualifikasi Lelang (*Tender Readiness Score*).
  * Pemantauan Beban Perkara Sengketa (*Dispute Value Exposure*) berdasarkan pengadilan/BANI.
  * Grafik status kepatuhan berkala (LKPM, RKL-RPL, WLKP) dengan indikator risiko warna (*High/Medium/Low*).
  * Kalender Agenda Sidang & Batas Waktu Pelaporan Legal.

---

### FITUR 2: Manajemen Permohonan Layanan Hukum (Legal Service Request & SLA)
* **Deskripsi**: Sistem tiket internal bagi seluruh divisi/unit bisnis di ERP untuk mengajukan kebutuhan legal.
* **Fungsionalitas**:
  * Formulir pengajuan permohonan kajian kontrak, penyusunan somasi, opini hukum, atau verifikasi mitra.
  * Penomoran tiket otomatis (`REQ-2026-XXXX`) dengan penentuan skala prioritas (*Urgent*, *High*, *Medium*, *Normal*).
  * Penugasan otomatis / manual PIC Legal Counsel yang menangani.
  * Pelacakan Service Level Agreement (SLA) waktu penyelesaian (misal 3 hari kerja).
  * Integrasi status: *Submitted*, *Under Review*, *Drafting*, *Approved*, *Completed*.

---

### FITUR 3: Contract Lifecycle Management (CLM) & Manajemen Adendum
* **Deskripsi**: Tata kelola siklus hidup kontrak bisnis mulai dari draf, penelaahan, approval, hingga masa berakhir.
* **Fungsionalitas**:
  * Registrasi kontrak lengkap: Nomor Kontrak, Lawan Transaksi (*Counterparty*), Tipe Kontrak (PPA, EPC, Supply, Jasa, Sewa, NDA), Nilai Kontrak (IDR/USD), Masa Berlaku.
  * Fitur **Edit Kontrak** interaktif dengan pembaruan klausul kewajiban material dan termin pembayaran (*payment terms*).
  * Manajemen **Adendum Kontrak Dinamis**: Pencatatan riwayat addendum perpanjangan waktu, perubahan ruang lingkup (*scope of work*), atau eskalasi nilai.
  * Fitur **Hapus Kontrak** dengan proteksi dialog konfirmasi dan audit trail.
  * **Export Data Kontrak**: Unduh rekapitulasi seluruh register kontrak ke format Excel/CSV untuk audit eksternal/keuangan.

---

### FITUR 4: Bank Dokumen Kualifikasi Pengadaan Lelang (Tender Management Module)
* **Deskripsi**: Modul khusus untuk mempercepat keikutsertaan lelang pengadaan (BUMN, Swasta, Pemerintah/LKPP).
* **Fungsionalitas**:
  * Registrasi paket lelang berdasarkan sektor: **Konstruksi**, **Pertambangan**, **Energi/Ketenagalistrikan**, **Migas**, dan **Umum**.
  * Matriks **Gap Analysis Dokumen Kualifikasi**: Sistem mendeteksi otomatis berkas yang kurang (*KURANG* / *KEDALUWARSA*) vs *TERPENUHI*.
  * **Evaluasi Go / No-Go**: Perhitungan skor kelayakan 6 dimensi (Fit, Capacity, Commercial, Risk, Cashflow, Technical).
  * **Pricing & Analisis HPS**: Peringatan otomatis jika harga penawaran di bawah 80% HPS (kewajiban Jaminan Pelaksanaan 5% HPS).
  * **4-Gate Review Approval Workflow** (Teknis, Finansial, Legal, Direksi).
  * **Enkripsi Kunci Submission (Lock Package)** dengan hash integritas SHA-256 anti-tampering.
  * Fitur **Konversi Otomatis**: Tender yang dimenangkan (*WON*) langsung dikonversi menjadi draf Kontrak Korporasi aktif.
  * Ekspor Laporan Gap Analysis Dokumen Tender ke CSV.

---

### FITUR 5: Manajemen Perizinan Berusaha (OSS RBA, PB-UMKU & IUP)
* **Deskripsi**: Pengelolaan seluruh izin operasional, lingkungan, ketenagalistrikan, dan pertambangan perseroan.
* **Fungsionalitas**:
  * Pencatatan izin: NIB Berbasis Risiko, PB-UMKU, IUP Operasional, SLO Ketenagalistrikan, Izin Lingkungan (Amdal/UKL-UPL).
  * Pemantauan instansi penerbit (Kementerian ESDM, BKPM, KLHK, PUPR, Pemprov).
  * Fitur **Edit Izin**: Perpanjangan tanggal jatuh tempo, update nomor SK, dan perubahan kewajiban pelaporan berkala.
  * Fitur **Hapus Izin** dengan pencatatan alasan penghapusan.
  * Notifikasi visual status masa berlaku (*Aktif*, *Segera Habis < 60 Hari*, *Kedaluwarsa*).

---

### FITUR 6: Matriks Kepatuhan Hukum & Audit Regulasi (Compliance Tracker)
* **Deskripsi**: Pengawasan kepatuhan mandatori terhadap regulasi perundang-undangan Republik Indonesia.
* **Fungsionalitas**:
  * Pendaftaran kewajiban: Pelaporan LKPM BKPM triwulanan/semesteran, RKL-RPL Semesteran KLHK, WLKP Disnaker, Pelaporan RKAB Minerba.
  * Fitur **Tambah Kewajiban Baru** dengan penentuan PIC dan tingkat risiko hukum (*Low/Medium/High*).
  * Fitur **Edit & Update Status Kepatuhan** (*UPCOMING*, *SUBMITTED*, *VERIFIED*, *OVERDUE*).
  * Fitur **Hapus Kewajiban Kepatuhan**.
  * Filter multi-kategori dan ringkasan persentase ketaatan hukum perseroan.

---

### FITUR 7: Manajemen Sengketa, Litigasi & Arbitrase (Disputes & Litigation)
* **Deskripsi**: Sentralisasi berkas perkara hukum yang dihadapi perusahaan, baik perdata, pidana, tata usaha, maupun arbitrase.
* **Fungsionalitas**:
  * Registrasi kasus sengketa vs pihak lawan (*Opponent*), Kuasa Hukum internal/eksternal (*Legal Counsel*), dan Lembaga Pengadil (PN/PT/MA/BANI/SIAC).
  * Nilai sengketa & estimasi eksposur kerugian (*Claim Exposure Amount*).
  * Fitur **Edit Perkara**: Update tanggal sidang berikutnya, pergantian lawyer, eskalasi risiko, dan nomor register perkara.
  * Fitur **Hapus Perkara Sengketa**.
  * Timeline riwayat persidangan, eksepsi, replik, duplik, putusan sela, hingga putusan berkekuatan hukum tetap (*Inkracht*).

---

### FITUR 8: Legal Due Diligence (LDD) & M&A Audit Checklist
* **Deskripsi**: Toolkit audit kepatuhan hukum untuk transaksi akuisisi, merger, joint venture, atau audit internal unit bisnis.
* **Fungsionalitas**:
  * Pembuatan proyek audit LDD baru (*Target Company, Lead Counsel, Target Deadline*).
  * Checklist audit multi-aspek: Korporasi (Akta & AHU), Perizinan Dasar, Kontrak Material (PPA/EPC), Ketenagakerjaan (BPJS & PP), Sengketa Aktif, dan Perpajakan.
  * Fitur **Interaktif Toggle Status Butir Audit** (`OK` / `FLAG` Temuan Risiko / `N/A`).
  * Fitur **Tambah Butir Audit Kustom** per proyek LDD.
  * Fitur **Hapus Proyek LDD**.

---

### FITUR 9: Penyusunan & Alur Persetujuan Legal Opinion (Kajian Hukum)
* **Deskripsi**: Pembuatan nota kajian hukum komprehensif bagi Direksi dan Manajemen.
* **Fungsionalitas**:
  * Modul penyusunan terstruktur: Latar Belakang Masalah (*Background*), Dasar Hukum & Analisis Yuridis (*Legal Analysis*), Kesimpulan (*Conclusion*), dan Rekomendasi Mitigasi (*Recommendation*).
  * Form pembuatan opini baru dan fitur **Edit Kajian Opini**.
  * Alur persetujuan (*Approval Workflow*): *DRAFT* ➔ *UNDER_REVIEW* ➔ *APPROVED* (oleh General Counsel / Head of Legal).
  * Fitur **Hapus Opini Hukum**.

---

### FITUR 10: Perpustakaan Klausul Standar & Interactive Template Generator
* **Deskripsi**: Standardisasi naskah kontrak dan klausul proteksi hukum perusahaan.
* **Fungsionalitas**:
  * **Klausul Library**: Koleksi klausul baku teruji (Arbitrase BANI, Batasan Tanggung Jawab / *Limitation of Liability*, *Force Majeure*, Kerahasiaan / NDA, *Indemnity*, Terminasi Dini).
  * Fitur **Tambah & Edit Klausul Standar Baru** serta tombol salin instan (*Copy to Clipboard*).
  * Fitur **Template Generator Interaktif**: Memilih template surat/kontrak, mengisi parameter dinamis (*Merge Fields*), dan menghasilkan draf final siap pakai.
  * Fitur **Unggah Template Berkas Kustom** (DOCX/PDF) beserta pratinjau teks.

---

### FITUR 11: Digital Legal & Tender Vault (Arsip Berkas Terenkripsi)
* **Deskripsi**: Repositori arsip digital terpusat dengan klasifikasi ganda (Arsip Korporasi & Dokumen Kualifikasi Lelang).
* **Fungsionalitas**:
  * **Arsip Dokumen Korporasi**: Akta Pendirian, Akta Perubahan Notaris, SK Kemenkumham, Sertifikat Tanah HGB/SHM, Polis Asuransi Proyek.
  * **Bank Dokumen Kualifikasi**: NIB, SBU LPJK, ISO 9001/14001/45001, KSWP Valid, Laporan Audit KAP Independen.
  * Fitur **Upload Berkas Komputer**, **Edit Metadata Dokumen**, **Unduh Salinan Digital**, dan **Hapus Dokumen**.
  * Penautan langsung berkas Vault ke paket lelang tender yang aktif.

---

### FITUR 12: Buku Register Surat & Korespondensi Legal (In/Out Letters)
* **Deskripsi**: Pencatatan digital seluruh korespondensi resmi, somasi, surat peringatan, dan surat masuk kementerian.
* **Fungsionalitas**:
  * Register Surat Keluar (*Outgoing*) dan Surat Masuk (*Incoming*).
  * Penomoran surat resmi korporasi otomatis (`001/NE-LEG/COR/X/2026`).
  * Pencatatan pengirim, penerima, perihal (*subject*), tenggat waktu tindak lanjut (*deadline*), dan lampiran berkas PDF.
  * Fitur **Tambah, Edit, dan Hapus Pencatatan Surat**.

---

### FITUR 13: Database Regulasi Positif & Yurisprudensi (JDIH Knowledge Base)
* **Deskripsi**: Basis pengetahuan hukum sektoral yang dapat diakses seluruh tim legal perseroan.
* **Fungsionalitas**:
  * Pencatatan Undang-Undang, Peraturan Pemerintah (PP), Peraturan Menteri (ESDM, BKPM, KLHK, Kemenaker), serta Putusan Mahkamah Agung.
  * Fitur **Tambah Regulasi Baru** & **Edit Regulasi** (Nomor SK, Ringkasan Ketentuan, Poin Pasal Kritis, Tautan URL JDIH Resmi).
  * Fitur **Hapus Regulasi** dan pencarian kata kunci cepat berdasarkan sektor industri.

---

### FITUR 14: Integrasi Role-Based Access Control (RBAC) & Audit Trail ERP
* **Deskripsi**: Pengamanan hak akses berbasis matriks wewenang ERP dan pencatatan riwayat aktivitas tanpa celah.
* **Fungsionalitas**:
  * Matriks hak akses detail (13 kapabilitas granular: *Buat Request, Review Kontrak, Approve Kontrak, Tanda Tangan, Kelola Tender, Approve Bid, Kelola Sengketa, Akses Dokumen Rahasia, Export Laporan, Kelola User & Pengaturan*).
  * Dukungan peran standar (*Superadmin, General Counsel, Senior Legal Counsel, Contract Drafter, Compliance Officer, Board of Directors, Auditor, Unit Pengaju ERP*) serta pembuatan **Custom Role**.
  * **Activity Logs Audit Trail**: Mencatat setiap aksi `CREATE`, `UPDATE`, `DELETE`, `APPROVE`, `ATTACH_FILE`, `EXPORT` lengkap dengan timestamp, ID entitas, dan nama akun pengguna ERP.

---

## 3. ARSITEKTUR INTEGRASI SINGLE SIGN-ON (SSO) & ERP

Modul Legal Management System dirancang dengan pendekatan modular (*loose-coupling, high cohesion*) sehingga dapat langsung terhubung ke ERP yang telah Anda miliki:

```
┌────────────────────────────────────────────────────────┐
│               SISTEM ERP EKSISTING                     │
│  - User Directory & HRIS Database (Karyawan & Jabatan) │
│  - SSO Server (OAuth2 / OpenID Connect / SAML 2.0)     │
│  - Module Gateway & API Central Router                 │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │ Token Auth (Bearer / JWT) │
              │ Sync Jabatan & Email      │
              ▼                           ▼
┌────────────────────────────────────────────────────────┐
│         MODUL LEGAL MANAGEMENT SYSTEM (LMS)            │
│  - Auto Role Mapping berdasarkan Dept & Jabatan ERP    │
│  - Auto Tenant / Company Entity Selection              │
│  - Persistent Audit Trail dengan Identitas ERP         │
└────────────────────────────────────────────────────────┘
```

### Mekanisme Autentikasi:
1. Pengguna masuk ke Portal Utama ERP menggunakan kredensial perusahaan.
2. Ketika memilih menu **"Legal Management System"**, ERP mengirimkan *Auth Token (JWT/OAuth2 Session)*.
3. Modul Legal memvalidasi token, mencocokkan email/NIK dengan database master, dan menerapkan hak akses (RBAC) secara instan tanpa login ulang.

---

## 4. PENAWARAN BIAYA & RINCIAN INVESTASI

### Total Nilai Investasi: **Rp 40.000.000,- (Empat Puluh Juta Rupiah)**

| No | Komponen Pekerjaan & Deliverables | Nilai Investasi (IDR) |
|:--:|---|:---:|
| **1** | **Lisensi Source Code & Modul Penuh LMS Enterprise**<br>• Seluruh 14 Sub-Modul Fitur Legal lengkap & responsive UI<br>• Database Storage Schema, State Management & Validasi Form | Rp 18.000.000,- |
| **2** | **Konfigurasi & Integrasi Single Sign-On (SSO) ERP**<br>• Integrasi protokol OAuth2/OIDC/SAML ke Identity Provider ERP<br>• Sinkronisasi Data Karyawan (HRIS Directory) & Role Mapping Otomatis | Rp 8.000.000,- |
| **3** | **Setup Environment, Deployment & Database Seeding**<br>• Instalasi & integrasi ke server aplikasi ERP<br>• Seeding data awal (Klausul BANI/FIDIC, Master Sektor, Regulasi JDIH, Matriks Izin) | Rp 6.000.000,- |
| **4** | **Testing, Quality Assurance & UAT (User Acceptance Testing)**<br>• Uji fungsional seluruh alur CRUD & Workflow Approval<br>• Uji keamanan autentikasi SSO & proteksi data vault | Rp 4.000.000,- |
| **5** | **Dokumentasi Teknis, Panduan Pengguna & Pelatihan (Training)**<br>• Manual Book Admin & User Guide (PDF)<br>• Sesi pelatihan daring / luring untuk Tim Legal & Admin ERP | Rp 2.000.000,- |
| **6** | **Garansi, Pemeliharaan & SLA Support (3 Bulan)**<br>• Pendampingan pasca Go-Live, Bug Fixing & Konsultasi Teknis | Rp 2.000.000,- |
| **TOTAL** | **INVESTASI KESELURUHAN (ALL-IN)** | **Rp 40.000.000,-** |

---

## 5. JADWAL PELAKSANAAN & TIMELINE IMPLEMENTASI

Total durasi pengerjaan dan integrasi diestimasikan selama **4 (Empat) Minggu**:

| Minggu | Tahapan Kerja | Target Output |
|:---:|---|---|
| **Minggu 1** | • Analisis spesifikasi SSO ERP eksisting<br>• Penyesuaian skema autentikasi & Role Mapping | Dokumen Konfigurasi SSO disepakati |
| **Minggu 2** | • Integrasi modul frontend & API backend SSO<br>• Setup environment staging / deployment | Modul terpasang di server staging |
| **Minggu 3** | • Database initial seeding & migrasi data legal awal<br>• Pelaksanaan User Acceptance Testing (UAT) bersama Tim Legal | Berita Acara UAT & Penyesuaian Feedback |
| **Minggu 4** | • Pelatihan Pengguna (*User Training Session*)<br>• Go-Live ke Production Environment & Serah Terima | Modul aktif di Production & BAST diterbitkan |

---

## 6. SERVICE LEVEL AGREEMENT (SLA) & GARANSI

* **Masa Garansi**: 90 (Sembilan Puluh) hari kalender sejak tanggal penandatanganan Berita Acara Serah Terima (BAST).
* **Waktu Respon Penanganan Gangguan (Support SLA)**:
  * **Kritis (Sistem Down / SSO Gagal)**: Respon maksimal 1 jam, resolusi maksimal 6 jam.
  * **Mayor (Fungsi Modul Terkendala)**: Respon maksimal 2 jam, resolusi maksimal 12 jam.
  * **Minor (Pertanyaan / Penyesuaian Minor)**: Respon maksimal 4 jam, resolusi 1 hari kerja.
* **Hak Milik Source Code**: Source code modul diserahkan penuh kepada klien tanpa biaya royalti bulanan/tahunan (*Perpetual License*).

---

## 7. KETENTUAN PEMBAYARAN (TERMIN)

Pembayaran dilakukan secara bertahap melalui transfer bank resmi dengan skema termin sebagai berikut:

| Termin | Persentase | Nilai (IDR) | Syarat & Kondisi Penagihan |
|:---:|:---:|:---:|---|
| **Termin I (DP)** | 40% | Rp 16.000.000,- | Saat penandatanganan Perjanjian Kerja Sama / SPK |
| **Termin II (UAT)** | 40% | Rp 16.000.000,- | Setelah integrasi SSO selesai & lulus uji coba UAT |
| **Termin III (Final)** | 20% | Rp 8.000.000,- | Setelah Go-Live, Training selesai & penandatanganan BAST |
| **TOTAL** | **100%** | **Rp 40.000.000,-** | *(Empat Puluh Juta Rupiah)* |

---

### LEMBAR PERSETUJUAN & KONFIRMASI

Dokumen ini disusun sebagai spesifikasi teknis dan penawaran resmi pengadaan Modul Tambahan **Legal Management System (LMS)** untuk sistem ERP terintegrasi Single Sign-On (SSO).

| Disiapkan Oleh, | Disetujui Oleh, |
| :---: | :---: |
| <br><br><br>__________________________<br>**Tim Pengembang / Solution Architect** | <br><br><br>__________________________<br>**Direksi / Tim Manajemen ERP** |
