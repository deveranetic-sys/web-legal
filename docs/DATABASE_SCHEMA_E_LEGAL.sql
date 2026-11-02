-- ==============================================================================
-- DDL SKEMA BASIS DATA RELASIONAL: ELEGAL ENTERPRISE LEGAL SUITE
-- Target RDBMS: PostgreSQL 14+ / 16+
-- Skema Terisolasi: legal
-- Standar: Clean Architecture, UUID Primary Keys, Audit Timestamps, Indexing
-- ==============================================================================

-- 1. Inisialisasi Ekstensi & Skema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE SCHEMA IF NOT EXISTS legal;

-- ==============================================================================
-- 2. MASTER DATA & MULTI-TENANCY
-- ==============================================================================

-- 2.1. Tabel Entitas Perseroan (Holding & Anak Perusahaan)
CREATE TABLE legal.entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,                -- misal: 'NE-HOLDING', 'NHU', 'STG'
    name VARCHAR(255) NOT NULL,                      -- 'PT Nusantara Energi'
    alias VARCHAR(100),                              -- 'Nusantara Energi Group'
    tax_id VARCHAR(50),                              -- NPWP Badan
    nib VARCHAR(50),                                 -- Nomor Induk Berusaha OSS
    address TEXT,
    phone VARCHAR(50),
    email citext,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2.2. Tabel Rekanan / Lawan Transaksi (Counterparties / Vendors / Partners)
CREATE TABLE legal.counterparties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    code VARCHAR(50) UNIQUE NOT NULL,                -- misal: 'VND-2026-001'
    name VARCHAR(255) NOT NULL,                      -- 'PT PLN (Persero)'
    category VARCHAR(50) NOT NULL,                   -- 'BUMN', 'SWASTA', 'VENDOR_EPC', 'KONSULTAN'
    tax_id VARCHAR(50),                              -- NPWP Rekanan
    legal_domicile TEXT,
    pic_name VARCHAR(150),
    pic_phone VARCHAR(50),
    pic_email citext,
    bank_account_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. DIGITAL LEGAL VAULT (REPOSITORI BERKAS TERPUSAT)
-- ==============================================================================

CREATE TABLE legal.vault_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    file_code VARCHAR(100) UNIQUE NOT NULL,          -- 'FL-2026-0042'
    title VARCHAR(255) NOT NULL,                     -- Nama berkas tampilan
    original_file_name VARCHAR(255) NOT NULL,        -- 'Kontrak_EPC_Final_Signed.pdf'
    storage_bucket VARCHAR(100) NOT NULL,            -- 'legal-vault'
    storage_object_path TEXT NOT NULL,               -- 'contracts/2026/11/fl-2026-0042.pdf'
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,                 -- 'application/pdf'
    file_hash_sha256 VARCHAR(64),                    -- Anti-tampering checksum
    category VARCHAR(50) NOT NULL,                   -- 'CONTRACT', 'PERMIT', 'DEED', 'DISPUTE_EVIDENCE', 'OPINION'
    is_legal_hold BOOLEAN DEFAULT FALSE,             -- Proteksi hapus saat ada sengketa
    uploaded_by_user_id VARCHAR(100) NOT NULL,
    uploaded_by_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. SUB-MVP 1: PERMINTAAN LEGAL & KONTRAK (CLM)
-- ==============================================================================

-- 4.1. Tabel Permohonan Layanan Hukum (Legal Requests / Ticketing)
CREATE TABLE legal.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,       -- 'REQ-2026-0042'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,                   -- 'CONTRACT_REVIEW', 'LEGAL_OPINION', 'DISPUTE_SUPPORT', 'LICENSING'
    department VARCHAR(100) NOT NULL,                -- Divisi Pemohon di ERP
    requester_user_id VARCHAR(100) NOT NULL,
    requester_name VARCHAR(150) NOT NULL,
    requester_email citext NOT NULL,
    urgency VARCHAR(20) DEFAULT 'MEDIUM',            -- 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
    status VARCHAR(30) DEFAULT 'SUBMITTED',          -- 'SUBMITTED', 'ASSIGNED', 'IN_REVIEW', 'REVISION_REQUIRED', 'COMPLETED', 'REJECTED'
    description TEXT NOT NULL,
    expected_due_date DATE NOT NULL,
    sla_working_days INT DEFAULT 3,
    sla_status VARCHAR(20) DEFAULT 'ON_TRACK',       -- 'ON_TRACK', 'NEARING_DEADLINE', 'OVERDUE'
    assigned_counsel_user_id VARCHAR(100),
    assigned_counsel_name VARCHAR(150),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4.2. Tabel Relasi Lampiran Berkas Permohonan
CREATE TABLE legal.request_attachments (
    request_id UUID NOT NULL REFERENCES legal.requests(id) ON DELETE CASCADE,
    vault_file_id UUID NOT NULL REFERENCES legal.vault_files(id) ON DELETE RESTRICT,
    PRIMARY KEY (request_id, vault_file_id)
);

-- 4.3. Tabel Manajemen Kontrak (Contract Lifecycle Management)
CREATE TABLE legal.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    counterparty_id UUID NOT NULL REFERENCES legal.counterparties(id) ON DELETE RESTRICT,
    contract_number VARCHAR(100) UNIQUE NOT NULL,    -- '042/PPA/NE-PLN/XI/2026'
    title VARCHAR(255) NOT NULL,
    contract_type VARCHAR(50) NOT NULL,              -- 'PPA', 'EPC', 'CSA', 'LEASE', 'SUPPLY', 'SERVICES', 'NDA'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR',
    contract_value NUMERIC(18, 2) DEFAULT 0,
    payment_terms TEXT,
    penalties_clause TEXT,
    dispute_forum VARCHAR(50) DEFAULT 'BANI',        -- 'BANI', 'PN_JAKARTA_SELATAN', 'SIAC'
    status VARCHAR(30) DEFAULT 'ACTIVE',             -- 'DRAFT', 'IN_REVIEW', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'TERMINATED'
    vault_file_id UUID REFERENCES legal.vault_files(id) ON DELETE SET NULL,
    created_by_user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4.4. Tabel Riwayat Adendum Kontrak
CREATE TABLE legal.contract_addenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES legal.contracts(id) ON DELETE CASCADE,
    addendum_number VARCHAR(100) NOT NULL,           -- 'ADD-01/PPA/NE-PLN/2026'
    effective_date DATE NOT NULL,
    new_end_date DATE,
    value_adjustment NUMERIC(18, 2) DEFAULT 0,
    scope_changes TEXT,
    reason TEXT NOT NULL,
    vault_file_id UUID REFERENCES legal.vault_files(id) ON DELETE SET NULL,
    created_by_user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. SUB-MVP 2: CORPORATE GOVERNANCE, PERIZINAN & DRAFTING
-- ==============================================================================

-- 5.1. Akta Notaris & SK Kemenkumham Perseroan
CREATE TABLE legal.corporate_deeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE CASCADE,
    deed_type VARCHAR(50) NOT NULL,                  -- 'PENDIRIAN', 'PERUBAHAN_ANGGARAN_DASAR', 'PERUBAHAN_DIREKSI'
    deed_number VARCHAR(100) NOT NULL,               -- 'Akta No. 45'
    deed_date DATE NOT NULL,
    notary_name VARCHAR(150) NOT NULL,
    sk_menkumham_number VARCHAR(100),                -- 'AHU-0012984.AH.01.01.TAHUN 2015'
    sk_menkumham_date DATE,
    summary_clauses TEXT,
    vault_file_id UUID REFERENCES legal.vault_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5.2. Buku Daftar Pemegang Saham (Cap Table & Beneficial Ownership)
CREATE TABLE legal.corporate_shareholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE CASCADE,
    shareholder_name VARCHAR(255) NOT NULL,
    shareholder_type VARCHAR(30) NOT NULL,           -- 'INDIVIDU', 'BADAN_HUKUM'
    total_shares BIGINT NOT NULL,
    nominal_value NUMERIC(18, 2) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,               -- Persentase kepemilikan (misal: 65.50%)
    is_beneficial_owner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5.3. Susunan Direksi & Dewan Komisaris
CREATE TABLE legal.corporate_executives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE CASCADE,
    position_type VARCHAR(30) NOT NULL,              -- 'DIREKSI', 'KOMISARIS'
    title VARCHAR(100) NOT NULL,                     -- 'Direktur Utama', 'Komisaris Independen'
    full_name VARCHAR(150) NOT NULL,
    id_card_number VARCHAR(50),                      -- NIK KTP / Paspor
    tax_id VARCHAR(50),                              -- NPWP Pribadi
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    is_authorized_signatory BOOLEAN DEFAULT FALSE,   -- Berhak tanda tangan kontrak/bank
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5.4. Perizinan Berusaha (OSS RBA, IUP, PB-UMKU)
CREATE TABLE legal.licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    license_type VARCHAR(50) NOT NULL,               -- 'OSS_RBA', 'PB_UMKU', 'IUP_OPERASI', 'AMDAL_SKKL', 'SLO'
    license_number VARCHAR(100) UNIQUE NOT NULL,     -- '540/12/IUP-OP/ESDM/2024'
    title VARCHAR(255) NOT NULL,                     -- 'Izin Usaha Pertambangan Operasi Produksi'
    issuing_authority VARCHAR(150) NOT NULL,         -- 'Kementerian ESDM', 'BKPM', 'KLHK'
    issued_date DATE NOT NULL,
    expiry_date DATE NOT NULL,                       -- Dasar perhitungan H-90, H-60, H-30
    status VARCHAR(30) DEFAULT 'ACTIVE',             -- 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'IN_RENEWAL'
    notes TEXT,
    vault_file_id UUID REFERENCES legal.vault_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5.5. Template Draf & Klausul Baku Generator
CREATE TABLE legal.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_code VARCHAR(50) UNIQUE NOT NULL,       -- 'TPL-SOMASI-01', 'TPL-NDA-01'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,                   -- 'SOMASI', 'NDA', 'POWER_OF_ATTORNEY', 'LEGAL_MEMO'
    body_content TEXT NOT NULL,                      -- Konten dengan {{merge_fields}}
    available_variables JSONB NOT NULL DEFAULT '[]', -- Variabel isian yang wajib diisi
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5.6. Korespondensi Surat & Pelacak Somasi
CREATE TABLE legal.correspondence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    letter_type VARCHAR(20) NOT NULL,                -- 'SURAT_MASUK', 'SURAT_KELUAR'
    letter_number VARCHAR(100) UNIQUE NOT NULL,
    letter_date DATE NOT NULL,
    received_or_sent_date DATE NOT NULL,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    is_somasi BOOLEAN DEFAULT FALSE,
    somasi_deadline_date DATE,                       -- Tanggal batas respon somasi (7/14 hari)
    somasi_status VARCHAR(30),                       -- 'WAITING_RESPONSE', 'RESPONDED', 'IGNORED'
    vault_file_id UUID REFERENCES legal.vault_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. SUB-MVP 3: KEPATUHAN, SENGKETA & ANALISIS HUKUM
-- ==============================================================================

-- 6.1. Kepatuhan Regulasi Berkala (Compliance Obligations)
CREATE TABLE legal.compliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    obligation_name VARCHAR(255) NOT NULL,           -- 'Pelaporan LKPM Triwulan IV', 'RKL-RPL Semester II'
    governing_body VARCHAR(100) NOT NULL,            -- 'BKPM', 'Kementerian Lingkungan Hidup', 'Kemenaker'
    period_year INT NOT NULL,
    period_type VARCHAR(20) NOT NULL,                -- 'QUARTERLY', 'SEMESTER', 'ANNUAL'
    due_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'IN_PROGRESS',        -- 'COMPLIED', 'IN_PROGRESS', 'OVERDUE'
    receipt_evidence_id UUID REFERENCES legal.vault_files(id) ON DELETE SET NULL, -- Bukti Tanda Terima (BTE)
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6.2. Sengketa & Litigasi Korporasi (Disputes & Arbitration)
CREATE TABLE legal.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    case_number VARCHAR(100) UNIQUE NOT NULL,        -- '45021/I/ARB-BANI/2026'
    case_name VARCHAR(255) NOT NULL,
    forum VARCHAR(50) NOT NULL,                      -- 'BANI', 'PN_JAKARTA_PUSAT', 'MAHKAMAH_AGUNG', 'PHI'
    company_position VARCHAR(30) NOT NULL,           -- 'PENGGUGAT', 'TERGUGAT', 'PEMOHON', 'TERMOHON'
    opposing_party VARCHAR(255) NOT NULL,
    claim_amount NUMERIC(18, 2) DEFAULT 0,           -- Nilai eksposur tuntutan finansial
    risk_level VARCHAR(20) DEFAULT 'MEDIUM',         -- 'LOW', 'MEDIUM', 'HIGH'
    external_counsel VARCHAR(255),                   -- Kantor Advokat yang ditunjuk
    status VARCHAR(30) DEFAULT 'ONGOING',            -- 'ONGOING', 'APPEAL', 'CASSATION', 'INKRACHT'
    inkracht_decision TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6.3. Agenda Sidang Perkara
CREATE TABLE legal.dispute_hearings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES legal.disputes(id) ON DELETE CASCADE,
    hearing_date TIMESTAMPTZ NOT NULL,
    agenda VARCHAR(255) NOT NULL,                    -- 'Pemeriksaan Saksi Ahli', 'Pembacaan Putusan'
    attendee_counsel VARCHAR(150),
    outcome_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6.4. Kajian Opini Hukum Formal (Legal Opinions)
CREATE TABLE legal.opinions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    opinion_number VARCHAR(100) UNIQUE NOT NULL,     -- 'LO/2026/XI/004'
    title VARCHAR(255) NOT NULL,
    background TEXT NOT NULL,                        -- Bab 1: Latar Belakang
    legal_issues TEXT NOT NULL,                      -- Bab 2: Pokok Permasalahan
    material_facts TEXT NOT NULL,                    -- Bab 3: Fakta Material
    legal_analysis TEXT NOT NULL,                    -- Bab 4: Analisis Yuridis
    conclusion TEXT NOT NULL,                        -- Bab 5: Kesimpulan
    recommendations TEXT NOT NULL,                  -- Bab 6: Rekomendasi Mitigasi
    author_counsel_user_id VARCHAR(100) NOT NULL,
    approved_by_user_id VARCHAR(100),
    status VARCHAR(30) DEFAULT 'DRAFT',             -- 'DRAFT', 'UNDER_REVIEW', 'ENDORSED'
    vault_file_id UUID REFERENCES legal.vault_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6.5. Checklist Legal Due Diligence (LDD Uji Tuntas)
CREATE TABLE legal.ldd_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    target_company_name VARCHAR(255) NOT NULL,       -- Entitas yang diaudit
    audit_purpose VARCHAR(255) NOT NULL,             -- 'Akuisisi 51% Saham', 'Kemitraan Strategis'
    overall_risk_rating VARCHAR(20) DEFAULT 'MEDIUM',-- 'LOW', 'MEDIUM', 'HIGH'
    summary_findings TEXT,
    lead_counsel_user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE legal.ldd_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES legal.ldd_audits(id) ON DELETE CASCADE,
    pillar VARCHAR(50) NOT NULL,                     -- 'CORPORATE', 'ASSET', 'CONTRACT', 'LABOR', 'PERMIT', 'LITIGATION'
    item_title VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'OK',                 -- 'OK', 'FLAG', 'NA'
    findings_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6.6. Basis Regulasi & JDIH Eksternal
CREATE TABLE legal.knowledge_regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulation_type VARCHAR(50) NOT NULL,            -- 'UU', 'PP', 'PERMEN_ESDM', 'PERMEN_LHK', 'PUTUSAN_MA'
    regulation_number VARCHAR(100) NOT NULL,         -- 'UU No. 3 Tahun 2020'
    title VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,                    -- 'Pertambangan', 'Ketenagalistrikan', 'Ketenagakerjaan'
    official_jdih_url TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. SUB-MVP 4: AUDIT TRAIL LOGGING
-- ==============================================================================

CREATE TABLE legal.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES legal.entities(id) ON DELETE RESTRICT,
    action_type VARCHAR(30) NOT NULL,                -- 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'DOWNLOAD_FILE', 'EXPORT_CSV'
    module_name VARCHAR(50) NOT NULL,                -- 'contracts', 'requests', 'licenses', 'disputes'
    target_record_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 8. INDEXING UNTUK OPTIMASI PERFORMA & QUERY CEPAT
-- ==============================================================================

CREATE INDEX idx_requests_entity_status ON legal.requests(entity_id, status);
CREATE INDEX idx_requests_assigned_counsel ON legal.requests(assigned_counsel_user_id);
CREATE INDEX idx_contracts_entity_status ON legal.contracts(entity_id, status);
CREATE INDEX idx_contracts_end_date ON legal.contracts(end_date);
CREATE INDEX idx_licenses_expiry_date ON legal.licenses(expiry_date);
CREATE INDEX idx_disputes_forum_status ON legal.disputes(forum, status);
CREATE INDEX idx_compliances_period ON legal.compliances(period_year, status);
CREATE INDEX idx_activity_logs_created ON legal.activity_logs(created_at DESC);
CREATE INDEX idx_vault_files_entity_cat ON legal.vault_files(entity_id, category);
