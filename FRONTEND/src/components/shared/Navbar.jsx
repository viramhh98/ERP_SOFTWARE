import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ShoppingCart, 
  Package, 
  FileText, 
  CalendarDays,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [roleName, setRoleName] = useState('Loading...');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const dropdownRef = useRef(null);
  
  const userName = localStorage.getItem('userName') || 'User';

  // --- DYNAMIC PAGE CONTEXT LOGIC ---
  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return { title: 'Dashboard', breadcrumb: 'Overview & Analytics' };
    if (path.includes('/inventory')) return { title: 'Live Inventory', breadcrumb: 'Items & Stock' };
    if (path.includes('/sales/create')) return { title: 'Point of Sale', breadcrumb: 'Sales / New Invoice' };
    if (path.includes('/sales/history')) return { title: 'Sales History', breadcrumb: 'Sales / Records' };
    if (path.includes('/purchase/create')) return { title: 'New Purchase', breadcrumb: 'Purchases / Entry' };
    if (path.includes('/finance/ledger')) return { title: 'Party Ledger', breadcrumb: 'Finance / Accounts' };
    if (path.includes('/role')) return { title: 'Role Engine', breadcrumb: 'Administration / Access Control' };
    if (path.includes('/users')) return { title: 'User Directory', breadcrumb: 'Administration / Users' };
    return { title: 'ERP System', breadcrumb: 'Workspace' };
  };

  const pageContext = getPageContext();

  // Fetch Role
  useEffect(() => {
    const fetchCurrentRole = async () => {
      try {
        const res = await api.get('/user-company-role/me');
        setRoleName(res.data.roleId?.name || 'No Role');
      } catch (err) {
        setRoleName('Unassigned');
      }
    };
    fetchCurrentRole();
  }, []);

  // Close Quick Add dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowQuickAdd(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString('en-IN', { 
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' 
  });

  return (
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* LEFT: Branding & Dynamic Context */}
      <div className="flex items-center gap-6">
        
        {/* Navbar Branding (Matches Sidebar) */}
        <div className="flex items-center cursor-default">
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            ERP<span className="text-blue-600">PRO</span>
          </span>
        </div>

        {/* Subtle Divider */}
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Dynamic Title & Breadcrumbs */}
        <div className="flex flex-col justify-center hidden sm:flex">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">
            {pageContext.breadcrumb}
          </p>
          <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
            {pageContext.title}
          </h2>
        </div>

      </div>

      {/* RIGHT: Quick Actions, Context, Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Current Date */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
          <CalendarDays size={14} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-widest">{today}</span>
        </div>

        {/* Global Quick Add Menu */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:block">Create</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showQuickAdd ? 'rotate-180' : ''}`} />
          </button>

          {showQuickAdd && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
              <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                Operations
              </p>
              <button onClick={() => { navigate('/sales/create'); setShowQuickAdd(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                <ShoppingCart size={16} className="text-emerald-500" /> Sales Invoice
              </button>
              <button onClick={() => { navigate('/purchase/create'); setShowQuickAdd(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                <FileText size={16} className="text-blue-500" /> Purchase Entry
              </button>
              <div className="h-px bg-slate-100 my-1 mx-2"></div>
              <button onClick={() => { navigate('/inventory'); setShowQuickAdd(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                <Package size={16} className="text-indigo-500" /> Add New Item
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Help & Support Icon */}
        <button className="hidden sm:flex text-slate-400 hover:text-blue-600 transition-colors" title="Help & Documentation">
          <HelpCircle size={20} />
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 group cursor-default ml-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-tight">{userName}</p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{roleName}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;



