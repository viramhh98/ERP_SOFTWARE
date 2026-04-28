// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { 
//   LayoutDashboard, Box, ShoppingCart, Users, ChevronLeft, ChevronRight, 
//   LogOut, ShieldCheck, Building2, GitBranch, Settings, 
//   Wallet, Truck, BarChart3, KeyRound, UserPlus, PlusCircle, Share2,
//   ClipboardList, BookOpen
// } from 'lucide-react';
// import api from '../../services/api';

// const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [companies, setCompanies] = useState([]);
  
//   const [selectedComp, setSelectedComp] = useState(localStorage.getItem('activeCompanyId') || '');
//   const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem('activeBranchId') || '');

//   // --- UPDATED MENU ITEMS ---
//   const menuItems = [
//     { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    
//     // 📦 Inventory Section
//     { name: 'Live Inventory', path: '/inventory', icon: <Box size={20} className="text-emerald-400" /> },
    
//     // 🛒 Purchase Module
//     { name: 'New Purchase', path: '/purchase/create', icon: <PlusCircle size={20} className="text-blue-400" /> },
//     { name: 'Purchase History', path: '/purchase/history', icon: <ClipboardList size={20} /> },
    
//     // 💰 Finance Module
//     { name: 'Party Ledger', path: '/finance/ledger', icon: <BookOpen size={20} className="text-amber-400" /> },
    
//     // Future Expansion
//     { name: 'Sales Flow', path: '/sales', icon: <ShoppingCart size={20} /> },
//     { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
//   ];

//   const managementItems = [
//     { name: 'Parties', path: '/parties', icon: <Users size={20} /> },
//     { name: 'User Control', path: '/users', icon: <UserPlus size={20} /> },
//     { name: 'Role Engine', path: '/role', icon: <KeyRound size={20} /> },
//     { name: 'Add Company', path: '/create-company', icon: <PlusCircle size={20} className="text-indigo-400" /> },
//     { name: 'Add Branch', path: '/create-branch', icon: <Share2 size={20} className="text-emerald-400" /> },
//   ];

//   // ... (Keep existing useEffect, handleCompanyChange, handleBranchChange logic here)

//   const NavItem = ({ item }) => {
//     const isActive = location.pathname === item.path;
//     return (
//       <div
//         onClick={() => navigate(item.path)}
//         className={`group flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative ${
//           isActive 
//           ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold' 
//           : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
//         }`}
//       >
//         <div className={`${isActive ? 'text-white' : 'group-hover:text-blue-400'} transition-colors`}>
//           {item.icon}
//         </div>
//         {!isCollapsed && <span className="text-[14px] font-medium">{item.name}</span>}
//         {isActive && !isCollapsed && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white" />}
//       </div>
//     );
//   };

//   return (
//     <aside className={`bg-[#0f172a] text-slate-300 flex flex-col transition-all duration-500 shadow-2xl border-r border-slate-800 h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-72'}`}>
//       <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50">
//         {!isCollapsed && (
//           <div className="flex items-center gap-3">
//             <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
//               <ShieldCheck className="text-white" size={22} />
//             </div>
//             <span className="text-xl font-bold tracking-tight text-white">ERP<span className="text-blue-500 font-extrabold">PRO</span></span>
//           </div>
//         )}
//         <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-xl bg-slate-800/40 hover:bg-blue-600 hover:text-white transition-all ml-auto">
//           {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//         </button>
//       </div>

//       {!isCollapsed && (
//         <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-2">
//           {/* Company & Branch Selectors (Keep your existing code here) */}
//         </div>
//       )}

//       <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
//         {!isCollapsed && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-2">Operational</p>}
//         {menuItems.map((item) => <NavItem key={item.path} item={item} />)}

//         {!isCollapsed && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-8">System Admin</p>}
//         {managementItems.map((item) => <NavItem key={item.path} item={item} />)}
//       </nav>

//       <div className="p-4 bg-slate-950/20 border-t border-slate-800/50">
//         <button onClick={() => { localStorage.clear(); navigate('/'); }} className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all">
//           <LogOut size={20} />
//           {!isCollapsed && <span className="font-bold text-sm">Logout Session</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
















// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { 
//   LayoutDashboard, Box, ShoppingCart, Users, ChevronLeft, ChevronRight, 
//   LogOut, ShieldCheck, Building2, GitBranch, Settings, 
//   Wallet, Truck, BarChart3, KeyRound, UserPlus, PlusCircle, Share2,
//   ClipboardList, BookOpen, ReceiptIndianRupee
// } from 'lucide-react';
// import api from '../../services/api';

// const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [companies, setCompanies] = useState([]);
//   const [selectedComp, setSelectedComp] = useState(localStorage.getItem('activeCompanyId') || '');
//   const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem('activeBranchId') || '');

//   // --- 🚀 DYNAMIC MENU ITEMS ---
//   const menuItems = [
//     { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
//     { name: 'Live Inventory', path: '/inventory', icon: <Box size={20} className="text-emerald-400" /> },
    
//     // 🏷️ Sales Section (POS)
//     { name: 'New Sale (POS)', path: '/sales/create', icon: <ShoppingCart size={20} className="text-emerald-500" /> },
    
//     // 🛒 Purchase Module
//     { name: 'New Purchase', path: '/purchase/create', icon: <PlusCircle size={20} className="text-blue-400" /> },
//     { name: 'Purchase History', path: '/purchase/history', icon: <ClipboardList size={20} /> },
    
//     // 💰 Finance & Ledger
//     { name: 'Party Ledger', path: '/finance/ledger', icon: <BookOpen size={20} className="text-amber-400" /> },
//     { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
//   ];

//   const managementItems = [
//     { name: 'Manage Parties', path: '/parties', icon: <Users size={20} /> },
//     { name: 'User Controls', path: '/users', icon: <UserPlus size={20} /> },
//     { name: 'Role Engine', path: '/role', icon: <KeyRound size={20} /> },
//     { name: 'Deploy Entity', path: '/create-company', icon: <PlusCircle size={20} className="text-indigo-400" /> },
//     { name: 'Integrate Branch', path: '/create-branch', icon: <Share2 size={20} className="text-emerald-400" /> },
//   ];

//   // ... (useEffect & existing logic same as before)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get('/user-company-role/allcompanybranches');
//         setCompanies(res.data);
//       } catch (err) { console.error("Fetch failed", err); }
//     };
//     fetchData();
//   }, []);

//   const handleCompanyChange = (e) => {
//     localStorage.setItem('activeCompanyId', e.target.value);
//     localStorage.removeItem('activeBranchId');
//     window.location.reload();
//   };

//   const handleBranchChange = (e) => {
//     localStorage.setItem('activeBranchId', e.target.value);
//     window.location.reload();
//   };

//   const NavItem = ({ item }) => {
//     const isActive = location.pathname === item.path;
//     return (
//       <div onClick={() => navigate(item.path)}
//         className={`group flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative ${
//           isActive ? 'bg-blue-600 text-white shadow-lg font-semibold' : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
//         }`}
//       >
//         <div className={`${isActive ? 'text-white' : 'group-hover:text-blue-400'} transition-colors`}>{item.icon}</div>
//         {!isCollapsed && <span className="text-[14px]">{item.name}</span>}
//         {isActive && !isCollapsed && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white" />}
//       </div>
//     );
//   };

//   return (
//     <aside className={`bg-[#0f172a] text-slate-300 flex flex-col transition-all duration-500 shadow-2xl border-r border-slate-800 h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-72'}`}>
//       <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50">
//         {!isCollapsed && <span className="text-xl font-bold tracking-tight text-white">ERP<span className="text-blue-500">PRO</span></span>}
//         <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-xl bg-slate-800/40 hover:bg-blue-600 ml-auto transition-all">
//           {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//         </button>
//       </div>

//       {!isCollapsed && (
//         <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-2">
//             <select value={selectedComp} onChange={handleCompanyChange} className="w-full bg-slate-900/50 text-[11px] font-bold p-2.5 rounded-xl border border-slate-700/50 outline-none transition-all cursor-pointer">
//                 <option value="" disabled>Select Entity</option>
//                 {companies.map(c => <option key={c.companyId} value={c.companyId}>{c.companyName}</option>)}
//             </select>
//         </div>
//       )}

//       <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
//         {!isCollapsed && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-2">Core Modules</p>}
//         {menuItems.map((item) => <NavItem key={item.path} item={item} />)}
//         {!isCollapsed && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-8">Administration</p>}
//         {managementItems.map((item) => <NavItem key={item.path} item={item} />)}
//       </nav>

//       <div className="p-4 border-t border-slate-800/50">
//         <button onClick={() => { localStorage.clear(); navigate('/'); }} className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-rose-400 transition-all">
//           <LogOut size={20} /> {!isCollapsed && <span className="font-bold text-sm">Sign Out</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;















import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Box, ShoppingCart, Users, ChevronLeft, ChevronRight, 
  LogOut, ShieldCheck, Building2, GitBranch, Settings, 
  Wallet, Truck, BarChart3, KeyRound, UserPlus, PlusCircle, Share2,
  ClipboardList, BookOpen
} from 'lucide-react';
import api from '../../services/api';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companies, setCompanies] = useState([]);
  
  const [selectedComp, setSelectedComp] = useState(localStorage.getItem('activeCompanyId') || '');
  const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem('activeBranchId') || '');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Inventory', path: '/inventory', icon: <Box size={20} className="text-emerald-400" /> },
    
    // 🏷️ Sales Section
    { name: 'New Sale (POS)', path: '/sales/create', icon: <PlusCircle size={20} className="text-emerald-500" /> },
    { name: 'Sales History', path: '/sales/history', icon: <ShoppingCart size={20} /> },

    // 🛒 Purchase Section
    { name: 'New Purchase', path: '/purchase/create', icon: <PlusCircle size={20} className="text-blue-400" /> },
    { name: 'Purchase History', path: '/purchase/history', icon: <ClipboardList size={20} /> },
    
    // 💰 Finance
    { name: 'Party Ledger', path: '/finance/ledger', icon: <BookOpen size={20} className="text-amber-400" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  ];

  const managementItems = [
    { name: 'Parties', path: '/parties', icon: <Users size={20} /> },
    { name: 'User Management', path: '/users', icon: <UserPlus size={20} /> },
    { name: 'Role Engine', path: '/role', icon: <KeyRound size={20} /> },
    { name: 'Deploy Entity', path: '/create-company', icon: <PlusCircle size={20} className="text-indigo-400" /> },
    { name: 'Integrate Branch', path: '/create-branch', icon: <Share2 size={20} className="text-emerald-400" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user-company-role/allcompanybranches');
        const data = res.data;
        setCompanies(data);

        if (!localStorage.getItem('activeCompanyId') && data.length > 0) {
          const firstComp = data[0];
          localStorage.setItem('activeCompanyId', firstComp.companyId);
          if (firstComp.branches?.length > 0) {
            localStorage.setItem('activeBranchId', firstComp.branches[0].id);
          }
          window.location.reload();
        }
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchData();
  }, []);

  const handleCompanyChange = (e) => {
    const id = e.target.value;
    localStorage.setItem('activeCompanyId', id);
    localStorage.removeItem('activeBranchId');
    window.location.reload();
  };

  const handleBranchChange = (e) => {
    const id = e.target.value;
    localStorage.setItem('activeBranchId', id);
    window.location.reload();
  };

  const activeCompanyData = companies.find(c => c.companyId === selectedComp);

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <div onClick={() => navigate(item.path)} className={`group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800/60 text-slate-400'}`}>
        <div className={isActive ? 'text-white' : 'group-hover:text-blue-400'}>{item.icon}</div>
        {!isCollapsed && <span className="text-[13px] font-bold">{item.name}</span>}
      </div>
    );
  };

  return (
    <aside className={`bg-[#0f172a] text-slate-300 flex flex-col transition-all duration-500 shadow-2xl border-r border-slate-800 h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Header Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50">
        {!isCollapsed && <span className="text-xl font-bold text-white">ERP<span className="text-blue-500">PRO</span></span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-xl bg-slate-800/40 hover:bg-blue-600 ml-auto transition-all">
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* 🚀 BRANCH & COMPANY SELECTOR (RESTORED) */}
      {!isCollapsed && (
        <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-3">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Switcher</p>
            
            {/* Company Select */}
            <div className="relative group">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select value={selectedComp} onChange={handleCompanyChange} className="w-full bg-slate-900/50 text-[11px] font-bold pl-9 pr-3 py-2.5 rounded-xl border border-slate-700/50 outline-none focus:border-blue-500/50 appearance-none cursor-pointer">
                <option value="" disabled>Select Company</option>
                {companies.map(c => <option key={c.companyId} value={c.companyId}>{c.companyName}</option>)}
              </select>
            </div>

            {/* Branch Select */}
            <div className="relative group">
              <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select value={selectedBranch} onChange={handleBranchChange} disabled={!selectedComp} className="w-full bg-slate-900/50 text-[11px] font-bold pl-9 pr-3 py-2.5 rounded-xl border border-slate-700/50 outline-none focus:border-emerald-500/50 appearance-none cursor-pointer disabled:opacity-30">
                <option value="">No Branch Selected</option>
                {activeCompanyData?.branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {!isCollapsed && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-2">Modules</p>}
        {menuItems.map((item) => <NavItem key={item.path} item={item} />)}
        {!isCollapsed && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-8">Admin</p>}
        {managementItems.map((item) => <NavItem key={item.path} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-rose-400 transition-all">
          <LogOut size={20} /> {!isCollapsed && <span className="font-bold text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
