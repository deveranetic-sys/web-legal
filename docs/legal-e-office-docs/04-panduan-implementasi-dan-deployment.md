# 04. Panduan Implementasi & Deployment: Modul Legal E-Office

Dokumen ini memandu tim developer dalam menyiapkan struktur direktori backend Go, konfigurasi Docker multi-container, pengemasan frontend Vue 3, serta strategi deployment produksi.

---

## 1. Struktur Direktori Proyek Backend Go (Clean Architecture)

Disarankan mengadopsi standar *Standard Go Project Layout* agar kode terisolasi rapi dan mudah di-*maintain*:

```text
legal-eoffice-service/
├── cmd/
│   └── api/
│       └── main.go                 # Entry point aplikasi Go
├── config/
│   └── config.go                   # Pembaca variabel lingkungan (.env)
├── internal/
│   ├── delivery/
│   │   └── http/
│   │       ├── handler/            # HTTP Handlers (Template, Contract, Dispute, dll)
│   │       │   ├── template_handler.go
│   │       │   ├── contract_handler.go
│   │       │   └── correspondence_handler.go
│   │       ├── middleware/         # Auth JWT ERP, CORS, Logger, RBAC
│   │       └── router.go           # Definisi route /api/v1/legal/*
│   ├── domain/                     # Entities & Repository/Usecase Interfaces
│   │   ├── template.go
│   │   ├── contract.go
│   │   └── correspondence.go
│   ├── repository/                 # Implementasi database & storage
│   │   ├── postgres/               # Query GORM / pgx
│   │   └── minio/                  # Client S3 upload/download berkas
│   └── usecase/                    # Logika bisnis inti
│       ├── template_usecase.go
│       └── generator_usecase.go    # Generator naskah otomatis
├── migrations/                     # File migrasi SQL (.sql)
├── web/                            # Source code Frontend Vue 3 (dist/)
├── Dockerfile                      # Multi-stage Docker build
├── docker-compose.yml              # Orkestrasi lokal (Go + Postgres + MinIO + Redis)
└── go.mod
```

---

## 2. Pilihan Pengemasan Frontend Vue 3 ke Backend Go

Terdapat 2 strategi utama untuk menyajikan UI Legal E-Office:

### Strategi 1: Single Self-Contained Binary (`//go:embed`) — Sangat Praktis!
Frontend Vue 3 yang telah di-*build* (`npm run build`) dimasukkan langsung ke dalam binary Go menggunakan fitur native Go `embed.FS`. Dengan cara ini, Anda **hanya perlu mendistribusikan satu file binary executable Go** yang sudah mencakup API dan tampilan web.

```go
// cmd/api/main.go
package main

import (
	"embed"
	"io/fs"
	"net/http"
	"github.com/labstack/echo/v4"
)

//go:embed dist/*
var embeddedFiles embed.FS

func getFileSystem() http.FileSystem {
	fsys, err := fs.Sub(embeddedFiles, "dist")
	if err != nil {
		panic(err)
	}
	return http.FS(fsys)
}

func main() {
	e := echo.New()

	// 1. Daftarkan API routes
	api := e.Group("/api/v1/legal")
	// ... daftarkan handler API ...

	// 2. Sajikan frontend Vue 3 static assets
	assetHandler := http.FileServer(getFileSystem())
	e.GET("/*", echo.WrapHandler(assetHandler))

	e.Logger.Fatal(e.Start(":8080"))
}
```

### Strategi 2: Standalone Nginx / Micro-Frontend
Jika ERP Anda menggunakan arsitektur micro-frontend (misal: Single-SPA atau Nginx Reverse Proxy), frontend Vue 3 di-build terpisah dan disajikan di sub-path `/legal/`:

```nginx
# Nginx Configuration
location /legal/ {
    alias /var/www/legal-eoffice/dist/;
    try_files $uri $uri/ /legal/index.html;
}

location /api/v1/legal/ {
    proxy_pass http://legal-backend-service:8080/api/v1/legal/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 3. Konfigurasi Lingkungan (Environment Variables)

Buat file `.env` pada root project backend Go:

```env
# Server Config
APP_PORT=8080
APP_ENV=production

# Core ERP JWT Authentication
ERP_JWT_SECRET=rahasia-kunci-jwt-shared-dengan-erp-core
ERP_CORE_API_URL=http://erp-core-service:8000

# Database PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=supersecret
DB_NAME=erp_corporate_db
DB_SCHEMA=legal
DB_SSLMODE=disable

# MinIO / S3 Object Storage
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_TEMPLATES=legal-templates
MINIO_BUCKET_DOCS=legal-vault
MINIO_USE_SSL=false

# Redis Cache
REDIS_HOST=redis:6379
REDIS_PASSWORD=

# RabbitMQ Message Broker
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
```

---

## 4. Docker Compose Orchestration

Gunakan `docker-compose.yml` berikut untuk menjalankan seluruh stack modul Legal E-Office secara lokal atau pada server staging:

```yaml
version: '3.8'

services:
  # 1. Backend Go Legal E-Office
  legal-service:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: legal-eoffice-api
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - APP_PORT=8080
      - DB_HOST=postgres
      - MINIO_ENDPOINT=minio:9000
    depends_on:
      - postgres
      - minio
      - redis
    networks:
      - erp-network

  # 2. Database PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: legal-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: supersecret
      POSTGRES_DB: erp_corporate_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - erp-network

  # 3. MinIO Object Storage
  minio:
    image: minio/minio:RELEASE.2024-01-18T22-51-28Z
    container_name: legal-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - miniodata:/data
    networks:
      - erp-network

  # 4. Redis Cache
  redis:
    image: redis:7-alpine
    container_name: legal-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - erp-network

networks:
  erp-network:
    driver: bridge

volumes:
  pgdata:
  miniodata:
```

---

## 5. Dockerfile Multi-Stage Go & Vue 3

```dockerfile
# Stage 1: Build Frontend Vue 3
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build Backend Go
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app
RUN apk add --no-cache git
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Copy hasil build frontend ke folder embed Go
COPY --from=frontend-builder /app/dist ./dist
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /legal-app ./cmd/api/main.go

# Stage 3: Minimal Production Image
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=backend-builder /legal-app .
EXPOSE 8080
CMD ["./legal-app"]
```

---

## 6. Checklist Verifikasi & Go-Live

| Langkah | Item Uji | Kriteria Sukses |
|---|---|---|
| 1 | **Koneksi Database & Schema** | Tabel `legal.templates`, `legal.contracts`, `legal.correspondence` terbuat di PostgreSQL. |
| 2 | **Validasi JWT ERP** | Request tanpa token menghasilkan `401 Unauthorized`. Token valid dari ERP di-*decode* sempurna menjadi User ID & Roles. |
| 3 | **Upload File Template** | Pengguna mengunggah berkas `.docx`/`.pdf`, file tersimpan di MinIO bucket `legal-templates`, dan path file tercatat di database. |
| 4 | **Pencarian & Filter Surat** | Filter kategori (Surat Somasi, Kontrak, dll) dan query pencarian bekerja cepat dengan response time < 50ms. |
| 5 | **Unduh Berkas Asli** | Tombol unduh menghasilkan berkas asli yang sama persis dengan yang diunggah pengguna. |
| 6 | **Audit Trail Logging** | Setiap aksi penambahan template dan perubahan status kontrak menghasilkan baris log baru di `activity_logs`. |

---
*Dokumentasi Lengkap Legal E-Office Module siap digunakan oleh tim pengembang ERP.*
