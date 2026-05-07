import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Save,
  IndianRupee,
  RefreshCcw,
  Package,
  FileText,
  Search,
  ChevronDown,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  X,
} from "lucide-react";

// --- PREMIUM SEARCHABLE SELECT COMPONENT ---
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

  const filteredOptions = options.filter((opt) => {
    const search = searchTerm.toLowerCase();

    return (
      opt.label?.toLowerCase().includes(search) ||
      opt.phone?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="relative w-full">
      {/* Trigger */}
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

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden top-full left-0 animate-in fade-in zoom-in duration-150">
            {/* Search */}
            <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Search size={14} className="text-slate-400 ml-1" />

              <input
                type="text"
                autoFocus
                className="w-full bg-transparent border-none outline-none text-sm font-semibold text-slate-700"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Options */}
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
                      <div>
                        <div className="font-bold text-slate-700">
                          {opt.label}
                        </div>

                        {opt.phone && (
                          <div className="text-[10px] font-black text-slate-400 mt-1">
                            {opt.phone}
                          </div>
                        )}
                        {opt.bal && (
                          <div className="text-[10px] font-black text-slate-400 mt-1">
                            {opt.bal}
                          </div>
                        )}
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

  const [generatedPurchaseNo, setGeneratedPurchaseNo] = useState("");

  const [formData, setFormData] = useState({
    partyId: "",

    supplierBillNo: "",

    supplierBillDate: new Date().toISOString().split("T")[0],

    purchaseDate: new Date().toISOString().split("T")[0],

    items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],

    totalAmount: 0,

    paymentMode: "credit",

    paidAmount: 0,

    notes: "",
  });
  const [showAddSupplierPanel, setShowAddSupplierPanel] = useState(false);

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    type: "supplier",
    phone: "",
    email: "",
    address: "",
  });

  const handleSupplierSubmit = async () => {
    try {
      const res = await api.post("/party", supplierForm);

      toast.success("Supplier Added");

      await fetchData();

      const newSupplierId = res?.data?.data?._id || res?.data?._id;

      if (newSupplierId) {
        setFormData((prev) => ({
          ...prev,
          partyId: newSupplierId.toString(),
        }));
      }

      setSupplierForm({
        name: "",
        type: "supplier",
        phone: "",
        email: "",
        address: "",
      });

      setShowAddSupplierPanel(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add supplier");
    }
  };

  /* FETCH */

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

  const supplierOptions = parties.map((p) => ({
    label: p.name,
    value: p._id,
    phone: p.phone || "",
  }));

  const itemOptions = availableItems.map((i) => ({
    label: i.name,
    value: i._id,
    price: i.costPrice,
    stock: i.stock,
  }));

  /* ITEMS */

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

  /* SUBMIT */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.partyId) {
      return toast.error("Please select a supplier");
    }

    if (!formData.supplierBillNo) {
      return toast.error("Supplier bill no required");
    }

    setLoading(true);

    try {
      const res = await api.post("/purchase", formData);

      toast.success("Purchase archived successfully");

      setGeneratedPurchaseNo(res.data.data.purchaseNumber);

      setFormData({
        partyId: "",

        supplierBillNo: "",

        supplierBillDate: new Date().toISOString().split("T")[0],

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
        {/* ERP GENERATED NUMBER */}

        {generatedPurchaseNo && (
          <div className="max-w-7xl mx-auto mb-6 bg-emerald-50 border border-emerald-200 rounded-3xl px-6 py-5">
            <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500">
              ERP Purchase Number
            </p>

            <h2 className="text-3xl font-black text-emerald-700 mt-1">
              {generatedPurchaseNo}
            </h2>
          </div>
        )}

        {/* HEADER */}

        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="text-indigo-600" size={32} />
            Purchase Entry
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
              <Save size={18} />
              {loading ? "Processing..." : "Save Purchase"}
            </button>
          </div>
        </div>

        {/* FORM */}

        <form className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT */}

          <div className="lg:col-span-8 space-y-8">
            {/* SUPPLIER CARD */}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SUPPLIER */}

                <div className="space-y-2">
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
                      <div className="h-[17px]"></div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <SearchableSelect
                        options={supplierOptions}
                        value={formData.partyId}
                        onChange={(val) =>
                          setFormData({
                            ...formData,
                            partyId: val,
                          })
                        }
                        placeholder="Select a Supplier..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddSupplierPanel(true)}
                      className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg transition-all flex-shrink-0"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                </div>

                {/* SUPPLIER BILL */}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Supplier Bill No
                  </label>

                  <input
                    type="text"
                    placeholder="INV-4588"
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none text-slate-700"
                    value={formData.supplierBillNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplierBillNo: e.target.value,
                      })
                    }
                  />
                </div>

                {/* ENTRY DATE */}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Entry Date
                  </label>

                  <input
                    type="date"
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none text-slate-700"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchaseDate: e.target.value,
                      })
                    }
                  />
                </div>

                {/* SUPPLIER BILL DATE */}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Supplier Bill Date
                  </label>

                  <input
                    type="date"
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none text-slate-700"
                    value={formData.supplierBillDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplierBillDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            {/* ITEMS */}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <FileText size={20} />
                  Purchase Items
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      items: [
                        ...formData.items,
                        {
                          itemId: "",
                          quantity: 1,
                          price: 0,
                          total: 0,
                        },
                      ],
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-5">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 bg-slate-50 border border-slate-100 rounded-3xl p-5"
                  >
                    {/* ITEM */}

                    <div className="col-span-12 lg:col-span-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">
                        Item
                      </label>

                      <SearchableSelect
                        options={itemOptions}
                        value={item.itemId}
                        isItem={true}
                        onChange={(val) =>
                          handleItemChange(index, "itemId", val)
                        }
                        placeholder="Select item..."
                      />
                    </div>

                    {/* QTY */}

                    <div className="col-span-6 lg:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">
                        Qty
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none"
                      />
                    </div>

                    {/* PRICE */}

                    <div className="col-span-6 lg:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none"
                      />
                    </div>

                    {/* TOTAL */}

                    <div className="col-span-10 lg:col-span-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">
                        Total
                      </label>

                      <div className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center px-4 font-black text-slate-700">
                        ₹{Number(item.total || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* REMOVE */}

                    <div className="col-span-2 lg:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.items.filter(
                            (_, i) => i !== index
                          );

                          const grandTotal = updated.reduce(
                            (acc, curr) => acc + curr.total,
                            0
                          );

                          setFormData({
                            ...formData,
                            items: updated,
                            totalAmount: grandTotal,
                          });
                        }}
                        className="w-full h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-6">
              <h2 className="text-2xl font-black text-slate-900 mb-8">
                Purchase Summary
              </h2>

              {/* TOTAL */}

              <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 mb-6">
                <p className="text-[10px] uppercase tracking-widest font-black text-indigo-500 mb-2">
                  Total Purchase Value
                </p>

                <h1 className="text-5xl font-black text-indigo-700 tracking-tight flex items-center gap-1">
                  <IndianRupee size={38} />
                  {Number(formData.totalAmount || 0).toLocaleString()}
                </h1>
              </div>

              {/* PAYMENT MODE */}

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">
                    Payment Mode
                  </label>

                  <select
                    value={formData.paymentMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMode: e.target.value,
                        paidAmount:
                          e.target.value === "cash" ? formData.totalAmount : 0,
                      })
                    }
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
                  >
                    <option value="credit">Credit</option>

                    <option value="cash">Cash</option>
                  </select>
                </div>

                {/* PAID */}

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">
                    Paid Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    disabled={formData.paymentMode === "cash"}
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paidAmount: e.target.value,
                      })
                    }
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none disabled:bg-slate-100"
                  />
                </div>

                {/* NOTES */}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* --- ADD SUPPLIER PANEL --- */}
      {showAddSupplierPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAddSupplierPanel(false)}
          />

          {/* PANEL */}
          <div className="relative w-full max-w-xl bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-10 animate-in slide-in-from-right duration-500 flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <UserPlus size={24} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Add Supplier
                </h2>
              </div>

              <button
                onClick={() => setShowAddSupplierPanel(false)}
                className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {/* NAME */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Supplier Name
                </label>

                <div className="relative">
                  <Building2
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />

                  <input
                    required
                    value={supplierForm.name}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Supplier Name"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />

                  <input
                    required
                    value={supplierForm.phone}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="9876543210"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />

                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="supplier@email.com"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Address
                </label>

                <div className="relative">
                  <MapPin
                    className="absolute left-5 top-5 text-slate-300"
                    size={20}
                  />

                  <textarea
                    rows="4"
                    value={supplierForm.address}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        address: e.target.value,
                      })
                    }
                    placeholder="Supplier Address"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all resize-none shadow-inner"
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleSupplierSubmit}
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95"
                >
                  <CheckCircle2 size={20} />
                  Save Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CreatePurchase;
