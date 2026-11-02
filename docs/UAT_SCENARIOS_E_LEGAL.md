# PANDUAN SKENARIO UAT (USER ACCEPTANCE TESTING)
## ELegal Enterprise Legal Suite
**Target Pelaksanaan:** Uji Coba Mingguan per Sub-MVP (Minggu 1 s/d 4)  
**Tujuan:** Memvalidasi kesesuaian fungsionalitas sistem dengan kebutuhan pengguna akhir (Key Users) sebelum dinyatakan Lulus (*Accepted*) dan siap *Go-Live*.

---

## 1. STRUKTUR PERAN PENGUJI (TESTERS)

| Kode Peran | Nama Peran di Sistem | Deskripsi Tanggung Jawab Pengujian |
|:---:|---|---|
| **TEST-01** | **General Counsel / Kepala Legal** | Pengujian alur otorisasi approval, pembagian tugas PIC, dan monitoring risiko. |
| **TEST-02** | **Legal Counsel / Staff Legal** | Pengujian telaah draf, registrasi kontrak, input perizinan, perkara, dan template. |
| **TEST-03** | **Requestor (Unit Bisnis ERP)** | Pengujian pengajuan tiket permohonan dan pelacakan status SLA. |
| **TEST-04** | **Auditor / Direksi** | Pengujian *read-only access*, KPI Dashboard, dan ekspor laporan kepegawaian/keuangan. |

---

## 2. SKENARIO PENGUJIAN PER SUB-MVP

```
SUB-MVP 1 (Hari 7)           SUB-MVP 2 (Hari 14)          SUB-MVP 3 (Hari 21)          SUB-MVP 4 (Hari 28)
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ UAT Minggu 1:        │     │ UAT Minggu 2:        │     │ UAT Minggu 3:        │     │ UAT Minggu 4:        │
│ Intake & Kontrak     │────►│ Tata Kelola & Somasi │────►│ Sengketa & Kepatuhan │────►│ Dashboard & Go-Live  │
│ (TC-01 s/d TC-05)    │     │ (TC-06 s/d TC-09)    │     │ (TC-10 s/d TC-13)    │     │ (TC-14 s/d TC-17)    │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘     └──────────────────────┘
```

---

### 🔹 SUB-MVP 1: Foundation, Intake & Core Operations (UAT Minggu 1)

#### Kasus Uji UAT-TC-01: Autentikasi SSO & Multi-Entity Switcher
* **Peran:** All Testers
* **Langkah Uji:**
  1. Buka aplikasi ELegal melalui portal SSO ERP.
  2. Periksa nama pengguna dan peran yang terdeteksi di sudut kanan atas.
  3. Buka dropdown perseroan di header, pilih *"PT Sinergi Tambang Gemilang"*.
* **Hasil yang Diharapkan:** Sesi aktif terhubung otomatis tanpa login ulang. Data yang tampil di layar langsung terfilter khusus untuk anak perusahaan yang dipilih.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-02: Pengajuan Tiket Permohonan Telaah Kontrak
* **Peran:** TEST-03 (Requestor Unit Bisnis)
* **Langkah Uji:**
  1. Masuk ke modul **Permintaan Legal (`requests`)**.
  2. Klik tombol **"+ Buat Permintaan"**.
  3. Isi form: Judul permohonan, Urgensi (*High*), Batas Waktu, Lampirkan draf PDF (ukuran 2 MB).
  4. Klik **"Kirim Tiket"**.
* **Hasil yang Diharapkan:** Tiket terbit dengan nomor unik `REQ-2026-XXXX`. Muncul timer hitung mundur SLA (misal 3 hari kerja). Status awal `SUBMITTED`.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-03: Penugasan PIC Legal Counsel & Alur SLA
* **Peran:** TEST-01 (Kepala Legal) & TEST-02 (Staff Legal)
* **Langkah Uji:**
  1. Kepala Legal membuka tiket `REQ-2026-XXXX` yang baru masuk.
  2. Klik tombol **"Tugaskan PIC"**, pilih Legal Counsel yang bertugas.
  3. Staff Legal login, membuka tiket tersebut, dan mengubah status menjadi `IN_REVIEW`.
* **Hasil yang Diharapkan:** Nama PIC langsung tersemat di kartu tiket. Email/notifikasi in-app terkirim ke staf terkait. Status tiket terupdate *real-time*.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-04: Registrasi Kontrak Baru & Unggah Berkas ke Vault
* **Peran:** TEST-02 (Staff Legal)
* **Langkah Uji:**
  1. Masuk ke modul **Manajemen Kontrak (`contracts`)**.
  2. Klik **"+ Kontrak Baru"**.
  3. Isi form: Nomor Kontrak, Mitra Rekanan, Tanggal Mulai, Tanggal Berakhir, Nilai Kontrak (Rp 15.000.000.000,-), dan unggah berkas PDF final bertandatangan.
  4. Klik **"Simpan Kontrak"**.
* **Hasil yang Diharapkan:** Data kontrak muncul di tabel register. Berkas PDF tersimpan otomatis di *Digital Vault* dan dapat dipratinjau langsung di tab *"Dokumen"*.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-05: Penambahan Adendum Dinamis & Ekspor CSV
* **Peran:** TEST-02 (Staff Legal)
* **Langkah Uji:**
  1. Buka detail kontrak yang baru dibuat.
  2. Buka tab *"Riwayat Adendum"*, klik **"+ Tambah Adendum"**.
  3. Masukkan perpanjangan masa berlaku 1 tahun dan eskalasi nilai Rp 2.000.000.000,-.
  4. Kembali ke daftar kontrak, klik **"Ekspor CSV"**.
* **Hasil yang Diharapkan:** Riwayat adendum tercatat urut. Berkas CSV berhasil diunduh dan karakter formula (`=`, `+`, `@`) dinetralisir dengan aman.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

---

### 🔹 SUB-MVP 2: Corporate Governance, Licensing & Legal Drafting (UAT Minggu 2)

#### Kasus Uji UAT-TC-06: Manajemen Akta & Daftar Pemegang Saham (*Cap Table*)
* **Peran:** TEST-01 & TEST-02
* **Langkah Uji:**
  1. Buka modul **Corporate Governance (`corporate`)**.
  2. Periksa rincian Akta Pendirian, Nomor AHU Kemenkumham, dan susunan Direksi.
  3. Tambahkan 1 pemegang saham baru dengan porsi 15%.
* **Hasil yang Diharapkan:** Sistem otomatis menghitung ulang total persentase saham (*Cap Table*) menjadi total 100%.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-07: Logika Peringatan Masa Berlaku Izin Usaha (OSS RBA/IUP)
* **Peran:** TEST-02 (Staff Legal)
* **Langkah Uji:**
  1. Buka modul **Perizinan Berusaha (`licensing`)**.
  2. Daftarkan izin baru dengan tanggal kedaluwarsa 20 hari dari hari ini.
  3. Gunakan filter status *"Masa Kritis $\le$ 30 Hari"*.
* **Hasil yang Diharapkan:** Izin tersebut otomatis ditandai dengan **Badge Merah (Kritis)** dan tersaring akurat pada filter masa siaga.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-08: Generator Draf Somasi Otomatis Berbasis Variabel
* **Peran:** TEST-02 (Staff Legal)
* **Langkah Uji:**
  1. Masuk ke modul **Template & Klausul (`templates`)**.
  2. Pilih template *"Somasi Pertama Wanprestasi"*, klik **"Gunakan Template"**.
  3. Isi variabel nama vendor wanprestasi, nomor kontrak acuan, dan nilai kerugian.
  4. Periksa panel pratinjau surat di sebelah kanan.
* **Hasil yang Diharapkan:** Teks surat somasi terisi otomatis secara *real-time* tanpa ada placeholder yang tertinggal (`{{...}}`). Tombol unduh/salin berfungsi.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-09: Pencatatan Korespondensi & Deadline Somasi
* **Peran:** TEST-02 (Staff Legal)
* **Langkah Uji:**
  1. Buka modul **Korespondensi (`correspondence`)**.
  2. Daftarkan surat keluar somasi dengan tenggat waktu jawaban 7 hari kerja.
* **Hasil yang Diharapkan:** Sistem mencatat tanggal batas akhir somasi dan menampilkan status *Waiting Response*.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

---

### 🔹 SUB-MVP 3: Compliance, Disputes & Legal Analysis (UAT Minggu 3)

#### Kasus Uji UAT-TC-10: Matriks Kepatuhan Wajib Lapor (LKPM / Lingkungan)
* **Peran:** TEST-02 (Compliance Officer / Staff Legal)
* **Langkah Uji:**
  1. Buka modul **Kepatuhan Regulasi (`compliance`)**.
  2. Pilih kewajiban *"Pelaporan LKPM Triwulan IV"*.
  3. Ubah status dari `IN_PROGRESS` menjadi `COMPLIANT` dan unggah Bukti Tanda Terima (BTE).
* **Hasil yang Diharapkan:** Status kepatuhan berubah hijau dan grafik kepatuhan perseroan otomatis naik.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-11: Register Perkara Litigasi & Kalkulasi Eksposur Sengketa
* **Peran:** TEST-01 & TEST-02
* **Langkah Uji:**
  1. Buka modul **Sengketa & Litigasi (`disputes`)**.
  2. Masukkan perkara arbitrase BANI baru dengan nilai tuntutan Rp 18.500.000.000,-.
  3. Tambahkan jadwal sidang berikutnya.
* **Hasil yang Diharapkan:** Total *Dispute Value Exposure* bertambah sesuai nominal perkara. Jadwal sidang tercatat di kalender hukum.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-12: Penyusunan Kajian Opini Hukum Format 6 Bab
* **Peran:** TEST-02 (Drafter) & TEST-01 (Kepala Legal)
* **Langkah Uji:**
  1. Masuk ke modul **Legal Opinions (`opinions`)**.
  2. Isi kajian hukum lengkap 6 bab (Latar Belakang s/d Rekomendasi Mitigasi).
  3. Ajukan ke Kepala Legal untuk mendapatkan paraf persetujuan (*Endorsement*).
* **Hasil yang Diharapkan:** Draf terkunci rapi, tercantum riwayat paraf penelaah, dan siap dicetak menjadi naskah legal memo resmi.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-13: Audit Uji Tuntas (LDD) 6 Pilar
* **Peran:** TEST-02 (Staff Legal)
* **Langkah Uji:**
  1. Masuk ke modul **Legal Due Diligence (`ldd`)**.
  2. Buat proyek audit mitra baru, periksa checklist 6 pilar (*Corporate, Assets, Contracts, Labor, Permits, Disputes*).
  3. Beri tanda `FLAG` pada pilar izin lingkungan yang belum lengkap.
* **Hasil yang Diharapkan:** Muncul indikator *Red Flag Alert* yang merekomendasikan penambahan klausul ganti rugi (*indemnity*).
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

---

### 🔹 SUB-MVP 4: Executive Intelligence, Audit Trail & Go-Live (UAT Minggu 4)

#### Kasus Uji UAT-TC-14: Sinkronisasi Metrik Riil Dashboard Eksekutif
* **Peran:** TEST-04 (Direksi / Auditor)
* **Langkah Uji:**
  1. Buka modul **Dashboard (`dashboard`)**.
  2. Bandingkan angka di 6 Kartu KPI dengan data riil pada modul Kontrak, Tiket, dan Sengketa.
* **Hasil yang Diharapkan:** Seluruh angka (Total Kontrak Aktif, Overdue SLA, Expiry $\le 30$ hari, Eksposur Sengketa BANI) 100% cocok dengan data transaksi.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-15: Rekapitulasi Portofolio Lintas Anak Perusahaan
* **Peran:** TEST-04 (Direksi / Auditor)
* **Langkah Uji:**
  1. Masuk ke modul **Laporan (`reports`)**.
  2. Filter berdasarkan kelompok holding dan periode tahun berjalan.
  3. Klik cetak ringkasan eksekutif.
* **Hasil yang Diharapkan:** Laporan menyajikan sebaran risiko, portofolio nilai komitmen rupiah, dan status izin secara komprehensif.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-16: Pengujian Perekaman Jejak Audit (Audit Trail)
* **Peran:** TEST-01 (Superadmin / Kepala Legal)
* **Langkah Uji:**
  1. Lakukan aksi hapus salah satu draf kontrak atau edit izin usaha.
  2. Buka modul **Audit Trail (`activity`)**.
* **Hasil yang Diharapkan:** Aksi tersebut tercatat detail: Siapa nama user, peran, waktu jam:menit:detik, modul, dan deskripsi perubahan yang dilakukan.
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

#### Kasus Uji UAT-TC-17: Proteksi Hak Akses (RBAC Enforcement)
* **Peran:** TEST-03 (Requestor Unit Bisnis)
* **Langkah Uji:**
  1. Login sebagai user dengan peran `REQUESTOR`.
  2. Coba akses menu Pengaturan Sistem (`settings`) atau coba akses tombol hapus pada modul Kontrak.
* **Hasil yang Diharapkan:** Tombol hapus tidak tersedia / disabled. Halaman pengaturan terblokir dengan peringatan hak akses ditolak (*HTTP 403 Forbidden*).
* **Hasil Pengujian:** [ ] Lulus (Pass) &nbsp;&nbsp; [ ] Gagal (Fail)

---

## 3. BERITA ACARA HASIL UJI COBA (UAT SIGN-OFF SHEET)

Berdasarkan seluruh rangkaian skenario pengujian yang telah dilaksanakan pada tanggal **28 November 2026**, PARA PIHAK menyatakan bahwa sistem **ELegal Enterprise Legal Suite (web-legal)** untuk ruang lingkup **Sub-MVP 1 s/d Sub-MVP 4**:

[ &nbsp; ] **DITERIMA TANPA CATATAN (Lulus Penuh)**  
[ &nbsp; ] **DITERIMA DENGAN CATATAN MINOR (Perbaikan selesai sebelum Go-Live)**  
[ &nbsp; ] **DITOLAK / BUTUH PENGUJIAN ULANG**

Catatan Evaluasi / Temuan Minor:
__________________________________________________________________________________________
__________________________________________________________________________________________

| Disiapkan Oleh (PM / QA Lead), | Disetujui Oleh (General Counsel), | Mengetahui (Direksi ERP), |
| :---: | :---: | :---: |
| <br><br><br>____________________<br>**Product Manager** | <br><br><br>____________________<br>**General Counsel** | <br><br><br>____________________<br>**VP Information Technology** |
