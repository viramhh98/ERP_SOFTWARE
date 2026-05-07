import React, {
  useEffect,
  useState,
} from "react";

import MainLayout from "../../layouts/MainLayout";

import api from "../../services/api";

import toast from "react-hot-toast";

import {
  Hash,
  Layers3,
  FileText,
  RefreshCcw,
  Save,
  CheckCircle2,
  Building2,
  CalendarRange,
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

  const year =
    today.getFullYear();

  const month =
    today.getMonth() + 1;

  if (month >= 4) {

    return `${year}-${String(
      year + 1
    ).slice(-2)}`;

  } else {

    return `${year - 1}-${String(
      year
    ).slice(-2)}`;
  }
};

/* -------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------- */

const DynamicBillingHeader = () => {

  const [loading, setLoading] =
    useState(false);

  const [
    selectedVoucherType,
    setSelectedVoucherType,
  ] = useState(
    "Sales Invoice"
  );

  const [formData, setFormData] =
    useState({

      voucherType:
        "Sales Invoice",

      prefix: "INV",

      suffix: "",

      separator: "/",

      numberPadding: 4,

      includeFY: true,

      includeBranch: true,

      resetEveryFY: true,

      currentSequence: 0,

      financialYear:
        getFinancialYear(),

      companyCode: "ERP",

      branchCode: "MAIN",

      preview: "",
    });

  /* -------------------------------------------- */
  /* FETCH CONFIG */
  /* -------------------------------------------- */

  const fetchConfig = async (
    voucherType
  ) => {

    try {

      setLoading(true);

      const res =
        await api.get(

          `/billnumber/config?voucherType=${voucherType}`
        );

      /* -------------------------------- */
      /* CONFIG FOUND */
      /* -------------------------------- */

      if (res.data?.data) {

        const updated = {

          ...formData,

          ...res.data.data,
        };

        updated.preview =
          generatePreview(updated);

        requestAnimationFrame(() => {

          setFormData(updated);
        });

      } else {

        /* -------------------------------- */
        /* DEFAULT CONFIG */
        /* -------------------------------- */

        const updated = {

          ...formData,

          voucherType,

          prefix:
            voucherPrefixes[
              voucherType
            ] || "INV",

          currentSequence: 0,
        };

        updated.preview =
          generatePreview(updated);

        requestAnimationFrame(() => {

          setFormData(updated);
        });
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  /* -------------------------------------------- */
  /* FETCH ON VOUCHER CHANGE */
  /* -------------------------------------------- */

  useEffect(() => {

    fetchConfig(
      selectedVoucherType
    );

  }, [selectedVoucherType]);

  /* -------------------------------------------- */
  /* HANDLE CHANGE */
  /* -------------------------------------------- */

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    /* -------------------------------- */
    /* VOUCHER TYPE */
    /* -------------------------------- */

    if (name === "voucherType") {

      setSelectedVoucherType(
        value
      );

      return;
    }

    const updated = {

      ...formData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    };

    updated.preview =
      generatePreview(updated);

    requestAnimationFrame(() => {

      setFormData(updated);
    });
  };

  /* -------------------------------------------- */
  /* SAVE */
  /* -------------------------------------------- */

  const handleSave = async () => {

    try {

      setLoading(true);

      await api.post(

        "/billnumber/config",

        {
          voucherType:
            selectedVoucherType,

          prefix:
            formData.prefix,

          suffix:
            formData.suffix,

          separator:
            formData.separator,

          numberPadding:
            formData.numberPadding,

          includeFY:
            formData.includeFY,

          includeBranch:
            formData.includeBranch,

          resetEveryFY:
            formData.resetEveryFY,

          financialYear:
            formData.financialYear,

          branchCode:
            formData.branchCode,

          companyCode:
            formData.companyCode,
        }
      );

      toast.success(
        "Configuration Saved"
      );

      fetchConfig(
        selectedVoucherType
      );

    } catch (error) {

      toast.error(

        error.response?.data
          ?.message ||

        "Save failed"
      );

    } finally {

      setLoading(false);
    }
  };

  /* -------------------------------------------- */
  /* PREVIEW */
  /* -------------------------------------------- */

  const generatePreview = (
    data
  ) => {

    const parts = [];

    if (
      data.companyCode
    ) {

      parts.push(
        data.companyCode
      );
    }

    if (
      data.includeBranch &&
      data.branchCode
    ) {

      parts.push(
        data.branchCode
      );
    }

    if (
      data.prefix
    ) {

      parts.push(
        data.prefix
      );
    }

    if (
      data.includeFY &&
      data.financialYear
    ) {

      parts.push(
        data.financialYear
      );
    }

    const nextSequence =
      Number(
        data.currentSequence || 0
      ) + 1;

    const paddedNumber =
      String(nextSequence)
        .padStart(
          data.numberPadding,
          "0"
        );

    parts.push(
      paddedNumber
    );

    if (
      data.suffix
    ) {

      parts.push(
        data.suffix
      );
    }

    return parts.join(
      data.separator
    );
  };

  /* -------------------------------------------- */
  /* LOADING */
  /* -------------------------------------------- */

  if (loading) {

    return (

      <MainLayout title="Loading">

        <div className="h-screen flex items-center justify-center text-2xl font-bold">

          Loading...

        </div>

      </MainLayout>
    );
  }

  return (

    <MainLayout title="Bill Number Configuration">

      <div className="max-w-[1500px] mx-auto p-4 md:p-10 min-h-[90vh] flex items-center justify-center">

        <div className="grid grid-cols-12 w-full bg-white rounded-[4rem] overflow-hidden border border-slate-200 shadow-2xl">

          {/* LEFT */}

          <div className="col-span-12 lg:col-span-4 bg-slate-900 text-white p-12 flex flex-col justify-between">

            <div className="space-y-8">

              <div className="h-20 w-20 rounded-3xl bg-indigo-500 flex items-center justify-center">

                <Hash size={34} />

              </div>

              <div>

                <h1 className="text-5xl font-black italic leading-tight">

                  Bill Number
                  <br />
                  Engine

                </h1>

                <p className="mt-5 text-slate-400 leading-relaxed">

                  ERP invoice numbering system with continuous sequence generation.

                </p>
              </div>
            </div>

            <div className="space-y-4">

              {[
                "Continuous Sequence",
                "Financial Year Support",
                "Branch Wise Numbering",
                "Dynamic Prefix",
                "ERP Safe Generation",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-slate-300"
                >

                  <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                  />

                  {item}

                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}

          <div className="col-span-12 lg:col-span-8 bg-white p-8 md:p-14">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-12">

              <div>

                <h2 className="text-4xl font-black tracking-tight text-slate-800">

                  Configure Bill Number

                </h2>

                <p className="text-slate-500 mt-2 font-medium">

                  Configure ERP invoice numbering rules.

                </p>
              </div>

              <button
                onClick={
                  handleSave
                }
                className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3"
              >

                <Save size={18} />

                Save Configuration

              </button>
            </div>

            {/* FORM */}

            <div className="grid grid-cols-12 gap-6">

              {/* VOUCHER */}

              <FormField
                title="Voucher Type"
                icon={<FileText size={18} />}
              >

                <select
                  name="voucherType"
                  value={
                    selectedVoucherType
                  }
                  onChange={
                    handleChange
                  }
                  className={
                    inputClass
                  }
                >

                  <option>
                    Sales Invoice
                  </option>

                  <option>
                    Purchase Invoice
                  </option>

                  <option>
                    Debit Note
                  </option>

                  <option>
                    Credit Note
                  </option>

                  <option>
                    Quotation
                  </option>

                </select>

              </FormField>

              {/* PREFIX */}

              <FormField
                title="Prefix"
                icon={<Layers3 size={18} />}
              >

                <input
                  type="text"
                  name="prefix"
                  value={
                    formData.prefix
                  }
                  onChange={
                    handleChange
                  }
                  className={
                    inputClass
                  }
                />

              </FormField>

              {/* SUFFIX */}

              <FormField
                title="Suffix"
                icon={<Layers3 size={18} />}
              >

                <input
                  type="text"
                  name="suffix"
                  value={
                    formData.suffix
                  }
                  onChange={
                    handleChange
                  }
                  className={
                    inputClass
                  }
                />

              </FormField>

              {/* BRANCH */}

              <FormField
                title="Branch Code"
                icon={<Building2 size={18} />}
              >

                <input
                  type="text"
                  name="branchCode"
                  value={
                    formData.branchCode
                  }
                  onChange={
                    handleChange
                  }
                  className={
                    inputClass
                  }
                />

              </FormField>

              {/* FY */}

              <FormField
                title="Financial Year"
                icon={<CalendarRange size={18} />}
              >

                <input
                  type="text"
                  name="financialYear"
                  value={
                    formData.financialYear
                  }
                  onChange={
                    handleChange
                  }
                  className={
                    inputClass
                  }
                />

              </FormField>

              {/* CURRENT SEQUENCE */}

              <FormField
                title="Current Sequence"
                icon={<Hash size={18} />}
              >

                <input
                  type="text"
                  disabled
                  value={
                    formData.currentSequence || 0
                  }
                  className={`${inputClass} bg-slate-100 cursor-not-allowed`}
                />

              </FormField>

            </div>

            {/* PREVIEW */}

            <div className="mt-10 bg-indigo-50 border border-indigo-200 rounded-[2.5rem] p-10">

              <p className="text-xs uppercase tracking-[0.4em] text-indigo-500 font-black">

                Next Bill Preview

              </p>

              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 mt-4 break-all">

                {
                  formData.preview
                }

              </h2>

            </div>

          </div>
        </div>
      </div>

    </MainLayout>
  );
};

/* -------------------------------------------- */
/* FORM FIELD */
/* -------------------------------------------- */

const FormField = ({
  title,
  icon,
  children,
}) => (

  <div className="col-span-12 md:col-span-6">

    <label className="block mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 ml-2">

      {title}

    </label>

    <div className="relative">

      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">

        {icon}

      </div>

      {children}

    </div>
  </div>
);

const inputClass =
  "w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none rounded-[1.8rem] py-5 pl-14 pr-5 font-bold text-slate-700 transition-all";

export default DynamicBillingHeader;