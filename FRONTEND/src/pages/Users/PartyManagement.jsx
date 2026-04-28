import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  Users, UserPlus, Search, Phone, Mail, MapPin, 
  Trash2, Edit3, ChevronRight, Filter, X, 
  CheckCircle2, Building2, Briefcase, RefreshCcw,
  UserCheck, ArrowUpRight
} from "lucide-react";

const PartyManagement = () => {
  // --- 1. STATES ---
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, customer, supplier, both
  const [showAddPanel, setShowAddPanel] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "customer",
    phone: "",
    email: "",
    address: ""
  });

  // --- 2. DATA FETCH ---
  const fetchParties = async () => {
    setSyncing(true);
    try {
      // activecompanyid header api.js interceptor se pass ho raha hai
      const res = await api.get("/party/filter");
      setParties(res.data || []);
    } catch (err) {
      toast.error("Cloud Sync Failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { fetchParties(); }, []);

  // --- 3. HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/party", formData);
      toast.success(`${formData.type.toUpperCase()} Registered Successfully`);
      setFormData({ name: "", type: "customer", phone: "", email: "", address: "" });
      setShowAddPanel(false);
      fetchParties();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Rejected");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. FILTER LOGIC ---
  const filteredParties = useMemo(() => {
    return parties.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm);
      const matchesTab = activeTab === "all" || p.type === activeTab || p.type === "both";
      return matchesSearch && matchesTab;
    });
  }, [parties, searchTerm, activeTab]);

  return (
    <MainLayout activeMenu="parties">
      <div className="max-w-[1700px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* --- HEADER HUD --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Parties</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] flex items-center gap-3">
              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />
              Customer & Vendor Matrix v5.0
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl flex gap-2">
                {['all', 'customer', 'supplier'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
             <button 
                onClick={() => setShowAddPanel(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95"
             >
                <UserPlus size={18} /> New Entry
             </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* --- MAIN DIRECTORY --- */}
          <div className="col-span-12 space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search by Name or Phone Matrix..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-[1.8rem] text-lg font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none"
                />
              </div>
              <button onClick={fetchParties} className="p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
                <RefreshCcw size={20} className={syncing ? "animate-spin text-indigo-600" : "text-slate-400"} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredParties.map((party) => (
                <div key={party._id} className="group bg-white p-8 rounded-[3rem] border-2 border-slate-50 hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                        {party.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        party.type === 'customer' ? 'bg-emerald-50 text-emerald-600' : 
                        party.type === 'supplier' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {party.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{party.name}</h3>
                      <div className="flex items-center gap-2 mt-2 text-slate-400">
                        <Phone size={14} />
                        <span className="text-sm font-bold">{party.phone}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-slate-100 flex justify-between items-center">
                       <div className="flex items-center gap-2 text-slate-400">
                          <MapPin size={14} />
                          <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">{party.address || 'No Address'}</span>
                       </div>
                       <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                          <ArrowUpRight size={18} />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredParties.length === 0 && !syncing && (
              <div className="py-20 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <Users size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No records found in matrix</p>
              </div>
            )}
          </div>
        </div>

        {/* --- ADD PARTY SIDE PANEL --- */}
        {showAddPanel && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddPanel(false)} />
            <div className="relative w-full max-w-xl bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-10 animate-in slide-in-from-right duration-500 flex flex-col">
              
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><UserPlus size={24}/></div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Authorize Party</h2>
                </div>
                <button onClick={() => setShowAddPanel(false)} className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"><X size={24}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">Legal Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Business or Personal Name" className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all appearance-none">
                      <option value="customer">Customer</option>
                      <option value="supplier">Supplier</option>
                      <option value="both">Both (C & S)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Matrix</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Unique Contact" className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="intel@enterprise.com" className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-5 text-slate-300" size={20} />
                    <textarea name="address" rows="4" value={formData.address} onChange={handleInputChange} placeholder="Headquarters or Delivery Address" className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all resize-none shadow-inner" />
                  </div>
                </div>

                <div className="pt-6">
                  <button disabled={loading} className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50">
                    {loading ? <RefreshCcw className="animate-spin" /> : <><CheckCircle2 size={20}/> Commit Registration</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PartyManagement;
