import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  Building2, 
  FileText, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Fingerprint, 
  Globe,
  Briefcase,
  RefreshCcw,
  Zap
} from "lucide-react";

const CreateCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    panNumber: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/company", formData);
      toast.success("Enterprise Entity Initialized!");
      
      // Auto-set the newly created company as the active one
      localStorage.setItem("activeCompanyId", response.data._id);
      
      // Navigate to dashboard or branch setup
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Initialization Protocol Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Deploy New Entity">
      <div className="max-w-[1400px] mx-auto p-4 md:p-10 min-h-[85vh] flex items-center justify-center animate-in fade-in duration-700">
        
        <div className="grid grid-cols-12 gap-0 w-full bg-white rounded-[4rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
          
          {/* --- LEFT SIDE: THEME & CONTEXT --- */}
          <div className="col-span-12 lg:col-span-5 bg-slate-900 p-12 text-white relative flex flex-col justify-between overflow-hidden">
            {/* Background Abstract Decor */}
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Globe size={500} className="absolute -right-32 -top-32" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="h-20 w-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-pulse">
                <Zap size={40} className="text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl font-black tracking-tighter leading-[0.9] italic">
                  Entity <br /> Deployment
                </h1>
                <p className="text-indigo-300 font-bold text-[10px] uppercase tracking-[0.5em] opacity-80">
                  Secure Enterprise Initialization v5.0
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-5 p-4 bg-white/5 rounded-3xl border border-white/10">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">Full Ownership</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">You will be assigned as the Primary OWNER role.</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-4 bg-white/5 rounded-3xl border border-white/10">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">Audit Ready</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Automated GST and PAN verification protocols enabled.</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: INPUT MODULE --- */}
          <div className="col-span-12 lg:col-span-7 p-10 md:p-20 bg-white">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="space-y-8">
                {/* Company Name */}
                <div className="space-y-3 group">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-600 transition-colors">
                    Corporate Legal Identity
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-all" size={22} />
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Nexus Global Industries"
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all shadow-inner text-lg"
                    />
                  </div>
                </div>

                {/* Tax & Registration Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">GST Identification</label>
                    <div className="relative">
                      <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-all" size={20} />
                      <input 
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        required
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.8rem] outline-none font-bold text-slate-700 transition-all uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">PAN Registration</label>
                    <div className="relative">
                      <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-all" size={20} />
                      <input 
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        required
                        placeholder="ABCDE1234F"
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.8rem] outline-none font-bold text-slate-700 transition-all uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Registered Address */}
                <div className="space-y-3 group">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">HQ / Registered Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-6 text-slate-300 group-focus-within:text-indigo-500 transition-all" size={22} />
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter full legal address of the corporate headquarters..."
                      rows="3"
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all shadow-inner resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Module */}
              <div className="pt-6">
                <button 
                  disabled={loading}
                  className="group w-full bg-slate-900 hover:bg-indigo-600 text-white py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCcw className="animate-spin" size={24} />
                  ) : (
                    <>
                      Initialize Deployment <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
                  <ShieldCheck size={14} />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                    End-to-End Encrypted Identity Verification
                  </p>
                </div>
              </div>

            </form>
          </div>
        </div>
        
      </div>
    </MainLayout>
  );
};

export default CreateCompany;
