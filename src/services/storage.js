import {
  initialUsers,
  initialRequests,
  initialContracts,
  initialCorporate,
  initialLicenses,
  initialCompliance,
  initialDisputes,
  initialLDD,
  initialLegalOpinions,
  initialDocuments,
  initialCorrespondence,
  initialKnowledge,
  initialTemplates,
  initialClauses,
  initialActivityLogs,
  initialTenders,
  initialTenderVaultDocs,
  initialTenderBonds,
  initialMasterDocTypes,
  initialMasterSectors,
  initialMasterTenderStages,
  initialMasterContractTypes,
  initialRolesMatrix,
  initialApprovalFlows,
  initialErpIntegrations,
  initialErpEmployees
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'lms_users_v1',
  CURRENT_USER: 'lms_current_user_v1',
  CURRENT_ENTITY: 'lms_current_entity_v1',
  REQUESTS: 'lms_requests_v1',
  CONTRACTS: 'lms_contracts_v1',
  CORPORATE: 'lms_corporate_v1',
  LICENSES: 'lms_licenses_v1',
  COMPLIANCE: 'lms_compliance_v1',
  DISPUTES: 'lms_disputes_v1',
  LDD: 'lms_ldd_v1',
  LEGAL_OPINIONS: 'lms_opinions_v1',
  DOCUMENTS: 'lms_documents_v1',
  CORRESPONDENCE: 'lms_correspondence_v1',
  KNOWLEDGE: 'lms_knowledge_v1',
  TEMPLATES: 'lms_templates_v1',
  CLAUSES: 'lms_clauses_v1',
  ACTIVITY_LOGS: 'lms_activity_logs_v1',
  TENDERS: 'lms_tenders_v2',
  TENDER_VAULT: 'lms_tender_vault_v1',
  TENDER_BONDS: 'lms_tender_bonds_v1',
  MASTER_DOC_TYPES: 'lms_master_doc_types_v1',
  MASTER_SECTORS: 'lms_master_sectors_v1',
  MASTER_STAGES: 'lms_master_stages_v1',
  MASTER_CONTRACT_TYPES: 'lms_master_contract_types_v1',
  ROLES_MATRIX: 'lms_roles_matrix_v1',
  APPROVAL_FLOWS: 'lms_approval_flows_v1',
  ERP_INTEGRATIONS: 'lms_erp_integrations_v1',
  ERP_EMPLOYEES: 'lms_erp_employees_v1'
};

export const storage = {
  KEYS: STORAGE_KEYS,

  get(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        if (fallback !== undefined) {
          this.set(key, fallback);
          return fallback;
        }
        return null;
      }
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[LMS Storage] Error retrieving key ${key}:`, err);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014) {
        console.warn(`[LMS Storage] LocalStorage Quota Exceeded saat menyimpan key '${key}'. Menjalankan prosedur pemulihan kuota...`);
        try {
          // Pangkas activity logs ke 50 data terbaru untuk mengosongkan kuota
          const rawLogs = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
          if (rawLogs) {
            const logs = JSON.parse(rawLogs);
            if (Array.isArray(logs) && logs.length > 50) {
              localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 50)));
              localStorage.setItem(key, JSON.stringify(value));
              console.info(`[LMS Storage] Kuota berhasil dipulihkan, key '${key}' tersimpan.`);
              return;
            }
          }
        } catch (cleanupErr) {
          console.error('[LMS Storage] Gagal memulihkan kuota storage:', cleanupErr);
        }
      }
      console.error(`[LMS Storage] Error saving key ${key}:`, err);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[LMS Storage] Error removing key ${key}:`, err);
    }
  },

  initStorage() {
    return {
      users: this.get(STORAGE_KEYS.USERS, initialUsers),
      currentUser: this.get(STORAGE_KEYS.CURRENT_USER, initialUsers[0]),
      currentEntity: this.get(STORAGE_KEYS.CURRENT_ENTITY, 'PT Nusantara Energi'),
      requests: this.get(STORAGE_KEYS.REQUESTS, initialRequests),
      contracts: this.get(STORAGE_KEYS.CONTRACTS, initialContracts),
      corporate: this.get(STORAGE_KEYS.CORPORATE, initialCorporate),
      licenses: this.get(STORAGE_KEYS.LICENSES, initialLicenses),
      compliance: this.get(STORAGE_KEYS.COMPLIANCE, initialCompliance),
      disputes: this.get(STORAGE_KEYS.DISPUTES, initialDisputes),
      ldd: this.get(STORAGE_KEYS.LDD, initialLDD),
      opinions: this.get(STORAGE_KEYS.LEGAL_OPINIONS, initialLegalOpinions),
      documents: this.get(STORAGE_KEYS.DOCUMENTS, initialDocuments),
      correspondence: this.get(STORAGE_KEYS.CORRESPONDENCE, initialCorrespondence),
      knowledge: this.get(STORAGE_KEYS.KNOWLEDGE, initialKnowledge),
      templates: this.get(STORAGE_KEYS.TEMPLATES, initialTemplates),
      clauses: this.get(STORAGE_KEYS.CLAUSES, initialClauses),
      activityLogs: this.get(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs),
      tenders: this.get(STORAGE_KEYS.TENDERS, initialTenders),
      tenderVault: this.get(STORAGE_KEYS.TENDER_VAULT, initialTenderVaultDocs),
      tenderBonds: this.get(STORAGE_KEYS.TENDER_BONDS, initialTenderBonds),
      masterDocTypes: this.get(STORAGE_KEYS.MASTER_DOC_TYPES, initialMasterDocTypes),
      masterSectors: this.get(STORAGE_KEYS.MASTER_SECTORS, initialMasterSectors),
      masterStages: this.get(STORAGE_KEYS.MASTER_STAGES, initialMasterTenderStages),
      masterContractTypes: this.get(STORAGE_KEYS.MASTER_CONTRACT_TYPES, initialMasterContractTypes),
      rolesMatrix: this.get(STORAGE_KEYS.ROLES_MATRIX, initialRolesMatrix),
      approvalFlows: this.get(STORAGE_KEYS.APPROVAL_FLOWS, initialApprovalFlows),
      erpIntegrations: this.get(STORAGE_KEYS.ERP_INTEGRATIONS, initialErpIntegrations),
      erpEmployees: this.get(STORAGE_KEYS.ERP_EMPLOYEES, initialErpEmployees)
    };
  },

  resetStorage() {
    const freshUsers = initialUsers.map(u => ({
      ...u,
      nik: u.id.replace('USR-', 'EMP-010'),
      isErpSynced: true,
      erpSource: 'Workday HRIS',
      active: u.active !== undefined ? u.active : true
    }));
    this.set(STORAGE_KEYS.USERS, freshUsers);
    this.set(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
    this.set(STORAGE_KEYS.CURRENT_ENTITY, 'PT Nusantara Energi');
    this.set(STORAGE_KEYS.REQUESTS, initialRequests);
    this.set(STORAGE_KEYS.CONTRACTS, initialContracts);
    this.set(STORAGE_KEYS.CORPORATE, initialCorporate);
    this.set(STORAGE_KEYS.LICENSES, initialLicenses);
    this.set(STORAGE_KEYS.COMPLIANCE, initialCompliance);
    this.set(STORAGE_KEYS.DISPUTES, initialDisputes);
    this.set(STORAGE_KEYS.LDD, initialLDD);
    this.set(STORAGE_KEYS.LEGAL_OPINIONS, initialLegalOpinions);
    this.set(STORAGE_KEYS.DOCUMENTS, initialDocuments);
    this.set(STORAGE_KEYS.CORRESPONDENCE, initialCorrespondence);
    this.set(STORAGE_KEYS.KNOWLEDGE, initialKnowledge);
    this.set(STORAGE_KEYS.TEMPLATES, initialTemplates);
    this.set(STORAGE_KEYS.CLAUSES, initialClauses);
    this.set(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs);
    this.set(STORAGE_KEYS.TENDERS, initialTenders);
    this.set(STORAGE_KEYS.TENDER_VAULT, initialTenderVaultDocs);
    this.set(STORAGE_KEYS.TENDER_BONDS, initialTenderBonds);
    this.set(STORAGE_KEYS.MASTER_DOC_TYPES, initialMasterDocTypes);
    this.set(STORAGE_KEYS.MASTER_SECTORS, initialMasterSectors);
    this.set(STORAGE_KEYS.MASTER_STAGES, initialMasterTenderStages);
    this.set(STORAGE_KEYS.MASTER_CONTRACT_TYPES, initialMasterContractTypes);
    this.set(STORAGE_KEYS.ROLES_MATRIX, initialRolesMatrix);
    this.set(STORAGE_KEYS.APPROVAL_FLOWS, initialApprovalFlows);
    this.set(STORAGE_KEYS.ERP_INTEGRATIONS, initialErpIntegrations);
    this.set(STORAGE_KEYS.ERP_EMPLOYEES, initialErpEmployees);

    return {
      users: freshUsers,
      currentUser: initialUsers[0],
      currentEntity: 'PT Nusantara Energi',
      requests: initialRequests,
      contracts: initialContracts,
      corporate: initialCorporate,
      licenses: initialLicenses,
      compliance: initialCompliance,
      disputes: initialDisputes,
      ldd: initialLDD,
      opinions: initialLegalOpinions,
      documents: initialDocuments,
      correspondence: initialCorrespondence,
      knowledge: initialKnowledge,
      templates: initialTemplates,
      clauses: initialClauses,
      activityLogs: initialActivityLogs,
      tenders: initialTenders,
      tenderVault: initialTenderVaultDocs,
      tenderBonds: initialTenderBonds,
      masterDocTypes: initialMasterDocTypes,
      masterSectors: initialMasterSectors,
      masterStages: initialMasterTenderStages,
      masterContractTypes: initialMasterContractTypes,
      rolesMatrix: initialRolesMatrix,
      approvalFlows: initialApprovalFlows,
      erpIntegrations: initialErpIntegrations,
      erpEmployees: initialErpEmployees
    };
  },

  getStorageUsage() {
    let totalBytes = 0;
    let lmsBytes = 0;
    let lmsKeyCount = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const val = localStorage.getItem(key) || '';
        const bytes = (key.length + val.length) * 2;
        totalBytes += bytes;
        if (key.startsWith('lms_')) {
          lmsBytes += bytes;
          lmsKeyCount++;
        }
      }
    } catch (e) {
      console.warn('[LMS Storage] Failed to compute storage stats:', e);
    }
    const maxBytes = 5 * 1024 * 1024;
    const percent = Math.min(100, Math.round((totalBytes / maxBytes) * 100 * 10) / 10);
    const formatKB = (b) => (b / 1024).toFixed(1) + ' KB';
    return {
      totalBytes,
      lmsBytes,
      totalFormatted: formatKB(totalBytes),
      lmsFormatted: formatKB(lmsBytes),
      maxBytes,
      maxFormatted: '5.0 MB',
      percent,
      lmsKeyCount
    };
  },

  exportAllJSON() {
    const backup = {
      app: 'LMS TOHA Enterprise Legal Suite',
      version: '2026.1',
      exportedAt: new Date().toISOString(),
      keys: {}
    };
    for (const key of Object.values(STORAGE_KEYS)) {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try {
          backup.keys[key] = JSON.parse(raw);
        } catch {
          backup.keys[key] = raw;
        }
      }
    }
    return backup;
  },

  importAllJSON(jsonObj) {
    if (!jsonObj || !jsonObj.keys || typeof jsonObj.keys !== 'object') {
      throw new Error('Format berkas cadangan tidak valid (kunci "keys" tidak ditemukan).');
    }
    let restoredCount = 0;
    for (const [storageKey, val] of Object.entries(jsonObj.keys)) {
      if (storageKey.startsWith('lms_')) {
        localStorage.setItem(storageKey, JSON.stringify(val));
        restoredCount++;
      }
    }
    return restoredCount;
  }
};
