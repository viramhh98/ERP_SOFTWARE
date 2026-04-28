import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api"; 
import toast from "react-hot-toast";
import { 
  Plus, Trash2, Save, Wallet, User, 
  Calendar, IndianRupee, RefreshCcw, ShoppingCart, 
  Package, FileText 
} from "lucide-react";

const CreateSales = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [parties, setParties] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  
  const [formData, setFormData] = useState({
    partyId: "",
    purchaseDate: new Date().toISOString().split('T')[0], 
    items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
    totalAmount: 0,
    paymentMode: "credit",
    paidAmount: 0, 
    notes: ""
  });

  // --- FETCH ---
  const fetchData = async () => {
    setSyncing(true);
    try {
      const config = { 
        headers: { 
          activecompanyid: localStorage.getItem('activeCompanyId') 
        } 
      };

      const [itemRes, partyRes] = await Promise.all([
        api.get("/item", config),
        api.get("/party/filter?type=customer", config)
      ]);

      const itemsList = itemRes.data.success ? itemRes.data.data : (itemRes.data || []);
      const partiesList = partyRes.data.success ? partyRes.data.data : (partyRes.data || []);

      const sanitizedParties = partiesList.map(p => ({
        ...p,
        _id: p._id.toString()
      }));

      setAvailableItems(itemsList);
      setParties(sanitizedParties);

      if (sanitizedParties.length > 0) {
        toast.success(`${sanitizedParties.length} Customers Synced`);
      }
    } catch (err) { 
      console.error("Fetch Error:", err);
      toast.error("Sync Failed: System Offline"); 
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- ✅ FIXED CALCULATION ---
  const updateFormState = (newItems, mode, manualPaid) => {
    const newTotal = newItems.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: newTotal,
      paymentMode: mode,
      paidAmount: manualPaid // ✅ FIX
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === "itemId") {
      const selected = availableItems.find(i => i._id.toString() === value.toString());
      newItems[index].itemId = value;
      newItems[index].price = selected ? Number(selected.sellingPrice) : 0;
    } else {
      newItems[index][field] = value;
    }
    newItems[index].total = Number(newItems[index].quantity || 0) * Number(newItems[index].price || 0);
    updateFormState(newItems, formData.paymentMode, formData.paidAmount);
  };

  // --- ✅ FIXED TOGGLE ---
  const handlePaymentToggle = (mode) => {
    updateFormState(formData.items, mode, 0); // ✅ FIX
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partyId) return toast.error("Please select a customer!");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount)
      };
      await api.post("/sales", payload);
      toast.success("Sales Bill Saved!");
      
      setFormData({
        partyId: "", purchaseDate: new Date().toISOString().split('T')[0],
        items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
        totalAmount: 0, paymentMode: "credit", paidAmount: 0, notes: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction Failed");
    } finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingCart className="text-emerald-600" size={32}/> Sales Point
            </h1>
            <p className="text-slate-500 font-medium italic mt-1">Found {parties.length} customers in database</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button type="button" onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCcw size={20} className={`text-slate-500 ${syncing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleSubmit} disabled={loading} className="px-10 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-2">
              <Save size={18} /> {loading ? "Wait..." : "Finalize Bill"}
            </button>
          </div>
        </div>

        <form className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Entity</label>
                  <select 
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 ring-emerald-500/10 appearance-none" 
                    value={formData.partyId} 
                    onChange={(e) => setFormData({...formData, partyId: e.target.value})} 
                    required
                  >
                    <option value="">Choose Customer...</option>
                    {parties.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bill Date</label>
                  <input type="date" className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" value={formData.purchaseDate} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden font-bold">
              <div className="p-4 bg-slate-50/50 border-b text-xs font-black uppercase text-slate-400">Bill Items</div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase">
                      <th className="px-4 pb-2">Item Detail</th>
                      <th className="px-4 pb-2 text-center" width="100">Qty</th>
                      <th className="px-4 pb-2 text-right" width="140">Subtotal</th>
                      <th width="50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((row, index) => (
                      <tr key={index} className="group hover:bg-emerald-50/30 transition-all font-bold">
                        <td>
                          <select className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl text-sm" value={row.itemId} onChange={(e) => handleItemChange(index, "itemId", e.target.value)} required>
                            <option value="">Select SKU...</option>
                            {availableItems.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                          </select>
                        </td>
                        <td><input type="number" value={row.quantity} onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))} className="w-full h-12 bg-slate-100 border-none rounded-xl text-center outline-none" /></td>
                        <td className="px-4 text-right font-black">₹{row.total.toLocaleString()}</td>
                        <td className="text-center">
                          <button type="button" onClick={() => setFormData({...formData, items: formData.items.filter((_, i) => i !== index)})} className="text-rose-300 hover:text-rose-500">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={() => setFormData({...formData, items: [...formData.items, {itemId:"", quantity:1, price:0, total:0}]})} className="mt-4 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest"><Plus size={14} /> Add Line</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Total Amount</p>
               <div className="text-5xl font-black text-emerald-400 tracking-tighter flex items-baseline gap-1">
                 <span className="text-2xl font-light text-white">₹</span>{formData.totalAmount.toLocaleString()}
               </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-xl space-y-6 font-bold">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest"><IndianRupee size={16} className="text-emerald-500" /> Settlement</h3>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {["credit", "cash"].map((mode) => (
                  <button key={mode} type="button" onClick={() => handlePaymentToggle(mode)} 
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.paymentMode === mode ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}
                  >{mode === 'credit' ? 'Udhaar' : 'Cash'}</button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Received Now</label>
                <input 
                  type="number"
                  disabled={false} 
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-2xl outline-none focus:ring-2 ring-emerald-500 text-slate-700"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({...formData, paidAmount: Number(e.target.value) || 0})}
                />
              </div>
              <div className={`p-5 rounded-2xl flex justify-between items-center ${formData.totalAmount - formData.paidAmount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <span className="text-[10px] font-black uppercase">Balance Due</span>
                <span className="text-xl font-black">₹{(formData.totalAmount - formData.paidAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </MainLayout>
  );
};

export default CreateSales;