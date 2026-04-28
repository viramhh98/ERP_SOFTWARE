// const mongoose = require("mongoose");

// const Purchase = require("../models/purchase.model");
// const stockService = require("./stock.service");
// const stockTransactionService = require("./stockTransaction.service");
// const ledgerService = require("./ledger.service");

// const createPurchase = async (data) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const purchase = await Purchase.create([data], { session });

//     const purchaseDoc = purchase[0];

//     // 🔥 Loop items
//     for (const item of data.items) {

//       // 1️⃣ Increase Stock
//       await stockService.increaseStock({
//         itemId: item.itemId,
//         companyId: data.companyId,
//         branchId: data.branchId,
//         quantity: item.quantity,
//         session
//       });

//       // 2️⃣ Stock Transaction (AUDIT)
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

//     // 3️⃣ Ledger Entry (You owe supplier)
//     await ledgerService.createLedger({
//       partyId: data.partyId,
//       companyId: data.companyId,
//       branchId: data.branchId,
//       type: "CREDIT",
//       amount: data.totalAmount,
//       referenceType: "PURCHASE",
//       referenceId: purchaseDoc._id
//     }, session);

//     await session.commitTransaction();
//     session.endSession();

//     return purchaseDoc;

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// module.exports = {
//   createPurchase
// };








const mongoose = require("mongoose");
const Purchase = require("../models/purchase.model");
const stockService = require("./stock.service");
const stockTransactionService = require("./stockTransaction.service");
const ledgerService = require("./ledger.service");

const createPurchase = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Status Logic Determine Karein
    let status = "PENDING";
    const paidAmount = parseFloat(data.paidAmount) || 0;
    const totalAmount = parseFloat(data.totalAmount) || 0;

    if (paidAmount >= totalAmount) {
      status = "PAID";
    } else if (paidAmount > 0) {
      status = "PARTIAL";
    }

    // Purchase create karein with status
    const purchase = await Purchase.create([{ ...data, status }], { session });
    const purchaseDoc = purchase[0];

    // 2️⃣ Items Loop (Stock Update)
    for (const item of data.items) {
      await stockService.increaseStock({
        itemId: item.itemId,
        companyId: data.companyId,
        branchId: data.branchId,
        quantity: item.quantity,
        session
      });

      await stockTransactionService.createStockTransaction({
        itemId: item.itemId,
        companyId: data.companyId,
        branchId: data.branchId,
        type: "IN",
        quantity: item.quantity,
        referenceType: "PURCHASE",
        referenceId: purchaseDoc._id
      }, session);
    }

    // 3️⃣ Ledger Entry (Pehle Poora Bill - CREDIT)
    // Isse Supplier ke ledger mein dikhega ki itne ka maal liya
    await ledgerService.createLedger({
      partyId: data.partyId,
      companyId: data.companyId,
      branchId: data.branchId,
      type: "CREDIT",
      amount: totalAmount,
      referenceType: "PURCHASE",
      referenceId: purchaseDoc._id,
      description: `Purchase Bill: ${data.purchaseNumber}`
    }, session);

    // 4️⃣ Agar Payment ki hai toh Payment Entry (DEBIT)
    // Isse supplier ka balance kam ho jayega
    if (paidAmount > 0) {
      await ledgerService.createLedger({
        partyId: data.partyId,
        companyId: data.companyId,
        branchId: data.branchId,
        type: "DEBIT", // Debit matlab humne paisa de diya
        amount: paidAmount,
        referenceType: "PURCHASE",
        referenceId: purchaseDoc._id,
        description: `Payment for Bill: ${data.purchaseNumber} (${data.paymentMode})`
      }, session);
    }

    await session.commitTransaction();
    session.endSession();
    return purchaseDoc;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const getPurchases = async ({ companyId, branchId }) => {
  return await Purchase.find({ companyId, branchId }).populate("partyId").sort({ createdAt: -1 });
};

const getPurchaseById = async ({ companyId, branchId, purchaseId }) => {
  return await Purchase.findOne({ _id: purchaseId, companyId, branchId }).populate("partyId");
};


module.exports = { createPurchase, getPurchases, getPurchaseById };
