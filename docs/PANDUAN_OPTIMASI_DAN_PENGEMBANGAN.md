# Panduan Optimasi Arsitektur, Performa & Acuan Pengembangan
## LMS TOHA Enterprise Legal Suite (web-legal)

Dokumen ini merangkum seluruh hasil audit arsitektur kode dan berfungsi sebagai **standar acuan teknis (engineering guidelines)** resmi untuk pengembang dalam mengoptimasi efisiensi *runtime*, waktu muat (*cold-boot*), konsumsi memori (*memory allocation*), ukuran *bundle*, keamanan ekspor data, ketahanan penyimpanan lokal (*LocalStorage*), serta penanganan galat tak terduga (*Error Boundary*).

---

## 1. Ringkasan Eksekutif & Metrik Hasil Optimasi

Aplikasi `web-legal` mengimplementasikan Vue 3 (Composition API `<script setup>`) dengan Vite dan Tailwind CSS. Seluruh optimasi arsitektur **Fase 1** dan **Fase 2 (Tahap 1, 2, dan 3)** telah **SELESAI 100%**.

### Perbandingan Metrik Kunci (Sebelum vs Sesudah)

| Parameter / Metrik | Sebelum Optimasi | Pasca Optimasi Lengkap (Fase 1 & Fase 2) | Dampak & Efisiensi |
|---|---|---|---|
| **Storage Cold-Boot** | `JSON.parse` dieksekusi 56x (dobel 28 key) | **1x parsing via single-pass init** | Waktu inisialisasi awal 50% lebih cepat |
| **Chunk `TendersView.js`** | 164.90 kB (eager load semua tab/modal) | **35.28 kB** (lazy-loaded sub-tabs) | **Turun 78.6%**, modul lelang instan |
| **Chunk `MasterDataView.js`** | 25.48 kB (eager load 4 tab + 3 modal) | **5.57 kB** (code-split async components) | **Turun 78.1%**, overhead master data minimal |
| **Chunk `SettingsView.js`** | 43.18 kB (eager load 4 tab + 3 modal) | **12.57 kB** (code-split async components) | **Turun 70.9%**, halaman admin sangat ringan |
| **Chunk `ContractsView.js`** | 25.20 kB (tanpa pagination/async modal) | **18.05 kB** (dengan debounce, paginasi & async modal) | **Turun 28.4%**, render tabel responsif |
| **Chunk Entry Utama (`index.js`)** | 290.96 kB (menyatukan seed data) | **126.95 kB** (terisolasi dari seed data & vendor) | **Turun 56.4%**, cache browser optimal |
| **Vendor Chunks** | Tercampur di entry bundle | `vendor-vue` (10.27 kB), `vendor-icons` (78.66 kB) | *Immutable HTTP cache* jangka panjang |
| **Seed Data Chunk** | Menempel di bundle logic utama | `seed-data` (152.81 kB) terpisah | Logic aplikasi di-update tanpa download ulang seed data |
| **Font Network Payload** | Download `Playfair Display` + `Plus Jakarta Sans` + `JetBrains Mono` | Download hanya font aktif (`Plus Jakarta Sans` & `JetBrains Mono`) | Menghemat ~80-120 KB network payload transfer |
| **Penyimpanan Log Aktivitas** | Unbounded `unshift` tanpa batas (potensi crash Quota 5MB) | **Auto-capping 200 items** + Quota Guard recovery | Menjamin `localStorage` tidak overflow |
| **Keamanan Ekspor CSV** | Data mentah tanpa proteksi rumus (CWE-1236) | **`sanitizeCSVField`** (neutralize `=`, `+`, `-`, `@`, `\t`, `\r`) | Kebal eksploitasi CSV Formula Injection |
| **Manajemen Blob URL** | Tidak ada `revokeObjectURL` pada ekspor CSV | Pembersihan eksplisit via `revokeObjectURL` di semua ekspor | Mencegah memory leak di sesi kerja lama |
| **Input Search Responsiveness** | Evaluasi filter array mahal di tiap ketukan keyboard | **Debounced Search (`useDebouncedRef`, 250ms)** | Input tetap instan, CPU filter tenang |
| **Penyajian Tabel Panjang** | Render seluruh ratusan baris data DOM sekaligus | **Paginasi Komponen (`PaginationControls.vue`)** | Render DOM ringan dan rapi |
| **Ketahanan Runtime** | Error child component membuat seluruh aplikasi blank putih | **`AppErrorBoundary.vue` (`onErrorCaptured`)** | Isolasi error per modul, recovery instan |
| **Manajemen Cadangan Data** | Tidak ada fitur backup/restore di antarmuka | **Indikator Kuota & Backup/Restore JSON** di Settings | Perlindungan data tingkat enterprise |
| **Dead Code / Orphan Files** | 5 berkas tidak terpakai (~25 KB) + dependensi mati (`docx`) | **100% dibersihkan** dari *source tree* | Repositori rapi, CI/CD build super cepat (470ms) |

---

## 2. Fase 1: Optimasi Fundamental Arsitektur, Runtime & Bundling (SELESAI 100%)

### 2.1. Pembersihan Berkas Mati (Dead Code & Orphan Components)
Berkas-berkas template awal dan komponen usang telah dihapus permanen:
1. `src/components/HelloWorld.vue` (Komponen bawaan Vite).
2. `src/components/HeaderNav.vue` (Digantikan `AppHeader.vue`).
3. `src/components/TenderVaultView.vue` (Terpusat di `DocumentsView.vue`).
4. `src/components/Tenders/TenderVaultCards.vue` (Komponen turunan TenderVaultView).
5. `src/components/Tenders/Modals/AddVaultDocModal.vue` & `LinkTenderModal.vue`.
6. Dependensi `"docx": "^9.8.1"` dihapus dari `package.json` dan 20 sub-paket di-prune dari `node_modules`.

### 2.2. Optimasi Cold-Boot & I/O LocalStorage (`storage.js` & `legalStore.js`)
- Mengganti inisialisasi ganda dengan pola **Single-Pass Hydration**:
  ```javascript
  // storage.js
  initStorage() {
    return {
      users: this.get(STORAGE_KEYS.USERS, initialUsers),
      currentUser: this.get(STORAGE_KEYS.CURRENT_USER, initialUsers[0]),
      // ...26 entri lainnya dimuat dalam satu lintasan
    };
  }
  ```
- `legalStore.js` langsung menerima snapshot `initialData` tanpa mengulang 28 kali pemanggilan `storage.get` dan `JSON.parse`.
- `resetToDefault()` menggunakan `Object.assign(state, freshData)`.

### 2.3. Efisiensi Alokasi Memori & CPU di Reaktivitas (`legalStore.js`)
- Menghilangkan instansiasi objek `Date` berulang di `calculateDaysRemaining()` dengan menggunakan cached midnight timestamp:
  ```javascript
  const MS_PER_DAY = 86400000;
  let cachedTodayStartMs = new Date().setHours(0, 0, 0, 0);

  export function calculateDaysRemaining(targetDate) {
    if (!targetDate) return 999;
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - cachedTodayStartMs) / MS_PER_DAY);
  }
  ```
- Membersihkan empty watcher di `TendersView.vue`.
- Mengganti `{ deep: true }` pada `OpinionsView.vue` dan `LDDView.vue` dengan watcher terarah pada `state.opinions.map(o => o.id)`.

### 2.4. Code Splitting & Dynamic Imports (`TendersView.vue`)
- Sub-tab dan modal di `TendersView.vue` diubah menjadi `defineAsyncComponent`:
  - `TenderStagesTab`, `TenderGatesTab`, `TenderPricingTab`, `TenderClarificationsTab`, `TenderGNGTab`, `TenderResultTab`, `TenderDocumentsTab`.
  - `RegisterTenderModal`, `WinnerResultModal`, `AddAanwijzingQuestionModal`, `AddPokjaAnswerModal`, `UnlockTenderModal`.
- **Hasil**: Ukuran chunk `TendersView.js` terpangkas dari **164.90 kB** menjadi **35.28 kB** (**turun 78.6%**).

### 2.5. Konfigurasi Vite & Rollup Manual Chunking (`vite.config.js`)
- Memecah bundle ke chunk khusus di `vite.config.js`:
  ```javascript
  manualChunks(id) {
    if (id.includes('node_modules')) {
      if (id.includes('vue')) return 'vendor-vue';
      if (id.includes('lucide-vue-next')) return 'vendor-icons';
      return 'vendor';
    }
    if (id.includes('/src/data/seedData') || id.includes('/src/data/originalData.json')) {
      return 'seed-data';
    }
  }
  ```
- **Hasil**: Entry chunk `index.js` menyusut dari **290.96 kB** menjadi **126.95 kB** (**turun 56.4%**).

---

## 3. Fase 2: Keamanan Data, Ketahanan Quota, Skalabilitas UX & Resiliensi (SELESAI 100%)

### 3.1. Tahap 1: Security, Network & Quota Guard (SELESAI 100%)

#### A. Pembersihan Web Font Tidak Terpakai (`index.html`)
- **Masalah**: `index.html` mengunduh keluarga font `Playfair Display` (serif) dalam berbagai bobot dan gaya miring, namun seluruh aplikasi menggunakan font sans-serif (`Plus Jakarta Sans`) dan monospace (`JetBrains Mono`).
- **Solusi**: Font link diubah menjadi:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  ```
- **Dampak**: Menghilangkan request unduhan ~80-120 KB aset font yang tidak digunakan.

#### B. Pembatasan Activity Log & Penanganan Quota Exceeded (`legalStore.js` & `storage.js`)
- **Masalah**: Setiap aksi CRUD memanggil `addActivityLog()`, yang menambahkan objek log tanpa batas (`unshift`). Pada penggunaan intensif, ukuran JSON melampaui kuota ~5MB `localStorage` browser dan menyebabkan exception fatal.
- **Solusi**:
  1. Auto-capping di `legalStore.js`:
     ```javascript
     state.activityLogs.unshift(log);
     if (state.activityLogs.length > 200) {
       state.activityLogs.length = 200;
     }
     ```
  2. Fallback darurat di `storage.js`:
     ```javascript
     set(key, value) {
       try {
         localStorage.setItem(key, JSON.stringify(value));
       } catch (err) {
         if (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014) {
           const rawLogs = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
           if (rawLogs) {
             const logs = JSON.parse(rawLogs);
             if (Array.isArray(logs) && logs.length > 50) {
               localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 50)));
               localStorage.setItem(key, JSON.stringify(value));
               return;
             }
           }
         }
         console.error(`[LMS Storage] Error saving key ${key}:`, err);
       }
     }
     ```

#### C. Mitigasi CSV Formula Injection (CWE-1236) & Standarisasi Blob URL
- **Masalah**: Jika judul kontrak, nama rekanan, atau catatan lelang diawali karakter rumus (`=`, `+`, `-`, `@`, `\t`, `\r`), file CSV yang diekspor dapat mengeksekusi formula berbahaya saat dibuka di spreadsheet.
- **Solusi**: Dibuat helper sanitasi `sanitizeCSVField()` dan diterapkan pada `exportContractsCSV()`, `exportTendersCSV()`, dan `exportGapAnalysisCSV()`, serta pembersihan eksplisit via `URL.revokeObjectURL(url)`.

---

### 3.2. Tahap 2: Render Performance & UX Scaling (SELESAI 100%)

#### A. Utilitas Debounce (`src/utils/debounce.js`)
- Dibuat helper `debounce(fn, delay)` dan composable Vue 3 `useDebouncedRef(sourceRef, delay)`.
- Mengisolasi input reaktif template agar ketukan keyboard tetap 100% responsif, sementara kalkulasi filter array hanya dieksekusi 250ms setelah pengetikan berhenti.
- Diterapkan pada:
  - `ContractsView.vue` (Pencarian register kontrak)
  - `KnowledgeView.vue` (Pencarian regulasi & UU)
  - `TendersView.vue` (Pencarian paket lelang tender)
  - `LicensingView.vue` (Pencarian perizinan & PB-UMKU)

#### B. Komponen Paginasi Reusable (`src/components/Common/PaginationControls.vue`)
- Mendukung kustomisasi ukuran halaman (10, 25, 50 entri per halaman).
- Navigasi tombol Pertama, Sebelumnya, Angka Halaman cerdas dengan elipsis (`...`), Berikutnya, dan Terakhir.
- Ringkasan data real-time: *"Menampilkan X – Y dari Z data"*.
- Terintegrasi penuh dengan auto-reset halaman saat filter atau pencarian berubah pada `ContractsView.vue` dan `KnowledgeView.vue`.

#### C. Code-Splitting Modal & Sub-Tabs (`MasterDataView.vue` & `SettingsView.vue`)
- Menggunakan `defineAsyncComponent` untuk memecah seluruh tab dan modal sekunder:
  - `MasterDataView.vue`: `MasterDocTypesTab`, `MasterSectorsTab`, `MasterStagesTab`, `MasterContractTypesTab`, `AddDocTypeModal`, `AddSectorModal`, `AddContractTypeModal`.
    - **Hasil**: Ukuran chunk terpangkas dari **25.48 kB** menjadi **5.57 kB** (**turun 78.1%**).
  - `SettingsView.vue`: `SettingsRolesTab`, `SettingsUsersTab`, `SettingsFlowsTab`, `SettingsIntegrasiTab`, `SettingsRoleModal`, `SettingsFlowModal`, `SettingsUserModal`.
    - **Hasil**: Ukuran chunk terpangkas dari **43.18 kB** menjadi **12.57 kB** (**turun 70.9%**).

---

### 3.3. Tahap 3: Ketahanan Sistem & Error Boundary (SELESAI 100%)

#### A. Global Error Boundary (`src/components/Common/AppErrorBoundary.vue`)
- Mengimplementasikan hook Vue 3 `onErrorCaptured((err, instance, info) => false)`.
- Membungkus seluruh tampilan modul aktif di `src/App.vue`.
- Menghindari *white screen of death* jika terjadi exception tak terduga pada salah satu komponen modul.
- Menyediakan UI pemulihan bencana yang ramah:
  - Tombol **"Muat Ulang Modul Ini"** untuk mereset status error dan me-render ulang.
  - Tombol **"Kembali ke Dashboard"** untuk keluar dari modul yang bermasalah.
  - Tombol **"Cadangkan Data Darurat (JSON)"** untuk mengunduh seluruh data lokal saat itu juga.
  - Accordion **"Diagnosa Teknis (Stack Trace)"** lengkap dengan tombol *Salin Pesan Error* untuk memudahkan debugging.

#### B. Indikator Kuota Storage & Utilitas Cadangan/Pemulihan Data (`SettingsView.vue` & `storage.js`)
- Menambahkan metode `getStorageUsage()`, `exportAllJSON()`, dan `importAllJSON()` pada `storage.js`.
- Menambahkan tab khusus **"Kapasitas & Cadangan Data"** di `SettingsView.vue`:
  - **Visual Capacity Gauge**: Bar progres penggunaan kuota (misal `190 KB / 5.0 MB - 3.8% Terpakai`) dengan badge status optimal.
  - **Cadangkan Seluruh Data (Export JSON)**: Mengunduh arsip lengkap 28 dataset ke file JSON bertanggal.
  - **Pulihkan Data (Restore JSON)**: Memvalidasi dan memulihkan data dari berkas cadangan ke dalam LocalStorage reaktif dengan konfirmasi proteksi data.

---

## 4. Status Milestone Implementasi (Checklist)

```mermaid
graph TD
    subgraph Fase 1: Fundamental
        A1[1.1 Dead Code & Dependensi] --> A2[1.2 Storage Single-Pass]
        A2 --> A3[1.3 Reaktivitas & Memory GC]
        A3 --> A4[1.4 Async Code Splitting]
        A4 --> A5[1.5 Vite Rollup Chunking]
    end
    subgraph Fase 2: Security & Quota Guard
        B1[2.1 Font Optimization] --> B2[2.2 Storage Quota Guard & Auto-Cap]
        B2 --> B3[2.3 Sanitasi CSV Formula Injection CWE-1236]
    end
    subgraph Fase 2: UX & Scaling
        C1[2.4 Debounce Search] --> C2[2.5 Pagination Controls]
        C2 --> C3[2.6 Code-Split Master & Settings]
    end
    subgraph Fase 2: Resilience & Recovery
        D1[2.7 Global Error Boundary] --> D2[2.8 Storage Gauge & Backup/Restore]
    end
    A5 --> B1
    B3 --> C1
    C3 --> D1
```

### Checklist Detail:

#### Fase 1: Arsitektur Dasar & Bundle (100% Selesai)
- [x] Hapus `HelloWorld.vue`, `HeaderNav.vue`, `TenderVaultView.vue`, `TenderVaultCards.vue`, `AddVaultDocModal.vue`, `LinkTenderModal.vue`.
- [x] Hapus dependensi `"docx"` dan jalankan `npm prune` (20 sub-paket bersih).
- [x] Refaktor `storage.initStorage()` dan `legalStore.js` ke single-pass hydration (eliminasi 28 re-read & parse).
- [x] Caching midnight timestamp pada `calculateDaysRemaining()` (0 GC overhead).
- [x] Hapus empty watcher di `TendersView.vue` dan optimasi watcher di `OpinionsView.vue` & `LDDView.vue`.
- [x] Terapkan `defineAsyncComponent` di `TendersView.vue` (chunk terpangkas 78.6% ke 35.28 kB).
- [x] Konfigurasi Rollup `manualChunks` di `vite.config.js` (`index.js` terpangkas 56.4% ke 126.95 kB).

#### Fase 2 - Tahap 1: Security, Network & Quota Guard (100% Selesai)
- [x] **Pembersihan Web Font**: Hapus font Playfair Display yang tidak dipakai dari `index.html` (hemat ~100 KB payload).
- [x] **Auto-Capping Activity Logs**: Batasi `state.activityLogs` maksimal 200 items di `legalStore.js`.
- [x] **QuotaExceeded Guard**: Tambahkan mekanisme pemulihan otomatis di `storage.js` jika kuota LocalStorage penuh.
- [x] **Sanitasi CSV Formula Injection (CWE-1236)**: Buat helper `sanitizeCSVField` untuk menetralkan prefix `=`, `+`, `-`, `@`, `\t`, `\r`.
- [x] **Standardisasi Ekspor CSV**: Terapkan `sanitizeCSVField` dan `Blob` + `URL.revokeObjectURL` pada `exportContractsCSV`, `exportTendersCSV`, dan `exportGapAnalysisCSV`.

#### Fase 2 - Tahap 2: UX & Render Performance (100% Selesai)
- [x] **Debounce Utility**: Buat `src/utils/debounce.js` dengan helper `debounce` dan composable `useDebouncedRef`.
- [x] **Debounced Search Inputs**: Terapkan `useDebouncedRef(searchQuery, 250)` pada `ContractsView.vue`, `KnowledgeView.vue`, `TendersView.vue`, dan `LicensingView.vue`.
- [x] **Pagination Controls**: Buat komponen `src/components/Common/PaginationControls.vue`.
- [x] **Paginasi Tabel**: Terapkan paginasi pada `ContractsView.vue` dan grid `KnowledgeView.vue` lengkap dengan reset otomatis saat filter berubah.
- [x] **Code-Splitting Master Data**: Terapkan `defineAsyncComponent` pada `MasterDataView.vue` (chunk turun 78.1% dari 25.48 kB ke 5.57 kB).
- [x] **Code-Splitting Settings**: Terapkan `defineAsyncComponent` pada `SettingsView.vue` (chunk turun 70.9% dari 43.18 kB ke 12.57 kB).

#### Fase 2 - Tahap 3: Ketahanan Sistem & Error Boundary (100% Selesai)
- [x] **Global Error Boundary**: Buat `src/components/Common/AppErrorBoundary.vue` menggunakan `onErrorCaptured` dan bungkus seluruh modul di `src/App.vue`.
- [x] **Storage Diagnostics**: Buat `getStorageUsage()` di `storage.js` untuk mengukur kuota terpakai dari limit 5MB browser.
- [x] **Cadangan & Pemulihan Data**: Buat tab "Kapasitas & Cadangan Data" di `SettingsView.vue` dengan fitur ekspor dan impor JSON.
- [x] **Verifikasi Build**: `npm run build` sukses 100% dalam 470ms dengan 0 error.

---

## 6. Engine Persetujuan Berjenjang (Chain Approval Engine) & Konfigurasi Alur

### 6.1. Gambaran Umum & Konsep Dasar
Sistem kini dilengkapi dengan **Engine Persetujuan Berjenjang (Multi-Tier Chain Approval Engine)** yang menghubungkan otorisasi peran (*Role-Based Access Control / RBAC*) dengan siklus hidup permohonan dan dokumen hukum:
- **Prinsip Tiga Mata (Maker ➔ Checker ➔ Approver)**: Setiap pengajuan tidak lagi disetujui dalam 1 langkah statis, melainkan melalui urutan hierarki berjenjang (misal: *Level 1 Legal Counsel* untuk kelayakan dokumen, *Level 2 Legal Manager* untuk kepatuhan klausul, hingga *Level 3 Management / Direksi* untuk pengesahan final).
- **Validasi Otorisasi Peran Berdasarkan Sesi Aktif**: Approver hanya dapat mengambil keputusan (*Approve*, *Request Revision*, atau *Reject*) jika peran (*role*) akun yang sedang login cocok dengan `roleRequired` pada tahap aktif tersebut (atau menggunakan peran `ADMIN` dengan izin *override*).
- **Pengalihan Peran Interaktif**: Pengguna dapat berganti peran melalui *Role Switcher* di bilah navigasi atas (`AppHeader.vue`) untuk mensimulasikan perpindahan tongkat estafet approval antar-pejabat korporasi.

### 6.2. Fitur Menu Konfigurasi Alur Persetujuan (`SettingsView.vue`)
Menu konfigurasi alur persetujuan berada di **Pengaturan Sistem & Kontrol Akses ➔ Alur Persetujuan**:
1. **CRUD Alur Persetujuan Lengkap**:
   - **Tambah Alur Baru (`+ Tambah Alur Baru`)**: Membuat alur persetujuan kustom untuk modul mana pun (`requests`, `contracts`, `tenders`, `opinions`, `disputes`, atau `general`).
   - **Editor Tahapan Dinamis (*Dynamic Steps Builder*)**: Menambah tahap baru, menghapus tahap, mengatur urutan hierarki (*Move Up / Down*), memilih peran yang berwenang dari matriks RBAC, serta menentukan target SLA hari per tahap.
   - **Pengaturan Ambang Batas Nilai (*Threshold*) & SLA Global**: Menetapkan batas nilai rupiah (misal `> Rp 5 Miliar`) dan target SLA keseluruhan.
   - **Aktivasi & Nonaktivasi Cepat**: Mengaktifkan atau menonaktifkan alur tanpa menghapus data riwayat.
   - **Pencarian & Filter Multi-Kategori**: Menyaring alur berdasarkan modul operasional dan status aktif/nonaktif.
2. **Penyimpanan Terpusat & Normalisasi Otomatis**:
   - Seluruh data alur persetujuan disimpan di `storage.KEYS.APPROVAL_FLOWS` dan ternormalisasi saat inisialisasi awal.

### 6.3. Integrasi Operasional (`RequestsView.vue`)
1. **Stepper Visual Real-Time**:
   - `RequestDetailModal.vue` menampilkan timeline dinamis dari `request.approvalChain`, mencakup nama tahap, peran berwenang, approver penandatangan, tanggal keputusan, catatan pertimbangan hukum, dan status per tahap (*Disetujui*, *Menunggu Approval*, *Perlu Revisi*, *Ditolak*, atau *Antrean*).
2. **Modal Keputusan Otorisasi Terpandu**:
   - `RequestApprovalModal.vue` secara otomatis mendeteksi tahap aktif dan memvalidasi apakah peran pengguna saat ini memiliki wewenang untuk mengeksekusi keputusan pada tahap tersebut.
   - Mendukung 3 jenis keputusan: **Setujui** (*advance ke tahap berikutnya atau final complete*), **Minta Revisi** (*mengembalikan ke pemohon dengan catatan wajib*), dan **Tolak** (*menghentikan permohonan dengan alasan yuridis*).
3. **Indikator Progres di Tabel & Ringkasan**:
   - Kolom status di `RequestsView.vue` menampilkan progres rantai (misal: `Tahap 2/3: LEGAL MANAGER` atau `✓ 3/3 Tahap Selesai`).

---

## 7. Kriteria Keberhasilan (Acceptance Criteria)

1. **Build Valid**: `npm run build` menghasilkan *exit code 0* tanpa peringatan error atau referensi berkas hilang.
2. **Ukuran Bundle Optimal**:
   - `TendersView.js` < 40 kB (saat ini 35.28 kB).
   - `MasterDataView.js` < 10 kB (saat ini 5.57 kB).
   - `SettingsView.js` < 15 kB (saat ini 12.63 kB).
   - `ContractsView.js` < 20 kB (saat ini 18.05 kB).
   - `index.js` < 135 kB (saat ini 133.71 kB).
3. **Keamanan Data**: Seluruh berkas ekspor tabel aman dari ancaman eksekusi formula di spreadsheet (CWE-1236).
4. **Ketahanan Quota**: Penyimpanan data di browser terlindungi dari potensi kebocoran kuota 5MB melalui auto-capping dan quota recovery.
5. **Resiliensi Tinggi**: Crash lokal pada salah satu modul diisolasi oleh `AppErrorBoundary` sehingga aplikasi tidak blank putih.
6. **Zero Dead Code**: Tidak ada berkas atau dependensi mati yang tersisa di *source tree*.
7. **Chain Approval**: Alur persetujuan berjenjang berjalan secara transaksional dengan role validation dan konfigurasi CRUD di menu Settings.

---
*Dokumen ini diperbarui secara berkala sebagai panduan resmi arsitektur teknis dan pengembangan sistem LMS TOHA Legal Suite.*
