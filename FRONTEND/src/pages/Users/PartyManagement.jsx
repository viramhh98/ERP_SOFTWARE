import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

import {
  Search,
  UserPlus,
  RefreshCcw,
  Phone,
  Mail,
  MapPin,
  X,
  Users,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  User,
  TrendingUp,
  Briefcase,
  ChevronRight,
} from "lucide-react";

const PartyManagement = () => {
  /* ------------------------------------------------ */
  /* STATES */
  /* ------------------------------------------------ */
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "customer",
    phone: "",
    email: "",
    address: "",
  });

  /* ------------------------------------------------ */
  /* FETCH */
  /* ------------------------------------------------ */
  const fetchParties = async () => {
    setSyncing(true);

    try {
      const res = await api.get("/party/filter");
      setParties(res.data || []);
    } catch (err) {
      toast.error("Cloud Sync Failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  /* ------------------------------------------------ */
  /* FORM HANDLER */
  /* ------------------------------------------------ */
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ------------------------------------------------ */
  /* SUBMIT */
  /* ------------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/party", formData);

      toast.success(
        `${formData.type.toUpperCase()} Registered Successfully`
      );

      setFormData({
        name: "",
        type: "customer",
        phone: "",
        email: "",
        address: "",
      });

      setShowAddPanel(false);

      fetchParties();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration Rejected"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------ */
  /* FILTER */
  /* ------------------------------------------------ */
  const filteredParties = useMemo(() => {
    return parties.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm);

      const matchesTab =
        activeTab === "all" ||
        p.type === activeTab ||
        p.type === "both";

      return matchesSearch && matchesTab;
    });
  }, [parties, searchTerm, activeTab]);

  return (
    <MainLayout activeMenu="parties">
      <div className="min-h-screen bg-[#F6F8FC]">

        {/* ------------------------------------------------ */}
        {/* FIXED HEADER */}
        {/* ------------------------------------------------ */}

        <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-4 md:px-8 h-[92px] flex items-center justify-between gap-6">

            {/* LEFT */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="uppercase tracking-[0.3em] text-[10px] font-black text-indigo-600">
                  CRM / Directory
                </span>
              </div>

              <h1 className="text-[28px] md:text-[32px] font-black tracking-tighter text-slate-900 leading-none">
                Party Management
              </h1>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 shrink-0">

              {/* SEARCH */}
              <div className="relative group hidden md:block">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search parties..."
                  className="w-80 h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* REFRESH */}
              <button
                onClick={fetchParties}
                className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95"
              >
                <RefreshCcw
                  size={20}
                  className={`text-slate-500 ${
                    syncing ? "animate-spin" : ""
                  }`}
                />
              </button>

              {/* ADD */}
              <button
                onClick={() => setShowAddPanel(true)}
                className="h-12 px-6 rounded-2xl bg-slate-900 text-white font-black flex items-center gap-2 shadow-lg hover:shadow-indigo-200 hover:bg-indigo-600 transition-all active:scale-95 text-sm"
              >
                <UserPlus size={18} />
                Add Party
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* CONTENT */}
        {/* ------------------------------------------------ */}

        <div className="px-4 md:px-8 pt-[150px] pb-10">

          <div className="max-w-[1600px] mx-auto space-y-8">

            {/* FILTER BAR */}
            <div className="flex flex-wrap items-center gap-3">
              {["all", "customer", "supplier"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 h-11 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}


              
            </div>


            {/* GRID */}
            {syncing ? (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm py-40 text-center">
                <div className="font-black text-slate-300 animate-pulse uppercase tracking-[0.3em]">
                  Retrieving Party Matrix...
                </div>
              </div>
            ) : filteredParties.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm py-40 text-center">
                <Users
                  size={48}
                  className="mx-auto text-slate-200 mb-4"
                />

                <div className="text-slate-300 font-black uppercase tracking-[0.3em]">
                  No Parties Found
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

                {filteredParties.map((party) => (
                  <div
                    key={party._id}
                    className="group bg-white rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-xl transition-all overflow-hidden"
                  >

                    <div className="p-8">

                      {/* TOP */}
                      <div className="flex justify-between items-start mb-8">

                        <div className="h-16 w-16 rounded-[22px] bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {party.name.charAt(0).toUpperCase()}
                        </div>

                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ring-1 ring-inset ${
                            party.type === "customer"
                              ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                              : party.type === "supplier"
                              ? "bg-amber-50 text-amber-600 ring-amber-100"
                              : "bg-purple-50 text-purple-600 ring-purple-100"
                          }`}
                        >
                          {party.type}
                        </span>
                      </div>

                      {/* NAME */}
                      <div className="mb-6">
                        <h3 className="text-xl font-black text-slate-800 leading-none mb-2">
                          {party.name}
                        </h3>

                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <Phone size={14} />
                          <span className="text-sm font-bold">
                            {party.phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin size={14} />
                          <span className="text-[11px] uppercase font-bold truncate">
                            {party.address || "No Address"}
                          </span>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">

                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Entity
                          </p>

                          <h4 className="text-sm font-black text-slate-800 uppercase">
                            {party.type}
                          </h4>
                        </div>

                        <button
                          onClick={() => setSelectedParty(party)}
                          className="h-11 w-11 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* DETAILS SIDEBAR */}
        {/* ------------------------------------------------ */}

        {selectedParty && (
          <div className="fixed inset-0 z-[100] flex justify-end">

            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedParty(null)}
            />

            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">

              {/* HEADER */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl rotate-3">
                    <User size={28} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                      Party Details
                    </h2>

                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                      {selectedParty.type}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedParty(null)}
                  className="h-12 w-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">

                <div className="grid grid-cols-2 gap-4">

                  <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                      Entity Type
                    </p>

                    <p className="text-xl font-black text-indigo-900 uppercase">
                      {selectedParty.type}
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Phone
                    </p>

                    <p className="text-xl font-black text-slate-900">
                      {selectedParty.phone}
                    </p>
                  </div>
                </div>

                {/* INFO CARDS */}

                <div className="space-y-4">

                  <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail size={18} className="text-indigo-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Email Address
                      </p>
                    </div>

                    <p className="text-lg font-black text-slate-800 break-all">
                      {selectedParty.email || "No Email"}
                    </p>
                  </div>

                  <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin size={18} className="text-indigo-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Address
                      </p>
                    </div>

                    <p className="text-lg font-black text-slate-800">
                      {selectedParty.address || "No Address"}
                    </p>
                  </div>

                </div>
              </div>

              {/* FOOTER */}
              <div className="p-8 bg-slate-900 border-t border-slate-800 mt-auto">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 bg-slate-800">
                      <Briefcase size={20} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Party Name
                      </p>

                      <p className="text-lg font-bold text-white leading-none">
                        {selectedParty.name}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={40}
                    className="text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* ADD PANEL */}
        {/* ------------------------------------------------ */}

        {showAddPanel && (
          <div className="fixed inset-0 z-[120] flex justify-end">

            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowAddPanel(false)}
            />

            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">

              {/* HEADER */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl rotate-3">
                    <UserPlus size={28} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                      Create Party
                    </h2>

                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                      New Entity Registration
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddPanel(false)}
                  className="h-12 w-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              {/* BODY */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-8 space-y-6"
              >

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Legal Name
                  </label>

                  <div className="relative">
                    <Building2
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={20}
                    />

                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Business or Personal Name"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Entity Type
                    </label>

                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all appearance-none"
                    >
                      <option value="customer">Customer</option>
                      <option value="supplier">Supplier</option>
                    </select>              
                  </div>
                  



                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Phone
                    </label>

                    <div className="relative">
                      <Phone
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                        size={18}
                      />

                      <input
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                      />
                    </div>
                  </div>
                </div>

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
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="mail@company.com"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>

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
                      name="address"
                      rows="4"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Business Address"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        Commit Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PartyManagement;