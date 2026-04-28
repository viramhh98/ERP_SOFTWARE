const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

  type: {
    type: String,
    enum: ["IN", "OUT"],
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  referenceType: {
    type: String,
    enum: [
      "SALE",
      "PURCHASE",
      "RETURN_IN",
      "RETURN_OUT",
      "ADJUSTMENT",
      "TRANSFER",
      "OPENING"
    ],
    required: true
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

}, { timestamps: true });

stockTransactionSchema.index({ itemId: 1, companyId: 1 });

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);
