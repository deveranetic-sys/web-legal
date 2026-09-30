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
    this.get(STORAGE_KEYS.USERS, initialUsers);
    this.get(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
    this.get(STORAGE_KEYS.CURRENT_ENTITY, 'PT Nusantara Energi');
    this.get(STORAGE_KEYS.REQUESTS, initialRequests);
    this.get(STORAGE_KEYS.CONTRACTS, initialContracts);
    this.get(STORAGE_KEYS.CORPORATE, initialCorporate);
    this.get(STORAGE_KEYS.LICENSES, initialLicenses);
    this.get(STORAGE_KEYS.COMPLIANCE, initialCompliance);
    this.get(STORAGE_KEYS.DISPUTES, initialDisputes);
    this.get(STORAGE_KEYS.LDD, initialLDD);
    this.get(STORAGE_KEYS.LEGAL_OPINIONS, initialLegalOpinions);
    this.get(STORAGE_KEYS.DOCUMENTS, initialDocuments);
    this.get(STORAGE_KEYS.CORRESPONDENCE, initialCorrespondence);
    this.get(STORAGE_KEYS.KNOWLEDGE, initialKnowledge);
    this.get(STORAGE_KEYS.TEMPLATES, initialTemplates);
    this.get(STORAGE_KEYS.CLAUSES, initialClauses);
    this.get(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs);
    this.get(STORAGE_KEYS.TENDERS, initialTenders);
    this.get(STORAGE_KEYS.TENDER_VAULT, initialTenderVaultDocs);
    this.get(STORAGE_KEYS.TENDER_BONDS, initialTenderBonds);
    this.get(STORAGE_KEYS.MASTER_DOC_TYPES, initialMasterDocTypes);
    this.get(STORAGE_KEYS.MASTER_SECTORS, initialMasterSectors);
    this.get(STORAGE_KEYS.MASTER_STAGES, initialMasterTenderStages);
    this.get(STORAGE_KEYS.MASTER_CONTRACT_TYPES, initialMasterContractTypes);
    this.get(STORAGE_KEYS.ROLES_MATRIX, initialRolesMatrix);
    this.get(STORAGE_KEYS.APPROVAL_FLOWS, initialApprovalFlows);
    this.get(STORAGE_KEYS.ERP_INTEGRATIONS, initialErpIntegrations);
    this.get(STORAGE_KEYS.ERP_EMPLOYEES, initialErpEmployees);
  },

  resetStorage() {
    this.set(STORAGE_KEYS.USERS, initialUsers.map(u => ({
      ...u,
      nik: u.id.replace('USR-', 'EMP-010'),
      isErpSynced: true,
      erpSource: 'Workday HRIS',
      active: u.active !== undefined ? u.active : true
    })));
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
  }
};
