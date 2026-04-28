// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from '../pages/Login';
// import Dashboard from '../pages/Dashboard';
// import Register from '../pages/Register';
// import CreateRole from '../pages/Roles/CreateRoles'; 
// import UserManagement from '../pages/Users/UserManagement';
// import CreateCompany from '../pages/Company/CreateCompany'; 
// import CreateBranch from '../pages/Company/CreateBranch'; 
// import CreateSales from '../pages/Company/CreateSales'; 
// import PartyManagement from '../pages/Users/PartyManagement'; 
// import CreatePurchase from '../pages/company/CreatePurchase'; 
// import PurchaseHistory from '../pages/company/PurchaseHistroy'; 

// // 🔥 Naya Import for Ledger
// import PartyLedger from '../pages/Finance/PartyLedger'; 

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('erp_token');
//   if (!token) return <Navigate to="/" replace />;
//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem('erp_token');
//   if (token) return <Navigate to="/dashboard" replace />;
//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
//       <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

//       {/* --- Protected Routes --- */}
//       <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
      
//       {/* User & Role Management */}
//       <Route path="/role" element={<ProtectedRoute><CreateRole /></ProtectedRoute>} /> 
//       <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} /> 
//       <Route path="/parties" element={<ProtectedRoute><PartyManagement /></ProtectedRoute>} />

//       {/* Company & Branch */}
//       <Route path="/create-company" element={<ProtectedRoute><CreateCompany /></ProtectedRoute>} /> 
//       <Route path="/create-branch" element={<ProtectedRoute><CreateBranch /></ProtectedRoute>} /> 

//       {/* --- Inventory & Transactions --- */}
//       <Route path="/sales" element={<ProtectedRoute><CreateSales /></ProtectedRoute>} />
      
//       {/* Purchase Module */}
//       <Route path="/purchase/create" element={<ProtectedRoute><CreatePurchase /></ProtectedRoute>} />
//       <Route path="/purchase/history" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />

//       {/* --- Finance Module --- */}
//       {/* 💳 Party Ledger Route Added */}
//       <Route path="/finance/ledger" element={<ProtectedRoute><PartyLedger /></ProtectedRoute>} />

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;



// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from '../pages/Login';
// import Dashboard from '../pages/Dashboard';
// import Register from '../pages/Register';
// import CreateRole from '../pages/Roles/CreateRoles'; 
// import UserManagement from '../pages/Users/UserManagement';
// import CreateCompany from '../pages/Company/CreateCompany'; 
// import CreateBranch from '../pages/Company/CreateBranch'; 
// import CreateSales from '../pages/Company/CreateSales'; 
// import PartyManagement from '../pages/Users/PartyManagement'; 
// import CreatePurchase from '../pages/company/CreatePurchase'; 
// import PurchaseHistory from '../pages/company/PurchaseHistroy'; 

// // 🔥 Naye Imports
// import Inventory from '../pages/company/Inventory'; 
// import PartyLedger from '../pages/Finance/'; 

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('erp_token');
//   if (!token) return <Navigate to="/" replace />;
//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem('erp_token');
//   if (token) return <Navigate to="/dashboard" replace />;
//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
//       <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

//       {/* --- Protected Operations --- */}
//       <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
      
//       {/* 📦 Inventory Module */}
//       <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />

//       {/* 🛒 Purchase Module */}
//       <Route path="/purchase/create" element={<ProtectedRoute><CreatePurchase /></ProtectedRoute>} />
//       <Route path="/purchase/history" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />

//       {/* 💰 Finance Module */}
//       <Route path="/finance/ledger" element={<ProtectedRoute><PartyLedger /></ProtectedRoute>} />

//       {/* 👥 Management & Parties */}
//       <Route path="/parties" element={<ProtectedRoute><PartyManagement /></ProtectedRoute>} />
//       <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} /> 
//       <Route path="/role" element={<ProtectedRoute><CreateRole /></ProtectedRoute>} /> 

//       {/* 🏢 Entity Setup */}
//       <Route path="/create-company" element={<ProtectedRoute><CreateCompany /></ProtectedRoute>} /> 
//       <Route path="/create-branch" element={<ProtectedRoute><CreateBranch /></ProtectedRoute>} /> 

//       {/* 🏷️ Sales */}
//       <Route path="/sales" element={<ProtectedRoute><CreateSales /></ProtectedRoute>} /> 

//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;




import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import CreateRole from '../pages/Roles/CreateRoles'; 
import UserManagement from '../pages/Users/UserManagement';
import CreateCompany from '../pages/Company/CreateCompany'; 
import CreateBranch from '../pages/Company/CreateBranch'; 
import CreateSales from '../pages/Company/CreateSales'; 
import PartyManagement from '../pages/Users/PartyManagement'; 
import CreatePurchase from '../pages/company/CreatePurchase'; 
import PurchaseHistory from '../pages/company/PurchaseHistroy'; 

// 🔥 Corrected & New Imports
import Inventory from '../pages/company/Inventory'; 
import PartyLedger from '../pages/Finance/PartyLedger'; // Fixed path
import SalesHistory from '../pages/company/SalesHistory';

import Analytics from '../pages/company/Analytics'; // New Analytics Page

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('erp_token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('erp_token');
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* --- Protected Operations --- */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
      
      {/* 📦 Inventory Module */}
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />

      {/* 🛒 Purchase Module */}
      <Route path="/purchase/create" element={<ProtectedRoute><CreatePurchase /></ProtectedRoute>} />
      <Route path="/purchase/history" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />
      {/* 🏷️ Sales (POS) Module */}
      <Route path="/sales/create" element={<ProtectedRoute><CreateSales /></ProtectedRoute>} />
      <Route path="/sales/history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />

      {/* 💰 Finance & Ledger Module */}
      <Route path="/finance/ledger" element={<ProtectedRoute><PartyLedger /></ProtectedRoute>} />
        {/* 📈 Analytics Dashboard */}
        
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      {/* 👥 CRM & Parties */}
      <Route path="/parties" element={<ProtectedRoute><PartyManagement /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} /> 
      <Route path="/role" element={<ProtectedRoute><CreateRole /></ProtectedRoute>} /> 

      {/* 🏢 Business Entity Setup */}
      <Route path="/create-company" element={<ProtectedRoute><CreateCompany /></ProtectedRoute>} /> 
      <Route path="/create-branch" element={<ProtectedRoute><CreateBranch /></ProtectedRoute>} /> 

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
