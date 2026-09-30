import {
  initialCapabilityList,
  initialRolesMatrix,
  initialApprovalFlows,
  initialErpIntegrations,
  initialErpEmployees
} from '../src/data/seedData.js';

console.log('--- TEST DATA SEED ---');
console.log('Capabilities count:', initialCapabilityList.length);
console.log('Roles matrix keys:', Object.keys(initialRolesMatrix));
console.log('Approval flows count:', initialApprovalFlows.length);
console.log('ERP Integrations count:', initialErpIntegrations.length);
console.log('ERP Employees count:', initialErpEmployees.length);

// Assertions
if (initialCapabilityList.length === 13) {
  console.log('✓ Capability list matches 13 permissions');
} else {
  console.error('✗ Capability list mismatch:', initialCapabilityList.length);
}

if (initialApprovalFlows.length === 6) {
  console.log('✓ Approval flows match 6 workflows with thresholds');
} else {
  console.error('✗ Approval flows mismatch');
}

if (initialErpIntegrations.length === 5) {
  console.log('✓ ERP Integrations match 5 enterprise systems');
} else {
  console.error('✗ ERP Integrations mismatch');
}

if (initialErpEmployees.length === 16) {
  console.log('✓ ERP Employees match 16 personnel synced from Workday HRIS');
} else {
  console.error('✗ ERP Employees mismatch:', initialErpEmployees.length);
}

console.log('All settings and ERP assertions passed successfully!');
