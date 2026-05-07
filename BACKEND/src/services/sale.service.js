// // services/sale.service.js

// const mongoose = require("mongoose");

// const Sale = require("../models/sale.model");

// const Party = require("../models/party.model");

// const stockService = require("./stock.service");

// const stockTransactionService = require("./stockTransaction.service");

// const ledgerService = require("./ledger.service");

// const { generateBillNumber } = require("./billNumber.service");

// /* ------------------------------------------------ */
// /* CREATE SALE */
// /* ------------------------------------------------ */

// const createSale = async (data) => {
//   const session = await mongoose.startSession();

//   session.startTransaction();

//   try {
//     /* -------------------------------------------- */
//     /* GENERATE BILL NUMBER */
//     /* -------------------------------------------- */

//     const salesNumber = await generateBillNumber({
//       activeCompanyId: data.companyId,

//       activeBranchId: data.branchId,

//       voucherType: "Sales Invoice",
//     });

//     /* -------------------------------------------- */
//     /* NORMALIZE ITEMS */
//     /* -------------------------------------------- */

//     const items = data.items.map((item) => ({
//       ...item,

//       quantity: Number(item.quantity),

//       price: Number(item.price),

//       total: Number(item.quantity) * Number(item.price),
//     }));

//     /* -------------------------------------------- */
//     /* TOTAL */
//     /* -------------------------------------------- */

//     const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

//     const paidAmount = Number(data.paidAmount || 0);

//     /* -------------------------------------------- */
//     /* VALIDATION */
//     /* -------------------------------------------- */

//     if (paidAmount > totalAmount) {
//       throw new Error("Paid amount cannot exceed total amount");
//     }

//     /* -------------------------------------------- */
//     /* STATUS */
//     /* -------------------------------------------- */

//     let status = "PENDING";

//     if (paidAmount >= totalAmount) {
//       status = "PAID";
//     } else if (paidAmount > 0) {
//       status = "PARTIAL";
//     }

//     /* -------------------------------------------- */
//     /* CREATE SALE */
//     /* -------------------------------------------- */

//     const sale = await Sale.create(
//       [
//         {
//           ...data,

//           salesNumber,

//           items,

//           totalAmount,

//           paidAmount,

//           status,
//         },
//       ],
//       { session }
//     );

//     const saleDoc = sale[0];

//     /* -------------------------------------------- */
//     /* STOCK OUT */
//     /* -------------------------------------------- */

//     for (const item of items) {
//       await stockService.decreaseStock({
//         itemId: item.itemId,

//         companyId: data.companyId,

//         branchId: data.branchId,

//         quantity: item.quantity,

//         session,
//       });

//       await stockTransactionService.createStockTransaction(
//         {
//           itemId: item.itemId,

//           companyId: data.companyId,

//           branchId: data.branchId,

//           type: "OUT",

//           quantity: item.quantity,

//           referenceType: "SALE",

//           referenceId: saleDoc._id,
//         },

//         session
//       );
//     }

//     /* -------------------------------------------- */
//     /* LEDGER DEBIT */
//     /* -------------------------------------------- */

//     await ledgerService.createLedger(
//       {
//         partyId: data.partyId,

//         companyId: data.companyId,

//         branchId: data.branchId,

//         type: "DEBIT",

//         amount: totalAmount,

//         referenceType: "SALE",

//         referenceId: saleDoc._id,

//         description: `Invoice ${salesNumber} generated for customer sale`,
//       },

//       session
//     );

//     /* -------------------------------------------- */
//     /* PAYMENT CREDIT */
//     /* -------------------------------------------- */

//     if (paidAmount > 0) {
//       await ledgerService.createLedger(
//         {
//           partyId: data.partyId,

//           companyId: data.companyId,

//           branchId: data.branchId,

//           type: "CREDIT",

//           amount: paidAmount,

//           referenceType: "PAYMENT",

//           referenceId: saleDoc._id,

//           description: `Payment received against Invoice ${salesNumber} via ${data.paymentMode?.toUpperCase()}`
//         },

//         session
//       );
//     }

//     /* -------------------------------------------- */
//     /* PARTY BALANCE */
//     /* -------------------------------------------- */

//     const netBalanceImpact = totalAmount - paidAmount;

//     if (netBalanceImpact !== 0) {
//       await Party.findByIdAndUpdate(
//         data.partyId,

//         {
//           $inc: {
//             balance: netBalanceImpact,
//           },
//         },

//         { session }
//       );
//     }

//     /* -------------------------------------------- */
//     /* COMMIT */
//     /* -------------------------------------------- */

//     await session.commitTransaction();

//     session.endSession();

//     return saleDoc;
//   } catch (error) {
//     await session.abortTransaction();

//     session.endSession();

//     throw error;
//   }
// };

// /* ------------------------------------------------ */
// /* GET SALES */
// /* ------------------------------------------------ */

// const getAllSales = async (companyId, branchId) => {
//   try {
//     return await Sale.find({
//       companyId,
//       branchId,
//     })

//       .populate("partyId", "name phone")

//       .populate("items.itemId", "name sku unit")

//       .sort({
//         createdAt: -1,
//       });
//   } catch (error) {
//     throw new Error("Error fetching sales from database");
//   }
// };

// module.exports = {
//   createSale,
//   getAllSales,
// };





































// services/sale.service.js

const mongoose = require("mongoose");

const Sale = require("../models/sale.model");

const stockService = require("./stock.service");

const stockTransactionService = require("./stockTransaction.service");

const ledgerService = require("./ledger.service");

const {
  generateBillNumber,
} = require("./billNumber.service");

/* ------------------------------------------------ */
/* CREATE SALE */
/* ------------------------------------------------ */

const createSale = async (
  data
) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    /* -------------------------------------------- */
    /* GENERATE BILL NUMBER */
    /* -------------------------------------------- */

    const salesNumber =
      await generateBillNumber({

        activeCompanyId:
          data.companyId,

        activeBranchId:
          data.branchId,

        voucherType:
          "Sales Invoice",
      });

    /* -------------------------------------------- */
    /* NORMALIZE ITEMS */
    /* -------------------------------------------- */

    const items =
      data.items.map(
        (item) => ({

          ...item,

          quantity:
            Number(
              item.quantity
            ),

          price:
            Number(
              item.price
            ),

          total:
            Number(
              item.quantity
            ) *

            Number(
              item.price
            ),
        })
      );

    /* -------------------------------------------- */
    /* TOTAL */
    /* -------------------------------------------- */

    const totalAmount =
      items.reduce(

        (acc, item) =>

          acc + item.total,

        0
      );

    const paidAmount =
      Number(
        data.paidAmount || 0
      );

    /* -------------------------------------------- */
    /* VALIDATION */
    /* -------------------------------------------- */

    if (
      paidAmount >
      totalAmount
    ) {

      throw new Error(

        "Paid amount cannot exceed total amount"
      );
    }

    /* -------------------------------------------- */
    /* STATUS */
    /* -------------------------------------------- */

    let status =
      "PENDING";

    if (
      paidAmount >=
      totalAmount
    ) {

      status = "PAID";

    } else if (
      paidAmount > 0
    ) {

      status =
        "PARTIAL";
    }

    /* -------------------------------------------- */
    /* CREATE SALE */
    /* -------------------------------------------- */

    const sale =
      await Sale.create(

        [
          {
            ...data,

            salesNumber,

            items,

            totalAmount,

            paidAmount,

            status,
          },
        ],

        { session }
      );

    const saleDoc =
      sale[0];

    /* -------------------------------------------- */
    /* STOCK OUT */
    /* -------------------------------------------- */

    for (const item of items) {

      await stockService.decreaseStock({

        itemId:
          item.itemId,

        companyId:
          data.companyId,

        branchId:
          data.branchId,

        quantity:
          item.quantity,

        session,
      });

      await stockTransactionService.createStockTransaction(

        {
          itemId:
            item.itemId,

          companyId:
            data.companyId,

          branchId:
            data.branchId,

          type: "OUT",

          quantity:
            item.quantity,

          referenceType:
            "SALE",

          referenceId:
            saleDoc._id,
        },

        session
      );
    }

    /* -------------------------------------------- */
    /* SALES INVOICE ENTRY */
    /* -------------------------------------------- */

    await ledgerService.createLedgerEntry(

      {
        partyId:
          data.partyId,

        companyId:
          data.companyId,

        branchId:
          data.branchId,

        type: "DEBIT",

        amount:
          totalAmount,

        referenceType:
          "SALE",

        referenceId:
          saleDoc._id,

        description:
          `Invoice ${salesNumber} generated for customer sale`,
      },

      session
    );

    /* -------------------------------------------- */
    /* PAYMENT RECEIVED */
    /* -------------------------------------------- */

    if (
      paidAmount > 0
    ) {

      await ledgerService.createLedgerEntry(

        {
          partyId:
            data.partyId,

          companyId:
            data.companyId,

          branchId:
            data.branchId,

          type: "CREDIT",

          amount:
            paidAmount,

          referenceType:
            "RECEIPT",

          referenceId:
            saleDoc._id,

          description:
            `Payment received against Invoice ${salesNumber} via ${data.paymentMode?.toUpperCase()}`,
        },

        session
      );
    }

    /* -------------------------------------------- */
    /* COMMIT */
    /* -------------------------------------------- */

    await session.commitTransaction();

    session.endSession();

    return saleDoc;

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    throw error;
  }
};

/* ------------------------------------------------ */
/* GET SALES */
/* ------------------------------------------------ */

const getAllSales = async (
  companyId,
  branchId
) => {

  try {

    return await Sale.find({

      companyId,

      branchId,
    })

      .populate(
        "partyId",
        "name phone"
      )

      .populate(
        "items.itemId",
        "name sku unit"
      )

      .sort({
        createdAt: -1,
      });

  } catch (error) {

    throw new Error(

      "Error fetching sales from database"
    );
  }
};

const getSaleById = async (
  saleId,
  companyId,
  branchId
) => {
  try {

    return await Sale.findOne({
      _id: saleId,
      companyId,
      branchId,
    })
      .populate(
        "partyId",
        "name phone"
      )
      .populate(
        "items.itemId",
        "name sku unit"
      );
  }


  catch (error) {

    throw new Error(
      "Error fetching sale from database"
    );
  }
}


module.exports = {

  createSale,
  getSaleById,
  getAllSales,
};