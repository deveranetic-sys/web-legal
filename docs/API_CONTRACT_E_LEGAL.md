# SPESIFIKASI KONTRAK API (API CONTRACT)
## ELegal Enterprise Legal Suite
**Base URL:** `/api/v1/legal`  
**Protokol:** RESTful JSON via HTTPS  
**Autentikasi:** Bearer Token (JWT / SSO ERP OAuth2)  
**Multi-Tenancy:** Header `X-Entity-ID`

---

## 1. STANDAR GLOBAL REQUEST & RESPONSE

### 1.1. Header Permintaan Standar
```http
Authorization: Bearer <jwt_erp_token>
X-Entity-ID: PT Nusantara Energi
Content-Type: application/json
Accept: application/json
```

### 1.2. Format Respons Sukses (Standard Success Envelope)
```json
{
  "success": true,
  "message": "Deskripsi singkat hasil operasi",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

### 1.3. Format Respons Galat (Standard Error Envelope)
```json
{
  "success": false,
  "error_code": "ERR_VALIDATION_FAILED",
  "message": "Validasi input formulir gagal",
  "errors": [
    {
      "field": "contract_number",
      "message": "Nomor kontrak sudah terdaftar di sistem"
    }
  ]
}
```

### 1.4. Penanganan Otorisasi & Hak Akses (RBAC Specification)
Sistem menggunakan dua kode status HTTP untuk mengontrol hak akses:
* **`HTTP 401 Unauthorized`:** Token tidak disertakan, format tidak valid, atau sesi kedaluwarsa. Frontend otomatis redirect ke halaman Login ERP.
* **`HTTP 403 Forbidden`:** Pengguna terautentikasi tetapi tidak memiliki hak akses (*capabilities*) untuk tindakan tersebut (contoh: *Requestor* mencoba menghapus kontrak).

#### Struktur Payload Token JWT dari ERP:
```json
{
  "sub": "usr-001",
  "email": "counsel@nusantara-energi.co.id",
  "name": "Budi Santoso, S.H., M.H.",
  "entity_id": "PT Nusantara Energi",
  "role": "LEGAL_COUNSEL",
  "exp": 1793540000
}
```

#### Pemetaan 5 Peran Baku Sistem (Standard Roles Matrix):
1. **`SUPER_ADMIN`**: Akses mutlak ke seluruh modul dan konfigurasi sistem.
2. **`LEGAL_HEAD` (Kepala Legal)**: Wewenang operasional penuh, review draf, persetujuan (*approval*), dan penugasan PIC.
3. **`LEGAL_COUNSEL` (Staff Legal)**: Registrasi kontrak, telaah draf, monitoring izin, update perkara. Dilarang melakukan *final approval* dan hapus data korporasi.
4. **`REQUESTOR` (Unit Bisnis ERP)**: Hanya dapat membuat tiket permohonan (*create request*), melihat status tiket milik sendiri, melihat template surat, dan membaca JDIH.
5. **`MANAGEMENT` (Direktur / Dewan Komisaris)**: Akses *read-only* ke Executive Dashboard, KPI, dan Laporan. Dilarang mengubah konfigurasi atau menghapus data transaksi.

---

## 2. KONTRAK ENDPOINT PER SUB-MVP

### 🔹 SUB-MVP 1: Foundation, Intake & Core Contracts

#### 1. Autentikasi & Sesi
* **`GET /api/v1/legal/auth/me`**
  * *Deskripsi:* Mengambil profil pengguna yang sedang login dari token SSO ERP.
  * *Response 200:*
    ```json
    {
      "success": true,
      "data": {
        "id": "usr-001",
        "name": "Budi Santoso, S.H., M.H.",
        "email": "counsel@nusantara-energi.co.id",
        "role": "LEGAL_COUNSEL",
        "entity": "PT Nusantara Energi",
        "permissions": ["contracts:create", "contracts:review", "requests:assign"]
      }
    }
    ```

#### 1.1. Matriks Peran & RBAC (Opsional / Admin Settings)
* **`GET /api/v1/legal/settings/roles-matrix`**
  * *Deskripsi:* Mengambil daftar peran dan kapabilitas izin yang berlaku di sistem.
  * *Response 200:* Mengembalikan kamus kapabilitas 5 peran standar.
* **`PUT /api/v1/legal/settings/roles-matrix/{role_key}`**
  * *Deskripsi:* Mengubah izin spesifik sebuah peran (khusus Superadmin).
  * *Payload:*
    ```json
    {
      "capabilities": {
        "contracts_create": true,
        "contracts_delete": false,
        "requests_assign": true
      }
    }
    ```

#### 2. Digital Legal Vault (File Storage)
* **`POST /api/v1/legal/vault/upload`**
  * *Content-Type:* `multipart/form-data`
  * *Payload:*
    * `file`: Binary (PDF, DOCX, XLSX - Max 15MB)
    * `category`: String (`CONTRACT`, `PERMIT`, `DEED`, `DISPUTE_EVIDENCE`)
    * `document_name`: String
  * *Response 201:*
    ```json
    {
      "success": true,
      "data": {
        "file_id": "fl-2026-9901",
        "file_url": "https://storage.internal/vault/fl-2026-9901.pdf",
        "file_name": "Perjanjian_PPA_2026.pdf",
        "file_size": 2450120,
        "mime_type": "application/pdf",
        "uploaded_at": "2026-11-02T10:15:30Z"
      }
    }
    ```

#### 3. Permintaan Layanan Legal (Legal Requests)
* **`GET /api/v1/legal/requests`**
  * *Query Params:* `page`, `limit`, `status` (`SUBMITTED`, `IN_REVIEW`, `OVERDUE`, `COMPLETED`), `urgency` (`HIGH`, `MEDIUM`, `LOW`), `search`
* **`POST /api/v1/legal/requests`**
  * *Payload:*
    ```json
    {
      "title": "Permohonan Telaah Addendum Kontrak EPC",
      "department": "Divisi Operasional & Rekayasa",
      "urgency": "HIGH",
      "expected_due_date": "2026-11-06",
      "description": "Perpanjangan masa penyelesaian proyek 45 hari kalender.",
      "attachment_file_ids": ["fl-2026-9901"]
    }
    ```
  * *Response 201:* Menghasilkan `ticket_number` otomatis (`REQ-2026-0042`).

* **`POST /api/v1/legal/requests/{id}/assign`**
  * *Payload:* `{ "assigned_counsel_id": "usr-001", "notes": "Segera telaah klausul denda." }`

#### 4. Manajemen Kontrak Korporasi (CLM)
* **`GET /api/v1/legal/contracts`**
  * *Query Params:* `page`, `limit`, `counterparty_id`, `type`, `status` (`ACTIVE`, `EXPIRING_SOON`, `EXPIRED`, `TERMINATED`)
* **`POST /api/v1/legal/contracts`**
  * *Payload:*
    ```json
    {
      "contract_number": "042/PPA/NE-PLN/XI/2026",
      "title": "Perjanjian Jual Beli Tenaga Listrik PLTU 2x100 MW",
      "counterparty_name": "PT PLN (Persero) Wilayah Sumbagsel",
      "contract_type": "PPA",
      "start_date": "2026-11-01",
      "end_date": "2051-11-01",
      "currency": "IDR",
      "contract_value": 450000000000,
      "payment_terms": "Termin bulanan sesuai volume kWh tersalurkan",
      "dispute_forum": "BANI",
      "vault_file_id": "fl-2026-9901"
    }
    ```
* **`POST /api/v1/legal/contracts/{id}/addenda`**
  * *Payload:*
    ```json
    {
      "addendum_number": "ADD-01/PPA/NE-PLN/2026",
      "effective_date": "2026-12-01",
      "new_end_date": "2052-12-01",
      "value_adjustment": 15000000000,
      "scope_changes": "Penambahan gardu transmisi 150 kV",
      "vault_file_id": "fl-2026-9905"
    }
    ```

---

### 🔹 SUB-MVP 2: Corporate Governance, Licensing & Legal Drafting

#### 5. Corporate Governance
* **`GET /api/v1/legal/corporate/profile`**
  * *Response 200:* Profil perseroan, Akta Pendirian, Akta Perubahan Terakhir, SK Kemenkumham, Daftar Pemegang Saham (*Cap Table*), dan Pengurus Aktif (Direksi/Komisaris).
* **`PUT /api/v1/legal/corporate/deeds`**
  * *Payload:* Pendaftaran atau pembaruan akta notaris dan nomor AHU.

#### 6. Perizinan Berusaha (Licensing)
* **`GET /api/v1/legal/licenses`**
  * *Query Params:* `status` (`ACTIVE`, `EXPIRING_90`, `EXPIRING_60`, `EXPIRING_30`, `EXPIRED`)
* **`POST /api/v1/legal/licenses`**
  * *Payload:* Nama Izin, Nomor SK/Izin, Instansi Penerbit (ESDM, BKPM, KLHK), Tanggal Terbit, Tanggal Kedaluwarsa, File Lampiran.

#### 7. Template & Klausul Baku Generator
* **`POST /api/v1/legal/templates/generate`**
  * *Payload:*
    ```json
    {
      "template_id": "TPL-SOMASI-01",
      "variables": {
        "letter_number": "012/LEGAL-SOM/NE/XI/2026",
        "debtor_name": "PT Mitra Bangun Perkasa",
        "contract_reference": "018/EPC/NE-MBP/2025",
        "claim_amount": "Rp 4.250.000.000,-",
        "deadline_days": 7,
        "dispute_forum": "BANI Jakarta"
      }
    }
    ```
  * *Response 200:* Mengembalikan teks draf lengkap siap pakai dan URL unduhan format `.docx`.

---

### 🔹 SUB-MVP 3: Compliance, Disputes & Legal Analysis

#### 8. Kepatuhan Regulasi (Compliance)
* **`GET /api/v1/legal/compliance`**
  * *Query Params:* `period_year`, `period_type` (`QUARTERLY`, `SEMESTER`, `ANNUAL`)
* **`PATCH /api/v1/legal/compliance/{id}/status`**
  * *Payload:* `{ "status": "COMPLIED", "bte_receipt_file_id": "fl-2026-9920", "notes": "Laporan LKPM Q3 disetujui BKPM" }`

#### 9. Sengketa & Litigasi (Disputes)
* **`GET /api/v1/legal/disputes`**
* **`POST /api/v1/legal/disputes`**
  * *Payload:*
    ```json
    {
      "case_number": "45021/I/ARB-BANI/2026",
      "case_name": "Sengketa Wanprestasi Perjanjian Pasokan Batubara",
      "forum": "BANI",
      "party_position": "PEMOHON",
      "opposing_party": "PT Bara Global Mandiri",
      "claim_value": 18500000000,
      "risk_level": "HIGH",
      "appointed_counsel": "Assegaf Hamzah & Partners",
      "next_hearing_date": "2026-11-18",
      "status": "IN_ARBITRATION"
    }
    ```

---

### 🔹 SUB-MVP 4: Executive Aggregation & Audit Trail

#### 10. Dashboard Eksekutif (KPI Aggregation)
* **`GET /api/v1/legal/dashboard/kpis`**
  * *Response 200:*
    ```json
    {
      "success": true,
      "data": {
        "active_contracts_count": 28,
        "total_contract_value_idr": 482000000000,
        "pending_requests_count": 6,
        "overdue_requests_count": 1,
        "expiring_contracts_30_days": 3,
        "compliance_percentage": 94.2,
        "dispute_exposure_total_idr": 23500000000,
        "upcoming_hearings_count": 2
      }
    }
    ```

#### 11. Log Audit Trail
* **`GET /api/v1/legal/activity-logs`**
  * *Query Params:* `page`, `limit`, `action_type`, `user_id`, `from_date`, `to_date`
