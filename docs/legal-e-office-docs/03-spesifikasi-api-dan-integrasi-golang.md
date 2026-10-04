# 03. Spesifikasi API & Integrasi Backend Golang

Dokumen ini berisi spesifikasi teknis untuk developer backend Go (Golang) dalam mengimplementasikan endpoint REST API, model database PostgreSQL, penanganan file upload, serta integrasi webhook dengan Core ERP.

---

## 1. Konvensi REST API & Standar Respons

* **Base Path**: `/api/v1/legal`
* **Format Data**: JSON (`application/json`) dan `multipart/form-data` untuk upload berkas.
* **Header Wajib**:
  * `Authorization: Bearer <ERP_JWT_TOKEN>`
  * `X-Entity-ID: <ID_PERUSAHAAN_AKTIF>` (contoh: `PT_NUSANTARA_ENERGI`)
* **Format Respons Standar**:

```json
{
  "success": true,
  "message": "Data berhasil diproses",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

## 2. Struktur Model Domain Go (Golang Structs)

Berikut adalah definisi struct Go idiomatik yang dapat langsung dipasang ke dalam layer domain/repository backend:

```go
package domain

import (
	"time"
	"gorm.io/datatypes"
)

// 1. Template Dokumen & Surat
type LegalTemplate struct {
	ID              string         `gorm:"primaryKey;size:32" json:"id"`
	Title           string         `gorm:"size:255;not null;index" json:"title"`
	TemplateName    string         `gorm:"size:255;not null" json:"template_name"`
	Category        string         `gorm:"size:100;not null;index" json:"category"`
	Language        string         `gorm:"size:50;default:'Bahasa Indonesia'" json:"language"`
	Description     string         `gorm:"type:text" json:"description"`
	ContentSample   string         `gorm:"type:text" json:"content_sample"`
	ClausesIncluded datatypes.JSON `json:"clauses_included"` // Array string: ["Identitas Para Pihak", "Wanprestasi"]
	Tags            datatypes.JSON `json:"tags"`             // Array string: ["Somasi", "Surat Resmi"]
	FileName        *string        `gorm:"size:255" json:"file_name,omitempty"`
	FileSize        *string        `gorm:"size:50" json:"file_size,omitempty"`
	FileStorageKey  *string        `gorm:"size:500" json:"file_storage_key,omitempty"` // Path MinIO/S3
	CreatedBy       string         `gorm:"size:100" json:"created_by"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
}

// 2. Surat Menyurat & Korespondensi Hukum
type LegalCorrespondence struct {
	ID           string    `gorm:"primaryKey;size:32" json:"id"`
	LetterNumber string    `gorm:"size:100;uniqueIndex;not null" json:"letter_number"`
	Type         string    `gorm:"size:100;not null" json:"type"` // Somasi, Surat Kuasa, Tanggapan, SPK
	Subject      string    `gorm:"size:255;not null" json:"subject"`
	Summary      string    `gorm:"type:text" json:"summary"`
	Sender       string    `gorm:"size:255;not null" json:"sender"`
	Recipient    string    `gorm:"size:255;not null" json:"recipient"`
	Date         string    `gorm:"size:20;not null" json:"date"`
	Deadline     *string   `gorm:"size:20" json:"deadline,omitempty"`
	Status       string    `gorm:"size:50;default:'DRAFT'" json:"status"` // DRAFT, SENT, IN_REVIEW, CLOSED
	DocumentLink *string   `gorm:"size:500" json:"document_link,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// 3. Manajemen Kontrak (CLM)
type Contract struct {
	ID             string    `gorm:"primaryKey;size:32" json:"id"`
	ContractNumber string    `gorm:"size:100;uniqueIndex;not null" json:"contract_number"`
	ContractTitle  string    `gorm:"size:255;not null" json:"contract_title"`
	CompanyEntity  string    `gorm:"size:150;not null;index" json:"company_entity"`
	Counterparty   string    `gorm:"size:150;not null;index" json:"counterparty"`
	ContractType   string    `gorm:"size:100;not null" json:"contract_type"`
	EffectiveDate  time.Time `json:"effective_date"`
	ExpiryDate     time.Time `json:"expiry_date"`
	ContractValue  float64   `gorm:"type:decimal(18,2)" json:"contract_value"`
	Currency       string    `gorm:"size:10;default:'IDR'" json:"currency"`
	Status         string    `gorm:"size:50;default:'ACTIVE'" json:"status"` // ACTIVE, EXPIRED, TERMINATED
	KeyObligations string    `gorm:"type:text" json:"key_obligations"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// 4. Tiket Permintaan Layanan Hukum & Persetujuan
type LegalRequest struct {
	ID                  string     `gorm:"primaryKey;size:32" json:"id"`
	TicketNumber        string     `gorm:"size:50;uniqueIndex;not null" json:"ticket_number"`
	Requestor           string     `gorm:"size:150;not null" json:"requestor"`
	Department          string     `gorm:"size:100;not null" json:"department"`
	CompanyEntity       string     `gorm:"size:150;not null" json:"company_entity"`
	RequestType         string     `gorm:"size:100;not null" json:"request_type"`
	Subject             string     `gorm:"size:255;not null" json:"subject"`
	Description         string     `gorm:"type:text" json:"description"`
	Urgency             string     `gorm:"size:20;default:'MEDIUM'" json:"urgency"`
	Status              string     `gorm:"size:50;default:'SUBMITTED'" json:"status"` // SUBMITTED, IN_REVIEW, PENDING_APPROVAL, APPROVED, REVISION_REQUIRED, REJECTED, COMPLETED
	AssignedTo          string     `gorm:"size:150;default:'Unassigned'" json:"assigned_to"`
	Deadline            time.Time  `json:"deadline"`
	ApprovalNotes       *string    `gorm:"type:text" json:"approval_notes,omitempty"`
	ApprovedBy          *string    `gorm:"size:150" json:"approved_by,omitempty"`
	ApprovedAt          *time.Time `json:"approved_at,omitempty"`
	RejectionReason     *string    `gorm:"type:text" json:"rejection_reason,omitempty"`
	RejectedBy          *string    `gorm:"size:150" json:"rejected_by,omitempty"`
	RejectedAt          *time.Time `json:"rejected_at,omitempty"`
	RevisionNotes       *string    `gorm:"type:text" json:"revision_notes,omitempty"`
	RevisionRequestedBy *string    `gorm:"size:150" json:"revision_requested_by,omitempty"`
	RevisionRequestedAt *time.Time `json:"revision_requested_at,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}
```

---

## 3. Skrip DDL Database (PostgreSQL)

Jika tidak menggunakan fitur auto-migration GORM, jalankan skrip SQL berikut pada database PostgreSQL:

```sql
-- Buat Schema Khusus Legal E-Office di Database ERP
CREATE SCHEMA IF NOT EXISTS legal;

-- 1. Tabel Template Surat & Dokumen
CREATE TABLE legal.templates (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    language VARCHAR(50) DEFAULT 'Bahasa Indonesia',
    description TEXT,
    content_sample TEXT,
    clauses_included JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    file_storage_key VARCHAR(500),
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_category ON legal.templates(category);
CREATE INDEX idx_templates_search ON legal.templates USING gin(to_tsvector('indonesian', title || ' ' || COALESCE(description, '')));

-- 2. Tabel Surat Menyurat & Korespondensi
CREATE TABLE legal.correspondence (
    id VARCHAR(32) PRIMARY KEY,
    letter_number VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    summary TEXT,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'DRAFT',
    document_link VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Kontrak Bisnis (CLM)
CREATE TABLE legal.contracts (
    id VARCHAR(32) PRIMARY KEY,
    contract_number VARCHAR(100) NOT NULL UNIQUE,
    contract_title VARCHAR(255) NOT NULL,
    company_entity VARCHAR(150) NOT NULL,
    counterparty VARCHAR(150) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    contract_value NUMERIC(18, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'IDR',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    key_obligations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Rincian Endpoint REST API

### 4.1 Modul Template Surat & Dokumen

#### a. Tambah Template Baru (Dengan Upload Berkas)
* **Method & Endpoint**: `POST /api/v1/legal/templates`
* **Content-Type**: `multipart/form-data`
* **Form Fields**:
  * `label` (string, required): Nama template surat/kontrak
  * `category` (string, required): Kategori template
  * `description` (string, required): Deskripsi penggunaan
  * `language` (string, optional): Bahasa (default: *Bahasa Indonesia*)
  * `clauses_included` (string JSON, optional): Array klausul `["Wanprestasi", "Tenggat 7 Hari"]`
  * `content_sample` (string, optional): Bunyi naskah teks template
  * `file` (binary, optional): Berkas fisik `.docx`, `.pdf`, `.txt`

**Contoh Kode Handler Go (Echo Framework)**:

```go
package handler

import (
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"my-erp/internal/domain"
	"my-erp/internal/service"
)

type TemplateHandler struct {
	tmplService service.TemplateService
	storage     service.ObjectStorageService // MinIO client
}

func (h *TemplateHandler) CreateTemplate(c echo.Context) error {
	label := c.FormValue("label")
	category := c.FormValue("category")
	description := c.FormValue("description")
	language := c.FormValue("language")
	contentSample := c.FormValue("content_sample")

	if label == "" || description == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"error": "Field label dan deskripsi wajib diisi",
		})
	}

	newID := fmt.Sprintf("TMPL-%s", uuid.New().String()[:8])
	tmpl := &domain.LegalTemplate{
		ID:            newID,
		Title:         label,
		TemplateName:  label,
		Category:      category,
		Description:   description,
		Language:      language,
		ContentSample: contentSample,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// Handle Optional File Upload (.docx / .pdf / .txt)
	file, err := c.FormFile("file")
	if err == nil {
		src, err := file.Open()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membaca berkas"})
		}
		defer src.Close()

		storageKey := fmt.Sprintf("templates/%s%s", newID, filepath.Ext(file.Filename))
		err = h.storage.Upload(c.Request().Context(), storageKey, src, file.Size, file.Header.Get("Content-Type"))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menyimpan berkas ke MinIO"})
		}

		sizeStr := fmt.Sprintf("%.1f KB", float64(file.Size)/1024)
		tmpl.FileName = &file.Filename
		tmpl.FileSize = &sizeStr
		tmpl.FileStorageKey = &storageKey
	}

	created, err := h.tmplService.Save(c.Request().Context(), tmpl)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, echo.Map{
		"success": true,
		"message": "Template surat berhasil disimpan",
		"data":    created,
	})
}
```

#### b. Dapatkan Daftar Template & Filter
* **Method & Endpoint**: `GET /api/v1/legal/templates?category=SURAT&q=somasi`
* **Response 200 OK**:
```json
{
  "success": true,
  "data": [
    {
      "id": "TMPL-006",
      "title": "Surat Peringatan / Somasi Wanprestasi (Legal Notice)",
      "category": "Template Surat (Korespondensi / Somasi)",
      "description": "Format somasi pertama dan kedua kepada debitur atau vendor yang lalai memenuhi kewajiban kontraktual.",
      "file_name": "Format_Baku_Somasi_2026.docx",
      "file_size": "34.5 KB",
      "clauses_included": ["Dasar Perjanjian", "Uraian Kelalaian", "Tenggat Waktu 7 Hari"]
    }
  ]
}
```

#### c. Unduh File Template Asli
* **Method & Endpoint**: `GET /api/v1/legal/templates/:id/download`
* **Mekanisme**: Backend Go mengembalikan *HTTP 302 Redirect* ke MinIO Presigned URL atau melakukan *streaming file* langsung dengan header `Content-Disposition: attachment; filename="template.docx"`.

---

### 4.2 Modul Permintaan Legal & Alur Persetujuan (Approval)

#### a. Pengajuan Permohonan Legal Baru
* **Method & Endpoint**: `POST /api/v1/legal/requests`
* **Payload**:
```json
{
  "subject": "Telaah Draf Perjanjian Jual Beli Listrik 50 MW",
  "request_type": "Contract Review",
  "urgency": "HIGH",
  "company_entity": "PT Nusantara Energi",
  "deadline": "2026-10-10",
  "description": "Mohon telaah klausul wanprestasi dan SLA pembangkit..."
}
```

#### b. Otorisasi Persetujuan Permohonan (Approve)
* **Method & Endpoint**: `POST /api/v1/legal/requests/:id/approve`
* **Payload**:
```json
{
  "approval_notes": "Disetujui untuk diproses ke penandatanganan Direksi."
}
```
* **Respons**: Status tiket berubah menjadi `APPROVED`.

#### c. Permintaan Revisi / Klarifikasi (Request Revision)
* **Method & Endpoint**: `POST /api/v1/legal/requests/:id/revision`
* **Payload**:
```json
{
  "revision_notes": "Lampirkan kalkulasi HPS dan legalitas vendor sebelum review dilanjutkan."
}
```
* **Respons**: Status tiket berubah menjadi `REVISION_REQUIRED`.

#### d. Penolakan Permohonan (Reject)
* **Method & Endpoint**: `POST /api/v1/legal/requests/:id/reject`
* **Payload**:
```json
{
  "rejection_reason": "Bertentangan dengan batas kewenangan anggaran perseroan."
}
```
* **Respons**: Status tiket berubah menjadi `REJECTED`.

---

### 4.3 Webhook & Event Integration (RabbitMQ)

Ketika sebuah peristiwa penting terjadi di modul Legal, backend Go mempublikasikan pesan ke RabbitMQ agar modul ERP lain dapat merespons:

```json
// Routing Key: legal.contract.signed
{
  "event": "CONTRACT_SIGNED",
  "timestamp": "2026-10-04T10:00:00Z",
  "data": {
    "contract_id": "CTR-2026-008",
    "contract_number": "SPK/PROC/2026/044",
    "vendor_id": "VND-0881",
    "total_value": 450000000.00,
    "currency": "IDR",
    "status": "ACTIVE"
  }
}
```

*Modul Keuangan (Finance ERP)* yang mendengarkan event ini akan membuka kunci (*unfreeze*) status Purchase Order terkait sehingga uang muka dapat dibayarkan.

---
*Lanjutkan ke dokumen [04-panduan-implementasi-dan-deployment.md](./04-panduan-implementasi-dan-deployment.md) untuk petunjuk setup dan deployment.*
