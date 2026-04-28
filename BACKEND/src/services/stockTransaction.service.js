// services/stockTransaction.service.js

const StockTransaction = require("../models/stockTransaction.model");

const createStockTransaction = async ({
  itemId,
  companyId,
  branchId,
  type,
  quantity,
  referenceType,
  referenceId
}, session) => {

  const transaction = await StockTransaction.create([{
    itemId,
    companyId,
    branchId,
    type,
    quantity,
    referenceType,
    referenceId
  }], { session });

  return transaction[0];
};

module.exports = {
  createStockTransaction
};