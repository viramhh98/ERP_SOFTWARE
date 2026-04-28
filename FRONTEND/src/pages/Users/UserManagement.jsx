import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  UserPlus, Mail, Lock, User, Plus, Trash2, Building2, 
  ShieldCheck, Send, Search, RefreshCcw, 
  BadgeCheck, X, ChevronRight, KeyRound,
  Users, Fingerprint, Zap, Globe, Cpu
} from "lucide-react";

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    assignments: [{ branchId: "", roleId: "" }],
  });

  const loadAllConfig = async () => {
    setSyncing(true);
    try {
      const activeCompId = localStorage.getItem("activeCompanyId");
      const [roleRes, userRes, masterRes] = await Promise.all([
        api.get("/role"),
        api.get("/user-company-role/all-users"),
        api.get("/user-company-role/allcompanybranches"),
      ]);
      setRoles(roleRes.data || []);
      setUsers(userRes.data || []);
      const currentCompanyData = masterRes.data.find(c => c.companyId === activeCompId);
      if (currentCompanyData) setAvailableBranches(currentCompanyData.branches || []);
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { loadAllConfig(); }, []);

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateAssignment = (idx, field, val) => {
    const newA = [...formData.assignments];
    newA[idx][field] = val;
    setFormData({ ...formData, assignments: newA });
  };

  const removeAssignment = (idx) => {
    if (formData.assignments.length > 1) {
      setFormData({ ...formData, assignments: formData.assignments.filter((_, i) => i !== idx) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const companyId = localStorage.getItem("activeCompanyId");
      await api.post("/employee", { ...formData, companyId });
      toast.success("Personnel secured in registry");
      setFormData({ name: "", email: "", password: "", assignments: [{ branchId: "", roleId: "" }] });
      loadAllConfig();
    } catch (err) {
      toast.error(err.response?.data?.message || "Onboarding rejected");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <MainLayout title="Staff Intelligence">
      <div className="max-w-[1700px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        
        {/* --- STATS HUD --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Personnel</h1>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Intelligence System v5.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
             <button onClick={loadAllConfig} className="p-4 hover:bg-slate-50 rounded-2xl transition-all group">
              <RefreshCcw size={22} className={`${syncing ? 'animate-spin text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
            </button>
          </div>
        </div>

        {/* --- SECTION 1: ONBOARDING --- */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-slate-900 px-10 py-8 flex justify-between items-center text-white">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <UserPlus size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Onboard Personnel</h2>
                <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.2em] mt-1">Access Protocol</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({...formData, assignments: [...formData.assignments, { branchId: "", roleId: "" }]})}
              className="flex items-center gap-2 bg-white/10 hover:bg-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
            >
              <Plus size={18} /> Add Role Scope
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {[
                { name: "name", label: "Legal Name", icon: User, type: "text", placeholder: "John Doe" },
                { name: "email", label: "Work Email", icon: Mail, type: "email", placeholder: "john@company.com" },
                { name: "password", label: "Access Key", icon: Lock, type: "password", placeholder: "••••••••" }
              ].map((input) => (
                <div key={input.name} className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">{input.label}</label>
                  <div className="relative">
                    <input.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-all" size={18} />
                    <input name={input.name} type={input.type} value={formData[input.name]} onChange={handleInput} required placeholder={input.placeholder} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-inner" />
                  </div>
                </div>
              ))}
            </div>

            <div className="col-span-12 lg:col-span-6 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organizational Scope</label>
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-3 custom-scrollbar">
                {formData.assignments.map((row, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row gap-4 items-center hover:border-indigo-200 hover:bg-white transition-all group">
                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                      <select value={row.branchId} onChange={(e) => updateAssignment(i, "branchId", e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-600 outline-none focus:ring-4 focus:ring-indigo-50">
                        <option value="">LOCATION</option>
                        {availableBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <select value={row.roleId} onChange={(e) => updateAssignment(i, "roleId", e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-600 outline-none focus:ring-4 focus:ring-indigo-50">
                        <option value="">ROLE</option>
                        {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </select>
                    </div>
                    {formData.assignments.length > 1 && (
                      <button type="button" onClick={() => removeAssignment(i)} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-2 flex flex-col justify-end pb-1">
              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 group">
                {loading ? <RefreshCcw className="animate-spin" size={20} /> : <><Cpu size={22} className="group-hover:rotate-12 transition-transform" /> Deploy</>}
              </button>
            </div>
          </form>
        </div>

        {/* --- SECTION 2: DIRECTORY --- */}
        <div className="grid grid-cols-12 gap-8 pb-20">
          <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-all" size={28} />
              <input 
                type="text" 
                placeholder="Filter personnel matrix..." 
                className="w-full pl-20 pr-8 py-5 bg-slate-50 border-none rounded-[1.8rem] text-lg font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 transition-all outline-none shadow-inner" 
                onChange={(e) =>
               setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map((u) => (
                <div 
                  key={u.id} 
                  onClick={() => setSelectedUser(u)}
                  className={`group relative p-8 rounded-[3rem] border-2 transition-all cursor-pointer overflow-hidden ${selectedUser?.id === u.id ? 'bg-indigo-600 border-indigo-600 shadow-2xl scale-[1.02]' : 'bg-white border-slate-50 hover:border-indigo-100 hover:shadow-xl'}`}
                >
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div className="flex items-start justify-between">
                      <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl transition-all ${selectedUser?.id === u.id ? 'bg-white text-indigo-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <BadgeCheck size={28} className={selectedUser?.id === u.id ? 'text-white' : 'text-emerald-500'} />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black tracking-tight ${selectedUser?.id === u.id ? 'text-white' : 'text-slate-800'}`}>{u.name}</h3>
                      <p className={`text-sm font-bold opacity-60 ${selectedUser?.id === u.id ? 'text-indigo-100' : 'text-slate-400'}`}>{u.email}</p>
                    </div>
                    <ChevronRight size={24} className={`ml-auto transition-transform ${selectedUser?.id === u.id ? 'text-white rotate-90' : 'text-slate-300 group-hover:translate-x-2'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR DETAIL */}
          {selectedUser && (
            <div className="col-span-12 xl:col-span-4 sticky top-10 animate-in slide-in-from-right-10 duration-500">
              <div className="bg-slate-900 rounded-[4rem] p-10 text-white shadow-2xl overflow-hidden relative border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Globe size={300} /></div>
                
                <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="h-28 w-28 bg-gradient-to-br from-indigo-500 to-indigo-800 rounded-[2.5rem] flex items-center justify-center text-5xl font-black border-4 border-white/10 shadow-2xl">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="p-4 bg-white/5 hover:bg-rose-500/20 rounded-2xl transition-all border border-white/10">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-4xl font-black tracking-tighter leading-none">{selectedUser.name}</h3>
                    <p className="text-indigo-300 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2 mt-4 opacity-70">
                      <Fingerprint size={16} /> Identity Verified
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Access Permissions</h4>
                    <div className="grid gap-3">
                      {selectedUser.assignments?.map((asm, i) => (
                        <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl"><Building2 size={20}/></div>
                            <div>
                              <p className="text-sm font-black text-white">{asm.branch || "Corporate HQ"}</p>
                              <p className="text-[10px] text-white/40 font-black uppercase mt-1 tracking-widest">{asm.role || "Standard Access"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
