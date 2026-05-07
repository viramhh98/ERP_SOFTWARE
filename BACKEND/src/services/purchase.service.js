// const mongoose = require("mongoose");
// const Purchase = require("../models/purchase.model");
// const Party = require("../models/party.model"); // 1️⃣ Import Party model
// const stockService = require("./stock.service");
// const stockTransactionService = require("./stockTransaction.service");
// const ledgerService = require("./ledger.service");

// const createPurchase = async (data) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // 1️⃣ Status Logic Determine Karein
//     let status = "PENDING";
//     const paidAmount = parseFloat(data.paidAmount) || 0;
//     const totalAmount = parseFloat(data.totalAmount) || 0;

//     if (paidAmount >= totalAmount) {
//       status = "PAID";
//     } else if (paidAmount > 0) {
//       status = "PARTIAL";
//     }

//     // Purchase create karein with status
//     const purchase = await Purchase.create([{ ...data, status }], { session });
//     const purchaseDoc = purchase[0];

//     // 2️⃣ Items Loop (Stock Update)
//     for (const item of data.items) {
//       await stockService.increaseStock({
//         itemId: item.itemId,
//         companyId: data.companyId,
//         branchId: data.branchId,
//         quantity: item.quantity,
//         session
//       });

//       await stockTransactionService.createStockTransaction({
//         itemId: item.itemId,
//         companyId: data.companyId,
//         branchId: data.branchId,
//         type: "IN",
//         quantity: item.quantity,
//         referenceType: "PURCHASE",
//         referenceId: purchaseDoc._id
//       }, session);
//     }

//     // 3️⃣ Ledger Entry (Pehle Poora Bill - CREDIT)
//     await ledgerService.createLedger({
//       partyId: data.partyId,
//       companyId: data.companyId,
//       branchId: data.branchId,
//       type: "CREDIT",
//       amount: totalAmount,
//       referenceType: "PURCHASE",
//       referenceId: purchaseDoc._id,
//       description: `Purchase Bill: ${data.purchaseNumber || 'Auto'}`
//     }, session);

//     // 4️⃣ Agar Payment ki hai toh Payment Entry (DEBIT)
//     if (paidAmount > 0) {
//       await ledgerService.createLedger({
//         partyId: data.partyId,
//         companyId: data.companyId,
//         branchId: data.branchId,
//         type: "DEBIT",
//         amount: paidAmount,
//         referenceType: "PURCHASE",
//         referenceId: purchaseDoc._id,
//         description: `Payment for Bill: ${data.purchaseNumber || 'Auto'} (${data.paymentMode})`
//       }, session);
//     }

//     // 5️⃣ 🚀 Update Party Balance in the SAME Transaction
//     // Balance Impact: Bill amount adds to what we owe (+), Payment reduces it (-)
//     const netBalanceImpact = totalAmount - paidAmount;

//     if (netBalanceImpact !== 0) {
//       await Party.findByIdAndUpdate(
//         data.partyId,
//         { $inc: { balance: netBalanceImpact } },
//         { session } // Transaction lock
//       );
//     }

//     await session.commitTransaction();
//     session.endSession();
//     return purchaseDoc;

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// const getPurchases = async ({ companyId, branchId }) => {
//   return await Purchase.find({ companyId, branchId }).populate("partyId").sort({ createdAt: -1 });
// };

// const getPurchaseById = async ({ companyId, branchId, purchaseId }) => {
//   return await Purchase.findOne({ _id: purchaseId, companyId, branchId }).populate("partyId");
// };

// module.exports = { createPurchase, getPurchases, getPurchaseById };

// services/purchase.service.js

const mongoose = require("mongoose");

const Purchase = require("../models/purchase.model");

const Party = require("../models/party.model");

const stockService = require("./stock.service");

const stockTransactionService = require("./stockTransaction.service");

const ledgerService = require("./ledger.service");

const { generateBillNumber } = require("./billNumber.service");

/* -------------------------------------------- */
/* CREATE PURCHASE */
/* -------------------------------------------- */

const createPurchase = async (data) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    /* -------------------------------------------- */
    /* GENERATE ERP PURCHASE NUMBER */
    /* -------------------------------------------- */

    const purchaseNumber = await generateBillNumber({
      activeCompanyId: data.companyId,

      activeBranchId: data.branchId,

      voucherType: "Purchase Invoice",
    });

    /* -------------------------------------------- */
    /* NORMALIZE ITEMS */
    /* -------------------------------------------- */

    const items = data.items.map((item) => ({
      ...item,

      quantity: Number(item.quantity),

      price: Number(item.price),

      total: Number(item.quantity) * Number(item.price),
    }));

    /* -------------------------------------------- */
    /* TOTAL */
    /* -------------------------------------------- */

    const totalAmount = items.reduce(
      (acc, item) => acc + item.total,

      0
    );

    const paidAmount = Number(data.paidAmount || 0);

    /* -------------------------------------------- */
    /* VALIDATION */
    /* -------------------------------------------- */

    if (paidAmount > totalAmount) {
      throw new Error("Paid amount cannot exceed total amount");
    }

    /* -------------------------------------------- */
    /* STATUS */
    /* -------------------------------------------- */

    let status = "PENDING";

    if (paidAmount >= totalAmount) {
      status = "PAID";
    } else if (paidAmount > 0) {
      status = "PARTIAL";
    }

    /* -------------------------------------------- */
    /* DUPLICATE SUPPLIER BILL CHECK */
    /* -------------------------------------------- */

    const existingBill = await Purchase.findOne({
      partyId: data.partyId,

      supplierBillNo: data.supplierBillNo,
    });

    if (existingBill) {
      throw new Error("Supplier bill already exists");
    }

    /* -------------------------------------------- */
    /* CREATE PURCHASE */
    /* -------------------------------------------- */

    const purchase = await Purchase.create(
      [
        {
          ...data,

          purchaseNumber,

          items,

          totalAmount,

          paidAmount,

          status,
        },
      ],
      { session }
    );

    const purchaseDoc = purchase[0];

    /* -------------------------------------------- */
    /* STOCK IN */
    /* -------------------------------------------- */

    for (const item of items) {
      await stockService.increaseStock({
        itemId: item.itemId,

        companyId: data.companyId,

        branchId: data.branchId,

        quantity: item.quantity,

        session,
      });

      await stockTransactionService.createStockTransaction(
        {
          itemId: item.itemId,

          companyId: data.companyId,

          branchId: data.branchId,

          type: "IN",

          quantity: item.quantity,

          referenceType: "PURCHASE",

          referenceId: purchaseDoc._id,
        },

        session
      );
    }

    /* -------------------------------------------- */
    /* LEDGER CREDIT */
    /* -------------------------------------------- */

    await ledgerService.createLedger(
      {
        partyId: data.partyId,

        companyId: data.companyId,

        branchId: data.branchId,

        type: "CREDIT",

        amount: totalAmount,

        referenceType: "PURCHASE",

        referenceId: purchaseDoc._id,

        description: `Purchase Invoice ${purchaseNumber} against Supplier Bill ${data.supplierBillNo}`,
      },

      session
    );

    /* -------------------------------------------- */
    /* PAYMENT ENTRY */
    /* -------------------------------------------- */

    if (paidAmount > 0) {
      await ledgerService.createLedger(
        {
          partyId: data.partyId,

          companyId: data.companyId,

          branchId: data.branchId,

          type: "DEBIT",

          amount: paidAmount,

          referenceType: "PURCHASE_PAYMENT",

          referenceId: purchaseDoc._id,

          description: `Payment against Purchase Invoice ${purchaseNumber} via ${data.paymentMode?.toUpperCase()}`,
        },

        session
      );
    }

    /* -------------------------------------------- */
    /* PARTY BALANCE */
    /* -------------------------------------------- */

    const netBalanceImpact = totalAmount - paidAmount;

    if (netBalanceImpact !== 0) {
      await Party.findByIdAndUpdate(
        data.partyId,

        {
          $inc: {
            balance: netBalanceImpact,
          },
        },

        { session }
      );
    }

    /* -------------------------------------------- */
    /* COMMIT */
    /* -------------------------------------------- */

    await session.commitTransaction();

    session.endSession();

    return purchaseDoc;
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    throw error;
  }
};

/* -------------------------------------------- */
/* GET PURCHASES */
/* -------------------------------------------- */

const getPurchases = async ({ companyId, branchId }) => {
  return await Purchase.find({
    companyId,

    branchId,
  })

    .populate("partyId", "name phone")

    .populate("items.itemId", "name sku")

    .sort({
      createdAt: -1,
    });
};

/* -------------------------------------------- */
/* GET PURCHASE BY ID */
/* -------------------------------------------- */

const getPurchaseById = async ({
  companyId,

  branchId,

  purchaseId,
}) => {
  return await Purchase.findOne({
    _id: purchaseId,

    companyId,

    branchId,
  })

    .populate("partyId", "name phone")

    .populate("items.itemId", "name sku");
};

module.exports = {
  createPurchase,

  getPurchases,

  getPurchaseById,
};
