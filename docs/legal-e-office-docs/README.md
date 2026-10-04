# Dokumentasi Modul Legal E-Office
### Enterprise Legal Management System (LMS) – Sub-Modul ERP Berbasis Golang & Vue 3

Dokumentasi ini dirancang khusus untuk memandu pemisahan dan integrasi **Legal E-Office** sebagai **modul mandiri (*independent pluggable module*)** ke dalam ekosistem **Enterprise Resource Planning (ERP)** perusahaan yang menggunakan backend **Go (Golang)**.

---

## 📑 Daftar Isi Dokumentasi

| No | Dokumen | Deskripsi Isi | Tautan Berkas |
|---|---|---|---|
| 1 | **Arsitektur & Tech Stack** | Arsitektur microservice/modular monolith Go, stack frontend Vue 3, shared JWT auth, database isolation, object storage, dan pola integrasi ERP | [01-arsitektur-dan-techstack.md](./01-arsitektur-dan-techstack.md) |
| 2 | **Katalog Fitur & Spesifikasi** | Rincian lengkap 16 modul bisnis legal: CLM, Surat & Somasi, Tender Vault, Jaminan Bank, Perizinan OSS, Sengketa & Arbitrase, LDD, Template Generator, dll | [02-katalog-fitur-dan-spesifikasi.md](./02-katalog-fitur-dan-spesifikasi.md) |
| 3 | **Spesifikasi API & Integrasi Go** | Desain REST API / gRPC, Go structs, GORM/pgx models, DDL PostgreSQL schema, Webhook, dan middleware komunikasi antar-modul ERP | [03-spesifikasi-api-dan-integrasi-golang.md](./03-spesifikasi-api-dan-integrasi-golang.md) |
| 4 | **Panduan Implementasi & Deployment** | Struktur folder proyek Go, pengemasan frontend (Micro-Frontend / `embed.FS`), Docker Compose multi-container, dan checklist go-live | [04-panduan-implementasi-dan-deployment.md](./04-panduan-implementasi-dan-deployment.md) |

---

## 🎯 Tujuan Pemisahan Modul

1. **Decoupled Architecture**: Legal E-Office memiliki logika domain hukum yang spesifik dan independen, sehingga tidak membebani core engine ERP (akuntansi/keuangan/inventory), namun tetap berbagi data master entitas, vendor, dan user.
2. **Backend Golang High Performance**: Memanfaatkan kecepatan, efisiensi memori, dan konkurensi native Go untuk melayani penanganan berkas legal, pencarian klausul teks, dan otomasi alur persetujuan (*approval flows*).
3. **Frontend Interaktif & Modern**: Mengadopsi Vue 3 Composition API dengan Tailwind CSS dan Vite yang dapat di-*mount* langsung sebagai micro-frontend atau sub-route dalam dashboard utama ERP.
4. **Keamanan & Kepatuhan Tinggi**: Data hukum seperti sengketa, legal opinion, dan hasil uji tuntas (LDD) memerlukan isolasi izin hak akses (RBAC ketat) yang terpisah dari staf operasional umum ERP.

---

## 🏗️ Gambaran Integrasi Tingkat Tinggi

```mermaid
flowchart TB
    subgraph Client ["Client Browser / Desktop"]
        ERP_UI["ERP Main Shell (Vue / React / Web)"]
        LEGAL_UI["Legal E-Office UI (Vue 3 + Vite)"]
    end

    subgraph GatewayLayer ["API Gateway / Reverse Proxy"]
        NGINX["Nginx / Envoy / Traefik Gateway"]
    end

    subgraph CoreERP ["Core ERP System"]
        GO_CORE["Core ERP Backend (Golang)"]
        CORE_DB[("Core ERP Database\nPostgreSQL")]
    end

    subgraph LegalModule ["Legal E-Office Module"]
        GO_LEGAL["Legal Service Backend (Golang)"]
        LEGAL_DB[("Legal Schema / DB\nPostgreSQL")]
        MINIO[("Object Storage\nMinIO / S3\nBerkas & Warkat")]
    end

    subgraph SharedServices ["Shared Infrastructure"]
        REDIS[("Redis Cache & PubSub")]
        RABBIT[("Message Broker\nRabbitMQ / Kafka")]
    end

    ERP_UI --> NGINX
    LEGAL_UI --> NGINX

    NGINX -->|/api/v1/erp/*| GO_CORE
    NGINX -->|/api/v1/legal/*| GO_LEGAL

    GO_CORE <--> CORE_DB
    GO_LEGAL <--> LEGAL_DB
    GO_LEGAL <--> MINIO

    GO_CORE <--> RABBIT
    GO_LEGAL <--> RABBIT
    GO_LEGAL <--> REDIS
    GO_CORE <--> REDIS
```

---
*Dibuat untuk Tim Rekayasa Perangkat Lunak & Legal Corporate Perseroan.*
