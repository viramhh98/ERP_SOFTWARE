import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useReactToPrint } from "react-to-print";

import MainLayout from "../../layouts/MainLayout";
import ThermalInvoice from "../../components/print/ThermalInvoice";

import api from "../../services/api";
import toast from "react-hot-toast";

import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
  size,
} from "@floating-ui/react";

import {
  Printer,
  Save,
  Trash2,
  UserPlus,
  Phone,
  Mail,
  Building2,
  Package,
  Search,
  ChevronDown,
  RefreshCcw,
  IndianRupee,
} from "lucide-react";

/* ========================================================= */
/* SEARCHABLE SELECT */
/* ========================================================= */

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

  if (isItem) {
    return (
      (opt.label || "").toLowerCase().includes(search) ||
      (opt.barcode || "").toLowerCase().includes(search) ||
      (opt.sku || "").toLowerCase().includes(search) ||
      (opt.category || "").toLowerCase().includes(search) ||
      (opt.brand || "").toLowerCase().includes(search)
    );
  }
 

    return (
      (opt.label || "").toLowerCase().includes(search) ||
      (opt.phone || "").toLowerCase().includes(search)
    );
  });

  const { refs, floatingStyles } = useFloating({
    open: isOpen,

    middleware: [
      offset(10),

      flip({
        padding: 20,
      }),

      shift({
        padding: 20,
      }),

      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(250, Math.min(availableHeight, 320))}px`,
          });
        },
      }),
    ],

    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      {/* TRIGGER */}
      <div
        ref={refs.setReference}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer transition-all bg-slate-50 border border-slate-100 rounded-2xl h-14 px-5 ${className}`}
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

      {/* DROPDOWN */}
      {isOpen &&
        createPortal(
          <>
            {/* BACKDROP */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* DROPDOWN */}
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-[9999]"
            >
              {/* SEARCH */}
              <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4">
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 h-12">
                  <Search size={16} className="text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              {/* OPTIONS */}
              <div
                className="overflow-y-auto min-h-[250px] max-h-[320px]"
                style={{ scrollbarWidth: "thin" }}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="px-4 py-4 cursor-pointer hover:bg-indigo-50 transition-all border-b border-slate-100"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-sm text-slate-800 truncate">
                            {opt.label}
                          </h3>

                          {isItem && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {opt.sku && (
                                <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black">
                                  SKU: {opt.sku}
                                </span>
                              )}
                              {opt.brand && (
                                <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black">
                                  {opt.brand}
                                </span>
                              )}
                              {opt.category && (
                                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black">
                                  {opt.category}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {opt.price > 0 && (
                          <div className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-black">
                            ₹{opt.price}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No matches found
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const CreateSales = () => {
  const [loading, setLoading] = useState(false);

  const [syncing, setSyncing] = useState(false);

  const [parties, setParties] = useState([]);

  const [availableItems, setAvailableItems] = useState([]);

  const [createdSale, setCreatedSale] = useState(null);

  const [showAddPanel, setShowAddPanel] = useState(false);

  const printRef = useRef(null);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    type: "customer",
    phone: "",
    email: "",
    address: "",
  });

  const [formData, setFormData] = useState({
    partyId: "",

    purchaseDate: new Date().toISOString().split("T")[0],

    items: [
      {
        itemId: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ],

    totalAmount: 0,

    paymentMode: "credit",

    paidAmount: 0,

    notes: "",
  });

  /* ========================================================= */
  /* FETCH DATA */
  /* ========================================================= */

  const fetchData = async () => {
    setSyncing(true);

    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem("activeCompanyId"),
        },
      };

      const [itemRes, partyRes] = await Promise.all([
        api.get("/item", config),

        api.get("/party/filter?type=customer", config),
      ]);
      console.log("Fetched Items:", itemRes.data);

      const itemsList = itemRes.data.success
        ? itemRes.data.data
        : itemRes.data || [];

      const partiesList = partyRes.data.success
        ? partyRes.data.data
        : partyRes.data || [];

      setAvailableItems(itemsList);

      setParties(
        partiesList.map((p) => ({
          ...p,
          _id: p._id.toString(),
        }))
      );
    } catch (err) {
      toast.error("Sync Failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ========================================================= */
  /* DERIVED DATA */
  /* ========================================================= */

  const selectedParty = parties.find((p) => p._id === formData.partyId);

  const customerOptions = parties.map((p) => ({
    label: p.name,

    value: p._id,

    phone: p.phone || "",
  }));

const itemOptions = availableItems.map((i) => ({
  label: i.name,
  value: i._id,
  sku: i.sku || "",
  price: i.sellingPrice || 0,
  brand: i.brand || "", 
  category: i.category || i.categoryName || "", 
  barcode: i.barcode || ""
}));

  /* ========================================================= */
  /* UPDATE TOTALS */
  /* ========================================================= */

  const updateFormState = (newItems, mode, manualPaid) => {
    const newTotal = newItems.reduce(
      (acc, curr) => acc + (Number(curr.total) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,

      items: newItems,

      totalAmount: newTotal,

      paymentMode: mode,

      paidAmount: manualPaid,
    }));
  };

  /* ========================================================= */
  /* ITEM CHANGE */
  /* ========================================================= */

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];

    if (field === "itemId") {
      const selected = availableItems.find(
        (i) => i._id.toString() === value.toString()
      );

      newItems[index].itemId = value;

      newItems[index].price = selected ? Number(selected.sellingPrice) : 0;

      /* AUTO EMPTY ROW */

      const hasEmptyRow = newItems.some((i) => !i.itemId);

      if (!hasEmptyRow) {
        newItems.push({
          itemId: "",
          quantity: 1,
          price: 0,
          total: 0,
        });
      }
    } else {
      newItems[index][field] = value;
    }

    newItems[index].total =
      Number(newItems[index].quantity || 0) *
      Number(newItems[index].price || 0);

    updateFormState(newItems, formData.paymentMode, formData.paidAmount);
  };

  /* ========================================================= */
  /* PAYMENT TOGGLE */
  /* ========================================================= */

  const handlePaymentToggle = (mode) => {
    const smartPaidAmount = mode === "credit" ? 0 : formData.totalAmount;

    updateFormState(formData.items, mode, smartPaidAmount);
  };

  /* ========================================================= */
  /* CUSTOMER SUBMIT */
  /* ========================================================= */

  const handleCustomerSubmit = async () => {
    try {
      const res = await api.post("/party", customerForm);

      toast.success("Customer Added");

      await fetchData();

      const newCustomerId = res?.data?.data?._id || res?.data?._id;

      if (newCustomerId) {
        setFormData((prev) => ({
          ...prev,

          partyId: newCustomerId.toString(),
        }));
      }

      setCustomerForm({
        name: "",

        type: "customer",

        phone: "",

        email: "",

        address: "",
      });

      setShowAddPanel(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add customer");
    }
  };

  /* ========================================================= */
  /* PRINT */
  /* ========================================================= */

  const handlePrint = useReactToPrint({
    contentRef: printRef,

    documentTitle: "Thermal Invoice",
  });

  /* ========================================================= */
  /* SUBMIT */
  /* ========================================================= */

  const handleSubmit = async (e, printAfterSave = false) => {
    e.preventDefault();

    if (!formData.partyId) {
      return toast.error("Please select customer");
    }

    const validItems = formData.items.filter((item) => item.itemId !== "");

    if (validItems.length === 0) {
      return toast.error("Please add at least one item");
    }

    setLoading(true);

    try {
      const actualPaid = Math.min(
        Number(formData.paidAmount),

        Number(formData.totalAmount)
      );

      const payload = {
        ...formData,

        items: validItems,

        totalAmount: Number(formData.totalAmount),

        paidAmount: actualPaid,
      };

      const saleRes = await api.post("/sales", payload);

      const createdSaleId = saleRes?.data?.data?._id;

      toast.success("Sales Invoice Saved!");

      if (createdSaleId) {
        const detailRes = await api.get(`/sales/${createdSaleId}`);

        const fullSale = detailRes.data.data;

        setCreatedSale(fullSale);

        if (printAfterSave) {
          setTimeout(() => {
            if (printRef.current) {
              handlePrint();
            }
          }, 800);
        }

        /* RESET */

        setTimeout(
          () => {
            setFormData({
              partyId: "",

              purchaseDate: new Date().toISOString().split("T")[0],

              items: [
                {
                  itemId: "",
                  quantity: 1,
                  price: 0,
                  total: 0,
                },
              ],

              totalAmount: 0,

              paymentMode: "credit",

              paidAmount: 0,

              notes: "",
            });

            setCreatedSale(null);
          },
          printAfterSave ? 1500 : 100
        );

        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <MainLayout>
      {/* PAGE ROOT */}
      <div className="min-h-screen bg-[#F6F8FC]">
        {/* HEADER */}
        <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-4 md:px-6 xl:px-8 h-[92px] flex items-center justify-between gap-6">
            {/* LEFT */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />

                <span className="uppercase tracking-[0.35em] text-[10px] font-black text-emerald-600">
                  Sales / Entry
                </span>
              </div>

              <h1 className="text-[30px] xl:text-[34px] leading-none font-black tracking-tight text-slate-900">
                Create Sales Invoice
              </h1>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3 shrink-0">
              {/* REFRESH */}
              <button
                onClick={fetchData}
                className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all"
              >
                <RefreshCcw
                  size={17}
                  className={`text-slate-500 ${syncing ? "animate-spin" : ""}`}
                />
              </button>

              {/* PRINT */}
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center gap-2 shadow-sm transition-all"
              >
                <Printer size={16} />
                Save & Print
              </button>

              {/* SAVE */}
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-2 shadow-sm transition-all"
              >
                <Save size={16} />
                Save Invoice
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-4 md:px-6 xl:px-8 pt-30 pb-10">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
            {/* LEFT */}
            <div className="min-w-0 space-y-6">
              {/* CUSTOMER CARD */}
              <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-visible">
                {/* HEADER */}
                <div className="h-[78px] px-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-[24px] font-black text-slate-900">
                      Customer Details
                    </h2>

                    <p className="text-sm text-slate-400 font-semibold mt-1">
                      Customer invoice & billing information
                    </p>
                  </div>

                  <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Building2 size={18} className="text-emerald-600" />
                  </div>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* CUSTOMER */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 block">
                          Customer Name
                        </label>

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
                                ? `Due: ₹${Number(
                                    selectedParty.balance
                                  ).toLocaleString()}`
                                : Number(selectedParty.balance || 0) < 0
                                ? `Advance: ₹${Math.abs(
                                    Number(selectedParty.balance)
                                  ).toLocaleString()}`
                                : "Settled: ₹0"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-1">
                          <SearchableSelect
                            options={customerOptions}
                            value={formData.partyId}
                            onChange={(val) =>
                              setFormData({
                                ...formData,
                                partyId: val,
                              })
                            }
                            placeholder="Search customer..."
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddPanel(true)}
                          className="h-14 w-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm transition-all shrink-0"
                        >
                          <UserPlus size={18} />
                        </button>
                      </div>

                      {/* CONTACT */}
                      {selectedParty && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {selectedParty.phone && (
                            <div className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                              <Phone size={14} className="text-emerald-600" />

                              <span className="text-sm font-bold text-slate-700">
                                {selectedParty.phone}
                              </span>
                            </div>
                          )}

                          {selectedParty.email && (
                            <div className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                              <Mail size={14} className="text-violet-600" />

                              <span className="text-sm font-bold text-slate-700">
                                {selectedParty.email}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* DATE */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Invoice Date
                      </label>

                      <input
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            purchaseDate: e.target.value,
                          })
                        }
                        className="w-full h-14 rounded-xl border border-slate-200 bg-white px-5 font-black outline-none focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* SALES ITEMS */}
              <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-visible">
                {/* HEADER */}
                <div className="h-[78px] px-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-[24px] font-black text-slate-900">
                      Sales Items
                    </h2>

                    <p className="text-sm text-slate-400 font-semibold mt-1">
                      Add products into invoice
                    </p>
                  </div>

                  <div className="h-11 px-4 rounded-xl bg-emerald-50 flex items-center gap-2">
                    <Package size={16} className="text-emerald-600" />

                    <span className="font-black text-sm text-emerald-700">
                      {formData.items.filter((i) => i.itemId).length} Items
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-5 space-y-4">
                  {formData.items.map((row, index) => {
                    const selectedItem = availableItems.find(
                      (i) => i._id.toString() === row.itemId?.toString()
                    );

                    return (
                      <div
                        key={index}
                        className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-emerald-200 hover:bg-white"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                          {/* PRODUCT */}
                          <div className="lg:col-span-5">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                              Product
                            </label>

                            <SearchableSelect
                              options={itemOptions}
                              value={row.itemId}
                              isItem={true}
                              onChange={(val) =>
                                handleItemChange(index, "itemId", val)
                              }
                              placeholder="Search product..."
                            />

                            {/* LOW STOCK */}
                            {selectedItem && selectedItem.stock < 5 && (
                              <div className="mt-2 text-[11px] font-black text-rose-500">
                                Low Stock • Only {selectedItem.stock} left
                              </div>
                            )}
                          </div>

                          {/* QTY */}
                          <div className="lg:col-span-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                              Qty
                            </label>

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
                              className="w-full h-14 rounded-xl border border-slate-200 bg-white px-4 text-center font-black outline-none"
                            />
                          </div>

                          {/* PRICE */}
                          <div className="lg:col-span-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                              Price
                            </label>

                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                                ₹
                              </span>

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
                                className="w-full h-14 rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-black outline-none"
                              />
                            </div>
                          </div>

                          {/* TOTAL */}
                          <div className="lg:col-span-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                              Total
                            </label>

                            <div className="h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                              ₹{Number(row.total || 0).toLocaleString()}
                            </div>
                          </div>

                          {/* DELETE */}
                          <div className="lg:col-span-1">
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
                              className="w-full h-14 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* NOTES */}
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* SUMMARY RAIL */}
            {/* ========================================================= */}

            <div className="hidden xl:block">
              <div className="sticky top-[180px]">
                <div className="rounded-[28px] overflow-hidden border border-emerald-100 bg-white shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
                  {/* TOP */}
                  <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="uppercase tracking-[0.3em] text-[10px] font-black text-emerald-200 mb-2">
                          Invoice Summary
                        </p>

                        <h2 className="text-[28px] font-black">Total Amount</h2>
                      </div>

                      <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                        <IndianRupee size={24} />
                      </div>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight leading-none">
                      ₹{Number(formData.totalAmount || 0).toLocaleString()}
                    </h1>

                    <p className="mt-3 text-sm text-emerald-100 font-medium">
                      Live sales invoice total
                    </p>
                  </div>

                  {/* BODY */}
                  <div className="p-5 space-y-5">
                    {/* PAYMENT MODE */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Payment Mode
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handlePaymentToggle("credit")}
                          className={`h-13 rounded-xl font-black transition-all ${
                            formData.paymentMode === "credit"
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          Credit
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePaymentToggle("cash")}
                          className={`h-13 rounded-xl font-black transition-all ${
                            formData.paymentMode === "cash"
                              ? "bg-slate-900 text-white shadow-lg"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          Cash
                        </button>
                      </div>
                    </div>

                    {/* PAID */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Paid Amount
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                          ₹
                        </span>

                        <input
                          type="number"
                          disabled={formData.paymentMode === "credit"}
                          value={formData.paidAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,

                              paidAmount: Number(e.target.value) || 0,
                            })
                          }
                          className={`w-full h-14 rounded-xl border border-slate-200 pl-10 pr-4 font-black outline-none ${
                            formData.paymentMode === "credit"
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-slate-50"
                          }`}
                        />
                      </div>
                    </div>

                    {/* SUMMARY BOX */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">
                          Items
                        </span>

                        <span className="font-black">
                          {formData.items.filter((i) => i.itemId).length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">
                          Payment
                        </span>

                        <span className="font-black capitalize">
                          {formData.paymentMode}
                        </span>
                      </div>

                      <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">
                          Grand Total
                        </span>

                        <span className="text-2xl font-black text-emerald-700">
                          ₹{Number(formData.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ADD CUSTOMER PANEL */}
        {/* ========================================================= */}

        {showAddPanel && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowAddPanel(false)}
            />

            {/* PANEL */}
            <div className="relative w-full max-w-xl bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-10 animate-in slide-in-from-right duration-500 flex flex-col overflow-y-auto">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <UserPlus size={24} />
                  </div>

                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Add Customer
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddPanel(false)}
                  className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-6">
                <input
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Customer Name"
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                />

                <input
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Phone Number"
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                />

                <input
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="Email"
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                />

                <textarea
                  rows="4"
                  value={customerForm.address}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      address: e.target.value,
                    })
                  }
                  placeholder="Address"
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none font-bold resize-none"
                />

                <button
                  type="button"
                  onClick={handleCustomerSubmit}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl transition-all"
                >
                  Save Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PRINT */}
        {/* ========================================================= */}

        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
          }}
        >
          <ThermalInvoice ref={printRef} sale={createdSale} />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateSales;
