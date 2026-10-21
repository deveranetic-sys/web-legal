# Gap Analysis — Legal Management System (LMS) vs e-Office SRS

**Date:** 2026-10-20
**Status:** Resolved Architecture & Decision Record (ADR Accepted)
**Scope:** Comparison and architectural resolution of the Legal Management System (LMS / Legal E-Office) against the existing e-Office requirements baseline and ERP platform capabilities.
**Related:** `docs/srs/SRS_ERP_Eranetic_v1.1_Client_SignOff.md`, `_archived/srs-versions/SRS_ERP_ERANETIC.md`, `analysis/implementation-track/feature-docs/eo-*.md`, `srs/02-foundation.md`, `srs/04-phase2-procurement.md`, `web-legal/docs/legal-e-office-docs/*`

---

## 1. Sources Compared

There is no standalone e-Office SRS file in the repository. The e-Office baseline is spread across:

1. `docs/srs/SRS_ERP_Eranetic_v1.1_Client_SignOff.md:321` — **MOD-07 e-Office, 10 features** (surat masuk/keluar, disposisi, memo, SK, arsip, rapat, tugas, analitik, e-Sign).
2. `_archived/srs-versions/SRS_ERP_ERANETIC.md:559` — detailed initial requirements `EO-6.1.x` through `EO-6.8.x` (auto-numbering, disposisi SLA, read receipts, full-text search, custom approval, analytics).
3. `analysis/implementation-track/feature-docs/eo-001` through `eo-006` — only 6 features have been broken down so far (inbox, outbox, disposisi, memo, notulen, arsip).
4. Current implementation reality: `era-eoffice-service` is still a **stub** (default GitLab README), and `eoffice.proto` is only a minimal MVP inbox/aggregator contract — no full e-Office implementation exists yet (`apps/shared/era-shared-go/proto/eranetic/eoffice/v1/eoffice.proto:1`).

The LMS proposal contains 14 submodules covering legal operations end-to-end.

---

## 2. Executive Summary

**LMS is not e-Office 2.0.** e-Office is a horizontal correspondence and disposition module; LMS is a vertical legal domain. The overlap is concentrated in document handling, archiving, correspondence, approval, and dashboards. Of the 14 LMS submodules:

- **2 high overlap:** Digital Vault (#11), Letter Register (#12)
- **6 medium/partial overlap:** Executive Dashboard (#1), Legal Service Request (#2), CLM (#3), Legal Opinion (#9), Clause Library (#10), RBAC/Audit (#14)
- **6 pure legal domains with no e-Office equivalent:** Tender (#4), Licensing (#5), Compliance (#6), Disputes (#7), LDD (#8), JDIH (#13)

**Accepted Direction:** Build LMS as an independent, pluggable service (`era-legal-service`) with a dedicated `legal` schema in each tenant database, reuse ERP platform services (Auth, Casbin, Storage, Audit), coordinate single-master contract ownership with Procurement, and integrate with e-Office for corporate letter numbering.

---

## 3. Similarity and Gap Matrix

| LMS Feature | e-Office / ERP Equivalent | Status | Main Gap & Resolution |
|---|---|---|---|
| #1 Executive Dashboard & Legal Analytics | EOF-09 Analytics; ERP dashboard | Partial | Legal KPIs: active contract value, expiry <60 days, tender readiness, dispute exposure, hearing calendar. |
| #2 Legal Service Request & SLA | EOF-08 Tasks; EO-6.2 SLA | Partial | Cross-unit intake ticketing, legal service categories, `LR-YYYY-XXXX` numbering, multi-tier chain approval. |
| #3 Contract Lifecycle & Addenda | **PRC-07 Vendor Contracts** (`srs/04-phase2-procurement.md:84`) | Duplicate / partial | **Resolved:** Unified contract master. Legal owns authoring, review, amendments, and approvals; Procurement enforces PO contract gate. |
| #4 Tender Management | — | Missing | Gap analysis, 6-dimension Go/No-Go, margin/HPS alerts, 4-gate review, SHA-256 submission lock, WON-to-contract conversion. *(Phase 2 - Gated)* |
| #5 Business Licensing (OSS RBA, PB-UMKU, IUP) | — | Missing | Permit registry, issuing authority, expiry monitoring H-90/60/30. |
| #6 Compliance Tracker | — | Missing | LKPM, RKL-RPL, WLKP, RKAB obligations, risk level, evidence tracking. |
| #7 Disputes, Litigation & Arbitration | — | Missing | Case registry, lawyer, PN/PT/MA/BANI/SIAC, exposure calculation, hearings, inkracht. |
| #8 Legal Due Diligence & M&A | — | Missing | Multi-aspect checklist, OK/FLAG/N/A toggles, 6 audit pillars, red flag risk ratings. |
| #9 Legal Opinion Workflow | Approval engine (`FOUND-002`) | Partial | Formal 6-section legal memo structure, internal hierarchical review and endorsement. |
| #10 Clause Library & Template Generator | EOF-04 memo templates; e-Sign template management | Partial | Clause taxonomy, BANI/FIDIC clauses, merge-field generator with interactive replacement. |
| #11 Digital Legal & Tender Vault | EOF-06 Digital Archive; `storage.files` | **High overlap** | **Resolved:** Unified storage bucket via `storage.files` with legal metadata, dual classification, legal hold, and watermarking. |
| #12 Legal Letter Register | EOF-01 / EOF-02 Incoming/Outgoing Letters | **High overlap** | **Resolved:** Single numbering sequence from e-Office (`doc_type=LEGAL`), letter content & 7/14 day deadline tracking owned by Legal. |
| #13 Regulation & Jurisprudence (JDIH) | — | Missing | Sectoral regulations, case law, critical articles, JDIH links. |
| #14 RBAC & Audit Trail | Foundation `F-01.3`, `F-01.7`, `audit.audit_logs` | **Already available** | **Resolved:** 13 granular rights mapped to Casbin policies; activity logs append to `audit.audit_logs`. |

---

## 4. Similarities and Reusable Platform Capabilities

- **SSO & identity:** JWT RS256, tenant membership, company switching (`srs/02-foundation.md:18`).
- **RBAC:** per-tenant Casbin policy, hierarchy `super_admin > admin > manager > staff > viewer`.
- **Audit trail:** append-only, immutable `audit.audit_logs` (`docs/impl/data-structure/01-foundation.md:495`).
- **Storage:** `storage.files` metadata with SHA-256 and back-reference to the owning module.
- **Approval engine:** generic multi-level approval used by HR, Procurement, Project, and e-Office (`FOUND-002`).
- **Notification:** event-driven email/push/in-app with timezone-aware delivery.
- **e-Sign:** signing, multi-party, audit trail, QR verification.
- **Process patterns:** auto-numbering, SLA/deadline tracking, classified archives, retention, analytics dashboards.
- **Multi-tenancy:** database-per-tenant with JWT `tid` (`docs/adr/ADR-002-database-per-tenant.md:26`).

---

## 5. Gaps in LMS Relative to the e-Office Baseline

- **Multi-level disposisi** and delegation chains (`EO-6.2.1`), including SLA escalation (`EO-6.2.3`). *(Addressed via LMS Multi-Tier Chain Approval Engine)*.
- **Read receipts** for memos/announcements (`EO-6.3.4`).
- **Meeting minutes, action items**, and links to project tasks (`eo-005`). *(Corporate sub-tab handles RUPS minutes)*.
- **SK and announcements**, plus tasks derived from letters/dispositions.
- **Full-text document search** (`EO-6.5.3`, P1).
- **Retention years** and classification levels: Biasa / Terbatas / Rahasia / Sangat Rahasia (`Q-3.39`).
- **Custom approval per document type** and conditional routing (`EO-6.7.1`).
- **e-Sign integration for outgoing letters** (`EOF-10`).
- **Unified inbox, global search, bookmarks, module activation** from the e-Office proto contract.

---

## 6. Gaps in e-Office Relative to LMS

If e-Office were used as the LMS foundation, the following must be built from scratch:

- Contract lifecycle, addenda, commitment value, delete protection, register export.
- Tender: gap analysis, 6-dimension scoring, margin/HPS alerts, 4-gate review, SHA-256 submission lock, WON-to-contract conversion.
- Licensing (OSS RBA/PB-UMKU/IUP) and compliance (LKPM/RKL-RPL/WLKP/RKAB).
- Disputes, litigation, arbitration, hearings, inkracht.
- LDD/M&A checklists, legal opinions, clause library, JDIH.
- Vault encryption, legal hold, and document-level ACL by classification.
- Legal-specific numbering and SLA rules.

---

## 7. Duplication and Conflict Points: Architectural Resolutions (ADRs)

1. **Contract Master (PRC-07 vs LMS #3):**
   - **Resolution: Single Contract Master.** Legal owns authoring, clause negotiation, addenda, and legal sign-off for all contract classes (vendor, customer, JV, NDA, land lease). Procurement acts as consumer, reading active contracts and enforcing the *PO Contract Gate* (no PO without valid active contract).
2. **Correspondence Numbering & Register (EOF-01/02 vs LMS #12):**
   - **Resolution: Unified Numbering, Specialized Register.** Legal letters (somasi, kuasa khusus, nota dinas) consume the official e-Office auto-numbering generator (`doc_type=LEGAL`). Letter metadata, confidential attachments, and strict 7/14-day reply deadlines are managed within Legal.
3. **Vault vs Archive (EOF-06 vs LMS #11):**
   - **Resolution: Unified Object Storage with Legal Namespace.** All files reside in `storage.files` (MinIO/S3), under tenant prefix `/tenants/{tid}/legal/`. Legal adds *dual classification* (`Rahasia`/`Sangat Rahasia`), *legal hold*, and automated *confidential watermarking*.
4. **RBAC & Audit Trail (FOUND-001 vs LMS #14):**
   - **Resolution: Reuse Foundation RBAC & Audit.** The 13 legal rights are mapped to Casbin policies (`legal:contract:approve`, `legal:dispute:view`, etc.). Every legal modification writes directly to `audit.audit_logs` with `module='legal'` and entity before/after snapshots.
5. **Approval Engine (FOUND-002 vs Chain Approval Engine):**
   - **Resolution: Hybrid Orchestration.** The frontend uses the interactive *Multi-Tier Chain Approval Stepper* (Maker ➔ Checker ➔ Approver). Backend transactions dispatch to `era-approval-service` with `transaction_type="LEGAL_REQUEST" | "LEGAL_CONTRACT" | "LEGAL_OPINION"`.
6. **Multi-Entity & Multi-Tenancy (`ADR-002`):**
   - **Resolution: Tenant Isolation with Asynchronous Aggregator.** Each tenant retains a private `legal` database schema. Holding-level executive consolidation is accomplished via asynchronous event aggregation (RabbitMQ ➔ Reporting Store), preserving strict tenant isolation.
7. **Protocol & Auth Protocol:**
   - **Resolution: ERP-Standard JWT RS256 & gRPC Bridge.** No redundant OAuth2/SAML servers. Frontend uses REST `/api/v1/legal/*` with JWT RS256 Bearer auth. Backend-to-backend communication uses gRPC with Protocol Buffers (`.proto`).

---

## 8. Recommended Architecture: `era-legal-service`

- Create **`era-legal-service`** (Golang Clean Architecture) with a `legal` schema in each tenant database.
- Position **e-Office as the general corporate correspondence front door**, while Legal owns contracts, licenses, compliance, litigation, and legal opinions.
- Fully consume ERP platform services: Auth JWT RS256, Casbin RBAC, MinIO `storage.files`, `era-approval-service`, `audit.audit_logs`, and Notification Service.
- Expose REST API via API Gateway (`/api/v1/legal/*`) and internal gRPC services for ERP modules.

---

## 9. Work Plan & Implementation Status

1. **[Completed] Decision records:** Confirmed `era-legal-service` as an independent pluggable module; single contract master; unified e-Office numbering.
2. **[Completed] Frontend implementation:** 16 sub-modules operational in Vue 3 (`web-legal`), with multi-tier Chain Approval, debounce search, pagination, and storage resilience.
3. **[In Progress] Domain and data model:** Go structs and PostgreSQL schema defined in `legal-e-office-docs/03-spesifikasi-api-dan-integrasi-golang.md`.
4. **[In Progress] API Client Layer:** Frontend abstraction layer (`apiClient.js`) supporting seamless transition from LocalStorage mock to Go REST endpoints.
5. **[Planned] Backend Service Deployment:** Deploy `era-legal-service` binary with JWT middleware and MinIO connector.

---

## 10. Formally Accepted Decisions (ADR Summary)

1. **Service Boundary:** **ACCEPTED — Build as `era-legal-service`**. Decoupled Go service/schema protecting core ERP from legal domain churn.
2. **Contract Master Ownership:** **ACCEPTED — Legal owns authoring/approval; Procurement consumes for PO gate**.
3. **Letter Register & Numbering:** **ACCEPTED — Single e-Office numbering engine with dedicated Legal register and confidential attachments**.
4. **Auth & Identity:** **ACCEPTED — Standard ERP JWT RS256 & Casbin RBAC**. No third-party OAuth2/SAML needed.
5. **Holding Consolidation:** **ACCEPTED — Asynchronous Event Aggregator**. Tenant database isolation is preserved while enabling Holding-level reporting.
