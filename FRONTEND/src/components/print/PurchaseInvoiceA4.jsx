import React from "react";

const PurchaseInvoiceA4 = React.forwardRef(
  ({ purchase }, ref) => {

    if (!purchase) return null;

    const balance =
      Number(purchase.totalAmount || 0) -
      Number(purchase.paidAmount || 0);

    return (

      <div
        ref={ref}
        className="bg-white text-black"
        style={{
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          padding: "18mm",
          fontFamily: "Arial",
          fontSize: "10px",
        }}
      >

        {/* TOP */}

        <div className="flex justify-between items-start mb-8">

          {/* COMPANY */}

          <div>

            <h1 className="text-2xl font-black tracking-wide">
              ZETA ERP
            </h1>

            <div className="mt-2 text-[10px] leading-5">

              <p>
                Smart Inventory &
                Billing Platform
              </p>

              <p>
                221B Business Street,
                Mumbai
              </p>

              <p>
                support@zetaerp.com
              </p>

              <p>
                +91 9876543210
              </p>

            </div>

          </div>

          {/* TITLE */}

          <div className="text-right">

            <h2 className="text-3xl font-black uppercase tracking-wide text-slate-700">

              Purchase Order

            </h2>

          </div>

        </div>

        {/* PARTY DETAILS */}

        <div className="grid grid-cols-2 gap-8 mb-8">

          {/* LEFT */}

          <div>

            <h3 className="font-black uppercase mb-2 text-xs">

              Supplier

            </h3>

            <div className="leading-6 text-[11px]">

              <p className="font-bold text-base">

                {purchase.partyId?.name}

              </p>

              <p>
                Phone:
                {" "}
                {purchase.partyId?.phone}
              </p>

              <p>
                Payment:
                {" "}
                {purchase.paymentMode?.toUpperCase()}
              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <table className="w-full border border-black border-collapse">

              <tbody>

                <tr>

                  <td className="border border-black px-3 py-2 font-bold bg-slate-100 w-1/2">

                    Purchase No

                  </td>

                  <td className="border border-black px-3 py-2">

                    {purchase.purchaseNumber}

                  </td>

                </tr>

                <tr>

                  <td className="border border-black px-3 py-2 font-bold bg-slate-100">

                    Supplier Bill

                  </td>

                  <td className="border border-black px-3 py-2">

                    {purchase.supplierBillNo}

                  </td>

                </tr>

                <tr>

                  <td className="border border-black px-3 py-2 font-bold bg-slate-100">

                    Invoice Date

                  </td>

                  <td className="border border-black px-3 py-2">

                    {new Date(
                      purchase.createdAt
                    ).toLocaleDateString()}

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* ITEMS */}

        <table className="w-full border border-black border-collapse mb-8">

          <thead>

            <tr>

              <th className="border border-black px-3 py-2 text-center bg-slate-100 w-16">

                Sr

              </th>

              <th className="border border-black px-3 py-2 text-left bg-slate-100">

                Description

              </th>

              <th className="border border-black px-3 py-2 text-center bg-slate-100 w-24">

                Qty

              </th>

              <th className="border border-black px-3 py-2 text-center bg-slate-100 w-32">

                Unit Price

              </th>

              <th className="border border-black px-3 py-2 text-center bg-slate-100 w-32">

                Total

              </th>

            </tr>

          </thead>

          <tbody>

            {purchase.items.map(
              (item, index) => (

                <tr key={index}>

                  <td className="border border-black px-3 py-2 text-center align-top">

                    {index + 1}

                  </td>

                  <td className="border border-black px-3 py-2 align-top">

                    <div className="font-bold">

                      {item.itemId?.name}

                    </div>

                    <div className="text-[9px] mt-1 text-slate-600">

                      SKU:
                      {" "}
                      {item.itemId?.sku}

                    </div>

                  </td>

                  <td className="border border-black px-3 py-2 text-center align-top">

                    {item.quantity}

                  </td>

                  <td className="border border-black px-3 py-2 text-center align-top">

                    ₹{item.price}

                  </td>

                  <td className="border border-black px-3 py-2 text-center align-top font-bold">

                    ₹{item.total}

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

        {/* TOTALS */}

        <div className="flex justify-end mb-12">

          <table className="w-80 border border-black border-collapse">

            <tbody>

              <tr>

                <td className="border border-black px-4 py-2 font-bold bg-slate-100">

                  Total

                </td>

                <td className="border border-black px-4 py-2 text-right font-bold">

                  ₹
                  {Number(
                    purchase.totalAmount
                  ).toLocaleString()}

                </td>

              </tr>

              <tr>

                <td className="border border-black px-4 py-2 font-bold bg-slate-100">

                  Paid

                </td>

                <td className="border border-black px-4 py-2 text-right font-bold">

                  ₹
                  {Number(
                    purchase.paidAmount
                  ).toLocaleString()}

                </td>

              </tr>

              <tr>

                <td className="border border-black px-4 py-2 font-bold bg-slate-100">

                  Balance

                </td>

                <td className="border border-black px-4 py-2 text-right font-black text-base">

                  ₹
                  {Number(
                    balance
                  ).toLocaleString()}

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="flex justify-between items-end mt-20">

          {/* NOTES */}

          <div className="max-w-md">

            <p className="font-bold uppercase mb-2">

              Notes

            </p>

            <p className="text-[10px] leading-5">

              Goods once sold will
              not be taken back.
              This is a system
              generated purchase
              invoice.

            </p>

          </div>

          {/* SIGN */}

          <div className="text-center w-52">

            <div className="border-b border-black mb-2 h-12"></div>

            <p className="font-bold uppercase text-[10px]">

              Authorized Signature

            </p>

          </div>

        </div>

      </div>
    );
  }
);

export default PurchaseInvoiceA4;