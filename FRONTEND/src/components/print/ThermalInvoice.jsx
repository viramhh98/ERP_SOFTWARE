import React from "react";

const ThermalInvoice = React.forwardRef(

  ({ sale }, ref) => {

    if (!sale) return null;

    return (

      <div
        ref={ref}
        className="bg-white text-black p-4"
        style={{
          width: "80mm",
          fontFamily: "monospace",
          fontSize: "12px",
        }}
      >

        {/* HEADER */}
        <div className="text-center border-b border-dashed border-black pb-3">

          <h1 className="text-lg font-black">
            ZETA ERP
          </h1>

          <p>
            SALES INVOICE
          </p>

        </div>

        {/* BILL INFO */}
        <div className="py-3 border-b border-dashed border-black space-y-1">

          <div className="flex justify-between">
            <span>Bill No</span>
            <span>{sale.salesNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>

            <span>
              {new Date(
                sale.createdAt
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Customer</span>

            <span>
              {sale.partyId?.name}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Phone</span>

            <span>
              {sale.partyId?.phone}
            </span>
          </div>

        </div>

        {/* ITEMS */}
        <div className="py-3 border-b border-dashed border-black">

          {sale.items.map(
            (item, index) => (

              <div
                key={index}
                className="mb-3"
              >

                <div className="font-bold uppercase">

                  {item.itemId?.name}

                </div>

                <div className="flex justify-between text-xs">

                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>

                  <span>
                    ₹{item.total}
                  </span>

                </div>

              </div>
            )
          )}

        </div>

        {/* TOTALS */}
        <div className="py-3 border-b border-dashed border-black space-y-1">

          <div className="flex justify-between font-bold">

            <span>Total</span>

            <span>
              ₹{sale.totalAmount}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Paid</span>

            <span>
              ₹{sale.paidAmount}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Due</span>

            <span>

              ₹
              {(
                sale.totalAmount -
                sale.paidAmount
              ).toLocaleString()}

            </span>

          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center pt-4">

          <p className="font-bold">
            THANK YOU!
          </p>

          <p className="text-[10px] mt-1">
            Visit Again
          </p>

        </div>

      </div>
    );
  }
);

export default ThermalInvoice;