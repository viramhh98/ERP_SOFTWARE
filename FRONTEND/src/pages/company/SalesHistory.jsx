import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

import {
  Search,
  Eye,
  X,
  Printer,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Hash,
  RefreshCcw,
  Clock,
  User,
  ArrowUpRight,
  Receipt
} from "lucide-react";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);

  /* ------------------------------------------------ */
  /* FETCH SALES */
  /* ------------------------------------------------ */
  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sales");
      setSales(res.data.data || []);
    } catch (err) {
      toast.error("Sales data sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  /* ------------------------------------------------ */
  /* FILTER */
  /* ------------------------------------------------ */
  const filteredSales = sales.filter(
    (s) =>
      s.partyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.salesNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F6F8FC]">
        {/* FIXED TOP HEADER */}
        <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-4 md:px-8 h-[92px] flex items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="uppercase tracking-[0.3em] text-[10px] font-black text-emerald-600">Revenue / Ledger</span>
              </div>
              <h1 className="text-[28px] md:text-[32px] font-black tracking-tighter text-slate-900 leading-none">Sales History</h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search bills or customers..."
                  className="w-80 h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={fetchSales} className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95">
                <RefreshCcw size={20} className={`text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="px-4 md:px-8 pt-30 pb-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* TABLE CARD */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Invoice Date</th>
                      <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Bill Number</th>
                      <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Entity</th>
                      <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                      <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-40 text-center">
                          <div className="font-black text-slate-300 animate-pulse uppercase tracking-[0.3em]">Retrieving Ledger...</div>
                        </td>
                      </tr>
                    ) : filteredSales.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-40 text-center text-slate-300 font-black uppercase tracking-widest">No Sales Found</td>
                      </tr>
                    ) : (
                      filteredSales.map((s) => (
                        <tr key={s._id} className="group hover:bg-emerald-50/30 transition-all">
                          <td className="px-8 py-6 text-sm text-slate-500">
                            {new Date(s.createdAt).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Hash size={14} /></div>
                              <span className="text-xs font-black text-slate-700 uppercase">{s.salesNumber}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800 leading-none mb-1">{s.partyId?.name || "Walk-in Customer"}</span>
                              <span className="text-[10px] text-slate-400 uppercase">{s.partyId?.phone || "No Contact"}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ring-1 ring-inset uppercase ${
                              s.status === "PAID" ? "bg-emerald-50 text-emerald-600 ring-emerald-100" : "bg-rose-50 text-rose-600 ring-rose-100"
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right text-base font-black text-slate-900">
                            ₹{s.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <button onClick={() => setSelectedSale(s)} className="h-10 w-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm mx-auto">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SUMMARY BAR */}
            {!loading && (
              <div className="flex justify-end pt-4">
                <div className="bg-slate-900 px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-12 text-white border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl"><TrendingUp size={24} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Revenue</p>
                      <h4 className="text-2xl font-black tracking-tighter">₹{filteredSales.reduce((a, c) => a + c.totalAmount, 0).toLocaleString()}</h4>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Invoices</p>
                    <h4 className="text-2xl font-black tracking-tighter">{filteredSales.length}</h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODERN SIDEBAR MODAL (Matches Purchase History) */}
        {selectedSale && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedSale(null)} />
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
              
              {/* MODAL HEADER */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl rotate-3">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Invoice Summary</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">{selectedSale.salesNumber}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSale(null)} className="h-12 w-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm">
                  <X size={24} />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xl font-black text-emerald-900">{selectedSale.status}</p>
                  </div>
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Mode</p>
                    <p className="text-xl font-black text-slate-900 uppercase">{selectedSale.paymentMode}</p>
                  </div>
                </div>

                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Billed Items</h3>
                <div className="space-y-3">
                  {selectedSale.items.map((it, i) => (
                    <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-emerald-200 transition-all shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">{i + 1}</div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">{it.itemId?.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{it.itemId?.sku}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
                        <p className="text-base font-black text-slate-900">₹{it.total.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-emerald-600 italic">Qty: {it.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-8 bg-slate-900 border-t border-slate-800 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 bg-slate-800"><User size={20}/></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</p>
                      <p className="text-lg font-bold text-white leading-none">{selectedSale.partyId?.name || "Walk-in Customer"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic flex items-center justify-end gap-1">
                      <ArrowUpRight size={12}/> Grand Total
                    </p>
                    <h2 className="text-5xl font-black text-white tracking-tighter italic">₹{selectedSale.totalAmount.toLocaleString()}</h2>
                  </div>
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