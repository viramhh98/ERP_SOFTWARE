import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

import {
  Search,
  Eye,
  X,
  Phone,
  Package,
  IndianRupee,
  Loader2,
  ChevronRight,
  FileText,
  Clock,
  CalendarDays,
  Receipt,
  Wallet,
} from "lucide-react";

const PurchaseHistory = () => {

  const [purchases, setPurchases] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  /* MODAL */

  const [selectedBill, setSelectedBill] =
    useState(null);

  const [modalLoading, setModalLoading] =
    useState(false);

  const [billItems, setBillItems] =
    useState([]);

  /* -------------------------------------------- */
  /* FETCH PURCHASES */
  /* -------------------------------------------- */

  const fetchPurchases = async () => {

    setLoading(true);

    try {

      const config = {

        headers: {

          activecompanyid:
            localStorage.getItem(
              "activeCompanyId"
            ),

          activebranchid:
            localStorage.getItem(
              "activeBranchId"
            ),
        },
      };

      const res =
        await api.get(
          "/purchase",
          config
        );

      setPurchases(
        res.data.data || []
      );

    } catch (err) {

      toast.error(
        "Cloud sync failed"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchPurchases();

  }, []);

  /* -------------------------------------------- */
  /* VIEW BILL */
  /* -------------------------------------------- */

const handleViewBill = async (
  bill
) => {

  setSelectedBill(bill);

  setModalLoading(true);

  setBillItems([]);

  try {

    /* -------------------------------- */
    /* HANDLE POPULATED ITEMS */
    /* -------------------------------- */

    const detailedItems =
      await Promise.all(

        bill.items.map(
          async (item) => {

            /* ALREADY POPULATED */

            if (
              typeof item.itemId ===
                "object" &&

              item.itemId?.name
            ) {

              return {

                ...item,

                details:
                  item.itemId,
              };
            }

            /* FETCH MANUALLY */

            const itemId =

              typeof item.itemId ===
              "object"

                ? item.itemId._id

                : item.itemId;

            const res =
              await api.get(
                `/item/${itemId}`
              );

            return {

              ...item,

              details:
                res.data.data,
            };
          }
        )
      );

    setBillItems(
      detailedItems
    );

  } catch (err) {

    console.log(err);

    toast.error(
      "Item details fetch error"
    );

  } finally {

    setModalLoading(false);
  }
};

  /* -------------------------------------------- */
  /* FILTER */
  /* -------------------------------------------- */

  const filteredData =
    purchases.filter((p) =>

      p.purchaseNumber
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      p.supplierBillNo
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      p.partyId?.name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  return (

    <MainLayout>

      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-inter text-slate-700">

        {/* HEADER */}

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">

          <div>

            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">

              Procurement

              <ChevronRight size={12} />

              History

            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight">

              Purchase Archive

            </h1>

          </div>

          {/* SEARCH */}

          <div className="relative group w-full md:w-96">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search Purchase / Supplier Bill / Vendor"
              className="w-full h-14 pl-12 pr-6 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-600"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full border-separate border-spacing-0">

                <thead>

                  <tr className="bg-slate-50/50">

                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">

                      ERP Purchase

                    </th>

                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">

                      Supplier Bill

                    </th>

                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">

                      Supplier

                    </th>

                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">

                      Status

                    </th>

                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">

                      Amount

                    </th>

                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">

                      Action

                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="p-24 text-center font-black text-slate-300 animate-pulse tracking-widest"
                      >

                        SYNCING CLOUD PURCHASES...

                      </td>

                    </tr>

                  ) : filteredData.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="p-24 text-center font-black text-slate-300 tracking-widest"
                      >

                        NO PURCHASE RECORDS

                      </td>

                    </tr>

                  ) : (

                    filteredData.map((p) => (

                      <tr
                        key={p._id}
                        className="group hover:bg-slate-50/50 transition-all"
                      >

                        {/* ERP NUMBER */}

                        <td className="px-8 py-6">

                          <div className="flex flex-col">

                            <span className="text-sm font-black text-slate-800 mb-1">

                              {
                                p.purchaseNumber
                              }

                            </span>

                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">

                              <Clock size={10} />

                              {
                                new Date(
                                  p.purchaseDate
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              }

                            </span>

                          </div>

                        </td>

                        {/* SUPPLIER BILL */}

                        <td className="px-8 py-6">

                          <div className="flex flex-col">

                            <span className="text-sm font-black text-indigo-600">

                              {
                                p.supplierBillNo
                              }

                            </span>

                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">

                              <CalendarDays size={10} />

                              {
                                new Date(
                                  p.supplierBillDate
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              }

                            </span>

                          </div>

                        </td>

                        {/* SUPPLIER */}

                        <td className="px-8 py-6">

                          <div className="flex flex-col">

                            <span className="text-sm font-bold text-slate-700">

                              {
                                p.partyId?.name
                              }

                            </span>

                            <span className="text-[10px] text-indigo-500 font-bold tracking-tight">

                              {
                                p.paymentMode?.toUpperCase()
                              }

                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-8 py-6 text-center">

                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-tighter ring-1 ring-inset ${
                              p.status === "PAID"

                                ? "bg-emerald-50 text-emerald-600 ring-emerald-100"

                                : p.status === "PARTIAL"

                                ? "bg-amber-50 text-amber-600 ring-amber-100"

                                : "bg-rose-50 text-rose-600 ring-rose-100"
                            }`}
                          >

                            {
                              p.status
                            }

                          </span>

                        </td>

                        {/* AMOUNT */}

                        <td className="px-8 py-6 text-right">

                          <span className="text-base font-black text-slate-900">

                            ₹
                            {
                              Number(
                                p.totalAmount
                              ).toLocaleString()
                            }

                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-8 py-6 text-center">

                          <button
                            onClick={() =>
                              handleViewBill(
                                p
                              )
                            }
                            className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"
                          >

                            <Eye size={18} />

                          </button>

                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* MODAL */}

        {selectedBill && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-slate-900/40 backdrop-blur-[6px]">

            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 relative">

              {/* HEADER */}

              <div className="p-10 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">

                <div className="flex items-center gap-4">

                  <div className="bg-indigo-600 p-3 rounded-2xl text-white">

                    <Receipt size={24} />

                  </div>

                  <div>

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">

                      Purchase Invoice

                    </h2>

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">

                      {
                        selectedBill.purchaseNumber
                      }

                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    setSelectedBill(
                      null
                    )
                  }
                  className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                >

                  <X size={20} />

                </button>

              </div>

              {/* BODY */}

              <div className="p-10 max-h-[60vh] overflow-y-auto">

                {/* INFO */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">

                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">

                      ERP Purchase No

                    </p>

                    <h3 className="font-black text-slate-800 text-lg">

                      {
                        selectedBill.purchaseNumber
                      }

                    </h3>

                  </div>

                  <div className="bg-indigo-50 rounded-3xl p-5 border border-indigo-100">

                    <p className="text-[10px] uppercase tracking-widest font-black text-indigo-400 mb-2">

                      Supplier Bill No

                    </p>

                    <h3 className="font-black text-indigo-700 text-lg">

                      {
                        selectedBill.supplierBillNo
                      }

                    </h3>

                  </div>

                </div>

                {/* ITEMS */}

                {modalLoading ? (

                  <div className="flex flex-col items-center justify-center py-20 gap-4">

                    <Loader2
                      className="animate-spin text-indigo-600"
                      size={48}
                      strokeWidth={3}
                    />

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">

                      Reconstructing SKU Data...

                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {billItems.map(
                      (item, idx) => (

                        <div
                          key={idx}
                          className="group flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl"
                        >

                          <div className="flex items-center gap-5">

                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600">

                              {idx + 1}

                            </div>

                            <div className="flex flex-col">

                              <span className="text-base font-black text-slate-800">

                                {
                                  item.details
                                    ?.name
                                }

                              </span>

                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">

                                {
                                  item.details
                                    ?.sku
                                }

                              </span>

                            </div>

                          </div>

                          <div className="flex items-center gap-12">

                            <div className="text-center">

                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">

                                Qty

                              </p>

                              <p className="font-black text-slate-700">

                                {
                                  item.quantity
                                }

                              </p>

                            </div>

                            <div className="text-right min-w-[100px]">

                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">

                                Subtotal

                              </p>

                              <p className="font-black text-slate-900">

                                ₹
                                {
                                  Number(
                                    item.total
                                  ).toLocaleString()
                                }

                              </p>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                )}

              </div>

              {/* FOOTER */}

              <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center">

                    <Package
                      size={24}
                      className="text-slate-600"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">

                      Supplier

                    </p>

                    <h4 className="text-xl font-bold">

                      {
                        selectedBill.partyId
                          ?.name
                      }

                    </h4>

                  </div>

                </div>

                <div className="text-center md:text-right">

                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">

                    Net Payable Amount

                  </p>

                  <h2 className="text-5xl font-black tracking-tighter flex items-center gap-2">

                    <span className="text-2xl font-light text-slate-500">

                      ₹

                    </span>

                    {
                      Number(
                        selectedBill.totalAmount
                      ).toLocaleString()
                    }

                  </h2>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </MainLayout>
  );
};

export default PurchaseHistory;