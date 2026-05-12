import React, { forwardRef } from "react";

const SalesReportPrint = forwardRef(
  (
    {
      filteredReport = [],
      totalSalesAmount = 0,
      totalQtySold = 0,
      totalProducts = 0,
      fromDate,
      toDate,
    },
    ref
  ) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      
     <div
  ref={ref}
  className="bg-white text-[#0F172A] mx-auto"
  style={{
    width: "190mm",
    minHeight: "277mm",
    padding: "10mm",
    boxSizing: "border-box",
  }}
>
  <style>
  {`
    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {

      html,
      body {
        width: 210mm;
        height: 297mm;
        background: white !important;
        -webkit-print-color-adjust: exact;
      }

      body {
        margin: 0 !important;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      tr {
        page-break-inside: avoid;
      }

    }
  `}
</style>
        <div className="p-8">

          {/* HEADER */}
          <div className="flex justify-between items-start border-b-[4px] border-[#0F172A] pb-8 mb-10">

            {/* LEFT */}
            <div>

              <h1 className="text-[44px] leading-none font-black uppercase tracking-[-0.04em] text-[#0F172A]">
                SALES REPORT
              </h1>

              <p className="text-[15px] font-bold italic text-slate-500 mt-3">
                Generated on: {today}
              </p>

            </div>

            {/* RIGHT */}
            <div className="text-right">

              <div className="text-[34px] font-black leading-none text-[#0F172A]">
                SALES
              </div>

              <p className="text-sm font-bold text-slate-500 mt-2">
                {fromDate} → {toDate}
              </p>

              <div className="mt-3 inline-flex px-4 py-2 rounded-xl bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                Sales Analytics
              </div>

            </div>

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-6 mb-12">

            {/* TOTAL SALES */}
            <div className="p-7 bg-slate-50 rounded-[30px] border border-slate-200">

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
                Total Sales
              </p>

              <p className="text-[42px] leading-none font-black text-[#0F172A]">
                ₹{totalSalesAmount.toLocaleString()}
              </p>

            </div>

            {/* QTY */}
            <div className="p-7 bg-slate-50 rounded-[30px] border border-slate-200">

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
                Quantity Sold
              </p>

              <p className="text-[42px] leading-none font-black text-[#0F172A]">
                {totalQtySold}
              </p>

            </div>

            
          </div>

          {/* TABLE */}
          <div className="w-full">

            <table className="w-full border-collapse">

              {/* HEAD */}
              <thead>

                <tr className="border-b-[3px] border-[#0F172A] text-left">

                  <th className="py-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                    Item
                  </th>

                  <th className="py-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-center">
                    Qty
                  </th>

                  <th className="py-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-right">
                    Cost Price
                  </th>

                  <th className="py-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-right">
                    Selling
                  </th>

                  <th className="py-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-right">
                    Total
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-slate-200">

                {filteredReport.length > 0 ? (
                  filteredReport.map((item, idx) => (
                    <tr
                      key={idx}
                      className="page-break-inside-avoid"
                    >

                      {/* ITEM */}
                      <td className="py-5">

                        <div>

                          <p className="text-[15px] font-black text-[#0F172A]">
                            {item.itemName}
                          </p>

                        

                        </div>

                      </td>

                      {/* QTY */}
                      <td className="py-5 text-center">

                        <span className="inline-flex items-center justify-center h-10 min-w-[58px] rounded-2xl bg-slate-100 text-[#0F172A] font-black text-sm">
                          {item.totalSold}
                        </span>

                      </td>

                      {/* COST */}
                      <td className="py-5 text-right text-sm font-black text-slate-500">
                        ₹{item.costPrice?.toLocaleString()}
                      </td>

                      {/* SELLING */}
                      <td className="py-5 text-right text-sm font-black text-[#0F172A]">
                        ₹{item.sellingPrice?.toLocaleString()}
                      </td>

                      {/* TOTAL */}
                      <td className="py-5 text-right">

                      <div className="flex justify-end">

  <span
    className="
      inline-flex
      items-center
      justify-center
      h-10
      min-w-[92px]
      max-w-[120px]
      px-3
      rounded-2xl
      bg-[#0F172A]
      text-white
      text-sm
      font-black
      whitespace-nowrap
    "
  >
    ₹{item.totalAmount?.toLocaleString()}
  </span>

</div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td
                      colSpan="5"
                      className="py-24 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-20 h-20 rounded-full bg-slate-100 mb-4" />

                        <h3 className="text-2xl font-black text-slate-400">
                          No Sales Found
                        </h3>

                        <p className="mt-2 text-sm font-bold text-slate-300">
                          No records available for selected duration
                        </p>

                      </div>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end">

            {/* LEFT */}
            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Report Verification
              </p>

              <p className="text-xs font-bold italic text-slate-500 mt-2">
                This is a computer-generated report. No signature required.
              </p>

            </div>

            {/* RIGHT */}
            <div className="text-right">

              <div className="h-16 w-44 border-b border-[#0F172A] mb-2 ml-auto"></div>

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0F172A]">
                Authorized Signatory
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }
);

export default SalesReportPrint;