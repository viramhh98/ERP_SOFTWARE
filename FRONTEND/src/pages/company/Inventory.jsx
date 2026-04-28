import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  Box, Search, RefreshCcw, Filter, AlertTriangle, 
  ArrowUpRight, Package, TrendingDown, Warehouse, 
  ChevronRight, BarChart2, MoreVertical
} from "lucide-react";

const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem('activeCompanyId'),
          activebranchid: localStorage.getItem('activeBranchId'),
        }
      };
      const res = await api.get("/stock", config);
      setStock(res.data.data || []);
    } catch (err) {
      toast.error("Cloud Inventory Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  // --- LOGIC: Summary Calculations ---
  const totalStockValue = stock.reduce((acc, curr) => acc + (curr.quantity * (curr.itemId?.costPrice || 0)), 0);
  const lowStockCount = stock.filter(s => s.quantity < 5).length;
  const totalItems = stock.length;

  const filteredStock = stock.filter(s => 
    s.itemId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.itemId?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
        {/* --- 1. HEADER & SEARCH --- */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
              Warehouse <ChevronRight size={12}/> Live Inventory
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Stock Management</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" placeholder="Search SKU or Item Name..." 
                className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={fetchInventory} className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* --- 2. SUMMARY BENTO CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all">
                 <Warehouse size={100} />
               </div>
               <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Total Warehouse Value</p>
               <h2 className="text-5xl font-black tracking-tighter mb-4 flex items-baseline gap-1">
                 <span className="text-indigo-500 text-2xl font-light">₹</span>
                 {totalStockValue.toLocaleString()}
               </h2>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                 Live Valuation
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total Unique SKUs</p>
                <h3 className="text-3xl font-black text-slate-800">{totalItems}</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium italic font-bold">In this branch</p>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl"><Box size={28}/></div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-1">Critical Alerts</p>
                <h3 className="text-3xl font-black text-rose-600">{lowStockCount} Items</h3>
                <p className="text-[10px] text-rose-400 mt-1 font-bold">Needs Re-order</p>
              </div>
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><AlertTriangle size={28}/></div>
            </div>
          </div>

          {/* --- 3. STOCK TABLE --- */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-500" /> Current Inventory Status
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
                    <th className="px-8 py-5">Product Details</th>
                    <th className="px-8 py-5 text-center">Unit</th>
                    <th className="px-8 py-5 text-center">On Hand</th>
                    <th className="px-8 py-5 text-right">Avg. Cost</th>
                    <th className="px-8 py-5 text-right">Selling Price</th>
                    <th className="px-8 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr><td colSpan="6" className="p-24 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Scanning Warehouse...</td></tr>
                  ) : filteredStock.length === 0 ? (
                    <tr><td colSpan="6" className="p-24 text-center font-bold text-slate-400 italic text-sm">No items found in inventory.</td></tr>
                  ) : filteredStock.map((s) => (
                    <tr key={s._id} className="group hover:bg-slate-50 transition-all cursor-default">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 leading-none mb-1">{s.itemId?.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.itemId?.sku}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center text-xs font-bold text-slate-400 uppercase">{s.itemId?.unit || 'pcs'}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`text-base font-black ${s.quantity < 5 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {s.quantity}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-bold text-slate-500 text-sm">₹{s.itemId?.costPrice?.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right font-black text-indigo-600 text-sm">₹{s.itemId?.sellingPrice?.toLocaleString()}</td>
                      <td className="px-8 py-6 text-center">
                        {s.quantity < 5 ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase ring-1 ring-rose-100">
                            <TrendingDown size={12}/> Low Stock
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase ring-1 ring-emerald-100">
                             Healthy
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Inventory;
