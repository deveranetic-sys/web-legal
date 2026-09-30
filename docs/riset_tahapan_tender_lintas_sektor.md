# Riset Komparasi Tahapan Tender Lintas Sektor Industri
**Studi Regulasi, Alur Prosedur, dan Pemetaan Alur Kerja Kustom untuk Modul Tender & Pengadaan**

---

## 1. Eksekutif Ringkasan

Setiap sektor industri di Indonesia tunduk pada rezim regulasi dan lanskap risiko yang sangat spesifik. Pengadaan pekerjaan **Konstruksi Sipil & Infrastruktur** (Perpres 16/2018 jo 12/2021 & Standar Dokumen Pemilihan LKPP 12/2021) memiliki fokus ketat pada **analisa harga satuan timpang, metode pelaksanaan di lapangan, serta evaluasi kewajaran harga (<80% HPS)**. 

Sebaliknya, **Sektor Pertambangan & Mineral** (UU Minerba & Kepmen ESDM) berpusat pada **legalitas IUP/RKAB di MODI ESDM, cadangan JORC/KCMI, kuota Domestic Market Obligation (DMO 25%), serta formula indeks HBA/HPM**. 

Sementara itu, **Sektor Minyak & Gas Bumi (Migas)** tunduk pada rezim **PTK-007 SKK Migas Revisi 05**, di mana tahapan tender wajib melewati verifikasi **CIVD (Centralized Integrated Vendor Database)**, akreditasi keselamatan kerja risiko tinggi **CSMS**, dan pembukaan sampul dua tahap dengan pembobotan **Harga Evaluasi Akhir (HEA) berbasis sertifikasi TKDN resmi Kemenperin**.

Dokumen ini memetakan perbedaan tahapan, persyaratan dokumen kunci, klausul risiko kritis, dan arsitektur alur kerja (*Dynamic Tender Stages*) untuk diadopsi ke dalam aplikasi LMS.

---

## 2. Matriks Komparasi Karakteristik Pengadaan per Sektor

| Parameter Analisis | 🏗️ Konstruksi & Infrastruktur | ⛏️ Pertambangan & Mineral | 🛢️ Minyak & Gas Bumi (Migas) | ⚡ Energi & Ketenagalistrikan | 📦 Barang & Jasa Umum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Regulasi Rujukan Utama** | Perpres 16/2018 jo 12/2021, UU Jasa Konstruksi 2/2017, LKPP 12/2021 | UU Minerba 3/2020, Kepmen ESDM HBA/HPM, RKAB ESDM | PTK-007 SKK Migas Rev-05, Permen ESDM 15/2013 | Perdir PLN 0022.P/DIR/2020, Perpres 112/2022 (EBT) | Perpres 16/2018, LKPP Perlem 9/2021 |
| **Sistem / Portal Pengadaan** | SPSE / LPSE LKPP & E-Katalog V6 | Vendor Management System (VMS) PLN IP/NP, PTBA, Antam | CIVD SKK Migas & E-Proc KKKS (Pertamina, Medco, ENI) | DPT PLN, E-Proc PLN Pusat & Unit Induk | SPSE / SiRUP / Bela Pengadaan |
| **Sertifikasi Kunci Wajib** | SBU LPJK PUPR, SKK Konstruksi, SMK3 PP 50/2012 | IUP Operasi Produksi MODI, RKAB Disetujui, SILO Minerba | SPDA CIVD SKK Migas, CSMS High Risk, Sertifikat TKDN Migas | SBU Kelistrikan EL, Sertifikat Laik Operasi (SLO) DJK | NIB OSS-RBA, PKP, SPT Tahunan |
| **Metode Evaluasi Penawaran** | Sistem Gugur / Harga Terendah / Pembobotan Teknis-Harga | Kualitas Spesifikasi Komoditas (CV/Kalori) + Indeks Formula | Sistem Dua Sampul (Ambang Batas Teknis $\ge 80$ + Harga HEA TKDN) | Kualitas Teknis & Finansial (LCOE / Tarif Listrik c/kWh) | Sistem Gugur / E-Reverse Auction |
| **Klausul Khusus Penawaran Rendah** | **Wajib EKH jika < 80% HPS** & Jaminan Pelaksanaan naik jadi 5% HPS | Penalti Spesifikasi Off-Spec (Reject / Price Adjustment) | Clarification to OE (Owner Estimate tertutup SKK Migas) | Verifikasi Kemampuan Pendanaan Bank (Bankability) | Klarifikasi Teknis Sederhana |
| **Bentuk Kontrak Baku** | Surat Perjanjian Kontrak Konstruksi (Lump Sum / Unit Price / FIDIC) | Coal/Mineral Supply Agreement (FOB/CIF) & Mining Contract | Production Sharing Contract (PSC) EPCIC / LOI / JOA | Power Purchase Agreement (PPA) / EPC Transmisi | Surat Perintah Kerja (SPK) / Kontrak Jual Beli |

---

## 3. Rincian Alur Tahapan Tender Berdasarkan Sektor

### 3.1. Sektor Konstruksi & Infrastruktur (Standard SPSE/LPSE & PUPR)

Alur tender konstruksi berfokus pada keandalan struktur, metode kerja lapangan, dan rasionalitas harga satuan.

```
[Tahap 1: Persiapan KAK, DED & HPS] 
   └── [Tahap 2: Pengumuman & Pendaftaran SPSE] 
          └── [Tahap 3: Aanwijzing & Site Visit Lapangan] 
                 └── [Tahap 4: Upload Dokumen Penawaran 3 Sampul] 
                        └── [Tahap 5: Evaluasi Teknis & EKH (<80% HPS)] 
                               └── [Tahap 6: Pembuktian Kualifikasi Faktual] 
                                      └── [Tahap 7: Penetapan Pemenang & Masa Sanggah 5 Hari] 
                                             └── [Tahap 8: SPPBJ, Jaminan Pelaksanaan 5% & Kontrak]
```

**Titik Kritis Legal & Bisnis Konstruksi:**
1. **Peninjauan Lapangan (Site Visit):** Pada proyek jembatan, jalan, dan terowongan, ketidakhadiran dalam kunjungan lapangan wajib dapat menggugurkan penawaran teknis.
2. **Evaluasi Kewajaran Harga (EKH):** Apabila total penawaran $< 80\%$ HPS, peserta wajib membuktikan rincian Analisa Harga Satuan Pekerjaan (AHSP) tidak timpang dan menyertakan bukti kepemilikan alat/dukungan material grosir.
3. **Jaminan Pelaksanaan (Performance Bond):** Jika $< 80\%$ HPS, nilai jaminan adalah $5\% \times \text{Nilai HPS}$, bukan dari nilai penawaran.
4. **Masa Pemeliharaan (Defects Liability Period):** Retensi $5\%$ atau Jaminan Pemeliharaan selama 180–365 hari pasca Berita Acara Serah Terima Pertama (PHO).

---

### 3.2. Sektor Pertambangan & Mineral (Mining & Mineral Supply)

Pengadaan pada sektor ini berpusat pada kepastian pasokan volume, kadar mutu mineral/batubara, dan ketaatan lingkungan hidup.

```
[Tahap 1: Verifikasi MODI & Persetujuan RKAB] 
   └── [Tahap 2: Registrasi Vendor & Validasi Cadangan JORC/KCMI] 
          └── [Tahap 3: Aanwijzing Kualitas Spesifikasi & Jetty Tersus] 
                 └── [Tahap 4: Pengujian Sampling Independen (Sucofindo/Carsurin)] 
                        └── [Tahap 5: Bidding Harga Basis Formula HBA/HPM ESDM] 
                               └── [Tahap 6: Verifikasi Alokasi DMO 25% & e-PNBP Royalti] 
                                      └── [Tahap 7: Penetapan Alokasi Kuota Pasokan] 
                                             └── [Tahap 8: Perjanjian Pasokan Jangka Panjang & Jaminan Reklamasi]
```

**Titik Kritis Legal & Bisnis Pertambangan:**
1. **Register MODI & RKAB ESDM:** Tanpa persetujuan RKAB aktif, perusahaan tambang dilarang menjual komoditas atau mengikuti lelang pasokan BUMN.
2. **Kesesuaian Spesifikasi (Rejection Limit):** Kadar kalori, total moisture, ash, dan sulfur memiliki batas penolakan (*rejection threshold*). Pengiriman di luar ambang batas memicu pemutusan kontrak dan pencairan Bid/Performance Bond.
3. **Pemenuhan Domestic Market Obligation (DMO 25%):** Eksportir atau produsen wajib membuktikan pemenuhan DMO sebelum diizinkan menandatangani kontrak tambahan.
4. **Formula Penyesuaian Harga Bulanan:** Invoice penagihan mengacu pada indeks resmi Harga Batubara Acuan (HBA) atau Harga Patokan Mineral (HPM) pada saat tanggal Bill of Lading (B/L).

---

### 3.3. Sektor Minyak & Gas Bumi (Hulu & Midstream Migas - PTK-007)

Pengadaan sektor hulu migas merupakan salah satu proses paling ketat dan berjenjang tinggi di Indonesia.

```
[Tahap 1: Verifikasi Sentral CIVD & SPDA SKK Migas] 
   └── [Tahap 2: Prakualifikasi Keselamatan CSMS (High Risk $\ge 70$)] 
          └── [Tahap 3: Pengumuman Tender KKKS & Pre-Bid Meeting] 
                 └── [Tahap 4: Pembukaan Sampul I (Administrasi & Teknis)] 
                        └── [Tahap 5: Verifikasi Komitmen TKDN (Surveyor Kemenperin)] 
                               └── [Tahap 6: Pembukaan Sampul II (Komersial) Bagi Peserta Lolos Teknis] 
                                      └── [Tahap 7: Perhitungan Harga Evaluasi Akhir (HEA Preferensi TKDN)] 
                                             └── [Tahap 8: Klarifikasi Terhadap OE SKK Migas & Negosiasi] 
                                                    └── [Tahap 9: Pengumuman Pemenang, Sanggah PTK-007, LOI & Kontrak]
```

**Titik Kritis Legal & Bisnis Migas:**
1. **Sistem SPDA CIVD:** Vendor wajib memiliki Surat Pengganti Dokumen Administrasi terpusat yang aktif. Kegagalan validasi CIVD membatalkan hak kepesertaan.
2. **CSMS (Contractor Safety Management System):** Untuk pekerjaan berisiko tinggi (*offshore, rig drilling, pipa transmisi bertekanan*), nilai CSMS minimum adalah 70–80.
3. **Harga Evaluasi Akhir (HEA):** Penawaran harga tidak langsung dinilai dari nominal terendah, melainkan dikoreksi dengan formula preferensi TKDN:
   $$\text{HEA} = \frac{\text{Harga Penawaran}}{1 + (\text{Bobot TKDN} \times \text{Preferensi})}$$
   Peserta dengan TKDN tinggi dapat memenangkan tender meskipun penawaran awalnya sedikit lebih tinggi dari pesaing.
4. **Owner Estimate (OE) Tertutup:** OE panitia dirahasiakan dan diawasi ketat oleh SKK Migas. Bila harga penawaran melampaui OE, panitia mengadakan negosiasi berbatas waktu.

---

### 3.4. Sektor Energi & Ketenagalistrikan (Power Generation & Transmission)

Pengadaan ketenagalistrikan melibatkan investasi jangka panjang (20–30 tahun) dengan ketergantungan pada stabilitas finansial dan kelayakan interkoneksi jaringan.

```
[Tahap 1: Kualifikasi DPT PLN & Seleksi Pengembang RUPTL] 
   └── [Tahap 2: Penerbitan Request for Proposal (RFP) & KAK EPC/PPA] 
          └── [Tahap 3: Studi Interkoneksi Grid & Uji Kelayakan Lingkungan] 
                 └── [Tahap 4: Penyerahan Penawaran Tarif (c/kWh) & Struktur Ekuitas] 
                        └── [Tahap 5: Evaluasi Bankability & Letter of Support Konsorsium Lender] 
                               └── [Tahap 6: Verifikasi TKDN Pembangkit (Permenperin 54/2012)] 
                                      └── [Tahap 7: Penetapan Selected Bidder & Letter of Award] 
                                             └── [Tahap 8: Power Purchase Agreement (PPA) / Kontrak EPC & Financial Close]
```

---

## 4. Rekomendasi Arsitektur untuk Modul "Data Master & Filter"

Agar sistem LMS dapat menangani perbedaan alur lelang antar sektor secara dinamis dan tidak kaku, sistem membutuhkan **Pusat Manajemen Data Master** yang mencakup:

### 4.1. Kategori Master Data yang Harus Dikelola
1. **Master Kategori Dokumen Persyaratan:**
   - Legalitas Badan Usaha (Akta, NIB, NPWP)
   - Kualifikasi Teknis (SBU, SKK, CSMS, SILO, JORC, COA)
   - Finansial & Keuangan (Audit KAP, SPT, Bank Garansi, L/C)
   - Kepatuhan & Integritas (Pakta Integritas, Non-Blacklist, TKDN, DMO)
   - Lingkungan Hidup & K3 (Amdal, UKL-UPL, SMK3, ISO 45001)

2. **Master Sektor Industri:**
   - Nama Sektor & Label
   - Kode Prefix Tender (misal `KON`, `TAM`, `MIG`, `EBT`, `UMU`)
   - Regulasi Pokok
   - Tipe Kontrak Default saat Dikonversi (misal `EPC`, `Coal Supply`, `PPA`, `Goods & Services`)

3. **Master Alur Tahapan Tender (Workflow Presets per Sektor):**
   - Mengizinkan setiap tender menggunakan template tahapan yang sesuai sektornya:
     - Template 8 Tahap SPSE Konstruksi
     - Template 8 Tahap Pertambangan (MODI, RKAB, COA, DMO)
     - Template 9 Tahap PTK-007 Hulu Migas (CIVD, CSMS, Sampul II HEA)
     - Template 5 Tahap Pengadaan Sederhana / Barang Umum

4. **Master Tipe Jaminan Bank (Bank Guarantee & Bonds):**
   - Bid Bond / Jaminan Penawaran
   - Performance Bond / Jaminan Pelaksanaan (Normal 5% Kontrak vs Wajib 5% HPS bila <80%)
   - Advance Payment Bond / Jaminan Uang Muka
   - Maintenance Bond / Jaminan Pemeliharaan

---

## 5. Kesimpulan & Rencana Aksi Implementasi

Dengan menghadirkan menu **Data Master & Filter**:
1. Seluruh dropdown filter (tipe dokumen, sektor, status tahapan) menjadi **reaktif dan tersentralisasi**.
2. Pengguna dapat menambah tipe dokumen baru atau menyesuaikan tahapan tender tanpa perlu mengubah kode sumber.
3. Fitur tender menjadi adaptif terhadap kekhususan industri Konstruksi, Pertambangan, Migas, dan Energi sesuai hukum positif Republik Indonesia.
