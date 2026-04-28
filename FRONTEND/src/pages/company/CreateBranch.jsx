import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  GitBranch, MapPin, ArrowRight, RefreshCcw, Zap, 
  Building2, ShieldCheck, Globe, X, CheckCircle2, AlertCircle
} from "lucide-react";

const CreateBranch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [companyName, setCompanyName] = useState("Loading...");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  // Active Company ki details fetch karna display ke liye
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const activeId = localStorage.getItem("activeCompanyId");
        const res = await api.get('/user-company-role/allcompanybranches');
        const current = res.data.find(c => c.companyId === activeId);
        if (current) setCompanyName(current.companyName);
      } catch (err) {
        setCompanyName("Selected Entity");
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Form Submit hone par box dikhao
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    console.log("Button clicked, showing box..."); // Debugging ke liye
    setShowConfirm(true);
  };

  // Step 2: Box mein 'Confirm' dabane par API call karo
  const handleFinalSubmit = async () => {
    setLoading(true);
    setShowConfirm(false);

    try {
      const response = await api.post("/branch", formData);
      toast.success(`${formData.name} successfully integrated!`);
      localStorage.setItem("activeBranchId", response.data._id);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Integration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Integrate Branch">
      {/* --- MODAL / CONFIRMATION BOX (Full Screen) --- */}
      {showConfirm && (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-slate-950/80 backdrop-blur-md z-[9999] transition-all duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-[90%] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-6">
              <div className="h-20 w-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle size={44} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Final Check</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Kya aap <span className="text-indigo-600 font-bold">"{formData.name}"</span> ko <br />
                  <span className="text-slate-900 font-black">{companyName}</span> mein add karna chahte hain?
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-indigo-200"
                >
                  Integrate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="max-w-[1200px] mx-auto p-4 md:p-10 min-h-[80vh] flex items-center justify-center">
        <div className="grid grid-cols-12 gap-0 w-full bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
          
          {/* Left Panel */}
          <div className="col-span-12 lg:col-span-5 bg-slate-900 p-12 text-white relative flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <GitBranch size={450} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <GitBranch size={32} />
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-tight italic">Branch<br/>Expansion</h1>
              <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.4em]">{companyName}</p>
            </div>
          </div>

          {/* Right Panel (Form) */}
          <div className="col-span-12 lg:col-span-7 p-10 md:p-16 bg-white">
            <form onSubmit={handleInitialSubmit} className="space-y-10">
              <div className="space-y-8">
                <div className="space-y-3 group">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-emerald-500">Branch Name</label>
                  <div className="relative">
                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Surat Hub"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-emerald-500">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-6 text-slate-300" size={22} />
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Node physical address..."
                      rows="4"
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCcw className="animate-spin" size={22} /> : "Finalize Node Integration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateBranch;
