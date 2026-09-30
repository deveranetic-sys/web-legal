import { reactive, computed } from 'vue';
import { storage } from '../services/storage';
import {
  masterSectorChecklists,
  masterSectorStageGuidance,
  initialRolesMatrix,
  initialApprovalFlows,
  initialErpIntegrations,
  initialCapabilityList,
  initialErpEmployees
} from '../data/seedData';

// Initialize storage on load
storage.initStorage();

const state = reactive({
  users: storage.get(storage.KEYS.USERS, []),
  currentUser: storage.get(storage.KEYS.CURRENT_USER, null),
  currentEntity: storage.get(storage.KEYS.CURRENT_ENTITY, 'PT Nusantara Energi'),
  
  // Navigation & View
  activeModule: 'dashboard',
  activeTenderTab: 'pipeline',
  initialSelectId: null,
  isMobileSidebarOpen: false,
  isSearchModalOpen: false,
  isNotificationDrawerOpen: false,

  // Datasets
  requests: storage.get(storage.KEYS.REQUESTS, []),
  contracts: storage.get(storage.KEYS.CONTRACTS, []),
  corporate: storage.get(storage.KEYS.CORPORATE, []),
  licenses: storage.get(storage.KEYS.LICENSES, []),
  compliance: storage.get(storage.KEYS.COMPLIANCE, []),
  disputes: storage.get(storage.KEYS.DISPUTES, []),
  ldd: storage.get(storage.KEYS.LDD, []),
  opinions: storage.get(storage.KEYS.LEGAL_OPINIONS, []),
  documents: storage.get(storage.KEYS.DOCUMENTS, []),
  correspondence: storage.get(storage.KEYS.CORRESPONDENCE, []),
  knowledge: storage.get(storage.KEYS.KNOWLEDGE, []),
  templates: storage.get(storage.KEYS.TEMPLATES, []),
  clauses: storage.get(storage.KEYS.CLAUSES, []),
  activityLogs: storage.get(storage.KEYS.ACTIVITY_LOGS, []),
  tenders: storage.get(storage.KEYS.TENDERS, []),
  tenderVault: storage.get(storage.KEYS.TENDER_VAULT, []),
  tenderBonds: storage.get(storage.KEYS.TENDER_BONDS, []),
  masterDocTypes: storage.get(storage.KEYS.MASTER_DOC_TYPES, []),
  masterSectors: storage.get(storage.KEYS.MASTER_SECTORS, []),
  masterStages: storage.get(storage.KEYS.MASTER_STAGES, {}),
  masterContractTypes: storage.get(storage.KEYS.MASTER_CONTRACT_TYPES, []),
  rolesMatrix: storage.get(storage.KEYS.ROLES_MATRIX, initialRolesMatrix),
  approvalFlows: storage.get(storage.KEYS.APPROVAL_FLOWS, initialApprovalFlows),
  erpIntegrations: storage.get(storage.KEYS.ERP_INTEGRATIONS, initialErpIntegrations),
  erpEmployees: storage.get(storage.KEYS.ERP_EMPLOYEES, initialErpEmployees),
  capabilityList: initialCapabilityList,
  selectedTenderId: 'TND-2026-001',

  // Toast feedback
  toast: {
    show: false,
    message: '',
    type: 'success'
  }
});

// Format currency
export function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

// Calculate days remaining from today
export function calculateDaysRemaining(targetDate) {
  if (!targetDate) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Badges and counts
const badges = computed(() => {
  const pendingRequests = state.requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'CLOSED').length;
  const expiringContracts = state.contracts.filter(c => {
    const days = calculateDaysRemaining(c.expiryDate);
    return days <= 30 && c.status !== 'EXPIRED';
  }).length;
  const overdueCompliance = state.compliance.filter(c => c.status === 'OVERDUE').length;
  const activeDisputes = state.disputes.filter(d => d.status !== 'SETTLED' && d.status !== 'WON' && d.status !== 'CLOSED').length;
  const pendingOpinions = state.opinions.filter(o => o.approval === 'PENDING_APPROVAL').length;
  const activeTenders = state.tenders.filter(t => t.status === 'ACTIVE').length;
  const tendersWithMissingDocs = state.tenders.filter(t => t.status === 'ACTIVE' && t.documents?.some(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA')).length;

  return {
    pendingRequests,
    expiringContracts,
    overdueCompliance,
    activeDisputes,
    pendingOpinions,
    activeTenders,
    tendersWithMissingDocs
  };
});

// Computed KPIs for Dashboard
const kpis = computed(() => {
  const activeContracts = state.contracts.filter(c => c.status === 'ACTIVE');
  const criticalContracts = state.contracts.filter(c => {
    const days = calculateDaysRemaining(c.expiryDate);
    return days <= 7 && c.status !== 'EXPIRED';
  });
  const totalContractValue = state.contracts.reduce((acc, c) => {
    const val = Number(c.contractValue) || 0;
    return acc + (c.currency === 'USD' ? val * 15500 : val);
  }, 0);

  const pendingRequests = state.requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'CLOSED');
  const overdueRequests = state.requests.filter(r => {
    if (r.status === 'OVERDUE') return true;
    const days = calculateDaysRemaining(r.deadline);
    return days < 0 && r.status !== 'COMPLETED' && r.status !== 'CLOSED';
  });

  return {
    totalRequestsCount: state.requests.length,
    pendingRequestsCount: pendingRequests.length,
    overdueRequestsCount: overdueRequests.length,
    activeContractsCount: activeContracts.length,
    expiringContractsCount: badges.value.expiringContracts,
    criticalContractsCount: criticalContracts.length,
    totalContractsCount: state.contracts.length,
    totalContractValue,
    activeDisputesCount: badges.value.activeDisputes,
    complianceScore: 85
  };
});

// Computed Urgent Watchlist
const urgentContracts = computed(() => {
  return [...state.contracts]
    .filter(c => c.status !== 'EXPIRED')
    .map(c => ({
      ...c,
      daysRemaining: calculateDaysRemaining(c.expiryDate)
    }))
    .filter(c => c.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 4);
});

// RBAC Permissions Evaluator
export function hasPermission(module, action = 'view') {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;

  if (role === 'ADMIN') return true;

  if (role === 'REQUESTOR') {
    if (['dashboard', 'requests', 'knowledge', 'templates'].includes(module.toLowerCase())) {
      if (module.toLowerCase() === 'requests') {
        return action === 'view' || action === 'create';
      }
      return action === 'view';
    }
    return false;
  }

  if (role === 'MANAGEMENT') {
    return action !== 'delete';
  }

  if (role === 'LEGAL MANAGER') return true;

  if (role === 'LEGAL COUNSEL') {
    if (action === 'delete' && ['corporate', 'settings', 'activity'].includes(module.toLowerCase())) {
      return false;
    }
    return true;
  }

  if (role === 'LEGAL STAFF') {
    if (action === 'approve') return false;
    if (action === 'delete' && ['disputes', 'ldd', 'corporate', 'settings'].includes(module.toLowerCase())) {
      return false;
    }
    return true;
  }

  return true;
}

export const legalStore = {
  state,
  badges,
  kpis,
  urgentContracts,
  hasPermission,
  canAccess: hasPermission,

  exportContractsCSV() {
    let csv = 'ID,Perusahaan,Mitra Rekanan,Nomor Kontrak,Judul Kontrak,Jenis,Masa Berlaku,Nilai Kontrak,Status\n';
    state.contracts.forEach(c => {
      csv += `"${c.id}","${c.company}","${c.counterparty}","${c.contractNumber}","${c.contractTitle}","${c.contractType}","${c.effectiveDate} s/d ${c.expiryDate}","${c.contractValue}","${c.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LMS_Register_Kontrak_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.addActivityLog('EXPORT_CSV', 'Manajemen Kontrak', 'ALL', 'Ekspor berkas CSV register kontrak');
    this.triggerToast('Berkas CSV register kontrak berhasil diunduh.', 'success');
  },

  // Navigation
  navigate(moduleId, selectId = null) {
    if (moduleId === 'tenders' || moduleId === 'tender-pipeline') {
      state.activeModule = 'tenders';
      state.activeTenderTab = 'pipeline';
    } else if (moduleId === 'tender-documents' || moduleId === 'tender-gap') {
      state.activeModule = 'tenders';
      state.activeTenderTab = 'gap-analysis';
    } else if (moduleId === 'tender-vault') {
      state.activeModule = 'documents';
    } else if (moduleId === 'tender-bonds') {
      state.activeModule = 'tenders';
      state.activeTenderTab = 'bonds';
    } else {
      state.activeModule = moduleId;
    }
    state.initialSelectId = selectId;
    if (selectId && state.activeModule === 'tenders') {
      state.selectedTenderId = selectId;
    }
    state.isMobileSidebarOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setTenderTab(tab) {
    state.activeTenderTab = tab;
  },

  setSelectedTender(id) {
    state.selectedTenderId = id;
  },

  // Role switching
  switchRole(role) {
    const foundUser = state.users.find(u => u.role === role) || state.users[0];
    state.currentUser = foundUser;
    storage.set(storage.KEYS.CURRENT_USER, foundUser);
    this.addActivityLog('SWITCH_ROLE', 'Sistem', foundUser.id, `Pengguna berganti peran ke: ${role} (${foundUser.name})`);
    this.triggerToast(`Beralih peran ke: ${role} (${foundUser.name})`, 'info');
  },

  // Entity switching
  changeEntity(entity) {
    state.currentEntity = entity;
    storage.set(storage.KEYS.CURRENT_ENTITY, entity);
    this.triggerToast(`Entitas perseroan aktif: ${entity}`, 'info');
  },

  // Toast feedback
  triggerToast(message, type = 'success') {
    state.toast.message = message;
    state.toast.type = type;
    state.toast.show = true;
    setTimeout(() => {
      state.toast.show = false;
    }, 3500);
  },

  // Activity Log
  addActivityLog(action, module, recordId, description) {
    const log = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: state.currentUser ? state.currentUser.name : 'System User',
      module: module || 'General',
      action: action || 'ACTION',
      recordId: recordId || '-',
      description: description || ''
    };
    state.activityLogs.unshift(log);
    storage.set(storage.KEYS.ACTIVITY_LOGS, state.activityLogs);
  },

  // Requests CRUD
  addRequest(payload) {
    const newId = `LR-2026-00${state.requests.length + 1}`;
    const req = {
      id: newId,
      ticketNumber: `LR/2026/${String(state.requests.length + 1).padStart(3, '0')}`,
      requestDate: new Date().toISOString().slice(0, 10),
      requestor: payload.requestor || state.currentUser.name,
      department: payload.department || state.currentUser.department,
      company: payload.company || state.currentEntity,
      requestType: payload.requestType || 'Contract Review',
      urgency: payload.urgency || 'MEDIUM',
      subject: payload.subject,
      description: payload.description,
      status: 'SUBMITTED',
      assignedTo: payload.assignedTo || 'Unassigned',
      deadline: payload.deadline || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      attachments: payload.attachments || []
    };
    state.requests.unshift(req);
    storage.set(storage.KEYS.REQUESTS, state.requests);
    this.addActivityLog('CREATE', 'Permintaan Legal', req.id, `Pengajuan request baru: ${req.subject}`);
    this.triggerToast(`Permintaan legal ${req.id} berhasil diajukan!`, 'success');
    return req;
  },

  updateRequestStatus(id, newStatus, notes = '') {
    const req = state.requests.find(r => r.id === id);
    if (!req) return;
    req.status = newStatus;
    if (notes) req.notes = notes;
    storage.set(storage.KEYS.REQUESTS, state.requests);
    this.addActivityLog('UPDATE_STATUS', 'Permintaan Legal', id, `Mengubah status permohonan menjadi: ${newStatus}`);
    this.triggerToast(`Status permohonan ${id} diperbarui ke ${newStatus}`, 'success');
  },

  assignRequestPIC(id, picName) {
    const req = state.requests.find(r => r.id === id);
    if (!req) return;
    req.assignedTo = picName;
    if (req.status === 'SUBMITTED') req.status = 'IN_REVIEW';
    storage.set(storage.KEYS.REQUESTS, state.requests);
    this.addActivityLog('ASSIGN_PIC', 'Permintaan Legal', id, `Menugaskan PIC Legal Counsel: ${picName}`);
    this.triggerToast(`Permohonan ${id} ditugaskan kepada ${picName}`, 'info');
  },

  deleteRequest(id) {
    state.requests = state.requests.filter(r => r.id !== id);
    storage.set(storage.KEYS.REQUESTS, state.requests);
    this.addActivityLog('DELETE', 'Permintaan Legal', id, `Menghapus berkas permohonan ${id}`);
    this.triggerToast(`Permohonan ${id} berhasil dihapus`, 'info');
  },

  // Contracts CRUD
  addContract(payload) {
    const newId = `CTR-2026-00${state.contracts.length + 1}`;
    const days = calculateDaysRemaining(payload.expiryDate);
    let autoStatus = 'ACTIVE';
    if (days <= 0) autoStatus = 'EXPIRED';
    else if (days <= 30) autoStatus = 'EXPIRING';

    const newContract = {
      id: newId,
      company: payload.company || state.currentEntity,
      counterparty: payload.counterparty,
      contractType: payload.contractType,
      project: payload.project || 'Proyek Korporasi',
      contractTitle: payload.contractTitle,
      contractNumber: payload.contractNumber,
      effectiveDate: payload.effectiveDate,
      expiryDate: payload.expiryDate,
      contractValue: parseFloat(payload.contractValue) || 0,
      currency: payload.currency || 'IDR',
      pic: payload.pic || state.currentUser.name,
      legalPic: payload.legalPic || 'Budi Santoso, S.H.',
      status: autoStatus,
      renewalStatus: payload.renewalStatus || 'Renewable',
      keyObligations: payload.keyObligations || 'Pelaksanaan pekerjaan sesuai spesifikasi teknis.',
      paymentTerms: payload.paymentTerms || 'Pembayaran bertahap sesuai milestone.',
      addendums: []
    };
    state.contracts.unshift(newContract);
    storage.set(storage.KEYS.CONTRACTS, state.contracts);
    this.addActivityLog('CREATE', 'Manajemen Kontrak', newId, `Pendaftaran kontrak baru: ${newContract.contractTitle}`);
    this.triggerToast(`Kontrak ${newId} berhasil didaftarkan!`, 'success');
    return newContract;
  },

  deleteContract(id) {
    state.contracts = state.contracts.filter(c => c.id !== id);
    storage.set(storage.KEYS.CONTRACTS, state.contracts);
    this.addActivityLog('DELETE', 'Manajemen Kontrak', id, `Menghapus kontrak ${id}`);
    this.triggerToast(`Kontrak ${id} berhasil dihapus`, 'info');
  },

  // Disputes CRUD
  addDispute(payload) {
    const newId = `DSP-2026-00${state.disputes.length + 1}`;
    const d = {
      id: newId,
      company: payload.company || state.currentEntity,
      opponent: payload.opponent,
      caseType: payload.caseType || 'Perdata',
      courtOrInstitution: payload.courtOrInstitution || 'BANI Jakarta',
      caseNumber: payload.caseNumber,
      disputeValue: parseFloat(payload.disputeValue) || 0,
      currency: payload.currency || 'IDR',
      legalCounsel: payload.legalCounsel || 'Tim Internal Legal',
      status: 'ACTIVE',
      riskLevel: payload.riskLevel || 'HIGH',
      summary: payload.summary,
      nextHearingDate: payload.nextHearingDate || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      timeline: []
    };
    state.disputes.unshift(d);
    storage.set(storage.KEYS.DISPUTES, state.disputes);
    this.addActivityLog('CREATE', 'Dispute & Litigation', newId, `Pendaftaran perkara sengketa baru vs ${d.opponent}`);
    this.triggerToast(`Perkara sengketa ${newId} berhasil didaftarkan`, 'success');
  },

  // Compliance CRUD
  updateComplianceStatus(id, newStatus) {
    const comp = state.compliance.find(c => c.id === id);
    if (!comp) return;
    comp.status = newStatus;
    storage.set(storage.KEYS.COMPLIANCE, state.compliance);
    this.addActivityLog('UPDATE_STATUS', 'Compliance', id, `Mengubah status kepatuhan ${id} ke ${newStatus}`);
    this.triggerToast(`Kepatuhan ${id} diset ke ${newStatus}`, 'success');
  },

  // Legal Opinion Approval
  updateOpinionApproval(id, approvalStatus) {
    const op = state.opinions.find(o => o.id === id);
    if (!op) return;
    op.approval = approvalStatus;
    storage.set(storage.KEYS.LEGAL_OPINIONS, state.opinions);
    this.addActivityLog('APPROVAL', 'Legal Opinion', id, `Memperbarui status approval opini hukum: ${approvalStatus}`);
    this.triggerToast(`Opini ${id} status persetujuan: ${approvalStatus}`, 'success');
  },

  // ==========================================
  // TENDER & LELANG MANAGEMENT METHODS
  // ==========================================

  addTender(payload) {
    const nextNum = state.tenders.length + 1;
    const newId = `TND-2026-${String(nextNum).padStart(3, '0')}`;
    
    // Default standard document templates for any new tender
    const defaultDocs = [
      {
        id: `${newId}-DOC-01`,
        name: 'Akta Pendirian & Perubahan Terakhir (SK Kemenkumham)',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'AKTA-AHU-VALID.pdf',
        notes: 'SK Menkumham Terdaftar',
        expiryDate: null,
        uploadedAt: new Date().toISOString().slice(0, 10)
      },
      {
        id: `${newId}-DOC-02`,
        name: 'NIB Berbasis Risiko OSS RBA & KBLI Terkait',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'NIB-OSS-RBA.pdf',
        notes: 'Izin Usaha Terverifikasi',
        expiryDate: null,
        uploadedAt: new Date().toISOString().slice(0, 10)
      },
      {
        id: `${newId}-DOC-03`,
        name: 'NPWP Perusahaan & KSWP Valid (DJP Online)',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: 'KSWP-VALID.pdf',
        notes: 'Konfirmasi Wajib Pajak Valid',
        expiryDate: '2026-12-31',
        uploadedAt: new Date().toISOString().slice(0, 10)
      },
      {
        id: `${newId}-DOC-04`,
        name: 'Surat Kuasa Direksi Penandatangan Penawaran',
        category: 'Legal Administrasi',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Perlu tanda tangan Direktur Utama di hadapan Notaris',
        expiryDate: null,
        uploadedAt: null
      },
      {
        id: `${newId}-DOC-05`,
        name: 'Pakta Integritas & Pernyataan Non-Blacklist Bermaterai',
        category: 'Kepatuhan & Integritas',
        isMandatory: true,
        status: 'KURANG',
        fileRef: null,
        notes: 'Format standar LKPP belum diunggah',
        expiryDate: null,
        uploadedAt: null
      },
      {
        id: `${newId}-DOC-06`,
        name: 'Jaminan Penawaran Bank Garansi / Bid Bond Asli',
        category: 'Finansial & Keuangan',
        isMandatory: true,
        status: 'DALAM_PROSES',
        fileRef: null,
        notes: 'Sedang pengajuan penerbitan ke bank garansi mitra',
        expiryDate: null,
        uploadedAt: null
      }
    ];

    const sectorMap = {
      'KONSTRUKSI': 'Konstruksi & Infrastruktur',
      'PERTAMBANGAN': 'Pertambangan & Mineral',
      'ENERGI': 'Energi & Ketenagalistrikan',
      'MIGAS': 'Minyak & Gas Bumi',
      'UMUM': 'Pengadaan Barang & Jasa Umum'
    };
    const chosenSector = payload.sector || 'KONSTRUKSI';
    const chosenSectorLabel = payload.sectorLabel || sectorMap[chosenSector] || 'Konstruksi & Infrastruktur';

    // Sector-specific requirement document templates
    if (chosenSector === 'KONSTRUKSI') {
      defaultDocs.push(
        { id: `${newId}-DOC-07`, name: 'Sertifikat Badan Usaha (SBU LPJK) Kualifikasi Besar Aktif', category: 'Kualifikasi Teknis', isMandatory: true, status: 'TERPENUHI', fileRef: 'SBU-LPJK-BESAR.pdf', notes: 'Terverifikasi SIKoP LKPP', expiryDate: '2027-11-20', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-08`, name: 'SKK Konstruksi Ahli K3 & Tenaga Ahli Madya Struktur', category: 'Kualifikasi Teknis', isMandatory: true, status: 'TERPENUHI', fileRef: 'SKK-K3-STRUKTUR.pdf', notes: 'Personel inti proyek konstruksi', expiryDate: '2028-05-10', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-09`, name: 'Dokumen Rencana Keselamatan Konstruksi (RKK) & SMKK PUPR', category: 'Kepatuhan & Integritas', isMandatory: true, status: 'KURANG', fileRef: null, notes: 'Menunggu pengesahan Ahli K3', expiryDate: null, uploadedAt: null }
      );
    } else if (chosenSector === 'PERTAMBANGAN') {
      defaultDocs.push(
        { id: `${newId}-DOC-07`, name: 'Izin Usaha Pertambangan (IUP OP / IUPK) Aktif di MODI Ditjen Minerba', category: 'Legal Administrasi', isMandatory: true, status: 'TERPENUHI', fileRef: 'IUP-OP-MODI-ESDM.pdf', notes: 'Terdaftar resmi di database MOMIv ESDM', expiryDate: '2035-12-31', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-08`, name: 'Surat Persetujuan RKAB Ditjen Minerba Tahun Berjalan', category: 'Legal Administrasi', isMandatory: true, status: 'TERPENUHI', fileRef: 'PERSETUJUAN-RKAB-MINERBA.pdf', notes: 'Alokasi kuota produksi & penjualan disetujui', expiryDate: '2026-12-31', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-09`, name: 'Certificate of Sampling and Analysis (COA) Surveyor Sucofindo', category: 'Kualifikasi Teknis', isMandatory: true, status: 'KURANG', fileRef: null, notes: 'Menunggu hasil pengujian kalori (GAR) & moisture', expiryDate: null, uploadedAt: null },
        { id: `${newId}-DOC-10`, name: 'Laporan Cadangan Batubara/Mineral Competent Person (JORC / KCMI)', category: 'Kualifikasi Teknis', isMandatory: true, status: 'TERPENUHI', fileRef: 'LAPORAN-JORC-KCMI-2025.pdf', notes: 'Disusun oleh Competent Person terakreditasi', expiryDate: null, uploadedAt: new Date().toISOString().slice(0, 10) }
      );
    } else if (chosenSector === 'MIGAS') {
      defaultDocs.push(
        { id: `${newId}-DOC-07`, name: 'Surat Pengganti Dokumen Administrasi (SPDA) Sentral CIVD SKK Migas', category: 'Legal Administrasi', isMandatory: true, status: 'TERPENUHI', fileRef: 'SPDA-CIVD-SKK-MIGAS.pdf', notes: 'Status Valid di Portal CIVD Hulu Migas', expiryDate: '2027-04-15', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-08`, name: 'Sertifikat CSMS (Contractor Safety Management System) High Risk (Skor >= 75)', category: 'Kepatuhan & Integritas', isMandatory: true, status: 'TERPENUHI', fileRef: 'CSMS-HIGH-RISK-SKK.pdf', notes: 'Akreditasi K3 Migas kategori risiko tinggi', expiryDate: '2027-09-30', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-09`, name: 'Formulir Komitmen Capaian TKDN Berdasarkan Buku APDN Kemenperin', category: 'Kepatuhan & Integritas', isMandatory: true, status: 'KURANG', fileRef: null, notes: 'Perlu verifikasi nilai komitmen terhadap HEA', expiryDate: null, uploadedAt: null }
      );
    } else if (chosenSector === 'ENERGI') {
      defaultDocs.push(
        { id: `${newId}-DOC-07`, name: 'Bukti Terdaftar Daftar Penyedia Terseleksi (DPT) PT PLN (Persero)', category: 'Legal Administrasi', isMandatory: true, status: 'TERPENUHI', fileRef: 'DPT-PLN-TRANSMISI-2026.pdf', notes: 'Kualifikasi rekanan terseleksi aktif', expiryDate: '2027-06-30', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-08`, name: 'Kajian Kelayakan Teknis (FS) & Interkoneksi Grid Transmisi PLN', category: 'Kualifikasi Teknis', isMandatory: true, status: 'TERPENUHI', fileRef: 'STUDI-GRID-INTERKONEKSI-PLN.pdf', notes: 'Sesuai batasan Grid Code Jawa-Madura-Bali', expiryDate: null, uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-09`, name: 'Letter of Intent (LOI) / Support Pembiayaan dari Sindikasi Bank', category: 'Finansial & Keuangan', isMandatory: true, status: 'KURANG', fileRef: null, notes: 'Komitmen pembiayaan debt ratio minimal 70%', expiryDate: null, uploadedAt: null }
      );
    } else if (chosenSector === 'UMUM') {
      defaultDocs.push(
        { id: `${newId}-DOC-07`, name: 'Surat Kuasa Otorisasi & MAF Resmi Prinsipal (Manufacturer Authorization)', category: 'Kualifikasi Teknis', isMandatory: true, status: 'TERPENUHI', fileRef: 'MAF-PRINSIPAL-RESMI.pdf', notes: 'Dukungan garansi resmi purnajual', expiryDate: '2027-03-31', uploadedAt: new Date().toISOString().slice(0, 10) },
        { id: `${newId}-DOC-08`, name: 'Sertifikasi ISO 9001:2015 & ISO 27001:2022 Sistem Manajemen', category: 'Kepatuhan & Integritas', isMandatory: true, status: 'TERPENUHI', fileRef: 'ISO-9001-27001-KAN.pdf', notes: 'Terakreditasi Komite Akreditasi Nasional', expiryDate: '2027-08-20', uploadedAt: new Date().toISOString().slice(0, 10) }
      );
    }

    const hps = Number(payload.hpsValue) || 0;
    const bid = Number(payload.bidValue) || hps || 0;
    const hpsRatio = hps > 0 ? (bid / hps) : 1;
    const isBelow80 = hpsRatio < 0.8;

    const newTender = {
      id: newId,
      tenderNumber: payload.tenderNumber || `TND-NUM-${Date.now().toString().slice(-6)}`,
      title: payload.title,
      organizer: payload.organizer,
      company: payload.company || state.currentEntity,
      category: payload.category || chosenSectorLabel,
      sector: chosenSector,
      sectorLabel: chosenSectorLabel,
      hpsValue: hps,
      bidValue: bid,
      announcementDate: payload.announcementDate || new Date().toISOString().slice(0, 10),
      deadlineDate: payload.deadlineDate,
      stage: payload.stage || 'PERSIAPAN_PENGADAAN',
      status: 'ACTIVE',
      pic: payload.pic || state.currentUser?.name || 'Legal Counsel',
      location: payload.location || 'Indonesia',
      notes: payload.notes || 'Paket pengadaan baru terdaftar. Segera lengkapi dokumen kualifikasi.',
      documents: payload.documents && payload.documents.length ? payload.documents : defaultDocs,
      gng: payload.gng || {
        scores: { fit: 4, cap: 4, com: 4, risk: 3, cash: 4, tech: 4 },
        totalScore: 77,
        decision: 'GO',
        note: 'Evaluasi awal kelayakan tender memenuhi syarat korporasi.',
        by: state.currentUser?.name || 'Legal & Bid Committee',
        date: new Date().toISOString().slice(0, 10)
      },
      pricing: payload.pricing || {
        directCost: Math.round(bid * 0.78),
        indirectCost: Math.round(bid * 0.07),
        riskContingency: Math.round(bid * 0.04),
        marginPercent: 11.0,
        hpsRatio,
        isBelow80HPS: isBelow80,
        requiredPerformanceBond: isBelow80 ? (hps * 0.05) : (bid * 0.05)
      },
      gates: payload.gates || [
        { id: 'gate-1', name: 'Gate 1: Teknis & Kualifikasi', reviewer: 'Technical Team Lead', status: 'SELESAI', date: new Date().toISOString().slice(0, 10), note: 'Spesifikasi dan kapasitas memenuhi kriteria' },
        { id: 'gate-2', name: 'Gate 2: Finansial & HPS', reviewer: 'CFO / Finance Head', status: 'MENUNGGU', date: null, note: 'Menunggu validasi cash flow dan margin' },
        { id: 'gate-3', name: 'Gate 3: Legal & Risiko', reviewer: 'Legal Counsel Lead', status: 'BERIKUTNYA', date: null, note: 'Pengecekan draft kontrak dan mitigasi penalti' },
        { id: 'gate-4', name: 'Gate 4: Otorisasi Direksi / Final', reviewer: 'Direktur Operasional', status: 'BERIKUTNYA', date: null, note: 'Persetujuan akhir sebelum submission' }
      ],
      clarifications: payload.clarifications || [],
      result: payload.result || null,
      locked: false,
      hash: null
    };

    state.tenders.unshift(newTender);
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('CREATE', 'Tender & Lelang', newId, `Pendaftaran paket lelang baru: ${newTender.title} (${newTender.organizer}) - Sektor: ${newTender.sectorLabel}`);
    this.triggerToast(`Paket lelang ${newId} (${newTender.sectorLabel}) berhasil didaftarkan`, 'success');
    return newTender;
  },

  updateTenderStage(id, newStage) {
    const t = state.tenders.find(item => item.id === id);
    if (!t) return;
    t.stage = newStage;
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('UPDATE_STAGE', 'Tender & Lelang', id, `Mengubah tahapan lelang ${id} ke ${newStage}`);
    this.triggerToast(`Tahapan lelang ${id} diperbarui: ${newStage}`, 'success');
  },

  updateTenderSector(id, newSector) {
    const t = state.tenders.find(item => item.id === id);
    if (!t) return;
    const sectorObj = (state.masterSectors || []).find(s => s.code === newSector);
    const oldSector = t.sector;
    t.sector = newSector;
    t.sectorLabel = sectorObj ? sectorObj.name : newSector;

    // Check if current stage is valid in new sector's workflow
    const stages = this.getStagesForSector(newSector);
    if (stages.length > 0 && !stages.some(s => s.key === t.stage)) {
      t.stage = stages[0].key;
    }

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('UPDATE_SECTOR', 'Tender & Lelang', id, `Mengubah sektor paket ${id} dari ${oldSector} ke ${t.sectorLabel}`);
    this.triggerToast(`Sektor tender diperbarui: ${t.sectorLabel} (${stages.length} Tahapan)`, 'success');
  },

  toggleStageChecklistItem(tenderId, stageKey, itemId) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;
    if (!t.stageChecklists) t.stageChecklists = {};
    if (!t.stageChecklists[stageKey]) {
      const defaultItems = (masterSectorChecklists[t.sector] && masterSectorChecklists[t.sector][stageKey]) || [];
      t.stageChecklists[stageKey] = JSON.parse(JSON.stringify(defaultItems));
    }
    const item = t.stageChecklists[stageKey].find(i => i.id === itemId);
    if (item) {
      item.checked = !item.checked;
    } else {
      const defaultList = (masterSectorChecklists[t.sector] && masterSectorChecklists[t.sector][stageKey]) || [];
      const def = defaultList.find(i => i.id === itemId);
      t.stageChecklists[stageKey].push({
        id: itemId,
        text: def ? def.text : 'Verifikasi Tahapan',
        checked: true
      });
    }
    storage.set(storage.KEYS.TENDERS, state.tenders);
  },

  completeAllStageChecklist(tenderId, stageKey) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;
    if (!t.stageChecklists) t.stageChecklists = {};
    const defaultItems = (masterSectorChecklists[t.sector] && masterSectorChecklists[t.sector][stageKey]) || [];
    t.stageChecklists[stageKey] = defaultItems.map(i => ({ ...i, checked: true }));
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.triggerToast(`Semua tindakan tahap ${stageKey} ditandai selesai`, 'success');
  },

  getStageChecklist(sector, stageKey, tenderId = null) {
    const sec = (sector || 'KONSTRUKSI').toUpperCase();
    const defaultItems = (masterSectorChecklists[sec] && masterSectorChecklists[sec][stageKey]) || [];
    if (!tenderId) return defaultItems;
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t || !t.stageChecklists || !t.stageChecklists[stageKey]) {
      return defaultItems;
    }
    return t.stageChecklists[stageKey];
  },

  getStageGuidance(sector, stageKey) {
    const sec = (sector || 'KONSTRUKSI').toUpperCase();
    if (masterSectorStageGuidance[sec] && masterSectorStageGuidance[sec][stageKey]) {
      return masterSectorStageGuidance[sec][stageKey];
    }
    return {
      regulatory: 'Standar Pengadaan Korporasi & LKPP',
      focus: 'Kepatuhan & Verifikasi Dokumen Kualifikasi',
      alert: 'Pastikan seluruh berkas terverifikasi dan memenuhi ketentuan lelang.'
    };
  },

  updateTenderStatus(id, newStatus) {
    const t = state.tenders.find(item => item.id === id);
    if (!t) return;
    t.status = newStatus;
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('UPDATE_STATUS', 'Tender & Lelang', id, `Mengubah status hasil lelang ${id} ke ${newStatus}`);
    this.triggerToast(`Status lelang ${id} diubah ke ${newStatus}`, 'success');
  },

  toggleTenderDocStatus(tenderId, docId, newStatus, newNotes = null) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;
    const doc = t.documents.find(d => d.id === docId);
    if (!doc) return;

    doc.status = newStatus;
    if (newNotes !== null) doc.notes = newNotes;
    if (newStatus === 'TERPENUHI' && !doc.uploadedAt) {
      doc.uploadedAt = new Date().toISOString().slice(0, 10);
      if (!doc.fileRef) doc.fileRef = `DOK-${doc.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}.pdf`;
    }

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('UPDATE_DOC', 'Tender & Lelang', tenderId, `Memperbarui status dokumen "${doc.name}" menjadi ${newStatus}`);
    this.triggerToast(`Dokumen "${doc.name}" diset ke ${newStatus}`, 'success');
  },

  addTenderDocument(tenderId, docPayload) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;
    const docId = `${tenderId}-DOC-${String(t.documents.length + 1).padStart(2, '0')}`;
    const newDoc = {
      id: docId,
      name: docPayload.name,
      category: docPayload.category || 'Legal Administrasi',
      isMandatory: docPayload.isMandatory !== undefined ? docPayload.isMandatory : true,
      status: docPayload.fileRef ? 'TERPENUHI' : (docPayload.status || 'KURANG'),
      fileRef: docPayload.fileRef || null,
      fileSize: docPayload.fileSize || null,
      notes: docPayload.notes || '',
      expiryDate: docPayload.expiryDate || null,
      uploadedAt: docPayload.fileRef || docPayload.status === 'TERPENUHI' ? new Date().toISOString().slice(0, 10) : null
    };

    t.documents.push(newDoc);
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('ADD_DOC_REQUIREMENT', 'Tender & Lelang', tenderId, `Menambahkan dokumen "${newDoc.name}" ${newDoc.fileRef ? `(terlampir: ${newDoc.fileRef})` : ''} pada lelang ${tenderId}`);
    this.triggerToast(newDoc.fileRef ? `Dokumen "${newDoc.name}" berhasil diunggah dan ditambahkan!` : `Dokumen persyaratan baru berhasil ditambahkan`, 'success');
  },

  attachFileToTenderDoc(tenderId, docId, fileName, fileSize = null) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;
    const doc = t.documents.find(d => d.id === docId);
    if (!doc) return;

    doc.fileRef = fileName;
    doc.fileSize = fileSize;
    doc.status = 'TERPENUHI';
    doc.uploadedAt = new Date().toISOString().slice(0, 10);

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('ATTACH_FILE', 'Tender & Lelang', tenderId, `Mengunggah berkas "${fileName}" untuk dokumen "${doc.name}"`);
    this.triggerToast(`Berkas "${fileName}" berhasil di-upload dan dilampirkan!`, 'success');
  },

  deleteTender(id) {
    const idx = state.tenders.findIndex(item => item.id === id);
    if (idx === -1) return;
    const title = state.tenders[idx].title;
    state.tenders.splice(idx, 1);
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('DELETE', 'Tender & Lelang', id, `Menghapus paket lelang: ${title}`);
    this.triggerToast(`Paket lelang ${id} berhasil dihapus`, 'info');
  },

  updateTenderGNG(id, scores, decision, note) {
    const t = state.tenders.find(item => item.id === id);
    if (!t) return;
    const weights = { fit: 20, cap: 15, com: 25, risk: 15, cash: 15, tech: 10 };
    let totalScore = 0;
    Object.keys(weights).forEach(k => {
      const sc = Number(scores[k]) || 0;
      totalScore += (sc / 5) * weights[k];
    });
    totalScore = Math.round(totalScore);

    t.gng = {
      scores: { ...scores },
      totalScore,
      decision: decision || (totalScore >= 75 ? 'GO' : totalScore >= 60 ? 'GO_BERSYARAT' : 'NO_GO'),
      note: note || '',
      by: state.currentUser?.name || 'Direksi / Legal Head',
      date: new Date().toISOString().slice(0, 10)
    };

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('UPDATE_GNG', 'Tender & Lelang', id, `Keputusan Go/No-Go tender ${id}: ${t.gng.decision} (Skor: ${totalScore}/100)`);
    this.triggerToast(`Evaluasi kelayakan tender ${id} disimpan: ${t.gng.decision} (${totalScore}/100)`, 'success');
  },

  updateTenderPricing(id, pricingPayload) {
    const t = state.tenders.find(item => item.id === id);
    if (!t) return;

    if (pricingPayload.bidValue !== undefined) {
      t.bidValue = Number(pricingPayload.bidValue) || 0;
    }
    if (pricingPayload.hpsValue !== undefined) {
      t.hpsValue = Number(pricingPayload.hpsValue) || 0;
    }

    const hpsRatio = t.hpsValue > 0 ? (t.bidValue / t.hpsValue) : 1;
    const isBelow80HPS = hpsRatio < 0.8;
    const requiredPerformanceBond = isBelow80HPS ? (t.hpsValue * 0.05) : (t.bidValue * 0.05);

    t.pricing = {
      directCost: Number(pricingPayload.directCost) || (t.pricing?.directCost || Math.round(t.bidValue * 0.8)),
      indirectCost: Number(pricingPayload.indirectCost) || (t.pricing?.indirectCost || Math.round(t.bidValue * 0.06)),
      riskContingency: Number(pricingPayload.riskContingency) || (t.pricing?.riskContingency || Math.round(t.bidValue * 0.03)),
      marginPercent: Number(pricingPayload.marginPercent) || (t.pricing?.marginPercent || 11.5),
      hpsRatio,
      isBelow80HPS,
      requiredPerformanceBond
    };

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('UPDATE_PRICING', 'Tender & Lelang', id, `Pembaruan pricing & analisis HPS ${id}: Penawaran ${formatIDR(t.bidValue)} (${(hpsRatio * 100).toFixed(1)}% HPS)`);
    this.triggerToast(isBelow80HPS ? `Peringatan: Penawaran < 80% HPS! Jaminan pelaksanaan wajib 5% HPS` : `Struktur harga penawaran tender ${id} diperbarui`, isBelow80HPS ? 'warning' : 'success');
  },

  approveTenderGate(tenderId, gateId, note = '') {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t || !t.gates) return;
    const gIndex = t.gates.findIndex(g => g.id === gateId);
    if (gIndex === -1) return;

    const gate = t.gates[gIndex];
    gate.status = 'SELESAI';
    gate.date = new Date().toISOString().slice(0, 10);
    gate.approvedBy = state.currentUser?.name || gate.reviewer;
    if (note) gate.note = note;

    if (t.gates[gIndex + 1] && t.gates[gIndex + 1].status === 'BERIKUTNYA') {
      t.gates[gIndex + 1].status = 'MENUNGGU';
    }

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('APPROVE_GATE', 'Tender & Lelang', tenderId, `${gate.name} disetujui untuk lelang ${tenderId}`);
    this.triggerToast(`${gate.name} berhasil disetujui`, 'success');
  },

  rejectTenderGate(tenderId, gateId, revisionNote = '') {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t || !t.gates) return;
    const gate = t.gates.find(g => g.id === gateId);
    if (!gate) return;

    gate.status = 'REVISI';
    gate.note = revisionNote || 'Perlu perbaikan kelengkapan dan kesesuaian dokumen.';

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('REJECT_GATE', 'Tender & Lelang', tenderId, `Catatan revisi untuk ${gate.name} pada lelang ${tenderId}: ${gate.note}`);
    this.triggerToast(`Catatan revisi dikirim untuk ${gate.name}`, 'warning');
  },

  lockTenderPackage(tenderId) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return false;

    // Check all gates completed
    const allGatesPassed = (t.gates || []).every(g => g.status === 'SELESAI');
    if (!allGatesPassed) {
      this.triggerToast('Semua 4 Gate Review wajib disetujui sebelum paket dapat dikunci!', 'error');
      return false;
    }

    // Check mandatory missing docs
    const mandatoryMissing = (t.documents || []).filter(d => d.isMandatory && (d.status === 'KURANG' || d.status === 'KEDALUWARSA')).length;
    if (mandatoryMissing > 0) {
      this.triggerToast(`Masih terdapat ${mandatoryMissing} dokumen persyaratan wajib yang belum lengkap!`, 'error');
      return false;
    }

    const hash = 'SHA256:' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    t.locked = true;
    t.hash = hash;
    t.submittedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    if (t.stage === 'PERSIAPAN_PENGADAAN' || t.stage === 'PENGUMUMAN_PENDAFTARAN' || t.stage === 'AANWIJZING') {
      t.stage = 'PENYAMPAIAN_PENAWARAN';
    }

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('LOCK_PACKAGE', 'Tender & Lelang', tenderId, `Paket submission lelang ${tenderId} dikunci dengan integritas hash ${hash}`);
    this.triggerToast(`Paket submission berhasil dikunci! Hash: ${hash}`, 'success');
    return true;
  },

  unlockTenderPackage(tenderId, reason) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;
    t.locked = false;
    t.unlockReason = reason || 'Koreksi administratif internal';
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('UNLOCK_PACKAGE', 'Tender & Lelang', tenderId, `Paket submission lelang ${tenderId} dibuka kembali untuk perbaikan: ${t.unlockReason}`);
    this.triggerToast(`Paket lelang ${tenderId} dibuka kembali untuk perbaikan`, 'info');
  },

  addTenderClarification(tenderId, payload) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;
    if (!t.clarifications) t.clarifications = [];

    const newId = `CLR-${String(t.clarifications.length + 1).padStart(2, '0')}`;
    const newClar = {
      id: newId,
      query: payload.query,
      askedBy: payload.askedBy || state.currentUser?.name || 'Tim Pengadaan',
      date: payload.date || new Date().toISOString().slice(0, 10),
      category: payload.category || 'Teknis & Spesifikasi',
      impact: payload.impact || 'Biaya & Spesifikasi',
      answer: payload.answer || null,
      status: payload.answer ? 'DIJAWAB' : 'MENUNGGU_POKJA'
    };

    t.clarifications.push(newClar);
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('ADD_CLARIFICATION', 'Tender & Lelang', tenderId, `Menambahkan pertanyaan klarifikasi ${newId}: ${newClar.query}`);
    this.triggerToast(`Pertanyaan klarifikasi ${newId} dicatat`, 'success');
  },

  answerTenderClarification(tenderId, clarId, answer, effect = 'Tidak ada dampak') {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t || !t.clarifications) return;
    const c = t.clarifications.find(item => item.id === clarId);
    if (!c) return;

    c.answer = answer;
    c.effect = effect;
    c.status = 'DIJAWAB';
    c.answeredAt = new Date().toISOString().slice(0, 10);

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('ANSWER_CLARIFICATION', 'Tender & Lelang', tenderId, `Mencatat jawaban Pokja untuk ${clarId}: ${answer}`);
    this.triggerToast(`Jawaban Pokja untuk ${clarId} berhasil dicatat`, 'success');
  },

  recordTenderResult(tenderId, resultPayload) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return;

    const isWin = resultPayload.resultStatus === 'MENANG';
    t.status = isWin ? 'WON' : 'LOST';
    t.stage = isWin ? 'SPPBJ_KONTRAK' : 'PENGUMUMAN_PEMENANG';
    t.result = {
      status: isWin ? 'MENANG' : 'KALAH',
      date: resultPayload.date || new Date().toISOString().slice(0, 10),
      rank: Number(resultPayload.rank) || (isWin ? 1 : 2),
      winner: isWin ? t.company : (resultPayload.winner || 'Pesaing Terpilih'),
      winPrice: Number(resultPayload.winPrice) || (isWin ? t.bidValue : Math.round(t.bidValue * 0.96)),
      note: resultPayload.note || (isWin ? 'Surat Penunjukan Penyedia (SPPBJ) resmi diterbitkan oleh Pokja.' : 'Evaluasi harga atau teknis di bawah kompetitor.'),
      lessons: resultPayload.lessons && resultPayload.lessons.length ? resultPayload.lessons : [
        isWin ? 'Kombinasi harga wajar dan kualifikasi Dokumen Vault lengkap terbukti efektif.' : 'Perlu evaluasi biaya material dan mitra subkontraktor lokal.'
      ]
    };

    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('RECORD_RESULT', 'Tender & Lelang', tenderId, `Hasil lelang ${tenderId} dicatat: ${t.result.status} (Peringkat ${t.result.rank})`);
    this.triggerToast(`Hasil lelang ${tenderId} berhasil dicatat: ${t.result.status}`, isWin ? 'success' : 'info');
  },

  convertTenderToContract(tenderId) {
    const t = state.tenders.find(item => item.id === tenderId);
    if (!t) return null;

    const contractId = `CTR-${new Date().getFullYear()}-${String(state.contracts.length + 1).padStart(3, '0')}`;
    const newContract = {
      id: contractId,
      contractTitle: `Kontrak Pelaksanaan ${t.title}`,
      contractNumber: `${t.tenderNumber}-KTR/${new Date().getFullYear()}`,
      company: t.company,
      counterparty: t.organizer,
      contractType: t.sector === 'PERTAMBANGAN' ? 'Coal/Mineral Supply Agreement' : t.sector === 'ENERGI' ? 'Power Purchase Agreement (PPA)' : 'Engineering Procurement Construction (EPC)',
      effectiveDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      contractValue: t.bidValue || t.hpsValue,
      currency: 'IDR',
      status: 'ACTIVE',
      pic: t.pic,
      legalPic: state.currentUser?.name || 'Legal Counsel',
      keyObligations: `Penyelesaian lingkup pekerjaan sesuai dokumen lelang ${t.id} (${t.title}). Menjamin pemenuhan spesifikasi teknis dan ketaatan K3/lingkungan.`,
      paymentTerms: 'Termin bertahap (Milestone Progress) dengan retensi 5% yang dicairkan setelah Berita Acara Serah Terima Akhir (FHO).',
      renewalStatus: 'Dapat diperpanjang atas kesepakatan tertulis kedua pihak sebelum berakhirnya masa kontrak.',
      notes: `Dikonversi secara otomatis dari paket lelang yang dimenangkan: ${t.id} (${t.tenderNumber}) - Sektor: ${t.sectorLabel || t.category}.`,
      addendums: []
    };

    state.contracts.unshift(newContract);
    storage.set(storage.KEYS.CONTRACTS, state.contracts);

    t.status = 'CONVERTED';
    t.convertedContractId = contractId;
    storage.set(storage.KEYS.TENDERS, state.tenders);

    this.addActivityLog('CONVERT_TENDER', 'Tender & Lelang', tenderId, `Tender ${tenderId} berhasil dikonversi menjadi Kontrak Korporasi ${contractId}: ${newContract.contractTitle}`);
    this.triggerToast(`Tender ${tenderId} berhasil dikonversi menjadi Kontrak ${contractId}!`, 'success');
    return newContract;
  },

  exportTendersCSV() {
    if (!state.tenders.length) {
      this.triggerToast('Tidak ada data paket lelang untuk diekspor', 'error');
      return;
    }

    const headers = ['ID Lelang', 'Nomor Tender', 'Judul Paket', 'Instansi Penyelenggara', 'Entitas', 'Kategori', 'Pagu HPS (IDR)', 'Nilai Penawaran (IDR)', 'Tahapan', 'Status', 'PIC', 'Batas Akhir', 'Total Dokumen', 'Dokumen Terpenuhi', 'Dokumen Kurang', 'Persentase Kesiapan'];
    const rows = state.tenders.map(t => {
      const totalDocs = t.documents.length;
      const fulfilledDocs = t.documents.filter(d => d.status === 'TERPENUHI').length;
      const missingDocs = t.documents.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length;
      const completeness = totalDocs > 0 ? Math.round((fulfilledDocs / totalDocs) * 100) : 0;

      return [
        `"${t.id}"`,
        `"${t.tenderNumber}"`,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.organizer.replace(/"/g, '""')}"`,
        `"${t.company}"`,
        `"${t.category}"`,
        t.hpsValue,
        t.bidValue,
        `"${t.stage}"`,
        `"${t.status}"`,
        `"${t.pic}"`,
        `"${t.deadlineDate}"`,
        totalDocs,
        fulfilledDocs,
        missingDocs,
        `"${completeness}%"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LMS_Lelang_Tender_Progress_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.triggerToast('Daftar rekapitulasi progress lelang berhasil diunduh (CSV)', 'success');
  },

  exportGapAnalysisCSV() {
    const missingItems = [];
    state.tenders.forEach(t => {
      (t.documents || []).forEach(d => {
        if (d.status === 'KURANG' || d.status === 'KEDALUWARSA') {
          missingItems.push({
            tenderId: t.id,
            tenderNumber: t.tenderNumber,
            tenderTitle: t.title,
            organizer: t.organizer,
            company: t.company,
            deadline: t.deadlineDate,
            docName: d.name,
            docCategory: d.category,
            status: d.status,
            isMandatory: d.isMandatory ? 'WAJIB' : 'OPSIONAL',
            notes: d.notes || '-'
          });
        }
      });
    });

    if (!missingItems.length) {
      this.triggerToast('Tidak ada dokumen berstatus KURANG pada lelang aktif', 'info');
      return;
    }

    const headers = ['ID Lelang', 'Nomor Tender', 'Judul Paket', 'Instansi Panitia', 'Entitas', 'Batas Akhir Penawaran', 'Nama Dokumen Persyaratan', 'Kategori Berkas', 'Status Gap', 'Sifat Berkas', 'Catatan / Tindakan'];
    const rows = missingItems.map(item => [
      `"${item.tenderId}"`,
      `"${item.tenderNumber}"`,
      `"${item.tenderTitle.replace(/"/g, '""')}"`,
      `"${item.organizer.replace(/"/g, '""')}"`,
      `"${item.company}"`,
      `"${item.deadline}"`,
      `"${item.docName.replace(/"/g, '""')}"`,
      `"${item.docCategory}"`,
      `"${item.status}"`,
      `"${item.isMandatory}"`,
      `"${item.notes.replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LMS_Gap_Analysis_Dokumen_Lelang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.triggerToast('Laporan Gap Analysis Dokumen Kurang berhasil diunduh (CSV)', 'success');
  },

  // Bank Dokumen Kualifikasi CRUD
  addTenderVaultDoc(payload) {
    const newId = `VAULT-${String(state.tenderVault.length + 1).padStart(3, '0')}`;
    const doc = {
      id: newId,
      code: payload.code || `DOC-${Date.now().toString().slice(-4)}`,
      name: payload.name,
      category: payload.category || 'Legal Administrasi',
      issuer: payload.issuer || '-',
      number: payload.number || '-',
      issueDate: payload.issueDate || new Date().toISOString().slice(0, 10),
      expiryDate: payload.expiryDate || null,
      fileRef: payload.fileRef || `${payload.name.replace(/\s+/g, '-').toUpperCase()}.pdf`,
      fileSize: payload.fileSize || '1.5 MB',
      status: payload.status || 'VALID',
      tendersUsed: payload.tendersUsed || [],
      notes: payload.notes || ''
    };
    state.tenderVault.unshift(doc);
    storage.set(storage.KEYS.TENDER_VAULT, state.tenderVault);
    this.addActivityLog('CREATE', 'Bank Dokumen Kualifikasi', newId, `Menambahkan master dokumen kualifikasi lelang: ${doc.name}`);
    this.triggerToast(`Dokumen kualifikasi "${doc.name}" berhasil ditambahkan ke Bank Dokumen`, 'success');
  },

  deleteTenderVaultDoc(id) {
    const idx = state.tenderVault.findIndex(d => d.id === id);
    if (idx === -1) return;
    const name = state.tenderVault[idx].name;
    state.tenderVault.splice(idx, 1);
    storage.set(storage.KEYS.TENDER_VAULT, state.tenderVault);
    this.addActivityLog('DELETE', 'Bank Dokumen Kualifikasi', id, `Menghapus dokumen kualifikasi: ${name}`);
    this.triggerToast(`Dokumen ${name} dihapus dari Bank Dokumen`, 'info');
  },

  linkVaultDocToTender(vaultDocId, tenderId) {
    const vDoc = state.tenderVault.find(d => d.id === vaultDocId);
    const tender = state.tenders.find(t => t.id === tenderId);
    if (!vDoc || !tender) return;

    if (!vDoc.tendersUsed.includes(tenderId)) {
      vDoc.tendersUsed.push(tenderId);
      storage.set(storage.KEYS.TENDER_VAULT, state.tenderVault);
    }

    // Check if tender already has this document as fulfilled
    const existing = tender.documents.find(d => d.name.toLowerCase().includes(vDoc.name.toLowerCase().slice(0, 15)));
    if (existing) {
      existing.status = 'TERPENUHI';
      existing.fileRef = vDoc.fileRef;
      existing.notes = `Dihubungkan dari Bank Dokumen (${vDoc.code}): ${vDoc.notes || ''}`;
      existing.uploadedAt = new Date().toISOString().slice(0, 10);
    } else {
      tender.documents.push({
        id: `${tender.id}-DOC-${tender.documents.length + 1}`,
        name: vDoc.name,
        category: vDoc.category,
        isMandatory: true,
        status: 'TERPENUHI',
        fileRef: vDoc.fileRef,
        notes: `Dihubungkan dari Bank Dokumen Kualifikasi (${vDoc.number})`,
        expiryDate: vDoc.expiryDate,
        uploadedAt: new Date().toISOString().slice(0, 10)
      });
    }
    storage.set(storage.KEYS.TENDERS, state.tenders);
    this.addActivityLog('LINK_VAULT_DOC', 'Tender & Lelang', tenderId, `Menautkan master berkas ${vDoc.name} ke lelang ${tender.title}`);
    this.triggerToast(`Dokumen ${vDoc.name} berhasil ditautkan ke ${tender.tenderNumber}`, 'success');
  },

  // Jaminan Bank & Bid Bond CRUD
  addTenderBond(payload) {
    const newId = `BND-2026-${String(state.tenderBonds.length + 1).padStart(3, '0')}`;
    const bond = {
      id: newId,
      tenderId: payload.tenderId,
      tenderTitle: payload.tenderTitle || 'Paket Pengadaan',
      bondType: payload.bondType || 'BID_BOND',
      bondTypeName: payload.bondTypeName || 'Jaminan Penawaran (Bid Bond)',
      bankIssuer: payload.bankIssuer || 'PT Bank Mandiri (Persero) Tbk',
      guaranteeNumber: payload.guaranteeNumber,
      amount: Number(payload.amount) || 0,
      percentage: payload.percentage || '2% HPS',
      issueDate: payload.issueDate || new Date().toISOString().slice(0, 10),
      expiryDate: payload.expiryDate,
      daysValid: Number(payload.daysValid) || 90,
      beneficiary: payload.beneficiary || '-',
      status: payload.status || 'AKTIF',
      fileRef: payload.fileRef || null,
      notes: payload.notes || ''
    };
    state.tenderBonds.unshift(bond);
    storage.set(storage.KEYS.TENDER_BONDS, state.tenderBonds);
    this.addActivityLog('CREATE', 'Jaminan Bank & Bid Bond', newId, `Mendaftarkan garansi bank lelang: ${bond.guaranteeNumber} (${bond.bankIssuer})`);
    this.triggerToast(`Garansi Bank ${bond.guaranteeNumber} berhasil dicatatkan`, 'success');
  },

  updateTenderBondStatus(bondId, newStatus) {
    const b = state.tenderBonds.find(item => item.id === bondId);
    if (!b) return;
    b.status = newStatus;
    storage.set(storage.KEYS.TENDER_BONDS, state.tenderBonds);
    this.addActivityLog('UPDATE_STATUS', 'Jaminan Bank & Bid Bond', bondId, `Status jaminan bank diubah menjadi ${newStatus}`);
    this.triggerToast(`Status Jaminan Bank ${b.guaranteeNumber} diubah ke ${newStatus}`, 'info');
  },

  deleteTenderBond(id) {
    const idx = state.tenderBonds.findIndex(b => b.id === id);
    if (idx === -1) return;
    const num = state.tenderBonds[idx].guaranteeNumber;
    state.tenderBonds.splice(idx, 1);
    storage.set(storage.KEYS.TENDER_BONDS, state.tenderBonds);
    this.addActivityLog('DELETE', 'Jaminan Bank & Bid Bond', id, `Menghapus jaminan bank: ${num}`);
    this.triggerToast(`Jaminan Bank ${num} berhasil dihapus`, 'info');
  },

  // Dynamic Sector Stages Getter
  getStagesForSector(sectorKey) {
    const key = (sectorKey || 'KONSTRUKSI').toUpperCase();
    if (state.masterStages && state.masterStages[key] && state.masterStages[key].length > 0) {
      return state.masterStages[key];
    }
    if (state.masterStages && state.masterStages['KONSTRUKSI']) {
      return state.masterStages['KONSTRUKSI'];
    }
    return [
      { key: 'PERSIAPAN_PENGADAAN', name: '1. Tahap Persiapan Pengadaan', shortName: '1. Persiapan KAK & HPS', description: 'Penyusunan KAK/spesifikasi teknis, DED, dan penetapan HPS.' },
      { key: 'PENGUMUMAN_PENDAFTARAN', name: '2. Pengumuman Lelang & Pendaftaran Peserta', shortName: '2. Pengumuman & Pendaftaran', description: 'Pokja mengumumkan tender secara terbuka.' },
      { key: 'AANWIJZING', name: '3. Pemberian Penjelasan (Aanwijzing)', shortName: '3. Pemberian Penjelasan', description: 'Pertemuan teknis panitia tender dan peserta.' },
      { key: 'PENYAMPAIAN_PENAWARAN', name: '4. Penyampaian Dokumen Penawaran', shortName: '4. Penyampaian Penawaran', description: 'Peserta menyusun dan mengunggah dokumen penawaran.' },
      { key: 'EVALUASI_PEMBUKTIAN', name: '5. Evaluasi Penawaran & Pembuktian', shortName: '5. Evaluasi & Pembuktian', description: 'Pemeriksaan berjenjang teknis, harga, dan pembuktian kualifikasi.' },
      { key: 'PENGUMUMAN_PEMENANG', name: '6. Penetapan & Pengumuman Pemenang', shortName: '6. Pengumuman Pemenang', description: 'Pokja menetapkan urutan pemenang tender.' },
      { key: 'MASA_SANGGAH', name: '7. Masa Sanggah (5 Hari)', shortName: '7. Masa Sanggah', description: 'Waktu sanggahan bagi peserta yang gugur.' },
      { key: 'SPPBJ_KONTRAK', name: '8. Penerbitan SPPBJ & Kontrak', shortName: '8. SPPBJ & Kontrak', description: 'Penyerahan jaminan pelaksanaan dan tanda tangan kontrak resmi.' }
    ];
  },

  // Master Data: Document Types CRUD
  addMasterDocType(payload) {
    const newId = `MDT-${String(state.masterDocTypes.length + 1).padStart(2, '0')}`;
    const docType = {
      id: newId,
      code: payload.code ? payload.code.toUpperCase() : `DOC-${Date.now().toString().slice(-3)}`,
      name: payload.name,
      icon: payload.icon || 'FileText',
      color: payload.color || '#4338CA',
      bgColor: payload.bgColor || '#EEF2FF',
      isMandatory: payload.isMandatory !== undefined ? payload.isMandatory : true,
      description: payload.description || '',
      active: true
    };
    state.masterDocTypes.push(docType);
    storage.set(storage.KEYS.MASTER_DOC_TYPES, state.masterDocTypes);
    this.addActivityLog('CREATE', 'Data Master', newId, `Menambahkan master tipe dokumen: ${docType.name} (${docType.code})`);
    this.triggerToast(`Tipe dokumen "${docType.name}" berhasil ditambahkan ke Data Master`, 'success');
  },

  updateMasterDocType(id, payload) {
    const item = state.masterDocTypes.find(d => d.id === id);
    if (!item) return;
    Object.assign(item, payload);
    storage.set(storage.KEYS.MASTER_DOC_TYPES, state.masterDocTypes);
    this.addActivityLog('UPDATE', 'Data Master', id, `Memperbarui master tipe dokumen: ${item.name}`);
    this.triggerToast(`Tipe dokumen "${item.name}" berhasil diperbarui`, 'success');
  },

  deleteMasterDocType(id) {
    const idx = state.masterDocTypes.findIndex(d => d.id === id);
    if (idx === -1) return;
    const name = state.masterDocTypes[idx].name;
    state.masterDocTypes.splice(idx, 1);
    storage.set(storage.KEYS.MASTER_DOC_TYPES, state.masterDocTypes);
    this.addActivityLog('DELETE', 'Data Master', id, `Menghapus master tipe dokumen: ${name}`);
    this.triggerToast(`Tipe dokumen "${name}" dihapus dari Data Master`, 'info');
  },

  // Master Data: Sectors CRUD
  addMasterSector(payload) {
    const newId = `SEC-${String(state.masterSectors.length + 1).padStart(2, '0')}`;
    const code = (payload.code || `SEC${Date.now().toString().slice(-3)}`).toUpperCase();
    const sector = {
      id: newId,
      code,
      name: payload.name,
      icon: payload.icon || '🏢',
      badgeClass: payload.badgeClass || 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
      regulatoryBasis: payload.regulatoryBasis || 'Regulasi Terkait',
      defaultContractType: payload.defaultContractType || 'Perjanjian Kerja Sama',
      hasBelow80Alert: Boolean(payload.hasBelow80Alert),
      workflowTemplate: payload.workflowTemplate || `${code}_STAGES_8`,
      description: payload.description || ''
    };
    state.masterSectors.push(sector);
    storage.set(storage.KEYS.MASTER_SECTORS, state.masterSectors);

    // If new sector doesn't have stages yet, assign default stages
    if (!state.masterStages[code]) {
      state.masterStages[code] = JSON.parse(JSON.stringify(this.getStagesForSector('KONSTRUKSI')));
      storage.set(storage.KEYS.MASTER_STAGES, state.masterStages);
    }

    this.addActivityLog('CREATE', 'Data Master', newId, `Menambahkan master sektor industri: ${sector.name} (${sector.code})`);
    this.triggerToast(`Sektor industri "${sector.name}" berhasil ditambahkan`, 'success');
  },

  updateMasterSector(id, payload) {
    const item = state.masterSectors.find(s => s.id === id);
    if (!item) return;
    Object.assign(item, payload);
    storage.set(storage.KEYS.MASTER_SECTORS, state.masterSectors);
    this.addActivityLog('UPDATE', 'Data Master', id, `Memperbarui master sektor industri: ${item.name}`);
    this.triggerToast(`Sektor "${item.name}" berhasil diperbarui`, 'success');
  },

  deleteMasterSector(id) {
    const idx = state.masterSectors.findIndex(s => s.id === id);
    if (idx === -1) return;
    const name = state.masterSectors[idx].name;
    state.masterSectors.splice(idx, 1);
    storage.set(storage.KEYS.MASTER_SECTORS, state.masterSectors);
    this.addActivityLog('DELETE', 'Data Master', id, `Menghapus master sektor: ${name}`);
    this.triggerToast(`Sektor "${name}" dihapus dari Data Master`, 'info');
  },

  updateSectorStages(sectorKey, stagesArray) {
    const key = (sectorKey || '').toUpperCase();
    if (!key) return;
    state.masterStages[key] = stagesArray;
    storage.set(storage.KEYS.MASTER_STAGES, state.masterStages);
    this.addActivityLog('UPDATE_STAGES', 'Data Master', key, `Memperbarui template tahapan proses lelang untuk sektor ${key}`);
    this.triggerToast(`Template tahapan untuk sektor ${key} berhasil disimpan`, 'success');
  },

  // Master Data: Contract Types CRUD
  addMasterContractType(payload) {
    const newId = `CT-${String(state.masterContractTypes.length + 1).padStart(2, '0')}`;
    const contractType = {
      id: newId,
      code: (payload.code || `CT-${Date.now().toString().slice(-3)}`).toUpperCase(),
      name: payload.name,
      sector: payload.sector || 'UMUM',
      standardFormat: payload.standardFormat || 'Standar Korporasi',
      active: true
    };
    state.masterContractTypes.push(contractType);
    storage.set(storage.KEYS.MASTER_CONTRACT_TYPES, state.masterContractTypes);
    this.addActivityLog('CREATE', 'Data Master', newId, `Menambahkan master tipe kontrak: ${contractType.name}`);
    this.triggerToast(`Tipe kontrak "${contractType.name}" berhasil ditambahkan`, 'success');
  },

  deleteMasterContractType(id) {
    const idx = state.masterContractTypes.findIndex(c => c.id === id);
    if (idx === -1) return;
    const name = state.masterContractTypes[idx].name;
    state.masterContractTypes.splice(idx, 1);
    storage.set(storage.KEYS.MASTER_CONTRACT_TYPES, state.masterContractTypes);
    this.addActivityLog('DELETE', 'Data Master', id, `Menghapus master tipe kontrak: ${name}`);
    this.triggerToast(`Tipe kontrak "${name}" dihapus dari Data Master`, 'info');
  },

  // ----------------------------------------------------
  // SETTINGS & ACCESS CONTROL ACTIONS
  // ----------------------------------------------------

  // User Management (Integrated with ERP HRIS Directory)
  addUser(userPayload) {
    // Check if user already registered by email or nik
    const existingIndex = state.users.findIndex(u =>
      (userPayload.email && u.email?.toLowerCase() === userPayload.email.toLowerCase()) ||
      (userPayload.nik && u.nik === userPayload.nik)
    );

    const initials = userPayload.name
      ? userPayload.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : 'US';

    if (existingIndex !== -1) {
      // Update existing user with selected role and active status
      const existingUser = state.users[existingIndex];
      existingUser.role = userPayload.role || existingUser.role;
      existingUser.active = userPayload.active !== undefined ? userPayload.active : true;
      if (userPayload.department) existingUser.department = userPayload.department;
      if (userPayload.title) existingUser.title = userPayload.title;
      if (userPayload.phone) existingUser.phone = userPayload.phone;
      if (userPayload.nik) existingUser.nik = userPayload.nik;
      existingUser.isErpSynced = true;
      existingUser.erpSource = 'Workday HRIS';
      storage.set(storage.KEYS.USERS, state.users);
      this.addActivityLog('UPDATE_ROLE', 'Pengguna ERP', existingUser.id, `Memperbarui peran pengguna ERP: ${existingUser.name} (${existingUser.role})`);
      this.triggerToast(`Peran pengguna ERP "${existingUser.name}" berhasil diperbarui ke ${existingUser.role}`, 'success');
      return existingUser;
    }

    const newId = 'USR-' + String(Date.now()).slice(-4);
    const newUser = {
      id: newId,
      nik: userPayload.nik || 'EMP-' + String(Date.now()).slice(-4),
      name: userPayload.name,
      email: userPayload.email,
      role: userPayload.role || 'LEGAL STAFF',
      department: userPayload.department || 'Legal & Compliance',
      title: userPayload.title || 'Staff Spesialis',
      avatar: userPayload.avatar || initials,
      phone: userPayload.phone || '+62 21 555-0100',
      workLocation: userPayload.workLocation || 'Head Office Jakarta',
      isErpSynced: true,
      erpSource: 'Workday HRIS',
      active: userPayload.active !== undefined ? userPayload.active : true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    state.users.unshift(newUser);
    storage.set(storage.KEYS.USERS, state.users);
    this.addActivityLog('CREATE', 'Pengguna ERP', newId, `Menambahkan pengguna terintegrasi ERP: ${newUser.name} (${newUser.nik} - ${newUser.role})`);
    this.triggerToast(`Karyawan ERP "${newUser.name}" (${newUser.nik}) berhasil diberikan akses LMS sebagai ${newUser.role}`, 'success');
    return newUser;
  },

  updateUser(id, payload) {
    const user = state.users.find(u => u.id === id);
    if (!user) return;
    Object.assign(user, payload);
    storage.set(storage.KEYS.USERS, state.users);
    if (state.currentUser && state.currentUser.id === id) {
      state.currentUser = { ...user };
      storage.set(storage.KEYS.CURRENT_USER, state.currentUser);
    }
    this.addActivityLog('UPDATE', 'Pengguna', id, `Memperbarui data pengguna: ${user.name}`);
    this.triggerToast(`Data pengguna "${user.name}" berhasil diperbarui`, 'success');
  },

  toggleUserActive(id) {
    const user = state.users.find(u => u.id === id);
    if (!user) return;
    user.active = !user.active;
    storage.set(storage.KEYS.USERS, state.users);
    const status = user.active ? 'diaktifkan' : 'dinonaktifkan';
    this.addActivityLog('STATUS_CHANGE', 'Pengguna', id, `Akun pengguna ${user.name} ${status}`);
    this.triggerToast(`Akun "${user.name}" berhasil ${status}`, 'info');
  },

  switchToUser(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;
    state.currentUser = user;
    storage.set(storage.KEYS.CURRENT_USER, user);
    this.addActivityLog('SWITCH_USER', 'Sistem', user.id, `Beralih sesi login ke akun: ${user.name} (${user.role})`);
    this.triggerToast(`Sesi login beralih ke: ${user.name} (${user.role})`, 'info');
  },

  // Role Matrix Permissions
  toggleRoleCapability(roleKey, capKey) {
    if (!state.rolesMatrix[roleKey]) return;
    const caps = state.rolesMatrix[roleKey].capabilities;
    if (!caps) return;
    caps[capKey] = !caps[capKey];
    storage.set(storage.KEYS.ROLES_MATRIX, state.rolesMatrix);
    const capInfo = state.capabilityList.find(c => c.key === capKey);
    const label = capInfo ? capInfo.label : capKey;
    const statusText = caps[capKey] ? 'diberikan' : 'dicabut';
    this.addActivityLog('UPDATE_PERMISSION', 'Peran & Izin', roleKey, `Izin "${label}" untuk peran ${roleKey} ${statusText}`);
    this.triggerToast(`Izin "${label}" untuk peran ${roleKey} telah ${statusText}`, 'info');
  },

  addCustomRole({ name, description, cloneFromRole }) {
    const roleKey = name.trim().toUpperCase();
    if (state.rolesMatrix[roleKey]) {
      this.triggerToast(`Peran dengan kode "${roleKey}" sudah ada`, 'error');
      return false;
    }
    const baseCaps = cloneFromRole && state.rolesMatrix[cloneFromRole]
      ? { ...state.rolesMatrix[cloneFromRole].capabilities }
      : {
        can_create_request: true,
        can_review_contract: false,
        can_approve_contract: false,
        can_sign_contract: false,
        can_manage_tender: false,
        can_approve_tender_bid: false,
        can_view_tender_bonds: true,
        can_manage_disputes: false,
        can_manage_compliance: false,
        can_access_confidential_docs: false,
        can_export_reports: true,
        can_manage_users: false,
        can_manage_settings: false
      };
    state.rolesMatrix[roleKey] = {
      name: name.trim(),
      description: description || `Peran kustom operasional: ${name}`,
      isCustom: true,
      capabilities: baseCaps
    };
    storage.set(storage.KEYS.ROLES_MATRIX, state.rolesMatrix);
    this.addActivityLog('CREATE_ROLE', 'Peran & Izin', roleKey, `Membuat peran kustom baru: ${roleKey}`);
    this.triggerToast(`Peran baru "${roleKey}" berhasil ditambahkan ke matriks`, 'success');
    return true;
  },

  deleteCustomRole(roleKey) {
    if (!state.rolesMatrix[roleKey] || !state.rolesMatrix[roleKey].isCustom) {
      this.triggerToast(`Peran standar sistem tidak dapat dihapus`, 'error');
      return;
    }
    delete state.rolesMatrix[roleKey];
    storage.set(storage.KEYS.ROLES_MATRIX, state.rolesMatrix);
    this.addActivityLog('DELETE_ROLE', 'Peran & Izin', roleKey, `Menghapus peran kustom: ${roleKey}`);
    this.triggerToast(`Peran kustom "${roleKey}" berhasil dihapus`, 'info');
  },

  // Approval Flows
  updateApprovalFlow(id, payload) {
    const flow = state.approvalFlows.find(f => f.id === id);
    if (!flow) return;
    Object.assign(flow, payload);
    storage.set(storage.KEYS.APPROVAL_FLOWS, state.approvalFlows);
    this.addActivityLog('UPDATE_FLOW', 'Alur Persetujuan', id, `Memperbarui alur persetujuan: ${flow.title}`);
    this.triggerToast(`Alur persetujuan "${flow.title}" berhasil diperbarui`, 'success');
  },

  toggleApprovalFlowStatus(id) {
    const flow = state.approvalFlows.find(f => f.id === id);
    if (!flow) return;
    flow.active = !flow.active;
    storage.set(storage.KEYS.APPROVAL_FLOWS, state.approvalFlows);
    const st = flow.active ? 'diaktifkan' : 'dinonaktifkan';
    this.addActivityLog('STATUS_CHANGE', 'Alur Persetujuan', id, `Alur "${flow.title}" ${st}`);
    this.triggerToast(`Alur persetujuan "${flow.title}" ${st}`, 'info');
  },

  // ERP Integrations
  testErpConnection(code) {
    const erp = state.erpIntegrations.find(e => e.code === code);
    if (!erp) return;
    erp.testing = true;
    setTimeout(() => {
      erp.testing = false;
      erp.status = 'Connected';
      erp.lastSync = 'Baru saja (' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ')';
      storage.set(storage.KEYS.ERP_INTEGRATIONS, state.erpIntegrations);
      this.addActivityLog('INTEGRATION_TEST', 'Integrasi ERP', code, `Uji koneksi ping berhasil ke bridge: ${erp.name}`);
      this.triggerToast(`Uji koneksi ke ${erp.name} berhasil (Ping respon: 38ms)`, 'success');
    }, 850);
  },

  // Reset Data
  resetToDefault() {
    storage.resetStorage();
    state.users = storage.get(storage.KEYS.USERS, []);
    state.currentUser = storage.get(storage.KEYS.CURRENT_USER, null);
    state.currentEntity = 'PT Nusantara Energi';
    state.requests = storage.get(storage.KEYS.REQUESTS, []);
    state.contracts = storage.get(storage.KEYS.CONTRACTS, []);
    state.corporate = storage.get(storage.KEYS.CORPORATE, []);
    state.licenses = storage.get(storage.KEYS.LICENSES, []);
    state.compliance = storage.get(storage.KEYS.COMPLIANCE, []);
    state.disputes = storage.get(storage.KEYS.DISPUTES, []);
    state.ldd = storage.get(storage.KEYS.LDD, []);
    state.opinions = storage.get(storage.KEYS.LEGAL_OPINIONS, []);
    state.documents = storage.get(storage.KEYS.DOCUMENTS, []);
    state.correspondence = storage.get(storage.KEYS.CORRESPONDENCE, []);
    state.knowledge = storage.get(storage.KEYS.KNOWLEDGE, []);
    state.templates = storage.get(storage.KEYS.TEMPLATES, []);
    state.clauses = storage.get(storage.KEYS.CLAUSES, []);
    state.activityLogs = storage.get(storage.KEYS.ACTIVITY_LOGS, []);
    state.tenders = storage.get(storage.KEYS.TENDERS, []);
    state.tenderVault = storage.get(storage.KEYS.TENDER_VAULT, []);
    state.tenderBonds = storage.get(storage.KEYS.TENDER_BONDS, []);
    state.masterDocTypes = storage.get(storage.KEYS.MASTER_DOC_TYPES, []);
    state.masterSectors = storage.get(storage.KEYS.MASTER_SECTORS, []);
    state.masterStages = storage.get(storage.KEYS.MASTER_STAGES, {});
    state.masterContractTypes = storage.get(storage.KEYS.MASTER_CONTRACT_TYPES, []);
    state.rolesMatrix = storage.get(storage.KEYS.ROLES_MATRIX, initialRolesMatrix);
    state.approvalFlows = storage.get(storage.KEYS.APPROVAL_FLOWS, initialApprovalFlows);
    state.erpIntegrations = storage.get(storage.KEYS.ERP_INTEGRATIONS, initialErpIntegrations);
    state.erpEmployees = storage.get(storage.KEYS.ERP_EMPLOYEES, initialErpEmployees);
    this.triggerToast('Seluruh data simulasi telah dikembalikan ke kondisi awal (default).', 'success');
  }
};
