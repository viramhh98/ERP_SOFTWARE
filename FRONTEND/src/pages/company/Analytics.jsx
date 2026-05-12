import React, { useEffect, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";
import { useReactToPrint } from "react-to-print";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

import toast from "react-hot-toast";

import SalesReportPrint from "../../components/print/SalesReportPrint";

import {
  RefreshCcw,
  Search,
  TrendingUp,
  IndianRupee,
  Package,
  BarChart3,
  ShoppingCart,
  ChevronDown,
  Printer,
} from "lucide-react";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  size,
} from "@floating-ui/react";

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
    onOpenChange: setIsOpen,

    middleware: [
      offset(10),

      flip({ padding: 20 }),

      shift({ padding: 20 }),

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

      {/* DROPDOWN */}
      {isOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

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

const Analytics = () => {

  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState([]);

  const [items, setItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedItem, setSelectedItem] = useState("");

  // DEFAULT TODAY DATE
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);

  const [toDate, setToDate] = useState(today);

  /* FETCH ITEMS */
  const fetchItems = async () => {
    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem("activeCompanyId"),

          activebranchid: localStorage.getItem("activeBranchId"),
        },
      };

      const res = await api.get("/item", config);

      setItems(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load items");
    }
  };

  /* FETCH REPORT */
  const fetchReport = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem("activeCompanyId"),

          activebranchid: localStorage.getItem("activeBranchId"),
        },
      };

      const query = new URLSearchParams({
        fromDate: `${fromDate}T00:00:00.000Z`,

        toDate: `${toDate}T23:59:59.999Z`,
      });

      if (selectedItem) {
        query.append("itemId", selectedItem);
      }

      const res = await api.get(
        `/stock/sales-report?${query.toString()}`,
        config
      );

      setReport(res.data.data || []);

      toast.success("Sales report generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Sales Report",
  });

  /* INITIAL LOAD */
  useEffect(() => {
    fetchItems();
  }, []);

  // AUTO FETCH REPORT
  useEffect(() => {
    fetchReport();
  }, []);

  /* FILTER REPORT */
  const filteredReport = useMemo(() => {
    return report.filter((r) => {
      const search = searchTerm.toLowerCase();

      return r.itemName?.toLowerCase().includes(search);
    });
  }, [report, searchTerm]);

  /* SUMMARY */
  const totalSalesAmount = filteredReport.reduce(
    (acc, item) => acc + item.totalAmount,
    0
  );

  const totalQtySold = filteredReport.reduce(
    (acc, item) => acc + item.totalSold,
    0
  );

  const totalProducts = filteredReport.length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F6F8FC] pb-16">
        {/* HEADER */}
        <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-4 md:px-6 xl:px-8 h-[92px] flex items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />

                <span className="uppercase tracking-[0.35em] text-[10px] font-black text-indigo-600">
                  Analytics / Sales
                </span>
              </div>

              <h1 className="text-[30px] xl:text-[34px] leading-none font-black tracking-tight text-slate-900">
                Sales Analytics
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={fetchReport}
                className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all"
              >
                <RefreshCcw
                  size={17}
                  className={`text-slate-500 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              {/* PRINT BUTTON */}
              <button
                onClick={handlePrint}
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center gap-2 shadow-sm transition-all"
              >
                <Printer size={16} />
                Print Report
              </button>

              {/* GENERATE */}
              <button
                onClick={fetchReport}
                className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-2 shadow-sm transition-all"
              >
                <BarChart3 size={16} />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-[140px] px-4 md:px-6 xl:px-8 space-y-8">
          {/* FILTERS */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-3.5 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* FROM */}
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
              />

              {/* TO */}
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
              />

              {/* ITEM FILTER */}
              <SearchableSelect
                options={[
                  {
                    label: "All Items",
                    value: "",
                  },

                  ...items.map((item) => ({
                    label: item.name,

                    value: item._id,

                    sku: item.sku,

                    brand: item.brand,

                    category: item.category,

                    barcode: item.barcode,

                    price: item.sellingPrice,
                  })),
                ]}
                value={selectedItem}
                onChange={setSelectedItem}
                placeholder="Filter by Item"
                isItem={true}
                className="w-full"
              />

              {/* APPLY */}
              <button
                onClick={fetchReport}
                className="h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-sm transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SALES */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 p-8 opacity-10">
                <IndianRupee size={100} />
              </div>

              <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
                Total Sales
              </p>

              <h2 className="text-5xl font-black tracking-tighter">
                ₹{totalSalesAmount.toLocaleString()}
              </h2>
            </div>

            {/* QTY */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                  Quantity Sold
                </p>

                <h3 className="text-3xl font-black text-slate-800">
                  {totalQtySold}
                </h3>
              </div>

              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <ShoppingCart size={28} />
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                  Products Sold
                </p>

                <h3 className="text-3xl font-black text-slate-800">
                  {totalProducts}
                </h3>
              </div>

              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Package size={28} />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-500" />
                Sales Performance
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Item</th>

                    <th className="px-8 py-5 text-center">Qty Sold</th>

                    <th className="px-8 py-5 text-right">Cost Price</th>

                    <th className="px-8 py-5 text-right">Selling Price</th>

                    <th className="px-8 py-5 text-right">Total Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-20 text-center font-black text-slate-300"
                      >
                        Loading Analytics...
                      </td>
                    </tr>
                  ) : filteredReport.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-20 text-center font-bold text-slate-400"
                      >
                        No sales found
                      </td>
                    </tr>
                  ) : (
                    filteredReport.map((item) => (
                      <tr
                        key={item.itemId}
                        className="hover:bg-slate-50 transition-all"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-800 text-sm">
                              {item.itemName}
                            </span>

                            <span className="text-[10px] uppercase tracking-widest text-slate-400">
                              Sales Analytics
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-6 text-center font-black text-indigo-600">
                          {item.totalSold}
                        </td>

                        <td className="px-8 py-6 text-right font-bold text-slate-500">
                          ₹{item.costPrice?.toLocaleString()}
                        </td>

                        <td className="px-8 py-6 text-right font-black text-slate-800">
                          ₹{item.sellingPrice?.toLocaleString()}
                        </td>

                        <td className="px-8 py-6 text-right">
                          <span className="inline-flex px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-sm">
                            ₹{item.totalAmount?.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="fixed -left-[9999px] top-0">
          <SalesReportPrint
            ref={printRef}
            filteredReport={filteredReport}
            totalSalesAmount={totalSalesAmount}
            totalQtySold={totalQtySold}
            totalProducts={totalProducts}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
