const mongoose = require("mongoose");

const Sale = require("../models/sale.model");
const stockService = require("./stock.service");
const stockTransactionService = require("./stockTransaction.service");
const ledgerService = require("./ledger.service");

const createSale = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Normalize + calculate items
    const items = data.items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
      total: Number(item.quantity) * Number(item.price)
    }));

    // 2. Total calculation
    const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

    // ✅ FIX: NEVER override paidAmount based on paymentMode
    const paidAmount = Number(data.paidAmount || 0);

    // ✅ Validation (important)
    if (paidAmount > totalAmount) {
      throw new Error("Paid amount cannot exceed total amount");
    }

    // 3. Status logic
    let status = "PENDING";
    if (paidAmount >= totalAmount) status = "PAID";
    else if (paidAmount > 0) status = "PARTIAL";

  

    // 4. Create Sale
    const sale = await Sale.create([{
      ...data,
      items,
      totalAmount,
      paidAmount,
      status
    }], { session });

    const saleDoc = sale[0];

    // 5. STOCK OUT
    for (const item of items) {
      await stockService.decreaseStock({
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
        type: "OUT",
        quantity: item.quantity,
        referenceType: "SALE",
        referenceId: saleDoc._id
      }, session);
    }

    // 6. LEDGER: DEBIT (Full bill)
    await ledgerService.createLedger({
      partyId: data.partyId,
      companyId: data.companyId,
      branchId: data.branchId,
      type: "DEBIT",
      amount: totalAmount,
      referenceType: "SALE",
      referenceId: saleDoc._id,
      description: `Sales Bill: #${saleDoc._id.toString().slice(-6)}`
    }, session);

    // 7. LEDGER: CREDIT (Only what customer paid)
    if (paidAmount > 0) {
      await ledgerService.createLedger({
        partyId: data.partyId,
        companyId: data.companyId,
        branchId: data.branchId,
        type: "CREDIT",
        amount: paidAmount,
        referenceType: "PAYMENT",
        referenceId: saleDoc._id,
        description: `Payment received via ${data.paymentMode?.toUpperCase() || "UNKNOWN"}`
      }, session);
    }

    // 8. Commit
    await session.commitTransaction();
    session.endSession();

    return saleDoc;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ✅ GET SALES
const getAllSales = async (companyId, branchId) => {
  try {
    return await Sale.find({ companyId, branchId })
      .populate("partyId", "name phone")
      .populate("items.itemId", "name sku unit")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error fetching sales from database");
  }
};

module.exports = {
  createSale,
  getAllSales
};