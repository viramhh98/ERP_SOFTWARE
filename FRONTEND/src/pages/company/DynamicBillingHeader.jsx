import React, { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import api from "../../services/api";

import toast from "react-hot-toast";

import {
  Hash,
  Layers3,
  FileText,
  Save,
  Building2,
  CalendarRange,
  Settings2,
} from "lucide-react";

/* -------------------------------------------- */
/* PREFIX MAP */
/* -------------------------------------------- */

const voucherPrefixes = {
  "Sales Invoice": "INV",
  "Purchase Invoice": "PUR",
  "Debit Note": "DN",
  "Credit Note": "CN",
  Quotation: "QUO",
};

/* -------------------------------------------- */
/* FINANCIAL YEAR */
/* -------------------------------------------- */

const getFinancialYear = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = today.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${String(year + 1).slice(-2)}`;
  }

  return `${year - 1}-${String(year).slice(-2)}`;
};

/* -------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------- */

const DynamicBillingHeader = () => {
  const [loading, setLoading] = useState(false);

  const [selectedVoucherType, setSelectedVoucherType] =
    useState("Sales Invoice");

  const [formData, setFormData] = useState({
    voucherType: "Sales Invoice",

    prefix: "INV",

    suffix: "",

    separator: "/",

    numberPadding: 4,

    includeFY: true,

    includeBranch: true,

    includeMonth: false,

    resetEveryFY: true,

    autoGenerate: true,

    startingNumber: 1,

    currentSequence: 0,

    financialYear: getFinancialYear(),

    companyCode: "ERP",

    branchCode: "MAIN",

    isActive: true,

    preview: "",
  });

  /* -------------------------------------------- */
  /* PREVIEW */
  /* -------------------------------------------- */

  const generatePreview = (data) => {
    const parts = [];

    if (data.companyCode) {
      parts.push(data.companyCode);
    }

    if (data.includeBranch && data.branchCode) {
      parts.push(data.branchCode);
    }

    if (data.prefix) {
      parts.push(data.prefix);
    }

    if (data.includeFY) {
      parts.push(data.financialYear);
    }

    if (data.includeMonth) {
      parts.push(String(new Date().getMonth() + 1).padStart(2, "0"));
    }

    const next = Number(data.currentSequence || 0) + 1;

    parts.push(String(next).padStart(data.numberPadding, "0"));

    if (data.suffix) {
      parts.push(data.suffix);
    }

    return parts.join(data.separator);
  };

  /* -------------------------------------------- */
  /* FETCH CONFIG */
  /* -------------------------------------------- */

  const fetchConfig = async (voucherType) => {
    try {
      const res = await api.get(
        `/billnumber/config?voucherType=${voucherType}`
      );

      if (res.data?.data) {
        const updated = {
          ...res.data.data,
        };

        updated.preview = generatePreview(updated);

        setFormData(updated);
      } else {
        const updated = {
          ...formData,

          voucherType,

          prefix: voucherPrefixes[voucherType] || "INV",

          currentSequence: 0,
        };

        updated.preview = generatePreview(updated);

        setFormData(updated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConfig(selectedVoucherType);
  }, [selectedVoucherType]);

  /* -------------------------------------------- */
  /* CHANGE */
  /* -------------------------------------------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "voucherType") {
      setSelectedVoucherType(value);

      return;
    }

    const updated = {
      ...formData,

      [name]: type === "checkbox" ? checked : value,
    };

    updated.preview = generatePreview(updated);

    setFormData(updated);
  };

  /* -------------------------------------------- */
  /* SAVE */
  /* -------------------------------------------- */

  const handleSave = async () => {
    try {
      setLoading(true);

      await api.post("/billnumber/config", {
        ...formData,
        voucherType: selectedVoucherType,
      });

      toast.success("Configuration Saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Save Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F6F8FC]">
        {/* FIXED HEADER */}
        <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-4 md:px-6 xl:px-8 h-[92px] flex items-center justify-between gap-6">
            {/* LEFT */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />

                <span className="uppercase tracking-[0.35em] text-[10px] font-black text-indigo-600">
                  ERP / BILLING ENGINE
                </span>
              </div>

              <h1 className="text-[30px] xl:text-[34px] leading-none font-black tracking-tight text-slate-900">
                Invoice Configuration
              </h1>
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Save size={16} />

              {loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-[140px] px-4 md:px-6 xl:px-8 pb-10">
          {/* FORM CARD */}
          <div className="w-full bg-white rounded-[3rem] border border-slate-200 p-8 md:p-10 xl:p-12">
            {/* TITLE */}
            <div className="mb-10">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">
                Configure Invoice Rules
              </h2>

              <p className="text-slate-500 font-medium mt-2">
                Configure ERP bill numbering logic and automatic sequence
                generation.
              </p>
            </div>

            {/* TOP STATS */}
<div className="grid grid-cols-12 gap-4 mb-8">

  {/* PREVIEW */}
  <div className="col-span-12 xl:col-span-8 rounded-[2.2rem] bg-[#0F172A] text-white p-6 overflow-hidden relative min-h-[150px] flex flex-col justify-between">

    <div className="absolute right-0 top-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl" />

    <div>

      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-300 mb-3">
        Next Invoice Preview
      </p>

      <h2 className="text-[34px] leading-tight font-black tracking-tight break-all relative z-10">

        {formData.preview}

      </h2>

    </div>

    <div className="flex items-center gap-2 mt-4">

      <div className="h-2 w-2 rounded-full bg-emerald-400" />

      <p className="text-xs font-bold text-slate-400">
        Auto generated ERP invoice numbering
      </p>

    </div>

  </div>

  {/* FY */}
  <div className="col-span-12 xl:col-span-4 rounded-[2.2rem] border border-slate-200 bg-slate-50 p-6 min-h-[150px] flex flex-col justify-between">

    <div>

      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3">
        Active Financial Year
      </p>

      <h2 className="text-[48px] leading-none font-black tracking-tight text-slate-900">

        {getFinancialYear()}

      </h2>

    </div>

    <div className="flex items-center gap-2">

      <div className="h-2 w-2 rounded-full bg-indigo-500" />

      <p className="text-xs font-bold text-slate-500">
        Current ERP billing cycle
      </p>

    </div>

  </div>

</div>

            {/* FORM */}
         <div className="grid grid-cols-12 gap-4">
              <FormField title="Voucher Type" icon={<FileText size={18} />}>
                <select
                  name="voucherType"
                  value={selectedVoucherType}
                  onChange={handleChange}
                  className={`
    ${inputClass}
    appearance-none
    cursor-pointer
    bg-white
  `}
                >
                  <option>Sales Invoice</option>

                  <option>Purchase Invoice</option>

                  <option>Debit Note</option>

                  <option>Credit Note</option>

                  <option>Quotation</option>
                </select>
              </FormField>

              <FormField title="Prefix" icon={<Layers3 size={18} />}>
                <input
                  type="text"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField title="Suffix" icon={<Layers3 size={18} />}>
                <input
                  type="text"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField title="Separator" icon={<Settings2 size={18} />}>
                <input
                  type="text"
                  name="separator"
                  value={formData.separator}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField title="Company Code" icon={<Building2 size={18} />}>
                <input
                  type="text"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField title="Branch Code" icon={<Building2 size={18} />}>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField
                title="Financial Year"
                icon={<CalendarRange size={18} />}
              >
                <input
                  type="text"
                  name="financialYear"
                  value={formData.financialYear}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField title="Starting Number" icon={<Hash size={18} />}>
                <input
                  type="number"
                  name="startingNumber"
                  value={formData.startingNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField title="Current Sequence" icon={<Hash size={18} />}>
                <input
                  disabled
                  value={formData.currentSequence || 0}
                  className={`${inputClass} bg-slate-100 cursor-not-allowed`}
                />
              </FormField>

              <FormField title="Number Padding" icon={<Hash size={18} />}>
                <input
                  type="number"
                  name="numberPadding"
                  value={formData.numberPadding}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
            </div>

            {/* TOGGLES */}
            <div className="grid grid-cols-12 gap-6 mt-8">
              <ToggleCard
                title="Include FY"
                desc="Add financial year"
                name="includeFY"
                value={formData.includeFY}
                onChange={handleChange}
              />

              <ToggleCard
                title="Include Branch"
                desc="Add branch code"
                name="includeBranch"
                value={formData.includeBranch}
                onChange={handleChange}
              />

              <ToggleCard
                title="Include Month"
                desc="Add current month"
                name="includeMonth"
                value={formData.includeMonth}
                onChange={handleChange}
              />

              <ToggleCard
                title="Reset Every FY"
                desc="Reset sequence yearly"
                name="resetEveryFY"
                value={formData.resetEveryFY}
                onChange={handleChange}
              />

              <ToggleCard
                title="Auto Generate"
                desc="Automatic numbering"
                name="autoGenerate"
                value={formData.autoGenerate}
                onChange={handleChange}
              />

              <ToggleCard
                title="Configuration Active"
                desc="Enable this configuration"
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

/* -------------------------------------------- */
/* FIELD */
/* -------------------------------------------- */

const FormField = ({ title, icon, children }) => (
  <div className="col-span-12 md:col-span-6 xl:col-span-3">

    <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 ml-2">

      {title}

    </label>

    <div className="relative">

      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 z-10">

        {icon}

      </div>

      {children}

    </div>

  </div>
);

/* -------------------------------------------- */
/* TOGGLE */
/* -------------------------------------------- */

const ToggleCard = ({
  title,
  desc,
  name,
  value,
  onChange,
}) => (
  <div className="col-span-12 md:col-span-6 xl:col-span-4">

    <div className="h-full bg-slate-50 border border-slate-200 rounded-[1.8rem] px-5 py-5 flex items-center justify-between">

      <div>

        <h3 className="font-black text-[15px] text-slate-800">
          {title}
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          {desc}
        </p>

      </div>

      <input
        type="checkbox"
        name={name}
        checked={value}
        onChange={onChange}
        className="h-5 w-5"
      />

    </div>

  </div>
);

const inputClass =
  "w-full h-[58px] bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none rounded-[1.2rem] pl-14 pr-5 font-bold text-[15px] text-slate-700 transition-all shadow-sm";export default DynamicBillingHeader;
