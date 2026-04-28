import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  Search, Eye, X, Calendar, User, Package, 
  IndianRupee, Loader2, Printer, ChevronRight,
  TrendingUp, Download, CheckCircle2, Hash
} from "lucide-react";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem('activeCompanyId'),
          activebranchid: localStorage.getItem('activeBranchId'),
        }
      };
      // Endpoint matched to "sales"
      const res = await api.get("/sales", config);
      setSales(res.data.data || []);
    } catch (err) {
      toast.error("Sales data sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  const filteredSales = sales.filter(s => 
    s.partyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s._id.slice(-6).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
        {/* --- HEADER & ANALYTICS BAR --- */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">
              Revenue <ChevronRight size={12}/> Billing Archive
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sales Records</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" placeholder="Search customer or bill id..." 
                className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Date</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Entity</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="7" className="p-24 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Retrieving Ledger...</td></tr>
                ) : filteredSales.map((s) => (
                  <tr key={s._id} className="group hover:bg-emerald-50/30 transition-all cursor-default font-bold">
                    <td className="px-8 py-6 text-sm text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-slate-400 uppercase">#...{s._id.slice(-6)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 leading-none mb-1">{s.partyId?.name || 'Walk-in Customer'}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{s.partyId?.phone || 'No Contact'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                         {s.paymentMode}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-tighter ring-1 ring-inset uppercase ${
                        s.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-rose-50 text-rose-600 ring-rose-100'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-900">
                      ₹{s.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => { setSelectedSale(s); setShowModal(true); }}
                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-2xl shadow-sm transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- 🎁 FLOATING SUMMARY CARD --- */}
        {!loading && (
          <div className="max-w-7xl mx-auto mt-8 flex justify-end">
            <div className="bg-slate-900 px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-12 text-white border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl"><TrendingUp size={24}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Revenue</p>
                  <h4 className="text-2xl font-black tracking-tighter">₹{filteredSales.reduce((a,c) => a + c.totalAmount, 0).toLocaleString()}</h4>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-800"></div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Invoices</p>
                <h4 className="text-2xl font-black tracking-tighter">{filteredSales.length} Units</h4>
              </div>
            </div>
          </div>
        )}

        {/* --- 🔥 INVOICE DETAIL MODAL --- */}
        {showModal && selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 relative animate-in zoom-in-95 duration-300">
              <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-600 p-3 rounded-2xl text-white"><CheckCircle2 size={24}/></div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Invoice Details</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedSale._id}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-rose-100 rounded-xl transition-all"><X size={20}/></button>
              </div>
              
              <div className="p-8">
                <div className="rounded-3xl border border-slate-100 overflow-hidden mb-8">
                   <table className="w-full text-sm">
                     <thead className="bg-slate-50 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                       <tr className="text-left"><th className="px-6 py-4">Item SKU</th><th className="px-6 py-4 text-center">Qty</th><th className="px-6 py-4 text-right">Amount</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 font-bold">
                       {selectedSale.items.map((it, i) => (
                         <tr key={i} className="bg-white">
                           <td className="px-6 py-4">
                             <div className="flex flex-col">
                               <span className="text-slate-800">{it.itemId?.name || 'Item ID: '+it.itemId}</span>
                               <span className="text-[10px] text-emerald-600 font-black uppercase">{it.itemId?.sku}</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-center text-slate-500">{it.quantity}</td>
                           <td className="px-6 py-4 text-right font-black text-slate-900">₹{it.total.toLocaleString()}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
                
                <div className="flex justify-between items-center bg-slate-900 text-white p-8 rounded-[2rem]">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Bill Value</p>
                      <h2 className="text-4xl font-black tracking-tighter">₹{selectedSale.totalAmount.toLocaleString()}</h2>
                    </div>
                    <button className="flex flex-col items-center gap-1 group">
                      <div className="p-4 bg-emerald-600 rounded-2xl group-hover:scale-110 transition-all"><Printer size={20}/></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Print Bill</span>
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SalesHistory;
