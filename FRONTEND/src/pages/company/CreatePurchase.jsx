// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api"; 
// import toast from "react-hot-toast";
// import { 
//   ShoppingCart, Plus, Trash2, Save, RefreshCcw, 
//   Package, FileText, Calendar, User, Info, 
//   ChevronDown, CheckCircle2
// } from "lucide-react";

// const CreatePurchase = () => {
//   const [loading, setLoading] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [availableItems, setAvailableItems] = useState([]);
  
//   const [formData, setFormData] = useState({
//     partyId: "",
//     purchaseDate: new Date().toISOString().split('T')[0],
//     items: [{ itemId: "", quantity: 1, price: 0, amount: 0 }],
//     totalAmount: 0,
//     notes: ""
//   });

//   // --- FIX: Updated response handling for res.data.data ---
//   const fetchAllData = async () => {
//     setSyncing(true);
//     try {
//       const [itemRes, partyRes] = await Promise.all([
//         api.get("/item"),
//         api.get("/party/filter?type=supplier")
//       ]);

//       // Supplier list fix: res.data.data check
//       const items = itemRes.data.success ? itemRes.data.data : (Array.isArray(itemRes.data) ? itemRes.data : []);
//       const suppliers = partyRes.data.success ? partyRes.data.data : (Array.isArray(partyRes.data) ? partyRes.data : []);

//       setAvailableItems(items);
//       setParties(suppliers);
      
//       if (suppliers.length === 0) console.warn("No suppliers found in backend");
//     } catch (err) {
//       toast.error("Cloud Sync Failed: Check Connection");
//     } finally {
//       setSyncing(false);
//     }
//   };

//   useEffect(() => { fetchAllData(); }, []);

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...formData.items];
//     if (field === "itemId") {
//       const selected = availableItems.find(i => i._id === value);
//       newItems[index].itemId = value;
//       // Using costPrice from your product JSON
//       newItems[index].price = selected ? (selected.costPrice || 0) : 0;
//     } else {
//       newItems[index][field] = value;
//     }
    
//     newItems[index].amount = (parseFloat(newItems[index].quantity) || 0) * (parseFloat(newItems[index].price) || 0);
//     const grandTotal = newItems.reduce((acc, curr) => acc + (curr.amount || 0), 0);
//     setFormData({ ...formData, items: newItems, totalAmount: grandTotal });
//   };

//   const addItemRow = () => {
//     setFormData({ ...formData, items: [...formData.items, { itemId: "", quantity: 1, price: 0, amount: 0 }] });
//   };

//   const removeItemRow = (index) => {
//     if (formData.items.length > 1) {
//       const filtered = formData.items.filter((_, i) => i !== index);
//       const newTotal = filtered.reduce((acc, curr) => acc + (curr.amount || 0), 0);
//       setFormData({ ...formData, items: filtered, totalAmount: newTotal });
//     }
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!formData.partyId) return toast.error("Vendor required");
  
//   setLoading(true);
//   try {
//     // Backend expects 'total' inside items, not 'amount'
//     const payload = {
//       ...formData,
//       items: formData.items.map(item => ({
//         itemId: item.itemId,
//         quantity: item.quantity,
//         price: item.price,
//         total: item.amount // Mapping 'amount' to 'total'
//       }))
//     };

//     await api.post("/purchase", payload);
//     toast.success("Purchase Recorded!");
//     // Reset Form...
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Validation Error");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
//         {/* SaaS Dashboard Header */}
//         <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
//               <Package size={14} /> Procurement System
//             </div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">New Purchase</h1>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button type="button" onClick={fetchAllData} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm shadow-sm">
//               <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} /> Sync
//             </button>
//             <button form="purchase-form" disabled={loading} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
//               <Save size={18} /> {loading ? "Syncing..." : "Finalize Order"}
//             </button>
//           </div>
//         </div>

//         <form id="purchase-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
//           <div className="lg:col-span-8 space-y-8">
//             {/* Vendor Card */}
//             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-8 opacity-5">
//                 <User size={80} />
//               </div>
//               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Vendor Configuration</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Supplier Entity</label>
//                   <div className="relative">
//                     <select 
//                       className="w-full h-14 pl-5 pr-10 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
//                       value={formData.partyId} onChange={(e) => setFormData({...formData, partyId: e.target.value})} required
//                     >
//                       <option value="">Search Supplier Database...</option>
//                       {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//                     </select>
//                     <ChevronDown size={20} className="absolute right-4 top-4 text-slate-300 pointer-events-none" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Posting Date</label>
//                   <input 
//                     type="date" className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
//                     value={formData.purchaseDate} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Line Items Card */}
//             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//               <div className="p-6 bg-slate-50/50 border-b border-slate-100">
//                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <ShoppingCart size={16} /> Billable SKU Items
//                 </h3>
//               </div>
              
//               <div className="overflow-x-auto p-4">
//                 <table className="w-full border-separate border-spacing-y-3">
//                   <thead>
//                     <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       <th className="px-4 pb-2">Item Detail</th>
//                       <th className="px-4 pb-2 text-center" width="120">Qty</th>
//                       <th className="px-4 pb-2 text-center" width="160">Cost Price</th>
//                       <th className="px-4 pb-2 text-right" width="140">Total</th>
//                       <th className="px-4 pb-2" width="60"></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {formData.items.map((row, index) => (
//                       <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
//                         <td>
//                           <select 
//                             className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-100"
//                             value={row.itemId} onChange={(e) => handleItemChange(index, "itemId", e.target.value)} required
//                           >
//                             <option value="">Select SKU...</option>
//                             {availableItems.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
//                           </select>
//                         </td>
//                         <td>
//                           <input 
//                             type="number" value={row.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                             className="w-full h-12 bg-slate-50 border-none rounded-2xl text-center font-black focus:ring-2 focus:ring-indigo-100 outline-none"
//                           />
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-1 bg-slate-50 px-4 rounded-2xl ring-inset focus-within:ring-2 focus-within:ring-indigo-100">
//                              <span className="text-slate-400 font-bold text-xs">₹</span>
//                              <input 
//                               type="number" value={row.price} onChange={(e) => handleItemChange(index, "price", e.target.value)}
//                               className="w-full h-12 bg-transparent border-none text-right font-black outline-none"
//                             />
//                           </div>
//                         </td>
//                         <td className="px-4 text-right font-black text-slate-800 text-sm">
//                           ₹{(row.amount || 0).toLocaleString()}
//                         </td>
//                         <td className="text-center">
//                           <button type="button" onClick={() => removeItemRow(index)} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
//                             <Trash2 size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <button 
//                   type="button" onClick={addItemRow}
//                   className="mt-4 ml-2 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
//                 >
//                   <Plus size={14} strokeWidth={4} /> Add Row
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Summary Sidebar */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
//                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-all"></div>
//                <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Grand Total Payable</h4>
//                <div className="text-6xl font-black mb-10 tracking-tighter flex items-baseline gap-1">
//                  <span className="text-indigo-500 text-2xl">₹</span>
//                  {formData.totalAmount.toLocaleString()}
//                </div>
               
//                <div className="space-y-4 pt-8 border-t border-slate-800 text-xs">
//                  <div className="flex justify-between items-center">
//                    <span className="text-slate-500 font-bold uppercase tracking-widest">SKU Count</span>
//                    <span className="font-black text-indigo-400">{formData.items.length} Lines</span>
//                  </div>
//                  <div className="flex justify-between items-center">
//                    <span className="text-slate-500 font-bold uppercase tracking-widest">Total Qty</span>
//                    <span className="font-black text-slate-200">{formData.items.reduce((a,c) => a + (parseFloat(c.quantity) || 0), 0)} Units</span>
//                  </div>
//                </div>
//             </div>

//             <div className="bg-white rounded-3xl p-8 border border-slate-200">
//               <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4">
//                 <FileText size={14} className="text-indigo-500" /> Administrative Remarks
//               </label>
//               <textarea 
//                 className="w-full h-32 p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-600 text-sm resize-none"
//                 placeholder="Mention payment terms or PO numbers..."
//                 value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
//               ></textarea>
//             </div>

//             <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
//               <div className="flex gap-4 items-start">
//                 <div className="bg-indigo-600 p-2 rounded-xl text-white">
//                   <Info size={16} />
//                 </div>
//                 <div>
//                    <p className="text-[10px] font-black text-indigo-900 uppercase mb-1">Post-Validation Sync</p>
//                    <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">Finalizing this order will increment warehouse stock and update the vendor's ledger credit balance.</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </form>
//       </div>
//     </MainLayout>
//   );
// };

// export default CreatePurchase;
















// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api"; 
// import toast from "react-hot-toast";
// import { 
//   ShoppingCart, Plus, Trash2, Save, RefreshCcw, 
//   Package, FileText, User, ChevronDown, CheckCircle2, Hash
// } from "lucide-react";

// const CreatePurchase = () => {
//   const [loading, setLoading] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [availableItems, setAvailableItems] = useState([]);
  
//   const [formData, setFormData] = useState({
//     purchaseNumber: "", // Manual Entry for your book
//     partyId: "",
//     purchaseDate: new Date().toISOString().split('T')[0],
//     items: [{ itemId: "", quantity: 1, price: 0, total: 0 }], // Using 'total' to match backend
//     totalAmount: 0,
//     notes: ""
//   });

//   const fetchAllData = async () => {
//     setSyncing(true);
//     try {
//       const [itemRes, partyRes] = await Promise.all([
//         api.get("/item"),
//         api.get("/party/filter?type=supplier")
//       ]);
//       setAvailableItems(itemRes.data.success ? itemRes.data.data : (Array.isArray(itemRes.data) ? itemRes.data : []));
//       setParties(partyRes.data.success ? partyRes.data.data : (Array.isArray(partyRes.data) ? partyRes.data : []));
//     } catch (err) {
//       toast.error("Cloud Sync Failed");
//     } finally {
//       setSyncing(false);
//     }
//   };

//   useEffect(() => { fetchAllData(); }, []);

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...formData.items];
//     if (field === "itemId") {
//       const selected = availableItems.find(i => i._id === value);
//       newItems[index].itemId = value;
//       newItems[index].price = selected ? (selected.costPrice || 0) : 0;
//     } else {
//       newItems[index][field] = value;
//     }
    
//     // Calculate line total
//     newItems[index].total = (parseFloat(newItems[index].quantity) || 0) * (parseFloat(newItems[index].price) || 0);
    
//     const grandTotal = newItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
//     setFormData({ ...formData, items: newItems, totalAmount: grandTotal });
//   };

//   const addItemRow = () => {
//     setFormData({ ...formData, items: [...formData.items, { itemId: "", quantity: 1, price: 0, total: 0 }] });
//   };

//   const removeItemRow = (index) => {
//     if (formData.items.length > 1) {
//       const filtered = formData.items.filter((_, i) => i !== index);
//       const newTotal = filtered.reduce((acc, curr) => acc + (curr.total || 0), 0);
//       setFormData({ ...formData, items: filtered, totalAmount: newTotal });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.purchaseNumber) return toast.error("Enter Book/Bill Number");
//     if (!formData.partyId) return toast.error("Select a Supplier");
    
//     setLoading(true);
//     try {
//       await api.post("/purchase", formData);
//       toast.success("Purchase Synced with Database");
//       setFormData({
//         purchaseNumber: "",
//         partyId: "", 
//         purchaseDate: new Date().toISOString().split('T')[0],
//         items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
//         totalAmount: 0, 
//         notes: ""
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Transaction Failed");
//     } finally { setLoading(false); }
//   };

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
//         {/* SaaS Header */}
//         <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Purchase</h1>
//             <p className="text-slate-500 mt-1 font-medium">Log entries and maintain your physical book records.</p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button type="button" onClick={fetchAllData} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm shadow-sm flex items-center gap-2">
//               <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} /> Sync
//             </button>
//             <button form="purchase-form" disabled={loading} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
//               <Save size={18} /> {loading ? "Saving..." : "Save Transaction"}
//             </button>
//           </div>
//         </div>

//         <form id="purchase-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
//           <div className="lg:col-span-8 space-y-8">
//             {/* Manual No & Party Selection */}
//             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
//                     <Hash size={12}/> Book / Bill No.
//                   </label>
//                   <input 
//                     type="text" 
//                     placeholder="e.g. BK-401"
//                     className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
//                     value={formData.purchaseNumber} 
//                     onChange={(e) => setFormData({...formData, purchaseNumber: e.target.value})}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2 md:col-span-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
//                     <User size={12}/> Supplier
//                   </label>
//                   <select 
//                     className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
//                     value={formData.partyId} onChange={(e) => setFormData({...formData, partyId: e.target.value})} required
//                   >
//                     <option value="">Choose Supplier...</option>
//                     {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
//                   <input 
//                     type="date" className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700"
//                     value={formData.purchaseDate} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
//                   />
//                 </div>

//               </div>
//             </div>

//             {/* Items Card */}
//             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//               <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
//                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Package size={16} /> Bill Items
//                 </h3>
//                 <span className="text-[10px] bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-bold">Auto-Calculating</span>
//               </div>
              
//               <div className="overflow-x-auto p-4">
//                 <table className="w-full border-separate border-spacing-y-3">
//                   <thead>
//                     <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       <th className="px-4 pb-2">Item Name</th>
//                       <th className="px-4 pb-2 text-center" width="100">Qty</th>
//                       <th className="px-4 pb-2 text-center" width="140">Price</th>
//                       <th className="px-4 pb-2 text-right" width="140">Total</th>
//                       <th className="px-4 pb-2" width="50"></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {formData.items.map((row, index) => (
//                       <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
//                         <td>
//                           <select 
//                             className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-100"
//                             value={row.itemId} onChange={(e) => handleItemChange(index, "itemId", e.target.value)} required
//                           >
//                             <option value="">Select Item...</option>
//                             {availableItems.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
//                           </select>
//                         </td>
//                         <td>
//                           <input 
//                             type="number" value={row.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                             className="w-full h-12 bg-slate-50 border-none rounded-2xl text-center font-black focus:ring-2 focus:ring-indigo-100 outline-none"
//                           />
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-1 bg-slate-50 px-4 rounded-2xl ring-inset focus-within:ring-2 focus-within:ring-indigo-100">
//                              <span className="text-slate-400 font-bold text-xs">₹</span>
//                              <input 
//                               type="number" value={row.price} onChange={(e) => handleItemChange(index, "price", e.target.value)}
//                               className="w-full h-12 bg-transparent border-none text-right font-black outline-none"
//                             />
//                           </div>
//                         </td>
//                         <td className="px-4 text-right font-black text-slate-800 text-sm">
//                           ₹{(row.total || 0).toLocaleString()}
//                         </td>
//                         <td className="text-center">
//                           <button type="button" onClick={() => removeItemRow(index)} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
//                             <Trash2 size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <button 
//                   type="button" onClick={addItemRow}
//                   className="mt-4 ml-2 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
//                 >
//                   <Plus size={14} strokeWidth={4} /> Add New Item
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Summary Sidebar */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
//                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
//                  <ShoppingCart size={150} />
//                </div>
//                <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Grand Total</h4>
//                <div className="text-6xl font-black mb-10 tracking-tighter flex items-baseline gap-1">
//                  <span className="text-indigo-500 text-2xl">₹</span>
//                  {formData.totalAmount.toLocaleString()}
//                </div>
               
//                <div className="space-y-4 pt-8 border-t border-slate-800 text-xs">
//                  <div className="flex justify-between items-center">
//                    <span className="text-slate-500 font-bold uppercase tracking-widest">Manual Ref No.</span>
//                    <span className="font-black text-indigo-400">{formData.purchaseNumber || '---'}</span>
//                  </div>
//                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
//                     <CheckCircle2 size={16} className="text-indigo-500" />
//                     <span className="text-slate-400 italic">Inventory & Ledger will sync</span>
//                  </div>
//                </div>
//             </div>

//             <div className="bg-white rounded-3xl p-8 border border-slate-200">
//               <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4">
//                 <FileText size={14} className="text-indigo-500" /> Remarks / Book Notes
//               </label>
//               <textarea 
//                 className="w-full h-32 p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-600 text-sm resize-none"
//                 placeholder="Mention payment terms or book references..."
//                 value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
//               ></textarea>
//             </div>
//           </div>

//         </form>
//       </div>
//     </MainLayout>
//   );
// };

// export default CreatePurchase;



import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api"; 
import toast from "react-hot-toast";
import { 
  ShoppingCart, Plus, Trash2, Save, RefreshCcw, 
  Package, FileText, User, ChevronDown, CheckCircle2, 
  Hash, IndianRupee, Wallet, CreditCard, Calendar
} from "lucide-react";

const CreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [parties, setParties] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  
  const [formData, setFormData] = useState({
    purchaseNumber: "",      
    partyId: "",
    purchaseDate: new Date().toISOString().split('T')[0], // Fixed: Returns String
    items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
    totalAmount: 0,
    paymentMode: "credit",    
    paidAmount: 0,           
    notes: ""
  });

  // --- 1. DATA FETCHING ---
  const fetchAllData = async () => {
    setSyncing(true);
    try {
      const [itemRes, partyRes] = await Promise.all([
        api.get("/item"),
        api.get("/party/filter?type=supplier")
      ]);
      
      const itemsData = itemRes.data.success ? itemRes.data.data : (Array.isArray(itemRes.data) ? itemRes.data : []);
      const partiesData = partyRes.data.success ? partyRes.data.data : (Array.isArray(partyRes.data) ? partyRes.data : []);
      
      setAvailableItems(itemsData);
      setParties(partiesData);
    } catch (err) {
      toast.error("Cloud Sync Failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // --- 2. CALCULATION LOGIC ---
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === "itemId") {
      const selected = availableItems.find(i => i._id === value);
      newItems[index].itemId = value;
      newItems[index].price = selected ? (selected.costPrice || 0) : 0;
    } else {
      newItems[index][field] = value;
    }
    
    newItems[index].total = (parseFloat(newItems[index].quantity) || 0) * (parseFloat(newItems[index].price) || 0);
    const grandTotal = newItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
    
    setFormData({ 
      ...formData, 
      items: newItems, 
      totalAmount: grandTotal,
      paidAmount: formData.paymentMode === 'cash' ? grandTotal : formData.paidAmount 
    });
  };

  const addItemRow = () => {
    setFormData({ ...formData, items: [...formData.items, { itemId: "", quantity: 1, price: 0, total: 0 }] });
  };

  const removeItemRow = (index) => {
    if (formData.items.length > 1) {
      const filtered = formData.items.filter((_, i) => i !== index);
      const newTotal = filtered.reduce((acc, curr) => acc + (curr.total || 0), 0);
      setFormData({ 
        ...formData, 
        items: filtered, 
        totalAmount: newTotal,
        paidAmount: formData.paymentMode === 'cash' ? newTotal : formData.paidAmount 
      });
    }
  };

  // --- 3. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.purchaseNumber) return toast.error("Enter Book/Bill Number");
    if (!formData.partyId) return toast.error("Select a Supplier");
    
    setLoading(true);
    try {
      await api.post("/purchase", formData);
      toast.success("Purchase & Payments Synced!");
      setFormData({
        purchaseNumber: "",
        partyId: "", 
        purchaseDate: new Date().toISOString().split('T')[0],
        items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
        totalAmount: 0, 
        paymentMode: "credit",
        paidAmount: 0,
        notes: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction Failed");
    } finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Purchase Entry</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Record manual book entries & manage vendor payments.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button type="button" onClick={fetchAllData} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm shadow-sm flex items-center gap-2">
              <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} /> Sync
            </button>
            <button form="purchase-form" disabled={loading} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Save size={18} /> {loading ? "Saving..." : "Save Order"}
            </button>
          </div>
        </div>

        <form id="purchase-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Vendor & Ref Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Hash size={12}/> Book/Ref No.
                  </label>
                  <input 
                    type="text" placeholder="BK-101"
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700"
                    value={formData.purchaseNumber} onChange={(e) => setFormData({...formData, purchaseNumber: e.target.value})} required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <User size={12}/> Supplier
                  </label>
                  <select 
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700"
                    value={formData.partyId} onChange={(e) => setFormData({...formData, partyId: e.target.value})} required
                  >
                    <option value="">Choose Supplier...</option>
                    {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={12}/> Date
                  </label>
                  <input 
                    type="date" className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700"
                    value={formData.purchaseDate} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Package size={16} /> Bill Items
                </h3>
              </div>
              
              <div className="overflow-x-auto p-4">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-4 pb-2">Item Name</th>
                      <th className="px-4 pb-2 text-center" width="100">Qty</th>
                      <th className="px-4 pb-2 text-center" width="140">Price</th>
                      <th className="px-4 pb-2 text-right" width="140">Total</th>
                      <th className="px-4 pb-2" width="50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((row, index) => (
                      <tr key={index} className="group hover:bg-slate-50/50">
                        <td>
                          <select 
                            className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                            value={row.itemId} onChange={(e) => handleItemChange(index, "itemId", e.target.value)} required
                          >
                            <option value="">Select SKU...</option>
                            {availableItems.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                          </select>
                        </td>
                        <td>
                          <input 
                            type="number" value={row.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            className="w-full h-12 bg-slate-50 border-none rounded-2xl text-center font-black outline-none"
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-1 bg-slate-50 px-4 rounded-2xl">
                             <span className="text-slate-400 font-bold text-xs">₹</span>
                             <input 
                              type="number" value={row.price} onChange={(e) => handleItemChange(index, "price", e.target.value)}
                              className="w-full h-12 bg-transparent border-none text-right font-black outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-4 text-right font-black text-slate-800 text-sm">
                          ₹{(row.total || 0).toLocaleString()}
                        </td>
                        <td className="text-center">
                          <button type="button" onClick={() => removeItemRow(index)} className="p-2 text-slate-300 hover:text-rose-500">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={addItemRow} className="mt-4 ml-2 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all">
                  <Plus size={14} strokeWidth={4} /> Add New Row
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Total Amount</h4>
               <div className="text-5xl font-black tracking-tighter flex items-baseline gap-1">
                 <span className="text-indigo-500 text-2xl">₹</span>
                 {formData.totalAmount.toLocaleString()}
               </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <IndianRupee size={16} className="text-indigo-500" /> Payment Details
              </h3>

              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {["credit", "cash"].map((mode) => (
                  <button
                    key={mode} type="button"
                    onClick={() => setFormData({ 
                        ...formData, 
                        paymentMode: mode, 
                        paidAmount: mode === 'cash' ? formData.totalAmount : 0 
                    })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${
                      formData.paymentMode === mode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
                    }`}
                  >
                    {mode === 'credit' ? 'Udhaar' : 'Cash'}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Paid Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-400 font-bold">₹</span>
                  <input 
                    type="number"
                    className="w-full h-14 pl-8 pr-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-black text-slate-700"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${formData.totalAmount - formData.paidAmount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex justify-between items-center text-xs font-black uppercase">
                  <span className={formData.totalAmount - formData.paidAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>Balance Due</span>
                  <span className={formData.totalAmount - formData.paidAmount > 0 ? 'text-rose-700' : 'text-emerald-700'}>
                    ₹{(formData.totalAmount - formData.paidAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4">
                <FileText size={16} className="text-blue-500" /> Remarks
              </label>
              <textarea 
                className="w-full h-24 p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-600 text-sm resize-none"
                placeholder="Page number, notes..."
                value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreatePurchase;
