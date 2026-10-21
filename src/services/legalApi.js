/**
 * Legal API Client Service
 * Service Boundary Adapter menghubungkan UI Vue 3 dengan backend REST API Go (/api/v1/legal)
 * atau fallback transparan ke reactive store & LocalStorage saat mode simulasi/mock aktif.
 */
import { legalStore } from '../stores/legalStore';
import { storage } from './storage';

const API_BASE_URL = import.meta.env.VITE_LEGAL_API_URL || '/api/v1/legal';
const IS_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Helper headers untuk request HTTP ke Go Backend
function getHeaders(isMultipart = false) {
  const token = localStorage.getItem('lms_auth_token') || 'mock-erp-jwt-token';
  const entity = legalStore.state.currentEntity || 'PT Nusantara Energi';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-Entity-ID': entity
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export const legalApi = {
  // Mode info
  isMockMode() {
    return IS_MOCK;
  },

  // ==========================================
  // 1. PERMINTAAN LEGAL & CHAIN APPROVAL
  // ==========================================
  async getRequests(params = {}) {
    if (IS_MOCK) {
      return {
        success: true,
        data: legalStore.state.requests || [],
        meta: { total: (legalStore.state.requests || []).length }
      };
    }
    const res = await fetch(`${API_BASE_URL}/requests?${new URLSearchParams(params)}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async createRequest(payload) {
    if (IS_MOCK) {
      const created = legalStore.addRequest(payload);
      return { success: true, message: 'Permintaan legal berhasil diajukan', data: created };
    }
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async advanceApprovalChain(id, decision, notes = '') {
    if (IS_MOCK) {
      const success = legalStore.advanceApprovalChain(id, decision, notes);
      return { success, message: success ? 'Keputusan otorisasi berhasil diproses' : 'Gagal otorisasi' };
    }
    const endpoint = decision === 'APPROVE' ? 'approve' : (decision === 'REVISION' ? 'revision' : 'reject');
    const res = await fetch(`${API_BASE_URL}/requests/${id}/${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    });
    return res.json();
  },

  // ==========================================
  // 2. KONTRAK & PO GATE (PRC-07)
  // ==========================================
  async getContracts(params = {}) {
    if (IS_MOCK) {
      return {
        success: true,
        data: legalStore.state.contracts || [],
        meta: { total: (legalStore.state.contracts || []).length }
      };
    }
    const res = await fetch(`${API_BASE_URL}/contracts?${new URLSearchParams(params)}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async createContract(payload) {
    if (IS_MOCK) {
      legalStore.addContract(payload);
      return { success: true, message: 'Kontrak baru berhasil diregistrasi' };
    }
    const res = await fetch(`${API_BASE_URL}/contracts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Endpoint validasi PO Contract Gate untuk modul Procurement (PRC-07)
  async checkContractGate(contractId) {
    if (IS_MOCK) {
      const contract = (legalStore.state.contracts || []).find(c => c.id === contractId);
      if (!contract) {
        return { success: false, message: 'Kontrak tidak ditemukan', data: { is_valid_for_po: false } };
      }
      const isActive = contract.status === 'ACTIVE';
      return {
        success: true,
        data: {
          contract_id: contract.id,
          contract_number: contract.contractNumber,
          counterparty: contract.counterparty,
          status: contract.status,
          is_valid_for_po: isActive,
          expiry_date: contract.expiryDate,
          total_value: contract.contractValue,
          currency: contract.currency || 'IDR',
          message: isActive ? 'Kontrak aktif dan valid untuk PO' : `Kontrak ${contract.status}, PO ditahan.`
        }
      };
    }
    const res = await fetch(`${API_BASE_URL}/contracts/${contractId}/gate-status`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // ==========================================
  // 3. KORESPONDENSI & e-OFFICE NUMBERING BRIDGE
  // ==========================================
  async getCorrespondence(params = {}) {
    if (IS_MOCK) {
      return {
        success: true,
        data: legalStore.state.correspondence || [],
        meta: { total: (legalStore.state.correspondence || []).length }
      };
    }
    const res = await fetch(`${API_BASE_URL}/correspondence?${new URLSearchParams(params)}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Minta nomor surat resmi dari engine e-Office (EOF-01/02)
  async generateEofficeNumber(docType = 'SOMASI') {
    if (IS_MOCK) {
      const seq = Math.floor(Math.random() * 80) + 20;
      const yr = new Date().getFullYear();
      const codeMap = {
        'SOMASI': 'LEG-SOM',
        'KUASA': 'LEG-SKU',
        'NOTA_DINAS': 'LEG-ND',
        'SURAT_KELUAR': 'LEG-OUT'
      };
      const typeCode = codeMap[docType] || 'LEG-KOR';
      const entityCode = legalStore.state.currentEntity.includes('Holdings') ? 'NHU' : 'NE';
      return {
        success: true,
        data: {
          letter_number: `${String(seq).padStart(3, '0')}/${typeCode}/${entityCode}/X/${yr}`,
          sequence_no: seq,
          reserved_at: new Date().toISOString()
        }
      };
    }
    const res = await fetch('/api/v1/eoffice/numbering/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        department: 'LEGAL',
        doc_type: docType,
        company_entity_id: legalStore.state.currentEntity,
        year: new Date().getFullYear()
      })
    });
    return res.json();
  },

  // ==========================================
  // 4. DIGITAL VAULT & OBJECT STORAGE
  // ==========================================
  async getVaultDocuments(params = {}) {
    if (IS_MOCK) {
      return {
        success: true,
        data: legalStore.state.documents || []
      };
    }
    const res = await fetch(`${API_BASE_URL}/documents?${new URLSearchParams(params)}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // ==========================================
  // 5. DIAGNOSTIK KONEKSI ERP
  // ==========================================
  async pingErpService(serviceCode = 'CORE_ERP') {
    const start = performance.now();
    try {
      if (IS_MOCK) {
        await new Promise(r => setTimeout(r, 65));
        const duration = Math.round(performance.now() - start);
        return {
          success: true,
          status: 'CONNECTED',
          latencyMs: duration,
          service: serviceCode,
          timestamp: new Date().toISOString()
        };
      }
      const res = await fetch(`${API_BASE_URL}/health`, { headers: getHeaders() });
      const duration = Math.round(performance.now() - start);
      return {
        success: res.ok,
        status: res.ok ? 'CONNECTED' : 'DEGRADED',
        latencyMs: duration,
        service: serviceCode
      };
    } catch (err) {
      return {
        success: false,
        status: 'DISCONNECTED',
        latencyMs: -1,
        error: err.message
      };
    }
  }
};
