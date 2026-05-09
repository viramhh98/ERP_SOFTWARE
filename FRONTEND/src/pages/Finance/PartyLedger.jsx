import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import LedgerPrintView from "../../components/print/LedgerPrintView";
import {
  Search,
  Printer,
  Eye,
  X,
  Loader2,
  RefreshCcw,
  ChevronDown,
  ShoppingBag,
  Receipt,
  Landmark,
  Plus,
  Phone,
} from "lucide-react";

const PartyLedger = () => {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [balanceData, setBalanceData] = useState({
    balance: 0,
    totalInvoiced: 0,
    totalSettled: 0,
  });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Search State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Voucher States
  const [showDocModal, setShowDocModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [docData, setDocData] = useState(null);
  const [docItems, setDocItems] = useState([]);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Ledger_${selectedParty?.name || "Report"}`,
  });

  const fetchData = async () => {
    setSyncing(true);
    try {
      const res = await api.get("/party/filter?type=all");
      setParties(
        res.data.success
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      toast.error("Refresh Failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchLedger = async (partyId) => {
    setLoading(true);
    setIsDropdownOpen(false);
    const party = parties.find((p) => p._id === partyId);
    setSelectedParty(party);
    try {
      const res = await api.get(`/ledger/${partyId}`);
      const entries = res.data.data || [];
      setLedgerEntries(entries);

      const credit = entries.reduce(
        (acc, curr) => (curr.type === "CREDIT" ? acc + curr.amount : acc),
        0
      );
      const debit = entries.reduce(
        (acc, curr) => (curr.type === "DEBIT" ? acc + curr.amount : acc),
        0
      );

      setBalanceData({
        balance: party.type === "customer" ? debit - credit : credit - debit,
        totalInvoiced: party.type === "customer" ? debit : credit,
        totalSettled: party.type === "customer" ? credit : debit,
      });
    } catch (err) {
      toast.error("Ledger Load Error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDoc = async (refId, refType) => {
    setModalLoading(true);
    setShowDocModal(true);
    try {
      const endpoint =
        refType === "PURCHASE" ? `/purchase/${refId}` : `/sales/${refId}`;
      const res = await api.get(endpoint);
      const data = res.data.data;
      setDocData(data);
      setDocItems(
        data.items.map((it) => ({
          ...it,
          details:
            typeof it.itemId === "object"
              ? it.itemId
              : { name: "Item Missing" },
        }))
      );
    } catch (err) {
      toast.error("Voucher error");
      setShowDocModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredParties = parties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F6F8FC]">
        {/* --- PREMIUM HEADER --- */}
        <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-8 h-[92px] flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="uppercase tracking-[0.3em] text-[10px] font-black text-indigo-600">
                  Accounting / Ledger
                </span>
              </div>
              <h1 className="text-[32px] font-black tracking-tighter text-slate-900 leading-none">
                Party Ledger
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* STABLE DROPWDOWN UI */}
              <div className="relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-12 w-[320px] bg-white border border-slate-200 rounded-2xl flex items-center justify-between px-5 cursor-pointer shadow-sm hover:border-indigo-400 transition-all group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {/* Party Type Badge */}
                    {selectedParty && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          selectedParty.type === "customer"
                            ? "bg-emerald-100 text-emerald-600" // Customer ke liye Emerald/Greenish
                            : "bg-amber-100 text-amber-600" // Supplier ke liye Amber/Yellow
                        }`}
                      >
                        {selectedParty.type}
                      </span>
                    )}

                    {/* Party Name */}
                    <span
                      className={`text-sm font-bold truncate max-w-[200px] ${
                        selectedParty ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {selectedParty ? selectedParty.name : "Choose a Party..."}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white border border-slate-200 rounded-[24px] shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 h-10 shadow-inner">
                        <Search size={14} className="text-slate-400" />
                        <input
                          autoFocus
                          className="w-full bg-transparent outline-none text-sm font-bold"
                          placeholder="Search name or phone..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {filteredParties.map((p) => (
                        <div
                          key={p._id}
                          onClick={() => fetchLedger(p._id)}
                          className="px-5 py-4 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 flex justify-between items-center group transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 group-hover:text-indigo-700">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                              <Phone size={8} /> {p.phone || "No Phone"}
                            </span>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md mb-1 uppercase ${
                                p.type === "customer"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-amber-100 text-amber-600"
                              }`}
                            >
                              {p.type}
                            </div>
                            <div className="text-xs font-black text-slate-900">
                              ₹{p.balance.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={fetchData}
                className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95"
              >
                <RefreshCcw
                  size={17}
                  className={
                    syncing ? "animate-spin text-indigo-600" : "text-slate-500"
                  }
                />
              </button>

              {selectedParty && (
                <button
                  onClick={handlePrint}
                  className="h-11 px-6 rounded-xl bg-slate-900 text-white font-black flex items-center gap-2 shadow-lg hover:shadow-indigo-200 hover:bg-indigo-600 transition-all active:scale-95"
                >
                  <Printer size={16} /> Print Report
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="px-8 pt-[190px] pb-10">
          {selectedParty ? (
            <div className="space-y-6">
              {/* STATS BENTO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className={`rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group ${
                    balanceData.balance >= 0 ? "bg-slate-900" : "bg-rose-600"
                  }`}
                >
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Landmark size={120} />
                  </div>
                  <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                    Net Balance
                  </p>
                  <h2 className="text-4xl font-black">
                    ₹{Math.abs(balanceData.balance).toLocaleString()}
                  </h2>
                  <span className="mt-4 inline-block text-[9px] font-black uppercase bg-white/20 px-3 py-1 rounded-full tracking-widest">
                    {balanceData.balance >= 0
                      ? "Account Receivable"
                      : "Account Payable"}
                  </span>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      Total{" "}
                      {selectedParty.type === "customer" ? "Sales" : "Purchase"}
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      ₹{balanceData.totalInvoiced.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingBag size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                  <div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      Total{" "}
                      {selectedParty.type === "customer" ? "Received" : "Paid"}
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">
                      ₹{balanceData.totalSettled.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Receipt size={24} />
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">
                      <th className="px-8 py-6">Date / Ref</th>
                      <th className="px-8 py-6">Description</th>
                      <th className="px-8 py-6 text-right">Debit (+)</th>
                      <th className="px-8 py-6 text-right">Credit (-)</th>
                      <th className="px-8 py-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {ledgerEntries.map((entry, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/80 transition-all"
                      >
                        <td className="px-8 py-6">
                          <div className="text-sm text-slate-900">
                            {new Date(entry.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </div>
                          <div className="text-[9px] text-indigo-500 font-black uppercase mt-1 tracking-wider">
                            {entry.referenceType}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-500">
                          {entry.description}
                        </td>
                        <td
                          className={`px-8 py-6 text-right text-sm ${
                            entry.type === "DEBIT"
                              ? selectedParty.type === "customer"
                                ? "text-rose-600"
                                : "text-emerald-600"
                              : "text-slate-300"
                          }`}
                        >
                          ₹
                          {entry.type === "DEBIT"
                            ? entry.amount.toLocaleString()
                            : "—"}
                        </td>
                        <td
                          className={`px-8 py-6 text-right text-sm ${
                            entry.type === "CREDIT"
                              ? selectedParty.type === "customer"
                                ? "text-emerald-600"
                                : "text-rose-600"
                              : "text-slate-300"
                          }`}
                        >
                          ₹
                          {entry.type === "CREDIT"
                            ? entry.amount.toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-8 py-6 text-center">
                          {(entry.referenceType === "PURCHASE" ||
                            entry.referenceType === "SALE") && (
                            <button
                              onClick={() =>
                                handleViewDoc(
                                  entry.referenceId,
                                  entry.referenceType
                                )
                              }
                              className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all mx-auto shadow-sm"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Landmark size={40} className="text-slate-200" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                No Account Selected
              </h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
                Search party name in the header to view statement
              </p>
            </div>
          )}
        </div>

        {/* --- VOUCHER MODAL --- */}
        {showDocModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    Transaction Voucher
                  </h3>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    {docData?.invoiceNo || docData?.purchaseNo || "Voucher"}
                  </p>
                </div>
                <button
                  onClick={() => setShowDocModal(false)}
                  className="h-12 w-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:text-rose-500 shadow-sm transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-10">
                {modalLoading ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <Loader2
                      className="animate-spin text-indigo-600"
                      size={40}
                    />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Fetching Bill Details...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-sm font-bold">
                        <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 border-b">
                          <tr className="text-left">
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4 text-center">Qty</th>
                            <th className="px-6 py-4 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {docItems.map((it, i) => (
                            <tr key={i}>
                              <td className="px-6 py-4 text-slate-700">
                                {it.details?.name}
                              </td>
                              <td className="px-6 py-4 text-center text-slate-900 font-black">
                                {it.quantity}
                              </td>
                              <td className="px-6 py-4 text-right text-slate-900 font-black">
                                ₹{it.total.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-8 bg-slate-900 text-white rounded-[32px] flex justify-between items-center shadow-2xl shadow-indigo-200/20">
                      <div>
                        <p className="text-[11px] uppercase font-black opacity-40 tracking-[0.2em]">
                          Grand Total
                        </p>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest italic mt-1">
                          Inclusive of GST
                        </p>
                      </div>
                      <span className="text-4xl font-black tracking-tighter italic">
                        ₹{docData?.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "none" }}>
          <LedgerPrintView
            ref={printRef}
            selectedParty={selectedParty}
            ledgerEntries={ledgerEntries}
            balanceData={balanceData}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PartyLedger;
