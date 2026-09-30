# Design System: Pastel Dashboard UI/UX Specification

Dokumentasi ini menetapkan panduan desain untuk dashboard berbasis web dengan tema warna pastel. Fokus utama spesifikasi ini adalah memastikan **estetika pastel yang tenang dan bersih** tetap memenuhi standar **aksesibilitas (WCAG 2.1 AA)**, kejelasan keterbacaan, dan hirarki visual yang kuat.

---

## 1. Fondasi Visual (Foundations)

### 1.1 Color Palette & Design Tokens
Warna pastel diaplikasikan sebagai penanda status, latar belakang komponen, dan aksen visual. Untuk elemen kritis seperti teks isi, label, dan ikon penting, digunakan shade netral gelap guna menjamin rasio kontras minimal 4.5:1.

| Token Name | Hex Value | Peruntukan UI | Standar Kontras |
| :--- | :--- | :--- | :--- |
| `color-bg-base` | `#F9FAFB` | Background kanvas aplikasi (Cool Gray 50) | Netral |
| `color-surface` | `#FFFFFF` | Latar kartu, sidebar, navbar, dialog | Netral |
| `color-surface-subtle` | `#F1F5F9` | Hover row tabel, input disabled state | Netral |
| `color-text-primary` | `#0F172A` | Judul, metrik utama, teks prioritas tinggi | Kontras tinggi (>10:1) |
| `color-text-secondary` | `#475569` | Label form, subheader, deskripsi sekunder | Kontras memadai (>5:1) |
| `color-text-muted` | `#94A3B8` | Placeholder, timestamp sekunder | Hanya untuk non-kritis |
| `color-border` | `#E2E8F0` | Pembatas kartu, garis tabel, divider | Pembatas visual lembut |
| `color-primary` | `#6366F1` | Tombol CTA utama, status aktif seleksi | Kontras tinggi |
| `color-primary-soft` | `#EEF2FF` | Background tombol sekunder & menu aktif | Latar pastel |
| `color-mint-soft` | `#DCFCE7` | Background status Success / Tren Positif | Latar pastel |
| `color-mint-text` | `#166534` | Teks status Success | Memenuhi AA pada soft mint |
| `color-peach-soft` | `#FEF3C7` | Background status Warning / Pending | Latar pastel |
| `color-peach-text` | `#92400E` | Teks status Warning | Memenuhi AA pada soft peach |
| `color-rose-soft` | `#FFE4E6` | Background status Danger / Failed | Latar pastel |
| `color-rose-text` | `#9F1239` | Teks status Danger | Memenuhi AA pada soft rose |
| `color-sky-soft` | `#E0F2FE` | Background status Info / Processing | Latar pastel |
| `color-sky-text` | `#075985` | Teks status Info | Memenuhi AA pada soft sky |

---

### 1.2 Tipografi & Skala Hirarki
Gunakan tipe font sans-serif dengan geometri bersih dan keterbacaan tinggi pada layar (*Inter*, *Plus Jakarta Sans*, atau *Figtree*).

```
Display (Metrik Utama) : 32px / Line Height: 40px / Semi-Bold (600)
Heading 1 (Page Title) : 24px / Line Height: 32px / Bold (700)
Heading 2 (Card Title) : 18px / Line Height: 26px / Semi-Bold (600)
Heading 3 (Subsection) : 16px / Line Height: 24px / Medium (500)
Body Regular (Default) : 14px / Line Height: 20px / Regular (400)
Body Small / Caption   : 12px / Line Height: 16px / Regular (400)
Button / Action Label  : 14px / Line Height: 20px / Medium (500)
```

---

### 1.3 Spacing & Ukuran Grid
Mengadopsi sistem kelipatan **8-point grid** untuk konsistensi vertikal dan horizontal:
* `space-1` (4px): Jarak micro antara ikon dan label sebaris.
* `space-2` (8px): Padding internal tombol kecil, jarak antar badge.
* `space-4` (16px): Padding internal field input, gutter antar elemen form.
* `space-5` (20px): Padding internal kartu metrik dan widget dashboard.
* `space-6` (24px): Jarak gutter antar kolom kartu pada grid dashboard.
* `space-8` (32px): Jarak antar seksi halaman utama.

---

### 1.4 Radius Sudut & Kedalaman (Elevation)
Karakter pastel memerlukan bentuk membulat halus dan bayangan bernuansa lembut tanpa bayangan hitam pekat:

* **Border Radius:**
  * `radius-sm` (6px): Tag metrik, tombol filter kecil, input field.
  * `radius-md` (12px): Kartu metrik, panel grafis, popover menu.
  * `radius-lg` (16px): Modal popup dialog, container utama.
  * `radius-full` (9999px): Badge pil, avatar, toggle switch.
* **Box Shadows:**
  * `shadow-card`: `0 2px 8px -1px rgba(99, 102, 241, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)`
  * `shadow-floating`: `0 10px 25px -3px rgba(99, 102, 241, 0.10), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

---

## 2. Hirarki Komponen Utama

### 2.1 Komponen Tombol (Buttons)

1. **Primary Button:**
   * Latar: `color-primary` (`#6366F1`)
   * Teks: `#FFFFFF`
   * Hover: `#4F46E5`
   * Focus Ring: 3px `#C7D2FE`
   * Fungsi: Aksi utama halaman (misal: "Buat Laporan Baru", "Simpan Perubahan").
2. **Soft Pastel Button (Secondary):**
   * Latar: `color-primary-soft` (`#EEF2FF`)
   * Teks: `#4338CA`
   * Hover: `#E0E7FF`
   * Fungsi: Aksi pelengkap (misal: "Export Data", "Terapkan Filter").
3. **Ghost / Subtle Button:**
   * Latar: Transparan
   * Border: 1px solid `color-border` (`#E2E8F0`)
   * Teks: `color-text-secondary` (`#475569`)
   * Hover: `#F8FAFC`
   * Fungsi: Tombol batal, pagination, menu overflow.

---

### 2.2 Kartu Metrik (Summary Metric Cards)
Setiap kartu disusun dengan anatomi visual terstandar:

```
+------------------------------------------------------+
| [Icon Pastel Box]                 [Pill Trend: +12%] |
| Total Pendapatan Bulanan                             |
| Rp 142.850.000                                       |
| Dibandingkan bulan sebelumnya (Rp 127.5M)            |
+------------------------------------------------------+
```

* **Wadah:** Background `#FFFFFF`, Border 1px `#E2E8F0`, Radius 12px, Padding 20px.
* **Header Kartu:** Icon wrapper 40x40px bulat pastel di sebelah kiri, badge tren status di pojok kanan.
* **Label:** 13px, `color-text-secondary`.
* **Nilai Utama:** 28px–32px, `color-text-primary`, weight 600.
* **Keterangan Sekunder:** 12px, `color-text-muted`.

---

### 2.3 Status Badges & Pill Chips
Kombinasi warna background pastel terang dan teks shade gelap wajib dijaga untuk keterbacaan:

| Kategori | Background | Teks | Contoh Label |
| :--- | :--- | :--- | :--- |
| **Success** | `#DCFCE7` | `#166534` | Selesai, Terverifikasi, Aktif |
| **Warning** | `#FEF3C7` | `#92400E` | Menunggu Persetujuan, Tertunda |
| **Danger** | `#FFE4E6` | `#9F1239` | Gagal, Dibatalkan, Expired |
| **Info** | `#E0F2FE` | `#075985` | Draft, Dalam Pengiriman |

---

## 3. Struktur Layout & Hirarki Dashboard

```
+-------------------------------------------------------------------------------+
| [Logo Brand]  | [Pencarian Global..................] | [Notifikasi] [Profil]  |
+---------------+---------------------------------------------------------------+
| Navigasi Kiri | Judul Halaman Aktif                         [+ Tombol Utama]  |
| - Ringkasan   | Sub-deskripsi konteks halaman                                 |
| - Transaksi   +---------------------------------------------------------------+
| - Analitik    | [ Kartu Metrik 1 ] [ Kartu Metrik 2 ] [ Kartu Metrik 3 ]      |
| - Pelanggan   +---------------------------------------------------------------+
| - Pengaturan  | [ Area Grafik Analisis Utama (65%) ] | [ Aktivitas Baru (35%) ]|
|               +---------------------------------------------------------------+
|               | [ Tabel Data Lengkap & Pagination (100% Width) ]              |
+---------------+---------------------------------------------------------------+
```

### 3.1 Panduan Zonasi UI
1. **Latar Belakang Global:** Kanvas memakai warna `#F9FAFB`. Hal ini menghasilkan kontras alami dengan kartu-kartu konten berwarna `#FFFFFF` tanpa mengharuskan garis tepi yang tebal.
2. **Sidebar Navigasi:** 
   * Lebar tetap 256px.
   * Menu terpilih menggunakan latar pastel `color-primary-soft` (`#EEF2FF`) dengan indikator aksen vertikal 3px di sisi kiri.
3. **Visualisasi Data (Charts):**
   * Jangan gunakan warna pastel murni tanpa saturasi pada garis atau batang grafik karena akan sulit dibedakan.
   * Gunakan shade pastel berpenjenuhan tinggi (misal: Indigo `#818CF8`, Sky `#38BDF8`, Coral `#F472B6`) dengan latar grid chart bernuansa lembut (`#F1F5F9`).

---

## 4. Checklist Aksesibilitas (WCAG 2.1 AA)

- [ ] Seluruh teks reguler (di bawah 18px) memiliki rasio kontras minimal 4.5:1 terhadap latar belakangnya.
- [ ] Teks berukuran besar (18px bold ke atas atau 24px reguler ke atas) memiliki rasio minimal 3.0:1.
- [ ] Status visual tidak hanya bergantung pada warna pastel, tetapi selalu disertai teks eksplisit atau ikon indikator.
- [ ] Komponen interaktif (input dan tombol) memiliki *visible focus state* yang kontras saat diakses via keyboard.
- [ ] Elemen form memiliki label eksplisit di luar field input (bukan sekadar placeholder).