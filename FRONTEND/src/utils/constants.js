export const ERP_MODULES = [
  // 📊 Core Views
  { id: 'dashboard', name: 'Dashboard', actions: ['read'] },
  { id: 'analytics', name: 'Analytics & Reports', actions: ['read', 'export'] },

  // 📦 Inventory & Items
  { id: 'inventory', name: 'Live Inventory & Items', actions: ['create', 'read', 'update', 'delete', 'adjust'] },

  // 🏷️ Sales Operations
  { id: 'sales', name: 'Sales & POS', actions: ['create', 'read', 'update', 'delete', 'print', 'refund'] },

  // 🛒 Purchase Operations
  { id: 'purchase', name: 'Purchase Management', actions: ['create', 'read', 'update', 'delete', 'approve'] },

  // 🤝 CRM & Finance
  { id: 'parties', name: 'Parties (Customers/Vendors)', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'finance', name: 'Finance & Ledger', actions: ['read', 'update', 'export'] },

  // ⚙️ System Administration
  { id: 'users', name: 'User Management', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'roles', name: 'Role Engine', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'entities', name: 'Entity & Branch Mgmt', actions: ['create', 'read', 'update'] },
];