# PANDUAN & TEMPLATE IMPOR DATA MASAL (DATA SEEDING TEMPLATE)
## ELegal Enterprise Legal Suite
**Target Pengguna:** Tim Legal & Data Administrator  
**Tujuan:** Panduan standarisasi format spreadsheet (Excel / CSV) untuk memigrasikan data legal eksisting perusahaan ke dalam database sistem ELegal saat *cut-over*.

---

## 1. ATURAN UMUM FORMAT DATA (DATA STANDARDS)

1. **Format Tanggal:** Wajib menggunakan format ISO baku `YYYY-MM-DD` (contoh: `2026-11-15`). Jangan gunakan format `15/11/2026` atau `15-Nov-2026`.
2. **Format Angka / Nilai Finansial:** Tulis angka murni tanpa pemisah titik/koma ribuan dan tanpa simbol mata uang (contoh: tulis `15000000000`, bukan `Rp 15.000.000.000,-`).
3. **Karakter Bersih:** Hindari spasi di awal/akhir teks (*leading/trailing spaces*).
4. **Encoding Berkas:** Simpan berkas sebagai **CSV (Comma Delimited) UTF-8**.

---

## 2. STRUKTUR TEMPLATE PER ENTITAS

---

### 📋 TEMPLATE 1: Master Rekanan & Vendor (`master_counterparties.csv`)

| Nama Kolom Header | Wajib / Opsional | Tipe Data | Keterangan & Nilai yang Diizinkan |
|---|:---:|---|---|
| `counterparty_code` | **Wajib** | String (Max 50) | Kode unik rekanan, contoh: `VND-PLN-01` |
| `name` | **Wajib** | String (Max 255) | Nama resmi perseroan mitra, contoh: `PT PLN (Persero)` |
| `category` | **Wajib** | Enum | Pilihan: `BUMN`, `SWASTA`, `VENDOR_EPC`, `KONSULTAN` |
| `tax_id` | Opsional | String (Max 50) | NPWP rekanan, contoh: `01.234.567.8-012.000` |
| `legal_domicile` | Opsional | Teks | Alamat domisili hukum perusahaan |
| `pic_name` | Opsional | String (Max 150) | Nama contact person PIC mitra |
| `pic_phone` | Opsional | String (Max 50) | Nomor telepon/WhatsApp PIC |
| `pic_email` | Opsional | Email | Alamat email resmi PIC |

#### Contoh Isi Data Mentah (CSV):
```csv
counterparty_code,name,category,tax_id,legal_domicile,pic_name,pic_phone,pic_email
VND-PLN-01,PT PLN (Persero) Wilayah Sumbagsel,BUMN,01.001.234.5-011.000,Jl. Kapten A. Rivai No. 12 Palembang,Bambang Irawan,081234567890,bambang@pln.co.id
VND-MBP-02,PT Mitra Bangun Perkasa,VENDOR_EPC,02.456.789.1-015.000,Gedung Palma Lt. 8 Kuningan Jakarta,Ir. Hendra Gunawan,081198765432,hendra@mitrabangun.com
VND-BGM-03,PT Bara Global Mandiri,SWASTA,03.789.012.3-021.000,RDTX Tower Lt. 15 Mega Kuningan Jakarta,Siti Rahmawati,081388997711,siti@baraglobal.co.id
```

---

### 📋 TEMPLATE 2: Register Kontrak Aktif Berjalan (`active_contracts.csv`)

| Nama Kolom Header | Wajib / Opsional | Tipe Data | Keterangan & Nilai yang Diizinkan |
|---|:---:|---|---|
| `contract_number` | **Wajib** | String (Max 100) | Nomor registrasi kontrak resmi |
| `title` | **Wajib** | String (Max 255) | Judul lengkap perjanjian komersial |
| `counterparty_code`| **Wajib** | String (Max 50) | Harus cocok dengan `counterparty_code` di Template 1 |
| `contract_type` | **Wajib** | Enum | Pilihan: `PPA`, `EPC`, `CSA`, `LEASE`, `SUPPLY`, `SERVICES`, `NDA` |
| `start_date` | **Wajib** | Date (YYYY-MM-DD)| Tanggal efektif mulai kontrak |
| `end_date` | **Wajib** | Date (YYYY-MM-DD)| Tanggal jatuh tempo berakhirnya kontrak |
| `currency` | **Wajib** | String (3 huruf) | `IDR` atau `USD` |
| `contract_value` | **Wajib** | Angka Murni | Total komitmen nominal finansial |
| `payment_terms` | Opsional | Teks | Ringkasan termin pembayaran |
| `dispute_forum` | Opsional | Enum | `BANI`, `PN_JAKARTA_SELATAN`, `SIAC` |
| `status` | **Wajib** | Enum | `ACTIVE`, `EXPIRING_SOON`, `EXPIRED` |

#### Contoh Isi Data Mentah (CSV):
```csv
contract_number,title,counterparty_code,contract_type,start_date,end_date,currency,contract_value,payment_terms,dispute_forum,status
042/PPA/NE-PLN/XI/2026,Perjanjian Jual Beli Tenaga Listrik PLTU 2x100 MW,VND-PLN-01,PPA,2026-11-01,2051-11-01,IDR,450000000000,Termin bulanan kWh tersalurkan,BANI,ACTIVE
018/EPC/NE-MBP/2025,Kontrak EPC Pembangunan Fasilitas Jetty Batubara,VND-MBP-02,EPC,2025-06-15,2026-11-20,IDR,65000000000,Progress fisik 20%-40%-40%,BANI,EXPIRING_SOON
009/CSA/NE-BGM/2026,Perjanjian Pasokan Batubara Boiler Kualitas Medium,VND-BGM-03,SUPPLY,2026-01-10,2027-01-10,IDR,28000000000,Net 30 hari invoice,BANI,ACTIVE
```

---

### 📋 TEMPLATE 3: Register Perizinan Berusaha (`company_licenses.csv`)

| Nama Kolom Header | Wajib / Opsional | Tipe Data | Keterangan & Nilai yang Diizinkan |
|---|:---:|---|---|
| `license_number` | **Wajib** | String (Max 100) | Nomor SK / Nomor Izin resmi |
| `title` | **Wajib** | String (Max 255) | Nama dokumen perizinan |
| `license_type` | **Wajib** | Enum | Pilihan: `OSS_RBA`, `PB_UMKU`, `IUP_OPERASI`, `AMDAL_SKKL`, `SLO` |
| `issuing_authority`| **Wajib** | String (Max 150) | Instansi penerbit (Kementerian ESDM, BKPM, KLHK, dll) |
| `issued_date` | **Wajib** | Date (YYYY-MM-DD)| Tanggal terbit izin |
| `expiry_date` | **Wajib** | Date (YYYY-MM-DD)| Tanggal kedaluwarsa izin |
| `status` | **Wajib** | Enum | `ACTIVE`, `EXPIRING_SOON`, `EXPIRED`, `IN_RENEWAL` |

#### Contoh Isi Data Mentah (CSV):
```csv
license_number,title,license_type,issuing_authority,issued_date,expiry_date,status
540/12/IUP-OP/ESDM/2024,Izin Usaha Pertambangan Operasi Produksi,IUP_OPERASI,Kementerian ESDM,2024-03-10,2034-03-10,ACTIVE
0220001298451,Nomor Induk Berusaha (NIB) Berbasis Risiko,OSS_RBA,BKPM / Kementerian Investasi,2021-08-20,2035-08-20,ACTIVE
SK.450/MENLHK/2023,Surat Keputusan Kelayakan Lingkungan Hidup (SKKL),AMDAL_SKKL,Kementerian LHK,2023-05-12,2026-11-25,EXPIRING_SOON
```

---

## 3. CHECKLIST PRA-MIGRASI OLEH PM
Sebelum menyerahkan file Excel yang sudah diisi ke tim pengembang untuk dieksekusi melalui skrip migrasi, pastikan PM melakukan verifikasi:

1. [ ] Tidak ada baris kosong (*empty blank rows*) di tengah-tengah tabel.
2. [ ] Tidak ada kolom tambahan di luar spesifikasi header di atas.
3. [ ] Seluruh nilai tanggal lolos validasi format `YYYY-MM-DD`.
4. [ ] Seluruh `counterparty_code` pada file kontrak sudah terdaftar di file rekanan.
