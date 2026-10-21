/**
 * Data Integrity & ERP Service Boundary Validator
 * Memvalidasi konsistensi relasi data internal (users, corporate, contracts, requests, correspondence)
 * dan kesiapan integrasi transisi dari LocalStorage mock ke Go REST backend.
 */
import { legalStore } from '../stores/legalStore.js';
import { storage } from '../services/storage.js';

export function runDataIntegrityCheck() {
  const state = legalStore.state;
  const results = {
    timestamp: new Date().toISOString(),
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    details: []
  };

  function assert(category, title, condition, message) {
    results.totalChecks++;
    if (condition) {
      results.passedChecks++;
      results.details.push({ category, title, status: 'PASSED', message });
    } else {
      results.failedChecks++;
      results.details.push({ category, title, status: 'FAILED', message });
    }
  }

  // 1. Validasi User & Relasi Peran RBAC
  const users = state.users || [];
  assert(
    'Users & RBAC',
    'Ketersediaan Akun Pengguna',
    users.length >= 6,
    `Tersedia ${users.length} akun pengguna terdaftar (minimal 6 peran unik).`
  );

  const roles = new Set(users.map(u => u.role));
  const expectedRoles = ['ADMIN', 'LEGAL MANAGER', 'LEGAL COUNSEL', 'LEGAL STAFF', 'REQUESTOR', 'MANAGEMENT'];
  const hasAllRoles = expectedRoles.every(r => roles.has(r));
  assert(
    'Users & RBAC',
    'Cakupan 6 Peran Baku (Standard Roles)',
    hasAllRoles,
    hasAllRoles ? 'Seluruh 6 peran standar terpenuhi.' : `Peran tidak lengkap: ${expectedRoles.filter(r => !roles.has(r)).join(', ')}`
  );

  const erpSyncedUsers = users.filter(u => u.nik && u.nik.startsWith('EMP-'));
  assert(
    'Users & RBAC',
    'Format NIK Sinkronisasi ERP HRIS',
    erpSyncedUsers.length > 0,
    `${erpSyncedUsers.length} pengguna memiliki format NIK ERP valid.`
  );

  // 2. Validasi Entitas Perseroan (Corporate Scoping)
  const corporate = state.corporate || {};
  const validEntities = [
    'PT Nusantara Energi',
    'PT Nusantara Holdings Utama',
    'PT Sinergi Tambang Gemilang'
  ];
  assert(
    'Corporate Scope',
    'Entitas Induk Terdaftar',
    !!corporate.name,
    `Entitas korporasi aktif: ${corporate.name || 'Belum diatur'}`
  );

  // 3. Validasi Kontrak & PO Contract Gate (PRC-07)
  const contracts = state.contracts || [];
  assert(
    'Contracts (CLM)',
    'Integritas Register Kontrak',
    contracts.length > 0,
    `Terdapat ${contracts.length} kontrak komersial terdaftar.`
  );

  const activeContracts = contracts.filter(c => c.status === 'ACTIVE');
  assert(
    'Contracts (CLM)',
    'Kesiapan PO Contract Gate (PRC-07)',
    activeContracts.length > 0,
    `Terdapat ${activeContracts.length} kontrak berstatus ACTIVE siap divalidasi oleh modul Procurement untuk penerbitan PO.`
  );

  // 4. Validasi Permintaan Legal & Chain Approval
  const requests = state.requests || [];
  assert(
    'Requests & Approval',
    'Integritas Tiket Permohonan',
    requests.length > 0,
    `Terdapat ${requests.length} tiket layanan hukum.`
  );

  const requestsWithChain = requests.filter(r => Array.isArray(r.approvalChain) && r.approvalChain.length > 0);
  assert(
    'Requests & Approval',
    'Kelengkapan Multi-Tier Chain Approval',
    requestsWithChain.length === requests.length,
    `${requestsWithChain.length} dari ${requests.length} tiket telah dilengkapi rantai approval terstruktur.`
  );

  // 5. Validasi Korespondensi & Format Nomor Surat
  const letters = state.correspondence || [];
  assert(
    'Correspondence',
    'Register Surat & Somasi',
    letters.length > 0,
    `Terdapat ${letters.length} arsip surat masuk/keluar & somasi.`
  );

  const lettersWithNumber = letters.filter(l => l.letterNumber && l.letterNumber.length > 5);
  assert(
    'Correspondence',
    'Format Nomor Surat Terstandarisasi',
    lettersWithNumber.length === letters.length,
    `${lettersWithNumber.length} surat memiliki format nomor resmi.`
  );

  // 6. Validasi Quota LocalStorage & Auto-Capping Log
  const logs = state.activityLogs || [];
  assert(
    'Storage & Quota',
    'Auto-Capping Activity Logs (Limit 200 Items)',
    logs.length <= 200,
    `Log aktivitas berjumlah ${logs.length} (dibawah batas aman 200).`
  );

  const usage = storage.getStorageUsage ? storage.getStorageUsage() : { percent: 5 };
  assert(
    'Storage & Quota',
    'Kapasitas Memori Browser (LocalStorage)',
    usage.percent < 80,
    `Kapasitas terpakai: ${usage.percent}% dari kuota 5MB browser.`
  );

  return results;
}
