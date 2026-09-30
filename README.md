# LMS TOHA Enterprise Legal Suite — Full Prototype Web

Aplikasi web prototipe penuh (*full prototype*) hasil reverse-engineering menyeluruh dari sistem produksi [https://lmstoha.ai.studio/](https://lmstoha.ai.studio/), dibangun menggunakan stack modern:
- **Frontend**: **Vue.js 3** (Composition API `<script setup>`) + **Vite 8**
- **Styling**: **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Penyimpanan (Storage)**: **Reactive LocalStorage Engine** (`storage.js`) dengan dataset asli lengkap (`originalData.json` / `seedData.js`)

---

## 🚀 Cara Menjalankan

Aplikasi telah siap dijalankan di folder `web-legal`:

```bash
cd web-legal
npm run dev
```
Akses aplikasi melalui browser: **`http://localhost:5173/`**

---

## 🏛️ Arsitektur & Daftar Lengkap 16 Modul Sistem

Sistem menggunakan layout navigasi **Bilah Sisi Kiri Otentik (Left Sidebar Navigation)** dengan 5 kelompok modul fungsional:

### 1. Menu Utama
- **Dashboard Eksekutif (`dashboard`)**:
  - 6 Kartu Metrik KPI Utama (Permintaan Aktif, SLA Overdue, Kontrak Aktif, Masa Siaga &le;30 hari, Kepatuhan Regulasi, Sengketa Aktif BANI).
  - *Urgent Contracts Watchlist* dengan kalkulasi sisa hari interaktif.
  - Kalender Agenda Sidang & Peristiwa Hukum 2026.
  - Pintasan ekspor ringkasan CSV.
- **Permintaan Legal / Legal Requests (`requests`)**:
  - Sentralisasi permohonan telaah kontrak, opini hukum, dan dukungan perizinan dari unit bisnis.
  - Multi-filter: Status (*Submitted, In Review, Completed, Overdue SLA*), Urgensi (*High, Medium, Low*), Jenis Permohonan.
  - Formulir pengajuan tiket baru.
  - Alur kerja penugasan PIC Legal Counsel internal.
  - Modal detail permohonan lengkap.
- **Manajemen Kontrak (`contracts`)**:
  - Register kontrak komprehensif grup holding (PPA, EPC, CSA, Sewa, Asuransi).
  - Lembar telaah detail kontrak 4 tab: Klausul Pokok, Termin Pembayaran & Denda, Riwayat Adendum, dan Pratinjau Dokumen PDF.
  - Formulir registrasi kontrak baru dengan validasi otomatis.
  - Ekspor berkas register format CSV.

### 2. Korporasi & Regulasi
- **Corporate Governance (`corporate`)**:
  - Tab Profil Korporat & Akta Pendirian, Notaris, serta SK Kemenkumham RI.
  - Buku Register Pemegang Saham & *Beneficial Ownership* (Struktur persentase dan nominal saham).
  - Susunan Direksi & Dewan Komisaris periode aktif.
  - Multi-entitas: PT Nusantara Energi (Holding), PT Nusantara Holdings Utama, PT Sinergi Tambang Gemilang.
- **Perizinan Berusaha / Licensing (`licensing`)**:
  - Inventarisasi izin OSS RBA, PB-UMKU, IUP Ketenagalistrikan & Pertambangan, SKKL AMDAL KLHK.
  - Pemantauan masa berlaku dan instansi penerbit (Kementerian ESDM, BKPM, KLHK, Kemenhub).
- **Kepatuhan Regulasi / Compliance (`compliance`)**:
  - Matriks kewajiban hukum mandatori berkala: Pelaporan LKPM BKPM, RKL-RPL Lingkungan Hidup, WLKP Ketenagakerjaan.
  - Status pemenuhan interaktif (*Compliant / Overdue / Upcoming*) dengan tombol ubah status langsung.

### 3. Perkara & Analisis
- **Dispute & Litigation (`disputes`)**:
  - Pengawasan perkara arbitrase BANI (No. 45021/I/ARB-BANI/2026), perkara perdata PN, dan sengketa PHI.
  - Estimasi eksposur nilai klaim finansial dan indikator tingkat risiko (*High / Medium*).
  - Kronologi tahapan persidangan terperinci.
- **Legal Due Diligence Workspace (`ldd`)**:
  - Uji tuntas hukum proyek investasi & akuisisi (e.g., *Akuisisi 60% Saham PT Java Solar Park*).
  - Checklist aspek legalitas interaktif dengan toggle status verifikasi (*OK / FLAG Red Flag / N/A*).
- **Legal Opinion (`opinions`)**:
  - Memorandum pendapat hukum korporasi (Batasan Asing PMA, Wanprestasi vs Force Majeure).
  - Pokok masalah yuridis, analisis peraturan perundang-undangan positif, kesimpulan & rekomendasi mitigasi.
  - Alur persetujuan (*Pending Approval &rarr; Approved by Head of Legal*).
  - Fitur cetak memorandum resmi.

### 4. Repositori & Dokumen
- **Dokumen Vault (`documents`)**:
  - Vault penyimpanan terenkripsi arsip asli perseroan (Akta, HGB/Sertifikat Tanah, Jaminan Bank, Polis Asuransi Proyek).
  - Klasifikasi kerahasiaan (*Strictly Confidential / Confidential*) dan pencatatan lokasi fisik lemari besi.
- **Surat Menyurat Legal (`correspondence`)**:
  - Register surat masuk & keluar, somasi hukum, surat kuasa khusus, dan nota dinas legal.
- **Database Regulasi & Preseden (`knowledge`)**:
  - Perpustakaan perundang-undangan sektoral: UU Perseroan Terbatas jo. UU Cipta Kerja, PP 5/2021 OSS, Permen ESDM 11/2021, Putusan MA No. 1234 K/Pdt/2023.
  - Pencarian kata kunci pasal dan ringkasan poin kritis.
- **Template Dokumen & Klausul Library (`templates`)**:
  - Perpustakaan klausul standar: Arbitrase BANI 2026, Ganti Rugi (*Indemnity*), *Force Majeure*, Kerahasiaan (NDA).
  - Template draf perjanjian baku (NDA Bilingual ID/EN, MoU Kemitraan Strategis).

### 5. Laporan & Sistem
- **Laporan Eksekutif (`reports`)**:
  - Visualisasi metrik penyelesaian SLA tiket legal (85-100%).
  - Total nilai komitmen kontrak portofolio.
  - Grafik distribusi jenis pekerjaan legal dan status kontrak.
  - Ekspor rekapitulasi data komprehensif.
- **Audit Activity Log (`activity`)**:
  - Jejak rekam audit terenkripsi mencatat pengguna, stempel waktu, modul, tipe aksi (*CREATE, EDIT, DELETE, SWITCH_ROLE, APPROVAL*), dan deskripsi.
- **Pengaturan Sistem & Matriks RBAC (`settings`)**:
  - Daftar 7 pengguna terdaftar lengkap dengan jabatan dan unit kerja.
  - Matriks otorisasi hak akses (*Role-Based Access Control*) 6 peran.
  - Tombol reset data simulasi default.

---

## 👥 Simulasi Matriks Peran (RBAC Role Switcher)

Pengguna dapat berpindah peran kapan saja melalui dropdown pada bilah header atas:
1. **ADMIN**: Akses penuh ke seluruh modul, pendaftaran data, modifikasi, dan penghapusan data.
2. **LEGAL MANAGER**: Wewenang operasional penuh, review permohonan, dan persetujuan legal opinion.
3. **LEGAL COUNSEL**: Penyusunan draf kontrak, penelaahan yuridis, penugasan permohonan legal.
4. **LEGAL STAFF**: Penanganan administrasi berkas, pendaftaran izin, dan pembaruan kepatuhan.
5. **REQUESTOR (Unit Bisnis)**: Hak akses khusus internal untuk mengajukan permohonan review (*Legal Requests*) dan membaca perpustakaan regulasi/template, tanpa akses ke modul privat korporat.
6. **MANAGEMENT (Direksi & Komisaris / BOD & BOC)**: Hak peninjauan eksekutif dan persetujuan, dengan proteksi pelarangan penghapusan arsip (*Audit Trail Preservation*).

---

## 🔍 Fitur Tambahan
- **Pencarian Global Cmd+K / Ctrl+K (`SearchModal.vue`)**: Pencarian instan melintasi berkas kontrak, permohonan tiket, regulasi undang-undang, dan berkas sengketa.
- **Laci Notifikasi Siaga & Kritis (`NotificationDrawer.vue`)**: Peringatan real-time kontrak mendekati kedaluwarsa (&le;7 hari dan &le;30 hari), SLA overdue, serta agenda sidang arbitrase BANI.
- **Umpan Balik Aksi Toast**: Notifikasi interaktif di sudut kanan bawah setiap kali ada perubahan data.
