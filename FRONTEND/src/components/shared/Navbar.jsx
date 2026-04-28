import React, { useState, useEffect } from 'react';
import { Bell, Search, Settings, ChevronDown } from 'lucide-react';
import api from '../../services/api';

const Navbar = ({ title = "Overview" }) => {
  const [roleName, setRoleName] = useState('Loading...');
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const fetchCurrentRole = async () => {
      try {
        // activecompanyid aur activebranchid headers api.js se automatic chale jayenge
        const res = await api.get('/user-company-role/me');
        // Maan lete hain backend "roleId: { name: 'Manager' }" bhej raha hai
        setRoleName(res.data.roleId?.name || 'No Role');
      } catch (err) {
        setRoleName(' ');
      }
    };

    fetchCurrentRole();
  }, []); // [] matlab sirf mount par chalega, refresh hone par headers badal chuke honge

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-8">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight hidden lg:block">
          {title}
        </h2>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </span>
          <input type="text" placeholder="Search records..." className="w-64 pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"/>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-5">
        <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Settings size={20} />
          </button>
        </div>

        <button className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-full transition-all group">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{userName}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {roleName}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
