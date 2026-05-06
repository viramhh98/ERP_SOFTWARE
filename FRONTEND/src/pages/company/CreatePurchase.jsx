// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api";
// import toast from "react-hot-toast";
// import {
//   ShoppingCart, Plus, Trash2, Save, RefreshCcw,
//   Package, FileText, User, ChevronDown, CheckCircle2,
//   Hash, IndianRupee, Wallet, CreditCard, Calendar
// } from "lucide-react";

// const CreatePurchase = () => {
//   const [loading, setLoading] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [availableItems, setAvailableItems] = useState([]);

//   const [formData, setFormData] = useState({
//     purchaseNumber: "",
//     partyId: "",
//     purchaseDate: new Date().toISOString().split('T')[0], // Fixed: Returns String
//     items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
//     totalAmount: 0,
//     paymentMode: "credit",
//     paidAmount: 0,
//     notes: ""
//   });

//   // --- 1. DATA FETCHING ---
//   const fetchAllData = async () => {
//     setSyncing(true);
//     try {
//       const [itemRes, partyRes] = await Promise.all([
//         api.get("/item"),
//         api.get("/party/filter?type=supplier")
//       ]);

//       const itemsData = itemRes.data.success ? itemRes.data.data : (Array.isArray(itemRes.data) ? itemRes.data : []);
//       const partiesData = partyRes.data.success ? partyRes.data.data : (Array.isArray(partyRes.data) ? partyRes.data : []);

//       setAvailableItems(itemsData);
//       setParties(partiesData);
//     } catch (err) {
//       toast.error("Cloud Sync Failed");
//     } finally {
//       setSyncing(false);
//     }
//   };

//   useEffect(() => { fetchAllData(); }, []);

//   // --- 2. CALCULATION LOGIC ---
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...formData.items];
//     if (field === "itemId") {
//       const selected = availableItems.find(i => i._id === value);
//       newItems[index].itemId = value;
//       newItems[index].price = selected ? (selected.costPrice || 0) : 0;
//     } else {
//       newItems[index][field] = value;
//     }

//     newItems[index].total = (parseFloat(newItems[index].quantity) || 0) * (parseFloat(newItems[index].price) || 0);
//     const grandTotal = newItems.reduce((acc, curr) => acc + (curr.total || 0), 0);

//     setFormData({
//       ...formData,
//       items: newItems,
//       totalAmount: grandTotal,
//       paidAmount: formData.paymentMode === 'cash' ? grandTotal : formData.paidAmount
//     });
//   };

//   const addItemRow = () => {
//     setFormData({ ...formData, items: [...formData.items, { itemId: "", quantity: 1, price: 0, total: 0 }] });
//   };

//   const removeItemRow = (index) => {
//     if (formData.items.length > 1) {
//       const filtered = formData.items.filter((_, i) => i !== index);
//       const newTotal = filtered.reduce((acc, curr) => acc + (curr.total || 0), 0);
//       setFormData({
//         ...formData,
//         items: filtered,
//         totalAmount: newTotal,
//         paidAmount: formData.paymentMode === 'cash' ? newTotal : formData.paidAmount
//       });
//     }
//   };

//   // --- 3. SUBMIT ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.purchaseNumber) return toast.error("Enter Book/Bill Number");
//     if (!formData.partyId) return toast.error("Select a Supplier");

//     setLoading(true);
//     try {
//       await api.post("/purchase", formData);
//       toast.success("Purchase & Payments Synced!");
//       setFormData({
//         purchaseNumber: "",
//         partyId: "",
//         purchaseDate: new Date().toISOString().split('T')[0],
//         items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
//         totalAmount: 0,
//         paymentMode: "credit",
//         paidAmount: 0,
//         notes: ""
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Transaction Failed");
//     } finally { setLoading(false); }
//   };

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">

//         {/* Header */}
//         <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Purchase Entry</h1>
//             <p className="text-slate-500 mt-1 font-medium italic">Record manual book entries & manage vendor payments.</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button type="button" onClick={fetchAllData} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm shadow-sm flex items-center gap-2">
//               <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} /> Sync
//             </button>
//             <button form="purchase-form" disabled={loading} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
//               <Save size={18} /> {loading ? "Saving..." : "Save Order"}
//             </button>
//           </div>
//         </div>

//         <form id="purchase-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

//           <div className="lg:col-span-8 space-y-8">
//             {/* Vendor & Ref Card */}
//             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
//                     <Hash size={12}/> Book/Ref No.
//                   </label>
//                   <input
//                     type="text" placeholder="BK-101"
//                     className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700"
//                     value={formData.purchaseNumber} onChange={(e) => setFormData({...formData, purchaseNumber: e.target.value})} required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
//                     <User size={12}/> Supplier
//                   </label>
//                   <select
//                     className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700"
//                     value={formData.partyId} onChange={(e) => setFormData({...formData, partyId: e.target.value})} required
//                   >
//                     <option value="">Choose Supplier...</option>
//                     {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
//                     <Calendar size={12}/> Date
//                   </label>
//                   <input
//                     type="date" className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700"
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
//                       <tr key={index} className="group hover:bg-slate-50/50">
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
//                             className="w-full h-12 bg-slate-50 border-none rounded-2xl text-center font-black outline-none"
//                           />
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-1 bg-slate-50 px-4 rounded-2xl">
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
//                           <button type="button" onClick={() => removeItemRow(index)} className="p-2 text-slate-300 hover:text-rose-500">
//                             <Trash2 size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <button type="button" onClick={addItemRow} className="mt-4 ml-2 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all">
//                   <Plus size={14} strokeWidth={4} /> Add New Row
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Sidebar */}
//           <div className="lg:col-span-4 space-y-6">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
//                <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Total Amount</h4>
//                <div className="text-5xl font-black tracking-tighter flex items-baseline gap-1">
//                  <span className="text-indigo-500 text-2xl">₹</span>
//                  {formData.totalAmount.toLocaleString()}
//                </div>
//             </div>

//             {/* Payment Section */}
//             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
//               <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
//                 <IndianRupee size={16} className="text-indigo-500" /> Payment Details
//               </h3>

//               <div className="flex bg-slate-100 p-1 rounded-2xl">
//                 {["credit", "cash"].map((mode) => (
//                   <button
//                     key={mode} type="button"
//                     onClick={() => setFormData({
//                         ...formData,
//                         paymentMode: mode,
//                         paidAmount: mode === 'cash' ? formData.totalAmount : 0
//                     })}
//                     className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${
//                       formData.paymentMode === mode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
//                     }`}
//                   >
//                     {mode === 'credit' ? 'Udhaar' : 'Cash'}
//                   </button>
//                 ))}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Paid Amount</label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-4 text-slate-400 font-bold">₹</span>
//                   <input
//                     type="number"
//                     className="w-full h-14 pl-8 pr-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-black text-slate-700"
//                     value={formData.paidAmount}
//                     onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
//                   />
//                 </div>
//               </div>

//               <div className={`p-4 rounded-2xl border ${formData.totalAmount - formData.paidAmount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
//                 <div className="flex justify-between items-center text-xs font-black uppercase">
//                   <span className={formData.totalAmount - formData.paidAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>Balance Due</span>
//                   <span className={formData.totalAmount - formData.paidAmount > 0 ? 'text-rose-700' : 'text-emerald-700'}>
//                     ₹{(formData.totalAmount - formData.paidAmount).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-3xl p-8 border border-slate-200">
//               <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4">
//                 <FileText size={16} className="text-blue-500" /> Remarks
//               </label>
//               <textarea
//                 className="w-full h-24 p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-600 text-sm resize-none"
//                 placeholder="Page number, notes..."
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
  Plus,
  Trash2,
  Save,
  User,
  Calendar,
  IndianRupee,
  RefreshCcw,
  Package,
  FileText,
  Search,
  ChevronDown,
  Hash,
} from "lucide-react";

// --- PREMIUM SEARCHABLE SELECT COMPONENT (Ref: image_0f1154.png style) ---
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  className,
  isItem = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {/* Trigger Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer transition-all bg-slate-50 border border-slate-100 rounded-2xl h-14 px-5 ${className} ${
          isOpen ? "ring-4 ring-indigo-500/10 border-indigo-200" : ""
        }`}
      >
        <span
          className={
            selectedOption
              ? "text-slate-700 font-bold text-sm"
              : "text-slate-400 text-sm font-medium"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden top-full left-0 animate-in fade-in zoom-in duration-150">
            {/* Internal Search Bar */}
            <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Search size={14} className="text-slate-400 ml-1" />
              <input
                type="text"
                autoFocus
                className="w-full bg-transparent border-none outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Options Scroll Area */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className="px-4 py-3 text-sm cursor-pointer hover:bg-indigo-50 transition-colors flex justify-between items-center border-b border-slate-50 last:border-none"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <div>
                      <div className="font-bold text-slate-700">
                        {opt.label}
                      </div>
                      {isItem && (
                        <div className="text-[10px] text-slate-400 font-bold">
                          Stock: {opt.stock || 0}
                        </div>
                      )}
                    </div>
                    {opt.price > 0 && (
                      <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500">
                        ₹{opt.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-xs text-slate-400 text-center italic font-semibold">
                  No matches found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [parties, setParties] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);

  const [formData, setFormData] = useState({
    purchaseNumber: "",
    partyId: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
    totalAmount: 0,
    paymentMode: "credit",
    paidAmount: 0,
    notes: "",
  });

  const fetchData = async () => {
    setSyncing(true);
    try {
      const [itemRes, partyRes] = await Promise.all([
        api.get("/item"),
        api.get("/party/filter?type=supplier"),
      ]);
      setAvailableItems(
        itemRes.data.success ? itemRes.data.data : itemRes.data || []
      );
      setParties(
        partyRes.data.success ? partyRes.data.data : partyRes.data || []
      );
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedParty = parties.find((p) => p._id === formData.partyId);
  const supplierOptions = parties.map((p) => ({ label: p.name, value: p._id }));
  const itemOptions = availableItems.map((i) => ({
    label: i.name,
    value: i._id,
    price: i.costPrice,
    stock: i.stock,
  }));

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === "itemId") {
      const selected = availableItems.find((i) => i._id === value);
      newItems[index].itemId = value;
      newItems[index].price = selected ? selected.costPrice || 0 : 0;
    } else {
      newItems[index][field] = value;
    }

    newItems[index].total =
      (parseFloat(newItems[index].quantity) || 0) *
      (parseFloat(newItems[index].price) || 0);
    const grandTotal = newItems.reduce(
      (acc, curr) => acc + (curr.total || 0),
      0
    );

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: grandTotal,
      paidAmount: formData.paymentMode === "cash" ? grandTotal : 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partyId) return toast.error("Please select a supplier");
    setLoading(true);
    try {
      await api.post("/purchase", formData);
      toast.success("Purchase archived successfully");
      setFormData({
        purchaseNumber: "",
        partyId: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
        totalAmount: 0,
        paymentMode: "credit",
        paidAmount: 0,
        notes: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="text-indigo-600" size={32} /> Purchase Entry
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCcw
                size={20}
                className={`text-slate-500 ${syncing ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Save size={18} /> {loading ? "Processing..." : "Save Purchase"}
            </button>
          </div>
        </div>

        <form className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Supplier Information Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ref Number */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Voucher/Bill No.
                  </label>
                  <input
                    type="text"
                    placeholder="REF-001"
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none text-slate-700 focus:ring-4 ring-indigo-500/10"
                    value={formData.purchaseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchaseNumber: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Supplier Select with Smart Badge */}
                <div className="space-y-2 md:col-span-1">
                  {/* Update this div below */}
                  <div className="flex justify-between items-end px-1 mb-1 min-h-[20px]">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Supplier Name
                    </label>

                    {selectedParty ? (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded border shadow-sm ${
                          Number(selectedParty.balance || 0) > 0
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                      >
                        {Number(selectedParty.balance || 0) > 0
                          ? `To Pay: ₹${Number(
                              selectedParty.balance
                            ).toLocaleString()}`
                          : `Advance: ₹${Math.abs(
                              selectedParty.balance
                            ).toLocaleString()}`}
                      </span>
                    ) : (
                      /* This invisible spacer keeps the layout aligned when no supplier is selected */
                      <div className="h-[17px]"></div>
                    )}
                  </div>

                  <SearchableSelect
                    options={supplierOptions}
                    value={formData.partyId}
                    onChange={(val) =>
                      setFormData({ ...formData, partyId: val })
                    }
                    placeholder="Select a Supplier..."
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Entry Date
                  </label>
                  <input
                    type="date"
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none text-slate-700"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Inventory Items Table Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-visible font-bold">
              <div className="p-4 bg-slate-50/50 border-b text-xs font-black uppercase text-slate-400 tracking-widest">
                Purchase Items
              </div>
              <div className="p-4 overflow-visible">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase">
                      <th className="px-4 pb-2">Product / SKU</th>
                      <th className="px-4 pb-2 text-center" width="100">
                        Quantity
                      </th>
                      <th className="px-4 pb-2 text-center" width="140">
                        Unit Price
                      </th>
                      <th className="px-4 pb-2 text-right" width="140">
                        Subtotal
                      </th>
                      <th width="50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((row, index) => (
                      <tr
                        key={index}
                        className="group hover:bg-indigo-50/30 transition-all"
                      >
                        <td className="relative overflow-visible">
                          <SearchableSelect
                            options={itemOptions}
                            value={row.itemId}
                            isItem={true}
                            onChange={(val) =>
                              handleItemChange(index, "itemId", val)
                            }
                            placeholder="Select Item..."
                            className="h-12"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-full h-12 bg-slate-100 border-none rounded-xl text-center outline-none font-bold"
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-1 bg-slate-50 px-4 rounded-xl border border-slate-100">
                            <span className="text-slate-400">₹</span>
                            <input
                              type="number"
                              value={row.price}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "price",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full h-12 bg-transparent border-none text-right outline-none font-bold"
                            />
                          </div>
                        </td>
                        <td className="px-4 text-right font-black text-slate-700">
                          ₹{row.total.toLocaleString()}
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (formData.items.length > 1) {
                                setFormData({
                                  ...formData,
                                  items: formData.items.filter(
                                    (_, i) => i !== index
                                  ),
                                });
                              }
                            }}
                            className="text-rose-300 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      items: [
                        ...formData.items,
                        { itemId: "", quantity: 1, price: 0, total: 0 },
                      ],
                    })
                  }
                  className="mt-4 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all"
                >
                  <Plus size={14} strokeWidth={4} /> Add Manual Row
                </button>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
                Net Total
              </h4>
              <div className="text-5xl font-black tracking-tighter flex items-baseline gap-1">
                <span className="text-indigo-500 text-2xl">₹</span>
                {formData.totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <IndianRupee size={16} className="text-indigo-600" /> Payment
                Terms
              </h3>

              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {["credit", "cash"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        paymentMode: mode,
                        paidAmount: mode === "cash" ? formData.totalAmount : 0,
                      })
                    }
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                      formData.paymentMode === mode
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    {mode === "credit" ? "Credit" : "Cash"}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">
                  {formData.paymentMode === "credit"
                    ? "Credit Bill (No Cash)"
                    : "Immediate Payment"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    readOnly={formData.paymentMode === "credit"}
                    className={`w-full h-14 pl-8 pr-5 border border-slate-100 rounded-2xl outline-none font-black text-slate-700 transition-all ${
                      formData.paymentMode === "credit"
                        ? "bg-slate-50 cursor-not-allowed opacity-60"
                        : "bg-white shadow-inner focus:ring-4 ring-indigo-500/10"
                    }`}
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paidAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  formData.totalAmount - formData.paidAmount > 0
                    ? "bg-rose-50 border-rose-100"
                    : "bg-emerald-50 border-emerald-100"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span
                    className={
                      formData.totalAmount - formData.paidAmount > 0
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }
                  >
                    Awaiting Items
                  </span>
                  <span
                    className={
                      formData.totalAmount - formData.paidAmount > 0
                        ? "text-rose-700"
                        : "text-emerald-700"
                    }
                  >
                    ₹
                    {(
                      formData.totalAmount - formData.paidAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4 tracking-widest">
                <FileText size={16} className="text-blue-500" /> Internal Notes
              </label>
              <textarea
                className="w-full h-24 p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-600 text-sm resize-none placeholder:italic placeholder:font-normal"
                placeholder="Log internal notes or ledger references..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreatePurchase;
