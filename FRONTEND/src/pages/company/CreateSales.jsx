import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api"; 
import toast from "react-hot-toast";
import { 
  Plus, Trash2, Save, Wallet, User, 
  Calendar, IndianRupee, RefreshCcw, ShoppingCart, 
  Package, FileText, Search, ChevronDown 
} from "lucide-react";

// --- CUSTOM PREMIUM SEARCHABLE DROPDOWN COMPONENT ---
const SearchableSelect = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />}
      
      <div
        className={`relative z-20 flex items-center justify-between cursor-pointer transition-all ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-slate-700 font-bold text-sm truncate pr-2" : "text-slate-400 text-sm truncate pr-2"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden top-full left-0">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/80">
            <Search size={14} className="text-slate-400 ml-2 flex-shrink-0" />
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none text-sm font-semibold text-slate-700 py-1.5"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar bg-white">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === opt.value 
                    ? 'bg-emerald-50 text-emerald-700 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50 font-semibold'
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-xs text-slate-400 text-center italic font-semibold">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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

  const fetchData = async () => {
    setSyncing(true);
    try {
      const config = { headers: { activecompanyid: localStorage.getItem('activeCompanyId') } };
      const [itemRes, partyRes] = await Promise.all([
        api.get("/item", config),
        api.get("/party/filter?type=customer", config)
      ]);

      const itemsList = itemRes.data.success ? itemRes.data.data : (itemRes.data || []);
      const partiesList = partyRes.data.success ? partyRes.data.data : (partyRes.data || []);

      setAvailableItems(itemsList);
      setParties(partiesList.map(p => ({ ...p, _id: p._id.toString() })));
    } catch (err) { 
      toast.error("Sync Failed: System Offline"); 
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 🚀 INSTANT BALANCE LOOKUP: Derived directly from the parties list
  const selectedParty = parties.find(p => p._id === formData.partyId);

  const updateFormState = (newItems, mode, manualPaid) => {
    const newTotal = newItems.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    setFormData(prev => ({
      ...prev, items: newItems, totalAmount: newTotal, paymentMode: mode, paidAmount: manualPaid 
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === "itemId") {
      const selected = availableItems.find(i => i._id.toString() === value.toString());
      newItems[index].itemId = value;
      newItems[index].price = selected ? Number(selected.sellingPrice) : 0;
      if (index === newItems.length - 1 && value !== "") {
        newItems.push({ itemId: "", quantity: 1, price: 0, total: 0 });
      }
    } else {
      newItems[index][field] = value;
    }
    newItems[index].total = Number(newItems[index].quantity || 0) * Number(newItems[index].price || 0);
    updateFormState(newItems, formData.paymentMode, formData.paidAmount);
  };

  // 🚀 SMART PAYMENT TOGGLE LOGIC
  const handlePaymentToggle = (mode) => {
    // If Credit -> Force 0. If Cash -> Auto-fill the total amount
    const smartPaidAmount = mode === "credit" ? 0 : formData.totalAmount;
    updateFormState(formData.items, mode, smartPaidAmount); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partyId) return toast.error("Please select a customer!");

    const validItems = formData.items.filter(item => item.itemId !== "");
    if (validItems.length === 0) return toast.error("Please add at least one item to the invoice!");

    setLoading(true);
    try {
      const actualPaid = Math.min(Number(formData.paidAmount), Number(formData.totalAmount));

      const payload = {
        ...formData,
        items: validItems, 
        totalAmount: Number(formData.totalAmount),
        paidAmount: actualPaid 
      };
      
      await api.post("/sales", payload);
      toast.success("Sales Invoice Saved!");
      
      // Reset Form
      setFormData({
        partyId: "", purchaseDate: new Date().toISOString().split('T')[0],
        items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
        totalAmount: 0, paymentMode: "credit", paidAmount: 0, notes: ""
      });
      
      // Refresh Data to get updated Party Balance
      fetchData(); 

    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction Failed");
    } finally { setLoading(false); }
  };

  const customerOptions = parties.map(p => ({ value: p._id, label: p.name }));
  const itemOptions = availableItems.map(i => ({ value: i._id, label: i.name }));

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingCart className="text-emerald-600" size={32}/> Create Sales Invoice
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button type="button" onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCcw size={20} className={`text-slate-500 ${syncing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleSubmit} disabled={loading} className="px-10 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-2">
              <Save size={18} /> {loading ? "Processing..." : "Save Invoice"}
            </button>
          </div>
        </div>

        <form className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  
                  {/* --- SMART BALANCE BADGE --- */}
                  <div className="flex justify-between items-center px-1 mb-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</label>
                    {selectedParty && (
                      <div className="text-[10px] font-black tracking-widest">
                        <span
                          className={`px-2 py-1 rounded shadow-sm border ${
                            Number(selectedParty.balance || 0) > 0
                              ? "bg-rose-50 text-rose-600 border-rose-200" 
                              : Number(selectedParty.balance || 0) < 0
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {Number(selectedParty.balance || 0) > 0
                            ? `Due: ₹${Number(selectedParty.balance).toLocaleString()}`
                            : Number(selectedParty.balance || 0) < 0
                            ? `Advance: ₹${Math.abs(Number(selectedParty.balance)).toLocaleString()}`
                            : "Settled: ₹0"}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* --------------------------- */}
                  
                  <SearchableSelect 
                    options={customerOptions} value={formData.partyId}
                    onChange={(val) => setFormData({...formData, partyId: val})}
                    placeholder="Select a Customer..."
                    className="h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus-within:ring-4 ring-emerald-500/10"
                  />
                </div>
                <div className="space-y-2">
                  <div className="px-1 mb-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Date</label>
                  </div>
                  <input 
                    type="date" 
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none text-sm text-slate-700" 
                    value={formData.purchaseDate} 
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-visible font-bold">
              <div className="p-4 bg-slate-50/50 border-b text-xs font-black uppercase text-slate-400">Invoice Items</div>
              <div className="p-4 overflow-visible">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase">
                      <th className="px-4 pb-2">Product / Item</th>
                      <th className="px-4 pb-2 text-center" width="100">Qty</th>
                      <th className="px-4 pb-2 text-right" width="140">Subtotal</th>
                      <th width="50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((row, index) => (
                      <tr key={index} className="group hover:bg-emerald-50/30 transition-all font-bold">
                        <td className="relative">
                          <SearchableSelect 
                            options={itemOptions} value={row.itemId}
                            onChange={(val) => handleItemChange(index, "itemId", val)}
                            placeholder="Search Item..."
                            className="h-12 px-4 bg-slate-50 rounded-xl"
                          />
                        </td>
                        <td>
                          <input 
                            type="number" min="1" value={row.quantity} 
                            onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))} 
                            className="w-full h-12 bg-slate-100 border-none rounded-xl text-center outline-none text-sm text-slate-700" 
                          />
                        </td>
                        <td className="px-4 text-right font-black text-slate-700">₹{row.total.toLocaleString()}</td>
                        <td className="text-center">
                          <button 
                            type="button" 
                            onClick={() => {
                              if (formData.items.length > 1) {
                                setFormData({...formData, items: formData.items.filter((_, i) => i !== index)});
                              } else {
                                setFormData({...formData, items: [{ itemId: "", quantity: 1, price: 0, total: 0 }]});
                              }
                            }} 
                            className="text-rose-300 hover:text-rose-500 transition-colors"
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
                  onClick={() => setFormData({...formData, items: [...formData.items, {itemId:"", quantity:1, price:0, total:0}]})} 
                  className="mt-4 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:text-emerald-700"
                >
                  <Plus size={14} /> Add Line Manually
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Net Total</p>
               <div className="text-5xl font-black text-emerald-400 tracking-tighter flex items-baseline gap-1">
                 <span className="text-2xl font-light text-white">₹</span>{formData.totalAmount.toLocaleString()}
               </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-xl space-y-6 font-bold">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                <IndianRupee size={16} className="text-emerald-500" /> Payment Details
              </h3>
              
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {["credit", "cash"].map((mode) => (
                  <button 
                    key={mode} type="button" onClick={() => handlePaymentToggle(mode)} 
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.paymentMode === mode ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {mode === 'credit' ? 'Credit' : 'Cash'}
                  </button>
                ))}
              </div>

              {/* 🚀 SMART CASH TENDERED INPUT */}
              <div className={`space-y-2 transition-all duration-300 ${formData.paymentMode === 'credit' ? 'opacity-50' : ''}`}>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  {formData.paymentMode === 'credit' ? 'Credit Bill (No Cash)' : 'Cash Tendered (Received)'}
                </label>
                <input 
                  type="number" min="0"
                  className={`w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-2xl outline-none focus:ring-2 ring-emerald-500 text-slate-700 ${formData.paymentMode === 'credit' ? 'cursor-not-allowed bg-slate-100' : ''}`}
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({...formData, paidAmount: Number(e.target.value) || 0})}
                  placeholder="0"
                  disabled={formData.paymentMode === 'credit'} 
                />
              </div>

              {/* SMART CHANGE/BALANCE CALCULATOR */}
              {(() => {
                const diff = formData.paidAmount - formData.totalAmount;

                if (formData.totalAmount === 0) {
                  return (
                    <div className="p-5 rounded-2xl flex justify-between items-center bg-slate-50 text-slate-400 border border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Items</span>
                      <span className="text-xl font-black">₹0</span>
                    </div>
                  );
                }

                if (diff < 0) {
                  return (
                    <div className="p-5 rounded-2xl flex justify-between items-center bg-rose-50 text-rose-600 border border-rose-100">
                      <span className="text-[10px] font-black uppercase tracking-widest">Balance Due</span>
                      <span className="text-xl font-black">₹{Math.abs(diff).toLocaleString()}</span>
                    </div>
                  );
                } else if (diff > 0) {
                  return (
                    <div className="p-5 rounded-2xl flex justify-between items-center bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-inner">
                      <span className="text-[10px] font-black uppercase tracking-widest">Change to Return</span>
                      <span className="text-xl font-black">₹{diff.toLocaleString()}</span>
                    </div>
                  );
                } else {
                  return (
                    <div className="p-5 rounded-2xl flex justify-between items-center bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                      <span className="text-xl font-black">Fully Paid</span>
                    </div>
                  );
                }
              })()}

            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateSales;