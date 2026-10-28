# ERP Design System: Tactile Precision UI

**Version:** 1.0.0  
**Target Architecture:** Web (Vue 3 / Tailwind CSS) & Mobile/Tablet Companion (Flutter)  
**Design Paradigm:** 2026–2027 Enterprise Standard (Fluid Bento + Neo-Tactile + Warm Obsidian)

---

## 1. Core Philosophy & Principles

**Tactile Precision UI** dirancang khusus untuk sistem ERP dan operasional berskala *enterprise* yang menuntut kepadatan data tinggi (*high data density*), akurasi baca, dan kecepatan eksekusi tanpa membuat mata lelah.

1. **High-Density Clarity:** Memaksimalkan informasi yang tampil di layar (minim *scroll* berlebih) namun tetap mudah dipindai berkat pemisahan tipografi narasi dan angka.
2. **Border-First, Shadow-Minimal:** Mengandalkan struktur garis batas tegas (`1px solid`) untuk memisahkan modul dan sel data. Efek bayangan (*shadow*) dan *blur* kaca (*glassmorphism*) hanya digunakan untuk elemen yang melayang di sumbu Z (Modal, Drawer, Command Bar, Sticky Header).
3. **Zero Eye-Strain:** Menghindari warna putih menyilaukan (`#FFFFFF`) sebagai latar belakang kanvas utama dan menghindari hitam murni (`#000000`) pada *dark mode*.
4. **Inline Context Action:** Meminimalkan perpindahan halaman (*page reload/redirect*) dengan memanfaatkan *Expandable Table Rows* dan *Slide-Over Drawers*.

---

## 2. Color System & Tokens

### 2.1 Surface & Neutral Palette

| Token Name | CSS Variable | Light Mode (Default Ops) | Dark Mode (Command/Monitor) | Fungsi Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `--bg-canvas` | `#F8FAFC` (Slate 50) | `#0B0F17` (Deep Carbon) | Latar belakang utama halaman (`<body>`) |
| **Primary Surface** | `--bg-surface` | `#FFFFFF` (Pure White) | `#111827` (Obsidian Slate) | Latar Card, Tabel, Sidebar, Form Container |
| **Subtle / Hover Surface** | `--bg-subtle` | `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) | Table Header, Baris saat *hover*, Summary Box |
| **Floating Glass** | `--bg-glass` | `rgba(255, 255, 255, 0.85)` | `rgba(17, 24, 39, 0.85)` | Sticky Header & Command Bar (+ `backdrop-blur: 8px`) |
| **Border Subtle** | `--border-subtle` | `#E2E8F0` (Slate 200) | `#1E293B` (Slate 800) | Pembatas sel tabel, *card outline*, *divider* |
| **Border Strong** | `--border-strong` | `#CBD5E1` (Slate 300) | `#334155` (Slate 700) | Garis tepi Input Form, Tombol sekunder |
| **Text Primary** | `--text-main` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Judul, isi tabel utama, nilai angka penting |
| **Text Secondary** | `--text-muted` | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Label form, *column header*, keterangan waktu |
| **Text Placeholder** | `--text-placeholder`| `#94A3B8` (Slate 400) | `#475569` (Slate 600) | Teks *placeholder* input & ikon non-aktif |

### 2.2 Brand & Semantic Status Palette

Gunakan kombinasi **Text + Soft Background + 1px Border** untuk semua *Status Badge* dan *Alert* agar kontras selalu terjaga (memenuhi standar aksesibilitas WCAG 2.2 AA+).

| Kategori Status | Contoh Penggunaan di ERP | Text / Icon Color | Background Color (Light) | Border Color (Light) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary / Action** | Tombol Utama, Active Menu, Link, Focus Ring | `#2563EB` | `#EFF6FF` | `#BFDBFE` |
| **Success (Matched)** | *Approved*, *Paid*, *3-Way Match OK*, *Completed* | `#15803D` | `#DCFCE7` | `#86EFAC` |
| **Warning (Pending)** | *Waiting Approval*, *Partial Delivery*, *Near Limit* | `#B45309` | `#FEF3C7` | `#FDE68A` |
| **Danger (Discrepancy)**| *Rejected*, *Price/Qty Mismatch*, *Overdue*, *Void* | `#B91C1C` | `#FEE2E2` | `#FCA5A5` |
| **Info (In-Progress)** | *In-Transit*, *Draft*, *Open*, *Transferred* | `#0369A1` | `#E0F2FE` | `#7DD3FC` |

---

## 3. Typography System (Dual-Font Strategy)

Pemisahan jenis huruf antara **narasi manusia** dan **data mesin/angka** adalah aturan wajib dalam *design system* ini.

### 3.1 Font Families
* **Sans-Serif (UI & Narasi):** `'Inter'`, `'Plus Jakarta Sans'`, `-apple-system, sans-serif`
  * *Penggunaan:* Navigasi, judul halaman, nama item/vendor/karyawan, catatan, tombol.
* **Monospace (Data, Kode & Angka):** `'JetBrains Mono'`, `'Geist Mono'`, `monospace`
  * *Penggunaan Wajib:* Nomor dokumen (`PO-2026-0891`), SKU/Part Number, nominal mata uang (`Rp 125.000.000`), kuantitas stok, persentase, koordinat, *timestamp* audit log, dan kotak input PIN.
  * *CSS Rule Wajib:* `font-variant-numeric: tabular-nums;` (Memastikan digit angka sejajar lurus vertikal dari baris atas ke bawah di dalam tabel).

### 3.2 Typographic Scale (Compact Enterprise Scale)

| Level | Ukuran (`px` / `rem`) | Line Height | Weight | Aturan Tambahan |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title (`H1`)** | `20px` / `1.25rem` | `28px` | `600 (SemiBold)` | `letter-spacing: -0.02em` |
| **Section / Drawer Title (`H2`)**| `16px` / `1.0rem` | `24px` | `600 (SemiBold)` | `letter-spacing: -0.01em` |
| **Card Title (`H3`)** | `14px` / `0.875rem` | `20px` | `600 (SemiBold)` | — |
| **Body / Form Input** | `13px` / `0.8125rem` | `20px` | `400 (Regular)` | Standar teks aplikasi |
| **Table Cell (Default)** | `13px` / `0.8125rem` | `18px` | `400` / `500` | Gunakan `--font-mono` untuk kolom angka/ID |
| **Table Header / Badge** | `11px` / `0.6875rem` | `16px` | `600 (SemiBold)` | `UPPERCASE`, `letter-spacing: 0.04em` |
| **Audit Timestamp / Helper** | `11px` / `0.6875rem` | `16px` | `400 (Regular)` | Warna `--text-muted` |

---

## 4. Layout, Grid & Spacing

### 4.1 Spacing & Density Scale
Menggunakan sistem grid berbasis `4px`:
* **Padding Dalam Card / Panel:** `16px` (`p-4`) — hindari `24px`/`32px` agar ruang kerja tetap optimal.
* **Jarak Antar Bento Card (Grid Gap):** `12px` (`gap-3`) atau `16px` (`gap-4`).
* **Tinggi Baris Tabel (Row Density):**
  * **Compact Mode:** `36px` (Untuk layar monitoring, jurnal akuntansi, atau daftar stok ribuan baris).
  * **Standard Mode:** `44px` (Default operasional untuk Procurement, HRIS, dan Inventory).

### 4.2 Border Radius & Elevation (Z-Axis)
* **Radius:**
  * Card, Tabel Container, Modal, Drawer: `8px` (`rounded-lg`)
  * Button, Input, Select, Status Badge: `6px` (`rounded-md`)
  * Checkbox, Tag Kecil: `4px` (`rounded`)
* **Z-Index & Elevation Rules:**
  * `z-0` (Base): Card & Tabel hanya menggunakan `border: 1px solid var(--border-subtle)`, **`box-shadow: none`**.
  * `z-10` (Sticky Table Header/Column): Background solid/glass + `border-bottom: 1px solid var(--border-strong)`.
  * `z-30` (Slide-Over Drawer): `box-shadow: -8px 0 24px rgba(15, 23, 42, 0.08)`.
  * `z-50` (Modal Approval / Command Bar): `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.15)` + Backdrop `rgba(15, 23, 42, 0.4)` dengan `backdrop-filter: blur(2px)`.

---

## 5. Core ERP Component Blueprints

### 5.1 High-Density Data Table
* **Header:** Sticky di bagian atas saat *scroll* vertikal, *background* `--bg-subtle`, teks `11px UPPERCASE` dengan warna `--text-muted`.
* **Alignment Rules:**
  * Teks, Nama, Deskripsi: **Rata Kiri (`text-left`)**
  * Status Badge, Tanggal Pendek, Tipe: **Rata Tengah (`text-center`)**
  * Kuantitas, Harga, Total Nominal: **Rata Kanan (`text-right`) + Font Monospace**
* **Sticky Columns:** Kolom `Document No / ID` dikunci di sebelah kiri (*sticky left*), dan kolom `Action` dikunci di sebelah kanan (*sticky right*) saat tabel digulir secara horizontal.
* **Expandable Row:** Mendukung klik ikon panah (`>`) di sisi kiri baris untuk membuka rincian sub-item atau ringkasan verifikasi (seperti status *3-Way Matching*: PO vs GRN vs Invoice) langsung di bawah baris tersebut.

### 5.2 Slide-Over Drawer (Detail & Quick Edit)
* Digunakan untuk menggantikan perpindahan halaman saat pengguna mengklik detail dokumen, melihat riwayat perjalanan barang, atau mengedit form berskala menengah.
* **Ukuran Lebar:**
  * `md`: `480px` (Form edit cepat, filter lanjutan, detail profil).
  * `lg`: `640px` (Pratinjau dokumen PO/Invoice, perbandingan item, log audit lengkap).
* Memiliki *Sticky Header* (Judul Dokumen + Status Badge + Tombol Close `Esc`) dan *Sticky Footer* (Tombol Aksi seperti *Reject*, *Edit*, atau *Approve*).

### 5.3 PIN & Approval Verification Modal
* Digunakan untuk aksi krusial yang membutuhkan otorisasi (misalnya: *Approve* PO bernilai besar, *Release* Material Transfer, atau *Void* Invoice).
* **Struktur Komponen:**
  1. **Header Warning/Action:** Ikon kunci/perisai + Judul aksi tegas.
  2. **Transaction Summary Box:** Kotak berlatar `--bg-subtle` dengan `border: 1px dashed var(--border-strong)` yang menampilkan Nomor Dokumen (`Monospace`), Pemohon, dan Total Nilai Transaksi secara jelas.
  3. **6-Digit Tactile PIN Input:** 6 kotak terpisah berukuran `44px x 52px`, menggunakan `--font-mono` ukuran `20px bold`. Kotak yang sedang aktif memiliki `border: 2px solid var(--primary-base)` dan efek *glow* halus `0 0 0 3px rgba(37, 99, 235, 0.15)`.
  4. **Reason/Notes Input:** Field catatan opsional (atau wajib diisi jika aksi adalah *Reject*).

### 5.4 Audit Trail & Activity Timeline
* Menampilkan jejak rekam perubahan data secara kronologis dan transparan.
* **Visual:** Garis vertikal tipis (`1px solid var(--border-subtle)`) di sisi kiri dengan titik indikator (*node*) berukuran `8px`.
* **Format Baris Log:**
  * Baris 1: `[Timestamp Monospace: 2026-10-28 14:20:05]` — **Nama User / Role** — `[Badge Action: UPDATED / APPROVED]`
  * Baris 2 (Diff Box): Menampilkan perubahan nilai secara eksplisit menggunakan *font Monospace*, contoh: `Qty: 100 -> 85` atau `Status: DRAFT -> PENDING_APPROVAL`.

### 5.5 Command Bar (`Cmd + K` / `Ctrl + K`)
* Panel pencarian dan navigasi instan yang mengambang di tengah atas layar.
* Memungkinkan pengguna melompat langsung ke modul tertentu, mencari nomor referensi dokumen lintas modul, atau mengeksekusi perintah cepat (*"Create New PR"*, *"Check Pending Approvals"*) hanya dengan *keyboard*.

---

## 6. CSS Variables & Tailwind Starter Configuration

Salin konfigurasi berikut ke dalam file `main.css` atau `tailwind.config.js` sebagai fondasi implementasi:

```css
/* main.css */
@import url('[https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap)');

:root {
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Surfaces - Light Mode */
  --bg-canvas: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-subtle: #F1F5F9;
  --bg-glass: rgba(255, 255, 255, 0.85);

  /* Borders */
  --border-subtle: #E2E8F0;
  --border-strong: #CBD5E1;
  --border-focus: #2563EB;

  /* Text */
  --text-main: #0F172A;
  --text-muted: #64748B;
  --text-placeholder: #94A3B8;

  /* Brand & Primary */
  --primary-base: #2563EB;
  --primary-hover: #1D4ED8;
  --primary-soft: #EFF6FF;

  /* Status Colors */
  --status-success-text: #15803D;
  --status-success-bg: #DCFCE7;
  --status-success-border: #86EFAC;

  --status-warning-text: #B45309;
  --status-warning-bg: #FEF3C7;
  --status-warning-border: #FDE68A;

  --status-danger-text: #B91C1C;
  --status-danger-bg: #FEE2E2;
  --status-danger-border: #FCA5A5;

  --status-info-text: #0369A1;
  --status-info-bg: #E0F2FE;
  --status-info-border: #7DD3FC;

  /* Sizing & Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --row-height-compact: 36px;
  --row-height-normal: 44px;
}

.dark {
  --bg-canvas: #0B0F17;
  --bg-surface: #111827;
  --bg-subtle: #1E293B;
  --bg-glass: rgba(17, 24, 39, 0.85);

  --border-subtle: #1E293B;
  --border-strong: #334155;
  --border-focus: #3B82F6;

  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
  --text-placeholder: #475569;

  --primary-base: #3B82F6;
  --primary-hover: #60A5FA;
  --primary-soft: rgba(59, 130, 246, 0.15);
}

/* Base Body Setup */
body {
  background-color: var(--bg-canvas);
  color: var(--text-main);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Mandatory Utility Classes for ERP Data */
.font-mono-tabular {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.erp-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.erp-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: var(--radius-md);
  border-width: 1px;
  border-style: solid;
}
```

---

## 7. Do's and Don'ts (Developer & UI Checklist)

* **DO:** Gunakan `.font-mono-tabular` pada setiap kolom harga, stok, nomor dokumen, persentase, dan *timestamp*.
* **DO:** Buat *header* tabel tetap terlihat (*sticky*) saat pengguna menggulir ratusan baris data ke bawah.
* **DO:** Gunakan *skeleton loader* berbentuk baris tabel saat mengambil data dari API, jangan gunakan *full-screen loading spinner* yang memblokir seluruh layar.
* **DON'T:** Jangan menggunakan `box-shadow` tebal pada *card* atau kontainer tabel biasa; cukup gunakan `border: 1px solid var(--border-subtle)`.
* **DON'T:** Jangan membuat ukuran *font* di dalam tabel lebih besar dari `13px` atau tinggi baris lebih dari `48px` karena akan membuang ruang vertikal secara drastis.
* **DON'T:** Jangan meletakkan angka nominal uang dengan rata tengah (`text-center`) atau rata kiri (`text-left`) di dalam tabel—selalu gunakan rata kanan (`text-right`) agar nilai desimal dan ribuan sejajar.