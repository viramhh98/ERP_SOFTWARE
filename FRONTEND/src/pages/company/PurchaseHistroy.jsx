// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api";
// import toast from "react-hot-toast";
// import { 
//   Search, Filter, Eye, Download, 
//   ChevronRight, Calendar, Hash, Tag, ArrowUpRight
// } from "lucide-react";

// const PurchaseHistory = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchPurchases = async () => {
//     try {
//       const res = await api.get("/purchase");
//       setPurchases(res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []));
//     } catch (err) {
//       toast.error("Failed to load history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchPurchases(); }, []);

//   // Status Badge Logic
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "PAID": return "bg-emerald-100 text-emerald-700 ring-emerald-500/20";
//       case "PARTIAL": return "bg-amber-100 text-amber-700 ring-amber-500/20";
//       default: return "bg-rose-100 text-rose-700 ring-rose-500/20";
//     }
//   };

//   const filteredData = purchases.filter(p => 
//     p.purchaseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.partyId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter">
        
//         {/* Header Area */}
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
//           <div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Purchase History</h1>
//             <p className="text-slate-500 mt-1 font-medium italic">Track your manual book entries and payment statuses.</p>
//           </div>
          
//           <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-full md:w-96">
//             <Search className="text-slate-400 mt-2 ml-2" size={20} />
//             <input 
//               type="text" 
//               placeholder="Search Book No. or Supplier..." 
//               className="w-full p-2 outline-none font-bold text-slate-600 bg-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
//             <table className="w-full border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-slate-50">
//                   <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Book No.</th>
//                   <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier Entity</th>
//                   <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</th>
//                   <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
//                   <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {loading ? (
//                   <tr><td colSpan="5" className="p-20 text-center font-bold text-slate-400">Syncing with Cloud...</td></tr>
//                 ) : filteredData.length === 0 ? (
//                   <tr><td colSpan="5" className="p-20 text-center font-bold text-slate-400">No transactions found.</td></tr>
//                 ) : filteredData.map((p) => (
//                   <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
//                     <td className="px-8 py-6">
//                       <div className="flex flex-col">
//                         <span className="text-sm font-black text-slate-700">{p.purchaseNumber}</span>
//                         <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
//                           <Calendar size={10}/> {new Date(p.purchaseDate).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-6 text-sm font-bold text-slate-600">
//                       {p.partyId?.name || "Unknown Vendor"}
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ring-1 ring-inset ${getStatusStyle(p.status)}`}>
//                         {p.status}
//                       </span>
//                     </td>
//                     <td className="px-8 py-6 text-right font-black text-slate-900">
//                       ₹{p.totalAmount?.toLocaleString()}
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
//                           <Eye size={16} />
//                         </button>
//                         <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
//                           <Download size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//       </div>
//     </MainLayout>
//   );
// };

// export default PurchaseHistory;














// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api";
// import toast from "react-hot-toast";
// import { 
//   Search, Eye, Download, Calendar, Phone, 
//   ArrowUpRight, RefreshCcw, CreditCard, Wallet
// } from "lucide-react";

// const PurchaseHistory = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchPurchases = async () => {
//     setLoading(true);
//     try {
//       const config = {
//         headers: {
//           activecompanyid: localStorage.getItem('activeCompanyId'),
//           activebranchid: localStorage.getItem('activeBranchId'),
//         }
//       };
//       const res = await api.get("/purchase", config);
//       setPurchases(res.data.data || []);
//     } catch (err) {
//       toast.error("Records fetch fail ho gaye");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchPurchases(); }, []);

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "PAID": return "bg-emerald-50 text-emerald-600 ring-emerald-100";
//       case "PARTIAL": return "bg-amber-50 text-amber-600 ring-amber-100";
//       default: return "bg-rose-50 text-rose-600 ring-rose-100";
//     }
//   };

//   // Improved search: Matches Bill No, Supplier Name, or Phone
//   const filteredData = purchases.filter(p => 
//     p.purchaseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.partyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.partyId?.phone?.includes(searchTerm)
//   );

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
//         {/* SaaS Header */}
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
//           <div>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Purchase Archive</h1>
//             <p className="text-slate-500 mt-1 font-medium">Review transactions and vendor outstanding balances.</p>
//           </div>
          
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="relative flex-1 md:w-80 group">
//               <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Search Bill No, Name or Phone..." 
//                 className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm transition-all"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button onClick={fetchPurchases} className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm transition-all">
//               <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
//             </button>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50">
//                   <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</th>
//                   <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference No.</th>
//                   <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier & Contact</th>
//                   <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</th>
//                   <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
//                   <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Amount</th>
//                   <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {loading ? (
//                   <tr><td colSpan="7" className="p-24 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Loading Ledger...</td></tr>
//                 ) : filteredData.length === 0 ? (
//                   <tr><td colSpan="7" className="p-24 text-center font-bold text-slate-400 italic">No matching records found.</td></tr>
//                 ) : filteredData.map((p) => (
//                   <tr key={p._id} className="group hover:bg-slate-50/50 transition-all cursor-default">
//                     <td className="px-8 py-6">
//                       <div className="flex items-center gap-2.5 text-sm font-bold text-slate-600">
//                         <Calendar size={14} className="text-slate-300" />
//                         {new Date(p.purchaseDate).toLocaleDateString('en-GB')}
//                       </div>
//                     </td>
//                     <td className="px-8 py-6">
//                       <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-black ring-1 ring-indigo-100">
//                         {p.purchaseNumber}
//                       </span>
//                     </td>
//                     <td className="px-8 py-6">
//                       <div className="flex flex-col">
//                         <span className="text-sm font-black text-slate-800 leading-none mb-1">{p.partyId?.name || "N/A"}</span>
//                         <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
//                           <Phone size={10} /> {p.partyId?.phone || "No contact"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase ${p.paymentMode === 'cash' ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'}`}>
//                          {p.paymentMode === 'cash' ? <Wallet size={12}/> : <CreditCard size={12}/>}
//                          {p.paymentMode}
//                        </div>
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <span className={`px-4 py-2 rounded-full text-[10px] font-black ring-1 ring-inset uppercase tracking-tighter ${getStatusStyle(p.status)}`}>
//                         {p.status}
//                       </span>
//                     </td>
//                     <td className="px-8 py-6 text-right font-black text-slate-900">
//                       ₹{p.totalAmount?.toLocaleString()}
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
//                         <button className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl shadow-sm">
//                           <Eye size={16} />
//                         </button>
//                         <button className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-xl shadow-sm">
//                           <Download size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Floating Summary Info */}
//         <div className="max-w-7xl mx-auto mt-8 flex justify-end">
//            <div className="bg-slate-900 px-8 py-5 rounded-[2rem] shadow-xl flex items-center gap-10">
//               <div>
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Value</p>
//                 <h4 className="text-xl font-black text-white">₹{filteredData.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</h4>
//               </div>
//               <div className="w-px h-10 bg-slate-800"></div>
//               <div>
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Records</p>
//                 <h4 className="text-xl font-black text-white">{filteredData.length} Bills</h4>
//               </div>
//            </div>
//         </div>

//       </div>
//     </MainLayout>
//   );
// };

// export default PurchaseHistory;




















import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  Search, Eye, X, Calendar, Phone, Hash, 
  Package, IndianRupee, Loader2, Download,
  ArrowUpRight, Clock, ChevronRight, FileText
} from "lucide-react";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [selectedBill, setSelectedBill] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [billItems, setBillItems] = useState([]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem('activeCompanyId'),
          activebranchid: localStorage.getItem('activeBranchId'),
        }
      };
      const res = await api.get("/purchase", config);
      setPurchases(res.data.data || []);
    } catch (err) {
      toast.error("Cloud sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPurchases(); }, []);

  const handleViewBill = async (bill) => {
    setSelectedBill(bill);
    setModalLoading(true);
    setBillItems([]);
    
    try {
      const itemPromises = bill.items.map(item => api.get(`/item/${item.itemId}`));
      const responses = await Promise.all(itemPromises);
      const detailedItems = bill.items.map((item, index) => ({
        ...item,
        details: responses[index].data.data
      }));
      setBillItems(detailedItems);
    } catch (err) {
      toast.error("Item details fetch error");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredData = purchases.filter(p => 
    p.purchaseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partyId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-inter text-slate-700">
        
        {/* --- TOP HEADER --- */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              Procurement <ChevronRight size={12}/> History
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing Archive</h1>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" placeholder="Search Bill No or Vendor..." 
              className="w-full h-14 pl-12 pr-6 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-600"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- MAIN TRANSACTIONS TABLE --- */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Detail</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="p-24 text-center font-black text-slate-300 animate-pulse tracking-widest">SYNCING CLOUD LEDGER...</td></tr>
                  ) : filteredData.map((p) => (
                    <tr key={p._id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 mb-1">{p.purchaseNumber}</span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Clock size={10}/> {new Date(p.purchaseDate).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{p.partyId?.name}</span>
                          <span className="text-[10px] text-indigo-500 font-bold tracking-tight">{p.paymentMode?.toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-tighter ring-1 ring-inset ${
                          p.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-rose-50 text-rose-600 ring-rose-100'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-base font-black text-slate-900">₹{p.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button 
                          onClick={() => handleViewBill(p)} 
                          className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
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
        </div>

        {/* --- GLASSMORPHIC ITEM MODAL --- */}
        {selectedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-slate-900/40 backdrop-blur-[6px] animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 relative animate-in zoom-in-95 duration-300">
              
              {/* Modal Header */}
              <div className="p-10 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Invoice Details</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{selectedBill.purchaseNumber} • {selectedBill.paymentMode}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBill(null)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {modalLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={3} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reconstructing SKU Data...</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    
                    {/* Items Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {billItems.map((item, idx) => (
                        <div key={idx} className="group flex items-center justify-between p-6 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 rounded-3xl transition-all">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600 shadow-sm">
                              {idx + 1}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-black text-slate-800 leading-none mb-1.5">{item.details?.name || "Loading SKU..."}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.details?.sku}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-12">
                            <div className="text-center">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Qty</p>
                              <p className="font-black text-slate-700">{item.quantity} <span className="text-[10px] font-medium text-slate-400 uppercase">pcs</span></p>
                            </div>
                            <div className="text-right min-w-[100px]">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Subtotal</p>
                              <p className="font-black text-slate-900">₹{item.total.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer (Summary) */}
              <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <Package size={24} className="text-slate-600" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Supplier Entity</p>
                      <h4 className="text-xl font-bold">{selectedBill.partyId?.name}</h4>
                   </div>
                </div>
                
                <div className="text-center md:text-right">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Net Payable Amount</p>
                   <h2 className="text-5xl font-black tracking-tighter flex items-center gap-2">
                     <span className="text-2xl font-light text-slate-500">₹</span>
                     {selectedBill.totalAmount.toLocaleString()}
                   </h2>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PurchaseHistory;
