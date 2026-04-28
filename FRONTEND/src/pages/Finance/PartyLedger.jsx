// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api";
// import toast from "react-hot-toast";
// import { 
//   IndianRupee, Search, Printer, Eye, X, Loader2,
//   ArrowUpRight, ArrowDownLeft, FileText, ChevronRight,
//   Wallet, Plus, History, Landmark, CreditCard, User
// } from "lucide-react";

// const PartyLedger = () => {
//   // --- 1. DATA STATES ---
//   const [parties, setParties] = useState([]);
//   const [selectedParty, setSelectedParty] = useState(null); // Full object store karenge
//   const [ledgerEntries, setLedgerEntries] = useState([]);
//   const [balanceData, setBalanceData] = useState({ balance: 0, totalInvoiced: 0, totalSettled: 0 });
//   const [loading, setLoading] = useState(false);

//   // --- 2. MODAL STATES ---
//   const [showDocModal, setShowDocModal] = useState(false);
//   const [showPayModal, setShowPayModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [docData, setDocData] = useState(null);
//   const [docItems, setDocItems] = useState([]);
//   const [payData, setPayData] = useState({ amount: 0, mode: "cash", note: "" });

//   // --- 3. FETCH ALL PARTIES (Suppliers + Customers) ---
//   useEffect(() => {
//     const fetchParties = async () => {
//       try {
//         const res = await api.get("/party/filter?type=all");
//         setParties(res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []));
//       } catch (err) { toast.error("Contacts load nahi ho paye"); }
//     };
//     fetchParties();
//   }, []);

//   // --- 4. FETCH LEDGER & INTELLIGENT BALANCE ---
//   const fetchLedger = async (partyId) => {
//     if (!partyId) return;
//     setLoading(true);
//     const party = parties.find(p => p._id === partyId);
//     setSelectedParty(party);

//     try {
//       const res = await api.get(`/ledger/${partyId}`);
//       const entries = res.data.data || [];
//       setLedgerEntries(entries);
      
//       const credit = entries.reduce((acc, curr) => curr.type === 'CREDIT' ? acc + curr.amount : acc, 0);
//       const debit = entries.reduce((acc, curr) => curr.type === 'DEBIT' ? acc + curr.amount : acc, 0);
      
//       // 🔥 ACCOUNTING LOGIC:
//       // Supplier: Bill (Credit) - Paid (Debit) = Payable
//       // Customer: Sale (Debit) - Received (Credit) = Receivable
//       let netBalance = party.type === 'customer' ? (debit - credit) : (credit - debit);

//       setBalanceData({
//         balance: netBalance,
//         totalInvoiced: party.type === 'customer' ? debit : credit, // Total Sales/Purchases
//         totalSettled: party.type === 'customer' ? credit : debit   // Total Receipts/Payments
//       });
//     } catch (err) { toast.error("Ledger retrieval error"); }
//     finally { setLoading(false); }
//   };

//   // --- 5. VIEW DOCUMENT (PURCHASE OR SALE) ---
//   const handleViewDoc = async (refId, refType) => {
//     setModalLoading(true);
//     setShowDocModal(true);
//     try {
//       const endpoint = refType === "PURCHASE" ? `/purchase/${refId}` : `/sales/${refId}`;
//       const res = await api.get(endpoint);
//       const data = res.data.data;
//       setDocData(data);

//       const itemPromises = data.items.map(item => api.get(`/item/${item.itemId}`));
//       const responses = await Promise.all(itemPromises);
//       setDocItems(data.items.map((it, idx) => ({ ...it, details: responses[idx].data.data })));
//     } catch (err) {
//       toast.error("Document details missing");
//       setShowDocModal(false);
//     } finally { setModalLoading(false); }
//   };

//   // --- 6. RECORD TRANSACTION (DEBIT OR CREDIT) ---
//   const handleTransactionSubmit = async (e) => {
//     e.preventDefault();
//     if (payData.amount <= 0) return toast.error("Enter valid amount");

//     setLoading(true);
//     try {
//       await api.post("/ledger/payment", {
//         partyId: selectedParty._id,
//         amount: payData.amount,
//         paymentMode: payData.mode,
//         description: payData.note
//       });
//       toast.success(selectedParty.type === 'customer' ? "Receipt In Recorded" : "Payment Out Recorded");
//       setShowPayModal(false);
//       setPayData({ amount: 0, mode: "cash", note: "" });
//       fetchLedger(selectedParty._id);
//     } catch (err) { toast.error("Transaction Sync Failed"); }
//     finally { setLoading(false); }
//   };

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
//         {/* --- HEADER & SELECTOR --- */}
//         <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
//           <div>
//             <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
//               Financial Control <ChevronRight size={12}/> Universal Ledger
//             </div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Party Account</h1>
//           </div>
          
//           <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//             <div className="relative">
//               <Search className="absolute left-4 top-4 text-slate-400" size={18} />
//               <select 
//                 className="h-14 pl-12 pr-10 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-slate-700 outline-none appearance-none min-w-[320px]"
//                 onChange={(e) => fetchLedger(e.target.value)}
//               >
//                 <option value="">Search Supplier or Customer...</option>
//                 {parties.map(p => (
//                   <option key={p._id} value={p._id}>
//                     {p.name} ({p.type === 'supplier' ? '📦 SUP' : '👥 CUST'})
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             {selectedParty && (
//               <button 
//                 onClick={() => setShowPayModal(true)}
//                 className={`h-14 px-8 text-white rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 ${selectedParty.type === 'customer' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
//               >
//                 <Plus size={18} strokeWidth={3}/> {selectedParty.type === 'customer' ? 'Receipt In' : 'Payment Out'}
//               </button>
//             )}
//           </div>
//         </div>

//         {selectedParty ? (
//           <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
//             {/* --- SUMMARY BENTO CARDS --- */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className={`rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden ${balanceData.balance >= 0 ? 'bg-slate-900' : 'bg-rose-900'}`}>
//                 <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
//                   {selectedParty.type === 'customer' ? 'Net Receivable' : 'Net Payable'}
//                 </p>
//                 <h2 className="text-5xl font-black tracking-tighter">₹{Math.abs(balanceData.balance).toLocaleString()}</h2>
//                 <div className="mt-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
//                    {balanceData.balance >= 0 ? "Pending Balance" : "Advance Settlement"}
//                 </div>
//               </div>

//               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total {selectedParty.type === 'customer' ? 'Sales' : 'Purchase'}</p>
//                   <h3 className="text-2xl font-black text-slate-800">₹{balanceData.totalInvoiced.toLocaleString()}</h3>
//                 </div>
//                 <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><ArrowUpRight size={24}/></div>
//               </div>

//               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total {selectedParty.type === 'customer' ? 'Received' : 'Paid'}</p>
//                   <h3 className="text-2xl font-black text-slate-800">₹{balanceData.totalSettled.toLocaleString()}</h3>
//                 </div>
//                 <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><ArrowDownLeft size={24}/></div>
//               </div>
//             </div>

//             {/* --- LEDGER TABLE --- */}
//             <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
//               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
//                 <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
//                   <History size={18} className="text-indigo-500" /> Account Statement
//                 </h3>
//                 <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
//                   <Printer size={18} />
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                       <th className="px-8 py-5">Date</th>
//                       <th className="px-8 py-5">Description</th>
//                       <th className="px-8 py-5 text-right">Debit (+)</th>
//                       <th className="px-8 py-5 text-right">Credit (-)</th>
//                       <th className="px-8 py-5 text-center">Docs</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {ledgerEntries.map((entry, idx) => (
//                       <tr key={idx} className="group hover:bg-slate-50/50 transition-all font-bold">
//                         <td className="px-8 py-6 text-sm text-slate-400">{new Date(entry.createdAt).toLocaleDateString('en-GB')}</td>
//                         <td className="px-8 py-6">
//                            <div className="text-sm font-black text-slate-700">{entry.description}</div>
//                            <div className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{entry.referenceType}</div>
//                         </td>
//                         <td className={`px-8 py-6 text-right ${entry.type === 'DEBIT' ? (selectedParty.type === 'customer' ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-300'}`}>
//                           {entry.type === 'DEBIT' ? `₹${entry.amount.toLocaleString()}` : '—'}
//                         </td>
//                         <td className={`px-8 py-6 text-right ${entry.type === 'CREDIT' ? (selectedParty.type === 'customer' ? 'text-rose-600' : 'text-emerald-600') : 'text-slate-300'}`}>
//                           {entry.type === 'CREDIT' ? `₹${entry.amount.toLocaleString()}` : '—'}
//                         </td>
//                         <td className="px-8 py-6 text-center">
//                           {(entry.referenceType === "PURCHASE" || entry.referenceType === "SALE") && (
//                             <button onClick={() => handleViewDoc(entry.referenceId, entry.referenceType)} className="p-2.5 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
//                               <Eye size={16} />
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="max-w-7xl mx-auto h-[60vh] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 gap-4">
//              <Landmark size={64} strokeWidth={1} />
//              <p className="font-bold text-xs uppercase tracking-widest">Universal Ledger: Search Supplier or Customer</p>
//           </div>
//         )}

//         {/* --- DYNAMIC DOC MODAL --- */}
//         {showDocModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
//               <div className="p-8 bg-slate-50 border-b flex justify-between items-center font-black uppercase text-xs tracking-widest">
//                 <span>Ref: {docData?._id?.slice(-8)}</span>
//                 <button onClick={() => setShowDocModal(false)} className="p-2 hover:bg-rose-100 rounded-xl transition-all"><X size={20}/></button>
//               </div>
//               <div className="p-8">
//                 {modalLoading ? <Loader2 className="animate-spin mx-auto text-indigo-600" /> : (
//                   <div className="space-y-6">
//                     <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
//                        <table className="w-full text-sm font-bold">
//                          <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest"><tr className="text-left"><th className="px-6 py-4">Item</th><th className="px-6 py-4 text-center">Qty</th><th className="px-6 py-4 text-right">Total</th></tr></thead>
//                          <tbody className="divide-y divide-slate-50">
//                            {docItems.map((it, i) => (
//                              <tr key={i}><td className="px-6 py-4">{it.details?.name}</td><td className="px-6 py-4 text-center">{it.quantity}</td><td className="px-6 py-4 text-right font-black">₹{it.total.toLocaleString()}</td></tr>
//                            ))}
//                          </tbody>
//                        </table>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- TRANSACTION MODAL --- */}
//         {showPayModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//             <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 border border-slate-200">
//               <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tighter">
//                  <Wallet className={selectedParty.type === 'customer' ? 'text-emerald-600' : 'text-indigo-600'} /> {selectedParty.type === 'customer' ? 'Receipt In' : 'Payment Out'}
//               </h3>
//               <form onSubmit={handleTransactionSubmit} className="space-y-6 font-bold">
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Amount</label>
//                   <input type="number" required value={payData.amount} onChange={(e) => setPayData({...payData, amount: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl font-black text-2xl" />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
//                   <div className="flex bg-slate-100 p-1 rounded-2xl">
//                     {['cash', 'upi', 'cheque'].map(m => (
//                       <button key={m} type="button" onClick={() => setPayData({...payData, mode: m})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${payData.mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
//                     ))}
//                   </div>
//                 </div>
//                 <button type="submit" className={`w-full h-14 text-white rounded-2xl font-black text-sm uppercase shadow-xl transition-all ${selectedParty.type === 'customer' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>Confirm Sync</button>
//               </form>
//             </div>
//           </div>
//         )}

//       </div>
//     </MainLayout>
//   );
// };

// export default PartyLedger;





// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api";
// import toast from "react-hot-toast";
// import { 
//   IndianRupee, Search, Printer, Eye, X, Loader2,
//   ArrowUpRight, ArrowDownLeft, FileText, ChevronRight,
//   Wallet, Plus, History, Landmark, CreditCard, User
// } from "lucide-react";

// const PartyLedger = () => {
//   // --- 1. DATA STATES ---
//   const [parties, setParties] = useState([]);
//   const [selectedParty, setSelectedParty] = useState(null); 
//   const [ledgerEntries, setLedgerEntries] = useState([]);
//   const [balanceData, setBalanceData] = useState({ balance: 0, totalInvoiced: 0, totalSettled: 0 });
//   const [loading, setLoading] = useState(false);

//   // --- 2. MODAL STATES ---
//   const [showDocModal, setShowDocModal] = useState(false);
//   const [showPayModal, setShowPayModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [docData, setDocData] = useState(null);
//   const [docItems, setDocItems] = useState([]);
//   const [payData, setPayData] = useState({ amount: 0, mode: "cash", note: "" });

//   // --- 3. FETCH ALL PARTIES ---
//   useEffect(() => {
//     const fetchParties = async () => {
//       try {
//         const res = await api.get("/party/filter?type=all");
//         setParties(res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []));
//       } catch (err) { toast.error("Contacts load nahi ho paye"); }
//     };
//     fetchParties();
//   }, []);

//   // --- 4. FETCH LEDGER & INTELLIGENT BALANCE ---
//   const fetchLedger = async (partyId) => {
//     if (!partyId) return;
//     setLoading(true);
//     const party = parties.find(p => p._id === partyId);
//     setSelectedParty(party);

//     try {
//       const res = await api.get(`/ledger/${partyId}`);
//       const entries = res.data.data || [];
//       setLedgerEntries(entries);
      
//       const credit = entries.reduce((acc, curr) => curr.type === 'CREDIT' ? acc + curr.amount : acc, 0);
//       const debit = entries.reduce((acc, curr) => curr.type === 'DEBIT' ? acc + curr.amount : acc, 0);
      
//       // 🔥 ACCOUNTING LOGIC FIX:
//       let netBalance = party.type === 'customer' ? (debit - credit) : (credit - debit);

//       setBalanceData({
//         balance: netBalance,
//         totalInvoiced: party.type === 'customer' ? debit : credit, // Total Sales / Purchases
//         totalSettled: party.type === 'customer' ? credit : debit   // Total Receipts / Payments
//       });
//     } catch (err) { toast.error("Ledger retrieval error"); }
//     finally { setLoading(false); }
//   };

//   // --- 5. VIEW DOCUMENT DETAILS ---
//   const handleViewDoc = async (refId, refType) => {
//     setModalLoading(true);
//     setShowDocModal(true);
//     try {
//       const endpoint = refType === "PURCHASE" ? `/purchase/${refId}` : `/sales/${refId}`;
//       const res = await api.get(endpoint);
//       const data = res.data.data;
//       setDocData(data);

//       const itemPromises = data.items.map(item => api.get(`/item/${item.itemId}`));
//       const responses = await Promise.all(itemPromises);
//       setDocItems(data.items.map((it, idx) => ({ ...it, details: responses[idx].data.data })));
//     } catch (err) {
//       toast.error("Document details missing");
//       setShowDocModal(false);
//     } finally { setModalLoading(false); }
//   };

//   // --- 6. RECORD TRANSACTION ---
//   const handleTransactionSubmit = async (e) => {
//     e.preventDefault();
//     if (payData.amount <= 0) return toast.error("Enter valid amount");

//     setLoading(true);
//     try {
//       await api.post("/ledger/payment", {
//         partyId: selectedParty._id,
//         amount: payData.amount,
//         paymentMode: payData.mode,
//         description: payData.note
//       });
//       toast.success(selectedParty.type === 'customer' ? "Receipt Recorded" : "Payment Recorded");
//       setShowPayModal(false);
//       setPayData({ amount: 0, mode: "cash", note: "" });
//       fetchLedger(selectedParty._id);
//     } catch (err) { toast.error("Transaction Sync Failed"); }
//     finally { setLoading(false); }
//   };

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
//         {/* --- HEADER --- */}
//         <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
//           <div>
//             <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
//               Financial Control <ChevronRight size={12}/> Universal Ledger
//             </div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Party Account</h1>
//           </div>
          
//           <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//             <div className="relative">
//               <Search className="absolute left-4 top-4 text-slate-400" size={18} />
//               <select 
//                 className="h-14 pl-12 pr-10 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-slate-700 outline-none appearance-none min-w-[320px]"
//                 onChange={(e) => fetchLedger(e.target.value)}
//               >
//                 <option value="">Search Supplier or Customer...</option>
//                 {parties.map(p => (
//                   <option key={p._id} value={p._id}>{p.name} ({p.type === 'supplier' ? '📦 SUP' : '👥 CUST'})</option>
//                 ))}
//               </select>
//             </div>
            
//             {selectedParty && (
//               <button 
//                 onClick={() => setShowPayModal(true)}
//                 className={`h-14 px-8 text-white rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 ${selectedParty.type === 'customer' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
//               >
//                 <Plus size={18} strokeWidth={3}/> {selectedParty.type === 'customer' ? 'Receipt In' : 'Payment Out'}
//               </button>
//             )}
//           </div>
//         </div>

//         {selectedParty ? (
//           <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
//             {/* --- SUMMARY BENTO CARDS --- */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className={`rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden ${balanceData.balance >= 0 ? 'bg-slate-900' : 'bg-rose-900'}`}>
//                 <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
//                   Net {selectedParty.type === 'customer' ? 'Receivable' : 'Payable'}
//                 </p>
//                 <h2 className="text-5xl font-black tracking-tighter">₹{Math.abs(balanceData.balance).toLocaleString()}</h2>
//                 <div className="mt-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
//                    {balanceData.balance >= 0 ? "Pending Balance" : "Advance Settlement"}
//                 </div>
//               </div>

//               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total {selectedParty.type === 'customer' ? 'Sales' : 'Purchase'}</p>
//                   <h3 className="text-2xl font-black text-slate-800">₹{balanceData.totalInvoiced.toLocaleString()}</h3>
//                 </div>
//                 <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><ArrowUpRight size={24}/></div>
//               </div>

//               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total {selectedParty.type === 'customer' ? 'Received' : 'Paid'}</p>
//                   <h3 className="text-2xl font-black text-slate-800">₹{balanceData.totalSettled.toLocaleString()}</h3>
//                 </div>
//                 <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><ArrowDownLeft size={24}/></div>
//               </div>
//             </div>

//             {/* --- LEDGER TABLE --- */}
//             <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
//               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
//                 <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
//                   <History size={18} className="text-indigo-500" /> Account Statement
//                 </h3>
//                 <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
//                   <Printer size={18} />
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                       <th className="px-8 py-5">Date</th>
//                       <th className="px-8 py-5">Description</th>
//                       <th className="px-8 py-5 text-right">Debit (+)</th>
//                       <th className="px-8 py-5 text-right">Credit (-)</th>
//                       <th className="px-8 py-5 text-center">Docs</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 font-bold">
//                     {ledgerEntries.map((entry, idx) => (
//                       <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
//                         <td className="px-8 py-6 text-sm text-slate-400">{new Date(entry.createdAt).toLocaleDateString('en-GB')}</td>
//                         <td className="px-8 py-6">
//                            <div className="text-sm text-slate-700">{entry.description}</div>
//                            <div className="text-[9px] text-slate-400 uppercase tracking-widest">{entry.referenceType}</div>
//                         </td>
                        
//                         {/* 🔴 DEBIT COLUMN Logic Fix */}
//                         <td className={`px-8 py-6 text-right ${entry.type === 'DEBIT' ? (selectedParty.type === 'customer' ? 'text-rose-600' : 'text-emerald-600') : 'text-slate-300'}`}>
//                           {entry.type === 'DEBIT' ? `₹${entry.amount.toLocaleString()}` : '—'}
//                         </td>

//                         {/* 🟢 CREDIT COLUMN Logic Fix */}
//                         <td className={`px-8 py-6 text-right ${entry.type === 'CREDIT' ? (selectedParty.type === 'customer' ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-300'}`}>
//                           {entry.type === 'CREDIT' ? `₹${entry.amount.toLocaleString()}` : '—'}
//                         </td>

//                         <td className="px-8 py-6 text-center">
//                           {(entry.referenceType === "PURCHASE" || entry.referenceType === "SALE") && (
//                             <button onClick={() => handleViewDoc(entry.referenceId, entry.referenceType)} className="p-2.5 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
//                               <Eye size={16} />
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="max-w-7xl mx-auto h-[60vh] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 gap-4">
//              <Landmark size={64} strokeWidth={1} />
//              <p className="font-bold text-xs uppercase tracking-widest">Universal Ledger: Search Supplier or Customer</p>
//           </div>
//         )}

//         {/* --- DYNAMIC DOC MODAL --- */}
//         {showDocModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
//               <div className="p-8 bg-slate-50 border-b flex justify-between items-center font-black uppercase text-xs tracking-widest">
//                 <span>Reference Snapshot</span>
//                 <button onClick={() => setShowDocModal(false)} className="p-2 hover:bg-rose-100 rounded-xl transition-all"><X size={20}/></button>
//               </div>
//               <div className="p-8">
//                 {modalLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" size={32}/></div> : (
//                   <div className="space-y-6">
//                     <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm font-bold">
//                        <table className="w-full text-sm">
//                          <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest"><tr className="text-left"><th className="px-6 py-4">Item</th><th className="px-6 py-4 text-center">Qty</th><th className="px-6 py-4 text-right">Total</th></tr></thead>
//                          <tbody className="divide-y divide-slate-50">
//                            {docItems.map((it, i) => (
//                              <tr key={i}><td className="px-6 py-4">{it.details?.name}</td><td className="px-6 py-4 text-center">{it.quantity}</td><td className="px-6 py-4 text-right font-black">₹{it.total.toLocaleString()}</td></tr>
//                            ))}
//                          </tbody>
//                        </table>
//                     </div>
//                     <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-[2rem]">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Total</span>
//                         <span className="text-3xl font-black tracking-tighter">₹{docData?.totalAmount.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- TRANSACTION MODAL --- */}
//         {showPayModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//             <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 border border-slate-200">
//               <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tighter">
//                  <Wallet className={selectedParty.type === 'customer' ? 'text-emerald-600' : 'text-indigo-600'} /> {selectedParty.type === 'customer' ? 'Receipt In' : 'Payment Out'}
//               </h3>
//               <form onSubmit={handleTransactionSubmit} className="space-y-6">
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Amount</label>
//                   <input type="number" required value={payData.amount} onChange={(e) => setPayData({...payData, amount: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl font-black text-2xl outline-none" />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
//                   <div className="flex bg-slate-100 p-1 rounded-2xl">
//                     {['cash', 'upi', 'cheque'].map(m => (
//                       <button key={m} type="button" onClick={() => setPayData({...payData, mode: m})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${payData.mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
//                     ))}
//                   </div>
//                 </div>
//                 <button type="submit" className={`w-full h-14 text-white rounded-2xl font-black text-sm uppercase shadow-xl transition-all ${selectedParty.type === 'customer' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>Confirm Sync</button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// };

// export default PartyLedger;
























import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  IndianRupee, Search, Printer, Eye, X, Loader2,
  ArrowUpRight, ArrowDownLeft, FileText, ChevronRight,
  Wallet, Plus, History, Landmark, CreditCard, User
} from "lucide-react";

const PartyLedger = () => {
  // --- 1. DATA STATES ---
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null); 
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [balanceData, setBalanceData] = useState({ balance: 0, totalInvoiced: 0, totalSettled: 0 });
  const [loading, setLoading] = useState(false);

  // --- 2. MODAL STATES ---
  const [showDocModal, setShowDocModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [docData, setDocData] = useState(null);
  const [docItems, setDocItems] = useState([]);
  const [payData, setPayData] = useState({ amount: 0, mode: "cash", note: "" });

  // --- 3. FETCH ALL PARTIES (SUPPLIERS + CUSTOMERS) ---
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await api.get("/party/filter?type=all");
        setParties(res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []));
      } catch (err) {
        toast.error("Contacts load nahi ho paye");
      }
    };
    fetchParties();
  }, []);

  // --- 4. FETCH LEDGER & INTELLIGENT BALANCE ---
  const fetchLedger = async (partyId) => {
    if (!partyId) return;
    setLoading(true);
    const party = parties.find(p => p._id === partyId);
    setSelectedParty(party);

    try {
      const res = await api.get(`/ledger/${partyId}`);
      const entries = res.data.data || [];
      setLedgerEntries(entries);
      
      const credit = entries.reduce((acc, curr) => curr.type === 'CREDIT' ? acc + curr.amount : acc, 0);
      const debit = entries.reduce((acc, curr) => curr.type === 'DEBIT' ? acc + curr.amount : acc, 0);
      
      // 🔥 ACCOUNTING LOGIC:
      // Customer: Sale (Debit) - Receipt (Credit)
      // Supplier: Purchase (Credit) - Payment (Debit)
      let netBalance = party.type === 'customer' ? (debit - credit) : (credit - debit);

      setBalanceData({
        balance: netBalance,
        totalInvoiced: party.type === 'customer' ? debit : credit, 
        totalSettled: party.type === 'customer' ? credit : debit   
      });
    } catch (err) {
      toast.error("Ledger retrieval error");
    } finally {
      setLoading(false);
    }
  };

  // --- 5. VIEW DOCUMENT DETAILS (SALE/PURCHASE) ---
  const handleViewDoc = async (refId, refType) => {
    setModalLoading(true);
    setShowDocModal(true);
    try {
      const endpoint = refType === "PURCHASE" ? `/purchase/${refId}` : `/sales/${refId}`;
      const res = await api.get(endpoint);
      const data = res.data.data;
      setDocData(data);

      const itemPromises = data.items.map(item => api.get(`/item/${item.itemId}`));
      const responses = await Promise.all(itemPromises);
      setDocItems(data.items.map((it, idx) => ({ ...it, details: responses[idx].data.data })));
    } catch (err) {
      toast.error("Document details missing");
      setShowDocModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // --- 6. RECORD TRANSACTION (PAYMENT/RECEIPT) ---
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (payData.amount <= 0) return toast.error("Enter valid amount");

    setLoading(true);
    try {
      await api.post("/ledger/payment", {
        partyId: selectedParty._id,
        amount: payData.amount,
        paymentMode: payData.mode,
        description: payData.note
      });
      toast.success(selectedParty.type === 'customer' ? "Receipt Recorded" : "Payment Recorded");
      setShowPayModal(false);
      setPayData({ amount: 0, mode: "cash", note: "" });
      fetchLedger(selectedParty._id);
    } catch (err) {
      toast.error("Transaction Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
        {/* --- HEADER & SELECTOR --- */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
              Financial Control <ChevronRight size={12}/> Universal Ledger
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Party Account</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-slate-400" size={18} />
              <select 
                className="h-14 pl-12 pr-10 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-slate-700 outline-none appearance-none min-w-[320px]"
                onChange={(e) => fetchLedger(e.target.value)}
              >
                <option value="">Search Supplier or Customer...</option>
                {parties.map(p => (
                  <option key={p._id} value={p._id}>{p.name} ({p.type === 'supplier' ? '📦 SUP' : '👥 CUST'})</option>
                ))}
              </select>
            </div>
            
            {selectedParty && (
              <button 
                onClick={() => setShowPayModal(true)}
                className={`h-14 px-8 text-white rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${selectedParty.type === 'customer' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                <Plus size={18} strokeWidth={3}/> {selectedParty.type === 'customer' ? 'Receipt In' : 'Payment Out'}
              </button>
            )}
          </div>
        </div>

        {selectedParty ? (
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* --- SUMMARY BENTO CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden ${balanceData.balance >= 0 ? 'bg-slate-900' : 'bg-rose-900'}`}>
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
                  Net {selectedParty.type === 'customer' ? 'Receivable' : 'Payable'}
                </p>
                <h2 className="text-5xl font-black tracking-tighter">₹{Math.abs(balanceData.balance).toLocaleString()}</h2>
                <div className="mt-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
                   {balanceData.balance >= 0 ? "Pending Balance" : "Advance Settlement"}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total {selectedParty.type === 'customer' ? 'Sales' : 'Purchase'}</p>
                  <h3 className="text-2xl font-black text-slate-800">₹{balanceData.totalInvoiced.toLocaleString()}</h3>
                </div>
                <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><ArrowUpRight size={24}/></div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total {selectedParty.type === 'customer' ? 'Received' : 'Paid'}</p>
                  <h3 className="text-2xl font-black text-slate-800">₹{balanceData.totalSettled.toLocaleString()}</h3>
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><ArrowDownLeft size={24}/></div>
              </div>
            </div>

            {/* --- LEDGER TABLE --- */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <History size={18} className="text-indigo-500" /> Account Statement
                </h3>
                <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <Printer size={18} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Description</th>
                      <th className="px-8 py-5 text-right">Debit (+)</th>
                      <th className="px-8 py-5 text-right">Credit (-)</th>
                      <th className="px-8 py-5 text-center">Docs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {ledgerEntries.map((entry, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6 text-sm text-slate-400">{new Date(entry.createdAt).toLocaleDateString('en-GB')}</td>
                        <td className="px-8 py-6">
                           <div className="text-sm text-slate-700">{entry.description}</div>
                           <div className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{entry.referenceType}</div>
                        </td>
                        
                        {/* 🔴 DEBIT COLUMN Logic Fix */}
                        <td className={`px-8 py-6 text-right ${entry.type === 'DEBIT' ? (selectedParty.type === 'customer' ? 'text-rose-600' : 'text-emerald-600') : 'text-slate-300'}`}>
                          {entry.type === 'DEBIT' ? `₹${entry.amount.toLocaleString()}` : '—'}
                        </td>

                        {/* 🟢 CREDIT COLUMN Logic Fix */}
                        <td className={`px-8 py-6 text-right ${entry.type === 'CREDIT' ? (selectedParty.type === 'customer' ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-300'}`}>
                          {entry.type === 'CREDIT' ? `₹${entry.amount.toLocaleString()}` : '—'}
                        </td>

                        <td className="px-8 py-6 text-center">
                          {(entry.referenceType === "PURCHASE" || entry.referenceType === "SALE") && (
                            <button onClick={() => handleViewDoc(entry.referenceId, entry.referenceType)} className="p-2.5 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all group-hover:scale-110">
                              <Eye size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto h-[60vh] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 gap-4">
             <Landmark size={64} strokeWidth={1} />
             <p className="font-bold text-xs uppercase tracking-widest italic">Universal Ledger: Search Supplier or Customer to load history</p>
          </div>
        )}

        {/* --- DYNAMIC DOC MODAL --- */}
        {showDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
              <div className="p-8 bg-slate-50 border-b flex justify-between items-center font-black uppercase text-xs tracking-widest">
                <span>Reference Snapshot</span>
                <button onClick={() => setShowDocModal(false)} className="p-2 hover:bg-rose-100 rounded-xl transition-all"><X size={20}/></button>
              </div>
              <div className="p-8">
                {modalLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" size={32}/><p className="ml-2 font-bold text-slate-400">Loading SKU...</p></div> : (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm font-bold">
                       <table className="w-full text-sm">
                         <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest"><tr className="text-left"><th className="px-6 py-4">Item Name</th><th className="px-6 py-4 text-center">Qty</th><th className="px-6 py-4 text-right">Total</th></tr></thead>
                         <tbody className="divide-y divide-slate-50">
                           {docItems.map((it, i) => (
                             <tr key={i}><td className="px-6 py-4">{it.details?.name || "SKU Code: "+it.itemId}</td><td className="px-6 py-4 text-center text-slate-400">{it.quantity}</td><td className="px-6 py-4 text-right font-black">₹{it.total.toLocaleString()}</td></tr>
                           ))}
                         </tbody>
                       </table>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-[2rem]">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grand Total Bill</span>
                        <span className="text-3xl font-black tracking-tighter">₹{docData?.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TRANSACTION MODAL (PAYMENT/RECEIPT) --- */}
        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 border border-slate-200">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tighter">
                 <Wallet className={selectedParty.type === 'customer' ? 'text-emerald-600' : 'text-indigo-600'} /> {selectedParty.type === 'customer' ? 'Receipt In' : 'Payment Out'}
              </h3>
              <form onSubmit={handleTransactionSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Received/Paid Amount</label>
                  <input type="number" required value={payData.amount} onChange={(e) => setPayData({...payData, amount: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl font-black text-2xl outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mode of Transaction</label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl">
                    {['cash', 'upi', 'cheque'].map(m => (
                      <button key={m} type="button" onClick={() => setPayData({...payData, mode: m})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${payData.mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className={`w-full h-14 text-white rounded-2xl font-black text-sm uppercase shadow-xl transition-all active:scale-95 ${selectedParty.type === 'customer' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}>Confirm Transaction</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default PartyLedger;
