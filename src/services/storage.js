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
} from '../data/seedData.js';

const STORAGE_KEYS = {
  USERS: 'lms_users_v2',
  CURRENT_USER: 'lms_current_user_v2',
  CURRENT_ENTITY: 'lms_current_entity_v1',
  REQUESTS: 'lms_requests_v1',
  CONTRACTS: 'lms_contracts_v1',
  CORPORATE: 'lms_corporate_v2',
  LICENSES: 'lms_licenses_v1',
  COMPLIANCE: 'lms_compliance_v1',
  DISPUTES: 'lms_disputes_v2',
  LDD: 'lms_ldd_v2',
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
  ROLES_MATRIX: 'lms_roles_matrix_v2',
  APPROVAL_FLOWS: 'lms_approval_flows_v2',
  ERP_INTEGRATIONS: 'lms_erp_integrations_v1',
  ERP_EMPLOYEES: 'lms_erp_employees_v1'
};

export function normalizeRole(role) {
  if (!role) return 'STAFF LEGAL';
  const r = role.toUpperCase().trim();
  if (r === 'ADMIN' || r === 'SUPER ADMIN') return 'SUPER ADMIN';
  if (r === 'LEGAL MANAGER' || r === 'KEPALA LEGAL') return 'KEPALA LEGAL';
  if (r === 'LEGAL COUNSEL' || r === 'LEGAL STAFF' || r === 'STAFF LEGAL') return 'STAFF LEGAL';
  if (r === 'REQUESTOR') return 'REQUESTOR';
  if (r === 'MANAGEMENT' || r.includes('DIREKTUR')) return 'DIREKTUR (DASHBOARD)';
  return role;
}

export function normalizeCorporate(list) {
  if (!Array.isArray(list)) return [];
  return list.map(c => {
    const deeds = c.deeds || [];
    const incDeed = c.incorporationDeed || deeds.find(d => d.deedType?.toLowerCase().includes('pendirian')) || deeds[0] || {};
    const latestDeed = c.latestDeed || (deeds.length > 1 ? deeds[deeds.length - 1] : deeds[0]) || {};
    const issued = c.capital?.issued ?? c.paidCapital ?? 0;
    const authorized = c.capital?.authorized ?? c.shareCapital ?? 0;

    return {
      ...c,
      paidCapital: issued,
      shareCapital: authorized,
      capital: {
        issued,
        authorized
      },
      incorporationDeed: {
        number: incDeed.deedNumber || incDeed.number || 'No. 45',
        deedNumber: incDeed.deedNumber || incDeed.number || 'No. 45',
        date: incDeed.date || incDeed.deedDate || '2015-03-12',
        deedDate: incDeed.date || incDeed.deedDate || '2015-03-12',
        notary: incDeed.notaryName || incDeed.notary || 'Aulia Taufani, S.H., M.Kn.',
        notaryName: incDeed.notaryName || incDeed.notary || 'Aulia Taufani, S.H., M.Kn.',
        skMenkumham: incDeed.ahuNumber || incDeed.skMenkumham || 'AHU-0012984.AH.01.01.TAHUN 2015',
        ahuNumber: incDeed.ahuNumber || incDeed.skMenkumham || 'AHU-0012984.AH.01.01.TAHUN 2015'
      },
      latestDeed: {
        number: latestDeed.deedNumber || latestDeed.number || 'No. 18',
        deedNumber: latestDeed.deedNumber || latestDeed.number || 'No. 18',
        date: latestDeed.date || latestDeed.deedDate || '2024-05-10',
        deedDate: latestDeed.date || latestDeed.deedDate || '2024-05-10',
        notary: latestDeed.notaryName || latestDeed.notary || 'Fanny Stephanie, S.H., M.Kn.',
        notaryName: latestDeed.notaryName || latestDeed.notary || 'Fanny Stephanie, S.H., M.Kn.',
        skMenkumham: latestDeed.ahuNumber || latestDeed.skMenkumham || 'AHU-0044521.AH.01.02.TAHUN 2024',
        ahuNumber: latestDeed.ahuNumber || latestDeed.skMenkumham || 'AHU-0044521.AH.01.02.TAHUN 2024'
      },
      directors: (c.directors || []).map(d => ({
        ...d,
        title: d.title || d.position || '',
        position: d.position || d.title || '',
        period: d.period || (d.periodStart ? `${d.periodStart} s/d ${d.periodEnd}` : '2024 - 2029')
      })),
      commissioners: (c.commissioners || []).map(com => ({
        ...com,
        title: com.title || com.position || '',
        position: com.position || com.title || '',
        period: com.period || (com.periodStart ? `${com.periodStart} s/d ${com.periodEnd}` : '2024 - 2029')
      }))
    };
  });
}

export function normalizeDisputes(list) {
  if (!Array.isArray(list)) return [];
  return list.map(d => {
    const disputeVal = d.disputeValue ?? d.claimValue ?? 0;
    const counsel = d.legalCounsel || d.externalCounsel || d.lawyer || 'Tim Internal Legal';
    const nextDate = d.nextHearingDate || d.nextHearing || '2026-09-15';
    const summ = d.summary || d.remarks || '';
    const risk = d.riskLevel || (disputeVal >= 30000000000 ? 'HIGH' : disputeVal >= 5000000000 ? 'MEDIUM' : 'LOW');

    const timeline = (d.timeline || []).map(t => ({
      ...t,
      description: t.description || t.agendaOrNotes || '',
      agendaOrNotes: t.agendaOrNotes || t.description || ''
    }));

    return {
      ...d,
      disputeValue: disputeVal,
      claimValue: disputeVal,
      legalCounsel: counsel,
      externalCounsel: counsel,
      nextHearingDate: nextDate,
      nextHearing: nextDate,
      summary: summ,
      remarks: summ,
      riskLevel: risk,
      timeline
    };
  });
}

export function normalizeLDD(list) {
  if (!Array.isArray(list)) return [];
  return list.map(p => {
    const projName = p.projectName || p.project || 'Uji Tuntas Hukum Proyek Korporasi';
    const lead = p.leadCounsel || p.pic || 'Tim Legal M&A';

    let checklist = Array.isArray(p.checklist) && p.checklist.length > 0 ? p.checklist : [];
    if (checklist.length === 0) {
      if (p.id === 'LDD-2026-0001' || projName.includes('Helios')) {
        checklist = [
          { id: 'CHK-HL-01', category: 'Aspek Korporasi', item: 'Pemeriksaan Akta Pendirian, AD/ART & SK Menkumham target', status: 'OK', notes: 'Legalitas dasar perseroan lengkap & sah.' },
          { id: 'CHK-HL-02', category: 'Aspek Pertanahan', item: 'Verifikasi status hak tanah tapak solar farm 4.2 Ha', status: 'FLAG', notes: 'Sebagian tanah masih SHM perorangan, belum pelepasan hak ke HGB atas nama perseroan.' },
          { id: 'CHK-HL-03', category: 'Perizinan & Lingkungan', item: 'Pemenuhan Persetujuan Teknis (Pertek) & Baku Mutu Emisi', status: 'FLAG', notes: 'Addendum Pertek emisi pasca penambahan trafo 30 MVA dalam proses permohonan.' },
          { id: 'CHK-HL-04', category: 'Kontrak Komersial', item: 'Review Perjanjian PPA (Power Purchase Agreement) 25 Tahun PLN', status: 'OK', notes: 'Tarif feed-in tariff terjamin dan jadwal COD selaras dengan RKAP.' },
          { id: 'CHK-HL-05', category: 'Keuangan & Pemegang Saham', item: 'Evaluasi Shareholder Loan IDR 8.5 Miliar', status: 'FLAG', notes: 'Belum ada perjanjian pinjaman pemegang saham tersubordinasi tertulis bertanggal pasti.' },
          { id: 'CHK-HL-06', category: 'Ketenagakerjaan', item: 'Hubungan industrial, struktur upah & BPJS Ketenagakerjaan', status: 'OK', notes: '100% pekerja terdaftar BPJS dan tidak ada sengketa PHI berjalan.' },
          { id: 'CHK-HL-07', category: 'Perpajakan & Fiskal', item: 'Status KSWP & Kepatuhan Pelaporan SPT Tahunan PPh Badan', status: 'OK', notes: 'Status KSWP Valid di DJP Online, tidak ada sengketa banding pengadilan pajak.' },
          { id: 'CHK-HL-08', category: 'Litigasi & Sengketa', item: 'Pemeriksaan riwayat sengketa pengadilan dan arbitrase', status: 'OK', notes: 'Surat keterangan bebas perkara terverifikasi bersih dari PN dan BANI.' }
        ];
      } else if (p.id === 'LDD-2026-0002' || projName.includes('Vulcan')) {
        checklist = [
          { id: 'CHK-VL-01', category: 'Aspek Korporasi', item: 'Pemeriksaan komposisi pemegang saham & batasan kuorum RUPS', status: 'OK', notes: 'Anggaran dasar selaras dengan ketentuan UU PT No. 40/2007.' },
          { id: 'CHK-VL-02', category: 'Kontrak Komersial', item: 'Klausul Change of Control Master PPA No. 044/PPA/2019', status: 'FLAG', notes: 'Wajib mendapatkan written consent tertulis dari Direksi PLN sebelum pengalihan saham >20%.' },
          { id: 'CHK-VL-03', category: 'Lingkungan Hidup', item: 'Izin Lingkungan & Rekomendasi Teknis WKP Panas Bumi Patuha', status: 'FLAG', notes: 'Perlu pembaruan dokumen evaluasi lingkungan hidup pasca penambahan sumur produksi.' },
          { id: 'CHK-VL-04', category: 'Aset & Fasilitas', item: 'Sertifikat Laik Operasi (SLO) dan Persetujuan Kawasan Hutan (PPKH)', status: 'OK', notes: 'Izin PPKH aktif berlaku hingga 2035 dengan Kementerian LHK.' },
          { id: 'CHK-VL-05', category: 'Ketenagakerjaan', item: 'Kepatuhan K3 Panas Bumi dan Perjanjian Kerja Waktu Tertentu', status: 'OK', notes: 'Sertifikasi keselamatan kerja Ditjen EBTKE Kementerian ESDM lengkap.' },
          { id: 'CHK-VL-06', category: 'Litigasi & Sengketa', item: 'Riwayat klaim kontraktor pengeboran (drilling contractor)', status: 'OK', notes: 'Tidak ada arbitrase terbuka atau sita eksekusi aset.' }
        ];
      } else {
        checklist = [
          { id: `CHK-${p.id}-1`, category: 'Aspek Korporasi', item: 'Pemeriksaan Akta Pendirian, Anggaran Dasar & SK Menkumham', status: 'OK', notes: 'Dokumen legalitas dasar lengkap.' },
          { id: `CHK-${p.id}-2`, category: 'Aspek Perizinan', item: 'Verifikasi NIB, IUP Operasional & KSWP Pajak', status: 'FLAG', notes: 'Perlu konfirmasi masa berlaku PB-UMKU.' },
          { id: `CHK-${p.id}-3`, category: 'Aspek Kontrak Material', item: 'Review Perjanjian PPA/EPC & Klausul Change of Control', status: 'OK', notes: 'Klausul pembatasan peralihan saham telah dianalisis.' },
          { id: `CHK-${p.id}-4`, category: 'Ketenagakerjaan', item: 'Pemeriksaan Peraturan Perusahaan & Kepesertaan BPJS', status: 'OK', notes: 'Kepatuhan norma ketenagakerjaan terpenuhi.' }
        ];
      }
    }

    return {
      ...p,
      projectName: projName,
      project: projName,
      leadCounsel: lead,
      pic: lead,
      checklist
    };
  });
}

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
    const rawUsers = this.get(STORAGE_KEYS.USERS, initialUsers);
    const loadedUsers = (Array.isArray(rawUsers) ? rawUsers : initialUsers).map(u => ({
      ...u,
      role: normalizeRole(u.role)
    }));

    const rawCurrentUser = this.get(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
    const loadedCurrentUser = rawCurrentUser
      ? { ...rawCurrentUser, role: normalizeRole(rawCurrentUser.role) }
      : loadedUsers[0];

    const rawCorporate = this.get(STORAGE_KEYS.CORPORATE, initialCorporate);
    const loadedCorporate = normalizeCorporate(Array.isArray(rawCorporate) ? rawCorporate : initialCorporate);

    const rawDisputes = this.get(STORAGE_KEYS.DISPUTES, initialDisputes);
    const loadedDisputes = normalizeDisputes(Array.isArray(rawDisputes) ? rawDisputes : initialDisputes);

    const rawLDD = this.get(STORAGE_KEYS.LDD, initialLDD);
    const loadedLDD = normalizeLDD(Array.isArray(rawLDD) ? rawLDD : initialLDD);

    return {
      users: loadedUsers,
      currentUser: loadedCurrentUser,
      currentEntity: this.get(STORAGE_KEYS.CURRENT_ENTITY, 'PT Nusantara Energi'),
      requests: this.get(STORAGE_KEYS.REQUESTS, initialRequests),
      contracts: this.get(STORAGE_KEYS.CONTRACTS, initialContracts),
      corporate: loadedCorporate,
      licenses: this.get(STORAGE_KEYS.LICENSES, initialLicenses),
      compliance: this.get(STORAGE_KEYS.COMPLIANCE, initialCompliance),
      disputes: loadedDisputes,
      ldd: loadedLDD,
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
    this.set(STORAGE_KEYS.CORPORATE, normalizeCorporate(initialCorporate));
    this.set(STORAGE_KEYS.LICENSES, initialLicenses);
    this.set(STORAGE_KEYS.COMPLIANCE, initialCompliance);
    this.set(STORAGE_KEYS.DISPUTES, normalizeDisputes(initialDisputes));
    this.set(STORAGE_KEYS.LDD, normalizeLDD(initialLDD));
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
      corporate: normalizeCorporate(initialCorporate),
      licenses: initialLicenses,
      compliance: initialCompliance,
      disputes: normalizeDisputes(initialDisputes),
      ldd: normalizeLDD(initialLDD),
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
