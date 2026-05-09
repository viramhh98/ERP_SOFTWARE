import React, { forwardRef } from "react";

const LedgerPrintView = forwardRef(({ selectedParty, ledgerEntries, balanceData }, ref) => {
  if (!selectedParty) return null;

  // Date formatted for the statement
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div ref={ref} className="p-10 bg-white min-h-screen font-sans text-slate-900">
      {/* --- BUSINESS HEADER --- */}
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
            Account Statement
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-2 italic">
            Generated on: {today}
          </p>
        </div>
        
        <div className="text-right">
          <h2 className="text-2xl font-black text-slate-900">{selectedParty.name}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {selectedParty.phone || "No Contact Provided"}
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded">
            {selectedParty.type} Account
          </div>
        </div>
      </div>

      {/* --- FINANCIAL SUMMARY TILES --- */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Total Invoiced
          </p>
          <p className="text-2xl font-black text-slate-800">
            ₹{balanceData.totalInvoiced.toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Total Settled
          </p>
          <p className="text-2xl font-black text-slate-800">
            ₹{balanceData.totalSettled.toLocaleString()}
          </p>
        </div>

        <div className={`p-6 rounded-3xl border-2 ${
          balanceData.balance >= 0 
            ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
            : "bg-rose-50 border-rose-200 text-rose-900"
        }`}>
          <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">
            Net Balance
          </p>
          <p className="text-2xl font-black">
            ₹{Math.abs(balanceData.balance).toLocaleString()}
          </p>
          <p className="text-[9px] font-bold uppercase mt-1">
            {balanceData.balance >= 0 ? "Receivable" : "Payable / Advance"}
          </p>
        </div>
      </div>

      {/* --- TRANSACTIONS TABLE --- */}
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-left">
              <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
              <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Description</th>
              <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Debit (+)</th>
              <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Credit (-)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {ledgerEntries.length > 0 ? (
              ledgerEntries.map((entry, idx) => (
                <tr key={idx} className="page-break-inside-avoid">
                  <td className="py-5 text-sm font-bold text-slate-500">
                    {new Date(entry.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-5">
                    <p className="text-sm font-black text-slate-800">{entry.description}</p>
                    <p className="text-[9px] font-bold uppercase text-indigo-500 mt-0.5">
                      Ref: {entry.referenceType}
                    </p>
                  </td>
                  <td className="py-5 text-sm font-black text-right text-slate-700">
                    {entry.type === "DEBIT" ? `₹${entry.amount.toLocaleString()}` : "—"}
                  </td>
                  <td className="py-5 text-sm font-black text-right text-slate-700">
                    {entry.type === "CREDIT" ? `₹${entry.amount.toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-20 text-center text-slate-400 font-bold italic">
                  No transaction records found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PRINT FOOTER --- */}
      <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Statement Verification
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1 italic">
            This is a computer-generated document. No signature required.
          </p>
        </div>
        
        <div className="text-right">
          <div className="h-16 w-40 border-b border-slate-900 mb-2 ml-auto"></div>
          <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">
            Authorized Signatory
          </p>
        </div>
      </div>
      
      {/* Styles to handle clean printing */}
      <style jsx shadow>{`
        @media print {
          body { background: white !important; }
          .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
});

export default LedgerPrintView;