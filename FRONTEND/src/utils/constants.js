export const ERP_MODULES = [
  { id: 'dashboard', name: 'Dashboard', actions: ['read'] },
  { id: 'purchase', name: 'Purchase Management', actions: ['create', 'read', 'update', 'delete', 'approve'] },
  { id: 'sales', name: 'Sales & Invoicing', actions: ['create', 'read', 'update', 'delete', 'print'] },
  { id: 'inventory', name: 'Inventory / Stock', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'branchmanagement', name: 'Branch Management', actions: ['create', 'read', 'update'] },
  { id: 'users', name: 'User Management', actions: ['create', 'read', 'update', 'delete'] },
];
