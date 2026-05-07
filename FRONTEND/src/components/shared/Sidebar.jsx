import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Box, ShoppingCart, Users, ChevronLeft, ChevronRight, 
  LogOut, ShieldCheck, Building2, GitBranch, Settings, 
  Wallet, Truck, BarChart3, KeyRound, UserPlus, PlusCircle, Share2,
  ClipboardList, BookOpen, ChevronDown, Check
} from 'lucide-react';
import api from '../../services/api';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companies, setCompanies] = useState([]);
  
  const [selectedComp, setSelectedComp] = useState(localStorage.getItem('activeCompanyId') || '');
  const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem('activeBranchId') || '');

  // UI State for custom dropdowns
  const [openDropdown, setOpenDropdown] = useState(null); // 'company' | 'branch' | null

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Inventory', path: '/inventory', icon: <Box size={20} className="text-emerald-400" /> },
    { name: 'New Sale (POS)', path: '/sales/create', icon: <PlusCircle size={20} className="text-emerald-500" /> },
    { name: 'Sales History', path: '/sales/history', icon: <ShoppingCart size={20} /> },
    { name: 'New Purchase', path: '/purchase/create', icon: <PlusCircle size={20} className="text-blue-400" /> },
    { name: 'Purchase History', path: '/purchase/history', icon: <ClipboardList size={20} /> },
    { name: 'Billing', path: '/billing',icon: (<Wallet size={20} className="text-cyan-400"/>),},
    { name: 'Party Ledger', path: '/finance/ledger', icon: <BookOpen size={20} className="text-amber-400" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  ];

  const managementItems = [
    { name: 'Parties', path: '/parties', icon: <Users size={20} /> },
    { name: 'User Management', path: '/users', icon: <UserPlus size={20} /> },
    { name: 'Roles & Permissions', path: '/role', icon: <KeyRound size={20} /> },
    { name: 'Company Setup', path: '/create-company', icon: <Building2 size={20} className="text-indigo-400" /> },
    { name: 'Branch Setup', path: '/create-branch', icon: <GitBranch size={20} className="text-emerald-400" /> },
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

  const handleCompanyChange = (id) => {
    localStorage.setItem('activeCompanyId', id);
    localStorage.removeItem('activeBranchId');
    setOpenDropdown(null);
    window.location.reload();
  };

  const handleBranchChange = (id) => {
    localStorage.setItem('activeBranchId', id);
    setOpenDropdown(null);
    window.location.reload();
  };

  const activeCompanyData = companies.find(c => c.companyId === selectedComp);
  const activeCompanyName = activeCompanyData?.companyName || 'Select Company';
  const activeBranchName = activeCompanyData?.branches?.find(b => b.id === selectedBranch)?.name || 'Select Branch';

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <div onClick={() => navigate(item.path)} className={`group flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-[0_4px_20px_-4px_rgba(37,99,235,0.5)]' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}>
        <div className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}>{item.icon}</div>
        {!isCollapsed && <span className="text-sm font-semibold tracking-wide">{item.name}</span>}
      </div>
    );
  };

  return (
    <>
      {/* Invisible overlay to close dropdowns when clicking outside */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
      )}

      <aside className={`bg-[#0b1120] text-slate-300 flex flex-col transition-all duration-500 shadow-2xl border-r border-slate-800/60 h-screen sticky top-0 z-50 ${isCollapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Header Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50 bg-[#0f172a]/50">
          {!isCollapsed && <span className="text-2xl font-black text-white tracking-tight">ERP<span className="text-blue-500">PRO</span></span>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-700 text-slate-400 hover:text-white ml-auto transition-all">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* 🚀 ORGANIZATION SWITCHER */}
        {!isCollapsed && (
          <div className="p-4 mx-4 my-5 rounded-2xl bg-linear-to-b from-slate-800/50 to-slate-800/20 border border-slate-700/50 shadow-inner space-y-4">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Organization & Branch</p>
            
            {/* Custom Company Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'company' ? null : 'company')}
                className="w-full flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 text-slate-200 px-4 py-3 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all focus:ring-2 focus:ring-blue-500/20"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Building2 className="text-blue-400 shrink-0" size={18} />
                  <span className="text-sm font-bold truncate">{activeCompanyName}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>

              {/* Company Dropdown List */}
              {openDropdown === 'company' && (
                <div className="absolute top-full left-0 w-full mt-2 py-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl backdrop-blur-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
                  {companies.map(c => (
                    <div 
                      key={c.companyId} 
                      onClick={() => handleCompanyChange(c.companyId)}
                      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${selectedComp === c.companyId ? 'bg-blue-600/10 text-blue-400' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
                    >
                      <span className="text-sm font-semibold truncate">{c.companyName}</span>
                      {selectedComp === c.companyId && <Check size={16} className="text-blue-500 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Branch Dropdown */}
            <div className="relative group">
              <button 
                disabled={!selectedComp}
                onClick={() => setOpenDropdown(openDropdown === 'branch' ? null : 'branch')}
                className="w-full flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 text-slate-200 px-4 py-3 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-emerald-500/20"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <GitBranch className="text-emerald-400 shrink-0" size={18} />
                  <span className="text-sm font-bold truncate">{activeBranchName}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${openDropdown === 'branch' ? 'rotate-180' : ''}`} />
              </button>

              {/* Branch Dropdown List */}
              {openDropdown === 'branch' && activeCompanyData?.branches && (
                <div className="absolute top-full left-0 w-full mt-2 py-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl backdrop-blur-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
                  {activeCompanyData.branches.map(b => (
                    <div 
                      key={b.id} 
                      onClick={() => handleBranchChange(b.id)}
                      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${selectedBranch === b.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
                    >
                      <span className="text-sm font-semibold truncate">{b.name}</span>
                      {selectedBranch === b.id && <Check size={16} className="text-emerald-500 shrink-0" />}
                    </div>
                  ))}
                  {activeCompanyData.branches.length === 0 && (
                    <div className="px-4 py-3 text-sm text-slate-500 italic text-center">No branches available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
          {!isCollapsed && <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-4 mt-4">Modules</p>}
          {menuItems.map((item) => <NavItem key={item.path} item={item} />)}
          
          {!isCollapsed && <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-4 mt-8">System Settings</p>}
          {managementItems.map((item) => <NavItem key={item.path} item={item} />)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0f172a]/30">
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="flex items-center gap-4 w-full p-3.5 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all group">
            <LogOut size={20} className="group-hover:scale-110 transition-transform" /> 
            {!isCollapsed && <span className="font-bold text-sm tracking-wide">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;